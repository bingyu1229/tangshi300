# Tangshi300 UI Design Document

Source references:

- `UI/homepage.png` - 1448 x 1086
- `UI/poem.png` - 1448 x 1086
- `UI/search.png` - 1448 x 1086
- `UI/review.png` - 1448 x 1086
- `UI/test.png` - 1448 x 1086
- `UI/visual-inkWash-preview.html` - ink-wash motion/style prototype
- Reference implementation page: `app/design-reference/page.tsx`

## 1. Product Direction

Tangshi300 is a Chinese poetry learning app with a warm, scholarly, ink-wash interface. The design should feel like a modern study tool built on top of xuan paper, brush ink, cinnabar seals, jade-blue scholar objects, and antique gold ornament.

The UI is task-first rather than decorative-first. Every page supports a learning job: discover a poem, read and understand it, recite or write it from memory, then manage review. Decorative elements must support calm focus and literary atmosphere without hiding controls or reducing scan speed.

## 2. Global Visual System

### 2.1 Canvas and Texture

- Main canvas: warm cream paper, close to `#F8F4EA`.
- Secondary paper: near-white cream, close to `#FFFAF0`.
- Borders and dividers: beige/gold-brown with low opacity.
- Texture: faint xuan-paper grain through subtle repeating noise.
- Background overlays: soft ink-wash mountains, bamboo silhouettes, pagodas, and mist. These appear mostly at page edges or behind hero content with very low contrast.
- Avoid saturated full-bleed color fields except primary action cards/buttons.

### 2.2 Color Tokens

| Token | Approx. value | Usage |
| --- | --- | --- |
| Paper | `#F8F4EA` | Page background, cards, phone interior |
| Paper soft | `#FFFAF0` | Inputs, elevated cards, panels |
| Paper deep | `#E9DCC6` | Borders, quiet fills, progress rails |
| Ink | `#17201D` | Main text, poem titles, nav icons |
| Muted ink | `#6D665E` | Metadata, helper text, inactive controls |
| Cinnabar | `#B83A2E` | Active nav, primary actions, highlights, brand `300` |
| Dark cinnabar | `#8E2B24` | Button pressed state and gradients |
| Jade teal | `#0D6678` | Search button, secondary actions, section headings |
| Antique gold | `#C59A4A` | Ornaments, progress accents, flower dots, small icons |
| Success green | `#4B9A73` | Correct answer, mastered state |
| Destructive red | `#D1493F` | Remove actions and warning outlines |

### 2.3 Typography

- Brand: Latin serif for `Tangshi`, red serif `300`, plus a vertical red seal.
- App text: Chinese serif, such as `Noto Serif SC`, `Songti SC`, `SimSun`, with Georgia fallback for Latin.
- Poem titles: large, dark, high-contrast serif or calligraphic display style.
- Poem body: larger than standard UI text, generous line height, clear punctuation.
- UI labels: compact Chinese serif, medium weight.
- Do not use negative letter spacing. Keep all Chinese text readable at mobile widths.

### 2.4 Shape, Depth, and Spacing

- Card radius: 8px.
- Buttons and inputs: 6-8px radius.
- Borders: 1px beige/gold-brown.
- Shadow: soft, warm brown, low opacity; strongest on browser/phone mockups and hero cards.
- Desktop content width: about 1160-1200px.
- Mobile content width: full viewport minus 24-32px side padding.
- Dense operational areas, such as search results and review rows, should be compact but not cramped.

## 3. Global App Frame

### Desktop

The screenshots present the product inside a light desktop browser frame:

- Rounded browser window.
- Mac traffic-light dots.
- Back and forward chevrons.
- Address bar with lock icon and `tangshi300.com`.
- Share and plus controls at top right.

This browser chrome is a presentation wrapper in the design images, not necessarily part of the app UI. It should be used for reference/mockups, screenshots, or marketing captures.

### Mobile

Every design image includes a mobile phone mockup:

- Rounded white device frame.
- Status bar showing `9:41`, signal, Wi-Fi, battery.
- Top app area with Tangshi300 wordmark and hamburger menu.
- Bottom tab bar on most app screens.

