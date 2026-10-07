import type englishLabels from './labels.json';

/**
 * The navbar, sidebar, home page and 404 page text, as written in
 * `labels.json`. tools/translate-docs.ts translates that file into
 * `docs/<language>/labels.json`.
 */
export type Labels = typeof englishLabels;

type LabelTree = { [key: string]: string | LabelTree };

/**
 * Fills in anything a translation is missing (say, a label added since it
 * was last translated) from the English labels.
 */
export function mergeLabels(english: Labels, translated: unknown): Labels {
    const merge = (base: LabelTree, over: unknown): LabelTree =>
        Object.fromEntries(
            Object.entries(base).map(([key, value]) => {
                const other =
                    over && typeof over === 'object'
                        ? (over as Record<string, unknown>)[key]
                        : undefined;
                if (typeof value === 'string') {
                    return [key, typeof other === 'string' ? other : value];
                }
                return [key, merge(value, other)];
            })
        );
    return merge(english, translated) as Labels;
}
