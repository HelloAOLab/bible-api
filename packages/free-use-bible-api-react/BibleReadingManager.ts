import {
    batch,
    computed,
    effect,
    signal,
    untracked,
    type ReadonlySignal,
    type Signal,
} from '@preact/signals-core';
import type {
    ApiAvailableTranslations,
    ApiTranslation,
    ApiTranslationBook,
    ApiTranslationBookChapter,
    ApiTranslationBooks,
    ChapterFootnote,
    ChapterVerse,
} from 'free-use-bible-api';
import type { CSSProperties } from 'react';
import type { BibleDataManager } from './BibleDataManager.js';

export interface BibleSelectedVerse {
    /** Book identifier (for example: GEN, MAT). */
    bookId: string;
    /** 1-based chapter number in the selected book. */
    chapterNumber: number;
    /** Verse payload as returned in chapter content. */
    verse: ChapterVerse;
    /** Active translation ID at selection time. */
    translationId: string | null;
    /** Optional X coordinate for contextual menu/tooltip anchoring. */
    selectionX?: number;
    /** Optional Y coordinate for contextual menu/tooltip anchoring. */
    selectionY?: number;
    /** Epoch timestamp indicating when the verse was selected. */
    selectedAt?: number;
}

export interface SelectedFootnote {
    /** The selected footnote definition. */
    note: ChapterFootnote;
    /** Verse that contains the selected footnote reference, if found. */
    verse: ChapterVerse | null;
    /** Full chapter containing the selected footnote. */
    chapter: ApiTranslationBookChapter;
}

export interface VerseDecorationInput {
    /** Optional text fragment to target inside the verse content. */
    targetContent?: string;
    /** Optional character start index for range decorations. */
    startIndex?: number;
    /** Optional character end index for range decorations. */
    endIndex?: number;
    /** Optional CSS class to apply to the decorated verse/range. */
    className?: string;
    /** Optional CSS class to apply to the entire chapter container. */
    containerClassName?: string;
    /** Optional inline style to apply to the decorated verse/range. */
    style?: CSSProperties;
    /** Optional delay in milliseconds before this decoration auto-removes itself. */
    removeAfterMs?: number;
    /**
     * Whether to preserve the decoration when the chapter changes.
     * By default, decorations are cleared when the chapter changes.
     */
    preserveOnChapterChange?: boolean;
    /**
     * The ID of the translation that this decoration should be limited to.
     * If null or omitted, then the decoration applies to all translations.
     */
    translationId?: string | null;
}

export interface VerseDecoration extends VerseDecorationInput {
    /** Unique decoration identifier used for removal. */
    id: string;
    /** Translation ID this decoration applies to. Null targets every translation. */
    translationId: string | null;
    /** Book ID this decoration applies to. */
    bookId: string;
    /** Chapter number this decoration applies to. */
    chapterNumber: number;
    /** One or more verse numbers to decorate. */
    verses: number[];
}

/**
 * Where the reader is, independent of whether that chapter's text has been
 * downloaded yet. Kept deliberately separate from `ApiTranslationBookChapter` so
 * navigation can be answered from book metadata alone, with no network call.
 */
export interface ReadingPosition {
    translationId: string;
    bookId: string;
    chapterNumber: number;
}

/**
 * Reactive state for reading the Bible: where the reader is, the chapter text
 * for that position, and the actions that move them around.
 *
 * Loading starts as soon as the state is created. Observe `loading`/`error` and
 * read `chapterData`/`translationBooks` to know when content is ready.
 */
export interface BibleReadingState {
    /** The translation used when no `initialTranslationId` is given. */
    defaultTranslation: TranslationWithLanguage;
    /** Selected translation ID. */
    translationId: Signal<string>;
    /** Selected translation metadata, derived from `translationBooks`. */
    translation: ReadonlySignal<ApiTranslation | null>;
    /** Selected book ID (for example: GEN, JHN). */
    bookId: Signal<string | null>;
    /** Selected 1-based chapter number. */
    chapterNumber: Signal<number>;
    /** Every translation the data manager knows about. */
    availableTranslations: Signal<ApiAvailableTranslations | null>;
    /**
     * Books for the selected translation, or null when that translation's book
     * list has not been downloaded yet. Derived from the data manager's cache,
     * so it always agrees with `translationId`.
     */
    translationBooks: ReadonlySignal<ApiTranslationBooks | null>;
    /** Loaded chapter for the current translation/book/chapter. */
    chapterData: Signal<ApiTranslationBookChapter | null>;
    /** Active verse decorations for rendering. */
    decorations: ReadonlySignal<VerseDecoration[]>;
    /** Current multi-verse selection in the active chapter. */
    selectedVerses: Signal<BibleSelectedVerse[]>;
    /** Currently selected footnote with resolved verse/chapter context. */
    selectedFootnote: ReadonlySignal<SelectedFootnote | null>;
    /**
     * True while this reading state is waiting on a request.
     *
     * Note this does *not* gate navigation — the position signals move
     * immediately whether or not a request is outstanding. To ask "is the text on
     * screen the text for where I am?", use `isChapterContentStale`.
     */
    loading: ReadonlySignal<boolean>;
    /**
     * True when `chapterData` is not the chapter for the current position —
     * either nothing has loaded yet, or the reader has moved on and the new
     * chapter's text has not arrived. This is what a loading placeholder should
     * key off.
     */
    isChapterContentStale: ReadonlySignal<boolean>;
    /** Error message from the most recent failed operation, if any. */
    error: Signal<string | null>;
    /**
     * The translation the failed load in {@link error} was for, or null while
     * there's no error. Not always `translationId`: a translation switch only
     * moves the position once the new translation's book list arrives, so a
     * failed switch leaves `translationId` on the translation the reader was
     * already in.
     */
    failedTranslationId: ReadonlySignal<string | null>;
    /**
     * Re-runs the most recent load operation so a failed load can be retried
     * without the user losing their place.
     */
    retryLoad: () => Promise<void>;
    /**
     * True once the first chapter load has finished, whether or not it produced
     * content. Distinguishes "still loading" from "finished with nothing", which
     * `chapterData === null` on its own cannot.
     */
    initialChapterLoadSettled: ReadonlySignal<boolean>;
    /** Pending verse number to scroll to after chapter content renders. */
    scrollToVerse: Signal<number | null>;

    /**
     * Toggles a verse in the current selection.
     * If the verse is already selected, it is removed; otherwise it is added with
     * menu anchor coordinates and a timestamp.
     */
    selectVerse: (
        verse: BibleSelectedVerse,
        selectionX: number,
        selectionY: number
    ) => void;
    /** Clears all selected verses. */
    clearSelectedVerses: () => void;
    /** Selects a chapter footnote by note ID, or clears selection with `null`. */
    selectFootnote: (noteId: number | null) => void;

