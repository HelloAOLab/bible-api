import {
    CommentaryBookNode,
    CommentaryChapterNode,
    CommentaryParseTree,
} from './types';
import { getBookId, parseVerseReference } from '../utils';
import { parse } from 'papaparse';

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
