package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"sync"
	"time"

	"github.com/wailsapp/wails/v2/pkg/runtime"
	"github.com/watzon/postpilot/internal/smtp"
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
	Theme       string `json:"theme"`
	ShowPreview bool   `json:"showPreview"`
	TimeFormat  string `json:"timeFormat" enum:"12,24"`
}

type SMTPSettings struct {
	Host     string `json:"host"`
	Port     int    `json:"port"`
	Auth     string `json:"auth"`
	Username string `json:"username"`
	Password string `json:"password"`
	TLS      string `json:"tls"`
}

type Settings struct {
	UI   UISettings   `json:"ui"`
	SMTP SMTPSettings `json:"smtp"`
}

type App struct {
	ctx    context.Context
	smtp   *smtp.Server
	emails []*Email
	mu     sync.RWMutex
}

func NewApp() *App {
	return &App{
		emails: make([]*Email, 0),
	}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	// Start SMTP server
	if err := a.startSMTPServer(); err != nil {
		log.Printf("Failed to start SMTP server: %v", err)
		return
	}
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

		// Notify frontend
		runtime.EventsEmit(a.ctx, "new:email", newEmail)
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
			Theme:       "system",
			ShowPreview: false,
			TimeFormat:  "12",
		},
		SMTP: SMTPSettings{
			Host: "localhost",
			Port: 1025,
			Auth: "none",
			TLS:  "none",
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
	configPath := a.getConfigPath()

	// Create config directory if it doesn't exist
	configDir := filepath.Dir(configPath)
	if err := os.MkdirAll(configDir, 0755); err != nil {
		return err
	}

	// Marshal settings to JSON
	data, err := json.MarshalIndent(settings, "", "  ")
	if err != nil {
		return err
	}

	// Write to file
	return os.WriteFile(configPath, data, 0644)
}

func (a *App) getConfigPath() string {
	// Get user config directory
	configDir, err := os.UserConfigDir()
	if err != nil {
		configDir = "."
	}

	return filepath.Join(configDir, "postpilot", "settings.json")
}

func (a *App) GetVersion() string {
	return version
}
