import { existsSync, read } from 'fs-extra';
import { readdir, readFile, mkdir, writeFile } from 'fs-extra';
import * as path from 'path';
import { extname } from 'path';
import { AvailableTranslations, ChapterVerse, generate, InputFile, InputTranslationMetadata, jsonFile, OutputFile, ParseTreeMetadata } from './usfm-parser/generator';
import Sql, { Database } from 'better-sqlite3';

const bibleDirectory = path.resolve(__dirname, '..', 'bible');
const extraDirectory = process.argv[2] ? path.resolve(__dirname, '..', process.argv[2]) : null;
const outputDirectory = path.resolve(__dirname, '..', 'build');
const databasePath = path.resolve(outputDirectory, 'bible.db');

async function start() {
    const db = new Sql(databasePath, {});
    
    try {
        const directories = [
            ...await listTranslations(bibleDirectory),
            ...(extraDirectory ? await listTranslations(extraDirectory) : [])
        ];

        if (directories.length <= 0) {
            console.error('No translations found!');
            return;
        }

        let batches = [] as TranslationPath[][];
        // split directories into batches of 10
        while (directories.length > 0) {
            batches.push(directories.splice(0, 10));
        }

        const availableTranslations: AvailableTranslations = {
            translations: []
        };
        // process each batch
        console.log('Processing', batches.length, 'batches of translations');
        for (let i = 0; i < batches.length; i++) {
            const batch = batches[i];
            console.log(`Processing batch ${i + 1} of ${batches.length}`);
            await processTranslations(batch, availableTranslations, db);
        }

        const availableTranslationsFile = jsonFile('/api/available_translations.json', availableTranslations);
        await writeOutputFile(outputDirectory, availableTranslationsFile);

        console.log('Done!');
    } finally {
        db.close();
    }
}

/**
 * Processes a batch of translations
 * @param translations The paths to the translations
 */
