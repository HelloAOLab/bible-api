import { InlineLineBreakSchema } from '../generation/common-types.js';
import { ChapterContent, Verse } from './types.js';
import {
    paragraphStyle,
    hoistTrailingBreaks,
    mergeParagraphBreaks,
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
    it('accepts inline line breaks with and without a paragraph', () => {
        expect(
            InlineLineBreakSchema.safeParse({ lineBreak: true }).success
        ).toBe(true);
        expect(
            InlineLineBreakSchema.safeParse({
                lineBreak: true,
                paragraph: 'pi1',
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
            { lineBreak: true, paragraph: 'p' },
            { lineBreak: true },
            { lineBreak: true, paragraph: 'pi1' },
        ];
        expect(hoistTrailingBreaks(content)).toEqual([
            { type: 'line_break', paragraph: 'p' },
            { type: 'line_break' },
            { type: 'line_break', paragraph: 'pi1' },
        ]);
        expect(content).toEqual(['Text']);
    });
});

describe('mergeParagraphBreaks()', () => {
    it('merges a blank line into the paragraph that follows it', () => {
        const content: ChapterContent[] = [
            { type: 'line_break' },
            { type: 'line_break', paragraph: 'm' },
        ];
        mergeParagraphBreaks(content);
        expect(content).toEqual([{ type: 'line_break', paragraph: 'm' }]);
    });
    it('keeps repeated blank lines', () => {
        const content: ChapterContent[] = [
            { type: 'line_break' },
            { type: 'line_break' },
        ];
        mergeParagraphBreaks(content);
        expect(content).toEqual([
            { type: 'line_break' },
            { type: 'line_break' },
        ]);
    });
    it('only merges the blank line directly before a paragraph', () => {
        const content: ChapterContent[] = [
            { type: 'line_break' },
            { type: 'line_break' },
            { type: 'line_break', paragraph: 'm' },
            { type: 'line_break', paragraph: 'p' },
        ];
        mergeParagraphBreaks(content);
        expect(content).toEqual([
            { type: 'line_break' },
            { type: 'line_break', paragraph: 'm' },
            { type: 'line_break', paragraph: 'p' },
        ]);
    });
    it('does not merge across other content', () => {
        const content: ChapterContent[] = [
            { type: 'line_break' },
            { type: 'heading', content: ['Heading'] },
            { type: 'line_break', paragraph: 'p' },
        ];
        mergeParagraphBreaks(content);
        expect(content).toHaveLength(3);
    });
    it('merges inline breaks inside verses', () => {
        const content: ChapterContent[] = [
            {
                type: 'verse',
                number: 1,
                content: [
                    'First',
                    { lineBreak: true },
                    { lineBreak: true, paragraph: 'm' },
                    'Second',
                ],
            },
        ];
        mergeParagraphBreaks(content);
        expect(content).toEqual([
            {
                type: 'verse',
                number: 1,
                content: [
                    'First',
                    { lineBreak: true, paragraph: 'm' },
                    'Second',
                ],
            },
        ]);
    });
});
