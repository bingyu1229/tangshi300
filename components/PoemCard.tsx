import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { InkArtwork, artworkVariant } from "@/components/InkArtwork";
import type { PoemSummary } from "@/lib/types";
import { compactText } from "@/lib/text";

export function PoemCard({ poem }: { poem: PoemSummary }) {
  return (
    <Link href={`/poems/${poem.id}`} className="poem-card">
      <InkArtwork title={poem.title} variant={artworkVariant(poem.id)} size="small" />
      <div>
        <h3>{poem.title}</h3>
        <p>
          {poem.author} 【唐代】
        </p>
        <p>{compactText(poem.content, 56)}</p>
        <div className="tag-row">
          <span className="tag">{poem.genre || "唐诗"}</span>
        </div>
      </div>
      <span className="detail-link">
        查看详情 <ChevronRight size={16} />
      </span>
    </Link>
  );
}
