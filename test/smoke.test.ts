import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { after, before, test } from "node:test";

type ModuleNamespace<T> = T | { default: T };

type DbModule = typeof import("../lib/db/sqlite");
type PoemsModule = typeof import("../lib/db/poems");
type PoemsRouteModule = typeof import("../app/api/poems/route");
type PoemRouteModule = typeof import("../app/api/poems/[id]/route");
type TestRouteModule = typeof import("../app/api/poems/[id]/test/route");
type ReviewRouteModule = typeof import("../app/api/review-book/route");

const tempDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "tangshi300-smoke-"));
process.env.TANGSHI_DATA_DIR = tempDataDir;

let dbModule: DbModule;
let poemsModule: PoemsModule;
let poemsRoute: PoemsRouteModule;
let poemRoute: PoemRouteModule;
let testRoute: TestRouteModule;
let reviewRoute: ReviewRouteModule;

async function loadModule<T>(modulePath: string): Promise<T> {
  const module = (await import(modulePath)) as ModuleNamespace<T>;
  return "default" in module ? module.default : module;
}

before(async () => {
  dbModule = await loadModule<DbModule>("../lib/db/sqlite.ts");
  poemsModule = await loadModule<PoemsModule>("../lib/db/poems.ts");
  poemsRoute = await loadModule<PoemsRouteModule>("../app/api/poems/route.ts");
  poemRoute = await loadModule<PoemRouteModule>("../app/api/poems/[id]/route.ts");
  testRoute = await loadModule<TestRouteModule>("../app/api/poems/[id]/test/route.ts");
  reviewRoute = await loadModule<ReviewRouteModule>("../app/api/review-book/route.ts");

  const db = await dbModule.getDb();
  const now = new Date("2026-01-01T00:00:00.000Z").toISOString();
  const insert = db.prepare(`
    INSERT INTO poems(
      id, title, author, genre, content, lines_json, notes, translation, appreciation, source, created_at, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  try {
    insert.run([
      "smoke-quiet-night",
      "Quiet Night Thought",
      "Li Bai",
      "five-character quatrain",
      "Before my bed the moonlight glows\nI lift my head and watch the moon",
      JSON.stringify(["Before my bed the moonlight glows", "I lift my head and watch the moon"]),
      "Smoke test note",
      "Smoke test translation",
      "Smoke test appreciation",
      "smoke",
      now,
      now,
    ]);
    insert.run([
      "smoke-spring-dawn",
      "Spring Dawn",
      "Meng Haoran",
      "five-character quatrain",
      "Spring sleep knows no dawn\nEverywhere birds are heard",
      JSON.stringify(["Spring sleep knows no dawn", "Everywhere birds are heard"]),
      "Smoke test note",
      "Smoke test translation",
      "Smoke test appreciation",
      "smoke",
      now,
      now,
    ]);
  } finally {
    insert.free();
  }

  dbModule.persistDb(db);
});

after(() => {
  fs.rmSync(tempDataDir, { recursive: true, force: true });
});

test("poem repository lists, searches, and reads seeded poems", async () => {
  const poems = await poemsModule.listPoems();
  assert.equal(poems.length, 2);
  assert.deepEqual(
    poems.map((poem) => poem.id),
    ["smoke-quiet-night", "smoke-spring-dawn"],
  );
  assert.equal(poems[0].status, "new");
  assert.equal(poems[0].audioStatus, "missing");

  const searchResults = await poemsModule.searchPoems("Li Bai");
  assert.deepEqual(
    searchResults.map((poem) => poem.id),
    ["smoke-quiet-night"],
  );

  const detail = await poemsModule.getPoemDetail("smoke-quiet-night");
  assert.equal(detail?.title, "Quiet Night Thought");
  assert.deepEqual(detail?.lines, ["Before my bed the moonlight glows", "I lift my head and watch the moon"]);
});

test("daily poem, test prompt, answer submission, and review book flow work", async () => {
  const dailyPoem = await poemsModule.getDailyPoem();
  assert.ok(dailyPoem);

  const repeatedDailyPoem = await poemsModule.getDailyPoem();
  assert.equal(repeatedDailyPoem?.id, dailyPoem.id);

  const prompt = await poemsModule.getTestPrompt("smoke-quiet-night");
  assert.deepEqual(prompt, {
    promptLineIndex: 0,
    promptLine: "Before my bed the moonlight glows",
    expectedLine: "I lift my head and watch the moon",
  });

  const result = await poemsModule.submitTestAnswer("smoke-quiet-night", 0, "I lift my head and watch the moon");
  assert.deepEqual(result, {
    correct: true,
    expected: "I lift my head and watch the moon",
    status: "review_book",
  });

  const reviewBook = await poemsModule.getReviewBook();
  assert.equal(reviewBook.some((poem) => poem.id === "smoke-quiet-night"), true);

  await poemsModule.removeFromReviewBook("smoke-quiet-night");
  const updatedReviewBook = await poemsModule.getReviewBook();
  assert.equal(updatedReviewBook.some((poem) => poem.id === "smoke-quiet-night"), false);
});

test("core API route handlers return expected smoke responses", async () => {
  const listResponse = await poemsRoute.GET(new Request("http://localhost/api/poems?q=Meng"));
  assert.equal(listResponse.status, 200);
  const listBody = (await listResponse.json()) as { poems: Array<{ id: string }> };
  assert.deepEqual(
    listBody.poems.map((poem) => poem.id),
    ["smoke-spring-dawn"],
  );

  const detailResponse = await poemRoute.GET(new Request("http://localhost/api/poems/smoke-quiet-night"), {
    params: Promise.resolve({ id: "smoke-quiet-night" }),
  });
  assert.equal(detailResponse.status, 200);
  const detailBody = (await detailResponse.json()) as { poem: { id: string } };
  assert.equal(detailBody.poem.id, "smoke-quiet-night");

  const missingResponse = await poemRoute.GET(new Request("http://localhost/api/poems/missing"), {
    params: Promise.resolve({ id: "missing" }),
  });
  assert.equal(missingResponse.status, 404);

  const promptResponse = await testRoute.GET(new Request("http://localhost/api/poems/smoke-spring-dawn/test"), {
    params: Promise.resolve({ id: "smoke-spring-dawn" }),
  });
  assert.equal(promptResponse.status, 200);

  const submitResponse = await testRoute.POST(
    new Request("http://localhost/api/poems/smoke-spring-dawn/test", {
      method: "POST",
      body: JSON.stringify({ promptLineIndex: 0, answer: "not the expected line" }),
    }),
    { params: Promise.resolve({ id: "smoke-spring-dawn" }) },
  );
  assert.equal(submitResponse.status, 200);
  const submitBody = (await submitResponse.json()) as { correct: boolean; status: string };
  assert.equal(submitBody.correct, false);
  assert.equal(submitBody.status, "learning");

  const reviewResponse = await reviewRoute.GET();
  assert.equal(reviewResponse.status, 200);
});
