import { GetTranslationsItem } from "@gracious.tech/fetch-client/dist/esm/collection";
import { bookOrderMap } from "./generation/book-order";
import { padStart } from "lodash";

/**
 * Normalizes the given language code into a ISO 639 code.
 * @param language The language code to normalize.
 */
export function normalizeLanguage(language: string): string {
    return language;
}

/**
 * The map of translation IDs from fetch.bible to their translation ID in the API.
 */
const TRANSLATION_ID_MAP: Map<string, string> = new Map([
    ['eng_bsb', 'BSB'],
    ['arb_nav', 'ARBNAV'],
    ['eng_webp', 'ENGWEBP'],
    ['hin_irv', 'HINIRV'],
    ['hbo_mas', 'HBOMAS'],
]);

/**
 * Gets the ID of the translation.
 * @param translation The translation to get the ID for.
 */
export function getTranslationId(translation: GetTranslationsItem): string {
    return TRANSLATION_ID_MAP.get(translation.id) ?? translation.id;
}

export function isEmptyOrWhitespace(str: string | null | undefined): boolean {
    return !str || /^\s*$/.test(str);
}

export function getFirstNonEmpty<T extends string>(...values: T[]): T {
    for (let value of values) {
        if (!isEmptyOrWhitespace(value)) {
            return value;
        }
    }

    throw new Error('All values are empty or whitespace!');
}