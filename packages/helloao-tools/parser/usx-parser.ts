import {
    Chapter,
    ChapterContent,
    Footnote,
    FootnoteReference,
    ParseTree,
    Verse,
    Text,
    HebrewSubtitle,
    InlineLineBreak,
    InlineHeading,
    ParseMessage,
} from './types.js';
import {
    iterateAll,
    children,
    RewindableIterator,
    isParent,
} from './iterators.js';
import { KNOWN_SKIPPED_VERSES } from '../utils.js';

enum NodeType {
    Text = 3,
}

/**
 * The version of the parser.
 * Used to determine whether input files need to be re-parsed.
 */
export const PARSER_VERSION = '2';

/**
 * Defines a class that is able to parse USX content.
 */
export class USXParser {
    private _domParser: DOMParser;
    private _noteCounter: number = 0;
    private _messages: ParseMessage[] = [];
    private _lastVerse: Verse | null = null;
    private _currentChapter: Chapter | null = null;
    private _bookId: string | null = null;

    constructor(domParser: DOMParser) {
        this._domParser = domParser;
    }

    /**
     * Parses the specified USX content.
     *
     * @param usx The USX content to parse.
     * @returns The parse tree that was generated.
     */
    public parse(usx: string): ParseTree {
        this._noteCounter = 0;
        this._messages = [];
        this._lastVerse = null;
        this._currentChapter = null;
        this._bookId = null;
        const parser = this._domParser;
        const doc = parser.parseFromString(usx, 'application/xml');
        const usxElement = doc.documentElement;

        let root: ParseTree = {
            type: 'root',
            content: [],
        };

        const bookElement = usxElement.querySelector('book[code]');

        if (!bookElement) {
            throw new Error('The USX content does not contain a book element.');
        }

        const bookCode = bookElement.getAttribute('code') || '';

        if (!bookCode) {
            throw new Error(
                'The book element does not contain a code attribute.'
            );
        }

        this._bookId = root.id = bookCode;

        const header = usxElement.querySelector('para[style="h"]');
        if (header) {
            root.header = header.textContent || '';
        }

        const titles = usxElement.querySelectorAll(
            'para[style="mt1"], para[style="mt2"], para[style="mt3"]'
        );
        // const title2 = usxElement.querySelector('para[style="mt2"]');
        // const title3 = usxElement.querySelector('para[style="mt3"]');

        if (titles.length > 0) {
            root.title = [...titles]
                .map((t) => t.textContent)
                .filter((t) => t)
                .join(' ');
        }

        for (let content of this.iterateRootContent(usxElement)) {
            root.content.push(content);
        }

        if (this._messages.length > 0) {
            root.parseMessages = this._messages.slice();
        }

        return root;
    }

    *iterateRootContent(
        usxElement: Element
    ): Generator<ParseTree['content'][0]> {
        const iterator = iterateAll(usxElement);
        while (true) {
            const { done, value: child } = iterator.next();
            if (done) {
                break;
            }

            if (!(child instanceof Element)) {
                continue;
            }

            if (child.nodeName === 'chapter') {
                if (child.hasAttribute('eid')) {
                    continue;
                }

                const chapter: Chapter = {
                    type: 'chapter',
                    number: parseInt(child.getAttribute('number') || '0', 10),
                    content: [],
                    footnotes: [],
                };
                this._currentChapter = chapter;

                for (let content of this.iterateChapterContent(
                    chapter,
                    iterator
                )) {
                    chapter.content.push(content);
                }

                yield chapter;
            } else if (child.nodeName === 'para') {
                const style = child.getAttribute('style');
                if (
                    style === 's1' ||
                    style === 's2' ||
                    style === 's3' ||
                    style === 's4'
                ) {
                    yield {
                        type: 'heading',
                        content: child.textContent ? [child.textContent] : [],
                    };
                }
            }
        }
    }

