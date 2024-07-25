import { Command } from 'commander';
import path, { dirname, extname, resolve } from 'path';
import {mkdir, open, readdir, readFile, writeFile} from 'fs/promises';
import Sql, { Database } from 'better-sqlite3';
import { randomUUID } from 'crypto';
import { FilesUploader, loadTranslationFiles, ZipUploader } from './files';
import { DOMWindow, JSDOM } from 'jsdom';
import { BibleClient } from '@gracious.tech/fetch-client';
import { GetTranslationsItem } from '@gracious.tech/fetch-client/dist/esm/collection';
import { getFirstNonEmpty, getTranslationId, normalizeLanguage } from './utils';
import { createWriteStream, exists } from 'fs-extra';
import { ChapterVerse, InputFile, InputTranslationMetadata, OutputFile, TranslationBookChapter } from './generation/common-types';
import { DatasetOutput, DatasetTranslation, DatasetTranslationBook, generateDataset } from './generation/dataset';
import { PrismaClient } from '@prisma/client';
import { generateApiForDataset, generateFilesForApi } from './generation/api';
import { loadDatasets, serializeFilesForDataset, Uploader } from './db';
import { merge } from 'lodash';
import { S3Client } from '@aws-sdk/client-s3';
import { parseS3Url, S3Uploader } from './s3';
import { bookChapterCountMap } from './generation/book-order';
import { Readable } from 'stream';
import { finished } from 'stream/promises';
import { DOMParser, Element, Node } from 'linkedom';
// import { ReadableStream } from 'stream/web';
import { KNOWN_AUDIO_TRANSLATIONS } from './generation/audio';
import { sha256 } from 'hash.js';

const migrationsPath = path.resolve(__dirname, './migrations');

