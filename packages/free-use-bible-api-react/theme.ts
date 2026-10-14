import type { ReaderTheme } from './ChapterContent.js';

/** The `color-scheme` that applies a theme, or undefined to leave it to CSS. */
export function themeColorScheme(
    theme: ReaderTheme | undefined
): 'light' | 'dark' | undefined {
    return theme === 'light' || theme === 'dark' ? theme : undefined;
}