async function processTranslations(translations: TranslationPath[], availableTranslations: AvailableTranslations, db: Database): Promise<void> {
    const promises = [] as Promise<InputFile[]>[];

    for(let {translation, directory} of translations) {
        if (translation.startsWith('.')) {
            // Skip directories that start with a dot
            continue;
        }
        const translationPath = path.resolve(directory, translation);
        console.log('translation', translationPath);
        promises.push(loadTranslation(translationPath));
    }

    const allFiles = await Promise.all(promises);

    const files = allFiles.flatMap(f => f);

    const output = generate(files, availableTranslations);

    await mkdir(outputDirectory, {
        recursive: true,
    });

    let writePromises = [] as Promise<void>[];

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

    insertManyTranslations(availableTranslations.translations);

    // for(let translation of availableTranslations.translations) {
    //     await db.translation.upsert({
    //         where: {
    //             id: translation.id
    //         },
    //         create: {
    //             id: translation.id,
    //             name: translation.name,
    //             language: translation.language,
    //             shortName: translation.shortName,
    //             textDirection: translation.textDirection,
    //             licenseUrl: translation.licenseUrl,
    //             website: translation.website,
    //             englishName: translation.englishName,
    //         },
    //         update: {
    //             name: translation.name,
    //             language: translation.language,
    //             shortName: translation.shortName,
    //             textDirection: translation.textDirection,
    //             licenseUrl: translation.licenseUrl,
    //             website: translation.website,
    //             englishName: translation.englishName,
    //         },
    //     });
    // }

    const bookUpsert = db.prepare(`INSERT INTO Book(
        id,
        translationId,
        title,
        name,
        commonName,
        numberOfChapters
    ) VALUES (
        @id,
        @translationId,
        @title,
        @name,
        @commonName,
        @numberOfChapters
    ) ON CONFLICT(id,translationId) DO 
        UPDATE SET
            title=excluded.title,
            name=excluded.name,
            commonName=excluded.commonName,
            numberOfChapters=excluded.numberOfChapters;`);

    for(let books of output.filter(o => o.books).map(o => o.books)) {
        const insertMany = db.transaction((books) => {
            for(let book of books!.books) {
                bookUpsert.run({
                    id: book.id,
                    translationId: books!.translation.id,
                    title: book.title,
                    name: book.name,
                    commonName: book.commonName,
                    numberOfChapters: book.numberOfChapters,
                });
            }
        });

        insertMany(books);
    }

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
                        let text = '';
                        for (let c of verse.content) {
                            if (typeof c === 'string') {
                                text += c;
                            } else if (typeof c === 'object') {
                                if ('lineBreak' in c) {
                                    text += '\n';
                                } else if ('text' in c) {
                                    text += c.text;
                                } else if ('noteId' in c) {
                                    const note = footnotes.get(c.noteId);
                                    if (note) {
                                        note.verseNumber = verse.number;
                                    }
                                }
                            }
                        }

                        if (!verse.number) {
                            console.error('Verse missing number', file.chapter.translation.id, file.chapter.book.id, file.chapter.chapter.number, verse.number, text);
                        }
    
                        verses.push({
                            number: verse.number,
                            text: text,
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

    // for (let file of output) {
    //     writePromises.push(writeOutputFile(outputDirectory, file));
    // }

    // await Promise.all(writePromises);
}

export async function writeOutputFile(outputDirectory:string, file: OutputFile): Promise<void> {
    const finalPath = path.resolve(outputDirectory, file.path[0] === "/" ? file.path.slice(1) : file.path);

    const dir = path.dirname(finalPath);

    await mkdir(dir, {
        recursive: true
    })

    await writeFile(finalPath, JSON.stringify(file.content));
}

/**
 * Gets the list of directories that should be checked for translations
 * @param directory The directory to check.
 */
async function listTranslations(directory: string): Promise<TranslationPath[]> {
    const paths = await readdir(directory);
    return paths.map(p => ({
        directory: directory,
        translation: p,
    }));
}

async function loadTranslation(translation: string): Promise<InputFile[]> {
    const metadata: InputTranslationMetadata | null = await loadTranslationMetadata(translation);

    if (!metadata) {
        console.error('Could not load metadata for translation!', translation);
        return [];
    }

    let files = await readdir(translation);
    let usfmFiles = files.filter(f => extname(f) === '.usfm');

    if (usfmFiles.length <= 0) {
        translation = path.resolve(translation, 'usfm');
        if (existsSync(translation)) {
            files = await readdir(translation);
            usfmFiles = files.filter(f => extname(f) === '.usfm');
        }
    }

    if (usfmFiles.length <= 0) {
        console.error('Could not find USFM files for translation!', translation);
        return [];
    }

    let promises = [] as Promise<InputFile>[];
    for (let file of usfmFiles) {
        if (file === 'metadata.ts') {
            continue;
        }
        const filePath = path.resolve(translation, file);
        promises.push(loadFile(filePath, {
            translation: metadata
        }));
    }

    return await Promise.all(promises);
}

async function loadTranslationMetadata(translation: string): Promise<InputTranslationMetadata | null> {
    const metadataTs = path.resolve(translation, 'metadata.ts');
    if (existsSync(metadataTs)) {
        return (await import(metadataTs)).default as InputTranslationMetadata;
    } else {
        const metadataJson = path.resolve(translation, 'meta.json');
        if (existsSync(metadataJson)) {
            const data = await readFile(metadataJson, { encoding: 'utf-8' });
            const metadata = JSON.parse(data) as CollectionTranslationMetadata;

            return {
                id: metadata.id ?? metadata.source.id,
                language: metadata.language,
                name: metadata.name.local,
                englishName: metadata.name.english,
                licenseUrl: metadata.copyright.attribution_url,
                website: metadata.copyright.attribution_url,
                shortName: metadata.name.abbrev,
                direction: metadata.direction
            };
        }
    }
    console.error('Could not find metadata for translation!', translation);
    return null;
}

async function loadFile(file: string, metadata: ParseTreeMetadata): Promise<InputFile> {
    const extension = path.extname(file);

    const content = await readFile(file, {
        encoding: 'utf-8'
    });

    return {
        content,
        metadata: metadata,
        name: file,
        fileType: extension.slice(1) as 'usfm',
    }
}

start();

interface CollectionTranslationMetadata {
    name: {
        local: string;
        abbrev: string;
        english: string;
    },
    language: string;
    year: number;
    direction: 'ltr' | 'rtl';
    copyright: {
        licenses: any[];
        attribution: string;
        attribution_url: string;
    },
    id: string | null;
    source: {
        id: string;
    }
}

interface LoadedTranslation {
    type: 'default' | 'imported';
    usfmDir: string;
    info: InputTranslationMetadata;
}

interface TranslationPath {
    translation: string;
    directory: string;
}