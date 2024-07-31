import { PrismaClient, Prisma } from "@prisma/client";
import { OutputFile, OutputFileContent, TranslationBookChapter } from "./generation/common-types";
import { DatasetOutput, DatasetTranslation, DatasetTranslationBook } from "./generation/dataset";
import { generateApiForDataset, GenerateApiOptions, generateFilesForApi } from "./generation/api";
import { merge, mergeWith } from "lodash";
import { extname } from "path";
import { Readable } from "stream";
import { sha256 } from "hash.js";
import { fromByteArray } from "base64-js";

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
 * @param translationsPerBatch The number of translations to load per batch.
 * @param translationsToLoad The list of translations to load. If not provided, all translations will be loaded.
 */
export async function *loadDatasets(db: PrismaClient, translationsPerBatch: number = 50, translationsToLoad?: string[]): AsyncGenerator<DatasetOutput> {
    let offset = 0;
    let pageSize = translationsPerBatch;

    console.log('Generating API files in batches of', pageSize);
    const totalTranslations = await db.translation.count();
    const totalBatches = Math.ceil(totalTranslations / pageSize);
    let batchNumber = 1;

    while(true) {
        console.log('Generating API batch', batchNumber, 'of', totalBatches);
        batchNumber++;

        const query: Prisma.TranslationFindManyArgs  = {
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
                        {number: 'asc'},
                        {reader: 'asc'}
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

/**
 * Generates and serializes the API files for the dataset that is stored in the database.
 * Yields each batch of serialized files.
 * @param db The database that the dataset should be loaded from.
 * @param options The options to use for generating the API.
 * @param translationsPerBatch The number of translations that should be loaded and written per batch.
 * @param translations The list of translations that should be loaded. If not provided, all translations will be loaded.
 */
export async function *serializeFilesForDataset(db: PrismaClient, options: GenerateApiOptions, translationsPerBatch: number = 50, translations?: string[]): AsyncGenerator<SerializedFile[]> {
    const mergableFiles = new Map<string, OutputFile[]>();

    for await(let dataset of loadDatasets(db, translationsPerBatch, translations)) {
        const api = generateApiForDataset(dataset, options);
        const files = generateFilesForApi(api);

        console.log('Generated', files.length, 'files');

        let serializedFiles: SerializedFile[] = [];
        for (let file of files) {
            if (file.mergable) {
                let arr = mergableFiles.get(file.path);
                if (!arr) {
                    arr = [];
                    mergableFiles.set(file.path, arr);
                }
                arr.push(file);
                continue;
            }

            const serialized = await transformFile(file.path, file.content);
            if (serialized) {
                serializedFiles.push(serialized);
            }
        }

        yield serializedFiles;
    }

    let serializedFiles: SerializedFile[] = [];
    for (let [path, files] of mergableFiles) {
        let content: object = {};
        for(let file of files) {
            if (!content) {
                content = file.content;
            } else {
                content = mergeWith(content, file.content, (objValue, srcValue) => {
                    if (Array.isArray(objValue)) {
                        return objValue.concat(srcValue);
                    }
                    return undefined;
                });
            }
        }

        if (content) {
            const serialized = await transformFile(path, content);
            if (serialized) {
                serializedFiles.push(serialized);
            }
        }
    }

    yield serializedFiles;

    async function transformFile(path: string, content: OutputFile['content']): Promise<SerializedFile | null> {
        let fileContent: OutputFileContent;
        if (typeof content === 'function') {
            fileContent = await content();
        } else {
            fileContent = content;
        }

        const ext = extname(path);
        if (ext === '.json') {
            let json: string;
            if (fileContent instanceof ReadableStream) {
                json = '';
                for await (const chunk of Readable.fromWeb(fileContent as any, {
                    encoding: 'utf-8'
                })) {
                    json += chunk;
                }
            } else {
                json = JSON.stringify(content, null, 2);
            }

            return {
                path,
                content: json,
                sha256: () => fromByteArray(new Uint8Array(sha256().update(json).digest()))
            };
        } else if (ext === '.mp3') {
            if (fileContent instanceof ReadableStream) {
                return {
                    path,
                    content: Readable.fromWeb(fileContent as any),
                };
            } else {
                console.warn('Expected content to be a readable stream for', path);
                console.warn('Skipping file');
                return null;
            }
        }

        console.warn('Unknown file type', path);
        console.warn('Skipping file');
        return null;
    }
}

/**
 * Defines an interface that contains information about a serialized file.
 */
export interface Uploader {

    /**
     * Gets the ideal batch size for the uploader.
     * Null if the uploader does not need batching.
     */
    idealBatchSize: number | null;

    /**
     * Uploads the given file.
     * @param file The file to upload.
     * @param overwrite Whether the file should be overwritten if it already exists.
     * @returns True if the file was uploaded. False if the file was skipped due to already existing.
     */
    upload(file: SerializedFile, overwrite: boolean): Promise<boolean>;

    /**
     * Disposes resources that the uploader uses.
     */
    dispose?(): Promise<void>;
}