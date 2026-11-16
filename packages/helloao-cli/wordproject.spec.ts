import {
    mkdtemp,
    readFile,
    readdir,
    rm,
    writeFile,
    mkdir,
} from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import {
    createWordprojectMetadata,
    createWordprojectUsfm,
    fetchWordprojectTranslations,
    getWordprojectBookId,
    parseWordprojectChapter,
    parseWordprojectChapterLinks,
    parseWordprojectIndex,
    selectWordprojectTranslations,
    WORDPROJECT_MARKER_FILE,
    WORDPROJECT_TRANSLATIONS,
    WordprojectTranslation,
} from './wordproject.js';

const chapterPage = (body: string, chapters = '') => `<!doctype html>
<html><head><meta charset="utf-8"></head><body>
<div class="textHeader"><h1>John</h1><p class="ym-noprint">${chapters}</p></div>
<div class="textOptions">
<div class="textBody" id="textBody">
<h3>Chapter 1</h3>
${body}
</div>
</div>
</body></html>`;

describe('getWordprojectBookId()', () => {
    it('should support every folder layout', () => {
        expect(getWordprojectBookId('01')).toBe('GEN');
        expect(getWordprojectBookId('1')).toBe('GEN');
        expect(getWordprojectBookId('B43')).toBe('JHN');
        expect(getWordprojectBookId('66')).toBe('REV');
    });

    it('should map the deuterocanonical folders', () => {
        expect(getWordprojectBookId('16_A')).toBe('TOB');
        expect(getWordprojectBookId('22_B')).toBe('SIR');
        expect(getWordprojectBookId('25_A')).toBe('BAR');
    });

    it('should return null for anything else', () => {
        expect(getWordprojectBookId('67')).toBeNull();
        expect(getWordprojectBookId('16_Z')).toBeNull();
        expect(getWordprojectBookId('audio')).toBeNull();
    });
});

describe('parseWordprojectIndex()', () => {
    it('should find the books in order and ignore other links', () => {
        const html = `<a href="../index.htm">Home</a>
<a href="index_en.htm#1">x</a>
<li><a title="[1]" href="01/1.htm"> Genesis </a></li>
<li><a title="Tb [16_A]" href="16_A/1.htm">Tobit</a></li>
<li><a title="[43]" href="43/1.htm"> John </a></li>
<li><a href="43/1.htm"> John again </a></li>`;
        expect(
            parseWordprojectIndex(
                html,
                'https://www.wordproject.org/bibles/kj/index.htm'
            )
        ).toEqual([
            {
                bookId: 'GEN',
                name: 'Genesis',
                url: 'https://www.wordproject.org/bibles/kj/01/1.htm',
            },
            {
                bookId: 'TOB',
                name: 'Tobit',
                url: 'https://www.wordproject.org/bibles/kj/16_A/1.htm',
            },
            {
                bookId: 'JHN',
                name: 'John',
                url: 'https://www.wordproject.org/bibles/kj/43/1.htm',
            },
        ]);
    });

    it('should support the layout of the newer Bibles', () => {
        const html = `<a href="1/index.htm">Farawa</a><a href="40/index.htm">Matiyu</a>`;
        expect(
            parseWordprojectIndex(
                html,
                'https://www.wordproject.org/bibles/new/hau/index.htm'
            ).map((b) => [b.bookId, b.url])
        ).toEqual([
            ['GEN', 'https://www.wordproject.org/bibles/new/hau/1/index.htm'],
            ['MAT', 'https://www.wordproject.org/bibles/new/hau/40/index.htm'],
        ]);
    });
});

