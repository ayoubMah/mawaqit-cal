# mawaqit-cal

Your mosque's Mawaqit prayer times as a Google/Apple/Outlook calendar subscription, rebuilt daily.

The generator also writes a small static website: choose a generated mosque, preview today's times,
follow calendar-specific subscription instructions, and check that the prayers appear on your phone.
The interface supports French, English and Arabic (RTL); calendar event titles retain the existing format.

Mawaqit has no public API; each mosque page embeds its full-year timetable (`confData`), which this reads.
Events are `🕌 Fajr · iqama 06:40`, marked *free* (not busy), with stable UIDs so a time change updates
the event in place. Fridays show `🕌 Jumu'a 13:30` instead of Dhuhr.

## Use

```sh
go run . search creteil                              # find your mosque's slug
go run . -mosques mosquee-sahaba-creteil -out public # writes public/<slug>.ics
go test ./...
```

Flags: `-past 7` / `-future 60` days of events.
Mosque slugs must contain only lowercase letters, digits and hyphens. Duplicate entries are
ignored; the complete configuration is validated before any fetch or output directory creation.

## Local website preview

After generating the feed:

```sh
python -m http.server 8766 --bind 127.0.0.1 --directory public
```

Open `http://127.0.0.1:8766/`. The site assets live in `site/` and are embedded in the Go executable;
generation copies them to the ignored `public/` folder alongside `catalog.json` and the ICS feeds.
No npm dependencies or separate website build are required.

The catalog lists only mosques successfully generated in that invocation, not old ICS files left in
the output folder. Search matches mosque names and slugs, ignoring case and accents. Share a selection
with `?mosque=<slug>&lang=fr` (or `en` / `ar`). Today's preview uses the mosque's timezone, not the
viewer's timezone, and flags data checked more than 48 hours ago or a missing current day.
The preview catalog includes today and the next two local days, so it can outlive one missed daily
build. A missing preview is described separately from the subscription; the ICS rolling window is unchanged.
An unavailable or empty `?mosque=` shows a notice and requires an explicit choice; it never silently
substitutes another mosque. Google's phone instructions cover both its app and Apple's Calendar
app reading a Google account, including Google's calendar sync selection page.

Local subscription URLs are for preview only: Google/Outlook cannot fetch a feed from this laptop.
Apple's subscription launcher is disabled on loopback. On the published site the links use that
site's origin and path, so hosting under `/mawaqit-cal/` works without a hardcoded domain.

## Publish

GitHub Action (`.github/workflows/publish.yml`) runs daily and deploys `public/` to GitHub Pages.
Set the mosques in the workflow's `MOSQUES` env, and enable Pages with source **GitHub Actions**.

Subscribe in Google Calendar: *Other calendars → + → From URL* →
`https://ayoubmah.github.io/mawaqit-cal/<slug>.ics`

Google re-fetches subscribed feeds on its own schedule (roughly every 12–24 h); it cannot be forced.
A failed scrape fails the job and deploys nothing, so the last good feed stays up.

The existing workflow already publishes the entire generated `public/` folder; no workflow change
is needed for the website. Keep publication behind review. Mawaqit's agreement remains unresolved
for expanded public coverage or a hosted API; see `ROADMAP.md` and `NEXT_VERSION.md`.

Implementation pieces and the current review brief are in `CLAUDE_REVIEW.md`.

## Optional browser checks

With the local preview server running, install the QA-only dependency in the ignored folder:

```sh
npm install --prefix .local --no-save --no-package-lock playwright
node tests/browser.cjs
```

The script uses this workstation's Brave executable explicitly and writes screenshots to `.local/`.
It tests desktop/mobile layouts, FR/EN/AR, Google-on-iPhone guidance, unavailable mosque links,
clipboard fallback and timetable states. These tools are not needed to build or use the site.
Provider link routing in a logged-out or emulated browser does not prove signed-in subscription
behavior; live acceptance remains distinct from these checks.
