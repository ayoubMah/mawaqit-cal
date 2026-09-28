package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"regexp"
	"strconv"
	"strings"
	"time"
)

// mosque is the subset of Mawaqit's confData we use.
type mosque struct {
	Label    string `json:"label"`
	Timezone string `json:"timezone"`
	// Calendar[month]["day"] = [fajr, shuruq, dhuhr, asr, maghrib, isha]
	Calendar []map[string][]string `json:"calendar"`
	// IqamaCalendar[month]["day"] = 5 entries, either "+10" (minutes after
	// adhan) or an absolute "HH:MM".
	IqamaCalendar []map[string][]string `json:"iqamaCalendar"`
	IqamaEnabled  bool                  `json:"iqamaEnabled"`
	Jumua         *string               `json:"jumua"`
	Jumua2        *string               `json:"jumua2"`
	Jumua3        *string               `json:"jumua3"`
}

var confDataRe = regexp.MustCompile(`(?s)confData\s*=\s*(\{.*?\});\s*\n`)

func parseMosque(html string) (*mosque, error) {
	match := confDataRe.FindStringSubmatch(html)
	if match == nil {
		return nil, errors.New("confData not found: Mawaqit page layout changed or slug is wrong")
	}
	var m mosque
	if err := json.Unmarshal([]byte(match[1]), &m); err != nil {
		return nil, fmt.Errorf("decode confData: %w", err)
	}
	if len(m.Calendar) != 12 {
		return nil, fmt.Errorf("calendar has %d months, want 12", len(m.Calendar))
	}
	if m.Timezone == "" {
		m.Timezone = "Europe/Paris"
	}
	if m.Label == "" {
		m.Label = "Mosque"
	}
	return &m, nil
}

type event struct {
	UID         string
	Summary     string
	Description string
	Start, End  time.Time
}

// Index into a calendar day: shuruq (1) is sunrise, not a prayer.
var prayers = []struct {
	name  string
	idx   int // position in Calendar day
	iqama int // position in IqamaCalendar day
}{
	{"Fajr", 0, 0},
	{"Dhuhr", 2, 1},
	{"Asr", 3, 2},
	{"Maghrib", 4, 3},
	{"Isha", 5, 4},
}

func (m *mosque) events(slug string, start time.Time, days int, loc *time.Location) ([]event, error) {
	var out []event
	for i := 0; i < days; i++ {
		day := start.AddDate(0, 0, i)
		key := strconv.Itoa(day.Day())
		times := m.Calendar[day.Month()-1][key]
		if len(times) != 6 {
			return nil, fmt.Errorf("%s: expected 6 times, got %v", day.Format("2006-01-02"), times)
		}
		var iqamas []string
		if m.IqamaEnabled && len(m.IqamaCalendar) == 12 {
			iqamas = m.IqamaCalendar[day.Month()-1][key]
		}
		sunrise := times[1]

		for _, p := range prayers {
			adhan, err := at(day, times[p.idx], loc)
			if err != nil {
				return nil, err
			}
			name := p.name
			var jumua []string
			if p.name == "Dhuhr" && day.Weekday() == time.Friday && m.Jumua != nil {
				name = "Jumu'a"
				for _, j := range []*string{m.Jumua, m.Jumua2, m.Jumua3} {
					if j != nil && *j != "" {
						jumua = append(jumua, *j)
					}
				}
			}

			e := event{
				UID:   fmt.Sprintf("%s-%s-%s@mawaqit-cal", slug, day.Format("20060102"), strings.ToLower(p.name)),
				Start: adhan,
				End:   adhan.Add(15 * time.Minute),
			}
			var desc []string
			desc = append(desc, "Adhan "+times[p.idx])

			switch {
			case len(jumua) > 0:
				e.Summary = fmt.Sprintf("🕌 %s %s", name, strings.Join(jumua, " / "))
				// Jumu'a is often set before the Dhuhr adhan, so the event runs
				// from the first khutba to the end of the last one + prayer.
				first, err := at(day, jumua[0], loc)
				if err != nil {
					return nil, err
				}
				last, err := at(day, jumua[len(jumua)-1], loc)
				if err != nil {
					return nil, err
				}
				e.Start, e.End = first, last.Add(45*time.Minute)
				desc = append(desc, "Jumu'a "+strings.Join(jumua, " / "))
			case p.iqama < len(iqamas):
				iq, err := iqamaTime(adhan, iqamas[p.iqama], loc)
				if err != nil {
					return nil, err
				}
				e.Summary = fmt.Sprintf("🕌 %s · iqama %s", name, iq.Format("15:04"))
				e.End = iq.Add(10 * time.Minute)
				desc = append(desc, "Iqama "+iq.Format("15:04"))
			default:
				e.Summary = "🕌 " + name
			}
			if p.name == "Fajr" {
				desc = append(desc, "Shuruq (sunrise) "+sunrise+" — end of Fajr")
			}
			desc = append(desc, m.Label)
			e.Description = strings.Join(desc, "\n")
			out = append(out, e)
		}
	}
	return out, nil
}

// at parses "HH:MM" on the given day in loc.
func at(day time.Time, hhmm string, loc *time.Location) (time.Time, error) {
	t, err := time.Parse("15:04", strings.TrimSpace(hhmm))
	if err != nil {
		return time.Time{}, fmt.Errorf("bad time %q on %s", hhmm, day.Format("2006-01-02"))
	}
	return time.Date(day.Year(), day.Month(), day.Day(), t.Hour(), t.Minute(), 0, 0, loc), nil
}

func iqamaTime(adhan time.Time, v string, loc *time.Location) (time.Time, error) {
	v = strings.TrimSpace(v)
	if strings.HasPrefix(v, "+") {
		n, err := strconv.Atoi(v[1:])
		if err != nil {
			return time.Time{}, fmt.Errorf("bad iqama offset %q", v)
		}
		return adhan.Add(time.Duration(n) * time.Minute), nil
	}
	return at(adhan, v, loc)
}
