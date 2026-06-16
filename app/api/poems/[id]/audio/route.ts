import { NextResponse } from "next/server";
import { getPoemDetail } from "@/lib/db/poems";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const poem = await getPoemDetail(id);

  if (!poem) {
    return NextResponse.json({ error: "Poem not found" }, { status: 404 });
  }

  return NextResponse.json({
    audio: poem.audio ?? {
      poemId: id,
      status: "missing",
      speaker: "Uncle_Fu",
      model: "Qwen3-TTS-12Hz-0.6B-CustomVoice",
      filePath: "",
      durationMs: null,
      errorMessage: null,
    },
  });
}
