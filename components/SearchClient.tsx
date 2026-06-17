"use client";

import Link from "next/link";
import { ChevronDown, ChevronRight, Search } from "lucide-react";
import { useState } from "react";
import { InkArtwork, artworkVariant } from "@/components/InkArtwork";
import type { PoemSummary } from "@/lib/types";
import { compactText } from "@/lib/text";

export function SearchClient({ initialPoems }: { initialPoems: PoemSummary[] }) {
  const [query, setQuery] = useState("");
  const [poems, setPoems] = useState(initialPoems);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const response = await fetch(`/api/poems?q=${encodeURIComponent(query)}`);
    const data = (await response.json()) as { poems: PoemSummary[] };
    setPoems(data.poems);
    setLoading(false);
  }

  return (
    <div className="search-toolbar">
      <form className="search-form" onSubmit={onSubmit}>
        <Search size={20} />
        <input
          className="search-input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="输入题目、作者、词语或诗句"
          aria-label="搜索唐诗"
        />
        <button className="button" type="submit" disabled={loading}>
          {loading ? "搜索中" : "搜索"}
        </button>
      </form>
      <div className="filter-row" aria-label="搜索范围">
        {["全部", "标题", "作者", "关键词", "诗句"].map((filter, index) => (
          <button className={`filter-chip ${index === 0 ? "is-active" : ""}`} type="button" key={filter}>
            {filter}
          </button>
        ))}
      </div>
      <div className="toolbar-meta">
        <span>共找到 {poems.length} 条结果</span>
        <button className="select-control" type="button">
          默认排序 <ChevronDown size={15} />
        </button>
      </div>
      {poems.length ? (
        <div className="search-results">
          {poems.map((poem) => (
            <Link className="panel search-card" href={`/poems/${poem.id}`} key={poem.id}>
              <InkArtwork title={poem.title} variant={artworkVariant(poem.id)} size="small" />
              <div>
                <h2>{poem.title}</h2>
                <div className="poem-meta">
                  <span>{poem.author}</span>
                  <span>【唐代】</span>
                </div>
                <p className="excerpt">
                  {compactText(poem.content, 58)}
                  {query ? <span className="highlight"> {query}</span> : null}
                </p>
                <div className="tag-row">
                  <span className="tag">{poem.genre || "唐诗"}</span>
                  <span className="tag">唐诗三百首</span>
                </div>
              </div>
              <span className="detail-link">
                查看详情 <ChevronRight size={16} />
              </span>
            </Link>
          ))}
          <div className="pagination" aria-label="搜索结果分页">
            <button type="button">‹</button>
            <span className="is-active">1</span>
            <span>2</span>
            <span>3</span>
            <span>…</span>
            <span>5</span>
            <button type="button">›</button>
          </div>
        </div>
      ) : (
        <div className="empty">没有找到匹配的诗。</div>
      )}
    </div>
  );
}
