# Piece 1 review (Claude), 2026-10-12

**Verdict: CHANGES REQUESTED.** The code is solid and the brief's claims check out. There are
no correctness blockers in the Go code or the page's rendering. Two findings must be fixed before
this merges: the iPhone/Google instruction gap (F1) and the merge-equals-deploy decision (F2).
F3 and F4 are cheap to fix and belong in the same pass. Everything else is low.

Re-verified independently: `go test ./...` ok, `go vet ./...` ok, `node --check site/app.js` ok.
I read all of `main.go`, `site.go`, `site_test.go`, `site/index.html`, `site/app.js`, the
workflow and the doc diffs. I did not rerun the Brave/Playwright pass, touch any provider account,
commit, push or deploy.

## What holds (no action)

- **Catalog ↔ feed alignment.** Catalog entries come only from `build()` return values in this
  invocation (`main.go:52-59`). The site is written after all mosques succeed, and an empty list is
  rejected (`main.go:62-67`). A stale `.ics` in `public/` is not listed. I confirmed this locally,
  where `public/` still holds `mosquee-les-coteaux-creteil.ics` but `catalog.json` lists only
  Sahaba. CI starts from a clean checkout, so a failed build still never reaches `deploy`.
- **Mosque-local day.** `e.Start` is built in the mosque `loc`, so `Format(DateOnly)`
  (`site.go:40-44`) is the mosque date. The browser filters on `todayInTimezone(selected.timezone)`
  rather than the viewer's date. Times render with `timeZone: selected.timezone`. The JSON carries
  explicit offsets. The DST-boundary test is the right one.
- **Long-open page.** The 60 s re-render (`app.js:278`) correctly rolls the day over. Stale data
  (>48 h) and missing days both have visible states.
- **No HTML injection.** Every catalog string goes through `textContent`, and there is no
  `innerHTML` anywhere. `href`s are fixed or CLI-derived.
- **Event semantics unchanged.** `ics.go`/`mosque.go` are untouched, and UIDs and feed paths are the
  same, so the existing Sahaba subscription is unaffected.
- **Arabic.** `Intl` `ar` produces Latin digits here (`07:40`, `الاثنين، 12 أكتوبر 2026`), which
  matches the Latin digits in the event details. Replacement order in `localizeEventText` is
  correct ("— end of Fajr" is replaced before "Fajr").

## Findings

### F1 · Medium · The syncselect fix is in the wrong tab. It misses the exact failure this piece exists for.
`site/app.js:223`, `site/app.js:23,35,45` (google.phone steps)

The motivating incident was a feed that sat in the Google account but did not show on the phone. On
an **iPhone with a Google account in Apple Calendar**, a Google calendar added by URL stays hidden
until it is ticked on `calendar.google.com/calendar/syncselect`. The page shows that link **only on
the Apple tab**. A user on the Apple tab subscribed in Apple Calendar directly and never put the feed
in Google, so the link means nothing to them. A user on the **Google tab** who reads Google through
the iOS Calendar app follows steps that assume the Google Calendar app, and never sees syncselect.

Fix: in the Google tab's phone steps, add an iPhone branch along the lines of "On iPhone using the
built-in Calendar app: open syncselect, tick 'Salat · {name}', save". Show the syncselect link
when `provider === "google"`. Drop it (or the "if you use Google instead" step) from the Apple tab.

### F2 · Medium (decision for Ayoub, not code) · Committing to `main` publishes this piece.
`.github/workflows/publish.yml:7`

The workflow deploys on `push: branches: [main]`, so the commit after this review *is* the
publication the brief says not to do. Codex: commit on a branch and let Ayoub merge it explicitly.

Also: a public onboarding page invites people who are not Ayoub to subscribe. That is the vision
in the vault roadmap's **Phase 2**, which sits behind **Gate 0 (Mawaqit's agreement)**. With one
configured mosque, the marginal exposure over the already-public v0 `.ics` is small. Still, "a
landing page that invites the public" is a line Ayoub should cross knowingly, not by merging a
review. Please record his answer in `Projects/mawaqit-cal/roadmap.md` either way.

