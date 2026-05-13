import * as runtime from '../runtime';
import { ApiTranslationBookChapter, ApiTranslationBookChapterFromJSON } from "../models";
import { DefaultApi } from "./DefaultApi";

export class FreeUseBibleApi extends DefaultApi {

    /**
     * Gets the chapter that follows the given chapter, or null if there is no next chapter.
     * @param chapter The chapter to get the next chapter of.
     * @param initOverrides Optional overrides for the request.
     * @returns The next chapter, or null if there is no next chapter.
     */
    async getNextChapterRaw(chapter: ApiTranslationBookChapter, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiTranslationBookChapter> | null> {
        if (!chapter.nextChapterApiLink) {
            return null;
        }

        const response = await this.request({
            path: chapter.nextChapterApiLink,
            method: 'GET',
            headers: {},
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiTranslationBookChapterFromJSON(jsonValue));
    }

    /**
     * Gets the chapter that follows the given chapter, or null if there is no next chapter.
     * @param chapter The chapter to get the next chapter of.
     * @param initOverrides Optional overrides for the request.
     * @returns The next chapter, or null if there is no next chapter.
     */
    async getNextChapter(chapter: ApiTranslationBookChapter, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiTranslationBookChapter | null> {
        const apiResponse = await this.getNextChapterRaw(chapter, initOverrides);
        return apiResponse ? await apiResponse.value() : null;
    }

    /**
     * Gets the chapter that precedes the given chapter, or null if there is no previous chapter.
     * @param chapter The chapter to get the previous chapter of.
     * @param initOverrides Optional overrides for the request.
     * @returns The previous chapter, or null if there is no previous chapter.
     */
    async getPreviousChapterRaw(chapter: ApiTranslationBookChapter, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ApiTranslationBookChapter> | null> {
        if (!chapter.previousChapterApiLink) {
            return null;
        }
        const response = await this.request({
            path: chapter.previousChapterApiLink,
            method: 'GET',
            headers: {},
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApiTranslationBookChapterFromJSON(jsonValue));
    }

    /**
     * Gets the chapter that precedes the given chapter, or null if there is no previous chapter.
     * @param chapter The chapter to get the previous chapter of.
     * @param initOverrides Optional overrides for the request.
     * @returns The previous chapter, or null if there is no previous chapter.
     */
    async getPreviousChapter(chapter: ApiTranslationBookChapter, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ApiTranslationBookChapter | null> {
        const apiResponse = await this.getPreviousChapterRaw(chapter, initOverrides);
        return apiResponse ? await apiResponse.value() : null;
    }
}