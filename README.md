# Tangshi300

Tangshi300 is a local-first Next.js learning app for Tang poetry. It turns `tangshi300.xml` into a reproducible 50-poem v1 study set, persists study progress in SQLite through `sql.js`, and gives learners a complete loop for recommendation, search, reading, recitation practice, review, and audio playback.

## Current Status

v1 is ready for product review:

- The XML pipeline parses 321 poems and generates stable JSON outputs.
- `npm run prepare:v1` seeds a 50-poem SQLite sample with weighted search terms.
- The app includes polished home, search/library, poem detail, dictation test, and review-book pages.
- API routes cover poem listing/search, daily recommendation, poem detail, test submission, review-book listing/removal, and audio metadata.
- Browser speech synthesis works as the default audio fallback while generated Qwen3-TTS files remain optional release assets.
- The visual direction is consistent across the main app: warm paper, ink-wash imagery, cinnabar actions, jade search controls, and readable Chinese serif typography.

## Local Development

```powershell
conda activate tangshi300
npm install
npm run prepare:v1
npm run dev
```

If Windows or Codex sessions hit duplicate `PATH` entries, use:

```powershell
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
components/          Client components and reusable UI behavior
data/                Generated JSON data; local SQLite files are ignored
doc/                 Product, development, design, and architecture docs
lib/                 Data access, import, text, type, and path helpers
scripts/             Node/TypeScript data and audio command wrappers
services/tts/        Python Qwen3-TTS generation entry point
types/               Local TypeScript declarations
ui/                  Runtime and reference ink-wash image assets
```

## System Architecture

The app has four main layers:

1. Data preparation: `scripts/convert-tangshi-xml.ts` parses `tangshi300.xml` into full and v1-sample JSON.
2. Local persistence: `scripts/seed-db.ts` seeds `data/tangshi300.sqlite` with poems, search terms, and relinked audio metadata.
3. App runtime: App Router pages read from `lib/db/poems.ts`; client components call API routes for search, testing, and review-book mutations.
4. Media fallback: generated `/public/audio/*.wav|mp3` files are used when present; otherwise the browser audio client can synthesize speech.

Open the visual architecture map at `doc/system-architecture.html`.

## Documentation

- `doc/project-plan.md`: product goal, current scope, workflows, architecture summary, and acceptance criteria.
- `doc/development-tracker.md`: implementation state, validation history, remaining risks, and release checklist.
- `doc/ui-design-doc.md`: design direction, visual tokens, page guidance, and QA expectations.
- `doc/system-architecture.html`: vivid, self-contained architecture page for project handoff and PR review.

## Release Priorities

1. Add automated smoke tests around import, seed, daily recommendation, search, answer checking, and review-book state changes.
2. Verify real Qwen3-TTS generation and playback end to end for the 50-poem v1 sample.
3. Add a structured data-quality report for missing notes, translations, and appreciation sections.
4. Keep generated assets out of git unless they are intentional release artifacts: SQLite files, `.next`, logs, `node_modules`, and generated audio remain ignored.
