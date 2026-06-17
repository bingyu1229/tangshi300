# Tangshi300 Project Plan

Last updated: 2026-06-18

## Goal

Tangshi300 is a local-first Next.js app for learning Tang poetry. The v1 loop is:

1. Recommend one poem for daily study.
2. Let the user search and browse the poem library.
3. Open poem detail pages for reading, audio, notes, translation, and appreciation.
4. Practice dictation from one line to the next.
5. Move learned poems into the review book.
6. Let the user review or remove poems from the review book.

## Current Status

The v1 core loop is implemented and `npm run build` passes.

Implemented:

- XML conversion and 50-poem sample seed.
- sql.js/SQLite local persistence.
- Daily recommendation.
- Indexed CJK/Latin poem search via `poem_search_terms`.
- Poem detail pages.
- Dictation test flow.
- Review book listing and removal.
- Browser speech/audio fallback.
- Ink-wash homepage redesign.

Still needs refinement:

- Search page visual/logic pass.
- Poem detail page visual/logic pass.
- Review book page visual/logic pass.
- Dictation page visual/logic pass.
- Automated smoke tests.
- Real Qwen3-TTS generation verification.

## Current Homepage Design

The homepage has been rebuilt around the UI reference assets in `ui/`.

Current homepage behavior:

- Uses the shared `AppNavigation` with four tabs: `首页`, `诗库`, `学习`, `复习册`.
- `学习` routes to `/learn`, which redirects to today's poem test.
- Search form submits to `/search?q=...`.
- Status pill links to `/review-book`.
- Featured poem card links to the poem detail page.
- Continue-learning tile links to today's test.
- Review-book tile links to `/review-book`.
- Progress ring uses real progress percent via a conic gradient.
- Recent learning reads actual `learning_progress` rows ordered by latest activity.
- Recommendation panel rotates in place with `换一批`.

Current homepage visual rules:

- Warm xuan-paper page background.
- Low-opacity ink card artwork is also used as a page background layer.
- Featured poem card uses `ui/poem-card-background-sm.png` as a soft, masked inner artwork layer.
- Featured thumbnail uses `ui/thumbnail-sm.png`.
- Brand seal uses `ui/stamp-logo-sm.png`.
- Body font uses `Noto Serif SC`; calligraphic accents use `Ma Shan Zheng`.
- Section ornaments after `今日推荐` and `学习数据` have been removed.
- Search button uses jade/teal blue.

## Runtime Assets

Runtime image assets:

- `ui/poem-card-background-sm.png`
- `ui/thumbnail-sm.png`
- `ui/stamp-logo-sm.png`

Reference/design assets:

- `ui/homepage.png`
- `ui/poem.png`
- `ui/search.png`
- `ui/review.png`
- `ui/test.png`
- `ui/visual-inkWash-preview.html`

The large source images are kept because `app/design-reference/page.tsx` imports the page screenshots for design QA.

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
- Homepage search opens `/search?q=...` with matching results.
- Navigation tabs route correctly.
- Today's learning CTA opens the test page.
- Review-book links open `/review-book`.
- Recent learning only shows actual progress records.
- Recommendation rotation changes visible poems when enough recommendations exist.
- Desktop and mobile layouts preserve card spacing and readable text.

## Next Work

1. Refine the search page and verify all filters/result links.
2. Refine the poem detail page and verify audio/detail/test actions.
3. Refine the review book page and verify removal and relearn actions.
4. Refine the dictation page and verify correct/incorrect states.
5. Add smoke tests for daily recommendation, search, detail, test submit, and review-book removal.
