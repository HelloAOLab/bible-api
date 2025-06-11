import path, { basename, dirname, extname } from 'node:path';
import * as database from './db.js';
import Sql from 'better-sqlite3';
import { DOMParser, Element, Node } from 'linkedom';
import { mkdir, readdir, rm, writeFile, access } from 'node:fs/promises';
import { BibleClient } from '@gracious.tech/fetch-client';
import {
    getFirstNonEmpty,
    getTranslationId,
    normalizeLanguage,
} from '@helloao/tools/utils.js';
import {
    InputFile,
    InputTranslationMetadata,
} from '@helloao/tools/generation/index.js';
import { exists } from 'fs-extra';
import { KNOWN_AUDIO_TRANSLATIONS } from '@helloao/tools/generation/audio.js';
import { bookChapterCountMap } from '@helloao/tools/generation/book-order.js';
import { downloadFile, downloadResponse } from './downloads.js';
import { batch, toAsyncIterable } from '@helloao/tools/parser/iterators.js';
import {
    hashInputFiles,
    loadTranslationFiles,
    loadTranslationsFiles,
} from './files.js';
import { generateDataset } from '@helloao/tools/generation/dataset.js';
import {
    serializeAndUploadDatasets,
    uploadApiFilesFromDatabase,
    UploadApiFromDatabaseOptions,
    UploadApiOptions,
} from './uploads.js';
import { getHttpUrl, parseS3Url } from './s3.js';
import { input, select, confirm } from '@inquirer/prompts';
import { getNativeName, isValid } from 'all-iso-language-codes';
import { parse } from 'papaparse';
import { EBibleSource } from 'prisma-gen/index.js';
import { DateTime } from 'luxon';
import { sha256 } from 'hash.js';
import { BlobReader, BlobWriter, ZipReader } from '@zip.js/zip.js';
import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';

export interface GetTranslationsItem {
    id: string;
    language: string;
    direction: 'ltr' | 'rtl';
    year: number;
    name_local: string;
    name_english: string;
    name_abbrev: string;
    attribution: string;
    attribution_url: string;
    licenses: RuntimeLicense[];
}

export interface RuntimeLicense {
    id: string | null;
    name: string;
    restrictions: MetaRestrictions;
    url: string;
}

export interface MetaRestrictions {
    limit_verses: number | null;
    limit_book_ratio: number | null;
    limit_content_ratio: number | null;
    forbid_commercial: boolean;
    forbid_derivatives: boolean | 'same-license';
    forbid_attributionless: boolean;
    forbid_other: boolean;
}

export interface InitDbOptions {
    /**
     * The path to the source database to copy the schema from.
     */
    source?: string;

    /**
     * Whether to overwrite the existing database.
     */
    overwrite?: boolean;

    /**
     * The languages to copy from the source database. If not specified, then all languages will be copied.
     */
    language?: string[];
}

export interface ConvertToUsx3Options {
    /**
     * Path to BibleMultiConverter.jar file. If not provided, will attempt to find it in PATH or common locations.
     */
    bibleMultiConverterPath?: string;

    /**
     * Whether to keep the temporary download directory after conversion.
     */
    keepTempDir?: boolean;

    /**
     * Custom temporary directory path. If not provided, system temp directory will be used.
     */
    tempDir?: string;

    /**
     * Filename pattern for USX3 files. Default is "*.usx"
     */
    filenamePattern?: string;

    /**
     * Whether to overwrite existing files in output directory.
     */
    overwrite?: boolean;
}

export interface SourceTranslationsOptions {
    /**
     * Whether to convert USFM files to USX3 format after download.
     */
    convertToUsx3?: boolean;

    /**
     * Options for USX3 conversion.
     */
    conversionOptions?: ConvertToUsx3Options;

    /**
     * Whether to track downloads in database (only applies when convertToUsx3 is false).
     */
    useDatabase?: boolean;
}

/**
 * Converts USFM files to USX3 format using BibleMultiConverter.
 */
async function convertUsfmToUsx3(
    inputDir: string,
    outputDir: string,
    options: ConvertToUsx3Options = {}
): Promise<void> {
    const {
        bibleMultiConverterPath = 'BibleMultiConverter.jar',
        filenamePattern = '*.usx'
    } = options;

    console.log(`Converting USFM files from ${inputDir} to USX3 in ${outputDir}`);

    // Ensure output directory exists
    await mkdir(outputDir, { recursive: true });

    // Check if BibleMultiConverter.jar exists
    try {
        await access(bibleMultiConverterPath);
    } catch {
        throw new Error(`BibleMultiConverter.jar not found at: ${bibleMultiConverterPath}`);
    }

    // Execute BibleMultiConverter
    const command = 'java';
    const args = [
        '-jar',
        bibleMultiConverterPath,
        'ParatextConverter',
        'USFM',
        inputDir,
        'USX3',
        outputDir,
        filenamePattern
    ];

    console.log(`Executing: ${command} ${args.join(' ')}`);

    return new Promise((resolve, reject) => {
        const process = spawn(command, args, {
            stdio: ['inherit', 'pipe', 'pipe']
        });

        let stdout = '';
        let stderr = '';

        process.stdout?.on('data', (data) => {
            stdout += data.toString();
            console.log(data.toString().trim());
        });

        process.stderr?.on('data', (data) => {
            stderr += data.toString();
            console.error(data.toString().trim());
        });

        process.on('close', (code) => {
            if (code === 0) {
                console.log('USFM to USX3 conversion completed successfully');
                resolve();
            } else {
                reject(new Error(`BibleMultiConverter failed with exit code ${code}. stderr: ${stderr}`));
            }
        });

        process.on('error', (error) => {
            reject(new Error(`Failed to start BibleMultiConverter: ${error.message}`));
        });
    });
}

