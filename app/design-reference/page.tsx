import type { Metadata } from "next";
import Image, { type StaticImageData } from "next/image";
import {
  BookMarked,
  BookOpen,
  BookOpenText,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Home,
  Medal,
  Menu,
  PenLine,
  Play,
  Printer,
  RefreshCcw,
  Search,
  Share2,
  Smartphone,
  Star,
  Trash2,
  Volume2,
} from "lucide-react";
import homepageShot from "@/ui/homepage.png";
import poemShot from "@/ui/poem.png";
import reviewShot from "@/ui/review.png";
import searchShot from "@/ui/search.png";
import testShot from "@/ui/test.png";
import styles from "./design-reference.module.css";

export const metadata: Metadata = {
  title: "Tangshi300 UI Design Reference",
  description: "Reference page for the Tangshi300 ink-wash UI system.",
};

type Shot = {
  title: string;
  file: string;
  image: StaticImageData;
  purpose: string;
  elements: string[];
};

const shots: Shot[] = [
  {
    title: "Homepage",
    file: "ui/homepage.png",
    image: homepageShot,
    purpose: "Daily learning dashboard with search, recommendation, study actions, progress, and activity summaries.",
    elements: [
      "Desktop browser chrome and mobile device frame",
      "Tangshi300 wordmark with red 300 and vertical seal",
      "Top nav: 首页, 诗库, 学习, 复习册",
      "Hamburger menu on mobile",
      "Greeting, gold flower dot, encouragement copy",
      "Learning status pill with mastered and review-book counts",
      "Search bar with icon, placeholder, teal search button",
      "今日推荐 section title with gold divider ornament",
      "Featured poem card with image, favorite star, title, author, dynasty, poem lines, tags, carousel dots, detail link",
      "Primary red 继续学习 card and secondary blue 复习册 card",
      "Circular progress module, daily target, streak count, flame accent",
      "Learning data tiles: 已掌握, 学习中, 复习册, 累计学习",
      "Recent learning list and recommendation list",
      "Mobile bottom tab bar with four icons and active red state",
    ],
  },
  {
    title: "Poem Detail",
    file: "ui/poem.png",
    image: poemShot,
    purpose: "Focused reading page for one poem, with audio, actions, and expandable interpretation sections.",
    elements: [
      "Breadcrumb trail: 首页 > 诗库 > 静夜思",
      "Large artwork thumbnail with magnifier affordance",
      "Title, author, dynasty, genre tag, favorite star, 收藏 label",
      "Audio controls: play button, progress track, timestamp, volume icon",
      "Large poem text with generous line height",
      "Share and print utility actions",
      "Primary 开始默写 button and secondary 加入复习册 button",
      "Accordion panels for 注释, 译文, 赏析 with icons and chevrons",
      "Desktop split hero layout and mobile stacked reading layout",
    ],
  },
  {
    title: "Search / Poetry Library",
    file: "ui/search.png",
    image: searchShot,
    purpose: "Poem discovery page with search modes, sorting, highlighted matches, result cards, and pagination.",
    elements: [
      "Page title 诗库 · 搜索 and subtitle",
      "Full-width search input with icon, placeholder, and teal button",
      "Filter chips: 全部, 标题, 作者, 关键词, 诗句",
      "Result count and 默认排序 dropdown",
      "Result cards with artwork, title, author, dynasty, excerpt, red highlighted match, tags, detail link",
      "Pagination controls with active red page",
      "Mobile condensed result list and active bottom tab state",
    ],
  },
  {
    title: "Review Book",
    file: "ui/review.png",
    image: reviewShot,
    purpose: "Review management page showing mastered poems, progress, filters, and repeat/remove actions.",
    elements: [
      "Greeting and study encouragement copy",
      "Review-book overview panel with icon, title, total mastered poems",
      "Progress ring and stats: 已掌握, 全部, 连续复习, 累计复习, 今日复习",
      "Category tabs: 全部, 五言律诗, 五言绝句, 七言绝句",
      "Sort dropdown, review search input, batch management action",
      "Review list rows with thumbnail, title, genre tag, author, dynasty, poem excerpt",
      "Recent review time, mastered status, green confirmation icon",
      "重新学习 and 从复习册移除 buttons",
      "Pagination, rows-per-page selector, mobile bottom nav active state",
    ],
  },
  {
    title: "Dictation Test",
    file: "ui/test.png",
    image: testShot,
    purpose: "Focused memorization flow with progress, prompt, answer input, feedback, and continuation actions.",
    elements: [
      "Back affordance and 默写测试 page title",
      "Question progress label 第 2 / 4 题 and red/gold progress rail",
      "Prompt label 请默写下句 and large source line",
      "Gold divider ornament under prompt",
      "Answer card with success check icon, typed answer, character counter",
      "Green correct feedback panel with ink landscape accent",
      "Secondary 查看解析 and primary 下一题 actions",
      "Review-book reminder card with book icon and landscape illustration",
      "Small tip line with gold bulb icon on desktop",
      "Mobile stacked controls with full-width action buttons",
    ],
  },
];

