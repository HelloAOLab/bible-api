import hash from 'hash.js';
const { sha256 } = hash;
import path from 'node:path';
import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import type { Database } from 'better-sqlite3';
import { log } from '@helloao/tools';
import { getTranslationId } from '@helloao/tools/utils.js';
import {
    InputTranslationMetadata,
    License,
} from '@helloao/tools/generation/index.js';
import { FetchBibleSource } from './prisma-gen/client.js';
import {
    ccLicenseFromCode,
    ccLicenseFromUrl,
    ebibleIdFromUrl,
} from './ebible-license.js';

/**
 * The URL of the fetch.bible manifest, which lists every translation that fetch.bible publishes.
 */
export const FETCH_BIBLE_MANIFEST_URL = 'https://v1.fetch.bible/manifest.json';

/**
 * The GitHub repository that the fetch.bible collection is stored in.
 */
export const FETCH_BIBLE_COLLECTION_REPO = 'gracious-tech/fetch_collection';

/**
 * The branch (or other git ref) of the fetch.bible collection repository that translations are downloaded from.
 */
export const FETCH_BIBLE_COLLECTION_REF = 'main';

/**
 * The base URL of the GitHub REST API.
 */
export const GITHUB_API_URL = 'https://api.github.com';

/**
 * The base URL that raw files in GitHub repositories can be downloaded from.
 */
export const GITHUB_RAW_URL = 'https://raw.githubusercontent.com';

export interface FetchBibleName {
    local: string;
    local_abbrev: string;
    english: string;
    english_abbrev: string;
}

export interface FetchBibleRestrictions {
    forbid_limitless?: boolean;
    forbid_commercial: boolean;
    forbid_derivatives: boolean | 'same-license';
    forbid_attributionless: boolean;
    forbid_other?: boolean;
}

export interface FetchBibleCopyright {
    attribution: string;
    attribution_url: string;
    licenses: {
        license: string | FetchBibleRestrictions;
        url: string;
    }[];
}

/**
 * A translation as it is listed in the fetch.bible manifest.
 */
export interface FetchBibleManifestItem {
    name: FetchBibleName;
    year: number;
    books_ot: true | string[];
    books_nt: true | string[];
    copyright: FetchBibleCopyright;
    direction: 'ltr' | 'rtl';
    tags?: string[];
}

/**
 * The parts of the fetch.bible manifest that are used for sourcing translations.
 */
export interface FetchBibleManifest {
    bibles: Record<string, FetchBibleManifestItem>;
    books_ordered: string[];
}

/**
 * The meta.json file that the fetch.bible collection stores for each translation.
 */
export interface FetchBibleCollectionMeta {
    name: FetchBibleName;
    year: number | null;
    direction: 'ltr' | 'rtl';
    copyright: FetchBibleCopyright;
    ids: Record<string, string | undefined>;
    source: {
        service: string;
        format: 'usfm' | 'usx';
        url: string | string[] | null;
        updated: string;
        revision: number;
    };
    tags?: string[];
}

/**
 * A translation that is available from fetch.bible.
 */
export interface FetchBibleCatalogEntry {
    /**
     * The source record for the translation.
     */
    source: FetchBibleSource;

    /**
     * The manifest entry for the translation.
     */
    item: FetchBibleManifestItem;

    /**
     * The collection meta.json for the translation.
     */
    meta: FetchBibleCollectionMeta;

    /**
     * The (lowercase) IDs of the books that fetch.bible publishes for the translation.
     */
    books: string[];

    /**
     * The base URL that the translation's collection files should be downloaded from.
     * Points at the commit that the catalog was created from (when it is known), so that the downloaded files match the recorded git tree SHA.
     */
    collectionUrl: string;
}

export interface FetchBibleCollectionOptions {
    /**
     * The GitHub repository ("owner/name") that the fetch.bible collection is stored in.
     */
    repo?: string;

    /**
     * The branch (or other git ref) of the collection repository to use.
     */
    ref?: string;

    /**
     * The base URL of the GitHub REST API.
     */
    githubApiUrl?: string;