describe('parseWordprojectChapterLinks()', () => {
    it('should include the current page and the linked chapters', () => {
        const html = chapterPage(
            '',
            '<span class="chapread">1</span> <a href="2.htm#0">2</a> <a href="3.htm#0">3</a> <a href="../42/24.htm#0">prev</a>'
        );
        expect(
            parseWordprojectChapterLinks(
                html,
                'https://www.wordproject.org/bibles/kj/43/1.htm'
            )
        ).toEqual([
            {
                number: 1,
                url: 'https://www.wordproject.org/bibles/kj/43/1.htm',
            },
            {
                number: 2,
                url: 'https://www.wordproject.org/bibles/kj/43/2.htm',
            },
            {
                number: 3,
                url: 'https://www.wordproject.org/bibles/kj/43/3.htm',
            },
        ]);
    });

    it('should support zero padded chapter pages', () => {
        const html = `<a href="C002.htm#0">2</a>`;
        expect(
            parseWordprojectChapterLinks(
                html,
                'https://www.wordproject.org/bibles/khmer/B43/C001.htm'
            ).map((c) => c.number)
        ).toEqual([1, 2]);
    });

    it('should not treat a chapter list page as a chapter', () => {
        const html = `<a href="../index.htm">Home</a><a href="1.htm#0">1</a><a href="2.htm#0">2</a>`;
        expect(
            parseWordprojectChapterLinks(
                html,
                'https://www.wordproject.org/bibles/new/hau/1/index.htm'
            ).map((c) => c.number)
        ).toEqual([1, 2]);
    });
});

describe('parseWordprojectChapter()', () => {
    it('should read verses when the first verse has no marker', () => {
        const html =
            chapterPage(`<!--... the Word of God:--><span class="dimver">
</span>
<p><!--span class="verse" id="1">1 </span-->In the beginning was the Word.
<br /><span class="verse" id="2">2 </span>The same was in the beginning with <span class="person">God</span>.
<br /><span class="verse" id="3">3 </span>All things were made by him.
</p>`);
        expect(parseWordprojectChapter(html)).toEqual({
            title: null,
            paragraphs: [
                [
                    { number: '1', text: 'In the beginning was the Word.' },
                    {
                        number: '2',
                        text: 'The same was in the beginning with God.',
                    },
                    { number: '3', text: 'All things were made by him.' },
                ],
            ],
        });
    });

    it('should read the chapter title and mark the words of Jesus', () => {
        const html = chapterPage(`<span class="dimver">A Psalm of David. </span>
<p>The LORD is my shepherd.
<br /><span class="verse" id="2">2 </span>He saith, <span class="word">Follow me. </span>
</p>`);
        const chapter = parseWordprojectChapter(html);
        expect(chapter.title).toBe('A Psalm of David.');
        expect(chapter.paragraphs[0][1]).toEqual({
            number: '2',
            text: 'He saith, \\wj Follow me.\\wj*',
        });
    });

    it('should keep verses that are split across paragraphs', () => {
        const html = chapterPage(`<p>First verse.
<br /><span class="verse" id="2">2 </span>Second</p>
<p>verse continued.
<br /><span class="verse" id="3">3 </span>Third.</p>`);
        const chapter = parseWordprojectChapter(html);
        expect(chapter.paragraphs).toEqual([
            [
                { number: '1', text: 'First verse.' },
                { number: '2', text: 'Second' },
            ],
            [
                { number: '2', text: 'verse continued.' },
                { number: '3', text: 'Third.' },
            ],
        ]);
        expect(
            createWordprojectUsfm('JHN', 'John', [{ number: 1, chapter }])
        ).toBe(
            '\\id JHN\n\\h John\n\\toc1 John\n\\toc2 John\n\\mt1 John\n\\c 1\n\\p\n\\v 1 First verse.\n\\v 2 Second\n\\p\nverse continued.\n\\v 3 Third.\n'
        );
    });

    it('should remove the numbers of the other versification when asked', () => {
        const html =
            chapterPage(`<span class="dimver"> (22-1) ^^Псалом Давида.^^ </span>
<p>Господь--Пастырь мой;
<br /><span class="verse" id="2">2 </span>(22-2) Он покоит меня</p>`);
        const chapter = parseWordprojectChapter(html, {
            stripAltVerseNumbers: true,
        });
        expect(chapter.title).toBe('Псалом Давида.');
        expect(chapter.paragraphs[0][1].text).toBe('Он покоит меня');
    });

    it('should return no paragraphs when the page has no text', () => {
        expect(parseWordprojectChapter(chapterPage('')).paragraphs).toEqual([]);
    });

    it('should throw when the page has no text body', () => {
        expect(() => parseWordprojectChapter('<html></html>')).toThrow(
            /textBody/
        );
    });
});

