import fs from "node:fs";
import initSqlJs from "sql.js/dist/sql-asm.js";
import type { Database, SqlJsStatic } from "sql.js";
import { dataDir, databasePath } from "@/lib/paths";

let SQL: SqlJsStatic | null = null;
let db: Database | null = null;

async function getSqlJs(): Promise<SqlJsStatic> {
  if (SQL) {
    return SQL;
  }

  SQL = await initSqlJs();

  return SQL;
}

export async function getDb(): Promise<Database> {
  if (db) {
    return db;
  }

  fs.mkdirSync(dataDir, { recursive: true });
  const SQLModule = await getSqlJs();
  db = fs.existsSync(databasePath)
    ? new SQLModule.Database(fs.readFileSync(databasePath))
    : new SQLModule.Database();

  ensureSchema(db);
  persistDb(db);
  return db;
}

export function ensureSchema(database: Database): void {
  database.run(`
    CREATE TABLE IF NOT EXISTS poems (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      genre TEXT NOT NULL,
      content TEXT NOT NULL,
      lines_json TEXT NOT NULL,
      notes TEXT NOT NULL DEFAULT '',
      translation TEXT NOT NULL DEFAULT '',
      appreciation TEXT NOT NULL DEFAULT '',
      source TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS poem_audio (
      id TEXT PRIMARY KEY,
      poem_id TEXT NOT NULL,
      speaker TEXT NOT NULL,
      model TEXT NOT NULL,
      file_path TEXT NOT NULL,
      duration_ms INTEGER,
      status TEXT NOT NULL,
      error_message TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (poem_id) REFERENCES poems(id)
    );

    CREATE TABLE IF NOT EXISTS learning_progress (
      id TEXT PRIMARY KEY,
      poem_id TEXT NOT NULL UNIQUE,
      status TEXT NOT NULL,
      mastered_at TEXT,
      last_tested_at TEXT,
      correct_count INTEGER NOT NULL DEFAULT 0,
      wrong_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (poem_id) REFERENCES poems(id)
    );

    CREATE TABLE IF NOT EXISTS daily_recommendations (
      day TEXT PRIMARY KEY,
      poem_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (poem_id) REFERENCES poems(id)
    );

    CREATE TABLE IF NOT EXISTS poem_search_terms (
      term TEXT NOT NULL,
      poem_id TEXT NOT NULL,
      weight INTEGER NOT NULL DEFAULT 1,
      PRIMARY KEY (term, poem_id),
      FOREIGN KEY (poem_id) REFERENCES poems(id)
    );

    CREATE INDEX IF NOT EXISTS idx_poems_title ON poems(title);
    CREATE INDEX IF NOT EXISTS idx_poems_author ON poems(author);
    CREATE INDEX IF NOT EXISTS idx_progress_status ON learning_progress(status);
    CREATE INDEX IF NOT EXISTS idx_search_terms_term ON poem_search_terms(term);
    CREATE INDEX IF NOT EXISTS idx_search_terms_poem ON poem_search_terms(poem_id);
  `);
}

export function persistDb(database: Database): void {
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(databasePath, Buffer.from(database.export()));
}

export function allRows<T extends Record<string, unknown>>(
  database: Database,
  sql: string,
  params: (string | number | null)[] = [],
): T[] {
  const stmt = database.prepare(sql);
  const rows: T[] = [];

  try {
    stmt.bind(params);
    while (stmt.step()) {
      rows.push(stmt.getAsObject() as T);
    }
  } finally {
    stmt.free();
  }

  return rows;
}

export function firstRow<T extends Record<string, unknown>>(
  database: Database,
  sql: string,
  params: (string | number | null)[] = [],
): T | null {
  return allRows<T>(database, sql, params)[0] ?? null;
}