    /**
     * The base URL that raw files in GitHub repositories can be downloaded from.
     */
    githubRawUrl?: string;

    /**
     * The GitHub token to use for GitHub API requests.
     * Defaults to the GITHUB_TOKEN or GH_TOKEN environment variable. Not required, but raises the GitHub API rate limit.
     */
    githubToken?: string;
}

/**
 * The git revision of the fetch.bible collection.
 */
export interface FetchBibleCollectionRevision {
    /**
     * The SHA of the commit that the ref points to.
     */
    commitSha: string;

    /**
     * The git tree SHA of each translation's directory (bibles/<id>), keyed by fetch.bible ID.
     * A directory's tree SHA changes whenever any of the files in it change.
     */
    trees: Map<string, string>;
}

export interface FetchBibleCatalogOptions extends FetchBibleCollectionOptions {
    /**
     * The URL of the fetch.bible manifest.
     */
    manifestUrl?: string;

    /**
     * The number of collection meta.json files to download at once.
     */
    concurrency?: number;
}

/**
 * The translations that are (or will be) sourced from eBible.
 * Used to avoid downloading translations from fetch.bible that eBible already provides.
 */
export interface EBibleCoverage {
    /**
     * The eBible IDs (lowercase).
     */
    ebibleIds: Set<string>;

    /**
     * The API translation IDs (lowercase).
     */
    translationIds: Set<string>;
}

/**
 * Fetches the given URL, retrying when the request fails because of a network error, rate limiting, or a server error.
 * @param url The URL to fetch.
 * @param init The request options.
 * @param retries The number of times to retry.
 */
