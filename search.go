package main

import (
	"encoding/json"
	"fmt"
	"net/url"
)

// search prints mosques matching a name, city or postcode, with the slug to
// pass to -mosques.
func search(word string) error {
	body, err := fetch("https://mawaqit.net/api/2.0/mosque/search?word=" + url.QueryEscape(word))
	if err != nil {
		return err
	}
	var results []struct {
		Slug         string   `json:"slug"`
		Label        string   `json:"label"`
		Localisation string   `json:"localisation"`
		Times        []string `json:"times"`
	}
	if err := json.Unmarshal([]byte(body), &results); err != nil {
		return fmt.Errorf("decode search results: %w", err)
	}
	for _, r := range results {
		fmt.Printf("%-45s %s — %s\n  today: %v\n", r.Slug, r.Label, r.Localisation, r.Times)
	}
	return nil
}
