import { ChapterData, ChapterVerse } from './common-types.js';
import {
    simplifyChapter,
    simplifyCommentaryChapter,
    simplifyVerse,
} from './simple.js';

describe('simplifyVerse()', () => {
    it('should concatenate string content', () => {
        const verse: ChapterVerse = {
            type: 'verse',
            number: 1,
            content: ['In ', 'the ', 'beginning'],
        };

        expect(simplifyVerse(verse)).toEqual({
            type: 'verse',
            number: 1,
            text: 'In the beginning',
            footnotes: [],
        });
    });

    it('should include the text from formatted content', () => {
        const verse: ChapterVerse = {
            type: 'verse',
            number: 1,
            content: ['Hello ', { text: 'world' }, '!'],
        };

        expect(simplifyVerse(verse)).toEqual({
            type: 'verse',
            number: 1,
            text: 'Hello world!',
            footnotes: [],
        });
    });

    it('should start a new line for inline line breaks', () => {
        const verse: ChapterVerse = {
            type: 'verse',
            number: 1,
            content: ['Line 1', { lineBreak: true }, 'Line 2'],
        };

        expect(simplifyVerse(verse).text).toBe('Line 1\nLine 2');
    });

    it('should not add a line break when the text already ends with one', () => {
        const verse: ChapterVerse = {
            type: 'verse',
            number: 1,
            content: [
                'Line 1',
                { lineBreak: true },
                { lineBreak: true },
                'Line 2',
            ],
        };

        expect(simplifyVerse(verse).text).toBe('Line 1\nLine 2');
    });

    it('should trim the trailing line break that poem verses can end with', () => {
        const verse: ChapterVerse = {
            type: 'verse',
            number: 1,
            content: ['Line 1', { lineBreak: true }],
        };

        expect(simplifyVerse(verse).text).toBe('Line 1');
    });

    it('should place each line of poetry on its own line', () => {
        const verse: ChapterVerse = {
            type: 'verse',
            number: 1,
            content: [
                { text: 'God is our refuge and strength,', poem: 1 },
                { text: 'a very present help in trouble.', poem: 2 },
            ],
        };

        const simplified = simplifyVerse(verse);

        expect(simplified.text).toBe(
            'God is our refuge and strength,\na very present help in trouble.'
        );
        expect(simplified.poem).toEqual([
            { start: 0, end: 31, level: 1 },
            { start: 32, end: 63, level: 2 },
        ]);
        expect(
            simplified.poem!.map((p) => simplified.text.slice(p.start, p.end))
        ).toEqual([
            'God is our refuge and strength,',
            'a very present help in trouble.',
        ]);
    });

    it('should record the ranges that contain the Words of Jesus', () => {
        const verse: ChapterVerse = {
            type: 'verse',
            number: 5,
            content: [
                'Jesus said to the centurion, ',
                {
                    text: '“Go your way. Let it be done for you as you have believed.”',
                    wordsOfJesus: true,
                },
                ' His servant was healed in that hour.',
            ],
        };

        const simplified = simplifyVerse(verse);

        expect(simplified.wordsOfJesus).toEqual([{ start: 29, end: 88 }]);
        expect(
            simplified.text.slice(
                simplified.wordsOfJesus![0].start,
                simplified.wordsOfJesus![0].end
            )
        ).toBe('“Go your way. Let it be done for you as you have believed.”');
    });

    it('should merge Words of Jesus ranges that are next to each other', () => {
        const verse: ChapterVerse = {
            type: 'verse',
            number: 3,
            content: [
                {
                    text: '“Blessed are the poor in spirit,',
                    poem: 1,
                    wordsOfJesus: true,
                },
                {
                    text: 'for theirs is the Kingdom of Heaven.',
                    poem: 2,
                    wordsOfJesus: true,
                },
            ],
        };

        const simplified = simplifyVerse(verse);

        expect(simplified.text).toBe(
            '“Blessed are the poor in spirit,\nfor theirs is the Kingdom of Heaven.'
        );
        expect(simplified.wordsOfJesus).toEqual([{ start: 0, end: 69 }]);
        expect(simplified.poem).toEqual([
            { start: 0, end: 32, level: 1 },
            { start: 33, end: 69, level: 2 },
        ]);
    });

    it('should not merge Words of Jesus ranges that are separated by other text', () => {
        const verse: ChapterVerse = {
            type: 'verse',
            number: 1,
            content: [
                { text: 'Follow me,', wordsOfJesus: true },
                ' he said, ',
                {
                    text: 'and I will make you fishers of men.',
                    wordsOfJesus: true,
                },
            ],
        };

        expect(simplifyVerse(verse).wordsOfJesus).toEqual([
            { start: 0, end: 10 },
            { start: 20, end: 55 },
        ]);
    });

    it('should record inline headings', () => {
        const verse: ChapterVerse = {
            type: 'verse',
            number: 1,
            content: [
                'The end of the matter.',
                { heading: 'A New Section' },
                'The beginning of the next.',
            ],
        };

        const simplified = simplifyVerse(verse);

        expect(simplified.text).toBe(
            'The end of the matter. The beginning of the next.'
        );
        expect(simplified.headings).toEqual([
            { offset: 22, text: 'A New Section' },
        ]);
    });
});

