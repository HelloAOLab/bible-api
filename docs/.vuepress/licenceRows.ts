/**
 * Sorts the API's translations into the rows of the home page's licence
 * breakdown ("Even in our API, few translations are ideal."), from the
 * structured `license` terms in available_translations.json.
 */

/** The structured licence terms the API gives each translation. */
export interface LicenceTerms {
    attribution: 'required' | 'not-required';
    commercialUse: 'allowed' | 'not-allowed';
    derivatives: 'allowed' | 'not-allowed';
    copyleft: boolean;
    publicDomain: boolean;
}

export type LicenceRow =
    | 'publicDomain'
    | 'attribution'
    | 'shareAlike'
    | 'noDerivatives'
    | 'nonCommercialNoDerivatives'
    | 'other';

export const LICENCE_ROWS: LicenceRow[] = [
    'publicDomain',
    'attribution',
    'shareAlike',
    'noDerivatives',
    'nonCommercialNoDerivatives',
    'other',
];

/**
 * The row a translation belongs in.
 *
 * - Public domain: dedicated to the public domain.
 * - Attribution only: derivatives and commercial use allowed, no share-alike
 *   (CC BY, and any other licence whose only possible condition is credit).
 * - Share-alike: derivatives and commercial use allowed under the same licence.
 * - No derivatives: commercial use allowed, derivatives not (CC BY-ND).
 * - Non-commercial, no derivatives: neither allowed (CC BY-NC-ND).
 * - Other: everything else, including non-commercial licences that allow
 *   derivatives (CC BY-NC, BY-NC-SA) and translations with no detected terms.
 */
export function licenceRow(
    license: LicenceTerms | null | undefined
): LicenceRow {
    if (!license) return 'other';
    if (license.publicDomain) return 'publicDomain';
    const derivatives = license.derivatives === 'allowed';
    const commercial = license.commercialUse === 'allowed';
    if (derivatives && commercial) {
        return license.copyleft ? 'shareAlike' : 'attribution';
    }
    if (!derivatives && commercial) return 'noDerivatives';
    if (!derivatives && !commercial) return 'nonCommercialNoDerivatives';
    return 'other';
}

/** How many translations fall in each row. */
export function countLicenceRows(
    translations: { license?: LicenceTerms | null }[]
): Record<LicenceRow, number> {
    const counts = Object.fromEntries(
        LICENCE_ROWS.map((row) => [row, 0])
    ) as Record<LicenceRow, number>;
    for (const t of translations) {
        counts[licenceRow(t.license)]++;
    }
    return counts;
}
