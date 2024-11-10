package main

import (
	"fmt"
	"log"
	"net"
	"net/smtp"
	"time"
)

func main() {
	// For now, let's hardcode these values since we're not using the config package yet
	host := "localhost"
	port := 1025

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
	addr := fmt.Sprintf("%s:%d", host, port)
	log.Printf("Connecting to SMTP server at %s", addr)

	// Try to establish a connection first
	conn, err := net.Dial("tcp", addr)
	if err != nil {
		log.Fatalf("Failed to connect to SMTP server: %v", err)
	}
	conn.Close()

	// Send the email
	err = smtp.SendMail(addr, nil, from, to, []byte(msg))
	if err != nil {
		log.Fatalf("Failed to send email: %v", err)
	}

	log.Println("Email sent successfully!")
}