describe('simplifyChapter()', () => {
    it('should flatten the chapter content', () => {
        const chapter: ChapterData = {
            number: 1,
            content: [
                {
                    type: 'heading',
                    content: ['The', 'Creation'],
                },
                {
                    type: 'line_break',
                },
                {
                    type: 'verse',
                    number: 1,
                    content: [
                        'In the beginning God created the heavens and the earth.',
                    ],
                },
            ],
            footnotes: [],
        };

        expect(simplifyChapter(chapter)).toEqual({
            number: 1,
            content: [
                {
                    type: 'heading',
                    text: 'The Creation',
                },
                {
                    type: 'line_break',
                },
                {
                    type: 'verse',
                    number: 1,
                    text: 'In the beginning God created the heavens and the earth.',
                    footnotes: [],
                },
            ],
            footnotes: [],
        });
    });

    it('should place footnotes on the verse that references them', () => {
        const chapter: ChapterData = {
            number: 1,
            content: [
                {
                    type: 'verse',
                    number: 6,
                    content: [
                        'And God said, “Let there be an expanse',
                        {
                            noteId: 2,
                        },
                        'between the waters, to separate the waters from the waters.”',
                    ],
                },
            ],
            footnotes: [
                {
                    noteId: 2,
                    text: 'Or a firmament',
                    reference: {
                        chapter: 1,
                        verse: 6,
                    },
                    caller: '+',
                },
            ],
        };

        const simplified = simplifyChapter(chapter);
        const verse = simplified.content[0];

        if (verse.type !== 'verse') {
            throw new Error('Expected a verse');
        }

        expect(verse.text).toBe(
            'And God said, “Let there be an expanse between the waters, to separate the waters from the waters.”'
        );
        expect(verse.footnotes).toEqual([
            {
                noteId: 2,
                offset: 38,
                text: 'Or a firmament',
                caller: '+',
            },
        ]);
        expect(verse.text.slice(0, 38)).toBe(
            'And God said, “Let there be an expanse'
        );
        expect(simplified.footnotes).toEqual([]);
    });

    it('should place footnotes that occur at the end of a verse at the end of the text', () => {
        const chapter: ChapterData = {
            number: 1,
            content: [
                {
                    type: 'verse',
                    number: 1,
                    content: ['In the beginning.', { noteId: 0 }],
                },
            ],
            footnotes: [
                {
                    noteId: 0,
                    text: 'Or in a beginning',
                    caller: '+',
                },
            ],
        };

        const simplified = simplifyChapter(chapter);
        const verse = simplified.content[0];

        if (verse.type !== 'verse') {
            throw new Error('Expected a verse');
        }

        expect(verse.text).toBe('In the beginning.');
        expect(verse.footnotes).toEqual([
            {
                noteId: 0,
                offset: 17,
                text: 'Or in a beginning',
                caller: '+',
            },
        ]);
    });

    it('should use the footnote reference when the verse does not contain a marker', () => {
        const chapter: ChapterData = {
            number: 1,
            content: [
                {
                    type: 'verse',
                    number: 1,
                    content: ['In the beginning.'],
                },
            ],
            footnotes: [
                {
                    noteId: 0,
                    text: 'Or in a beginning',
                    reference: {
                        chapter: 1,
                        verse: 1,
                    },
                    caller: '+',
                },
            ],
        };

        const simplified = simplifyChapter(chapter);
        const verse = simplified.content[0];

        if (verse.type !== 'verse') {
            throw new Error('Expected a verse');
        }

        expect(verse.footnotes).toEqual([
            {
                noteId: 0,
                offset: 17,
                text: 'Or in a beginning',
                caller: '+',
            },
        ]);
        expect(simplified.footnotes).toEqual([]);
    });

    it('should keep footnotes that cannot be matched to a verse on the chapter', () => {
        const chapter: ChapterData = {
            number: 1,
            content: [
                {
                    type: 'verse',
                    number: 1,
                    content: ['In the beginning.'],
                },
            ],
            footnotes: [
                {
                    noteId: 0,
                    text: 'A note about the chapter',
                    caller: '+',
                },
            ],
        };

        const simplified = simplifyChapter(chapter);
        const verse = simplified.content[0];

        if (verse.type !== 'verse') {
            throw new Error('Expected a verse');
        }

        expect(verse.footnotes).toEqual([]);
        expect(simplified.footnotes).toEqual([
            {
                noteId: 0,
                text: 'A note about the chapter',
                caller: '+',
            },
        ]);
    });

    it('should simplify Hebrew Subtitles', () => {
        const chapter: ChapterData = {
            number: 3,
            content: [
                {
                    type: 'hebrew_subtitle',
                    content: [
                        'A Psalm of David, when he fled from Absalom his son.',
                    ],
                },
            ],
            footnotes: [],
        };

        expect(simplifyChapter(chapter).content).toEqual([
            {
                type: 'hebrew_subtitle',
                text: 'A Psalm of David, when he fled from Absalom his son.',
                footnotes: [],
            },
        ]);
    });

    it('should keep footnote offsets inside the text when trailing whitespace is trimmed', () => {
        const chapter: ChapterData = {
            number: 1,
            content: [
                {
                    type: 'verse',
                    number: 1,
                    content: [
                        'In the beginning.',
                        { noteId: 0 },
                        { lineBreak: true },
                    ],
                },
            ],
            footnotes: [
                {
                    noteId: 0,
                    text: 'Or in a beginning',
                    caller: '+',
                },
            ],
        };

        const simplified = simplifyChapter(chapter);
        const verse = simplified.content[0];

        if (verse.type !== 'verse') {
            throw new Error('Expected a verse');
        }

        expect(verse.text).toBe('In the beginning.');
        expect(verse.footnotes[0].offset).toBe(17);
    });
});

describe('simplifyCommentaryChapter()', () => {
    it('should simplify the verses and keep the introduction', () => {
        expect(
            simplifyCommentaryChapter({
                number: 1,
                introduction: 'An introduction to the chapter.',
                content: [
                    {
                        type: 'verse',
                        number: 1,
                        content: ['Some ', 'commentary.'],
                    },
                ],
            })
        ).toEqual({
            number: 1,
            introduction: 'An introduction to the chapter.',
            content: [
                {
                    type: 'verse',
                    number: 1,
                    text: 'Some commentary.',
                    footnotes: [],
                },
            ],
        });
    });

    it('should omit the introduction when there is none', () => {
        expect(
            simplifyCommentaryChapter({
                number: 1,
                content: [],
            })
        ).toEqual({
            number: 1,
            content: [],
        });
    });
});
