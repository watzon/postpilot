package ui

import (
	"strings"

	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/container"
	"fyne.io/fyne/v2/widget"
	"github.com/watzon/mailviewer/internal/email"
)

type DetailView struct {
	container *fyne.Container
	from      *widget.Label
	to        *widget.Label
	subject   *widget.Label
	timestamp *widget.Label
	body      *widget.TextGrid
}

func NewDetailView() *DetailView {
	dv := &DetailView{
		from:      widget.NewLabel("From: "),
		to:        widget.NewLabel("To: "),
		subject:   widget.NewLabel("Subject: "),
		timestamp: widget.NewLabel("Time: "),
		body:      widget.NewTextGrid(),
	}

	// Create form for email details
	form := container.NewVBox(
		dv.from,
		dv.to,
		dv.subject,
		dv.timestamp,
		widget.NewSeparator(),
		dv.body,
	)

	dv.container = container.NewPadded(form)
	return dv
}

func (dv *DetailView) Container() fyne.CanvasObject {
	return dv.container
}

func (dv *DetailView) SetEmail(email *email.Email) {
	if email == nil {
		dv.Clear()
		return
	}

	dv.from.SetText("From: " + email.From)
	dv.to.SetText("To: " + strings.Join(email.To, ", "))
	dv.subject.SetText("Subject: " + email.Subject)
	dv.timestamp.SetText("Time: " + email.Timestamp.Format("2006-01-02 15:04:05"))
	dv.body.SetText(email.Body)
}

func (dv *DetailView) Clear() {
	dv.from.SetText("From: ")
	dv.to.SetText("To: ")
	dv.subject.SetText("Subject: ")
	dv.timestamp.SetText("Time: ")
	dv.body.SetText("")
}
