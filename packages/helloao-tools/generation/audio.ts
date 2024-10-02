import { padStart } from 'lodash';
import { bookOrderMap } from './book-order.js';
import { TranslationBookChapterAudioLinks } from './common-types.js';

type AudioTranslationUrlGenerator = (bookId: string, chapter: number) => string;

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
            bookId
        )}_${chapterStr}`;

        if (postfix) {
            link += `_${postfix}`;
        }

        link += '.mp3';

        return link;
    };
};

/**
 * A map of translation IDs to a map of reader IDs to the URL generator for the audio file.
 */
export const KNOWN_AUDIO_TRANSLATIONS: Map<
    string,
    Map<string, AudioTranslationUrlGenerator>
> = new Map([
    [
        'BSB',
        new Map([
            ['gilbert', openBibleUrlGenerator('BSB', 'gilbert', 'G')],
            ['hays', openBibleUrlGenerator('BSB', 'hays', 'H')],
            ['souer', openBibleUrlGenerator('BSB', 'souer', null)],
        ]),
    ],
]);

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
