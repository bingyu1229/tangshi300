import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { BookOpen, ChevronRight, ZoomIn } from "lucide-react";
import { getPoemDetail } from "@/lib/db/poems";
import { AudioPlayer } from "@/components/AudioPlayer";
import { PoemPageActions } from "@/components/PoemPageActions";
import pageBackground from "@/ui/page-backgroud-sm.jpg";
import poemThumbnail from "@/ui/thumbnail-sm.png";

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
    <div
      className="page page-poem"
      style={{ "--page-bg": `url(${pageBackground.src})` } as CSSProperties}
    >
      <nav className="breadcrumb" aria-label="面包屑">
        <Link href="/">首页</Link>
        <ChevronRight size={14} />
        <Link href="/search">诗库</Link>
        <ChevronRight size={14} />
        <span>{poem.title}</span>
      </nav>
      <section className="detail-layout" aria-label={`${poem.title} 详情`}>
        <figure className="detail-art-frame">
          <Image
            src={poemThumbnail}
            alt={`${poem.title} 水墨插图`}
            fill
            sizes="(max-width: 660px) 96px, 300px"
            placeholder="blur"
            priority
          />
          <span className="detail-zoom" aria-hidden="true">
            <ZoomIn size={19} />
          </span>
        </figure>
        <div className="poem-detail-main">
          <div className="poem-detail-header">
            <h1 className="poem-detail-title">{poem.title}</h1>
          </div>
          <div className="poem-meta">
            <span>{poem.author}</span>
            <span>【唐代】</span>
            <span className="tag">{poem.genre || "唐诗"}</span>
          </div>
          <AudioPlayer audio={poem.audio} text={`《${poem.title}》，${poem.author}。${poem.content}`} />
        </div>
        <div className="poem-detail-lines">
          {poem.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </section>
      <PoemPageActions poemId={poem.id} />
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
