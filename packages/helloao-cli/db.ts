import { PrismaClient, Prisma } from "./prisma-gen";
import path, { dirname } from "path";
import Sql, { Database } from 'better-sqlite3';
import { readdir, readFile } from "fs-extra";
import { randomUUID } from "node:crypto";
import { DatasetOutput, DatasetTranslation, DatasetTranslationBook, generateDataset, } from "@helloao/tools/generation/dataset";
import {
    ChapterVerse, InputFile, OutputFile, TranslationBookChapter
} from "@helloao/tools/generation";
import { SerializeApiOptions, SerializedFile, loadTranslationFiles, serializeOutputFiles } from "./files";
import { sha256 } from "hash.js";
import { DOMParser } from "linkedom";
import { GenerateApiOptions, generateFilesForApi, generateOutputFilesFromDatasets } from "@helloao/tools/generation/api";

const cliPath = require.resolve('./index');
const migrationsPath = path.resolve(dirname(cliPath), 'migrations');

/**
 * Imports the translations from the given directories into the database.
 * @param db The database to import the translations into.
 * @param dirs The directories to import the translations from.
 * @param parser The DOM parser that should be used for USX files.
 * @param overwrite Whether to force a reload of the translations.
 */
export async function importTranslations(db: Database, dirs: string[], parser: DOMParser, overwrite: boolean) {
    let batches = [] as string[][];
    while (dirs.length > 0) {
        batches.push(dirs.splice(0, 10));
    }

    console.log('Processing', batches.length, 'batches of translations');
    for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        console.log(`Processing batch ${i + 1} of ${batches.length}`);
        await importTranslationBatch(db, batch, parser, overwrite);
    }
}

/**
 * Imports a batch of translations from the given directories into the database.
 * @param db The database to import the translations into.
 * @param dirs The directories that contain the translations.
 * @param parser The DOM parser that should be used for USX files.
 * @param overwrite Whether to force a reload of the translations.
 */
export async function importTranslationBatch(db: Database, dirs: string[], parser: DOMParser, overwrite: boolean) {
    const promises = [] as Promise<InputFile[]>[];
    for (let dir of dirs) {
        const fullPath = path.resolve(dir);
        promises.push(loadTranslationFiles(fullPath));
    }

    const allFiles = await Promise.all(promises);
    const files = allFiles.flat();
    await importTranslationFileBatch(db, files, parser, overwrite);
}

/**
 * Parses and imports the given files into the database.
 * @param db The database to import the files into.
 * @param files The files that should be parsed.
 * @param parser The DOM parser that should be used for USX files.
 * @param overwrite Whether to force a reload of the translations.
 */
export async function importTranslationFileBatch(db: Database, files: InputFile[], parser: DOMParser, overwrite: boolean) {
    console.log('Importing', files.length, 'files');
    if (overwrite) {
        console.log('Overwriting existing translations.');
    }
    const changedFiles = overwrite ? files : getChangedOrNewInputFiles(db, files);

    console.log('Processing', changedFiles.length, 'changed files');
    console.log('Skipping', files.length - changedFiles.length, 'unchanged files');

    const output = generateDataset(changedFiles, parser as globalThis.DOMParser);

    console.log('Generated', output.translations.length, 'translations');

    insertTranslations(db, output.translations);
    updateTranslationHashes(db, output.translations);
    insertFileMetadata(db, changedFiles);

    console.log(`Inserted ${output.translations} translations into DB`);
}

/**
 * Filters the given input files to only include those that have changed.
 * @param db The database to check for changes.
 * @param files The files to filter.
 */