    *iterateChapterContent(
        chapter: Chapter,
        nodes: RewindableIterator<Node>
    ): IterableIterator<ChapterContent> {
        while (true) {
            const { done, value: element } = nodes.next();
            if (done) {
                break;
            }

            if (!(element instanceof Element)) {
                continue;
            }

            if (element.nodeName === 'chapter') {
                break;
            } else if (element.nodeName === 'para') {
                const style = element.getAttribute('style');
                if (
                    style === 's1' ||
                    style === 's2' ||
                    style === 's3' ||
                    style === 's4'
                ) {
                    yield {
                        type: 'heading',
                        content: element.textContent
                            ? [element.textContent]
                            : [],
                    };
                } else if (style === 'b') {
                    yield {
                        type: 'line_break',
                    };
                } else if (style === 'd') {
                    yield* this.parseHebrewSubtitle(element, chapter, nodes);
                }
            } else if (element.nodeName === 'verse') {
                if (element.hasAttribute('eid')) {
                    continue;
                }

                yield this.parseVerse(element, chapter, nodes);
            }
        }
    }

    *iterateVerseContent(
        chapter: Chapter,
        verse: Verse,
        nodes: RewindableIterator<Node>
    ): IterableIterator<string | FootnoteReference | Text | InlineLineBreak> {
        let lastParent: Element | null = null;
        while (true) {
            const { done, value: node } = nodes.next();
            if (done) {
                break;
            }

            if (node.nodeName === 'verse') {
                if (!(node instanceof Element) || !node.hasAttribute('eid')) {
                    nodes.rewind(1);
                }
                break;
            }

            const parent = node.parentElement!;
            let poem: number | null = null;
            let descriptive: boolean | null = null;

            if (parent.nodeName === 'para') {
                const style = parent.getAttribute('style');
                if (
                    style === 'q1' ||
                    style === 'q2' ||
                    style === 'q3' ||
                    style === 'q4'
                ) {
                    poem =
                        style === 'q1'
                            ? 1
                            : style === 'q2'
                              ? 2
                              : style === 'q3'
                                ? 3
                                : 4;

                    // Send explicit line breaks
                    // if we are in a new paragraph but the previous paragraph had the same poem style
                    if (parent.previousElementSibling?.nodeName === 'para') {
                        const previousStyle =
                            parent.previousElementSibling?.getAttribute(
                                'style'
                            );
                        if (previousStyle === style && lastParent !== parent) {
                            lastParent = parent;
                            yield {
                                lineBreak: true,
                            };
                        }
                    }
                } else if (style === 'd') {
                    descriptive = true;
                }
            }

            for (let content of this.iterateNodeTextContent(
                nodes,
                node,
                chapter,
                verse
            )) {
                if (poem !== null || descriptive !== null) {
                    if (typeof content === 'string') {
                        let text: Text = {
                            text: content,
                        };

                        if (poem !== null) {
                            text.poem = poem;
                        }

                        if (descriptive !== null) {
                            text.descriptive = true;
                        }

                        yield text;
                    } else {
                        let text:
                            | InlineLineBreak
                            | InlineHeading
                            | FootnoteReference
                            | Text = {
                            ...content,
                        };

                        if ('text' in text) {
                            if (poem !== null) {
                                text.poem = poem;
                            }

                            if (descriptive !== null) {
                                text.descriptive = true;
                            }
                        }
                        yield text;
                    }
                } else {
                    yield content;
                }
            }
        }
    }

    parseVerse(
        element: Element,
        chapter: Chapter,
        nodes: RewindableIterator<Node>
    ): Verse {
        const verse: Verse = {
            type: 'verse',
            number: parseInt(element.getAttribute('number') || '0', 10),
            content: [],
        };

        if (this._currentChapter && this._lastVerse) {
            if (this._currentChapter.number === chapter.number) {
                // We're parsing the same chapter as the last one
                const delta = verse.number - this._lastVerse.number;
                if (delta > 1) {
                    // Delta is greater than 1, so we might have missed some verses
                    for (
                        let v = this._lastVerse.number + 1;
                        v < verse.number;
                        v++
                    ) {
                        let isExpected = false;
                        if (this._bookId) {
                            const missingVerse = `${this._bookId} ${chapter.number}:${v}`;
                            if (KNOWN_SKIPPED_VERSES.has(missingVerse)) {
                                isExpected = true;
                            }
                        }

                        if (!isExpected) {
                            this._messages.push({
                                type: 'warning',
                                message: `Verse ${this._bookId ?? '(null)'} ${chapter.number}:${v} is missing.`,
                            });
                        }
                    }
                }
            }
        }
        this._lastVerse = verse;

        for (let content of this.iterateVerseContent(chapter, verse, nodes)) {
            addOrJoin(verse.content, content);
        }

        trimContent(verse.content);
        return verse;
    }

