import fs from "node:fs";
import type { Poem } from "@/lib/types";
import { databasePath, sampleJsonPath } from "@/lib/paths";
import { getDb, persistDb } from "@/lib/db/sqlite";

async function main() {
  if (!fs.existsSync(sampleJsonPath)) {
    throw new Error(`Missing sample JSON. Run npm run convert:data first: ${sampleJsonPath}`);
  }

  const poems = JSON.parse(fs.readFileSync(sampleJsonPath, "utf8")) as Poem[];
  const db = await getDb();
  const now = new Date().toISOString();

  db.run("DELETE FROM poem_audio");
  db.run("DELETE FROM learning_progress");
  db.run("DELETE FROM daily_recommendations");
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

  persistDb(db);

  console.log(`Seeded ${poems.length} poems`);
  console.log(`Database: ${databasePath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
