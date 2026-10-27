import { DatasetOutput } from '@helloao/tools/generation/dataset.js';
import { simplifyVerse } from '@helloao/tools/generation/simple.js';
import { bookIdMap } from '@helloao/tools/generation/book-order.js';
import { VerseOfTheDay } from '@helloao/tools/generation/verse-of-the-day.js';

/**
 * The formats that the verse of the day review can be printed in.
 */
export type VerseOfTheDayReviewFormat = 'table' | 'markdown' | 'csv';

/**
 * A row in the verse of the day review.
 */
export interface VerseOfTheDayReviewRow {
    /**
     * The 1-based position of the verse in the list.
     */
    number: number;

    /**
     * The human-readable reference. e.g. "Proverbs 3:5-6"
     */
    reference: string;

    /**
     * The categories of the verse.
     */
    categories: string[];

    /**
     * The text of the verse (or passage) in the translation.
     * Null if the translation doesn't contain the verse.
     */
    text: string | null;
}

/**
 * Gets the plain text of every verse in the first translation of the given dataset.
 * @param dataset The dataset that contains the translation.
 * @returns A map of "BOOK chapter:verse" keys (e.g. "JHN 3:16") to the text of the verse.
 */
export function getVerseTexts(dataset: DatasetOutput): Map<string, string> {
    const texts = new Map<string, string>();
    const translation = dataset.translations[0];
    for (let book of translation?.books ?? []) {
        for (let { chapter } of book.chapters) {
            for (let item of chapter.content) {
                if (item.type !== 'verse') {
                    continue;
                }
                const text = simplifyVerse(item)
                    .text.replace(/\s+/g, ' ')
                    .trim();
                const key = `${book.id} ${chapter.number}:${item.number}`;
                // Some sources split a verse into several pieces (e.g. around a heading).
                const existing = texts.get(key);
                texts.set(key, existing ? `${existing} ${text}` : text);
            }
        }
    }
    return texts;
}

/**
 * Creates the review rows for the given verses.
 * @param verses The verses to review.
 * @param texts The texts of the verses, as returned by {@link getVerseTexts}.
 */
export function createReviewRows(
    verses: VerseOfTheDay[],
    texts: Map<string, string>
): VerseOfTheDayReviewRow[] {
    const bookNames = bookIdMap.get('eng');
    return verses.map((v, i) => {
        const name = bookNames?.get(v.book)?.commonName ?? v.book;
        const end = v.endVerse ?? v.verse;
        const parts: string[] = [];
        let missing = false;
        for (let verse = v.verse; verse <= end; verse++) {
            const text = texts.get(`${v.book} ${v.chapter}:${verse}`);
            if (text === undefined) {
                missing = true;
            } else {
                parts.push(text);
            }
        }
        return {
            number: i + 1,
            reference: `${name} ${v.chapter}:${v.verse}${v.endVerse ? `-${v.endVerse}` : ''}`,
            categories: v.categories,
            text: missing ? null : parts.join(' '),
        };
    });
}

/**
 * The text that is shown for verses that the translation doesn't contain.
 */
const MISSING_TEXT = '[not found in the translation]';

/**
 * Formats the given review rows.
 * @param rows The rows to format.
 * @param format The format to use.
 * @param width The maximum width of a line in the table format. Text is wrapped to fit.
 */
export function formatReviewRows(
    rows: VerseOfTheDayReviewRow[],
    format: VerseOfTheDayReviewFormat,
    width: number = 120
): string {
    const headers = ['#', 'Reference', 'Categories', 'Text'];
    const cells = rows.map((r) => [
        String(r.number),
        r.reference,
        r.categories.join(', '),
        r.text ?? MISSING_TEXT,
    ]);

    if (format === 'csv') {
        const escape = (value: string) =>
            /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
        return [headers, ...cells]
            .map((row) => row.map(escape).join(','))
            .join('\n');
    }

    if (format === 'markdown') {
        const escape = (value: string) => value.replace(/\|/g, '\\|');
        return [
            `| ${headers.join(' | ')} |`,
            `| ${headers.map(() => '---').join(' | ')} |`,
            ...cells.map((row) => `| ${row.map(escape).join(' | ')} |`),
        ].join('\n');
    }

    const gap = '  ';
    const widths = headers
        .slice(0, 3)
        .map((h, i) =>
            Math.max(h.length, ...cells.map((row) => row[i].length))
        );
    const fixedWidth = widths.reduce((sum, w) => sum + w + gap.length, 0);
    const textWidth = Math.max(30, width - fixedWidth);
    const pad = (value: string, i: number) =>
        i === 0 ? value.padStart(widths[i]) : value.padEnd(widths[i]);
    const line = (values: string[]) =>
        values
            .map((v, i) => (i < 3 ? pad(v, i) : v))
            .join(gap)
            .trimEnd();

    const lines = [
        line(headers),
        line([...widths.map((w) => '-'.repeat(w)), '-'.repeat(textWidth)]),
    ];
    for (let row of cells) {
        const wrapped = wrapText(row[3], textWidth);
        lines.push(line([row[0], row[1], row[2], wrapped[0]]));
        for (let continuation of wrapped.slice(1)) {
            lines.push(line(['', '', '', continuation]));
        }
    }
    return lines.join('\n');
}

/**
 * Wraps the given text into lines that are at most the given width.
 * Words that are longer than the width are put on their own line.
 */
export function wrapText(text: string, width: number): string[] {
    const lines: string[] = [];
    let current = '';
    for (let word of text.split(' ')) {
        if (current && current.length + 1 + word.length > width) {
            lines.push(current);
            current = word;
        } else {
            current = current ? `${current} ${word}` : word;
        }
    }
    lines.push(current);
    return lines;
}
