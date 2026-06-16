export type LearningStatus = "new" | "learning" | "review_book";

export type Poem = {
  id: string;
  title: string;
  author: string;
  genre: string;
  content: string;
  lines: string[];
  notes: string;
  translation: string;
  appreciation: string;
  source: string;
};

export type PoemSummary = Pick<Poem, "id" | "title" | "author" | "genre" | "content"> & {
  status: LearningStatus;
  audioStatus: AudioStatus;
};

export type PoemDetail = Poem & {
  status: LearningStatus;
  audio?: PoemAudio;
};

export type PoemAudio = {
  poemId: string;
  speaker: string;
  model: string;
  filePath: string;
  durationMs: number | null;
  status: AudioStatus;
  errorMessage: string | null;
};

export type AudioStatus = "missing" | "pending" | "ready" | "failed";

export type TestPrompt = {
  promptLineIndex: number;
  promptLine: string;
  expectedLine: string;
};