describe('createWordprojectUsfm()', () => {
    it('should write a hebrew subtitle for chapter titles', () => {
        expect(
            createWordprojectUsfm('PSA', 'Psalms', [
                {
                    number: 23,
                    chapter: {
                        title: 'A Psalm of David.',
                        paragraphs: [[{ number: '1', text: 'The LORD.' }]],
                    },
                },
            ])
        ).toContain('\\c 23\n\\d A Psalm of David.\n\\p\n\\v 1 The LORD.\n');
    });
});

describe('WORDPROJECT_TRANSLATIONS', () => {
    it('should have unique IDs and folders', () => {
        const ids = WORDPROJECT_TRANSLATIONS.map((t) => t.id);
        const paths = WORDPROJECT_TRANSLATIONS.map((t) => t.path);
        expect(new Set(ids).size).toBe(ids.length);
        expect(new Set(paths).size).toBe(paths.length);
    });

    it('should use 3 letter language codes', () => {
        for (const t of WORDPROJECT_TRANSLATIONS) {
            expect(t.language).toMatch(/^[a-z]{3}$/);
            expect(t.id.startsWith(`${t.language}_`)).toBe(true);
        }
    });
});

describe('selectWordprojectTranslations()', () => {
    it('should skip duplicates by default', () => {
        const selected = selectWordprojectTranslations({});
        expect(selected.some((t) => t.duplicateOf)).toBe(false);
        expect(selected.map((t) => t.id)).toContain('amh_wp');
    });

    it('should include duplicates when asked', () => {
        expect(
            selectWordprojectTranslations({ includeDuplicates: true })
        ).toHaveLength(WORDPROJECT_TRANSLATIONS.length);
    });

    it('should find translations by ID or folder', () => {
        expect(
            selectWordprojectTranslations({
                translations: ['kj', 'amh_wp', 'new/hau'],
            }).map((t) => t.id)
        ).toEqual(['eng_wpkjv', 'amh_wp', 'hau_wp']);
    });

    it('should throw for unknown translations', () => {
        expect(() =>
            selectWordprojectTranslations({ translations: ['nope'] })
        ).toThrow(/Unknown Wordproject translation "nope"/);
    });

    it('should filter to public domain texts', () => {
        const selected = selectWordprojectTranslations({
            includeDuplicates: true,
            publicDomainOnly: true,
        });
        expect(selected.length).toBeGreaterThan(0);
        expect(selected.every((t) => t.publicDomain)).toBe(true);
    });
});

describe('createWordprojectMetadata()', () => {
    it('should only set a license for public domain texts', () => {
        const kjv = WORDPROJECT_TRANSLATIONS.find((t) => t.path === 'kj')!;
        const amh = WORDPROJECT_TRANSLATIONS.find((t) => t.path === 'am')!;
        expect(createWordprojectMetadata(kjv).license?.publicDomain).toBe(true);
        expect(createWordprojectMetadata(amh)).toMatchObject({
            id: 'amh_wp',
            language: 'amh',
            direction: 'ltr',
            website: 'https://www.wordproject.org/bibles/am/index.htm',
            license: null,
        });
    });
});

