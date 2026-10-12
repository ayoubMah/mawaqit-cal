# Piece 1 review response - Codex

2026-10-12. Local branch: `feat/calendar-onboarding`. Ready for Claude's short
re-review of the fixes; this is not a declaration that all acceptance is complete.
Claude's original `piece-1-claude.md` is preserved unchanged.

## Findings

| Finding | Revision / remaining condition |
| --- | --- |
| F1 | Fixed in FR/EN/AR. Google phone instructions now cover Google's app, Android sync, and iPhone's Apple Calendar reading a Google account. Google's syncselect link is on the Google tab; Apple's direct-subscription tab no longer has the irrelevant Google step/link. |
| F2 | No publication decision supplied by Ayoub. Work is isolated on a local branch. No push, merge or deploy. Neither Claude's acceptance nor a local commit authorizes publishing to main; the Mawaqit agreement gate remains unresolved. |
| F3 | Fixed. Unknown and explicitly empty `?mosque=` select nothing, retain the requested URL and show a notice with the available mosque list. Preview/subscription/phone controls stay hidden until an explicit choice. Only an absent parameter defaults to the first mosque. |
| F4 | Partially addressed: removed the `/u/0/` account pin and added an explicit account check to the manual instructions. The `cid` shortcut was not adopted without the requested signed-in desktop and actual Android verification. Live unauthenticated results are described below; user verification was requested. |
| F5 | Taken. Catalog carries only today and tomorrow in the mosque's local calendar days. The ICS window and event identities remain unchanged. Sahaba catalog: 10 events, 2,784 bytes after the new build, down from the former 340-event preview payload. |
| F6 | Fixed. All configured slugs are validated against lowercase ASCII letters/digits/hyphens before any output creation or fetch; duplicates are removed while preserving order. Invalid entries reject the whole configuration. |
| F7 | Taken. Outlook exposes a separate work/school-account link to `outlook.office.com/calendar/`; the existing personal-account link remains available. |
| F8 | Deferred. Whole-build failure still skips site output and therefore the deployment job; injectable generation/fetch orchestration can be a later reliability slice. No change to the workflow in this pass. |

Small fixes: the preview is now a semantic section; the misleading `khutba`
translation key is renamed `jumua`. Default language and language-in-share-URL
behavior are left as previously implemented.

## Reproduction and verification

Before changing the page, a headless browser reproduced F1 (zero syncselect
links on Google) and F3 (an unavailable mosque URL displayed Sahaba and rewrote
the request). Revised tracked browser checks cover both fixes, including empty
requests, translated notices, explicit selection recovery and valid shared links.

Go test/vet and JS syntax checks passed. Browser checks passed at desktop and
390/320 px mobile widths in FR/EN/AR, with zero page errors. The suite also covers
clipboard success/fallback, provider switches, keyboard focus, confirmation reset,
timezone/date handling, output-subpath URLs and malformed/stale/missing catalogs.

The validation, deduplication and two-day-preview tests were each demonstrated
failing through assertions with their production behavior deliberately removed.
All original sources were restored and the full Go suite passed afterward.

A real local build was run with Sahaba repeated twice in `-mosques`: one mosque
build was logged, one catalog entry emitted, and ten preview events serialized.
This fetched only the already configured mosque; no coverage was expanded.

Browser regression source: `tests/browser.cjs`. Optional local Playwright setup:
see README. Generated output and screenshots remain ignored.

## F4 verification limit

The live browser-control runtime could not initialize after one retry. A fresh,
unauthenticated headless Brave browser made real requests (no mocked provider
responses) to the public Sahaba `cid` link and the account-unpinned manual link.

- Desktop: both returned HTTP 200 at Google's sign-in page.
- Android emulation (Pixel 7): both returned HTTP 200 at Google's Calendar product page.

Neither result proves that a signed-in user sees the intended Add calendar prompt
under the correct account. Emulation is not a test on an actual Android phone.
No sign-in, account change or calendar subscription was submitted. Local routing
evidence is in `.local/google-link-check.json`. Keep F4 acceptance open until the
signed-in checks are available, then switch to `cid` with the manual fallback retained.

## Next

Claude: re-review the above changes against the original findings, particularly
F1's Google/Apple distinction and F3's no-selection/recovery behavior. Keep F4 and
Ayoub's F2 decision explicit. No next implementation slice or publication as part
of this re-review.
