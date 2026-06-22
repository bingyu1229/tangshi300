import type { CSSProperties } from "react";
import Link from "next/link";
import { BookOpen, CalendarDays, Flame, Medal } from "lucide-react";
import { ReviewBookClient } from "@/components/ReviewBookClient";
import { getReviewBook, listPoems } from "@/lib/db/poems";
import pageBackground from "@/ui/page-backgroud-sm.jpg";

export const dynamic = "force-dynamic";

function greetingForNow() {
  const hour = new Date().getHours();
  if (hour < 6) return "夜深了，诗友";
  if (hour < 12) return "早安，诗友";
  if (hour < 18) return "午安，诗友";
  return "晚安，诗友";
}

export default async function ReviewBookPage() {
  const [poems, allPoems] = await Promise.all([getReviewBook(), listPoems(300)]);
  const totalCount = allPoems.length;
  const masteredCount = poems.length;
  const progressPercent = totalCount ? Math.round((masteredCount / totalCount) * 100) : 0;
  const genreCount = new Set(poems.map((poem) => poem.genre || "唐诗")).size;

  return (
    <div className="page page-review" style={{ "--page-bg": `url(${pageBackground.src})` } as CSSProperties}>
      <section className="greeting">
        <h1>
          {greetingForNow()} <span className="gold-dot" />
        </h1>
        <p>温故而知新，可以为师矣。</p>
      </section>

      <section className="panel review-overview">
        <div className="review-title">
          <BookOpen size={48} />
          <div>
            <h1>复习册</h1>
            <p>已掌握诗词 · {masteredCount} 首</p>
          </div>
        </div>
        <div className="overview-stat">
          <div className="progress-ring" style={{ "--progress": `${progressPercent}%` } as CSSProperties}>
            <span>{progressPercent}%</span>
          </div>
          <span>掌握总览</span>
        </div>
        <div className="overview-stat">
          <strong>
            {masteredCount} 首 <Flame size={15} color="#d85832" />
          </strong>
          <span>复习册</span>
        </div>
        <div className="overview-stat">
          <strong>{totalCount} 首</strong>
          <span>
            <Medal size={15} /> 诗库总数
          </span>
        </div>
        <div className="overview-stat">
          <strong>{genreCount || 0} 类</strong>
          <span>
            <CalendarDays size={15} /> 题材覆盖
          </span>
        </div>
      </section>

      {poems.length ? (
        <ReviewBookClient poems={poems} />
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
    </div>
  );
}