    /**
     * Adds a visual decoration to one or more verses and returns a decoration ID.
     *
     * @param bookId Book target for the decoration.
     * @param chapterNumber Chapter target for the decoration.
     * @param verses Single verse number or verse number list.
     * @param decoration Decoration style and targeting details.
     * @param id Optional explicit decoration ID. When omitted, a new unique ID is generated.
     * @returns Unique decoration ID used by `removeDecoration()`.
     */
    decorateVerses: (
        bookId: string,
        chapterNumber: number,
        verses: number | number[],
        decoration: VerseDecorationInput,
        id?: string
    ) => string;
    /** Removes a previously added decoration by ID. */
    removeDecoration: (decorationId: string) => void;

    /**
     * Selects a translation and loads its first available chapter.
     * Accepts either a translation ID or an endpoint URL (see
     * `BibleDataManager.buildTranslationId`).
     */
    selectTranslation: (translation: string) => Promise<void>;
    /**
     * Selects translation + book + chapter in one operation.
     * Accepts a translation ID or endpoint URL. A chapter outside the book falls
     * back to the book's first chapter.
     */
    selectTranslationAndChapter: (
        translationId: string,
        bookId: string,
        chapterNumber: number,
        options?: SelectTranslationAndChapterOptions
    ) => Promise<void>;
    /** Selects a book and loads its first chapter in the active translation. */
    selectBook: (book: string) => Promise<void>;
    /** Selects and loads an explicit chapter in the active translation. */
    selectChapter: (book: string, chapter: number) => Promise<void>;
    /** Moves to the previous chapter, crossing into the previous book if needed. */
    loadPreviousChapter: () => Promise<void>;
    /** Moves to the next chapter, crossing into the next book if needed. */
    loadNextChapter: () => Promise<void>;

    /** True when there is a next chapter to navigate to. */
    hasNext: ReadonlySignal<boolean>;
    /** True when there is a previous chapter to navigate to. */
    hasPrevious: ReadonlySignal<boolean>;
    /**
     * Where "next" leads, for anything that needs to *name* the destination
     * rather than just move there (a link, say). Null at the end of the Bible
     * and before the book list has loaded — the target is only discoverable by
     * fetching then. Callers should fall back to `loadNextChapter()`.
     */
    nextChapterPosition: ReadonlySignal<ReadingPosition | null>;
    /** Where "previous" leads. See {@link nextChapterPosition}. */
    previousChapterPosition: ReadonlySignal<ReadingPosition | null>;
    /**
     * The chapter `loadNextChapter`/`loadPreviousChapter` would move to, fetched
     * without moving there — for callers that render the neighbouring chapter
     * ahead of time. `null` when there is nothing to show.
     */
    getAdjacentChapter: (
        direction: 'next' | 'previous'
    ) => Promise<ApiTranslationBookChapter | null>;

    /** "Genesis 1", or empty while no book is resolvable yet. */
    title: ReadonlySignal<string>;
    /** "GEN 1", or empty while no book is selected. */
    shortTitle: ReadonlySignal<string>;
    /** The translation's name. */
    subTitle: ReadonlySignal<string>;
    /** The translation's short name (e.g. "BSB"). */
    shortSubTitle: ReadonlySignal<string>;

    /** True once `dispose()` has been called. */
    readonly disposed: boolean;
    /**
     * Stops loading content and clears pending decoration timers. A disposed
     * state never writes to its signals again.
     */
    dispose: () => void;
}

export interface TranslationWithLanguage {
    id: string;
    language: string;
}

/**
 * The translation Seed Bible opens for each UI language, keyed by the
 * language's ISO 639-1 code (or the code the app uses for it).
 */
export const DEFAULT_TRANSLATIONS_BY_LANGUAGE = new Map<
    string,
    TranslationWithLanguage
>([
    ['am', { id: 'amh_amh', language: 'amh' }], // Amharic NT | መጽሐፍ ቅዱስ
    ['ar', { id: 'ARBNAV', language: 'arb' }], // New Arabic Version (Book of Life) | كتاب الحياة
    ['bn', { id: 'ben_ocv', language: 'ben' }], // Open Bengali Contemporary Version Bible
    ['en', { id: 'AAB', language: 'eng' }], // AAB | Ancients Accessible Bible
    ['es', { id: 'spa_onbv', language: 'spa' }], // Spanish ONBV | Biblica® Open Nueva Biblia Viva 2008
    ['fa', { id: 'pes_opcb', language: 'pes' }], // Open Persian Contemporary Bible
    ['fr', { id: 'fra_ncl', language: 'fra' }], // French néo-Crampon Libre
    ['hi', { id: 'hin_cvb', language: 'hin' }], // Hindi Contemporary Version Bible
    ['ind', { id: 'ind_ayt', language: 'ind' }], // Indonesian AYT Bible | Alkitab Yang Terbuka
    ['ja', { id: 'jpn_loc', language: 'jpn' }], // New Japanese NT
    ['ko', { id: 'kor_old', language: 'kor' }], // Korean Bible 1910
    ['ne', { id: 'npi_ncb', language: 'npi' }], // Nepali Contemporary Bible
    ['pt', { id: 'por_onbv', language: 'por' }], // Portuguese ONBV | Biblica® Open Nova Bíblia Viva 2007
    ['ru', { id: 'rus_syn', language: 'rus' }], // Russian Synodal Bible
    ['sw', { id: 'swh_onmm', language: 'swh' }], // Swahili ONMM
    ['tr', { id: 'tur_ytc', language: 'tur' }], // Turkish TVR Bible | Kutsal Kitap Yeni Çeviri
    ['ug', { id: 'uig_ara', language: 'uig' }], // Uyghur Bible (arabic script)
    ['uk', { id: 'ukr_ufb', language: 'ukr' }], // Ukrainian Freedom Bible
    ['ur', { id: 'urd_oucv', language: 'urd' }], // Urdu Contemporary Version
    ['vi', { id: 'vie_vcb', language: 'vie' }], // Vietnamese Contemporary Bible
    ['zh', { id: 'cmn_cbt', language: 'cmn' }], // Chinese, Mandarin: Biblica® 聖經,當代譯本開放資源
]);

const FALLBACK_TRANSLATION: TranslationWithLanguage = {
    id: 'AAB',
    language: 'eng',
};

/**
 * The default translation for a language code such as `es` or `pt-BR`.
 * Falls back to English when the language has no default.
 */
export function getDefaultTranslationForLanguage(
    language: string | null | undefined
): TranslationWithLanguage {
    if (!language) {
        return FALLBACK_TRANSLATION;
    }
    const normalized = language.toLowerCase();
    return (
        DEFAULT_TRANSLATIONS_BY_LANGUAGE.get(normalized) ??
        DEFAULT_TRANSLATIONS_BY_LANGUAGE.get(normalized.split(/[-_]/)[0]!) ??
        FALLBACK_TRANSLATION
    );
}

