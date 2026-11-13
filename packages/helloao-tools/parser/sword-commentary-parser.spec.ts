import {
    SwordCommentaryParser,
    swordMarkupToText,
} from './sword-commentary-parser';

describe('swordMarkupToText()', () => {
    it('should convert OSIS paragraphs and titles into lines', () => {
        expect(
            swordMarkupToText(
                '<div eID="gen3" type="x-p"/> <title type="x-s">Preface</title> <div sID="gen4" type="x-p"/> Every   believer <hi type="italic">finds</hi> himself, <reference osisRef="Exo.2.3">Exo 2:3</reference>. <div eID="gen4" type="x-p"/> <div sID="gen5" type="x-p"/>Second&amp;paragraph<lb/>Third',
                'OSIS'
            )
        ).toBe(
            'Preface\nEvery believer finds himself, Exo 2:3.\nSecond&paragraph\nThird'
        );
    });

    it('should leave out notes', () => {
        expect(
            swordMarkupToText(
                'Before<note type="crossReference">See <reference osisRef="Gen.1.1">Gen 1:1</reference><note>nested</note></note> after',
                'OSIS'
            )
        ).toBe('Before after');
    });

    it('should include quote markers', () => {
        expect(
            swordMarkupToText('<q marker="“"/>Hello<q marker="”"/>', 'OSIS')
        ).toBe('“Hello”');
    });

    it('should decode entities', () => {
        expect(
            swordMarkupToText(
                '&lt;a&gt; &#233; &#x3B1; &quot;q&quot; &bogus;',
                'OSIS'
            )
        ).toBe('<a> é α "q" &bogus;');
    });

    it('should support ThML', () => {
        expect(
            swordMarkupToText(
                '<p>First <b>bold</b></p><p>Second<br/>Third</p><scripRef passage="Gen 1:1">Gen 1:1</scripRef>',
                'ThML'
            )
        ).toBe('First bold\nSecond\nThird\nGen 1:1');
    });

    it('should support GBF', () => {
        expect(
            swordMarkupToText(
                'First<RF>a note<Rf> <FI>italic<Fi><CM>Second<CL>Third',
                'GBF'
            )
        ).toBe('First italic\nSecond\nThird');
    });

    it('should support plain text', () => {
        expect(swordMarkupToText('First <b>\n\n  Second', 'Plaintext')).toBe(
            'First <b>\nSecond'
        );
    });
});

describe('SwordCommentaryParser', () => {
    it('should convert the entries into a commentary tree', () => {
        const parser = new SwordCommentaryParser();
        const tree = parser.parse(
            JSON.stringify({
                sourceType: 'OSIS',
                entries: [
                    {
                        book: 'GEN',
                        chapter: 0,
                        verse: 0,
                        text: '<div type="book" osisID="Gen" sID="a"/>Book intro',
                    },
                    {
                        book: 'GEN',
                        chapter: 1,
                        verse: 0,
                        text: '<chapter n="1" osisID="Gen.1" sID="Gen.1"/> ',
                    },
                    {
                        book: 'GEN',
                        chapter: 1,
                        verse: 1,
                        text: '<title type="x-s">Introduction</title><div sID="1" type="x-p"/>Summary of the chapter.<div eID="1" type="x-p"/><hi type="bold">Verse 1</hi><div sID="2" type="x-p"/>In the beginning - comment.',
                    },
                    {
                        book: 'GEN',
                        chapter: 1,
                        verse: 2,
                        text: '<hi type="bold">Verse 2</hi><div sID="3" type="x-p"/>Without form - comment.<div eID="3" type="x-p"/><div sID="4" type="x-p"/>More.',
                    },
                    {
                        book: 'GEN',
                        chapter: 2,
                        verse: 1,
                        text: '<hi type="bold">Verse 1</hi><lb/> Thus the heavens.',
                    },
                    {
                        book: 'GEN',
                        chapter: 2,
                        verse: 2,
                        text: '<hi type="bold">Verse 3</hi> Not the heading for this verse.',
                    },
                    {
                        book: 'EXO',
                        chapter: 1,
                        verse: 1,
                        text: '<chapter eID="Exo.1"/>',
                    },
                    {
                        book: 'EXO',
                        chapter: 1,
                        verse: 2,
                        text: 'Exodus 1:2',
                    },
                ],
            })
        );

        expect(tree).toEqual({
            type: 'commentary/root',
            books: [
                {
                    type: 'book',
                    book: 'GEN',
                    introduction: 'Book intro',
                    chapters: [
                        {
                            type: 'chapter',
                            number: 1,
                            introduction:
                                'Introduction\nSummary of the chapter.',
                            verses: [
                                {
                                    type: 'verse',
                                    number: 1,
                                    content: ['In the beginning - comment.'],
                                },
                                {
                                    type: 'verse',
                                    number: 2,
                                    content: ['Without form - comment.\nMore.'],
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
                                    content: ['Thus the heavens.'],
                                },
                                {
                                    type: 'verse',
                                    number: 2,
                                    content: [
                                        'Verse 3 Not the heading for this verse.',
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    type: 'book',
                    book: 'EXO',
                    introduction: null,
                    chapters: [
                        {
                            type: 'chapter',
                            number: 1,
                            introduction: null,
                            verses: [
                                {
                                    type: 'verse',
                                    number: 2,
                                    content: ['Exodus 1:2'],
                                },
                            ],
                        },
                    ],
                },
            ],
        });
    });
});
