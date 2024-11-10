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

// Server represents our SMTP server
type Server struct {
	host     string
	port     int
	server   *smtp.Server
	auth     string
	username string
	password string
	tlsMode  string
	tlsConf  *tls.Config

	// Channel for new emails
	emailChan chan *Email
	// Mutex for thread-safe operations
	mu sync.RWMutex
	// Store emails in memory
	emails []*Email
}

// Email represents a received email
type Email struct {
	ID        string    `json:"id"`
	From      string    `json:"from"`
	To        []string  `json:"to"`
	Subject   string    `json:"subject"`
	Body      string    `json:"body"`
	HTML      string    `json:"html"`
	Timestamp time.Time `json:"timestamp"`
	Raw       string    `json:"raw"`
}

// Session represents an SMTP session
type Session struct {
	server *Server
	from   string
	to     []string
	buffer bytes.Buffer
}

func (s *Session) Mail(from string, opts *smtp.MailOptions) error {
	s.from = from
	return nil
}

func (s *Session) Rcpt(to string, opts *smtp.RcptOptions) error {
	s.to = append(s.to, to)
	return nil
}

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

func (s *Session) Reset() {
	s.from = ""
	s.to = nil
	s.buffer.Reset()
}

func (s *Session) Logout() error {
	return nil
}

// Backend implements SMTP server methods
type Backend struct {
	server *Server
}

func (b *Backend) NewSession(_ *smtp.Conn) (smtp.Session, error) {
	return &Session{
		server: b.server,
	}, nil
}

// NewServer creates a new SMTP server instance
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

// Start begins listening for SMTP connections
func (s *Server) Start() error {
	go func() {
		if err := s.server.ListenAndServe(); err != nil {
			log.Printf("SMTP server error: %v", err)
		}
	}()
	log.Printf("SMTP server listening on %s", s.server.Addr)
	return nil
}

// Stop gracefully shuts down the server
func (s *Server) Stop() error {
	return s.server.Close()
}

// GetEmails returns all stored emails
func (s *Server) GetEmails() []*Email {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.emails
}

// EmailsChan returns the channel for new emails
func (s *Server) EmailsChan() <-chan *Email {
	return s.emailChan
}
