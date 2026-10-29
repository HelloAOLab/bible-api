import { PrismaClient, Prisma } from './prisma-gen/client.js';
import path from 'path';
import Sql, { Database } from 'better-sqlite3';
import fsExtra from 'fs-extra';
const { exists, readdir, readFile } = fsExtra;
import { createHash, randomUUID } from 'node:crypto';
import {
    DatasetCommentary,
    DatasetCommentaryBook,
    DatasetCommentaryProfile,
    DatasetDataset,
    DatasetDatasetBook,
    DatasetOutput,
    DatasetTranslation,
    DatasetTranslationBook,
    generateDataset,
} from '@helloao/tools/generation/dataset.js';
import {
    ChapterVerse,
    InputFile,
    TranslationBookChapter,
    OutputFile,
    OutputFileContent,
    CommentaryBookChapter,
    DatasetBookChapter,
    DatasetChapterVerseContent,
    Dataset,
    DatasetBook,
} from '@helloao/tools/generation/index.js';
import {
    generateApiForDataset,
    GenerateApiOptions,
    generateFilesForApi,
    generateOutputFilesFromDatasets,
} from '@helloao/tools/generation/api.js';
import {
    loadCommentaryFiles,
    loadTranslationFiles,
    serializeOutputFiles,
} from './files.js';
import type { DOMParser } from 'linkedom';
import { Readable } from 'stream';
import { getEnglishName, getNativeName } from 'all-iso-language-codes';
import { log } from '@helloao/tools';
import { ParseMessage } from '@helloao/tools/parser/types.js';
import { BookId } from '@helloao/tools/utils.js';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

export async function getMigrationsPath() {
    // The migrations are two directories up from the built files (dist/esm),
    // and next to the source files when they are run directly (e.g. in tests).
    const migrationsPaths = ['../../migrations', './migrations'];

    for (let migrationsPath of migrationsPaths) {
        const fullPath = path.resolve(__dirname, migrationsPath);
        if (await exists(fullPath)) {
            return fullPath;
        }
    }

    return null;
}

/**
 * Imports the translations from the given directories into the database.
 * @param db The database to import the translations into.
 * @param dirs The directories to import the translations from.
 * @param parser The DOM parser that should be used for USX files.
 * @param overwrite Whether to force a reload of the translations.
 */
export const importTranslations = (
    db: Database,
    dirs: string[],
    parser: DOMParser,
    overwrite: boolean
) => importFiles(loadTranslationFiles, db, dirs, parser, overwrite);

/**
 * Imports the commentaries from the given directories into the database.
 * @param db The database to import the commentaries into.
 * @param dirs The directories to import the commentaries from.
 * @param parser The DOM parser that should be used for USX files.
 * @param overwrite Whether to force a reload of the commentaries.
 */
export const importCommentaries = (
    db: Database,
    dirs: string[],
    parser: DOMParser,
    overwrite: boolean
) => importFiles(loadCommentaryFiles, db, dirs, parser, overwrite);

/**
 * Imports the files from the given directories into the database.
 * @param loadFilesFromDir The function that should be used to load the files from the given directory.
 * @param db The database to import the files into.
 * @param dirs The directories to import the files from.
 * @param parser The DOM parser that should be used for USX files.
 * @param overwrite Whether to force a reload of the files.
 */
export async function importFiles(
    loadFilesFromDir: (path: string) => Promise<InputFile[] | null>,
    db: Database,
    dirs: string[],
    parser: DOMParser,
    overwrite: boolean
) {
    const logger = log.getLogger();
    let batches = [] as string[][];
    while (dirs.length > 0) {
        batches.push(dirs.splice(0, 10));
    }

    logger.log('Processing', batches.length, 'batches of directories');
    for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        logger.log(`Processing batch ${i + 1} of ${batches.length}`);
        await loadAndImportBatch(
            loadFilesFromDir,
            db,
            batch,
            parser,
            overwrite
        );
    }
}

/**
 * Imports a batch of translations from the given directories into the database.
 * @param db The database to import the translations into.
 * @param dirs The directories that contain the translations.
 * @param parser The DOM parser that should be used for USX files.
 * @param overwrite Whether to force a reload of the translations.
 */
export const importTranslationBatch = (
    db: Database,
    dirs: string[],
    parser: DOMParser,
    overwrite: boolean
) => loadAndImportBatch(loadTranslationFiles, db, dirs, parser, overwrite);

/**
 * Imports a batch of files from the given directories into the database.
 * @param loadFilesFromDir The function that should be used to load the files from the given directory.
 * @param db The database to import the files into.
 * @param dirs The directories that contain the files.
 * @param parser The DOM parser that should be used for USX files.
 * @param overwrite Whether to force a reload of the files.
 */
export async function loadAndImportBatch(
    loadFilesFromDir: (path: string) => Promise<InputFile[] | null>,
    db: Database,
    dirs: string[],
    parser: DOMParser,
    overwrite: boolean
) {
    const promises = [] as Promise<InputFile[]>[];
    for (let dir of dirs) {
        const fullPath = path.resolve(dir);
        promises.push(loadFilesFromDir(fullPath).then((files) => files ?? []));
    }

    const allFiles = await Promise.all(promises);
    const files = allFiles.flat();
    await importFileBatch(db, files, parser, overwrite);
}

/**
 * Parses and imports the given files into the database.
 * @param db The database to import the files into.
 * @param files The files that should be parsed.
 * @param parser The DOM parser that should be used for USX files.
 * @param overwrite Whether to force a reload of the translations.
 */
export async function importFileBatch(
    db: Database,
    files: InputFile[],
    parser: DOMParser,
    overwrite: boolean
) {
    const logger = log.getLogger();
    logger.log('Importing', files.length, 'files');
    if (overwrite) {
        logger.log('Overwriting existing translations.');
    }
    const changedFiles = overwrite
        ? files
        : getChangedOrNewInputFiles(db, files);

    logger.log('Processing', changedFiles.length, 'changed files');
    logger.log(
        'Skipping',
        files.length - changedFiles.length,
        'unchanged files'
    );

    const output = generateDataset(
        changedFiles,
        parser as globalThis.DOMParser
    );

    logger.log('Generated', output.translations.length, 'translations');
    logger.log('Generated', output.commentaries.length, 'commentaries');

    importDatasetOutput(db, output);
    insertFileMetadata(db, changedFiles);
}

/**
 * Imports the given dataset output into the database.
 * @param db The database to import the dataset into.
 * @param output The dataset output to import.
 */
export function importDatasetOutput(db: Database, output: DatasetOutput) {
    const logger = log.getLogger();

    insertTranslations(db, output.translations);
    updateTranslationHashes(
        db,
        output.translations.map((t) => t.id)
    );
    insertCommentaries(db, output.commentaries);
    updateCommentaryHashes(
        db,
        output.commentaries.map((c) => c.id)
    );
    insertDatasets(db, output.datasets ?? []);
    updateDatasetHashes(
        db,
        (output.datasets ?? []).map((d) => d.id)
    );
    insertWarningMetadata(db, output.parseMessages);

    logger.log(`Inserted ${output.translations.length} translations into DB`);
    logger.log(`Inserted ${output.commentaries.length} commentaries into DB`);
    if (output.datasets) {
        logger.log(`Inserted ${output.datasets.length} datasets into DB`);
    }
    logger.log(
        `Produced ${output.parseMessages?.length ?? 0} warnings/errors.`
    );
}

/**
 * Filters the given input files to only include those that have changed.
 * @param db The database to check for changes.
 * @param files The files to filter.
 */
export function getChangedOrNewInputFiles(
    db: Database,
    files: InputFile[]
): InputFile[] {
    const fileExists = db.prepare(
        'SELECT COUNT(*) as c FROM InputFile WHERE translationId = @translationId AND name = @name AND sha256 = @sha256;'
    );

    return files.filter((f) => {
        const count = fileExists.get({
            translationId: f.metadata.id,
            name: path.basename(f.name!),
            sha256: f.sha256,
        }) as { c: number };

        return count.c <= 0;
    });
}

