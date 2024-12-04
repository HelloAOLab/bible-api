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
        describe('study notes', () => {
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

            it('should generate newlines between paragraphs', () => {
                const tree = parser.parse(
                    [
                        `<items release="1.25">`,
                        `<item name="Gen.1.1-2.3" typename="StudyNote" product="TyndaleOpenStudyNotes">`,
                        `<refs>Gen.1.1-2.3</refs>`,
                        `<body>`,
                        `<p class="intro-overview">Genesis is the book of beginnings—of the universe and of humanity, of sin and its catastrophic effects, and of God’s plan to restore blessing to the world through his chosen people. God began his plan when he called Abraham and made a covenant with him. Genesis traces God’s promised blessings from generation to generation, to the time of bondage and the need for redemption from Egypt. It lays the foundation for God’s subsequent revelation, and most other books of the Bible draw on its contents. Genesis is a source of instruction, comfort, and edification.</p>`,
                        `<p class="intro-h1">Setting</p>`,
                        `<p class="intro-body-fl">When Genesis was written, the children of Israel had been slaves in Egypt for four hundred years. They had recently been released from bondage and guided through the desert to meet the Lord at Mount Sinai, where he had established his covenant relationship with them and had given them his law through Moses. Israel was now poised to enter the Promised Land and receive the inheritance that God had promised Abraham.</p>`,
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
                                                [
                                                    `Genesis is the book of beginnings—of the universe and of humanity, of sin and its catastrophic effects, and of God’s plan to restore blessing to the world through his chosen people. God began his plan when he called Abraham and made a covenant with him. Genesis traces God’s promised blessings from generation to generation, to the time of bondage and the need for redemption from Egypt. It lays the foundation for God’s subsequent revelation, and most other books of the Bible draw on its contents. Genesis is a source of instruction, comfort, and edification.`,
                                                    ``,
                                                    `Setting`,
                                                    ``,
                                                    `When Genesis was written, the children of Israel had been slaves in Egypt for four hundred years. They had recently been released from bondage and guided through the desert to meet the Lord at Mount Sinai, where he had established his covenant relationship with them and had given them his law through Moses. Israel was now poised to enter the Promised Land and receive the inheritance that God had promised Abraham.`,
                                                ].join('\n'),
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

        describe('book intros', () => {
            it('should parse the given book intros', () => {
                const tree = parser.parse(
                    [
                        `<items release="1.25">`,
                        `<item name="GenIntro" typename="BookIntro" product="TyndaleOpenStudyNotes">`,
                        `<title>Genesis</title>`,
                        `<refs>Gen.1.1-50.26</refs>`,
                        `<body>`,
                        `<p class="intro-overview">Genesis is the book of beginnings—of the universe and of humanity, of sin and its catastrophic effects, and of God’s plan to restore blessing to the world through his chosen people. God began his plan when he called Abraham and made a covenant with him. Genesis traces God’s promised blessings from.</p>`,
                        `<p class="intro-h1">Setting</p>`,
                        `<p class="intro-body-fl">When Genesis was written, the children of Israel had been slaves in Egypt for four hundred years. They had recently been released from bondage and guided through the desert to meet the Lord at Mount Sinai, where he had established his covenant relationship with them and had given them his law through Moses. Israel was now poised to enter the Promised Land and receive the inheritance that God had promised Abraham.</p>`,
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
                            introduction: [
                                'Genesis is the book of beginnings—of the universe and of humanity, of sin and its catastrophic effects, and of God’s plan to restore blessing to the world through his chosen people. God began his plan when he called Abraham and made a covenant with him. Genesis traces God’s promised blessings from.',
                                '',
                                'Setting',
                                '',
                                'When Genesis was written, the children of Israel had been slaves in Egypt for four hundred years. They had recently been released from bondage and guided through the desert to meet the Lord at Mount Sinai, where he had established his covenant relationship with them and had given them his law through Moses. Israel was now poised to enter the Promised Land and receive the inheritance that God had promised Abraham.',
                            ].join('\n'),
                            chapters: [],
                        },
                    ],
                });
            });

            it('should support multiple books', () => {
                const tree = parser.parse(
                    [
                        `<items release="1.25">`,
                        `<item name="GenIntro" typename="BookIntro" product="TyndaleOpenStudyNotes">`,
                        `<title>Genesis</title>`,
                        `<refs>Gen.1.1-50.26</refs>`,
                        `<body>`,
                        `<p class="intro-overview">Genesis is the book of beginnings—of the universe and of humanity, of sin and its catastrophic effects, and of God’s plan to restore blessing to the world through his chosen people. God began his plan when he called Abraham and made a covenant with him. Genesis traces God’s promised blessings from.</p>`,
                        `</body>`,
                        `</item>`,
                        `<item name="ExodIntro" typename="BookIntro" product="TyndaleOpenStudyNotes">`,
                        `<title>Exodus</title>`,
                        `<refs>Exod.1.1-40.38</refs>`,
                        `<body>`,
                        `<p class="intro-overview">What does it mean to be in a relationship with God, the ultimate being in the universe? How does one establish that relationship? What is that relationship like, and what does it take to stay in it? These are questions that people around the world have been asking since the beginning of time. The book of Exodus provided the ancient Israelites with answers to such questions</p>`,
                        `</body>`,
                        `</items>`,
                    ].join('\n')
                );

                expect(tree).toEqual({
                    type: 'commentary/root',
                    books: [
                        {
                            type: 'book',
                            book: 'GEN',
                            introduction:
                                'Genesis is the book of beginnings—of the universe and of humanity, of sin and its catastrophic effects, and of God’s plan to restore blessing to the world through his chosen people. God began his plan when he called Abraham and made a covenant with him. Genesis traces God’s promised blessings from.',
                            chapters: [],
                        },
                        {
                            type: 'book',
                            book: 'EXO',
                            introduction:
                                'What does it mean to be in a relationship with God, the ultimate being in the universe? How does one establish that relationship? What is that relationship like, and what does it take to stay in it? These are questions that people around the world have been asking since the beginning of time. The book of Exodus provided the ancient Israelites with answers to such questions',
                            chapters: [],
                        },
                    ],
                });
            });
        });

        describe('book summaries', () => {
            it('should parse the given book summaries', () => {
                const tree = parser.parse(
                    [
                        `<items release="1.25">`,
                        `<item name="GenIntro" typename="BookIntroSummary" product="TyndaleOpenStudyNotes">`,
                        `<title>Genesis</title>`,
                        `<refs>Gen.1.1-50.26</refs>`,
                        `<body>`,
                        `<p class="intro-overview">Genesis is the book of beginnings—of the universe and of humanity, of sin and its catastrophic effects, and of God’s plan to restore blessing to the world through his chosen people. God began his plan when he called Abraham and made a covenant with him. Genesis traces God’s promised blessings from.</p>`,
                        `<p class="intro-h1">Setting</p>`,
                        `<p class="intro-body-fl">When Genesis was written, the children of Israel had been slaves in Egypt for four hundred years. They had recently been released from bondage and guided through the desert to meet the Lord at Mount Sinai, where he had established his covenant relationship with them and had given them his law through Moses. Israel was now poised to enter the Promised Land and receive the inheritance that God had promised Abraham.</p>`,
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
                            introductionSummary: [
                                'Genesis is the book of beginnings—of the universe and of humanity, of sin and its catastrophic effects, and of God’s plan to restore blessing to the world through his chosen people. God began his plan when he called Abraham and made a covenant with him. Genesis traces God’s promised blessings from.',
                                '',
                                'Setting',
                                '',
                                'When Genesis was written, the children of Israel had been slaves in Egypt for four hundred years. They had recently been released from bondage and guided through the desert to meet the Lord at Mount Sinai, where he had established his covenant relationship with them and had given them his law through Moses. Israel was now poised to enter the Promised Land and receive the inheritance that God had promised Abraham.',
                            ].join('\n'),
                            chapters: [],
                        },
                    ],
                });
            });

            it('should support multiple books', () => {
                const tree = parser.parse(
                    [
                        `<items release="1.25">`,
                        `<item name="GenIntro" typename="BookIntroSummary" product="TyndaleOpenStudyNotes">`,
                        `<title>Genesis</title>`,
                        `<refs>Gen.1.1-50.26</refs>`,
                        `<body>`,
                        `<p class="intro-overview">Genesis is the book of beginnings—of the universe and of humanity, of sin and its catastrophic effects, and of God’s plan to restore blessing to the world through his chosen people. God began his plan when he called Abraham and made a covenant with him. Genesis traces God’s promised blessings from.</p>`,
                        `</body>`,
                        `</item>`,
                        `<item name="ExodIntro" typename="BookIntroSummary" product="TyndaleOpenStudyNotes">`,
                        `<title>Exodus</title>`,
                        `<refs>Exod.1.1-40.38</refs>`,
                        `<body>`,
                        `<p class="intro-overview">What does it mean to be in a relationship with God, the ultimate being in the universe? How does one establish that relationship? What is that relationship like, and what does it take to stay in it? These are questions that people around the world have been asking since the beginning of time. The book of Exodus provided the ancient Israelites with answers to such questions</p>`,
                        `</body>`,
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
                            introductionSummary:
                                'Genesis is the book of beginnings—of the universe and of humanity, of sin and its catastrophic effects, and of God’s plan to restore blessing to the world through his chosen people. God began his plan when he called Abraham and made a covenant with him. Genesis traces God’s promised blessings from.',
                            chapters: [],
                        },
                        {
                            type: 'book',
                            book: 'EXO',
                            introduction: null,
                            introductionSummary:
                                'What does it mean to be in a relationship with God, the ultimate being in the universe? How does one establish that relationship? What is that relationship like, and what does it take to stay in it? These are questions that people around the world have been asking since the beginning of time. The book of Exodus provided the ancient Israelites with answers to such questions',
                            chapters: [],
                        },
                    ],
                });
            });
        });
    });
});
