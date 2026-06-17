# Tangshi300 Project Overview

Last reviewed: 2026-06-16

## Summary

Tangshi300 is a local-first poetry learning app built with Next.js, React, TypeScript, sql.js/SQLite, and a Python TTS toolchain. The current v1.0 implementation focuses on a complete single-user learning loop over a 50-poem sample from `tangshi300.xml`.

## What Works Now

- Data import parses `tangshi300.xml` into structured poem records.
- A stable v1 sample of 50 poems is generated in `data/tangshi300-v1-sample.json`.
- `scripts/seed-db.ts` creates and refreshes the local sql.js SQLite database.
- The home page shows a daily recommendation and entry points for search, review, and audio.
- Search supports title, author, genre, content, notes, translation, and appreciation.
- Poem detail pages show core metadata, poem lines, notes, translation, appreciation, and audio controls.
- Recitation tests compare normalized answers against the next line of the poem.
- Passing a test moves the poem into the review book.
- Review-book poems are excluded from new daily recommendation candidates.
- Review-book entries can be removed and returned to learning status.
- Browser speech synthesis provides a fallback until generated Qwen3-TTS audio files exist.

## Validation Snapshot

Commands run successfully on 2026-06-16:

```powershell
npm run prepare:v1
npm run build
```

Observed results:

- Parsed poems: 321.
- v1 sample poems: 50.
- Poems with missing detail sections: 28.
- Production build completed successfully with Next.js dynamic routes and API routes.

## Architecture Notes

- `app/` contains App Router pages and API routes.
- `lib/db/sqlite.ts` owns schema creation, sql.js database loading, and persistence.
- `lib/db/poems.ts` owns poem queries, daily recommendation, review-book state, and recitation submission.
- `lib/poems/import.ts` owns XML parsing, section extraction, stable IDs, and stable sampling.
- `components/` contains small UI/client components for cards, search, tests, review removal, and audio.
- `services/tts/generate_audio.py` is the Qwen3-TTS generation entry point.

## Optimization Review

### 1. Search scalability

Status: improved on 2026-06-17.

Search now uses a generated `poem_search_terms` inverted index instead of scanning seven poem text columns for every request. The seed step normalizes searchable fields into CJK single-character, bigram, trigram, and Latin/number terms, stores them with per-field weights, and the query path ranks matches with indexed term lookups.

Why this approach: the current `sql.js` package exposes FTS4 but not FTS5, and direct verification showed the available FTS tokenizer does not behave well for Chinese n-gram search. A plain indexed term table is more portable and keeps Chinese substring search predictable in this runtime.

Fallback: if the term index is empty or unavailable, `searchPoems` still falls back to the previous `LIKE` search.

### 2. Data quality visibility

The import command reports that 28 parsed poems are missing at least one detail section, but it only prints a count.

Recommendation: write a small import report with poem ID, title, author, and missing fields so content cleanup can be reviewed deliberately.

### 3. Test coverage

The project currently relies on `prepare:v1`, `build`, and manual/function-level smoke checks. The highest-value automated tests are pure and do not need a browser.

Recommendation: add tests for `splitPoemLines`, `normalizeAnswer`, `parseTangshiXml`, `pickStableSample`, daily recommendation filtering, test submission, and review-book removal.

### 4. Persistence model

The current sql.js setup rewrites the whole database file on persistence. That is simple and suitable for local v1, but it is not a production concurrency model.

Recommendation: keep this for local v1, but switch to native SQLite or a hosted database before multi-user or cloud deployment work.

### 5. TTS generation

The TTS path is correctly isolated behind a Python script and an npm wrapper, but real audio generation remains the biggest incomplete release task.

Recommendation: validate one generated poem end to end, then run the 50-poem batch in small chunks with `--start` and `--count`, committing only intentional release audio if the repository should carry generated media.

### 6. Configuration

Paths are centralized in `lib/paths.ts`, but they are currently fixed to project-relative defaults.

Recommendation: only add environment overrides when deployment or alternate data directories become real needs. Until then, the current explicit paths are easier to reason about.

## Recommended Next Steps

1. Generate and validate one Qwen3-TTS audio file end to end.
2. Add a minimal automated test harness for import/text/database learning logic.
3. Add an import quality report for missing detail sections.
4. Load-test indexed search with the full parsed corpus before increasing the visible app sample.
5. Decide whether generated audio belongs in git for v1 release or should be produced locally after checkout.