export function insertFileMetadata(db: Database, files: InputFile[]) {
    const fileUpsert = db.prepare(`INSERT INTO InputFile(
        translationId,
        name,
        format,
        sha256,
        sizeInBytes
    ) VALUES (
        @translationId,
        @name,
        @format,
        @sha256,
        @sizeInBytes
    ) ON CONFLICT(translationId, name) DO 
        UPDATE SET
            format=excluded.format,
            sha256=excluded.sha256,
            sizeInBytes=excluded.sizeInBytes;`);

    const insertManyFiles = db.transaction((files: InputFile[]) => {
        for (let file of files) {
            fileUpsert.run({
                translationId: file.metadata.id,
                name: path.basename(file.name!),
                format: file.fileType,
                sha256: file.sha256,
                sizeInBytes: file.content.length,
            });
        }
    });

    insertManyFiles(files);
}

/**
 * Deletes the given translations and everything that is stored for them from the database.
 * @param db The database to delete the translations from.
 * @param translationIds The IDs of the translations to delete.
 */
export function deleteTranslations(db: Database, translationIds: string[]) {
    // Child tables first, so that the foreign keys are never violated.
    const statements = [
        'DELETE FROM ChapterFootnote WHERE translationId = ?;',
        'DELETE FROM ChapterVerse WHERE translationId = ?;',
        'DELETE FROM ChapterAudioUrl WHERE translationId = ?;',
        'DELETE FROM ChapterAudioTiming WHERE translationId = ?;',
        'DELETE FROM ChapterWords WHERE translationId = ?;',
        'DELETE FROM Chapter WHERE translationId = ?;',
        'DELETE FROM Book WHERE translationId = ?;',
        'DELETE FROM InputFile WHERE translationId = ?;',
        'DELETE FROM Translation WHERE id = ?;',
    ].map((sql) => db.prepare(sql));

    const deleteAll = db.transaction(() => {
        for (let id of translationIds) {
            for (let statement of statements) {
                statement.run(id);
            }
        }
    });

    deleteAll();
}

/**
 * Deletes the given commentaries and everything that is stored for them from the database.
 * @param db The database to delete the commentaries from.
 * @param commentaryIds The IDs of the commentaries to delete.
 */
export function deleteCommentaries(db: Database, commentaryIds: string[]) {
    const statements = [
        'DELETE FROM CommentaryChapterVerse WHERE commentaryId = ?;',
        'DELETE FROM CommentaryChapter WHERE commentaryId = ?;',
        'DELETE FROM CommentaryProfile WHERE commentaryId = ?;',
        'DELETE FROM CommentaryBook WHERE commentaryId = ?;',
        'DELETE FROM InputFile WHERE translationId = ?;',
        'DELETE FROM Commentary WHERE id = ?;',
    ].map((sql) => db.prepare(sql));

    const deleteAll = db.transaction(() => {
        for (let id of commentaryIds) {
            for (let statement of statements) {
                statement.run(id);
            }
        }
    });

    deleteAll();
}

/**
 * Deletes the given datasets and everything that is stored for them from the database.
 * @param db The database to delete the datasets from.
 * @param datasetIds The IDs of the datasets to delete.
 */
export function deleteDatasets(db: Database, datasetIds: string[]) {
    const statements = [
        'DELETE FROM DatasetReference WHERE datasetId = ?;',
        'DELETE FROM DatasetChapterVerse WHERE datasetId = ?;',
        'DELETE FROM DatasetChapter WHERE datasetId = ?;',
        'DELETE FROM DatasetBook WHERE datasetId = ?;',
        'DELETE FROM DatasetEntity WHERE datasetId = ?;',
        'DELETE FROM Dataset WHERE id = ?;',
    ].map((sql) => db.prepare(sql));

    const deleteAll = db.transaction(() => {
        for (let id of datasetIds) {
            for (let statement of statements) {
                statement.run(id);
            }
        }
    });

    deleteAll();
}

export function insertTranslations(
    db: Database,
    translations: DatasetTranslation[]
) {
    const translationUpsert = db.prepare(`INSERT INTO Translation(
        id,
        name,
        language,
        shortName,
        textDirection,
        licenseUrl,
        licenseNotes,
        licenseNotice,
        license,
        website,
        englishName
    ) VALUES (
        @id,
        @name,
        @language,
        @shortName,
        @textDirection,
        @licenseUrl,
        @licenseNotes,
        @licenseNotice,
        @license,
        @website,
        @englishName
    ) ON CONFLICT(id) DO
        UPDATE SET
            name=excluded.name,
            language=excluded.language,
            shortName=excluded.shortName,
            textDirection=excluded.textDirection,
            licenseUrl=excluded.licenseUrl,
            licenseNotes=excluded.licenseNotes,
            licenseNotice=excluded.licenseNotice,
            license=excluded.license,
            website=excluded.website,
            englishName=excluded.englishName;`);

    const insertManyTranslations = db.transaction(
        (translations: DatasetTranslation[]) => {
            for (let translation of translations) {
                translationUpsert.run({
                    id: translation.id,
                    name: translation.name,
                    language: translation.language,
                    shortName: translation.shortName,
                    textDirection: translation.textDirection,
                    licenseUrl: translation.licenseUrl,
                    licenseNotes: translation.licenseNotes,
                    licenseNotice: translation.licenseNotice,
                    license: translation.license
                        ? JSON.stringify(translation.license)
                        : null,
                    website: translation.website,
                    englishName: translation.englishName,
                });
            }
        }
    );

    insertManyTranslations(translations);

    for (let translation of translations) {
        insertTranslationBooks(db, translation, translation.books);
    }
}

export function insertTranslationBooks(
    db: Database,
    translation: DatasetTranslation,
    translationBooks: DatasetTranslationBook[]
) {
    const bookUpsert = db.prepare(`INSERT INTO Book(
        id,
        translationId,
        title,
        name,
        commonName,
        shortName,
        numberOfChapters,
        \`order\`,
        isApocryphal
    ) VALUES (
        @id,
        @translationId,
        @title,
        @name,
        @commonName,
        @shortName,
        @numberOfChapters,
        @bookOrder,
        @isApocryphal
    ) ON CONFLICT(id,translationId) DO 
        UPDATE SET
            title=excluded.title,
            name=excluded.name,
            commonName=excluded.commonName,
            shortName=excluded.shortName,
            numberOfChapters=excluded.numberOfChapters,
            isApocryphal=excluded.isApocryphal;`);

    const insertMany = db.transaction((books: DatasetTranslationBook[]) => {
        for (let book of books) {
            if (!book) {
                continue;
            }
            bookUpsert.run({
                id: book.id,
                translationId: translation.id,
                title: book.title,
                name: book.name,
                commonName: book.commonName,
                shortName: book.shortName ?? null,
                numberOfChapters: book.chapters.length,
                bookOrder: book.order ?? 9999,
                isApocryphal: Number(book.isApocryphal ?? false),
            });
        }
    });

    insertMany(translationBooks);

    for (let book of translationBooks) {
        insertTranslationContent(db, translation, book, book.chapters);
    }
}

