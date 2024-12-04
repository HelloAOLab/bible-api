import { parseVerseReference } from '../utils';
import {
    CommentaryBookNode,
    CommentaryChapterNode,
    CommentaryParseTree,
    CommentaryVerseNode,
} from './types';

enum NodeType {
    Element = 1,
    Attribute = 2,
    Text = 3,
}

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

        function formatContent(node: Node, trim: boolean = true): string {
            let text: string;
            if (node.nodeName === 'p') {
                text = (node.textContent || '') + '\n';
            } else if (node.nodeName === '#text') {
                text = node.textContent || '';
            } else if (node.nodeName === 'br') {
                text = '\n';
            } else if (node.nodeType === NodeType.Element) {
                text = '';
                for (let child of node.childNodes) {
                    text += formatContent(child, false);
                }
            } else {
                text = node.textContent || '';
            }

            if (trim) {
                const lines = text.split('\n');
                for (let i = 0; i < lines.length; i++) {
                    // Trim extra whitespace and replace multiple spaces with a single space
                    lines[i] = lines[i].replace(/\s+/g, ' ').trim();
                }
                text = lines.join('\n').trim();
            }

            return text;
        }

        const items = rootElement.querySelectorAll('item');

        for (let item of items) {
            const typename = item.getAttribute('typename');

            if (typename === 'StudyNote') {
                const refs = item.querySelector('refs')?.textContent;
                const body = item.querySelector('body');

                if (!refs || !body) {
                    console.warn(
                        'Skipping study note item without refs or body:',
                        item
                    );
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
                verseNode.content.push(formatContent(body));
            } else if (typename === 'BookIntro') {
                const refs = item.querySelector('refs')?.textContent;
                const body = item.querySelector('body');

                if (!refs || !body) {
                    console.warn(
                        'Skipping book item without refs or body:',
                        item
                    );
                    continue;
                }

                const ref = parseVerseReference(refs);

                if (!ref) {
                    console.warn('Failed to parse verse reference:', refs);
                    continue;
                }

                const bookNode = getBook(ref.book);

                bookNode.introduction = formatContent(body);
            } else if (typename === 'BookIntroSummary') {
                const refs = item.querySelector('refs')?.textContent;
                const body = item.querySelector('body');

                if (!refs || !body) {
                    console.warn(
                        'Skipping book item without refs or body:',
                        item
                    );
                    continue;
                }

                const ref = parseVerseReference(refs);

                if (!ref) {
                    console.warn('Failed to parse verse reference:', refs);
                    continue;
                }

                const bookNode = getBook(ref.book);

                bookNode.introductionSummary = formatContent(body);
            } else if (typename === 'Profile') {
                const refs = item.querySelector('refs')?.textContent;
                const body = item.querySelector('body');
                const title = item.querySelector('title')?.textContent;
                const name = item.getAttribute('name');

                if (!refs || !body || !title || !name) {
                    console.warn(
                        'Skipping profile item without refs, body, or title:',
                        item
                    );
                    continue;
                }

                const ref = parseVerseReference(refs);

                if (!ref) {
                    console.warn('Failed to parse verse reference:', refs);
                    continue;
                }

                if (!tree.profiles) {
                    tree.profiles = [];
                }

                // convert camelCase to kebab-case
                const id = toKebabCase(name);
                tree.profiles.push({
                    id,
                    subject: title,
                    content: [formatContent(body)],
                    reference: ref,
                });
            }
        }

        return tree;
    }
}

export function toKebabCase(camelCase: string): string {
    return camelCase.replace(/([a-z])\s*([A-Z])/g, '$1-$2').toLowerCase();
}
