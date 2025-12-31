import { DOMParser } from 'linkedom';
import { log } from '@helloao/tools';
import {
    detectLanguageFromName,
    getTextDirection,
} from './language-detection.js';

/**
 * URL for the Beblia bibles.xml index file.
 * This is hosted on the radio-crestin fork which maintains the index.
 */
export const BEBLIA_INDEX_URL =
    'https://github.com/radio-crestin/Holy-Bible-XML-Format/releases/latest/download/bibles.xml';

/**
 * Base URL for downloading individual Bible XML files.
 */
export const BEBLIA_RAW_BASE_URL =
    'https://github.com/radio-crestin/Holy-Bible-XML-Format/raw/refs/tags/v1.0.1/data';

/**
 * Represents a Bible translation entry from the Beblia index.
 */
export interface BebliaTranslation {
    /** Full name of the translation */
    name: string;
    /** Filename (e.g., "RomanianBible.xml") */
    filename: string;
    /** Direct download URL */
    downloadUrl: string;
    /** Copyright information if available */
    copyright?: string;
    /** Source link if available */
    sourceLink?: string;
    /** Auto-detected ISO 639-3 language code */
    detectedLanguage: string;
    /** Text direction (ltr or rtl) */
    textDirection: 'ltr' | 'rtl';
}

/**
 * Represents the Beblia translations index.
 */
export interface BebliaIndex {
    /** Total number of translations available */
    totalCount: number;
    /** Repository URL */
    repositoryUrl: string;
    /** Index version tag */
    version: string;
    /** List of all translations */
    translations: BebliaTranslation[];
}

/**
 * Fetches and parses the Beblia translations index.
 *
 * @returns The parsed index with all available translations.
 */
export async function fetchBebliaIndex(): Promise<BebliaIndex> {
    const logger = log.getLogger();
    logger.log('Fetching Beblia index from:', BEBLIA_INDEX_URL);

    const response = await fetch(BEBLIA_INDEX_URL, {
        redirect: 'follow',
    });

    if (!response.ok) {
        throw new Error(
            `Failed to fetch Beblia index: ${response.status} ${response.statusText}`
        );
    }

    const xml = await response.text();
    return parseBebliaIndex(xml);
}

/**
 * Parses the Beblia index XML content.
 *
 * @param xml - The raw XML content of the index file.
 * @returns The parsed index.
 */
export function parseBebliaIndex(xml: string): BebliaIndex {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'text/xml');
    const root = doc.documentElement;

    // Parse metadata
    const metadata = root.querySelector('metadata');
    const totalCount = parseInt(
        metadata?.querySelector('total_translations')?.textContent || '0',
        10
    );
    const repositoryUrl =
        metadata?.querySelector('repository')?.textContent ||
        'https://github.com/Beblia/Holy-Bible-XML-Format';
    const version = metadata?.querySelector('tag')?.textContent || 'v1.0.0';

    // Parse translations
    const translations: BebliaTranslation[] = [];
    const translationElements = root.querySelectorAll(
        'translations > translation'
    );

    for (const el of translationElements) {
        const name = el.querySelector('name')?.textContent?.trim() || '';
        const filename = el.querySelector('filename')?.textContent?.trim() || '';
        const downloadUrl =
            el.querySelector('download_url')?.textContent?.trim() || '';
        const copyright =
            el.querySelector('copyright')?.textContent?.trim() || undefined;
        const sourceLink =
            el.querySelector('source_link')?.textContent?.trim() || undefined;

        if (!name || !filename) {
            continue; // Skip invalid entries
        }

        // Detect language from name
        const detectedLanguage = detectLanguageFromName(name);
        const textDirection = getTextDirection(detectedLanguage);

        translations.push({
            name,
            filename,
            downloadUrl:
                downloadUrl || `${BEBLIA_RAW_BASE_URL}/${filename}`,
            copyright,
            sourceLink,
            detectedLanguage,
            textDirection,
        });
    }

    return {
        totalCount: totalCount || translations.length,
        repositoryUrl,
        version,
        translations,
    };
}

/**
 * Downloads a single Bible translation XML file.
 *
 * @param translation - The translation to download.
 * @returns The raw XML content.
 */
export async function downloadBebliaTranslation(
    translation: BebliaTranslation
): Promise<string> {
    const logger = log.getLogger();
    logger.log('Downloading translation:', translation.name);

    const response = await fetch(translation.downloadUrl, {
        redirect: 'follow',
    });

    if (!response.ok) {
        throw new Error(
            `Failed to download translation ${translation.name}: ${response.status} ${response.statusText}`
        );
    }

    return response.text();
}

/**
 * Downloads a Bible translation by filename.
 *
 * @param filename - The filename (e.g., "RomanianBible.xml").
 * @returns The raw XML content.
 */
export async function downloadBebliaTranslationByFilename(
    filename: string
): Promise<string> {
    const url = `${BEBLIA_RAW_BASE_URL}/${filename}`;
    const logger = log.getLogger();
    logger.log('Downloading from:', url);

    const response = await fetch(url, {
        redirect: 'follow',
    });

    if (!response.ok) {
        throw new Error(
            `Failed to download ${filename}: ${response.status} ${response.statusText}`
        );
    }

    return response.text();
}

/**
 * Filters translations by language code.
 *
 * @param translations - The list of translations to filter.
 * @param languageCode - The ISO 639 language code to filter by.
 * @returns Translations matching the language code.
 */
export function filterByLanguage(
    translations: BebliaTranslation[],
    languageCode: string
): BebliaTranslation[] {
    const normalized = languageCode.toLowerCase();
    return translations.filter(
        (t) => t.detectedLanguage.toLowerCase() === normalized
    );
}

/**
 * Filters translations by search term.
 *
 * @param translations - The list of translations to filter.
 * @param searchTerm - The search term to filter by (matches name or filename).
 * @returns Translations matching the search term.
 */
export function filterBySearch(
    translations: BebliaTranslation[],
    searchTerm: string
): BebliaTranslation[] {
    const normalized = searchTerm.toLowerCase();
    return translations.filter(
        (t) =>
            t.name.toLowerCase().includes(normalized) ||
            t.filename.toLowerCase().includes(normalized)
    );
}

/**
 * Gets statistics about the available translations.
 *
 * @param translations - The list of translations.
 * @returns Statistics about language distribution.
 */
export function getTranslationStats(
    translations: BebliaTranslation[]
): Map<string, number> {
    const stats = new Map<string, number>();
    for (const t of translations) {
        const count = stats.get(t.detectedLanguage) || 0;
        stats.set(t.detectedLanguage, count + 1);
    }
    return stats;
}
