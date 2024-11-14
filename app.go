package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"time"

	"github.com/wailsapp/wails/v2/pkg/runtime"
	"github.com/watzon/postpilot/internal/notify"
	"github.com/watzon/postpilot/internal/smtp"
	"github.com/watzon/postpilot/internal/spam"
)

type Email struct {
	ID        string    `json:"id"`
	From      string    `json:"from"`
	To        []string  `json:"to"`
	Subject   string    `json:"subject"`
	Body      string    `json:"body"`
	HTML      string    `json:"html"`
	Timestamp time.Time `json:"timestamp"`
}

type UISettings struct {
	Theme        string `json:"theme"`
	ShowPreview  bool   `json:"showPreview"`
	TimeFormat   string `json:"timeFormat" enum:"12,24"`
	Notification bool   `json:"notification"`
	Persistence  bool   `json:"persistence"`
}

type SMTPSettings struct {
	Host     string `json:"host"`
	Port     int    `json:"port"`
	Auth     string `json:"auth"`
	Username string `json:"username"`
	Password string `json:"password"`
	TLS      string `json:"tls"`
}

type SpamAssassinSettings struct {
	Enabled  bool   `json:"enabled"`
	Binary   string `json:"binary"`
	Host     string `json:"host"`
	Port     int    `json:"port"`
	UseLocal bool   `json:"useLocal"`
}

type Settings struct {
	UI           UISettings           `json:"ui"`
	SMTP         SMTPSettings         `json:"smtp"`
	SpamAssassin SpamAssassinSettings `json:"spamAssassin"`
}

type App struct {
	ctx         context.Context
	smtp        *smtp.Server
	emails      []*Email
	mu          sync.RWMutex
	spamChecker *spam.SpamChecker
	spamCache   map[string]*spam.SpamReport
	spamMu      sync.RWMutex
}

func NewApp() *App {
	return &App{
		emails:    make([]*Email, 0),
		spamCache: make(map[string]*spam.SpamReport),
	}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	// Load settings first
	settings, err := a.GetSettings()
	if err != nil {
		log.Printf("Failed to load settings: %v", err)
	}

	// Initialize spam checker if enabled
	if settings.SpamAssassin.Enabled {
		a.spamChecker = spam.NewSpamChecker(
			settings.SpamAssassin.Binary,
			settings.SpamAssassin.UseLocal,
			settings.SpamAssassin.Host,
			settings.SpamAssassin.Port,
		)
	}

	// Load emails from disk if persistence is enabled
	if settings.UI.Persistence {
		if err := a.loadEmails(); err != nil {
			log.Printf("Failed to load emails: %v", err)
		}
	} else {
		// Clear any existing emails if persistence is disabled
		a.emails = make([]*Email, 0)
		_ = os.Remove(a.getEmailsPath())
	}

	// Start SMTP server
	if err := a.startSMTPServer(); err != nil {
		log.Printf("Failed to start SMTP server: %v", err)
		return
	}

	// Start handling incoming emails
	go a.handleIncomingEmails()
}

func (a *App) shutdown(ctx context.Context) {
	if a.smtp != nil {
		if err := a.smtp.Stop(); err != nil {
			log.Printf("Error stopping SMTP server: %v", err)
		}
	}
}

func (a *App) startSMTPServer() error {
	settings, err := a.GetSettings()
	if err != nil {
		return fmt.Errorf("failed to get settings: %w", err)
	}

	// Create SMTP server
	s := smtp.NewServer(
		settings.SMTP.Host,
		settings.SMTP.Port,
		settings.SMTP.Auth,
		settings.SMTP.Username,
		settings.SMTP.Password,
		settings.SMTP.TLS,
	)

	// Start server
	if err := s.Start(); err != nil {
		return fmt.Errorf("failed to start SMTP server: %w", err)
	}

	a.smtp = s

	// Start goroutine to handle incoming emails
	go a.handleIncomingEmails()

	return nil
}

