/**
 * The list of translations that have known audio.
 *
 * This file only contains data and must not import any code.
 * The build leaves it out of the processor code hash (see tools/build.ts), so that changing it doesn't cause every translation to be reprocessed.
 * Instead, the sync includes the audio sources of each translation in that translation's settings (see packages/helloao-cli/sync.ts),
 * so only the translations whose audio changed are reprocessed.
 */

/**
 * Describes where the audio for a translation reader comes from.
 * See the generators in audio.ts.
 *
 * - "free-use-bible-api" means that the audio is hosted by the Free Use Bible API audio host (audio.bible.helloao.org).
 * - "open-bible-filename" means that the audio is stored in files named like the ones from openbible.com.
 */
export type AudioSource =
    | {
          type: 'free-use-bible-api';

          /**
           * The ID of the translation that the audio is hosted under.
           */
          translation: string;

          /**
           * The ID of the reader that the audio is hosted under.
           */
          reader: string;
      }
    | {
          type: 'open-bible-filename';

          /**
           * The ID of the translation that is used in the filenames.
           */
          translation: string;

          /**
           * The postfix that is added to the filenames.
           */
          postfix: string | null;
      };

/**
 * A map of translation IDs to a map of reader IDs to the source of the audio.
 */
export type AudioTranslations = Record<string, Record<string, AudioSource>>;

/**
 * The audio sources for the readers of the BSB that are hosted by the Free Use Bible API.
 */
const BSB_AUDIO: Record<string, AudioSource> = {
    hays: { type: 'free-use-bible-api', translation: 'BSB', reader: 'hays' },
    souer: { type: 'free-use-bible-api', translation: 'BSB', reader: 'souer' },
    david: { type: 'free-use-bible-api', translation: 'BSB', reader: 'david' },
};

/**
 * The audio sources for the Chinese Union Version that are hosted by the Free Use Bible API.
 */
const CUV_AUDIO: Record<string, AudioSource> = {
    mandarin: {
        type: 'free-use-bible-api',
        translation: 'cmn_cuv',
        reader: 'mandarin',
    },
};

/**
 * The audio sources for the Chinese Union Version from Wordproject (https://www.wordproject.org/bibles/audio/index.htm).
 * The CUV has both a Mandarin and a Cantonese reading. The Mandarin files are named wordproject.mp3.
 */
const CUV_WORDPROJECT_AUDIO: Record<string, AudioSource> = {
    wordproject_mandarin: {
        type: 'free-use-bible-api',
        translation: 'cmn_cuv',
        reader: 'wordproject',
    },
    wordproject_cantonese: {
        type: 'free-use-bible-api',
        translation: 'cmn_cuv',
        reader: 'wordproject_cantonese',
    },
};

/**
 * The translations that have Wordproject audio (https://www.wordproject.org/bibles/audio/index.htm)
 * hosted by the Free Use Bible API under their own ID, with the "wordproject" reader.
 * The Chinese Union Version is handled separately by {@link CUV_WORDPROJECT_AUDIO}.
 */
export const WORDPROJECT_AUDIO_TRANSLATIONS: readonly string[] = [
    'amh_amh',
    'arb_vdv',
    'ces_bkr',
    'deu_l12',
    'eng_kjv',
    'fra_lsg',
    'grc_gtr',
    'heb_mod',
    'HINIRV',
    'hun_bib',
    'ita_riv',
    'jpn_kou',
    'kor_old',
    'lat_clv',
    'mal_fbf',
    'mya_jvb',
    'pes_pbs',
    'ron_924',
    'rus_syn',
    'som_sim',
    'spa_r09',
    'srp_dkl',
    'tam_irv',
    'tha_kjv',
    'vie_1934',
];

/**
 * The Chinese Union Version translations. They all share the same CUV audio files.
 */
const CUV_TRANSLATIONS = ['cmn_cuv', 'cmn_cuvmps', 'cmn_cuvmpt', 'cmn_cu1'];

/**
 * The audio that is linked from the chapters of each translation.
 */
export const AUDIO_TRANSLATIONS: AudioTranslations = {
    BSB: BSB_AUDIO,
    // AAB re-uses the BSB audio files
    AAB: BSB_AUDIO,
    // The Chinese Union Version translations all share the same CUV audio files
    ...Object.fromEntries(
        CUV_TRANSLATIONS.map((translationId) => [
            translationId,
            { ...CUV_AUDIO, ...CUV_WORDPROJECT_AUDIO },
        ])
    ),
    ...Object.fromEntries(
        WORDPROJECT_AUDIO_TRANSLATIONS.map((translationId) => [
            translationId,
            {
                wordproject: {
                    type: 'free-use-bible-api',
                    translation: translationId,
                    reader: 'wordproject',
                },
            },
        ])
    ),
};

/**
 * The audio files that can be copied from a local directory for each translation.
 */
export const AUDIO_FILE_TRANSLATIONS: AudioTranslations = {
    BSB: {
        hays: { type: 'open-bible-filename', translation: 'BSB', postfix: 'H' },
        souer: {
            type: 'open-bible-filename',
            translation: 'BSB',
            postfix: null,
        },
        david: {
            type: 'open-bible-filename',
            translation: 'BSB',
            postfix: 'D',
        },
    },
};