/**
 * Creates metadata.json file in the output directory based on EBible source information.
 */
async function createMetadataJson(
    outputDir: string,
    source: EBibleSource,
    overwrite: boolean = false
): Promise<void> {
    const metadataPath = path.resolve(outputDir, 'metadata.json');

    if (!overwrite && await exists(metadataPath)) {
        console.log(`Metadata file already exists: ${metadataPath}`);
        return;
    }

    const metadata: InputTranslationMetadata = {
        id: source.translationId,
        name: getFirstNonEmpty(source.title, source.translationId),
        direction: 'ltr',
        englishName: source.title,
        language: normalizeLanguage(source.languageCode),
        licenseUrl: `https://ebible.org/details.php?id=${source.id}`,
        shortName: source.translationId,
        website: `https://ebible.org/details.php?id=${source.id}`,
    };

    await writeFile(metadataPath, JSON.stringify(metadata, null, 2));
    console.log(`Created metadata.json: ${metadataPath}`);
}

/**
 * Fetches eBible translation metadata and returns EBibleSource objects.
 */
async function fetchEBibleMetadata(): Promise<EBibleSource[]> {
    const translationsResponse = await fetch(
        'https://ebible.org/Scriptures/translations.csv'
    );
    const translationsCsv = await translationsResponse.text();
    const ebibleTranslations = parse<{
        languageCode: string;
        translationId: string;
        languageName: string;
        languageNameInEnglish: string;
        dialect: string;
        homeDomain: string;
        title: string;
        description: string;
        Redistributable: string;
        Copyright: string;
        UpdateDate: string;
        publicationURL: string;
        OTbooks: string;
        OTchapters: string;
        OTverses: string;
        NTbooks: string;
        NTchapters: string;
        NTverses: string;
        DCbooks: string;
        DCchapters: string;
        DCverses: string;
        FCBHID: string;
        Certified: string;
        inScript: string;
        swordName: string;
        rodCode: string;
        textDirection: string;
        downloadable: string;
        font: string;
        shortTitle: string;
        PODISBN: string;
        script: string;
        sourceDate: string;
    }>(translationsCsv.trimEnd(), {
        header: true,
    });

    return ebibleTranslations.data.map((translation) => {
        const fcbhid = translation.FCBHID.trim();
        const languageCode = translation.languageCode.trim();

        const source: EBibleSource = {
            id: translation.translationId,
            translationId: getTranslationId(
                `${languageCode.toLowerCase()}_${fcbhid.slice(3).toLowerCase()}`
            ),
            title: translation.title.trim(),
            languageCode: languageCode,
            copyright: translation.Copyright.trim(),
            description: translation.description.trim(),
            oldTestamentBooks: parseInt(translation.OTbooks.trim()),
            oldTestamentChapters: parseInt(translation.OTchapters.trim()),
            oldTestamentVerses: parseInt(translation.OTverses.trim()),
            newTestamentBooks: parseInt(translation.NTbooks.trim()),
            newTestamentChapters: parseInt(translation.NTchapters.trim()),
            newTestamentVerses: parseInt(translation.NTverses.trim()),
            apocryphaBooks: parseInt(translation.DCbooks.trim()),
            apocryphaChapters: parseInt(translation.DCchapters.trim()),
            apocryphaVerses: parseInt(translation.DCverses.trim()),
            redistributable:
                translation.Redistributable.trim().toUpperCase() === 'TRUE'
                    ? 'TRUE'
                    : ('FALSE' as any),
            FCBHID: fcbhid,
            sourceDate: DateTime.fromISO(
                translation.sourceDate.trim()
            ).toISO() as any,
            updateDate: DateTime.fromISO(
                translation.UpdateDate.trim()
            ).toISO() as any,
            usfmDownloadDate: null,
            usfmDownloadPath: null,
            usfmZipUrl: null,
            usfmZipEtag: null,
            sha256: null,
        };

        source.sha256 = sha256()
            .update(source.id)
            .update(source.translationId)
            .update(source.title)
            .update(source.languageCode)
            .update(source.copyright)
            .update(source.description)
            .update(source.oldTestamentBooks)
            .update(source.oldTestamentChapters)
            .update(source.oldTestamentVerses)
            .update(source.newTestamentBooks)
            .update(source.newTestamentChapters)
            .update(source.newTestamentVerses)
            .update(source.apocryphaBooks)
            .update(source.apocryphaChapters)
            .update(source.apocryphaVerses)
            .update(source.redistributable)
            .update(source.sourceDate)
            .update(source.updateDate)
            .digest('hex');

        return source;
    });
}

