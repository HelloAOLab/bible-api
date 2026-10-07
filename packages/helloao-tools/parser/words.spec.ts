import { DOMParser } from 'linkedom';
import {
    collapseWhitespaceMap,
    readWordAnnotations,
    trimWordRange,
} from './words.js';

describe('readWordAnnotations()', () => {
    /**
     * Parses the given <char> element so that its attributes can be read.
     */
    function charElement(attributes: string): Element {
        const doc = new DOMParser().parseFromString(
            `<usx version="3.0"><char style="w" ${attributes}>word</char></usx>`,
            'text/xml'
        );
        return doc.documentElement.firstElementChild as any;
    }

    it('should read a single Strongs number', () => {
        expect(readWordAnnotations(charElement('strong="H1234"'))).toEqual({
            strongs: ['H1234'],
        });
    });

    it('should read comma separated Strongs numbers', () => {
        expect(
            readWordAnnotations(charElement('strong="H1234,H5678"'))
        ).toEqual({
            strongs: ['H1234', 'H5678'],
        });
    });

    it('should trim the Strongs numbers and skip empty ones', () => {
        expect(
            readWordAnnotations(charElement('strong=" H1234 , ,H5678 "'))
        ).toEqual({
            strongs: ['H1234', 'H5678'],
        });
    });

    it('should read the lemma', () => {
        expect(readWordAnnotations(charElement('lemma="word"'))).toEqual({
            lemma: 'word',
        });
    });

    it('should read the morphology', () => {
        expect(readWordAnnotations(charElement('x-morph="He,Ncmsc"'))).toEqual({
            morph: 'He,Ncmsc',
        });
    });

    it('should read the source location', () => {
        expect(
            readWordAnnotations(charElement('srcloc="gnt5:51.1.2.1"'))
        ).toEqual({
            srcloc: 'gnt5:51.1.2.1',
        });
    });

    it('should read the occurrence numbers', () => {
        expect(
            readWordAnnotations(
                charElement('x-occurrence="2" x-occurrences="3"')
            )
        ).toEqual({
            occurrence: 2,
            occurrences: 3,
        });
    });

    it('should read the misspelled occurrence numbers', () => {
        // The misspelled attribute names are common in real files.
        expect(
            readWordAnnotations(charElement('x-occurence="2" x-occurences="3"'))
        ).toEqual({
            occurrence: 2,
            occurrences: 3,
        });
    });

    it('should ignore occurrence numbers that are not numbers', () => {
        expect(
            readWordAnnotations(
                charElement('strong="H1234" x-occurrence="first"')
            )
        ).toEqual({
            strongs: ['H1234'],
        });
    });

    it('should read all of the annotations at once', () => {
        expect(
            readWordAnnotations(
                charElement(
                    'strong="G1722" lemma="ἐν" x-morph="Gr,P" srcloc="gnt5:51.1.2.1" x-occurrence="1" x-occurrences="3"'
                )
            )
        ).toEqual({
            strongs: ['G1722'],
            lemma: 'ἐν',
            morph: 'Gr,P',
            srcloc: 'gnt5:51.1.2.1',
            occurrence: 1,
            occurrences: 3,
        });
    });

    it('should return null when there are no annotations', () => {
        expect(readWordAnnotations(charElement(''))).toBe(null);
    });

    it('should return null when the annotations are empty', () => {
        expect(readWordAnnotations(charElement('strong="" lemma=""'))).toBe(
            null
        );
    });
});

describe('collapseWhitespaceMap()', () => {
    it('should collapse runs of whitespace into a single space', () => {
        const { text } = collapseWhitespaceMap('In  the\n   beginning');
        expect(text).toBe('In the beginning');
    });

    it('should trim the result', () => {
        const { text } = collapseWhitespaceMap('\n  In the beginning  \n');
        expect(text).toBe('In the beginning');
    });

    it('should collapse the same way that the parser does', () => {
        const inputs = [
            '',
            ' ',
            '\n\n',
            'word',
            ' word ',
            'In  the\n   beginning',
            '\n   In the beginning.  \n  ',
            'a\tb\r\nc',
        ];

        for (let input of inputs) {
            expect(collapseWhitespaceMap(input).text).toBe(
                input.replace(/\s+/g, ' ').trim()
            );
        }
    });

    it('should map the indexes of every character to the collapsed text', () => {
        const input = '\n  In  the\n   beginning.  ';
        const { text, map } = collapseWhitespaceMap(input);

        expect(text).toBe('In the beginning.');

        // Each word in the original text still slices out the same word.
        for (let word of ['In', 'the', 'beginning']) {
            const start = input.indexOf(word);
            const end = start + word.length;
            expect(text.slice(map[start], map[end])).toBe(word);
        }
    });

    it('should include an entry for the index past the end of the text', () => {
        const input = 'word';
        const { text, map } = collapseWhitespaceMap(input);

        expect(map).toHaveLength(input.length + 1);
        expect(map[input.length]).toBe(text.length);
    });

    it('should clamp the indexes of trimmed whitespace', () => {
        const input = '  word  ';
        const { text, map } = collapseWhitespaceMap(input);

        expect(text).toBe('word');
        expect(map[0]).toBe(0);
        expect(map[1]).toBe(0);
        expect(map[input.length]).toBe(text.length);
    });
});

describe('trimWordRange()', () => {
    it('should return the range when it has no surrounding whitespace', () => {
        expect(trimWordRange('In the beginning', 3, 6)).toEqual({
            start: 3,
            end: 6,
        });
    });

    it('should shrink the range past whitespace', () => {
        expect(trimWordRange('In  the  beginning', 2, 9)).toEqual({
            start: 4,
            end: 7,
        });
    });

    it('should clamp the range to the text', () => {
        expect(trimWordRange('word', -5, 100)).toEqual({
            start: 0,
            end: 4,
        });
    });

    it('should return null when the range is only whitespace', () => {
        expect(trimWordRange('In  the', 2, 4)).toBe(null);
    });

    it('should return null when the range is empty', () => {
        expect(trimWordRange('word', 2, 2)).toBe(null);
    });
});
