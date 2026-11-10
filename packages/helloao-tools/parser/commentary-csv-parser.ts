import {
    CommentaryBookNode,
    CommentaryChapterNode,
    CommentaryParseTree,
} from './types.js';
import { getBookId, parseVerseReference } from '../utils.js';
import papaparse from 'papaparse';

const { parse } = papaparse;

export interface CsvLine {
    book: string;
    chapter: string;
    verse: string;
    commentaries: string;
}

export class CommentaryCsvParser {
    parse(data: string): CommentaryParseTree {
        // remove header automatically
        const firstLine = data.indexOf('\n');
        data = data.substring(firstLine + 1);

        const lines = parse<string[]>(data, {
            header: false,
            // transformHeader: (_, index) => {
            //     const headers = ['book', 'chapter', 'verse', 'commentaries'];
            //     if (index < headers.length) {
            //         return headers[index];
            //     } else {
            //         return '';
            //     }
            // },
            delimiter: ',',
            escapeChar: '"',
            quoteChar: '"',
        });
        return this.parseLines(
            lines.data.map((line: string[]) => ({
                book: line[0],
                chapter: line[1],
                verse: line[2],
                commentaries: line[3],
            }))
        );
    }

    parseLines(data: CsvLine[]): CommentaryParseTree {
        let tree: CommentaryParseTree = {
            type: 'commentary/root',
            books: [],
        };

        let book: CommentaryBookNode | null = null;
        let chapter: CommentaryChapterNode | null = null;
        for (let line of data) {
            if (hasValue(line.book)) {
                const id = getBookId(line.book);
                if (!id) {
                    throw new Error('Invalid book: ' + line.book);
                }

                book = tree.books.find((b) => b.book === id) ?? null;
                if (!book) {
                    book = {
                        type: 'book',
                        book: id,
                        introduction: null,
                        chapters: [],
                    };
                    tree.books.push(book);
                }

                if (!book.introduction) {
                    book.introduction = hasValue(line.commentaries)
                        ? line.commentaries
                        : null;
                }
            } else if (hasValue(line.chapter)) {
                const number = parseInt(line.chapter);
                if (isNaN(number)) {
                    throw new Error('Invalid chapter number: ' + line.chapter);
                }

                if (!book) {
                    throw new Error('Chapter without book');
                }

                chapter = {
                    type: 'chapter',
                    number,
                    introduction: hasValue(line.commentaries)
                        ? line.commentaries
                        : null,
                    verses: [],
                };
                book.chapters.push(chapter);
            } else if (hasValue(line.verse)) {
                const ref = parseVerseReference(line.verse);
                if (
                    ref &&
                    book &&
                    ref.book !== book.book &&
                    // Only follow references that name a real book.
                    getBookId(ref.book) === ref.book
                ) {
                    // Some source files have no book row where a new book
                    // starts, so its chapter rows were filed under the
                    // previous book and its verse rows would be dropped.
                    // Follow the book named by the verse reference instead.
                    const next: CommentaryBookNode = tree.books.find(
                        (b) => b.book === ref.book
                    ) ?? {
                        type: 'book',
                        book: ref.book,
                        introduction: null,
                        chapters: [],
                    };
                    if (!tree.books.includes(next)) {
                        tree.books.push(next);
                    }
                    if (
                        chapter &&
                        chapter.number === ref.chapter &&
                        chapter.verses.length === 0 &&
                        book.chapters[book.chapters.length - 1] === chapter
                    ) {
                        // The chapter row just read belongs to the new book.
                        book.chapters.pop();
                        next.chapters.push(chapter);
                    } else {
                        chapter = null;
                    }
                    book = next;
                }
                if (ref) {
                    if (ref.book === book?.book) {
                        // @ts-ignore
                        if (ref.chapter === chapter?.number) {
                            chapter.verses.push({
                                type: 'verse',
                                number: ref.verse,
                                content: [line.commentaries],
                            });
                        } else {
                            chapter = {
                                type: 'chapter',
                                number: ref.chapter,
                                introduction: null,
                                verses: [
                                    {
                                        type: 'verse',
                                        number: ref.verse,
                                        content: [line.commentaries],
                                    },
                                ],
                            };

                            book.chapters.push(chapter);
                        }
                    }
                }
            }
        }

        return tree;
    }
}

function hasValue(value: string | null): boolean {
    return (
        value !== null &&
        value !== undefined &&
        value !== '' &&
        value.trim() !== ''
    );
}
