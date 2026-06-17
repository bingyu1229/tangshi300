import fs from "node:fs";
import type { Poem } from "@/lib/types";
import { audioPublicDir, databasePath, sampleJsonPath } from "@/lib/paths";
import { allRows, getDb, persistDb } from "@/lib/db/sqlite";
import { buildSearchTerms } from "@/lib/text";

type ExistingAudioRow = {
  poem_id: string;
  speaker: string;
  model: string;
  duration_ms: number | null;
};

const defaultAudioModel = "Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice";
const defaultAudioSpeaker = "Uncle_Fu";

async function main() {
  if (!fs.existsSync(sampleJsonPath)) {
    throw new Error(`Missing sample JSON. Run npm run convert:data first: ${sampleJsonPath}`);
  }

  const poems = JSON.parse(fs.readFileSync(sampleJsonPath, "utf8")) as Poem[];
  const db = await getDb();
  const now = new Date().toISOString();
  const existingAudio = new Map(
    allRows<ExistingAudioRow>(db, "SELECT poem_id, speaker, model, duration_ms FROM poem_audio WHERE status = 'ready'").map(
      (row) => [row.poem_id, row],
    ),
  );

  db.run("DELETE FROM poem_audio");
  db.run("DELETE FROM learning_progress");
  db.run("DELETE FROM daily_recommendations");
  db.run("DELETE FROM poem_search_terms");
  db.run("DELETE FROM poems");

  const insert = db.prepare(`
    INSERT INTO poems(
      id, title, author, genre, content, lines_json, notes, translation, appreciation, source, created_at, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  try {
    for (const poem of poems) {
      insert.run([
        poem.id,
        poem.title,
        poem.author,
        poem.genre,
        poem.content,
        JSON.stringify(poem.lines),
        poem.notes,
        poem.translation,
        poem.appreciation,
        poem.source,
        now,
        now,
      ]);
    }
  } finally {
    insert.free();
  }

  const insertSearchTerm = db.prepare(`
    INSERT OR REPLACE INTO poem_search_terms(term, poem_id, weight)
    VALUES (?, ?, ?)
  `);
  let searchTermCount = 0;

  try {
    for (const poem of poems) {
      const fields = [
        { value: poem.title, weight: 8 },
        { value: poem.author, weight: 6 },
        { value: poem.genre, weight: 3 },
        { value: poem.content, weight: 5 },
        { value: poem.notes, weight: 2 },
        { value: poem.translation, weight: 2 },
        { value: poem.appreciation, weight: 1 },
      ];
      const terms = new Map<string, number>();

      for (const field of fields) {
        for (const term of buildSearchTerms(field.value)) {
          terms.set(term, Math.max(terms.get(term) ?? 0, field.weight));
        }
      }

      for (const [term, weight] of terms) {
        insertSearchTerm.run([term, poem.id, weight]);
        searchTermCount += 1;
      }
    }
  } finally {
    insertSearchTerm.free();
  }

  const relinkedAudioCount = relinkExistingAudio(poems, existingAudio, now, db);

  persistDb(db);

  console.log(`Seeded ${poems.length} poems`);
  console.log(`Search terms indexed: ${searchTermCount}`);
  console.log(`Relinked existing audio files: ${relinkedAudioCount}`);
  console.log(`Database: ${databasePath}`);
}

function relinkExistingAudio(
  poems: Poem[],
  existingAudio: Map<string, ExistingAudioRow>,
  now: string,
  db: Awaited<ReturnType<typeof getDb>>,
): number {
  const insertAudio = db.prepare(`
    INSERT INTO poem_audio(id, poem_id, speaker, model, file_path, duration_ms, status, error_message, created_at)
    VALUES (?, ?, ?, ?, ?, ?, 'ready', NULL, ?)
  `);
  let linked = 0;

  try {
    for (const poem of poems) {
      const filePath = existingAudioPath(poem.id);
      if (!filePath) {
        continue;
      }

      const existing = existingAudio.get(poem.id);
      insertAudio.run([
        `audio-${poem.id}`,
        poem.id,
        existing?.speaker ?? defaultAudioSpeaker,
        existing?.model ?? defaultAudioModel,
        filePath,
        existing?.duration_ms ?? null,
        now,
      ]);
      linked += 1;
    }
  } finally {
    insertAudio.free();
  }

  return linked;
}

function existingAudioPath(poemId: string): string | null {
  for (const extension of ["wav", "mp3"]) {
    const fileName = `${poemId}.${extension}`;
    if (fs.existsSync(`${audioPublicDir}/${fileName}`)) {
      return `/audio/${fileName}`;
    }
  }

  return null;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