export const DEFAULT_BOOK_ID = 'GEN';
export const DEFAULT_CHAPTER_NUMBER = 1;

export interface BibleReadingOptions {
    /**
     * The translation to open: a translation ID, a `books.json` URL on another
     * endpoint, or an endpoint's `available_translations.json` URL (which opens
     * that endpoint's first translation). Defaults to the `language`'s default
     * translation.
     */
    initialTranslationId?: string | null;
    /** The book to open. Defaults to the translation's first book. */
    initialBookId?: string | null;
    /** The chapter to open. Defaults to the book's first chapter. */
    initialChapterNumber?: number | null;
    /**
     * The verse to scroll to after the initial chapter loads. Ignored when it
     * isn't a verse in that chapter.
     */
    scrollToVerse?: number;
    /**
     * Language code used to pick a default translation when
     * `initialTranslationId` is omitted. Defaults to English.
     */
    language?: string;
}

export interface SelectTranslationAndChapterOptions {
    /**
     * The verse to scroll to after the chapter loads. Ignored when it isn't a
     * verse in that chapter.
     */
    scrollToVerse?: number;
}

/** Stable string form of a position, for use as a Map key. */
export function positionKey(position: ReadingPosition): string {
    return `${position.translationId}/${position.bookId}/${position.chapterNumber}`;
}

export function positionsEqual(
    a: ReadingPosition | null,
    b: ReadingPosition | null
): boolean {
    if (!a || !b) {
        return a === b;
    }
    return (
        a.translationId === b.translationId &&
        a.bookId === b.bookId &&
        a.chapterNumber === b.chapterNumber
    );
}

function firstChapterOf(book: ApiTranslationBook): number {
    return book.firstChapterNumber ?? 1;
}

/**
 * The book's last chapter number, derived from `firstChapterNumber` plus
 * `numberOfChapters` so that `resolveChapterInBook` and `nextPosition` agree
 * even if a book list reports the two inconsistently. `lastChapterNumber` is
 * only used when the chapter count is missing or nonsensical.
 */
function lastChapterOf(book: ApiTranslationBook): number {
    const first = firstChapterOf(book);
    const count = book.numberOfChapters;
    if (Number.isFinite(count) && count > 0) {
        return first + count - 1;
    }
    const last = book.lastChapterNumber;
    return Number.isFinite(last) && last >= first ? last : first;
}

/**
 * Resolves a requested chapter number against a book: the request is honoured
 * when it falls inside the book, and otherwise falls back to the book's first
 * chapter. Note this is a fallback rather than a clamp — asking for chapter
 * 99999 of Genesis lands on Genesis 1, not Genesis 50.
 */
export function resolveChapterInBook(
    book: ApiTranslationBook,
    chapterNumber: number
): number {
    const first = firstChapterOf(book);
    const last = lastChapterOf(book);
    return chapterNumber >= first && chapterNumber <= last
        ? chapterNumber
        : first;
}

/**
 * The book immediately before or after `currentBookId` in canonical order.
 *
 * `order` is neither contiguous (a translation that omits books leaves gaps)
 * nor guaranteed to match the array's own ordering, so this picks the nearest
 * `order` in the requested direction rather than indexing into the array.
 */
function adjacentBook(
    books: ApiTranslationBooks,
    currentBookId: string,
    direction: 1 | -1
): ApiTranslationBook | null {
    const current = books.books.find((book) => book.id === currentBookId);
    if (!current) {
        return null;
    }

    let nearest: ApiTranslationBook | null = null;
    for (const book of books.books) {
        if (book.id === current.id) {
            continue;
        }
        const isAhead =
            direction === 1
                ? book.order > current.order
                : book.order < current.order;
        if (!isAhead) {
            continue;
        }
        const isNearer =
            !nearest ||
            (direction === 1
                ? book.order < nearest.order
                : book.order > nearest.order);
        if (isNearer) {
            nearest = book;
        }
    }
    return nearest;
}

/**
 * The chapter after `position`, or null when there is none (the last chapter of
 * the last book). Crossing a book boundary lands on the next book's first
 * chapter. Returns null when the book is not in this translation.
 */
export function nextPosition(
    books: ApiTranslationBooks,
    position: ReadingPosition
): ReadingPosition | null {
    const book = books.books.find((entry) => entry.id === position.bookId);
    if (!book) {
        return null;
    }

    if (position.chapterNumber < lastChapterOf(book)) {
        return { ...position, chapterNumber: position.chapterNumber + 1 };
    }

    const next = adjacentBook(books, position.bookId, 1);
    if (!next) {
        return null;
    }
    return {
        ...position,
        bookId: next.id,
        chapterNumber: firstChapterOf(next),
    };
}

/**
 * The chapter before `position`, or null when there is none (the first chapter
 * of the first book). Crossing a book boundary lands on the previous book's
 * last chapter.
 */
export function previousPosition(
    books: ApiTranslationBooks,
    position: ReadingPosition
): ReadingPosition | null {
    const book = books.books.find((entry) => entry.id === position.bookId);
    if (!book) {
        return null;
    }

    if (position.chapterNumber > firstChapterOf(book)) {
        return { ...position, chapterNumber: position.chapterNumber - 1 };
    }

    const previous = adjacentBook(books, position.bookId, -1);
    if (!previous) {
        return null;
    }
    return {
        ...position,
        bookId: previous.id,
        chapterNumber: lastChapterOf(previous),
    };
}

/**
 * Briefly emphasizes a range of verses (for example after following a
 * reference), fading after 3 seconds.
 */
export function emphasizeVerses(
    readingState: BibleReadingState,
    bookId: string,
    chapterNumber: number,
    firstVerse: number,
    lastVerse: number = firstVerse
): string {
    const verses: number[] = [];
    for (let verse = firstVerse; verse <= lastVerse; verse += 1) {
        verses.push(verse);
    }
    return readingState.decorateVerses(bookId, chapterNumber, verses, {
        className: 'fuba-verse-decoration-diminish',
        containerClassName: 'fuba-chapter-decoration-diminish',
        removeAfterMs: 3000,
    });
}

function normalizeDecorationVerses(verses: number | number[]): number[] {
    const verseNumbers = Array.isArray(verses) ? verses : [verses];
    const normalized = Array.from(
        new Set(
            verseNumbers.filter(
                (verseNumber) =>
                    Number.isInteger(verseNumber) && verseNumber > 0
            )
        )
    ).sort((left, right) => left - right);

    if (normalized.length === 0) {
        throw new Error('At least one valid verse number is required.');
    }

    return normalized;
}

