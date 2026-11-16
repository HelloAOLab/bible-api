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
import {
    TextReader,
    Uint8ArrayWriter,
    ZipWriter,
    configure,
} from '@zip.js/zip.js';
import { DOMParser, Element, Node } from 'linkedom';
import { USXParser } from '@helloao/tools/parser/usx-parser.js';
import path from 'node:path';
import {
    createWordprojectMetadata,
    createWordprojectUsx,
    getWordprojectVerseText,
    getWordprojectZipUrl,
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

configure({ useWebWorkers: false });

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
            emptyVerses: [],
            paragraphs: [
                [
                    {
                        number: '1',
                        content: [{ text: 'In the beginning was the Word.' }],
                    },
                    {
                        number: '2',
                        content: [
                            { text: 'The same was in the beginning with God.' },
                        ],
                    },
                    {
                        number: '3',
                        content: [{ text: 'All things were made by him.' }],
                    },
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
            content: [
                { text: 'He saith, ' },
                { text: 'Follow me.', wordsOfJesus: true },
            ],
        });
    });

    it('should keep verses that are split across paragraphs', () => {
        const html = chapterPage(`<p>First verse.
<br /><span class="verse" id="2">2 </span>Second</p>
<p>verse continued.
<br /><span class="verse" id="3">3 </span>Third.</p>`);
        const chapter = parseWordprojectChapter(html);
        expect(
            chapter.paragraphs.map((p) =>
                p.map((v) => [v.number, getWordprojectVerseText(v)])
            )
        ).toEqual([
            [
                ['1', 'First verse.'],
                ['2', 'Second'],
            ],
            [
                ['2', 'verse continued.'],
                ['3', 'Third.'],
            ],
        ]);
        expect(
            createWordprojectUsx('JHN', 'John', [{ number: 1, chapter }])
        ).toContain(
            [
                '  <chapter number="1" style="c" sid="JHN 1" />',
                '  <para style="p"><verse number="1" style="v" sid="JHN 1:1" />First verse.<verse eid="JHN 1:1" /> <verse number="2" style="v" sid="JHN 1:2" />Second</para>',
                '  <para style="p">verse continued.<verse eid="JHN 1:2" /> <verse number="3" style="v" sid="JHN 1:3" />Third.<verse eid="JHN 1:3" /></para>',
                '  <chapter eid="JHN 1" />',
            ].join('\n')
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
        expect(getWordprojectVerseText(chapter.paragraphs[0][1])).toBe(
            'Он покоит меня'
        );
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

describe('createWordprojectUsx()', () => {
    const psalm = {
        title: 'A Psalm of <David> & "Asaph".',
        emptyVerses: [],
        paragraphs: [
            [
                {
                    number: '1',
                    content: [
                        { text: 'He said, ' },
                        { text: 'Follow me.', wordsOfJesus: true },
                    ],
                },
            ],
        ],
    };

    it('should write a USX 3.0 book', () => {
        expect(
            createWordprojectUsx('PSA', 'Psalms', [
                { number: 23, chapter: psalm },
            ])
        ).toBe(
            [
                '<?xml version="1.0" encoding="utf-8"?>',
                '<usx version="3.0">',
                '  <book code="PSA" style="id" />',
                '  <para style="h">Psalms</para>',
                '  <para style="toc1">Psalms</para>',
                '  <para style="toc2">Psalms</para>',
                '  <para style="mt1">Psalms</para>',
                '  <chapter number="23" style="c" sid="PSA 23" />',
                '  <para style="d">A Psalm of &lt;David&gt; &amp; &quot;Asaph&quot;.</para>',
                '  <para style="p"><verse number="1" style="v" sid="PSA 23:1" />He said, <char style="wj">Follow me.</char><verse eid="PSA 23:1" /></para>',
                '  <chapter eid="PSA 23" />',
                '</usx>',
                '',
            ].join('\n')
        );
    });

    it('should be readable by the USX parser', () => {
        // The parser uses the DOM globals, like import-translations sets them up.
        globalThis.DOMParser = DOMParser as any;
        globalThis.Element = Element as any;
        globalThis.Node = Node as any;
        const parser = new USXParser(new DOMParser() as any);
        const tree = parser.parse(
            createWordprojectUsx('PSA', 'Psalms', [
                { number: 23, chapter: psalm },
            ])
        );
        expect(tree.id).toBe('PSA');
        expect(tree.header).toBe('Psalms');
        const chapter = tree.content.find((c) => c.type === 'chapter') as any;
        expect(chapter.number).toBe(23);
        expect(JSON.stringify(chapter.content)).toContain('Follow me.');
        expect(
            chapter.content.some((c: any) => c.type === 'hebrew_subtitle')
        ).toBe(true);
        expect(
            chapter.content.some(
                (c: any) => c.type === 'verse' && c.number === 1
            )
        ).toBe(true);
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

    it('should write USX files and metadata that can be imported', async () => {
        const out = path.join(dir, 'out');
        const downloaded = await fetchWordprojectTranslations(out, {
            catalog: [translation],
            fetch: fakeFetch,
        });
        expect(downloaded).toEqual(['tst_wp']);
        expect((await readdir(out)).sort()).toEqual(['tst_wp']);
        expect((await readdir(path.join(out, 'tst_wp'))).sort()).toEqual([
            'gen.usx',
            'jhn.usx',
            'metadata.json',
            WORDPROJECT_MARKER_FILE,
        ]);
        const gen = await readFile(
            path.join(out, 'tst_wp', 'gen.usx'),
            'utf-8'
        );
        expect(gen).toContain('<book code="GEN" style="id" />');
        expect(gen).toContain('<para style="h">Genesis</para>');
        expect(gen).toContain(
            '<para style="p"><verse number="1" style="v" sid="GEN 1:1" />In the beginning.<verse eid="GEN 1:1" /> <verse number="2" style="v" sid="GEN 1:2" />And the earth.<verse eid="GEN 1:2" /></para>'
        );
        expect(gen).toContain(
            '<chapter number="2" style="c" sid="GEN 2" />\n  <para style="p"><verse number="1" style="v" sid="GEN 2:1" />Thus the heavens.<verse eid="GEN 2:1" /></para>'
        );
        expect(
            await readFile(
                path.join(out, 'tst_wp', WORDPROJECT_MARKER_FILE),
                'utf-8'
            )
        ).toBe(`Source: ${base}index.htm\n`);
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
        await writeFile(path.join(partial, 'gen.usx'), '<usx />');
        await fetchWordprojectTranslations(out, {
            catalog: [translation],
            fetch: fakeFetch,
        });
        expect(requests).not.toContain(`${base}01/1.htm`);
        expect(
            await readFile(path.join(out, 'tst_wp', 'gen.usx'), 'utf-8')
        ).toBe('<usx />');
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
            'gen.usx',
        ]);
    });

    it('should read the pages from the zip download when there is one', async () => {
        const writer = new ZipWriter(new Uint8ArrayWriter());
        for (const [url, page] of Object.entries(pages)) {
            // Leave a page out to check that it is downloaded from the website instead.
            if (url.endsWith('01/2.htm')) continue;
            await writer.add(
                `test_new/${url.slice(base.length)}`,
                new TextReader(page)
            );
        }
        await writer.add('test_new/_assets/x.css', new TextReader('body {}'));
        const zip = await writer.close();
        const zipUrl = getWordprojectZipUrl(translation);
        expect(zipUrl).toBe(
            'https://www.wordpocket.org/bibles/download_zip/test_new.zip'
        );

        const out = path.join(dir, 'out');
        await fetchWordprojectTranslations(out, {
            catalog: [translation],
            fetch: async (url) =>
                url === zipUrl
                    ? (requests.push(url), new Response(zip))
                    : fakeFetch(url),
        });
        expect(requests).toEqual([zipUrl, `${base}01/2.htm`]);
        expect(
            await readFile(
                path.join(out, 'tst_wp', WORDPROJECT_MARKER_FILE),
                'utf-8'
            )
        ).toBe(`Source: ${zipUrl}\n`);
        expect(
            await readFile(path.join(out, 'tst_wp', 'gen.usx'), 'utf-8')
        ).toContain('Thus the heavens.');
    });

    it('should download every page from the website when asked', async () => {
        const out = path.join(dir, 'out');
        await fetchWordprojectTranslations(out, {
            catalog: [translation],
            fetch: fakeFetch,
            zip: false,
        });
        expect(requests).not.toContain(getWordprojectZipUrl(translation));
    });

    it('should skip chapters that are linked but do not exist', async () => {
        const out = path.join(dir, 'out');
        const broken: Record<string, string> = {
            ...pages,
            [`${base}43/1.htm`]: chapterPage(
                '<p>In the beginning was.</p>',
                '<a href="3.htm#0">3</a>'
            ),
        };
        await fetchWordprojectTranslations(out, {
            catalog: [translation],
            fetch: async (url) =>
                broken[url]
                    ? new Response(broken[url])
                    : new Response('', {
                          status: 404,
                          statusText: 'Not Found',
                      }),
        });
        const jhn = await readFile(
            path.join(out, 'tst_wp', 'jhn.usx'),
            'utf-8'
        );
        expect(jhn).toContain('sid="JHN 1"');
        expect(jhn).not.toContain('sid="JHN 3"');
    });

    it('should use the website for chapters that are incomplete in the zip', async () => {
        const writer = new ZipWriter(new Uint8ArrayWriter());
        for (const [url, page] of Object.entries(pages)) {
            await writer.add(
                `test_new/${url.slice(base.length)}`,
                new TextReader(
                    url.endsWith('01/2.htm')
                        ? chapterPage(
                              '<p>Thus the heavens.<br /><span class="verse" id="2">2 </span></p>'
                          )
                        : page
                )
            );
        }
        const zip = await writer.close();
        const zipUrl = getWordprojectZipUrl(translation);
        const website: Record<string, string> = {
            ...pages,
            [`${base}01/2.htm`]: chapterPage(
                '<p>Thus the heavens.<br /><span class="verse" id="2">2 </span>And on the seventh day.</p>'
            ),
        };

        const out = path.join(dir, 'out');
        await fetchWordprojectTranslations(out, {
            catalog: [translation],
            fetch: async (url) => {
                requests.push(url);
                return url === zipUrl
                    ? new Response(zip)
                    : new Response(website[url]);
            },
        });
        expect(requests).toEqual([zipUrl, `${base}01/2.htm`]);
        expect(
            await readFile(path.join(out, 'tst_wp', 'gen.usx'), 'utf-8')
        ).toContain('And on the seventh day.');
    });

    it('should list the verses that have no text', () => {
        const chapter = parseWordprojectChapter(
            chapterPage(
                '<p>One.<br /><span class="verse" id="2">2 </span><br /><span class="verse" id="3">3 </span>Three.</p>'
            )
        );
        expect(chapter.emptyVerses).toEqual(['2']);
    });

    it('should skip chapter pages that have no text body', async () => {
        const out = path.join(dir, 'out');
        const broken: Record<string, string> = {
            ...pages,
            [`${base}01/2.htm`]: '',
        };
        await fetchWordprojectTranslations(out, {
            catalog: [translation],
            fetch: async (url) =>
                broken[url] !== undefined
                    ? new Response(broken[url])
                    : new Response('', {
                          status: 404,
                          statusText: 'Not Found',
                      }),
        });
        const gen = await readFile(
            path.join(out, 'tst_wp', 'gen.usx'),
            'utf-8'
        );
        expect(gen).toContain('sid="GEN 1"');
        expect(gen).not.toContain('sid="GEN 2"');
    });

    it('should use the website for zip pages that cannot be read', async () => {
        const writer = new ZipWriter(new Uint8ArrayWriter());
        for (const [url, page] of Object.entries(pages)) {
            await writer.add(
                `test_new/${url.slice(base.length)}`,
                new TextReader(
                    url.endsWith('01/2.htm') ? '<html></html>' : page
                )
            );
        }
        const zip = await writer.close();
        const zipUrl = getWordprojectZipUrl(translation);
        const out = path.join(dir, 'out');
        await fetchWordprojectTranslations(out, {
            catalog: [translation],
            fetch: async (url) => {
                requests.push(url);
                return url === zipUrl
                    ? new Response(zip)
                    : new Response(pages[url]);
            },
        });
        expect(requests).toEqual([zipUrl, `${base}01/2.htm`]);
        expect(
            await readFile(path.join(out, 'tst_wp', 'gen.usx'), 'utf-8')
        ).toContain('Thus the heavens.');
    });
});
