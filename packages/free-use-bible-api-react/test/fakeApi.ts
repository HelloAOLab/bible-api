import type {
    ApiTranslation,
    ApiTranslationBook,
    ApiTranslationBookChapter,
    ApiTranslationBooks,
    ChapterContent,
} from 'free-use-bible-api';

export const DEFAULT_ENDPOINT = 'https://bible.helloao.org/';

interface BookSpec {
    id: string;
    name: string;
    order: number;
    chapters: number;
}

/** A small translation: Genesis (3 chapters), Exodus (1), John (2). */
const BOOKS: BookSpec[] = [
    { id: 'GEN', name: 'Genesis', order: 1, chapters: 3 },
    { id: 'EXO', name: 'Exodus', order: 2, chapters: 1 },
    { id: 'JHN', name: 'John', order: 43, chapters: 2 },
];

export function makeTranslation(
    id: string,
    overrides: Partial<ApiTranslation> = {}
): ApiTranslation {
    return {
        id,
        name: `${id} Test Translation`,
        shortName: id,
        englishName: `${id} Test Translation`,
        website: 'https://example.com',
        licenseUrl: 'https://example.com/license',
        licenseNotice: `${id} is in the public domain.`,
        language: 'eng',
        textDirection: 'ltr',
        listOfBooksApiLink: `/api/${id}/books.json`,
        availableFormats: ['json'],
        numberOfBooks: BOOKS.length,
        totalNumberOfChapters: 6,
        totalNumberOfVerses: 18,
        ...overrides,
    };
}

function makeBook(translationId: string, spec: BookSpec): ApiTranslationBook {
    const reference = (chapter: number) => ({
        translationId,
        book: spec.id as ApiTranslationBook['id'],
        chapter,
    });
    return {
        id: spec.id as ApiTranslationBook['id'],
        name: spec.name,
        commonName: spec.name,
        title: null,
        order: spec.order,
        firstChapterNumber: 1,
        firstChapterApiLink: `/api/${translationId}/${spec.id}/1.json`,
        firstChapterReference: reference(1),
        lastChapterNumber: spec.chapters,
        lastChapterApiLink: `/api/${translationId}/${spec.id}/${spec.chapters}.json`,
        lastChapterReference: reference(spec.chapters),
        numberOfChapters: spec.chapters,
        totalNumberOfVerses: spec.chapters * 3,
    };
}

export function makeBooks(translation: ApiTranslation): ApiTranslationBooks {
    return {
        translation,
        books: BOOKS.map((spec) => makeBook(translation.id, spec)),
    };
}

/**
 * Verse 1 is plain prose, verse 2 carries a footnote and the words of Jesus,
 * and verse 3 is two lines of poetry.
 */
function makeContent(bookName: string, chapter: number): ChapterContent[] {
    return [
        { type: 'heading', content: [`${bookName} ${chapter} heading`] },
        {
            type: 'verse',
            number: 1,
            content: [`${bookName} ${chapter}:1 text.`],
        },
        {
            type: 'verse',
            number: 2,
            content: [
                `${bookName} ${chapter}:2 text`,
                { noteId: 0 },
                { text: 'I am the way.', wordsOfJesus: true },
            ],
        },
        {
            type: 'verse',
            number: 3,
            content: [
                { text: 'First poem line', poem: 1 },
                { text: 'Second poem line', poem: 2 },
            ],
        },
    ];
}

export function makeChapter(
    translation: ApiTranslation,
    bookId: string,
    chapter: number
): ApiTranslationBookChapter {
    const books = makeBooks(translation);
    const bookIndex = books.books.findIndex((b) => b.id === bookId);
    const book = books.books[bookIndex]!;
    const link = (b: ApiTranslationBook, c: number) =>
        `/api/${translation.id}/${b.id}/${c}.json`;
    const reference = (b: ApiTranslationBook, c: number) => ({
        translationId: translation.id,
        book: b.id,
        chapter: c,
    });

    let next: [ApiTranslationBook, number] | null = null;
    if (chapter < book.numberOfChapters) {
        next = [book, chapter + 1];
    } else if (books.books[bookIndex + 1]) {
        next = [books.books[bookIndex + 1]!, 1];
    }
    let previous: [ApiTranslationBook, number] | null = null;
    if (chapter > 1) {
        previous = [book, chapter - 1];
    } else if (books.books[bookIndex - 1]) {
        const previousBook = books.books[bookIndex - 1]!;
        previous = [previousBook, previousBook.numberOfChapters];
    }

    return {
        translation,
        book,
        chapter: {
            number: chapter,
            content: makeContent(book.name, chapter),
            footnotes: [
                {
                    noteId: 0,
                    text: `Footnote for ${book.name} ${chapter}:2.`,
                    caller: '+',
                },
            ],
        },
        thisChapterLink: link(book, chapter),
        thisChapterReference: reference(book, chapter),
        thisChapterAudioLinks: {},
        thisChapterAudioTimings: {},
        nextChapterApiLink: next ? link(...next) : null,
        nextChapterReference: next ? reference(...next) : null,
        nextChapterAudioLinks: null,
        nextChapterAudioTimings: null,
        previousChapterApiLink: previous ? link(...previous) : null,
        previousChapterReference: previous ? reference(...previous) : null,
        previousChapterAudioLinks: null,
        previousChapterAudioTimings: null,
        numberOfVerses: 3,
    };
}

