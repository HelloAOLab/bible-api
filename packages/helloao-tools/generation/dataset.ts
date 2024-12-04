import { UsfmParser } from '../parser/usfm-parser.js';
import { USXParser } from '../parser/usx-parser.js';
import {
    Commentary,
    CommentaryBook,
    CommentaryBookChapter,
    CommentaryChapterData,
    InputCommentaryFile,
    InputFile,
    InputFileBase,
    InputTranslationFile,
    MetadataBase,
    Translation,
    TranslationBook,
    TranslationBookChapter,
} from './common-types.js';
import { bookIdMap, bookOrderMap } from './book-order.js';
import { omit, sortBy, sortedIndexBy } from 'lodash';
import { getAudioUrlsForChapter } from './audio.js';
import { CodexParser } from '../parser/codex-parser.js';
import { CommentaryCsvParser } from '../parser/commentary-csv-parser.js';
import { CommentaryParseTree, ParseTree } from '../parser/types.js';
import { TyndaleXmlParser } from '../parser/tyndale-xml-parser.js';

/**
 * Defines an interface that contains generated dataset info.
 */
export interface DatasetOutput {
    /**
     * The list of translations that are available in the dataset.
     */
    translations: DatasetTranslation[];

    /**
     * The list of commentaries that are available in the dataset.
     */
    commentaries: DatasetCommentary[];
}

/**
 * Defines a translation that is used in the dataset.
 */
export interface DatasetTranslation extends Translation {
    /**
     * The list of books that are available for the translation.
     */
    books: DatasetTranslationBook[];
}

/**
 * Defines a commentary that is used in the dataset.
 */
export interface DatasetCommentary extends Commentary {
    /**
     * The list of books that are available for the translation.
     */
    books: DatasetCommentaryBook[];
}

/**
 * Defines a translation book that is used in the dataset.
 */
export interface DatasetTranslationBook extends TranslationBook {
    /**
     * The list of chapters that are available for the book.
     */
    chapters: TranslationBookChapter[];
}

/**
 * Defines a commentary book that is used in the dataset.
 */
export interface DatasetCommentaryBook extends CommentaryBook {
    /**
     * The list of chapters that are available for the book.
     */
    chapters: CommentaryBookChapter[];
}

/**
 * Generates a list of output files from the given list of input files.
 * @param file The list of files.
 */
