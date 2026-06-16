import { NextResponse } from "next/server";
import { listPoems, searchPoems } from "@/lib/db/poems";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();
  const poems = query ? await searchPoems(query) : await listPoems();

  return NextResponse.json({ poems });
}