interface Deferred {
    resolve: () => void;
    reject: (error: Error) => void;
}

/**
 * Replaces `fetch` with an in-memory Free Use Bible API. Each endpoint serves
 * its own set of translations.
 */
export class FakeBibleServer {
    /** Translations served by each endpoint. */
    translations = new Map<string, ApiTranslation[]>([
        [DEFAULT_ENDPOINT, [makeTranslation('BSB'), makeTranslation('AAB')]],
    ]);
    /** Every URL requested, in order. */
    requests: string[] = [];

    private _failing = new Set<string>();
    private _held = new Map<string, Deferred[]>();
    private _holdPatterns: string[] = [];
    private _originalFetch: typeof globalThis.fetch | undefined;

    install(): this {
        this._originalFetch = globalThis.fetch;
        globalThis.fetch = ((input: string | URL) =>
            this._handle(String(input))) as typeof globalThis.fetch;
        return this;
    }

    uninstall() {
        if (this._originalFetch) {
            globalThis.fetch = this._originalFetch;
        } else {
            delete (globalThis as { fetch?: unknown }).fetch;
        }
    }

    /** Requests whose URL contains `fragment` fail until `restore` is called. */
    fail(fragment: string) {
        this._failing.add(fragment);
    }

    restore(fragment: string) {
        this._failing.delete(fragment);
    }

    /** Requests whose URL contains `fragment` wait until `release` is called. */
    hold(fragment: string) {
        this._holdPatterns.push(fragment);
    }

    /** Lets held requests matching `fragment` through. */
    release(fragment: string) {
        this._holdPatterns = this._holdPatterns.filter((p) => p !== fragment);
        for (const [url, waiters] of Array.from(this._held.entries())) {
            if (url.includes(fragment)) {
                this._held.delete(url);
                waiters.forEach((waiter) => waiter.resolve());
            }
        }
    }

    private async _handle(url: string) {
        this.requests.push(url);

        if (this._holdPatterns.some((pattern) => url.includes(pattern))) {
            await new Promise<void>((resolve, reject) => {
                const waiters = this._held.get(url) ?? [];
                waiters.push({ resolve, reject });
                this._held.set(url, waiters);
            });
        }

        if (
            Array.from(this._failing).some((pattern) => url.includes(pattern))
        ) {
            throw new TypeError('Failed to fetch');
        }

        const body = this._route(url);
        if (body === undefined) {
            return {
                status: 404,
                statusText: 'Not Found',
                json: async () => ({}),
            };
        }
        return { status: 200, statusText: 'OK', json: async () => body };
    }

    private _route(url: string): unknown {
        const parsed = new URL(url);
        const match = parsed.pathname.match(/^(.*\/)api\/(.+)$/);
        if (!match) {
            return undefined;
        }
        const endpoint = `${parsed.protocol}//${parsed.host}${match[1]}`;
        const translations = this.translations.get(endpoint);
        if (!translations) {
            return undefined;
        }
        const path = match[2]!;

        if (path === 'available_translations.json') {
            return { translations };
        }

        const booksMatch = path.match(/^([^/]+)\/books\.json$/);
        if (booksMatch) {
            const translation = translations.find(
                (t) => t.id === decodeURIComponent(booksMatch[1]!)
            );
            return translation ? makeBooks(translation) : undefined;
        }

        const chapterMatch = path.match(/^([^/]+)\/([^/]+)\/(\d+)\.json$/);
        if (chapterMatch) {
            const translation = translations.find(
                (t) => t.id === decodeURIComponent(chapterMatch[1]!)
            );
            const book = BOOKS.find((b) => b.id === chapterMatch[2]);
            const chapter = Number(chapterMatch[3]);
            if (
                !translation ||
                !book ||
                chapter < 1 ||
                chapter > book.chapters
            ) {
                return undefined;
            }
            return makeChapter(translation, book.id, chapter);
        }

        return undefined;
    }
}

/**
 * Polls `condition` until it holds, letting pending promises and zero-delay
 * timers run in between. Throws if it doesn't hold within `timeoutMs`.
 */
export async function waitForCondition(
    condition: () => boolean,
    timeoutMs = 2000
): Promise<void> {
    const deadline = Date.now() + timeoutMs;
    while (!condition()) {
        if (Date.now() > deadline) {
            throw new Error('Timed out waiting for condition.');
        }
        await new Promise((resolve) => setTimeout(resolve, 0));
    }
}