func (a *App) handleIncomingEmails() {
	emailChan := a.smtp.EmailsChan()

	for email := range emailChan {
		// Convert SMTP email to our Email type
		newEmail := &Email{
			ID:        email.ID,
			From:      email.From,
			To:        email.To,
			Subject:   email.Subject,
			Body:      email.Body,
			HTML:      email.HTML,
			Timestamp: email.Timestamp,
		}

		// Store email
		a.mu.Lock()
		a.emails = append(a.emails, newEmail)
		a.mu.Unlock()

		// Get current settings
		settings, err := a.GetSettings()
		if err != nil {
			log.Printf("Failed to get settings: %v", err)
			return
		}

		// Send notification
		if settings.UI.Notification {
			go func(e *Email) {
				notify.SendNotification(
					"New Email",
					fmt.Sprintf("From: %s\nSubject: %s", e.From, e.Subject),
				)
			}(newEmail)
		}

		// Save emails to disk
		if err := a.saveEmails(); err != nil {
			log.Printf("Failed to save emails: %v", err)
		}

		// Emit event to frontend
		runtime.EventsEmit(a.ctx, "new:email", email)
	}
}

// GetEmails returns all stored emails
func (a *App) GetEmails() []*Email {
	a.mu.RLock()
	defer a.mu.RUnlock()
	return a.emails
}

// RestartSMTPServer restarts the SMTP server with new settings
func (a *App) RestartSMTPServer() error {
	if a.smtp != nil {
		if err := a.smtp.Stop(); err != nil {
			return fmt.Errorf("failed to stop SMTP server: %w", err)
		}
	}

	return a.startSMTPServer()
}

func (a *App) GetSettings() (Settings, error) {
	configPath := a.getConfigPath()

	// Default settings
	settings := Settings{
		UI: UISettings{
			Theme:        "system",
			ShowPreview:  true,
			TimeFormat:   "12",
			Notification: true,
			Persistence:  true,
		},
		SMTP: SMTPSettings{
			Host: "localhost",
			Port: 1025,
			Auth: "none",
			TLS:  "none",
		},
		SpamAssassin: SpamAssassinSettings{
			Enabled:  false,
			Binary:   spam.GetDefaultBinaryPath(),
			Host:     "localhost",
			Port:     783,
			UseLocal: true,
		},
	}

	// Check if config file exists
	if _, err := os.Stat(configPath); os.IsNotExist(err) {
		// Create default config file
		return settings, a.SaveSettings(settings)
	}

	// Read config file
	data, err := os.ReadFile(configPath)
	if err != nil {
		return settings, err
	}

	// Parse JSON
	err = json.Unmarshal(data, &settings)
	return settings, err
}

func (a *App) SaveSettings(settings Settings) error {
	// Create config directory if it doesn't exist
	configPath := a.getConfigPath()
	if err := os.MkdirAll(filepath.Dir(configPath), 0755); err != nil {
		return fmt.Errorf("failed to create config directory: %w", err)
	}

	// Update SpamAssassin checker if settings changed
	if settings.SpamAssassin.Enabled {
		// Check if SpamAssassin is available
		if !spam.IsAvailable(settings.SpamAssassin.Binary) {
			return fmt.Errorf("SpamAssassin binary not found at: %s", settings.SpamAssassin.Binary)
		}
		// Initialize or update spam checker
		a.spamChecker = spam.NewSpamChecker(
			settings.SpamAssassin.Binary,
			settings.SpamAssassin.UseLocal,
			settings.SpamAssassin.Host,
			settings.SpamAssassin.Port,
		)
	} else {
		a.spamChecker = nil
	}

	// Save settings to file
	data, err := json.MarshalIndent(settings, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal settings: %w", err)
	}

	if err := os.WriteFile(configPath, data, 0644); err != nil {
		return fmt.Errorf("failed to write settings file: %w", err)
	}

	// Update theme
	if settings.UI.Theme == "dark" {
		runtime.WindowSetDarkTheme(a.ctx)
	} else if settings.UI.Theme == "light" {
		runtime.WindowSetLightTheme(a.ctx)
	}

	// If SMTP settings changed, restart the server
	if a.smtp != nil {
		if err := a.RestartSMTPServer(); err != nil {
			return fmt.Errorf("failed to restart SMTP server: %w", err)
		}
	}

	return nil
}