const tokens = [
  { name: "Paper", value: "#F8F4EA", usage: "Main app background, cards, browser content area" },
  { name: "Paper deep", value: "#E9DCC6", usage: "Borders, dividers, progress rails, quiet panels" },
  { name: "Ink", value: "#17201D", usage: "Primary text, poem titles, high-emphasis icons" },
  { name: "Muted ink", value: "#6D665E", usage: "Metadata, helper text, inactive nav" },
  { name: "Cinnabar", value: "#B83A2E", usage: "Active nav, primary buttons, highlights, brand 300" },
  { name: "Cinnabar dark", value: "#8E2B24", usage: "Pressed state and primary gradients" },
  { name: "Jade teal", value: "#0D6678", usage: "Search, secondary actions, section headings" },
  { name: "Gold", value: "#C59A4A", usage: "Ornaments, icons, progress accents, seal support color" },
  { name: "Success", value: "#4B9A73", usage: "Correct answer and mastered status" },
];

const components = [
  {
    title: "Global App Frame",
    details: "Desktop uses a light browser-window shell; mobile is shown in a phone frame. The implemented app should keep the content canvas cream and reserve the chrome/frame as presentation language for references or marketing captures.",
  },
  {
    title: "Navigation",
    details: "Desktop nav is horizontal with icon plus label, active cinnabar text and underline. Mobile moves the primary five destinations into a fixed bottom tab bar, while the top right becomes a hamburger.",
  },
  {
    title: "Cards",
    details: "Cards are paper-toned, thin gold-beige bordered, 8px radius, and lightly shadowed. Content cards remain spacious, but list rows are dense and scan-friendly.",
  },
  {
    title: "Buttons",
    details: "Primary actions are cinnabar gradients with inset border highlights. Secondary actions are white paper with teal outlines. Destructive remove actions use red outline and trash icon.",
  },
  {
    title: "Forms",
    details: "Search and answer inputs use large touch targets, icon-leading affordances, beige borders, and teal focus/submit treatment. Search buttons attach flush to the right on desktop.",
  },
  {
    title: "Progress",
    details: "Use circular rings for overall mastery and thin rails for test progress. Red indicates current/completed progress; gold-beige indicates remaining progress.",
  },
  {
    title: "Poetry Content",
    details: "Poem titles and lines are the typographic center. Chinese serif/calligraphic type, generous line height, and restrained metadata chips preserve a literary tone.",
  },
  {
    title: "Illustration",
    details: "Ink-wash thumbnails, faint mountains, bamboo silhouettes, pagodas, and gold divider ornaments provide atmosphere without competing with text.",
  },
];

