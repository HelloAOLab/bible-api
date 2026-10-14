/**
 * @jest-environment jsdom
 * @jest-environment-options {"customExportConditions": ["node", "require"]}
 */
import { act, cleanup, render } from '@testing-library/react';
import {
    ChapterContent,
    DEFAULT_SCRIPTURE_ELEMENTS,
    type VerseHighlight,
} from './ChapterContent.js';
import { RIBBON_FADE_MS } from './HighlightLayer.js';
import { makeChapter, makeTranslation } from './test/fakeApi.js';

// Genesis 1 in the fixture: verses 1 and 2 are prose, verse 3 is poetry.
const GEN_1 = makeChapter(makeTranslation('BSB'), 'GEN', 1);
const GEN_2 = makeChapter(makeTranslation('BSB'), 'GEN', 2);

function highlight(
    verse: VerseHighlight['verse'],
    overrides: Partial<VerseHighlight> = {}
): VerseHighlight {
    return {
        bookId: 'GEN',
        chapterNumber: 1,
        verse,
        colorId: 'yellow',
        ...overrides,
    };
}

function runs(container: HTMLElement) {
    return Array.from(
        container.querySelectorAll<HTMLElement>('[data-highlight-fill]')
    ).map((run) => ({
        key: run.getAttribute('data-highlight-key'),
        fill: run.getAttribute('data-highlight-fill'),
        className: run.className,
        color: run.style.color,
        verses: Array.from(run.querySelectorAll('[data-verse-number]')).map(
            (verse) => Number(verse.getAttribute('data-verse-number'))
        ),
    }));
}

afterEach(() => {
    cleanup();
});

describe('ChapterContent highlights', () => {
    it('groups neighbouring prose verses of the same color into one run', () => {
        const { container } = render(
            <ChapterContent
                chapter={GEN_1}
                highlights={[highlight(1), highlight(2)]}
            />
        );

        expect(runs(container)).toEqual([
            {
                key: '1-2',
                fill: 'var(--fuba-highlight-yellow-color, transparent)',
                className: 'fuba-highlight fuba-highlight-yellow',
                color: '',
                verses: [1, 2],
            },
        ]);
    });

    it('starts a new run at a color change and keeps poetry verses separate', () => {
        const { container } = render(
            <ChapterContent
                chapter={GEN_1}
                highlights={[
                    highlight(1),
                    highlight(2, { colorId: 'green' }),
                    highlight(3, { colorId: 'green' }),
                ]}
            />
        );

        expect(runs(container).map((run) => [run.key, run.verses])).toEqual([
            ['1-1', [1]],
            ['2-2', [2]],
            ['3-3', [3]],
        ]);
    });

    it('highlights a verse range', () => {
        const { container } = render(
            <ChapterContent chapter={GEN_1} highlights={[highlight([1, 2])]} />
        );

        expect(runs(container).map((run) => run.verses)).toEqual([[1, 2]]);
    });

    it('uses a custom color and text color', () => {
        const { container } = render(
            <ChapterContent
                chapter={GEN_1}
                highlights={[
                    highlight(1, {
                        customColor: '#123456',
                        customFontColor: '#ffffff',
                    }),
                ]}
            />
        );

        expect(runs(container)).toMatchObject([
            {
                fill: '#123456',
                className: 'fuba-highlight',
                color: 'rgb(255, 255, 255)',
            },
        ]);
    });

    it('ignores highlights for another chapter, book, or translation', () => {
        const { container } = render(
            <ChapterContent
                chapter={GEN_1}
                highlights={[
                    highlight(1, { chapterNumber: 2 }),
                    highlight(1, { bookId: 'EXO' }),
                    highlight(1, { translationId: 'AAB' }),
                    highlight(2, { translationId: 'BSB' }),
                ]}
            />
        );

        expect(runs(container).map((run) => run.verses)).toEqual([[2]]);
    });

    it('draws nothing when highlights are turned off', () => {
        const { container } = render(
            <ChapterContent
                chapter={GEN_1}
                elements={{
                    ...DEFAULT_SCRIPTURE_ELEMENTS,
                    showHighlights: false,
                }}
                highlights={[highlight(1)]}
            />
        );

        expect(runs(container)).toEqual([]);
    });

    it('spaces verses in and around a run once when verse numbers are hidden', () => {
        const { container } = render(
            <ChapterContent
                chapter={GEN_1}
                elements={{
                    ...DEFAULT_SCRIPTURE_ELEMENTS,
                    showVerseNumbers: false,
                }}
                highlights={[highlight([1, 2])]}
            />
        );

        expect(container.textContent).toContain(
            'Genesis 1:1 text. Genesis 1:2 text'
        );
        // Anywhere in the chapter, including after the run.
        expect(container.textContent).not.toMatch(/ {2}/);
    });
});