export async function fetchWithRetry(
    url: string,
    init?: RequestInit,
    retries: number = 4
): Promise<Response> {
    let delay = 2000;
    for (let attempt = 0; ; attempt++) {
        try {
            const response = await fetch(url, init);
            if (
                attempt < retries &&
                (response.status === 429 || response.status >= 500)
            ) {
                await response.body?.cancel();
            } else {
                return response;
            }
        } catch (err) {
            if (attempt >= retries) {
                throw err;
            }
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2;
    }
}

/**
 * Maps the given items with at most the given number of promises running at once.
 */
export async function mapConcurrent<T, R>(
    items: T[],
    concurrency: number,
    fn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
    const results: R[] = new Array(items.length);
    let next = 0;
    const workers = Array.from(
        { length: Math.min(concurrency, items.length) },
        async () => {
            while (next < items.length) {
                const index = next++;
                results[index] = await fn(items[index], index);
            }
        }
    );
    await Promise.all(workers);
    return results;
}

/**
 * Fetches the fetch.bible manifest.
 * @param url The URL of the manifest.
 */
export async function fetchFetchBibleManifest(
    url: string = FETCH_BIBLE_MANIFEST_URL
): Promise<FetchBibleManifest> {
    const response = await fetchWithRetry(url);
    if (!response.ok) {
        throw new Error(
            `Failed to download the fetch.bible manifest from ${url}: ${response.status} ${response.statusText}`
        );
    }
    return (await response.json()) as FetchBibleManifest;
}

/**
 * Gets the base URL that the collection files can be downloaded from at the given git ref or commit SHA.
 */
export function getFetchBibleCollectionUrl(
    options: FetchBibleCollectionOptions,
    refOrSha?: string | null
): string {
    const rawUrl = (options.githubRawUrl ?? GITHUB_RAW_URL).replace(/\/+$/, '');
    const repo = options.repo ?? FETCH_BIBLE_COLLECTION_REPO;
    return `${rawUrl}/${repo}/${refOrSha || (options.ref ?? FETCH_BIBLE_COLLECTION_REF)}`;
}

/**
 * Fetches the current git revision of the fetch.bible collection from the GitHub API:
 * the commit that the ref points to and the tree SHA of every translation's directory.
 * Only needs 3 GitHub API requests.
 */
export async function fetchFetchBibleCollectionRevision(
    options: FetchBibleCollectionOptions = {}
): Promise<FetchBibleCollectionRevision> {
    const apiUrl = (options.githubApiUrl ?? GITHUB_API_URL).replace(/\/+$/, '');
    const repo = options.repo ?? FETCH_BIBLE_COLLECTION_REPO;
    const ref = options.ref ?? FETCH_BIBLE_COLLECTION_REF;
    const token =
        options.githubToken ?? process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
    const headers: Record<string, string> = {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
    };
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const getJson = async (url: string) => {
        const response = await fetchWithRetry(url, { headers });
        if (!response.ok) {
            throw new Error(
                `Failed to fetch ${url}: ${response.status} ${response.statusText}`
            );
        }
        return (await response.json()) as any;
    };

    const commit = await getJson(
        `${apiUrl}/repos/${repo}/commits/${encodeURIComponent(ref)}`
    );
    const commitSha: string = commit.sha;
    const rootTreeSha: string = commit.commit.tree.sha;

    const rootTree = await getJson(
        `${apiUrl}/repos/${repo}/git/trees/${rootTreeSha}`
    );
    const biblesTree = (rootTree.tree as any[]).find(
        (entry) => entry.path === 'bibles' && entry.type === 'tree'
    );
    if (!biblesTree) {
        throw new Error(
            `Could not find the bibles directory in ${repo} at ${commitSha}`
        );
    }

    const bibles = await getJson(
        `${apiUrl}/repos/${repo}/git/trees/${biblesTree.sha}`
    );
    if (bibles.truncated) {
        throw new Error(
            `The bibles directory listing for ${repo} at ${commitSha} was truncated by the GitHub API`
        );
    }

    const trees = new Map<string, string>();
    for (const entry of bibles.tree as any[]) {
        if (entry.type === 'tree') {
            trees.set(entry.path, entry.sha);
        }
    }

    return { commitSha, trees };
}

/**
 * Gets the URL of a file for the given translation in the fetch.bible collection.
 * @param collectionUrl The base URL of the collection.
 * @param id The fetch.bible ID of the translation.
 * @param file The path of the file, relative to the translation's directory.
 */
export function getFetchBibleFileUrl(
    collectionUrl: string,
    id: string,
    file: string
): string {
    return `${collectionUrl.replace(/\/+$/, '')}/bibles/${id}/${file}`;
}

/**
 * Gets the URL of the given book of a translation in the fetch.bible collection.
 * fetch.bible stores each book of a translation as a separate USFM or USX file (e.g. "bibles/abt_map/usfm/mat.usfm").
 */
export function getFetchBibleBookUrl(
    collectionUrl: string,
    id: string,
    format: string,
    book: string
): string {
    return getFetchBibleFileUrl(
        collectionUrl,
        id,
        `${format}/${book.toLowerCase()}.${format}`
    );
}

/**
 * Downloads the collection meta.json for the given translation.
 * @returns The raw text and the parsed meta.json.
 */
export async function fetchFetchBibleCollectionMeta(
    collectionUrl: string,
    id: string
): Promise<{ text: string; meta: FetchBibleCollectionMeta }> {
    const url = getFetchBibleFileUrl(collectionUrl, id, 'meta.json');
    const response = await fetchWithRetry(url);
    if (!response.ok) {
        throw new Error(
            `Failed to download ${url}: ${response.status} ${response.statusText}`
        );
    }
    const text = await response.text();
    return { text, meta: JSON.parse(text) };
}

/**
 * Gets the lowercase IDs of the books that fetch.bible publishes for the given translation.
 * @param item The manifest entry for the translation.
 * @param booksOrdered The ordered list of all 66 books (from the manifest).
 */
export function getFetchBibleBooks(
    item: Pick<FetchBibleManifestItem, 'books_ot' | 'books_nt'>,
    booksOrdered: string[]
): string[] {
    const ot =
        item.books_ot === true ? booksOrdered.slice(0, 39) : item.books_ot;
    const nt = item.books_nt === true ? booksOrdered.slice(39) : item.books_nt;
    return [...(ot ?? []), ...(nt ?? [])].map((b) => b.toLowerCase());
}

/**
 * Gets the language code from the given fetch.bible translation ID (e.g. "abt_map" -> "abt").
 */
export function getFetchBibleLanguage(id: string): string {
    return id.split('_')[0].toLowerCase();
}

/**
 * Creates the source record for the given fetch.bible translation.
 * @param id The fetch.bible ID of the translation.
 * @param item The manifest entry for the translation.
 * @param meta The collection meta.json for the translation.
 * @param metaText The raw text of the meta.json file. Used to detect when the translation changes.
 * @param git The git commit SHA of the collection and the git tree SHA of the translation's directory, if they are known.
 */
export function createFetchBibleSource(
    id: string,
    item: FetchBibleManifestItem,
    meta: FetchBibleCollectionMeta,
    metaText: string,
    git: { commitSha?: string | null; treeSha?: string | null } = {}
): FetchBibleSource {
    const name = item.name ?? meta.name;
    const source: FetchBibleSource = {
        id,
        translationId: getTranslationId(id),
        languageCode: getFetchBibleLanguage(id),
        name: name.local || name.english || id,
        englishName: name.english || null,
        abbreviation: name.local_abbrev || name.english_abbrev || null,
        textDirection: item.direction ?? meta.direction ?? 'ltr',
        year: item.year ?? meta.year ?? null,
        ebibleId: meta.ids?.ebible ?? null,
        sourceService: meta.source?.service ?? null,
        sourceFormat: meta.source.format,
        sourceUpdated: meta.source?.updated ?? null,
        sourceRevision: meta.source?.revision ?? null,
        attribution: item.copyright?.attribution || null,
        attributionUrl: item.copyright?.attribution_url || null,
        gitCommitSha: git.commitSha ?? null,
        gitTreeSha: git.treeSha ?? null,
        downloadDate: null,
        downloadPath: null,
        sha256: null,
    };

    // The meta.json changes whenever fetch.bible updates the translation from its source,
    // and the manifest entry changes whenever the published books or copyright change.
    source.sha256 = sha256()
        .update(metaText)
        .update(JSON.stringify(item))
        .digest('hex');

    return source;
}

/**
 * Determines whether the given fetch.bible translation has changed since it was last downloaded.
 * When the git tree SHA of the translation's directory is known for both, it is compared,
 * because it changes whenever any of the translation's files change.
 * The hash of the translation's metadata is also compared, so that changes to the manifest are picked up.
 * @param existing The source as it was recorded when the translation was last downloaded.
 * @param source The current source.
 */
export function hasFetchBibleSourceChanged(
    existing: Pick<FetchBibleSource, 'sha256' | 'gitTreeSha'>,
    source: Pick<FetchBibleSource, 'sha256' | 'gitTreeSha'>
): boolean {
    if (
        existing.gitTreeSha &&
        source.gitTreeSha &&
        existing.gitTreeSha !== source.gitTreeSha
    ) {
        return true;
    }
    return existing.sha256 !== source.sha256;
}

/**
 * Fetches the list of translations that are available from fetch.bible.
 * Translations that are stored in a format that can't be imported (i.e. not USFM or USX) are skipped.
 *
 * The current git revision of the collection is looked up with the GitHub API, so that each translation records
 * the commit and the git tree SHA of its directory, and its files are downloaded from that commit.
 * If the GitHub API is unavailable (e.g. because of rate limiting), the files are downloaded from the ref instead
 * and changes are only detected from the translation's metadata.
 */
export async function fetchFetchBibleCatalog(
    options: FetchBibleCatalogOptions = {}
): Promise<FetchBibleCatalogEntry[]> {
    const logger = log.getLogger();
    const [manifest, revision] = await Promise.all([
        fetchFetchBibleManifest(options.manifestUrl),
        fetchFetchBibleCollectionRevision(options).catch((err) => {
            logger.warn(
                'Could not get the git revision of the fetch.bible collection from the GitHub API. Changes will only be detected from the translation metadata. Set GITHUB_TOKEN to raise the GitHub API rate limit.',
                err
            );
            return null;
        }),
    ]);

    if (revision) {
        logger.log(
            `fetch.bible collection is at commit ${revision.commitSha} (${revision.trees.size} translations)`
        );
    }
    const collectionUrl = getFetchBibleCollectionUrl(
        options,
        revision?.commitSha
    );

    const ids = Object.keys(manifest.bibles);

    logger.log(
        `Downloading fetch.bible metadata for ${ids.length} translations...`
    );

    const entries = await mapConcurrent(
        ids,
        options.concurrency ?? 20,
        async (id): Promise<FetchBibleCatalogEntry | null> => {
            try {
                const item = manifest.bibles[id];
                const { text, meta } = await fetchFetchBibleCollectionMeta(
                    collectionUrl,
                    id
                );

                const format = meta.source?.format;
                if (format !== 'usfm' && format !== 'usx') {
                    logger.warn(
                        `Skipping fetch.bible translation ${id} because its format (${format}) is not supported.`
                    );
                    return null;
                }

                const treeSha = revision?.trees.get(id) ?? null;
                if (revision && !treeSha) {
                    logger.warn(
                        `Could not find bibles/${id} in the fetch.bible collection at ${revision.commitSha}.`
                    );
                }

                return {
                    source: createFetchBibleSource(id, item, meta, text, {
                        commitSha: revision?.commitSha,
                        treeSha,
                    }),
                    item,
                    meta,
                    books: getFetchBibleBooks(item, manifest.books_ordered),
                    collectionUrl,
                };
            } catch (err) {
                logger.error(
                    `Failed to load fetch.bible metadata for ${id}:`,
                    err
                );
                return null;
            }
        }
    );

    return entries.filter((e) => !!e);
}

/**
 * Gets the license terms for the given fetch.bible copyright information.
 * Returns null if the license can't be determined.
 */
export function fetchBibleLicense(
    copyright: FetchBibleCopyright | null | undefined
): License | null {
    for (const { license, url } of copyright?.licenses ?? []) {
        if (typeof license === 'string') {
            const id = license.toLowerCase();
            if (id === 'public') {
                return ccLicenseFromCode('zero');
            } else if (id.startsWith('cc-')) {
                const terms = ccLicenseFromCode(id.slice(3));
                if (terms) {
                    return terms;
                }
            }
        } else if (license) {
            return {
                attribution: license.forbid_attributionless
                    ? 'required'
                    : 'not-required',
                commercialUse: license.forbid_commercial
                    ? 'not-allowed'
                    : 'allowed',
                derivatives:
                    license.forbid_derivatives === true
                        ? 'not-allowed'
                        : 'allowed',
                copyleft: license.forbid_derivatives === 'same-license',
                publicDomain: false,
            };
        }

        if (url) {
            const terms = ccLicenseFromUrl(url);
            if (terms) {
                return terms;
            }
        }
    }

    return null;
}

/**
 * Creates the metadata.json contents for the given fetch.bible translation.
 */
export function createFetchBibleMetadata(
    entry: Pick<FetchBibleCatalogEntry, 'source' | 'item'>
): InputTranslationMetadata {
    const { source, item } = entry;
    const copyright = item.copyright;

    let shortName = source.abbreviation?.trim();
    if (!shortName) {
        // Skip the language code prefix (e.g., "eng_", "arb_") and use the rest for the short name
        shortName = source.translationId
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, '')
            .slice(3);
    }

    const website =
        copyright?.attribution_url ||
        `https://fetch.bible/bibles/${source.id}/`;
    const licenseUrl = copyright?.licenses?.[0]?.url || website;

    const metadata: InputTranslationMetadata = {
        id: source.translationId,
        name: source.name,
        englishName: source.englishName || source.name,
        shortName,
        language: source.languageCode,
        direction: source.textDirection === 'rtl' ? 'rtl' : 'ltr',
        website,
        licenseUrl,
    };

    if (copyright?.attribution) {
        metadata.licenseNotice = copyright.attribution;
    }

    const license = fetchBibleLicense(copyright);
    if (license) {
        metadata.license = license;
    }

    return metadata;
}

