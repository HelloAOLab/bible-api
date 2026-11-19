import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { Uint8ArrayReader, Uint8ArrayWriter, ZipWriter } from '@zip.js/zip.js';
import { sourceFetchBibleTranslations, sourceTranslations } from './actions.js';
import { convertUsfmToUsx3, USFM_PREPROCESSING_VERSION } from './conversion.js';
import { getDb } from './db.js';
import { FetchBibleCatalogEntry } from './fetch-bible.js';
import { EBibleSource, FetchBibleSource } from './prisma-gen/client.js';

jest.mock('./conversion.js', () => ({
    ...jest.requireActual('./conversion.js'),
    findBibleMultiConverterJar: jest.fn(async () => '/fake/converter.jar'),
    promptForBibleMultiConverter: jest.fn(async () => null),
    convertUsfmToUsx3: jest.fn(async () => true),
}));

const encoder = new TextEncoder();
const USFM = '\\id MAT\n\\c 1\n\\p\n\\v 1 Text.\n';

async function createZip(files: Record<string, string>): Promise<Uint8Array> {
    const writer = new Uint8ArrayWriter();
    const zip = new ZipWriter(writer);
    for (const [file, content] of Object.entries(files)) {
        await zip.add(file, new Uint8ArrayReader(encoder.encode(content)));
    }
    await zip.close();
    return await writer.getData();
}

function ebibleSource(): EBibleSource {
    return {
        id: 'engtest',
        translationId: 'eng_test',
        title: 'Test Bible',
        shortTitle: 'Test',
        textDirection: 'ltr',
        languageCode: 'eng',
        copyright: 'Public Domain',
        description: 'Test',
        oldTestamentBooks: 0,
        oldTestamentChapters: 0,
        oldTestamentVerses: 0,
        newTestamentBooks: 1,
        newTestamentChapters: 1,
        newTestamentVerses: 1,
        apocryphaBooks: 0,
        apocryphaChapters: 0,
        apocryphaVerses: 0,
        redistributable: 'TRUE' as any,
        FCBHID: 'ENGTST',
        sourceDate: '2024-01-01T00:00:00.000Z' as any,
        updateDate: '2024-01-01T00:00:00.000Z' as any,
        usfmDownloadDate: null,
        usfmDownloadPath: null,
        usfmZipUrl: null,
        usfmZipEtag: null,
        sha256: 'abc123',
        usfmPreprocessingVersion: null,
    };
}

function fetchBibleEntry(): FetchBibleCatalogEntry {
    const source: FetchBibleSource = {
        id: 'tst_test',
        translationId: 'tst_test',
        languageCode: 'tst',
        name: 'Test',
        englishName: 'Test',
        abbreviation: 'TST',
        textDirection: 'ltr',
        year: 2024,
        ebibleId: null,
        sourceService: 'manual',
        sourceFormat: 'usfm',
        sourceUpdated: null,
        sourceRevision: null,
        attribution: null,
        attributionUrl: null,
        gitCommitSha: null,
        gitTreeSha: 'tree',
        downloadDate: null,
        downloadPath: null,
        sha256: 'def456',
        usfmPreprocessingVersion: null,
    };
    return {
        source,
        item: {
            name: {
                local: 'Test',
                local_abbrev: '',
                english: 'Test',
                english_abbrev: 'TST',
            },
            year: 2024,
            books_ot: [],
            books_nt: ['mat'],
            direction: 'ltr',
            copyright: {
                licenses: [{ license: 'public', url: null }],
                attribution: '',
                attribution_url: '',
            },
            tags: [],
        } as any,
        meta: {} as any,
        books: ['mat'],
        collectionUrl: 'https://example.com/collection',
    };
}

