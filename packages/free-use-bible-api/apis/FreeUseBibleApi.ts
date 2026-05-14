import * as runtime from '../runtime';
import {
    ApiTranslationBook,
    ApiTranslationBookChapter,
    ApiTranslationBookChapterFromJSON,
} from '../models';
import { DefaultApi } from './DefaultApi';

export class FreeUseBibleApi extends DefaultApi {
    /**
     * Gets the first chapter of the given book.
     * @param book The book to get the first chapter of.
     * @param initOverrides Optional overrides for the request.
     * @returns The first chapter of the given book.
     */
    async getTranslationBookFirstChapterRaw(
        book: ApiTranslationBook,
        initOverrides?: RequestInit | runtime.InitOverrideFunction
    ): Promise<runtime.ApiResponse<ApiTranslationBookChapter>> {
        return this.getTranslationBookChapterRaw(
            {
                translation: book.firstChapterReference.translationId,
                book: book.firstChapterReference.book,
                chapter: book.firstChapterReference.chapter,
            },
            initOverrides
        );
    }

    /**
     * Gets the first chapter of the given book.
     * @param book The book to get the first chapter of.
     * @param initOverrides Optional overrides for the request.
     * @returns The first chapter of the given book.
     */
    async getTranslationBookFirstChapter(
        book: ApiTranslationBook,
        initOverrides?: RequestInit | runtime.InitOverrideFunction
    ): Promise<ApiTranslationBookChapter> {
        const apiResponse = await this.getTranslationBookFirstChapterRaw(
            book,
            initOverrides
        );
        return await apiResponse.value();
    }

    /**
     * Gets the last chapter of the given book.
     * @param book The book to get the last chapter of.
     * @param initOverrides Optional overrides for the request.
     * @returns The last chapter of the given book.
     */
    async getTranslationBookLastChapterRaw(
        book: ApiTranslationBook,
        initOverrides?: RequestInit | runtime.InitOverrideFunction
    ): Promise<runtime.ApiResponse<ApiTranslationBookChapter>> {
        return this.getTranslationBookChapterRaw(
            {
                translation: book.lastChapterReference.translationId,
                book: book.lastChapterReference.book,
                chapter: book.lastChapterReference.chapter,
            },
            initOverrides
        );
    }

    /**
     * Gets the last chapter of the given book.
     * @param book The book to get the last chapter of.
     * @param initOverrides Optional overrides for the request.
     * @returns The last chapter of the given book.
     */
    async getTranslationBookLastChapter(
        book: ApiTranslationBook,
        initOverrides?: RequestInit | runtime.InitOverrideFunction
    ): Promise<ApiTranslationBookChapter> {
        const apiResponse = await this.getTranslationBookLastChapterRaw(
            book,
            initOverrides
        );
        return await apiResponse.value();
    }

    /**
     * Gets the chapter that follows the given chapter, or null if there is no next chapter.
     * @param chapter The chapter to get the next chapter of.
     * @param initOverrides Optional overrides for the request.
     * @returns The next chapter, or null if there is no next chapter.
     */
    async getTranslationNextChapterRaw(
        chapter: ApiTranslationBookChapter,
        initOverrides?: RequestInit | runtime.InitOverrideFunction
    ): Promise<runtime.ApiResponse<ApiTranslationBookChapter> | null> {
        if (!chapter.nextChapterReference) {
            return null;
        }

        return this.getTranslationBookChapterRaw(
            {
                translation: chapter.nextChapterReference.translationId,
                book: chapter.nextChapterReference.book,
                chapter: chapter.nextChapterReference.chapter,
            },
            initOverrides
        );
    }

    /**
     * Gets the chapter that follows the given chapter, or null if there is no next chapter.
     * @param chapter The chapter to get the next chapter of.
     * @param initOverrides Optional overrides for the request.
     * @returns The next chapter, or null if there is no next chapter.
     */
    async getTranslationNextChapter(
        chapter: ApiTranslationBookChapter,
        initOverrides?: RequestInit | runtime.InitOverrideFunction
    ): Promise<ApiTranslationBookChapter | null> {
        const apiResponse = await this.getTranslationNextChapterRaw(
            chapter,
            initOverrides
        );
        return apiResponse ? await apiResponse.value() : null;
    }

    /**
     * Gets the chapter that precedes the given chapter, or null if there is no previous chapter.
     * @param chapter The chapter to get the previous chapter of.
     * @param initOverrides Optional overrides for the request.
     * @returns The previous chapter, or null if there is no previous chapter.
     */
    async getTranslationPreviousChapterRaw(
        chapter: ApiTranslationBookChapter,
        initOverrides?: RequestInit | runtime.InitOverrideFunction
    ): Promise<runtime.ApiResponse<ApiTranslationBookChapter> | null> {
        if (!chapter.previousChapterReference) {
            return null;
        }

        return this.getTranslationBookChapterRaw(
            {
                translation: chapter.previousChapterReference.translationId,
                book: chapter.previousChapterReference.book,
                chapter: chapter.previousChapterReference.chapter,
            },
            initOverrides
        );
    }

    /**
     * Gets the chapter that precedes the given chapter, or null if there is no previous chapter.
     * @param chapter The chapter to get the previous chapter of.
     * @param initOverrides Optional overrides for the request.
     * @returns The previous chapter, or null if there is no previous chapter.
     */
    async getTranslationPreviousChapter(
        chapter: ApiTranslationBookChapter,
        initOverrides?: RequestInit | runtime.InitOverrideFunction
    ): Promise<ApiTranslationBookChapter | null> {
        const apiResponse = await this.getTranslationPreviousChapterRaw(
            chapter,
            initOverrides
        );
        return apiResponse ? await apiResponse.value() : null;
    }
}
