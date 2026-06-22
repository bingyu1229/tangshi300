# Tangshi300 Development Tracker

Last updated: 2026-06-22

## Current Phase

The app is in final v1 documentation and handoff polish. The major user-facing pages are complete enough for PR review, while test automation and final generated-audio validation remain the main release hardening tasks.

## Latest Validation

Latest verified command:

```powershell
npm run build
```

Result on 2026-06-22: passing.

## Completed

- Set up Next.js App Router project with TypeScript.
- Added `sql.js` local database setup and schema management.
- Added XML conversion and stable v1 sample generation.
- Added SQLite seed script with weighted search-term indexing.
- Added poem repository functions for listing, search, detail, daily recommendation, recent learning, review book, and test submission.
- Added API routes for poem search/listing, daily recommendation, detail, audio metadata, test submission, review-book listing, and review-book removal.
- Added search page support for `/search?q=...`.
- Added `/learn` route that redirects to today's test.
- Added four-item navigation: home, library, learn, and review book.
- Removed the previous profile-oriented navigation surface.
- Added stamp logo and reduced runtime image assets.
- Rebuilt the homepage around the ink-wash UI direction.
- Refined search/library, poem detail, review-book, and dictation test pages.
- Added progress ring with real percent rendering.
- Added actual recent-learning query from `learning_progress`.
- Added rotating homepage recommendations.
- Added `scripts/with-clean-path.ps1` and `npm run dev:clean-env` for duplicate Windows `PATH` sessions.
- Removed stale `doc/project-overview.md`.
- Added `doc/system-architecture.html` as the visual architecture handoff page.

## Page QA Checklist

Verified by implementation review:

- Header navigation has four tabs.
- Mobile bottom tabs mirror the main sections.
- Search form submits with `q`.
- Search page initializes from `q`, fetches updated results, filters client-side, highlights matches, and paginates.
- Status pill links to review book.
- Featured poem detail link points to `/poems/[id]`.
- Continue-learning tile points to `/poems/[id]/test`.
- Review-book tile points to `/review-book`.
- Poem detail shows artwork, metadata, audio, poem lines, notes, translation, and appreciation.
- Dictation test submits answers through the API and updates learning progress.
- Review-book removal moves poems back to `learning`.
- Progress percent is driven by actual data.
- Recent learning is not fake fallback data.
- Recommendations rotate client-side.

Needs browser/manual confirmation:

- Final desktop spacing across home, search, detail, review, and test pages.
- Final mobile bottom-tab feel.
- Recommendation rotation visual state.
- Search-result relevance for common real queries.
- Audio behavior with and without generated files.

## Known Gaps

- No automated smoke test suite yet.
- Real Qwen3-TTS audio generation is not fully verified end to end.
- Some generated audio files may exist locally but are ignored by git.
- Design reference screenshots are intentionally stored as large PNG files in `ui/`.

## Release Checklist

- Run `npm run prepare:v1`.
- Run `npm run build`.
- Manually test home search, `/learn`, poem detail, dictation submit, review-book removal, and audio fallback.
- Confirm whether audio files are generated locally or distributed separately.
- Confirm no generated SQLite, `.next`, audio, or log artifacts are included in the PR.
