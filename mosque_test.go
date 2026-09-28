package main

import (
	"strings"
	"testing"
	"time"
)

const page = `<script>
    var confData = {"label":"Test Mosque","timezone":"Europe/Paris","iqamaEnabled":true,"jumua":"13:30","jumua2":null,"jumua3":null,
    "calendar":[{},{},{},{},{},{},{},{},{"25":["06:30","07:43","13:47","16:58","19:47","20:55"],"26":["06:31","07:44","13:47","16:56","19:45","20:53"]},{},{},{}],
    "iqamaCalendar":[{},{},{},{},{},{},{},{},{"25":["+10","+10","+10","+5","20:10"],"26":["+10","+10","+10","+5","+5"]},{},{},{}]};
</script>`

func TestEvents(t *testing.T) {
	m, err := parseMosque(page)
	if err != nil {
		t.Fatal(err)
	}
	loc, _ := time.LoadLocation(m.Timezone)
	start := time.Date(2026, 9, 25, 0, 0, 0, 0, loc) // a Friday
	evs, err := m.events("test", start, 2, loc)
	if err != nil {
		t.Fatal(err)
	}
	if len(evs) != 10 {
		t.Fatalf("got %d events, want 10", len(evs))
	}

	fajr := evs[0]
	if fajr.Summary != "🕌 Fajr · iqama 06:40" {
		t.Errorf("fajr summary %q", fajr.Summary)
	}
	if got := fajr.Start.UTC().Format("15:04"); got != "04:30" { // CEST = UTC+2
		t.Errorf("fajr UTC start %s", got)
	}
	if !strings.Contains(fajr.Description, "Shuruq (sunrise) 07:43") {
		t.Errorf("fajr description %q", fajr.Description)
	}

	if evs[1].Summary != "🕌 Jumu'a 13:30" {
		t.Errorf("friday dhuhr %q", evs[1].Summary)
	}
	// Jumu'a 13:30 is before the 13:47 adhan: the event must start at 13:30.
	if got := evs[1].Start.In(loc).Format("15:04"); got != "13:30" {
		t.Errorf("jumua start %s", got)
	}
	if evs[4].Summary != "🕌 Isha · iqama 20:10" { // absolute iqama
		t.Errorf("isha summary %q", evs[4].Summary)
	}
	if evs[6].Summary != "🕌 Dhuhr · iqama 13:57" { // Saturday: plain Dhuhr
		t.Errorf("saturday dhuhr %q", evs[6].Summary)
	}
	if evs[0].UID == evs[5].UID {
		t.Error("UIDs must differ per day")
	}
}

func TestParseMissing(t *testing.T) {
	if _, err := parseMosque("<html>nothing</html>"); err == nil {
		t.Fatal("want error when confData is absent")
	}
}

func TestFold(t *testing.T) {
	s := "DESCRIPTION:" + strings.Repeat("é", 60)
	for _, l := range strings.Split(fold(s), "\r\n") {
		if len(l) > 75 {
			t.Fatalf("line of %d octets", len(l))
		}
	}
}
