import { onMounted, ref } from 'vue';
import {
    countLicenceRows,
    LICENCE_ROWS,
    type LicenceRow,
} from '../licenceRows';

/**
 * The live translation, language and licence counts, for the pages that print
 * them (the home page and the open ecosystem page).
 *
 * The catalog grows. The printed numbers are filled from the live endpoint
 * rather than left to rot, but only once a session: the file is large. Until
 * the live counts arrive, the snapshot below is shown.
 */

// The counts as of 12 November 2026, shown until the live ones arrive.
const translationCount = ref(1505);
const languageCount = ref(1168);
const licenceCounts = ref<Record<LicenceRow, number>>({
    publicDomain: 111,
    attribution: 39,
    shareAlike: 442,
    noDerivatives: 89,
    nonCommercialNoDerivatives: 777,
    other: 47,
});

let started = false;

function paintCounts(
    t: number,
    l: number,
    lic?: Partial<Record<LicenceRow, number>>
) {
    if (t) translationCount.value = t;
    if (l) languageCount.value = l;
    // Only a complete set of counts replaces the snapshot.
    if (lic && LICENCE_ROWS.every((row) => typeof lic[row] === 'number')) {
        licenceCounts.value = lic as Record<LicenceRow, number>;
    }
}

function fetchCounts() {
    if (started) return;
    started = true;

    let hit: string | null = null;
    try {
        hit = sessionStorage.getItem('fuba-counts');
    } catch (e) {}
    if (hit) {
        try {
            const c = JSON.parse(hit);
            // A count cached before the licence breakdown was added has no
            // `lic`, so fetch again rather than show the snapshot.
            if (c.lic) {
                paintCounts(c.t, c.l, c.lic);
                return;
            }
        } catch (e) {}
    }

    const go = () => {
        fetch('https://bible.helloao.org/api/available_translations.json')
            .then((r) => (r.ok ? r.json() : null))
            .then((j) => {
                if (!j || !j.translations || !j.translations.length) return;
                const t = j.translations.length;
                const l = new Set(
                    j.translations
                        .map((x: any) => x.language)
                        .filter((x: any) => !!x)
                ).size;
                const lic = countLicenceRows(j.translations);
                paintCounts(t, l, lic);
                try {
                    sessionStorage.setItem(
                        'fuba-counts',
                        JSON.stringify({ t, l, lic })
                    );
                } catch (e) {}
            })
            .catch(() => {});
    };

    if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(go, { timeout: 4000 });
    } else {
        setTimeout(go, 1200);
    }
}

/** The live counts. Fetches them once the calling component mounts. */
export function useCounts() {
    onMounted(fetchCounts);
    return { translationCount, languageCount, licenceCounts };
}