export function insertTranslationContent(
    db: Database,
    translation: DatasetTranslation,
    book: DatasetTranslationBook,
    chapters: TranslationBookChapter[]
) {
    const logger = log.getLogger();

    const chapterUpsert = db.prepare(`INSERT INTO Chapter(
        translationId,
        bookId,
        number,
        json
    ) VALUES (
        @translationId,
        @bookId,
        @number,
        @json
    ) ON CONFLICT(translationId,bookId,number) DO 
        UPDATE SET
            json=excluded.json;`);
    const verseUpsert = db.prepare(`INSERT INTO ChapterVerse(
        translationId,
        bookId,
        chapterNumber,
        number,
        text,
        contentJson
    ) VALUES (
        @translationId,
        @bookId,
        @chapterNumber,
        @number,
        @text,
        @contentJson
    ) ON CONFLICT(translationId,bookId,chapterNumber,number) DO 
        UPDATE SET
            text=excluded.text,
            contentJson=excluded.contentJson;`);
    const footnoteUpsert = db.prepare(`INSERT INTO ChapterFootnote(
        translationId,
        bookId,
        chapterNumber,
        id,
        verseNumber,
        text
    ) VALUES (
        @translationId,
        @bookId,
        @chapterNumber,
        @id,
        @verseNumber,
        @text
    ) ON CONFLICT(translationId,bookId,chapterNumber,id) DO 
        UPDATE SET
            verseNumber=excluded.verseNumber,
            text=excluded.text;`);

    const chapterAudioUpsert = db.prepare(`INSERT INTO ChapterAudioUrl(
        translationId,
        bookId,
        number,
        reader,
        url
    ) VALUES (
        @translationId,
        @bookId,
        @number,
        @reader,
        @url
    ) ON CONFLICT(translationId,bookId,number,reader) DO
        UPDATE SET
            url=excluded.url;`);

    const chapterAudioTimingUpsert = db.prepare(`INSERT INTO ChapterAudioTiming(
        translationId,
        bookId,
        number,
        reader,
        timingsJson
    ) VALUES (
        @translationId,
        @bookId,
        @number,
        @reader,
        @timingsJson
    ) ON CONFLICT(translationId,bookId,number,reader) DO
        UPDATE SET
            timingsJson=excluded.timingsJson;`);

    const chapterWordsUpsert = db.prepare(`INSERT INTO ChapterWords(
        translationId,
        bookId,
        number,
        wordsJson
    ) VALUES (
        @translationId,
        @bookId,
        @number,
        @wordsJson
    ) ON CONFLICT(translationId,bookId,number) DO
        UPDATE SET
            wordsJson=excluded.wordsJson;`);

    const insertChaptersAndVerses = db.transaction(() => {
        for (let chapter of chapters) {
            let verses: {
                number: number;
                text: string;
                contentJson: string;
            }[] = [];
            let footnotes: Map<
                number,
                {
                    id: number;
                    text: string;
                    verseNumber?: number;
                }
            > = new Map();

            for (let c of chapter.chapter.footnotes) {
                footnotes.set(c.noteId, {
                    id: c.noteId,
                    text: c.text,
                });
            }

            for (let c of chapter.chapter.content) {
                if (c.type === 'verse') {
                    const verse: ChapterVerse = c;
                    if (!verse.number) {
                        logger.error(
                            'Verse missing number',
                            translation.id,
                            book.id,
                            chapter.chapter.number,
                            verse.number
                        );
                        continue;
                    }

                    let text = '';
                    for (let c of verse.content) {
                        if (typeof c === 'string') {
                            text += c + ' ';
                        } else if (typeof c === 'object') {
                            if ('lineBreak' in c) {
                                text += '\n';
                            } else if ('text' in c) {
                                text += c.text + ' ';
                            } else if ('noteId' in c) {
                                const note = footnotes.get(c.noteId);
                                if (note) {
                                    note.verseNumber = verse.number;
                                }
                            }
                        }
                    }

                    let contentJson = JSON.stringify(verse.content);
                    verses.push({
                        number: verse.number,
                        text: text.trimEnd(),
                        contentJson,
                    });
                }
            }

            chapterUpsert.run({
                translationId: translation.id,
                bookId: book.id,
                number: chapter.chapter.number,
                json: JSON.stringify(chapter.chapter),
            });

            for (let verse of verses) {
                verseUpsert.run({
                    translationId: translation.id,
                    bookId: book.id,
                    chapterNumber: chapter.chapter.number,
                    number: verse.number,
                    text: verse.text,
                    contentJson: verse.contentJson,
                });
            }

            for (let footnote of footnotes.values()) {
                footnoteUpsert.run({
                    translationId: translation.id,
                    bookId: book.id,
                    chapterNumber: chapter.chapter.number,
                    id: footnote.id,
                    verseNumber: footnote.verseNumber,
                    text: footnote.text,
                });
            }

            for (let reader in chapter.thisChapterAudioLinks) {
                const url = chapter.thisChapterAudioLinks[reader];
                if (url) {
                    chapterAudioUpsert.run({
                        translationId: translation.id,
                        bookId: book.id,
                        number: chapter.chapter.number,
                        reader: reader,
                        url,
                    });
                }
            }

            for (let reader in chapter.thisChapterAudioTimings) {
                const verses = chapter.thisChapterAudioTimings[reader];
                if (verses) {
                    chapterAudioTimingUpsert.run({
                        translationId: translation.id,
                        bookId: book.id,
                        number: chapter.chapter.number,
                        reader: reader,
                        timingsJson: JSON.stringify(verses),
                    });
                }
            }

            if (chapter.thisChapterWords) {
                chapterWordsUpsert.run({
                    translationId: translation.id,
                    bookId: book.id,
                    number: chapter.chapter.number,
                    wordsJson: JSON.stringify(chapter.thisChapterWords),
                });
            }
        }
    });

    insertChaptersAndVerses();
}

/**
 * Inserts or updates the audio timing (per-verse start times, in seconds) for a chapter and reader.
 * @param db The database to insert the timing into.
 * @param translationId The ID of the translation.
 * @param bookId The ID of the book.
 * @param chapterNumber The number of the chapter.
 * @param reader The reader that the timing is for.
 * @param verses The times (in seconds) that each verse starts, in verse order.
 */
export function upsertChapterAudioTiming(
    db: Database,
    translationId: string,
    bookId: string,
    chapterNumber: number,
    reader: string,
    verses: number[]
) {
    db.prepare(
        `INSERT INTO ChapterAudioTiming(
            translationId,
            bookId,
            number,
            reader,
            timingsJson
        ) VALUES (
            @translationId,
            @bookId,
            @number,
            @reader,
            @timingsJson
        ) ON CONFLICT(translationId,bookId,number,reader) DO
            UPDATE SET
                timingsJson=excluded.timingsJson;`
    ).run({
        translationId,
        bookId,
        number: chapterNumber,
        reader,
        timingsJson: JSON.stringify(verses),
    });
}

/**
 * Creates a SHA-256 hash of the given values.
 * Each value is serialized as JSON so that numbers, booleans, and missing values all affect the hash
 * and so that adjacent values can't run together.
 * @param values The values to hash.
 */
function hashValues(...values: unknown[]): string {
    const hash = createHash('sha256');
    for (let value of values) {
        hash.update(JSON.stringify(value ?? null));
        hash.update('\n');
    }
    return hash.digest('hex');
}

/**
 * Groups the given rows by their chapter number.
 * @param rows The rows to group.
 */
function groupByChapterNumber<T extends { number: number }>(
    rows: T[]
): Map<number, T[]> {
    const map = new Map<number, T[]>();
    for (let row of rows) {
        let list = map.get(row.number);
        if (!list) {
            list = [];
            map.set(row.number, list);
        }
        list.push(row);
    }
    return map;
}

/**
 * Updates the hashes for the translations in the database.
 * The hash of a translation covers everything that is stored for it, including its metadata, license, books, chapters,
 * audio links, audio timings, and words. So it changes whenever anything that the API is generated from changes.
 * @param db The database to update the hashes in.
 * @param translationIds The IDs of the translations to update the hashes for.
 */
