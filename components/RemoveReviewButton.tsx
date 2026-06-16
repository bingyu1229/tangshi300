"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function RemoveReviewButton({ poemId }: { poemId: string }) {
  const router = useRouter();

  async function remove() {
    await fetch(`/api/review-book/${poemId}/remove`, { method: "POST" });
    router.refresh();
  }

  return (
    <button className="button secondary" type="button" onClick={remove}>
      <Trash2 size={18} />
      移出复习册
    </button>
  );
}
