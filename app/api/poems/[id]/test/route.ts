import { NextResponse } from "next/server";
import { getTestPrompt, submitTestAnswer } from "@/lib/db/poems";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const prompt = await getTestPrompt(id);

  if (!prompt) {
    return NextResponse.json({ error: "No test prompt available" }, { status: 404 });
  }

  return NextResponse.json({ prompt });
}

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = (await request.json()) as { promptLineIndex?: number; answer?: string };
  const result = await submitTestAnswer(id, body.promptLineIndex ?? 0, body.answer ?? "");

  if (!result) {
    return NextResponse.json({ error: "Poem not found" }, { status: 404 });
  }

  return NextResponse.json(result);
}
