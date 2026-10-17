import Sql from 'better-sqlite3';
import { DOMParser, Element, Node } from 'linkedom';
import { mkdtempSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { generateDataset } from '@helloao/tools/generation/dataset.js';
import {
    getDb,
    getMigrationsPath,
    importDatasetOutput,
    loadDatasets,
} from './db.js';

jest.mock('./prisma-gen/client.js', () => ({
    PrismaClient: class {},
    Prisma: {},
}));

describe('paragraph database round trip', () => {
    it('resolves migrations from this module', async () => {
        await expect(getMigrationsPath()).resolves.toBe(
            path.resolve(__dirname, 'migrations')
        );
    });
    it('preserves fra_lsg-style paragraphs and writes inline paragraphs as newlines', async () => {
        globalThis.DOMParser = DOMParser as any;
        globalThis.Element = Element as any;
        globalThis.Node = Node as any;

        const directory = mkdtempSync(
            path.join(os.tmpdir(), 'bible-api-paragraph-')
        );
        const dbPath = path.join(directory, 'test.db');
        let db: Sql.Database | undefined;
        try {
            db = await getDb(dbPath);
            const output = generateDataset(
                [
                    {
                        fileType: 'usfm',
                        name: 'fra_lsg.usfm',
                        content:
                            '\\id GEN\n\\c 1\n\\p\n\\v 1 Au commencement\\p Dieu créa.',
                        metadata: {
                            id: 'fra_lsg',
                            name: 'Louis Segond',
                            englishName: 'Louis Segond',
                            shortName: 'LSG',
                            language: 'fra',
                            direction: 'ltr',
                            website: 'https://example.org',
                            licenseUrl: 'https://example.org/license',
                        },
                    },
                ],
                new DOMParser() as any
            );
            importDatasetOutput(db, output);

            const stored = db
                .prepare(
                    'SELECT text FROM ChapterVerse WHERE translationId = ? AND bookId = ? AND chapterNumber = ? AND number = ?'
                )
                .get('fra_lsg', 'GEN', 1, 1) as { text: string };
            expect(stored.text).toBe('Au commencement \nDieu créa.');

            const prisma = {
                translation: {
                    count: async () => 1,
                    findMany: async ({ skip = 0, take = 10 }: any) =>
                        db!
                            .prepare(
                                'SELECT * FROM Translation WHERE id = ? LIMIT ? OFFSET ?'
                            )
                            .all('fra_lsg', take, skip),
                },
                commentary: { count: async () => 0, findMany: async () => [] },
                dataset: { count: async () => 0, findMany: async () => [] },
                book: {
                    findMany: async () =>
                        db!
                            .prepare(
                                'SELECT * FROM Book WHERE translationId = ? ORDER BY "order"'
                            )
                            .all('fra_lsg'),
                },
                chapter: {
                    findMany: async ({ where }: any) =>
                        db!
                            .prepare(
                                'SELECT * FROM Chapter WHERE translationId = ? AND bookId = ? ORDER BY number'
                            )
                            .all('fra_lsg', where.bookId),
                },
                chapterAudioUrl: { findMany: async () => [] },
                chapterAudioTiming: { findMany: async () => [] },
                chapterWords: { findMany: async () => [] },
            };
            const [roundTripped] = await Array.fromAsync(
                loadDatasets(prisma as any, 10, ['fra_lsg'])
            );
            const chapter =
                roundTripped.translations[0].books[0].chapters[0].chapter;
            expect(chapter.content).toContainEqual({ type: 'line_break' });
            expect(chapter.content).toContainEqual({
                type: 'paragraph',
                style: 'p',
            });
            expect(
                chapter.content.find((item) => item.type === 'verse')
            ).toMatchObject({
                number: 1,
                content: expect.arrayContaining([
                    { lineBreak: true, paragraph: true, style: 'p' },
                ]),
            });
        } finally {
            db?.close();
            rmSync(directory, { recursive: true, force: true });
        }
    });
});
