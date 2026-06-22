# Tangshi300 Project Plan

Last updated: 2026-06-22

## Goal

Tangshi300 is a local-first study app for learning Tang poetry with a calm, ink-wash interface. The v1 product loop is:

1. Recommend one poem for daily study.
2. Let the learner search and browse the poem library.
3. Open poem detail pages for reading, audio, notes, translation, and appreciation.
4. Practice recitation by entering the next line after a prompt line.
5. Move correctly answered poems into the review book.
6. Review mastered poems or remove them from the review book for relearning.

## Current Status

The v1 core loop is implemented and the main pages have been refined visually and functionally.

Implemented:

- XML conversion for the full corpus and stable 50-poem v1 sample.
- `sql.js` local SQLite persistence.
- Database schema for poems, audio metadata, learning progress, daily recommendations, and weighted search terms.
- Daily recommendation generation and persistence.
- Indexed CJK/Latin poem search via `poem_search_terms`, with fallback `LIKE` search.
- Polished home, search/library, poem detail, dictation test, and review-book pages.
- API routes for poems, daily recommendation, detail, audio metadata, test submission, review-book listing, and review-book removal.
- Browser speech/audio fallback.
- Ink-wash visual system based on runtime image assets in `ui/`.

Remaining v1 risks:

- Automated smoke tests are still missing.
- Real Qwen3-TTS generation needs final end-to-end verification.
- Generated audio files are intentionally ignored by git and must be produced or packaged separately for a full media release.

## Product Workflows

### Daily Study

- `/` calls `getDailyPoem()` and shows the current recommendation.
- `/learn` redirects to today's poem test.
- `/poems/[id]/test` loads a deterministic first-line prompt and submits answers through `/api/poems/[id]/test`.
- Correct answers mark the poem as `review_book`; incorrect answers mark it as `learning`.

### Search And Reading

- `/search?q=...` initializes the library search page with query results.
- `SearchClient` supports client-side filtering, pagination, highlighting, and fetch-based search refreshes.
- `/poems/[id]` presents the poem, artwork, metadata, audio, study actions, notes, translation, and appreciation.

### Review

- `/review-book` reads poems whose learning status is `review_book`.
- `ReviewBookClient` supports browsing, search/filter behavior, and removal.
- `/api/review-book/[poemId]/remove` moves a poem back to `learning`.

## System Architecture

```text
tangshi300.xml
  -> scripts/convert-tangshi-xml.ts
  -> data/tangshi300.json + data/tangshi300-v1-sample.json
  -> scripts/seed-db.ts
  -> data/tangshi300.sqlite
  -> lib/db/poems.ts
  -> App Router pages + API routes
  -> client components for search, testing, audio, and review actions
```

Key implementation boundaries:

- `lib/poems/import.ts` owns XML parsing and stable sampling.
- `lib/text.ts` owns search-term generation and answer normalization.
- `lib/db/sqlite.ts` owns schema creation, query helpers, and database persistence.
- `lib/db/poems.ts` owns poem, recommendation, progress, review, and audio access.
- `app/api/**` exposes JSON mutation/query endpoints for client components.
- `components/**` owns interactive client behavior.

See `doc/system-architecture.html` for the visual architecture map.

## Runtime Assets

Runtime image assets:

- `ui/page-backgroud-sm.jpg`
- `ui/poem-card-background-sm.png`
- `ui/thumbnail-sm.png`
- `ui/thumbnail-2-sm.jpg`
- `ui/stamp-logo-sm.png`
- `ui/cloud.png`

Reference/design assets:

- `ui/homepage.png`
- `ui/poem.png`
- `ui/search.png`
- `ui/review.png`
- `ui/test.png`
- `ui/visual-inkWash-preview.html`

The large reference images are kept because the design reference route imports screenshots for QA.

## Development Commands

```powershell
npm install
npm run prepare:v1
npm run dev
npm run build
```

Windows/Codex duplicate `PATH` helper:

```powershell
npm run dev:clean-env
```

## Acceptance Criteria

- `npm run build` passes.
- Home search opens `/search?q=...` with matching results.
- Header and mobile navigation route correctly.
- `/learn` opens today's dictation flow.
- Today's featured poem opens the detail page.
- Review-book links open `/review-book`.
- Recent learning shows actual `learning_progress` records.
- Recommendation rotation changes visible poems when enough recommendations exist.
- Review-book removal moves a poem back to `learning`.
- Desktop and mobile layouts preserve spacing, readable text, and action affordances.

## Next Work

1. Add smoke tests for daily recommendation, search, detail, test submit, and review-book removal.
2. Verify Qwen3-TTS generation and playback against the v1 sample.
3. Add data-quality reporting for missing notes, translations, and appreciation sections.
4. Decide whether generated audio should be distributed as release artifacts or generated locally.
