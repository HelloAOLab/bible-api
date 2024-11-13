import { unparse } from 'papaparse';
import { CommentaryCsvParser } from './commentary-csv-parser';

describe('CommentaryCsvParser', () => {
    let parser: CommentaryCsvParser;

    beforeEach(() => {
        parser = new CommentaryCsvParser();
    });

    describe('parse()', () => {
        it('should be able to parse CSV data', () => {
            const result = parser.parse(
                unparse(
                    [
                        {
                            Book: 'Genesis',
                            Chapter: '',
                            'VERSE / INTRODUCTION': 'Book Introduction',
                            COMMENTARIES:
                                'This is the introduction to the book of Genesis.',
                        },
                    ],
                    {
                        header: true,
                    }
                )
            );

            expect(result).toEqual({
                type: 'commentary/root',
                books: [
                    {
                        type: 'book',
                        book: 'GEN',
                        introduction:
                            'This is the introduction to the book of Genesis.',
                        chapters: [],
                    },
                ],
            });
        });
    });

    describe('parseLines()', () => {
        it('should be able to parse book introductions', () => {
            const result = parser.parseLines([
                {
                    book: 'Genesis',
                    chapter: '',
                    verse: 'Book Introduction',
                    commentaries:
                        'This is the introduction to the book of Genesis.',
                },
            ]);

            expect(result).toEqual({
                type: 'commentary/root',
                books: [
                    {
                        type: 'book',
                        book: 'GEN',
                        introduction:
                            'This is the introduction to the book of Genesis.',
                        chapters: [],
                    },
                ],
            });
        });

        it('should be able to parse multiple books', () => {
            const result = parser.parseLines([
                {
                    book: 'Genesis',
                    chapter: '',
                    verse: 'Book Introduction',
                    commentaries:
                        'This is the introduction to the book of Genesis.',
                },
                {
                    book: 'Exodus',
                    chapter: '',
                    verse: 'Book Introduction',
                    commentaries:
                        'This is the introduction to the book of Exodus.',
                },
            ]);

            expect(result).toEqual({
                type: 'commentary/root',
                books: [
                    {
                        type: 'book',
                        book: 'GEN',
                        introduction:
                            'This is the introduction to the book of Genesis.',
                        chapters: [],
                    },
                    {
                        type: 'book',
                        book: 'EXO',
                        introduction:
                            'This is the introduction to the book of Exodus.',
                        chapters: [],
                    },
                ],
            });
        });

        it('should be able to parse book and chapter introductions', () => {
            const result = parser.parseLines([
                {
                    book: 'Genesis',
                    chapter: '',
                    verse: 'Book Introduction',
                    commentaries:
                        'This is the introduction to the book of Genesis.',
                },
                {
                    book: '',
                    chapter: '1',
                    verse: 'Chapter Introduction',
                    commentaries:
                        'This is the introduction to the Chapter 1 of Genesis.',
                },
            ]);

            expect(result).toEqual({
                type: 'commentary/root',
                books: [
                    {
                        type: 'book',
                        book: 'GEN',
                        introduction:
                            'This is the introduction to the book of Genesis.',
                        chapters: [
                            {
                                type: 'chapter',
                                number: 1,
                                introduction:
                                    'This is the introduction to the Chapter 1 of Genesis.',
                                verses: [],
                            },
                        ],
                    },
                ],
            });
        });

        it('should be able to parse verses', () => {
            const result = parser.parseLines([
                {
                    book: 'Genesis',
                    chapter: '',
                    verse: 'Book Introduction',
                    commentaries:
                        'This is the introduction to the book of Genesis.',
                },
                {
                    book: '',
                    chapter: '1',
                    verse: 'Chapter Introduction',
                    commentaries:
                        'This is the introduction to the Chapter 1 of Genesis.',
                },
                {
                    book: '',
                    chapter: '',
                    verse: 'Genesis 1:1',
                    commentaries: 'This is the commentary for Genesis 1:1.',
                },
                {
                    book: '',
                    chapter: '',
                    verse: 'Genesis 1:2',
                    commentaries: 'This is the commentary for Genesis 1:2.',
                },
                {
                    book: '',
                    chapter: '',
                    verse: 'Genesis 1:3',
                    commentaries: 'This is the commentary for Genesis 1:3.',
                },
            ]);

            expect(result).toEqual({
                type: 'commentary/root',
                books: [
                    {
                        type: 'book',
                        book: 'GEN',
                        introduction:
                            'This is the introduction to the book of Genesis.',
                        chapters: [
                            {
                                type: 'chapter',
                                number: 1,
                                introduction:
                                    'This is the introduction to the Chapter 1 of Genesis.',
                                verses: [
                                    {
                                        type: 'verse',
                                        number: 1,
                                        content: [
                                            'This is the commentary for Genesis 1:1.',
                                        ],
                                    },
                                    {
                                        type: 'verse',
                                        number: 2,
                                        content: [
                                            'This is the commentary for Genesis 1:2.',
                                        ],
                                    },
                                    {
                                        type: 'verse',
                                        number: 3,
                                        content: [
                                            'This is the commentary for Genesis 1:3.',
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            });
        });

        it('should be able to infer chapers', () => {
            const result = parser.parseLines([
                {
                    book: 'Genesis',
                    chapter: '',
                    verse: 'Book Introduction',
                    commentaries:
                        'This is the introduction to the book of Genesis.',
                },
                {
                    book: '',
                    chapter: '1',
                    verse: 'Chapter Introduction',
                    commentaries:
                        'This is the introduction to the Chapter 1 of Genesis.',
                },
                {
                    book: '',
                    chapter: '',
                    verse: 'Genesis 1:1',
                    commentaries: 'This is the commentary for Genesis 1:1.',
                },
                {
                    book: '',
                    chapter: '',
                    verse: 'Genesis 1:2',
                    commentaries: 'This is the commentary for Genesis 1:2.',
                },
                {
                    book: '',
                    chapter: '',
                    verse: 'Genesis 1:3',
                    commentaries: 'This is the commentary for Genesis 1:3.',
                },
                {
                    book: '',
                    chapter: '',
                    verse: 'Genesis 2:1',
                    commentaries: 'This is the commentary for Genesis 2:1.',
                },
            ]);

            expect(result).toEqual({
                type: 'commentary/root',
                books: [
                    {
                        type: 'book',
                        book: 'GEN',
                        introduction:
                            'This is the introduction to the book of Genesis.',
                        chapters: [
                            {
                                type: 'chapter',
                                number: 1,
                                introduction:
                                    'This is the introduction to the Chapter 1 of Genesis.',
                                verses: [
                                    {
                                        type: 'verse',
                                        number: 1,
                                        content: [
                                            'This is the commentary for Genesis 1:1.',
                                        ],
                                    },
                                    {
                                        type: 'verse',
                                        number: 2,
                                        content: [
                                            'This is the commentary for Genesis 1:2.',
                                        ],
                                    },
                                    {
                                        type: 'verse',
                                        number: 3,
                                        content: [
                                            'This is the commentary for Genesis 1:3.',
                                        ],
                                    },
                                ],
                            },
                            {
                                type: 'chapter',
                                number: 2,
                                introduction: null,
                                verses: [
                                    {
                                        type: 'verse',
                                        number: 1,
                                        content: [
                                            'This is the commentary for Genesis 2:1.',
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
