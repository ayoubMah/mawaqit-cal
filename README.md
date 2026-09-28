# mawaqit-cal

Your mosque's Mawaqit prayer times as a Google/Apple/Outlook calendar subscription, rebuilt daily.

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

## Publish

GitHub Action (`.github/workflows/publish.yml`) runs daily and deploys `public/` to GitHub Pages.
Set the mosques in the workflow's `MOSQUES` env, and enable Pages with source **GitHub Actions**.

Subscribe in Google Calendar: *Other calendars → + → From URL* →
`https://ayoubmah.github.io/mawaqit-cal/<slug>.ics`

Google re-fetches subscribed feeds on its own schedule (roughly every 12–24 h); it cannot be forced.
A failed scrape fails the job and deploys nothing, so the last good feed stays up.