/**
 * Creates an EBibleCoverage object from the given eBible sources.
 */
export function createEBibleCoverage(
    sources: Iterable<{ id?: string | null; translationId?: string | null }>
): EBibleCoverage {
    const coverage: EBibleCoverage = {
        ebibleIds: new Set(),
        translationIds: new Set(),
    };
    for (const source of sources) {
        addEBibleCoverage(coverage, source);
    }
    return coverage;
}

/**
 * Adds the given eBible source to the coverage.
 */
export function addEBibleCoverage(
    coverage: EBibleCoverage,
    source: { id?: string | null; translationId?: string | null }
) {
    if (source.id) {
        coverage.ebibleIds.add(source.id.toLowerCase());
    }
    if (source.translationId) {
        coverage.translationIds.add(source.translationId.toLowerCase());
    }
}

/**
 * Determines whether the given fetch.bible translation is already provided by eBible.
 * A translation is provided by eBible if fetch.bible records the same eBible ID for it,
 * or if it would be imported under the same translation ID as an eBible translation.
 */
export function isCoveredByEBible(
    source: Pick<FetchBibleSource, 'ebibleId' | 'translationId'>,
    coverage: EBibleCoverage
): boolean {
    return (
        (!!source.ebibleId &&
            coverage.ebibleIds.has(source.ebibleId.toLowerCase())) ||
        coverage.translationIds.has(source.translationId.toLowerCase())
    );
}

