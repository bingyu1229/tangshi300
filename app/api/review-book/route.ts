import { NextResponse } from "next/server";
import { getReviewBook } from "@/lib/db/poems";

export const dynamic = "force-dynamic";

export async function GET() {
  const poems = await getReviewBook();
  return NextResponse.json({ poems });
}
