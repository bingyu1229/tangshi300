"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronLeft, ChevronRight, RefreshCcw, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { RemoveReviewButton } from "@/components/RemoveReviewButton";
import { compactText } from "@/lib/text";
import type { PoemSummary } from "@/lib/types";
import poemThumbnail from "@/ui/thumbnail-2-sm.jpg";

type ReviewBookClientProps = {
  poems: PoemSummary[];
};

const pageSize = 8;

export function ReviewBookClient({ poems }: ReviewBookClientProps) {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("全部");
  const [page, setPage] = useState(1);

  const genres = useMemo(() => {
    const counts = new Map<string, number>();
    for (const poem of poems) {
      counts.set(poem.genre || "唐诗", (counts.get(poem.genre || "唐诗") ?? 0) + 1);
    }
    return [
      { label: "全部", count: poems.length },
      ...Array.from(counts, ([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count || a.label.localeCompare(b.label)),
    ];
  }, [poems]);

  const filteredPoems = useMemo(() => {
    const keyword = query.trim();
    return poems.filter((poem) => {
      const matchesGenre = genre === "全部" || (poem.genre || "唐诗") === genre;
      const matchesQuery = !keyword || `${poem.title}${poem.author}${poem.genre}${poem.content}`.includes(keyword);
      return matchesGenre && matchesQuery;
    });
  }, [genre, poems, query]);

  const pageCount = Math.max(1, Math.ceil(filteredPoems.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pagedPoems = filteredPoems.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function changeGenre(nextGenre: string) {
    setGenre(nextGenre);
    setPage(1);
  }

  function updateQuery(nextQuery: string) {
    setQuery(nextQuery);
    setPage(1);
  }

  return (
    <section>
      <div className="review-controls">
        <div className="filter-row" aria-label="复习册分类">
          {genres.map((item) => (
            <button className={`filter-chip ${genre === item.label ? "is-active" : ""}`} type="button" key={item.label} onClick={() => changeGenre(item.label)}>
              {item.label} {item.count}
            </button>
          ))}
        </div>
        <button className="select-control" type="button">
          最近复习 <ChevronDown size={15} />
        </button>
        <label className="toolbar-search">
          <Search size={16} />
          <input className="toolbar-input" value={query} onChange={(event) => updateQuery(event.target.value)} placeholder="搜索复习册" />
        </label>
      </div>

      {filteredPoems.length ? (
        <div className="review-list">
          {pagedPoems.map((poem) => (
            <article className="panel review-row" key={poem.id}>
              <Link className="search-thumbnail-frame" href={`/poems/${poem.id}`}>
                <Image
                  src={poemThumbnail}
                  alt={`${poem.title} 水墨缩略图`}
                  className="search-thumbnail"
                  fill
                  sizes="(max-width: 660px) 84px, 220px"
                  placeholder="blur"
                />
              </Link>
              <div>
                <h2>{poem.title}</h2>
                <div className="poem-meta">
                  <span>{poem.author}</span>
                  <span>【唐代】</span>
                </div>
                <p className="excerpt">{compactText(poem.content, 64)}</p>
                <div className="tag-row">
                  <span className="tag">{poem.genre || "唐诗"}</span>
                </div>
              </div>
              <div className="review-row-actions">
                <Link className="button secondary compact" href={`/poems/${poem.id}/test`}>
                  <RefreshCcw size={16} />
                  重新学习
                </Link>
                <RemoveReviewButton poemId={poem.id} />
                <Link className="detail-link" href={`/poems/${poem.id}`} aria-label={`查看${poem.title}详情`}>
                  查看详情 <ChevronRight size={16} />
                </Link>
              </div>
            </article>
          ))}
          <div className="toolbar-meta review-pagination-row">
            <span>共 {filteredPoems.length} 条</span>
            {pageCount > 1 ? (
              <div className="pagination" aria-label="复习册分页">
                <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={currentPage === 1}>
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: pageCount }, (_, index) => index + 1).map((item) => (
                  <button className={item === currentPage ? "is-active" : ""} type="button" onClick={() => setPage(item)} key={item}>
                    {item}
                  </button>
                ))}
                <button type="button" onClick={() => setPage((value) => Math.min(pageCount, value + 1))} disabled={currentPage === pageCount}>
                  <ChevronRight size={16} />
                </button>
              </div>
            ) : null}
            <button className="select-control" type="button">
              {pageSize} 条/页 <ChevronDown size={15} />
            </button>
          </div>
        </div>
      ) : (
        <div className="empty">没有找到匹配的复习诗。</div>
      )}
    </section>
  );
}
