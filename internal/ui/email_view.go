package ui

import (
	"log"

	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/container"
	"fyne.io/fyne/v2/data/binding"
	"fyne.io/fyne/v2/widget"
	"github.com/watzon/mailviewer/internal/email"
)

type EmailView struct {
	store     *email.Store
	list      *widget.List
	container *fyne.Container
	onSelect  func(*email.Email)
}

func NewEmailView(store *email.Store) *EmailView {
	ev := &EmailView{
		store: store,
	}

	ev.list = widget.NewListWithData(
		store.GetBindingData(),
		func() fyne.CanvasObject {
			return widget.NewLabel("Template")
		},
		func(item binding.DataItem, obj fyne.CanvasObject) {
			label := obj.(*widget.Label)
			label.Bind(item.(binding.String))
		},
	)

	ev.list.OnSelected = func(id widget.ListItemID) {
		if ev.onSelect != nil {
			str, err := store.GetBindingData().GetValue(id)
			if err != nil {
				log.Printf("Error getting email subject: %v", err)
				return
			}

			email := store.GetEmailBySubject(str)
			if email != nil {
				ev.onSelect(email)
			}
		}
	}

	store.SetList(ev.list)

	// Create search entry
	search := widget.NewEntry()
	search.SetPlaceHolder("Search emails...")

	ev.container = container.NewBorder(
		search, nil, nil, nil,
		container.NewVScroll(ev.list),
	)

	return ev
}

func (ev *EmailView) SetOnSelect(callback func(*email.Email)) {
	ev.onSelect = callback
}

func (ev *EmailView) Container() fyne.CanvasObject {
	return ev.container
}
