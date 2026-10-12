import {
    BSB_INTERLINEAR_DATASET,
    STEPBIBLE_LEXICON_DATASET,
    cleanGloss,
    generateDatasetsFromInterlinear,
    markupToText,
    normalizeStrongs,
    parseBerean,
    parseLexicon,
} from './interlinear.js';
import { generateApiForDataset, generateFilesForApi } from './api.js';
import { bookOrderMap } from './book-order.js';
import { DatasetOutput } from './dataset.js';

const HEADER = Array.from({ length: 23 }, (_, i) => `c${i}`).join('\t');

// One Berean row: only the columns the parser reads are named.
function row({
    heb = 0,
    grk = 0,
    bsb = 0,
    lang = 'Hebrew',
    text = '',
    translit = '',
    parsing = '',
    full = '',
    sh = '',
    sg = '',
    ref = '',
    gloss = '',
}) {
    const c = Array(23).fill('');
    Object.assign(c, {
        0: String(heb),
        1: String(grk),
        2: String(bsb),
        3: '1',
        4: lang,
        5: text,
        6: text,
        7: translit,
        8: parsing,
        9: full,
        10: sh,
        11: sg,
        12: ref,
        18: ` ${gloss} `,
    });
    return c.join('\t');
}

const table = (...rows: string[]) => [HEADER, ...rows].join('\n');

// Gen 1:1 as the table lists it: BSB order, with the original-order rank in column 0.
const GEN_1_1 = [
    row({
        heb: 1,
        bsb: 1,
        text: 'בְּרֵאשִׁ֖ית',
        translit: 'bə·rê·šîṯ',
        parsing: 'Prep-b | N-fs',
        sh: '7225',
        ref: 'Genesis 1:1',
        gloss: 'In the beginning',
    }),
    row({
        heb: 3,
        bsb: 2,
        text: 'אֱלֹהִ֑ים',
        translit: '’ĕ·lō·hîm',
        parsing: 'N-mp',
        sh: '430',
        gloss: 'God',
    }),
    row({
        heb: 4,
        bsb: 3,
        text: 'אֵ֥ת',
        translit: '’êṯ',
        parsing: 'DirObjM',
        full: 'Direct object marker',
        sh: '853',
        gloss: '-',
    }),
    row({
        heb: 2,
        bsb: 4,
        text: 'בָּרָ֣א',
        translit: 'bā·rā',
        parsing: 'V-Qal-Perf-3ms',
        sh: '1254',
        gloss: 'created',
    }),
    row({ heb: 8, bsb: 5, lang: 'Hebrew' }),
    row({ heb: 9, bsb: 6, lang: 'Hebrew', gloss: 'vvv' }),
];

// The USFM IDs in canonical order, which is the order the Berean table lists its books in.
const BOOKS = [...bookOrderMap.entries()]
    .sort((a, b) => a[1] - b[1])
    .slice(0, 66)
    .map(([id]) => id);

// Rows that make a table cover `count` books, so the book names before Daniel or John don't matter.
function padBooks(count: number) {
    return BOOKS.slice(0, count).map((_, i) =>
        row({
            heb: 1,
            bsb: 1,
            text: 'א',
            sh: '1',
            ref: `Book${i} 1:1`,
            gloss: 'x',
        })
    );
}

describe('normalizeStrongs()', () => {
    it('should pad and prefix by language', () => {
        expect(normalizeStrongs('430', 'hebrew')).toBe('H0430');
        expect(normalizeStrongs('4430', 'aramaic')).toBe('H4430');
        expect(normalizeStrongs('26', 'greek')).toBe('G0026');
    });

    it('should return null for a missing number', () => {
        expect(normalizeStrongs('', 'hebrew')).toBeNull();
        expect(normalizeStrongs(undefined, 'greek')).toBeNull();
    });
});