/**
 * Determines whether the given translation query matches the given fetch.bible translation.
 * Matches the fetch.bible ID, the API translation ID, or the eBible ID.
 */
export function matchesFetchBibleTranslation(
    query: string,
    source: Pick<FetchBibleSource, 'id' | 'translationId' | 'ebibleId'>
): boolean {
    const lowerQuery = query.toLowerCase();
    return [source.id, source.translationId, source.ebibleId].some(
        (id) => !!id && id.toLowerCase().includes(lowerQuery)
    );
}

/**
 * Determines whether the given fetch.bible translation is in the given ignore list.
 * The ignore list can contain fetch.bible IDs, API translation IDs, or eBible IDs.
 */
export function isFetchBibleSourceIgnored(
    source: Pick<FetchBibleSource, 'id' | 'translationId' | 'ebibleId'>,
    ignorelist: string[]
): boolean {
    return [source.id, source.translationId, source.ebibleId].some(
        (id) => !!id && ignorelist.includes(id)
    );
}

/**
 * The name of the file that is written into each translation directory that was sourced from fetch.bible.
 * Used to tell fetch.bible translations apart from eBible translations when they share a directory.
 */
export const FETCH_BIBLE_MARKER_FILE = 'fetch-bible.txt';

/**
 * Determines whether the given translation directory was sourced from fetch.bible.
 */
