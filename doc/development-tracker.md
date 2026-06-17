# Tangshi300 Development Tracker

Last updated: 2026-06-18

## Current Phase

Homepage rebuild is complete enough for user testing. Next pages need the same logic-and-visual refinement pass one by one.

## Validation

Latest verified command:

```powershell
npm run build
```

Result: passing.

## Completed

- Set up Next.js App Router project with TypeScript.
- Added sql.js local database setup and schema.
- Added XML conversion and seed scripts.
- Added poem repository functions.
- Added daily recommendation, search, detail, review book, and test APIs.
- Added indexed search terms for CJK n-gram and Latin/number lookup.
- Added search page support for `/search?q=...`.
- Added `/learn` route that redirects to today's test.
- Added four-item navigation: `首页`, `诗库`, `学习`, `复习册`.
- Removed the previous `我的` navigation/profile surface.
- Added the actual stamp logo asset.
- Added reduced runtime image assets for homepage card artwork and thumbnail.
- Rebuilt homepage around the ink-wash UI direction.
- Added progress ring with real percent rendering.
- Added actual recent-learning query from `learning_progress`.
- Added rotating homepage recommendations.
- Added `scripts/with-clean-path.ps1` and `npm run dev:clean-env` for duplicate Windows `PATH` sessions.
- Removed stale `doc/project-overview.md`.

## Homepage QA Checklist

Verified by build and code review:

- Header navigation has four tabs.
- Search form submits with `q`.
- Status pill links to review book.
- Featured poem detail link points to `/poems/[id]`.
- Continue-learning tile points to `/poems/[id]/test`.
- Review-book tile points to `/review-book`.
- Progress percent is driven by actual data.
- Recent learning is not fake fallback data.
- Recommendations rotate client-side.

Needs browser/manual confirmation by user:

- Final visual spacing at desktop width.
- Final mobile bottom tab feel.
- Recommendation rotation visual state.
- Search-result relevance for real queries.

## Next Page Refinement Queue

1. Search/library page.
2. Poem detail page.
3. Review book page.
4. Dictation test page.
5. Design reference page cleanup after production pages are stable.

## Known Gaps

- No automated smoke test suite yet.
- Real Qwen3-TTS audio generation is not fully verified end to end.
- Some generated audio files may exist locally but are ignored by git.
- Design reference screenshots are still stored as large PNG files in `ui/`.
