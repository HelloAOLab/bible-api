/**
 * @jest-environment jsdom
 * @jest-environment-options {"customExportConditions": ["node", "require"]}
 */
import {
    act,
    cleanup,
    fireEvent,
    render,
    screen,
    waitFor,
} from '@testing-library/react';
import { FreeUseBibleApi } from 'free-use-bible-api';
import { StrictMode } from 'react';
import { createBibleDataManager } from './BibleDataManager.js';
import { BibleReader, type BibleReaderProps } from './BibleReader.js';
import {
    createBibleReadingState,
    type BibleReadingOptions,
    type BibleReadingState,
} from './BibleReadingManager.js';
import { useBibleDataManager, useBibleReadingState } from './hooks.js';
import { FakeBibleServer } from './test/fakeApi.js';

describe('BibleReader', () => {
    let server: FakeBibleServer;
    const states: BibleReadingState[] = [];

    beforeEach(() => {
        server = new FakeBibleServer().install();
    });

    afterEach(() => {
        cleanup();
        states.forEach((state) => state.dispose());
        states.length = 0;
        server.uninstall();
    });

    function renderReader(
        options: BibleReadingOptions = {
            initialTranslationId: 'BSB',
            initialBookId: 'GEN',
        },
        props: Partial<BibleReaderProps> = {}
    ) {
        const state = createBibleReadingState(
            createBibleDataManager(new FreeUseBibleApi()),
            options
        );
        states.push(state);
        const result = render(<BibleReader readingState={state} {...props} />);
        return { state, ...result };
    }

    const verse = (container: HTMLElement, number: number) =>
        container.querySelector<HTMLElement>(
            `[data-verse-number="${number}"]`
        )!;

    it('renders the chapter text, headings, poetry, and license notice', async () => {
        const { container } = renderReader();

        await screen.findByText('Genesis 1 heading');
        expect(screen.getByRole('heading', { level: 2 }).textContent).toBe(
            'Genesis 1'
        );
        expect(screen.getByText('BSB')).toBeTruthy();
        expect(verse(container, 1).textContent).toBe('1Genesis 1:1 text.');
        expect(
            verse(container, 2).querySelector('.fuba-words-of-jesus')
                ?.textContent
        ).toBe(' I am the way.');
        expect(
            Array.from(
                verse(container, 3).querySelectorAll('.fuba-verse-line')
            ).map((line) => line.textContent)
        ).toEqual(['3First poem line', 'Second poem line']);
        expect(screen.getByText('BSB is in the public domain.')).toBeTruthy();
    });

    it('hides the parts of the text that are turned off', async () => {
        const { container } = renderReader(undefined, {
            scriptureElements: {
                showHeadings: false,
                showVerseNumbers: false,
                showFootnotes: false,
                showRedLettering: false,
            },
        });

        await waitFor(() => expect(verse(container, 1)).toBeTruthy());
        expect(screen.queryByText('Genesis 1 heading')).toBeNull();
        expect(container.querySelector('.fuba-verse-number')).toBeNull();
        expect(container.querySelector('.fuba-words-of-jesus')).toBeNull();
        expect(
            screen.queryByRole('button', { name: /Open footnote/ })
        ).toBeNull();
        // Without verse numbers, a real space keeps verses from running together.
        expect(
            container.querySelector('.fuba-chapter-content')!.textContent
        ).toContain('Genesis 1:1 text. Genesis 1:2 text');
    });

    it('moves between chapters with the navigation buttons', async () => {
        renderReader();
        await screen.findByText('Genesis 1 heading');

        const previous = screen.getByRole('button', {
            name: 'Previous chapter',
        }) as HTMLButtonElement;
        expect(previous.disabled).toBe(true);

        fireEvent.click(screen.getByRole('button', { name: 'Next chapter' }));

        await screen.findByText('Genesis 2 heading');
        expect(screen.getByRole('heading', { level: 2 }).textContent).toBe(
            'Genesis 2'
        );
        expect(previous.disabled).toBe(false);
    });

    it('dims the previous chapter while the next one loads, then shows a placeholder', async () => {
        const { container } = renderReader();
        await screen.findByText('Genesis 1 heading');
        server.hold('/GEN/2.json');

        fireEvent.click(screen.getByRole('button', { name: 'Next chapter' }));

        expect(screen.getByRole('heading', { level: 2 }).textContent).toBe(
            'Genesis 2'
        );
        expect(
            container.querySelector('.fuba-chapter-content-stale')
        ).toBeTruthy();
        expect(screen.getByText('Genesis 1 heading')).toBeTruthy();

        await screen.findByRole('status');
        expect(screen.queryByText('Genesis 1 heading')).toBeNull();

        act(() => server.release('/GEN/2.json'));
        await screen.findByText('Genesis 2 heading');
        expect(screen.queryByRole('status')).toBeNull();
    });

    it('opens a footnote and closes it with Escape or the close button', async () => {
        renderReader();
        await screen.findByText('Genesis 1 heading');

        fireEvent.click(
            screen.getByRole('button', { name: 'Open footnote 0' })
        );
        const dialog = screen.getByRole('dialog');
        expect(dialog.textContent).toContain('Genesis 1:2');
        expect(dialog.textContent).toContain('Footnote for Genesis 1:2.');

        fireEvent.keyDown(document, { key: 'Escape' });
        expect(screen.queryByRole('dialog')).toBeNull();

        fireEvent.click(
            screen.getByRole('button', { name: 'Open footnote 0' })
        );
        fireEvent.click(screen.getByRole('button', { name: 'Close footnote' }));
        expect(screen.queryByRole('dialog')).toBeNull();
    });

    it('selects and deselects a verse when it is clicked', async () => {
        const { container, state } = renderReader();
        await screen.findByText('Genesis 1 heading');

        fireEvent.click(verse(container, 1));
        expect(verse(container, 1).className).toContain('fuba-verse-selected');
        expect(state.selectedVerses.value.map((v) => v.verse.number)).toEqual([
            1,
        ]);

        fireEvent.click(verse(container, 1));
        expect(verse(container, 1).className).not.toContain(
            'fuba-verse-selected'
        );
    });

    it('leaves verses alone when selection is turned off', async () => {
        const { container, state } = renderReader(undefined, {
            selectableVerses: false,
        });
        await screen.findByText('Genesis 1 heading');

        expect(verse(container, 1).getAttribute('role')).toBeNull();
        fireEvent.click(verse(container, 1));
        expect(state.selectedVerses.value).toEqual([]);
    });

    it('applies verse decorations', async () => {
        const { container, state } = renderReader();
        await screen.findByText('Genesis 1 heading');

        act(() => {
            state.decorateVerses('GEN', 1, 1, {
                className: 'whole-verse',
                containerClassName: 'whole-chapter',
            });
            state.decorateVerses('GEN', 1, 2, {
                targetContent: 'the way',
                className: 'fragment',
            });
        });

        expect(verse(container, 1).querySelector('.whole-verse')).toBeTruthy();
        expect(container.querySelector('.whole-chapter')).toBeTruthy();
        expect(
            verse(container, 2).querySelector('.fragment')?.textContent
        ).toBe('the way');
    });

    it('scrolls to the requested verse once the chapter loads', async () => {
        const scrolled: Element[] = [];
        const original = Element.prototype.scrollIntoView;
        Element.prototype.scrollIntoView = function (this: Element) {
            scrolled.push(this);
        };
        try {
            const { state } = renderReader({
                initialTranslationId: 'BSB',
                initialBookId: 'GEN',
                scrollToVerse: 3,
            });

            await waitFor(() => expect(scrolled).toHaveLength(1));
            expect(scrolled[0]!.getAttribute('data-verse-number')).toBe('3');
            expect(state.scrollToVerse.value).toBeNull();
        } finally {
            Element.prototype.scrollIntoView = original;
        }
    });

    it('shows a load error and recovers when Reload is pressed', async () => {
        server.fail('/GEN/1.json');
        renderReader();

        const alert = await screen.findByRole('alert');
        expect(alert.textContent).toContain('Chapter unavailable');

        server.restore('/GEN/1.json');
        fireEvent.click(screen.getByRole('button', { name: 'Reload' }));

        await screen.findByText('Genesis 1 heading');
        expect(screen.queryByRole('alert')).toBeNull();
    });

    it('offers the first book when the requested book is missing', async () => {
        renderReader({ initialTranslationId: 'BSB', initialBookId: 'REV' });

        await screen.findByText('Book not found');
        expect(
            screen.getByText(
                "We couldn't find that book in BSB Test Translation."
            )
        ).toBeTruthy();

        fireEvent.click(
            screen.getByRole('button', { name: 'Go to Genesis 1' })
        );

        await screen.findByText('Genesis 1 heading');
        expect(screen.queryByText('Book not found')).toBeNull();
    });

    it('draws the highlights for the chapter on screen', async () => {
        const { container } = renderReader(undefined, {
            highlights: [
                { bookId: 'GEN', chapterNumber: 1, verse: 2, colorId: 'blue' },
                { bookId: 'GEN', chapterNumber: 2, verse: 1, colorId: 'red' },
            ],
        });
        await screen.findByText('Genesis 1 heading');

        const runs = Array.from(
            container.querySelectorAll('[data-highlight-fill]')
        );
        expect(runs.map((run) => run.className)).toEqual([
            'fuba-highlight fuba-highlight-blue',
        ]);
        expect(runs[0]!.querySelector('[data-verse-number="2"]')).toBeTruthy();
        expect(container.querySelector('.fuba-highlight-layer')).toBeTruthy();

        fireEvent.click(screen.getByRole('button', { name: 'Next chapter' }));
        await screen.findByText('Genesis 2 heading');

        expect(
            Array.from(container.querySelectorAll('[data-highlight-fill]')).map(
                (run) => run.className
            )
        ).toEqual(['fuba-highlight fuba-highlight-red']);
    });

    it.each([
        ['dark', 'dark'],
        ['light', 'light'],
        ['system', ''],
        [undefined, ''],
    ] as const)('theme %s sets color-scheme to "%s"', (theme, expected) => {
        const { container } = renderReader(undefined, { theme });

        const reader =
            container.querySelector<HTMLElement>('.fuba-bible-reader')!;
        expect(reader.style.colorScheme).toBe(expected);
    });

    it('uses custom labels', async () => {
        renderReader(undefined, {
            labels: { nextChapter: 'Siguiente capítulo' },
        });

        expect(
            await screen.findByRole('button', { name: 'Siguiente capítulo' })
        ).toBeTruthy();
    });
});

describe('useBibleReadingState()', () => {
    let server: FakeBibleServer;

    beforeEach(() => {
        server = new FakeBibleServer().install();
    });

    afterEach(() => {
        cleanup();
        server.uninstall();
    });

    function App() {
        const dataManager = useBibleDataManager();
        const readingState = useBibleReadingState(dataManager, {
            initialTranslationId: 'BSB',
            initialBookId: 'JHN',
        });
        return <BibleReader readingState={readingState} />;
    }

    it('keeps reading after StrictMode remounts the component', async () => {
        render(
            <StrictMode>
                <App />
            </StrictMode>
        );

        await screen.findByText('John 1 heading');
        fireEvent.click(screen.getByRole('button', { name: 'Next chapter' }));
        await screen.findByText('John 2 heading');
    });
});