/**
 * Initializes a new Bible API DB.
 * @param dbPath The path to the database. If null or empty, then the "bible-api.db" will be used from the current working directory.
 * @param options The options for the initialization.
 */
export async function initDb(
    dbPath: string | null,
    options: InitDbOptions
): Promise<void> {
    console.log('Initializing new Bible API DB...');

    if (options.source) {
        if (options.source.startsWith('https://')) {
            console.log('Downloading source database...');
            const databasePath = database.getDbPath(dbPath);
            let progressIncrement = 0.01;
            await downloadFile(options.source, databasePath, (progress) => {
                if (progress >= progressIncrement) {
                    console.log(
                        `Downloading... ${Math.round(progress * 100)}%`
                    );
                    progressIncrement += 0.01;
                }
            });
        } else {
            const databasePath = database.getDbPath(dbPath);
            if (await exists(databasePath)) {
                if (!options.overwrite) {
                    console.log('Database already exists.');
                    return;
                } else {
                    console.log('Overwriting existing database...');
                    await rm(databasePath);
                }
            }
            const db = new Sql(databasePath, {});
            const sourcePath = path.resolve(options.source);

            try {
                console.log('Copying schema from source DB...');

                if (options.language) {
                    console.log(
                        'Copying only the following languages:',
                        options.language
                    );

                    const languages = `(${options.language
                        .map((l: string) => `'${l}'`)
                        .join(', ')})`;
                    db.exec(`
                        ATTACH DATABASE "${sourcePath}" AS source;

                        CREATE TABLE "_prisma_migrations" AS SELECT * FROM source._prisma_migrations;
                        
                        CREATE TABLE "Translation" AS SELECT * FROM source.Translation
                        WHERE language IN ${languages};

                        CREATE TABLE "Book" AS SELECT * FROM source.Book
                        INNER JOIN source.Translation ON source.Translation.id = source.Book.translationId
                        WHERE source.Translation.language IN ${languages};

                        CREATE TABLE "Chapter" AS SELECT * FROM source.Chapter
                        INNER JOIN source.Translation ON source.Translation.id = source.Chapter.translationId
                        WHERE source.Translation.language IN ${languages};

                        CREATE TABLE "ChapterVerse" AS SELECT * FROM source.ChapterVerse
                        INNER JOIN source.Translation ON source.Translation.id = source.ChapterVerse.translationId
                        WHERE source.Translation.language IN ${languages};

                        CREATE TABLE "ChapterFootnote" AS SELECT * FROM source.ChapterFootnote
                        INNER JOIN source.Translation ON source.Translation.id = source.ChapterFootnote.translationId
                        WHERE source.Translation.language IN ${languages};

                        CREATE TABLE "ChapterAudioUrl" AS SELECT * FROM source.ChapterAudioUrl
                        INNER JOIN source.Translation ON source.Translation.id = source.ChapterAudioUrl.translationId
                        WHERE source.Translation.language IN ${languages};

                        CREATE TABLE "Commentary" AS SELECT * FROM source.Commentary
                        WHERE language IN ${languages};

                        CREATE TABLE "CommentaryBook" AS SELECT * FROM source.CommentaryBook
                        INNER JOIN source.Commentary ON source.Commentary.id = source.CommentaryBook.commentaryId
                        WHERE source.Commentary.language IN ${languages};

                        CREATE TABLE "CommentaryChapter" AS SELECT * FROM source.CommentaryChapter
                        INNER JOIN source.Commentary ON source.Commentary.id = source.CommentaryChapter.commentaryId
                        WHERE source.Commentary.language IN ${languages};

                        CREATE TABLE "CommentaryChapterVerse" AS SELECT * FROM source.CommentaryChapterVerse
                        INNER JOIN source.Commentary ON source.Commentary.id = source.CommentaryChapterVerse.commentaryId
                        WHERE source.Commentary.language IN ${languages};
                    `);
                } else {
                    db.exec(`
                        ATTACH DATABASE "${sourcePath}" AS source;

                        CREATE TABLE "_prisma_migrations" AS SELECT * FROM source._prisma_migrations;
                        CREATE TABLE "Translation" AS SELECT * FROM source.Translation;
                        CREATE TABLE "Book" AS SELECT * FROM source.Book;
                        CREATE TABLE "Chapter" AS SELECT * FROM source.Chapter;
                        CREATE TABLE "ChapterVerse" AS SELECT * FROM source.ChapterVerse;
                        CREATE TABLE "ChapterFootnote" AS SELECT * FROM source.ChapterFootnote;
                        CREATE TABLE "ChapterAudioUrl" AS SELECT * FROM source.ChapterAudioUrl;
                        CREATE TABLE "Commentary" AS SELECT * FROM source.Commentary;
                        CREATE TABLE "CommentaryBook" AS SELECT * FROM source.CommentaryBook;
                        CREATE TABLE "CommentaryChapter" AS SELECT * FROM source.CommentaryChapter;
                        CREATE TABLE "CommentaryChapterVerse" AS SELECT * FROM source.CommentaryChapterVerse;
                    `);
                }

                console.log('Done.');
            } finally {
                db.close();
            }
        }
    } else {
        const db = await database.getDb(database.getDbPath(dbPath));
        db.close();
    }
}