The phone frame is also a presentation wrapper, but the mobile top header and bottom tabs are actual responsive UI behavior.

## 4. Navigation System

### Desktop Navigation

Items visible in screenshots:

- `首页` with home icon
- `诗库` with scroll/book icon
- `学习` with open-book icon
- `复习册` with calendar/book icon
- `我的` with user icon
- Avatar with dropdown chevron

Behavior:

- Active item uses cinnabar text/icon and a cinnabar underline.
- Inactive items use dark muted ink.
- Icons sit left of labels.
- Header background remains paper-toned, not dark.
- Header includes brand on the left and account controls on the right.

### Mobile Navigation

Top:

- Tangshi300 wordmark.
- Hamburger menu at top right.

Bottom tabs:

- `首页`
- `诗库`
- `学习`
- `复习册`
- `我的`

Behavior:

- Active tab uses cinnabar icon and label.
- Inactive tabs use ink/dark gray.
- The bar is fixed at the bottom with a top border and paper background.

## 5. Common Components

### 5.1 Brand

Elements:

- `Tangshi` black serif.
- `300` cinnabar red.
- Small vertical seal mark beside logo.

Rules:

- The wordmark must be a first-viewport signal.
- On mobile, it remains in the top header, left aligned.

### 5.2 Search Bar

Elements:

- Leading magnifying-glass icon.
- Placeholder: `搜索题目、作者、关键词或诗句`.
- Teal search button labelled `搜索`.
- Desktop: wide horizontal input with attached or adjacent button.
- Mobile: compact input and small teal button.

Rules:

- Input height should be at least 44px.
- Search button should be visually stronger than filter chips.
- Focus state uses jade/teal outline or glow.

### 5.3 Filter Chips and Tags

Filter chips:

- `全部`
- `标题`
- `作者`
- `关键词`
- `诗句`

Review category chips:

- `全部`
- `五言律诗`
- `五言绝句`
- `七言绝句`

Poem tags:

- `五言绝句`
- `思乡`
- `月亮`
- `唐诗三百首`
- `春天`
- `自然`
- `登高`
- `励志`
- `思念`
- `爱情`

Rules:

- Active filter chip uses cinnabar border/text and very light red fill.
- Inactive chips use beige borders and muted ink.
- Poem tags use jade/teal border/text and very light teal fill.

### 5.4 Buttons

Primary:

- Cinnabar gradient.
- White text.
- Slight inset highlight.
- Used for `继续学习`, `开始默写`, `下一题`.

Secondary:

- Paper fill.
- Teal outline/text.
- Used for `复习册`, `加入复习册`, `查看解析`, `重新学习`.

Destructive:

- Paper or very pale red fill.
- Red outline/text.
- Trash icon.
- Used for `从复习册移除` and `移除`.

Utility:

- Share, print, favorite, sort, batch management.
- Usually icon plus label, minimal fill.

### 5.5 Cards

Rules:

- Radius: 8px.
- Border: beige/gold-brown.
- Background: cream paper.
- Shadows should be soft and warm.
- Repeated cards should not be nested in large decorative cards.

Card types:

- Featured poem card.
- Search result card.
- Review row card.
- Progress/stat card.
- Action tile.
- Reminder card.
- Accordion card.

### 5.6 Progress Components

Progress ring:

- Shows `60%`.
- Ring uses red current progress and beige remaining progress.
- Used in homepage and review-book overview.

Linear test progress:

- Label: `第 2 / 4 题`.
- Red completed segment.
- Beige remaining rail.
- Small arrow/dot endpoints.

Stat tiles:

- Icon, label, number, unit.
- Examples: `已掌握 28 首`, `学习中 16 首`, `复习册 28 首`, `累计学习 37 天`.

### 5.7 Poem Artwork

Artwork style:

- Ink-wash landscape.
- Muted gray-blue palette.
- Occasional warm window light or moon.
- Rounded rectangle crop.

Usage:

- Large artwork on detail page.
- Medium artwork on homepage recommendation.
- Small thumbnails in search/review lists.
- Magnifier icon overlay on large detail artwork.

