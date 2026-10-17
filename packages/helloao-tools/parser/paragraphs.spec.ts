import { InlineLineBreakSchema } from '../generation/common-types.js';
import { Verse } from './types.js';
import {
    paragraphStyle,
    paragraphBreak,
    hoistTrailingBreaks,
    isInlineParagraph,
} from './paragraphs.js';

describe('paragraph styles', () => {
    it.each(['p', 'pi', 'pi1', 'm'])('recognizes %s', (style) => {
        expect(paragraphStyle(style)).toBe(style);
    });
    it('excludes continuation, blank and poetry markers', () => {
        expect(paragraphStyle('nb')).toBeNull();
        expect(paragraphStyle('b')).toBeNull();
        expect(paragraphStyle('q1')).toBeNull();
    });
});

describe('paragraph breaks', () => {
    it('requires a source style on inline paragraphs', () => {
        expect(
            InlineLineBreakSchema.safeParse({ lineBreak: true }).success
        ).toBe(true);
        expect(
            InlineLineBreakSchema.safeParse({
                lineBreak: true,
                paragraph: true,
                style: 'pi1',
            }).success
        ).toBe(true);
        expect(
            InlineLineBreakSchema.safeParse({
                lineBreak: true,
                paragraph: true,
            }).success
        ).toBe(false);
    });
    it('hoists consecutive paragraphs and plain breaks in source order', () => {
        const content: Verse['content'] = [
            'Text',
            { lineBreak: true, paragraph: true, style: 'p' },
            { lineBreak: true },
            { lineBreak: true, paragraph: true, style: 'pi1' },
        ];
        expect(hoistTrailingBreaks(content)).toEqual([
            ...paragraphBreak('p'),
            { type: 'line_break' },
            ...paragraphBreak('pi1'),
        ]);
        expect(content).toEqual(['Text']);
    });
    it('identifies inline paragraph markers', () => {
        expect(
            isInlineParagraph({ lineBreak: true, paragraph: true, style: 'p' })
        ).toBe(true);
        expect(isInlineParagraph({ lineBreak: true })).toBe(false);
        expect(isInlineParagraph(null)).toBe(false);
    });
});