export function updateTranslationHashes(
    db: Database,
    translationIds: string[]
) {
    const logger = log.getLogger();
    logger.log(`Updating hashes for ${translationIds.length} translations.`);

    const updateTranslationHash = db.prepare(
        `UPDATE Translation SET sha256 = @sha256 WHERE id = @translationId;`
    );
    const updateBookHash = db.prepare(
        `UPDATE Book SET sha256 = @sha256 WHERE translationId = @translationId AND id = @bookId;`
    );
    const updateChapterHash = db.prepare(
        `UPDATE Chapter SET sha256 = @sha256 WHERE translationId = @translationId AND bookId = @bookId AND number = @chapterNumber;`
    );

    const getTranslation = db.prepare(
        'SELECT * FROM Translation WHERE id = ?;'
    );
    const getBooks = db.prepare(
        'SELECT * FROM Book WHERE translationId = ? ORDER BY `order` ASC, id ASC;'
    );
    const getChapters = db.prepare(
        'SELECT * FROM Chapter WHERE translationId = @translationId AND bookId = @bookId ORDER BY number ASC;'
    );
    const getAudioUrls = db.prepare(
        'SELECT * FROM ChapterAudioUrl WHERE translationId = @translationId AND bookId = @bookId ORDER BY number ASC, reader ASC;'
    );
    const getAudioTimings = db.prepare(
        'SELECT * FROM ChapterAudioTiming WHERE translationId = @translationId AND bookId = @bookId ORDER BY number ASC, reader ASC;'
    );
    const getWords = db.prepare(
        'SELECT * FROM ChapterWords WHERE translationId = @translationId AND bookId = @bookId ORDER BY number ASC;'
    );

    const updateHashes = db.transaction((translationId: string) => {
        const translation = getTranslation.get(translationId) as
            | {
                  id: string;
                  name: string;
                  website: string;
                  licenseUrl: string;
                  licenseNotes: string | null;
                  licenseNotice: string | null;
                  license: string | null;
                  shortName: string | null;
                  englishName: string;
                  language: string;
                  textDirection: string;
              }
            | undefined;

        if (!translation) {
            return;
        }

        const books = getBooks.all(translationId) as {
            id: string;
            order: number;
            title: string | null;
            translationId: string;
            name: string;
            commonName: string;
            shortName: string | null;
            numberOfChapters: number;
            isApocryphal: number | null;
        }[];

        const bookHashes: string[] = [];
        for (let book of books) {
            const query = { translationId, bookId: book.id };
            const chapters = getChapters.all(query) as {
                number: number;
                json: string;
            }[];
            const audioUrls = groupByChapterNumber(
                getAudioUrls.all(query) as {
                    number: number;
                    reader: string;
                    url: string;
                }[]
            );
            const audioTimings = groupByChapterNumber(
                getAudioTimings.all(query) as {
                    number: number;
                    reader: string;
                    timingsJson: string;
                }[]
            );
            const words = groupByChapterNumber(
                getWords.all(query) as { number: number; wordsJson: string }[]
            );

            const chapterHashes: string[] = [];
            for (let chapter of chapters) {
                const hash = hashValues(
                    translationId,
                    book.id,
                    chapter.number,
                    chapter.json,
                    (audioUrls.get(chapter.number) ?? []).map((a) => [
                        a.reader,
                        a.url,
                    ]),
                    (audioTimings.get(chapter.number) ?? []).map((t) => [
                        t.reader,
                        t.timingsJson,
                    ]),
                    (words.get(chapter.number) ?? []).map((w) => w.wordsJson)
                );
                chapterHashes.push(hash);
                updateChapterHash.run({
                    sha256: hash,
                    translationId,
                    bookId: book.id,
                    chapterNumber: chapter.number,
                });
            }

            const bookHash = hashValues(
                translationId,
                book.id,
                book.order,
                book.name,
                book.commonName,
                book.shortName,
                book.title,
                book.numberOfChapters,
                !!book.isApocryphal,
                chapterHashes
            );
            bookHashes.push(bookHash);
            updateBookHash.run({
                sha256: bookHash,
                translationId,
                bookId: book.id,
            });
        }

        updateTranslationHash.run({
            sha256: hashValues(
                translation.id,
                translation.name,
                translation.language,
                translation.shortName,
                translation.englishName,
                translation.textDirection,
                translation.website,
                translation.licenseUrl,
                translation.licenseNotes,
                translation.licenseNotice,
                translation.license,
                bookHashes
            ),
            translationId,
        });
    });

    for (let id of translationIds) {
        updateHashes(id);
    }

    logger.log(`Updated.`);
}

export function insertCommentaries(
    db: Database,
    commentaries: DatasetCommentary[]
) {
    const translationUpsert = db.prepare(`INSERT INTO Commentary(
        id,
        name,
        language,
        textDirection,
        licenseUrl,
        licenseNotes,
        website,
        englishName
    ) VALUES (
        @id,
        @name,
        @language,
        @textDirection,
        @licenseUrl,
        @licenseNotes,
        @website,
        @englishName
    ) ON CONFLICT(id) DO 
        UPDATE SET
            name=excluded.name,
            language=excluded.language,
            textDirection=excluded.textDirection,
            licenseUrl=excluded.licenseUrl,
            licenseNotes=excluded.licenseNotes,
            website=excluded.website,
            englishName=excluded.englishName;`);

    const insertManyTranslations = db.transaction(
        (commentaries: DatasetCommentary[]) => {
            for (let commentary of commentaries) {
                translationUpsert.run({
                    id: commentary.id,
                    name: commentary.name,
                    language: commentary.language,
                    textDirection: commentary.textDirection,
                    licenseUrl: commentary.licenseUrl,
                    licenseNotes: commentary.licenseNotes,
                    website: commentary.website,
                    englishName: commentary.englishName,
                });
            }
        }
    );

    insertManyTranslations(commentaries);

    for (let commentary of commentaries) {
        insertCommentaryBooks(db, commentary, commentary.books);
        insertCommentaryProfiles(db, commentary, commentary.profiles);
    }
}

export function insertCommentaryBooks(
    db: Database,
    commentary: DatasetCommentary,
    commentaryBooks: DatasetCommentaryBook[]
) {
    const bookUpsert = db.prepare(`INSERT INTO CommentaryBook(
        id,
        commentaryId,
        introduction,
        introductionSummary,
        name,
        commonName,
        numberOfChapters,
        \`order\`
    ) VALUES (
        @id,
        @commentaryId,
        @introduction,
        @introductionSummary,
        @name,
        @commonName,
        @numberOfChapters,
        @bookOrder
    ) ON CONFLICT(id,commentaryId) DO 
        UPDATE SET
            introduction=excluded.introduction,
            introductionSummary=excluded.introductionSummary,
            name=excluded.name,
            commonName=excluded.commonName,
            numberOfChapters=excluded.numberOfChapters;`);

    const insertMany = db.transaction((books: DatasetCommentaryBook[]) => {
        for (let book of books) {
            if (!book) {
                continue;
            }
            bookUpsert.run({
                id: book.id,
                commentaryId: commentary.id,
                introduction: book.introduction ?? null,
                introductionSummary: book.introductionSummary ?? null,
                name: book.name,
                commonName: book.commonName,
                numberOfChapters: book.chapters.length,
                bookOrder: book.order ?? 9999,
            });
        }
    });

    insertMany(commentaryBooks);

    for (let book of commentaryBooks) {
        insertCommentaryContent(db, commentary, book, book.chapters);
    }
}

export function insertCommentaryProfiles(
    db: Database,
    commentary: DatasetCommentary,
    commentaryProfiles: DatasetCommentaryProfile[]
) {
    const profileUpsert = db.prepare(`INSERT INTO CommentaryProfile(
        id,
        commentaryId,
        subject,
        content,
        referenceBook,
        referenceChapter,
        referenceVerse,
        referenceEndChapter,
        referenceEndVerse,
        json
    ) VALUES (
        @id,
        @commentaryId,
        @subject,
        @content,
        @referenceBook,
        @referenceChapter,
        @referenceVerse,
        @referenceEndChapter,
        @referenceEndVerse,
        @json
    ) ON CONFLICT(id,commentaryId) DO 
        UPDATE SET
            subject=excluded.subject,
            content=excluded.content,
            referenceBook=excluded.referenceBook,
            referenceChapter=excluded.referenceChapter,
            referenceVerse=excluded.referenceVerse,
            referenceEndChapter=excluded.referenceEndChapter,
            referenceEndVerse=excluded.referenceEndVerse;`);

    const insertMany = db.transaction(
        (profiles: DatasetCommentaryProfile[]) => {
            for (let profile of profiles) {
                if (!profile) {
                    continue;
                }
                profileUpsert.run({
                    id: profile.id,
                    commentaryId: commentary.id,
                    subject: profile.subject,
                    content: profile.content.join('\n'),
                    referenceBook: profile.reference?.book ?? null,
                    referenceChapter: profile.reference?.chapter ?? null,
                    referenceVerse: profile.reference?.verse ?? null,
                    referenceEndChapter: profile.reference?.endChapter ?? null,
                    referenceEndVerse: profile.reference?.endVerse ?? null,
                    json: JSON.stringify(profile),
                });
            }
        }
    );

    insertMany(commentaryProfiles);
}

export function insertCommentaryContent(
    db: Database,
    commentary: DatasetCommentary,
    book: DatasetCommentaryBook,
    chapters: CommentaryBookChapter[]
) {
    const logger = log.getLogger();

    const chapterUpsert = db.prepare(`INSERT INTO CommentaryChapter(
        commentaryId,
        bookId,
        number,
        introduction,
        json
    ) VALUES (
        @commentaryId,
        @bookId,
        @number,
        @introduction,
        @json
    ) ON CONFLICT(commentaryId,bookId,number) DO 
        UPDATE SET
            introduction=excluded.introduction,
            json=excluded.json;`);
    const verseUpsert = db.prepare(`INSERT INTO CommentaryChapterVerse(
        commentaryId,
        bookId,
        chapterNumber,
        number,
        text,
        contentJson
    ) VALUES (
        @commentaryId,
        @bookId,
        @chapterNumber,
        @number,
        @text,
        @contentJson
    ) ON CONFLICT(commentaryId,bookId,chapterNumber,number) DO 
        UPDATE SET
            text=excluded.text,
            contentJson=excluded.contentJson;`);

    const insertChaptersAndVerses = db.transaction(() => {
        for (let chapter of chapters) {
            let verses: {
                number: number;
                text: string;
                contentJson: string;
            }[] = [];

            for (let c of chapter.chapter.content) {
                if (c.type === 'verse') {
                    const verse: ChapterVerse = c;
                    if (!verse.number) {
                        logger.error(
                            'Verse missing number',
                            commentary.id,
                            book.id,
                            chapter.chapter.number,
                            verse.number
                        );
                        continue;
                    }

                    let text = '';
                    for (let c of verse.content) {
                        if (typeof c === 'string') {
                            text += c + ' ';
                        } else if (typeof c === 'object') {
                            if ('lineBreak' in c) {
                                text += '\n';
                            } else if ('text' in c) {
                                text += c.text + ' ';
                            }
                        }
                    }

                    let contentJson = JSON.stringify(verse.content);
                    verses.push({
                        number: verse.number,
                        text: text.trimEnd(),
                        contentJson,
                    });
                }
            }

            chapterUpsert.run({
                commentaryId: commentary.id,
                bookId: book.id,
                number: chapter.chapter.number,
                introduction: chapter.chapter.introduction ?? null,
                json: JSON.stringify(chapter.chapter),
            });

            for (let verse of verses) {
                verseUpsert.run({
                    commentaryId: commentary.id,
                    bookId: book.id,
                    chapterNumber: chapter.chapter.number,
                    number: verse.number,
                    text: verse.text,
                    contentJson: verse.contentJson,
                });
            }
        }
    });

    insertChaptersAndVerses();
}

