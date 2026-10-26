import path from 'node:path';
import { tmpdir } from 'node:os';
import {
    existsSync,
    mkdirSync,
    mkdtempSync,
    readFileSync,
    rmSync,
    utimesSync,
    writeFileSync,
} from 'node:fs';
import { log } from '@helloao/tools';
import { getDb, upsertChapterAudioTiming } from './db';
import {
    createIdFilter,
    LoadedSyncConfig,
    SyncOptions,
    syncWithConfig,
} from './sync';
import { CodeHashes } from './processor';

const silentLogger = {
    log: () => {},
    warn: () => {},
    error: () => {},
};

const codeHashes: CodeHashes = {
    dataset: 'dataset-1',
    theographic: 'theographic-1',
    interlinear: 'interlinear-1',
    api: 'api-1',
};

function usfm(bookId: string, chapters: string[][]): string {
    let content = `\\id ${bookId}\n\\h ${bookId}\n\\toc1 ${bookId}\n\\mt1 ${bookId}\n`;
    chapters.forEach((verses, i) => {
        content += `\\c ${i + 1}\n\\p\n`;
        verses.forEach((verse, j) => {
            content += `\\v ${j + 1} ${verse}\n`;
        });
    });
    return content;
}

describe('sync', () => {
    let dir: string;
    let config: LoadedSyncConfig;
    let dbPath: string;
    let apiDir: string;

    function writeTranslation(
        name: string,
        id: string,
        books: Record<string, string>
    ) {
        const translationDir = path.resolve(dir, 'sources', name);
        mkdirSync(translationDir, { recursive: true });
        writeFileSync(
            path.resolve(translationDir, 'metadata.json'),
            JSON.stringify({
                id,
                name: `Translation ${id}`,
                englishName: `Translation ${id}`,
                shortName: id,
                language: 'eng',
                direction: 'ltr',
                licenseUrl: 'https://example.com/license',
                website: 'https://example.com',
            })
        );
        for (let [file, content] of Object.entries(books)) {
            writeFileSync(path.resolve(translationDir, file), content);
        }
        return translationDir;
    }

    function readApiFile(p: string) {
        return JSON.parse(readFileSync(path.resolve(apiDir, p), 'utf-8'));
    }

    function readVerses(p: string): string[] {
        return readApiFile(p)
            .chapter.content.filter((c: any) => c.type === 'verse')
            .map((v: any) => v.content.join(''));
    }

    async function runSync(options: SyncOptions = {}) {
        return await syncWithConfig(config, {
            codeHashes,
            ...options,
        });
    }

    async function query<T>(sql: string, ...params: any[]): Promise<T[]> {
        const db = await getDb(dbPath);
        try {
            return db.prepare(sql).all(...params) as T[];
        } finally {
            db.close();
        }
    }

    beforeEach(() => {
        log.setLogger(silentLogger);
        jest.spyOn(console, 'log').mockImplementation(() => {});

        dir = mkdtempSync(path.join(tmpdir(), 'helloao-sync-'));
        dbPath = path.resolve(dir, 'bible.db');
        apiDir = path.resolve(dir, 'api-out');

        writeTranslation('aaa', 'AAA', {
            'GEN.usfm': usfm('GEN', [['In the beginning.', 'And the earth.']]),
            'EXO.usfm': usfm('EXO', [['These are the names.']]),
        });
        writeTranslation('bbb', 'BBB', {
            'GEN.usfm': usfm('GEN', [['Au commencement.']]),
        });

        config = {
            baseDir: dir,
            db: 'bible.db',
            sources: [{ type: 'translations', path: 'sources' }],
            destinations: [
                {
                    url: 'api-out',
                    generateOpenApiDocument: false,
                    generateCompleteTranslationFiles: false,
                    generateSimpleChapterFiles: false,
                },
            ],
        };
    });

    afterEach(() => {
        log.setLogger(log.consoleLogger);
        jest.restoreAllMocks();
        rmSync(dir, { recursive: true, force: true });
    });

    it('should import and upload new sources', async () => {
        const result = await runSync();

        expect(result.errors).toEqual([]);
        expect(result.import!.imported).toEqual([
            'translation:sources/aaa',
            'translation:sources/bbb',
        ]);
        expect(result.uploads[0].uploaded).toHaveLength(2);

        const available = readApiFile('api/available_translations.json');
        expect(available.translations.map((t: any) => t.id)).toEqual([
            'AAA',
            'BBB',
        ]);
        expect(readVerses('api/AAA/GEN/1.json')).toEqual([
            'In the beginning.',
            'And the earth.',
        ]);
        expect(existsSync(path.resolve(apiDir, 'api/BBB/GEN/1.json'))).toBe(
            true
        );
    });

    it('should do nothing when nothing has changed', async () => {
        await runSync();
        const result = await runSync();

        expect(result.import!.plan.imports).toEqual([]);
        expect(result.import!.plan.unchanged).toBe(2);
        expect(result.uploads[0].uploaded).toEqual([]);
        expect(result.uploads[0].uploadedMergedFiles).toBe(false);
    });

    it('should not reimport sources whose files were touched but not changed', async () => {
        await runSync();

        const file = path.resolve(dir, 'sources', 'aaa', 'GEN.usfm');
        const future = new Date(Date.now() + 60_000);
        utimesSync(file, future, future);

        const result = await runSync();
        expect(result.import!.plan.imports).toEqual([]);
        expect(result.import!.plan.touched.map((s) => s.key)).toEqual([
            'translation:sources/aaa',
        ]);

        const second = await runSync();
        expect(second.import!.plan.touched).toEqual([]);
    });

    it('should only reimport and upload the sources that changed', async () => {
        await runSync();

        writeTranslation('aaa', 'AAA', {
            'GEN.usfm': usfm('GEN', [['In the beginning, God.', 'Earth.']]),
        });

        const result = await runSync();
        expect(
            result.import!.plan.imports.map((s) => [s.key, s.reason])
        ).toEqual([['translation:sources/aaa', 'changed']]);
        expect(result.uploads[0].uploaded).toEqual([
            { kind: 'translation', id: 'AAA' },
        ]);

        expect(readVerses('api/AAA/GEN/1.json')).toEqual([
            'In the beginning, God.',
            'Earth.',
        ]);
    });

    it('should reimport and reupload a source when only its metadata changes', async () => {
        await runSync();

        const metadataPath = path.resolve(
            dir,
            'sources',
            'bbb',
            'metadata.json'
        );
        const metadata = JSON.parse(readFileSync(metadataPath, 'utf-8'));
        writeFileSync(
            metadataPath,
            JSON.stringify({
                ...metadata,
                licenseUrl: 'https://example.com/new-license',
            })
        );

        const result = await runSync();
        expect(result.import!.imported).toEqual(['translation:sources/bbb']);
        expect(result.uploads[0].uploaded).toEqual([
            { kind: 'translation', id: 'BBB' },
        ]);
        expect(
            readApiFile('api/available_translations.json').translations.find(
                (t: any) => t.id === 'BBB'
            ).licenseUrl
        ).toBe('https://example.com/new-license');
    });

    it('should remove books that were deleted from a source from the database and the destination', async () => {
        await runSync();
        expect(existsSync(path.resolve(apiDir, 'api/AAA/EXO/1.json'))).toBe(
            true
        );

        rmSync(path.resolve(dir, 'sources', 'aaa', 'EXO.usfm'));
        const result = await runSync();

        expect(result.uploads[0].deletedFiles).toBeGreaterThan(0);
        expect(existsSync(path.resolve(apiDir, 'api/AAA/EXO'))).toBe(false);
        expect(existsSync(path.resolve(apiDir, 'api/AAA/GEN/1.json'))).toBe(
            true
        );
        expect(
            await query(
                "SELECT * FROM Chapter WHERE translationId = 'AAA' AND bookId = 'EXO';"
            )
        ).toEqual([]);
    });

    it('should remove deleted sources from the database and the destination', async () => {
        await runSync();

        rmSync(path.resolve(dir, 'sources', 'bbb'), { recursive: true });
        const result = await runSync();

        expect(result.import!.removed).toEqual(['translation:sources/bbb']);
        expect(result.uploads[0].removed).toEqual([
            { kind: 'translation', id: 'BBB' },
        ]);
        expect(
            await query("SELECT * FROM Translation WHERE id = 'BBB';")
        ).toEqual([]);
        expect(
            await query(
                "SELECT * FROM ChapterVerse WHERE translationId = 'BBB';"
            )
        ).toEqual([]);
        expect(existsSync(path.resolve(apiDir, 'api/BBB/GEN/1.json'))).toBe(
            false
        );
        expect(
            readApiFile('api/available_translations.json').translations.map(
                (t: any) => t.id
            )
        ).toEqual(['AAA']);
    });

    it('should never import or upload excluded sources', async () => {
        config.exclude = ['bbb'];
        const result = await runSync();

        expect(result.import!.imported).toEqual(['translation:sources/aaa']);
        expect(
            await query("SELECT * FROM Translation WHERE id = 'BBB';")
        ).toEqual([]);
        expect(existsSync(path.resolve(apiDir, 'api/BBB'))).toBe(false);
    });

    it('should remove sources that become excluded', async () => {
        await runSync();

        config.sources[0].exclude = ['BBB'];
        const result = await runSync();

        expect(result.import!.removed).toEqual(['translation:sources/bbb']);
        expect(
            await query("SELECT * FROM Translation WHERE id = 'BBB';")
        ).toEqual([]);
        expect(existsSync(path.resolve(apiDir, 'api/BBB/GEN/1.json'))).toBe(
            false
        );
    });

    it('should only import included sources', async () => {
        config.include = ['AAA'];
        const result = await runSync();

        expect(result.import!.imported).toEqual(['translation:sources/aaa']);
    });

    it('should reprocess every source when the processor changes', async () => {
        await runSync();

        const result = await runSync({
            skipUpload: true,
            codeHashes: { ...codeHashes, dataset: 'dataset-2' },
        });

        expect(result.import!.plan.processorChanged).toEqual(['translation']);
        expect(
            result.import!.plan.imports.map((s) => [s.key, s.reason])
        ).toEqual([
            ['translation:sources/aaa', 'processor'],
            ['translation:sources/bbb', 'processor'],
        ]);
    });

    it('should not reupload items whose content did not change after reprocessing', async () => {
        await runSync();

        const result = await runSync({
            codeHashes: { ...codeHashes, dataset: 'dataset-2' },
        });

        expect(result.import!.imported).toHaveLength(2);
        expect(result.uploads[0].uploaded).toEqual([]);
    });

    it('should not reprocess sources when processor changes are ignored', async () => {
        await runSync();

        const ignored = await runSync({
            skipUpload: true,
            ignoreProcessorChanges: true,
            codeHashes: { ...codeHashes, dataset: 'dataset-2' },
        });
        expect(ignored.import!.plan.imports).toEqual([]);

        // The sources keep their old processor version, so they are reprocessed later.
        const later = await runSync({
            skipUpload: true,
            codeHashes: { ...codeHashes, dataset: 'dataset-2' },
        });
        expect(later.import!.plan.imports).toHaveLength(2);
    });

    it('should reupload every item when the API generator changes', async () => {
        await runSync();

        const result = await runSync({
            codeHashes: { ...codeHashes, api: 'api-2' },
        });

        expect(result.import!.plan.imports).toEqual([]);
        expect(result.uploads[0].uploaded).toHaveLength(2);
    });

    it('should keep separately imported audio timings when a source is reimported', async () => {
        await runSync();

        const db = await getDb(dbPath);
        try {
            upsertChapterAudioTiming(db, 'AAA', 'GEN', 1, 'reader', [0, 5]);
        } finally {
            db.close();
        }

        writeTranslation('aaa', 'AAA', {
            'GEN.usfm': usfm('GEN', [['Changed.', 'Also changed.']]),
        });
        await runSync({ skipUpload: true });

        expect(
            await query(
                "SELECT reader, timingsJson FROM ChapterAudioTiming WHERE translationId = 'AAA';"
            )
        ).toEqual([{ reader: 'reader', timingsJson: '[0,5]' }]);
    });

    it('should report what would change without changing anything in a dry run', async () => {
        const result = await runSync({ dryRun: true });

        expect(result.import!.plan.imports).toHaveLength(2);
        expect(result.import!.imported).toEqual([]);
        expect(await query('SELECT * FROM Translation;')).toEqual([]);
        expect(existsSync(apiDir)).toBe(false);
    });

    it('should not import a source that produces an item that another source already provides', async () => {
        writeTranslation('copy', 'AAA', {
            'GEN.usfm': usfm('GEN', [['A copy.']]),
        });

        const result = await runSync({ skipUpload: true });

        expect(result.import!.imported).toEqual([
            'translation:sources/aaa',
            'translation:sources/bbb',
        ]);
        expect(result.errors).toEqual([
            expect.stringContaining('translation:sources/copy'),
        ]);
    });

    it('should fail when a configured source directory is missing', async () => {
        config.sources.push({ type: 'translations', path: 'missing' });

        await expect(runSync()).rejects.toThrow(/does not exist/);
    });

    it('should write every item to zip destinations', async () => {
        config.destinations = [
            { url: 'api.zip', generateOpenApiDocument: false },
        ];

        const first = await runSync();
        expect(first.uploads[0].uploaded).toHaveLength(2);
        expect(existsSync(path.resolve(dir, 'api.zip'))).toBe(true);

        const second = await runSync();
        expect(second.uploads[0].uploaded).toEqual([]);

        rmSync(path.resolve(dir, 'api.zip'));
        const recreated = await runSync();
        expect(recreated.uploads[0].uploaded).toHaveLength(2);
        expect(existsSync(path.resolve(dir, 'api.zip'))).toBe(true);

        writeTranslation('bbb', 'BBB', {
            'GEN.usfm': usfm('GEN', [['Changed.']]),
        });
        const third = await runSync();
        expect(third.uploads[0].uploaded).toHaveLength(2);
    });
});

describe('createIdFilter()', () => {
    it('should include everything when there are no patterns', () => {
        const filter = createIdFilter();
        expect(filter('BSB')).toBe(true);
    });

    it('should support wildcards and ignore case', () => {
        const filter = createIdFilter(['eng_*'], ['eng_kjv?']);
        expect(filter('ENG_WEB')).toBe(true);
        expect(filter('eng_kjv2')).toBe(false);
        expect(filter('fra_lsg')).toBe(false);
    });

    it('should include an item if any of its names match and exclude it if any of its names match', () => {
        const filter = createIdFilter(['bsb'], ['private']);
        expect(filter('BSB', 'bsb_usfm')).toBe(true);
        expect(filter('XYZ', 'bsb')).toBe(true);
        expect(filter('BSB', 'private')).toBe(false);
    });
});
