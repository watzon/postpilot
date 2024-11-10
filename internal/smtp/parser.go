package smtp

import (
	"io"
	"mime"
	"mime/multipart"
	"net/mail"
	"strings"
)

// parseEmail processes a raw email message and extracts its components into the Email struct.
// It handles both single-part and multipart emails, supporting plain text and HTML content.
func parseEmail(email *Email, r io.Reader) error {
	msg, err := mail.ReadMessage(r)
	if err != nil {
		return err
	}

	header := msg.Header
	email.Subject = header.Get("Subject")
	email.From = header.Get("From")
	email.ReplyTo = header.Get("Reply-To")

	// Handle To, Cc, Bcc
	if to, err := header.AddressList("To"); err == nil {
		email.To = addressListToStrings(to)
	}
	if cc, err := header.AddressList("Cc"); err == nil {
		email.Cc = addressListToStrings(cc)
	}
	if bcc, err := header.AddressList("Bcc"); err == nil {
		email.Bcc = addressListToStrings(bcc)
	}

	// Store all headers
	email.Headers = make(map[string][]string)
	for k, v := range header {
		// Skip headers we've already processed
		switch k {
		case "From", "To", "Cc", "Bcc", "Subject", "Reply-To":
			continue
		}
		email.Headers[k] = v
	}

	// Parse and decode the email subject, handling encoded headers (e.g., UTF-8, Base64)
	if subject, err := decodeHeader(email.Subject); err == nil {
		email.Subject = subject
	}

	// Parse the Content-Type header to determine the email structure
	contentType := header.Get("Content-Type")
	mediaType, params, err := mime.ParseMediaType(contentType)
	if err != nil {
		// If Content-Type parsing fails, treat the entire body as plain text
		body, err := io.ReadAll(msg.Body)
		if err != nil {
			return err
		}
		email.Body = string(body)
		return nil
	}

	// Handle multipart messages (e.g., emails with both text and HTML parts)
	if strings.HasPrefix(mediaType, "multipart/") {
		mr := multipart.NewReader(msg.Body, params["boundary"])
		for {
			// Read each part of the multipart message
			p, err := mr.NextPart()
			if err == io.EOF {
				break
			}
			if err != nil {
				return err
			}

			// Read the content of this part
			slurp, err := io.ReadAll(p)
			if err != nil {
				return err
			}

			// Determine the content type of this part and store accordingly
			partContentType := p.Header.Get("Content-Type")
			if strings.HasPrefix(partContentType, "text/plain") {
				email.Body = string(slurp)
			} else if strings.HasPrefix(partContentType, "text/html") {
				email.HTML = string(slurp)
			}
			// Note: Other content types (e.g., attachments) are currently ignored
		}
	} else {
		// Handle single-part messages
		body, err := io.ReadAll(msg.Body)
		if err != nil {
			return err
		}
		// Store the content based on its media type
		if strings.HasPrefix(mediaType, "text/html") {
			email.HTML = string(body)
		} else {
			// Default to treating unknown content types as plain text
			email.Body = string(body)
		}
	}

	return nil
}

// decodeHeader decodes an encoded email header string (e.g., UTF-8, Base64)
// using the MIME word encoding specification (RFC 2047)
func decodeHeader(header string) (string, error) {
	dec := new(mime.WordDecoder)
	return dec.DecodeHeader(header)
}

func addressListToStrings(addresses []*mail.Address) []string {
	result := make([]string, len(addresses))
	for i, addr := range addresses {
		result[i] = addr.String()
	}
	return result
}
