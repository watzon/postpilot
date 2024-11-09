package email

import (
	"fmt"
	"log"
	"sync"

	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/data/binding"
	"fyne.io/fyne/v2/widget"
)

type Store struct {
	app       fyne.App
	emails    []Email
	data      binding.StringList
	mutex     sync.RWMutex
	list      *widget.List
	emailChan chan Email
}

func NewStore() *Store {
	displayStrings := make([]string, 0)
	store := &Store{
		emails:    make([]Email, 0),
		data:      binding.BindStringList(&displayStrings),
		emailChan: make(chan Email, 100),
	}

	// Start the updater immediately
	store.StartUIUpdater()
	return store
}

func (s *Store) SetApp(app fyne.App) {
	s.app = app
}

func (s *Store) SetList(list *widget.List) {
	s.list = list
}

func (s *Store) Add(email Email) {
	log.Printf("Adding email to channel: %s", email.Subject)
	s.emailChan <- email
}

func (s *Store) StartUIUpdater() {
	log.Println("Starting UI updater")
	go func() {
		for email := range s.emailChan {
			log.Printf("UI updater received email: %s", email.Subject)
			// Create a copy of the email to avoid race conditions
			emailCopy := email
			// Use the main thread to update UI
			if s.app != nil {
				// Queue the update on the main thread
				go func() {
					s.handleNewEmail(emailCopy)
				}()
			} else {
				s.handleNewEmail(emailCopy)
			}
		}
	}()
}

func (s *Store) handleNewEmail(email Email) {
	log.Printf("Handling new email - Subject: %s", email.Subject)

	s.mutex.Lock()
	defer s.mutex.Unlock()

	// Add email to the emails slice
	s.emails = append([]Email{email}, s.emails...)

	// Update the binding data
	err := s.data.Prepend(email.Subject)
	if err != nil {
		log.Printf("Error updating binding data: %v", err)
		return
	}

	log.Printf("Updated binding data, current length: %d", len(s.emails))

	// Send notification if app is available
	if s.app != nil {
		notification := fyne.NewNotification(
			fmt.Sprintf("New Email from %s", email.From),
			email.Subject,
		)
		s.app.SendNotification(notification)
	}
}

func (s *Store) GetAll() []Email {
	s.mutex.RLock()
	defer s.mutex.RUnlock()
	return s.emails
}

func (s *Store) GetBindingData() binding.StringList {
	return s.data
}

func (s *Store) GetEmailBySubject(subject string) *Email {
	s.mutex.RLock()
	defer s.mutex.RUnlock()

	for i := range s.emails {
		if s.emails[i].Subject == subject {
			return &s.emails[i]
		}
	}
	return nil
}