/**
 * Updates the hashes for the commentaries in the database.
 * The hash of a commentary covers everything that is stored for it, including its metadata, books, chapters, and profiles.
 * @param db The database to update the hashes in.
 * @param commentaryIds The IDs of the commentaries to update the hashes for.
 */
export function updateCommentaryHashes(db: Database, commentaryIds: string[]) {
    const logger = log.getLogger();
    logger.log(`Updating hashes for ${commentaryIds.length} commentaries.`);

    const updateCommentaryHash = db.prepare(
        `UPDATE Commentary SET sha256 = @sha256 WHERE id = @commentaryId;`
    );
    const updateBookHash = db.prepare(
        `UPDATE CommentaryBook SET sha256 = @sha256 WHERE commentaryId = @commentaryId AND id = @bookId;`
    );
    const updateChapterHash = db.prepare(
        `UPDATE CommentaryChapter SET sha256 = @sha256 WHERE commentaryId = @commentaryId AND bookId = @bookId AND number = @chapterNumber;`
    );
    const updateProfileHash = db.prepare(
        `UPDATE CommentaryProfile SET sha256 = @sha256 WHERE commentaryId = @commentaryId AND id = @profileId;`
    );

    const getCommentary = db.prepare('SELECT * FROM Commentary WHERE id = ?;');
    const getBooks = db.prepare(
        'SELECT * FROM CommentaryBook WHERE commentaryId = ? ORDER BY `order` ASC, id ASC;'
    );
    const getChapters = db.prepare(
        'SELECT * FROM CommentaryChapter WHERE commentaryId = @commentaryId AND bookId = @bookId ORDER BY number ASC;'
    );
    const getProfiles = db.prepare(
        'SELECT * FROM CommentaryProfile WHERE commentaryId = ? ORDER BY id ASC;'
    );

    const updateHashes = db.transaction((commentaryId: string) => {
        const commentary = getCommentary.get(commentaryId) as
            | {
                  id: string;
                  name: string;
                  website: string;
                  licenseUrl: string;
                  licenseNotes: string | null;
                  licenseNotice: string | null;
                  englishName: string;
                  language: string;
                  textDirection: string;
              }
            | undefined;

        if (!commentary) {
            return;
        }

        const books = getBooks.all(commentaryId) as {
            id: string;
            order: number;
            name: string;
            commonName: string;
            numberOfChapters: number;
            introduction: string | null;
            introductionSummary: string | null;
        }[];

        const bookHashes: string[] = [];
        for (let book of books) {
            const chapters = getChapters.all({
                commentaryId,
                bookId: book.id,
            }) as {
                number: number;
                introduction: string | null;
                json: string;
            }[];

            const chapterHashes: string[] = [];
            for (let chapter of chapters) {
                const hash = hashValues(
                    commentaryId,
                    book.id,
                    chapter.number,
                    chapter.introduction,
                    chapter.json
                );
                chapterHashes.push(hash);
                updateChapterHash.run({
                    sha256: hash,
                    commentaryId,
                    bookId: book.id,
                    chapterNumber: chapter.number,
                });
            }

            const bookHash = hashValues(
                commentaryId,
                book.id,
                book.order,
                book.name,
                book.commonName,
                book.numberOfChapters,
                book.introduction,
                book.introductionSummary,
                chapterHashes
            );
            bookHashes.push(bookHash);
            updateBookHash.run({
                sha256: bookHash,
                commentaryId,
                bookId: book.id,
            });
        }

        const profiles = getProfiles.all(commentaryId) as {
            id: string;
            json: string;
        }[];

        const profileHashes: string[] = [];
        for (let profile of profiles) {
            const hash = hashValues(commentaryId, profile.id, profile.json);
            profileHashes.push(hash);
            updateProfileHash.run({
                sha256: hash,
                commentaryId,
                profileId: profile.id,
            });
        }

        updateCommentaryHash.run({
            sha256: hashValues(
                commentary.id,
                commentary.name,
                commentary.language,
                commentary.englishName,
                commentary.textDirection,
                commentary.website,
                commentary.licenseUrl,
                commentary.licenseNotes,
                commentary.licenseNotice,
                bookHashes,
                profileHashes
            ),
            commentaryId,
        });
    });

    for (let id of commentaryIds) {
        updateHashes(id);
    }

    logger.log(`Updated.`);
}

export function insertDatasets(db: Database, datasets: DatasetDataset[]) {
    const translationUpsert = db.prepare(`INSERT INTO Dataset(
        id,
        name,
        language,
        textDirection,
        licenseUrl,
        licenseNotes,
        website,
        englishName
    ) VALUES (
        @id,
        @name,
        @language,
        @textDirection,
        @licenseUrl,
        @licenseNotes,
        @website,
        @englishName
    ) ON CONFLICT(id) DO 
        UPDATE SET
            name=excluded.name,
            language=excluded.language,
            textDirection=excluded.textDirection,
            licenseUrl=excluded.licenseUrl,
            licenseNotes=excluded.licenseNotes,
            website=excluded.website,
            englishName=excluded.englishName;`);

    const insertManyTranslations = db.transaction(
        (datasets: DatasetDataset[]) => {
            for (let dataset of datasets) {
                translationUpsert.run({
                    id: dataset.id,
                    name: dataset.name,
                    language: dataset.language,
                    textDirection: dataset.textDirection,
                    licenseUrl: dataset.licenseUrl,
                    licenseNotes: dataset.licenseNotes,
                    website: dataset.website,
                    englishName: dataset.englishName,
                });
            }
        }
    );

    insertManyTranslations(datasets);

    const deleteReferences = db.prepare(`DELETE FROM DatasetReference
        WHERE datasetId = @datasetId;`);

    for (let dataset of datasets) {
        deleteReferences.run({
            datasetId: dataset.id,
        });
        insertDatasetBooks(db, dataset, dataset.books);
        insertDatasetEntities(db, dataset);
    }
}

/**
 * Inserts the entities (people, places, events, people groups, lexicon entries, and verse categories) for the given dataset into the database.
 * Any entities that are no longer present in the dataset are deleted.
 * @param db The database to insert the entities into.
 * @param dataset The dataset that the entities belong to.
 */
export function insertDatasetEntities(db: Database, dataset: DatasetDataset) {
    const deleteEntities = db.prepare(`DELETE FROM DatasetEntity
        WHERE datasetId = @datasetId;`);

    const entityUpsert = db.prepare(`INSERT INTO DatasetEntity(
        id,
        datasetId,
        type,
        name,
        json
    ) VALUES (
        @id,
        @datasetId,
        @type,
        @name,
        @json
    ) ON CONFLICT(datasetId,type,id) DO
        UPDATE SET
            name=excluded.name,
            json=excluded.json;`);

    const collections = [
        ['person', dataset.people],
        ['place', dataset.places],
        ['event', dataset.events],
        ['peopleGroup', dataset.peopleGroups],
        ['lexicon', dataset.lexicon],
        ['category', dataset.categories],
    ] as const;

    const insertAll = db.transaction(() => {
        deleteEntities.run({
            datasetId: dataset.id,
        });
        for (let [type, entities] of collections) {
            for (let entity of entities ?? []) {
                entityUpsert.run({
                    id: entity.id,
                    datasetId: dataset.id,
                    type,
                    name:
                        'name' in entity
                            ? entity.name
                            : (entity.senses[0]?.lemma ?? entity.id),
                    json: JSON.stringify(entity),
                });
            }
        }
    });

    insertAll();
}

