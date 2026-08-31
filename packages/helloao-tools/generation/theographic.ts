import {
    Dataset,
    DatasetEntityRef,
    DatasetEvent,
    DatasetPeopleGroup,
    DatasetPerson,
    DatasetPlace,
} from './common-types.js';
import { VerseRef } from '../utils.js';
import { DatasetDataset } from './dataset.js';
import { bookOrderMap } from './book-order.js';
import { getLogger } from '../log.js';
import { BookId } from '../utils.js';
import { sortBy } from 'es-toolkit/compat';

/**
 * The dataset information for the Theographic Bible Metadata dataset.
 * See https://github.com/robertrouse/theographic-bible-metadata
 */
export const THEOGRAPHIC_DATASET: Dataset = {
    id: 'theographic',
    name: 'Theographic Bible Metadata',
    englishName: 'Theographic Bible Metadata',
    website: 'https://github.com/robertrouse/theographic-bible-metadata',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    licenseNotes:
        'Changes were made to the data to fit the Free Use Bible API format.',
    language: 'eng',
    textDirection: 'ltr',
};

/**
 * Defines an interface for a raw Theographic record.
 * The Theographic JSON files are Airtable exports, where each record has an Airtable record ID and a map of fields.
 */
export interface TheographicRecord {
    /**
     * The Airtable record ID of the record. e.g. "recO5ToygNrV47m4M"
     */
    id: string;

    /**
     * The fields of the record.
     */
    fields: {
        [key: string]: any;
    };
}

/**
 * The parsed contents of the Theographic JSON files that are needed
 * to generate the dataset.
 */
export interface TheographicFiles {
    books: TheographicRecord[];
    verses: TheographicRecord[];
    people: TheographicRecord[];
    places: TheographicRecord[];
    events: TheographicRecord[];
    peopleGroups: TheographicRecord[];
}

/**
 * Maps Theographic OSIS book names to USFM book IDs.
 */
export const osisBookMap = new Map<string, BookId>([
    ['Gen', 'GEN'],
    ['Exod', 'EXO'],
    ['Lev', 'LEV'],
    ['Num', 'NUM'],
    ['Deut', 'DEU'],
    ['Josh', 'JOS'],
    ['Judg', 'JDG'],
    ['Ruth', 'RUT'],
    ['1Sam', '1SA'],
    ['2Sam', '2SA'],
    ['1Kgs', '1KI'],
    ['2Kgs', '2KI'],
    ['1Chr', '1CH'],
    ['2Chr', '2CH'],
    ['Ezra', 'EZR'],
    ['Neh', 'NEH'],
    ['Esth', 'EST'],
    ['Job', 'JOB'],
    ['Ps', 'PSA'],
    ['Prov', 'PRO'],
    ['Eccl', 'ECC'],
    ['Song', 'SNG'],
    ['Isa', 'ISA'],
    ['Jer', 'JER'],
    ['Lam', 'LAM'],
    ['Ezek', 'EZK'],
    ['Dan', 'DAN'],
    ['Hos', 'HOS'],
    ['Joel', 'JOL'],
    ['Amos', 'AMO'],
    ['Obad', 'OBA'],
    ['Jonah', 'JON'],
    ['Mic', 'MIC'],
    ['Nah', 'NAM'],
    ['Hab', 'HAB'],
    ['Zeph', 'ZEP'],
    ['Hag', 'HAG'],
    ['Zech', 'ZEC'],
    ['Mal', 'MAL'],
    ['Matt', 'MAT'],
    ['Mark', 'MRK'],
    ['Luke', 'LUK'],
    ['John', 'JHN'],
    ['Acts', 'ACT'],
    ['Rom', 'ROM'],
    ['1Cor', '1CO'],
    ['2Cor', '2CO'],
    ['Gal', 'GAL'],
    ['Eph', 'EPH'],
    ['Phil', 'PHP'],
    ['Col', 'COL'],
    ['1Thess', '1TH'],
    ['2Thess', '2TH'],
    ['1Tim', '1TI'],
    ['2Tim', '2TI'],
    ['Titus', 'TIT'],
    ['Phlm', 'PHM'],
    ['Heb', 'HEB'],
    ['Jas', 'JAS'],
    ['1Pet', '1PE'],
    ['2Pet', '2PE'],
    ['1John', '1JN'],
    ['2John', '2JN'],
    ['3John', '3JN'],
    ['Jude', 'JUD'],
    ['Rev', 'REV'],
]);

