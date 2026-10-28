import { FreeUseBibleApi } from 'free-use-bible-api';
import { createBibleDataManager } from './BibleDataManager.js';
import {
    createBibleReadingState,
    emphasizeVerses,
    getDefaultTranslationForLanguage,
    type BibleReadingOptions,
    type BibleReadingState,
} from './BibleReadingManager.js';
import {
    FakeBibleServer,
    makeTranslation,
    waitForCondition,
} from './test/fakeApi.js';

describe('BibleReadingState', () => {
    let server: FakeBibleServer;
    const states: BibleReadingState[] = [];

    beforeEach(() => {
        server = new FakeBibleServer().install();
    });

    afterEach(() => {
        states.forEach((state) => state.dispose());
        states.length = 0;
        server.uninstall();
        jest.useRealTimers();
    });

    function create(options: BibleReadingOptions = {}) {
        const dataManager = createBibleDataManager(new FreeUseBibleApi());
        const state = createBibleReadingState(dataManager, options);
        states.push(state);
        return { state, dataManager };
    }

    async function createLoaded(options: BibleReadingOptions = {}) {
        const created = create(options);
        await waitForCondition(
            () => created.state.initialChapterLoadSettled.value
        );
        return created;
    }

    function currentReference(state: BibleReadingState) {
        const chapter = state.chapterData.value;
        return chapter
            ? `${chapter.translation.id} ${chapter.book.id} ${chapter.chapter.number}`
            : null;
    }

    describe('initial load', () => {
        it('loads the requested translation, book, and chapter', async () => {
            const { state } = await createLoaded({
                initialTranslationId: 'BSB',
                initialBookId: 'JHN',
                initialChapterNumber: 2,
            });

            expect(currentReference(state)).toBe('BSB JHN 2');
            expect(state.title.value).toBe('John 2');
            expect(state.subTitle.value).toBe('BSB Test Translation');
            expect(state.translation.value?.id).toBe('BSB');
            expect(state.loading.value).toBe(false);
            expect(state.error.value).toBeNull();
        });

        it("opens the translation's first book when no book is given", async () => {
            const { state } = await createLoaded({
                initialTranslationId: 'BSB',
            });

            expect(currentReference(state)).toBe('BSB GEN 1');
        });

        it("uses the language's default translation", async () => {
            const { state } = await createLoaded({ initialBookId: 'GEN' });

            expect(state.defaultTranslation.id).toBe('AAB');
            expect(currentReference(state)).toBe('AAB GEN 1');
        });

        it('falls back to the first chapter for a chapter outside the book', async () => {
            const { state } = await createLoaded({
                initialTranslationId: 'BSB',
                initialBookId: 'GEN',
                initialChapterNumber: 99,
            });

            expect(currentReference(state)).toBe('BSB GEN 1');
            expect(state.chapterNumber.value).toBe(1);
        });

        it('leaves the position alone without an error when the book is not in the translation', async () => {
            const { state } = await createLoaded({
                initialTranslationId: 'BSB',
                initialBookId: 'REV',
            });

            expect(state.bookId.value).toBe('REV');
            expect(state.chapterData.value).toBeNull();
            expect(state.error.value).toBeNull();
            expect(state.translationBooks.value?.books).toHaveLength(3);
        });

        it('reports an error for a translation that does not exist', async () => {
            const { state } = await createLoaded({
                initialTranslationId: 'NOPE',
                initialBookId: 'GEN',
            });

            expect(state.error.value).toBe(
                'Translation with ID "NOPE" not available.'
            );
            expect(state.failedTranslationId.value).toBe('NOPE');
        });

        it('loads from another endpoint when given a books.json URL', async () => {
            server.translations.set('https://other.example.com/bible/', [
                makeTranslation('OTH'),
            ]);
            const { state, dataManager } = await createLoaded({
                initialTranslationId:
                    'https://other.example.com/bible/api/OTH/books.json',
                initialBookId: 'GEN',
            });

            expect(currentReference(state)).toBe('OTH GEN 1');
            expect(
                server.requests.some((url) =>
                    url.startsWith(
                        'https://other.example.com/bible/api/OTH/GEN/1'
                    )
                )
            ).toBe(true);
            expect(dataManager.buildTranslationId('OTH')).toBe(
                'https://other.example.com/bible/api/OTH/books.json'
            );
        });

        it('publishes the requested scroll target once the chapter arrives', async () => {
            const { state } = await createLoaded({
                initialTranslationId: 'BSB',
                initialBookId: 'GEN',
                initialChapterNumber: 2,
                scrollToVerse: 3,
            });

            expect(state.scrollToVerse.value).toBe(3);
        });
    });

    describe('navigation', () => {
        it('moves to the next chapter, crossing into the next book', async () => {
            const { state } = await createLoaded({
                initialTranslationId: 'BSB',
                initialBookId: 'GEN',
                initialChapterNumber: 3,
            });

            await state.loadNextChapter();

            expect(currentReference(state)).toBe('BSB EXO 1');
        });

        it("moves to the previous book's last chapter", async () => {
            const { state } = await createLoaded({
                initialTranslationId: 'BSB',
                initialBookId: 'JHN',
                initialChapterNumber: 1,
            });

            // Exodus (order 2) is the nearest earlier book; the gap in `order`
            // between it and John (43) must not matter.
            await state.loadPreviousChapter();

            expect(currentReference(state)).toBe('BSB EXO 1');
        });

        it('has no previous chapter at the start or next chapter at the end', async () => {
            const { state } = await createLoaded({
                initialTranslationId: 'BSB',
                initialBookId: 'GEN',
                initialChapterNumber: 1,
            });

            expect(state.hasPrevious.value).toBe(false);
            expect(state.hasNext.value).toBe(true);
            expect(state.previousChapterPosition.value).toBeNull();
            expect(state.nextChapterPosition.value).toEqual({
                translationId: 'BSB',
                bookId: 'GEN',
                chapterNumber: 2,
            });

            await state.selectChapter('JHN', 2);

            expect(state.hasNext.value).toBe(false);
            expect(state.hasPrevious.value).toBe(true);
            await state.loadNextChapter();
            expect(currentReference(state)).toBe('BSB JHN 2');
        });

        it('moves the position immediately and marks the old text as stale', async () => {
            const { state } = await createLoaded({
                initialTranslationId: 'BSB',
                initialBookId: 'GEN',
            });
            server.hold('/GEN/2.json');

            const navigation = state.loadNextChapter();

            expect(state.chapterNumber.value).toBe(2);
            expect(state.title.value).toBe('Genesis 2');
            expect(state.isChapterContentStale.value).toBe(true);
            expect(currentReference(state)).toBe('BSB GEN 1');

            server.release('/GEN/2.json');
            await navigation;

            expect(state.isChapterContentStale.value).toBe(false);
            expect(currentReference(state)).toBe('BSB GEN 2');
        });

        it('never lets a slow, superseded request replace the current chapter', async () => {
            const { state } = await createLoaded({
                initialTranslationId: 'BSB',
                initialBookId: 'GEN',
            });
            server.hold('/GEN/2.json');

            void state.loadNextChapter();
            const second = state.loadNextChapter();
            await second;
            expect(currentReference(state)).toBe('BSB GEN 3');

            server.release('/GEN/2.json');
            await waitForCondition(() => !state.loading.value);

            expect(currentReference(state)).toBe('BSB GEN 3');
        });

        it('switches translation and opens its first book', async () => {
            const { state } = await createLoaded({
                initialTranslationId: 'BSB',
                initialBookId: 'JHN',
            });

            await state.selectTranslation('AAB');

            expect(currentReference(state)).toBe('AAB GEN 1');
            expect(state.translation.value?.id).toBe('AAB');
        });

        it('selects a translation, book, and chapter together', async () => {
            const { state } = await createLoaded({
                initialTranslationId: 'BSB',
            });

            await state.selectTranslationAndChapter('AAB', 'JHN', 2, {
                scrollToVerse: 2,
            });

            expect(currentReference(state)).toBe('AAB JHN 2');
            expect(state.scrollToVerse.value).toBe(2);
        });

        it('reports a missing book without moving the reader', async () => {
            const { state } = await createLoaded({
                initialTranslationId: 'BSB',
                initialBookId: 'GEN',
            });

            await state.selectTranslationAndChapter('BSB', 'REV', 1);

            expect(state.error.value).toBe(
                'Book with ID "REV" not available for translation "BSB".'
            );
            expect(currentReference(state)).toBe('BSB GEN 1');
        });

        it('selects a book at its first chapter', async () => {
            const { state } = await createLoaded({
                initialTranslationId: 'BSB',
                initialBookId: 'GEN',
                initialChapterNumber: 3,
            });

            await state.selectBook('JHN');

            expect(currentReference(state)).toBe('BSB JHN 1');
        });

        it('fetches the neighbouring chapter without moving there', async () => {
            const { state } = await createLoaded({
                initialTranslationId: 'BSB',
                initialBookId: 'GEN',
                initialChapterNumber: 3,
            });

            const next = await state.getAdjacentChapter('next');

            expect(next?.book.id).toBe('EXO');
            expect(currentReference(state)).toBe('BSB GEN 3');
        });
    });

    describe('errors', () => {
        it('surfaces a failed chapter load and recovers on retry', async () => {
            const { state } = await createLoaded({
                initialTranslationId: 'BSB',
                initialBookId: 'GEN',
            });
            server.fail('/GEN/2.json');

            await state.loadNextChapter();

            expect(state.error.value).toBe('Failed to fetch');
            expect(state.failedTranslationId.value).toBe('BSB');
            expect(state.chapterNumber.value).toBe(2);
            expect(state.isChapterContentStale.value).toBe(true);

            server.restore('/GEN/2.json');
            await state.retryLoad();

            expect(state.error.value).toBeNull();
            expect(currentReference(state)).toBe('BSB GEN 2');
        });

        it('retries a failed initial load', async () => {
            server.fail('/api/BSB/');
            const { state } = await createLoaded({
                initialTranslationId: 'BSB',
                initialBookId: 'GEN',
            });

            expect(state.error.value).not.toBeNull();
            expect(state.chapterData.value).toBeNull();

            server.restore('/api/BSB/');
            await state.retryLoad();

            expect(state.error.value).toBeNull();
            expect(currentReference(state)).toBe('BSB GEN 1');
        });
    });

    describe('selection and footnotes', () => {
        it('toggles verses in and out of the selection, keeping them in order', async () => {
            const { state } = await createLoaded({
                initialTranslationId: 'BSB',
                initialBookId: 'GEN',
            });
            const verses = state.chapterData.value!.chapter.content.filter(
                (entry) => entry.type === 'verse'
            );
            const select = (index: number) =>
                state.selectVerse(
                    {
                        bookId: 'GEN',
                        chapterNumber: 1,
                        translationId: 'BSB',
                        verse: verses[index] as never,
                    },
                    10,
                    20
                );

            select(2);
            select(0);
            expect(
                state.selectedVerses.value.map((v) => v.verse.number)
            ).toEqual([1, 3]);
            expect(state.selectedVerses.value[0]!.selectionX).toBe(10);

            select(2);
            expect(
                state.selectedVerses.value.map((v) => v.verse.number)
            ).toEqual([1]);

            await state.loadNextChapter();
            expect(state.selectedVerses.value).toEqual([]);
        });

        it('resolves a selected footnote to the verse that references it', async () => {
            const { state } = await createLoaded({
                initialTranslationId: 'BSB',
                initialBookId: 'GEN',
            });

            state.selectFootnote(0);

            expect(state.selectedFootnote.value?.note.text).toBe(
                'Footnote for Genesis 1:2.'
            );
            expect(state.selectedFootnote.value?.verse?.number).toBe(2);

            state.selectFootnote(42);
            expect(state.selectedFootnote.value).toBeNull();
        });
    });

    describe('decorations', () => {
        it('clears decorations on chapter change unless asked to keep them', async () => {
            const { state } = await createLoaded({
                initialTranslationId: 'BSB',
                initialBookId: 'GEN',
            });

            state.decorateVerses('GEN', 1, [2, 1, 2], { className: 'a' }, 'a');
            state.decorateVerses(
                'GEN',
                1,
                3,
                { className: 'b', preserveOnChapterChange: true },
                'b'
            );
            expect(state.decorations.value.map((d) => d.verses)).toEqual([
                [1, 2],
                [3],
            ]);

            await state.loadNextChapter();

            expect(state.decorations.value.map((d) => d.id)).toEqual(['b']);
        });

        it('replaces a decoration that reuses an ID', async () => {
            const { state } = await createLoaded({
                initialTranslationId: 'BSB',
                initialBookId: 'GEN',
            });

            state.decorateVerses('GEN', 1, 1, { className: 'old' }, 'same');
            state.decorateVerses('GEN', 1, 2, { className: 'new' }, 'same');

            expect(state.decorations.value).toHaveLength(1);
            expect(state.decorations.value[0]).toMatchObject({
                className: 'new',
                verses: [2],
            });
        });

        it('rejects a decoration with no valid verse numbers', async () => {
            const { state } = await createLoaded({
                initialTranslationId: 'BSB',
                initialBookId: 'GEN',
            });

            expect(() => state.decorateVerses('GEN', 1, [0, -1], {})).toThrow(
                'At least one valid verse number is required.'
            );
        });

        it('removes an emphasis after its timeout', async () => {
            const { state } = await createLoaded({
                initialTranslationId: 'BSB',
                initialBookId: 'GEN',
            });
            jest.useFakeTimers();

            emphasizeVerses(state, 'GEN', 1, 1, 3);
            expect(state.decorations.value[0]?.verses).toEqual([1, 2, 3]);

            jest.advanceTimersByTime(2999);
            expect(state.decorations.value).toHaveLength(1);
            jest.advanceTimersByTime(1);
            expect(state.decorations.value).toHaveLength(0);
        });
    });

    describe('dispose', () => {
        it('stops writing to its signals once disposed', async () => {
            server.hold('/GEN/1.json');
            const { state } = create({
                initialTranslationId: 'BSB',
                initialBookId: 'GEN',
            });
            await waitForCondition(() =>
                server.requests.some((url) => url.includes('/GEN/1.json'))
            );

            state.dispose();
            server.release('/GEN/1.json');
            await waitForCondition(() => state.loading.value === false);

            expect(state.disposed).toBe(true);
            expect(state.chapterData.value).toBeNull();
        });
    });
});

describe('getDefaultTranslationForLanguage()', () => {
    it.each([
        ['es', 'spa_onbv'],
        ['pt-BR', 'por_onbv'],
        ['ZH', 'cmn_cbt'],
        ['xx', 'AAB'],
        [undefined, 'AAB'],
    ])('picks %s → %s', (language, expected) => {
        expect(getDefaultTranslationForLanguage(language).id).toBe(expected);
    });
});
