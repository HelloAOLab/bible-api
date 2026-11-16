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
import { Uint8ArrayReader, Uint8ArrayWriter, ZipWriter } from '@zip.js/zip.js';
import { BSB_METADATA, BSB_USFM_ZIP_URL, fetchBsbTranslation } from './bsb.js';
import { convertUsfmToUsx3 } from './conversion.js';

jest.mock('./conversion.js', () => ({
    findBibleMultiConverterJar: jest.fn(async () => '/fake/converter.jar'),
    promptForBibleMultiConverter: jest.fn(async () => null),
    convertUsfmToUsx3: jest.fn(),
}));

const encoder = new TextEncoder();

async function createZip(files: Record<string, string>): Promise<Uint8Array> {
    const writer = new Uint8ArrayWriter();
    const zip = new ZipWriter(writer);
    for (const [file, content] of Object.entries(files)) {
        await zip.add(file, new Uint8ArrayReader(encoder.encode(content)));
    }
    await zip.close();
    return await writer.getData();
}

describe('fetchBsbTranslation()', () => {
    const originalFetch = global.fetch;
    let dir: string;
    let zip: Uint8Array;

    beforeEach(async () => {
        dir = await mkdtemp(path.join(tmpdir(), 'bsb-'));
        zip = await createZip({
            'bsb_usfm/01GENBSB.SFM':
                '\\id GEN\n\\c 1\n\\v 1 In the beginning\n',
            'bsb_usfm/41MATBSB.usfm': '\\id MAT\n\\c 1\n\\v 1 This is\n',
            'bsb_usfm/readme.txt': 'not usfm',
        });
        global.fetch = jest.fn(async () => ({
            ok: true,
            status: 200,
            statusText: 'OK',
            arrayBuffer: async () => zip.slice().buffer,
        })) as any;
        (convertUsfmToUsx3 as jest.Mock).mockReset();
    });

    afterEach(async () => {
        global.fetch = originalFetch;
        await rm(dir, { recursive: true, force: true });
    });

    it('should extract the USFM files with metadata when not converting', async () => {
        expect(
            await fetchBsbTranslation(dir, {
                convertToUsx3: false,
                metadata: BSB_METADATA,
            })
        ).toBe(true);

        expect(global.fetch).toHaveBeenCalledWith(BSB_USFM_ZIP_URL);
        const translationDir = path.join(dir, 'BSB');
        expect((await readdir(translationDir)).sort()).toEqual([
            '01GENBSB.usfm',
            '41MATBSB.usfm',
            'bsb.txt',
            'metadata.json',
        ]);
        expect(
            await readFile(path.join(translationDir, '01GENBSB.usfm'), 'utf-8')
        ).toBe('\\id GEN\n\\c 1\n\\v 1 In the beginning\n');
        expect(
            JSON.parse(
                await readFile(
                    path.join(translationDir, 'metadata.json'),
                    'utf-8'
                )
            )
        ).toEqual(BSB_METADATA);
        expect(convertUsfmToUsx3).not.toHaveBeenCalled();
    });

    it('should convert the USFM files to USX3 with BibleMultiConverter', async () => {
        let inputFiles: string[] = [];
        (convertUsfmToUsx3 as jest.Mock).mockImplementation(
            async (input: string, output: string, jar: string) => {
                expect(jar).toBe('/fake/converter.jar');
                inputFiles = (await readdir(input)).sort();
                await mkdir(output, { recursive: true });
                await writeFile(path.join(output, 'GEN.usx'), '<usx/>');
                return true;
            }
        );

        await fetchBsbTranslation(dir, { metadata: BSB_METADATA });

        expect(inputFiles).toEqual(['01GENBSB.usfm', '41MATBSB.usfm']);
        expect((await readdir(path.join(dir, 'BSB'))).sort()).toEqual([
            'GEN.usx',
            'bsb.txt',
            'metadata.json',
        ]);
    });

    it('should keep the existing translation when the conversion fails', async () => {
        await fetchBsbTranslation(dir, {
            convertToUsx3: false,
            metadata: BSB_METADATA,
        });
        (convertUsfmToUsx3 as jest.Mock).mockResolvedValue(false);

        await expect(
            fetchBsbTranslation(dir, { metadata: BSB_METADATA })
        ).rejects.toThrow(/Failed to convert/);

        expect(await readdir(dir)).toEqual(['BSB']);
        expect(await readdir(path.join(dir, 'BSB'))).toContain('01GENBSB.usfm');
    });

    it('should skip the translation when the download has not changed', async () => {
        const options = { convertToUsx3: false, metadata: BSB_METADATA };
        expect(await fetchBsbTranslation(dir, options)).toBe(true);
        expect(await fetchBsbTranslation(dir, options)).toBe(false);
        expect(
            await fetchBsbTranslation(dir, { ...options, overwrite: true })
        ).toBe(true);

        zip = await createZip({ 'GEN.usfm': '\\id GEN\n' });
        expect(await fetchBsbTranslation(dir, options)).toBe(true);
        expect((await readdir(path.join(dir, 'BSB'))).sort()).toEqual([
            'GEN.usfm',
            'bsb.txt',
            'metadata.json',
        ]);
    });

    it('should fail when the download fails', async () => {
        global.fetch = jest.fn(async () => ({
            ok: false,
            status: 404,
            statusText: 'Not Found',
        })) as any;
        await expect(
            fetchBsbTranslation(dir, {
                convertToUsx3: false,
                metadata: BSB_METADATA,
            })
        ).rejects.toThrow(/404 Not Found/);
    });

    it('should fail when the zip has no USFM files', async () => {
        zip = await createZip({ 'readme.txt': 'nothing here' });
        await expect(
            fetchBsbTranslation(dir, {
                convertToUsx3: false,
                metadata: BSB_METADATA,
            })
        ).rejects.toThrow(/No USFM files/);
        expect(await readdir(dir)).toEqual([]);
    });
});
