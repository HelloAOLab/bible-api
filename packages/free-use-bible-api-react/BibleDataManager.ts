import { signal, type Signal } from '@preact/signals-core';
import type {
    FreeUseBibleApi,
    ApiTranslation,
    ApiTranslationBookChapter,
    ApiTranslationBooks,
} from 'free-use-bible-api';

/** How a set of translations should be folded into the known-translations list. */
export interface MergeTranslationsOptions {
    /**
     * When true, translations that are already known are left untouched instead of
     * being replaced. Use this for metadata that may be older than what the
     * manager already has.
     */
    fillOnly?: boolean;
}

/**
 * Loads and caches Bible content from one or more Free Use Bible API endpoints.
 *
 * Translations are remembered by the endpoint they were found on, so a
 * translation from a self-hosted endpoint keeps loading from that endpoint
 * without every caller having to pass it along.
 */
export interface BibleDataManager {
    /** Every endpoint whose translation list has been requested, default first. */
    endpoints: Signal<string[]>;
    /** Every translation the manager knows about, across all endpoints. */
    availableTranslations: Signal<ApiTranslation[]>;
    /**
     * Whether the full translation list (`getTranslations`) has been fetched.
     *
     * `availableTranslations` alone can't answer that: loading a chapter only
     * merges in the *one* translation being read (via `getTranslationBooks`),
     * so the list is non-empty well before the full list has been requested.
     * Callers that need "is every translation known yet" (a translation
     * picker) must check this instead of the list's length.
     */
    catalogLoaded: Signal<boolean>;
    /** Book lists that have been downloaded, keyed by translation ID. */
    translationBooks: Signal<Map<string, ApiTranslationBooks>>;
    api: FreeUseBibleApi;

    /**
     * Loads an endpoint's translation list and merges it into
     * `availableTranslations`.
     *
     * @param endpoint The endpoint to read. Defaults to the API's own endpoint.
     */
    getTranslations: (endpoint?: string) => Promise<ApiTranslation[]>;
    getTranslationBooks: (
        translationId: string
    ) => Promise<ApiTranslationBooks>;

    /**
     * Returns the already-downloaded book list for a translation, or null when
     * it has not been fetched yet. Never hits the network, so callers can answer
     * questions like "which chapter comes next" synchronously.
     *
     * Reads the cache **untracked**, so calling this from inside an `effect()` or
     * `computed()` does not subscribe it to the cache. Reactive consumers should
     * read the `translationBooks` signal directly instead.
     */
    getCachedTranslationBooks: (
        translationId: string
    ) => ApiTranslationBooks | null;
    getTranslationBookChapter: (
        translationId: string,
        book: string,
        chapter: number | string
    ) => Promise<ApiTranslationBookChapter>;
    getNextChapter: (
        chapter: ApiTranslationBookChapter
    ) => Promise<ApiTranslationBookChapter | null>;
    getPreviousChapter: (
        chapter: ApiTranslationBookChapter
    ) => Promise<ApiTranslationBookChapter | null>;

    /**
     * Gets the API endpoint a translation was found on. Translations that
     * haven't been seen on any other endpoint use the default one.
     */
    getTranslationEndpointInfo: (translationId: string) => {
        translationId: string;
        endpoint: string;
        isDefault: boolean;
    };

    /**
     * Gets a string that `BibleReadingState.selectTranslation` accepts to load
     * this translation: the bare ID for the default endpoint, or a
     * `books.json` URL for any other endpoint.
     */
    buildTranslationId: (translationId: string) => string;
}

function normalizeEndpoint(endpoint: string): string {
    try {
        const url = new URL(endpoint);
        if (!url.pathname.endsWith('/')) {
            url.pathname = `${url.pathname}/`;
        }
        return url.href;
    } catch {
        return endpoint;
    }
}

