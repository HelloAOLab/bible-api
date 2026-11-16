import {
    CommentaryBookNode,
    CommentaryChapterNode,
    CommentaryParseTree,
} from './types.js';
import { SwordCommentaryEntry } from './sword-module.js';

/**
 * The version of the SWORD commentary parser.
 * Bump it when the output of the parser changes, so that SWORD commentaries are reimported.
 */
export const SWORD_COMMENTARY_PARSER_VERSION = 1;

/**
 * The content of a commentary/sword input file.
 * SWORD modules are binary, so they are read into this JSON structure before they are parsed.
 */
export interface SwordCommentaryContent {
    /**
     * The markup that the entries use. (The SourceType from the module config)
     * Defaults to OSIS.
     */
    sourceType?: string | null;

    /**
     * The entries of the commentary.
     */
    entries: SwordCommentaryEntry[];
}

/**
 * Parses commentaries that were read from SWORD modules.
 */
export class SwordCommentaryParser {
    /**
     * Parses the given JSON serialized SwordCommentaryContent.
     * @param content The JSON.
     */
    parse(content: string): CommentaryParseTree {
        return this.parseContent(JSON.parse(content));
    }

    /**
     * Parses the given content.
     * @param content The content.
     */
    parseContent(content: SwordCommentaryContent): CommentaryParseTree {
        const tree: CommentaryParseTree = {
            type: 'commentary/root',
            books: [],
        };

        const sourceType = content.sourceType ?? 'OSIS';
        let book = null as CommentaryBookNode | null;
        let chapter = null as CommentaryChapterNode | null;

        for (let entry of content.entries) {
            let text = swordMarkupToText(entry.text, sourceType);
            let chapterIntroduction: string | null = null;
            if (entry.verse > 0) {
                [chapterIntroduction, text] = splitVerseHeading(
                    text,
                    entry.verse
                );
            }
            if (!text && !chapterIntroduction) {
                continue;
            }

            if (book?.book !== entry.book) {
                book = tree.books.find((b) => b.book === entry.book) ?? null;
                if (!book) {
                    book = {
                        type: 'book',
                        book: entry.book,
                        introduction: null,
                        chapters: [],
                    };
                    tree.books.push(book);
                }
                chapter = null;
            }

            if (entry.chapter <= 0) {
                book.introduction = appendText(book.introduction, text);
                continue;
            }

            if (chapter?.number !== entry.chapter) {
                chapter =
                    book.chapters.find((c) => c.number === entry.chapter) ??
                    null;
                if (!chapter) {
                    chapter = {
                        type: 'chapter',
                        number: entry.chapter,
                        introduction: null,
                        verses: [],
                    };
                    book.chapters.push(chapter);
                }
            }

            if (chapterIntroduction) {
                chapter.introduction = appendText(
                    chapter.introduction,
                    chapterIntroduction
                );
            }

            if (entry.verse <= 0) {
                chapter.introduction = appendText(chapter.introduction, text);
                continue;
            }

            if (!text) {
                continue;
            }

            const verse = chapter.verses.find((v) => v.number === entry.verse);
            if (verse) {
                verse.content.push(text);
            } else {
                chapter.verses.push({
                    type: 'verse',
                    number: entry.verse,
                    content: [text],
                });
            }
        }

        return tree;
    }
}

function appendText(existing: string | null, text: string): string {
    return existing ? `${existing}\n${text}` : text;
}

/**
 * Some commentaries (like Adam Clarke's) start the comment for each verse with a "Verse N" heading.
 * The heading only repeats the verse that the entry is for, so it is removed.
 * Any text before the heading of the first verse is the introduction of the chapter.
 * @param text The text of the entry.
 * @param verse The verse that the entry is for.
 * @returns The introduction of the chapter (if any) and the text of the verse.
 */
function splitVerseHeading(
    text: string,
    verse: number
): [string | null, string] {
    const lines = text.split('\n');
    const heading = lines.indexOf(`Verse ${verse}`);
    if (heading === 0) {
        return [null, lines.slice(1).join('\n')];
    } else if (heading > 0 && verse === 1) {
        return [
            lines.slice(0, heading).join('\n'),
            lines.slice(heading + 1).join('\n'),
        ];
    }
    return [null, text];
}

