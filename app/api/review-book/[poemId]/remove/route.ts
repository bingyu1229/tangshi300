import { NextResponse } from "next/server";
import { removeFromReviewBook } from "@/lib/db/poems";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ poemId: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  const { poemId } = await context.params;
  await removeFromReviewBook(poemId);
  return NextResponse.json({ ok: true });
}