func (a *App) getConfigPath() string {
	// Get user config directory
	configDir, err := os.UserConfigDir()
	if err != nil {
		configDir = "."
	}

	return filepath.Join(configDir, "postpilot", "settings.json")
}

func (a *App) getEmailsPath() string {
	configDir, err := os.UserConfigDir()
	if err != nil {
		configDir = "."
	}
	return filepath.Join(configDir, "postpilot", "emails.json")
}

func (a *App) saveEmails() error {
	settings, err := a.GetSettings()
	if err != nil {
		return err
	}

	if !settings.UI.Persistence {
		return nil
	}

	emailsPath := a.getEmailsPath()
	configDir := filepath.Dir(emailsPath)
	if err := os.MkdirAll(configDir, 0755); err != nil {
		return err
	}

	a.mu.RLock()
	data, err := json.MarshalIndent(a.emails, "", "  ")
	a.mu.RUnlock()
	if err != nil {
		return err
	}

	return os.WriteFile(emailsPath, data, 0644)
}

func (a *App) loadEmails() error {
	settings, err := a.GetSettings()
	if err != nil {
		return err
	}

	if !settings.UI.Persistence {
		// Clear any existing emails file
		emailsPath := a.getEmailsPath()
		_ = os.Remove(emailsPath)
		return nil
	}

	emailsPath := a.getEmailsPath()
	if _, err := os.Stat(emailsPath); os.IsNotExist(err) {
		return nil
	}

	data, err := os.ReadFile(emailsPath)
	if err != nil {
		return err
	}

	var emails []*Email
	if err := json.Unmarshal(data, &emails); err != nil {
		return err
	}

	a.mu.Lock()
	a.emails = emails
	a.mu.Unlock()

	return nil
}

// ClearEmails clears all stored emails
func (a *App) ClearEmails() error {
	a.mu.Lock()
	a.emails = make([]*Email, 0)
	a.mu.Unlock()

	a.spamMu.Lock()
	a.spamCache = make(map[string]*spam.SpamReport)
	a.spamMu.Unlock()

	// If persistence is enabled, remove the emails file
	settings, err := a.GetSettings()
	if err != nil {
		return fmt.Errorf("failed to get settings: %w", err)
	}

	if settings.UI.Persistence {
		emailsPath := a.getEmailsPath()
		if err := os.Remove(emailsPath); err != nil && !os.IsNotExist(err) {
			return fmt.Errorf("failed to remove emails file: %w", err)
		}
	}

	return nil
}

func (a *App) GetVersion() string {
	return version
}

// CheckSpam runs a spam check on the specified email
func (a *App) CheckSpam(emailID string) (*spam.SpamReport, error) {
	if a.spamChecker == nil {
		return nil, fmt.Errorf("spam checking is not enabled")
	}

	// Check cache first
	a.spamMu.RLock()
	if report, ok := a.spamCache[emailID]; ok {
		a.spamMu.RUnlock()
		return report, nil
	}
	a.spamMu.RUnlock()

	a.mu.RLock()
	var email *Email
	for _, e := range a.emails {
		if e.ID == emailID {
			email = e
			break
		}
	}
	a.mu.RUnlock()

	if email == nil {
		return nil, fmt.Errorf("email not found")
	}

	// Construct raw email content
	var rawEmail bytes.Buffer
	fmt.Fprintf(&rawEmail, "From: %s\r\n", email.From)
	fmt.Fprintf(&rawEmail, "To: %s\r\n", strings.Join(email.To, ", "))
	fmt.Fprintf(&rawEmail, "Subject: %s\r\n", email.Subject)
	fmt.Fprintf(&rawEmail, "Content-Type: text/html\r\n\r\n")
	fmt.Fprintf(&rawEmail, "%s", email.HTML)

	report, err := a.spamChecker.CheckEmail(rawEmail.Bytes())
	if err != nil {
		return nil, err
	}

	// Cache the result
	a.spamMu.Lock()
	a.spamCache[emailID] = report
	a.spamMu.Unlock()

	return report, nil
}
