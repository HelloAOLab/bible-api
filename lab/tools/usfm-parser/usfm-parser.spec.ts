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

// describe('UsfmParser', () => {
    
// })


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