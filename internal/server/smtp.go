package server

import (
	"fmt"
	"time"

	"github.com/emersion/go-smtp"
	"github.com/watzon/mailviewer/internal/config"
	"github.com/watzon/mailviewer/internal/email"
)

type SMTPServer struct {
	server *smtp.Server
	store  *email.Store
}

func NewSMTPServer(cfg *config.Config) (*SMTPServer, error) {
	store := email.NewStore()
	backend := &Backend{store: store}

	s := smtp.NewServer(backend)
	s.Addr = fmt.Sprintf("%s:%d", cfg.Server.Host, cfg.Server.Port)
	s.Domain = cfg.Server.Domain
	s.ReadTimeout = time.Duration(cfg.Server.ReadTimeout) * time.Second
	s.WriteTimeout = time.Duration(cfg.Server.WriteTimeout) * time.Second
	s.MaxMessageBytes = int64(cfg.Server.MaxMessageBytes)
	s.MaxRecipients = cfg.Server.MaxRecipients
	s.AllowInsecureAuth = cfg.Server.AllowInsecureAuth

	return &SMTPServer{
		server: s,
		store:  store,
	}, nil
}

func (s *SMTPServer) Start() error {
	go func() {
		if err := s.server.ListenAndServe(); err != nil {
			panic(fmt.Sprintf("Failed to start SMTP server: %v", err))
		}
	}()
	return nil
}

func (s *SMTPServer) Stop() error {
	return s.server.Close()
}

func (s *SMTPServer) GetStore() *email.Store {
	return s.store
}