let decorationIdCounter = 0;
function newDecorationId(): string {
    decorationIdCounter += 1;
    return `decoration-${Date.now().toString(36)}-${decorationIdCounter}`;
}

const AVAILABLE_TRANSLATIONS_PATH = '/api/available_translations.json';

interface ParsedTranslationInput {
    endpoint: string | null;
    translationId: string | null;
    preferFirstAvailableTranslation: boolean;
    fallbackToFirstAvailableWhenMissing: boolean;
}

/**
 * Splits a translation input into an endpoint and a translation ID. Accepts a
 * bare ID, a `.../api/{id}/books.json` URL, or a
 * `.../api/available_translations.json` URL.
 */
function parseTranslationInput(value?: string | null): ParsedTranslationInput {
    const plainId = (translationId: string | null): ParsedTranslationInput => ({
        endpoint: null,
        translationId,
        preferFirstAvailableTranslation: false,
        fallbackToFirstAvailableWhenMissing: false,
    });

    if (!value) {
        return plainId(null);
    }

    let url: URL;
    try {
        url = new URL(value);
    } catch {
        return plainId(value);
    }

    const normalizedPathname = url.pathname.replace(/\/+$/, '');
    if (normalizedPathname.endsWith(AVAILABLE_TRANSLATIONS_PATH)) {
        const endpointPath = normalizedPathname.slice(
            0,
            -AVAILABLE_TRANSLATIONS_PATH.length
        );
        return {
            endpoint: `${url.protocol}//${url.host}${endpointPath}/`,
            translationId: null,
            preferFirstAvailableTranslation: true,
            fallbackToFirstAvailableWhenMissing: true,
        };
    }

    const booksPathMatch = normalizedPathname.match(
        /^(.*)\/api\/([^/]+)\/books\.json$/
    );
    if (!booksPathMatch || !booksPathMatch[2]) {
        return plainId(value);
    }
    return {
        endpoint: `${url.protocol}//${url.host}${booksPathMatch[1] || ''}/`,
        translationId: decodeURIComponent(booksPathMatch[2]),
        preferFirstAvailableTranslation: false,
        fallbackToFirstAvailableWhenMissing: true,
    };
}