## 6. Screen Specifications

## 6.1 Homepage (`UI/homepage.png`)

Purpose: daily learning dashboard.

Desktop elements:

- Browser frame with address bar.
- Brand wordmark and seal.
- Top nav with `首页` active.
- Avatar and dropdown.
- Greeting: `午安，诗友` plus gold flower dot.
- Encouragement copy: `每天进步一点点，诗心自明。`
- Status pill: `你已掌握 28 首，复习册中有 28 首` with document icon and chevron.
- Search bar.
- Section heading: `今日推荐` with gold divider ornament.
- Featured poem card:
  - Ink-wash image.
  - Favorite star.
  - Title: `静夜思`.
  - Author/dynasty: `李白 【唐代】`.
  - Lines: `床前明月光，疑是地上霜。举头望明月，低头思故乡。`
  - Tags: `五言绝句`, `思乡`.
  - Link: `查看详情`.
  - Carousel dots, first dot active red.
- Right action tile: `继续学习`.
  - Brush icon.
  - Text: `今日计划：学习 3 首`.
  - Chevron.
- Right secondary tile: `复习册`.
  - Book icon.
  - Text: `复习 28 首`.
  - Chevron.
- Learning progress card:
  - Heading: `今日学习进度`.
  - Ring: `60%`.
  - Text: `已学 3 首`, `目标 5 首`, `连续学习 7 天` with flame.
- Learning data section:
  - `已掌握 28 首`
  - `学习中 16 首`
  - `复习册 28 首`
  - `累计学习 37 天`
- Recent learning list:
  - `登鹳雀楼`, `春晓`
  - Time values such as `今日 10:23`, `今日 09:41`
  - Mastered status with green check.
- Recommendation list:
  - `望庐山瀑布`
  - `相思`
  - `江雪`
  - `换一批` action.

Mobile elements:

- Phone frame and status bar.
- Top wordmark and hamburger.
- Greeting, status pill, search bar.
- Condensed featured poem card.
- Continue and review action tiles.
- Progress card.
- Bottom tab bar with `首页` active.

## 6.2 Poem Detail (`UI/poem.png`)

Purpose: read, listen, understand, collect, share, print, and start dictation.

Desktop elements:

- Browser frame.
- Top nav with `诗库` active.
- Breadcrumb: `首页 > 诗库 > 静夜思`.
- Large poem image with magnifier button.
- Title: `静夜思`.
- Favorite star and `收藏`.
- Metadata: `李白 【唐代】`, tag `五言绝句`.
- Audio player:
  - Circular play button.
  - Progress dot and rail.
  - Timestamp: `00:00 / 00:32`.
  - Volume icon.
- Poem text:
  - `床前明月光，`
  - `疑是地上霜。`
  - `举头望明月，`
  - `低头思故乡。`
- Utility row:
  - `分享` with share icon.
  - `打印` with printer icon.
- Primary button: `开始默写`.
- Secondary button: `加入复习册`.
- Accordions:
  - `注释`, expanded, book icon, chevron.
  - `译文`, expanded, book icon, chevron.
  - `赏析`, expanded, appreciation icon, chevron.
- Text inside 注释:
  - `床前：井上的栏杆，这里指井。`
  - `疑：好像。`
  - `举头：抬头。`
  - `故乡：家乡。`
- Translation paragraph.
- Appreciation paragraph.

Mobile elements:

- Top wordmark and hamburger.
- Breadcrumb.
- Compact image left, metadata right.
- Audio controls below metadata.
- Centered poem lines.
- Share and print row.
- Full-width `开始默写` and `加入复习册`.
- Collapsed accordion rows for `注释`, `译文`, `赏析`.

## 6.3 Search / Poetry Library (`UI/search.png`)

Purpose: discover poems.

Desktop elements:

- Browser frame.
- Top nav with `诗库` active.
- Page title: `诗库 · 搜索`.
- Subtitle: `搜索古诗文，发现经典之美`.
- Search bar.
- Filter chips: `全部`, `标题`, `作者`, `关键词`, `诗句`.
- Result count: `共找到 28 条结果`.
- Sort dropdown: `默认排序` with chevron.
- Result cards:
  - Thumbnail artwork.
  - Title.
  - Author and dynasty.
  - Excerpt with red highlighted match.
  - Tags.
  - Link: `查看详情` plus chevron.
