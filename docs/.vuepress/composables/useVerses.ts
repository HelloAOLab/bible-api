import { computed, type ComputedRef } from 'vue';
import { fillLabel } from './formatLabel';
import { useLabels, useLocale } from './useLocale';
import {
    HOME_VERSES,
    type HomeVerse,
    type Verses,
    type VerseText,
} from '../verses';

// Every locale's verses, keyed by locale path. Defined in config.ts.
declare const __SITE_VERSES__: Record<string, Verses>;

export type QuotedVerse = VerseText & {
    /** The language of the text, for its `lang` attribute. */
    lang: string;
    /** e.g. "Matthew 10:8" or "Matthew 6:25–34". */
    reference: string;
    /** The link's accessible name, e.g. "Open Matthew 10:8 in Seed Bible". */
    open: string;
    /** The verse in Seed Bible. */
    url: string;
};

/**
 * The quoted verses, in the language being viewed.
 *
 * They come from verses.json files rather than the machine-translated labels,
 * falling back to English for a language that has none. See verses.ts.
 */
export function useVerses(): ComputedRef<Record<HomeVerse, QuotedVerse>> {
    const locale = useLocale();
    const labels = useLabels();

    return computed(() => {
        const code = locale.value === '/' ? 'en' : locale.value.slice(1, -1);
        return Object.fromEntries(
            (Object.keys(HOME_VERSES) as HomeVerse[]).map((key) => {
                const own = __SITE_VERSES__[locale.value]?.[key];
                const verse = own ?? __SITE_VERSES__['/'][key]!;
                const home = HOME_VERSES[key];
                const { book } = home;
                // A translation can number the verse differently.
                const chapter = verse.chapter ?? home.chapter;
                const first = verse.verse ?? home.verse;
                const endVerse =
                    home.endVerse && first + home.endVerse - home.verse;
                const range = endVerse ? `${first}–${endVerse}` : `${first}`;
                const reference = `${verse.bookName} ${chapter}:${range}`;
                return [
                    key,
                    {
                        ...verse,
                        lang: verse.language ?? (own ? code : 'en'),
                        reference,
                        open: fillLabel(labels.value.home.openVerse, {
                            reference,
                        }),
                        url:
                            'https://seedbible.org/?translation=' +
                            encodeURIComponent(verse.translationId) +
                            `&book=${book}&chapter=${chapter}&verse=` +
                            (endVerse ? `${first}-${endVerse}` : first),
                    },
                ];
            })
        ) as Record<HomeVerse, QuotedVerse>;
    });
}
