import Link from "next/link";
import { BookMarked, PenLine, Search, Volume2 } from "lucide-react";
import { getDailyPoem, listPoems } from "@/lib/db/poems";
import { PoemCard } from "@/components/PoemCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [dailyPoem, poems] = await Promise.all([getDailyPoem(), listPoems(6)]);

  return (
    <div className="page">
      {dailyPoem ? (
        <section className="hero-grid" aria-label="今日推荐">
          <div className="panel">
            <p className="section-title">今日推荐</p>
            <h1 className="poem-title">{dailyPoem.title}</h1>
            <div className="poem-meta">
              <span>{dailyPoem.author}</span>
              <span>{dailyPoem.genre || "唐诗"}</span>
              <span>{dailyPoem.status === "review_book" ? "已入复习册" : "待学习"}</span>
            </div>
            <div className="poem-lines">
              {dailyPoem.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <div className="actions">
              <Link className="button" href={`/poems/${dailyPoem.id}/test`}>
                <PenLine size={18} />
                开始默写
              </Link>
              <Link className="button secondary" href={`/poems/${dailyPoem.id}`}>
                <BookMarked size={18} />
                查看详情
              </Link>
            </div>
          </div>
          <aside className="panel">
            <p className="section-title">学习入口</p>
            <div className="stack">
              <Link className="poem-card" href="/search">
                <h3>
                  <Search size={19} /> 搜索唐诗
                </h3>
                <p>按题目、作者、词语或诗句查找想学的诗。</p>
              </Link>
              <Link className="poem-card" href="/review-book">
                <h3>
                  <BookMarked size={19} /> 复习册
                </h3>
                <p>默写通过的诗会自动进入复习册，不再参与每日推荐。</p>
              </Link>
              <Link className="poem-card" href={`/poems/${dailyPoem.id}`}>
                <h3>
                  <Volume2 size={19} /> 语音播放
                </h3>
                <p>诗词详情页包含语音播放、注释、译文和赏析。</p>
              </Link>
            </div>
          </aside>
        </section>
      ) : (
        <section className="panel">
          <p className="section-title">等待数据</p>
          <h1 className="poem-title">还没有可推荐的唐诗</h1>
          <p className="feedback">请先运行 `npm run prepare:v1` 导入 v1.0 的 50 首样本。</p>
        </section>
      )}

      <section className="content-section">
        <h2>诗库预览</h2>
        <div className="stack">
          {poems.map((poem) => (
            <PoemCard key={poem.id} poem={poem} />
          ))}
        </div>
      </section>
    </div>
  );
}
