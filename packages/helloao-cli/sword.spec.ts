import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { Uint8ArrayReader, Uint8ArrayWriter, ZipWriter } from '@zip.js/zip.js';
import { DOMParser } from 'linkedom';
import { generateDataset } from '@helloao/tools/generation/dataset.js';
import { parseSwordConfig } from '@helloao/tools/parser/sword-module.js';
import { buildSwordTestament } from '@helloao/tools/parser/test/sword-module-builder.js';
import {
    findSwordCommentaryModules,
    getSwordCommentaryMetadata,
    getSwordLanguage,
} from './sword.js';
import { loadCommentaryFiles, loadCommentaryMetadata } from './files.js';

const CONF = `[TestCom]
Description=Test Commentary
DataPath=./modules/comments/zcom/testcom/
ModDrv=zCom
SourceType=OSIS
Encoding=UTF-8
CompressType=ZIP
BlockType=BOOK
Versification=KJV
Lang=en
DistributionLicense=Public Domain
TextSource=https://example.com/source
`;

function moduleFiles(): Record<string, Uint8Array> {
    const ot = buildSwordTestament('ot', [
        [
            'GEN',
            1,
            1,
            '<title>Introduction</title><lb/>Summary<lb/><hi type="bold">Verse 1</hi><lb/>In the beginning',
        ],
        ['GEN', 1, 2, 'The earth'],
    ]);
    const nt = buildSwordTestament('nt', [['JHN', 3, 16, 'For God so loved']]);
    const dir = 'modules/comments/zcom/testcom';
    return {
        'mods.d/testcom.conf': new TextEncoder().encode(CONF),
        [`${dir}/ot.bzs`]: ot.blocks!,
        [`${dir}/ot.bzv`]: ot.index,
        [`${dir}/ot.bzz`]: ot.data,
        [`${dir}/nt.bzs`]: nt.blocks!,
        [`${dir}/nt.bzv`]: nt.index,
        [`${dir}/nt.bzz`]: nt.data,
    };
}

async function writeModuleDirectory(dir: string) {
    for (let [name, data] of Object.entries(moduleFiles())) {
        const file = path.resolve(dir, name);
        await mkdir(path.dirname(file), { recursive: true });
        await writeFile(file, data);
    }
}

async function writeModuleZip(file: string) {
    const writer = new Uint8ArrayWriter();
    const zip = new ZipWriter(writer);
    for (let [name, data] of Object.entries(moduleFiles())) {
        await zip.add(name, new Uint8ArrayReader(data));
    }
    await zip.close();
    await writeFile(file, await writer.getData());
}

describe('sword', () => {
    let tempDir: string;

    beforeEach(async () => {
        tempDir = await mkdtemp(path.join(os.tmpdir(), 'bible-api-sword-'));
    });

    afterEach(async () => {
        await rm(tempDir, { recursive: true, force: true });
    });

    describe('getSwordLanguage()', () => {
        it.each([
            ['en', 'eng'],
            ['de', 'deu'],
            ['zh-Hans', 'zho'],
            ['grc', 'grc'],
            [null, 'eng'],
        ])('should convert %s to %s', (lang, expected) => {
            expect(getSwordLanguage(lang)).toBe(expected);
        });
    });

    describe('getSwordCommentaryMetadata()', () => {
        it('should get the metadata from the module config', () => {
            expect(getSwordCommentaryMetadata(parseSwordConfig(CONF))).toEqual({
                id: 'testcom',
                name: 'Test Commentary',
                englishName: 'Test Commentary',
                language: 'eng',
                direction: 'ltr',
                website: 'https://example.com/source',
                licenseUrl:
                    'https://www.crosswire.org/sword/modules/ModInfo.jsp?modName=TestCom',
                licenseNotice: null,
            });
        });

        it('should include the copyright of modules that are not public domain', () => {
            const metadata = getSwordCommentaryMetadata(
                parseSwordConfig(
                    '[A]\nModDrv=zCom\nShortCopyright=Copyright 2000 Someone\nDistributionLicense=Copyrighted; Free non-commercial distribution\nDirection=RtoL'
                )
            );
            expect(metadata.licenseNotice).toBe(
                'Copyright 2000 Someone Copyrighted; Free non-commercial distribution'
            );
            expect(metadata.direction).toBe('rtl');
            expect(metadata.website).toBe(metadata.licenseUrl);
        });
    });

    describe.each([
        ['an extracted module', writeModuleDirectory],
        [
            'a zipped module',
            (dir: string) => writeModuleZip(path.resolve(dir, 'TestCom.zip')),
        ],
    ])('%s', (_, write) => {
        beforeEach(async () => {
            await write(tempDir);
        });

        it('should find the module', async () => {
            const modules = await findSwordCommentaryModules(tempDir);
            expect(modules.map((m) => m.config.name)).toEqual(['TestCom']);
        });

        it('should load the metadata from the module', async () => {
            const metadata = await loadCommentaryMetadata(tempDir);
            expect(metadata?.id).toBe('testcom');
            expect(metadata?.name).toBe('Test Commentary');
        });

        it('should let metadata.json override the module metadata', async () => {
            await writeFile(
                path.resolve(tempDir, 'metadata.json'),
                JSON.stringify({ id: 'test-commentary', name: 'Overridden' })
            );
            const metadata = await loadCommentaryMetadata(tempDir);
            expect(metadata).toMatchObject({
                id: 'test-commentary',
                name: 'Overridden',
                englishName: 'Test Commentary',
                language: 'eng',
            });
        });

        it('should generate the commentary', async () => {
            const files = await loadCommentaryFiles(tempDir);
            expect(files?.map((f) => f.fileType)).toEqual(['commentary/sword']);

            const output = generateDataset(files!, new DOMParser() as any);
            expect(output.commentaries).toHaveLength(1);
            const commentary = output.commentaries[0];
            expect(commentary.id).toBe('testcom');
            expect(commentary.books.map((b) => b.id)).toEqual(['GEN', 'JHN']);

            const genesis = commentary.books[0].chapters[0].chapter;
            expect(genesis.introduction).toBe('Introduction\nSummary');
            expect(genesis.content).toEqual([
                { type: 'verse', number: 1, content: ['In the beginning'] },
                { type: 'verse', number: 2, content: ['The earth'] },
            ]);
            expect(commentary.books[1].chapters[0].chapter.content).toEqual([
                { type: 'verse', number: 16, content: ['For God so loved'] },
            ]);
        });
    });
});
