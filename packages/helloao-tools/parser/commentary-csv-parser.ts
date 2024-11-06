import {
    CommentaryBookNode,
    CommentaryChapterNode,
    CommentaryParseTree,
} from './types';
import { getBookId, parseVerseReference } from '../utils';

export interface CsvLine {
    book: string;
    chapter: string;
    verse: string;
    commentaries: string;
}

export class CommentaryCsvParser {
    parse(data: CsvLine[]): CommentaryParseTree {
        let tree: CommentaryParseTree = {
            type: 'root',
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

                book = {
                    type: 'book',
                    book: id,
                    introduction: hasValue(line.commentaries)
                        ? line.commentaries
                        : null,
                    chapters: [],
                };
                tree.books.push(book);
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
    return value !== null && value !== '' && value.trim() !== '';
}
