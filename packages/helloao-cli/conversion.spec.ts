import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { preprocessUsfm, preprocessUsfmDirectory } from './conversion.js';

describe('preprocessUsfm()', () => {
    it('should replace \\ref with its display text', () => {
        expect(
            preprocessUsfm(
                '\\f + \\fr 4:6 \\ft See \\ref Psalm 91:11–12|PSA 91:11-12\\ref*\\f*'
            )
        ).toBe('\\f + \\fr 4:6 \\ft See Psalm 91:11–12\\f*');
    });

    it('should not add a space after an opening parenthesis', () => {
        expect(preprocessUsfm('\\ft (\\ref 1 Enoch 1:9|1:9\\ref*)')).toBe(
            '\\ft (1 Enoch 1:9)'
        );
    });

    it('should support \\ref without a target', () => {
        expect(preprocessUsfm('See \\ref Genesis 1:1\\ref*.')).toBe(
            'See Genesis 1:1.'
        );
    });

    it('should support attribute targets and nested \\+ref', () => {
        expect(
            preprocessUsfm(
                'A \\ref John 3:16|loc="JHN 3:16"\\ref* and \\+ref Mark 1:1|MRK 1:1\\+ref*'
            )
        ).toBe('A John 3:16 and Mark 1:1');
    });

    it('should handle multiple references on one line', () => {
        expect(
            preprocessUsfm(
                '\\ref Isaiah 40:3|ISA 40:3\\ref*; \\ref Malachi 3:1|MAL 3:1\\ref*'
            )
        ).toBe('Isaiah 40:3; Malachi 3:1');
    });

    it('should leave other markers unchanged', () => {
        const usfm =
            '\\v 1 In the beginning \\f + \\fr 1:1 \\ft text|with pipe\\f*\n\\rem \\refx';
        expect(preprocessUsfm(usfm)).toBe(usfm);
    });
});

describe('preprocessUsfmDirectory()', () => {
    let dir: string;

    beforeEach(async () => {
        dir = await mkdtemp(path.join(tmpdir(), 'conversion-spec-'));
    });

    afterEach(async () => {
        await rm(dir, { recursive: true, force: true });
    });

    it('should write preprocessed USFM files to the output directory without changing the input', async () => {
        const input = path.join(dir, 'in');
        const output = path.join(dir, 'out');
        await mkdir(input);
        const original =
            '\\id MAT\n\\v 6 \\ref Psalm 91:11–12|PSA 91:11-12\\ref*\n';
        await writeFile(path.join(input, 'MAT.usfm'), original);
        await writeFile(path.join(input, 'GEN.usfm'), '\\id GEN\n');
        await writeFile(
            path.join(input, 'notes.json'),
            '{"a":"\\\\ref x|y\\\\ref*"}'
        );

        const changed = await preprocessUsfmDirectory(input, output);

        expect(changed).toBe(1);
        expect(await readFile(path.join(output, 'MAT.usfm'), 'utf-8')).toBe(
            '\\id MAT\n\\v 6 Psalm 91:11–12\n'
        );
        expect(await readFile(path.join(output, 'GEN.usfm'), 'utf-8')).toBe(
            '\\id GEN\n'
        );
        expect(await readFile(path.join(output, 'notes.json'), 'utf-8')).toBe(
            '{"a":"\\\\ref x|y\\\\ref*"}'
        );
        expect(await readFile(path.join(input, 'MAT.usfm'), 'utf-8')).toBe(
            original
        );
    });
});