/**
 * The elements that start a new paragraph in OSIS, ThML, and GBF markup.
 */
const BLOCK_ELEMENTS = new Set([
    // OSIS
    'div',
    'p',
    'lb',
    'lg',
    'l',
    'title',
    'chapter',
    'list',
    'item',
    'table',
    'row',
    'head',
    // ThML / HTML
    'br',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'li',
    'ul',
    'ol',
    'tr',
    'blockquote',
    'pre',
    // GBF paragraph and line breaks
    'cm',
    'cl',
]);

/**
 * The elements whose content is not part of the text.
 */
const SKIPPED_ELEMENTS = new Set(['script', 'style', 'rf']);

const TAG_REGEX =
    /<(\/?)([A-Za-z][\w:.-]*)((?:[^>"']|"[^"]*"|'[^']*')*?)(\/?)>|<!--[\s\S]*?-->|([^<]+)|</g;

/**
 * Converts the given SWORD entry markup into plain text.
 * Paragraphs are separated by a newline.
 * @param markup The markup.
 * @param sourceType The SourceType of the module. (OSIS, ThML, GBF, TEI, or Plaintext)
 */
export function swordMarkupToText(markup: string, sourceType: string): string {
    if (/^plain/i.test(sourceType)) {
        return normalizeParagraphs(markup.split(/\r?\n/));
    }

    const isGbf = /^gbf$/i.test(sourceType);
    const paragraphs: string[] = [];
    let current = '';
    let skipDepth = 0;
    // GBF notes run from <RF> to <Rf>, which only differ in case.
    let inGbfNote = false;

    const breakParagraph = () => {
        paragraphs.push(current);
        current = '';
    };

    for (let match of markup.matchAll(TAG_REGEX)) {
        const [token, closing, rawName, attributes, selfClosing, text] = match;

        if (text !== undefined || rawName === undefined) {
            if (skipDepth === 0 && !inGbfNote) {
                current += decodeEntities(text ?? token);
            }
            continue;
        }

        if (isGbf) {
            if (rawName === 'RF') {
                inGbfNote = true;
            } else if (rawName === 'Rf') {
                inGbfNote = false;
            } else if (/^C[ML]$/.test(rawName) && !inGbfNote) {
                breakParagraph();
            }
            continue;
        }

        const name = rawName.toLowerCase();
        if (name === 'note' || SKIPPED_ELEMENTS.has(name)) {
            // Notes are left out because they usually contain cross references or textual variants.
            if (!selfClosing) {
                skipDepth += closing ? -1 : 1;
                skipDepth = Math.max(0, skipDepth);
            }
            continue;
        }

        if (skipDepth > 0) {
            continue;
        }

        if (BLOCK_ELEMENTS.has(name)) {
            breakParagraph();
        } else if (name === 'q' && attributes) {
            // OSIS quotes can carry the quotation mark that they should display.
            const marker = /\bmarker\s*=\s*"([^"]*)"/.exec(attributes);
            if (marker) {
                current += decodeEntities(marker[1]);
            }
        }
    }
    breakParagraph();

    return normalizeParagraphs(paragraphs);
}

function normalizeParagraphs(paragraphs: string[]): string {
    return paragraphs
        .map((p) => p.replace(/\s+/g, ' ').trim())
        .filter((p) => p.length > 0)
        .join('\n');
}

const NAMED_ENTITIES: Record<string, string> = {
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    nbsp: ' ',
};

function decodeEntities(text: string): string {
    return text.replace(
        /&(#x[0-9a-fA-F]+|#[0-9]+|[A-Za-z]+);/g,
        (entity, value: string) => {
            if (value[0] === '#') {
                const code =
                    value[1] === 'x' || value[1] === 'X'
                        ? parseInt(value.slice(2), 16)
                        : parseInt(value.slice(1), 10);
                return Number.isFinite(code) && code <= 0x10ffff
                    ? String.fromCodePoint(code)
                    : entity;
            }
            return NAMED_ENTITIES[value.toLowerCase()] ?? entity;
        }
    );
}
