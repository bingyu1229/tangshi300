const punctuationPattern = /[\s，。！？、；：,.!?;:"“”‘’《》（）()【】\[\]—\-]/g;

export function normalizeAnswer(value: string): string {
  return value.normalize("NFKC").replace(punctuationPattern, "").trim();
}

export function isCorrectAnswer(input: string, expected: string): boolean {
  return normalizeAnswer(input) === normalizeAnswer(expected);
}

export function stripHtml(value: string): string {
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&ldquo;|&rdquo;/g, "\"")
    .replace(/&lsquo;|&rsquo;/g, "'")
    .replace(/&mdash;/g, "-")
    .replace(/&hellip;/g, "...")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function splitPoemLines(content: string): string[] {
  const normalized = stripHtml(content)
    .replace(/。/g, "。\n")
    .replace(/！/g, "！\n")
    .replace(/？/g, "？\n")
    .replace(/；/g, "；\n");

  return normalized
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function makePoemId(title: string, author: string, index: number): string {
  const raw = `${title}-${author}-${index}`;
  let hash = 2166136261;

  for (let i = 0; i < raw.length; i += 1) {
    hash ^= raw.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return `poem-${(hash >>> 0).toString(16)}`;
}

export function compactText(value: string, max = 80): string {
  const text = stripHtml(value).replace(/\s+/g, " ");
  return text.length > max ? `${text.slice(0, max)}...` : text;
}

export function buildSearchTerms(value: string): string[] {
  const normalized = value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{Script=Han}\p{Letter}\p{Number}]+/gu, " ")
    .trim();
  const terms: string[] = [];

  for (const token of normalized.split(/\s+/).filter(Boolean)) {
    if (hasHan(token)) {
      terms.push(...hanNgrams(token));
    } else {
      terms.push(token);
    }
  }

  return [...new Set(terms)];
}

function hasHan(value: string): boolean {
  return /\p{Script=Han}/u.test(value);
}

function hanNgrams(value: string): string[] {
  const chars = [...value];
  const grams = new Set<string>();

  for (const size of [1, 2, 3]) {
    for (let index = 0; index <= chars.length - size; index += 1) {
      grams.add(chars.slice(index, index + size).join(""));
    }
  }

  return [...grams];
}
