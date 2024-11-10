package smtp

import (
	"bytes"
	"crypto/tls"
	"fmt"
	"io"
	"log"
	"sync"
	"time"

	"github.com/emersion/go-smtp"
	"github.com/google/uuid"
)

// Package smtp implements a simple SMTP server for testing and development purposes

// Server represents our SMTP server implementation
// It handles email reception and storage in memory
type Server struct {
	// Host address to listen on
	host string
	// Port number for the SMTP server
	port int
	// Underlying SMTP server instance
	server *smtp.Server
	// Authentication mode (e.g., "none", "plain")
	auth string
	// Username for authentication
	username string
	// Password for authentication
	password string
	// TLS mode configuration
	tlsMode string
	// TLS configuration settings
	tlsConf *tls.Config

	// Channel for broadcasting newly received emails to listeners
	emailChan chan *Email
	// Mutex for protecting concurrent access to the emails slice
	mu sync.RWMutex
	// In-memory storage of received emails
	emails []*Email
}

// Email represents a received email message with all its components
type Email struct {
	// Unique identifier for the email
	ID string `json:"id"`
	// Sender's email address
	From string `json:"from"`
	// List of recipient email addresses
	To []string `json:"to"`
	// Carbon copy recipients
	Cc []string `json:"cc"`
	// Blind carbon copy recipients
	Bcc []string `json:"bcc"`
	// Reply-to email address
	ReplyTo string `json:"replyTo"`
	// Email subject line
	Subject string `json:"subject"`
	// Plain text content of the email
	Body string `json:"body"`
	// HTML content of the email, if available
	HTML string `json:"html"`
	// Time when the email was received
	Timestamp time.Time `json:"timestamp"`
	// Raw email content in its original form
	Raw string `json:"raw"`
	// Additional headers
	Headers map[string][]string `json:"headers"`
}

// Session represents an active SMTP session with a client
type Session struct {
	server *Server
	from   string
	to     []string
	buffer bytes.Buffer
}

// Mail handles the MAIL FROM command in the SMTP protocol
func (s *Session) Mail(from string, opts *smtp.MailOptions) error {
	s.from = from
	return nil
}

// Rcpt handles the RCPT TO command in the SMTP protocol
func (s *Session) Rcpt(to string, opts *smtp.RcptOptions) error {
	s.to = append(s.to, to)
	return nil
}

// Data handles the DATA command in the SMTP protocol
// It receives the email content and processes it
func (s *Session) Data(r io.Reader) error {
	if _, err := io.Copy(&s.buffer, r); err != nil {
		return err
	}

	email := &Email{
		ID:        uuid.New().String(),
		From:      s.from,
		To:        s.to,
		Timestamp: time.Now(),
		Raw:       s.buffer.String(),
	}

	// Parse email content
	if err := parseEmail(email, &s.buffer); err != nil {
		return err
	}

	s.server.mu.Lock()
	s.server.emails = append(s.server.emails, email)
	s.server.mu.Unlock()

	// Send to channel for real-time updates
	select {
	case s.server.emailChan <- email:
	default:
		log.Println("Email channel full, skipping notification")
	}

	return nil
}

// Reset clears the current session state
func (s *Session) Reset() {
	s.from = ""
	s.to = nil
	s.buffer.Reset()
}

// Logout handles client disconnection
func (s *Session) Logout() error {
	return nil
}

// Backend implements the smtp.Backend interface required by go-smtp
type Backend struct {
	server *Server
}

// NewSession creates a new SMTP session for each client connection
func (b *Backend) NewSession(_ *smtp.Conn) (smtp.Session, error) {
	return &Session{
		server: b.server,
	}, nil
}

// NewServer creates and configures a new SMTP server instance
// Parameters:
//   - host: The hostname or IP to listen on
//   - port: The port number to listen on
//   - auth: Authentication mode
//   - username: Authentication username
//   - password: Authentication password
//   - tlsMode: TLS configuration mode
func NewServer(host string, port int, auth, username, password, tlsMode string) *Server {
	s := &Server{
		host:      host,
		port:      port,
		auth:      auth,
		username:  username,
		password:  password,
		tlsMode:   tlsMode,
		emailChan: make(chan *Email, 100),
		emails:    make([]*Email, 0),
	}

	be := &Backend{server: s}
	s.server = smtp.NewServer(be)
	s.server.Addr = fmt.Sprintf("%s:%d", host, port)
	s.server.Domain = host
	s.server.ReadTimeout = 10 * time.Second
	s.server.WriteTimeout = 10 * time.Second
	s.server.MaxMessageBytes = 1024 * 1024 * 10 // 10MB
	s.server.MaxRecipients = 50
	s.server.AllowInsecureAuth = true

	return s
}

// Start begins listening for SMTP connections in a separate goroutine
func (s *Server) Start() error {
	go func() {
		if err := s.server.ListenAndServe(); err != nil {
			log.Printf("SMTP server error: %v", err)
		}
	}()
	log.Printf("SMTP server listening on %s", s.server.Addr)
	return nil
}

// Stop gracefully shuts down the SMTP server
func (s *Server) Stop() error {
	return s.server.Close()
}

// GetEmails returns a copy of all stored emails in a thread-safe manner
func (s *Server) GetEmails() []*Email {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.emails
}

// EmailsChan returns the channel used for real-time email notifications
// Consumers can listen on this channel to receive new emails as they arrive
func (s *Server) EmailsChan() <-chan *Email {
	return s.emailChan
}
