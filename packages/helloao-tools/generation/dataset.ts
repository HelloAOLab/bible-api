import { UsfmParser } from "../parser";
import { USXParser } from "../parser/usx-parser";
import { InputFile, Translation, TranslationBook, TranslationBookChapter } from "./common-types";
import { bookIdMap, bookOrderMap } from "./book-order";
import { omit, sortBy, sortedIndexBy } from "lodash";
import { getAudioUrlsForChapter } from "./audio";
import { CodexParser } from "../parser/codex-parser";

/**
 * Defines an interface that contains generated dataset info.
 */
export interface DatasetOutput {

    /**
     * The list of translations that are available in the dataset.
     */
    translations: DatasetTranslation[];
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
 * Defines a translation book that is used in the dataset.
 */
export interface DatasetTranslationBook extends TranslationBook {
    
    /**
     * The list of chapters that are available for the book.
     */
    chapters: TranslationBookChapter[];
}

/**
 * Generates a list of output files from the given list of input files.
 * @param file The list of files.
 */
export function generateDataset(files: InputFile[], parser: DOMParser = new globalThis.DOMParser()): DatasetOutput {
    let output: DatasetOutput = {
        translations: [],
    };

    let usfmParser = new UsfmParser();
    let usxParser = new USXParser(parser);
    let codexParser = new CodexParser();
    
    let parsedTranslations = new Map<string, DatasetTranslation>();

    const unknownLanguages = new Set<string>();
    for(let file of files) {
        try {
            let parser: UsfmParser | USXParser | CodexParser;
            if (file.fileType === 'usfm') {
                parser = usfmParser;
            } else if (file.fileType === 'usx') {
                parser = usxParser;
            } else if (file.fileType === 'json') {
                parser = codexParser;
            } else {
                console.warn('[generate] File does not have a valid type!', file.name);
                continue;
            }

            const parsed = parser.parse(file.content);
            const id = parsed.id;

            if (!id) {
                console.warn('[generate] File does not have a valid book ID!', file.name, id);
                continue;
            }

            const order = bookOrderMap.get(id);

            if (typeof order !== 'number') {
                console.warn('[generate] Book does not have an order!', id);
                continue;
            }
            
            const bookMap = bookIdMap.get(file.metadata.translation.language);

            if (!bookMap) {
                if (!unknownLanguages.has(file.metadata.translation.language)) {
                    console.warn('[generate] File does not have a known language!', file.name, file.metadata.translation.language);
                    unknownLanguages.add(file.metadata.translation.language);
                }
            }

            const bookName = bookMap?.get(id);

            if (!!bookMap && !bookName) {
                console.warn('[generate] Book name not found for ID!', file.name, id);
            }

            let translation = parsedTranslations.get(file.metadata.translation.id);

            if (!translation) {
                translation = {
                    ...omit(file.metadata.translation, 'direction'),
                    textDirection: file.metadata.translation.direction,
                    books: []
                };
                output.translations.push(translation);
                parsedTranslations.set(file.metadata.translation.id, translation);
            }

            const name = parsed.header ?? bookName?.commonName ?? parsed.title;

            if (!name) {
                console.warn('[generate] Book does not have a name!', file.name, id);
                continue;
            }

            const commonName = bookName?.commonName ?? parsed.header ?? parsed.title ?? id;

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
                            footnotes: content.footnotes
                        },
                        thisChapterAudioLinks: getAudioUrlsForChapter(translation.id, id, content.number)
                    });
                }
            }

            book.chapters = sortBy(book.chapters, c => c.chapter.number);

            const index = sortedIndexBy(translation.books, book, b => b.order);
            translation.books.splice(index, 0, book);
        } catch(err) {
            console.error(`[generate] Error occurred while parsing ${file.name}`, err);
        }
    }

    return output;
}