export function isFetchBibleTranslationDir(translationDir: string): boolean {
    return existsSync(path.resolve(translationDir, FETCH_BIBLE_MARKER_FILE));
}

/**
 * Determines which translations have already been downloaded from eBible.
 * @param db The database that eBible downloads are tracked in.
 * @param ebibleDir The directory that eBible translations were downloaded to.
 * If provided, only tracked translations that exist in this directory are included,
 * along with any translation in the directory whose metadata links to ebible.org.
 */
export async function loadDownloadedEBibleCoverage(
    db: Database | null,
    ebibleDir?: string
): Promise<EBibleCoverage> {
    const coverage = createEBibleCoverage([]);
    const isEBibleDir = (translationId: string) => {
        if (!ebibleDir) {
            return true;
        }
        const translationDir = path.resolve(ebibleDir, translationId);
        return (
            existsSync(translationDir) &&
            !isFetchBibleTranslationDir(translationDir)
        );
    };

    if (db) {
        const rows = db
            .prepare(
                'SELECT id, translationId FROM EBibleSource WHERE usfmDownloadDate IS NOT NULL;'
            )
            .all() as { id: string; translationId: string }[];
        for (const row of rows) {
            if (isEBibleDir(row.translationId)) {
                addEBibleCoverage(coverage, row);
            }
        }
    }

    if (ebibleDir && existsSync(ebibleDir)) {
        const entries = await readdir(ebibleDir, { withFileTypes: true });
        for (const entry of entries) {
            if (!entry.isDirectory()) {
                continue;
            }
            const translationDir = path.resolve(ebibleDir, entry.name);
            const metadataPath = path.resolve(translationDir, 'metadata.json');
            if (
                isFetchBibleTranslationDir(translationDir) ||
                !existsSync(metadataPath)
            ) {
                continue;
            }

            try {
                const metadata = JSON.parse(
                    await readFile(metadataPath, 'utf-8')
                ) as Partial<InputTranslationMetadata>;
                const ebibleId =
                    ebibleIdFromUrl(metadata.licenseUrl) ??
                    ebibleIdFromUrl(metadata.website);
                if (ebibleId) {
                    addEBibleCoverage(coverage, {
                        id: ebibleId,
                        translationId: metadata.id ?? entry.name,
                    });
                }
            } catch (err) {
                // Ignore invalid metadata files
            }
        }
    }

    return coverage;
}

