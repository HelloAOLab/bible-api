import { USXParser } from './usx-parser.js';
import { DOMParser, Element, Node } from 'linkedom';
import { TyndaleXmlParser } from './tyndale-xml-parser.js';

describe('CommentaryCsvParser', () => {
    let parser: TyndaleXmlParser;

    beforeEach(() => {
        globalThis.DOMParser = DOMParser as any; // window.DOMParser as any;
        globalThis.Element = Element as any; // window.Element;
        globalThis.Node = Node as any; // window.Node;

        parser = new TyndaleXmlParser(new DOMParser() as any);
    });

    describe('parse()', () => {
        it('should parse the given study note items', () => {
            const tree = parser.parse(
                [
                    `<items release="1.25">`,
                    `<item name="Gen.1.1-2.3" typename="StudyNote" product="TyndaleOpenStudyNotes">`,
                    `<refs>Gen.1.1-2.3</refs>`,
                    `<body>`,
                    `<p class="sn-text"><span class="sn-ref"><a href="?bref=Gen.1.1-2.3">1:1–2:3</a></span> These verses introduce the Pentateuch (Genesis—Deuteronomy) and teach</p>`,
                    `</body>`,
                    `</item>`,
                    `</items>`,
                ].join('\n')
            );

            expect(tree).toEqual({
                type: 'commentary/root',
                books: [
                    {
                        type: 'book',
                        book: 'GEN',
                        introduction: null,
                        chapters: [
                            {
                                type: 'chapter',
                                introduction: null,
                                number: 1,
                                verses: [
                                    {
                                        type: 'verse',
                                        number: 1,
                                        // endChapter: 2,
                                        // endVerse: 3,
                                        content: [
                                            '1:1–2:3 These verses introduce the Pentateuch (Genesis—Deuteronomy) and teach',
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            });
        });

        it('should place notes starting at the same verse in the same verse commentary node', () => {
            const tree = parser.parse(
                [
                    `<items release="1.25">`,
                    `<item name="Gen.1.1-2.3" typename="StudyNote" product="TyndaleOpenStudyNotes">`,
                    `<refs>Gen.1.1-2.3</refs>`,
                    `<body>`,
                    `<p class="sn-text"><span class="sn-ref"><a href="?bref=Gen.1.1-2.3">1:1–2:3</a></span> These verses introduce the Pentateuch (Genesis—Deuteronomy) and teach</p>`,
                    `</body>`,
                    `</item>`,
                    `<item name="Gen.1.1" typename="StudyNote" product="TyndaleOpenStudyNotes">`,
                    `<refs>Gen.1.1</refs>`,
                    `<body>`,
                    `<p class="sn-text"><span class="sn-ref"><a href="?bref=Gen.1.1">1:1</a></span> <span class="sn-excerpt">In the beginning God created the heavens and the earth:</span></p>`,
                    `</body>`,
                    `</item>`,
                    `</items>`,
                ].join('\n')
            );

            expect(tree).toEqual({
                type: 'commentary/root',
                books: [
                    {
                        type: 'book',
                        book: 'GEN',
                        introduction: null,
                        chapters: [
                            {
                                type: 'chapter',
                                introduction: null,
                                number: 1,
                                verses: [
                                    {
                                        type: 'verse',
                                        number: 1,
                                        // endChapter: 2,
                                        // endVerse: 3,
                                        content: [
                                            '1:1–2:3 These verses introduce the Pentateuch (Genesis—Deuteronomy) and teach',
                                            '1:1 In the beginning God created the heavens and the earth:',
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            });
        });

        it('should support multiple books', () => {
            const tree = parser.parse(
                [
                    `<items release="1.25">`,
                    `<item name="Gen.1.1-2.3" typename="StudyNote" product="TyndaleOpenStudyNotes">`,
                    `<refs>Gen.1.1-2.3</refs>`,
                    `<body>`,
                    `<p class="sn-text"><span class="sn-ref"><a href="?bref=Gen.1.1-2.3">1:1–2:3</a></span> These verses introduce the Pentateuch (Genesis—Deuteronomy) and teach</p>`,
                    `</body>`,
                    `</item>`,
                    `<item name="IKgs.11.38" typename="StudyNote" product="TyndaleOpenStudyNotes">`,
                    `<refs>1Kgs.11.38</refs>`,
                    `<body>`,
                    `<p class="sn-text"><span class="sn-ref"><a href="?bref=1Kgs.11.38">11:38</a></span> <span class="sn-excerpt">an enduring dynasty:</span> Jeroboam had a great opportunity.</p>`,
                    `</body>`,
                    `</item>`,
                    `</items>`,
                ].join('\n')
            );

            expect(tree).toEqual({
                type: 'commentary/root',
                books: [
                    {
                        type: 'book',
                        book: 'GEN',
                        introduction: null,
                        chapters: [
                            {
                                type: 'chapter',
                                introduction: null,
                                number: 1,
                                verses: [
                                    {
                                        type: 'verse',
                                        number: 1,
                                        content: [
                                            '1:1–2:3 These verses introduce the Pentateuch (Genesis—Deuteronomy) and teach',
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        type: 'book',
                        book: '1KI',
                        introduction: null,
                        chapters: [
                            {
                                type: 'chapter',
                                introduction: null,
                                number: 11,
                                verses: [
                                    {
                                        type: 'verse',
                                        number: 38,
                                        content: [
                                            '11:38 an enduring dynasty: Jeroboam had a great opportunity.',
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            });
        });
    });
});
