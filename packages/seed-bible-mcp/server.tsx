// server.tsx
import { FastMCP } from "fastmcp";
import { z } from "zod";

const BIBLE_API_BASE = "https://bible.helloao.org/api";

// Map user-friendly mentions to API translation IDs
const TRANSLATION_ALIASES: Record<string, string> = {
  BSB: "BSB",
  WEB: "ENGWEBP",
  ENGWEBP: "ENGWEBP",
  WLC: "heb_wlc",
  HEB_WLC: "heb_wlc",
  HEBREW: "heb_wlc",
  SBL: "grc_sbl",
  GRC_SBL: "grc_sbl",
  GREEK: "grc_sbl",
};

// Very simple reference parser:
// Matches: "Genesis 1", "Genesis 1:1-3", "Gen 1:1", "JHN 3:16", "1 John 1:1", etc.
const REF_RE =
  /(?<book>(?:[1-3]\s*)?[A-Za-z]+)\s+(?<chapter>\d+)(?::(?<verses>\d+(?:-\d+)?))?/i;

function norm(s: string): string {
  return s.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

const booksCache = new Map<string, Record<string, string>>();

/**
 * Build a map from various book name forms -> 3-letter book id (GEN, EXO, JHN, etc.).
 * Uses the API's books.json endpoint.
 */
async function getBooksMap(translation: string): Promise<Record<string, string>> {
  const cached = booksCache.get(translation);
  if (cached) return cached;

  const res = await fetch(`${BIBLE_API_BASE}/${translation}/books.json`);
  if (!res.ok) throw new Error(`books.json request failed: ${res.status}`);
  const data: any = await res.json();

  const m: Record<string, string> = {};
  for (const b of data.books ?? []) {
    const bookId = b.id;
    if (!bookId) continue;
    for (const key of [b.id, b.name, b.commonName, b.title]) {
      if (key) m[norm(key)] = bookId;
    }
  }

  booksCache.set(translation, m);
  return m;
}

function chooseTranslation(query: string): string {
  const uq = query.toUpperCase();
  for (const [alias, tid] of Object.entries(TRANSLATION_ALIASES)) {
    if (uq.includes(alias)) return tid;
  }
  // Default for unspecified requests
  return "BSB";
}

function makeResultId(
  translation: string,
  book: string,
  chapter: number,
  verses: string | null,
): string {
  // Keep it simple and parseable
  return `${translation}:${book}:${chapter}:${verses ?? ""}`;
}

function parseResultId(
  resultId: string,
): [string, string, number, string | null] {
  const parts = [...resultId.split(/:/, 4), "", "", "", ""].slice(0, 4);
  const [t, b, c, v] = parts;
  return [t, b, parseInt(c, 10), v || null];
}

type Ref = [string, string, number, string | null];

async function parseQueryToRef(query: string): Promise<Ref | null> {
  const m = REF_RE.exec(query);
  if (!m || !m.groups) return null;

  const translation = chooseTranslation(query);
  const bookRaw = m.groups.book.trim();
  const chapter = parseInt(m.groups.chapter, 10);
  const verses = m.groups.verses ?? null;

  // If user already provided a 3-letter ID (GEN/JHN/etc.), accept it.
  if (/^[A-Za-z]{3}$/.test(bookRaw)) {
    return [translation, bookRaw.toUpperCase(), chapter, verses];
  }

  // Otherwise map from book name -> id using API book metadata.
  // Using BSB book list is generally fine because IDs are standard across translations.
  const booksMap = await getBooksMap("BSB");
  const bookId = booksMap[norm(bookRaw)];
  if (!bookId) return null;

  return [translation, bookId, chapter, verses];
}

async function fetchChapterJson(
  translation: string,
  book: string,
  chapter: number,
): Promise<any> {
  const res = await fetch(
    `${BIBLE_API_BASE}/${translation}/${book}/${chapter}.json`,
  );
  if (!res.ok) throw new Error(`chapter request failed: ${res.status}`);
  return res.json();
}

/**
 * Verse content entries can be:
 *   - strings
 *   - formatted text objects { "text": "...", ... }
 *   - inline objects like { "lineBreak": true } or { "noteId": 0 }
 * We keep readable text and turn line breaks into newlines; ignore footnote refs.
 */
function flattenVerseContent(items: any[]): string {
  const out: string[] = [];
  for (const x of items) {
    if (typeof x === "string") {
      out.push(x);
    } else if (x && typeof x === "object") {
      if (typeof x.text === "string") {
        out.push(x.text);
      } else if (x.lineBreak === true) {
        out.push("\n");
      }
      // ignore noteId, headings, etc for plain verse text
    }
  }
  let s = out.join("");
  s = s.replace(/\s+\n/g, "\n");
  s = s.replace(/\n\s+/g, "\n");
  return s.trim();
}

function extractVerses(chapterJson: any, verseRange: string | null): string {
  const content: any[] = chapterJson?.chapter?.content ?? [];
  let start: number | null = null;
  let end: number | null = null;
  if (verseRange) {
    if (verseRange.includes("-")) {
      const [a, b] = verseRange.split("-", 2);
      start = parseInt(a, 10);
      end = parseInt(b, 10);
    } else {
      start = end = parseInt(verseRange, 10);
    }
  }

  const lines: string[] = [];
  for (const item of content) {
    if (!item || typeof item !== "object") continue;
    if (item.type !== "verse") continue;
    const num = item.number;
    if (typeof num !== "number" || !Number.isInteger(num)) continue;
    if (start !== null && (num < start || num > (end as number))) continue;

    const verseText = flattenVerseContent(item.content ?? []);
    lines.push(`${num}. ${verseText}`);
  }

  return lines.join("\n").trim();
}

// --- MCP server definition ---

const mcp = new FastMCP({
  name: "Free Use Bible (BSB/WEB/WLC/SBL)",
  version: "1.0.0",
  instructions:
    "Use search() to interpret a user query into a Bible passage result. " +
    "Then use fetch() to retrieve the full passage text. " +
    "Supports BSB, WEB (ENGWEBP), Hebrew WLC (heb_wlc), and SBL Greek NT (grc_sbl).",
});

mcp.addTool({
  name: "search",
  description:
    "Interpret a natural-language query into a single Bible passage result.",
  parameters: z.object({
    query: z.string().describe('A passage reference, e.g. "John 3:16" or "Gen 1:1-3 WEB".'),
  }),
  execute: async ({ query }) => {
    const ref = await parseQueryToRef(query);
    if (!ref) return JSON.stringify({ results: [] });

    const [translation, book, chapter, verses] = ref;
    const url = `${BIBLE_API_BASE}/${translation}/${book}/${chapter}.json`;
    const title = `${book} ${chapter}${verses ? ":" + verses : ""} (${translation})`;
    const resultId = makeResultId(translation, book, chapter, verses);

    return JSON.stringify({
      results: [{ id: resultId, title, url }],
    });
  },
});

mcp.addTool({
  name: "fetch",
  description: "Retrieve the full passage text for a result id from search().",
  parameters: z.object({
    id: z.string().describe("A result id returned by search()."),
  }),
  execute: async ({ id }) => {
    const [translation, book, chapter, verses] = parseResultId(id);
    const chapterJson = await fetchChapterJson(translation, book, chapter);

    const text = extractVerses(chapterJson, verses);
    const url = `${BIBLE_API_BASE}/${translation}/${book}/${chapter}.json`;
    const title = `${book} ${chapter}${verses ? ":" + verses : ""} (${translation})`;

    return JSON.stringify({
      id,
      title,
      text,
      url,
      metadata: { translation, book, chapter, verses },
    });
  },
});

const port = parseInt(process.env.PORT ?? "8000", 10);

mcp.start({
  transportType: "httpStream",
  httpStream: {
    endpoint: "/mcp",
    port,
  },
});