describe('USFM preprocessing version tracking', () => {
    const originalFetch = global.fetch;
    let dir: string;
    let dbPath: string;
    let fetchedUrls: string[];

    beforeEach(async () => {
        dir = await mkdtemp(path.join(tmpdir(), 'source-preprocessing-'));
        dbPath = path.join(dir, 'bible-api.db');
        fetchedUrls = [];
        const zip = await createZip({ 'MAT.usfm': USFM });
        global.fetch = jest.fn(async (url: any) => {
            const u = String(url);
            fetchedUrls.push(u);
            if (u.includes('details.php')) {
                return new Response('engtest_usfm.zip');
            }
            if (u.endsWith('_usfm.zip')) {
                return new Response(zip);
            }
            return new Response(USFM);
        }) as any;
        (convertUsfmToUsx3 as jest.Mock).mockClear();
    });

    afterEach(async () => {
        global.fetch = originalFetch;
        await rm(dir, { recursive: true, force: true });
    });

    async function getVersion(table: string, id: string) {
        const db = await getDb(dbPath);
        try {
            return (
                db
                    .prepare(
                        `SELECT usfmPreprocessingVersion FROM ${table} WHERE id = ?;`
                    )
                    .get(id) as { usfmPreprocessingVersion: number | null }
            ).usfmPreprocessingVersion;
        } finally {
            db.close();
        }
    }

    async function setVersion(
        table: string,
        id: string,
        version: number | null
    ) {
        const db = await getDb(dbPath);
        try {
            db.prepare(
                `UPDATE ${table} SET usfmPreprocessingVersion = ? WHERE id = ?;`
            ).run(version, id);
        } finally {
            db.close();
        }
    }

    describe('sourceTranslations()', () => {
        const source = (o = {}) => [{ ...ebibleSource(), ...o }];
        const options = () => ({
            db: dbPath,
            convertToUsx3: true,
            sources: source(),
            ignorelist: [],
        });

        it('should record the preprocessing version and skip sources converted with it', async () => {
            const first = await sourceTranslations(
                path.join(dir, 'out'),
                undefined,
                options()
            );
            expect(first.downloaded).toEqual(['eng_test']);
            expect(await getVersion('EBibleSource', 'engtest')).toBe(
                USFM_PREPROCESSING_VERSION
            );

            fetchedUrls = [];
            const second = await sourceTranslations(
                path.join(dir, 'out'),
                undefined,
                options()
            );
            expect(second.downloaded).toEqual([]);
            expect(fetchedUrls).toEqual([]);
        });

        it('should download sources converted with an older preprocessing version again', async () => {
            await sourceTranslations(
                path.join(dir, 'out'),
                undefined,
                options()
            );
            await setVersion('EBibleSource', 'engtest', null);

            fetchedUrls = [];
            const result = await sourceTranslations(
                path.join(dir, 'out'),
                undefined,
                options()
            );
            expect(result.downloaded).toEqual(['eng_test']);
            expect(fetchedUrls.length).toBeGreaterThan(0);
            expect(await getVersion('EBibleSource', 'engtest')).toBe(
                USFM_PREPROCESSING_VERSION
            );
        });

        it('should not download unconverted sources again when not converting', async () => {
            const opts = { ...options(), convertToUsx3: false };
            await sourceTranslations(path.join(dir, 'out'), undefined, opts);
            expect(await getVersion('EBibleSource', 'engtest')).toBeNull();

            fetchedUrls = [];
            const result = await sourceTranslations(
                path.join(dir, 'out'),
                undefined,
                opts
            );
            expect(result.downloaded).toEqual([]);
            expect(fetchedUrls).toEqual([]);
        });
    });

    describe('sourceFetchBibleTranslations()', () => {
        const options = () => ({
            db: dbPath,
            convertToUsx3: true,
            includeEBible: true,
            catalog: [fetchBibleEntry()],
            ignorelist: [],
        });

        it('should record the preprocessing version and skip sources converted with it', async () => {
            const first = await sourceFetchBibleTranslations(
                path.join(dir, 'out'),
                undefined,
                options()
            );
            expect(first.downloaded).toEqual(['tst_test']);
            expect(await getVersion('FetchBibleSource', 'tst_test')).toBe(
                USFM_PREPROCESSING_VERSION
            );

            fetchedUrls = [];
            const second = await sourceFetchBibleTranslations(
                path.join(dir, 'out'),
                undefined,
                options()
            );
            expect(second.downloaded).toEqual([]);
            expect(fetchedUrls).toEqual([]);
        });

        it('should download sources converted with an older preprocessing version again', async () => {
            await sourceFetchBibleTranslations(
                path.join(dir, 'out'),
                undefined,
                options()
            );
            await setVersion('FetchBibleSource', 'tst_test', null);

            const result = await sourceFetchBibleTranslations(
                path.join(dir, 'out'),
                undefined,
                options()
            );
            expect(result.downloaded).toEqual(['tst_test']);
            expect(await getVersion('FetchBibleSource', 'tst_test')).toBe(
                USFM_PREPROCESSING_VERSION
            );
        });
    });
});