async function start() {
    // @ts-ignore
    // const Conf = await import('conf');

    const parser = new DOMParser();
    globalThis.DOMParser = DOMParser as any;
    globalThis.Element = Element as any;
    globalThis.Node = Node as any;

    const program = new Command();

    program.name('bible-api')
        .description('A CLI for managing a Bible API.')
        .version('0.0.1');

    program.command('init [dir]')
        .description('Initialize a new Bible API DB.')
        .action(async (dir: string) => {
            console.log('Initializing new Bible API DB...');
            const db = await getDbFromDir(dir);
            db.close();
        });

    program.command('import-translation <dir> [dirs...]')
        .description('Imports a translation from the given directory into the database.')
        .option('--overwrite', 'Whether to overwrite existing files.')
        .action(async (dir: string, dirs: string[], options: any) => {
            const db = await getDbFromDir(process.cwd());
            try {
                await importTranslations(db, [dir, ...dirs], parser, !!options.overwrite);
            } finally {
                db.close();
            }
        });
    
    program.command('import-translations <dir>')
        .description('Imports all translations from the given directory into the database.')
        .option('--overwrite', 'Whether to overwrite existing files.')
        .action(async (dir: string, options: any) => {
            const db = await getDbFromDir(process.cwd());
            try {
                const files = await readdir(dir);
                const translationDirs = files.map(f => path.resolve(dir, f));
                console.log(`Importing ${translationDirs.length} translations`);
                await importTranslations(db, translationDirs, parser, !!options.overwrite);
            } finally {
                db.close();
            }
        });

    program.command('generate-api-files <dir>')
        .description('Generates API files from the database.')
        .option('--batch-size <size>', 'The number of translations to generate API files for in each batch.', '50')
        .option('--translations <translations...>', 'The translations to generate API files for.')
        .option('--overwrite', 'Whether to overwrite existing files.')
        .option('--overwrite-common-files', 'Whether to overwrite only common files.')
        .option('--file-pattern <pattern>', 'The file pattern regex that should be used to filter the files that are uploaded.')
        .option('--use-common-name', 'Whether to use the common name for the book chapter API link. If false, then book IDs are used.')
        .option('--generate-audio-files', 'Whether to replace the audio URLs in the dataset with ones that are hosted locally.')
        .option('--profile <profile>', 'The AWS profile to use for uploading to S3.')
        .action(async (dir: string, options: any) => {
            await uploadApiFiles(dir, options);
        });

    program.command('upload-api-files')
        .argument('<dest>', 'The destination to upload the API files to.')
        .description('Uploads API files to the specified destination. For S3, use the format s3://bucket-name/path/to/folder.')
        .option('--batch-size <size>', 'The number of translations to generate API files for in each batch.', '50')
        .option('--translations <translations...>', 'The translations to generate API files for.')
        .option('--overwrite', 'Whether to overwrite existing files.')
        .option('--overwrite-common-files', 'Whether to overwrite only common files.')
        .option('--file-pattern <pattern>', 'The file pattern regex that should be used to filter the files that are uploaded.')
        .option('--use-common-name', 'Whether to use the common name for the book chapter API link. If false, then book IDs are used.')
        .option('--generate-audio-files', 'Whether to replace the audio URLs in the dataset with ones that are hosted locally.')
        .option('--profile <profile>', 'The AWS profile to use for uploading to S3.')
        .action(async (dest: string, options: any) => {
            await uploadApiFiles(dest, options);
        });

    program.command('fetch-translations <dir> [translations...]')
        .description('Fetches the specified translations from fetch.bible and places them in the given directory.')
        .option('-a, --all', 'Fetch all translations. If omitted, only undownloaded translations will be fetched.')
        .action(async (dir: string, translations: string[], options: any) => {
            const translationsSet = new Set(translations);
            const client = new BibleClient({
                remember_fetches: false,
            });

            const collection = await client.fetch_collection();
            const collectionTranslations = collection.get_translations();

            console.log(`Discovered ${collectionTranslations.length} translations`);

            const filtered = translations.length <= 0 ? collectionTranslations : collectionTranslations.filter(t => translationsSet.has(t.id));

            let batches: GetTranslationsItem[][] = [];
            while (filtered.length > 0) {
                batches.push(filtered.splice(0, 10));
            }

            console.log(`Downloading ${filtered.length} translations in ${batches.length} batches`);

            for (let i = 0; i < batches.length; i++) {
                const batch = batches[i];
                console.log(`Downloading batch ${i + 1} of ${batches.length}`);
                const translations = await Promise.all(batch.map(async t => {
                    const id = getTranslationId(t);
                    const translation: InputTranslationMetadata = {
                        id,
                        name: getFirstNonEmpty(t.name_local, t.name_english, t.name_abbrev),
                        direction: getFirstNonEmpty(t.direction, 'ltr'),
                        englishName: getFirstNonEmpty(t.name_english, t.name_abbrev, t.name_local),
                        language: normalizeLanguage(t.language),
                        licenseUrl: t.attribution_url,
                        shortName: getFirstNonEmpty(t.name_abbrev, id),
                        website: t.attribution_url,
                    };

                    const books = await Promise.all(collection.get_books(t.id).map(async b => {
                        const name = `${b.id}.usx`;
                        if (!options.all && await exists(path.resolve(dir, translation.id, name))) {
                            return null;
                        }

                        const content = await collection.fetch_book(t.id, b.id, 'usx');

                        const contentString = content.get_whole();
                        const file: InputFile = {
                            fileType: 'usx',
                            content: contentString,
                            metadata: {
                                translation
                            },
                            name,
                        };

                        return file;
                    }));

                    return {
                        translation,
                        books,
                    };
                }));

                console.log(`Writing batch ${i + 1} of ${batches.length}`);
                let promises: Promise<void>[] = [];
                for(let { translation, books } of translations) {
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

                    const translationPath = path.resolve(dir, translation.id, 'metadata.json');
                    await mkdir(path.dirname(translationPath), { recursive: true });
                    const translationData = JSON.stringify(translation, null, 2);
                    promises.push(writeFile(translationPath, translationData));
                }

                await Promise.all(promises);
            }
        });

    program.command('fetch-audio <dir> [translations...]')
        .description('Fetches the specified audio translations and places them in the given directory.\nTranslations should be in the format "translationId/audioId". e.g. "BSB/gilbert"')
        .option('-a, --all', 'Fetch all translations. If omitted, only undownloaded translations will be fetched.')
        .action(async (dir: string, translations: string[], options: any) => {
            for (let translation of translations) {
                const [translationId, reader] = translation.split('/');
                const generator = KNOWN_AUDIO_TRANSLATIONS.get(translationId)?.get(reader);

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
                        const fullPath = path.resolve(dir, 'audio', translationId, bookId, name);

                        if (!options.all && await exists(fullPath)) {
                            continue;
                        }

                        await downloadFile(url, fullPath);
                    }
                }
            }
        });

    program.command('fetch-bible-metadata <dir>')
        .description('Fetches the Theographic bible metadata and places it in the given directory.')
        .action(async (dir: string) => {
            let files = [
                'books.json',
                'chapters.json',
                'easton.json',
                'events.json',
                'people.json',
                'peopleGroups.json',
                'periods.json',
                'places.json',
                'verses.json',
            ];

            await mkdir(dir, { recursive: true });

            let promises = files.map(async file => {
                const url = `https://raw.githubusercontent.com/robertrouse/theographic-bible-metadata/master/json/${file}`;
                const fullPath = path.resolve(dir, file);
                await downloadFile(url, fullPath);
            });

            await Promise.all(promises);
        });

    await program.parseAsync(process.argv);
}

