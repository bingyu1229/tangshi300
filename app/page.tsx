import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import {
  BookMarked,
  BookOpen,
  CalendarDays,
  ChevronRight,
  Flame,
  Medal,
  PenLine,
  Search,
} from "lucide-react";
import { HomeRecommendations } from "@/components/HomeRecommendations";
import { getDailyPoem, getRecentLearning, getReviewBook, listPoems } from "@/lib/db/poems";
import poemCardBackground from "@/ui/poem-card-background-sm.png";
import poemThumbnail from "@/ui/thumbnail-sm.png";

export const dynamic = "force-dynamic";

function greetingForNow() {
  const hour = new Date().getHours();
  if (hour < 6) return "夜深了，诗友";
  if (hour < 12) return "早安，诗友";
  if (hour < 18) return "午安，诗友";
  return "晚安，诗友";
}

export default async function HomePage() {
  const [dailyPoem, poems, reviewBook, recentLearning] = await Promise.all([
    getDailyPoem(),
    listPoems(50),
    getReviewBook(),
    getRecentLearning(2),
  ]);
  const recommendationPoems = poems.filter((poem) => poem.id !== dailyPoem?.id);
  const masteredCount = reviewBook.length;
  const learningCount = poems.filter((poem) => poem.status === "learning").length;
  const totalCount = poems.length;
  const goalCount = Math.max(5, masteredCount);
  const progressPercent = goalCount ? Math.min(100, Math.round((masteredCount / goalCount) * 100)) : 0;

  return (
    <div
      className="page page-home"
      style={
        {
          "--page-bg": `url(${poemCardBackground.src})`,
          "--card-bg": `url(${poemCardBackground.src})`,
        } as CSSProperties
      }
    >
      {dailyPoem ? (
        <>
          <section className="hero-home" aria-label="今日推荐">
            <div className="home-main">
              <div className="home-top-row">
                <div className="greeting">
                  <h1>
                    {greetingForNow()}
                    <span className="gold-dot" />
                  </h1>
                  <p>每天进步一点点，诗心自明。</p>
                </div>
                <Link className="status-pill" href="/review-book">
                  <BookMarked size={18} />
                  <span>
                    你已掌握 <strong>{masteredCount}</strong> 首，复习册中有 <strong>{reviewBook.length}</strong> 首
                  </span>
                  <ChevronRight size={16} />
                </Link>
              </div>

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
                  <div className="featured-thumbnail-frame">
                    <Image
                      src={poemThumbnail}
                      alt={`${dailyPoem.title} 水墨缩略图`}
                      className="featured-thumbnail"
                      fill
                      sizes="(max-width: 660px) 84px, 188px"
                      priority
                      placeholder="blur"
                    />
                  </div>
                  <div className="featured-copy">
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
                      <span className="tag">推荐</span>
                    </div>
                    <Link className="detail-link featured-detail-link" href={`/poems/${dailyPoem.id}`}>
                      查看详情 <ChevronRight size={16} />
                    </Link>
                  </div>
                  <span className="card-star">☆</span>
                </article>
              </div>
            </div>

            <aside className="side-stack">
              <Link className="learning-tile primary" href={`/poems/${dailyPoem.id}/test`}>
                <PenLine size={34} />
                <span>
                  <strong>继续学习</strong>
                  <span>今日计划：学习 1 首</span>
                </span>
                <ChevronRight size={22} />
              </Link>
              <Link className="learning-tile secondary" href="/review-book">
                <BookMarked size={18} />
                <span>
                  <strong>复习册</strong>
                  <span>复习 {reviewBook.length} 首</span>
                </span>
                <ChevronRight size={22} />
              </Link>
              <div className="panel progress-card">
                <div className="progress-ring" style={{ "--progress": `${progressPercent}%` } as CSSProperties}>
                  <span>{progressPercent}%</span>
                </div>
                <p>
                  已学 {masteredCount} 首
                  <br />
                  目标 {goalCount} 首
                  <br />
                  唐诗总数 {totalCount} 首 <Flame size={15} color="#d85832" />
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
                  <strong>{masteredCount}</strong> 首
                </p>
              </div>
              <div className="stat-card">
                <CalendarDays size={34} />
                <p>
                  学习中
                  <br />
                  <strong>{learningCount}</strong> 首
                </p>
              </div>
              <div className="stat-card">
                <BookMarked size={34} color="#b98535" />
                <p>
                  复习册
                  <br />
                  <strong>{reviewBook.length}</strong> 首
                </p>
              </div>
              <div className="stat-card">
                <Medal size={34} color="#b98535" />
                <p>
                  诗库
                  <br />
                  <strong>{totalCount}</strong> 首
                </p>
              </div>
            </div>
            <div className="dashboard-grid">
              <div className="panel list-panel">
                <div className="panel-heading">
                  <h2>最近学习</h2>
                  <Link href="/review-book">
                    查看全部 <ChevronRight size={14} />
                  </Link>
                </div>
                {recentLearning.length ? recentLearning.map((poem) => (
                  <Link className="mini-row" href={`/poems/${poem.id}`} key={poem.id}>
                    <div>
                      <h3>{poem.title}</h3>
                      <p>
                        {poem.author} 【唐代】 <span className="tag">{poem.genre || "唐诗"}</span>
                      </p>
                    </div>
                    <span>{poem.status === "review_book" ? "已掌握" : "学习中"}</span>
                    <span className="success-text">已记录</span>
                  </Link>
                )) : (
                  <div className="empty mini-empty">还没有学习记录，完成一次学习后会显示在这里。</div>
                )}
              </div>
              <HomeRecommendations poems={recommendationPoems} />
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
