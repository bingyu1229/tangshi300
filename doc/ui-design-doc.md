# Tangshi300 UI Design Notes

Last updated: 2026-06-18

## Design Direction

Tangshi300 should feel like a quiet modern study tool on xuan paper: warm paper, restrained ink-wash scenery, cinnabar seal details, jade-blue controls, and readable Chinese serif typography.

The UI should remain task-first. Decoration should create atmosphere without reducing scan speed or hiding controls.

## Source References

Reference screenshots:

- `ui/homepage.png`
- `ui/poem.png`
- `ui/search.png`
- `ui/review.png`
- `ui/test.png`

Ink-wash prototype:

- `ui/visual-inkWash-preview.html`

Runtime homepage assets:

- `ui/poem-card-background-sm.png`
- `ui/thumbnail-sm.png`
- `ui/stamp-logo-sm.png`

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

## Typography

Use the font direction from `ui/visual-inkWash-preview.html`:

- Main UI/readable Chinese text: `Noto Serif SC`, with `Songti SC`, `SimSun`, serif fallback.
- Poetic accents and poem titles: `Ma Shan Zheng`, with `STKaiti`, `KaiTi`, cursive fallback.
- Keep body text light and calm.
- Use brush/calligraphy sparingly for emphasis, not for dense UI labels.

## Navigation

Current production navigation has four items:

- `首页` -> `/`
- `诗库` -> `/search`
- `学习` -> `/learn`
- `复习册` -> `/review-book`

Removed:

- `我的`
- Profile/avatar dropdown

Desktop header should stay compact. Mobile uses the same four tabs in the bottom bar.

## Homepage Current State

The homepage has been refined and should be the baseline for the next page passes.

Behavior:

- Greeting follows current time.
- Search submits to `/search?q=...`.
- Status pill opens review book.
- Featured poem card opens poem detail.
- Continue-learning opens today's test.
- Review-book tile opens review book.
- Recent learning uses real progress data.
- Recommendation list rotates with `换一批`.

Visual:

- Same ink artwork is used subtly as a page background.
- Featured card uses masked card artwork that fades to transparent; no visible inner box line.
- Thumbnail and poem copy are centered within the card.
- Search button is teal-blue.
- Section headings `今日推荐` and `学习数据` do not use the previous gold ornament.
- Homepage runtime images are reduced-size `*-sm.png` assets.

## Next Page Refinement Notes

### Search Page

- Keep the teal search button.
- Make filter chips functional or visually disabled until functional.
- Ensure `/search?q=...` initializes the input and result list.
- Result cards should use consistent thumbnail sizing and readable excerpts.

### Poem Detail Page

- Align typography with homepage: brush title, serif body.
- Verify audio fallback controls.
- Verify start-test and review-book actions.
- Keep notes/translation/appreciation readable and compact.

### Review Book Page

- Replace fake dashboard counts with real data.
- Verify remove action updates the list.
- Keep destructive actions visually distinct but not dominant.

### Dictation Page

- Verify answer input, submit, correct state, incorrect state, and next action.
- Keep prompt line and answer field as typographic focus.

## QA Checklist

- `npm run build` passes.
- Active nav state matches route.
- Header and bottom tabs do not overlap content.
- Search form works from homepage and search page.
- Progress rings show correct percentages.
- Cards preserve 8px radius and consistent internal spacing.
- Ink-wash decorations never reduce text contrast.
- Mobile layout remains readable without horizontal overflow.