function IconStrip() {
  const iconItems = [
    { label: "首页", Icon: Home },
    { label: "诗库", Icon: BookOpenText },
    { label: "学习", Icon: BookOpen },
    { label: "复习册", Icon: CalendarDays },
    { label: "播放", Icon: Play },
    { label: "收藏", Icon: Star },
    { label: "分享", Icon: Share2 },
    { label: "打印", Icon: Printer },
    { label: "重学", Icon: RefreshCcw },
    { label: "移除", Icon: Trash2 },
    { label: "正确", Icon: CheckCircle2 },
  ];

  return (
    <div className={styles.iconGrid}>
      {iconItems.map(({ label, Icon }) => (
        <div className={styles.iconCell} key={label}>
          <Icon size={22} aria-hidden="true" />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function MiniHomeSpec() {
  return (
    <section className={styles.mockSurface} aria-label="Condensed homepage reference">
      <div className={styles.mockTopbar}>
        <div className={styles.brand}>
          <span>Tangshi</span>
          <strong>300</strong>
          <em>唐诗</em>
        </div>
        <nav className={styles.mockNav} aria-label="Reference navigation">
          <span className={styles.activeNav}>
            <Home size={16} /> 首页
          </span>
          <span>
            <BookOpenText size={16} /> 诗库
          </span>
          <span>
            <BookOpen size={16} /> 学习
          </span>
          <span>
            <CalendarDays size={16} /> 复习册
          </span>
        </nav>
        <div className={styles.avatar}>
          <span />
          <ChevronDown size={16} />
        </div>
      </div>

      <div className={styles.mockHeroGrid}>
        <div className={styles.mockMain}>
          <p className={styles.eyebrow}>午安，诗友 <i /></p>
          <div className={styles.searchBar}>
            <Search size={19} />
            <span>搜索题目、作者、关键词或诗句</span>
            <button type="button">搜索</button>
          </div>
          <div className={styles.sectionHeading}>
            <span>今日推荐</span>
            <b />
          </div>
          <article className={styles.featureCard}>
            <div className={styles.artThumb} />
            <div>
              <h2>静夜思</h2>
              <p>李白 【唐代】</p>
              <p className={styles.poemLines}>床前明月光，疑是地上霜。<br />举头望明月，低头思故乡。</p>
              <div className={styles.tags}>
                <span>五言绝句</span>
                <span>思乡</span>
              </div>
            </div>
            <Star className={styles.cardStar} size={24} />
          </article>
        </div>
        <aside className={styles.mockAside}>
          <button className={styles.primaryTile} type="button">
            <PenLine size={28} /> <span>继续学习</span> <ChevronRight size={22} />
          </button>
          <button className={styles.reviewTile} type="button">
            <BookMarked size={30} /> <span>复习册</span> <ChevronRight size={22} />
          </button>
          <div className={styles.progressCard}>
            <div className={styles.ring}>60%</div>
            <p>已学 3 首<br />目标 5 首<br />连续学习 7 天</p>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default function DesignReferencePage() {
  return (
    <div className={styles.referencePage}>
      <section className={styles.hero}>
        <p className={styles.kicker}>Tangshi300 UI Reference</p>
        <h1>Ink-wash poetry learning interface</h1>
        <p>
          A complete visual reference distilled from the five supplied UI screenshots. It records layout,
          components, states, icon usage, colors, typography, and responsive behavior so the product screens can be
          implemented consistently.
        </p>
        <div className={styles.heroActions}>
          <a href="#screens">View screenshots</a>
          <a href="#design-doc">Design doc</a>
        </div>
      </section>

      <MiniHomeSpec />

      <section className={styles.section} id="screens">
        <div className={styles.sectionIntro}>
          <p className={styles.kicker}>Provided Images</p>
          <h2>Screen-by-screen inventory</h2>
          <p>Each source image is 1448 x 1086 and includes both desktop and mobile interpretations.</p>
        </div>
        <div className={styles.shotGrid}>
          {shots.map((shot) => (
            <article className={styles.shotCard} key={shot.file}>
              <Image src={shot.image} alt={`${shot.title} UI design screenshot`} placeholder="blur" />
              <div className={styles.shotBody}>
                <p>{shot.file}</p>
                <h3>{shot.title}</h3>
                <span>{shot.purpose}</span>
                <ul>
                  {shot.elements.map((element) => (
                    <li key={element}>{element}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionIntro}>
          <p className={styles.kicker}>Design Tokens</p>
          <h2>Color, type, radius, and depth</h2>
          <p>The palette should feel like warm xuan paper, black ink, cinnabar seal paste, jade-blue UI controls, and antique gold ornament.</p>
        </div>
        <div className={styles.tokenGrid}>
          {tokens.map((token) => (
            <article className={styles.tokenCard} key={token.name}>
              <span style={{ background: token.value }} />
              <div>
                <h3>{token.name}</h3>
                <code>{token.value}</code>
                <p>{token.usage}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionIntro}>
          <p className={styles.kicker}>Components</p>
          <h2>Reusable UI primitives</h2>
        </div>
        <div className={styles.componentGrid}>
          {components.map((component) => (
            <article className={styles.componentCard} key={component.title}>
              <h3>{component.title}</h3>
              <p>{component.details}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionIntro}>
          <p className={styles.kicker}>Iconography</p>
          <h2>Lucide icon mapping</h2>
          <p>Use line icons at 16-24px in navigation and utility controls, scaling to 28-32px for feature tiles.</p>
        </div>
        <IconStrip />
      </section>

      <section className={styles.section}>
        <div className={styles.sectionIntro}>
          <p className={styles.kicker}>Responsive Rules</p>
          <h2>Desktop and mobile behavior</h2>
        </div>
        <div className={styles.responsiveGrid}>
          <article>
            <MonitorIcon />
            <h3>Desktop</h3>
            <p>Use a 1160-1200px content canvas, top navigation, two-column hero/detail layouts, horizontal stats, visible pagination, and grouped row actions.</p>
          </article>
          <article>
            <Smartphone size={30} />
            <h3>Mobile</h3>
            <p>Use stacked content, full-width actions, condensed cards, top hamburger, fixed bottom tabs, tighter artwork, and horizontal category tabs.</p>
          </article>
        </div>
      </section>

      <section className={styles.section} id="design-doc">
        <div className={styles.sectionIntro}>
          <p className={styles.kicker}>Documentation</p>
          <h2>Detailed design specification</h2>
          <p>
            The full design document lives at <code>doc/ui-design-doc.md</code>. It includes the complete source-image
            inventory, visual tokens, component rules, screen-by-screen requirements, interaction states, accessibility
            notes, and QA checklist.
          </p>
        </div>
      </section>
    </div>
  );
}

function MonitorIcon() {
  return (
    <div className={styles.monitorIcon} aria-hidden="true">
      <span />
    </div>
  );
}
