import { DOMParser } from 'linkedom';
import { convertOsisToUsfm } from './osis-to-usfm.js';
import { UsfmParser } from './usfm-parser.js';
import { generateDataset } from '../generation/dataset.js';
import { osisBookMap } from '../generation/theographic.js';
import { InputTranslationMetadata } from '../generation/common-types.js';

const parser = () => new DOMParser() as any;
const wrap = (content: string) =>
    `<osis><osisText>${content}</osisText></osis>`;
const book = (content: string, id = 'Gen') =>
    `<div type="book" osisID="${id}">${content}</div>`;
const convert = (content: string, id = 'Gen') =>
    convertOsisToUsfm(wrap(book(content, id)), parser())[0].usfm;
const metadata: InputTranslationMetadata = {
    id: 'test',
    name: '口語訳',
    shortName: '口語訳',
    englishName: 'Test',
    language: 'jpn',
    direction: 'ltr',
    website: '',
    licenseUrl: '',
};
const dataset = (xml: string) =>
    generateDataset(
        convertOsisToUsfm(xml, parser()).map(({ usfm, bookId }) => ({
            name: `${bookId.toLowerCase()}.usfm`,
            content: usfm,
            fileType: 'usfm' as const,
            metadata,
        })),
        parser()
    ).translations[0];
const psalm = `<title type="main">詩篇</title><chapter osisID="Ps.23">
    <title type="psalm" canonical="true">ダビデの歌</title>
    <lg><l><verse sID="Ps.23.1" osisID="Ps.23.1"/>主はわたしの牧者であって、</l>
    <l>わたしには乏しいことがない。<verse eID="Ps.23.1"/></l>
    <l><verse osisID="Ps.23.2">緑の牧場</verse></l></lg></chapter>`;

