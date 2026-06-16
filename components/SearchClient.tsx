"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { PoemCard } from "@/components/PoemCard";
import type { PoemSummary } from "@/lib/types";

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
    <div className="stack">
      <form className="search-form" onSubmit={onSubmit}>
        <input
          className="search-input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="输入题目、作者、词语或诗句"
          aria-label="搜索唐诗"
        />
        <button className="button" type="submit" disabled={loading}>
          <Search size={18} />
          {loading ? "搜索中" : "搜索"}
        </button>
      </form>
      {poems.length ? (
        <div className="stack">
          {poems.map((poem) => (
            <PoemCard key={poem.id} poem={poem} />
          ))}
        </div>
      ) : (
        <div className="empty">没有找到匹配的诗。</div>
      )}
    </div>
  );
}