describe('cleanGloss()', () => {
    it('should null untranslated and marker-only cells', () => {
        expect(cleanGloss(' - ')).toBeNull();
        expect(cleanGloss(' vvv ')).toBeNull();
        expect(cleanGloss('  ')).toBeNull();
    });

    it('should drop the vvv marker inside a phrase', () => {
        expect(cleanGloss(' vvv him ')).toBe('him');
        expect(cleanGloss(' In the beginning ')).toBe('In the beginning');
    });
});

describe('parseBerean()', () => {
    it('should order Gen 1:1 words in the original order and keep the BSB order', () => {
        const { verses, books } = parseBerean(table(...GEN_1_1));
        expect(books).toEqual(['Genesis']);
        expect(verses).toHaveLength(1);
        const v = verses[0];
        expect([v.book, v.chapter, v.verse]).toEqual(['GEN', 1, 1]);
        // placeholders dropped
        expect(v.words).toHaveLength(4);
        expect(v.words.map((w) => w.gloss)).toEqual([
            'In the beginning',
            'created',
            'God',
            null,
        ]);
        expect(v.words.map((w) => w.pos)).toEqual([1, 2, 3, 4]);
        expect(v.words.map((w) => w.bsbPos)).toEqual([1, 4, 2, 3]);
        expect(v.words[2]).toMatchObject({
            language: 'hebrew',
            strongs: 'H0430',
            transliteration: '’ĕ·lō·hîm',
            parsing: 'N-mp',
        });
    });

    it('should keep the untranslated direct-object marker with a null gloss and its parsing', () => {
        const [v] = parseBerean(table(...GEN_1_1)).verses;
        const marker = v.words.find((w) => w.strongs === 'H0853');
        expect(marker).toMatchObject({
            gloss: null,
            parsing: 'DirObjM',
            parsingFull: 'Direct object marker',
        });
    });

    it('should rank words by fractional sort keys', () => {
        const { verses } = parseBerean(
            table(
                row({
                    heb: 2,
                    bsb: 1,
                    text: 'ב',
                    sh: '2',
                    ref: 'Genesis 1:1',
                    gloss: 'b',
                }),
                row({ heb: 1.5, bsb: 2.5, text: 'ג', sh: '3', gloss: 'c' }),
                row({ heb: 1, bsb: 2, text: 'א', sh: '1', gloss: 'a' })
            )
        );
        expect(verses[0].words.map((w) => [w.text, w.pos, w.bsbPos])).toEqual([
            ['א', 1, 2],
            ['ג', 2, 3],
            ['ב', 3, 1],
        ]);
    });

    it('should carry the verse reference forward and split verses', () => {
        const text = table(
            row({
                heb: 1,
                bsb: 1,
                text: 'א',
                sh: '1',
                ref: 'Genesis 1:1',
                gloss: 'a',
            }),
            row({
                heb: 1,
                bsb: 2,
                text: 'ב',
                sh: '2',
                ref: 'Genesis 1:2',
                gloss: 'b',
            }),
            row({ heb: 2, bsb: 3, text: 'ג', sh: '3', gloss: 'c' })
        );
        const { verses } = parseBerean(text);
        expect(verses.map((v) => [v.verse, v.words.length])).toEqual([
            [1, 1],
            [2, 2],
        ]);
    });

    it('should switch language mid-verse in Daniel 2:4', () => {
        const rows = [
            row({
                heb: 1,
                bsb: 1,
                text: 'וַֽיְדַבְּר֧וּ',
                sh: '1696',
                ref: 'Daniel 2:4',
                gloss: 'answered',
            }),
            row({
                heb: 2,
                bsb: 2,
                text: 'אֲרָמִ֑ית',
                sh: '762',
                gloss: 'in Aramaic',
            }),
            row({
                heb: 3,
                bsb: 3,
                lang: 'Aramaic',
                text: 'מַלְכָּא֙',
                sh: '4430',
                gloss: 'O king',
            }),
        ];
        // Daniel is the 27th book: pad the table with the books before it.
        const daniel = parseBerean(table(...padBooks(26), ...rows)).verses.at(
            -1
        )!;
        expect(daniel.book).toBe('DAN');
        expect(daniel.words.map((w) => w.language)).toEqual([
            'hebrew',
            'hebrew',
            'aramaic',
        ]);
        expect(daniel.words[2].strongs).toBe('H4430');
    });

    it('should use the Greek sort and Greek Strong’s for Greek rows (John 1:1)', () => {
        const john = [
            row({
                heb: 999999,
                grk: 78168,
                bsb: 1,
                lang: 'Greek',
                text: 'Ἐν',
                sg: '1722',
                ref: 'John 1:1',
                gloss: 'In',
            }),
            row({
                heb: 999999,
                grk: 78169,
                bsb: 2,
                lang: 'Greek',
                text: 'ἀρχῇ',
                sg: '746',
                gloss: '[the] beginning',
            }),
        ];
        // John is the 43rd book.
        const v = parseBerean(table(...padBooks(42), ...john)).verses.at(-1)!;
        expect(v.book).toBe('JHN');
        expect(
            v.words.map((w) => [w.text, w.language, w.strongs, w.pos])
        ).toEqual([
            ['Ἐν', 'greek', 'G1722', 1],
            ['ἀρχῇ', 'greek', 'G0746', 2],
        ]);
    });

    it('should NFC-normalize the original text', () => {
        const [v] = parseBerean(
            table(
                row({
                    heb: 1,
                    bsb: 1,
                    text: '\u03b1\u0301',
                    sh: '1',
                    ref: 'Genesis 1:1',
                    gloss: 'a',
                })
            )
        ).verses;
        expect(v.words[0].text).toBe('ά');
    });

    it('should leave strongs null for words the table has no number for', () => {
        const [v] = parseBerean(
            table(
                row({
                    heb: 1,
                    bsb: 1,
                    text: 'בּ֥וֹ',
                    ref: 'Genesis 1:29',
                    gloss: '...',
                })
            )
        ).verses;
        expect(v.words[0].strongs).toBeNull();
    });

    it('should reject a malformed row', () => {
        expect(() => parseBerean(`${HEADER}\nonly\ttwo`)).toThrow(
            /line 2: expected 23 columns/
        );
    });

    it('should reject a word before any verse reference', () => {
        expect(() =>
            parseBerean(table(row({ heb: 1, bsb: 1, text: 'א', sh: '1' })))
        ).toThrow(/line 2: word before any verse reference/);
    });

    it('should reject an unknown language', () => {
        expect(() =>
            parseBerean(
                table(
                    row({
                        heb: 1,
                        bsb: 1,
                        lang: 'Latin',
                        text: 'a',
                        ref: 'Genesis 1:1',
                    })
                )
            )
        ).toThrow(/Latin/);
    });
});

