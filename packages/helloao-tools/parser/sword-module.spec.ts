import { inflateSync } from 'zlib';
import {
    getSwordCommentaryFileNames,
    getSwordConfigValue,
    isSwordCommentaryModule,
    parseSwordConfig,
    readSwordCommentaryEntries,
} from './sword-module';
import { buildSwordTestament } from './test/sword-module-builder';

const inflate = (data: Uint8Array) => new Uint8Array(inflateSync(data));

describe('parseSwordConfig()', () => {
    it('should parse the module name and values', () => {
        const config = parseSwordConfig(
            [
                '## A comment',
                '[Clarke]',
                '',
                '# Short description of the module.',
                "Description=Adam Clarke's Commentary",
                'DataPath=./modules/comments/zcom/clarke/',
                'ModDrv=zCom',
                'GlobalOptionFilter=OSISHeadings',
                'GlobalOptionFilter=OSISScripref',
                'About=First line\\',
                'second line',
                'Lang=en',
            ].join('\r\n')
        );

        expect(config.name).toBe('Clarke');
        expect(config.values).toEqual({
            Description: ["Adam Clarke's Commentary"],
            DataPath: ['./modules/comments/zcom/clarke/'],
            ModDrv: ['zCom'],
            GlobalOptionFilter: ['OSISHeadings', 'OSISScripref'],
            About: ['First line\nsecond line'],
            Lang: ['en'],
        });
        expect(getSwordConfigValue(config, 'moddrv')).toBe('zCom');
        expect(getSwordConfigValue(config, 'Missing')).toBeNull();
        expect(isSwordCommentaryModule(config)).toBe(true);
    });

    it('should throw when the module name is missing', () => {
        expect(() => parseSwordConfig('ModDrv=zCom')).toThrow();
    });

    it('should not consider Bible modules to be commentaries', () => {
        expect(
            isSwordCommentaryModule(parseSwordConfig('[KJV]\nModDrv=zText'))
        ).toBe(false);
    });
});

describe('getSwordCommentaryFileNames()', () => {
    it('should return the names of the compressed files', () => {
        expect(
            getSwordCommentaryFileNames(parseSwordConfig('[A]\nModDrv=zCom'))
        ).toEqual({
            ot: { blocks: 'ot.bzs', index: 'ot.bzv', data: 'ot.bzz' },
            nt: { blocks: 'nt.bzs', index: 'nt.bzv', data: 'nt.bzz' },
        });
    });

    it('should return the names of the raw files', () => {
        expect(
            getSwordCommentaryFileNames(parseSwordConfig('[A]\nModDrv=RawCom'))
        ).toEqual({
            ot: { index: 'ot.vss', data: 'ot' },
            nt: { index: 'nt.vss', data: 'nt' },
        });
    });
});

describe('readSwordCommentaryEntries()', () => {
    const entries: Parameters<typeof buildSwordTestament>[1] = [
        ['GEN', 0, 0, 'Genesis intro'],
        ['GEN', 1, 0, 'Chapter intro'],
        ['GEN', 1, 1, 'In the beginning'],
        ['GEN', 1, 2, 'Without form'],
        ['GEN', 1, 3, null],
        ['EXO', 2, 3, 'Ark of bulrushes'],
        ['MAL', 4, 6, 'Last verse of the OT'],
    ];
    const ntEntries: Parameters<typeof buildSwordTestament>[1] = [
        ['MAT', 1, 1, 'The book of the generation'],
        ['JHN', 3, 16, 'For God so loved the world'],
        ['REV', 22, 21, 'The grace of our Lord'],
    ];
    const expected = [
        { book: 'GEN', chapter: 0, verse: 0, text: 'Genesis intro' },
        { book: 'GEN', chapter: 1, verse: 0, text: 'Chapter intro' },
        { book: 'GEN', chapter: 1, verse: 1, text: 'In the beginning' },
        { book: 'GEN', chapter: 1, verse: 2, text: 'Without form' },
        { book: 'EXO', chapter: 2, verse: 3, text: 'Ark of bulrushes' },
        { book: 'MAL', chapter: 4, verse: 6, text: 'Last verse of the OT' },
        {
            book: 'MAT',
            chapter: 1,
            verse: 1,
            text: 'The book of the generation',
        },
        {
            book: 'JHN',
            chapter: 3,
            verse: 16,
            text: 'For God so loved the world',
        },
        { book: 'REV', chapter: 22, verse: 21, text: 'The grace of our Lord' },
    ];

    it.each([
        ['zCom', true, 2],
        ['zCom4', true, 4],
        ['RawCom', false, 2],
        ['RawCom4', false, 4],
    ] as const)('should read %s modules', (driver, compressed, sizeBytes) => {
        const config = parseSwordConfig(
            `[Test]\nModDrv=${driver}\nEncoding=UTF-8\nSourceType=OSIS`
        );
        const result = readSwordCommentaryEntries(
            config,
            {
                ot: buildSwordTestament('ot', entries, {
                    compressed,
                    sizeBytes,
                }),
                nt: buildSwordTestament('nt', ntEntries, {
                    compressed,
                    sizeBytes,
                }),
            },
            inflate
        );
        expect(result).toEqual(expected);
    });

    it('should support modules that only have one testament', () => {
        const config = parseSwordConfig('[Test]\nModDrv=zCom\nEncoding=UTF-8');
        const result = readSwordCommentaryEntries(
            config,
            { nt: buildSwordTestament('nt', ntEntries) },
            inflate
        );
        expect(result).toEqual(expected.slice(6));
    });

    it('should decode Latin-1 modules', () => {
        const config = parseSwordConfig('[Test]\nModDrv=RawCom');
        const files = buildSwordTestament('ot', [['GEN', 1, 1, 'x']], {
            compressed: false,
        });
        const result = readSwordCommentaryEntries(
            config,
            { ot: { ...files, data: new Uint8Array([0xe9]) } },
            inflate
        );
        expect(result).toEqual([
            { book: 'GEN', chapter: 1, verse: 1, text: 'é' },
        ]);
    });

    it('should reject unsupported versifications', () => {
        const config = parseSwordConfig(
            '[Test]\nModDrv=zCom\nVersification=Catholic'
        );
        expect(() => readSwordCommentaryEntries(config, {}, inflate)).toThrow(
            /Catholic/
        );
    });

    it('should reject encrypted modules', () => {
        const config = parseSwordConfig('[Test]\nModDrv=zCom\nCipherKey=');
        expect(() => readSwordCommentaryEntries(config, {}, inflate)).toThrow(
            /encrypted/
        );
    });

    it('should reject unsupported compression', () => {
        const config = parseSwordConfig(
            '[Test]\nModDrv=zCom\nCompressType=LZSS'
        );
        expect(() => readSwordCommentaryEntries(config, {}, inflate)).toThrow(
            /LZSS/
        );
    });
});
