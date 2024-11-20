import { parseVerseReference } from '../utils';
import {
    CommentaryBookNode,
    CommentaryChapterNode,
    CommentaryParseTree,
    CommentaryVerseNode,
} from './types';

export class TyndaleXmlParser {
    private _domParser: DOMParser;

    constructor(domParser: DOMParser) {
        this._domParser = domParser;
    }

    parse(xml: string): CommentaryParseTree {
        const parser = this._domParser;
        const doc = parser.parseFromString(xml, 'application/xml');
        const rootElement = doc.documentElement;

        let tree: CommentaryParseTree = {
            type: 'commentary/root',
            books: [],
        };

        let books: Map<string, CommentaryBookNode> = new Map();

        function getBook(id: string): CommentaryBookNode {
            let bookNode = books.get(id);

            if (!bookNode) {
                bookNode = {
                    type: 'book',
                    book: id,
                    introduction: null,
                    chapters: [],
                };

                books.set(id, bookNode);
                tree.books.push(bookNode);
            }
            return bookNode;
        }

        function getChapter(
            book: CommentaryBookNode,
            number: number
        ): CommentaryChapterNode {
            let chapterNode = book.chapters.find(
                (chapter) => chapter.number === number
            );

            if (!chapterNode) {
                chapterNode = {
                    type: 'chapter',
                    number: number,
                    introduction: null,
                    verses: [],
                };

                book.chapters.push(chapterNode);
            }

            return chapterNode;
        }

        function getVerse(
            chapter: CommentaryChapterNode,
            number: number
        ): CommentaryVerseNode {
            let verseNode = chapter.verses.find(
                (verse) => verse.number === number
            );

            if (!verseNode) {
                verseNode = {
                    type: 'verse',
                    number: number,
                    content: [],
                };

                chapter.verses.push(verseNode);
            }

            return verseNode;
        }

        const noteItems = rootElement.querySelectorAll('item');

        for (let item of noteItems) {
            const typename = item.getAttribute('typename');

            if (typename === 'StudyNote') {
                const refs = item.querySelector('refs')?.textContent;
                const body = item.querySelector('body')?.textContent;

                if (!refs || !body) {
                    console.warn('Skipping item without refs or body:', item);
                    continue;
                }

                const ref = parseVerseReference(refs);

                if (!ref) {
                    console.warn('Failed to parse verse reference:', refs);
                    continue;
                }

                const bookNode = getBook(ref.book);
                const chapterNode = getChapter(bookNode, ref.chapter);
                const verseNode = getVerse(chapterNode, ref.verse);
                verseNode.content.push(body.trim());
            }
        }

        return tree;
    }
}
