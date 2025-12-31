import { Chapter, ParseTree, Verse, ParseMessage } from './types.js';
import { getBookIdFromNumber } from '../generation/book-order.js';

/**
 * The version of the Beblia XML parser.
 * Used to determine whether input files need to be re-parsed.
 */
export const BEBLIA_PARSER_VERSION = '1';

/**
 * Metadata extracted from the Beblia XML root element.
 */
export interface BebliaMetadata {
    translation: string;
    version?: string;
    link?: string;
    status?: string;
}

/**
 * Defines a class that is able to parse Beblia XML content.
 *
 * Beblia XML format:
 * ```xml
 * <?xml version="1.0" encoding="utf-8"?>
 * <bible translation="Aceh Language (Alkitab HABA GET)"
 *        version="Old and New Testament in Today's Aceh Language @ LAI, 1997"
 *        link="https://www.bible.com/bible/2835/EPH.6.LAIACE">
 *   <testament name="Old">
 *     <book number="1">
 *       <chapter number="1">
 *         <verse number="1">In the beginning...</verse>
 *       </chapter>
 *     </book>
 *   </testament>
 * </bible>
 * ```
 */
export class BebliaXmlParser {
    private _domParser: DOMParser;
    private _messages: ParseMessage[] = [];

    constructor(domParser: DOMParser) {
        this._domParser = domParser;
    }

    /**
     * Parses the specified Beblia XML content.
     *
     * @param xml - The Beblia XML content to parse.
     * @param bookNumber - Optional book number to extract. If not specified, returns the first book.
     * @returns The parse tree that was generated.
     */
    public parse(xml: string, bookNumber?: number): ParseTree {
        this._messages = [];
        const doc = this._domParser.parseFromString(xml, 'application/xml');
        const bibleElement = doc.documentElement;

        // Check for XML parsing errors
        const parseError = bibleElement.querySelector('parsererror');
        if (parseError) {
            throw new Error(
                `Failed to parse Beblia XML: ${parseError.textContent}`
            );
        }

        // Extract metadata from root element
        const metadata = this.extractMetadata(bibleElement);

        // Find the book to parse
        const bookElement = bookNumber
            ? bibleElement.querySelector(`book[number="${bookNumber}"]`)
            : bibleElement.querySelector('book');

        if (!bookElement) {
            throw new Error(
                bookNumber
                    ? `Book number ${bookNumber} not found in Beblia XML`
                    : 'No books found in Beblia XML'
            );
        }

        const bookNum = parseInt(
            bookElement.getAttribute('number') || '0',
            10
        );
        const bookId = getBookIdFromNumber(bookNum);

        if (!bookId) {
            this._messages.push({
                type: 'warning',
                message: `Unknown book number: ${bookNum}`,
            });
        }

        const root: ParseTree = {
            type: 'root',
            id: bookId,
            content: [],
        };

        // Parse chapters
        const chapters = bookElement.querySelectorAll('chapter');
        for (const chapterElement of chapters) {
            const chapter = this.parseChapter(chapterElement);
            if (chapter) {
                root.content.push(chapter);
            }
        }

        if (this._messages.length > 0) {
            root.parseMessages = this._messages.slice();
        }

        return root;
    }

    /**
     * Parses all books in the XML file.
     * Returns an array of ParseTrees, one for each book.
     *
     * @param xml - The Beblia XML content to parse.
     * @returns Array of parse trees, one per book.
     */
    public parseAllBooks(xml: string): ParseTree[] {
        this._messages = [];
        const doc = this._domParser.parseFromString(xml, 'application/xml');
        const bibleElement = doc.documentElement;

        // Check for XML parsing errors
        const parseError = bibleElement.querySelector('parsererror');
        if (parseError) {
            throw new Error(
                `Failed to parse Beblia XML: ${parseError.textContent}`
            );
        }

        const books = bibleElement.querySelectorAll('book');
        const results: ParseTree[] = [];

        for (const bookElement of books) {
            const bookNum = parseInt(
                bookElement.getAttribute('number') || '0',
                10
            );
            const bookId = getBookIdFromNumber(bookNum);

            if (!bookId) {
                this._messages.push({
                    type: 'warning',
                    message: `Unknown book number: ${bookNum}, skipping`,
                });
                continue;
            }

            const root: ParseTree = {
                type: 'root',
                id: bookId,
                content: [],
            };

            // Parse chapters
            const chapters = bookElement.querySelectorAll('chapter');
            for (const chapterElement of chapters) {
                const chapter = this.parseChapter(chapterElement);
                if (chapter) {
                    root.content.push(chapter);
                }
            }

            if (this._messages.length > 0) {
                root.parseMessages = this._messages.slice();
                this._messages = []; // Reset for next book
            }

            results.push(root);
        }

        return results;
    }

    /**
     * Extracts metadata from the root bible element.
     */
    public extractMetadata(bibleElement: Element): BebliaMetadata {
        return {
            translation: bibleElement.getAttribute('translation') || '',
            version: bibleElement.getAttribute('version') || undefined,
            link: bibleElement.getAttribute('link') || undefined,
            status: bibleElement.getAttribute('status') || undefined,
        };
    }

    /**
     * Parses metadata from raw XML string without full parsing.
     */
    public parseMetadataOnly(xml: string): BebliaMetadata {
        const doc = this._domParser.parseFromString(xml, 'application/xml');
        return this.extractMetadata(doc.documentElement);
    }

    /**
     * Gets the list of book numbers available in the XML.
     */
    public getAvailableBooks(xml: string): number[] {
        const doc = this._domParser.parseFromString(xml, 'application/xml');
        const books = doc.documentElement.querySelectorAll('book');
        const bookNumbers: number[] = [];

        for (const book of books) {
            const num = parseInt(book.getAttribute('number') || '0', 10);
            if (num > 0) {
                bookNumbers.push(num);
            }
        }

        return bookNumbers.sort((a, b) => a - b);
    }

    /**
     * Parses a chapter element.
     */
    private parseChapter(chapterElement: Element): Chapter | null {
        const chapterNum = parseInt(
            chapterElement.getAttribute('number') || '0',
            10
        );

        if (chapterNum <= 0) {
            this._messages.push({
                type: 'warning',
                message: `Invalid chapter number: ${chapterElement.getAttribute('number')}`,
            });
            return null;
        }

        const chapter: Chapter = {
            type: 'chapter',
            number: chapterNum,
            content: [],
            footnotes: [],
        };

        const verses = chapterElement.querySelectorAll('verse');
        for (const verseElement of verses) {
            const verse = this.parseVerse(verseElement);
            if (verse) {
                chapter.content.push(verse);
            }
        }

        return chapter;
    }

    /**
     * Parses a verse element.
     */
    private parseVerse(verseElement: Element): Verse | null {
        const verseNum = parseInt(
            verseElement.getAttribute('number') || '0',
            10
        );

        if (verseNum <= 0) {
            this._messages.push({
                type: 'warning',
                message: `Invalid verse number: ${verseElement.getAttribute('number')}`,
            });
            return null;
        }

        const text = verseElement.textContent?.trim() || '';

        const verse: Verse = {
            type: 'verse',
            number: verseNum,
            content: text ? [text] : [],
        };

        return verse;
    }
}

/**
 * Checks if an XML string is in Beblia format.
 *
 * @param xml - The XML content to check.
 * @returns true if the XML appears to be in Beblia format.
 */
export function isBebliaXml(xml: string): boolean {
    // Quick check without full parsing
    return (
        xml.includes('<bible') &&
        xml.includes('<testament') &&
        xml.includes('<book')
    );
}