export interface ImportTranslationOptions {
    /**
     * Whether to forcibly import the translations, even if they have already been imported.
     */
    overwrite?: boolean;
}

/**
 * Imports a translation from the given directory into the database in the current working directory.
 * @param dir The directory that the translation is located in.
 * @param dirs Any extra directories that should be imported.
 * @param options The options for the import.
 */
export async function importTranslation(
    dir: string,
    dirs: string[],
    options: ImportTranslationOptions
): Promise<void> {
    const parser = new DOMParser();
    globalThis.DOMParser = DOMParser as any;
    globalThis.Element = Element as any;
    globalThis.Node = Node as any;

    const db = await database.getDbFromDir(process.cwd());
    try {
        await database.importTranslations(
            db,
            [dir, ...dirs],
            parser,
            !!options.overwrite
        );
    } finally {
        db.close();
    }
}

/**
 * Imports all the translations from the given directory into the database in the current working directory.
 * @param dir The directory that the translations are located in.
 * @param options The options.
 */
export async function importTranslations(
    dir: string,
    options: ImportTranslationOptions
): Promise<void> {
    const parser = new DOMParser();
    globalThis.DOMParser = DOMParser as any;
    globalThis.Element = Element as any;
    globalThis.Node = Node as any;

    const db = await database.getDbFromDir(process.cwd());
    try {
        const files = await readdir(dir);
        const translationDirs = files.map((f) => path.resolve(dir, f));
        console.log(`Importing ${translationDirs.length} translations`);
        await database.importTranslations(
            db,
            translationDirs,
            parser,
            !!options.overwrite
        );
    } finally {
        db.close();
    }
}

/**
 * Imports a commentary from the given directory into the database in the current working directory.
 * @param dir The directory that the commentary is located in.
 * @param dirs Any extra directories that should be imported.
 * @param options The options for the import.
 */
export async function importCommentary(
    dir: string,
    dirs: string[],
    options: ImportTranslationOptions
): Promise<void> {
    const parser = new DOMParser();
    globalThis.DOMParser = DOMParser as any;
    globalThis.Element = Element as any;
    globalThis.Node = Node as any;

    const db = await database.getDbFromDir(process.cwd());
    try {
        await database.importCommentaries(
            db,
            [dir, ...dirs],
            parser,
            !!options.overwrite
        );
    } finally {
        db.close();
    }
}

/**
 * Imports all the commentaries from the given directory into the database in the current working directory.
 * @param dir The directory that the commentaries are located in.
 * @param options The options.
 */
export async function importCommentaries(
    dir: string,
    options: ImportTranslationOptions
): Promise<void> {
    const parser = new DOMParser();
    globalThis.DOMParser = DOMParser as any;
    globalThis.Element = Element as any;
    globalThis.Node = Node as any;

    const db = await database.getDbFromDir(process.cwd());
    try {
        const files = await readdir(dir);
        const commentaryDirs = files.map((f) => path.resolve(dir, f));
        console.log(`Importing ${commentaryDirs.length} commentaries`);
        await database.importCommentaries(
            db,
            commentaryDirs,
            parser,
            !!options.overwrite
        );
    } finally {
        db.close();
    }
}

export interface FetchTranslationsOptions {
    /**
     * Fetch all translations. If omitted, only undownloaded translations will be fetched.
     */
    all?: boolean;
}

/**
 * Fetches the specified translations from fetch.bible and places them in the given directory.
 * @param dir The directory that the translations should be placed in.
 * @param translations The translations that should be downloaded. If not specified, then all translations will be downloaded.
 * @param options The options.
 */
