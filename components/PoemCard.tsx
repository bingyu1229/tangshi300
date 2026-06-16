import Link from "next/link";
import type { PoemSummary } from "@/lib/types";
import { compactText } from "@/lib/text";

export function PoemCard({ poem }: { poem: PoemSummary }) {
  return (
    <Link href={`/poems/${poem.id}`} className="poem-card">
      <h3>{poem.title}</h3>
      <p>
        {poem.author} · {poem.genre || "唐诗"}
      </p>
      <p>{compactText(poem.content, 72)}</p>
    </Link>
  );
}
