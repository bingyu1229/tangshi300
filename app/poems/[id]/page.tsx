import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, ChevronRight, PenLine, Printer, Share2, Star } from "lucide-react";
import { getPoemDetail } from "@/lib/db/poems";
import { AudioPlayer } from "@/components/AudioPlayer";
import { InkArtwork, artworkVariant } from "@/components/InkArtwork";

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
      <nav className="breadcrumb" aria-label="面包屑">
        <Link href="/">首页</Link>
        <ChevronRight size={14} />
        <Link href="/search">诗库</Link>
        <ChevronRight size={14} />
        <span>{poem.title}</span>
      </nav>
      <section className="detail-layout" aria-label={`${poem.title} 详情`}>
        <InkArtwork title={poem.title} variant={artworkVariant(poem.id)} size="large" zoomable />
        <div className="poem-detail-main">
          <div className="poem-detail-header">
            <h1 className="poem-detail-title">{poem.title}</h1>
            <button className="favorite-action" type="button">
              <Star size={20} />
              收藏
            </button>
          </div>
          <div className="poem-meta">
            <span>{poem.author}</span>
            <span>【唐代】</span>
            <span className="tag">{poem.genre || "唐诗"}</span>
          </div>
          <AudioPlayer audio={poem.audio} text={`《${poem.title}》，${poem.author}。${poem.content}`} />
          <div className="poem-detail-lines">
            {poem.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <div className="utility-actions">
            <button className="icon-button" type="button">
              <Share2 size={17} /> 分享
            </button>
            <button className="icon-button" type="button">
              <Printer size={17} /> 打印
            </button>
          </div>
          <div className="detail-actions">
            <Link className="button" href={`/poems/${poem.id}/test`}>
              <PenLine size={18} />
              开始默写
            </Link>
            <Link className="button secondary" href="/review-book">
              <BookOpen size={18} />
              加入复习册
            </Link>
          </div>
        </div>
      </section>
      <section className="accordion-stack" aria-label="诗词解析">
        <article className="accordion-card">
          <h2>
            <span>
              <BookOpen size={20} /> 注释
            </span>
            <span>⌃</span>
          </h2>
            <p>{poem.notes || "暂无注释。"}</p>
        </article>
        <article className="accordion-card">
          <h2>
            <span>
              <BookOpen size={20} /> 译文
            </span>
            <span>⌃</span>
          </h2>
          <p>{poem.translation || "暂无译文。"}</p>
        </article>
        <article className="accordion-card">
          <h2>
            <span>
              <BookOpen size={20} /> 赏析
            </span>
            <span>⌃</span>
          </h2>
          <p>{poem.appreciation || "暂无赏析。"}</p>
        </article>
      </section>
    </div>
  );
}
