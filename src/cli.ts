import { Command } from 'commander';
import path, { extname } from 'path';
import {mkdir, readdir, readFile, writeFile} from 'fs/promises';
import Sql, { Database } from 'better-sqlite3';
import { randomUUID } from 'crypto';
import { loadTranslationFiles } from './files';
import { DOMWindow, JSDOM } from 'jsdom';
import { BibleClient } from '@gracious.tech/fetch-client';
import { GetTranslationsItem } from '@gracious.tech/fetch-client/dist/esm/collection';
import { getFirstNonEmpty, getTranslationId, normalizeLanguage } from './utils';
import { exists } from 'fs-extra';
import { ChapterVerse, InputFile, InputTranslationMetadata, TranslationBookChapter } from './generation/common-types';
import { DatasetTranslation, DatasetTranslationBook, generateDataset } from './generation/dataset';

const migrationsPath = path.resolve(__dirname, './migrations');

async function start() {
    // @ts-ignore
    // const Conf = await import('conf');

    const { window } = new JSDOM();
    globalThis.DOMParser = window.DOMParser as any;
    globalThis.Element = window.Element;
    globalThis.Node = window.Node;

    const program = new Command();

    // const conf = new Conf({
    //     projectName: 'bible-api-cli'
    // });

    program.name('bible-api')
        .description('A CLI for managing a Bible API.')
        .version('0.0.1');
        // .option('--db <db>', 'The SQLite database file to use.');

    program.command('init [dir]')
        .description('Initialize a new Bible API DB.')
        .action(async (dir: string) => {
            console.log('Initializing new Bible API DB...');
            const db = await getDbFromDir(dir);
            db.close();
        });

    program.command('import-translation <dir> [dirs...]')
        .description('Imports a translation from the given directory into the database.')
        .action(async (dir: string, dirs: string[]) => {
            const db = await getDbFromDir(process.cwd());
            try {
                await importTranslations(db, [dir, ...dirs], window);
            } finally {
                db.close();
            }
        });
    
    program.command('import-translations <dir>')
        .description('Imports all translations from the given directory into the database.')
        .action(async (dir: string) => {
            const db = await getDbFromDir(process.cwd());
            try {
                const files = await readdir(dir);
                const translationDirs = files.map(f => path.resolve(dir, f));
                console.log(`Importing ${translationDirs.length} translations`);
                await importTranslations(db, translationDirs, window);
            } finally {
                db.close();
            }
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

    program.command('import-translations [translations...]')
        .description('Fetches and imports the specified translations from fetch.bible.')
        .action(async (translations: string[] ) => {
            const db = await getDbFromDir(process.cwd());
            try {
                const translationsSet = new Set(translations);
                const client = new BibleClient({
                    remember_fetches: false,
                });

                const collection = await client.fetch_collection();
                const collectionTranslations = collection.get_translations();

                console.log(`Discovered ${collectionTranslations.length} translations`);

                const filtered = translations.length <= 0 ? collectionTranslations : collectionTranslations.filter(t => translationsSet.has(t.id));

                let translationIDs = new Map<string, GetTranslationsItem>();
                for (let t of filtered) {
                    let id = getTranslationId(t);
                    if (translationIDs.has(id)) {
                        const existing = translationIDs.get(id);
                        console.warn(`Duplicate translation ID: ${id}: ${existing?.id} and ${t.id}`);
                        throw new Error(`Duplicate translation ID: ${id}: ${existing?.id} and ${t.id}`);
                    } else {
                        translationIDs.set(id, t);
                    }
                }

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
                            const content = await collection.fetch_book(t.id, b.id, 'usx');

                            const file: InputFile = {
                                fileType: 'usx',
                                content: content.get_whole(),
                                metadata: {
                                    translation
                                },
                                name: `${b.id}.usx`,
                            };

                            return file;
                        }));

                        return {
                            translation,
                            books,
                        };
                    }));

                    console.log(`Importing batch ${i + 1} of ${batches.length}`);
                    await importTranslationFileBatch(db, translations.map(t => t.books).flat(), window);

                    console.log(`Current memory usage: ${process.memoryUsage().heapUsed / 1024 / 1024} MB`);
                }
            } finally {
                db.close();
            }
        });

    await program.parseAsync(process.argv);
}

start();

async function importTranslations(db: Database, dirs: string[], window: DOMWindow) {
    let batches = [] as string[][];
    while (dirs.length > 0) {
        batches.push(dirs.splice(0, 10));
    }

    console.log('Processing', batches.length, 'batches of translations');
    for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        console.log(`Processing batch ${i + 1} of ${batches.length}`);
        await importTranslationBatch(db, batch, window);
    }
}

async function importTranslationBatch(db: Database, dirs: string[], window: DOMWindow) {
    const promises = [] as Promise<InputFile[]>[];
    for(let dir of dirs) {
        const fullPath = path.resolve(dir);
        promises.push(loadTranslationFiles(fullPath));
    }

    const allFiles = await Promise.all(promises);
    const files = allFiles.flat();
    await importTranslationFileBatch(db, files, window);
}

async function importTranslationFileBatch(db: Database, files: InputFile[], window: DOMWindow) {
    console.log('Generating output for', files.length, 'files');

    const output = generateDataset(files, window);

    console.log('Generated', output.translations, 'translations');

    insertTranslations(db, output.translations);

    console.log(`Inserted ${output.translations} translations into DB`);
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
                        translationId: translation.id as string,
                        bookId: book.id,
                        number: chapter.chapter.number,
                        json: JSON.stringify(chapter.chapter),
                    });
        
                    for (let verse of verses) {
                        verseUpsert.run({
                            translationId: translation.id as string,
                            bookId: book.id,
                            chapterNumber: chapter.chapter.number,
                            number: verse.number,
                            text: verse.text,
                            contentJson: verse.contentJson,
                        });
                    }
        
                    for(let footnote of footnotes.values()) {
                        footnoteUpsert.run({
                            translationId: translation.id as string,
                            bookId: book.id,
                            chapterNumber: chapter.chapter.number,
                            id: footnote.id,
                            verseNumber: footnote.verseNumber,
                            text: footnote.text,
                        });
                    }
                }
        });

        insertChaptersAndVerses();
}

async function getDbFromDir(dir: string) {
    dir = dir || process.cwd();
    const dbPath = path.resolve(dir, 'bible-api.db');

    const db = await getDb(dbPath);
    return db;
}

async function getDb(dbPath: string) {
    const db = new Sql(dbPath, {});

    db.exec(`CREATE TABLE IF NOT EXISTS _prisma_migrations (
        id TEXT PRIMARY KEY,
        checksum TEXT,
        started_at TEXT,
        finished_at TEXT,
        migration_name TEXT,
        applied_steps_count INTEGER
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

    const insertMigrationStatement = db.prepare('INSERT INTO _prisma_migrations (id, checksum, started_at, finished_at, migration_name, applied_steps_count) VALUES (?, ?, ?, ?, ?, ?);');

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