describe('fetchWordprojectTranslations()', () => {
    let dir: string;
    const translation: WordprojectTranslation = {
        path: 'test',
        id: 'tst_wp',
        language: 'tst',
        name: 'Test Bible',
        englishName: 'Test Bible (Wordproject)',
        publicDomain: true,
    };
    const base = 'https://www.wordproject.org/bibles/test/';
    const pages: Record<string, string> = {
        [`${base}index.htm`]: `<a href="01/1.htm">Genesis</a><a href="43/1.htm">John</a>`,
        [`${base}01/1.htm`]: chapterPage(
            '<p>In the beginning.<br /><span class="verse" id="2">2 </span>And the earth.</p>',
            '<a href="2.htm#0">2</a>'
        ),
        [`${base}01/2.htm`]: chapterPage('<p>Thus the heavens.</p>'),
        [`${base}43/1.htm`]: chapterPage('<p>In the beginning was.</p>'),
    };

    let requests: string[];
    const fakeFetch = async (url: string) => {
        requests.push(url);
        const page = pages[url];
        return page
            ? new Response(page, { status: 200 })
            : new Response('missing', { status: 404, statusText: 'Not Found' });
    };

    beforeEach(async () => {
        dir = await mkdtemp(path.join(tmpdir(), 'wordproject-'));
        requests = [];
    });

    afterEach(async () => {
        await rm(dir, { recursive: true, force: true });
    });

    it('should write USFM files and metadata that can be imported', async () => {
        const out = path.join(dir, 'out');
        const downloaded = await fetchWordprojectTranslations(out, {
            catalog: [translation],
            fetch: fakeFetch,
        });
        expect(downloaded).toEqual(['tst_wp']);
        expect((await readdir(out)).sort()).toEqual(['tst_wp']);
        expect((await readdir(path.join(out, 'tst_wp'))).sort()).toEqual([
            'gen.usfm',
            'jhn.usfm',
            'metadata.json',
            WORDPROJECT_MARKER_FILE,
        ]);
        expect(
            await readFile(path.join(out, 'tst_wp', 'gen.usfm'), 'utf-8')
        ).toBe(
            '\\id GEN\n\\h Genesis\n\\toc1 Genesis\n\\toc2 Genesis\n\\mt1 Genesis\n\\c 1\n\\p\n\\v 1 In the beginning.\n\\v 2 And the earth.\n\\c 2\n\\p\n\\v 1 Thus the heavens.\n'
        );
        const metadata = JSON.parse(
            await readFile(path.join(out, 'tst_wp', 'metadata.json'), 'utf-8')
        );
        expect(metadata).toMatchObject({
            id: 'tst_wp',
            shortName: 'TST_WP',
            license: { publicDomain: true },
        });
        // The partial directory is emptied.
        expect(await readdir(`${out}.partial`)).toEqual([]);
    });

    it('should skip translations that were already downloaded', async () => {
        const out = path.join(dir, 'out');
        await fetchWordprojectTranslations(out, {
            catalog: [translation],
            fetch: fakeFetch,
        });
        requests = [];
        expect(
            await fetchWordprojectTranslations(out, {
                catalog: [translation],
                fetch: fakeFetch,
            })
        ).toEqual([]);
        expect(requests).toEqual([]);
    });

    it('should continue an interrupted download', async () => {
        const out = path.join(dir, 'out');
        const partial = path.join(`${out}.partial`, 'tst_wp');
        await mkdir(partial, { recursive: true });
        await writeFile(path.join(partial, 'gen.usfm'), '\\id GEN\n');
        await fetchWordprojectTranslations(out, {
            catalog: [translation],
            fetch: fakeFetch,
        });
        expect(requests).not.toContain(`${base}01/1.htm`);
        expect(
            await readFile(path.join(out, 'tst_wp', 'gen.usfm'), 'utf-8')
        ).toBe('\\id GEN\n');
    });

    it('should keep the downloaded books when a page fails', async () => {
        const out = path.join(dir, 'out');
        const failing = async (url: string) =>
            url.endsWith('43/1.htm')
                ? new Response('', { status: 404, statusText: 'Not Found' })
                : fakeFetch(url);
        await expect(
            fetchWordprojectTranslations(out, {
                catalog: [translation],
                fetch: failing,
            })
        ).rejects.toThrow(/tst_wp/);
        expect(existsSync(path.join(out, 'tst_wp'))).toBe(false);
        expect(await readdir(path.join(`${out}.partial`, 'tst_wp'))).toEqual([
            'gen.usfm',
        ]);
    });
});
