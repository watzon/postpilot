package ui

import (
	"fmt"
	"strings"
	"time"

	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/container"
	"fyne.io/fyne/v2/widget"
	"github.com/watzon/mailviewer/internal/config"
	"github.com/watzon/mailviewer/internal/email"
)

type MainWindow struct {
	window        fyne.Window
	emailView     *EmailView
	contentView   *ContentView
	headerView    *widget.TextGrid
	textView      *widget.TextGrid
	rawView       *widget.TextGrid
	selectedEmail *email.Email
}

func NewMainWindow(window fyne.Window, cfg *config.Config, store *email.Store) *MainWindow {
	mw := &MainWindow{
		window:     window,
		headerView: widget.NewTextGrid(),
		textView:   widget.NewTextGrid(),
		rawView:    widget.NewTextGrid(),
	}

	// Create views
	mw.emailView = NewEmailView(store)
	mw.contentView = NewContentView()

	// Set up email selection handler
	mw.emailView.SetOnSelect(func(e *email.Email) {
		mw.selectedEmail = e
		mw.updateAllViews()
	})

	// Create tabs for email content
	tabs := container.NewAppTabs(
		container.NewTabItem("Content", mw.contentView.Container()),
		container.NewTabItem("Headers", mw.headerView),
		container.NewTabItem("Text", mw.textView),
		container.NewTabItem("Raw", mw.rawView),
	)

	// Create main layout with split container
	split := container.NewHSplit(
		// Left side - Email list
		mw.emailView.Container(),
		// Right side - Tabs container
		tabs,
	)

	// Set split ratio
	split.SetOffset(0.3)

	// Set the main content
	window.SetContent(split)
	return mw
}

func (mw *MainWindow) updateAllViews() {
	if mw.selectedEmail == nil {
		mw.contentView.Clear()
		mw.headerView.SetText("")
		mw.textView.SetText("")
		mw.rawView.SetText("")
		return
	}

	// Update content view
	mw.contentView.SetEmail(mw.selectedEmail)

	// Update headers view
	headers := fmt.Sprintf("From: %s\nTo: %s\nSubject: %s\nDate: %s",
		mw.selectedEmail.From,
		strings.Join(mw.selectedEmail.To, ", "),
		mw.selectedEmail.Subject,
		mw.selectedEmail.Timestamp.Format(time.RFC1123Z))
	mw.headerView.SetText(headers)

	// Update text view
	mw.textView.SetText(mw.selectedEmail.Body)

	// Update raw view
	rawContent := fmt.Sprintf("%s\n\n%s", headers, mw.selectedEmail.Body)
	mw.rawView.SetText(rawContent)
}

func (mw *MainWindow) Show() {
	mw.window.Resize(fyne.NewSize(1024, 768))
	mw.window.CenterOnScreen()
}
