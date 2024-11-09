package ui

import (
	"strings"

	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/container"
	"fyne.io/fyne/v2/widget"
	"github.com/watzon/mailviewer/internal/email"
)

type ContentView struct {
	container fyne.CanvasObject
	from      *widget.Label
	to        *widget.Label
	content   *widget.RichText
}

func NewContentView() *ContentView {
	cv := &ContentView{
		from:    widget.NewLabel(""),
		to:      widget.NewLabel(""),
		content: widget.NewRichText(),
	}

	// Create header container
	headers := container.NewVBox(
		cv.from,
		cv.to,
		widget.NewSeparator(),
	)

	// Create main content layout with headers above content
	cv.container = container.NewBorder(
		headers, nil, nil, nil,
		container.NewScroll(cv.content),
	)

	return cv
}

func (cv *ContentView) SetEmail(email *email.Email) {
	if email == nil {
		cv.Clear()
		return
	}

	cv.from.SetText("From: " + email.From)
	cv.to.SetText("To: " + strings.Join(email.To, ", "))

	// Convert HTML to RichText segments
	segments := parseHtmlToRichText(email.Body)
	cv.content.Segments = segments
	cv.content.Refresh()
}

func (cv *ContentView) Clear() {
	cv.from.SetText("")
	cv.to.SetText("")
	cv.content.Segments = nil
	cv.content.Refresh()
}

func (cv *ContentView) Container() fyne.CanvasObject {
	return cv.container
}

// Basic HTML to RichText parser
func parseHtmlToRichText(html string) []widget.RichTextSegment {
	// Strip HTML tags for now, we can enhance this later
	text := strings.ReplaceAll(html, "<br>", "\n")
	text = strings.ReplaceAll(text, "<br/>", "\n")
	text = strings.ReplaceAll(text, "<br />", "\n")

	// Remove other HTML tags
	for text != "" {
		start := strings.Index(text, "<")
		if start == -1 {
			break
		}
		end := strings.Index(text[start:], ">")
		if end == -1 {
			break
		}
		text = text[:start] + text[start+end+1:]
	}

	// Create paragraph segments
	var segments []widget.RichTextSegment
	paragraphs := strings.Split(text, "\n\n")
	for _, p := range paragraphs {
		if strings.TrimSpace(p) != "" {
			segments = append(segments, &widget.TextSegment{
				Text:  strings.TrimSpace(p),
				Style: widget.RichTextStyleParagraph,
			})
		}
	}

	return segments
}
