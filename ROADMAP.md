# Roadmap

> **Status: v0 works; everything below is planned, not started.**

## v0 (done)

- Reads the full-year timetable that every Mawaqit mosque page embeds and writes an `.ics` feed.
- 5 events per day titled `🕌 Fajr · iqama 06:44`, Jumu'a on Fridays, Shuruq in the Fajr details,
  events marked *free*, stable UIDs (so a time change moves the event instead of duplicating it),
  and a rolling window of −7/+60 days.
- A daily GitHub Action rebuilds the feed and deploys it to Pages. A failed scrape deploys nothing,
  so the last good feed stays up.

## Vision

Anyone picks their mosque on a page, clicks **Add to Google Calendar** (or Apple/Outlook), and gets
their mosque's own times, iqama included, updating by themselves. **Free, no ads.**

## Gate 0: Mawaqit's agreement

Mawaqit's API is private. A personal feed that fetches one page a day is fine. A public service
that covers many mosques is not, unless Mawaqit agrees.

- [ ] Contact Mawaqit: is a public ICS service OK, is there an endpoint to use instead of reading
      pages, and would they rather have this built into Mawaqit itself (it would reach far more people).
- If they decline, the project stays a self-hosted tool (Phase 1) and never becomes a public service.

## Phase 1: open-source tool

- [ ] LICENSE (MIT) and a README in French, English and Arabic: fork → set your mosque → subscribe.
- [ ] Options: which prayers, title = iqama or adhan, optional Shuruq/Imsak events, title language.
- [ ] Test fixtures from real mosque pages (absolute iqama, several Jumu'a, iqama disabled).
- **Done when:** someone forks it and has their mosque in their calendar without help.

## Phase 2: hosted service (only after Gate 0)

- [ ] Go HTTP service: `GET /m/<slug>.ics?lang=fr&title=iqama`, cached, **one Mawaqit fetch per
      mosque per day** however many subscribers.
- [ ] Landing page: search a mosque → **Add to Google / Apple / Outlook** buttons + copy link.
- [ ] Near-zero hosting cost, only anonymous counts, no personal data.
- **Done when:** 10 real users rely on it for 30 days without a break.

## Phase 3: growth

- [ ] Share it with mosques and Muslim student associations (e.g. a QR code on the mosque's screen).
- [ ] Alert when a feed hasn't refreshed in 48 h.
- [ ] Donations only, to cover hosting.

## Known limits

- Google refreshes subscribed calendars every ~12–24 h, and it can't be forced.
- Subscribed calendars don't reliably notify; keep the Mawaqit app for the adhan.
