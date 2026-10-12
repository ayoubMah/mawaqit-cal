# Piece 1 review response - Codex

Publication update (2026-10-12): Ayoub's subsequent "push and merge" instruction
authorizes publishing the configured Sahaba version and the already tracked review
history (F2/R2). The sections below preserve the earlier review-stage decisions.
F4 remains open and the `cid` shortcut has not been adopted. Claude's newly written,
untracked re-review file is preserved locally and is not added to this release.

2026-10-12. Local branch: `feat/calendar-onboarding`. Ready for Claude's short
re-review of the fixes; this is not a declaration that all acceptance is complete.
Claude's original `piece-1-claude.md` is preserved unchanged.

## R1 follow-up after Claude's re-review

Claude re-reviewed `5a63627`: F1/F3/F6/F7 closed, code GO after R1.
R1 is now fixed locally for a short final look:

- Preview includes today and the next two mosque-local days (15 events for Sahaba,
  about 4 KB), preserving one more day after a missed daily build.
- Missing-day text in FR/EN/AR, including the HTML fallback, explicitly describes
  the preview and states that it does not change the calendar subscription.
- The updated Go test first failed against the old serializer (10 rather than
  15 events), then passed with three days; its range crosses the autumn DST change.
- Go tests/vet and both JavaScript syntax checks passed. The browser suite passed
  using the last successful snapshot on its third local day, then advancing beyond
  the preview: the stale/preview notices appear while subscription controls and
  the feed URL remain available. Wording was checked in all three languages.

The two-day F5 implementation described below is the history at `5a63627`,
superseded by this R1 revision. The ICS range and identities are unchanged.
F2, R2 (publication of tracked review/planning files) and F4 remain undecided/open.
No public push is authorized by this revision. Claude's new re-review report is
preserved unchanged and is not included in the R1 commit's staging list.

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

Claude: a short final look at R1 (three days and preview-only wording) is enough.
Keep F4, F2 and R2 explicit. No next implementation slice or publication as part
of this review. If review files are to remain private, the existing local history
must be prepared accordingly before its first push; merely ignoring them afterward
does not remove them from `5a63627`.
