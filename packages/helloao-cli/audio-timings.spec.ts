import {
    parseVerseNumberedAudioTimingsBook,
    toVerseOrderTimings,
} from './audio-timings.js';

describe('parseVerseNumberedAudioTimingsBook()', () => {
    it('should parse a book with a null first chapter and null verses', () => {
        const book = parseVerseNumberedAudioTimingsBook(
            JSON.stringify({
                chapters: [null, [6.6, 11.26, null, 24.62], null],
            })
        );
        expect(book.chapters).toEqual([null, [6.6, 11.26, null, 24.62], null]);
    });

    it('should reject a file without a chapters array', () => {
        expect(() => parseVerseNumberedAudioTimingsBook('{}')).toThrow(
            /chapters/
        );
    });

    it('should reject a chapter that contains something other than numbers and nulls', () => {
        expect(() =>
            parseVerseNumberedAudioTimingsBook(
                JSON.stringify({ chapters: [null, [1, '2']] })
            )
        ).toThrow(/Chapter 1/);
    });
});

describe('toVerseOrderTimings()', () => {
    it('should list the times in verse order', () => {
        expect(toVerseOrderTimings([1, 2, 3], [6.6, 11.26, 17.84])).toEqual({
            verses: [6.6, 11.26, 17.84],
        });
    });

    it('should leave out a verse that the translation does not have', () => {
        // e.g. Matthew 17:21, which the BSB leaves out.
        expect(toVerseOrderTimings([1, 2, 4], [1, 2, null, 4])).toEqual({
            verses: [1, 2, 4],
        });
    });

    it('should fail when a verse in the translation has no time', () => {
        expect(toVerseOrderTimings([1, 2, 3], [1, null, 3])).toEqual({
            error: 'no time for verse(s) 2',
        });
        expect(toVerseOrderTimings([1, 2, 3, 4], [1, 2, 3])).toEqual({
            error: 'no time for verse(s) 4',
        });
    });

    it('should fail when there is a time for a verse the translation does not have', () => {
        expect(toVerseOrderTimings([1, 2], [1, 2, 3])).toEqual({
            error: "time(s) for verse(s) 3, which the chapter doesn't have",
        });
    });

    it('should fail when the times go backwards', () => {
        expect(toVerseOrderTimings([1, 2, 3], [1, 5, 3])).toEqual({
            error: 'verse 3 starts before verse 2',
        });
    });
});
