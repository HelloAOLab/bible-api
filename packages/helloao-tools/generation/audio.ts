import { padStart } from 'es-toolkit/compat';
import { bookOrderMap } from './book-order.js';
import { TranslationBookChapterAudioLinks } from './common-types.js';
import {
    AUDIO_FILE_TRANSLATIONS,
    AUDIO_TRANSLATIONS,
    AudioSource,
    AudioTranslations,
} from './audio-translations.js';

export type { AudioSource, AudioTranslations };

type AudioTranslationUrlGenerator = (bookId: string, chapter: number) => string;

export const openBibleFilenameGenerator: (
    translation: string,
    postfix: string | null
) => AudioTranslationUrlGenerator = (translation, postfix) => {
    return (bookId, chapter) => {
        const bookOrder = padStart(
            bookOrderMap.get(bookId)!.toString(),
            2,
            '0'
        );
        const chapterStr = padStart(chapter.toString(), 3, '0');

        let filename = `${translation}_${bookOrder}_${capitalize(
            bookId === 'TIT' ? 'TTS' : bookId
        )}_${chapterStr}`;

        if (postfix) {
            filename += `_${postfix}`;
        }

        filename += '.mp3';

        return filename;
    };
};

const openBibleUrlGenerator: (
    translation: string,
    reader: string,
    postfix: string | null
) => AudioTranslationUrlGenerator = (translation, reader, postfix) => {
    return (bookId, chapter) => {
        const bookOrder = padStart(
            bookOrderMap.get(bookId)!.toString(),
            2,
            '0'
        );
        const chapterStr = padStart(chapter.toString(), 3, '0');

        let link = `https://openbible.com/audio/${reader}/${translation}_${bookOrder}_${capitalize(
            bookId === 'TIT' ? 'TTS' : bookId
        )}_${chapterStr}`;

        if (postfix) {
            link += `_${postfix}`;
        }

        link += '.mp3';

        return link;
    };
};

const freeUseBibleApiGenerator: (
    translation: string,
    reader: string
) => AudioTranslationUrlGenerator = (translation, reader) => {
    return (bookId, chapter) => {
        const link = `https://audio.bible.helloao.org/api/${translation}/${bookId}/${chapter.toString()}/audio/${reader}.mp3`;
        return link;
    };
};

/**
 * Creates the URL generator for the given audio source.
 * @param source The source of the audio.
 */
export function createAudioUrlGenerator(
    source: AudioSource
): AudioTranslationUrlGenerator {
    if (source.type === 'free-use-bible-api') {
        return freeUseBibleApiGenerator(source.translation, source.reader);
    } else {
        return openBibleFilenameGenerator(source.translation, source.postfix);
    }
}

/**
 * Creates a map of translation IDs to a map of reader IDs to the URL generator for the audio file.
 * @param translations The audio sources for each translation.
 */
function createAudioUrlGenerators(
    translations: AudioTranslations
): Map<string, Map<string, AudioTranslationUrlGenerator>> {
    return new Map(
        Object.entries(translations).map(([translationId, readers]) => [
            translationId,
            new Map(
                Object.entries(readers).map(([reader, source]) => [
                    reader,
                    createAudioUrlGenerator(source),
                ])
            ),
        ])
    );
}

/**
 * Gets the audio sources that are linked from the chapters of the given translation.
 * Returns null if the translation has no known audio.
 *
 * The sources are plain data, so they can be included in hashes to determine when the translation needs to be reprocessed.
 * @param translationId The ID of the translation.
 */
export function getAudioSourcesForTranslation(
    translationId: string
): Record<string, AudioSource> | null {
    return Object.hasOwn(AUDIO_TRANSLATIONS, translationId)
        ? AUDIO_TRANSLATIONS[translationId]
        : null;
}

/**
 * A map of translation IDs to a map of reader IDs to the URL generator for the audio file.
 * The translations are defined in audio-translations.ts.
 */
export const KNOWN_AUDIO_FILE_TRANSLATIONS: Map<
    string,
    Map<string, AudioTranslationUrlGenerator>
> = createAudioUrlGenerators(AUDIO_FILE_TRANSLATIONS);

/**
 * A map of translation IDs to a map of reader IDs to the URL generator for the audio file.
 * The translations are defined in audio-translations.ts.
 */
export const KNOWN_AUDIO_TRANSLATIONS: Map<
    string,
    Map<string, AudioTranslationUrlGenerator>
> = createAudioUrlGenerators(AUDIO_TRANSLATIONS);

/**
 * Gets the audio URLs for the given translation, book, and chapter.
 * @param translationId The ID of the translation.
 * @param bookId The ID of the book.
 * @param chapter The number of the chapter.
 */
export function getAudioUrlsForChapter(
    translationId: string,
    bookId: string,
    chapter: number
): TranslationBookChapterAudioLinks {
    const translation = KNOWN_AUDIO_TRANSLATIONS.get(translationId);
    if (!translation) {
        return {};
    }

    const links: TranslationBookChapterAudioLinks = {};
    for (let [reader, generator] of translation) {
        const url = generator(bookId, chapter);
        if (url) {
            links[reader] = url;
        }
    }
    return links;
}

/**
 * Capitalizes the first letter of the given string.
 * @param str The string to capitalize.
 */
export function capitalize(str: string): string {
    const char = str.charAt(0);
    if (/[0-9]/.test(char)) {
        return (
            str.charAt(0) +
            str.charAt(1).toUpperCase() +
            str.slice(2).toLowerCase()
        );
    }

    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
