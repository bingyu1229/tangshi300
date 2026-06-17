"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight, RefreshCcw } from "lucide-react";
import type { PoemSummary } from "@/lib/types";

export function HomeRecommendations({ poems }: { poems: PoemSummary[] }) {
  const pageSize = 3;
  const [offset, setOffset] = useState(0);
  const shownPoems = poems.length <= pageSize ? poems : Array.from({ length: pageSize }, (_, index) => poems[(offset + index) % poems.length]);

  function rotateRecommendations() {
    if (poems.length <= pageSize) {
      return;
    }

    setOffset((current) => (current + pageSize) % poems.length);
  }

  return (
    <div className="panel list-panel">
      <div className="panel-heading">
        <h2>为你推荐</h2>
        <button type="button" onClick={rotateRecommendations} disabled={poems.length <= pageSize}>
          <RefreshCcw size={14} /> 换一批
        </button>
      </div>
      {shownPoems.map((poem) => (
        <Link className="mini-row" href={`/poems/${poem.id}`} key={`${poem.id}-${offset}`}>
          <div>
            <h3>{poem.title}</h3>
            <p>{poem.author} 【唐代】</p>
          </div>
          <span />
          <ChevronRight size={16} />
        </Link>
      ))}
    </div>
  );
}
