package main

import (
	"strings"
	"time"
)

// renderICS writes an RFC 5545 calendar. Times are emitted in UTC so no
// VTIMEZONE block is needed; calendar apps convert to local time.
func renderICS(name string, events []event) string {
	var b strings.Builder
	line := func(s string) { b.WriteString(fold(s) + "\r\n") }

	line("BEGIN:VCALENDAR")
	line("VERSION:2.0")
	line("PRODID:-//mawaqit-cal//EN")
	line("CALSCALE:GREGORIAN")
	line("METHOD:PUBLISH")
	line("X-WR-CALNAME:" + esc("Salat · "+name))
	line("X-WR-CALDESC:" + esc("Prayer times from Mawaqit, regenerated daily"))
	// Hint for clients that honour it; Google ignores this and refreshes on its own schedule.
	line("REFRESH-INTERVAL;VALUE=DURATION:PT6H")
	line("X-PUBLISHED-TTL:PT6H")

	stamp := time.Now().UTC().Format("20060102T150405Z")
	for _, e := range events {
		line("BEGIN:VEVENT")
		line("UID:" + e.UID)
		line("DTSTAMP:" + stamp)
		line("DTSTART:" + e.Start.UTC().Format("20060102T150405Z"))
		line("DTEND:" + e.End.UTC().Format("20060102T150405Z"))
		line("SUMMARY:" + esc(e.Summary))
		line("DESCRIPTION:" + esc(e.Description))
		line("TRANSP:TRANSPARENT") // don't show as "busy"
		line("END:VEVENT")
	}
	line("END:VCALENDAR")
	return b.String()
}

func esc(s string) string {
	r := strings.NewReplacer(`\`, `\\`, ";", `\;`, ",", `\,`, "\n", `\n`)
	return r.Replace(s)
}

// fold splits content lines longer than 75 octets, without cutting a UTF-8 rune.
func fold(s string) string {
	if len(s) <= 75 {
		return s
	}
	var b strings.Builder
	n := 0
	for _, r := range s {
		size := len(string(r))
		if n+size > 75 {
			b.WriteString("\r\n ")
			n = 1
		}
		b.WriteRune(r)
		n += size
	}
	return b.String()
}
