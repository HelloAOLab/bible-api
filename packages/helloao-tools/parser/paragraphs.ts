import {
    ChapterContent,
    InlineLineBreak,
    LineBreak,
    ParseTree,
    Verse,
} from './types.js';

/** The USFM/USX styles that start a paragraph. */
const PARAGRAPH_STYLES = new Set([
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

/** Creates the chapter line break that starts a paragraph. */
export function paragraphBreak(style?: string): LineBreak {
    return { type: 'line_break', ...(style ? { paragraph: style } : {}) };
}

/** Creates the line break inside a verse that starts a paragraph. */
export function inlineBreak(style?: string): InlineLineBreak {
    return { lineBreak: true, ...(style ? { paragraph: style } : {}) };
}

/** Removes trailing inline breaks and returns their chapter-level equivalents. */
export function hoistTrailingBreaks(content: Verse['content']): LineBreak[] {
    const result: LineBreak[] = [];
    while (content.length) {
        const last = content.at(-1);
        if (typeof last !== 'object' || !('lineBreak' in last)) {
            break;
        }
        content.pop();
        result.unshift(paragraphBreak(last.paragraph));
    }
    return result;
}

/**
 * Merges each plain line break into the paragraph break that immediately follows it,
 * so that a blank line followed by a paragraph (e.g. "\b \m") renders as a single break.
 */
export function mergeParagraphBreaks(content: ChapterContent[]): void {
    mergeBreaks(content, (c): c is LineBreak => c.type === 'line_break');
    for (const c of content) {
        if (c.type === 'verse') {
            mergeBreaks(
                c.content,
                (v): v is InlineLineBreak =>
                    typeof v === 'object' && 'lineBreak' in v
            );
        }
    }
}

/** Merges the paragraph breaks of every chapter in the given tree. */
export function mergeTreeParagraphBreaks(root: ParseTree): void {
    for (const c of root.content) {
        if (c.type === 'chapter') {
            mergeParagraphBreaks(c.content);
        }
    }
}

function mergeBreaks<T, B extends T & { paragraph?: string }>(
    content: T[],
    isBreak: (value: T) => value is B
): void {
    for (let i = 1; i < content.length; i++) {
        const current = content[i];
        const previous = content[i - 1];
        if (
            isBreak(current) &&
            current.paragraph &&
            isBreak(previous) &&
            !previous.paragraph
        ) {
            previous.paragraph = current.paragraph;
            content.splice(i, 1);
            i--;
        }
    }
}
