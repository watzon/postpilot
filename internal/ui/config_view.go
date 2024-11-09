package ui

import (
	"fmt"

	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/container"
	"fyne.io/fyne/v2/widget"
	"github.com/watzon/mailviewer/internal/config"
)

type ConfigView struct {
	config    *config.Config
	container *fyne.Container
}

func NewConfigView(cfg *config.Config) *ConfigView {
	cv := &ConfigView{
		config: cfg,
	}

	// Create form items
	items := []*widget.FormItem{
		{Text: "Host", Widget: widget.NewLabel(cfg.Server.Host)},
		{Text: "Port", Widget: widget.NewLabel(fmt.Sprintf("%d", cfg.Server.Port))},
		{Text: "Domain", Widget: widget.NewLabel(cfg.Server.Domain)},
	}

	form := widget.NewForm(items...)
	cv.container = container.NewPadded(form)

	return cv
}

func (cv *ConfigView) Container() fyne.CanvasObject {
	return cv.container
}

func (cv *ConfigView) Refresh() {
	cv.container.Refresh()
}
