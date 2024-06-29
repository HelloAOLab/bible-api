import { USXParser } from "./usx-parser";
import { JSDOM } from 'jsdom';

describe('USXParser', () => {
    let parser: USXParser;

    beforeEach(() => {
        const { window } = new JSDOM();
        globalThis.DOMParser = window.DOMParser as any;
        globalThis.Element = window.Element;
        globalThis.Node = window.Node;

        parser = new USXParser(window);
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
                                text: '2:2 Cited in Hebrews 4:4',
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
                                text: '2:2 Cited in Hebrews 4:4',
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
                                text: '6:0 Sheminith is probably a musical term; here and in 1 Chronicles 15:21 and Psalms 12:1.',
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

    });

});