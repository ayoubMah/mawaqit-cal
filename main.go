// mawaqit-cal turns a mosque's Mawaqit timetable into an .ics calendar feed.
//
// Mawaqit has no public API, but every mosque page embeds its full-year
// timetable as a `confData = {...};` JSON blob. We read that, build a rolling
// window of events, and write one .ics per mosque. Event UIDs are stable
// (slug + date + prayer), so when the mosque changes a time the subscribed
// calendar updates the existing event instead of duplicating it.
package main

import (
	"errors"
	"flag"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"
	_ "time/tzdata" // Windows and slim CI images have no zoneinfo
)

func main() {
	if len(os.Args) > 2 && os.Args[1] == "search" {
		if err := search(strings.Join(os.Args[2:], " ")); err != nil {
			log.Fatal(err)
		}
		return
	}

	slugs := flag.String("mosques", "", "comma-separated Mawaqit slugs, e.g. mosquee-sahaba-creteil")
	out := flag.String("out", "public", "output directory for the .ics files")
	past := flag.Int("past", 7, "days before today to include")
	future := flag.Int("future", 60, "days after today to include")
	flag.Parse()

	if *slugs == "" {
		log.Fatal("-mosques is required (find a slug with: mawaqit-cal search <city>)")
	}
	if err := os.MkdirAll(*out, 0o755); err != nil {
		log.Fatal(err)
	}

	failed := false
	for _, slug := range strings.Split(*slugs, ",") {
		slug = strings.TrimSpace(slug)
		if slug == "" {
			continue
		}
		if err := build(slug, *out, *past, *future); err != nil {
			// A failed mosque must fail the run: publishing an empty feed would
			// make Google delete every event from the subscriber's calendar.
			log.Printf("%s: %v", slug, err)
			failed = true
		}
	}
	if failed {
		os.Exit(1)
	}
}

func build(slug, outDir string, past, future int) error {
	html, err := fetch("https://mawaqit.net/fr/" + slug)
	if err != nil {
		return err
	}
	m, err := parseMosque(html)
	if err != nil {
		return err
	}
	loc, err := time.LoadLocation(m.Timezone)
	if err != nil {
		return fmt.Errorf("timezone %q: %w", m.Timezone, err)
	}

	today := time.Now().In(loc)
	start := time.Date(today.Year(), today.Month(), today.Day(), 0, 0, 0, 0, loc).AddDate(0, 0, -past)
	events, err := m.events(slug, start, past+future+1, loc)
	if err != nil {
		return err
	}
	if len(events) == 0 {
		return errors.New("no events generated")
	}

	path := filepath.Join(outDir, slug+".ics")
	if err := os.WriteFile(path, []byte(renderICS(m.Label, events)), 0o644); err != nil {
		return err
	}
	log.Printf("%s: %d events -> %s", slug, len(events), path)
	return nil
}

func fetch(url string) (string, error) {
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return "", err
	}
	req.Header.Set("User-Agent", "mawaqit-cal (personal calendar feed)")
	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("GET %s: %s", url, resp.Status)
	}
	b, err := io.ReadAll(resp.Body)
	return string(b), err
}
