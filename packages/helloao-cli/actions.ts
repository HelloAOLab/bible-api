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
import { input, select, confirm, checkbox } from '@inquirer/prompts';
import { getNativeName, isValid } from 'all-iso-language-codes';
import { log } from '@helloao/tools';
import { EBibleSource } from 'prisma-gen/index.js';
import { DateTime } from 'luxon';
import { BlobReader, BlobWriter, ZipReader } from '@zip.js/zip.js';
import { tmpdir } from 'node:os';
import { existsSync } from 'fs';
import { copyFile } from 'node:fs/promises';
import {
    findBibleMultiConverterJar,
    promptForBibleMultiConverter,
    convertUsfmToUsx3,
} from './conversion.js';
import { fetchEBibleMetadata } from './ebible.js';

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
     * Whether to track downloads in database.
     */
    useDatabase?: boolean;

    /**
     * Path to BibleMultiConverter.jar file. If not provided, will search common locations.
     */
    bibleMultiConverterPath?: string;

    /**
     * Whether to overwrite existing files in output directory.
     */
    overwrite?: boolean;
}

/**
 * Creates metadata.json file in the output directory based on EBible source information.
 */
async function createMetadataJson(
    outputDir: string,
    source: EBibleSource,
    overwrite: boolean = false
): Promise<void> {
    const logger = log.getLogger();
    const metadataPath = path.resolve(outputDir, 'metadata.json');

    if (!overwrite && (await exists(metadataPath))) {
        logger.log(`Metadata file already exists: ${metadataPath}`);
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
    logger.log(`Created metadata.json: ${metadataPath}`);
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
    const logger = log.getLogger();
    logger.log('Initializing new Bible API DB...');

    if (options.source) {
        if (options.source.startsWith('https://')) {
            logger.log('Downloading source database...');
            const databasePath = database.getDbPath(dbPath);
            let progressIncrement = 0.01;
            await downloadFile(options.source, databasePath, (progress) => {
                if (progress >= progressIncrement) {
                    logger.log(`Downloading... ${Math.round(progress * 100)}%`);
                    progressIncrement += 0.01;
                }
            });
        } else {
            const databasePath = database.getDbPath(dbPath);
            if (await exists(databasePath)) {
                if (!options.overwrite) {
                    logger.log('Database already exists.');
                    return;
                } else {
                    logger.log('Overwriting existing database...');
                    await rm(databasePath);
                }
            }
            const db = new Sql(databasePath, {});
            const sourcePath = path.resolve(options.source);

            try {
                logger.log('Copying schema from source DB...');

                if (options.language) {
                    logger.log(
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

                logger.log('Done.');
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
    const logger = log.getLogger();
    const parser = new DOMParser();
    globalThis.DOMParser = DOMParser as any;
    globalThis.Element = Element as any;
    globalThis.Node = Node as any;

    const db = await database.getDbFromDir(process.cwd());
    try {
        const files = await readdir(dir);
        const translationDirs = files.map((f) => path.resolve(dir, f));
        logger.log(`Importing ${translationDirs.length} translations`);
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
    const logger = log.getLogger();
    const parser = new DOMParser();
    globalThis.DOMParser = DOMParser as any;
    globalThis.Element = Element as any;
    globalThis.Node = Node as any;

    const db = await database.getDbFromDir(process.cwd());
    try {
        const files = await readdir(dir);
        const commentaryDirs = files.map((f) => path.resolve(dir, f));
        logger.log(`Importing ${commentaryDirs.length} commentaries`);
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
    const logger = log.getLogger();
    const translationsSet = new Set(translations);
    const client = new BibleClient({
        remember_fetches: false,
    });

    const collection = await client.fetch_collection();
    const collectionTranslations = collection.get_translations();

    logger.log(`Discovered ${collectionTranslations.length} translations`);

    const filtered =
        translations && translations.length <= 0
            ? collectionTranslations
            : collectionTranslations.filter((t) => translationsSet.has(t.id));

    let batches: GetTranslationsItem[][] = [];
    while (filtered.length > 0) {
        batches.push(filtered.splice(0, 10));
    }

    logger.log(
        `Downloading ${filtered.length} translations in ${batches.length} batches`
    );

    for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        logger.log(`Downloading batch ${i + 1} of ${batches.length}`);
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

        logger.log(`Writing batch ${i + 1} of ${batches.length}`);
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
    const logger = log.getLogger();
    for (let translation of translations) {
        const [translationId, reader] = translation.split('/');
        const generator =
            KNOWN_AUDIO_TRANSLATIONS.get(translationId)?.get(reader);

        if (!generator) {
            logger.warn('Unknown translation:', translation);
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
 * Instructions for manual USFM to USX3 conversion using BibleMultiConverter
 */
export const CONVERSION_INSTRUCTIONS = {
    downloadUrl: 'https://github.com/schierlm/BibleMultiConverter/releases',
    javaRequirement: 'Java 8 or higher required',

    getConversionCommand: (
        inputDir: string,
        outputDir: string,
        filenamePattern: string = '*.usx'
    ) => {
        return `java -jar BibleMultiConverter.jar ParatextConverter USFM "${inputDir}" USX3 "${outputDir}" "${filenamePattern}"`;
    },

    examples: {
        windows:
            'java -jar BibleMultiConverter.jar ParatextConverter USFM "C:\\input\\usfm" USX3 "C:\\output\\usx3" "*.usx"',
        unix: 'java -jar BibleMultiConverter.jar ParatextConverter USFM "/path/to/input/usfm" USX3 "/path/to/output/usx3" "*.usx"',
    },
};

/**
 * Prints conversion instructions for the user
 */
export function printConversionInstructions(): void {
    const logger = log.getLogger();
    logger.log('\n=== MANUAL CONVERSION REQUIRED ===');
    logger.log('Automatic conversion is not available.');
    logger.log('');
    logger.log('To enable automatic conversion, please:');
    logger.log('1. Download BibleMultiConverter.zip from:');
    logger.log(`   ${CONVERSION_INSTRUCTIONS.downloadUrl}`);
    logger.log('');
    logger.log('2. Extract the zip file to one of these locations:');
    logger.log('   • Current directory (./BibleMultiConverter/)');
    logger.log('   • Tools subdirectory (./tools/BibleMultiConverter/)');
    logger.log('   • Parent directory (../BibleMultiConverter/)');
    logger.log(
        '   • Or extract anywhere and provide the JAR path when prompted'
    );
    logger.log('');
    logger.log('3. Ensure Java 8+ is installed');
    logger.log('');
    logger.log('4. Re-run this command with the --convertToUsx3 option');
    logger.log('');
    logger.log(
        'Note: USFM files have been downloaded but conversion was skipped.'
    );
    logger.log('==========================================\n');
}

/**
 * Helper function to check if a translation ID matches a source
 */
function matchesTranslation(
    translationQuery: string,
    source: EBibleSource
): boolean {
    const lowerQuery = translationQuery.toLowerCase();
    const lowerSourceId = source.id.toLowerCase();
    const lowerTranslationId = source.translationId.toLowerCase();

    const exactMatch =
        translationQuery === source.translationId ||
        translationQuery === source.id;
    const caseInsensitiveMatch =
        lowerQuery === lowerTranslationId || lowerQuery === lowerSourceId;
    const partialMatch =
        lowerSourceId.includes(lowerQuery) ||
        lowerTranslationId.includes(lowerQuery);

    return exactMatch || caseInsensitiveMatch || partialMatch;
}

/**
 * Groups sources by which translation query they match
 */
function groupSourcesByTranslation(
    sources: EBibleSource[],
    translationQueries: string[]
): Map<string, EBibleSource[]> {
    const groups = new Map<string, EBibleSource[]>();

    for (const query of translationQueries) {
        const matchingSources = sources.filter((source) =>
            matchesTranslation(query, source)
        );
        if (matchingSources.length > 0) {
            groups.set(query, matchingSources);
        }
    }

    return groups;
}

/**
 * Handles source selection for a single translation query
 */
async function selectSourcesForTranslation(
    translationQuery: string,
    sources: EBibleSource[]
): Promise<EBibleSource[]> {
    const logger = log.getLogger();
    if (sources.length === 0) {
        logger.log(`No sources found for translation: ${translationQuery}`);
        return [];
    }

    if (sources.length === 1) {
        logger.log(
            `Found 1 source for '${translationQuery}': ${sources[0].id} -> ${sources[0].translationId} | ${sources[0].title}`
        );
        logger.log(`Automatically selecting: ${sources[0].id}`);
        return sources;
    }

    // Multiple sources found - prompt user
    logger.log(`\nFound ${sources.length} sources for '${translationQuery}':`);
    sources.forEach((source, index) => {
        logger.log(
            `  ${index + 1}. ${source.id} -> ${source.translationId} | ${source.title} | ${source.languageCode}`
        );
    });

    const SELECT_ALL_VALUE = -1;
    const choices = [
        ...sources.map((source, index) => ({
            name: `${source.id} -> ${source.translationId} | ${source.title} | ${source.languageCode}`,
            value: index,
            checked: false,
        })),
        { name: 'Select All', value: SELECT_ALL_VALUE, checked: false },
    ];

    const selectedIndices: number[] = await checkbox({
        message: `Select sources for '${translationQuery}' (use space to select, enter to confirm):`,
        choices: choices,
        validate: (choices: readonly { value: number }[]) => {
            if (choices.length === 0) {
                return 'Please select at least one source or "Select All"';
            }
            return true;
        },
    });

    // Handle selection
    if (selectedIndices.includes(SELECT_ALL_VALUE)) {
        logger.log(
            `Selected all ${sources.length} sources for '${translationQuery}'.`
        );
        return sources;
    } else {
        const selectedSources = selectedIndices
            .filter((index: number) => index !== SELECT_ALL_VALUE)
            .map((index: number) => sources[index]);
        logger.log(
            `Selected ${selectedSources.length} sources for '${translationQuery}'.`
        );
        return selectedSources;
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
    const logger = log.getLogger();
    const {
        convertToUsx3 = false,
        useDatabase = true, // Default to true
        bibleMultiConverterPath,
        overwrite = false,
    } = options;

    logger.log('Fetching eBible metadata...');
    const ebibleSources = await fetchEBibleMetadata();
    logger.log(`Total eBible sources found: ${ebibleSources.length}`);

    logger.log('');
    if (useDatabase) {
        logger.log('DATABASE TRACKING: ENABLED');
        logger.log('   • Will check existing downloads in database');
        logger.log('   • Will skip already downloaded sources');
        logger.log('   • Will update database with download information');
    } else {
        logger.log('DATABASE TRACKING: DISABLED');
        logger.log('   • All matching sources will be processed');
        logger.log('   • No database filtering or updates will be performed');
        logger.log('   • Downloads may overwrite existing files');
    }
    logger.log('');

    // Basic source validation and translation matching
    let filteredSources = ebibleSources.filter((source) => {
        if (!source.FCBHID) {
            return false;
        }
        // If translations are specified, must match at least one
        if (
            translations &&
            !translations.some((t) => matchesTranslation(t, source))
        ) {
            return false;
        }

        return true;
    });

    let db: any = null;
    let sourceExists: any = null;
    let sourceUpsert: any = null;
    let skippedByDatabase = 0;

    // Database-based filtering (if database is enabled)
    if (useDatabase) {
        logger.log('Connecting to database for download tracking...');
        db = await database.getDbFromDir(process.cwd());
        sourceExists = db.prepare(
            'SELECT usfmZipEtag, usfmDownloadDate FROM EBibleSource WHERE id = @id AND sha256 = @sha256;'
        );

        filteredSources = filteredSources.filter((source) => {
            const existingSource = sourceExists.get(source) as {
                usfmZipEtag: string;
                usfmDownloadDate: string;
            };
            if (existingSource) {
                if (!existingSource.usfmDownloadDate) {
                    return true;
                }
                source.usfmZipEtag = existingSource.usfmZipEtag;
                source.usfmDownloadDate =
                    existingSource.usfmDownloadDate as any;

                // If specific translations were requested, include sources that match
                if (
                    translations &&
                    translations.some((t) => matchesTranslation(t, source))
                ) {
                    return true;
                }

                skippedByDatabase++;
                return false;
            }

            return true;
        });

        if (skippedByDatabase > 0) {
            logger.log(
                `Database filtering: Skipped ${skippedByDatabase} already downloaded sources`
            );
        } else {
            logger.log(
                'Database filtering: No sources were skipped (none previously downloaded)'
            );
        }

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
        logger.log('Database connection skipped (tracking disabled)');
    }

    logger.log(`Found ${filteredSources.length} sources to process`);

    // Handle source selection based on whether specific translations were requested
    let selectedSources: EBibleSource[] = [];

    if (translations && translations.length > 0) {
        const sourceGroups = groupSourcesByTranslation(
            filteredSources,
            translations
        );

        if (sourceGroups.size === 0) {
            logger.log(
                'No matching sources found for any of the specified translations.'
            );
            logger.log(
                'Tip: Use the "list-ebible-translations" command to find available translations.'
            );
            return;
        }

        logger.log(`Processing ${sourceGroups.size} translation(s)...\n`);

        for (const [translationQuery, sources] of sourceGroups) {
            const selected = await selectSourcesForTranslation(
                translationQuery,
                sources
            );
            selectedSources.push(...selected);
        }

        if (selectedSources.length === 0) {
            logger.log('No sources selected for download.');
            return;
        }

        logger.log(
            `\nTotal selected: ${selectedSources.length} sources from ${sourceGroups.size} translation(s).`
        );
    } else {
        // No specific translations requested - use all filtered sources
        selectedSources = filteredSources;
        if (selectedSources.length === 0) {
            logger.log('No sources found.');
            return;
        }
    }

    // Create a temporary directory for USFM downloads
    const tempDir = convertToUsx3
        ? path.join(
              tmpdir(),
              'ebible-usfm-temp',
              `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          )
        : null;

    try {
        let batches: EBibleSource[][] = [];
        const batchSize = 50;
        const sourcesToProcess = selectedSources;
        while (sourcesToProcess.length > 0) {
            batches.push(sourcesToProcess.splice(0, batchSize));
        }

        let numDownloaded = 0;
        let numErrored = 0;
        let numDatabaseUpdates = 0;
        let conversionsNeeded: Array<{
            tempPath: string;
            outputPath: string;
            source: EBibleSource;
        }> = [];

        for (let batch of batches) {
            await Promise.all(
                batch.map(async (source) => {
                    try {
                        logger.log(`Processing: ${source.translationId}`);

                        // Check if USFM zip file exists
                        const detailsPage = await fetch(
                            `https://ebible.org/Scriptures/details.php?id=${source.id}`
                        );
                        const detailsHtml = await detailsPage.text();
                        const hasUsfm = detailsHtml.includes(
                            `${source.id}_usfm.zip`
                        );

                        if (hasUsfm) {
                            const usfmZipUrl = `https://ebible.org/Scriptures/${source.id}_usfm.zip`;
                            source.usfmZipUrl = usfmZipUrl;

                            const usfmResult = await fetch(usfmZipUrl);

                            if (usfmResult.status === 404) {
                                source.usfmZipUrl = null;
                            } else if (usfmResult.status === 200) {
                                source.usfmZipEtag =
                                    usfmResult.headers.get('etag') || null;
                                const reader = new BlobReader(
                                    await usfmResult.blob()
                                );
                                const zip = new ZipReader(reader);

                                // Use temp directory for USFM files if converting, otherwise use final output directory
                                const downloadDir =
                                    convertToUsx3 && tempDir
                                        ? path.resolve(
                                              tempDir,
                                              source.translationId
                                          )
                                        : path.resolve(
                                              outputDir,
                                              source.translationId
                                          );

                                if (overwrite && existsSync(downloadDir)) {
                                    logger.log(
                                        `Overwriting existing directory: ${downloadDir}`
                                    );
                                    await rm(downloadDir, {
                                        recursive: true,
                                        force: true,
                                    });
                                }

                                await mkdir(downloadDir, { recursive: true });

                                try {
                                    const entries = await zip.getEntries();
                                    let usfmFileCount = 0;

                                    for (let entry of entries) {
                                        if (
                                            entry.getData &&
                                            entry.directory === false &&
                                            entry.filename.endsWith('.usfm')
                                        ) {
                                            const outputPath = path.resolve(
                                                downloadDir,
                                                entry.filename
                                            );

                                            if (
                                                !overwrite &&
                                                (await exists(outputPath))
                                            ) {
                                                logger.log(
                                                    `File already exists, skipping: ${entry.filename}`
                                                );
                                                continue;
                                            } else if (
                                                overwrite &&
                                                (await exists(outputPath))
                                            ) {
                                                logger.log(
                                                    `Overwriting existing file: ${entry.filename}`
                                                );
                                            }

                                            const blob = await entry.getData(
                                                new BlobWriter('text/plain'),
                                                {}
                                            );
                                            await writeFile(
                                                outputPath,
                                                new Uint8Array(
                                                    await blob.arrayBuffer()
                                                )
                                            );
                                            usfmFileCount++;
                                        }
                                    }

                                    if (
                                        convertToUsx3 &&
                                        usfmFileCount > 0 &&
                                        tempDir
                                    ) {
                                        // Track translations that need conversion
                                        const finalOutputPath = path.resolve(
                                            outputDir,
                                            source.translationId
                                        );
                                        conversionsNeeded.push({
                                            tempPath: downloadDir,
                                            outputPath: finalOutputPath,
                                            source: source,
                                        });

                                        // Create metadata in temp directory
                                        await createMetadataJson(
                                            downloadDir,
                                            source,
                                            overwrite
                                        );
                                    } else if (!convertToUsx3) {
                                        // If not converting, create metadata in final location - pass overwrite parameter
                                        await createMetadataJson(
                                            downloadDir,
                                            source,
                                            overwrite
                                        );
                                    }

                                    numDownloaded++;
                                    source.usfmDownloadDate =
                                        DateTime.utc().toISO() as any;
                                    source.usfmDownloadPath =
                                        convertToUsx3 && tempDir
                                            ? null
                                            : downloadDir;
                                } finally {
                                    zip.close();
                                }
                            } else {
                                numErrored += 1;
                            }
                        }

                        // Enhanced database logging
                        if (useDatabase && sourceUpsert) {
                            sourceUpsert.run(source);
                            numDatabaseUpdates++;
                            if (numDatabaseUpdates === 1) {
                                logger.log(
                                    'Updating database with download information...'
                                );
                            }
                        } else if (!useDatabase) {
                            logger.log(
                                `Skipping database update for ${source.translationId} (database tracking disabled)`
                            );
                        }
                    } catch (error) {
                        numErrored++;
                        logger.error(
                            `Error processing ${source.translationId}:`,
                            error
                        );
                    }
                })
            );
        }

        // Enhanced summary with database tracking info
        logger.log('');
        logger.log('DOWNLOAD SUMMARY:');
        logger.log(`   Downloaded: ${numDownloaded} sources`);
        logger.log(`   Errored: ${numErrored} sources`);
        if (useDatabase) {
            logger.log(`   Database updates: ${numDatabaseUpdates} records`);
            if (skippedByDatabase > 0) {
                logger.log(
                    `   Skipped (already in DB): ${skippedByDatabase} sources`
                );
            }
        } else {
            logger.log(`   Database updates: 0 (tracking disabled)`);
        }
        logger.log('');

        if (convertToUsx3 && conversionsNeeded.length > 0) {
            logger.log(
                `${conversionsNeeded.length} translations need conversion to USX3.`
            );

            // Try to find BibleMultiConverter.jar
            let jarPath = await findBibleMultiConverterJar(
                bibleMultiConverterPath
            );

            if (!jarPath) {
                jarPath = await promptForBibleMultiConverter();
            }

            if (jarPath) {
                logger.log(`Starting automatic conversion using: ${jarPath}`);

                for (const {
                    tempPath,
                    outputPath,
                    source,
                } of conversionsNeeded) {
                    const translationName = path.basename(tempPath);

                    logger.log(`Converting ${translationName}...`);
                    const success = await convertUsfmToUsx3(
                        tempPath,
                        outputPath,
                        jarPath,
                        overwrite
                    );

                    if (success) {
                        // Copy metadata.json to final output directory
                        const metadataSource = path.join(
                            tempPath,
                            'metadata.json'
                        );
                        const metadataTarget = path.join(
                            outputPath,
                            'metadata.json'
                        );
                        if (existsSync(metadataSource)) {
                            // Handle overwrite for metadata file
                            if (overwrite && existsSync(metadataTarget)) {
                                logger.log(
                                    `Overwriting metadata.json in ${outputPath}`
                                );
                                await copyFile(metadataSource, metadataTarget);
                            } else if (!existsSync(metadataTarget)) {
                                await copyFile(metadataSource, metadataTarget);
                                logger.log(
                                    `Created metadata.json in ${outputPath}`
                                );
                            } else {
                                logger.log(
                                    `Metadata file already exists, skipping: ${metadataTarget}`
                                );
                            }
                        }

                        // Update database with final path (with enhanced logging)
                        if (useDatabase && sourceUpsert) {
                            source.usfmDownloadPath = outputPath;
                            sourceUpsert.run(source);
                            logger.log(
                                `Updated database with final path for ${source.translationId}`
                            );
                        } else if (!useDatabase) {
                            logger.log(
                                `Skipping database update for converted ${source.translationId} (database tracking disabled)`
                            );
                        }
                    }
                }

                // Clean up temp directory
                if (tempDir && existsSync(tempDir)) {
                    logger.log(`Cleaning up temporary directory: ${tempDir}`);
                    await rm(tempDir, { recursive: true, force: true });
                }
            } else {
                // Manual conversion instructions (fallback) with cleanup
                logger.log('Automatic conversion not available.');

                // Show simplified instructions
                printConversionInstructions();

                // Copy USFM files to final output directory
                logger.log(
                    '\nCopying USFM files to output directory for later processing...'
                );
                for (const {
                    tempPath,
                    outputPath,
                    source,
                } of conversionsNeeded) {
                    const translationName = path.basename(tempPath);
                    logger.log(
                        `Copying ${translationName} to ${outputPath}...`
                    );

                    // Ensure output directory exists
                    await mkdir(outputPath, { recursive: true });

                    // Copy all USFM files
                    const files = await readdir(tempPath);
                    for (const file of files) {
                        const sourcePath = path.join(tempPath, file);
                        const targetPath = path.join(outputPath, file);

                        if (
                            await access(sourcePath)
                                .then(() => true)
                                .catch(() => false)
                        ) {
                            if (overwrite && existsSync(targetPath)) {
                                logger.log(
                                    `Overwriting existing file: ${file}`
                                );
                            } else if (!overwrite && existsSync(targetPath)) {
                                logger.log(
                                    `File already exists, skipping: ${file}`
                                );
                                continue;
                            }
                            await copyFile(sourcePath, targetPath);
                        }
                    }

                    // Update database with final path for USFM files
                    if (useDatabase && sourceUpsert) {
                        source.usfmDownloadPath = outputPath;
                        sourceUpsert.run(source);
                        logger.log(
                            `Updated database with USFM path for ${source.translationId}`
                        );
                    }
                }

                // Clean up temp directory
                if (tempDir && existsSync(tempDir)) {
                    logger.log(`\nCleaning up temporary directory: ${tempDir}`);
                    await rm(tempDir, { recursive: true, force: true });
                    logger.log(
                        'Temporary files have been cleaned up to save disk space.'
                    );
                }

                logger.log(
                    '\nUSFM files are now available in the output directory.'
                );
                logger.log(
                    'Install BibleMultiConverter.jar and re-run with --convertToUsx3 to convert them automatically.'
                );
            }
        }
    } finally {
        if (db) {
            logger.log('Closing database connection...');
            db.close();
        }
    }
}

export async function listEBibleTranslations(
    searchTerm?: string
): Promise<void> {
    const logger = log.getLogger();
    logger.log('Fetching eBible translation list...');
    const ebibleSources = await fetchEBibleMetadata();

    let filteredSources = ebibleSources;

    if (searchTerm) {
        const search = searchTerm.toLowerCase();
        filteredSources = ebibleSources.filter(
            (source) =>
                source.id.toLowerCase().includes(search) ||
                source.translationId.toLowerCase().includes(search) ||
                source.title.toLowerCase().includes(search) ||
                source.languageCode.toLowerCase().includes(search)
        );
        logger.log(
            `Found ${filteredSources.length} translations matching "${searchTerm}":`
        );
    } else {
        logger.log(
            `All ${filteredSources.length} available eBible translations:`
        );
    }

    logger.log('Format: [ID] -> [TranslationID] | [Title] | [Language]');
    logger.log('─'.repeat(80));

    filteredSources.forEach((source) => {
        logger.log(
            `${source.id} -> ${source.translationId} | ${source.title} | ${source.languageCode}`
        );
    });

    if (searchTerm && filteredSources.length === 0) {
        logger.log('No translations found. Try a different search term.');
        logger.log(
            'Tip: Try searching for language codes like "en", "es", "fr", etc.'
        );
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
    const logger = log.getLogger();
    const parser = new DOMParser();
    globalThis.DOMParser = DOMParser as any;
    globalThis.Element = Element as any;
    globalThis.Node = Node as any;

    const files = await loadTranslationFilesOrAskForMetadata(
        path.resolve(input)
    );
    if (!files) {
        logger.log('No translation files found.');
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

    /**
     * The metadata that should be used for the translation.
     */
    translationMetadata?: InputTranslationMetadata;

    /**
     * The map of book IDs to common names.
     */
    bookNameMap?: Map<string, { commonName: string }>;
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

    const dataset = generateDataset(files, parser as any, options.bookNameMap);
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
    const logger = log.getLogger();
    const parser = new DOMParser();
    globalThis.DOMParser = DOMParser as any;
    globalThis.Element = Element as any;
    globalThis.Node = Node as any;

    const inputPath = path.resolve(input);
    const files = await loadTranslationFilesOrAskForMetadata(
        inputPath,
        options.translationMetadata
    );

    if (!files || files.length <= 0) {
        logger.log('No translation files found.');
        return;
    }

    const hash = hashInputFiles(files);
    const dataset = generateDataset(files, parser as any, options.bookNameMap);
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

async function loadTranslationFilesOrAskForMetadata(
    dir: string,
    translationMetadata?: InputTranslationMetadata
) {
    const logger = log.getLogger();
    let files = await loadTranslationFiles(dir, translationMetadata);

    if (!files) {
        logger.log(`No metadata found for the translation in ${dir}`);

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