    *parseHebrewSubtitle(
        para: Element,
        chapter: Chapter,
        nodes: RewindableIterator<Node>
    ): IterableIterator<HebrewSubtitle | Verse> {
        const subtitle: HebrewSubtitle = {
            type: 'hebrew_subtitle',
            content: [],
        };

        for (let content of this.iterateHebrewSubtitleContent(
            para,
            chapter,
            nodes
        )) {
            if (typeof content === 'object' && 'number' in content) {
                yield content;
                continue;
            }
            addOrJoin(subtitle.content, content);
        }

        trimContent(subtitle.content);
        if (subtitle.content.length > 0) {
            yield subtitle;
        }
    }

    *iterateHebrewSubtitleContent(
        element: Element,
        chapter: Chapter,
        nodes: RewindableIterator<Node>
    ): IterableIterator<
        Verse | string | Text | FootnoteReference | InlineLineBreak
    > {
        while (true) {
            const { done, value: node } = nodes.next();
            if (done) {
                break;
            }

            if (!isParent(node, element)) {
                nodes.rewind(1);
                break;
            }

            if (node instanceof Element && node.nodeName === 'verse') {
                yield this.parseVerse(node, chapter, nodes);
            } else {
                yield* this.iterateNodeTextContent(nodes, node, chapter);
            }
        }
    }

    *iterateNodeTextContent(
        nodes: RewindableIterator<Node>,
        node: Node,
        chapter: Chapter,
        verse?: Verse
    ): IterableIterator<string | Text | FootnoteReference | InlineLineBreak> {
        if (node instanceof Element && node.nodeName === 'note') {
            yield* this.iterateNote(nodes, node, chapter, verse);
        } else if (node instanceof Element && node.nodeName === 'char') {
            yield* this.iterateChar(nodes, node);
        } else if (
            node instanceof Element &&
            node.nodeName === 'para' &&
            node.getAttribute('style') === 'b'
        ) {
            for (let _ of children(nodes, node)) {
                // iterate through all the children to prevent iterating over them multiple times
            }
            yield {
                lineBreak: true,
            };
        } else if (node.nodeType === NodeType.Text) {
            yield node.textContent || '';
        }
    }

    *iterateCharContent(char: Element): IterableIterator<string | Text> {
        const style = char.getAttribute('style');
        const text = trimText(char.textContent || '');
        if (style === 'wj') {
            yield {
                text,
                wordsOfJesus: true,
            };
        } else {
            yield text;
        }
    }

    *iterateNote(
        nodes: RewindableIterator<Node>,
        node: Element,
        chapter: Chapter,
        verse?: Verse
    ): IterableIterator<FootnoteReference> {
        const style = node.getAttribute('style');
        if (style === 'f') {
            const verseReferenceRegex = /^[0-9]{1,3}:[0-9]{1,3}/;

            let text = '';
            for (let child of children(nodes, node)) {
                if (child.nodeType === NodeType.Text) {
                    text += child.textContent || '';
                }
            }

            text = text.trim();
            if (verseReferenceRegex.test(text)) {
                text = text.replace(verseReferenceRegex, '').trim();
            }

            const note: Footnote = {
                noteId: this._noteCounter++,
                caller: node.getAttribute('caller') || null,
                text,
                reference: {
                    chapter: chapter.number,
                    verse: verse?.number ?? 0,
                },
            };

            chapter.footnotes.push(note);

            yield {
                noteId: note.noteId,
            };
        } else {
            for (let _ of children(nodes, node)) {
                // iterate through all the children
                // so that we don't end up with duplicates
            }
        }
    }

