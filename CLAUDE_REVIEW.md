# Claude review - piece 1

Publication update (2026-10-12): after the tested R1 fix in `2118177`, Ayoub explicitly
instructed "push and merge". That authorizes publishing the existing configured version
and its currently tracked history. The review narrative below records the earlier
review stage; F4's signed-in Google shortcut acceptance remains pending.

Status: Claude re-reviewed `5a63627`, closed F1/F3/F6/F7, and gave code GO after R1.
The R1 follow-up (three-day preview and preview-only missing-day text) is now ready
on local branch `feat/calendar-onboarding`. F2/R2 decisions and F4 live acceptance remain open.
Read `reviews/piece-1-codex-response.md` for the revision and unresolved decisions.
Ayoub's instruction: implement piece by piece, with Claude reviewing as the team partner.
The local branch isolates this piece from `main`. No push, merge, hosted Site
registration or deployment is authorized by this review handoff.

## Problem and resulting behavior

The existing tool generates calendar feeds, but another person has no guided way
to choose one, subscribe or fix phone visibility. This session demonstrated that
the same Google account can contain the feed while the phone does not display it.

The CLI now emits a static onboarding page and catalog together with the feeds.
Users select a generated mosque, preview today's events, follow Google / Apple /
Outlook subscription steps and explicitly check their phone. The interface uses
French, English or Arabic with RTL. Existing ICS event semantics and UIDs remain
unchanged; the website is a guide, not a new calendar integration or alarm app.

## Files to review

- `main.go`: gathers successful feed metadata; emits the site only after all
  configured mosque builds succeed; rejects an effectively empty mosque list.
- `site.go`: embeds the three site assets; serializes the same generated events,
  their mosque-local dates, source fetch/build timestamps and relative feed URLs.
- `site/index.html`, `site/styles.css`, `site/app.js`: responsive accessible page,
  catalog filtering, preview, languages, provider instructions, copy fallback,
  shareable mosque/language query, fresh-day rendering and failure states.
- `site_test.go`: catches UTC/local-day mistakes and accidental listing of stale
  feeds; confirms event fidelity and embedded asset output.
- `.gitignore`: ignores local QA tools/screenshots separately from generated output.
- `README.md`, `ROADMAP.md`, `NEXT_VERSION.md`: scope, usage and later proposal.

The website is buildless. Go remains standard-library-only. The existing workflow
needs no edit because its artifact is already the generated output folder.

## Verification

Run:

```sh
go test ./...
go vet ./...
node --check site/app.js
go run . -mosques mosquee-sahaba-creteil -out public
python -m http.server 8766 --bind 127.0.0.1 --directory public
```

Only the already configured Sahaba source page was fetched for the local build.
The first three commands passed. A headless Brave/Playwright check passed on:

The timezone regression test was also mutation-checked: temporarily grouping
events by their UTC date made it fail, and restoring mosque-local grouping made
it pass. The deliberately incorrect source was restored before this handoff.

- 1280 px desktop and 390/320 px mobile; French, English and Arabic/RTL.
- Accent-insensitive search, no results, provider changes and confirmation reset.
- Clipboard success and denied/unavailable fallback.
- HTTPS deployment under `/mawaqit-cal/`, correct webcal URL and loopback warning.
- A viewer in America/Los_Angeles seeing Paris's Oct 12 while their own date is Oct 11.
- A hostile-looking mosque label rendered as text, not HTML; selection preserves keyboard focus.
- Empty, unavailable, malformed, stale and missing-current-day catalog states.
- Zero browser JavaScript errors across those scenarios.

The reproducible browser helper is tracked at `tests/browser.cjs`; its optional
Playwright install and screenshots are ignored artifacts under `.local/`, not
runtime dependencies. Run `node tests/browser.cjs` while the server is running;
the optional installation command is in the README.

## Review focus and boundaries

1. Check that catalog and feed stay aligned, only configured feeds appear, and
   failure cannot reach the deploy job. The existing whole-build failure policy
   remains; per-mosque failure isolation is a future piece.
2. Check mosque-local day handling, UTC offsets, stale timestamps and long-open pages.
3. Check subscription instructions and actual provider URLs, including phone setup.
   No Google/Apple/Outlook account was modified in the browser checks. Live creation
   of new subscriptions still needs human/provider acceptance; the existing Sahaba
   subscription already works on Ayoub's phone.
4. Check Arabic text/RTL, keyboard use, smaller viewports, errors and copy fallback.
5. Check that no catalog-entry strings become HTML. External provider destinations
   are fixed; Mawaqit/feed URLs are generated by the CLI from configured slugs.

Search is limited to configured mosque names and slugs; full city/postcode discovery
is not implemented. No API/library extraction or per-user feed preferences here.
The old parked note is superseded for this local slice by Ayoub's current instruction.
Mawaqit's agreement remains unresolved for expanding hosted coverage or exposing
its timetable data through a public API. Nothing in this change sends them a message.

Please leave a review with findings, severity and file/line references in
`reviews/piece-1-claude.md`, then hand it back to Codex to address. Do not publish
this piece as part of reviewing it. Decide the next slice after this one is reviewed.
