import { Command } from 'commander';
import path, { extname } from 'path';
import {readdir, readFile} from 'fs/promises';
import Sql, { Database } from 'better-sqlite3';
import { randomUUID } from 'crypto';
import { AvailableTranslations, ChapterVerse, generate, InputFile, InputTranslationMetadata, OutputFile, Translation, TranslationBooks } from './usfm-parser/generator';
import { loadTranslationFiles } from './files';

const migrationsPath = path.resolve(__dirname, './migrations');

async function start() {
    // @ts-ignore
    // const Conf = await import('conf');

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
                await importTranslations(db, [dir, ...dirs]);
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
                await importTranslations(db, translationDirs);
            } finally {
                db.close();
            }
        });

    await program.parseAsync(process.argv);

    // function getDbPath(db: string) {
    //     return db || conf.get('db');
    // }
    
    // function setDbPath(db: string) {
    //     conf.set('db', db);
    // }
}

start();

async function importTranslations(db: Database, dirs: string[]) {
    let batches = [] as string[][];
    while (dirs.length > 0) {
        batches.push(dirs.splice(0, 10));
    }

    console.log('Processing', batches.length, 'batches of translations');
    for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        console.log(`Processing batch ${i + 1} of ${batches.length}`);
        await importTranslationBatch(db, batch);
    }
}

async function importTranslationBatch(db: Database, dirs: string[]) {
    const promises = [] as Promise<InputFile[]>[];
    for(let dir of dirs) {
        const fullPath = path.resolve(dir);
        promises.push(loadTranslationFiles(fullPath));
    }

    const allFiles = await Promise.all(promises);
    const files = allFiles.flat();
    const availableTranslations: AvailableTranslations = {
        translations: []
    };

    const output = generate(files, availableTranslations);

    insertTranslations(db, availableTranslations.translations);
    const books = output.filter(o => o.books).map(o => o.books);
    insertTranslationBooks(db, books);
    insertTranslationContent(db, output);
}

function insertTranslations(db: Database, translations: Translation[]) {
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
}

function insertTranslationBooks(db: Database, translationBooks: (TranslationBooks | undefined)[]) {
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

    for(let books of translationBooks) {
        if (!books) {
            continue;
        }
        const insertMany = db.transaction((books: TranslationBooks) => {
            for(let book of books!.books) {
                bookUpsert.run({
                    id: book.id,
                    translationId: books!.translation.id,
                    title: book.title,
                    name: book.name,
                    commonName: book.commonName,
                    numberOfChapters: book.numberOfChapters,
                    bookOrder: book.order ?? 9999
                });
            }
        });

        insertMany(books);
    }
}

function insertTranslationContent(db: Database, output: OutputFile[]) {
    const chapterUpsert = db.prepare(`INSERT INTO Chapter(
        translationId,
        bookId,
        number,
        apiLink
    ) VALUES (
        @translationId,
        @bookId,
        @number,
        @apiLink
    ) ON CONFLICT(translationId,bookId,number) DO 
        UPDATE SET
            apiLink=excluded.apiLink;`);
    const verseUpsert = db.prepare(`INSERT INTO ChapterVerse(
        translationId,
        bookId,
        chapterNumber,
        number,
        text
    ) VALUES (
        @translationId,
        @bookId,
        @chapterNumber,
        @number,
        @text
    ) ON CONFLICT(translationId,bookId,chapterNumber,number) DO 
        UPDATE SET
            text=excluded.text;`);
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
            for (let file of output) {
                if (file.chapter) {
                    if (!file.chapter.chapter.number) {
                        console.error('Chapter missing number', file.chapter.translation.id, file.chapter.book.id, file.chapter.chapter.number);
                        continue;
                    }
    
                    let verses: {
                        number: number,
                        text: string,
                    }[] = [];
                    let footnotes: Map<number, {
                        id: number,
                        text: string,
                        verseNumber?: number,
                    }> = new Map();
        
                    for (let c of file.chapter.chapter.footnotes) {
                        footnotes.set(c.noteId, {
                            id: c.noteId,
                            text: c.text,
                        });
                    }
        
                    for (let c of file.chapter.chapter.content) {
                        if (c.type === 'verse') {
                            const verse: ChapterVerse = c;
                            if (!verse.number) {
                                console.error('Verse missing number', file.chapter.translation.id, file.chapter.book.id, file.chapter.chapter.number, verse.number);
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
        
                            verses.push({
                                number: verse.number,
                                text: text.trimEnd(),
                            });
                        }
                    }
        
                    chapterUpsert.run({
                        translationId: file.chapter.translation.id as string,
                        bookId: file.chapter.book.id,
                        number: file.chapter.chapter.number,
                        apiLink: file.path,
                    });
        
                    for (let verse of verses) {
                        verseUpsert.run({
                            translationId: file.chapter.translation.id as string,
                            bookId: file.chapter.book.id,
                            chapterNumber: file.chapter.chapter.number,
                            number: verse.number,
                            text: verse.text,
                        });
                    }
        
                    for(let footnote of footnotes.values()) {
                        footnoteUpsert.run({
                            translationId: file.chapter.translation.id as string,
                            bookId: file.chapter.book.id,
                            chapterNumber: file.chapter.chapter.number,
                            id: footnote.id,
                            verseNumber: footnote.verseNumber,
                            text: footnote.text,
                        });
                    }
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
