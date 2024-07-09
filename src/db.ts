import { PrismaClient } from "@prisma/client";
import { OutputFile, TranslationBookChapter } from "./generation/common-types";
import { DatasetOutput, DatasetTranslation, DatasetTranslationBook } from "./generation/dataset";
import { generateApiForDataset, generateFilesForApi } from "./generation/api";
import { merge, mergeWith } from "lodash";
import { extname } from "path";

export interface SerializedFile {
    path: string;
    content: string;
}

/**
 * Loads the datasets from the database in a series of batches.
 * @param db The database.
 * @param translationsPerBatch The number of translations to load per batch.
 */
export async function *loadDatasets(db: PrismaClient, translationsPerBatch: number = 50): AsyncGenerator<DatasetOutput> {
    let offset = 0;
    let pageSize = translationsPerBatch;

    console.log('Generating API files in batches of', pageSize);
    const totalTranslations = await db.translation.count();
    const totalBatches = Math.ceil(totalTranslations / pageSize);
    let batchNumber = 1;

    while(true) {
        console.log('Generating API batch', batchNumber, 'of', totalBatches);
        batchNumber++;

        const translations = await db.translation.findMany({
            skip: offset,
            take: pageSize,
        });

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

                const bookChapters: TranslationBookChapter[] = chapters.map(chapter => {
                    return {
                        chapter: JSON.parse(chapter.json),
                    } as TranslationBookChapter;
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
 * @param useCommonName Whether links should use the common name for the book chapter API link. If false, then book IDs are used.
 * @param translationsPerBatch The number of translations that should be loaded and written per batch.
 */
export async function *serializeFilesForDataset(db: PrismaClient, useCommonName: boolean, translationsPerBatch: number = 50): AsyncGenerator<SerializedFile[]> {
    const mergableFiles = new Map<string, OutputFile[]>();

    for await(let dataset of loadDatasets(db, translationsPerBatch)) {
        const api = generateApiForDataset(dataset, useCommonName);
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

            const serialized = transformFile(file.path, file.content);
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
            const serialized = transformFile(path, content);
            if (serialized) {
                serializedFiles.push(serialized);
            }
        }
    }

    yield serializedFiles;

    function transformFile(path: string, content: object): SerializedFile | null {
        if (extname(path) === '.json') {
            const fileContent = JSON.stringify(content, null, 2);
            return {
                path,
                content: fileContent,
            };
        }

        console.warn('Unknown file type', path);
        console.warn('Skipping file');
        return null;
    }
}

export interface Uploader {

    /**
     * Gets the ideal batch size for the uploader.
     */
    idealBatchSize: number;

    /**
     * Uploads the given file.
     * @param file The file to upload.
     * @param overwrite Whether the file should be overwritten if it already exists.
     * @returns True if the file was uploaded. False if the file was skipped due to already existing.
     */
    upload(file: SerializedFile, overwrite: boolean): Promise<boolean>;
}