    *iterateChar(
        nodes: RewindableIterator<Node>,
        node: Element
    ): IterableIterator<string | Text> {
        const style = node.getAttribute('style');
        let text = '';

        for (let char of children(nodes, node)) {
            if (char.nodeType === NodeType.Text) {
                text += char.textContent || '';
            }
        }

        if (style === 'wj') {
            yield {
                text,
                wordsOfJesus: true,
            };
        } else {
            yield text;
        }

        // if (!parentChar(node) && !parentNote(node)) {
        //     yield *iterateCharContent(node);
        // }
    }
}

// Taken from https://github.com/gracious-tech/fetch/blob/1576cc4eafb32bf347a09332094cf17c2231c90c/converters/usx-to-json/src/elements.ts#L16
const ignoredParaStyles = new Set([
    // <para> Identification [exclude all] - Running headings & table of contents
    'ide', // See https://github.com/schierlm/BibleMultiConverter/issues/67
    'rem', // Remarks (valid in schema though missed in docs)
    'h',
    'h1',
    'h2',
    'h3',
    'h4',
    'toc1',
    'toc2',
    'toc3',
    'toca1',
    'toca2',
    'toca3',

    /* <para> Introductions [exclude all] - Introductionary (non-biblical) content
        Which might be helpful in a printed book, but intro material in apps is usually bad UX,
        and users that really care can research a translations methodology themselves
    */
    'imt',
    'imt1',
    'imt2',
    'imt3',
    'imt4',
    'is',
    'is1',
    'is2',
    'is3',
    'is4',
    'ip',
    'ipi',
    'im',
    'imi',
    'ipq',
    'imq',
    'ipr',
    'iq',
    'iq1',
    'iq2',
    'iq3',
    'iq4',
    'ib',
    'ili',
    'ili1',
    'ili2',
    'ili3',
    'ili4',
    'iot',
    'io',
    'io1',
    'io2',
    'io3',
    'io4',
    'iex',
    'imte',
    'ie',

    /* <para> Headings [exclude some] - Exclude book & chapter headings but keep section headings
        Not excluded: ms# | mr | s# | sr | d | sp | sd#
    */
    'mt',
    'mt1',
    'mt2',
    'mt3',
    'mt4',
    'mte',
    'mte1',
    'mte2',
    'mte3',
    'mte4',
    'cl',
    'cd', // Non-biblical chapter summary, more than heading
    'r', // Parallels to be provided by external data
]);

function* iterateCharContent(char: Element): IterableIterator<string | Text> {
    const style = char.getAttribute('style');
    const text = trimText(char.textContent || '');
    if (style === 'wj') {
        yield {
            text,
            wordsOfJesus: true,
        };
    } else {
        yield text;
    }
}

function trimText(text: string): string {
    return text.replace(/\s+/g, ' ');
}

function trimContent<T extends string | unknown>(content: T[]): T[] {
    for (let i = 0; i < content.length; i++) {
        const value = content[i];
        if (typeof value === 'string') {
            content[i] = trimText(value as string).trim() as T;
            if (content[i] === '') {
                content.splice(i, 1);
                i--;
                continue;
            }
        } else if (isVerseText(value)) {
            value.text = trimText(value.text).trim();
            if (value.text === '') {
                content.splice(i, 1);
                i--;
                continue;
            }
        }
    }
    return content;
}

function addOrJoin(array: (string | unknown)[], value: string | unknown) {
    if (array.length === 0) {
        array.push(value);
    } else {
        const last = array[array.length - 1];
        if (typeof last === 'string' && typeof value === 'string') {
            array[array.length - 1] = last + value;
        } else if (
            isVerseText(last) &&
            isVerseText(value) &&
            hasSameFormatting(last, value)
        ) {
            last.text += value.text;
        } else {
            array.push(value);
        }
    }
}

function isVerseText(value: unknown): value is Text {
    return typeof value === 'object' && value !== null && 'text' in value;
}

function hasSameFormatting(a: Text, b: Text): boolean {
    return a.poem === b.poem && a.wordsOfJesus === b.wordsOfJesus;
}
