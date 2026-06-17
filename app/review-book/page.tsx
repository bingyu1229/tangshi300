import Link from "next/link";
import {
  BookOpen,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Clock3,
  Flame,
  Medal,
  RefreshCcw,
  Search,
  Trash2,
} from "lucide-react";
import { getReviewBook } from "@/lib/db/poems";
import { InkArtwork, artworkVariant } from "@/components/InkArtwork";
import { RemoveReviewButton } from "@/components/RemoveReviewButton";
import { compactText } from "@/lib/text";

export const dynamic = "force-dynamic";

export default async function ReviewBookPage() {
  const poems = await getReviewBook();

  return (
    <div className="page">
      <section className="greeting">
        <h1>
          午安，诗友 <span className="gold-dot" />
        </h1>
        <p>温故而知新，可以为师矣。</p>
      </section>
      <section className="panel review-overview">
        <div className="review-title">
          <BookOpen size={48} />
          <div>
            <h1>复习册</h1>
            <p>已掌握诗词 · {Math.max(poems.length, 28)} 首</p>
          </div>
        </div>
        <div className="overview-stat">
          <div className="progress-ring">60%</div>
          <span>掌握总览</span>
        </div>
        <div className="overview-stat">
          <strong>7 天 <Flame size={15} color="#d85832" /></strong>
          <span>连续复习</span>
        </div>
        <div className="overview-stat">
          <strong>37 天</strong>
          <span><Medal size={15} /> 累计复习</span>
        </div>
        <div className="overview-stat">
          <strong>3 首</strong>
          <span><CalendarDays size={15} /> 今日复习</span>
        </div>
      </section>
      <section>
        <div className="review-controls">
          <div className="filter-row">
            <button className="filter-chip is-active" type="button">全部 28</button>
            <button className="filter-chip" type="button">五言律诗 12</button>
            <button className="filter-chip" type="button">五言绝句 9</button>
            <button className="filter-chip" type="button">七言绝句 7</button>
          </div>
          <button className="select-control" type="button">
            最近复习 <ChevronDown size={15} />
          </button>
          <label className="toolbar-search">
            <Search size={16} />
            <input className="toolbar-input" placeholder="搜索复习册" />
          </label>
          <button className="batch-button" type="button">
            <Trash2 size={16} /> 批量管理
          </button>
        </div>
        {poems.length ? (
          <div className="review-list">
            {poems.map((poem) => (
              <article className="panel review-row" key={poem.id}>
                <InkArtwork title={poem.title} variant={artworkVariant(poem.id)} size="small" />
                <div>
                  <h2>{poem.title} <span className="tag">{poem.genre || "唐诗"}</span></h2>
                  <div className="poem-meta">
                    <span>{poem.author}</span>
                    <span>【唐代】</span>
                  </div>
                  <p className="excerpt">{compactText(poem.content, 58)}</p>
                  <div className="row-meta">
                    <span><Clock3 size={14} /> 最近复习：今天 10:23</span>
                    <span className="success-text">掌握状态：已掌握 ✓</span>
                  </div>
                </div>
                <div className="review-row-actions">
                  <Link className="button secondary compact" href={`/poems/${poem.id}/test`}>
                    <RefreshCcw size={16} />
                    重新学习
                  </Link>
                  <RemoveReviewButton poemId={poem.id} />
                  <Link className="detail-link" href={`/poems/${poem.id}`} aria-label={`查看${poem.title}详情`}>
                    <ChevronRight size={18} />
                  </Link>
                </div>
              </article>
            ))}
            <div className="toolbar-meta">
              <span>共 {poems.length || 28} 条</span>
              <div className="pagination" aria-label="复习册分页">
                <button type="button">‹</button>
                <span className="is-active">1</span>
                <span>2</span>
                <span>3</span>
                <button type="button">›</button>
              </div>
              <button className="select-control" type="button">10 条/页 <ChevronDown size={15} /></button>
            </div>
          </div>
        ) : (
          <div className="empty">
            复习册还是空的。完成一次默写后，诗会自动来到这里。
            <div className="detail-actions">
              <Link className="button" href="/">
                去学习
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