### F3 · Medium · An unknown `?mosque=` silently shows a different mosque.
`site/app.js:238`

`mosques.find(...) || mosques[0]` means that a shared link to a mosque that later leaves the config
(or has a typo) shows the first mosque's prayer times, and the page then rewrites the URL to match.
For prayer times, a silent substitution is worse than an error, because the user subscribes to the
wrong mosque without noticing. Fix: if `mosque` is present and not found, select nothing. Show a
"this mosque is no longer available, choose one below" notice and keep the list. Fall back to
`mosques[0]` only when no `mosque` parameter was given. Add the case to the browser check.

### F4 · Low-Medium · Use the Google `cid` deep link the roadmap specified.
`site/app.js:204`

The roadmap's Phase 2 design names `calendar.google.com/calendar/r?cid=<url-encoded feed>`. That
link opens Google's "Add calendar" prompt with the URL pre-filled, which removes the copy → find
"Other calendars" → paste steps (the riskiest part of the Google journey on a phone browser). Today
the button goes to `u/0/r/settings/addbyurl`, which also pins the *first* signed-in account, while
step 2 says to use "the account used on your phone". Please verify `cid` live on a desktop and on
an Android browser before switching. Keep the copy-paste steps as the fallback.

### F5 · Low · The catalog ships 68 days × 5 events per mosque, but the page reads only today.
`site.go:40-46`

`catalog.json` is 80 KB for one mosque (340 events, 7 of them past days). The page uses today's 5.
At 20 mosques that is ~1.6 MB on a phone before anything renders. It also makes the catalog a
bulk machine-readable copy of the timetable, the thing the brief says waits for Mawaqit. Emit
today + tomorrow (enough for the midnight rollover; the stale banner covers the rest). Keep the
existing date test.

### F6 · Low · Validate and deduplicate slugs.
`main.go:47-52`, `main.go:98`

The slug is concatenated into a fetch URL, `filepath.Join(out, slug+".ics")`, and the catalog `feed`.
A value like `../x` writes outside `-out`, and `a,a` produces two catalog entries with the same
`id`. The input is config-controlled, so this is hygiene rather than a vulnerability. A
`^[a-z0-9-]+$` check plus a seen-set costs four lines.

### F7 · Low · Outlook link covers personal accounts only.
`site/app.js:206`

`outlook.live.com` serves personal Microsoft accounts. Work and school users need
`outlook.office.com/calendar`. One line in the Outlook steps is enough.

### F8 · Low · No test pins the main-level failure policy.
`main.go:62-70`

The "site only after every mosque succeeds" rule is the property the deploy job depends on. It is
covered only by reading the code. If `main` is extracted to `run(slugs, out, fetch) error` with an
injectable fetcher, one table test (one OK + one failing slug → error and no `catalog.json`)
locks it in. Phase 1's fixture work needs that seam anyway.

### Nits (take or leave)
- The default language is always `fr`. `navigator.language` starting with `ar`/`en` could choose the
  initial value when there is no `?lang=`.
- `aria-labelledby` on the `.preview` `<div>` (`index.html:49`) does nothing without a role. Use
  `<section>` or `role="region"`.
- The translation key `khutba` holds "Jumu’a". Rename it to `jumua` for whoever edits it next.
- `writeURL` adds `?lang=fr` on first load, before the user has chosen anything. That is harmless
  but makes every shared link carry a language.

## Asked of Codex

Fix F1, F3, F4 (after live verification) and F6. F5, F7, F8 and the nits are optional in this
pass. Leave F2 to Ayoub. Re-run the browser check, including the unknown-mosque case. Then hand
piece 1 back for a short re-review before the next slice.
