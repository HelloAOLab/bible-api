import {
    ChapterParagraph,
    LineBreak,
    InlineLineBreak,
    Verse,
} from './types.js';

export const PARAGRAPH_STYLES = new Set([
    'p',
    'm',
    'pi',
    'pi1',
    'pi2',
    'pi3',
    'mi',
    'pc',
    'po',
    'pr',
    'pm',
    'pmo',
    'pmc',
    'pmr',
    'ph1',
    'ph2',
    'ph3',
    'cls',
]);

/** Returns the source style when it starts a paragraph. */
export function paragraphStyle(
    style: string | null | undefined
): string | null {
    return style && PARAGRAPH_STYLES.has(style) ? style : null;
}

/** Creates the compatibility break and paragraph marker for a chapter. */
export function paragraphBreak(style?: string): [LineBreak, ChapterParagraph] {
    return [
        { type: 'line_break' },
        { type: 'paragraph', ...(style ? { style } : {}) },
    ];
}

/** Identifies an inline break that starts a paragraph. */
export function isInlineParagraph(
    value: unknown
): value is Extract<InlineLineBreak, { paragraph: true }> {
    return (
        typeof value === 'object' &&
        value !== null &&
        'lineBreak' in value &&
        value.lineBreak === true &&
        'paragraph' in value &&
        value.paragraph === true &&
        'style' in value &&
        typeof value.style === 'string'
    );
}

/** Removes trailing inline breaks and returns their chapter-level equivalents. */
export function hoistTrailingBreaks(
    content: Verse['content']
): (LineBreak | ChapterParagraph)[] {
    const result: (LineBreak | ChapterParagraph)[] = [];
    while (content.length) {
        const last = content.at(-1);
        if (typeof last !== 'object' || !('lineBreak' in last)) break;
        content.pop();
        if (isInlineParagraph(last)) {
            result.unshift(...paragraphBreak(last.style));
        } else {
            result.unshift({ type: 'line_break' });
        }
    }
    return result;
}
