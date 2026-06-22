import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { getPoemDetail, getTestPrompt } from "@/lib/db/poems";
import { TestClient } from "@/components/TestClient";
import cloud from "@/ui/cloud.png";
import pageBackground from "@/ui/page-backgroud-sm.jpg";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function TestPage({ params }: PageProps) {
  const { id } = await params;
  const [poem, prompt] = await Promise.all([getPoemDetail(id), getTestPrompt(id)]);

  if (!poem || !prompt) {
    notFound();
  }

  return (
    <div
      className="page page-test"
      style={{ "--page-bg": `url(${pageBackground.src})`, "--cloud": `url(${cloud.src})` } as CSSProperties}
    >
      <TestClient poem={poem} prompt={prompt} />
    </div>
  );
}
