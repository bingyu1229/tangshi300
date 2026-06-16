import { XMLParser } from "fast-xml-parser";
import type { Poem } from "@/lib/types";
import { makePoemId, splitPoemLines, stripHtml } from "@/lib/text";

type RawPoemNode = {
  title?: string;
  auth?: string;
  type?: string;
  content?: string;
  desc?: string;
};

function normalizeNodes(value: RawPoemNode | RawPoemNode[] | undefined): RawPoemNode[] {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

function extractSection(desc: string, labels: string[]): string {
  if (!desc) {
    return "";
  }

  const labelPattern = labels.join("|");
  const match = desc.match(new RegExp(`<strong>\\s*(${labelPattern})\\s*<\\/strong>([\\s\\S]*?)(?=<p>\\s*<strong>|$)`, "i"));
  return match ? stripHtml(match[2]) : "";
}

export function parseTangshiXml(xml: string): Poem[] {
  const parser = new XMLParser({
    cdataPropName: false,
    ignoreAttributes: false,
    trimValues: true,
    processEntities: true,
  });

  const parsed = parser.parse(xml);
  const nodes = normalizeNodes(parsed?.root?.node);

  return nodes
    .map((node, index): Poem | null => {
      const title = stripHtml(String(node.title ?? ""));
      const author = stripHtml(String(node.auth ?? ""));
      const genre = stripHtml(String(node.type ?? ""));
      const content = stripHtml(String(node.content ?? ""));
      const desc = String(node.desc ?? "");
      const lines = splitPoemLines(content);

      if (!title || !author || lines.length < 2) {
        return null;
      }

      return {
        id: makePoemId(title, author, index),
        title,
        author,
        genre,
        content: lines.join("\n"),
        lines,
        notes: extractSection(desc, ["注释", "注解", "解释"]),
        translation: extractSection(desc, ["译文", "翻译", "白话译文"]),
        appreciation: extractSection(desc, ["赏析", "鉴赏", "简析"]),
        source: "tangshi300.xml",
      };
    })
    .filter((poem): poem is Poem => poem !== null);
}

export function pickStableSample(poems: Poem[], count: number): Poem[] {
  return [...poems]
    .map((poem, index) => ({
      poem,
      score: seededScore(`${poem.id}-${index}`),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, count)
    .map((item) => item.poem);
}

function seededScore(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }

  return Math.abs(hash);
}
