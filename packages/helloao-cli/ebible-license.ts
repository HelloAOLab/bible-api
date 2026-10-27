import { DOMParser, Element } from 'linkedom';
import { License } from '@helloao/tools/generation/index.js';
import { log } from '@helloao/tools';

/**
 * Maps a Creative Commons license code (the path segment that follows
 * `/licenses/` or `/publicdomain/` in a creativecommons.org URL) to the
 * structured license terms that it implies.
 */
const CC_LICENSE_TERMS: Record<string, License> = {
    zero: {
        attribution: 'not-required',
        commercialUse: 'allowed',
        derivatives: 'allowed',
        copyleft: false,
        publicDomain: true,
    },
    mark: {
        attribution: 'not-required',
        commercialUse: 'allowed',
        derivatives: 'allowed',
        copyleft: false,
        publicDomain: true,
    },
    by: {
        attribution: 'required',
        commercialUse: 'allowed',
        derivatives: 'allowed',
        copyleft: false,
        publicDomain: false,
    },
    'by-sa': {
        attribution: 'required',
        commercialUse: 'allowed',
        derivatives: 'allowed',
        copyleft: true,
        publicDomain: false,
    },
    'by-nd': {
        attribution: 'required',
        commercialUse: 'allowed',
        derivatives: 'not-allowed',
        copyleft: false,
        publicDomain: false,
    },
    'by-nc': {
        attribution: 'required',
        commercialUse: 'not-allowed',
        derivatives: 'allowed',
        copyleft: false,
        publicDomain: false,
    },
    'by-nc-sa': {
        attribution: 'required',
        commercialUse: 'not-allowed',
        derivatives: 'allowed',
        copyleft: true,
        publicDomain: false,
    },
    'by-nc-nd': {
        attribution: 'required',
        commercialUse: 'not-allowed',
        derivatives: 'not-allowed',
        copyleft: false,
        publicDomain: false,
    },
};

const CC_URL_PATTERN =
    /(?:www\.)?creativecommons\.org\/(?:licenses|publicdomain)\/([a-zA-Z-]+)\/[0-9.]+/i;

/**
 * Parses a creativecommons.org URL and returns the license terms that it implies.
 * Returns null if the URL isn't a recognized creativecommons.org license URL.
 */
export function ccLicenseFromUrl(url: string): License | null {
    const match = url.match(CC_URL_PATTERN);
    if (!match) {
        return null;
    }

    return ccLicenseFromCode(match[1]);
}

/**
 * Gets the license terms implied by the given Creative Commons license code (e.g. `by-sa`, `by-nc-nd`, `zero`).
 * Returns null if the code isn't recognized.
 */
export function ccLicenseFromCode(code: string): License | null {
    const terms = CC_LICENSE_TERMS[code.toLowerCase()];
    return terms ? { ...terms } : null;
}

/**
 * Scans the HTML of an ebible.org translation details page for a link to
 * creativecommons.org and returns the license terms that it implies.
 * Returns null if no such link is found.
 */
export function extractCcLicenseFromDetailsHtml(html: string): License | null {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const links = Array.from(
        doc.querySelectorAll('a[href*="creativecommons.org"]')
    ) as Element[];

    for (const link of links) {
        const href = link.getAttribute('href');
        if (!href) {
            continue;
        }
        const license = ccLicenseFromUrl(href);
        if (license) {
            return license;
        }
    }

    return null;
}

/**
 * Gets the eBible translation ID from an ebible.org translation details page URL
 * (e.g. `https://ebible.org/Scriptures/details.php?id=engwebp` returns `engwebp`).
 * Returns null if the URL isn't an ebible.org details page URL.
 */
export function ebibleIdFromUrl(url: string | null | undefined): string | null {
    if (!url) {
        return null;
    }

    let parsed: URL;
    try {
        parsed = new URL(url);
    } catch {
        return null;
    }

    const host = parsed.hostname.toLowerCase();
    if (host !== 'ebible.org' && host !== 'www.ebible.org') {
        return null;
    }
    if (parsed.pathname.toLowerCase() !== '/scriptures/details.php') {
        return null;
    }

    return parsed.searchParams.get('id') || null;
}

/**
 * Determines whether the given ebible.org copyright notice indicates that
 * the translation has been dedicated to the public domain.
 */
export function isPublicDomainCopyrightText(
    copyright: string | null | undefined
): boolean {
    if (!copyright) {
        return false;
    }
    return /public domain/i.test(copyright);
}

const PUBLIC_DOMAIN_LICENSE: License = {
    attribution: 'not-required',
    commercialUse: 'allowed',
    derivatives: 'allowed',
    copyleft: false,
    publicDomain: true,
};

/**
 * Fetches the ebible.org translation details page for the given source and
 * attempts to determine the translation's license.
 *
 * Detection order:
 * 1. Look for a link to creativecommons.org on the details page.
 * 2. If none is found (or the page can't be fetched), fall back to
 *    searching the copyright text for "public domain".
 * 3. Otherwise, the license is undetermined and null is returned.
 */
export async function detectEBibleLicense(source: {
    id: string;
    copyright: string;
}): Promise<License | null> {
    const logger = log.getLogger();

    try {
        const response = await fetch(
            `https://ebible.org/Scriptures/details.php?id=${source.id}`
        );
        if (response.ok) {
            const html = await response.text();
            const license = extractCcLicenseFromDetailsHtml(html);
            if (license) {
                return license;
            }
        }
    } catch (err) {
        logger.warn(
            `Failed to fetch ebible.org details page for ${source.id}:`,
            err
        );
    }

    if (isPublicDomainCopyrightText(source.copyright)) {
        return { ...PUBLIC_DOMAIN_LICENSE };
    }

    return null;
}
