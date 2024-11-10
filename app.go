package main

import (
	"context"
	"encoding/json"
	"os"
	"path/filepath"
	"time"
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
	ctx context.Context
}

func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// GetEmails returns all emails
func (a *App) GetEmails() []Email {
	return []Email{
		{
			ID:      "1",
			From:    "welcome@cloudspace.dev",
			To:      []string{"developer@example.com"},
			Subject: "Welcome to CloudSpace",
			Body:    "Welcome to CloudSpace! We're excited to have you on board.",
			HTML: `
<div style="background-color: #E2E8F0; min-height: 100vh; padding: 40px 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; padding: 40px; font-family: system-ui, -apple-system, sans-serif; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <h1 style="color: #2D3748; font-size: 24px; margin-bottom: 24px;">Welcome to CloudSpace</h1>
        
        <p style="color: #4A5568; margin-bottom: 16px;">
            We're thrilled to have you join CloudSpace, your new home for cloud development.
        </p>

        <div style="background-color: #F7FAFC; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <h2 style="color: #2D3748; font-size: 18px; margin-bottom: 16px;">Your Account Details</h2>
            <p style="color: #4A5568; margin-bottom: 8px;">
                Account ID: CS-28390-DEV
            </p>
            <p style="color: #4A5568; margin-bottom: 8px;">
                Region: US-WEST
            </p>
            <p style="color: #4A5568;">
                Plan: Developer Pro
            </p>
        </div>

        <p style="color: #4A5568; margin-bottom: 24px;">
            To get started, check out these resources:
        </p>

        <ul style="color: #4A5568; margin-bottom: 24px; padding-left: 20px;">
            <li style="margin-bottom: 8px;">
                <a href="#" style="color: #4299E1; text-decoration: none;">Quick Start Guide</a>
            </li>
            <li style="margin-bottom: 8px;">
                <a href="#" style="color: #4299E1; text-decoration: none;">API Documentation</a>
            </li>
            <li style="margin-bottom: 8px;">
                <a href="#" style="color: #4299E1; text-decoration: none;">Developer Dashboard</a>
            </li>
        </ul>

        <div style="background-color: #EBF8FF; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <p style="color: #2C5282; margin-bottom: 16px;">
                <strong>Pro Tip:</strong> Set up two-factor authentication for enhanced security.
            </p>
            <a href="#" style="display: inline-block; background-color: #4299E1; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none;">
                Enable 2FA Now
            </a>
        </div>

        <p style="color: #4A5568; margin-top: 32px;">
            Happy coding,<br>
            The CloudSpace Team
        </p>
    </div>
</div>`,
			Timestamp: time.Now().Add(-1 * time.Hour),
		},
		{
			ID:        "2",
			From:      "noreply@company.com",
			To:        []string{"user@example.com"},
			Subject:   "Your Account Statement",
			Body:      "Your monthly account statement is ready.",
			HTML:      "<h1>Monthly Statement</h1><p>Your account statement for this month is now available.</p>",
			Timestamp: time.Now().Add(-2 * time.Hour),
		},
		{
			ID:        "3",
			From:      "newsletter@tech.com",
			To:        []string{"subscriber@example.com"},
			Subject:   "Weekly Tech Newsletter",
			Body:      "Here's your weekly roundup of tech news.",
			HTML:      "<h1>Tech Weekly</h1><p>The latest in technology news and updates.</p>",
			Timestamp: time.Now().Add(-24 * time.Hour),
		},
	}
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

	return filepath.Join(configDir, "mailviewer", "settings.json")
}
