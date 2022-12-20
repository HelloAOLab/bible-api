import { describe, it, expect, beforeEach } from 'vitest';


import { isDigit,
    isWhitespace,
    loc,
    marker,
    t,
    UsfmParser,
    usfmParser,
    UsfmTokenizer,
    whitespace,
    word
} from './usfm-parser';

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
                        ]
                    }
                ]
            });
        });

        it('should infer the first verse of a chapter', () => {
            const tree = parser.parse(`\\c 1
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
                                    { text: 'Why do the nations rage', poem: 1 },
                                    { text: 'and the peoples plot in vain?', poem: 2 }
                                ]
                            },
                        ]
                    }
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
                        ]
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
                        ]
                    }
                ]
            });
        });

        it('should support major title headings', () => {
            const tree = parser.parse(`
                \\mt Genesis
                \\c 1
                \\v 1 In the beginning God created the heavens and the earth.
                \\v 2 Now the earth was formless and void, and darkness was over the surface of the deep. And the Spirit of God was hovering over the surface of the waters.
                \\c 2
                \\v 1 Thus the heavens and the earth were completed in all their vast array.
            `);

            expect(tree).toEqual({
                type: 'root',
                title: 'Genesis',
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
                        ]
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
                        ]
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
                        ]
                    }
                ]
            });
        });
        
        describe('Bible', () => {
            describe('BSB', () => {
                const cases = [
                    ['bsb/01GENBSB.usfm', 50] as const
                ];

                it.each(cases)('should be able to parse %s', async (file, expectedChapters) => {
                    const filePath = resolve(__dirname, '..', '..', 'bible', file);
                    const data = await readFile(filePath, { encoding: 'utf-8' });
                    const parsed = parser.parse(data);
                    const numChapters = parsed.content.filter(c => c.type === 'chapter').length;
                    expect(numChapters).toBe(expectedChapters);
                });
            });
        });
    });

    describe('renderMarkdown()', () => {
        it('should create basic markdown from a parse tree', () => {
            const tree = parser.parse(`
                \\mt Genesis
                \\c 1
                \\v 1 In the beginning God created the heavens and the earth.
                \\v 2 Now the earth was formless and void, and darkness was over the surface of the deep. And the Spirit of God was hovering over the surface of the waters.
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