/**
 * Slugifies the given string so that it can be used as an entity ID.
 * @param str The string to slugify.
 */
export function slugify(str: string): string {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/**
 * Removes markdown links from the given text, keeping only the link text.
 * For example, "[Esther 1:10](/esth#Esth.1.10)" becomes "Esther 1:10".
 * @param text The text to clean.
 */
export function stripMarkdownLinks(text: string): string {
    return text.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
}

interface ResolvedVerse {
    book: BookId;
    order: number;
    chapter: number;
    verse: number;
}

/**
 * Generates a dataset from the given Theographic Bible Metadata files.
 *
 * The returned dataset contains the people, places, events, and people groups
 * from the Theographic data, with all cross-entity relationships resolved to entity IDs
 * and all verse links resolved to Bible verse references.
 *
 * The transformation is deterministic: the same input always produces the same output.
 *
 * @param files The parsed Theographic JSON files.
 * @param dataset The dataset information to use. Defaults to {@link THEOGRAPHIC_DATASET}.
 */
export function generateDatasetFromTheographic(
    files: TheographicFiles,
    dataset: Dataset = THEOGRAPHIC_DATASET
): DatasetDataset {
    const logger = getLogger();

    // Validate that every Theographic book maps to a known USFM book ID.
    for (let book of files.books) {
        const osisName = book.fields.osisName;
        if (!osisBookMap.has(osisName)) {
            logger.warn(
                '[theographic] Unknown OSIS book name!',
                osisName,
                book.id
            );
        }
    }

    // Maps Theographic verse record IDs to Bible verse references.
    const verseMap = new Map<string, ResolvedVerse>();
    for (let verse of files.verses) {
        const osisRef: string = verse.fields.osisRef;
        if (!osisRef) {
            continue;
        }
        const [osisBook, chapter, verseNumber] = osisRef.split('.');
        const book = osisBookMap.get(osisBook);
        if (!book) {
            logger.warn('[theographic] Unknown OSIS reference!', osisRef);
            continue;
        }
        const chapterNumber = parseInt(chapter);
        const verseNum = parseInt(verseNumber);
        if (isNaN(chapterNumber) || isNaN(verseNum)) {
            logger.warn('[theographic] Invalid OSIS reference!', osisRef);
            continue;
        }
        verseMap.set(verse.id, {
            book,
            order: bookOrderMap.get(book) ?? 9999,
            chapter: chapterNumber,
            verse: verseNum,
        });
    }

    // Maps Theographic entity record IDs to entity references.
    const peopleMap = new Map<string, DatasetEntityRef>();
    for (let person of files.people) {
        const id = person.fields.slug;
        if (!id) {
            logger.warn(
                '[theographic] Person does not have a slug!',
                person.id
            );
            continue;
        }
        peopleMap.set(person.id, {
            id,
            type: 'people',
            name: person.fields.displayTitle ?? person.fields.name,
        });
    }

    const placesMap = new Map<string, DatasetEntityRef>();
    for (let place of files.places) {
        const id = place.fields.slug;
        if (!id) {
            logger.warn('[theographic] Place does not have a slug!', place.id);
            continue;
        }
        placesMap.set(place.id, {
            id,
            type: 'places',
            name:
                place.fields.displayTitle ??
                place.fields.kjvName ??
                place.fields.esvName,
        });
    }

    const eventsMap = new Map<string, DatasetEntityRef>();
    for (let event of files.events) {
        const title = event.fields.title;
        const eventID = event.fields.eventID;
        if (!title || typeof eventID !== 'number') {
            logger.warn(
                '[theographic] Event does not have a title or event ID!',
                event.id
            );
            continue;
        }
        eventsMap.set(event.id, {
            id: `${slugify(title)}_${eventID}`,
            type: 'events',
            name: title,
        });
    }

    const groupsMap = new Map<string, DatasetEntityRef>();
    for (let group of files.peopleGroups) {
        const name = group.fields.groupName;
        if (!name) {
            logger.warn(
                '[theographic] People group does not have a name!',
                group.id
            );
            continue;
        }
        groupsMap.set(group.id, {
            id: slugify(name),
            type: 'groups',
            name,
        });
    }

    /**
     * Resolves a list of Theographic verse record IDs into a sorted, deduplicated list of
     * verse references. Consecutive verses in the same chapter are collapsed into a single
     * reference using endVerse.
     */
    function resolveReferences(verseIds: unknown): VerseRef[] {
        if (!Array.isArray(verseIds)) {
            return [];
        }
        const resolved: ResolvedVerse[] = [];
        const seen = new Set<string>();
        for (let id of verseIds) {
            const verse = verseMap.get(id);
            if (!verse) {
                logger.warn('[theographic] Unknown verse record ID!', id);
                continue;
            }
            const key = `${verse.book}.${verse.chapter}.${verse.verse}`;
            if (seen.has(key)) {
                continue;
            }
            seen.add(key);
            resolved.push(verse);
        }

        resolved.sort(
            (a, b) =>
                a.order - b.order || a.chapter - b.chapter || a.verse - b.verse
        );

        const references: VerseRef[] = [];
        for (let verse of resolved) {
            const last = references[references.length - 1];
            if (
                last &&
                last.book === verse.book &&
                last.chapter === verse.chapter &&
                (last.endVerse ?? last.verse) === verse.verse - 1
            ) {
                last.endVerse = verse.verse;
            } else {
                references.push({
                    book: verse.book,
                    chapter: verse.chapter,
                    verse: verse.verse,
                });
            }
        }

        return references;
    }

    /**
     * Resolves a list of Theographic record IDs into a list of entity references.
     */
    function resolveRefs(
        map: Map<string, DatasetEntityRef>,
        ids: unknown
    ): DatasetEntityRef[] | undefined {
        if (!Array.isArray(ids)) {
            return undefined;
        }
        const refs: DatasetEntityRef[] = [];
        const seen = new Set<string>();
        for (let id of ids) {
            const ref = map.get(id);
            if (!ref) {
                logger.warn('[theographic] Unknown entity record ID!', id);
                continue;
            }
            if (seen.has(ref.id)) {
                continue;
            }
            seen.add(ref.id);
            refs.push({ ...ref });
        }
        return refs.length > 0 ? refs : undefined;
    }

    /**
     * Resolves a single Theographic record ID (stored as a one-element array) into an entity reference.
     */
    function resolveRef(
        map: Map<string, DatasetEntityRef>,
        ids: unknown
    ): DatasetEntityRef | undefined {
        const refs = resolveRefs(map, ids);
        return refs?.[0];
    }

    function parseYear(year: unknown): number | undefined {
        if (typeof year === 'number') {
            return year;
        }
        if (typeof year === 'string') {
            const num = parseInt(year);
            if (!isNaN(num)) {
                return num;
            }
        }
        return undefined;
    }

    function parseCoordinate(value: unknown): number | undefined {
        if (typeof value === 'number') {
            return value;
        }
        if (typeof value === 'string') {
            const num = parseFloat(value);
            if (!isNaN(num)) {
                return num;
            }
        }
        return undefined;
    }

    function parseNames(names: unknown): string[] | undefined {
        if (typeof names !== 'string') {
            return undefined;
        }
        const list = names
            .split(',')
            .map((n) => n.trim())
            .filter((n) => n.length > 0);
        return list.length > 0 ? list : undefined;
    }

    function parseDescription(dictText: unknown): string[] | undefined {
        if (!Array.isArray(dictText)) {
            return undefined;
        }
        const paragraphs = dictText
            .filter((t) => typeof t === 'string')
            .map((t) => stripMarkdownLinks(t).trim())
            .filter((t) => t.length > 0);
        return paragraphs.length > 0 ? paragraphs : undefined;
    }

    const people: DatasetPerson[] = [];
    for (let record of files.people) {
        const ref = peopleMap.get(record.id);
        if (!ref) {
            continue;
        }
        const fields = record.fields;
        const person: DatasetPerson = {
            id: ref.id,
            name: ref.name!,
            alsoCalled: parseNames(fields.alsoCalled),
            isProperName:
                typeof fields.isProperName === 'boolean'
                    ? fields.isProperName
                    : undefined,
            gender: fields.gender ?? undefined,
            description: parseDescription(fields.dictText),
            birthYear: parseYear(fields.birthYear),
            deathYear: parseYear(fields.deathYear),
            minYear: parseYear(fields.minYear),
            maxYear: parseYear(fields.maxYear),
            birthPlace: resolveRef(placesMap, fields.birthPlace),
            deathPlace: resolveRef(placesMap, fields.deathPlace),
            father: resolveRefs(peopleMap, fields.father),
            mother: resolveRefs(peopleMap, fields.mother),
            partners: resolveRefs(peopleMap, fields.partners),
            children: resolveRefs(peopleMap, fields.children),
            siblings: resolveRefs(peopleMap, fields.siblings),
            halfSiblingsSameMother: resolveRefs(
                peopleMap,
                fields.halfSiblingsSameMother
            ),
            halfSiblingsSameFather: resolveRefs(
                peopleMap,
                fields.halfSiblingsSameFather
            ),
            memberOf: resolveRefs(groupsMap, fields.memberOf),
            events: resolveRefs(eventsMap, fields.timeline),
            references: resolveReferences(fields.verses),
        };
        people.push(omitUndefined(person));
    }

    const places: DatasetPlace[] = [];
    for (let record of files.places) {
        const ref = placesMap.get(record.id);
        if (!ref) {
            continue;
        }
        const fields = record.fields;
        const place: DatasetPlace = {
            id: ref.id,
            name: ref.name!,
            kjvName: fields.kjvName ?? undefined,
            esvName: fields.esvName ?? undefined,
            aliases: parseNames(fields.aliases),
            featureType: fields.featureType ?? undefined,
            featureSubType: fields.featureSubType ?? undefined,
            latitude: parseCoordinate(fields.latitude),
            longitude: parseCoordinate(fields.longitude),
            precision: fields.precision ?? undefined,
            description: parseDescription(fields.dictText),
            comment: fields.comment ?? undefined,
            rootPlace: resolveRef(placesMap, fields.rootID),
            duplicateOf: resolveRef(placesMap, fields.duplicate_of),
            people: resolveRefs(peopleMap, fields.hasBeenHere),
            peopleBorn: resolveRefs(peopleMap, fields.peopleBorn),
            peopleDied: resolveRefs(peopleMap, fields.peopleDied),
            events: resolveRefs(eventsMap, fields.eventsHere),
            references: resolveReferences(fields.verses),
        };
        places.push(omitUndefined(place));
    }

    const events: DatasetEvent[] = [];
    for (let record of files.events) {
        const ref = eventsMap.get(record.id);
        if (!ref) {
            continue;
        }
        const fields = record.fields;
        const event: DatasetEvent = {
            id: ref.id,
            name: ref.name!,
            startDate: fields.startDate ?? undefined,
            duration: fields.duration ?? undefined,
            participants: resolveRefs(peopleMap, fields.participants),
            locations: resolveRefs(placesMap, fields.locations),
            groups: resolveRefs(groupsMap, fields.groups),
            partOf: resolveRef(eventsMap, fields.partOf),
            predecessor: resolveRef(eventsMap, fields.predecessor),
            references: resolveReferences(fields.verses),
        };
        events.push(omitUndefined(event));
    }

    const peopleGroups: DatasetPeopleGroup[] = [];
    for (let record of files.peopleGroups) {
        const ref = groupsMap.get(record.id);
        if (!ref) {
            continue;
        }
        const fields = record.fields;
        const group: DatasetPeopleGroup = {
            id: ref.id,
            name: ref.name!,
            members: resolveRefs(peopleMap, fields.members),
            events: resolveRefs(eventsMap, fields.events_dev),
            references: resolveReferences(fields.verses),
        };
        peopleGroups.push(omitUndefined(group));
    }

    return {
        ...dataset,
        books: [],
        people: sortBy(people, (p) => p.id),
        places: sortBy(places, (p) => p.id),
        events: sortBy(events, (e) => e.id),
        peopleGroups: sortBy(peopleGroups, (g) => g.id),
    };
}

/**
 * Returns a copy of the given object with all undefined properties removed.
 * This keeps the generated JSON files free of explicit "undefined"/null noise
 * and makes the output deterministic.
 */
function omitUndefined<T extends object>(obj: T): T {
    const result: any = {};
    for (let key of Object.keys(obj)) {
        const value = (obj as any)[key];
        if (value !== undefined) {
            result[key] = value;
        }
    }
    return result;
}
