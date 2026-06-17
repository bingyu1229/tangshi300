import { listPoems } from "@/lib/db/poems";
import { SearchClient } from "@/components/SearchClient";

export const dynamic = "force-dynamic";

export default async function SearchPage() {
  const poems = await listPoems(20);

  return (
    <div className="page">
      <section className="page-heading">
        <h1>诗库 · 搜索</h1>
        <p>搜索古诗文，发现经典之美</p>
      </section>
      <SearchClient initialPoems={poems} />
    </div>
  );
}
