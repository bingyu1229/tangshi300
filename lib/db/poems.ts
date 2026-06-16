import { getDb, allRows, firstRow, persistDb } from "@/lib/db/sqlite";
import type { LearningStatus, Poem, PoemAudio, PoemDetail, PoemSummary, TestPrompt } from "@/lib/types";
import { isCorrectAnswer } from "@/lib/text";

type PoemRow = {
  id: string;
  title: string;
  author: string;
  genre: string;
  content: string;
  lines_json: string;
  notes: string;
  translation: string;
  appreciation: string;
  source: string;
  status: LearningStatus | null;
  audio_status: string | null;
};

type AudioRow = {
  poem_id: string;
  speaker: string;
  model: string;
  file_path: string;
  duration_ms: number | null;
  status: "pending" | "ready" | "failed";
  error_message: string | null;
};

const defaultStatus: LearningStatus = "new";

function toPoem(row: PoemRow): Poem {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    genre: row.genre,
    content: row.content,
    lines: JSON.parse(row.lines_json) as string[],
    notes: row.notes,
    translation: row.translation,
    appreciation: row.appreciation,
    source: row.source,
  };
}

function toSummary(row: PoemRow): PoemSummary {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    genre: row.genre,
    content: row.content,
    status: row.status ?? defaultStatus,
    audioStatus: row.audio_status === "ready" ? "ready" : row.audio_status === "failed" ? "failed" : "missing",
  };
}

function toAudio(row: AudioRow | null): PoemAudio | undefined {
  if (!row) {
    return undefined;
  }

  return {
    poemId: row.poem_id,
    speaker: row.speaker,
    model: row.model,
    filePath: row.file_path,
    durationMs: row.duration_ms,
    status: row.status,
    errorMessage: row.error_message,
  };
}

export async function listPoems(limit = 50): Promise<PoemSummary[]> {
  const db = await getDb();
  const rows = allRows<PoemRow>(
    db,
    `SELECT p.*, lp.status, pa.status AS audio_status
     FROM poems p
     LEFT JOIN learning_progress lp ON lp.poem_id = p.id
     LEFT JOIN poem_audio pa ON pa.poem_id = p.id
     ORDER BY p.title
     LIMIT ?`,
    [limit],
  );

  return rows.map(toSummary);
}

export async function searchPoems(query: string): Promise<PoemSummary[]> {
  const db = await getDb();
  const keyword = `%${query.trim()}%`;
  const rows = allRows<PoemRow>(
    db,
    `SELECT p.*, lp.status, pa.status AS audio_status
     FROM poems p
     LEFT JOIN learning_progress lp ON lp.poem_id = p.id
     LEFT JOIN poem_audio pa ON pa.poem_id = p.id
     WHERE p.title LIKE ?
        OR p.author LIKE ?
        OR p.genre LIKE ?
        OR p.content LIKE ?
        OR p.notes LIKE ?
        OR p.translation LIKE ?
        OR p.appreciation LIKE ?
     ORDER BY p.title
     LIMIT 50`,
    [keyword, keyword, keyword, keyword, keyword, keyword, keyword],
  );

  return rows.map(toSummary);
}

export async function getPoemDetail(id: string): Promise<PoemDetail | null> {
  const db = await getDb();
  const row = firstRow<PoemRow>(
    db,
    `SELECT p.*, lp.status, pa.status AS audio_status
     FROM poems p
     LEFT JOIN learning_progress lp ON lp.poem_id = p.id
     LEFT JOIN poem_audio pa ON pa.poem_id = p.id
     WHERE p.id = ?`,
    [id],
  );

  if (!row) {
    return null;
  }

  const audioRow = firstRow<AudioRow>(
    db,
    `SELECT poem_id, speaker, model, file_path, duration_ms, status, error_message
     FROM poem_audio
     WHERE poem_id = ?`,
    [id],
  );

  return {
    ...toPoem(row),
    status: row.status ?? defaultStatus,
    audio: toAudio(audioRow),
  };
}

export async function getDailyPoem(): Promise<PoemDetail | null> {
  const db = await getDb();
  const day = new Date().toISOString().slice(0, 10);
  const existing = firstRow<{ poem_id: string }>(db, "SELECT poem_id FROM daily_recommendations WHERE day = ?", [day]);

  if (existing) {
    return getPoemDetail(existing.poem_id);
  }

  const candidates = allRows<{ id: string }>(
    db,
    `SELECT p.id
     FROM poems p
     LEFT JOIN learning_progress lp ON lp.poem_id = p.id
     WHERE COALESCE(lp.status, 'new') != 'review_book'
     ORDER BY RANDOM()
     LIMIT 1`,
  );

  const selected = candidates[0];
  if (!selected) {
    return null;
  }

  const now = new Date().toISOString();
  db.run("INSERT OR REPLACE INTO daily_recommendations(day, poem_id, created_at) VALUES (?, ?, ?)", [day, selected.id, now]);
  persistDb(db);
  return getPoemDetail(selected.id);
}

export async function getReviewBook(): Promise<PoemSummary[]> {
  const db = await getDb();
  const rows = allRows<PoemRow>(
    db,
    `SELECT p.*, lp.status, pa.status AS audio_status
     FROM learning_progress lp
     JOIN poems p ON p.id = lp.poem_id
     LEFT JOIN poem_audio pa ON pa.poem_id = p.id
     WHERE lp.status = 'review_book'
     ORDER BY lp.mastered_at DESC`,
  );

  return rows.map(toSummary);
}

export async function removeFromReviewBook(poemId: string): Promise<void> {
  const db = await getDb();
  const now = new Date().toISOString();
  db.run("UPDATE learning_progress SET status = 'learning', updated_at = ? WHERE poem_id = ?", [now, poemId]);
  persistDb(db);
}

export async function getTestPrompt(poemId: string): Promise<TestPrompt | null> {
  const poem = await getPoemDetail(poemId);
  if (!poem || poem.lines.length < 2) {
    return null;
  }

  return {
    promptLineIndex: 0,
    promptLine: poem.lines[0],
    expectedLine: poem.lines[1],
  };
}

export async function submitTestAnswer(poemId: string, promptLineIndex: number, answer: string) {
  const poem = await getPoemDetail(poemId);
  if (!poem) {
    return null;
  }

  const expected = poem.lines[promptLineIndex + 1] ?? "";
  const correct = Boolean(expected) && isCorrectAnswer(answer, expected);
  const db = await getDb();
  const now = new Date().toISOString();
  const progressId = `progress-${poemId}`;

  db.run(
    `INSERT INTO learning_progress(
      id, poem_id, status, mastered_at, last_tested_at, correct_count, wrong_count, created_at, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(poem_id) DO UPDATE SET
      status = excluded.status,
      mastered_at = COALESCE(learning_progress.mastered_at, excluded.mastered_at),
      last_tested_at = excluded.last_tested_at,
      correct_count = learning_progress.correct_count + excluded.correct_count,
      wrong_count = learning_progress.wrong_count + excluded.wrong_count,
      updated_at = excluded.updated_at`,
    [
      progressId,
      poemId,
      correct ? "review_book" : "learning",
      correct ? now : null,
      now,
      correct ? 1 : 0,
      correct ? 0 : 1,
      now,
      now,
    ],
  );
  persistDb(db);

  return {
    correct,
    expected,
    status: correct ? "review_book" : "learning",
  };
}
