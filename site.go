package main

import (
	"embed"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"time"
)

//go:embed site/index.html site/app.js site/styles.css
var siteAssets embed.FS

type catalogEvent struct {
	Date        string    `json:"date"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Start       time.Time `json:"start"`
}

type catalogMosque struct {
	ID              string         `json:"id"`
	Name            string         `json:"name"`
	Timezone        string         `json:"timezone"`
	SourceURL       string         `json:"source_url"`
	Feed            string         `json:"feed"`
	SourceFetchedAt time.Time      `json:"source_fetched_at"`
	FeedBuiltAt     time.Time      `json:"feed_built_at"`
	Events          []catalogEvent `json:"events"`
}

func newCatalogMosque(slug string, m *mosque, events []event, fetchedAt, builtAt, previewDay time.Time) catalogMosque {
	entry := catalogMosque{
		ID: slug, Name: m.Label, Timezone: m.Timezone,
		SourceURL: "https://mawaqit.net/fr/" + slug,
		Feed:      slug + ".ics", SourceFetchedAt: fetchedAt, FeedBuiltAt: builtAt,
		Events: make([]catalogEvent, 0, 10),
	}
	today := previewDay.Format(time.DateOnly)
	tomorrow := previewDay.AddDate(0, 0, 1).Format(time.DateOnly)
	for _, e := range events {
		date := e.Start.Format(time.DateOnly)
		if date != today && date != tomorrow {
			continue
		}
		entry.Events = append(entry.Events, catalogEvent{
			Date: date, Title: e.Summary,
			Description: e.Description, Start: e.Start,
		})
	}
	return entry
}

// writeSite only publishes the entries returned by this successful build.
// Files left in the output directory from an older configuration are not listed.
func writeSite(outDir string, mosques []catalogMosque) error {
	data, err := json.MarshalIndent(struct {
		Version int             `json:"version"`
		Mosques []catalogMosque `json:"mosques"`
	}{Version: 1, Mosques: mosques}, "", "  ")
	if err != nil {
		return fmt.Errorf("encode catalog: %w", err)
	}
	for _, name := range []string{"index.html", "app.js", "styles.css"} {
		asset, err := siteAssets.ReadFile("site/" + name)
		if err != nil {
			return err
		}
		if err := os.WriteFile(filepath.Join(outDir, name), asset, 0o644); err != nil {
			return err
		}
	}
	return os.WriteFile(filepath.Join(outDir, "catalog.json"), data, 0o644)
}
