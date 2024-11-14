package spam

import (
	"bytes"
	"fmt"
	"log"
	"os/exec"
	"runtime"
	"strconv"
	"strings"
)

// SpamReport contains the results of a SpamAssassin check
type SpamReport struct {
	IsSpam    bool               `json:"isSpam"`
	Score     float64            `json:"score"`
	Threshold float64            `json:"threshold"`
	Rules     []SpamAssassinRule `json:"rules"`
	RawReport string             `json:"rawReport"`
}

// SpamAssassinRule represents a single rule match from SpamAssassin
type SpamAssassinRule struct {
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Score       float64 `json:"score"`
}

// SpamChecker handles spam checking operations
type SpamChecker struct {
	binaryPath string
	useLocal   bool
	host       string
	port       int
}

// NewSpamChecker creates a new SpamChecker instance
func NewSpamChecker(binaryPath string, useLocal bool, host string, port int) *SpamChecker {
	return &SpamChecker{
		binaryPath: binaryPath,
		useLocal:   useLocal,
		host:       host,
		port:       port,
	}
}

// GetDefaultBinaryPath returns the default SpamAssassin binary path for the current OS
func GetDefaultBinaryPath() string {
	switch runtime.GOOS {
	case "darwin":
		// Common Homebrew installation path
		return "/usr/local/bin/spamassassin"
	case "windows":
		// Common Windows installation paths
		paths := []string{
			`C:\Program Files\SpamAssassin\spamassassin.exe`,
			`C:\Program Files (x86)\SpamAssassin\spamassassin.exe`,
		}
		for _, path := range paths {
			if _, err := exec.LookPath(path); err == nil {
				return path
			}
		}
		return `C:\Program Files\SpamAssassin\spamassassin.exe` // default if not found
	default: // linux and other unix-like systems
		return "/usr/bin/spamassassin"
	}
}

// IsAvailable checks if SpamAssassin is available at the specified path
func IsAvailable(binaryPath string) bool {
	cmd := exec.Command(binaryPath, "--version")
	err := cmd.Run()
	return err == nil
}

// CheckEmail runs SpamAssassin on the provided email content
func (s *SpamChecker) CheckEmail(emailContent []byte) (*SpamReport, error) {
	// Use spamassassin directly with test mode (-t) to get report
	cmd := exec.Command(s.binaryPath, "-t")

	var stdout, stderr bytes.Buffer
	cmd.Stdin = bytes.NewReader(emailContent)
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr

	if err := cmd.Run(); err != nil {
		if stderr.Len() > 0 {
			return nil, fmt.Errorf("spamassassin error: %s", stderr.String())
		}
		return nil, fmt.Errorf("spamassassin error: %v", err)
	}

	// Log raw output for debugging
	log.Printf("SpamAssassin raw output:\n%s", stdout.String())

	return parseSpamAssassinOutput(stdout.Bytes())
}

// parseSpamAssassinOutput parses the raw SpamAssassin output into a structured report
func parseSpamAssassinOutput(output []byte) (*SpamReport, error) {
	lines := strings.Split(string(output), "\n")
	report := &SpamReport{
		Rules: make([]SpamAssassinRule, 0),
	}

	var inReport bool
	var inRules bool

	for _, line := range lines {
		line = strings.TrimSpace(line)

		if strings.HasPrefix(line, "Spam detection software") {
			inReport = true
			continue
		}

		if !inReport {
			continue
		}

		if strings.HasPrefix(line, "Content analysis details:") {
			inRules = true
			continue
		}

		if strings.Contains(line, "pts rule name") {
			// Skip the header line
			continue
		}

		if strings.HasPrefix(line, "X-Spam-Status:") {
			// Parse X-Spam-Status header
			// Format: X-Spam-Status: Yes/No, score=N.N required=N.N tests=TEST1,TEST2
			parts := strings.Split(line[14:], ",") // Skip "X-Spam-Status: "
			if len(parts) > 0 {
				report.IsSpam = strings.ToLower(strings.TrimSpace(parts[0])) == "yes"
			}
			for _, part := range parts[1:] {
				part = strings.TrimSpace(part)
				if strings.HasPrefix(part, "score=") {
					if score, err := strconv.ParseFloat(strings.TrimPrefix(part, "score="), 64); err == nil {
						report.Score = score
					}
				} else if strings.HasPrefix(part, "required=") {
					if threshold, err := strconv.ParseFloat(strings.TrimPrefix(part, "required="), 64); err == nil {
						report.Threshold = threshold
					}
				}
			}
			continue
		}

		if inRules && len(line) > 0 {
			// Parse rule line
			// Format: N.N RULENAME Description
			parts := strings.SplitN(line, " ", 3)
			if len(parts) >= 2 {
				score, err := strconv.ParseFloat(parts[0], 64)
				if err == nil {
					name := parts[1]
					description := ""
					if len(parts) > 2 {
						description = strings.TrimSpace(parts[2])
					}
					report.Rules = append(report.Rules, SpamAssassinRule{
						Name:        name,
						Description: description,
						Score:       score,
					})
				}
			}
		}
	}

	report.RawReport = string(output)
	return report, nil
}
