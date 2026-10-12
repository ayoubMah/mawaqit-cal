package main

import (
	"encoding/json"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"
)

func TestCatalogUsesMosqueDateAndExistingEvents(t *testing.T) {
	loc, err := time.LoadLocation("Europe/Paris")
	if err != nil {
		t.Fatal(err)
	}
	// Local midnight is the preceding UTC date. Grouping by UTC would hide it
	// from today's preview for a mosque in Paris.
	start := time.Date(2026, 10, 25, 0, 30, 0, 0, loc)
	events := []event{{Summary: "Fajr · iqama 00:40", Description: "Adhan 00:30\nTest Mosque", Start: start}}
	fetchedAt := time.Date(2026, 10, 24, 23, 0, 0, 0, time.UTC)
	builtAt := fetchedAt.Add(time.Second)
	entry := newCatalogMosque("test-mosque", &mosque{Label: "Test Mosque", Timezone: "Europe/Paris"}, events, fetchedAt, builtAt, start)
	if len(entry.Events) != 1 {
		t.Fatalf("want one local-day event, got %d", len(entry.Events))
	}
	if entry.Events[0].Date != "2026-10-25" || entry.Events[0].Start.UTC().Format(time.DateOnly) != "2026-10-24" {
		t.Fatalf("preview must group by mosque date: %+v", entry.Events[0])
	}
	if entry.Events[0].Title != events[0].Summary || entry.Events[0].Description != events[0].Description || !entry.Events[0].Start.Equal(events[0].Start) {
		t.Fatal("catalog changed the calendar event")
	}
	if !entry.SourceFetchedAt.Equal(fetchedAt) || !entry.FeedBuiltAt.Equal(builtAt) {
		t.Fatal("source and build timestamps must stay distinct")
	}
}

func TestCatalogIncludesThreeLocalDaysAfterMissedBuild(t *testing.T) {
	loc, err := time.LoadLocation("Europe/Paris")
	if err != nil {
		t.Fatal(err)
	}
	// The next local day crosses the autumn DST boundary: use calendar days,
	// not a 24-hour interval or the last generated event's date.
	today := time.Date(2026, 10, 24, 0, 0, 0, 0, loc)
	var events []event
	for day := -7; day <= 60; day++ {
		for prayer := 0; prayer < 5; prayer++ {
			events = append(events, event{Start: today.AddDate(0, 0, day).Add(time.Duration(6+prayer) * time.Hour)})
		}
	}
	entry := newCatalogMosque("test", &mosque{Timezone: "Europe/Paris"}, events, today, today, today)
	if len(entry.Events) != 15 {
		t.Fatalf("want 15 preview events across three local days, got %d", len(entry.Events))
	}
	counts := make(map[string]int)
	for _, e := range entry.Events {
		counts[e.Date]++
	}
	for _, date := range []string{"2026-10-24", "2026-10-25", "2026-10-26"} {
		if counts[date] != 5 {
			t.Errorf("want five events on %s, got %d", date, counts[date])
		}
	}
}

func TestSiteOnlyListsGeneratedFeeds(t *testing.T) {
	out := t.TempDir()
	if err := os.WriteFile(filepath.Join(out, "old-mosque.ics"), []byte("old feed"), 0o644); err != nil {
		t.Fatal(err)
	}
	entry := catalogMosque{ID: "current", Name: "Mosque <with> & characters", Feed: "current.ics", Events: []catalogEvent{}}
	if err := writeSite(out, []catalogMosque{entry}); err != nil {
		t.Fatal(err)
	}
	data, err := os.ReadFile(filepath.Join(out, "catalog.json"))
	if err != nil {
		t.Fatal(err)
	}
	var catalog struct {
		Version int             `json:"version"`
		Mosques []catalogMosque `json:"mosques"`
	}
	if err := json.Unmarshal(data, &catalog); err != nil {
		t.Fatal(err)
	}
	if catalog.Version != 1 || len(catalog.Mosques) != 1 || catalog.Mosques[0].ID != "current" || catalog.Mosques[0].Name != entry.Name {
		t.Fatalf("unexpected catalog: %+v", catalog)
	}
	if strings.Contains(string(data), "old-mosque") {
		t.Fatal("stale output file appeared in catalog")
	}
	for _, name := range []string{"index.html", "app.js", "styles.css"} {
		data, err := os.ReadFile(filepath.Join(out, name))
		if err != nil || len(data) == 0 {
			t.Fatalf("missing site asset %s: %v", name, err)
		}
	}
}
