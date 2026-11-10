/**
 * The contents of a `<book>.biblejson` audio timings file, as published in
 * https://github.com/New-York-Chinese-Seventh-day-Adventist/sda-church-app/tree/main/assets/bible/audio-timings
 *
 * There is one folder per narrator and one file per book (named by its lowercase USFM ID, e.g. `1ch.biblejson`).
 * `chapters[0]` is always null, so `chapters[n]` is chapter n. Each chapter is a list of verse start times
 * in seconds, indexed by verse number (index 0 is verse 1), or null when the chapter has no times.
 * A verse with no time (for example, one the text leaves out or merges with another verse) is null.
 */
export interface VerseNumberedAudioTimingsBook {
    chapters: (VerseNumberedStartTimes | null)[];
}

/**
 * Verse start times indexed by verse number (index 0 is verse 1).
 */
export type VerseNumberedStartTimes = (number | null)[];

/**
 * Parses and validates the contents of an audio timings book file.
 * @param json The JSON text of the file.
 */
export function parseVerseNumberedAudioTimingsBook(
    json: string
): VerseNumberedAudioTimingsBook {
    const data = JSON.parse(json);
    if (!data || typeof data !== 'object' || !Array.isArray(data.chapters)) {
        throw new Error('Expected an object with a "chapters" array.');
    }
    for (let i = 0; i < data.chapters.length; i++) {
        const chapter = data.chapters[i];
        if (chapter === null || chapter === undefined) {
            continue;
        }
        if (!Array.isArray(chapter)) {
            throw new Error(`Chapter ${i} must be an array or null.`);
        }
        for (let time of chapter) {
            if (
                time !== null &&
                (typeof time !== 'number' || !Number.isFinite(time))
            ) {
                throw new Error(
                    `Chapter ${i} contains an invalid time: ${JSON.stringify(time)}.`
                );
            }
        }
    }
    return data;
}

export type VerseOrderTimingsResult =
    | { verses: number[]; error?: undefined }
    | { verses?: undefined; error: string };

/**
 * Converts verse start times that are indexed by verse number into the format the API uses:
 * one start time per verse, in the order of the chapter's verses.
 *
 * Fails when the times don't line up with the translation's verses: a verse in the chapter has no time,
 * or there is a time for a verse that the chapter doesn't have. Both mean the times were made from a different
 * versification than the translation in the database, and storing them would mark the wrong verses.
 *
 * @param verseNumbers The numbers of the verses in the chapter, in order.
 * @param times The start times, indexed by verse number.
 */
export function toVerseOrderTimings(
    verseNumbers: number[],
    times: VerseNumberedStartTimes
): VerseOrderTimingsResult {
    const missing = verseNumbers.filter(
        (n) => times[n - 1] === null || times[n - 1] === undefined
    );
    if (missing.length > 0) {
        return { error: `no time for verse(s) ${missing.join(', ')}` };
    }

    const known = new Set(verseNumbers);
    const extra: number[] = [];
    times.forEach((time, index) => {
        if (time !== null && !known.has(index + 1)) {
            extra.push(index + 1);
        }
    });
    if (extra.length > 0) {
        return {
            error: `time(s) for verse(s) ${extra.join(', ')}, which the chapter doesn't have`,
        };
    }

    const verses = verseNumbers.map((n) => times[n - 1] as number);
    for (let i = 1; i < verses.length; i++) {
        if (verses[i] < verses[i - 1]) {
            return {
                error: `verse ${verseNumbers[i]} starts before verse ${verseNumbers[i - 1]}`,
            };
        }
    }

    return { verses };
}
