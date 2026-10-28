import { createHash } from 'node:crypto';
import {
    mkdir,
    mkdtemp,
    readFile,
    readdir,
    rm,
    writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import {
    convertOsisToUsfmFiles,
    fetchOsisTranslations,
    OsisTranslationSource,
} from './osis.js';

const book = (id: string) =>
    `<div type="book" osisID="${id}"><chapter osisID="${id}.1"><verse osisID="${id}.1.1">本文</verse></chapter></div>`;
const xml = (books: string) => `<osis><osisText>${books}</osisText></osis>`;

describe('convertOsisToUsfmFiles', () => {
    let dir: string;
    let source: string;
    let output: string;

    beforeEach(async () => {
        dir = await mkdtemp(path.join(tmpdir(), 'osis-to-usfm-'));
        source = path.join(dir, 'source.xml');
        output = path.join(dir, 'usfm');
        await writeFile(source, xml(book('Gen') + book('Exod')));
    });

    afterEach(async () => {
        await rm(dir, { recursive: true, force: true });
    });

    it('should write each book with a lowercase filename', async () => {
        await convertOsisToUsfmFiles(source, output);
        expect((await readdir(output)).sort()).toEqual([
            'exo.usfm',
            'gen.usfm',
        ]);
        expect(await readFile(path.join(output, 'gen.usfm'), 'utf-8')).toBe(
            '\\id GEN\n\\c 1\n\\v 1 本文\n'
        );
    });

    it('should refuse overwrite before writing any other book', async () => {
        await convertOsisToUsfmFiles(source, output);
        await rm(path.join(output, 'gen.usfm'));
        await writeFile(path.join(output, 'exo.usfm'), 'existing');
        await expect(convertOsisToUsfmFiles(source, output)).rejects.toThrow(
            /File already exists:.*exo.usfm.*--overwrite/
        );
        expect(await readdir(output)).toEqual(['exo.usfm']);
        expect(await readFile(path.join(output, 'exo.usfm'), 'utf-8')).toBe(
            'existing'
        );
    });

    it('should replace existing files with overwrite enabled', async () => {
        await convertOsisToUsfmFiles(source, output);
        await writeFile(path.join(output, 'gen.usfm'), 'existing');
        await convertOsisToUsfmFiles(source, output, { overwrite: true });
        expect(
            await readFile(path.join(output, 'gen.usfm'), 'utf-8')
        ).toContain('\\v 1 本文');
    });

    it.each([book('Gen') + book('Unknown'), book('Gen') + book('Gen'), ''])(
        'should write nothing when conversion fails: %s',
        async (books) => {
            await writeFile(source, xml(books));
            await expect(
                convertOsisToUsfmFiles(source, output)
            ).rejects.toThrow();
            expect(await readdir(dir)).toEqual(['source.xml']);
        }
    );
});

describe('fetchOsisTranslations', () => {
    const originalFetch = global.fetch;
    const content = xml(book('Gen') + book('Exod'));
    const source: OsisTranslationSource = {
        url: 'https://example.com/test.osis.xml',
        sha256: createHash('sha256').update(content).digest('hex'),
        metadata: {
            id: 'test_osis',
            name: 'テスト',
            englishName: 'Test',
            shortName: 'TST',
            language: 'jpn',
            direction: 'ltr',
            website: 'https://example.com',
            licenseUrl: 'https://example.com',
        },
    };
    let dir: string;

    function mockDownload(body: string, ok = true) {
        global.fetch = jest.fn().mockResolvedValue({
            ok,
            status: ok ? 200 : 404,
            statusText: ok ? 'OK' : 'Not Found',
            arrayBuffer: async () => new TextEncoder().encode(body).buffer,
        });
    }

    beforeEach(async () => {
        dir = await mkdtemp(path.join(tmpdir(), 'fetch-osis-'));
    });

    afterEach(async () => {
        global.fetch = originalFetch;
        await rm(dir, { recursive: true, force: true });
    });

    it('should write the USFM books and metadata into a directory named after the translation', async () => {
        mockDownload(content);
        await fetchOsisTranslations(dir, [source]);
        expect(await readdir(dir)).toEqual(['test_osis']);
        expect((await readdir(path.join(dir, 'test_osis'))).sort()).toEqual([
            'exo.usfm',
            'gen.usfm',
            'metadata.json',
            'osis.txt',
        ]);
        expect(
            JSON.parse(
                await readFile(
                    path.join(dir, 'test_osis', 'metadata.json'),
                    'utf-8'
                )
            )
        ).toEqual(source.metadata);
    });

    it('should replace a previously fetched translation', async () => {
        await mkdir(path.join(dir, 'test_osis'));
        await writeFile(path.join(dir, 'test_osis', 'old.usfm'), 'old');
        mockDownload(content);
        await fetchOsisTranslations(dir, [source]);
        expect(await readdir(path.join(dir, 'test_osis'))).not.toContain(
            'old.usfm'
        );
    });

    it('should return the IDs of the downloaded translations', async () => {
        mockDownload(content);
        expect(await fetchOsisTranslations(dir, [source])).toEqual([
            'test_osis',
        ]);
    });

    it('should skip unchanged translations when skipUnchanged is set', async () => {
        mockDownload(content);
        await fetchOsisTranslations(dir, [source]);
        await writeFile(path.join(dir, 'test_osis', 'gen.usfm'), 'existing');

        expect(
            await fetchOsisTranslations(dir, [source], { skipUnchanged: true })
        ).toEqual([]);
        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(
            await readFile(path.join(dir, 'test_osis', 'gen.usfm'), 'utf-8')
        ).toBe('existing');
    });

    it('should re-fetch a translation when its source or metadata changes', async () => {
        mockDownload(content);
        await fetchOsisTranslations(dir, [source]);

        const renamed = {
            ...source,
            metadata: { ...source.metadata, name: '新しい' },
        };
        expect(
            await fetchOsisTranslations(dir, [renamed], {
                skipUnchanged: true,
            })
        ).toEqual(['test_osis']);

        const moved = { ...renamed, url: 'https://example.com/moved.xml' };
        expect(
            await fetchOsisTranslations(dir, [moved], { skipUnchanged: true })
        ).toEqual(['test_osis']);
        expect(global.fetch).toHaveBeenCalledTimes(3);
    });

    it('should fail and write nothing when the hash does not match', async () => {
        mockDownload(content + ' ');
        await expect(fetchOsisTranslations(dir, [source])).rejects.toThrow(
            /SHA-256 .* expected/
        );
        expect(await readdir(dir)).toEqual([]);
    });

    it('should fail and keep the previous translation when the download fails', async () => {
        await mkdir(path.join(dir, 'test_osis'));
        await writeFile(path.join(dir, 'test_osis', 'gen.usfm'), 'existing');
        mockDownload('', false);
        await expect(fetchOsisTranslations(dir, [source])).rejects.toThrow(
            /Failed to download .*404/
        );
        expect(
            await readFile(path.join(dir, 'test_osis', 'gen.usfm'), 'utf-8')
        ).toBe('existing');
    });
});
