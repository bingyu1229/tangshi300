"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { PoemSummary } from "@/lib/types";
import { compactText } from "@/lib/text";
import poemThumbnail from "@/ui/thumbnail-2-sm.jpg";

type SearchClientProps = {
  initialPoems: PoemSummary[];
  initialQuery?: string;
};

type FilterKey = "all" | "title" | "author" | "keyword" | "line";

const filters: { key: FilterKey; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "title", label: "标题" },
  { key: "author", label: "作者" },
  { key: "keyword", label: "关键词" },
  { key: "line", label: "诗句" },
];

const pageSize = 8;

export function SearchClient({ initialPoems, initialQuery = "" }: SearchClientProps) {
  const [query, setQuery] = useState(initialQuery);
  const [poems, setPoems] = useState(initialPoems);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [page, setPage] = useState(1);

  const filteredPoems = useMemo(() => {
    const keyword = query.trim();
    if (!keyword || filter === "all") {
      return poems;
    }

    return poems.filter((poem) => {
      if (filter === "title") return poem.title.includes(keyword);
      if (filter === "author") return poem.author.includes(keyword);
      if (filter === "line") return poem.content.includes(keyword);
      return `${poem.title}${poem.author}${poem.genre}${poem.content}`.includes(keyword);
    });
  }, [filter, poems, query]);

  const pageCount = Math.max(1, Math.ceil(filteredPoems.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pagedPoems = filteredPoems.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const visiblePages = paginationRange(pageCount, currentPage);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/poems?q=${encodeURIComponent(query)}`);
      const data = (await response.json()) as { poems: PoemSummary[] };
      setPoems(data.poems);
      setPage(1);
    } finally {
      setLoading(false);
    }
  }

  function changeFilter(nextFilter: FilterKey) {
    setFilter(nextFilter);
    setPage(1);
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
        {filters.map((item) => (
          <button
            className={`filter-chip ${filter === item.key ? "is-active" : ""}`}
            type="button"
            key={item.key}
            onClick={() => changeFilter(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="toolbar-meta">
        <span>共找到 {filteredPoems.length} 条结果</span>
        <button className="select-control" type="button">
          默认排序 <ChevronDown size={15} />
        </button>
      </div>
      {filteredPoems.length ? (
        <>
          <div className="search-results">
            {pagedPoems.map((poem) => (
              <Link className="panel search-card" href={`/poems/${poem.id}`} key={poem.id}>
                <span className="search-thumbnail-frame">
                  <Image
                    src={poemThumbnail}
                    alt={`${poem.title} 水墨缩略图`}
                    className="search-thumbnail"
                    fill
                    sizes="(max-width: 660px) 76px, 168px"
                    placeholder="blur"
                  />
                </span>
                <div>
                  <h2>{poem.title}</h2>
                  <div className="poem-meta">
                    <span>{poem.author}</span>
                    <span>【唐代】</span>
                  </div>
                  <p className="excerpt">{highlightQuery(compactText(poem.content, 64), query)}</p>
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
          </div>
          {pageCount > 1 ? (
            <div className="pagination" aria-label="搜索结果分页">
              <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={currentPage === 1} aria-label="上一页">
                <ChevronLeft size={16} />
              </button>
              {visiblePages.map((item, index) =>
                item === "ellipsis" ? (
                  <span className="pagination-ellipsis" key={`${item}-${index}`}>
                    ...
                  </span>
                ) : (
                  <button className={item === currentPage ? "is-active" : ""} type="button" onClick={() => setPage(item)} key={item}>
                    {item}
                  </button>
                ),
              )}
              <button
                type="button"
                onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
                disabled={currentPage === pageCount}
                aria-label="下一页"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          ) : null}
        </>
      ) : (
        <div className="empty">没有找到匹配的诗。</div>
      )}
    </div>
  );
}

function highlightQuery(text: string, query: string) {
  const keyword = query.trim();
  if (!keyword) {
    return text;
  }

  const index = text.indexOf(keyword);
  if (index === -1) {
    return text;
  }

  return (
    <>
      {text.slice(0, index)}
      <span className="highlight">{keyword}</span>
      {text.slice(index + keyword.length)}
    </>
  );
}

function paginationRange(pageCount: number, currentPage: number): Array<number | "ellipsis"> {
  if (pageCount <= 5) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, "ellipsis", pageCount];
  }

  if (currentPage >= pageCount - 2) {
    return [1, "ellipsis", pageCount - 2, pageCount - 1, pageCount];
  }

  return [1, "ellipsis", currentPage, "ellipsis", pageCount];
}
