package smtp

import (
	"bytes"
	"io"
	"mime"
	"mime/multipart"
	"net/mail"
	"strings"
)

func parseEmail(email *Email, buffer *bytes.Buffer) error {
	msg, err := mail.ReadMessage(bytes.NewReader(buffer.Bytes()))
	if err != nil {
		return err
	}

	// Parse headers
	if subject, err := decodeHeader(msg.Header.Get("Subject")); err == nil {
		email.Subject = subject
	}

	// Parse body
	contentType := msg.Header.Get("Content-Type")
	mediaType, params, err := mime.ParseMediaType(contentType)
	if err != nil {
		// Fallback to plain text
		body, err := io.ReadAll(msg.Body)
		if err != nil {
			return err
		}
		email.Body = string(body)
		return nil
	}

	if strings.HasPrefix(mediaType, "multipart/") {
		mr := multipart.NewReader(msg.Body, params["boundary"])
		for {
			p, err := mr.NextPart()
			if err == io.EOF {
				break
			}
			if err != nil {
				return err
			}

			slurp, err := io.ReadAll(p)
			if err != nil {
				return err
			}

			partContentType := p.Header.Get("Content-Type")
			if strings.HasPrefix(partContentType, "text/plain") {
				email.Body = string(slurp)
			} else if strings.HasPrefix(partContentType, "text/html") {
				email.HTML = string(slurp)
			}
		}
	} else {
		body, err := io.ReadAll(msg.Body)
		if err != nil {
			return err
		}
		if strings.HasPrefix(mediaType, "text/html") {
			email.HTML = string(body)
		} else {
			email.Body = string(body)
		}
	}

	return nil
}

func decodeHeader(header string) (string, error) {
	dec := new(mime.WordDecoder)
	return dec.DecodeHeader(header)
}