export function getChangedOrNewInputFiles(db: Database, files: InputFile[]): InputFile[] {
    const fileExists = db.prepare('SELECT COUNT(*) as c FROM InputFile WHERE translationId = @translationId AND name = @name AND sha256 = @sha256;');

    return files.filter(f => {
        const count = fileExists.get({
            translationId: f.metadata.translation.id,
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

    const insertManyFiles = db.transaction((files) => {
        for (let file of files) {
            fileUpsert.run({
                translationId: file.metadata.translation.id,
                name: path.basename(file.name),
                format: file.fileType,
                sha256: file.sha256,
                sizeInBytes: file.content.length,
            });
        }
    });

    insertManyFiles(files);
}

export function insertTranslations(db: Database, translations: DatasetTranslation[]) {
    const translationUpsert = db.prepare(`INSERT INTO Translation(
        id,
        name,
        language,
        shortName,
        textDirection,
        licenseUrl,
        website,
        englishName
    ) VALUES (
        @id,
        @name,
        @language,
        @shortName,
        @textDirection,
        @licenseUrl,
        @website,
        @englishName
    ) ON CONFLICT(id) DO 
        UPDATE SET
            name=excluded.name,
            language=excluded.language,
            shortName=excluded.shortName,
            textDirection=excluded.textDirection,
            licenseUrl=excluded.licenseUrl,
            website=excluded.website,
            englishName=excluded.englishName;`);

    const insertManyTranslations = db.transaction((translations) => {
        for (let translation of translations) {
            translationUpsert.run({
                id: translation.id,
                name: translation.name,
                language: translation.language,
                shortName: translation.shortName,
                textDirection: translation.textDirection,
                licenseUrl: translation.licenseUrl,
                website: translation.website,
                englishName: translation.englishName,
            });
        }
    });

    insertManyTranslations(translations);

    for (let translation of translations) {
        insertTranslationBooks(db, translation, translation.books);
    }
}

export function insertTranslationBooks(db: Database, translation: DatasetTranslation, translationBooks: DatasetTranslationBook[]) {
    const bookUpsert = db.prepare(`INSERT INTO Book(
        id,
        translationId,
        title,
        name,
        commonName,
        numberOfChapters,
        \`order\`
    ) VALUES (
        @id,
        @translationId,
        @title,
        @name,
        @commonName,
        @numberOfChapters,
        @bookOrder
    ) ON CONFLICT(id,translationId) DO 
        UPDATE SET
            title=excluded.title,
            name=excluded.name,
            commonName=excluded.commonName,
            numberOfChapters=excluded.numberOfChapters;`);

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
                numberOfChapters: book.chapters.length,
                bookOrder: book.order ?? 9999
            });
        }
    });

    insertMany(translationBooks);

    for (let book of translationBooks) {
        insertTranslationContent(db, translation, book, book.chapters);
    }
}

export function insertTranslationContent(db: Database, translation: DatasetTranslation, book: DatasetTranslationBook, chapters: TranslationBookChapter[]) {
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

    const insertChaptersAndVerses = db.transaction(() => {
        for (let chapter of chapters) {
            let verses: {
                number: number,
                text: string,
                contentJson: string,
            }[] = [];
            let footnotes: Map<number, {
                id: number,
                text: string,
                verseNumber?: number,
            }> = new Map();

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
                        console.error('Verse missing number', translation.id, book.id, chapter.chapter.number, verse.number);
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
        }
    });

    insertChaptersAndVerses();
}

/**
 * Updates the hashes for the translations in the database.
 * @param db The database to update the hashes in.
 * @param translations The translations to update the hashes for.
 */