export async function fetchTranslations(
    dir: string,
    translations?: string[],
    options: FetchTranslationsOptions = {}
): Promise<void> {
    const translationsSet = new Set(translations);
    const client = new BibleClient({
        remember_fetches: false,
    });

    const collection = await client.fetch_collection();
    const collectionTranslations = collection.get_translations();

    console.log(`Discovered ${collectionTranslations.length} translations`);

    const filtered =
        translations && translations.length <= 0
            ? collectionTranslations
            : collectionTranslations.filter((t) => translationsSet.has(t.id));

    let batches: GetTranslationsItem[][] = [];
    while (filtered.length > 0) {
        batches.push(filtered.splice(0, 10));
    }

    console.log(
        `Downloading ${filtered.length} translations in ${batches.length} batches`
    );

    for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        console.log(`Downloading batch ${i + 1} of ${batches.length}`);
        const translations = await Promise.all(
            batch.map(async (t) => {
                const id = getTranslationId(t.id);
                const translation: InputTranslationMetadata = {
                    id,
                    name: getFirstNonEmpty(
                        t.name_local,
                        t.name_english,
                        t.name_abbrev
                    ),
                    direction: getFirstNonEmpty(t.direction, 'ltr'),
                    englishName: getFirstNonEmpty(
                        t.name_english,
                        t.name_abbrev,
                        t.name_local
                    ),
                    language: normalizeLanguage(t.language),
                    licenseUrl: t.attribution_url,
                    shortName: getFirstNonEmpty(t.name_abbrev, id),
                    website: t.attribution_url,
                };

                const books = await Promise.all(
                    collection.get_books(t.id).map(async (b) => {
                        const name = `${b.id}.usx`;
                        if (
                            !options.all &&
                            (await exists(
                                path.resolve(dir, translation.id, name)
                            ))
                        ) {
                            return null;
                        }

                        const content = await collection.fetch_book(
                            t.id,
                            b.id,
                            'usx'
                        );

                        const contentString = content.get_whole();
                        const file: InputFile = {
                            fileType: 'usx',
                            content: contentString,
                            metadata: translation,
                            name,
                        };

                        return file;
                    })
                );

                return {
                    translation,
                    books,
                };
            })
        );

        console.log(`Writing batch ${i + 1} of ${batches.length}`);
        let promises: Promise<void>[] = [];
        for (let { translation, books } of translations) {
            for (let book of books) {
                if (!book) {
                    continue;
                }
                if (!book.name) {
                    throw new Error('Book name is required');
                }
                const fullPath = path.resolve(dir, translation.id, book.name);
                await mkdir(path.dirname(fullPath), { recursive: true });
                const promise = writeFile(fullPath, book.content);
                promises.push(promise);
            }

            const translationPath = path.resolve(
                dir,
                translation.id,
                'metadata.json'
            );
            await mkdir(path.dirname(translationPath), { recursive: true });
            const translationData = JSON.stringify(translation, null, 2);
            promises.push(writeFile(translationPath, translationData));
        }

        await Promise.all(promises);
    }
}

/**
 * Fetches the specified audio translations and places them in the given directory.
 * Translations should be in the format "translationId/audioId". e.g. "BSB/gilbert"
 * @param dir The directory that the translations should be placed in.
 * @param translations The translations that should be downloaded.
 * @param options The options.
 */
export async function fetchAudio(
    dir: string,
    translations: string[],
    options: FetchTranslationsOptions = {}
): Promise<void> {
    for (let translation of translations) {
        const [translationId, reader] = translation.split('/');
        const generator =
            KNOWN_AUDIO_TRANSLATIONS.get(translationId)?.get(reader);

        if (!generator) {
            console.warn('Unknown translation:', translation);
            continue;
        }

        for (let [bookId, chapters] of bookChapterCountMap) {
            for (let chapter = 1; chapter <= chapters; chapter++) {
                const url = generator(bookId, chapter);
                const ext = extname(url);

                const [translationId, reader] = translation.split('/');

                const name = `${chapter}.${reader}${ext}`;
                const fullPath = path.resolve(
                    dir,
                    'audio',
                    translationId,
                    bookId,
                    name
                );

                if (!options.all && (await exists(fullPath))) {
                    continue;
                }

                await downloadFile(url, fullPath);
            }
        }
    }
}

/**
 * Generates the translation files directly from the translations stored in the given input directory.
 * @param input The input directory that the translations are stored in.
 * @param dest The destination to upload the API files to.
 * @param options The options for the generation.
 */
export async function generateTranslationsFiles(
    input: string,
    dest: string,
    options: UploadApiFromDatabaseOptions
): Promise<void> {
    const parser = new DOMParser();
    globalThis.DOMParser = DOMParser as any;
    globalThis.Element = Element as any;
    globalThis.Node = Node as any;

    const dirs = await readdir(path.resolve(input));
    const batchSize =
        typeof options.batchSize === 'number'
            ? options.batchSize
            : parseInt(options.batchSize);
    for (let b of batch(dirs, batchSize)) {
        const files = await loadTranslationsFiles(b);
        const dataset = generateDataset(files, parser as any);
        await serializeAndUploadDatasets(
            dest,
            toAsyncIterable([dataset]),
            options
        );
    }
}

/**
 * Downloads and processes USFM files from eBible.org.
 * Can optionally convert to USX3 format and/or track in database.
 */
