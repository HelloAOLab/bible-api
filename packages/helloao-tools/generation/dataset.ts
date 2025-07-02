import { UsfmParser } from '../parser/usfm-parser.js';
import { USXParser } from '../parser/usx-parser.js';
import {
    Commentary,
    CommentaryBook,
    CommentaryBookChapter,
    CommentaryChapterData,
    CommentaryProfile,
    InputCommentaryFile,
    InputFile,
    InputFileBase,
    InputTranslationFile,
    MetadataBase,
    Translation,
    TranslationBook,
    TranslationBookChapter,
} from './common-types.js';
import {
    bookIdMap as defaultBookIdMap,
    bookOrderMap,
    apocryphaBooks,
} from './book-order.js';
import { omit, sortBy, sortedIndexBy } from 'lodash';
import { getAudioUrlsForChapter } from './audio.js';
import { CodexParser } from '../parser/codex-parser.js';
import { CommentaryCsvParser } from '../parser/commentary-csv-parser.js';
import {
    CommentaryParseTree,
    ParseMessage,
    ParseTree,
} from '../parser/types.js';
import { TyndaleXmlParser } from '../parser/tyndale-xml-parser.js';
import { getLogger } from '../log.js';

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

    parseMessages?: {
        [key: string]: ParseMessage[];
    };
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
     * The list of books that are available for the commentary.
     */
    books: DatasetCommentaryBook[];

    /**
     * The list of profiles that  are available for the commentary.
     */
    profiles: DatasetCommentaryProfile[];
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

export interface DatasetCommentaryProfile extends CommentaryProfile {
    /**
     * The contents of the profile.
     */
    content: string[];
}

/**
 * Generates a list of output files from the given list of input files.
 * @param file The list of files.
 * @param parser The parser to use for parsing the files.
 * @param bookMap The map of book IDs to names. If undefined, then a default map will be used.
 */
export function generateDataset(
    files: InputFile[],
    parser: DOMParser = new globalThis.DOMParser(),
    bookMap?: Map<string, { commonName: string }> | undefined
): DatasetOutput {
    const logger = getLogger();
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
                logger.warn(
                    '[generate] File does not have a valid type!',
                    file.name
                );
                continue;
            }

            const parsed = parser.parse(file.content);

            if (
                'parseMessages' in parsed &&
                parsed.parseMessages &&
                file.name
            ) {
                const messages = (output.parseMessages =
                    output.parseMessages || {});
                messages[file.name] = parsed.parseMessages;
            }

            if (parsed.type === 'root') {
                addTranslationTree(file as InputTranslationFile, parsed);
            } else {
                addCommentaryTree(file as InputCommentaryFile, parsed);
            }
        } catch (err) {
            logger.error(
                `[generate] Error occurred while parsing ${file.name}`,
                err
            );
        }
    }

    function addTranslationTree(file: InputTranslationFile, parsed: ParseTree) {
        const id = parsed.id;

        if (!id) {
            logger.warn(
                '[generate] File does not have a valid book ID!',
                file.name,
                id
            );
            return;
        }

        const order = bookOrderMap.get(id);

        if (typeof order !== 'number') {
            logger.warn('[generate] Book does not have an order!', id);
            return;
        }

        const isApocryphal = apocryphaBooks.has(id);

        const bookName = getBookNames(file, file.metadata, id);

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

        const name =
            parsed.header ??
            (bookName?.exactMatch ? bookName?.bookName?.commonName : null) ??
            parsed.title ??
            bookName?.bookName?.commonName;

        if (!name) {
            logger.warn('[generate] Book does not have a name!', file.name, id);
            return;
        }

        const commonName =
            (bookName?.exactMatch ? bookName?.bookName?.commonName : null) ??
            parsed.header ??
            parsed.title ??
            bookName?.bookName?.commonName ??
            id;

        const book: DatasetTranslationBook = {
            id: id,
            name,
            commonName,
            title: parsed.title ?? null,
            order,
            chapters: [],
        };

        if (isApocryphal) {
            book.isApocryphal = true;
        }

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
                profiles: [],
            };
            output.commentaries.push(commentary);
            parsedCommentaries.set(file.metadata.id, commentary);
        }

        for (let parsedBook of parsed.books) {
            let book = commentary.books.find((b) => b.id === parsedBook.book);
            if (book && book.introduction && parsedBook.introduction) {
                logger.warn(
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

            if (parsedBook.introductionSummary && !book.introductionSummary) {
                book.introductionSummary = parsedBook.introductionSummary;
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

        if (parsed.profiles) {
            for (let profile of parsed.profiles) {
                const existing = commentary.profiles.find(
                    (p) => p.id === profile.id
                );
                if (existing) {
                    logger.warn(
                        '[generate] Profile already exists in commentary!',
                        file.name,
                        profile.id
                    );
                    continue;
                }

                const datasetProfile: DatasetCommentaryProfile = {
                    id: profile.id,
                    subject: profile.subject,
                    reference: profile.reference,
                    content: profile.content,
                };

                commentary.profiles.push(datasetProfile);
            }
        }

        commentary.books = sortBy(commentary.books, (b) => b.order);
        commentary.profiles = sortBy(commentary.profiles, (p) => p.id);
    }

    function getBookNames(
        file: InputFileBase,
        metadata: MetadataBase,
        id: string
    ) {
        let exactMatch = true;
        let map = bookMap;
        if (!map) {
            map = defaultBookIdMap.get(metadata.language);

            if (!map) {
                if (!unknownLanguages.has(metadata.language)) {
                    logger.warn(
                        '[generate] File does not have a known language!',
                        file.name,
                        metadata.language
                    );
                    unknownLanguages.add(metadata.language);
                }

                logger.warn(
                    '[generate] Using English book map for unknown language! This might result in outputting english book names.'
                );
                exactMatch = false;
                map = defaultBookIdMap.get('en');
            }
        }

        const bookName = map?.get(id);

        if (!!map && !bookName) {
            logger.warn(
                '[generate] Book name not found for ID!',
                file.name,
                id
            );
            return null;
        }

        return {
            exactMatch,
            bookName,
        };
    }

    return output;
}