export function createBibleDataManager(api: FreeUseBibleApi): BibleDataManager {
    const defaultEndpoint = normalizeEndpoint(api.endpoint);
    const endpoints = signal<string[]>([defaultEndpoint]);
    const availableTranslations = signal<ApiTranslation[]>([]);
    const catalogLoaded = signal<boolean>(false);
    const translationBooks = signal<Map<string, ApiTranslationBooks>>(
        new Map()
    );
    const translationEndpoints = signal<Map<string, string>>(new Map());

    const getEndpointForTranslation = (translationId: string): string => {
        return translationEndpoints.value.get(translationId) ?? defaultEndpoint;
    };

    const getTranslationEndpointInfo = (translationId: string) => {
        const endpoint = getEndpointForTranslation(translationId);
        return {
            translationId,
            endpoint,
            isDefault: endpoint === defaultEndpoint,
        };
    };

    const ensureEndpointTracked = (endpoint: string) => {
        if (endpoints.value.includes(endpoint)) {
            return;
        }
        endpoints.value = [...endpoints.value, endpoint];
    };

    const mergeTranslations = (
        endpoint: string,
        nextTranslations: ApiTranslation[],
        options?: MergeTranslationsOptions
    ) => {
        const merged = new Map(
            availableTranslations.value.map((translation) => [
                translation.id,
                translation,
            ])
        );

        const nextTranslationEndpoints = new Map(translationEndpoints.value);
        for (const translation of nextTranslations) {
            if (options?.fillOnly && merged.has(translation.id)) {
                if (!nextTranslationEndpoints.has(translation.id)) {
                    nextTranslationEndpoints.set(translation.id, endpoint);
                }
                continue;
            }
            merged.set(translation.id, translation);
            nextTranslationEndpoints.set(translation.id, endpoint);
        }

        availableTranslations.value = Array.from(merged.values());
        translationEndpoints.value = nextTranslationEndpoints;
    };

    const getTranslations = async (
        endpoint?: string
    ): Promise<ApiTranslation[]> => {
        const normalizedEndpoint = normalizeEndpoint(
            endpoint ?? defaultEndpoint
        );
        ensureEndpointTracked(normalizedEndpoint);

        const response = await api.getAvailableTranslations(normalizedEndpoint);
        mergeTranslations(normalizedEndpoint, response.translations);
        catalogLoaded.value = true;
        return response.translations;
    };

    const getTranslationBooks = async (
        translationId: string
    ): Promise<ApiTranslationBooks> => {
        const existing = translationBooks.value.get(translationId);
        if (existing) {
            return existing;
        }

        const endpoint = getEndpointForTranslation(translationId);
        const books = await api.getTranslationBooks(translationId, endpoint);

        const nextBooksMap = new Map(translationBooks.value);
        nextBooksMap.set(translationId, books);
        translationBooks.value = nextBooksMap;
        mergeTranslations(endpoint, [books.translation]);
        return books;
    };

    const getCachedTranslationBooks = (
        translationId: string
    ): ApiTranslationBooks | null => {
        return translationBooks.peek().get(translationId) ?? null;
    };

    const getTranslationBookChapter = async (
        translationId: string,
        book: string,
        chapter: number | string
    ): Promise<ApiTranslationBookChapter> => {
        const endpoint = getEndpointForTranslation(translationId);
        return await api.getTranslationBookChapter(
            translationId,
            book,
            chapter,
            endpoint
        );
    };

    const getNextChapter = async (chapter: ApiTranslationBookChapter) => {
        const endpoint = getEndpointForTranslation(chapter.translation.id);
        return await api.getNextChapter(chapter, endpoint);
    };

    const getPreviousChapter = async (chapter: ApiTranslationBookChapter) => {
        const endpoint = getEndpointForTranslation(chapter.translation.id);
        return await api.getPreviousChapter(chapter, endpoint);
    };

    const buildTranslationId = (translationId: string) => {
        const endpoint = getTranslationEndpointInfo(translationId);
        if (endpoint.isDefault) {
            return translationId;
        }
        return new URL(
            `api/${encodeURIComponent(translationId)}/books.json`,
            endpoint.endpoint
        ).href;
    };

    return {
        endpoints,
        availableTranslations,
        catalogLoaded,
        translationBooks,
        api,
        getTranslations,
        getTranslationBooks,
        getCachedTranslationBooks,
        getTranslationBookChapter,
        getNextChapter,
        getPreviousChapter,
        getTranslationEndpointInfo,
        buildTranslationId,
    };
}
