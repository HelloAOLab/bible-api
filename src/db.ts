import { PrismaClient } from "@prisma/client";
import { TranslationBookChapter } from "./generation/common-types";
import { DatasetOutput, DatasetTranslation, DatasetTranslationBook } from "./generation/dataset";

/**
 * Loads the datasets from the database in a series of batches.
 * @param db The database.
 * @param translationsPerBatch The number of translations to load per batch.
 */
export async function *loadDatasets(db: PrismaClient, translationsPerBatch: number = 50): AsyncGenerator<DatasetOutput> {
    let offset = 0;
    let pageSize = translationsPerBatch;

    console.log('Generating API files in batches of', pageSize);

    while(true) {
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