export async function sourceTranslations(
    outputDir: string,
    translations?: string[],
    options: SourceTranslationsOptions = {}
): Promise<void> {
    const {
        convertToUsx3 = false,
        conversionOptions = {},
        useDatabase = true
    } = options;

    const ebibleSources = await fetchEBibleMetadata();

    let db: any = null;
    let sourceExists: any = null;
    let sourceUpsert: any = null;
    let filteredSources: EBibleSource[] = [];

    if (useDatabase && !convertToUsx3) {
        db = await database.getDbFromDir(process.cwd());
        sourceExists = db.prepare(
            'SELECT usfmZipEtag, usfmDownloadDate FROM EBibleSource WHERE id = @id AND sha256 = @sha256;'
        );

        filteredSources = ebibleSources.filter((source) => {
            if (!source.FCBHID) {
                return false;
            }
            if (translations && !translations.includes(source.translationId)) {
                return false;
            }
            const existingSource = sourceExists.get(source) as {
                usfmZipEtag: string;
                usfmDownloadDate: string;
            };
            if (existingSource) {
                if (!existingSource.usfmDownloadDate) {
                    return true;
                }
                source.usfmZipEtag = existingSource.usfmZipEtag;
                source.usfmDownloadDate = existingSource.usfmDownloadDate as any;

                if (translations && translations.includes(source.translationId)) {
                    return true;
                }

                return false;
            }

            return true;
        });

        sourceUpsert = db.prepare(`INSERT INTO EBibleSource(
            id, translationId, title, languageCode, copyright, description,
            oldTestamentBooks, oldTestamentChapters, oldTestamentVerses,
            newTestamentBooks, newTestamentChapters, newTestamentVerses,
            apocryphaBooks, apocryphaChapters, apocryphaVerses,
            redistributable, sourceDate, updateDate, usfmDownloadDate,
            usfmDownloadPath, sha256, usfmZipUrl, usfmZipEtag, FCBHID
        ) VALUES (
            @id, @translationId, @title, @languageCode, @copyright, @description,
            @oldTestamentBooks, @oldTestamentChapters, @oldTestamentVerses,
            @newTestamentBooks, @newTestamentChapters, @newTestamentVerses,
            @apocryphaBooks, @apocryphaChapters, @apocryphaVerses,
            @redistributable, @sourceDate, @updateDate, @usfmDownloadDate,
            @usfmDownloadPath, @sha256, @usfmZipUrl, @usfmZipEtag, @FCBHID
        ) ON CONFLICT(id) DO UPDATE SET
            translationId = excluded.translationId, title = excluded.title,
            languageCode = excluded.languageCode, copyright = excluded.copyright,
            description = excluded.description, oldTestamentBooks = excluded.oldTestamentBooks,
            oldTestamentChapters = excluded.oldTestamentChapters, oldTestamentVerses = excluded.oldTestamentVerses,
            newTestamentBooks = excluded.newTestamentBooks, newTestamentChapters = excluded.newTestamentChapters,
            newTestamentVerses = excluded.newTestamentVerses, apocryphaBooks = excluded.apocryphaBooks,
            apocryphaChapters = excluded.apocryphaChapters, apocryphaVerses = excluded.apocryphaVerses,
            redistributable = excluded.redistributable, sourceDate = excluded.sourceDate,
            updateDate = excluded.updateDate, usfmDownloadDate = excluded.usfmDownloadDate,
            usfmDownloadPath = excluded.usfmDownloadPath, sha256 = excluded.sha256,
            usfmZipUrl = excluded.usfmZipUrl, usfmZipEtag = excluded.usfmZipEtag,
            FCBHID = excluded.FCBHID;
        `);
    } else {
        filteredSources = ebibleSources.filter((source) => {
            if (!source.FCBHID) {
                return false;
            }
            if (translations && !translations.includes(source.translationId)) {
                return false;
            }
            return true;
        });
    }

    console.log(`Found ${filteredSources.length} ${useDatabase ? 'new or changed ' : ''}sources`);

    // Setup temporary directory for conversion mode
    let downloadDirectory: string | null = null;
    if (convertToUsx3) {
        downloadDirectory = conversionOptions.tempDir || path.join(tmpdir(), 'bible-usfm-download');
        await mkdir(downloadDirectory, { recursive: true });
        console.log(`Using temporary directory: ${downloadDirectory}`);
    }

    try {
        let batches: EBibleSource[][] = [];
        const batchSize = convertToUsx3 ? filteredSources.length : 50;
        while (filteredSources.length > 0) {
            batches.push(filteredSources.splice(0, batchSize));
        }

        let numDownloaded = 0;
        let numConverted = 0;
        let numErrored = 0;

        for (let batch of batches) {
            await Promise.all(
                batch.map(async (source) => {
                    try {
                        console.log(`${convertToUsx3 ? '\n' : ''}Processing: ${source.translationId}${convertToUsx3 ? ` (${source.title})` : ''}`);

                        // Check if USFM zip file exists
                        const detailsPage = await fetch(
                            `https://ebible.org/Scriptures/details.php?id=${source.id}`
                        );
                        const detailsHtml = await detailsPage.text();
                        const hasUsfm = detailsHtml.includes(`${source.id}_usfm.zip`);

                        if (hasUsfm) {
                            const usfmZipUrl = `https://ebible.org/Scriptures/${source.id}_usfm.zip`;
                            source.usfmZipUrl = usfmZipUrl;

                            const usfmResult = await fetch(usfmZipUrl);

                            if (usfmResult.status === 404) {
                                source.usfmZipUrl = null;
                                if (convertToUsx3) {
                                    console.log(`USFM file not found: ${usfmZipUrl}`);
                                }
                            } else if (usfmResult.status === 200) {
                                source.usfmZipEtag = usfmResult.headers.get('etag') || null;
                                const reader = new BlobReader(await usfmResult.blob());
                                const zip = new ZipReader(reader);

                                const translationDownloadDir = convertToUsx3
                                    ? path.join(downloadDirectory!, source.translationId)
                                    : path.resolve(outputDir, source.translationId);

                                await mkdir(translationDownloadDir, { recursive: true });

                                try {
                                    const entries = await zip.getEntries();
                                    let usfmFileCount = 0;

                                    for (let entry of entries) {
                                        if (
                                            entry.getData &&
                                            entry.directory === false &&
                                            entry.filename.endsWith('.usfm')
                                        ) {
                                            const outputPath = path.resolve(translationDownloadDir, entry.filename);
                                            const blob = await entry.getData(new BlobWriter('text/plain'), {});
                                            await writeFile(
                                                outputPath,
                                                new Uint8Array(await blob.arrayBuffer())
                                            );
                                            usfmFileCount++;
                                        }
                                    }

                                    if (convertToUsx3) {
                                        console.log(`Extracted ${usfmFileCount} USFM files`);

                                        if (usfmFileCount > 0) {
                                            const translationOutputDir = path.join(outputDir, source.translationId);
                                            await mkdir(translationOutputDir, { recursive: true });

                                            console.log(`Converting to USX3 format...`);
                                            await convertUsfmToUsx3(translationDownloadDir, translationOutputDir, conversionOptions);

                                            await createMetadataJson(translationOutputDir, source, conversionOptions.overwrite);

                                            console.log(`Successfully converted ${source.translationId} to USX3`);
                                            numConverted++;
                                        }
                                    }

                                    numDownloaded++;
                                    source.usfmDownloadDate = DateTime.utc().toISO() as any;
                                    source.usfmDownloadPath = translationDownloadDir;
                                } finally {
                                    zip.close();
                                }
                            } else {
                                numErrored += 1;
                                if (convertToUsx3) {
                                    console.error(`Failed to download ${usfmZipUrl}: ${usfmResult.status}`);
                                }
                            }
                        } else if (convertToUsx3) {
                            console.log(`No USFM file available for ${source.translationId}`);
                        }

                        if (useDatabase && sourceUpsert) {
                            sourceUpsert.run(source);
                        }
                    } catch (error) {
                        numErrored++;
                        if (convertToUsx3) {
                            console.error(`Error processing ${source.translationId}:`, error);
                        }
                    }
                })
            );
        }

        if (convertToUsx3) {
            console.log(`\nSummary:`);
            console.log(`- Downloaded: ${numDownloaded} translations`);
            console.log(`- Converted to USX3: ${numConverted} translations`);
            console.log(`- Errors: ${numErrored} translations`);
        } else {
            console.log(`Downloaded ${numDownloaded} sources. ${numErrored} errored.`);
        }

    } finally {
        if (db) {
            db.close();
        }

        // Clean up temporary directory
        if (downloadDirectory && !conversionOptions.keepTempDir) {
            try {
                await rm(downloadDirectory, { recursive: true, force: true });
                console.log(`Cleaned up temporary directory: ${downloadDirectory}`);
            } catch (error) {
                console.warn(`Failed to clean up temporary directory: ${error}`);
            }
        } else if (downloadDirectory) {
            console.log(`Temporary directory preserved: ${downloadDirectory}`);
        }
    }
}