function updateTranslationHashes(db: Database, translations: DatasetTranslation[]) {
    console.log(`Updating hashes for ${translations.length} translations.`);

    const updateTranslationHash = db.prepare(`UPDATE Translation SET sha256 = @sha256 WHERE id = @translationId;`);
    const updateBookHash = db.prepare(`UPDATE Book SET sha256 = @sha256 WHERE translationId = @translationId AND id = @bookId;`);
    const updateChapterHash = db.prepare(`UPDATE Chapter SET sha256 = @sha256 WHERE translationId = @translationId AND bookId = @bookId AND number = @chapterNumber;`);

    const getBooks = db.prepare('SELECT * FROM Book WHERE translationId = ?;');
    const getChapters = db.prepare('SELECT * FROM Chapter WHERE translationId = @translationId AND bookId = @bookId;');

    for (let translation of translations) {
        const translationSha = sha256()
            .update(translation.id)
            .update(translation.name)
            .update(translation.language)
            .update(translation.licenseUrl)
            .update(translation.textDirection)
            .update(translation.website)
            .update(translation.englishName)
            .update(translation.shortName);

        const books = getBooks.all(translation.id) as {
            id: string;
            order: number;
            title: string;
            translationId: string;
            name: string;
            commonName: string;
            numberOfChapters: number;
            sha256: string;
        }[];

        for (let book of books) {
            const chapters = getChapters.all({
                translationId: translation.id,
                bookId: book.id
            }) as {
                number: string;
                bookId: string;
                translationId: string;
                json: string;
                sha256: string;
            }[];

            const bookSha = sha256()
                .update(book.translationId)
                .update(book.id)
                .update(book.numberOfChapters)
                .update(book.order)
                .update(book.name)
                .update(book.title)
                .update(book.commonName);

            for (let chapter of chapters) {
                const hash = sha256()
                    .update(chapter.translationId)
                    .update(chapter.bookId)
                    .update(chapter.number)
                    .update(chapter.json)
                    .digest('hex');

                chapter.sha256 = hash;

                bookSha.update(hash);
            }

            const updateChapters = db.transaction(() => {
                for (let chapter of chapters) {
                    updateChapterHash.run({
                        sha256: chapter.sha256,
                        translationId: chapter.translationId,
                        bookId: chapter.bookId,
                        chapterNumber: chapter.number
                    });
                }
            });

            updateChapters();

            const bookHash = bookSha.digest('hex');
            book.sha256 = bookHash;

            translationSha.update(bookHash);
        }

        const updateBooks = db.transaction(() => {
            for (let book of books) {
                updateBookHash.run({
                    sha256: book.sha256,
                    translationId: book.translationId,
                    bookId: book.id
                });
            }
        });

        updateBooks();

        const hash = translationSha.digest('hex');
        (translation as any).sha256 = hash;
    }

    const updateTranslations = db.transaction(() => {
        for (let translation of translations) {
            updateTranslationHash.run({
                sha256: (translation as any).sha256,
                translationId: translation.id
            });
        }
    });

    updateTranslations();

    console.log(`Updated.`);
}

export function getDbPathFromDir(dir: string) {
    dir = dir || process.cwd();
    return path.resolve(dir, 'bible-api.db');
}

export function getDbPath(p: string | null) {
    if (p) {
        return path.resolve(p);
    }
    return getDbPathFromDir(process.cwd());
}

export function getPrismaDbFromDir(dir: string) {
    const dbPath = getDbPathFromDir(dir);
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: `file:${dbPath}`,
            }
        }
    });
    return prisma;
}

export async function getDbFromDir(dir: string): Promise<Database> {
    const dbPath = getDbPathFromDir(dir);

    const db = await getDb(dbPath);
    return db;
}

export async function getDb(dbPath: string): Promise<Database> {
    const db = new Sql(dbPath, {
    });

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
    const appliedMigrations = db.prepare('SELECT * FROM _prisma_migrations;').all() as Migration[];

    let missingMigrations = [];
    for (let migration of migrations) {
        if (appliedMigrations.some(m => m.migration_name === migration)) {
            continue;
        }
        if (path.extname(migration) !== '') {
            continue;
        }
        missingMigrations.push(migration);
    }

    const insertMigrationStatement = db.prepare('INSERT INTO _prisma_migrations (id, checksum, started_at, finished_at, migration_name, applied_steps_count, logs, rolled_back_at) VALUES (?, ?, ?, ?, ?, ?, NULL, NULL);');

    for (let missingMigration of missingMigrations) {
        console.log(`Applying migration ${missingMigration}...`);
        const migration = path.resolve(migrationsPath, missingMigration, 'migration.sql');
        const migrationFile = await readFile(migration, 'utf8');
        db.exec(migrationFile);
        insertMigrationStatement.run(randomUUID(), '', new Date().toISOString(), new Date().toISOString(), missingMigration, 1);
    }

    return db;
}

