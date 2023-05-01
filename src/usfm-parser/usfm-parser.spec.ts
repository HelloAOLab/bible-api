import { isDigit,
    isWhitespace,
    loc,
    marker,
    t,
    UsfmParser,
    UsfmTokenizer,
    whitespace,
    word
} from './usfm-parser';
import hash from 'hash.js';

import { readFile } from 'fs/promises';
import { resolve } from 'path';

describe('UsfmTokenizer', () => {
    let tokenizer: UsfmTokenizer;

    beforeEach(() => {
        tokenizer = new UsfmTokenizer();
    });

    describe('tokenize()', () => {
        describe('markers', () => {
            it('should be able to parse single character markers', () => {
                const tokens = tokenizer.tokenize(`\\a`);

                expect(tokens).toEqual([
                    t(loc(0, 2), 'marker'),
                ]);
            });

            it('should be able to parse multiple character markers', () => {
                const tokens = tokenizer.tokenize(`\\abc`);

                expect(tokens).toEqual([
                    t(loc(0, 4), 'marker'),
                ]);
            });

            it('should be able to parse markers with numbers', () => {
                const tokens = tokenizer.tokenize(`\\abc123`);

                expect(tokens).toEqual([
                    t(loc(0, 7), 'marker'),
                ]);
            });

            it('should be able to parse end markers', () => {
                const tokens = tokenizer.tokenize(`\\abc*`);

                expect(tokens).toEqual([
                    t(loc(0, 5), 'marker'),
                ]);
            });

            it('should be able to parse end markers with numbers', () => {
                const tokens = tokenizer.tokenize(`\\abc123*`);

                expect(tokens).toEqual([
                    t(loc(0, 8), 'marker'),
                ]);
            });

            it('should not throw an error if the marker does not have a command', () => {
                const tokens = tokenizer.tokenize(`\\`);

                expect(tokens).toEqual([
                    t(loc(0, 1), 'marker')
                ]);
            });

            it('should not throw an error if the marker has a number but not a command', () => {
                const tokens = tokenizer.tokenize(`\\1`);
                expect(tokens).toEqual([
                    t(loc(0, 2), 'marker')
                ]);
            });

            it('should be able to parse end markers that have text after them', () => {
                const tokens = tokenizer.tokenize(`\\abc*z`);

                expect(tokens).toEqual([
                    t(loc(0, 5), 'marker'),
                    t(loc(5, 6), 'word'),
                ]);
            });

            it('should be able to parse end markers that have text before them', () => {
                const tokens = tokenizer.tokenize(`z\\abc*`);

                expect(tokens).toEqual([
                    t(loc(0, 1), 'word'),
                    t(loc(1, 6), 'marker'),
                ]);
            });

            it('should be able to parse markers that have a space after them', () => {
                const tokens = tokenizer.tokenize(`\\abc z`);

                expect(tokens).toEqual([
                    t(loc(0, 4), 'marker'),
                    t(loc(4, 5), 'whitespace'),
                    t(loc(5, 6), 'word'),
                ]);
            });

            it('should be able to parse markers that have a tab after them', () => {
                const tokens = tokenizer.tokenize(`\\abc\tz`);

                expect(tokens).toEqual([
                    t(loc(0, 4), 'marker'),
                    t(loc(4, 5), 'whitespace'),
                    t(loc(5, 6), 'word'),
                ]);
            });

            it('should be able to parse markers that have a newline after them', () => {
                const tokens = tokenizer.tokenize(`\\abc\nz`);

                expect(tokens).toEqual([
                    t(loc(0, 4), 'marker'),
                    t(loc(4, 5), 'whitespace'),
                    t(loc(5, 6), 'word'),
                ]);
            });
        });

        describe('words', () => {
            it('should be able to parse characters into words', () => {
                const tokens = tokenizer.tokenize(`abc`);

                expect(tokens).toEqual([
                    t(loc(0, 3), 'word'),
                ]);
            });
        });

        describe('whitespace', () => {
            it('should be able to parse space into whitespace', () => {
                const tokens = tokenizer.tokenize(` `);

                expect(tokens).toEqual([
                    t(loc(0, 1), 'whitespace'),
                ]);
            });

            it('should be able to parse newlines into whitespace', () => {
                const tokens = tokenizer.tokenize(`\n`);

                expect(tokens).toEqual([
                    t(loc(0, 1), 'whitespace'),
                ]);
            });
            
            it('should be able to parse carriage returns into whitespace', () => {
                const tokens = tokenizer.tokenize(`\r`);

                expect(tokens).toEqual([
                    t(loc(0, 1), 'whitespace'),
                ]);
            });

            it('should be able to parse tabs into whitespace', () => {
                const tokens = tokenizer.tokenize(`\t`);

                expect(tokens).toEqual([
                    t(loc(0, 1), 'whitespace'),
                ]);
            });

            it('should be able to parse multiple whitespace into whitespace', () => {
                const tokens = tokenizer.tokenize(`\t \r\n`);

                expect(tokens).toEqual([
                    t(loc(0, 4), 'whitespace'),
                ]);
            });
        });
    });
});

