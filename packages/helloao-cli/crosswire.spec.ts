import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
import { Uint8ArrayReader, Uint8ArrayWriter, ZipWriter } from '@zip.js/zip.js';
import { parseSwordConfig } from '@helloao/tools/parser/sword-module.js';
import { buildSwordTestament } from '@helloao/tools/parser/test/sword-module-builder.js';
import {
    decodeSwordConfig,
    fetchCrossWireCommentaries,
    getCrossWireCommentaryMetadata,
    getCrossWireLicense,
    getUnsupportedReason,
    parseCrossWireModuleList,
    readModsDArchive,
} from './crosswire.js';
import { loadCommentaryFiles } from './files.js';

const LIST_HTML = `
<br id="lang_de" /><br /><b>Language: de</b><br>
<table class="moddisp"><thead><tr><th>Info</th><th>Name</th><th>Description</th><th>Raw ZIP</th></tr></thead>
<tbody>
<tr>
    <td><span><A HREF="ModInfo.jsp?modName=GerCom">[info]</A></span></td>
    <td>GerCom</td>
    <td>Ein Kommentar &amp; mehr</td>
    <td><A HREF="/sword/servlet/SwordMod.Verify?modName=GerCom&pkgType=raw">[download]</A></td>
</tr>
</tbody></table>
<br id="lang_en" /><br /><b>Language: en</b><br>
<table class="moddisp"><thead><tr><th>Info</th><th>Name</th><th>Description</th><th>Raw ZIP</th></tr></thead>
<tbody>
<tr>
    <td><span><A HREF="ModInfo.jsp?modName=TestCom">[info]</A></span></td>
    <td>TestCom</td>
    <td>Test Commentary</td>
    <td><A HREF="/sword/servlet/SwordMod.Verify?modName=TestCom&pkgType=raw">[download]</A></td>
</tr>
<tr>
    <td><span><A HREF="ModInfo.jsp?modName=NcCom">[info]</A></span></td>
    <td>NcCom</td>
    <td>Non-commercial Commentary</td>
    <td><A HREF="/sword/servlet/SwordMod.Verify?modName=NcCom&pkgType=raw">[download]</A></td>
</tr>
</tbody></table>
`;

function conf(name: string, extra: string) {
    return `[${name}]
Description=${name} Description
DataPath=./modules/comments/zcom/${name.toLowerCase()}/
ModDrv=zCom
SourceType=OSIS
Encoding=UTF-8
CompressType=ZIP
BlockType=CHAPTER
Lang=en
Version=1.0
${extra}
`;
}

const CONFS: Record<string, string> = {
    TestCom: conf('TestCom', 'DistributionLicense=Public Domain'),
    NcCom: conf(
        'NcCom',
        'DistributionLicense=Copyrighted; Free non-commercial distribution\nShortCopyright=Copyright 2000 Someone'
    ),
    GerCom: conf(
        'GerCom',
        'DistributionLicense=Public Domain\nVersification=Luther'
    ),
};

/**
 * Builds an uncompressed tar archive with the given files.
 */
function buildTar(files: Record<string, Uint8Array>): Uint8Array {
    const blocks: Uint8Array[] = [];
    for (let [name, data] of Object.entries(files)) {
        const header = new Uint8Array(512);
        const write = (offset: number, text: string) =>
            header.set(new TextEncoder().encode(text), offset);
        write(0, name);
        write(100, '0000644\0');
        write(124, data.length.toString(8).padStart(11, '0') + '\0');
        header[156] = '0'.charCodeAt(0);
        write(257, 'ustar\0');
        blocks.push(header);
        const padded = new Uint8Array(Math.ceil(data.length / 512) * 512);
        padded.set(data);
        blocks.push(padded);
    }
    blocks.push(new Uint8Array(1024));
    const result = new Uint8Array(blocks.reduce((n, b) => n + b.length, 0));
    let offset = 0;
    for (let block of blocks) {
        result.set(block, offset);
        offset += block.length;
    }
    return result;
}

async function buildModuleZip(name: string): Promise<Uint8Array> {
    const ot = buildSwordTestament('ot', [['GEN', 1, 1, 'In the beginning']]);
    const nt = buildSwordTestament('nt', [['JHN', 3, 16, 'For God so loved']]);
    const dir = `modules/comments/zcom/${name.toLowerCase()}`;
    const files: Record<string, Uint8Array> = {
        [`mods.d/${name.toLowerCase()}.conf`]: new TextEncoder().encode(
            CONFS[name]
        ),
        [`${dir}/ot.czs`]: ot.blocks!,
        [`${dir}/ot.czv`]: ot.index,
        [`${dir}/ot.czz`]: ot.data,
        [`${dir}/nt.czs`]: nt.blocks!,
        [`${dir}/nt.czv`]: nt.index,
        [`${dir}/nt.czz`]: nt.data,
    };
    const writer = new Uint8ArrayWriter();
    const zip = new ZipWriter(writer);
    for (let [file, data] of Object.entries(files)) {
        await zip.add(file, new Uint8ArrayReader(data));
    }
    await zip.close();
    return await writer.getData();
}

