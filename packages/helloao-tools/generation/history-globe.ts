import { Dataset, DatasetPlace } from './common-types.js';
import { DatasetDataset } from './dataset.js';
import { bookOrderMap } from './book-order.js';
import {
    collapseVerseRefs,
    omitUndefined,
    osisBookMap,
    ResolvedVerse,
} from './theographic.js';
import { getLogger } from '../log.js';
import { sortBy } from 'es-toolkit/compat';

/**
 * The dataset information for the History Globe places dataset.
 * See https://historyglobe.app/docs/api.html
 */
export const HISTORY_GLOBE_DATASET: Dataset = {
    id: 'history-globe',
    name: 'History Globe',
    englishName: 'History Globe',
    website: 'https://historyglobe.app',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    licenseNotes:
        'History Globe by Vadym Arnaut (https://historyglobe.app) is licensed under CC BY 4.0. Its places, verse tags, and coordinates start from the OpenBible.info Bible Geocoding Data (CC BY 4.0), with corrections, and some coordinates are from Wikidata (CC0). Changes were made to the data to fit the Free Use Bible API format.',
    language: 'eng',
    textDirection: 'ltr',
};

/**
 * The base URL of the History Globe open data API.
 */
export const HISTORY_GLOBE_API_URL = 'https://historyglobe.app/api/v1';

/**
 * Defines an interface for a place in the History Globe `places.json` file.
 */
export interface HistoryGlobePlace {
    /**
     * The ID of the place. e.g. "a15257a"
     */
    id: string;

    /**
     * The English name of the place.
     */
    name: string;

    /**
     * The kind of the place. e.g. "settlement", "river", "mountain"
     */
    kind?: string;

    /**
     * The longitude of the place.
     */
    lon?: number;

    /**
     * The latitude of the place.
     */
    lat?: number;

    [key: string]: unknown;
}

/**
 * The parsed contents of the History Globe files that are needed
 * to generate the dataset.
 */
export interface HistoryGlobeFiles {
    /**
     * The places from `places.json`.
     */
    places: HistoryGlobePlace[];

    /**
     * The contents of the `verses/{book}.json` files merged into one map.
     * Maps OSIS verse references (e.g. "Acts.1.8") to the IDs of the places that the verse names.
     */
    verses: {
        [osisRef: string]: string[];
    };
}

/**
 * Maps History Globe place kinds to the feature types that the Theographic dataset uses,
 * so that places from both datasets can be filtered the same way.
 * Kinds that have no clear match get no feature type.
 */
const featureTypeMap = new Map<string, string>([
    ['settlement', 'City'],
    ['island', 'Island'],
    ['mountain', 'Mountain'],
    ['mountain range', 'Mountain'],
    ['mountain pass', 'Mountain'],
    ['hill', 'Mountain'],
    ['promontory', 'Mountain'],
    ['cliff', 'Mountain'],
    ['region', 'Region'],
    ['natural area', 'Region'],
    ['valley', 'Valley'],
    ['wadi', 'Valley'],
    ['river', 'Water'],
    ['body of water', 'Water'],
    ['canal', 'Water'],
    ['ford', 'Water'],
    ['road', 'Path'],
    ['altar', 'Landmark'],
    ['district in settlement', 'Landmark'],
    ['field', 'Landmark'],
    ['forest', 'Landmark'],
    ['fortification', 'Landmark'],
    ['garden', 'Landmark'],
    ['gate', 'Landmark'],
    ['hall', 'Landmark'],
    ['pool', 'Landmark'],
    ['rock', 'Landmark'],
    ['room', 'Landmark'],
    ['spring', 'Landmark'],
    ['stone heap', 'Landmark'],
    ['structure', 'Landmark'],
    ['tree', 'Landmark'],
    ['well', 'Landmark'],
]);

/**
 * The kinds that only repeat their feature type, so they get no feature subtype.
 * Kinds that say nothing about the place (such as "special") get no feature subtype either.
 */
const kindsWithoutSubType = new Set([
    'settlement',
    'island',
    'mountain',
    'region',
    'valley',
    'special',
]);

/**
 * Generates a dataset from the given History Globe files.
 *
 * The returned dataset contains the places that are named in at least one verse,
 * with their coordinates and the Bible references that name them.
 *
 * The transformation is deterministic: the same input always produces the same output.
 *
 * @param files The parsed History Globe files.
 * @param dataset The dataset information to use. Defaults to {@link HISTORY_GLOBE_DATASET}.
 */
export function generateDatasetFromHistoryGlobe(
    files: HistoryGlobeFiles,
    dataset: Dataset = HISTORY_GLOBE_DATASET
): DatasetDataset {
    const logger = getLogger();

    const placeIds = new Set(files.places.map((p) => p.id));

    // Maps place IDs to the verses that name them.
    const versesByPlace = new Map<string, ResolvedVerse[]>();
    for (let [osisRef, ids] of Object.entries(files.verses)) {
        const [osisBook, chapter, verseNumber] = osisRef.split('.');
        const book = osisBookMap.get(osisBook);
        if (!book) {
            logger.warn('[history-globe] Unknown OSIS reference!', osisRef);
            continue;
        }
        const chapterNumber = parseInt(chapter);
        const verseNum = parseInt(verseNumber);
        if (isNaN(chapterNumber) || isNaN(verseNum)) {
            logger.warn('[history-globe] Invalid OSIS reference!', osisRef);
            continue;
        }
        const verse: ResolvedVerse = {
            book,
            order: bookOrderMap.get(book) ?? 9999,
            chapter: chapterNumber,
            verse: verseNum,
        };
        for (let id of ids) {
            if (!placeIds.has(id)) {
                logger.warn('[history-globe] Unknown place ID!', id, osisRef);
                continue;
            }
            let verses = versesByPlace.get(id);
            if (!verses) {
                verses = [];
                versesByPlace.set(id, verses);
            }
            verses.push(verse);
        }
    }

    const places: DatasetPlace[] = [];
    for (let record of files.places) {
        const references = collapseVerseRefs(
            versesByPlace.get(record.id) ?? []
        );

        // Places that no verse names (such as places of the wider ancient world) are left out.
        if (references.length <= 0) {
            continue;
        }

        if (!record.name) {
            logger.warn(
                '[history-globe] Place does not have a name!',
                record.id
            );
            continue;
        }

        const place: DatasetPlace = {
            id: record.id,
            name: record.name,
            featureType: record.kind
                ? featureTypeMap.get(record.kind)
                : undefined,
            featureSubType:
                record.kind && !kindsWithoutSubType.has(record.kind)
                    ? record.kind.charAt(0).toUpperCase() + record.kind.slice(1)
                    : undefined,
            latitude: parseCoordinate(record.lat),
            longitude: parseCoordinate(record.lon),
            references,
        };
        places.push(omitUndefined(place));
    }

    return {
        ...dataset,
        books: [],
        places: sortBy(places, (p) => p.id),
    };
}

function parseCoordinate(value: unknown): number | undefined {
    if (typeof value === 'number' && isFinite(value)) {
        return value;
    }
    return undefined;
}
