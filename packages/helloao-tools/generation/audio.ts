import { padStart } from 'es-toolkit/compat';
import { bookOrderMap } from './book-order.js';
import { TranslationBookChapterAudioLinks } from './common-types.js';

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
 * A map of translation IDs to a map of reader IDs to the URL generator for the audio file.
 */
export const KNOWN_AUDIO_FILE_TRANSLATIONS: Map<
    string,
    Map<string, AudioTranslationUrlGenerator>
> = new Map([
    [
        'BSB',
        new Map([
            ['hays', openBibleFilenameGenerator('BSB', 'H')],
            ['souer', openBibleFilenameGenerator('BSB', null)],
            ['david', openBibleFilenameGenerator('BSB', 'D')],
        ]),
    ],
]);

/**
 * The Chinese Union Version translations. They all share the CUV audio files.
 */
const CUV_TRANSLATIONS = ['cmn_cuv', 'cmn_cuvmps', 'cmn_cuvmpt', 'cmn_cu1'];

export interface WordprojectAudio {
    /**
     * The ID of the translation.
     */
    translationId: string;

    /**
     * The ID of the reader in the API.
     */
    reader: string;

    /**
     * The name of the audio file (without .mp3) on the audio server:
     * /api/{audioTranslationId}/{book}/{chapter}/audio/{file}.mp3
     */
    file: string;

    /**
     * The translation whose folder the audio files are in on the audio server.
     * Defaults to {@link translationId}.
     */
    audioTranslationId?: string;
}

/**
 * The Wordproject audio (https://www.wordproject.org/bibles/audio/index.htm)
 * on the Free Use Bible API audio server.
 */
export const WORDPROJECT_AUDIO: readonly WordprojectAudio[] = [
    { translationId: 'amh_amh', reader: 'wordproject', file: 'wordproject' },
    { translationId: 'arb_vdv', reader: 'wordproject', file: 'wordproject' },
    { translationId: 'ces_bkr', reader: 'wordproject', file: 'wordproject' },
    // The CUV has both a Mandarin and a Cantonese reading, stored under cmn_cuv and shared by
    // all the CUV translations. The Mandarin files are named wordproject.mp3.
    ...CUV_TRANSLATIONS.flatMap((translationId) => [
        {
            translationId,
            reader: 'wordproject_mandarin',
            file: 'wordproject',
            audioTranslationId: 'cmn_cuv',
        },
        {
            translationId,
            reader: 'wordproject_cantonese',
            file: 'wordproject_cantonese',
            audioTranslationId: 'cmn_cuv',
        },
    ]),
    { translationId: 'deu_l12', reader: 'wordproject', file: 'wordproject' },
    { translationId: 'eng_kjv', reader: 'wordproject', file: 'wordproject' },
    { translationId: 'fra_lsg', reader: 'wordproject', file: 'wordproject' },
    { translationId: 'grc_gtr', reader: 'wordproject', file: 'wordproject' },
    { translationId: 'heb_mod', reader: 'wordproject', file: 'wordproject' },
    { translationId: 'HINIRV', reader: 'wordproject', file: 'wordproject' },
    { translationId: 'hun_bib', reader: 'wordproject', file: 'wordproject' },
    { translationId: 'ita_riv', reader: 'wordproject', file: 'wordproject' },
    { translationId: 'jpn_kou', reader: 'wordproject', file: 'wordproject' },
    { translationId: 'kor_old', reader: 'wordproject', file: 'wordproject' },
    { translationId: 'lat_clv', reader: 'wordproject', file: 'wordproject' },
    { translationId: 'mal_fbf', reader: 'wordproject', file: 'wordproject' },
    { translationId: 'mya_jvb', reader: 'wordproject', file: 'wordproject' },
    { translationId: 'pes_pbs', reader: 'wordproject', file: 'wordproject' },
    { translationId: 'ron_924', reader: 'wordproject', file: 'wordproject' },
    { translationId: 'rus_syn', reader: 'wordproject', file: 'wordproject' },
    { translationId: 'som_sim', reader: 'wordproject', file: 'wordproject' },
    { translationId: 'spa_r09', reader: 'wordproject', file: 'wordproject' },
    { translationId: 'srp_dkl', reader: 'wordproject', file: 'wordproject' },
    { translationId: 'tam_irv', reader: 'wordproject', file: 'wordproject' },
    { translationId: 'tha_kjv', reader: 'wordproject', file: 'wordproject' },
    { translationId: 'vie_1934', reader: 'wordproject', file: 'wordproject' },
];

/**
 * Adds the {@link WORDPROJECT_AUDIO} readers to the given translations.
 * @param translations The map of translations to add the readers to.
 */
function addWordprojectAudio(
    translations: Map<string, Map<string, AudioTranslationUrlGenerator>>
): Map<string, Map<string, AudioTranslationUrlGenerator>> {
    for (const {
        translationId,
        reader,
        file,
        audioTranslationId,
    } of WORDPROJECT_AUDIO) {
        let readers = translations.get(translationId);
        if (!readers) {
            readers = new Map();
            translations.set(translationId, readers);
        }
        readers.set(
            reader,
            freeUseBibleApiGenerator(audioTranslationId ?? translationId, file)
        );
    }
    return translations;
}

/**
 * A map of translation IDs to a map of reader IDs to the URL generator for the audio file.
 */
export const KNOWN_AUDIO_TRANSLATIONS: Map<
    string,
    Map<string, AudioTranslationUrlGenerator>
> = addWordprojectAudio(
    new Map([
        [
            'BSB',
            new Map([
                ['hays', freeUseBibleApiGenerator('BSB', 'hays')],
                ['souer', freeUseBibleApiGenerator('BSB', 'souer')],
                ['david', freeUseBibleApiGenerator('BSB', 'david')],
            ]),
        ],
        [
            'AAB',
            // AAB re-uses the BSB audio files
            new Map([
                ['hays', freeUseBibleApiGenerator('BSB', 'hays')],
                ['souer', freeUseBibleApiGenerator('BSB', 'souer')],
                ['david', freeUseBibleApiGenerator('BSB', 'david')],
            ]),
        ],
        // The Chinese Union Version translations all share the same CUV audio files
        ...CUV_TRANSLATIONS.map(
            (translationId) =>
                [
                    translationId,
                    new Map([
                        [
                            'mandarin',
                            freeUseBibleApiGenerator('cmn_cuv', 'mandarin'),
                        ],
                    ]),
                ] as const
        ),
    ])
);

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
