package main

import (
	"fmt"
	"log"
	"net"
	"net/smtp"
	"time"

	"github.com/watzon/mailviewer/internal/config"
)

func main() {
	// Load the same config
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Error loading config: %v", err)
	}

	// Prepare email
	from := "test@example.com"
	to := []string{"recipient@example.com"}
	subject := fmt.Sprintf("Test Email %s", time.Now().Format("15:04:05"))

	// Create email headers
	headers := fmt.Sprintf("From: %s\r\n"+
		"To: %s\r\n"+
		"Subject: %s\r\n"+
		"Content-Type: text/html; charset=UTF-8\r\n"+
		"\r\n", from, to[0], subject)

	// Create HTML body
	body := `
<html>
<body>
    <h1>Test Email</h1>
    <p>This is a test email sent from mailsend CLI tool.</p>
    <p>Hello, World!</p>
</body>
</html>`

	// Combine headers and body
	msg := headers + body

	// Connect to the SMTP server
	addr := fmt.Sprintf("%s:%d", cfg.Server.Host, cfg.Server.Port)
	log.Printf("Connecting to SMTP server at %s", addr)

	// Try to establish a connection first
	conn, err := net.Dial("tcp", addr)
	if err != nil {
		log.Fatalf("Failed to connect to SMTP server: %v", err)
	}
	conn.Close()

	log.Printf("SMTP server is reachable, sending email...")

	// Create channel for error reporting
	done := make(chan error, 1)

	// Send email in goroutine
	go func() {
		err := smtp.SendMail(
			addr,
			nil,
			from,
			to,
			[]byte(msg),
		)
		done <- err
	}()

	// Wait for either completion or timeout
	select {
	case err := <-done:
		if err != nil {
			log.Fatalf("Error sending mail: %v", err)
		}
		log.Printf("Test email sent successfully to %s", addr)
	case <-time.After(10 * time.Second):
		log.Fatalf("Timeout while sending email")
	}
}