- Visible results:
  - `静夜思`, tags `思乡`, `月亮`, `唐诗三百首`.
  - `春晓`, tags `春天`, `自然`.
  - `登鹳雀楼`, tags `登高`, `励志`, `唐诗三百首`.
  - `相思`, tags `思念`, `爱情`.
- Pagination:
  - Previous arrow.
  - Page `1` active red.
  - Pages `2`, `3`, ellipsis, `5`.
  - Next arrow.

Mobile elements:

- Top wordmark and hamburger.
- Search title/subtitle.
- Compact search bar.
- Horizontal chips.
- Result count and sort.
- Condensed result cards.
- Bottom tab bar with `诗库` active.

## 6.4 Review Book (`UI/review.png`)

Purpose: manage mastered poems and review queue.

Desktop elements:

- Browser frame.
- Top nav with `复习册` active.
- Greeting: `午安，诗友` plus gold dot.
- Encouragement: `温故而知新，可以为师矣。`
- Overview panel:
  - Book icon.
  - Title: `复习册`.
  - Subtitle: `已掌握诗词 · 28 首`.
  - Vertical dividers.
  - `掌握总览`.
  - Ring: `60%`.
  - `已掌握 28 首`.
  - `全部 46 首`.
  - `连续复习 7 天` with flame.
  - `累计复习 37 天` with medal/hourglass icon.
  - `今日复习 3 首` with calendar icon.
- Category tabs:
  - `全部 28`
  - `五言律诗 12`
  - `五言绝句 9`
  - `七言绝句 7`
- Controls:
  - Sort dropdown `最近复习`.
  - Search input `搜索复习册`.
  - Button `批量管理`.
- Review rows:
  - Thumbnail.
  - Title and genre tag.
  - Author/dynasty.
  - Excerpt.
  - Recent review time with clock icon.
  - Mastery status: `已掌握` with green check.
  - Button `重新学习`.
  - Button `从复习册移除`.
  - Row chevron.
- Visible poems:
  - `静夜思`
  - `春晓`
  - `登鹳雀楼`
  - `相思`
- Footer:
  - Count: `共 28 条`.
  - Pagination with active teal page `1`.
  - Rows-per-page selector `10 条/页`.

Mobile elements:

- Top wordmark and hamburger.
- Greeting.
- Compact progress overview card.
- Category tabs.
- Review item cards with inline action buttons.
- Bottom tab bar with `复习册` active.

## 6.5 Dictation Test (`UI/test.png`)

Purpose: practice memory through writing the next line.

Desktop elements:

- Browser frame.
- Top nav with `学习` active.
- Back chevron and title: `默写测试`.
- Progress label: `第 2 / 4 题`.
- Progress rail:
  - Red completed segment.
  - Beige remaining segment.
  - Small endpoint arrows/dots.
- Prompt label: `请默写下句`.
- Large prompt line: `床前明月光`.
- Decorative gold divider ornament.
- Answer input card:
  - Green check icon.
  - Answer: `疑是地上霜`.
  - Character count: `5 / 20`.
  - Bottom divider.
- Correct feedback panel:
  - Large check icon.
  - Text: `回答正确！`
  - Text: `太棒了，继续保持！`
  - Ink landscape accent.
- Buttons:
  - Secondary `查看解析`.
  - Primary `下一题` with chevron.
- Review-book reminder card:
  - Book icon.
  - Title: `本次默写完成后将加入复习册`.
  - Text: `完成全部 4 题后，可在复习册中巩固复习`.
  - Landscape illustration.
- Tip:
  - Gold lightbulb icon.
  - `小贴士：遇到不会的诗句，可以先跳过，完成所有题目后再回头复习。`

Mobile elements:

- Top wordmark and hamburger.
- Back chevron and title.
- Progress label and rail.
- Prompt label and prompt line.
- Answer card.
- Correct feedback.
- Full-width `查看解析` and `下一题`.
- Review-book reminder card.