describe('parseCrossWireModuleList()', () => {
    it('should parse the modules and their languages', () => {
        expect(parseCrossWireModuleList(LIST_HTML)).toEqual([
            {
                name: 'GerCom',
                description: 'Ein Kommentar & mehr',
                language: 'de',
            },
            { name: 'TestCom', description: 'Test Commentary', language: 'en' },
            {
                name: 'NcCom',
                description: 'Non-commercial Commentary',
                language: 'en',
            },
        ]);
    });
});

describe('readModsDArchive()', () => {
    it('should read the configs from the archive', () => {
        const archive = gzipSync(
            buildTar({
                'mods.d/testcom.conf': new TextEncoder().encode(CONFS.TestCom),
                'mods.d/latin.conf': new Uint8Array([
                    ...new TextEncoder().encode('[Latin]\nDescription=Caf'),
                    0xe9,
                ]),
                'README.txt': new TextEncoder().encode('ignored'),
            })
        );
        const configs = readModsDArchive(archive);
        expect([...configs.keys()].sort()).toEqual(['latin', 'testcom']);
        expect(configs.get('latin')?.values.Description).toEqual(['Café']);
    });
});

describe('decodeSwordConfig()', () => {
    it('should decode UTF-8 configs', () => {
        expect(
            decodeSwordConfig(new TextEncoder().encode('Description=Écritures'))
        ).toBe('Description=Écritures');
    });
});

describe('getCrossWireLicense()', () => {
    it.each([
        ['Public Domain', 'public-domain', null],
        ['Creative Commons: CC0', 'public-domain', 'CC0 1.0'],
        ['Creative Commons: BY 4.0', 'open', 'CC BY 4.0'],
        ['Creative Commons: BY-SA 3.0', 'open', 'CC BY-SA 3.0'],
        ['Creative Commons: BY-NC-ND 4.0', 'restricted', 'CC BY-NC-ND 4.0'],
        ['Copyrighted; Free non-commercial distribution', 'restricted', null],
        [
            'Copyrighted; Permission to distribute granted to CrossWire',
            'restricted',
            null,
        ],
        [null, 'unknown', null],
    ])('should classify %s as %s', (license, kind, shortName) => {
        const result = getCrossWireLicense(license);
        expect(result.kind).toBe(kind);
        expect(result.shortName).toBe(shortName);
    });

    it('should get the structured terms of CC licenses', () => {
        expect(getCrossWireLicense('Creative Commons: BY-SA 4.0')).toEqual({
            kind: 'open',
            distributionLicense: 'Creative Commons: BY-SA 4.0',
            shortName: 'CC BY-SA 4.0',
            url: 'https://creativecommons.org/licenses/by-sa/4.0/',
            terms: {
                attribution: 'required',
                commercialUse: 'allowed',
                derivatives: 'allowed',
                copyleft: true,
                publicDomain: false,
            },
        });
    });
});

describe('getUnsupportedReason()', () => {
    it('should allow KJV commentaries', () => {
        expect(
            getUnsupportedReason(parseSwordConfig(CONFS.TestCom))
        ).toBeNull();
    });

    it('should reject other versifications', () => {
        expect(getUnsupportedReason(parseSwordConfig(CONFS.GerCom))).toBe(
            'uses the Luther versification (only KJV is supported)'
        );
    });

    it('should reject modules that are not commentaries', () => {
        expect(
            getUnsupportedReason(
                parseSwordConfig('[Personal]\nModDrv=RawFiles')
            )
        ).toMatch(/RawFiles/);
    });
});

describe('getCrossWireCommentaryMetadata()', () => {
    it('should fill in the licenses and English names of known modules', () => {
        const metadata = getCrossWireCommentaryMetadata(
            parseSwordConfig(
                '[MAK]\nModDrv=RawCom\nDescription=Matthias Ansorgs Kommentar\nLang=de'
            )
        );
        expect(metadata).toMatchObject({
            id: 'mak',
            name: 'Matthias Ansorgs Kommentar',
            englishName: "Matthias Ansorg's Commentary",
            language: 'deu',
        });

        const geneva = getCrossWireCommentaryMetadata(
            parseSwordConfig('[Geneva]\nModDrv=zCom\nDescription=Geneva Notes')
        );
        expect(geneva.license?.publicDomain).toBe(true);
        expect(geneva.licenseNotice).toBeNull();
    });

    it('should include the attribution for CC BY modules', () => {
        const metadata = getCrossWireCommentaryMetadata(
            parseSwordConfig(
                '[A]\nModDrv=zCom\nDescription=A\nDistributionLicense=Creative Commons: BY 4.0\nCopyrightHolder=OpenBible.info'
            )
        );
        expect(metadata.licenseUrl).toBe(
            'https://creativecommons.org/licenses/by/4.0/'
        );
        expect(metadata.licenseNotice).toBe(
            'OpenBible.info. Licensed under CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/).'
        );
    });
});

