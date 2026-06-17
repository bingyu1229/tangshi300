# Tangshi300

Tangshi300 is a local-first Next.js app for learning Tang poetry. It imports poems from `tangshi300.xml`, seeds a 50-poem v1 sample into SQLite, and provides a study loop around daily recommendations, search, poem detail pages, recitation tests, a review book, and audio playback fallback.

## Current Status

v1.0 is functionally usable for the core learning loop:

- XML conversion parses 321 poems and writes reproducible JSON outputs.
- v1 sample seeding writes 50 poems into the local SQLite database.
- The app includes home, search, poem detail, recitation test, and review book pages.
- API routes cover poem listing/search, daily recommendation, poem detail, test submission, review book listing/removal, and audio metadata.
- Browser speech synthesis works as the current audio fallback while cached Qwen3-TTS files are still pending.
- `npm run prepare:v1` and `npm run build` pass.
- The homepage has been rebuilt with the current ink-wash UI assets and real recent-learning/recommendation behavior.

The main incomplete v1 item is real Qwen3-TTS audio generation for the 50-poem sample.

## Local Development

```powershell
conda activate tangshi300
npm install
npm run prepare:v1
npm run dev
npm run dev:clean-env
```

Useful commands:

```powershell
npm run convert:data
npm run seed
npm run prepare:v1
npm run build
npm run audio:generate
```

## Project Structure

```text
app/                 Next.js App Router pages and API routes
components/          Reusable UI/client components
data/                Generated JSON data; local SQLite files are ignored
doc/                 Planning, tracker, and UI design docs
lib/                 Data access, import, text, and path helpers
scripts/             Node/TypeScript data and audio command wrappers
services/tts/        Python Qwen3-TTS generation entry point
types/               Local TypeScript declarations
```

## Documentation

- `doc/project-plan.md`: v1.0 scope, architecture, workflows, and acceptance criteria.
- `doc/development-tracker.md`: implementation progress and validation history.
- `doc/ui-design-doc.md`: current UI direction, homepage decisions, and next-page refinement notes.

## Optimization Priorities

1. Refine the search, poem detail, review book, and dictation pages one by one, using the homepage as the visual baseline.
2. Add automated smoke tests around import, seed, daily recommendation, answer checking, and review-book state changes.
3. Add a structured data-quality report for missing notes, translations, and appreciation sections.
4. Keep generated assets out of git unless they are intentional release artifacts: SQLite files, `.next`, logs, `node_modules`, and generated audio remain ignored.
5. Verify real Qwen3-TTS generation and playback end to end.
