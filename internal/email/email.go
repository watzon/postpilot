package email

import "time"

type Email struct {
	From      string
	To        []string
	Subject   string
	Body      string
	Timestamp time.Time
}

func (e Email) Equal(other Email) bool {
	if e.From != other.From || e.Subject != other.Subject ||
		e.Body != other.Body || !e.Timestamp.Equal(other.Timestamp) {
		return false
	}
	if len(e.To) != len(other.To) {
		return false
	}
	for i, to := range e.To {
		if to != other.To[i] {
			return false
		}
	}
	return true
}

type EmailWrapper struct {
	Email Email
}

func (e EmailWrapper) Equal(other EmailWrapper) bool {
	return e.Email.Equal(other.Email)
}