describe('fetchCrossWireCommentaries()', () => {
    let tempDir: string;
    let requests: string[];
    let fetchMock: typeof fetch;

    beforeEach(async () => {
        tempDir = await mkdtemp(path.join(os.tmpdir(), 'bible-api-crosswire-'));
        requests = [];
        const modsD = gzipSync(
            buildTar(
                Object.fromEntries(
                    Object.entries(CONFS).map(([name, text]) => [
                        `mods.d/${name.toLowerCase()}.conf`,
                        new TextEncoder().encode(text),
                    ])
                )
            )
        );
        fetchMock = (async (url: string) => {
            requests.push(url);
            if (url === 'list') {
                return new Response(LIST_HTML);
            } else if (url === 'mods.d') {
                return new Response(modsD);
            }
            const name = /zip\/(.+)$/.exec(url)?.[1];
            if (name && CONFS[name]) {
                return new Response(await buildModuleZip(name));
            }
            return new Response('', { status: 404, statusText: 'Not Found' });
        }) as any;
    });

    afterEach(async () => {
        await rm(tempDir, { recursive: true, force: true });
    });

    const options = () => ({
        listUrl: 'list',
        modsDUrl: 'mods.d',
        getZipUrl: (name: string) => `zip/${name}`,
        fetch: fetchMock,
    });

    it('should only fetch free commentaries that can be imported', async () => {
        const results = await fetchCrossWireCommentaries(tempDir, options());
        expect(results).toEqual([
            {
                module: 'GerCom',
                id: 'gercom',
                status: 'skipped',
                license: 'public-domain',
                reason: 'uses the Luther versification (only KJV is supported)',
            },
            {
                module: 'TestCom',
                id: 'testcom',
                status: 'downloaded',
                license: 'public-domain',
            },
            {
                module: 'NcCom',
                id: 'nccom',
                status: 'skipped',
                license: 'restricted',
                reason: 'is not free to use (Copyrighted; Free non-commercial distribution)',
            },
        ]);

        const metadata = JSON.parse(
            await readFile(
                path.join(tempDir, 'testcom', 'metadata.json'),
                'utf-8'
            )
        );
        expect(metadata).toMatchObject({
            id: 'testcom',
            name: 'TestCom Description',
            language: 'eng',
            licenseUrl:
                'https://www.crosswire.org/sword/modules/ModInfo.jsp?modName=TestCom',
            licenseNotice: null,
            license: { publicDomain: true },
        });

        const record = JSON.parse(
            await readFile(
                path.join(tempDir, 'testcom', 'crosswire.json'),
                'utf-8'
            )
        );
        expect(record).toMatchObject({
            module: 'TestCom',
            version: '1.0',
            url: 'zip/TestCom',
        });

        const files = await loadCommentaryFiles(path.join(tempDir, 'testcom'));
        expect(files?.map((f) => f.fileType)).toEqual(['commentary/sword']);
    });

    it('should not download modules again when they are up to date', async () => {
        await fetchCrossWireCommentaries(tempDir, options());
        requests = [];
        const results = await fetchCrossWireCommentaries(tempDir, options());
        expect(results.find((r) => r.module === 'TestCom')?.status).toBe(
            'up-to-date'
        );
        expect(requests).toEqual(['list', 'mods.d']);
    });

    it('should fetch every license with allLicenses', async () => {
        const results = await fetchCrossWireCommentaries(tempDir, {
            ...options(),
            allLicenses: true,
            modules: ['nccom'],
        });
        expect(results.map((r) => [r.module, r.status])).toEqual([
            ['NcCom', 'downloaded'],
        ]);
        const metadata = JSON.parse(
            await readFile(
                path.join(tempDir, 'nccom', 'metadata.json'),
                'utf-8'
            )
        );
        expect(metadata.licenseNotice).toBe(
            'Copyright 2000 Someone. Copyrighted; Free non-commercial distribution.'
        );
        expect(metadata.license).toBeNull();
    });

    it('should not download anything in a dry run', async () => {
        const results = await fetchCrossWireCommentaries(tempDir, {
            ...options(),
            dryRun: true,
        });
        expect(results.find((r) => r.module === 'TestCom')?.status).toBe(
            'would-download'
        );
        expect(requests).toEqual(['list', 'mods.d']);
    });

    it('should reject modules that are not on the list', async () => {
        await expect(
            fetchCrossWireCommentaries(tempDir, {
                ...options(),
                modules: ['Missing'],
            })
        ).rejects.toThrow('Missing');
    });
});
