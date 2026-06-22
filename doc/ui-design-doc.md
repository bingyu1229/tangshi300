# Tangshi300 UI Design Notes

Last updated: 2026-06-22

## Design Direction

Tangshi300 should feel like a quiet modern study desk on xuan paper: warm paper, restrained ink-wash scenery, cinnabar seals and primary actions, jade-blue search controls, and readable Chinese serif typography.

The interface stays task-first. Decoration should create atmosphere without slowing scanning, hiding controls, or reducing text contrast.

## Source References

Reference screenshots:

- `ui/homepage.png`
- `ui/poem.png`
- `ui/search.png`
- `ui/review.png`
- `ui/test.png`

Ink-wash prototype:

- `ui/visual-inkWash-preview.html`

Runtime assets:

- `ui/page-backgroud-sm.jpg`
- `ui/poem-card-background-sm.png`
- `ui/thumbnail-sm.png`
- `ui/thumbnail-2-sm.jpg`
- `ui/stamp-logo-sm.png`
- `ui/cloud.png`

## Visual Tokens

| Token | Value | Usage |
| --- | --- | --- |
| Paper | `#f8f4ea` | Page background |
| Paper soft | `#fffaf0` | Cards and inputs |
| Paper deep | `#e9dcc6` | Rails and quiet fills |
| Ink | `#17201d` | Primary text |
| Muted ink | `#6d665e` | Metadata and helper text |
| Cinnabar | `#b83a2e` | Active nav and primary study action |
| Jade teal | `#0d6678` | Search and secondary actions |
| Antique gold | `#c59a4a` | Small accents |
| Success | `#4b9a73` | Mastered/correct state |
| Danger | `#d1493f` | Remove/incorrect state |

## Typography

Use the font direction from `ui/visual-inkWash-preview.html`:

- Main readable Chinese text: `Noto Serif SC`, with `Songti SC`, `SimSun`, serif fallback.
- Poetic accents and poem titles: `Ma Shan Zheng`, with `STKaiti`, `KaiTi`, cursive fallback.
- Dense UI text should stay readable and quiet.
- Brush/calligraphic type is for titles and moments of emphasis, not for utility labels.

## Navigation

Production navigation has four items:

- Home: `/`
- Library: `/search`
- Learn: `/learn`
- Review book: `/review-book`

Desktop header should stay compact and centered around the app sections. Mobile uses the same four sections in the bottom tab bar.

Removed:

- Profile-oriented navigation.
- Avatar/dropdown surface.

## Page Guidance

### Home

- Keep the current ink-wash homepage as the baseline.
- Search submits to `/search?q=...`.
- Status pill opens the review book.
- Featured poem card opens poem detail.
- Continue-learning opens today's test.
- Recent learning uses real progress data.
- Recommendation list rotates client-side.
- Progress ring uses real review-book progress.

### Search / Library

- Keep the teal search button and calm result density.
- Query from `/search?q=...` must initialize the input and result list.
- Filter chips are interactive and reset pagination.
- Result cards use consistent thumbnail sizing, readable excerpts, and clear detail affordances.

### Poem Detail

- Brush/Kaiti title, serif metadata, and Kaiti poem lines should remain the typographic focus.
- Artwork is supportive, not dominant.
- Audio fallback controls remain visible near the poem header.
- Notes, translation, and appreciation stay compact and readable.

### Review Book

- Counts and progress are driven by real data.
- Remove actions are clear but visually quieter than primary study actions.
- Empty state should guide the learner back to study.

### Dictation Test

- The prompt line and answer field are the focus.
- Correct and incorrect states need distinct but restrained feedback.
- The next action should be obvious after submission.

## QA Checklist

- `npm run build` passes.
- Active nav state matches route.
- Header and bottom tabs do not overlap content.
- Home and search forms work with query strings.
- Progress rings show correct percentages.
- Cards preserve 8px radius and consistent spacing.
- Ink-wash imagery never reduces text contrast.
- Buttons fit text on mobile and desktop.
- Mobile layout remains readable without horizontal overflow.
- Print styles for poem detail stay clean and omit interactive chrome.