export function generateDataset(
    files: InputFile[],
    parser: DOMParser = new globalThis.DOMParser()
): DatasetOutput {
    let output: DatasetOutput = {
        translations: [],
        commentaries: [],
    };

    let usfmParser = new UsfmParser();
    let usxParser = new USXParser(parser);
    let codexParser = new CodexParser();
    let csvCommentaryParser = new CommentaryCsvParser();
    let tyndaleXmlParser = new TyndaleXmlParser(parser);

    let parsedTranslations = new Map<string, DatasetTranslation>();
    let parsedCommentaries = new Map<string, DatasetCommentary>();

    const unknownLanguages = new Set<string>();
    for (let file of files) {
        try {
            let parser:
                | UsfmParser
                | USXParser
                | CodexParser
                | CommentaryCsvParser
                | TyndaleXmlParser;
            if (file.fileType === 'usfm') {
                parser = usfmParser;
            } else if (file.fileType === 'usx') {
                parser = usxParser;
            } else if (file.fileType === 'json') {
                parser = codexParser;
            } else if (file.fileType === 'commentary/csv') {
                parser = csvCommentaryParser;
            } else if (file.fileType === 'commentary/tyndale-xml') {
                parser = tyndaleXmlParser;
            } else {
                console.warn(
                    '[generate] File does not have a valid type!',
                    file.name
                );
                continue;
            }

            const parsed = parser.parse(file.content);

            if (parsed.type === 'root') {
                addTranslationTree(file as InputTranslationFile, parsed);
            } else {
                addCommentaryTree(file as InputCommentaryFile, parsed);
            }
        } catch (err) {
            console.error(
                `[generate] Error occurred while parsing ${file.name}`,
                err
            );
        }
    }

    function addTranslationTree(file: InputTranslationFile, parsed: ParseTree) {
        const id = parsed.id;

        if (!id) {
            console.warn(
                '[generate] File does not have a valid book ID!',
                file.name,
                id
            );
            return;
        }

        const order = bookOrderMap.get(id);

        if (typeof order !== 'number') {
            console.warn('[generate] Book does not have an order!', id);
            return;
        }

        const bookMap = bookIdMap.get(file.metadata.language);

        if (!bookMap) {
            if (!unknownLanguages.has(file.metadata.language)) {
                console.warn(
                    '[generate] File does not have a known language!',
                    file.name,
                    file.metadata.language
                );
                unknownLanguages.add(file.metadata.language);
            }
        }

        const bookName = bookMap?.get(id);

        if (!!bookMap && !bookName) {
            console.warn(
                '[generate] Book name not found for ID!',
                file.name,
                id
            );
        }

        let translation = parsedTranslations.get(file.metadata.id);

        if (!translation) {
            translation = {
                ...omit(file.metadata, 'direction'),
                textDirection: file.metadata.direction,
                books: [],
            };
            output.translations.push(translation);
            parsedTranslations.set(file.metadata.id, translation);
        }

        const name = parsed.header ?? bookName?.commonName ?? parsed.title;

        if (!name) {
            console.warn(
                '[generate] Book does not have a name!',
                file.name,
                id
            );
            return;
        }

        const commonName =
            bookName?.commonName ?? parsed.header ?? parsed.title ?? id;

        const book: DatasetTranslationBook = {
            id: id,
            name,
            commonName,
            title: parsed.title ?? null,
            order,
            chapters: [],
        };

        for (let content of parsed.content) {
            if (content.type === 'chapter') {
                book.chapters.push({
                    chapter: {
                        number: content.number,
                        content: content.content,
                        footnotes: content.footnotes,
                    },
                    thisChapterAudioLinks: getAudioUrlsForChapter(
                        translation.id,
                        id,
                        content.number
                    ),
                });
            }
        }

        book.chapters = sortBy(book.chapters, (c) => c.chapter.number);

        const index = sortedIndexBy(translation.books, book, (b) => b.order);
        translation.books.splice(index, 0, book);
    }

    function addCommentaryTree(
        file: InputCommentaryFile,
        parsed: CommentaryParseTree
    ) {
        let commentary = parsedCommentaries.get(file.metadata.id);

        if (!commentary) {
            commentary = {
                ...omit(file.metadata, 'direction'),
                textDirection: file.metadata.direction,
                books: [],
            };
            output.commentaries.push(commentary);
            parsedCommentaries.set(file.metadata.id, commentary);
        }

        for (let parsedBook of parsed.books) {
            let book = commentary.books.find((b) => b.id === parsedBook.book);
            if (book && book.introduction && parsedBook.introduction) {
                console.warn(
                    '[generate] Book already exists in commentary!',
                    file.name,
                    parsedBook.book
                );
                continue;
            }

            if (!book) {
                const name = getBookNames(file, file.metadata, parsedBook.book);
                book = {
                    id: parsedBook.book,
                    order: bookOrderMap.get(parsedBook.book) ?? -1,
                    commonName: name?.bookName?.commonName ?? parsedBook.book,
                    name: name?.bookName?.commonName ?? parsedBook.book,
                    chapters: [],
                };
            }

            if (parsedBook.introduction) {
                book.introduction = parsedBook.introduction;
            }

            for (let chapter of parsedBook.chapters) {
                let data: CommentaryChapterData = {
                    number: chapter.number,
                    content: chapter.verses,
                };

                if (chapter.introduction) {
                    data.introduction = chapter.introduction;
                }

                book.chapters.push({
                    chapter: data,
                });
            }

            book.chapters = sortBy(book.chapters, (c) => c.chapter.number);
            commentary.books.push(book);
        }

        commentary.books = sortBy(commentary.books, (b) => b.order);
    }

    function getBookNames(
        file: InputFileBase,
        metadata: MetadataBase,
        id: string
    ) {
        const bookMap = bookIdMap.get(metadata.language);

        if (!bookMap) {
            if (!unknownLanguages.has(metadata.language)) {
                console.warn(
                    '[generate] File does not have a known language!',
                    file.name,
                    metadata.language
                );
                unknownLanguages.add(metadata.language);
            }
        }

        const bookName = bookMap?.get(id);

        if (!!bookMap && !bookName) {
            console.warn(
                '[generate] Book name not found for ID!',
                file.name,
                id
            );
            return null;
        }

        return {
            bookName,
        };
    }

    return output;
}