export function insertDatasetBooks(
    db: Database,
    dataset: DatasetDataset,
    datasetBooks: DatasetDatasetBook[]
) {
    const bookUpsert = db.prepare(`INSERT INTO DatasetBook(
        id,
        datasetId,
        numberOfChapters,
        \`order\`
    ) VALUES (
        @id,
        @datasetId,
        @numberOfChapters,
        @bookOrder
    ) ON CONFLICT(id,datasetId) DO 
        UPDATE SET
            numberOfChapters=excluded.numberOfChapters;`);

    const insertMany = db.transaction((books: DatasetDatasetBook[]) => {
        for (let book of books) {
            if (!book) {
                continue;
            }
            bookUpsert.run({
                id: book.id,
                datasetId: dataset.id,
                numberOfChapters: book.chapters.length,
                bookOrder: book.order ?? 9999,
            });
        }
    });

    insertMany(datasetBooks);

    for (let book of datasetBooks) {
        insertDatasetContent(db, dataset, book, book.chapters);
    }
}

export function insertDatasetContent(
    db: Database,
    dataset: DatasetDataset,
    book: DatasetDatasetBook,
    chapters: DatasetBookChapter[]
) {
    const logger = log.getLogger();

    const chapterUpsert = db.prepare(`INSERT INTO DatasetChapter(
        datasetId,
        bookId,
        number,
        json
    ) VALUES (
        @datasetId,
        @bookId,
        @number,
        @json
    ) ON CONFLICT(datasetId,bookId,number) DO 
        UPDATE SET
            json=excluded.json;`);
    const verseUpsert = db.prepare(`INSERT INTO DatasetChapterVerse(
        datasetId,
        bookId,
        chapterNumber,
        number,
        contentJson
    ) VALUES (
        @datasetId,
        @bookId,
        @chapterNumber,
        @number,
        @contentJson
    ) ON CONFLICT(datasetId,bookId,chapterNumber,number) DO 
        UPDATE SET
            contentJson=excluded.contentJson;`);

    const referenceInsert = db.prepare(`INSERT INTO DatasetReference(
        datasetId,
        bookId,
        chapterNumber,
        verseNumber,
        referenceBookId,
        referenceChapter,
        referenceVerse,
        endVerseNumber,
        score
    ) VALUES (
        @datasetId,
        @bookId,
        @chapterNumber,
        @verseNumber,
        @referenceBookId,
        @referenceChapter,
        @referenceVerse,
        @endVerseNumber,
        @score
    );`);

    const insertChaptersAndVerses = db.transaction(() => {
        for (let chapter of chapters) {
            chapterUpsert.run({
                datasetId: dataset.id,
                bookId: book.id,
                number: chapter.chapter.number,
                json: JSON.stringify(chapter.chapter),
            });

            for (let verse of chapter.chapter.content) {
                verseUpsert.run({
                    datasetId: dataset.id,
                    bookId: book.id,
                    chapterNumber: chapter.chapter.number,
                    number: verse.verse,
                    contentJson: JSON.stringify(verse),
                });

                for (let ref of 'references' in verse ? verse.references : []) {
                    referenceInsert.run({
                        datasetId: dataset.id,
                        bookId: book.id,
                        chapterNumber: chapter.chapter.number,
                        verseNumber: verse.verse,
                        referenceBookId: ref.book,
                        referenceChapter: ref.chapter,
                        referenceVerse: ref.verse,
                        endVerseNumber: ref.endVerse ?? null,
                        score: ref.score ?? null,
                    });
                }
            }
        }
    });

    insertChaptersAndVerses();
}

/**
 * Updates the hashes for the datasets in the database.
 * The hash of a dataset covers everything that is stored for it, including its metadata, books, chapters, and entities.
 * @param db The database to update the hashes in.
 * @param datasetIds The IDs of the datasets to update the hashes for.
 */
export function updateDatasetHashes(db: Database, datasetIds: string[]) {
    const logger = log.getLogger();
    logger.log(`Updating hashes for ${datasetIds.length} datasets.`);

    const updateDatasetHash = db.prepare(
        `UPDATE Dataset SET sha256 = @sha256 WHERE id = @datasetId;`
    );
    const updateBookHash = db.prepare(
        `UPDATE DatasetBook SET sha256 = @sha256 WHERE datasetId = @datasetId AND id = @bookId;`
    );
    const updateChapterHash = db.prepare(
        `UPDATE DatasetChapter SET sha256 = @sha256 WHERE datasetId = @datasetId AND bookId = @bookId AND number = @chapterNumber;`
    );
    const updateEntityHash = db.prepare(
        `UPDATE DatasetEntity SET sha256 = @sha256 WHERE datasetId = @datasetId AND type = @type AND id = @entityId;`
    );

    const getDataset = db.prepare('SELECT * FROM Dataset WHERE id = ?;');
    const getBooks = db.prepare(
        'SELECT * FROM DatasetBook WHERE datasetId = ? ORDER BY `order` ASC, id ASC;'
    );
    const getChapters = db.prepare(
        'SELECT * FROM DatasetChapter WHERE datasetId = @datasetId AND bookId = @bookId ORDER BY number ASC;'
    );
    const getEntities = db.prepare(
        'SELECT * FROM DatasetEntity WHERE datasetId = ? ORDER BY type ASC, id ASC;'
    );

    const updateHashes = db.transaction((datasetId: string) => {
        const dataset = getDataset.get(datasetId) as
            | {
                  id: string;
                  name: string;
                  website: string;
                  licenseUrl: string;
                  licenseNotes: string | null;
                  englishName: string;
                  language: string;
                  textDirection: string;
              }
            | undefined;

        if (!dataset) {
            return;
        }

        const books = getBooks.all(datasetId) as {
            id: string;
            order: number;
            numberOfChapters: number;
        }[];

        const bookHashes: string[] = [];
        for (let book of books) {
            const chapters = getChapters.all({
                datasetId,
                bookId: book.id,
            }) as {
                number: number;
                json: string;
            }[];

            const chapterHashes: string[] = [];
            for (let chapter of chapters) {
                const hash = hashValues(
                    datasetId,
                    book.id,
                    chapter.number,
                    chapter.json
                );
                chapterHashes.push(hash);
                updateChapterHash.run({
                    sha256: hash,
                    datasetId,
                    bookId: book.id,
                    chapterNumber: chapter.number,
                });
            }

            const bookHash = hashValues(
                datasetId,
                book.id,
                book.order,
                book.numberOfChapters,
                chapterHashes
            );
            bookHashes.push(bookHash);
            updateBookHash.run({
                sha256: bookHash,
                datasetId,
                bookId: book.id,
            });
        }

        const entities = getEntities.all(datasetId) as {
            id: string;
            type: string;
            json: string;
        }[];

        const entityHashes: string[] = [];
        for (let entity of entities) {
            const hash = hashValues(
                datasetId,
                entity.type,
                entity.id,
                entity.json
            );
            entityHashes.push(hash);
            updateEntityHash.run({
                sha256: hash,
                datasetId,
                type: entity.type,
                entityId: entity.id,
            });
        }

        updateDatasetHash.run({
            sha256: hashValues(
                dataset.id,
                dataset.name,
                dataset.language,
                dataset.englishName,
                dataset.textDirection,
                dataset.website,
                dataset.licenseUrl,
                dataset.licenseNotes,
                bookHashes,
                entityHashes
            ),
            datasetId,
        });
    });

    for (let id of datasetIds) {
        updateHashes(id);
    }

    logger.log(`Updated.`);
}

export function getDbPathFromDir(dir: string) {
    dir = dir || process.cwd();
    return path.resolve(dir, 'bible-api.db');
}

export function getDbPath(p?: string | null) {
    if (p) {
        return path.resolve(p);
    }
    return getDbPathFromDir(process.cwd());
}

export async function getPrismaDb(path?: string | null) {
    const db = await getDb(path);
    db.close();
    const dbPath = getDbPath(path);
    console.log('Opening database at', dbPath);
    const prisma = new PrismaClient({
        adapter: new PrismaBetterSqlite3({
            url: 'file:' + dbPath,
        }),
    });
    return prisma;
}