describe('convertOsisToUsfm', () => {
    it.each([
        '<p>LOST<verse osisID="Gen.1.1">本文</verse></p>',
        '<verse osisID="Gen.1.1">本文</verse>LOST',
        '<w>LOST</w><verse osisID="Gen.1.1">本文</verse>',
    ])(
        'should reject text outside a verse with its chapter and excerpt: %s',
        (content) => {
            expect(() =>
                convert(`<chapter osisID="Gen.1">${content}</chapter>`)
            ).toThrow(/Text outside a verse in chapter Gen\.1: LOST/);
        }
    );

    it('should ignore whitespace outside verses', () => {
        expect(
            convert(
                '<chapter osisID="Gen.1"> \n <p> \t <verse osisID="Gen.1.1">本文</verse> \n </p></chapter>'
            )
        ).toContain('\\v 1 本文');
    });

    it.each(['', 'Gen', 'Gen.x', 'Exod.1'])(
        'should reject invalid chapter references: %s',
        (id) => {
            expect(() =>
                convert(
                    `<chapter osisID="${id}"><verse osisID="Gen.1.1">本文</verse></chapter>`
                )
            ).toThrow(/Invalid OSIS chapter reference/);
        }
    );

    it('should reject chapters without an OSIS ID', () => {
        expect(() =>
            convert('<chapter><verse osisID="Gen.1.1">本文</verse></chapter>')
        ).toThrow(/Invalid OSIS chapter reference/);
    });

    it('should accept chapter start and end milestones', () => {
        expect(
            convert(
                '<chapter sID="Gen.1"/><verse sID="Gen.1.1"/>本文<verse eID="Gen.1.1"/><chapter eID="Gen.1"/>'
            )
        ).toBe('\\id GEN\n\\c 1\n\\v 1 本文\n');
    });

    it.each([
        ['', /expected an <osis> root/],
        ['<html/>', /expected an <osis> root/],
        ['<osis/>', /missing <osisText>/],
        ['<osis><osisText/></osis>', /no books found/],
    ])('should reject empty or non-OSIS documents: %s', (xml, error) => {
        expect(() => convertOsisToUsfm(xml, parser())).toThrow(error);
    });

    it('should reject duplicate books', () => {
        expect(() =>
            convertOsisToUsfm(wrap(book('') + book('')), parser())
        ).toThrow(/Duplicate OSIS book ID Gen/);
    });

    it('should put a paragraph before a verse when it opens before any verse text', () => {
        expect(
            convert(
                '<chapter osisID="Gen.1"><verse sID="Gen.1.1"/><p>本文<verse eID="Gen.1.1"/></p></chapter>'
            )
        ).toBe('\\id GEN\n\\c 1\n\\p\n\\v 1 本文\n');
    });

    it.each(['Gen.2.1', 'Exod.1.1', 'Gen.1.1 Gen.2.2', 'Gen.1.1 Exod.1.2'])(
        'should reject verse references outside their enclosing book or chapter: %s',
        (reference) => {
            expect(() =>
                convert(
                    `<chapter osisID="Gen.1"><verse osisID="${reference}">本文</verse></chapter>`
                )
            ).toThrow(/does not match enclosing chapter Gen\.1/);
        }
    );

    it.each(['Gen.1', 'Gen.1.1 bad Gen.1.3'])(
        'should reject malformed verse references: %s',
        (reference) => {
            expect(() =>
                convert(
                    `<chapter osisID="Gen.1"><verse osisID="${reference}">本文</verse></chapter>`
                )
            ).toThrow(/Invalid OSIS verse reference/);
        }
    );

    it('should merge the real Exodus 22:3 parts in suffix order and sort only that chapter', () => {
        // Copied verbatim from the pinned Kougo-yaku source, Exodus 22:1–5.
        const xml = `<chapter osisID="Exod.22"><title type="chapter">第二二章</title>
<p>
<verse osisID="Exod.22.1">もし<w gloss="ひと">人</w>が<w gloss="うし">牛</w>または<w gloss="ひつじ">羊</w>を<w gloss="ぬす">盗</w>んで、これを<w gloss="ころ">殺</w>し、あるいはこれを<w gloss="う">売</w>るならば、<w gloss="かれ">彼</w>は一<w gloss="とう">頭</w>の<w gloss="うし">牛</w>のために五<w gloss="とう">頭</w>の<w gloss="うし">牛</w>をもって、一<w gloss="とう">頭</w>の<w gloss="ひつじ">羊</w>のために四<w gloss="とう">頭</w>の<w gloss="ひつじ">羊</w>をもって<w gloss="つぐな">償</w>わなければならない。</verse>
<verse osisID="Exod.22.3!b"><w gloss="かれ">彼</w>は<w gloss="かなら">必</w>ず<w gloss="つぐな">償</w>わなければならない。もし<w gloss="かれ">彼</w>に<w gloss="なに">何</w>もない<w gloss="とき">時</w>は、<w gloss="かれ">彼</w>はその<w gloss="ぬす">盗</w>んだ<w gloss="もの">物</w>のために<w gloss="み">身</w>を<w gloss="う">売</w>られるであろう。</verse>
<verse osisID="Exod.22.4">もしその<w gloss="ぬす">盗</w>んだ<w gloss="もの">物</w>がなお<w gloss="い">生</w>きて、<w gloss="かれ">彼</w>の<w gloss="て">手</w>もとにあれば、それは<w gloss="うし">牛</w>、ろば、<w gloss="ひつじ">羊</w>のいずれにせよ、これを二<w gloss="ばい">倍</w>にして<w gloss="つぐな">償</w>わなければならない。</verse>
</p>
<p>
<verse osisID="Exod.22.2">もし<w gloss="ぬす">盗</w>びとが<w gloss="あな">穴</w>をあけてはいるのを<w gloss="み">見</w>て、これを<w gloss="う">撃</w>って<w gloss="ころ">殺</w>したときは、その<w gloss="ひと">人</w>には<w gloss="ち">血</w>を<w gloss="なが">流</w>した<w gloss="つみ">罪</w>はない。</verse>
<verse osisID="Exod.22.3!a">しかし<w gloss="ひ">日</w>がのぼって<w gloss="のち">後</w>ならば、その<w gloss="ひと">人</w>に<w gloss="ち">血</w>を<w gloss="なが">流</w>した<w gloss="つみ">罪</w>がある。</verse>
</p>
<p>
<verse osisID="Exod.22.5">もし<w gloss="ひと">人</w>が<w gloss="はたけ">畑</w>またはぶどう<w gloss="はたけ">畑</w>のものを<w gloss="く">食</w>わせ、その<w gloss="かちく">家畜</w>を<w gloss="はな">放</w>って<w gloss="たにん">他人</w>の<w gloss="はたけ">畑</w>のものを<w gloss="く">食</w>わせた<w gloss="とき">時</w>は、<w gloss="じぶん">自分</w>の<w gloss="はたけ">畑</w>の<w gloss="もっと">最</w>も<w gloss="よ">良</w>い<w gloss="もの">物</w>と、ぶどう<w gloss="はたけ">畑</w>の<w gloss="もっと">最</w>も<w gloss="よ">良</w>い<w gloss="もの">物</w>をもって、これを<w gloss="つぐな">償</w>わなければならない。</verse>
</p>
</chapter>`;
        const usfm = convert(xml, 'Exod');
        expect(
            [...usfm.matchAll(/\\v (\d+) /g)].map((match) => Number(match[1]))
        ).toEqual([1, 2, 3, 4, 5]);
        expect(usfm).toContain(
            '\\v 3 しかし日がのぼって後ならば、その人に血を流した罪がある。彼は必ず償わなければならない。もし彼に何もない時は、彼はその盗んだ物のために身を売られるであろう。'
        );
        expect(usfm).toContain('\\p\n\\v 2 ');
        expect(usfm).toContain('\\p\n\\v 5 ');
        const tree = new UsfmParser().parse(usfm);
        const chapter = tree.content[0];
        expect(chapter).toMatchObject({
            number: 22,
        });
        if (chapter.type !== 'chapter') throw new Error('Expected chapter');
        expect(
            chapter.content.filter((item) => item.type === 'verse')
        ).toMatchObject([
            { type: 'verse', number: 1 },
            { type: 'verse', number: 2 },
            { type: 'verse', number: 3 },
            { type: 'verse', number: 4 },
            { type: 'verse', number: 5 },
        ]);
        expect(
            convert(
                '<chapter osisID="Gen.1"><p><verse osisID="Gen.1.2">二</verse><verse osisID="Gen.1.1">一</verse></p></chapter>'
            )
        ).toContain('\\v 2 二\n\\v 1 一');
    });

    it('should convert the whole canon even when the NT precedes the OT and ignore the header', () => {
        const ids = [...osisBookMap.keys()];
        const xml = wrap(
            `<header><work><title>Ignored</title><identifier>ignored</identifier><refSystem>Bible</refSystem></work></header><div type="x-testament">${[...ids.slice(39), ...ids.slice(0, 39)].map((id) => book(`<chapter osisID="${id}.1"><p><verse osisID="${id}.1.1">本文</verse></p></chapter>`, id)).join('')}</div>`
        );
        const result = convertOsisToUsfm(xml, parser());
        expect(result).toHaveLength(66);
        expect(new Set(result.map((b) => b.bookId)).size).toBe(66);
        for (const [id, code] of osisBookMap) {
            expect(result.find((b) => b.bookId === code)?.usfm).toBe(
                `\\id ${code}\n\\c 1\n\\p\n\\v 1 本文\n`
            );
        }
    });

    it('should reject an unknown OSIS book with its element and verse location', () => {
        expect(() =>
            convert(
                '<chapter osisID="Unknown.1"><verse osisID="Unknown.1.1">本文</verse></chapter>',
                'Unknown'
            )
        ).toThrow(/Unknown.*<div.*Unknown\.1\.1/);
    });

    it('should write book titles and import them as book names', () => {
        const content = `<title type="main">創世記</title><chapter osisID="Gen.1"><p><verse osisID="Gen.1.1">はじめに神は天と地とを創造された。</verse></p></chapter>`;
        expect(convert(content)).toMatchInlineSnapshot(`
"\\id GEN
\\h 創世記
\\toc1 創世記
\\toc2 創世記
\\mt1 創世記
\\c 1
\\p
\\v 1 はじめに神は天と地とを創造された。
"
`);
        expect(dataset(wrap(book(content))).books[0].name).toBe('創世記');
    });

    it('should handle chapters and both container and milestone verses', () => {
        const usfm = convert(
            `<chapter osisID="Gen.1"><p><verse osisID="Gen.1.1">一</verse><verse sID="Gen.1.2"/>二<verse eID="Gen.1.2"/></p></chapter><chapter osisID="Gen.2"><p><verse osisID="Gen.2.1">三</verse></p></chapter>`
        );
        expect(usfm).toContain(
            '\\c 1\n\\p\n\\v 1 一\n\\v 2 二\n\\c 2\n\\p\n\\v 1 三'
        );
    });

    it('should keep one milestone verse across paragraphs', () => {
        const usfm = convert(
            `<chapter osisID="Matt.1"><p><verse sID="Matt.1.6"/>前半</p><p>後半<verse eID="Matt.1.6"/></p></chapter>`,
            'Matt'
        );
        expect(usfm.match(/\\v /g)).toHaveLength(1);
        expect(usfm).toContain('\\v 6 前半\n\\p\n後半');
    });

    it.each([
        ['Rom', 'Rom.1.9 Rom.1.10', '9-10'],
        ['Ps', 'Ps.132.3 Ps.132.4 Ps.132.5', '3-5'],
    ])('should write combined verses for %s', (id, refs, range) => {
        expect(
            convert(
                `<chapter osisID="${refs.split('.').slice(0, 2).join('.')}"><p><verse osisID="${refs}">本文</verse></p></chapter>`,
                id
            )
        ).toContain(`\\v ${range} 本文`);
    });

    it('should drop chapter labels', () => {
        expect(
            convert(
                '<chapter osisID="Gen.1"><title type="chapter">第一章</title><p><verse osisID="Gen.1.1">本文</verse></p></chapter>'
            )
        ).not.toContain('第一章');
    });

    it('should preserve Psalm titles and poetry lines', () => {
        const usfm = convert(psalm, 'Ps');
        expect(usfm).toContain(
            '\\c 23\n\\d ダビデの歌\n\\q1\n\\v 1 主はわたしの牧者であって、\n\\q1\nわたしには乏しいことがない。'
        );
    });

    it('should start a paragraph for prose after poetry within the same verse', () => {
        const content = `<chapter osisID="Matt.1"><p><verse sID="Matt.1.23"/>\n<lg><l>「見よ、おとめがみごもって男の子を産むであろう。</l><l>その名はインマヌエルと呼ばれるであろう」。</l></lg>これは、「神われらと共にいます」という意味である。<verse eID="Matt.1.23"/></p></chapter>`;
        const usfm = convert(content, 'Matt');
        expect(usfm).toContain(
            `\\q1\n「見よ、おとめがみごもって男の子を産むであろう。\n\\q1\nその名はインマヌエルと呼ばれるであろう」。\n\\p\nこれは、「神われらと共にいます」という意味である。`
        );
    });

    it('should strip ruby annotations without adding spaces between Japanese text pieces', () => {
        const usfm =
            convert(`<chapter osisID="Gen.1"><p><verse osisID="Gen.1.1">イサクの
            <w gloss="ちち">父</w>
            であり</verse></p></chapter>`);
        expect(usfm).toContain('\\v 1 イサクの父であり');
        expect(usfm).not.toMatch(/gloss|ちち/);
    });

    it.each([
        '<note>注</note>',
        '<title type="unknown">注</title>',
        '<div type="unknown">注</div>',
    ])('should fail loudly on unsupported markup: %s', (markup) => {
        expect(() =>
            convert(
                `<chapter osisID="Gen.1"><p><verse osisID="Gen.1.1">本文${markup}</verse></p></chapter>`
            )
        ).toThrow(new RegExp(`<${markup.match(/<(\w+)/)![1]}.*Gen\\.1\\.1`));
    });

    it('should report milestone and adjacent verse locations for unsupported markup', () => {
        expect(() =>
            convert(
                '<chapter osisID="Gen.1"><p><verse sID="Gen.1.2"/>本文<note>注</note><verse eID="Gen.1.2"/></p></chapter>'
            )
        ).toThrow(/note.*Gen\.1\.2/);
        expect(() =>
            convert(
                '<chapter osisID="Gen.1"><title type="unknown">注</title><p><verse osisID="Gen.1.1">本文</verse></p></chapter>'
            )
        ).toThrow(/title.*Gen\.1\.1/);
    });

    it('should round-trip verse numbers, subtitles and poem flags through generateDataset', () => {
        const translation = dataset(wrap(book(psalm, 'Ps')));
        expect(translation.books[0].name).toBe('詩篇');
        expect(translation.books[0].chapters[0]).toMatchObject({
            chapter: {
                number: 23,
                content: [
                    { type: 'hebrew_subtitle', content: ['ダビデの歌'] },
                    {
                        type: 'verse',
                        number: 1,
                        content: [
                            { text: '主はわたしの牧者であって、', poem: 1 },
                            { text: 'わたしには乏しいことがない。', poem: 1 },
                        ],
                    },
                    {
                        type: 'verse',
                        number: 2,
                        content: [{ text: '緑の牧場', poem: 1 }],
                    },
                ],
            },
        });
    });
});
