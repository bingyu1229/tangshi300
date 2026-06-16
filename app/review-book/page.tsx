import Link from "next/link";
import { getReviewBook } from "@/lib/db/poems";
import { RemoveReviewButton } from "@/components/RemoveReviewButton";

export const dynamic = "force-dynamic";

export default async function ReviewBookPage() {
  const poems = await getReviewBook();

  return (
    <div className="page">
      <section className="panel">
        <p className="section-title">复习册</p>
        <h1 className="poem-title">温故知新</h1>
        <p className="poem-meta">默写通过的诗会收在这里，并从每日推荐中移除。</p>
      </section>
      <section className="content-section">
        {poems.length ? (
          <div className="stack">
            {poems.map((poem) => (
              <article className="poem-card" key={poem.id}>
                <h3>{poem.title}</h3>
                <p>
                  {poem.author} · {poem.genre || "唐诗"}
                </p>
                <p>{poem.content}</p>
                <div className="actions">
                  <Link className="button ghost" href={`/poems/${poem.id}`}>
                    查看详情
                  </Link>
                  <RemoveReviewButton poemId={poem.id} />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty">
            复习册还是空的。完成一次默写后，诗会自动来到这里。
            <div className="actions">
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