const lex = (
    id: string,
    lemma: string,
    morph: string,
    gloss: string,
    meaning: string,
    extra: string = '='
) =>
    [
        id.replace(/[A-Z]$/, ''),
        `${id} ${extra}`,
        id,
        lemma,
        'tr',
        morph,
        gloss,
        meaning,
    ].join('\t');

describe('markupToText()', () => {
    it('should turn line breaks into paragraphs and drop tags', () => {
        expect(
            markupToText('1) father<br>2) of God<BR>Also means: <i>av</i> (x)')
        ).toBe('1) father\n\n2) of God\n\nAlso means: av (x)');
        expect(
            markupToText(
                " <b>λόγος</b>, -ου <BR /> [in LXX] <ref='Mat.8.8'>Mat.8:8</ref>"
            )
        ).toBe('λόγος, -ου\n\n[in LXX] Mat.8:8');
    });
});

describe('parseLexicon()', () => {
    const text = [
        'eStrong#\tdStrong\tuStrong\tHebrew\tTransliteration\tMorph\tGloss\tMeaning',
        lex(
            'H0430G',
            'אֱלֹהִים',
            'H:N-M',
            'God',
            'This name means "gods"<BR>Another name of <i>x</i>',
            '= a Name of'
        ),
        lex(
            'H0430H',
            'אֱלֹהִים',
            'H:N-M',
            '(LORD)-Elohe',
            '<BR>Combined with <i>y</i>',
            '= a Part of'
        ),
        lex(
            'H4430',
            'מֶ֫לֶךְ',
            'A:N-M',
            'king',
            'king<BR>Aramaic of x',
            '= in Aramaic of'
        ),
        lex('H0175', 'אַהֲרוֹן', 'N:N-M-P', 'Aaron', 'Aaron'),
        lex('G3056', 'λόγος', 'G:N-M', 'word', ' <b>λόγος</b> '),
        lex('G4461', 'ῥαββί', 'H:N', 'Rabbi', 'Rabbi'),
        lex('G20001', 'ἀβατόομαι', '', 'be made desert', 'LSJ only'),
        'not a data row',
    ].join('\n');
    const entries = parseLexicon(text);

    it('should keep both H0430 senses with extended ids', () => {
        const god = entries.filter((e) => e.strongs === 'H0430');
        expect(god.map((e) => e.id)).toEqual(['H0430G', 'H0430H']);
        expect(god[0]).toMatchObject({
            language: 'hebrew',
            gloss: 'God',
            partOfSpeech: 'N-M',
            transliteration: 'tr',
        });
        expect(god[0].definition).toBe(
            'This name means "gods"\n\nAnother name of x'
        );
        expect(god[1].definition).toBe('Combined with y');
    });

    it('should mark Aramaic from the morph prefix', () => {
        expect(entries.find((e) => e.strongs === 'H4430')).toMatchObject({
            id: 'H4430',
            language: 'aramaic',
        });
    });

    it('should fall back to the id prefix for names and Greek entries', () => {
        expect(entries.find((e) => e.id === 'H0175')!.language).toBe('hebrew');
        expect(entries.find((e) => e.id === 'G3056')).toMatchObject({
            language: 'greek',
            lemma: 'λόγος',
        });
        expect(entries.find((e) => e.id === 'G4461')!.language).toBe('greek');
    });

    it('should drop LSJ-only ids with no Strong’s number', () => {
        expect(entries.find((e) => e.id === 'G20001')).toBeUndefined();
    });

    it('should skip header and prose lines', () => {
        expect(entries).toHaveLength(6);
    });

    it('should reject duplicate sense ids', () => {
        const dup = [
            lex('H0001G', 'אָב', 'H:N-M', 'father', 'father'),
            lex('H0001G', 'אָב', 'H:N-M', 'father', 'father'),
        ].join('\n');
        expect(() => parseLexicon(dup)).toThrow(/H0001G/);
    });
});