interface Migration {
    id: string;
    checksum: string;
    finished_at: Date;
    migration_name: string;
}


/**
 * Loads the datasets from the database in a series of batches.
 * @param db The database.
 * @param translationsPerBatch The number of translations to load per batch.
 * @param translationsToLoad The list of translations to load. If not provided, all translations will be loaded.
 */
export async function* loadDatasets(db: PrismaClient, translationsPerBatch: number = 50, translationsToLoad?: string[]): AsyncGenerator<DatasetOutput> {
    let offset = 0;
    let pageSize = translationsPerBatch;

    console.log('Generating API files in batches of', pageSize);
    const totalTranslations = await db.translation.count();
    const totalBatches = Math.ceil(totalTranslations / pageSize);
    let batchNumber = 1;

    while (true) {
        console.log('Generating API batch', batchNumber, 'of', totalBatches);
        batchNumber++;

        const query: Prisma.TranslationFindManyArgs = {
            skip: offset,
            take: pageSize,
        };

        if (translationsToLoad && translationsToLoad.length > 0) {
            query.where = {
                id: {
                    in: translationsToLoad,
                }
            };
        }

        const translations = await db.translation.findMany(query);

        if (translations.length <= 0) {
            break;
        }

        const dataset: DatasetOutput = {
            translations: []
        };

        for (let translation of translations) {
            const datasetTranslation: DatasetTranslation = {
                ...translation,
                shortName: translation.shortName!,
                textDirection: translation.textDirection! as any,
                books: [],
            };
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
                        bookId: book.id
                    },
                    orderBy: [
                        { number: 'asc' },
                        { reader: 'asc' }
                    ]
                });

                const bookChapters: TranslationBookChapter[] = chapters.map(chapter => {
                    return {
                        chapter: JSON.parse(chapter.json),
                        thisChapterAudioLinks: audioLinks
                            .filter(link => link.number === chapter.number)
                            .reduce((acc, link) => {
                                acc[link.reader] = link.url;
                                return acc;
                            }, {} as any)
                    };
                });

                const datasetBook: DatasetTranslationBook = {
                    ...book,
                    chapters: bookChapters,
                };
                datasetTranslation.books.push(datasetBook);
            }
        }

        yield dataset;

        offset += pageSize;
    }
}

export type SerializeDatasetOptions = SerializeApiOptions & GenerateApiOptions;

/**
 * Generates and serializes the API files for the datasets that are stored in the database.
 * Yields each batch of serialized files.
 * @param db The database that the dataset should be loaded from.
 * @param options The options to use for serializing the files.
 * @param apiOptions The options to use for generating the API files.
 * @param translationsPerBatch The number of translations that should be loaded and written per batch.
 * @param translations The list of translations that should be loaded. If not provided, all translations will be loaded.
 */
export function serializeFilesFromDatabase(db: PrismaClient, options: SerializeDatasetOptions = {}, translationsPerBatch: number = 50, translations?: string[]): AsyncGenerator<SerializedFile[]> {
    return serializeDatasets(loadDatasets(db, translationsPerBatch, translations), options);
}

/**
 * Generates and serializes the API files for the given datasets.
 * Yields each batch of serialized files.
 * 
 * @param datasets The datasets to serialize.
 * @param options The options to use for generating and serializing the files.
 */
export function serializeDatasets(datasets: AsyncIterable<DatasetOutput>, options: SerializeDatasetOptions = {}): AsyncGenerator<SerializedFile[]> {
    return serializeOutputFiles(generateOutputFilesFromDatasets(datasets, options), options);
}