describe('ChapterContent theme', () => {
    it('forces a color scheme on its own container', () => {
        const { container } = render(
            <ChapterContent chapter={GEN_1} theme="dark" />
        );

        expect(
            container.querySelector<HTMLElement>('.fuba-chapter-content')!.style
                .colorScheme
        ).toBe('dark');
    });
});

describe('HighlightLayer', () => {
    const realCreateRange = document.createRange;

    // jsdom has no layout, so give every verse a fake line box: verse N sits on
    // line N, 24px apart. Measuring a node reports the lines of the verses in it.
    beforeEach(() => {
        document.createRange = (() => {
            let selected: Node | null = null;
            return {
                selectNodeContents: (node: Node) => {
                    selected = node;
                },
                getClientRects: () => {
                    if (!(selected instanceof Element)) {
                        return [];
                    }
                    const verses = selected.matches('[data-verse-number]')
                        ? [selected]
                        : Array.from(
                              selected.querySelectorAll('[data-verse-number]')
                          );
                    return verses.map((verse) => {
                        const top =
                            Number(verse.getAttribute('data-verse-number')) *
                            24;
                        return {
                            left: 0,
                            right: 300,
                            top,
                            bottom: top + 20,
                            width: 300,
                            height: 20,
                        };
                    });
                },
            };
        }) as unknown as typeof document.createRange;
    });

    afterEach(() => {
        document.createRange = realCreateRange;
        jest.useRealTimers();
    });

    function ribbons(container: HTMLElement) {
        return Array.from(
            container.querySelectorAll<SVGPathElement>(
                '.fuba-highlight-layer path'
            )
        ).map((path) => ({
            fill: path.style.fill,
            entering: path.classList.contains('fuba-highlight-ribbon-enter'),
            exiting: path.style.opacity === '0',
            hasShape: (path.getAttribute('d') ?? '').startsWith('M '),
        }));
    }

    it('draws one ribbon per highlighted run, behind the text', () => {
        const { container } = render(
            <ChapterContent
                chapter={GEN_1}
                highlights={[
                    highlight([1, 2]),
                    highlight(3, { colorId: 'red' }),
                ]}
            />
        );

        const layer = container.querySelector('.fuba-highlight-layer')!;
        expect(layer.getAttribute('aria-hidden')).toBe('true');
        expect(ribbons(container)).toEqual([
            {
                fill: 'var(--fuba-highlight-yellow-color, transparent)',
                entering: true,
                exiting: false,
                hasShape: true,
            },
            {
                fill: 'var(--fuba-highlight-red-color, transparent)',
                entering: true,
                exiting: false,
                hasShape: true,
            },
        ]);
    });

    it('fades a removed highlight out, then drops it', () => {
        jest.useFakeTimers();
        const { container, rerender } = render(
            <ChapterContent chapter={GEN_1} highlights={[highlight(1)]} />
        );

        rerender(<ChapterContent chapter={GEN_1} highlights={[]} />);

        expect(ribbons(container)).toMatchObject([{ exiting: true }]);
        act(() => jest.advanceTimersByTime(RIBBON_FADE_MS + 50));
        expect(ribbons(container)).toEqual([]);
    });

    it('reshapes an extended highlight without fading it in again', () => {
        const { container, rerender } = render(
            <ChapterContent chapter={GEN_1} highlights={[highlight(1)]} />
        );

        rerender(
            <ChapterContent chapter={GEN_1} highlights={[highlight([1, 2])]} />
        );

        // One ribbon, not the old one fading out beside the new one.
        expect(ribbons(container)).toEqual([
            {
                fill: 'var(--fuba-highlight-yellow-color, transparent)',
                entering: false,
                exiting: false,
                hasShape: true,
            },
        ]);
    });

    it('cancels a fade-out when the highlight comes back', () => {
        jest.useFakeTimers();
        const { container, rerender } = render(
            <ChapterContent chapter={GEN_1} highlights={[highlight(1)]} />
        );
        rerender(<ChapterContent chapter={GEN_1} highlights={[]} />);
        rerender(
            <ChapterContent chapter={GEN_1} highlights={[highlight(1)]} />
        );

        expect(ribbons(container)).toMatchObject([{ exiting: false }]);
        act(() => jest.advanceTimersByTime(RIBBON_FADE_MS * 4));
        expect(ribbons(container)).toHaveLength(1);
    });

    it("drops the previous chapter's ribbons without fading them", () => {
        const { container, rerender } = render(
            <ChapterContent chapter={GEN_1} highlights={[highlight(1)]} />
        );

        rerender(
            <ChapterContent chapter={GEN_2} highlights={[highlight(1)]} />
        );

        expect(ribbons(container)).toEqual([]);
    });
});
