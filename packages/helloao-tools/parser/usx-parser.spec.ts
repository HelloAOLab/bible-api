import { USXParser } from "./usx-parser";
import { DOMParser, Element, Node } from 'linkedom';
import Matthew from '../../../bible/webp_usx/mat.usx';
import John from '../../../bible/webp_usx/jhn.usx';
import Sa from '../../../bible/webp_usx/1sa.usx';

describe('USXParser', () => {
    let parser: USXParser;

    beforeEach(() => {
        // const { window } = new JSDOM();
        globalThis.DOMParser = DOMParser as any;// window.DOMParser as any;
        globalThis.Element = Element as any; // window.Element;
        globalThis.Node = Node as any;// window.Node;

        parser = new USXParser(new DOMParser() as any);
    });

    describe('parse()', () => {

        it('should parse a simple USX file', () => {
            const usx = `
                <usx version="3.0">
                    <book code="GEN" style="id">- Berean Study Bible</book>
                    <para style="h">Genesis</para>
                    <para style="toc2">Genesis</para>
                    <para style="toc1">Genesis</para>
                    <para style="mt1">Genesis</para>
                    <chapter number="1" style="c" sid="GEN 1"/>
                    <para style="s1">The Creation</para>
                    <para style="r">(John 1:1–5; Hebrews 11:1–3)</para>
                    <para style="m">
                        <verse number="1" style="v" sid="GEN 1:1"/>
                        <char style="w" strong="H8064">In</char>
                        <char style="w" strong="H1254">the</char>
                        <char style="w" strong="H7225">beginning</char>
                        <char style="w" strong="H8064">God</char>
                        <char style="w" strong="H1254">created</char>
                        <char style="w" strong="H1254">the</char>
                        <char style="w" strong="H8064">heavens</char>
                        <char style="w" strong="H8064">and</char>
                        <char style="w" strong="H1254">the</char>
                        <char style="w" strong="H8064">earth</char>.
                        <verse eid="GEN 1:1"/>
                    </para>
                </usx>
            `;
            const tree = parser.parse(usx);
            expect(tree).toEqual({
                type: 'root',
                id: 'GEN',
                header: 'Genesis',
                title: 'Genesis',
                content: [
                    {
                        type: 'chapter',
                        number: 1,
                        content: [
                            {
                                type: 'heading',
                                content: ['The Creation']
                            },
                            {
                                type: 'verse',
                                number: 1,
                                content: [
                                    'In the beginning God created the heavens and the earth.'
                                ]
                            },
                        ],
                        footnotes: [],
                    }
                ]
            });
        });

        it('should parse line breaks', () => {
            const usx = `
                <usx version="3.0">
                    <book code="GEN" style="id">- Berean Study Bible</book>
                    <para style="h">Genesis</para>
                    <para style="toc2">Genesis</para>
                    <para style="toc1">Genesis</para>
                    <para style="mt1">Genesis</para>
                    <chapter number="1" style="c" sid="GEN 1"/>
                    <para style="s1">The Creation</para>
                    <para style="r">(John 1:1–5; Hebrews 11:1–3)</para>
                    <para style="m">
                        <verse number="1" style="v" sid="GEN 1:1"/>
                        <char style="w" strong="H8064">In</char>
                        <char style="w" strong="H1254">the</char>
                        <char style="w" strong="H7225">beginning</char>
                        <char style="w" strong="H8064">God</char>
                        <char style="w" strong="H1254">created</char>
                        <char style="w" strong="H1254">the</char>
                        <char style="w" strong="H8064">heavens</char>
                        <char style="w" strong="H8064">and</char>
                        <char style="w" strong="H1254">the</char>
                        <char style="w" strong="H8064">earth</char>.
                        <verse eid="GEN 1:1"/>
                    </para>
                    <para style="b"/>
                    <para style="m">
                        <verse number="2" style="v" sid="GEN 1:2"/>
                        <char style="w" strong="H1961">Now</char>
                        <char style="w" strong="H6440">the</char>
                        <char style="w" strong="H0776">earth</char>
                        <char style="w" strong="H1961">was</char>
                        <char style="w" strong="H8414">formless</char>
                        <char style="w" strong="H6440">and</char>
                        <char style="w" strong="H2638">void</char>,
                        <char style="w" strong="H6440">and</char>
                        <char style="w" strong="H2822">darkness</char>
                        <char style="w" strong="H1961">was</char>
                        <char style="w" strong="H5921">over</char>
                        <char style="w" strong="H6440">the</char>
                        <char style="w" strong="H6440">surface</char>
                        <char style="w" strong="H6440">of</char>
                        <char style="w" strong="H6440">the</char>
                        <char style="w" strong="H8415">deep</char>.
                        <char style="w" strong="H6440">And</char>
                        <char style="w" strong="H6440">the</char>
                        <char style="w" strong="H7307">Spirit</char>
                        <char style="w" strong="H6440">of</char>
                        <char style="w" strong="H0430">God</char>
                        <char style="w" strong="H1961">was</char>
                        <char style="w" strong="H7363">hovering</char>
                        <char style="w" strong="H5921">over</char>
                        <char style="w" strong="H6440">the</char>
                        <char style="w" strong="H6440">surface</char>
                        <char style="w" strong="H6440">of</char>
                        <char style="w" strong="H6440">the</char>
                        <char style="w" strong="H4325">waters</char>.
                        <verse eid="GEN 1:2"/>
                    </para>
                </usx>
            `;
            const tree = parser.parse(usx);
            expect(tree).toEqual({
                type: 'root',
                id: 'GEN',
                header: 'Genesis',
                title: 'Genesis',
                content: [
                    {
                        type: 'chapter',
                        number: 1,
                        content: [
                            {
                                type: 'heading',
                                content: ['The Creation']
                            },
                            {
                                type: 'verse',
                                number: 1,
                                content: [
                                    'In the beginning God created the heavens and the earth.'
                                ]
                            },
                            {
                                type: 'line_break',
                            },
                            {
                                type: 'verse',
                                number: 2,
                                content: [
                                    'Now the earth was formless and void, and darkness was over the surface of the deep. And the Spirit of God was hovering over the surface of the waters.'
                                ]
                            }
                        ],
                        footnotes: [],
                    }
                ]
            });
        });

        it('should combine major title headings', () => {
            const usx = `
                <usx version="3.0">
                    <book code="GEN" style="id">- Berean Study Bible</book>
                    <para style="h">Genesis</para>
                    <para style="toc2">Genesis</para>
                    <para style="toc1">Genesis</para>
                    <para style="mt1">The</para>
                    <para style="mt2">Title</para>
                    <para style="mt3">of the Book</para>
                    <chapter number="1" style="c" sid="GEN 1"/>
                    <para style="s1">The Creation</para>
                    <para style="r">(John 1:1–5; Hebrews 11:1–3)</para>
                    <para style="m">
                        <verse number="1" style="v" sid="GEN 1:1"/>
                        <char style="w" strong="H8064">In</char>
                        <char style="w" strong="H1254">the</char>
                        <char style="w" strong="H7225">beginning</char>
                        <char style="w" strong="H8064">God</char>
                        <char style="w" strong="H1254">created</char>
                        <char style="w" strong="H1254">the</char>
                        <char style="w" strong="H8064">heavens</char>
                        <char style="w" strong="H8064">and</char>
                        <char style="w" strong="H1254">the</char>
                        <char style="w" strong="H8064">earth</char>.
                        <verse eid="GEN 1:1"/>
                    </para>
                </usx>
            `;
            const tree = parser.parse(usx);
            expect(tree).toEqual({
                type: 'root',
                id: 'GEN',
                title: 'The Title of the Book',
                header: 'Genesis',
                content: [
                    {
                        type: 'chapter',
                        number: 1,
                        content: [
                            {
                                type: 'heading',
                                content: ['The Creation']
                            },
                            {
                                type: 'verse',
                                number: 1,
                                content: [
                                    'In the beginning God created the heavens and the earth.'
                                ]
                            },
                        ],
                        footnotes: [],
                    }
                ]
            });
        });

        it('should combine major title in the order they appear', () => {
            const usx = `
                <usx version="3.0">
                    <book code="GEN" style="id">- Berean Study Bible</book>
                    <para style="h">Genesis</para>
                    <para style="toc2">Genesis</para>
                    <para style="toc1">Genesis</para>
                    <para style="mt3">The</para>
                    <para style="mt2">Title</para>
                    <para style="mt1">of the Book</para>
                    <chapter number="1" style="c" sid="GEN 1"/>
                    <para style="s1">The Creation</para>
                    <para style="r">(John 1:1–5; Hebrews 11:1–3)</para>
                    <para style="m">
                        <verse number="1" style="v" sid="GEN 1:1"/>
                        <char style="w" strong="H8064">In</char>
                        <char style="w" strong="H1254">the</char>
                        <char style="w" strong="H7225">beginning</char>
                        <char style="w" strong="H8064">God</char>
                        <char style="w" strong="H1254">created</char>
                        <char style="w" strong="H1254">the</char>
                        <char style="w" strong="H8064">heavens</char>
                        <char style="w" strong="H8064">and</char>
                        <char style="w" strong="H1254">the</char>
                        <char style="w" strong="H8064">earth</char>.
                        <verse eid="GEN 1:1"/>
                    </para>
                </usx>
            `;
            const tree = parser.parse(usx);
            expect(tree).toEqual({
                type: 'root',
                id: 'GEN',
                title: 'The Title of the Book',
                header: 'Genesis',
                content: [
                    {
                        type: 'chapter',
                        number: 1,
                        content: [
                            {
                                type: 'heading',
                                content: ['The Creation']
                            },
                            {
                                type: 'verse',
                                number: 1,
                                content: [
                                    'In the beginning God created the heavens and the earth.'
                                ]
                            },
                        ],
                        footnotes: [],
                    }
                ]
            });
        });

        it('should support section headings outside of chapters', () => {
            const usx = `
                <usx version="3.0">
                    <book code="GEN" style="id">- Berean Study Bible</book>
                    <para style="h">Genesis</para>
                    <para style="toc2">Genesis</para>
                    <para style="toc1">Genesis</para>
                    <para style="mt1">Genesis</para>
                    <chapter number="1" style="c" sid="GEN 1"/>
                    <para style="s1">The Creation</para>
                    <para style="r">(John 1:1–5; Hebrews 11:1–3)</para>
                    <para style="m">
                        <verse number="1" style="v" sid="GEN 1:1"/>
                        <char style="w" strong="H8064">In</char>
                        <char style="w" strong="H1254">the</char>
                        <char style="w" strong="H7225">beginning</char>
                        <char style="w" strong="H8064">God</char>
                        <char style="w" strong="H1254">created</char>
                        <char style="w" strong="H1254">the</char>
                        <char style="w" strong="H8064">heavens</char>
                        <char style="w" strong="H8064">and</char>
                        <char style="w" strong="H1254">the</char>
                        <char style="w" strong="H8064">earth</char>.
                        <verse eid="GEN 1:1"/>
                    </para>
                    <chapter eid="GEN 1"/>
                    <para style="s2">The Second Section</para>
                </usx>
            `;
            const tree = parser.parse(usx);
            expect(tree).toEqual({
                type: 'root',
                id: 'GEN',
                header: 'Genesis',
                title: 'Genesis',
                content: [
                    {
                        type: 'chapter',
                        number: 1,
                        content: [
                            {
                                type: 'heading',
                                content: ['The Creation']
                            },
                            {
                                type: 'verse',
                                number: 1,
                                content: [
                                    'In the beginning God created the heavens and the earth.'
                                ]
                            },
                        ],
                        footnotes: [],
                    },
                    {
                        type: 'heading',
                        content: ['The Second Section']
                    }
                ]
            });
        });

        it('should support multiple chapters', () => {
            const usx = `
                <usx version="3.0">
                    <book code="GEN" style="id">- Berean Study Bible</book>
                    <para style="h">Genesis</para>
                    <para style="toc2">Genesis</para>
                    <para style="toc1">Genesis</para>
                    <para style="mt1">Genesis</para>
                    <chapter number="1" style="c" sid="GEN 1"/>
                    <para style="s1">The Creation</para>
                    <para style="r">(John 1:1–5; Hebrews 11:1–3)</para>
                    <para style="m">
                        <verse number="1" style="v" sid="GEN 1:1"/>
                        <char style="w" strong="H8064">In</char>
                        <char style="w" strong="H1254">the</char>
                        <char style="w" strong="H7225">beginning</char>
                        <char style="w" strong="H8064">God</char>
                        <char style="w" strong="H1254">created</char>
                        <char style="w" strong="H1254">the</char>
                        <char style="w" strong="H8064">heavens</char>
                        <char style="w" strong="H8064">and</char>
                        <char style="w" strong="H1254">the</char>
                        <char style="w" strong="H8064">earth</char>.
                        <verse eid="GEN 1:1"/>
                    </para>
                    <chapter eid="GEN 1"/>
                    <para style="s2">The Second Section</para>
                    <chapter number="2" sid="GEN 2"/>
                    <para style="s1">The Seventh Day</para>
                    <para style="r">(Exodus 16:22–30; Hebrews 4:1–11)</para>
                    <para style="m">
                        <verse number="1" style="v" sid="GEN 2:1"/>
                        <char style="w" strong="H3541">Thus</char>
                        <char style="w" strong="H3605">the</char>
                        <char style="w" strong="H8064">heavens</char>
                        <char style="w" strong="H8064">and</char>
                        <char style="w" strong="H3605">the</char>
                        <char style="w" strong="H8064">earth</char>
                        <char style="w" strong="H8064">were</char>
                        <char style="w" strong="H3615">completed</char>
                        <char style="w" strong="H6635">in</char>
                        <char style="w" strong="H3605">all</char>
                        <char style="w" strong="H3605">their</char>
                        <char style="w" strong="H6635">vast</char>
                        <char style="w" strong="H6635">array</char>.
                        <verse eid="GEN 2:1"/>
                    </para>
                </usx>
            `;
            const tree = parser.parse(usx);
            expect(tree).toEqual({
                type: 'root',
                id: 'GEN',
                header: 'Genesis',
                title: 'Genesis',
                content: [
                    {
                        type: 'chapter',
                        number: 1,
                        content: [
                            {
                                type: 'heading',
                                content: ['The Creation']
                            },
                            {
                                type: 'verse',
                                number: 1,
                                content: [
                                    'In the beginning God created the heavens and the earth.'
                                ]
                            },
                        ],
                        footnotes: [],
                    },
                    {
                        type: 'heading',
                        content: ['The Second Section']
                    },
                    {
                        type: 'chapter',
                        number: 2,
                        content: [
                            {
                                type: 'heading',
                                content: ['The Seventh Day']
                            },
                            {
                                type: 'verse',
                                number: 1,
                                content: [
                                    'Thus the heavens and the earth were completed in all their vast array.'
                                ]
                            },
                        ],
                        footnotes: [],
                    },
                ]
            });
        });

        it('should support footnotes', () => {
            const usx = `
                <usx version="3.0">
                    <book code="GEN" style="id">- Berean Study Bible</book>
                    <para style="h">Genesis</para>
                    <para style="toc2">Genesis</para>
                    <para style="toc1">Genesis</para>
                    <para style="mt1">Genesis</para>
                    <chapter number="2" style="c" sid="GEN 2"/>
                    <para style="s1">The Seventh Day</para>
                    <para style="r">(Exodus 16:22–30; Hebrews 4:1–11)</para>
                    <para style="m">
                        <verse number="1" style="v" sid="GEN 2:1"/>
                        <char style="w" strong="H3541">Thus</char>
                        <char style="w" strong="H3605">the</char>
                        <char style="w" strong="H8064">heavens</char>
                        <char style="w" strong="H8064">and</char>
                        <char style="w" strong="H3605">the</char>
                        <char style="w" strong="H8064">earth</char>
                        <char style="w" strong="H8064">were</char>
                        <char style="w" strong="H3615">completed</char>
                        <char style="w" strong="H6635">in</char>
                        <char style="w" strong="H3605">all</char>
                        <char style="w" strong="H3605">their</char>
                        <char style="w" strong="H6635">vast</char>
                        <char style="w" strong="H6635">array</char>.
                        <verse eid="GEN 2:1"/>
                        <verse number="2" style="v" sid="GEN 2:2"/>
                        <char style="w" strong="H3117">And</char>
                        <char style="w" strong="H3117">by</char>
                        <char style="w" strong="H3605">the</char>
                        <char style="w" strong="H7637">seventh</char>
                        <char style="w" strong="H3117">day</char>
                        <char style="w" strong="H0430">God</char>
                        <char style="w" strong="H3117">had</char>
                        <char style="w" strong="H3615">finished</char>
                        <char style="w" strong="H3605">the</char>
                        <char style="w" strong="H4399">work</char>
                        <char style="w" strong="H3117">He</char>
                        <char style="w" strong="H3117">had</char>
                        <char style="w" strong="H3615">been</char>
                        <char style="w" strong="H6213">doing</char>;
                        <char style="w" strong="H6213">so</char>
                        <char style="w" strong="H3117">on</char>
                        <char style="w" strong="H3605">that</char>
                        <char style="w" strong="H3117">day</char>
                        <char style="w" strong="H3117">He</char>
                        <char style="w" strong="H7673">rested</char>
                        <char style="w" strong="H3117">from</char>
                        <char style="w" strong="H3605">all</char>
                        <char style="w" strong="H3605">His</char>
                        <char style="w" strong="H4399">work</char>.
                        <note style="f" caller="+">
                            <char style="fr"/>
                            <char style="ft">2:2 </char>
                            <char style="ft">Cited in Hebrews 4:4</char>
                        </note>
                        <verse eid="GEN 2:2"/>
                    </para>
                </usx>
            `;
            const tree = parser.parse(usx);
            expect(tree).toEqual({
                type: 'root',
                id: 'GEN',
                header: 'Genesis',
                title: 'Genesis',
                content: [
                    {
                        type: 'chapter',
                        number: 2,
                        content: [
                            {
                                type: 'heading',
                                content: ['The Seventh Day']
                            },
                            {
                                type: 'verse',
                                number: 1,
                                content: [
                                    'Thus the heavens and the earth were completed in all their vast array.'
                                ]
                            },
                            {
                                type: 'verse',
                                number: 2,
                                content: [
                                    'And by the seventh day God had finished the work He had been doing; so on that day He rested from all His work.',
                                    {
                                        noteId: 0,
                                    }
                                ]
                            },
                        ],
                        footnotes: [
                            {
                                noteId: 0,
                                caller: '+',
                                text: 'Cited in Hebrews 4:4',
                                reference: {
                                    chapter: 2,
                                    verse: 2,
                                }
                            }
                        ],
                    }
                ]
            });
        });

        it('should ignore introduction paragraphs', () => {
            const usx = `
                <usx version="3.0">
                    <book code="GEN" style="id">- Berean Study Bible</book>
                    <para style="h">Genesis</para>
                    <para style="toc2">Genesis</para>
                    <para style="toc1">Genesis</para>
                    <para style="mt1">Genesis</para>
                    <chapter number="2" style="c" sid="GEN 2"/>
                    <para style="s1">The Seventh Day</para>
                    <para style="r">(Exodus 16:22–30; Hebrews 4:1–11)</para>
                    <para style="ip">This is an introduction paragraph.</para>
                    <para style="m">
                        <verse number="1" style="v" sid="GEN 2:1"/>
                        <char style="w" strong="H3541">Thus</char>
                        <char style="w" strong="H3605">the</char>
                        <char style="w" strong="H8064">heavens</char>
                        <char style="w" strong="H8064">and</char>
                        <char style="w" strong="H3605">the</char>
                        <char style="w" strong="H8064">earth</char>
                        <char style="w" strong="H8064">were</char>
                        <char style="w" strong="H3615">completed</char>
                        <char style="w" strong="H6635">in</char>
                        <char style="w" strong="H3605">all</char>
                        <char style="w" strong="H3605">their</char>
                        <char style="w" strong="H6635">vast</char>
                        <char style="w" strong="H6635">array</char>.
                        <verse eid="GEN 2:1"/>
                        <verse number="2" style="v" sid="GEN 2:2"/>
                        <char style="w" strong="H3117">And</char>
                        <char style="w" strong="H3117">by</char>
                        <char style="w" strong="H3605">the</char>
                        <char style="w" strong="H7637">seventh</char>
                        <char style="w" strong="H3117">day</char>
                        <char style="w" strong="H0430">God</char>
                        <char style="w" strong="H3117">had</char>
                        <char style="w" strong="H3615">finished</char>
                        <char style="w" strong="H3605">the</char>
                        <char style="w" strong="H4399">work</char>
                        <char style="w" strong="H3117">He</char>
                        <char style="w" strong="H3117">had</char>
                        <char style="w" strong="H3615">been</char>
                        <char style="w" strong="H6213">doing</char>;
                        <char style="w" strong="H6213">so</char>
                        <char style="w" strong="H3117">on</char>
                        <char style="w" strong="H3605">that</char>
                        <char style="w" strong="H3117">day</char>
                        <char style="w" strong="H3117">He</char>
                        <char style="w" strong="H7673">rested</char>
                        <char style="w" strong="H3117">from</char>
                        <char style="w" strong="H3605">all</char>
                        <char style="w" strong="H3605">His</char>
                        <char style="w" strong="H4399">work</char>.
                        <note style="f" caller="+">
                            <char style="fr"/>
                            <char style="ft">2:2 </char>
                            <char style="ft">Cited in Hebrews 4:4</char>
                        </note>
                        <verse eid="GEN 2:2"/>
                    </para>
                </usx>
            `;
            const tree = parser.parse(usx);
            expect(tree).toEqual({
                type: 'root',
                id: 'GEN',
                header: 'Genesis',
                title: 'Genesis',
                content: [
                    {
                        type: 'chapter',
                        number: 2,
                        content: [
                            {
                                type: 'heading',
                                content: ['The Seventh Day']
                            },
                            {
                                type: 'verse',
                                number: 1,
                                content: [
                                    'Thus the heavens and the earth were completed in all their vast array.'
                                ]
                            },
                            {
                                type: 'verse',
                                number: 2,
                                content: [
                                    'And by the seventh day God had finished the work He had been doing; so on that day He rested from all His work.',
                                    {
                                        noteId: 0,
                                    }
                                ]
                            },
                        ],
                        footnotes: [
                            {
                                noteId: 0,
                                caller: '+',
                                text: 'Cited in Hebrews 4:4',
                                reference: {
                                    chapter: 2,
                                    verse: 2,
                                }
                            }
                        ],
                    }
                ]
            });
        });

        it('should suppport parsing descriptive titles', () => {
            const usx = `
                <usx version="3.0">
                    <book code="PSA" style="id">- Berean Study Bible</book>
                    <chapter number="6" style="c" sid="PSA 6"/>
                    <para style="s1">Do Not Rebuke Me in Your Anger</para>
                    <para style="r">(Psalms 38:1–22)</para>
                    <para style="d">
                        For the choirmaster. With stringed instruments, according to Sheminith.
                        <note style="f" caller="+">
                        <char style="fr"/>
                        <char style="ft">6:0 </char>
                        <char style="ft">Sheminith is probably a musical term; here and in 1 Chronicles 15:21 and Psalms 12:1.</char>
                        </note>
                        A Psalm of David.
                    </para>
                    <para style="b"/>
                    <para style="q1">
                        <verse number="1" style="v" sid="PSA 6:1"/>
                        <char style="w" strong="H3069">O</char>
                        <char style="w" strong="H3068">LORD</char>,
                        <char style="w" strong="H6213">do</char>
                        <char style="w" strong="H1732">not</char>
                        <char style="w" strong="H1606">rebuke</char>
                        <char style="w" strong="H5921">me</char>
                        <char style="w" strong="H5921">in</char>
                        <char style="w" strong="H5921">Your</char>
                        <char style="w" strong="H0639">anger</char>
                    </para>
                    <para style="q2">
                        <char style="w" strong="H0176">or</char>
                        <char style="w" strong="H4148">discipline</char>
                        <char style="w" strong="H5921">me</char>
                        <char style="w" strong="H5921">in</char>
                        <char style="w" strong="H5921">Your</char>
                        <char style="w" strong="H2534">wrath</char>.
                        <verse eid="PSA 6:1"/>
                    </para>
                </usx>
            `;
            const tree = parser.parse(usx);
            expect(tree).toEqual({
                type: 'root',
                id: 'PSA',
                content: [
                    {
                        type: 'chapter',
                        number: 6,
                        content: [
                            {
                                type: 'heading',
                                content: ['Do Not Rebuke Me in Your Anger']
                            },
                            {
                                type: 'hebrew_subtitle',
                                content: [
                                    'For the choirmaster. With stringed instruments, according to Sheminith.',
                                    { noteId: 0 },
                                    'A Psalm of David.'
                                ]
                            },
                            {
                                type: 'line_break',
                            },
                            {
                                type: 'verse',
                                number: 1,
                                content: [
                                    { text: 'O LORD, do not rebuke me in Your anger', poem: 1 },
                                    { text: 'or discipline me in Your wrath.', poem: 2 },
                                ]
                            },
                        ],
                        footnotes: [
                            {
                                noteId: 0,
                                text: 'Sheminith is probably a musical term; here and in 1 Chronicles 15:21 and Psalms 12:1.',
                                caller: '+',
                                reference: {
                                    chapter: 6,
                                    verse: 0
                                }
                            }
                        ],
                    }
                ]
            });
        });

        it('should suppport verses in descriptive titles', () => {
            const usx = `
                <usx version="3.0">
                    <book code="ZEC" style="id">- Berean Study Bible</book>
                    <chapter number="12" style="c" sid="ZEC 12"/>
                    <para style="s1">The Coming Deliverance of Jerusalem</para>
                    <para style="d"><verse number="1" style="v" sid="ZEC 12:1"/><char style="w" strong="H1697">This</char> <char style="w" strong="H3068">is</char> <char style="w" strong="H5002">the</char> <char style="w" strong="H4853">burden</char> <char style="w" strong="H3068">of</char> <char style="w" strong="H5002">the</char> <char style="w" strong="H1697">word</char> <char style="w" strong="H3068">of</char> <char style="w" strong="H5002">the</char> <char style="w" strong="H3068">LORD</char> <char style="w" strong="H5921">concerning</char> <char style="w" strong="H3478">Israel</char>.</para>
                    <para style="b"/>
                    <para style="m"><char style="w" strong="H1697">Thus</char> <char style="w" strong="H5002">declares</char> <char style="w" strong="H5002">the</char> <char style="w" strong="H3068">LORD</char>, <char style="w" strong="H3068">who</char> <char style="w" strong="H5186">stretches</char> <char style="w" strong="H5186">out</char> <char style="w" strong="H5002">the</char> <char style="w" strong="H8064">heavens</char> <char style="w" strong="H3478">and</char> <char style="w" strong="H3245">lays</char> <char style="w" strong="H5002">the</char> <char style="w" strong="H3245">foundation</char> <char style="w" strong="H3068">of</char> <char style="w" strong="H5002">the</char> <char style="w" strong="H8064">earth</char>, <char style="w" strong="H3068">who</char> <char style="w" strong="H3335">forms</char> <char style="w" strong="H5002">the</char> <char style="w" strong="H7307">spirit</char> <char style="w" strong="H3068">of</char> <char style="w" strong="H0376">man</char> <char style="w" strong="H7130">within</char> <char style="w" strong="H5921">him</char>:<verse eid="ZEC 12:1"/></para>
                </usx>
            `;
            const tree = parser.parse(usx);
            expect(tree).toEqual({
                type: 'root',
                id: 'ZEC',
                content: [
                    {
                        type: 'chapter',
                        number: 12,
                        content: [
                            {
                                type: 'heading',
                                content: ['The Coming Deliverance of Jerusalem']
                            },
                            {
                                type: 'verse',
                                number: 1,
                                content: [
                                    {
                                        text: 'This is the burden of the word of the LORD concerning Israel.',
                                        descriptive: true,
                                    },
                                    {
                                        lineBreak: true
                                    },
                                    'Thus declares the LORD, who stretches out the heavens and lays the foundation of the earth, who forms the spirit of man within him:'
                                ]
                            },
                        ],
                        footnotes: [],
                    }
                ]
            });
        });

        it('should ignore cross references', () => {
            const usx = `
                <usx version="3.0">
                    <book code="MAT" style="id">- World English Bible</book>
                    <chapter number="5" style="c" sid="MAT 5"/>
                    <para style="q1">
                        <verse number="3" style="v" sid="MAT 5:3"/>
                        <char style="wj">
                            “<char style="w" strong="G3107">Blessed</char>
                            <char style="w" strong="G1510">are</char>
                            <char style="w" strong="G3588">the</char>
                            <char style="w" strong="G4434">poor</char>
                            <char style="w" strong="G3588">in</char>
                            <char style="w" strong="G4151">spirit</char>,
                        </char>
                    </para>
                    <para style="q2">
                        <char style="wj">
                            <char style="w" strong="G3754">for</char>
                            <char style="w" strong="G0846">theirs</char>
                            <char style="w" strong="G1510">is</char>
                            <char style="w" strong="G3588">the</char>
                            <char style="w" strong="G0932">Kingdom</char>
                            <char style="w" strong="G4151">of</char>
                            <char style="w" strong="G3772">Heaven</char>.
                        </char>
                        <note style="x" caller="+">
                            <char style="xo">5:3 </char>
                            <char style="xt">Isaiah 57:15; 66:2</char>
                        </note>
                        <verse eid="MAT 5:3"/>
                    </para>
                </usx>
            `;
            const tree = parser.parse(usx);
            expect(tree).toEqual({
                type: 'root',
                id: 'MAT',
                content: [
                    {
                        type: 'chapter',
                        number: 5,
                        content: [
                            {
                                type: 'verse',
                                number: 3,
                                content: [
                                    { text: '“Blessed are the poor in spirit,', poem: 1, wordsOfJesus: true, },
                                    { text: 'for theirs is the Kingdom of Heaven.', poem: 2, wordsOfJesus: true, },
                                ]
                            },
                        ],
                        footnotes: [],
                    }
                ],
            });
        });

        it('should not ignore the node of a para element', () => {
            const usx = `
                <usx version="3.0">
                    <book code="JHN" style="id">43-JHN-web.sfm World English Bible (WEB)</book>
                    <chapter number="1" style="c" sid="JHN 1"/>
                    <para style="p"><verse number="1" style="v" sid="JHN 1:1"/><char style="w" strong="G1722">In</char> <char style="w" strong="G1722">the</char> <char style="w" strong="G0746">beginning</char> <char style="w" strong="G1510">was</char> <char style="w" strong="G1722">the</char> <char style="w" strong="G3056">Word</char>, <char style="w" strong="G2532">and</char> <char style="w" strong="G1722">the</char> <char style="w" strong="G3056">Word</char> <char style="w" strong="G1510">was</char> <char style="w" strong="G1722">with</char> <char style="w" strong="G2316">God</char>, <char style="w" strong="G2532">and</char> <char style="w" strong="G1722">the</char> <char style="w" strong="G3056">Word</char> <char style="w" strong="G1510">was</char> <char style="w" strong="G2316">God</char>.<verse eid="JHN 1:1"/></para>
                </usx>
            `;
            const tree = parser.parse(usx);
            expect(tree).toEqual({
                type: 'root',
                id: 'JHN',
                content: [
                    {
                        type: 'chapter',
                        number: 1,
                        content: [
                            {
                                type: 'verse',
                                number: 1,
                                content: [
                                    'In the beginning was the Word, and the Word was with God, and the Word was God.'
                                ]
                            },
                        ],
                        footnotes: [],
                    }
                ]
            });
        });

        it('should not ignore newlines between two poem paras', () => {
            const usx = `
                <usx version="3.0">
                    <book code="MAT" style="id">- World English Bible</book>
                    <chapter number="2" style="c" sid="MAT 2"/>
                    <para style="q2"><verse number="18" style="v" sid="MAT 2:18"/><char style="w" strong="G2532">she</char> wouldn&#8217;t <char style="w" strong="G1510">be</char> <char style="w" strong="G3870">comforted</char>,</para>
                    <para style="q2"><char style="w" strong="G3754">because</char> <char style="w" strong="G2532">they</char> <char style="w" strong="G1510">are</char> <char style="w" strong="G3756">no</char> <char style="w" strong="G4183">more</char>.&#8221;<note style="x" caller="+"><char style="xo">2:18 </char><char style="xt">Jeremiah 31:15</char></note><verse eid="MAT 2:18"/></para>
                </usx>
            `;

            const tree = parser.parse(usx);

            expect(tree).toEqual({
                type: 'root',
                id: 'MAT',
                content: [
                    {
                        type: 'chapter',
                        number: 2,
                        content: [
                            {
                                type: 'verse',
                                number: 18,
                                content: [
                                    {
                                        text: 'she wouldn’t be comforted,',
                                        poem: 2,
                                    },
                                    {
                                        text: 'because they are no more.”',
                                        poem: 2,
                                    }
                                ]
                            },
                        ],
                        footnotes: [],
                    }
                ]
            });
        });

        it('should support Words of Jesus', () => {
            const usx = `
                <usx version="3.0">
                    <book code="MAT" style="id">- World English Bible</book>
                    <chapter number="5" style="c" sid="MAT 5"/>
                    <para style="q1">
                        <verse number="3" style="v" sid="MAT 5:3"/>
                        <char style="wj">
                            “<char style="w" strong="G3107">Blessed</char>
                            <char style="w" strong="G1510">are</char>
                            <char style="w" strong="G3588">the</char>
                            <char style="w" strong="G4434">poor</char>
                            <char style="w" strong="G3588">in</char>
                            <char style="w" strong="G4151">spirit</char>,
                        </char>
                    </para>
                    <para style="q2">
                        <char style="wj">
                            <char style="w" strong="G3754">for</char>
                            <char style="w" strong="G0846">theirs</char>
                            <char style="w" strong="G1510">is</char>
                            <char style="w" strong="G3588">the</char>
                            <char style="w" strong="G0932">Kingdom</char>
                            <char style="w" strong="G4151">of</char>
                            <char style="w" strong="G3772">Heaven</char>.
                        </char>
                        <note style="x" caller="+">
                            <char style="xo">5:3 </char>
                            <char style="xt">Isaiah 57:15; 66:2</char>
                        </note>
                        <verse eid="MAT 5:3"/>
                    </para>
                </usx>
            `;
            const tree = parser.parse(usx);
            expect(tree).toEqual({
                type: 'root',
                id: 'MAT',
                content: [
                    {
                        type: 'chapter',
                        number: 5,
                        content: [
                            {
                                type: 'verse',
                                number: 3,
                                content: [
                                    { text: '“Blessed are the poor in spirit,', poem: 1, wordsOfJesus: true, },
                                    { text: 'for theirs is the Kingdom of Heaven.', poem: 2, wordsOfJesus: true, },
                                ]
                            },
                        ],
                        footnotes: [],
                    }
                ],
            });
        });

        it('should support verses that span multiple paragraphs', () => {
            const usx = `
                <usx version="3.0">
                    <book code="GET" style="id">- BSB</book>
                    <chapter number="26" style="c" sid="GEN 26"/>
                    <para style="m"><verse number="8" style="v" sid="GEN 26:8"/><char style="w" strong="H3588">When</char> <char style="w" strong="H3327">Isaac</char> <char style="w" strong="H1961">had</char> <char style="w" strong="H1961">been</char> <char style="w" strong="H8033">there</char> <char style="w" strong="H1961">a</char> <char style="w" strong="H3117">long</char> <char style="w" strong="H3117">time</char>, <char style="w" strong="H0040">Abimelech</char> <char style="w" strong="H4428">king</char> <char style="w" strong="H4428">of</char> <char style="w" strong="H7200">the</char> <char style="w" strong="H6430">Philistines</char> <char style="w" strong="H7200">looked</char> <char style="w" strong="H8259">down</char> <char style="w" strong="H3117">from</char> <char style="w" strong="H7200">the</char> <char style="w" strong="H2474">window</char> <char style="w" strong="H4428">and</char> <char style="w" strong="H1961">was</char> <char style="w" strong="H8610">surprised</char> <char style="w" strong="H1961">to</char> <char style="w" strong="H7200">see</char> <char style="w" strong="H3327">Isaac</char> <char style="w" strong="H6711">caressing</char> <char style="w" strong="H7200">his</char> <char style="w" strong="H0802">wife</char> <char style="w" strong="H7259">Rebekah</char>.<verse eid="GEN 26:8"/> <verse number="9" style="v" sid="GEN 26:9"/><char style="w" strong="H0040">Abimelech</char> <char style="w" strong="H3327">sent</char> <char style="w" strong="H3588">for</char> <char style="w" strong="H3327">Isaac</char> <char style="w" strong="H3327">and</char> <char style="w" strong="H7121">said</char>, &#8220;<char style="w" strong="H6435">So</char> <char style="w" strong="H1931">she</char> <char style="w" strong="H1931">is</char> <char style="w" strong="H2088">really</char> <char style="w" strong="H5921">your</char> <char style="w" strong="H0802">wife</char>! <char style="w" strong="H3588">How</char> <char style="w" strong="H3201">could</char> <char style="w" strong="H3588">you</char> <char style="w" strong="H0559">say</char>, &#8216;<char style="w" strong="H1931">She</char> <char style="w" strong="H1931">is</char> <char style="w" strong="H5921">my</char> sister&#8217;?&#8221;</para>
                    <para style="b"/>
                    <para style="m"><char style="w" strong="H3327">Isaac</char> <char style="w" strong="H0559">replied</char>, &#8220;<char style="w" strong="H3588">Because</char> <char style="w" strong="H3588">I</char> <char style="w" strong="H0559">thought</char> <char style="w" strong="H3588">I</char> <char style="w" strong="H6435">might</char> <char style="w" strong="H4191">die</char> <char style="w" strong="H5921">on</char> <char style="w" strong="H5921">account</char> <char style="w" strong="H5921">of</char> <char style="w" strong="H5921">her</char>.&#8221;<verse eid="GEN 26:9"/></para>
                </usx>
            `;

            const tree = parser.parse(usx);
            expect(tree).toEqual({
                type: 'root',
                id: 'GET',
                content: [
                    {
                        type: 'chapter',
                        number: 26,
                        content: [
                            {
                                type: 'verse',
                                number: 8,
                                content: [
                                    'When Isaac had been there a long time, Abimelech king of the Philistines looked down from the window and was surprised to see Isaac caressing his wife Rebekah.'
                                ]
                            },
                            {
                                type: 'verse',
                                number: 9,
                                content: [
                                    'Abimelech sent for Isaac and said, “So she is really your wife! How could you say, ‘She is my sister’?”',
                                    {
                                        lineBreak: true,
                                    },
                                    'Isaac replied, “Because I thought I might die on account of her.”'
                                ]
                            }
                        ],
                        footnotes: [],
                    }
                ],
            });
        });

        it('should support verses that are contained in the words of Jesus', () => {
            const usx = `
                <usx version="3.0">
                    <book code="MAT" style="id">- BSB</book>
                    <chapter number="17" style="c" sid="MAT 17"/>
                    <para style="p"><verse number="26" style="v" sid="MAT 17:26"/><char style="w" strong="G4074">Peter</char> <char style="w" strong="G3004">said</char> <char style="w" strong="G3004">to</char> <char style="w" strong="G3588">him</char>, &#8220;<char style="w" strong="G3588">From</char> <char style="w" strong="G3581">strangers</char>.&#8221;</para>
                    <para style="p"><char style="w" strong="G2424">Jesus</char> <char style="w" strong="G3004">said</char> <char style="w" strong="G3004">to</char> <char style="w" strong="G3588">him</char>, <char style="wj">&#8220;<char style="w" strong="G1161">Therefore</char> <char style="w" strong="G1161">the</char> <char style="w" strong="G5207">children</char> <char style="w" strong="G1510">are</char> <char style="w" strong="G1658">exempt</char>. </char><verse eid="MAT 17:26"/> <verse number="27" style="v" sid="MAT 17:27"/><char style="wj"><char style="w" strong="G1161">But</char>, <char style="w" strong="G3361">lest</char> <char style="w" strong="G2532">we</char> <char style="w" strong="G4624">cause</char> <char style="w" strong="G3588">them</char> <char style="w" strong="G1519">to</char> <char style="w" strong="G4624">stumble</char>, <char style="w" strong="G4198">go</char> <char style="w" strong="G1519">to</char> <char style="w" strong="G2532">the</char> <char style="w" strong="G2281">sea</char>, <char style="w" strong="G2532">cast</char> <char style="w" strong="G2532">a</char> <char style="w" strong="G0044">hook</char>, <char style="w" strong="G2532">and</char> <char style="w" strong="G2983">take</char> <char style="w" strong="G1519">up</char> <char style="w" strong="G2532">the</char> <char style="w" strong="G4413">first</char> <char style="w" strong="G2486">fish</char> <char style="w" strong="G2443">that</char> <char style="w" strong="G2532">comes</char> <char style="w" strong="G1519">up</char>. <char style="w" strong="G1161">When</char> <char style="w" strong="G4771">you</char> <char style="w" strong="G2532">have</char> <char style="w" strong="G0455">opened</char> <char style="w" strong="G1325">its</char> <char style="w" strong="G4750">mouth</char>, <char style="w" strong="G4771">you</char> <char style="w" strong="G2532">will</char> <char style="w" strong="G2147">find</char> <char style="w" strong="G2532">a</char> stater <char style="w" strong="G1406">coin</char>.</char><note style="f" caller="+"><char style="fr">17:27 </char><char style="ft">A stater is a silver coin equivalent to four Attic or two Alexandrian drachmas, or a Jewish shekel: just exactly enough to cover the half-shekel temple tax for two people. A shekel is about 10 grams or about 0.35 ounces, usually in the form of a silver coin.</char></note> <char style="wj"><char style="w" strong="G2983">Take</char> <char style="w" strong="G2443">that</char>, <char style="w" strong="G2532">and</char> <char style="w" strong="G1325">give</char> <char style="w" strong="G2532">it</char> <char style="w" strong="G1519">to</char> <char style="w" strong="G3588">them</char> <char style="w" strong="G1519">for</char> <char style="w" strong="G1325">me</char> <char style="w" strong="G2532">and</char> <char style="w" strong="G4771">you</char>.&#8221;</char><verse eid="MAT 17:27"/></para>
                    <chapter eid="MAT 17"/>
                </usx>
            `;

            const tree = parser.parse(usx);
            expect(tree).toEqual({
                type: 'root',
                id: 'MAT',
                content: [
                    {
                        type: 'chapter',
                        number: 17,
                        content: [
                            {
                                type: 'verse',
                                number: 26,
                                content: [
                                    'Peter said to him, “From strangers.” Jesus said to him,',
                                    {
                                        wordsOfJesus: true,
                                        text: '“Therefore the children are exempt.',
                                    }
                                ]
                            },
                            {
                                type: 'verse',
                                number: 27,
                                content: [
                                    {
                                        wordsOfJesus: true,
                                        text: 'But, lest we cause them to stumble, go to the sea, cast a hook, and take up the first fish that comes up. When you have opened its mouth, you will find a stater coin.'
                                    },
                                    {
                                        noteId: 0,
                                    },
                                    {
                                        wordsOfJesus: true,
                                        text: 'Take that, and give it to them for me and you.”'
                                    }
                                ]
                            }
                        ],
                        footnotes: [
                            {
                                noteId: 0,
                                caller: '+',
                                reference: {
                                    chapter: 17,
                                    verse: 27,
                                },
                                text: 'A stater is a silver coin equivalent to four Attic or two Alexandrian drachmas, or a Jewish shekel: just exactly enough to cover the half-shekel temple tax for two people. A shekel is about 10 grams or about 0.35 ounces, usually in the form of a silver coin.'
                            }
                        ],
                    }
                ]
            });
        });

        it('should support multiple verses within a paragraph', () => {
            const usx = `
                <usx>
                    <book code="ZEC" style="id">- BSB</book>
                    <chapter number="12" style="c" sid="ZEC 17"/>
                    <para style="b"/>
                    <para style="m"><verse number="10" style="v" sid="ZEC 12:10"/><char style="w" strong="H1732">Then</char> <char style="w" strong="H5921">I</char> <char style="w" strong="H1004">will</char> <char style="w" strong="H8210">pour</char> <char style="w" strong="H8210">out</char> <char style="w" strong="H5921">on</char> <char style="w" strong="H5921">the</char> <char style="w" strong="H1004">house</char> <char style="w" strong="H1004">of</char> <char style="w" strong="H1732">David</char> <char style="w" strong="H1004">and</char> <char style="w" strong="H5921">on</char> <char style="w" strong="H5921">the</char> <char style="w" strong="H3427">people</char> <char style="w" strong="H1004">of</char> <char style="w" strong="H3389">Jerusalem</char> <char style="w" strong="H5921">a</char> <char style="w" strong="H7307">spirit</char> <note style="f" caller="+"><char style="fr"/><char style="ft">12:10 </char><char style="ft">Or the Spirit</char></note> <char style="w" strong="H1004">of</char> <char style="w" strong="H2580">grace</char> <char style="w" strong="H1004">and</char> <char style="w" strong="H8605">prayer</char>, <char style="w" strong="H1004">and</char> <char style="w" strong="H5921">they</char> <char style="w" strong="H1004">will</char> <char style="w" strong="H5027">look</char> <char style="w" strong="H5921">on</char> <char style="w" strong="H5921">Me</char>,<note style="f" caller="+"><char style="fr"/><char style="ft">12:10 </char><char style="ft">Or to Me</char></note> <char style="w" strong="H5921">the</char> <char style="w" strong="H3173">One</char> <char style="w" strong="H5921">they</char> <char style="w" strong="H1004">have</char> <char style="w" strong="H1856">pierced</char>.<note style="f" caller="+"><char style="fr"/><char style="ft">12:10 </char><char style="ft">Cited in John 19:37</char></note> <char style="w" strong="H5921">They</char> <char style="w" strong="H1004">will</char> <char style="w" strong="H5594">mourn</char> <char style="w" strong="H5921">for</char> <char style="w" strong="H5921">Him</char> <char style="w" strong="H3389">as</char> <char style="w" strong="H3173">one</char> <char style="w" strong="H5594">mourns</char> <char style="w" strong="H5921">for</char> <char style="w" strong="H7307">an</char> <char style="w" strong="H3173">only</char> <char style="w" strong="H3173">child</char>, <char style="w" strong="H1004">and</char> <char style="w" strong="H6087">grieve</char> <char style="w" strong="H4843">bitterly</char> <char style="w" strong="H5921">for</char> <char style="w" strong="H5921">Him</char> <char style="w" strong="H3389">as</char> <char style="w" strong="H3173">one</char> grieves <char style="w" strong="H5921">for</char> <char style="w" strong="H5921">a</char> <char style="w" strong="H1060">firstborn</char> <char style="w" strong="H3173">son</char>.<verse eid="ZEC 12:10"/></para>
                    <para style="b"/>
                    <para style="m"><verse number="11" style="v" sid="ZEC 12:11"/><char style="w" strong="H3117">On</char> <char style="w" strong="H3117">that</char> <char style="w" strong="H3117">day</char> <char style="w" strong="H3117">the</char> <char style="w" strong="H4553">wailing</char> <char style="w" strong="H3117">in</char> <char style="w" strong="H3389">Jerusalem</char> <char style="w" strong="H3389">will</char> <char style="w" strong="H3117">be</char> <char style="w" strong="H3117">as</char> <char style="w" strong="H1431">great</char> <char style="w" strong="H3117">as</char> <char style="w" strong="H3117">the</char> <char style="w" strong="H4553">wailing</char> <char style="w" strong="H3117">of</char> Hadad-rimmon <char style="w" strong="H3117">in</char> <char style="w" strong="H3117">the</char> <char style="w" strong="H1237">plain</char> <char style="w" strong="H3117">of</char> <char style="w" strong="H4023">Megiddo</char>.<verse eid="ZEC 12:11"/> <verse number="12" style="v" sid="ZEC 12:12"/><char style="w" strong="H1732">The</char> <char style="w" strong="H4940">land</char> <char style="w" strong="H1004">will</char> <char style="w" strong="H5594">mourn</char>, <char style="w" strong="H0376">each</char> <char style="w" strong="H4940">clan</char> <char style="w" strong="H1004">on</char> <char style="w" strong="H3605">its</char> <char style="w" strong="H1961">own</char>: <char style="w" strong="H1732">the</char> <char style="w" strong="H4940">clan</char> <char style="w" strong="H1004">of</char> <char style="w" strong="H1732">the</char> <char style="w" strong="H1004">house</char> <char style="w" strong="H1004">of</char> <char style="w" strong="H1732">David</char> <char style="w" strong="H1004">and</char> <char style="w" strong="H1732">their</char> <char style="w" strong="H0802">wives</char>, <char style="w" strong="H1732">the</char> <char style="w" strong="H4940">clan</char> <char style="w" strong="H1004">of</char> <char style="w" strong="H1732">the</char> <char style="w" strong="H1004">house</char> <char style="w" strong="H1004">of</char> <char style="w" strong="H5416">Nathan</char> <char style="w" strong="H1004">and</char> <char style="w" strong="H1732">their</char> <char style="w" strong="H0802">wives</char>,<verse eid="ZEC 12:12"/> <verse number="13" style="v" sid="ZEC 12:13"/><char style="w" strong="H1004">the</char> <char style="w" strong="H4940">clan</char> <char style="w" strong="H1004">of</char> <char style="w" strong="H1004">the</char> <char style="w" strong="H1004">house</char> <char style="w" strong="H1004">of</char> <char style="w" strong="H3878">Levi</char> <char style="w" strong="H1004">and</char> <char style="w" strong="H3605">their</char> <char style="w" strong="H0802">wives</char>, <char style="w" strong="H1004">the</char> <char style="w" strong="H4940">clan</char> <char style="w" strong="H1004">of</char> <char style="w" strong="H8097">Shimei</char> <char style="w" strong="H1004">and</char> <char style="w" strong="H3605">their</char> <char style="w" strong="H0802">wives</char>,<verse eid="ZEC 12:13"/> <verse number="14" style="v" sid="ZEC 12:14"/><char style="w" strong="H3605">and</char> <char style="w" strong="H3605">all</char> <char style="w" strong="H3605">the</char> <char style="w" strong="H7604">remaining</char> <char style="w" strong="H4940">clans</char> <char style="w" strong="H3605">and</char> <char style="w" strong="H3605">their</char> <char style="w" strong="H0802">wives</char>.<verse eid="ZEC 12:14"/></para>
                    <chapter eid="ZEC 12"/>
                </usx>
            `;

            const tree = parser.parse(usx);
            expect(tree).toEqual({
                type: 'root',
                id: 'ZEC',
                content: [
                    {
                        type: 'chapter',
                        number: 12,
                        content: [
                            {
                                type: 'line_break'
                            },
                            {
                                type: 'verse',
                                number: 10,
                                content: [
                                    'Then I will pour out on the house of David and on the people of Jerusalem a spirit',
                                    {
                                        noteId: 0
                                    },
                                    'of grace and prayer, and they will look on Me,',
                                    {
                                        noteId: 1,
                                    },
                                    'the One they have pierced.',
                                    {
                                        noteId: 2
                                    },
                                    'They will mourn for Him as one mourns for an only child, and grieve bitterly for Him as one grieves for a firstborn son.'
                                ]
                            },
                            {
                                type: 'line_break'
                            },
                            {
                                type: 'verse',
                                number: 11,
                                content: [
                                    'On that day the wailing in Jerusalem will be as great as the wailing of Hadad-rimmon in the plain of Megiddo.',
                                ]
                            },
                            {
                                type: 'verse',
                                number: 12,
                                content: [
                                    'The land will mourn, each clan on its own: the clan of the house of David and their wives, the clan of the house of Nathan and their wives,',
                                ]
                            },
                            {
                                type: 'verse',
                                number: 13,
                                content: [
                                    'the clan of the house of Levi and their wives, the clan of Shimei and their wives,',
                                ]
                            },
                            {
                                type: 'verse',
                                number: 14,
                                content: [
                                    'and all the remaining clans and their wives.'
                                ]
                            }
                        ],
                        "footnotes": [
                            {
                                "caller": "+",
                                "noteId": 0,
                                "reference": {
                                    "chapter": 12,
                                    "verse": 10,
                                },
                                "text": "Or the Spirit",
                            },
                            {
                                "caller": "+",
                                "noteId": 1,
                                "reference": {
                                    "chapter": 12,
                                    "verse": 10,
                                },
                                "text": "Or to Me",
                            },
                            {
                                "caller": "+",
                                "noteId": 2,
                                "reference": {
                                    "chapter": 12,
                                    "verse": 10,
                                },
                                "text": "Cited in John 19:37",
                            },
                        ]
                    }
                ]
            });
        });

        it('should be able to parse a whole book', () => {
            const tree = parser.parse(Matthew);
            expect(tree).toMatchSnapshot();
        });

        it('should be able to parse John', () => {
            const tree = parser.parse(John);
            expect(tree).toMatchSnapshot();
        });

        it('should be able to parse 1SA', () => {
            const tree = parser.parse(Sa);
            expect(tree).toMatchSnapshot();
        });

        it('should not ignore the first word of a verse', () => {
            const usx = firstXLines(John, 38) + '\n</usx>';
            const tree = parser.parse(usx);
            expect(tree).toMatchSnapshot();
        });

        it('should not ignore the first word of continuation on a verse', () => {
            const usx = `
            <usx version="3.0">
                <book code="MAT" style="id">- World English Bible</book>
                <chapter number="1" style="c" sid="MAT 1"/>
                <para style="q1"><verse number="23" style="v" sid="MAT 1:23"/>&#8220;<char style="w" strong="G2400">Behold</char>, <char style="w" strong="G1722">the</char> <char style="w" strong="G3933">virgin</char> <char style="w" strong="G2532">shall</char> <char style="w" strong="G1510">be</char> <char style="w" strong="G3326">with</char> <char style="w" strong="G1064">child</char>,</para>
                <para style="q2"><char style="w" strong="G2532">and</char> <char style="w" strong="G2532">shall</char> <char style="w" strong="G5088">give</char> <char style="w" strong="G5088">birth</char> <char style="w" strong="G2532">to</char> <char style="w" strong="G2192">a</char> <char style="w" strong="G5207">son</char>.</para>
            </usx>`;
            const tree = parser.parse(usx);
            expect(tree).toEqual({
                type: 'root',
                id: 'MAT',
                content: [
                    {
                        type: 'chapter',
                        number: 1,
                        content: [
                            {
                                type: 'verse',
                                number: 23,
                                content: [
                                    {
                                        text: '“Behold, the virgin shall be with child,',
                                        poem: 1,
                                    },
                                    {
                                        text: 'and shall give birth to a son.',
                                        poem: 2,
                                    }
                                ]
                            },
                        ],
                        footnotes: [],
                    }
                ],
            });
        });

        // it('should parse the same as the USFM parser', () => {
        //     const usfmParser = new UsfmParser();
        //     const tree = parser.parse(Matthew);
        //     const usfmTree = usfmParser.parse(MatthewUsfm);
        //     expect(tree).toEqual(usfmTree);
        // })

    });

});


function firstXLines(content: string, x: number) {
    const lines = content.split('\n');
    return lines.slice(0, x).join('\n');
}