describe('generateDatasetsFromInterlinear()', () => {
    // A full-length table: Genesis 1:1 followed by one single-word verse in each other book.
    function createBerean(): string {
        const rest = BOOKS.slice(1).map((_, i) =>
            row({
                heb: 1,
                bsb: 1,
                text: 'א',
                sh: '1',
                ref: `Book${i + 1} 1:1`,
                gloss: 'x',
            })
        );
        const gen2 = row({
            heb: 1,
            bsb: 1,
            text: 'ב',
            sh: '2',
            ref: 'Genesis 2:1',
            gloss: 'b',
        });
        // Genesis 2:1 is listed after the other books to check that it is grouped back under Genesis.
        return table(...GEN_1_1, ...rest, gen2);
    }

    const TBESH = [
        lex('H0001G', 'אָב', 'H:N-M', 'father', 'father'),
        lex('H0001H', 'אָב', 'H:N-M', 'father (of)', 'father of'),
        lex('H0001I', 'אָב', 'H:N-M', 'Abba', 'Abba'),
        lex('H0430G', 'אֱלֹהִים', 'H:N-M', 'God', 'God<br>gods'),
    ].join('\n');
    const TBESG = [
        lex('G3056', 'λόγος', 'G:N-M', 'word', 'word<br>reason'),
        lex('G20001', 'ἀβατόομαι', '', 'be made desert', 'LSJ only'),
    ].join('\n');

    function create() {
        return generateDatasetsFromInterlinear({
            berean: createBerean(),
            tbesh: TBESH,
            tbesg: TBESG,
        });
    }

    it('should generate the interlinear and lexicon datasets with their metadata', () => {
        const [interlinear, lexicon] = create();
        expect(interlinear).toMatchObject({
            ...BSB_INTERLINEAR_DATASET,
            id: 'bsb-interlinear',
        });
        expect(lexicon).toMatchObject({
            ...STEPBIBLE_LEXICON_DATASET,
            id: 'stepbible-lexicon',
            licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
            books: [],
        });
        expect(lexicon.licenseNotes).toContain('STEPBible.org');
    });

    it('should generate 66 books with the words of each verse', () => {
        const [interlinear] = create();
        expect(interlinear.books).toHaveLength(66);
        expect(interlinear.books[0].id).toBe('GEN');
        expect(interlinear.books[65].id).toBe('REV');

        const gen = interlinear.books[0];
        expect(gen.chapters.map((c) => c.chapter.number)).toEqual([1, 2]);

        const verse = gen.chapters[0].chapter.content[0] as any;
        expect(verse.verse).toBe(1);
        expect(verse.words[0]).toEqual({
            pos: 1,
            bsbPos: 1,
            language: 'hebrew',
            text: 'בְּרֵאשִׁ֖ית',
            transliteration: 'bə·rê·šîṯ',
            parsing: 'Prep-b | N-fs',
            parsingFull: null,
            strongs: 'H7225',
            gloss: 'In the beginning',
        });
        expect(verse.words[1]).toMatchObject({
            strongs: 'H1254',
            gloss: 'created',
        });
    });

    it('should reject a table that does not cover 66 books', () => {
        expect(() =>
            generateDatasetsFromInterlinear({
                berean: table(...GEN_1_1),
                tbesh: TBESH,
                tbesg: TBESG,
            })
        ).toThrow(/1 books, expected 66/);
    });

    it('should group lexicon senses under their base number in id order', () => {
        const [, lexicon] = create();
        expect(lexicon.lexicon!.map((e) => e.id)).toEqual([
            'G3056',
            'H0001',
            'H0430',
        ]);

        const abba = lexicon.lexicon![1];
        expect(abba.language).toBe('hebrew');
        expect(abba.senses.map((s) => s.id)).toEqual([
            'H0001G',
            'H0001H',
            'H0001I',
        ]);
        expect(abba.senses[0].gloss).toBe('father');

        expect(lexicon.lexicon![2]).toEqual({
            id: 'H0430',
            language: 'hebrew',
            senses: [
                {
                    id: 'H0430G',
                    language: 'hebrew',
                    lemma: 'אֱלֹהִים',
                    transliteration: 'tr',
                    partOfSpeech: 'N-M',
                    gloss: 'God',
                    definition: 'God\n\ngods',
                },
            ],
        });
    });

    it('should be deterministic', () => {
        expect(create()).toEqual(create());
    });

    describe('generateApiForDataset()', () => {
        function createDatasetOutput(): DatasetOutput {
            return {
                translations: [],
                commentaries: [],
                datasets: create(),
            };
        }

        it('should list both datasets in available datasets', () => {
            const api = generateApiForDataset(createDatasetOutput());

            expect(api.availableDatasets?.datasets).toMatchObject([
                {
                    id: 'bsb-interlinear',
                    listOfBooksApiLink: '/api/d/bsb-interlinear/books.json',
                    numberOfBooks: 66,
                    totalNumberOfChapters: 67,
                    totalNumberOfWords: 4 + 66,
                },
                {
                    id: 'stepbible-lexicon',
                    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
                    listOfLexiconApiLink:
                        '/api/d/stepbible-lexicon/lexicon.json',
                    totalNumberOfLexicon: 3,
                },
            ]);
            const [interlinear, lexicon] = api.availableDatasets!.datasets;
            expect(interlinear.listOfLexiconApiLink).toBeUndefined();
            expect(lexicon.totalNumberOfWords).toBeUndefined();
        });

        it('should generate chapters with the stored words', () => {
            const output = createDatasetOutput();
            const api = generateApiForDataset(output);
            const files = generateFilesForApi(api);

            const chapter = api.datasetBookChapters!.find(
                (c) => c.thisChapterLink === '/api/d/bsb-interlinear/GEN/1.json'
            )!;
            expect(chapter).toBeDefined();
            expect(chapter.chapter).toEqual(
                output.datasets![0].books[0].chapters[0].chapter
            );
            expect((chapter.chapter.content[0] as any).words[1]).toMatchObject({
                strongs: 'H1254',
                gloss: 'created',
            });
            expect(files.map((f) => f.path)).toContain(
                '/api/d/bsb-interlinear/GEN/1.json'
            );
            expect(
                files.find(
                    (f) => f.path === '/api/d/bsb-interlinear/books.json'
                )
            ).toBeDefined();
        });

        it('should generate the lexicon list and entries', () => {
            const api = generateApiForDataset(createDatasetOutput());

            expect(api.datasetLexicon).toHaveLength(1);
            expect(api.datasetLexicon![0].lexicon).toEqual([
                {
                    id: 'G3056',
                    language: 'greek',
                    name: 'λόγος',
                    apiLink: '/api/d/stepbible-lexicon/lexicon/G3056.json',
                },
                {
                    id: 'H0001',
                    language: 'hebrew',
                    name: 'אָב',
                    apiLink: '/api/d/stepbible-lexicon/lexicon/H0001.json',
                },
                {
                    id: 'H0430',
                    language: 'hebrew',
                    name: 'אֱלֹהִים',
                    apiLink: '/api/d/stepbible-lexicon/lexicon/H0430.json',
                },
            ]);

            expect(api.datasetLexiconContents).toHaveLength(3);
            expect(api.datasetLexiconContents![1]).toMatchObject({
                entry: { id: 'H0001', language: 'hebrew' },
                thisLexiconEntryApiLink:
                    '/api/d/stepbible-lexicon/lexicon/H0001.json',
            });
            expect(
                api.datasetLexiconContents![1].entry.senses.map((s) => s.id)
            ).toEqual(['H0001G', 'H0001H', 'H0001I']);
        });

        it('should generate files for the lexicon endpoints', () => {
            const api = generateApiForDataset(createDatasetOutput());
            const files = generateFilesForApi(api);
            const paths = files.map((f) => f.path);

            expect(paths).toContain('/api/d/stepbible-lexicon/lexicon.json');
            expect(paths).toContain(
                '/api/d/stepbible-lexicon/lexicon/H0430.json'
            );
            expect(paths).toContain(
                '/api/d/stepbible-lexicon/lexicon/G3056.json'
            );
        });

        it('should respect the path prefix', () => {
            const api = generateApiForDataset(createDatasetOutput(), {
                pathPrefix: 'https://example.com',
            });
            expect(
                api.availableDatasets?.datasets[1].listOfLexiconApiLink
            ).toBe('https://example.com/api/d/stepbible-lexicon/lexicon.json');
            expect(api.datasetLexicon![0].lexicon[0].apiLink).toBe(
                'https://example.com/api/d/stepbible-lexicon/lexicon/G3056.json'
            );
        });
    });
});
