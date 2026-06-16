import Link from "next/link";
import { notFound } from "next/navigation";
import { PenLine } from "lucide-react";
import { getPoemDetail } from "@/lib/db/poems";
import { AudioPlayer } from "@/components/AudioPlayer";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function PoemDetailPage({ params }: PageProps) {
  const { id } = await params;
  const poem = await getPoemDetail(id);

  if (!poem) {
    notFound();
  }

  return (
    <div className="page">
      <section className="detail-layout">
        <div className="panel">
          <p className="section-title">诗词详情</p>
          <h1 className="poem-title">{poem.title}</h1>
          <div className="poem-meta">
            <span>{poem.author}</span>
            <span>{poem.genre || "唐诗"}</span>
            <span>{poem.status === "review_book" ? "复习册" : "可学习"}</span>
          </div>
          <div className="poem-lines">
            {poem.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <AudioPlayer audio={poem.audio} text={`《${poem.title}》，${poem.author}。${poem.content}`} />
          <div className="actions">
            <Link className="button" href={`/poems/${poem.id}/test`}>
              <PenLine size={18} />
              开始默写
            </Link>
          </div>
        </div>
        <div className="panel">
          <section className="content-section">
            <h2>注释</h2>
            <p>{poem.notes || "暂无注释。"}</p>
          </section>
          <section className="content-section">
            <h2>译文</h2>
            <p>{poem.translation || "暂无译文。"}</p>
          </section>
          <section className="content-section">
            <h2>赏析</h2>
            <p>{poem.appreciation || "暂无赏析。"}</p>
          </section>
        </div>
      </section>
    </div>
  );
}