start();


interface UploadApiOptions {
    /**
     * The number of files to upload in each batch.
     */
    batchSize: string;

    /**
     * Whether to overwrite existing files.
     */
    overwrite?: boolean;

    /**
     * Whether to only overwrite common files.
     * "Common files" are files that are similar between translations, like the books.json endpoint, or individual chapter endpoints.
     */
    overwriteCommonFiles?: boolean;

    /**
     * The file pattern regex that should be used to filter the files that are uploaded.
     */
    filePattern?: string;

    /**
     * The translations to generate API files for.
     */
    translations?: string[];

    /**
     * The AWS profile to use for uploading to S3.
     */
    profile?: string;

    /**
     * Whether to generate API files that use the common name instead of book IDs.
     */
    useCommonName?: boolean;

    /**
     * Whether to generate audio files for the API.
     */
    generateAudioFiles?: boolean;
}

/**
 * Loads and generates the API files and uploads them to the specified destination.
 * @param dest The destination to upload the API files to. Supported destinations are S3, zip files, and local directories.
 * @param options The options to use for the upload.
 */
async function uploadApiFiles(dest: string, options: UploadApiOptions) {
    const db = getPrismaDbFromDir(process.cwd());
    try {
        const overwrite = !!options.overwrite;
        if (overwrite) {
            console.log('Overwriting existing files');
        }

        const overwriteCommonFiles = !!options.overwriteCommonFiles;
        if (overwriteCommonFiles) {
            console.log('Overwriting only common files');
        }

        let filePattern: RegExp | undefined;
        if (!!options.filePattern) {
            filePattern = new RegExp(options.filePattern, 'g');
            console.log('Using file pattern:', filePattern);
        }

        if (options.translations) {
            console.log('Generating for specific translations:', options.translations);
        } else {
            console.log('Generating for all translations');
        }

        let uploader: Uploader;
        if (dest.startsWith('s3://')) {
            console.log('Uploading to S3');
            // Upload to S3
            const url = dest;
            const s3Url = parseS3Url(url);
            if (!s3Url) {
                throw new Error(`Invalid S3 URL: ${url}`);
            }

            if (!s3Url.bucketName) {
                throw new Error(`Invalid S3 URL: ${url}\nUnable to determine bucket name`);
            }
            
            uploader = new S3Uploader(s3Url.bucketName, s3Url.objectKey, options.profile ?? null);
        } else if (extname(dest) === '.zip') {
            console.log('Writing to zip file:', dest);
            uploader = new ZipUploader(dest);
        } else if (dest) {
            console.log('Writing to local directory:', dest);
            uploader = new FilesUploader(dest);
        } else {
            console.error('Unsupported destination:', dest);
            process.exit(1);
        }

        try {
            let pageSize = parseInt(options.batchSize);

            for await(let files of serializeFilesForDataset(db, {
                useCommonName: !!options.useCommonName,
                generateAudioFiles: !!options.generateAudioFiles
            }, pageSize, options.translations)) {

                const batchSize = uploader.idealBatchSize ?? files.length;
                const totalBatches = Math.ceil(files.length / batchSize);
                console.log('Uploading', files.length, 'total files');
                console.log('Uploading in batches of', batchSize);

                let offset = 0;
                let batchNumber = 1;
                let batch = files.slice(offset, offset + batchSize);

                while (batch.length > 0) {
                    console.log('Uploading batch', batchNumber, 'of', totalBatches);
                    let writtenFiles = 0;
                    const promises = batch.map(async file => {
                        if (filePattern) {
                            if (!filePattern.test(file.path)) {
                                console.log('Skipping file:', file.path);
                                return;
                            }
                        }

                        const isAvailableTranslations = file.path.endsWith('available_translations.json');
                        const isCommonFile = !isAvailableTranslations;
                        if (await uploader.upload(file, overwrite || (overwriteCommonFiles && isCommonFile))) {
                            writtenFiles++;
                        } else {
                            console.warn('File already exists:', file.path);
                            console.warn('Skipping file');
                        }

                        if (file.content instanceof Readable) {
                            file.content.destroy();
                        }
                    });

                    await Promise.all(promises);

                    console.log('Wrote', writtenFiles, 'files');
                    batchNumber++;
                    offset += batchSize;
                    batch = files.slice(offset, offset + batchSize);
                }
            }
        } finally {
            if (uploader && uploader.dispose) {
                await uploader.dispose();
            }
        }
    } finally {
        db.$disconnect();
    }
}