export interface DownloadFetchBibleTranslationOptions {
    /**
     * The directory that the translation's metadata.json should be written to.
     * This directory is replaced.
     */
    outputPath: string;

    /**
     * The directory that the translation's book files should be written to.
     * This directory is replaced. Defaults to the outputPath.
     */
    downloadDir?: string;

    /**
     * The metadata to write to metadata.json.
     */
    metadata: InputTranslationMetadata;

    /**
     * The number of books to download at once.
     */
    concurrency?: number;
}

/**
 * Downloads every book of the given fetch.bible translation and writes them (named like "GEN.usx" or "GEN.usfm") along with the metadata.json.
 * All of the books are downloaded before anything is written, so that a failed download doesn't leave a partial translation behind.
 * Throws if any of the books fail to download.
 */
export async function downloadFetchBibleTranslation(
    entry: Pick<FetchBibleCatalogEntry, 'source' | 'books' | 'collectionUrl'>,
    options: DownloadFetchBibleTranslationOptions
): Promise<void> {
    const logger = log.getLogger();
    const { source } = entry;
    const format = source.sourceFormat;
    const { outputPath } = options;
    const downloadDir = options.downloadDir ?? outputPath;

    const files = await mapConcurrent(
        entry.books,
        options.concurrency ?? 8,
        async (book) => {
            const url = getFetchBibleBookUrl(
                entry.collectionUrl,
                source.id,
                format,
                book
            );
            const response = await fetchWithRetry(url);
            if (!response.ok) {
                throw new Error(
                    `Failed to download ${url}: ${response.status} ${response.statusText}`
                );
            }
            return {
                name: `${book.toUpperCase()}.${format}`,
                content: new Uint8Array(await response.arrayBuffer()),
            };
        }
    );

    for (const dir of new Set([outputPath, downloadDir])) {
        if (existsSync(dir)) {
            logger.log(`Overwriting existing directory: ${dir}`);
            await rm(dir, { recursive: true, force: true });
        }
        await mkdir(dir, { recursive: true });
    }

    for (const file of files) {
        await writeFile(path.resolve(downloadDir, file.name), file.content);
    }

    await writeFile(
        path.resolve(outputPath, 'metadata.json'),
        JSON.stringify(options.metadata, null, 2)
    );
    const marker = [
        `This translation was downloaded from fetch.bible (${source.id}).`,
        `Source: ${getFetchBibleFileUrl(entry.collectionUrl, source.id, '')}`,
    ];
    if (source.gitCommitSha) {
        marker.push(`Commit: ${source.gitCommitSha}`);
    }
    if (source.gitTreeSha) {
        marker.push(`Tree: ${source.gitTreeSha}`);
    }
    await writeFile(
        path.resolve(outputPath, FETCH_BIBLE_MARKER_FILE),
        marker.join('\n') + '\n'
    );
}
