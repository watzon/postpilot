package server

import (
	"io"
	"log"
	"time"

	"bytes"
	"net/mail"

	"github.com/emersion/go-smtp"
	"github.com/watzon/mailviewer/internal/email"
)

type Backend struct {
	store *email.Store
}

func (bkd *Backend) NewSession(c *smtp.Conn) (smtp.Session, error) {
	return &Session{
		store: bkd.store,
	}, nil
}

type Session struct {
	store   *email.Store
	from    string
	to      []string
	data    []byte
	subject string
}

func (s *Session) AuthPlain(username, password string) error {
	return nil
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
	data, err := io.ReadAll(r)
	if err != nil {
		return err
	}
	s.data = data

	// Parse the email message
	msg, err := mail.ReadMessage(bytes.NewReader(data))
	if err != nil {
		log.Printf("Error parsing email: %v", err)
		return err
	}

	// Read the message body
	body, err := io.ReadAll(msg.Body)
	if err != nil {
		log.Printf("Error reading message body: %v", err)
		return err
	}

	// Create email with parsed data
	email := email.Email{
		From:      s.from,
		To:        s.to,
		Subject:   msg.Header.Get("Subject"),
		Body:      string(body),
		Timestamp: time.Now(),
	}

	log.Printf("Received email from %s to %v", s.from, s.to)
	s.store.Add(email)
	return nil
}

func (s *Session) Reset() {
	s.from = ""
	s.to = []string{}
	s.data = []byte{}
	s.subject = ""
}

func (s *Session) Logout() error {
	return nil
}
