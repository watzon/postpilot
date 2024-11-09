package main

import (
	"log"

	"fyne.io/fyne/v2/app"
	"github.com/watzon/mailviewer/internal/config"
	"github.com/watzon/mailviewer/internal/server"
	"github.com/watzon/mailviewer/internal/ui"
)

func main() {
	log.Println("Starting application...")

	// Load config first
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Error loading config: %v", err)
	}

	// Create app
	myApp := app.New()
	window := myApp.NewWindow("Mail Testing Server")

	// Create and start SMTP server
	smtpServer, err := server.NewSMTPServer(cfg)
	if err != nil {
		log.Fatalf("Failed to create SMTP server: %v", err)
	}

	// Set the app reference in the store
	smtpServer.GetStore().SetApp(myApp)

	if err := smtpServer.Start(); err != nil {
		log.Fatalf("Failed to start SMTP server: %v", err)
	}

	// Create main window
	mainWindow := ui.NewMainWindow(window, cfg, smtpServer.GetStore())
	mainWindow.Show()

	window.ShowAndRun()
}
