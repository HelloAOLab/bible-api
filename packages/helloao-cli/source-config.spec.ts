import path from 'node:path';
import { tmpdir } from 'node:os';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import {
    getSourceAllTranslationsOptions,
    loadSourceConfig,
} from './source-config';

describe('source config', () => {
    let dir: string;
    let configPath: string;

    beforeEach(() => {
        dir = mkdtempSync(path.join(tmpdir(), 'helloao-source-config-'));
        configPath = path.resolve(dir, 'source.config.json');
    });

    afterEach(() => {
        rmSync(dir, { recursive: true, force: true });
    });

    function writeConfig(config: any) {
        writeFileSync(configPath, JSON.stringify(config));
    }

    it('should resolve the paths relative to the config file', async () => {
        writeConfig({
            db: './api.db',
            ignorelist: ['amh_amh'],
            conversionConcurrency: 2,
            bibleMultiConverterPath: './tools/BibleMultiConverter.jar',
            sources: [
                { type: 'ebible', path: './sources/ebible' },
                {
                    type: 'fetch-bible',
                    path: './sources/fetch-bible',
                    repo: 'someone/fetch_collection',
                    ref: 'dev',
                },
                { type: 'osis', path: './sources/osis' },
                { type: 'bsb', path: './sources/bsb' },
            ],
        });

        const config = await loadSourceConfig(configPath);
        const { outputDir, options } = getSourceAllTranslationsOptions(config);

        expect(outputDir).toBe(path.resolve(dir, 'sources/ebible'));
        expect(options).toMatchObject({
            db: path.resolve(dir, 'api.db'),
            ignorelist: ['amh_amh'],
            conversionConcurrency: 2,
            bibleMultiConverterPath: path.resolve(
                dir,
                'tools/BibleMultiConverter.jar'
            ),
            includeFetchBible: true,
            fetchBibleDir: path.resolve(dir, 'sources/fetch-bible'),
            repo: 'someone/fetch_collection',
            ref: 'dev',
            includeOsis: true,
            osisDir: path.resolve(dir, 'sources/osis'),
            includeBsb: true,
            bsbDir: path.resolve(dir, 'sources/bsb'),
        });
    });

    it('should not download from sources that are left out', async () => {
        writeConfig({ sources: [{ type: 'ebible', path: 'ebible' }] });

        const { options } = getSourceAllTranslationsOptions(
            await loadSourceConfig(configPath)
        );

        expect(options.includeFetchBible).toBe(false);
        expect(options.includeOsis).toBe(false);
        expect(options.includeBsb).toBe(false);
        expect(options.db).toBeUndefined();
    });

    it('should let the given options override the config', async () => {
        writeConfig({
            db: './api.db',
            ignorelist: ['a'],
            conversionConcurrency: 2,
            convertToUsx3: false,
            sources: [{ type: 'ebible', path: 'ebible' }],
        });

        const { options } = getSourceAllTranslationsOptions(
            await loadSourceConfig(configPath),
            {
                db: '/other.db',
                ignorelist: ['b'],
                conversionConcurrency: undefined,
                convertToUsx3: true,
                overwrite: true,
            }
        );

        expect(options.db).toBe('/other.db');
        expect(options.ignorelist).toEqual(['a', 'b']);
        expect(options.conversionConcurrency).toBe(2);
        expect(options.convertToUsx3).toBe(true);
        expect(options.overwrite).toBe(true);
    });

    it('should require exactly one ebible source', async () => {
        writeConfig({ sources: [{ type: 'bsb', path: 'bsb' }] });
        await expect(loadSourceConfig(configPath)).rejects.toThrow(
            /ebible source is required/
        );

        writeConfig({
            sources: [
                { type: 'ebible', path: 'a' },
                { type: 'ebible', path: 'b' },
            ],
        });
        await expect(loadSourceConfig(configPath)).rejects.toThrow(
            /only be one ebible source/
        );
    });

    it('should reject invalid sources', async () => {
        writeConfig({ sources: [{ type: 'ebible' }] });
        await expect(loadSourceConfig(configPath)).rejects.toThrow(
            /Invalid source config/
        );

        writeConfig({
            sources: [{ type: 'ebible', path: 'ebible', ref: 'main' }],
        });
        await expect(loadSourceConfig(configPath)).rejects.toThrow(
            /only allowed for fetch-bible sources/
        );

        writeConfig({
            sources: [
                { type: 'ebible', path: 'ebible' },
                { type: 'wordproject', path: 'wp' },
            ],
        });
        await expect(loadSourceConfig(configPath)).rejects.toThrow(
            /Invalid source config/
        );
    });
});
