package notify

import (
	"github.com/gen2brain/beeep"
)

func SendNotification(title, message string) error {
	return beeep.Notify(title, message, "")
}