/**
 * Gets the database from the given path. If no path is provided, the current working directory is used.
 * @param path The path to the database. If not provided, the current working directory is used.
 * @returns
 */
export async function getDb(path?: string | null): Promise<Database> {
    const dbPath = getDbPath(path);
    const db = await getDbFromPath(dbPath);
    return db;
}

async function getDbFromPath(dbPath: string): Promise<Database> {
    console.log('Opening database at', dbPath);
    const logger = log.getLogger();
    const migrationsPath = await getMigrationsPath();
    if (!migrationsPath) {
        throw new Error('Could not find migrations path');
    }

    const db = new Sql(dbPath, {});

    db.exec(`CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
        "id"                    TEXT PRIMARY KEY NOT NULL,
        "checksum"              TEXT NOT NULL,
        "finished_at"           DATETIME,
        "migration_name"        TEXT NOT NULL,
        "logs"                  TEXT,
        "rolled_back_at"        DATETIME,
        "started_at"            DATETIME NOT NULL DEFAULT current_timestamp,
        "applied_steps_count"   INTEGER UNSIGNED NOT NULL DEFAULT 0
    );`);

    const migrations = await readdir(migrationsPath);
    const appliedMigrations = db
        .prepare('SELECT * FROM _prisma_migrations;')
        .all() as Migration[];

    let missingMigrations = [];
    for (let migration of migrations) {
        if (appliedMigrations.some((m) => m.migration_name === migration)) {
            continue;
        }
        if (path.extname(migration) !== '') {
            continue;
        }
        missingMigrations.push(migration);
    }

    const insertMigrationStatement = db.prepare(
        'INSERT INTO _prisma_migrations (id, checksum, started_at, finished_at, migration_name, applied_steps_count, logs, rolled_back_at) VALUES (?, ?, ?, ?, ?, ?, NULL, NULL);'
    );

    for (let missingMigration of missingMigrations) {
        logger.log(`Applying migration ${missingMigration}...`);
        const migration = path.resolve(
            migrationsPath,
            missingMigration,
            'migration.sql'
        );
        const migrationFile = await readFile(migration, 'utf8');
        db.exec(migrationFile);
        insertMigrationStatement.run(
            randomUUID(),
            '',
            new Date().toISOString(),
            new Date().toISOString(),
            missingMigration,
            1
        );
    }

    return db;
}

interface Migration {
    id: string;
    checksum: string;
    finished_at: Date;
    migration_name: string;
}

export interface SerializedFile {
    path: string;
    content: string | Readable;

    /**
     * Gets the base64-encoded SHA256 hash of the content of the file.
     */
    sha256?(): string;
}

/**
 * Loads the datasets from the database in a series of batches.
 * @param db The database.
 * @param perBatch The number of translations to load per batch.
 * @param translationsToLoad The list of translations/commentaries to load. If not provided, all translations will be loaded.
 */
export async function* loadDatasets(
    db: PrismaClient,
    perBatch: number = 50,
    translationsToLoad?: string[]
): AsyncGenerator<DatasetOutput> {
    yield* loadTranslationDatasets(db, perBatch, translationsToLoad);
    yield* loadCommentaryDatasets(db, perBatch, translationsToLoad);
    yield* loadDatasetDatasets(db, perBatch, translationsToLoad);
}

/**
 * Loads the translations from the database as a dataset.
 * @param db The database.
 * @param translationsPerBatch The number of translations to load per batch.
 * @param translationsToLoad The list of translations to load. If not provided, all translations will be loaded.
 */
export async function* loadTranslationDatasets(
    db: PrismaClient,
    translationsPerBatch: number = 50,
    translationsToLoad?: string[]
) {
    const logger = log.getLogger();
    let offset = 0;
    let pageSize = translationsPerBatch;

    logger.log('Generating translation datasets in batches of', pageSize);
    const totalTranslations = await db.translation.count(
        translationsToLoad && translationsToLoad.length > 0
            ? { where: { id: { in: translationsToLoad } } }
            : undefined
    );
    const totalBatches = Math.ceil(totalTranslations / pageSize);
    let batchNumber = 1;

    while (true) {
        logger.log(
            'Generating translation batch',
            batchNumber,
            'of',
            totalBatches
        );
        batchNumber++;

        const translationQuery: Prisma.TranslationFindManyArgs = {
            skip: offset,
            take: pageSize,
        };
        const commentaryQuery: Prisma.CommentaryFindManyArgs = {
            skip: offset,
            take: pageSize,
        };

        if (translationsToLoad && translationsToLoad.length > 0) {
            translationQuery.where = {
                id: {
                    in: translationsToLoad,
                },
            };
            commentaryQuery.where = {
                id: {
                    in: translationsToLoad,
                },
            };
        }

        const translations = await db.translation.findMany(translationQuery);
        const commentaries = await db.commentary.findMany(commentaryQuery);

        if (translations.length <= 0) {
            break;
        }

        const dataset: DatasetOutput = {
            translations: [],
            commentaries: [],
        };

        const optionalTranslationKeys: (keyof DatasetTranslation)[] = [
            'licenseNotes',
            'licenseNotice',
            'license',
        ];

        for (let translation of translations) {
            const datasetTranslation: DatasetTranslation = {
                ...translation,
                shortName: translation.shortName!,
                textDirection: translation.textDirection! as any,
                license: translation.license
                    ? JSON.parse(translation.license)
                    : undefined,
                books: [],
            };
            for (let key of optionalTranslationKeys) {
                if (!datasetTranslation[key]) {
                    delete datasetTranslation[key];
                }
            }

            dataset.translations.push(datasetTranslation);

            const books = await db.book.findMany({
                where: {
                    translationId: translation.id,
                },
                orderBy: {
                    order: 'asc',
                },
            });

            for (let book of books) {
                const chapters = await db.chapter.findMany({
                    where: {
                        translationId: translation.id,
                        bookId: book.id,
                    },
                    orderBy: {
                        number: 'asc',
                    },
                });

                const audioLinks = await db.chapterAudioUrl.findMany({
                    where: {
                        translationId: translation.id,
                        bookId: book.id,
                    },
                    orderBy: [{ number: 'asc' }, { reader: 'asc' }],
                });

                const audioTimings = await db.chapterAudioTiming.findMany({
                    where: {
                        translationId: translation.id,
                        bookId: book.id,
                    },
                    orderBy: [{ number: 'asc' }, { reader: 'asc' }],
                });

                const chapterWords = await db.chapterWords.findMany({
                    where: {
                        translationId: translation.id,
                        bookId: book.id,
                    },
                    orderBy: [{ number: 'asc' }],
                });

                const bookChapters: TranslationBookChapter[] = chapters.map(
                    (chapter) => {
                        const words = chapterWords.find(
                            (words) => words.number === chapter.number
                        );

                        return {
                            chapter: JSON.parse(chapter.json),
                            thisChapterAudioLinks: audioLinks
                                .filter(
                                    (link) => link.number === chapter.number
                                )
                                .reduce((acc, link) => {
                                    acc[link.reader] = link.url;
                                    return acc;
                                }, {} as any),
                            thisChapterAudioTimings: audioTimings
                                .filter(
                                    (timing) => timing.number === chapter.number
                                )
                                .reduce((acc, timing) => {
                                    acc[timing.reader] = JSON.parse(
                                        timing.timingsJson
                                    );
                                    return acc;
                                }, {} as any),
                            ...(words
                                ? {
                                      thisChapterWords: JSON.parse(
                                          words.wordsJson
                                      ),
                                  }
                                : {}),
                        };
                    }
                );

                const datasetBook: DatasetTranslationBook = {
                    ...book,
                    id: book.id as BookId,
                    chapters: bookChapters,
                    shortName: book.shortName ?? undefined,
                    isApocryphal: book.isApocryphal ?? false,
                };
                if (!datasetBook.shortName) {
                    delete datasetBook.shortName;
                }
                if (!datasetBook.isApocryphal) {
                    delete datasetBook.isApocryphal;
                }
                datasetTranslation.books.push(datasetBook);
            }
        }

        yield dataset;

        offset += pageSize;
    }
}

/**
 * Loads the commentaries from the database as a dataset.
 * @param db The database.
 * @param perBatch The number of translations to load per batch.
 * @param commentariesToLoad The list of commentaries to load. If not provided, all commentaries will be loaded.
 */