## 7. Ink-Wash Preview Prototype

The file `UI/visual-inkWash-preview.html` contains an extra visual style prototype. It is not one of the five app screenshots, but it should inform future illustration and motion design.

Elements:

- Square xuan-paper container.
- Paper texture layer using SVG noise.
- Layered ink mountains:
  - Far mountain, low opacity, blurred, breathing animation.
  - Mid mountain, stronger opacity, floating animation.
  - Near mountain, high-contrast radial ink form.
- Ink splash dots.
- Vertical right-side title group:
  - Subtitle: `Traditional Chinese Aesthetics`.
  - Main title: `水墨意境`.
- Vertical left-side poetic text:
  - `Void & Substance`
  - `Spirit Resonance`
  - `Intent Before Pen`
- Red seal button:
  - Text: `入画`.
  - Cinnabar fill.
  - Rough mask/noise.
  - Hover scale and shadow.
  - Active press scale.
- Gold vertical accent.
- Click interaction:
  - Ink ripple expands from seal button.
- Mouse interaction:
  - Mountain layers move at different speeds for parallax.

Use this prototype for decorative entry moments, empty states, loading states, or special learning milestones. Keep it subtle inside core task screens.

## 8. Interaction States

Required states:

- Active nav: cinnabar text/icon plus underline.
- Hover nav: slight paper tint and stronger text.
- Button hover: darker cinnabar for primary; pale teal fill for secondary.
- Button pressed: slight inset or scale-down feedback.
- Input focus: teal border and soft focus ring.
- Correct answer: green check and pale green panel.
- Mastered status: green text and check icon.
- Favorite inactive: gold outline star.
- Favorite active: filled or stronger gold star.
- Destructive hover: pale red fill with red border.
- Disabled: reduced opacity but still readable.
- Loading search: preserve button size and use label such as `搜索中`.

## 9. Accessibility and Content Rules

- Maintain visible focus states for keyboard users.
- Buttons need text labels or accessible labels when icon-only.
- Search input must have `aria-label`.
- Audio controls need an accessible play/pause label.
- Progress rings need text labels; do not rely on color alone.
- Red highlights in search excerpts should be paired with semantic emphasis.
- Mobile bottom nav touch targets should be at least 44px high.
- Text must not overlap with artwork, ornaments, or phone safe areas.
- Keep Chinese poem lines copyable/selectable where possible.

## 10. Implementation Notes

- Use `lucide-react` for app icons:
  - `Home`, `BookOpenText`, `BookOpen`, `CalendarDays`, `User`, `Menu`.
  - `Search`, `Star`, `Play`, `Volume2`, `Share2`, `Printer`.
  - `PenLine`, `BookMarked`, `RefreshCcw`, `Trash2`, `CheckCircle2`, `ChevronRight`.
- Keep page-specific CSS scoped when building references or prototypes.
- Use real image assets or generated bitmap ink-wash images for poem thumbnails; avoid SVG-only hero artwork for final app surfaces.
- The design-reference route should remain a reference and QA artifact, not a replacement for production pages.
- Current production routes to eventually align:
  - `/` should map to homepage design.
  - `/search` should map to search/library design.
  - `/poems/[id]` should map to poem detail design.
  - `/review-book` should map to review-book design.
  - `/poems/[id]/test` should map to dictation test design.

## 11. QA Checklist

- Every page has desktop and mobile layout parity.
- Active nav state matches current route.
- Header and bottom tabs do not collide with content.
- Search filters wrap or scroll cleanly on narrow screens.
- Cards preserve 8px radius and consistent borders.
- Primary, secondary, destructive, and utility controls are visually distinct.
- Progress values are readable without relying on color.
- Poem titles and lines remain the typographic focus.
- Ink-wash decorations never reduce text contrast.
- Result rows and review rows keep actions reachable on mobile.
- Pagination and rows-per-page controls are visible on desktop.
- Accordions expose collapsed and expanded states.
- Audio player has play, progress, timestamp, and volume affordances.
- Correct/incorrect dictation feedback is visually and semantically clear.