/**
 * Imports the translations from the given directories into the database.
 * @param db The database to import the translations into.
 * @param dirs The directories to import the translations from.
 * @param parser The DOM parser that should be used for USX files.
 * @param overwrite Whether to force a reload of the translations.
 */
async function importTranslations(db: Database, dirs: string[], parser: DOMParser, overwrite: boolean) {
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
async function importTranslationBatch(db: Database, dirs: string[], parser: DOMParser, overwrite: boolean) {
    const promises = [] as Promise<InputFile[]>[];
    for(let dir of dirs) {
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
async function importTranslationFileBatch(db: Database, files: InputFile[], parser: DOMParser, overwrite: boolean) {

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
function getChangedOrNewInputFiles(db: Database, files: InputFile[]): InputFile[] {
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

function insertFileMetadata(db: Database, files: InputFile[]) {
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
        for(let file of files) {
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

function insertTranslations(db: Database, translations: DatasetTranslation[]) {
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
        for(let translation of translations) {
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

    for(let translation of translations) {
        insertTranslationBooks(db, translation, translation.books);
    }
}

function insertTranslationBooks(db: Database, translation: DatasetTranslation, translationBooks: DatasetTranslationBook[]) {
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
        for(let book of books) {
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

function insertTranslationContent(db: Database, translation: DatasetTranslation, book: DatasetTranslationBook, chapters: TranslationBookChapter[]) {
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
        
                    for(let footnote of footnotes.values()) {
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

            for(let chapter of chapters) {
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
                for(let chapter of chapters) {
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
            for(let book of books) {
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
        for(let translation of translations) {
            updateTranslationHash.run({
                sha256: (translation as any).sha256,
                translationId: translation.id
            });
        }
    });

    updateTranslations();

    console.log(`Updated.`);
}

async function downloadFile(url: string, path: string) {
    console.log('Downloading', url, 'to', path);
    const reader = await fetch(url).then(r => r.body!);
    const writeStream = createWriteStream(path);
    await finished(Readable.fromWeb(reader as any).pipe(writeStream))
}

function getDbPath(dir: string) {
    dir = dir || process.cwd();
    return path.resolve(dir, 'bible-api.db');
}

function getPrismaDbFromDir(dir: string) {
    const dbPath = getDbPath(dir);
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: `file:${dbPath}`,
            }
        }
    });
    return prisma;
}

async function getDbFromDir(dir: string) {
    const dbPath = getDbPath(dir);

    const db = await getDb(dbPath);
    return db;
}

async function getDb(dbPath: string) {
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
    const appliedMigrations = db.prepare('SELECT * FROM _prisma_migrations;').all() as Migration[];

    let missingMigrations = [];
    for (let migration of migrations) {
        if(appliedMigrations.some(m => m.migration_name === migration)) {
            continue;
        }
        if (path.extname(migration) !== '') {
            continue;
        }
        missingMigrations.push(migration);
    }

    const insertMigrationStatement = db.prepare('INSERT INTO _prisma_migrations (id, checksum, started_at, finished_at, migration_name, applied_steps_count, logs, rolled_back_at) VALUES (?, ?, ?, ?, ?, ?, NULL, NULL);');

    for(let missingMigration of missingMigrations) {
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


function makeRelative(path: string) {
    if (path.startsWith('/')) {
        return `.${path}`;
    }
    return path;
}