export async function* loadCommentaryDatasets(
    db: PrismaClient,
    perBatch: number = 50,
    commentariesToLoad?: string[]
) {
    const logger = log.getLogger();
    let offset = 0;
    let pageSize = perBatch;

    logger.log('Generating commentaries datasets in batches of', pageSize);
    const totalCommentaries = await db.commentary.count(
        commentariesToLoad && commentariesToLoad.length > 0
            ? { where: { id: { in: commentariesToLoad } } }
            : undefined
    );
    const totalBatches = Math.ceil(totalCommentaries / pageSize);
    let batchNumber = 1;

    while (true) {
        logger.log(
            'Generating commentary batch',
            batchNumber,
            'of',
            totalBatches
        );
        batchNumber++;

        const commentaryQuery: Prisma.CommentaryFindManyArgs = {
            skip: offset,
            take: pageSize,
        };

        if (commentariesToLoad && commentariesToLoad.length > 0) {
            commentaryQuery.where = {
                id: {
                    in: commentariesToLoad,
                },
            };
        }

        const commentaries = await db.commentary.findMany(commentaryQuery);

        if (commentaries.length <= 0) {
            break;
        }

        const dataset: DatasetOutput = {
            translations: [],
            commentaries: [],
        };

        for (let commentary of commentaries) {
            const datasetCommentary: DatasetCommentary = {
                ...commentary,
                textDirection: commentary.textDirection! as any,
                books: [],
                profiles: [],
            };
            dataset.commentaries.push(datasetCommentary);

            const books = await db.commentaryBook.findMany({
                where: {
                    commentaryId: commentary.id,
                },
                orderBy: {
                    order: 'asc',
                },
            });

            for (let book of books) {
                const chapters = await db.commentaryChapter.findMany({
                    where: {
                        commentaryId: commentary.id,
                        bookId: book.id,
                    },
                    orderBy: {
                        number: 'asc',
                    },
                });

                const bookChapters: CommentaryBookChapter[] = chapters.map(
                    (chapter) => {
                        return {
                            chapter: JSON.parse(chapter.json),
                        };
                    }
                );

                const datasetBook: DatasetCommentaryBook = {
                    ...book,
                    id: book.id as BookId,
                    introduction: book.introduction ?? undefined,
                    introductionSummary: book.introductionSummary ?? undefined,
                    chapters: bookChapters,
                };
                datasetCommentary.books.push(datasetBook);
            }

            const profiles = await db.commentaryProfile.findMany({
                where: {
                    commentaryId: commentary.id,
                },
                orderBy: {
                    id: 'asc',
                },
            });

            for (let profile of profiles) {
                const json = profile.json;
                datasetCommentary.profiles.push(JSON.parse(json));
            }
        }

        yield dataset;

        offset += pageSize;
    }
}

/**
 * Loads the datasets from the database as a dataset.
 * @param db The database.
 * @param perBatch The number of translations to load per batch.
 * @param datasetsToLoad The list of commentaries to load. If not provided, all commentaries will be loaded.
 */
export async function* loadDatasetDatasets(
    db: PrismaClient,
    perBatch: number = 50,
    datasetsToLoad?: string[]
) {
    const logger = log.getLogger();
    let offset = 0;
    let pageSize = perBatch;

    logger.log('Generating dataset datasets in batches of', pageSize);
    const totalDatasets = await db.dataset.count(
        datasetsToLoad && datasetsToLoad.length > 0
            ? { where: { id: { in: datasetsToLoad } } }
            : undefined
    );
    const totalBatches = Math.ceil(totalDatasets / pageSize);
    let batchNumber = 1;

    while (true) {
        logger.log('Generating dataset batch', batchNumber, 'of', totalBatches);
        batchNumber++;

        const datasetQuery: Prisma.DatasetFindManyArgs = {
            skip: offset,
            take: pageSize,
        };

        if (datasetsToLoad && datasetsToLoad.length > 0) {
            datasetQuery.where = {
                id: {
                    in: datasetsToLoad,
                },
            };
        }

        const datasets = await db.dataset.findMany(datasetQuery);

        if (datasets.length <= 0) {
            break;
        }

        const output: DatasetOutput = {
            translations: [],
            commentaries: [],
            datasets: [],
        };

        for (let dataset of datasets) {
            const datasetDataset: DatasetDataset = {
                ...dataset,
                textDirection: dataset.textDirection! as any,
                books: [],
            };
            output.datasets!.push(datasetDataset);

            const books = await db.datasetBook.findMany({
                where: {
                    datasetId: dataset.id,
                },
                orderBy: {
                    order: 'asc',
                },
            });

            for (let book of books) {
                const chapters = await db.datasetChapter.findMany({
                    where: {
                        datasetId: dataset.id,
                        bookId: book.id,
                    },
                    orderBy: {
                        number: 'asc',
                    },
                });

                const bookChapters: DatasetBookChapter[] = chapters.map(
                    (chapter) => {
                        const bookChapter: DatasetBookChapter = {
                            chapter: JSON.parse(chapter.json),
                        };

                        for (let verse of bookChapter.chapter.content) {
                            if ('references' in verse) {
                                verse.references.sort(
                                    (a, b) => b.score - a.score
                                );
                            }
                        }

                        return bookChapter;
                    }
                );

                const datasetBook: DatasetDatasetBook = {
                    ...book,
                    id: book.id as BookId,
                    chapters: bookChapters,
                };
                datasetDataset.books.push(datasetBook);
            }

            const entities = await db.datasetEntity.findMany({
                where: {
                    datasetId: dataset.id,
                },
                orderBy: [{ type: 'asc' }, { id: 'asc' }],
            });

            for (let entity of entities) {
                const parsed = JSON.parse(entity.json);
                if (entity.type === 'person') {
                    (datasetDataset.people ??= []).push(parsed);
                } else if (entity.type === 'place') {
                    (datasetDataset.places ??= []).push(parsed);
                } else if (entity.type === 'event') {
                    (datasetDataset.events ??= []).push(parsed);
                } else if (entity.type === 'peopleGroup') {
                    (datasetDataset.peopleGroups ??= []).push(parsed);
                } else if (entity.type === 'lexicon') {
                    (datasetDataset.lexicon ??= []).push(parsed);
                } else if (entity.type === 'category') {
                    (datasetDataset.categories ??= []).push(parsed);
                } else {
                    logger.warn(
                        '[loadDatasetDatasets] Unknown entity type!',
                        entity.type
                    );
                }
            }
        }

        yield output;

        offset += pageSize;
    }
}

export interface SerializeApiOptions extends GenerateApiOptions {
    /**
     * Whether the output should be pretty-printed.
     */
    pretty?: boolean;
}

/**
 * Generates and serializes the API files for the datasets that are stored in the database.
 * Yields each batch of serialized files.
 * @param db The database that the dataset should be loaded from.
 * @param options The options to use for serializing the files.
 * @param apiOptions The options to use for generating the API files.
 * @param translationsPerBatch The number of translations that should be loaded and written per batch.
 * @param translations The list of translations that should be loaded. If not provided, all translations will be loaded.
 */
export function serializeFilesFromDatabase(
    db: PrismaClient,
    options: SerializeApiOptions = {},
    translationsPerBatch: number = 25,
    translations?: string[]
): AsyncGenerator<SerializedFile[]> {
    return serializeDatasets(
        loadDatasets(db, translationsPerBatch, translations),
        options
    );
}

/**
 * Generates and serializes the API files for the given datasets.
 * Yields each batch of serialized files.
 *
 * @param datasets The datasets to serialize.
 * @param options The options to use for generating and serializing the files.
 */
export function serializeDatasets(
    datasets: AsyncIterable<DatasetOutput>,
    options: SerializeApiOptions = {}
): AsyncGenerator<SerializedFile[]> {
    return serializeOutputFiles(
        generateOutputFilesFromDatasets(datasets, {
            getEnglishName: getEnglishName,
            getNativeName: getNativeName,
            ...options,
        }),
        options
    );
}

export function insertWarningMetadata(
    db: Database,
    parseMessages: DatasetOutput['parseMessages'] | undefined
) {
    if (!parseMessages) return;

    const logger = log.getLogger();

    const insertStatement = db.prepare(
        'INSERT INTO InputFileWarning (name, type, message) VALUES (?, ?, ?) ON CONFLICT (name, type, message) DO NOTHING;'
    );
    for (const [fileName, messages] of Object.entries(parseMessages)) {
        for (const message of messages) {
            logger.warn(`Warning in file ${fileName}: ${message.message}`);
            insertStatement.run(fileName, message.type, message.message);
        }
    }
}
