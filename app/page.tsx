import Link from "next/link";
import {
  BookMarked,
  BookOpen,
  CalendarDays,
  ChevronRight,
  Flame,
  Medal,
  PenLine,
  RefreshCcw,
  Search,
} from "lucide-react";
import { getDailyPoem, listPoems } from "@/lib/db/poems";
import { InkArtwork } from "@/components/InkArtwork";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [dailyPoem, poems] = await Promise.all([getDailyPoem(), listPoems(6)]);
  const previewPoems = poems.slice(0, 3);

  return (
    <div className="page">
      {dailyPoem ? (
        <>
          <section className="hero-home" aria-label="今日推荐">
            <div className="home-main">
              <div className="greeting">
                <h1>
                  午安，诗友 <span className="gold-dot" />
                </h1>
                <p>每天进步一点点，诗心自明。</p>
              </div>
              <Link className="status-pill" href="/review-book">
                <BookMarked size={18} />
                <span>
                  你已掌握 <strong>28</strong> 首，复习册中有 <strong>28</strong> 首
                </span>
                <ChevronRight size={16} />
              </Link>
              <form className="search-form" action="/search">
                <Search size={20} />
                <input className="search-input" name="q" placeholder="搜索题目、作者、关键词或诗句" aria-label="搜索唐诗" />
                <button className="button" type="submit">
                  搜索
                </button>
              </form>
              <div>
                <p className="section-kicker">今日推荐</p>
                <article className="panel featured-poem">
                  <InkArtwork title={dailyPoem.title} variant="moon" size="medium" />
                  <div>
                    <h2>{dailyPoem.title}</h2>
                    <div className="poem-meta">
                      <span>{dailyPoem.author}</span>
                      <span>【唐代】</span>
                    </div>
                    <div className="poem-lines">
                      {dailyPoem.lines.slice(0, 4).map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>
                    <div className="tag-row">
                      <span className="tag">{dailyPoem.genre || "唐诗"}</span>
                      <span className="tag">思乡</span>
                    </div>
                  </div>
                  <span className="card-star">☆</span>
                </article>
                <div className="carousel-dots" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
            <aside className="side-stack">
              <Link className="learning-tile primary" href={`/poems/${dailyPoem.id}/test`}>
                <PenLine size={34} />
                <span>
                  <strong>继续学习</strong>
                  <span>今日计划：学习 3 首</span>
                </span>
                <ChevronRight size={22} />
              </Link>
              <Link className="learning-tile secondary" href="/review-book">
                <BookMarked size={18} />
                <span>
                  <strong>复习册</strong>
                  <span>复习 28 首</span>
                </span>
                <ChevronRight size={22} />
              </Link>
              <div className="panel progress-card">
                <div className="progress-ring">60%</div>
                <p>
                  已学 3 首
                  <br />
                  目标 5 首
                  <br />
                  连续学习 7 天 <Flame size={15} color="#d85832" />
                </p>
              </div>
            </aside>
          </section>

          <section>
            <p className="section-kicker">学习数据</p>
            <div className="stats-grid">
              <div className="stat-card">
                <BookOpen size={34} />
                <p>
                  已掌握
                  <br />
                  <strong>28</strong> 首
                </p>
              </div>
              <div className="stat-card">
                <CalendarDays size={34} />
                <p>
                  学习中
                  <br />
                  <strong>16</strong> 首
                </p>
              </div>
              <div className="stat-card">
                <BookMarked size={34} color="#b98535" />
                <p>
                  复习册
                  <br />
                  <strong>28</strong> 首
                </p>
              </div>
              <div className="stat-card">
                <Medal size={34} color="#b98535" />
                <p>
                  累计学习
                  <br />
                  <strong>37</strong> 天
                </p>
              </div>
            </div>
            <div className="dashboard-grid">
              <div className="panel list-panel">
                <div className="panel-heading">
                  <h2>最近学习</h2>
                  <Link href="/review-book">查看全部 <ChevronRight size={14} /></Link>
                </div>
                {previewPoems.slice(0, 2).map((poem, index) => (
                  <div className="mini-row" key={poem.id}>
                    <div>
                      <h3>{poem.title}</h3>
                      <p>{poem.author} 【唐代】 <span className="tag">{poem.genre || "唐诗"}</span></p>
                    </div>
                    <span>{index === 0 ? "今日 10:23" : "今日 09:41"}</span>
                    <span className="success-text">已掌握 ✓</span>
                  </div>
                ))}
              </div>
              <div className="panel list-panel">
                <div className="panel-heading">
                  <h2>为你推荐</h2>
                  <button type="button">
                    <RefreshCcw size={14} /> 换一批
                  </button>
                </div>
                {previewPoems.map((poem) => (
                  <Link className="mini-row" href={`/poems/${poem.id}`} key={poem.id}>
                    <div>
                      <h3>{poem.title}</h3>
                      <p>{poem.author} 【唐代】</p>
                    </div>
                    <span />
                    <ChevronRight size={16} />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </>
      ) : (
        <section className="panel">
          <p className="section-title">等待数据</p>
          <h1>还没有可推荐的唐诗</h1>
          <p className="feedback">请先运行 `npm run prepare:v1` 导入 v1.0 的 50 首样本。</p>
        </section>
      )}
    </div>
  );
}