export function createBibleReadingState(
    dataManager: BibleDataManager,
    options: BibleReadingOptions = {}
): BibleReadingState {
    const isSameSelectedVerse = (
        left: BibleSelectedVerse,
        right: BibleSelectedVerse
    ) => {
        return (
            left.bookId === right.bookId &&
            left.chapterNumber === right.chapterNumber &&
            left.verse.number === right.verse.number
        );
    };

    const initialTranslationInput = parseTranslationInput(
        options.initialTranslationId
    );
    const shouldFallbackToFirstAvailableTranslation =
        initialTranslationInput.fallbackToFirstAvailableWhenMissing;

    const normalizedInitialChapterNumber =
        typeof options.initialChapterNumber === 'number' &&
        Number.isFinite(options.initialChapterNumber) &&
        options.initialChapterNumber > 0
            ? Math.floor(options.initialChapterNumber)
            : DEFAULT_CHAPTER_NUMBER;

    const defaultTranslation = getDefaultTranslationForLanguage(
        options.language
    );

    const translationId = signal<string>(
        initialTranslationInput.translationId ?? defaultTranslation.id
    );
    const useFirstAvailableTranslation = signal<boolean>(
        initialTranslationInput.preferFirstAvailableTranslation
    );
    const endpointOverride = signal<string | null>(
        initialTranslationInput.endpoint
    );
    const bookId = signal<string | null>(options.initialBookId ?? null);
    const chapterNumber = signal<number>(normalizedInitialChapterNumber);
    const availableTranslations = signal<ApiAvailableTranslations | null>(null);
    // Derived from the data manager's cache rather than stored locally, so the
    // book list always matches `translationId` — including the instant it
    // changes. A stored copy refreshed only after a chapter loaded would
    // describe the *previous* translation in between (wrong chapter counts, and
    // a stale text direction for right-to-left translations).
    const translationBooks = computed<ApiTranslationBooks | null>(
        () =>
            dataManager.translationBooks.value.get(translationId.value) ?? null
    );
    const translation = computed(
        () => translationBooks.value?.translation ?? null
    );
    const chapterData = signal<ApiTranslationBookChapter | null>(null);
    const initialChapterLoadSettled = signal<boolean>(false);
    const selectedVerses = signal<BibleSelectedVerse[]>([]);
    const selectedFootnoteId = signal<number | null>(null);
    const decorations = signal<VerseDecoration[]>([]);
    const decorationRemovalTimers = new Map<
        string,
        ReturnType<typeof setTimeout>
    >();

    /**
     * How many requests this reading state is currently waiting on. `loading`
     * is derived from this rather than assigned, so overlapping navigations
     * can't have one finishing request clear the flag while another is still in
     * the air.
     */
    const inFlightCount = signal<number>(0);
    const beginRequest = () => {
        inFlightCount.value = inFlightCount.peek() + 1;
    };
    const endRequest = () => {
        inFlightCount.value = inFlightCount.peek() - 1;
    };
    const loading = computed<boolean>(() => inFlightCount.value > 0);
    const error = signal<string | null>(null);
    // Written alongside `error` by `failLoad`, and only read while an error is
    // up — so every path that clears `error` clears this too.
    const lastFailedTranslationId = signal<string | null>(null);
    const failedTranslationId = computed(() =>
        error.value ? lastFailedTranslationId.value : null
    );
    const scrollToVerse = signal<number | null>(null);

    let disposed = false;
    const effectDisposers: Array<() => void> = [];

    /** Records a failed load, and which translation it was for. */
    const failLoad = (
        err: unknown,
        fallbackMessage: string,
        attemptedTranslationId: string
    ) => {
        if (disposed) {
            return;
        }
        batch(() => {
            lastFailedTranslationId.value = attemptedTranslationId;
            error.value = err instanceof Error ? err.message : fallbackMessage;
        });
    };

    const resolveCurrentBook = () => {
        // The book list first: it is keyed on `bookId`, which moves the instant
        // the reader navigates, whereas `chapterData` still describes the
        // chapter they left until its replacement downloads.
        const catalogBook = translationBooks.value?.books.find(
            (b) => b.id === bookId.value
        );
        return catalogBook ?? chapterData.value?.book;
    };

    const title = computed<string>(() => {
        const book = resolveCurrentBook();
        const bookName = book?.name ?? book?.commonName ?? bookId.value;
        if (!bookName) {
            return '';
        }
        return `${bookName} ${chapterNumber.value}`;
    });
    const shortTitle = computed<string>(() => {
        const id = bookId.value;
        return id ? `${id} ${chapterNumber.value}` : '';
    });
    const subTitle = computed<string>(
        () =>
            translation.value?.name ?? chapterData.value?.translation.name ?? ''
    );
    const shortSubTitle = computed<string>(
        () =>
            translation.value?.shortName ??
            chapterData.value?.translation.shortName ??
            ''
    );

    const selectedFootnote = computed<SelectedFootnote | null>(() => {
        const chapter = chapterData.value;
        const noteId = selectedFootnoteId.value;
        if (!chapter || noteId === null) {
            return null;
        }

        const note =
            chapter.chapter.footnotes.find((note) => note.noteId === noteId) ??
            null;
        if (!note) {
            return null;
        }

        const verse =
            chapter.chapter.content.find(
                (item): item is ChapterVerse & { type: 'verse' } =>
                    item.type === 'verse' &&
                    item.content.some(
                        (contentPart) =>
                            typeof contentPart === 'object' &&
                            'noteId' in contentPart &&
                            contentPart.noteId === noteId
                    )
            ) ?? null;
        return { note, chapter, verse };
    });

    const decorationMatchesState = (decoration: VerseDecoration): boolean => {
        if (
            decoration.translationId &&
            decoration.translationId !== translationId.value
        ) {
            return false;
        }
        return (
            decoration.bookId === bookId.value &&
            decoration.chapterNumber === chapterNumber.value
        );
    };

    const selectVerse = (
        verse: BibleSelectedVerse,
        selectionX: number,
        selectionY: number
    ) => {
        const isSelected = selectedVerses.value.some((item) =>
            isSameSelectedVerse(item, verse)
        );

        if (isSelected) {
            selectedVerses.value = selectedVerses.value.filter(
                (item) => !isSameSelectedVerse(item, verse)
            );
            return;
        }

        const selectedVerse: BibleSelectedVerse = {
            ...verse,
            selectionX,
            selectionY,
            selectedAt: Date.now(),
        };

        selectedVerses.value = [...selectedVerses.value, selectedVerse].sort(
            (left, right) => left.verse.number - right.verse.number
        );
    };

    const clearSelectedVerses = () => {
        selectedVerses.value = [];
    };

    const getActiveEndpoint = () => endpointOverride.value ?? undefined;

    const refreshAvailableTranslations = () => {
        availableTranslations.value = {
            translations: dataManager.availableTranslations.value,
        };
    };

    const resolveTranslationInput = async (input: string): Promise<string> => {
        const parsedInput = parseTranslationInput(input);
        if (!parsedInput.endpoint) {
            return parsedInput.translationId ?? input;
        }

        endpointOverride.value = parsedInput.endpoint;

        const endpointTranslations = await dataManager.getTranslations(
            parsedInput.endpoint
        );
        refreshAvailableTranslations();

        const firstTranslation = endpointTranslations[0];
        if (!firstTranslation) {
            throw new Error('No available translations found for endpoint.');
        }

        if (
            parsedInput.preferFirstAvailableTranslation ||
            !parsedInput.translationId
        ) {
            return firstTranslation.id;
        }

        const requestedTranslation = endpointTranslations.find(
            (translation) => translation.id === parsedInput.translationId
        );
        if (requestedTranslation) {
            return requestedTranslation.id;
        }

        if (parsedInput.fallbackToFirstAvailableWhenMissing) {
            return firstTranslation.id;
        }

        throw new Error(
            `Translation with ID "${parsedInput.translationId}" not available.`
        );
    };

    /**
     * A verse to scroll to once content for a specific position arrives.
     *
     * Held here rather than published straight to `scrollToVerse` because the
     * request is made when navigation *starts* but is only meaningful once the
     * matching chapter has rendered. Publishing it early would scroll whichever
     * chapter is currently on screen.
     *
     * Seeded from `options.scrollToVerse` because the loader starts fetching the
     * initial position immediately, and can finish before `loadInitialData`
     * gets round to recording the target itself.
     */
    let pendingScrollTarget: (ReadingPosition & { verse: number }) | null =
        (() => {
            const initialBookId = bookId.peek();
            const verse = options.scrollToVerse;
            if (!initialBookId || verse === undefined) {
                return null;
            }
            return {
                translationId: translationId.peek(),
                bookId: initialBookId,
                chapterNumber: chapterNumber.peek(),
                verse,
            };
        })();

    /**
     * Bumped for every content request. Only the newest generation is allowed to
     * write `chapterData`, so a slow request for a chapter the reader has already
     * skimmed past can never overwrite where they actually are.
     */
    let loadGeneration = 0;

    /**
     * Bumped to make the loader effect re-run for a position that has *not*
     * changed. Re-applying the same position writes no new signal value, so
     * without this a failed load would be unretryable.
     */
    const contentRetryNonce = signal(0);

    /** Callers waiting for content to arrive, keyed by `positionKey`. */
    const contentWaiters = new Map<string, Array<() => void>>();

    /** The position the open content request is for, if any. */
    let openContentRequestPosition: ReadingPosition | null = null;

    /** Where the reader is right now, or null before a book has been resolved. */
    const currentPosition = (): ReadingPosition | null => {
        const currentBookId = bookId.peek();
        if (!currentBookId) {
            return null;
        }
        return {
            translationId: translationId.peek(),
            bookId: currentBookId,
            chapterNumber: chapterNumber.peek(),
        };
    };

    const chapterMatchesPosition = (
        chapter: ApiTranslationBookChapter | null,
        position: ReadingPosition
    ): boolean =>
        !!chapter &&
        chapter.translation.id === position.translationId &&
        chapter.book.id === position.bookId &&
        chapter.chapter.number === position.chapterNumber;

    const isChapterContentStale = computed<boolean>(() => {
        const currentBookId = bookId.value;
        if (!currentBookId) {
            return true;
        }
        return !chapterMatchesPosition(chapterData.value, {
            translationId: translationId.value,
            bookId: currentBookId,
            chapterNumber: chapterNumber.value,
        });
    });

    const settleContentWaiters = (key: string) => {
        const waiters = contentWaiters.get(key);
        if (!waiters) {
            return;
        }
        contentWaiters.delete(key);
        for (const resolve of waiters) {
            resolve();
        }
    };

    /**
     * Resolves once the given position has its content — or as soon as it is
     * clear it never will, because the reader has already moved somewhere else.
     * This is what lets the navigation methods' promises mean "the chapter is
     * ready" even though the position signals move immediately.
     */
    const whenContentSettled = (position: ReadingPosition): Promise<void> => {
        if (chapterMatchesPosition(chapterData.peek(), position)) {
            return Promise.resolve();
        }
        if (disposed || !positionsEqual(position, currentPosition())) {
            return Promise.resolve();
        }
        const key = positionKey(position);
        return new Promise<void>((resolve) => {
            const waiters = contentWaiters.get(key);
            if (waiters) {
                waiters.push(resolve);
            } else {
                contentWaiters.set(key, [resolve]);
            }
        });
    };

    /**
     * Commits the chapter text for a position that has already been applied.
     *
     * `scrollToVerse` is published in the same batch as `chapterData`, so a
     * consumer never observes a scroll target against the wrong chapter.
     */
    const applyChapterContent = (chapter: ApiTranslationBookChapter) => {
        batch(() => {
            chapterData.value = chapter;
            initialChapterLoadSettled.value = true;
            error.value = null;

            const target = pendingScrollTarget;
            const targetMatchesChapter =
                !!target &&
                target.translationId === chapter.translation.id &&
                target.bookId === chapter.book.id &&
                target.chapterNumber === chapter.chapter.number;
            scrollToVerse.value = targetMatchesChapter ? target.verse : null;
            pendingScrollTarget = null;
        });
    };

    const removeDecorationTimer = (decorationId: string) => {
        const timer = decorationRemovalTimers.get(decorationId);
        if (timer) {
            clearTimeout(timer);
            decorationRemovalTimers.delete(decorationId);
        }
    };

    /**
     * Commits where the reader is: the position signals plus everything keyed to
     * a position (decorations, selection, footnote).
     *
     * Deliberately synchronous and free of any content dependency, so it runs
     * the moment navigation is requested rather than after a chapter downloads.
     */
    const applyPosition = (
        next: ReadingPosition,
        applyOptions?: {
            scrollToVerse?: number | null;
            /** Content already in hand for this position, so nothing is fetched. */
            content?: ApiTranslationBookChapter;
        }
    ) => {
        if (disposed) {
            return;
        }
        const didPositionChange =
            translationId.peek() !== next.translationId ||
            bookId.peek() !== next.bookId ||
            chapterNumber.peek() !== next.chapterNumber;
        const scrollToVerseRequest = applyOptions?.scrollToVerse ?? null;

        batch(() => {
            translationId.value = next.translationId;
            bookId.value = next.bookId;
            chapterNumber.value = next.chapterNumber;
            selectedFootnoteId.value = null;

            // Has to come after the position writes above, since
            // `decorationMatchesState` judges against the new position.
            const kept: VerseDecoration[] = [];
            for (const decoration of decorations.value) {
                if (
                    decoration.preserveOnChapterChange ||
                    decorationMatchesState(decoration)
                ) {
                    kept.push(decoration);
                } else {
                    removeDecorationTimer(decoration.id);
                }
            }
            decorations.value = kept;
            clearSelectedVerses();

            pendingScrollTarget =
                scrollToVerseRequest === null
                    ? null
                    : { ...next, verse: scrollToVerseRequest };

            if (applyOptions?.content) {
                // Supersede any request already in the air before committing, so
                // a slower fetch can't land on top of the content we were handed.
                loadGeneration += 1;
                applyChapterContent(applyOptions.content);
            } else if (
                !didPositionChange &&
                chapterMatchesPosition(chapterData.peek(), next)
            ) {
                // Already showing this chapter, so the loader has nothing to
                // fetch and will never publish the scroll target. Do it here.
                if (scrollToVerseRequest !== null) {
                    pendingScrollTarget = null;
                    scrollToVerse.value = scrollToVerseRequest;
                }
            } else if (
                !didPositionChange &&
                !positionsEqual(openContentRequestPosition, next)
            ) {
                // Same position, but its text is missing and nothing is fetching
                // it (the last attempt failed). Nudge the loader explicitly.
                contentRetryNonce.value = contentRetryNonce.peek() + 1;
            }
        });

        // Anything still waiting on a different position is never going to get
        // content now — release those callers rather than leaving them hanging.
        const nextKey = positionKey(next);
        for (const key of Array.from(contentWaiters.keys())) {
            if (key !== nextKey) {
                settleContentWaiters(key);
            }
        }
    };

    /**
     * Fetches the chapter for a position and commits it — but only if it is still
     * the newest request when it lands.
     */
    const requestContent = async (
        position: ReadingPosition,
        generation: number
    ) => {
        beginRequest();

        // Warm this translation's book list without blocking the text on it. It
        // supplies the book name and next/previous availability.
        void dataManager
            .getTranslationBooks(position.translationId)
            .catch(() => {
                // The chapter request below surfaces the failure.
            });

        openContentRequestPosition = position;
        try {
            const chapter = await dataManager.getTranslationBookChapter(
                position.translationId,
                position.bookId,
                position.chapterNumber
            );
            if (disposed || generation !== loadGeneration) {
                return;
            }
            applyChapterContent(chapter);
        } catch (err) {
            if (disposed || generation !== loadGeneration) {
                return;
            }
            failLoad(err, 'Failed to load chapter.', position.translationId);
        } finally {
            if (positionsEqual(openContentRequestPosition, position)) {
                openContentRequestPosition = null;
            }
            endRequest();
            settleContentWaiters(positionKey(position));
        }
    };

    // The single owner of chapter loading. Navigation writes a position and
    // returns; this notices and fetches the matching text. Every route into a
    // new position gets content this way — including direct writes to the
    // position signals.
    effectDisposers.push(
        effect(() => {
            // The only tracked reads. Subscribing to the book list here would make
            // the effect re-run (and refetch) when the list lands.
            const nextTranslationId = translationId.value;
            const nextBookId = bookId.value;
            const nextChapterNumber = chapterNumber.value;
            void contentRetryNonce.value;

            untracked(() => {
                if (disposed || !nextBookId) {
                    return;
                }
                const position: ReadingPosition = {
                    translationId: nextTranslationId,
                    bookId: nextBookId,
                    chapterNumber: nextChapterNumber,
                };

                // The reader is moving (or retrying), so whatever failed before
                // is not what they are looking at any more.
                error.value = null;

                if (chapterMatchesPosition(chapterData.peek(), position)) {
                    settleContentWaiters(positionKey(position));
                    return;
                }
                loadGeneration += 1;
                void requestContent(position, loadGeneration);
            });
        })
    );

    const removeDecoration = (decorationId: string) => {
        removeDecorationTimer(decorationId);
        decorations.value = decorations
            .peek()
            .filter((decoration) => decoration.id !== decorationId);
    };

    const decorateVerses = (
        decorationBookId: string,
        decorationChapterNumber: number,
        verses: number | number[],
        decoration: VerseDecorationInput,
        id: string = newDecorationId()
    ): string => {
        removeDecorationTimer(id);

        const nextDecoration: VerseDecoration = {
            ...decoration,
            id,
            bookId: decorationBookId,
            chapterNumber: decorationChapterNumber,
            verses: normalizeDecorationVerses(verses),
            translationId: decoration.translationId ?? null,
        };

        const current = decorations.peek();
        const existingIndex = current.findIndex((entry) => entry.id === id);
        decorations.value =
            existingIndex >= 0
                ? current.map((entry, index) =>
                      index === existingIndex ? nextDecoration : entry
                  )
                : [...current, nextDecoration];

        const removeAfterMs = nextDecoration.removeAfterMs;
        if (
            typeof removeAfterMs === 'number' &&
            Number.isFinite(removeAfterMs) &&
            removeAfterMs > 0
        ) {
            decorationRemovalTimers.set(
                id,
                setTimeout(() => removeDecoration(id), removeAfterMs)
            );
        }

        return id;
    };

    /**
     * The load that is currently in flight (or was the last one to run), kept so
     * `retryLoad()` can repeat exactly what failed.
     */
    let lastLoadAttempt: (() => Promise<void>) | null = null;

    /**
     * Fallback for when this translation's book list hasn't downloaded: follows
     * the loaded chapter's own next/previous link instead of computing the
     * target from book metadata. Slower — the position can only move once the
     * request lands — but `hasNext`/`hasPrevious` fall back to these same links,
     * so without this the buttons would be enabled and do nothing.
     */
    const navigateByChapterLink = async (
        direction: 'next' | 'previous',
        from: ReadingPosition
    ) => {
        const chapter = chapterData.peek();
        if (!chapter || !chapterMatchesPosition(chapter, from)) {
            return;
        }

        lastLoadAttempt = () => navigateByChapterLink(direction, from);

        beginRequest();
        // Captured, not bumped: superseding here would strand the request already
        // fetching the current position if this one fails.
        const generation = loadGeneration;
        try {
            const adjacent =
                direction === 'next'
                    ? await dataManager.getNextChapter(chapter)
                    : await dataManager.getPreviousChapter(chapter);
            if (disposed || generation !== loadGeneration || !adjacent) {
                return;
            }
            applyPosition(
                {
                    translationId: adjacent.translation.id,
                    bookId: adjacent.book.id,
                    chapterNumber: adjacent.chapter.number,
                },
                { content: adjacent }
            );
        } catch (err) {
            if (disposed || generation !== loadGeneration) {
                return;
            }
            failLoad(err, 'Failed to load chapter.', from.translationId);
        } finally {
            endRequest();
        }
    };

    /**
     * Moves one chapter forward or back. The position write is synchronous, so
     * pressing next repeatedly advances a chapter per press instead of
     * recomputing the same target while a request is in flight.
     */
    const navigateAdjacent = async (direction: 'next' | 'previous') => {
        const from = currentPosition();
        if (!from) {
            return;
        }
        const books = dataManager.getCachedTranslationBooks(from.translationId);
        if (!books) {
            await navigateByChapterLink(direction, from);
            return;
        }

        const target =
            direction === 'next'
                ? nextPosition(books, from)
                : previousPosition(books, from);
        if (!target) {
            return;
        }

        lastLoadAttempt = () => {
            applyPosition(target);
            return whenContentSettled(target);
        };
        applyPosition(target);
        await whenContentSettled(target);
    };

    const loadNextChapter = () => navigateAdjacent('next');
    const loadPreviousChapter = () => navigateAdjacent('previous');

    const selectTranslation = async (input: string) => {
        lastLoadAttempt = () => selectTranslation(input);
        beginRequest();
        let attemptedTranslationId = input;
        try {
            const nextTranslationId = await resolveTranslationInput(input);
            attemptedTranslationId = nextTranslationId;

            const books =
                await dataManager.getTranslationBooks(nextTranslationId);
            const firstBook = books.books[0];
            if (!firstBook) {
                throw new Error('No books available for selected translation.');
            }
            refreshAvailableTranslations();

            // Written only once the book list has resolved, because until then
            // there is no way to know which book this translation starts with.
            const target: ReadingPosition = {
                translationId: nextTranslationId,
                bookId: firstBook.id,
                chapterNumber: firstChapterOf(firstBook),
            };
            applyPosition(target);
            await whenContentSettled(target);
        } catch (err) {
            failLoad(
                err,
                'Failed to select translation.',
                attemptedTranslationId
            );
        } finally {
            endRequest();
        }
    };

    const selectBook = async (book: string) => {
        const activeTranslationId = translationId.peek();
        const books =
            dataManager.getCachedTranslationBooks(activeTranslationId);
        const selectedBook = books?.books.find((entry) => entry.id === book);
        if (!selectedBook) {
            return;
        }

        lastLoadAttempt = () => selectBook(book);
        const target: ReadingPosition = {
            translationId: activeTranslationId,
            bookId: book,
            chapterNumber: firstChapterOf(selectedBook),
        };
        applyPosition(target);
        await whenContentSettled(target);
    };

    const selectTranslationAndChapter = async (
        nextTranslationIdOrUrl: string,
        nextBookId: string,
        nextChapterNumber: number,
        selectOptions?: SelectTranslationAndChapterOptions
    ) => {
        // Rolled back below only when this translation does not contain the
        // book: that miss can never succeed, so retrying it would be pointless.
        const previousAttempt = lastLoadAttempt;
        lastLoadAttempt = () =>
            selectTranslationAndChapter(
                nextTranslationIdOrUrl,
                nextBookId,
                nextChapterNumber,
                selectOptions
            );
        beginRequest();
        let attemptedTranslationId = nextTranslationIdOrUrl;
        try {
            const nextTranslationId = await resolveTranslationInput(
                nextTranslationIdOrUrl
            );
            attemptedTranslationId = nextTranslationId;

            const books =
                await dataManager.getTranslationBooks(nextTranslationId);
            const selectedBook = books.books.find(
                (book) => book.id === nextBookId
            );
            if (!selectedBook) {
                lastLoadAttempt = previousAttempt;
                throw new Error(
                    `Book with ID "${nextBookId}" not available for translation "${nextTranslationId}".`
                );
            }
            refreshAvailableTranslations();

            const target: ReadingPosition = {
                translationId: nextTranslationId,
                bookId: selectedBook.id,
                chapterNumber: resolveChapterInBook(
                    selectedBook,
                    nextChapterNumber
                ),
            };
            applyPosition(target, {
                scrollToVerse: selectOptions?.scrollToVerse ?? null,
            });
            await whenContentSettled(target);
        } catch (err) {
            failLoad(
                err,
                'Failed to select translation and chapter.',
                attemptedTranslationId
            );
        } finally {
            endRequest();
        }
    };

    const selectChapter = async (book: string, chapter: number) => {
        lastLoadAttempt = () => selectChapter(book, chapter);
        const target: ReadingPosition = {
            translationId: translationId.peek(),
            bookId: book,
            chapterNumber: chapter,
        };
        applyPosition(target);
        await whenContentSettled(target);
    };

    const loadInitialData = async () => {
        lastLoadAttempt = loadInitialData;
        beginRequest();
        error.value = null;

        try {
            // Validating the requested translation against its own (small) book
            // list avoids downloading the large list of every translation on
            // every page view. The full list is only fetched when there's no
            // translation to validate, a custom endpoint is in play, or the
            // requested translation turns out to be missing.
            let nextTranslationId: string | undefined;
            let books: ApiTranslationBooks | undefined;

            if (!useFirstAvailableTranslation.value && !getActiveEndpoint()) {
                try {
                    books = await dataManager.getTranslationBooks(
                        translationId.value
                    );
                    nextTranslationId = translationId.value;
                } catch {
                    // A network blip fails the same way as a missing translation,
                    // so let the full list below decide.
                }
            }

            if (!books || !nextTranslationId) {
                const loadedTranslations =
                    await dataManager.getTranslations(getActiveEndpoint());
                refreshAvailableTranslations();

                const firstAvailableTranslation = loadedTranslations[0];
                const currentTranslation = useFirstAvailableTranslation.value
                    ? firstAvailableTranslation
                    : (dataManager.availableTranslations.value.find(
                          (translation) =>
                              translation.id === translationId.value
                      ) ??
                      (shouldFallbackToFirstAvailableTranslation
                          ? firstAvailableTranslation
                          : undefined));
                if (!currentTranslation) {
                    throw new Error(
                        useFirstAvailableTranslation.value
                            ? 'No available translations found for endpoint.'
                            : `Translation with ID "${translationId.value}" not available.`
                    );
                }

                nextTranslationId = currentTranslation.id;
                books =
                    await dataManager.getTranslationBooks(nextTranslationId);
            } else {
                refreshAvailableTranslations();
            }

            useFirstAvailableTranslation.value = false;

            const firstBook = books.books[0];
            if (!firstBook) {
                throw new Error('No books available for selected translation.');
            }

            const requestedBookId = bookId.value;
            const selectedBook = requestedBookId
                ? books.books.find((book) => book.id === requestedBookId)
                : firstBook;

            if (!selectedBook) {
                // The requested book isn't in this translation. Don't silently
                // substitute a different book: leave the position as requested
                // so the UI can show "book not found". The loader may already
                // have a doomed request in flight for it — supersede it so its
                // error never lands.
                loadGeneration += 1;
                error.value = null;
                return;
            }

            const target: ReadingPosition = {
                translationId: nextTranslationId,
                bookId: selectedBook.id,
                chapterNumber: resolveChapterInBook(
                    selectedBook,
                    chapterNumber.peek()
                ),
            };
            applyPosition(target, {
                scrollToVerse: options.scrollToVerse ?? null,
            });
            await whenContentSettled(target);
        } catch (err) {
            failLoad(err, 'Failed to load Bible data.', translationId.peek());
        } finally {
            endRequest();
            if (!disposed) {
                initialChapterLoadSettled.value = true;
            }
        }
    };

    const retryLoad = async () => {
        await (lastLoadAttempt ?? loadInitialData)();
    };

    const selectFootnote = (noteId: number | null) => {
        selectedFootnoteId.value = noteId;
    };

    /**
     * Whether there's a chapter in the given direction. Answered from the book
     * list for where the reader *is*, so it stays correct while a chapter is
     * still downloading. The chapter-link fallback covers the window before the
     * book list has arrived.
     */
    const resolveAvailability = (
        step: (
            books: ApiTranslationBooks,
            position: ReadingPosition
        ) => ReadingPosition | null,
        chapterLink: (chapter: ApiTranslationBookChapter) => string | null
    ): boolean => {
        const books = translationBooks.value;
        const currentBookId = bookId.value;
        if (books && currentBookId) {
            return (
                step(books, {
                    translationId: translationId.value,
                    bookId: currentBookId,
                    chapterNumber: chapterNumber.value,
                }) !== null
            );
        }

        const chapter = chapterData.value;
        return !!(chapter && chapterLink(chapter));
    };

    const hasNext = computed<boolean>(() =>
        resolveAvailability(
            nextPosition,
            (chapter) => chapter.nextChapterApiLink
        )
    );
    const hasPrevious = computed<boolean>(() =>
        resolveAvailability(
            previousPosition,
            (chapter) => chapter.previousChapterApiLink
        )
    );

    const resolveAdjacentPosition = (
        step: (
            books: ApiTranslationBooks,
            position: ReadingPosition
        ) => ReadingPosition | null
    ): ReadingPosition | null => {
        const books = translationBooks.value;
        const currentBookId = bookId.value;
        if (!books || !currentBookId) {
            return null;
        }
        return step(books, {
            translationId: translationId.value,
            bookId: currentBookId,
            chapterNumber: chapterNumber.value,
        });
    };

    const nextChapterPosition = computed(() =>
        resolveAdjacentPosition(nextPosition)
    );
    const previousChapterPosition = computed(() =>
        resolveAdjacentPosition(previousPosition)
    );

    const getAdjacentChapter = async (
        direction: 'next' | 'previous'
    ): Promise<ApiTranslationBookChapter | null> => {
        const currentChapter = chapterData.value;
        if (!currentChapter) {
            return null;
        }
        return (
            (direction === 'next'
                ? await dataManager.getNextChapter(currentChapter)
                : await dataManager.getPreviousChapter(currentChapter)) ?? null
        );
    };

    const dispose = () => {
        if (disposed) {
            return;
        }
        disposed = true;
        for (const disposeEffect of effectDisposers) {
            disposeEffect();
        }
        for (const timer of decorationRemovalTimers.values()) {
            clearTimeout(timer);
        }
        decorationRemovalTimers.clear();
        for (const key of Array.from(contentWaiters.keys())) {
            settleContentWaiters(key);
        }
    };

    void loadInitialData();

    return {
        defaultTranslation,
        translationId,
        translation,
        bookId,
        chapterNumber,
        availableTranslations,
        translationBooks,
        chapterData,
        decorations,
        selectedVerses,
        selectedFootnote,
        loading,
        isChapterContentStale,
        error,
        failedTranslationId,
        retryLoad,
        initialChapterLoadSettled,
        scrollToVerse,
        selectVerse,
        clearSelectedVerses,
        selectFootnote,
        decorateVerses,
        removeDecoration,
        selectTranslation,
        selectTranslationAndChapter,
        selectBook,
        selectChapter,
        loadPreviousChapter,
        loadNextChapter,
        hasNext,
        hasPrevious,
        nextChapterPosition,
        previousChapterPosition,
        getAdjacentChapter,
        title,
        shortTitle,
        subTitle,
        shortSubTitle,
        get disposed() {
            return disposed;
        },
        dispose,
    };
}