/**
 * Generates the translation files directly from the translation stored in the given input directory.
 * @param input The input directory that the translation is stored in.
 * @param dest The destination to upload the API files to.
 * @param options The options for the generation.
 */
export async function generateTranslationFiles(
    input: string,
    dest: string,
    options: UploadApiOptions
): Promise<void> {
    const parser = new DOMParser();
    globalThis.DOMParser = DOMParser as any;
    globalThis.Element = Element as any;
    globalThis.Node = Node as any;

    const files = await loadTranslationFilesOrAskForMetadata(
        path.resolve(input)
    );
    if (!files) {
        console.log('No translation files found.');
        return;
    }

    const dataset = generateDataset(files, parser as any);
    await serializeAndUploadDatasets(dest, toAsyncIterable([dataset]), options);
}

/**
 * The options for uploading the test translations.
 */
export interface UploadTestTranslationOptions extends UploadApiOptions {
    /**
     * The s3 URL to upload the translations to.
     * Defaults to "s3://ao-bible-api-public-uploads"
     */
    s3Url?: string;
}

export interface UploadTestTranslationResult {
    /**
     * The S3 URL where the translations were uploaded to.
     */
    uploadS3Url: string;

    /**
     * The HTTP URL that the version can be accessed at.
     */
    url: string;

