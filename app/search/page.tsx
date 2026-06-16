import { listPoems } from "@/lib/db/poems";
import { SearchClient } from "@/components/SearchClient";

export const dynamic = "force-dynamic";

export default async function SearchPage() {
  const poems = await listPoems(20);

  return (
    <div className="page">
      <section className="panel">
        <p className="section-title">搜索</p>
        <h1 className="poem-title">寻章摘句</h1>
        <p className="poem-meta">可按题目、作者、体裁、正文、注释、译文、赏析搜索。</p>
      </section>
      <section className="content-section">
        <SearchClient initialPoems={poems} />
      </section>
    </div>
  );
}
