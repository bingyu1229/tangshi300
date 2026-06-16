import { NextResponse } from "next/server";
import { getDailyPoem } from "@/lib/db/poems";

export const dynamic = "force-dynamic";

export async function GET() {
  const poem = await getDailyPoem();
  return NextResponse.json({ poem });
}
