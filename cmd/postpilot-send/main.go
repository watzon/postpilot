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
	subject := fmt.Sprintf("Welcome to PostPilot! %s", time.Now().Format("15:04:05"))

	// Create text body
	textBody := `Welcome!

We're excited to have you get started. First, you need to confirm your account using the link below:

https://postpilot.local/confirm-account

If you have any questions, just reply to this email—we're always happy to help out.

Best regards,
The PostPilot Team

-------------------
PostPilot - Local SMTP Testing
localhost:1025`

	// Create HTML body
	htmlBody := `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; margin: 0; padding: 0;">
        <tr>
            <td style="padding: 40px 20px;">
                <div style="max-width: 640px; margin: 0 auto;">
                    <!-- Logo Header -->
                    <div style="text-align: center; margin-bottom: 40px;">
                        <img src="https://raw.githubusercontent.com/watzon/postpilot/main/frontend/src/assets/images/logo.svg" 
                             alt="PostPilot Logo" 
                             style="width: 80px; height: 80px; display: inline-block; margin: 0 auto;">
                    </div>

                    <!-- Main Content Card -->
                    <div style="background-color: #fafafa; border-radius: 12px; padding: 40px; margin-bottom: 32px;">
                        <h1 style="margin: 0 0 24px; font-size: 24px; font-weight: 600; text-align: center; color: #0f172a;">
                            Welcome!
                        </h1>
                        <p style="margin: 0 0 32px; font-size: 16px; line-height: 24px; color: #334155; text-align: center;">
                            We're excited to have you get started. First, you need to confirm your account. Just press the button below.
                        </p>
                        <div style="text-align: center; margin: 32px 0;">
                            <a href="https://postpilot.local/confirm-account" 
                               style="display: inline-block; padding: 12px 32px; background-color: #ef4444; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 16px;">
                                Confirm Account
                            </a>
                        </div>
                        <p style="margin: 32px 0 0; font-size: 16px; line-height: 24px; color: #334155;">
                            If you have any questions, just reply to this email—we're always happy to help out.
                        </p>
                        <div style="margin: 24px 0 0; font-size: 16px; line-height: 24px; color: #334155;">
                            Best regards,<br>
                            The PostPilot Team
                        </div>
                    </div>

                    <!-- Footer -->
                    <div style="text-align: center;">
                        <p style="margin: 0; font-size: 14px; color: #64748b;">
                            PostPilot - Local SMTP Testing<br>
                            localhost:1025
                        </p>
                    </div>
                </div>
            </td>
        </tr>
    </table>
</body>
</html>`

	// Create email headers
	headers := fmt.Sprintf("From: %s\r\n"+
		"To: %s\r\n"+
		"Subject: %s\r\n"+
		"Content-Type: multipart/alternative; boundary=boundary\r\n"+
		"\r\n", from, to[0], subject)

	// Combine parts with proper MIME boundaries
	msg := headers +
		"--boundary\r\n" +
		"Content-Type: text/plain; charset=UTF-8\r\n\r\n" +
		textBody + "\r\n\r\n" +
		"--boundary\r\n" +
		"Content-Type: text/html; charset=UTF-8\r\n\r\n" +
		htmlBody + "\r\n\r\n" +
		"--boundary--"

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