describe('UsfmParser', () => {
    let parser: UsfmParser;

    beforeEach(() => {
        parser = new UsfmParser();
    });

    describe('tokenize()', () => {
        it('should be able to tokenize single character markers', () => {
            const tokens = parser.tokenize(`\\a`);

            expect(tokens).toEqual([
                marker(loc(0, 2), '\\a', null, 'start')
            ]);
        });

        it('should be able to tokenize multiple character markers', () => {
            const tokens = parser.tokenize(`\\abc`);

            expect(tokens).toEqual([
                marker(loc(0, 4), '\\abc', null, 'start')
            ]);
        });

        it('should be able to parse markers with numbers', () => {
            const tokens = parser.tokenize(`\\abc123`);

            expect(tokens).toEqual([
                marker(loc(0, 7), '\\abc', 123, 'start'),
            ]);
        });

        it('should be able to parse end markers', () => {
            const tokens = parser.tokenize(`\\abc*`);

            expect(tokens).toEqual([
                marker(loc(0, 5), '\\abc', null, 'end'),
            ]);
        });

        it('should be able to parse end markers with numbers', () => {
            const tokens = parser.tokenize(`\\abc123*`);

            expect(tokens).toEqual([
                marker(loc(0, 8), '\\abc', 123, 'end'),
            ]);
        });

        it('should throw an error if the marker does not have a command', () => {
            expect(() => {
                parser.tokenize(`\\`);
            }).toThrowError();
        });

        it('should throw an error if the marker has a number but not a command', () => {
            expect(() => {
                parser.tokenize(`\\1`);
            }).toThrowError();
        });

        it('should be able to parse end markers that have text after them', () => {
            const tokens = parser.tokenize(`\\abc*z`);

            expect(tokens).toEqual([
                marker(loc(0, 5), '\\abc', null, 'end'),
                word(loc(5, 6), 'z'),
            ]);
        });

        it('should be able to parse end markers that have text before them', () => {
            const tokens = parser.tokenize(`z\\abc*`);

            expect(tokens).toEqual([
                word(loc(0, 1), 'z'),
                marker(loc(1, 6), '\\abc', null, 'end'),
            ]);
        });

        it('should be able to parse markers that have a space after them', () => {
            const tokens = parser.tokenize(`\\abc z`);

            expect(tokens).toEqual([
                marker(loc(0, 4), '\\abc'),
                whitespace(loc(4, 5), ' '),
                word(loc(5, 6), 'z'),
            ]);
        });

        it('should be able to parse markers that have a tab after them', () => {
            const tokens = parser.tokenize(`\\abc\tz`);

            expect(tokens).toEqual([
                marker(loc(0, 4), '\\abc'),
                whitespace(loc(4, 5), '\t'),
                word(loc(5, 6), 'z'),
            ]);
        });

        it('should be able to parse markers that have a newline after them', () => {
            const tokens = parser.tokenize(`\\abc\nz`);

            expect(tokens).toEqual([
                marker(loc(0, 4), '\\abc'),
                whitespace(loc(4, 5), '\n'),
                word(loc(5, 6), 'z'),
            ]);
        });
    });

    describe('parse()', () => {
        it('should produce a list of chapters', () => {
            const tree = parser.parse(`\\c 1
                \\v 1 In the beginning God created the heavens and the earth.
                \\v 2 Now the earth was formless and void, and darkness was over the surface of the deep. And the Spirit of God was hovering over the surface of the waters.
                \\c 2
                \\v 1 Thus the heavens and the earth were completed in all their vast array.
            `);

            expect(tree).toEqual({
                type: 'root',
                content: [
                    {
                        type: 'chapter',
                        number: 1,
                        content: [
                            { 
                                type: 'verse', 
                                number: 1,
                                content: [
                                    'In the beginning God created the heavens and the earth.'
                                ]
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
                    },
                    {
                        type: 'chapter',
                        number: 2,
                        content: [
                            { 
                                type: 'verse', 
                                number: 1,
                                content: [
                                    'Thus the heavens and the earth were completed in all their vast array.'
                                ]
                            },
                        ],
                        footnotes: [],
                    }
                ]
            });
        });

        it('should infer the first verse of a chapter', () => {
            const tree = parser.parse(`\\c 1
                \\s1 The Two Paths
                \\q1 Blessed is the man 
                \\q2 who does not walk in the counsel of the wicked, 
                \\q1 or set foot on the path of sinners, 
                \\q2 or sit in the seat of mockers. 
                \\q1
                \\v 2 But his delight is in the Law of the LORD, 
                \\q2 and on His law he meditates day and night. 
                \\q1
                \\c 2
                \\q1 Why do the nations rage
                \\q2 and the peoples plot in vain? 
                \\q1 
            `);

            expect(tree).toEqual({
                type: 'root',
                content: [
                    {
                        type: 'chapter',
                        number: 1,
                        content: [
                            {
                                type: 'heading',
                                content: [
                                    'The Two Paths'
                                ]
                            },
                            { 
                                type: 'verse', 
                                number: 1,
                                content: [
                                    { text: 'Blessed is the man', poem: 1 },
                                    { text: 'who does not walk in the counsel of the wicked,', poem: 2 },
                                    { text: 'or set foot on the path of sinners,', poem: 1 },
                                    { text: 'or sit in the seat of mockers.', poem: 2 }
                                ]
                            },
                            { 
                                type: 'verse',
                                number: 2,
                                content: [
                                    { text: 'But his delight is in the Law of the LORD,', poem: 1 },
                                    { text: 'and on His law he meditates day and night.', poem: 2 }
                                ]
                            }
                        ],
                        footnotes: [],
                    },
                    {
                        type: 'chapter',
                        number: 2,
                        content: [
                            { 
                                type: 'verse', 
                                number: 1,
                                content: [
                                    { text: 'Why do the nations rage', poem: 1 },
                                    { text: 'and the peoples plot in vain?', poem: 2 }
                                ]
                            },
                        ],
                        footnotes: [],
                    }
                ]
            });
        });

        it('should parse the intro to a book correctly', () => {
            const tree = parser.parse(`\\id GEN - Berean Study Bible
                \\h Genesis
                \\toc1 Genesis
                \\mt1 Genesis
                \\c 1
                \\s1 The Creation
                \\r (John 1:1–5; Hebrews 11:1–3)
                \\b
                \\m 
                \\v 1 In the beginning God created the heavens and the earth. 
            `);

            expect(tree).toEqual({
                type: 'root',
                title: 'Genesis',
                header: 'Genesis',
                id: 'GEN',
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
                                type: 'line_break',
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
                ]
            });
        });

        it('should support line breaks', () => {
            const tree = parser.parse(`\\c 1
                \\v 1 In the beginning God created the heavens and the earth.
                \\b
                \\v 2 Now the earth was formless and void, and darkness was over the surface of the deep. And the Spirit of God was hovering over the surface of the waters.
                \\b
                \\c 2
                \\v 1 Thus the heavens and the earth were completed in all their vast array.
            `);

            expect(tree).toEqual({
                type: 'root',
                content: [
                    {
                        type: 'chapter',
                        number: 1,
                        content: [
                            { 
                                type: 'verse', 
                                number: 1,
                                content: [
                                    'In the beginning God created the heavens and the earth.'
                                ]
                            },
                            {
                                type: 'line_break'
                            },
                            { 
                                type: 'verse', 
                                number: 2,
                                content: [
                                    'Now the earth was formless and void, and darkness was over the surface of the deep. And the Spirit of God was hovering over the surface of the waters.'
                                ]
                            },
                            {
                                type: 'line_break'
                            },
                        ],
                        footnotes: [],
                    },
                    {
                        type: 'chapter',
                        number: 2,
                        content: [
                            { 
                                type: 'verse', 
                                number: 1,
                                content: [
                                    'Thus the heavens and the earth were completed in all their vast array.'
                                ]
                            },
                        ],
                        footnotes: [],
                    }
                ]
            });
        });

        it('should treat paragraphs like line breaks', () => {
            const tree = parser.parse(`\\c 1
                \\v 1 In the beginning God created the heavens and the earth.
                \\p
                \\v 2 Now the earth was formless and void, and darkness was over the surface of the deep. And the Spirit of God was hovering over the surface of the waters.
                \\p
                \\c 2
                \\v 1 Thus the heavens and the earth were completed in all their vast array.
            `);

            expect(tree).toEqual({
                type: 'root',
                content: [
                    {
                        type: 'chapter',
                        number: 1,
                        content: [
                            { 
                                type: 'verse', 
                                number: 1,
                                content: [
                                    'In the beginning God created the heavens and the earth.'
                                ]
                            },
                            {
                                type: 'line_break'
                            },
                            { 
                                type: 'verse', 
                                number: 2,
                                content: [
                                    'Now the earth was formless and void, and darkness was over the surface of the deep. And the Spirit of God was hovering over the surface of the waters.'
                                ]
                            },
                            {
                                type: 'line_break'
                            },
                        ],
                        footnotes: [],
                    },
                    {
                        type: 'chapter',
                        number: 2,
                        content: [
                            { 
                                type: 'verse', 
                                number: 1,
                                content: [
                                    'Thus the heavens and the earth were completed in all their vast array.'
                                ]
                            },
                        ],
                        footnotes: [],
                    }
                ]
            });
        });

        it('should support ID tags', () => {
            const tree = parser.parse(`
                \\id GEN - Berean Study Bible
                \\c 1
                \\v 1 In the beginning God created the heavens and the earth.
                \\v 2 Now the earth was formless and void, and darkness was over the surface of the deep. And the Spirit of God was hovering over the surface of the waters.
                \\c 2
                \\v 1 Thus the heavens and the earth were completed in all their vast array.
            `);

            expect(tree).toEqual({
                type: 'root',
                id: 'GEN',
                content: [
                    {
                        type: 'chapter',
                        number: 1,
                        content: [
                            { 
                                type: 'verse', 
                                number: 1,
                                content: [
                                    'In the beginning God created the heavens and the earth.'
                                ]
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
                    },
                    {
                        type: 'chapter',
                        number: 2,
                        content: [
                            { 
                                type: 'verse', 
                                number: 1,
                                content: [
                                    'Thus the heavens and the earth were completed in all their vast array.'
                                ]
                            },
                        ],
                        footnotes: [],
                    }
                ]
            });
        });

        it('should support major title headings', () => {
            const tree = parser.parse(`
                \\mt1 The
                \\mt2 Title
                \\mt3 of the Book
                \\c 1
                \\v 1 In the beginning God created the heavens and the earth.
                \\v 2 Now the earth was formless and void, and darkness was over the surface of the deep. And the Spirit of God was hovering over the surface of the waters.
                \\c 2
                \\v 1 Thus the heavens and the earth were completed in all their vast array.
            `);

            expect(tree).toEqual({
                type: 'root',
                title: 'The Title of the Book',
                content: [
                    {
                        type: 'chapter',
                        number: 1,
                        content: [
                            { 
                                type: 'verse', 
                                number: 1,
                                content: [
                                    'In the beginning God created the heavens and the earth.'
                                ]
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
                    },
                    {
                        type: 'chapter',
                        number: 2,
                        content: [
                            { 
                                type: 'verse', 
                                number: 1,
                                content: [
                                    'Thus the heavens and the earth were completed in all their vast array.'
                                ]
                            },
                        ],
                        footnotes: [],
                    }
                ]
            });
        });

        it('should support header text', () => {
            const tree = parser.parse(`
                \\h Genesis
                \\c 1
                \\v 1 In the beginning God created the heavens and the earth.
                \\v 2 Now the earth was formless and void, and darkness was over the surface of the deep. And the Spirit of God was hovering over the surface of the waters.
                \\c 2
                \\v 1 Thus the heavens and the earth were completed in all their vast array.
            `);

            expect(tree).toEqual({
                type: 'root',
                header: 'Genesis',
                content: [
                    {
                        type: 'chapter',
                        number: 1,
                        content: [
                            { 
                                type: 'verse', 
                                number: 1,
                                content: [
                                    'In the beginning God created the heavens and the earth.'
                                ]
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
                    },
                    {
                        type: 'chapter',
                        number: 2,
                        content: [
                            { 
                                type: 'verse', 
                                number: 1,
                                content: [
                                    'Thus the heavens and the earth were completed in all their vast array.'
                                ]
                            },
                        ],
                        footnotes: [],
                    }
                ]
            });
        });

        it('should support section headings in chapters', () => {
            const tree = parser.parse(`\\c 1
                \\s1 The Creation
                \\v 1 In the beginning God created the heavens and the earth.
                \\v 2 Now the earth was formless and void, and darkness was over the surface of the deep. And the Spirit of God was hovering over the surface of the waters.
                \\c 2
                \\v 1 Thus the heavens and the earth were completed in all their vast array.
            `);

            expect(tree).toEqual({
                type: 'root',
                content: [
                    {
                        type: 'chapter',
                        number: 1,
                        content: [
                            {
                                type: 'heading',
                                content: [
                                    'The Creation'
                                ]
                            },
                            { 
                                type: 'verse', 
                                number: 1,
                                content: [
                                    'In the beginning God created the heavens and the earth.'
                                ]
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
                    },
                    {
                        type: 'chapter',
                        number: 2,
                        content: [
                            { 
                                type: 'verse', 
                                number: 1,
                                content: [
                                    'Thus the heavens and the earth were completed in all their vast array.'
                                ]
                            },
                        ],
                        footnotes: [],
                    }
                ]
            });
        });

        it('should support section headings outside of chapters', () => {
            const tree = parser.parse(`\\s1 The Creation
            `);

            expect(tree).toEqual({
                type: 'root',
                content: [
                    {
                        type: 'heading',
                        content: [
                            'The Creation'
                        ],
                    }
                ]
            });
        });

        it('should support footnotes', () => {
            const tree = parser.parse(`\\c 1
                \\v 1 In the beginning God created the heavens and the earth.
                \\v 2 Now the earth was formless and void, and darkness was over the surface of the deep. And the Spirit of God was hovering over the surface of the waters.
                \\v 3 And God said, “Let there be light,” \\f + \\fr 1:3 \\ft Cited in 2 Corinthians 4:6\\f* and there was light. 
                \\c 2
                \\v 1 Thus the heavens and the earth were completed in all their vast array.
            `);

            expect(tree).toEqual({
                type: 'root',
                content: [
                    {
                        type: 'chapter',
                        number: 1,
                        content: [
                            { 
                                type: 'verse', 
                                number: 1,
                                content: [
                                    'In the beginning God created the heavens and the earth.'
                                ]
                            },
                            { 
                                type: 'verse', 
                                number: 2,
                                content: [
                                    'Now the earth was formless and void, and darkness was over the surface of the deep. And the Spirit of God was hovering over the surface of the waters.'
                                ]
                            },
                            {
                                type: 'verse',
                                number: 3,
                                content: [
                                    'And God said, “Let there be light,”',
                                    {
                                        noteId: 0
                                    },
                                    'and there was light.'
                                ]
                            }
                        ],
                        footnotes: [
                            {
                                noteId: 0,
                                text: 'Cited in 2 Corinthians 4:6',
                                reference: {
                                    chapter: 1,
                                    verse: 3
                                }
                            }
                        ]
                    },
                    {
                        type: 'chapter',
                        number: 2,
                        content: [
                            { 
                                type: 'verse', 
                                number: 1,
                                content: [
                                    'Thus the heavens and the earth were completed in all their vast array.'
                                ]
                            },
                        ],
                        footnotes: []
                    }
                ]
            });
        });

        it('should ignore introduction paragraphs', () => {
            const tree = parser.parse(`
                \\ip The Holy Bible is translated into many languages, and being translated into many more, so that everyone may have an opportunity to hear the Good News about Jesus Christ.\\f + \\fr 1:0  \\ft “Christ” means “Anointed One”.\\f* 
            `);

            expect(tree).toEqual({
                type: 'root',
                content: [
                    // {
                    //     type: 'intro_paragraph',
                    //     content: [
                    //         'The Holy Bible is translated into many languages, and being translated into many more, so that everyone may have an opportunity to hear the Good News about Jesus Christ.'
                    //     ]
                    // }
                ]
            });
        });

        it('should support references', () => {
            const tree = parser.parse(`\\c 1
                \\r (John 1:1–5; Hebrews 11:1–3)
                \\v 1 In the beginning God created the heavens and the earth.
                \\v 2 Now the earth was formless and void, and darkness was over the surface of the deep. And the Spirit of God was hovering over the surface of the waters.
                \\c 2
                \\v 1 Thus the heavens and the earth were completed in all their vast array.
            `);

            expect(tree).toEqual({
                type: 'root',
                content: [
                    {
                        type: 'chapter',
                        number: 1,
                        content: [
                            { 
                                type: 'verse', 
                                number: 1,
                                content: [
                                    'In the beginning God created the heavens and the earth.'
                                ]
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
                    },
                    {
                        type: 'chapter',
                        number: 2,
                        content: [
                            { 
                                type: 'verse', 
                                number: 1,
                                content: [
                                    'Thus the heavens and the earth were completed in all their vast array.'
                                ]
                            },
                        ],
                        footnotes: [],
                    }
                ]
            });
        });

        it('should support parsing descriptive titles', () => {
            const tree = parser.parse(`\\c 6
                \\s1 Do Not Rebuke Me in Your Anger
                \\r (Psalm 38:1–22)
                \\b
                \\d For the choirmaster. With stringed instruments, according to Sheminith.\\f + \\fr 6:1 \\ft Sheminith is probably a musical term; here and in 1 Chronicles 15:21 and Psalm 12:1.\\f* A Psalm of David. 
                \\b
                \\q1 
                \\v 1 O LORD, do not rebuke me in Your anger 
                \\q2 or discipline me in Your wrath. 
                \\q1 
            `);

            expect(tree).toEqual({
                type: 'root',
                content: [
                    {
                        type: 'chapter',
                        number: 6,
                        content: [
                            {
                                type: 'heading',
                                content: [
                                    'Do Not Rebuke Me in Your Anger'
                                ]
                            },
                            {
                                type: 'line_break',
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
                                text: 'Sheminith is probably a musical term; here and in 1 Chronicles 15:21 and Psalm 12:1.',
                                reference: {
                                    chapter: 6,
                                    verse: 1
                                }
                            }
                        ],
                    },
                ]
            });
        });

        it('should ignore word level attributes', () => {
            const tree = parser.parse(`\\c 1
                \\v 1  \\w In|strong="H0430"\\w* \\w the|strong="H0853"\\w* \\w beginning|strong="H7225"\\w*, \\w God|strong="H0430"\\w* \\w created|strong="H1254"\\w* \\w the|strong="H0853"\\w* \\w heavens|strong="H8064"\\w* \\w and|strong="H0430"\\w* \\w the|strong="H0853"\\w* \\w earth|strong="H0776"\\w*.
            `);

            expect(tree).toEqual({
                type: 'root',
                content: [
                    {
                        type: 'chapter',
                        number: 1,
                        content: [
                            { 
                                type: 'verse', 
                                number: 1,
                                content: [
                                    'In the beginning, God created the heavens and the earth.'
                                ]
                            },
                        ],
                        footnotes: [],
                    },
                ]
            });
        });

        it('should ignore cross references', () => {
                const tree = parser.parse(`\\c 5  
                    \\p
                    \\v 1  \\w Seeing|strong="G3708"\\w* \\w the|strong="G3588"\\w* \\w multitudes|strong="G3793"\\w*, \\w he|strong="G2532"\\w* \\w went|strong="G0305"\\w* \\w up|strong="G0305"\\w* \\w onto|strong="G1519"\\w* \\w the|strong="G3588"\\w* \\w mountain|strong="G3735"\\w*. \\w When|strong="G2532"\\w* \\w he|strong="G2532"\\w* \\w had|strong="G3588"\\w* \\w sat|strong="G2523"\\w* \\w down|strong="G2523"\\w*, \\w his|strong="G0846"\\w* \\w disciples|strong="G3101"\\w* \\w came|strong="G4334"\\w* \\w to|strong="G1519"\\w* \\w him|strong="G0846"\\w*. 
                    \\v 2  \\w He|strong="G2532"\\w* \\w opened|strong="G0455"\\w* \\w his|strong="G0846"\\w* \\w mouth|strong="G4750"\\w* \\w and|strong="G2532"\\w* \\w taught|strong="G1321"\\w* \\w them|strong="G0846"\\w*, \\w saying|strong="G3004"\\w*, 
                    \\q1
                    \\v 3  \\wj “\\+w Blessed|strong="G3107"\\+w* \\+w are|strong="G1510"\\+w* \\+w the|strong="G3588"\\+w* \\+w poor|strong="G4434"\\+w* \\+w in|strong="G4434"\\+w* \\+w spirit|strong="G4151"\\+w*,\\wj* 
                    \\q2 \\wj  \\+w for|strong="G3754"\\+w* \\+w theirs|strong="G0846"\\+w* \\+w is|strong="G1510"\\+w* \\+w the|strong="G3588"\\+w* \\+w Kingdom|strong="G0932"\\+w* \\+w of|strong="G0932"\\+w* \\+w Heaven|strong="G3772"\\+w*.\\wj*\\x + \\xo 5:3  \\xt Isaiah 57:15; 66:2\\x*
                `);

                expect(tree).toEqual({
                    type: 'root',
                    content: [
                        {
                            type: 'chapter',
                            number: 5,
                            content: [
                                {
                                    type: 'line_break'
                                },
                                { 
                                    type: 'verse', 
                                    number: 1,
                                    content: [
                                        'Seeing the multitudes, he went up onto the mountain. When he had sat down, his disciples came to him.'
                                    ]
                                },
                                { 
                                    type: 'verse', 
                                    number: 2,
                                    content: [
                                        'He opened his mouth and taught them, saying,',
                                    ]
                                },
                                { 
                                    type: 'verse', 
                                    number: 3,
                                    content: [
                                        {
                                            "poem": 1,
                                            "text": "“Blessed are the poor in spirit,",
                                            "wordsOfJesus": true,
                                        },
                                        {
                                            "poem": 2,
                                            "text": "for theirs is the Kingdom of Heaven.",
                                            "wordsOfJesus": true,
                                        },
                                    ]
                                },
                            ],
                            footnotes: [],
                        },
                    ]
                });
        });

        it('should support the Words of Jesus', () => {
            const tree = parser.parse(`\\c 8
                \\v 10  \\w When|strong="G2532"\\w* \\w Jesus|strong="G2424"\\w* \\w heard|strong="G0191"\\w* \\w it|strong="G0191"\\w*, \\w he|strong="G2532"\\w* \\w marveled|strong="G2296"\\w* \\w and|strong="G2532"\\w* \\w said|strong="G3004"\\w* \\w to|strong="G3004"\\w* \\w those|strong="G3588"\\w* \\w who|strong="G3588"\\w* \\w followed|strong="G0190"\\w*, \\wj “Most \\+w certainly|strong="G2532"\\+w* \\+w I|strong="G0281"\\+w* \\+w tell|strong="G3004"\\+w* \\+w you|strong="G5210"\\+w*, \\+w I|strong="G0281"\\+w* \\+w haven’t|strong="G3761"\\+w* \\+w found|strong="G2147"\\+w* \\+w so|strong="G2532"\\+w* \\+w great|strong="G5118"\\+w* \\+w a|strong="G2147"\\+w* \\+w faith|strong="G4102"\\+w*, \\+w not|strong="G3761"\\+w* \\+w even|strong="G2532"\\+w* \\+w in|strong="G1722"\\+w* \\+w Israel|strong="G2474"\\+w*. \\wj* 
                \\v 11  \\wj  \\+w I|strong="G2532"\\+w* \\+w tell|strong="G3004"\\+w* \\+w you|strong="G5210"\\+w* \\+w that|strong="G3754"\\+w* \\+w many|strong="G4183"\\+w* \\+w will|strong="G4183"\\+w* \\+w come|strong="G2240"\\+w* \\+w from|strong="G0575"\\+w* \\+w the|strong="G3588"\\+w* \\+w east|strong="G0395"\\+w* \\+w and|strong="G2532"\\+w* \\+w the|strong="G3588"\\+w* \\+w west|strong="G1424"\\+w*, \\+w and|strong="G2532"\\+w* \\+w will|strong="G4183"\\+w* \\+w sit|strong="G0347"\\+w* \\+w down|strong="G0347"\\+w* \\+w with|strong="G3326"\\+w* \\+w Abraham|strong="G0011"\\+w*, \\+w Isaac|strong="G2464"\\+w*, \\+w and|strong="G2532"\\+w* \\+w Jacob|strong="G2384"\\+w* \\+w in|strong="G1722"\\+w* \\+w the|strong="G3588"\\+w* \\+w Kingdom|strong="G0932"\\+w* \\+w of|strong="G0932"\\+w* \\+w Heaven|strong="G3772"\\+w*, \\wj* 
                \\v 12  \\wj  \\+w but|strong="G1161"\\+w* \\+w the|strong="G3588"\\+w* children \\+w of|strong="G5207"\\+w* \\+w the|strong="G3588"\\+w* \\+w Kingdom|strong="G0932"\\+w* \\+w will|strong="G1510"\\+w* \\+w be|strong="G1510"\\+w* thrown \\+w out|strong="G1831"\\+w* \\+w into|strong="G1519"\\+w* \\+w the|strong="G3588"\\+w* \\+w outer|strong="G1857"\\+w* \\+w darkness|strong="G4655"\\+w*. \\+w There|strong="G1563"\\+w* \\+w will|strong="G1510"\\+w* \\+w be|strong="G1510"\\+w* \\+w weeping|strong="G2805"\\+w* \\+w and|strong="G2532"\\+w* \\+w gnashing|strong="G1030"\\+w* \\+w of|strong="G5207"\\+w* \\+w teeth|strong="G3599"\\+w*.”\\wj* 
                \\v 13  \\w Jesus|strong="G2424"\\w* \\w said|strong="G3004"\\w* \\w to|strong="G3004"\\w* \\w the|strong="G3588"\\w* \\w centurion|strong="G1543"\\w*, \\wj “\\+w Go|strong="G5217"\\+w* \\+w your|strong="G2532"\\+w* \\+w way|strong="G1722"\\+w*. \\+w Let|strong="G1096"\\+w* \\+w it|strong="G2532"\\+w* \\+w be|strong="G1096"\\+w* \\+w done|strong="G1096"\\+w* \\+w for|strong="G1722"\\+w* \\+w you|strong="G4771"\\+w* \\+w as|strong="G5613"\\+w* \\+w you|strong="G4771"\\+w* \\+w have|strong="G2532"\\+w* \\+w believed|strong="G4100"\\+w*.”\\wj* \\w His|strong="G5613"\\w* \\w servant|strong="G3816"\\w* \\w was|strong="G2424"\\w* \\w healed|strong="G2390"\\w* \\w in|strong="G1722"\\w* \\w that|strong="G1565"\\w* \\w hour|strong="G5610"\\w*. 
            `);

            expect(tree).toEqual({
                type: 'root',
                content: [
                    {
                        type: 'chapter',
                        number: 8,
                        content: [
                            { 
                                type: 'verse', 
                                number: 10,
                                content: [
                                    'When Jesus heard it, he marveled and said to those who followed,',
                                    {
                                        text: '“Most certainly I tell you, I haven’t found so great a faith, not even in Israel.',
                                        wordsOfJesus: true
                                    }
                                ]
                            },
                            { 
                                type: 'verse', 
                                number: 11,
                                content: [
                                    {
                                        text: 'I tell you that many will come from the east and the west, and will sit down with Abraham, Isaac, and Jacob in the Kingdom of Heaven,',
                                        wordsOfJesus: true
                                    }
                                ]
                            },
                            {
                                type: 'verse',
                                number: 12,
                                content: [
                                    {
                                        text: 'but the children of the Kingdom will be thrown out into the outer darkness. There will be weeping and gnashing of teeth.”',
                                        wordsOfJesus: true
                                    }
                                ]
                            },
                            {
                                type: 'verse',
                                number: 13,
                                content: [
                                    'Jesus said to the centurion,',
                                    {
                                        text: '“Go your way. Let it be done for you as you have believed.”',
                                        wordsOfJesus: true
                                    },
                                    "His servant was healed in that hour.",
                                ]
                            }
                        ],
                        footnotes: []
                    },
                ]
            });
        });

        it('should not place spaces between Words of Jesus', () => {
            const tree = parser.parse(`\\c 8
            \\v 11  \\wj I tell you that many will come \\wj* \\wj from the east and the west, and will sit down with Abraham, Isaac, and Jacob in the Kingdom of Heaven, \\wj*
            `);

            expect(tree).toEqual({
                type: 'root',
                content: [
                    {
                        type: 'chapter',
                        number: 8,
                        content: [
                            { 
                                type: 'verse', 
                                number: 11,
                                content: [
                                    {
                                        text: 'I tell you that many will come',
                                        wordsOfJesus: true
                                    },
                                    {
                                        text: 'from the east and the west, and will sit down with Abraham, Isaac, and Jacob in the Kingdom of Heaven,',
                                        wordsOfJesus: true
                                    }
                                ]
                            },
                        ],
                        footnotes: []
                    },
                ]
            });
        });

        it('should handle verses that are split between headings', () => {
            const tree = parser.parse(`\\c 1 
            \\v 1 This is Solomon’s Song of Songs.\\f + \\fr 1:1 \\ft Most translators add subheadings for speaker identifications such as The Bride, The Groom, and The Friends based on the gender and number of the Hebrew words.\\f* 
            \\s2 The Bride
            \\b
            \\q1 
            \\v 2 Let him kiss me with the kisses of his mouth! 
            \\q2 For your love is more delightful than wine. 
            \\q1 
            \\v 3 The fragrance of your perfume is pleasing; 
            \\q2 your name is like perfume poured out. 
            \\q2 No wonder the maidens adore you. 
            \\b
            \\q1 
            \\v 4 Take me away with you—let us hurry! 
            \\q2 May the king bring me to his chambers. 
            \\s2 The Friends
            \\b
            \\q1 We will rejoice and delight in you; 
            \\q2 we will praise your love more than wine. 
            \\s2 The Bride
            \\b
            \\q1 It is only right that they adore you.
            `);

            expect(tree).toEqual({
                type: 'root',
                content: [
                    {
                        type: 'chapter',
                        number: 1,
                        content: [
                            { 
                                type: 'verse', 
                                number: 1,
                                content: [
                                    'This is Solomon’s Song of Songs.',
                                    {
                                        noteId: 0
                                    }
                                ]
                            },
                            {
                                type: 'heading',
                                content: ['The Bride']
                            },
                            {
                                type: 'line_break'
                            },
                            {
                                type: 'verse',
                                number: 2,
                                content: [
                                    {
                                        text: 'Let him kiss me with the kisses of his mouth!',
                                        poem: 1
                                    },
                                    {
                                        text: 'For your love is more delightful than wine.',
                                        poem: 2
                                    },

                                ]
                            },
                            { 
                                type: 'verse', 
                                number: 3,
                                content: [
                                    {
                                        text: 'The fragrance of your perfume is pleasing;',
                                        poem: 1
                                    },
                                    {
                                        text: 'your name is like perfume poured out.',
                                        poem: 2
                                    },
                                    {
                                        text: 'No wonder the maidens adore you.',
                                        poem: 2
                                    }
                                ]
                            },
                            {
                                type: 'line_break'
                            },
                            {
                                type: 'verse',
                                number: 4,
                                content: [
                                    {
                                        text: 'Take me away with you—let us hurry!',
                                        poem: 1
                                    },
                                    {
                                        text: 'May the king bring me to his chambers.',
                                        poem: 2
                                    },
                                    {
                                        heading: 'The Friends'
                                    },
                                    {
                                        lineBreak: true
                                    },
                                    {
                                        text: 'We will rejoice and delight in you;',
                                        poem: 1
                                    },
                                    {
                                        text: 'we will praise your love more than wine.',
                                        poem: 2
                                    },
                                    {
                                        heading: 'The Bride'
                                    },
                                    {
                                        lineBreak: true
                                    },
                                    {
                                        text: 'It is only right that they adore you.',
                                        poem: 1
                                    }
                                ]
                            },
                        ],
                        footnotes: [
                            {
                                noteId: 0,
                                text: 'Most translators add subheadings for speaker identifications such as The Bride, The Groom, and The Friends based on the gender and number of the Hebrew words.',
                                reference: {
                                    chapter: 1,
                                    verse: 1
                                }
                            }
                        ]
                    },
                ]
            });
        });
        
        describe('Bible', () => {
            const cases = [
                ['bsb/01GENBSB.usfm', 50] as const,
                ['bsb/02EXOBSB.usfm', 40] as const,
                ['bsb/03LEVBSB.usfm', 27] as const,
                ['bsb/04NUMBSB.usfm', 36] as const,
                ['bsb/05DEUBSB.usfm', 34] as const,
                ['bsb/06JOSBSB.usfm', 24] as const,
                ['bsb/07JDGBSB.usfm', 21] as const,
                ['bsb/08RUTBSB.usfm', 4] as const,
                ['bsb/091SABSB.usfm', 31] as const,
                ['bsb/102SABSB.usfm', 24] as const,
                ['bsb/111KIBSB.usfm', 22] as const,
                ['bsb/122KIBSB.usfm', 25] as const,
                ['bsb/131CHBSB.usfm', 29] as const,
                ['bsb/142CHBSB.usfm', 36] as const,
                ['bsb/15EZRBSB.usfm', 10] as const,
                ['bsb/16NEHBSB.usfm', 13] as const,
                ['bsb/17ESTBSB.usfm', 10] as const,
                ['bsb/18JOBBSB.usfm', 42] as const,
                ['bsb/19PSABSB.usfm', 150] as const,
                ['bsb/41MATBSB.usfm', 28] as const,
                ['engwebp/02-GENengwebp.usfm', 50] as const,
                ['engwebp/03-EXOengwebp.usfm', 40] as const,
                ['engwebp/70-MATengwebp.usfm', 28] as const,
                ['arbnav/02-GENarbnav.usfm', 50] as const,
                ['arbnav/70-MATarbnav.usfm', 28] as const,
                ['hinirv/usfm/gen.usfm', 50] as const,
                ['hinirv/usfm/mat.usfm', 28] as const,
                ['grcbre/usfm/gen.usfm', 50] as const,
                ['grctcg/usfm/mat.usfm', 28] as const,
                ['hbomas/usfm/gen.usfm', 50] as const,
            ];

            it.each(cases)('should consistently parse %s', async (file, expectedChapters) => {
                const filePath = resolve(__dirname, '..', '..', 'bible', file);
                const data = await readFile(filePath, { encoding: 'utf-8' });
                const parsed = parser.parse(data);
                const numChapters = parsed.content.filter(c => c.type === 'chapter').length;
                expect(numChapters).toBe(expectedChapters);

                const json = JSON.stringify(parsed);
                const result = JSON.parse(json);

                expect(result).toEqual(parsed);

                const parsedHash = hash.sha256().update(json).digest('hex');
                expect(parsedHash).toMatchSnapshot();
            });
        });
    });

    describe('renderMarkdown()', () => {
        it('should create basic markdown from a parse tree', () => {
            const tree = parser.parse(`
                \\h Genesis
                \\c 1
                \\v 1 In the beginning God created the heavens and the earth.
                \\v 2 Now the earth was formless and void, and darkness was over the surface of the deep. And the Spirit of God was hovering over the surface of the waters.
                \\v 3 And God said, “Let there be light,” \\f + \\fr 1:3 \\ft Cited in 2 Corinthians 4:6\\f* and there was light. 
                \\c 2
                \\v 1 Thus the heavens and the earth were completed in all their vast array.
            `);

            const md = parser.renderMarkdown(tree);
            expect(md).toMatchSnapshot();
        });
    });
});

describe('isDigit()', () => {
    it('should retrun true for all the ascii digits', () => {
        for(let d = 0; d < 10; d++) {
            let digit = d.toString();

            expect(isDigit(digit)).toBe(true);
        }
    });

    it('should return true for all digit code points in a string', () => {
        let str = '0123456789';

        for (let d of str) {
            expect(isDigit(d)).toBe(true);
        }
    });

    it('should return false for non digits', () => {
        let str = 'abcdefghijkflmnopqrstuvwxyz';

        for (let c of str) {
            expect(isDigit(c)).toBe(false);
        }
    });

    it('should return false for strings longer than length 1', () => {
        let strings = [
            '0a',
            '0b',
            '9a',
            '9b',
        ];

        for (let str of strings) {
            expect(isDigit(str)).toBe(false);
        }
    });
});

describe('isWhitespace()', () => {
    it('should return true for common whitespace characters', () => {
        let chars = [' ', '\n', '\t', '\r'];
        for(let char of chars) {
            expect(isWhitespace(char)).toBe(true);
        }
    });

    it('should return false for non-whitespace characters', () => {
        let str = 'abcdefghijkflmnopqrstuvwxyz0123456789';

        for (let c of str) {
            expect(isWhitespace(c)).toBe(false);
        }
    });
});