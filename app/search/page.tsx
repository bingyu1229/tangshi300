import { SearchClient } from "@/components/SearchClient";
import { listPoems, searchPoems } from "@/lib/db/poems";

export const dynamic = "force-dynamic";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string | string[];
  }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const rawQuery = Array.isArray(params.q) ? params.q[0] : params.q;
  const query = rawQuery?.trim() ?? "";
  const poems = query ? await searchPoems(query) : await listPoems(20);

  return (
    <div className="page">
      <section className="page-heading">
        <h1>诗库 · 搜索</h1>
        <p>搜索古诗文，发现经典之美</p>
      </section>
      <SearchClient initialPoems={poems} initialQuery={query} />
    </div>
  );
}