    /**
     * The URL that the available translations can be accessed at.
     */
    availableTranslationsUrl: string;

    /**
     * The version that was uploaded.
     * This is a SHA-256 hash of the input files.
     */
    version: string;
}

/**
 * Generates the API files directly from the translations stored in the given input directory and
 * uploads them to the HelloAO test s3 bucket.
 *
 * Requires access to the HelloAO test s3 bucket. Email hello@helloao.org for access.
 *
 * @param input The input directory that the translations are stored in.
 * @param options The options to use for the upload.
 */
export async function uploadTestTranslations(
    input: string,
    options: UploadTestTranslationOptions
): Promise<UploadTestTranslationResult> {
    const parser = new DOMParser();
    globalThis.DOMParser = DOMParser as any;
    globalThis.Element = Element as any;
    globalThis.Node = Node as any;

    const dirs = await readdir(path.resolve(input));
    const files = await loadTranslationsFiles(dirs);
    const hash = hashInputFiles(files);

    const dataset = generateDataset(files, parser as any);
    const url = options.s3Url || 's3://ao-bible-api-public-uploads';

    await serializeAndUploadDatasets(url, toAsyncIterable([dataset]), {
        ...options,
        pathPrefix: `/${hash}`,
    });

    const urls = getUrls(url);

    return {
        ...urls,
        version: hash,
        availableTranslationsUrl: `${urls.url}/${hash}/api/available_translations.json`,
    };
}

/**
 * Generates the API files directly from the given translation and
 * uploads them to the HelloAO test s3 bucket.
 *
 * Requires access to the HelloAO test s3 bucket. Email hello@helloao.org for access.
 *
 * @param input The input directory that the translations are stored in.
 * @param options The options to use for the upload.
 */
export async function uploadTestTranslation(
    input: string,
    options: UploadTestTranslationOptions
): Promise<UploadTestTranslationResult | undefined> {
    const parser = new DOMParser();
    globalThis.DOMParser = DOMParser as any;
    globalThis.Element = Element as any;
    globalThis.Node = Node as any;

    const inputPath = path.resolve(input);
    const files = await loadTranslationFilesOrAskForMetadata(inputPath);

    if (!files || files.length <= 0) {
        console.log('No translation files found.');
        return;
    }

    const hash = hashInputFiles(files);
    const dataset = generateDataset(files, parser as any);
    const url = options.s3Url || 's3://ao-bible-api-public-uploads';

    await serializeAndUploadDatasets(url, toAsyncIterable([dataset]), {
        ...options,
        pathPrefix: `/${hash}`,
    });

    const urls = getUrls(url);

    return {
        ...urls,
        version: hash,
        availableTranslationsUrl: `${urls.url}/${hash}/api/available_translations.json`,
    };
}

function getUrls(dest: string) {
    const url = getHttpUrl(dest);

    return {
        uploadS3Url: dest,
        url: url as string,
    };
}

async function loadTranslationFilesOrAskForMetadata(dir: string) {
    let files = await loadTranslationFiles(dir);

    if (!files) {
        console.log(`No metadata found for the translation in ${dir}`);

        const enterMetadata = await confirm({
            message: 'Do you want to enter the metadata for the translation?',
        });

        if (!enterMetadata) {
            return null;
        }

        const defaultId = basename(dir);
        const metadata = await askForMetadata(defaultId);

        const saveMetadata = await confirm({
            message: 'Do you want to save this metadata?',
        });

        if (saveMetadata) {
            await writeFile(
                path.resolve(dir, 'metadata.json'),
                JSON.stringify(metadata, null, 2)
            );
        }

        files = await loadTranslationFiles(dir);
    }

    return files;
}

/**
 * Asks the user for the metadata for the translation.
 */
export async function askForMetadata(
    defaultId?: string
): Promise<InputTranslationMetadata> {
    const id = await input({
        message: 'Enter the translation ID',
        default: defaultId,
    });
    const language = await input({
        message: 'Enter the ISO 639 translation language',
        validate: (input: string) => {
            return isValid(input) ? true : 'Invalid language code.';
        },
        required: true,
    });
    const direction = await select({
        message: 'Enter the text direction of the language',
        choices: [
            { name: 'Left-to-right', value: 'ltr' },
            { name: 'Right-to-left', value: 'rtl' },
        ],
        default: 'ltr',
    });
    const shortName = await input({
        message: 'Enter the short name of the translation',
        default: id,
        required: false,
    });
    const name = await input({
        message: 'Enter the name of the translation',
        required: true,
    });
    const englishName = await input({
        message: 'Enter the English name of the translation',
        default: name,
    });
    const licenseUrl = await input({
        message: 'Enter the license URL for the translation',
        required: true,
    });
    const website = await input({
        message: 'Enter the website URL for the translation',
        required: true,
        default: licenseUrl,
    });

    return {
        id,
        language,
        direction: direction as InputTranslationMetadata['direction'],
        shortName,
        name,
        englishName,
        licenseUrl,
        website,
    };
} 
