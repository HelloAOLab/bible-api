import path from 'node:path';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { Uint8ArrayReader, Uint8ArrayWriter, ZipReader } from '@zip.js/zip.js';
import { log } from '@helloao/tools';
import {
    InputCommentaryMetadata,
    License,
} from '@helloao/tools/generation/common-types.js';
import {
    getSwordConfigValue,
    isSwordCommentaryModule,
    parseSwordConfig,
    SwordModuleConfig,
} from '@helloao/tools/parser/sword-module.js';
import { getSwordCommentaryMetadata, getSwordLanguage } from './sword.js';

/**
 * The CrossWire page that lists the commentary modules.
 */
export const CROSSWIRE_COMMENTARIES_URL =
    'https://www.crosswire.org/sword/modules/ModDisp.jsp?modType=Commentaries';

/**
 * The archive with the .conf file of every module in the CrossWire repository.
 */
export const CROSSWIRE_MODS_D_URL =
    'https://www.crosswire.org/ftpmirror/pub/sword/raw/mods.d.tar.gz';

/**
 * Gets the URL of the "Raw ZIP" download of the given module.
 * (The download links on the module list go through a servlet that redirects here.)
 * @param name The module name, e.g. "Clarke".
 */
export function getCrossWireModuleZipUrl(name: string): string {
    return `https://www.crosswire.org/ftpmirror/pub/sword/packages/rawzip/${encodeURIComponent(name)}.zip`;
}

/**
 * Gets the URL of the CrossWire page that describes the given module (including its license).
 * @param name The module name, e.g. "Clarke".
 */
export function getCrossWireModuleInfoUrl(name: string): string {
    return `https://www.crosswire.org/sword/modules/ModInfo.jsp?modName=${encodeURIComponent(name)}`;
}

/**
 * A module that is listed on the CrossWire module list.
 */
export interface CrossWireListedModule {
    /**
     * The module name, e.g. "Clarke".
     */
    name: string;

    /**
     * The description that the list shows for the module.
     */
    description: string;

    /**
     * The language heading that the module is listed under (a BCP 47 tag like "en" or "grc").
     */
    language: string | null;
}

/**
 * Parses the modules from a CrossWire module list page (ModDisp.jsp).
 * @param html The HTML of the page.
 */
export function parseCrossWireModuleList(
    html: string
): CrossWireListedModule[] {
    const modules: CrossWireListedModule[] = [];
    const seen = new Set<string>();
    const token = /<b>\s*Language:\s*([^<\s]+)\s*<\/b>|<tr>([\s\S]*?)<\/tr>/gi;
    let language: string | null = null;
    let match: RegExpExecArray | null;
    while ((match = token.exec(html))) {
        if (match[1]) {
            language = match[1].trim();
            continue;
        }
        const row = match[2];
        const info = /ModInfo\.jsp\?modName=([^"'&]+)/i.exec(row);
        if (!info) {
            continue;
        }
        const name = decodeURIComponent(info[1]).trim();
        if (seen.has(name.toLowerCase())) {
            continue;
        }
        seen.add(name.toLowerCase());
        const cells = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(
            (c) => decodeHtml(c[1].replace(/<[^>]*>/g, '')).trim()
        );
        modules.push({
            name,
            description: cells[2] ?? name,
            language,
        });
    }
    return modules;
}

function decodeHtml(text: string): string {
    return text
        .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
        .replace(/&#x([0-9a-f]+);/gi, (_, n) =>
            String.fromCodePoint(parseInt(n, 16))
        )
        .replace(/&quot;/g, '"')
        .replace(/&apos;|&#39;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&');
}

/**
 * Reads the regular files from the given (uncompressed) tar archive.
 * @param data The tar archive.
 * @returns The files by their path in the archive.
 */
export function readTar(data: Uint8Array): Map<string, Uint8Array> {
    const files = new Map<string, Uint8Array>();
    const text = (start: number, length: number) => {
        const bytes = data.subarray(start, start + length);
        const end = bytes.indexOf(0);
        return new TextDecoder().decode(
            end >= 0 ? bytes.subarray(0, end) : bytes
        );
    };

    let offset = 0;
    while (offset + 512 <= data.length) {
        const name = text(offset, 100);
        if (!name) {
            break;
        }
        const size = parseInt(text(offset + 124, 12).trim() || '0', 8);
        const type = String.fromCharCode(data[offset + 156] || 48);
        const prefix =
            text(offset + 257, 6) === 'ustar' ? text(offset + 345, 155) : '';
        const start = offset + 512;
        if (type === '0' || type === '7') {
            files.set(
                prefix ? `${prefix}/${name}` : name,
                data.slice(start, start + size)
            );
        }
        offset = start + Math.ceil(size / 512) * 512;
    }
    return files;
}

/**
 * Decodes the given SWORD .conf file.
 * Configs are UTF-8 when they say so, and Latin-1 otherwise, but some UTF-8 configs leave out the Encoding,
 * so the text is decoded as UTF-8 when it is valid UTF-8.
 * @param data The bytes of the .conf file.
 */
export function decodeSwordConfig(data: Uint8Array): string {
    try {
        return new TextDecoder('utf-8', { fatal: true }).decode(data);
    } catch {
        return new TextDecoder('latin1').decode(data);
    }
}

/**
 * Reads the module configs from the given mods.d.tar.gz archive.
 * @param archive The gzipped tar archive.
 * @returns The configs by their lowercase module name.
 */
export function readModsDArchive(
    archive: Uint8Array
): Map<string, SwordModuleConfig> {
    const configs = new Map<string, SwordModuleConfig>();
    for (let [name, data] of readTar(gunzipSync(archive))) {
        if (!/(^|\/)mods\.d\/[^/]+\.conf$/i.test(name)) {
            continue;
        }
        try {
            const config = parseSwordConfig(decodeSwordConfig(data));
            configs.set(config.name.toLowerCase(), config);
        } catch {
            // Ignore configs that cannot be parsed.
        }
    }
    return configs;
}

/**
 * How freely a module may be used.
 * - "public-domain": public domain or CC0.
 * - "open": an open license that allows commercial use and derivatives (like CC BY or CC BY-SA).
 * - "restricted": copyrighted, non-commercial, no-derivatives, or only licensed to CrossWire.
 * - "unknown": the module does not say.
 */
export type CrossWireLicenseKind =
    | 'public-domain'
    | 'open'
    | 'restricted'
    | 'unknown';

/**
 * The license of a module.
 */
export interface CrossWireLicense {
    kind: CrossWireLicenseKind;

    /**
     * The DistributionLicense of the module (or the override for it).
     */
    distributionLicense: string | null;

    /**
     * A short name for the license, like "CC BY 4.0". Null for public domain or unknown licenses.
     */
    shortName: string | null;

    /**
     * The URL of the license text, if it is a standard license.
     */
    url: string | null;

    /**
     * The structured license terms, if they are known.
     */
    terms: License | null;
}

/**
 * Determines the license of a module from its DistributionLicense.
 * See https://wiki.crosswire.org/DevTools:conf_Files#Elements_with_Copyright_and_Licensing_Related_Information
 * @param distributionLicense The DistributionLicense value.
 */
export function getCrossWireLicense(
    distributionLicense: string | null
): CrossWireLicense {
    const value = distributionLicense?.trim() || null;
    const result = (
        kind: CrossWireLicenseKind,
        shortName: string | null = null,
        url: string | null = null,
        terms: License | null = null
    ): CrossWireLicense => ({
        kind,
        distributionLicense: value,
        shortName,
        url,
        terms,
    });

    if (!value) {
        return result('unknown');
    }

    const publicDomain: License = {
        attribution: 'not-required',
        commercialUse: 'allowed',
        derivatives: 'allowed',
        copyleft: false,
        publicDomain: true,
    };

    const cc = /creative\s*commons\s*:?\s*(.*)$/i.exec(value);
    if (cc) {
        const code = cc[1].trim().toUpperCase();
        if (/^(CC)?0\b|^CC0|ZERO|PUBLIC\s*DOMAIN/.test(code)) {
            return result(
                'public-domain',
                'CC0 1.0',
                'https://creativecommons.org/publicdomain/zero/1.0/',
                publicDomain
            );
        }
        const parts = code
            .replace(/^CC[\s-]*/, '')
            .split(/[\s-]+/)
            .filter((p) => !!p);
        const version = parts.find((p) => /^\d+(\.\d+)?$/.test(p)) ?? '4.0';
        const elements = parts.filter((p) =>
            ['BY', 'SA', 'NC', 'ND'].includes(p)
        );
        if (!elements.includes('BY')) {
            return result('unknown');
        }
        const nc = elements.includes('NC');
        const nd = elements.includes('ND');
        const sa = elements.includes('SA');
        const slug = elements.join('-').toLowerCase();
        return result(
            nc || nd ? 'restricted' : 'open',
            `CC ${elements.join('-')} ${version}`,
            `https://creativecommons.org/licenses/${slug}/${version}/`,
            {
                attribution: 'required',
                commercialUse: nc ? 'not-allowed' : 'allowed',
                derivatives: nd ? 'not-allowed' : 'allowed',
                copyleft: sa,
                publicDomain: false,
            }
        );
    }

    if (/^public\s*domain/i.test(value)) {
        return result('public-domain', null, null, publicDomain);
    }

    return result('restricted');
}

/**
 * Corrections to the metadata of CrossWire commentaries.
 * The module configs are written in the language of the commentary, so these give the English names,
 * and fill in the licenses that some configs leave out.
 */
export const CROSSWIRE_COMMENTARY_OVERRIDES: Record<
    string,
    {
        englishName?: string;
        distributionLicense?: string;
    }
> = {
    // Both are 19th century (or older) works that CrossWire lists as public domain on their info pages,
    // but whose configs have no DistributionLicense.
    Family: { distributionLicense: 'Public Domain' },
    Geneva: { distributionLicense: 'Public Domain' },

    DutKant: {
        englishName: 'Annotations to the Dutch States Translation',
    },
    DutKingComments: {
        englishName: 'Kingcomments (Dutch), commentary on the whole Bible',
    },
    FreCJE: { englishName: 'Each Day the Scriptures' },
    GerKingComments: {
        englishName: 'Kingcomments (German), commentary on the whole Bible',
    },
    MAK: { englishName: "Matthias Ansorg's Commentary" },
    PorKingComments: {
        englishName: 'Kingcomments (Portuguese), commentary on the whole Bible',
    },
    Rieger: { englishName: "Carl Heinrich Rieger's Commentary" },
    VieLCCMNCT: { englishName: "God's Word for Everyone, Notes" },
    VulgGlossa: { englishName: 'Glossa Ordinaria (Migne edition)' },
};

/**
 * The metadata that is written to the metadata.json of a CrossWire commentary.
 */
export interface CrossWireCommentaryMetadata extends InputCommentaryMetadata {
    license: License | null;
}

/**
 * Gets the metadata for the given CrossWire commentary module.
 * @param config The config of the module.
 * @param listed The module as listed on the CrossWire module list, if it was.
 */
export function getCrossWireCommentaryMetadata(
    config: SwordModuleConfig,
    listed?: CrossWireListedModule | null
): CrossWireCommentaryMetadata {
    const base = getSwordCommentaryMetadata(config);
    const overrides = findOverride(config.name);
    const license = getCrossWireLicenseForConfig(config);
    const name =
        getSwordConfigValue(config, 'Description') ??
        listed?.description ??
        config.name;
    const lang = getSwordConfigValue(config, 'Lang') ?? listed?.language;
    const copyright =
        getSwordConfigValue(config, 'ShortCopyright') ??
        getSwordConfigValue(config, 'Copyright') ??
        getSwordConfigValue(config, 'CopyrightHolder');

    let licenseNotice: string | null;
    if (license.kind === 'public-domain') {
        licenseNotice = null;
    } else if (license.kind === 'open') {
        licenseNotice = [
            copyright ? withPeriod(copyright) : null,
            `Licensed under ${license.shortName} (${license.url}).`,
        ]
            .filter((n) => !!n)
            .join(' ');
    } else {
        licenseNotice =
            [copyright, license.distributionLicense]
                .filter((n) => !!n)
                .map((n) => withPeriod(n!))
                .join(' ') || null;
    }

    return {
        ...base,
        name,
        englishName: overrides?.englishName ?? name,
        language: getSwordLanguage(lang ?? null),
        licenseUrl: license.url ?? getCrossWireModuleInfoUrl(config.name),
        licenseNotice,
        license: license.terms,
    };
}

function withPeriod(text: string): string {
    const trimmed = text.trim();
    return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function findOverride(name: string) {
    const key = Object.keys(CROSSWIRE_COMMENTARY_OVERRIDES).find(
        (k) => k.toLowerCase() === name.toLowerCase()
    );
    return key ? CROSSWIRE_COMMENTARY_OVERRIDES[key] : null;
}

/**
 * Gets the license of the given module, using the overrides for modules that leave it out.
 * @param config The config of the module.
 */
export function getCrossWireLicenseForConfig(
    config: SwordModuleConfig
): CrossWireLicense {
    return getCrossWireLicense(
        getSwordConfigValue(config, 'DistributionLicense') ??
            findOverride(config.name)?.distributionLicense ??
            null
    );
}

/**
 * Gets the reason that the given module cannot be imported as a commentary, or null if it can.
 * This mirrors what the SWORD reader in @helloao/tools supports.
 * @param config The config of the module.
 */
export function getUnsupportedReason(config: SwordModuleConfig): string | null {
    if (!isSwordCommentaryModule(config)) {
        return `uses the ${getSwordConfigValue(config, 'ModDrv') ?? 'unknown'} driver, which is not a supported commentary format`;
    }
    const versification = getSwordConfigValue(config, 'Versification') ?? 'KJV';
    if (versification.toUpperCase() !== 'KJV') {
        return `uses the ${versification} versification (only KJV is supported)`;
    }
    if (getSwordConfigValue(config, 'CipherKey') !== null) {
        return 'is encrypted (locked)';
    }
    return null;
}

/**
 * The record of a downloaded module that is kept next to it, so that later runs only download changed modules.
 */
export interface CrossWireDownloadRecord {
    module: string;
    version: string | null;
    url: string;
    sha256: string;
}

/**
 * The name of the file that records which module was downloaded into a commentary directory.
 */
export const CROSSWIRE_RECORD_FILE = 'crosswire.json';

export interface FetchCrossWireCommentariesOptions {
    /**
     * Only fetch these modules (by module name, case-insensitive). Defaults to every module on the list.
     */
    modules?: string[];

    /**
     * Also fetch modules that are copyrighted, non-commercial, or have an unknown license.
     * By default only public domain and openly licensed modules are fetched, since everything in the
     * Free Use Bible API must be free to use.
     */
    allLicenses?: boolean;

    /**
     * Also fetch modules that the importer can't read yet (like ones with a non-KJV versification).
     * Importing a directory that contains them fails, so they should be kept out of the import directory.
     */
    includeUnsupported?: boolean;

    /**
     * Download modules again even if the same version was already downloaded.
     */
    overwrite?: boolean;

    /**
     * Only print what would be downloaded.
     */
    dryRun?: boolean;

    /**
     * The number of modules to download at once. Defaults to 3.
     */
    concurrency?: number;

    /**
     * The URL of the module list. Defaults to the CrossWire commentaries list.
     */
    listUrl?: string;

    /**
     * The URL of the mods.d.tar.gz archive. Defaults to the CrossWire one.
     */
    modsDUrl?: string;

    /**
     * Gets the URL of the ZIP for the given module.
     */
    getZipUrl?: (name: string) => string;

    /**
     * The fetch function to use. Defaults to the global fetch.
     */
    fetch?: typeof fetch;
}

export type CrossWireFetchStatus =
    | 'downloaded'
    | 'up-to-date'
    | 'would-download'
    | 'skipped'
    | 'failed';

export interface CrossWireFetchResult {
    module: string;
    id: string | null;
    status: CrossWireFetchStatus;
    license: CrossWireLicenseKind | null;
    reason?: string;
}

/**
 * Downloads the commentaries from the CrossWire SWORD module repository into the given directory,
 * each in its own directory with a metadata.json, so that the directory can be imported with import-commentaries:
 *
 *     {dir}/{id}/{Module}.zip
 *     {dir}/{id}/metadata.json
 *     {dir}/{id}/crosswire.json
 *
 * @param dir The directory to write the commentaries to.
 * @param options The options.
 */
export async function fetchCrossWireCommentaries(
    dir: string,
    options: FetchCrossWireCommentariesOptions = {}
): Promise<CrossWireFetchResult[]> {
    const logger = log.getLogger();
    const fetchFn = options.fetch ?? fetch;
    const getZipUrl = options.getZipUrl ?? getCrossWireModuleZipUrl;

    const getBytes = async (url: string) => {
        const response = await fetchFn(url);
        if (!response.ok) {
            throw new Error(
                `Failed to download ${url}: ${response.status} ${response.statusText}`
            );
        }
        return new Uint8Array(await response.arrayBuffer());
    };

    const listUrl = options.listUrl ?? CROSSWIRE_COMMENTARIES_URL;
    logger.log('Reading the module list from', listUrl);
    let listed = parseCrossWireModuleList(
        new TextDecoder().decode(await getBytes(listUrl))
    );
    if (listed.length <= 0) {
        throw new Error(`Could not find any modules on ${listUrl}.`);
    }

    const modsDUrl = options.modsDUrl ?? CROSSWIRE_MODS_D_URL;
    logger.log('Reading the module configs from', modsDUrl);
    const configs = readModsDArchive(await getBytes(modsDUrl));

    if (options.modules && options.modules.length > 0) {
        const wanted = new Set(options.modules.map((m) => m.toLowerCase()));
        const missing = options.modules.filter(
            (m) => !listed.some((l) => l.name.toLowerCase() === m.toLowerCase())
        );
        if (missing.length > 0) {
            throw new Error(
                `These modules are not on the CrossWire commentaries list: ${missing.join(', ')}`
            );
        }
        listed = listed.filter((l) => wanted.has(l.name.toLowerCase()));
    }

    const fetchModule = async (
        module: CrossWireListedModule
    ): Promise<CrossWireFetchResult> => {
        const config = configs.get(module.name.toLowerCase());
        if (!config) {
            return {
                module: module.name,
                id: null,
                status: 'skipped',
                license: null,
                reason: 'has no config in mods.d.tar.gz',
            };
        }

        const license = getCrossWireLicenseForConfig(config);
        const id = getSwordCommentaryMetadata(config).id;
        const result = (
            status: CrossWireFetchStatus,
            reason?: string
        ): CrossWireFetchResult => ({
            module: config.name,
            id,
            status,
            license: license.kind,
            ...(reason ? { reason } : {}),
        });

        const unsupported = getUnsupportedReason(config);
        if (unsupported && !options.includeUnsupported) {
            return result('skipped', unsupported);
        }
        if (
            (license.kind === 'restricted' || license.kind === 'unknown') &&
            !options.allLicenses
        ) {
            return result(
                'skipped',
                license.kind === 'unknown'
                    ? 'has no license'
                    : `is not free to use (${license.distributionLicense})`
            );
        }

        const moduleDir = path.resolve(dir, id);
        const zipPath = path.resolve(moduleDir, `${config.name}.zip`);
        const recordPath = path.resolve(moduleDir, CROSSWIRE_RECORD_FILE);
        const version = getSwordConfigValue(config, 'Version');
        const url = getZipUrl(config.name);

        const record = await readJson<CrossWireDownloadRecord>(recordPath);
        const upToDate =
            !options.overwrite &&
            existsSync(zipPath) &&
            record?.module === config.name &&
            record.version === version;

        if (options.dryRun) {
            return result(upToDate ? 'up-to-date' : 'would-download');
        }

        let moduleConfig = config;
        if (!upToDate) {
            logger.log(`Downloading ${config.name} (${version ?? '?'})...`);
            const zip = await getBytes(url);
            // Prefer the config in the ZIP, since it is the one that matches the data files.
            moduleConfig = (await readZipConfig(zip, config.name)) ?? config;
            await mkdir(moduleDir, { recursive: true });
            const tempPath = `${zipPath}.download`;
            await writeFile(tempPath, zip);
            await rename(tempPath, zipPath);
            await writeJsonIfChanged(recordPath, {
                module: config.name,
                version:
                    getSwordConfigValue(moduleConfig, 'Version') ?? version,
                url,
                sha256: createHash('sha256').update(zip).digest('hex'),
            } satisfies CrossWireDownloadRecord);
        } else {
            moduleConfig =
                (await readZipConfig(
                    // zip.js can't read Node Buffers, so copy it into a plain Uint8Array.
                    new Uint8Array(await readFile(zipPath)),
                    config.name
                )) ?? config;
        }

        await writeJsonIfChanged(
            path.resolve(moduleDir, 'metadata.json'),
            getCrossWireCommentaryMetadata(moduleConfig, module)
        );

        return result(
            upToDate ? 'up-to-date' : 'downloaded',
            unsupported ?? undefined
        );
    };

    const results: CrossWireFetchResult[] = new Array(listed.length);
    let next = 0;
    const worker = async () => {
        while (next < listed.length) {
            const i = next++;
            try {
                results[i] = await fetchModule(listed[i]);
            } catch (err: any) {
                logger.error(
                    `Failed to fetch ${listed[i].name}: ${err?.message ?? err}`
                );
                results[i] = {
                    module: listed[i].name,
                    id: null,
                    status: 'failed',
                    license: null,
                    reason: err?.message ?? String(err),
                };
            }
        }
    };
    await Promise.all(
        Array.from({ length: Math.max(1, options.concurrency ?? 3) }, worker)
    );

    return results;
}

/**
 * Reads the config of the given module from a module ZIP.
 * @param zip The bytes of the ZIP.
 * @param name The module name.
 */
async function readZipConfig(
    zip: Uint8Array,
    name: string
): Promise<SwordModuleConfig | null> {
    const reader = new ZipReader(new Uint8ArrayReader(zip));
    try {
        for (let entry of await reader.getEntries()) {
            if (
                entry.directory ||
                !entry.getData ||
                !/(^|\/)mods\.d\/[^/]+\.conf$/i.test(
                    entry.filename.replace(/\\/g, '/')
                )
            ) {
                continue;
            }
            const config = parseSwordConfig(
                decodeSwordConfig(await entry.getData(new Uint8ArrayWriter()))
            );
            if (config.name.toLowerCase() === name.toLowerCase()) {
                return config;
            }
        }
        return null;
    } finally {
        await reader.close();
    }
}

async function readJson<T>(file: string): Promise<T | null> {
    try {
        return JSON.parse(await readFile(file, 'utf-8')) as T;
    } catch {
        return null;
    }
}

/**
 * Writes the given JSON file, unless it already has the same content.
 * This keeps the file's modification time, so that sync doesn't think the commentary changed.
 */
async function writeJsonIfChanged(file: string, data: unknown) {
    const json = JSON.stringify(data, null, 4) + '\n';
    try {
        if ((await readFile(file, 'utf-8')) === json) {
            return;
        }
    } catch {
        // The file doesn't exist yet.
    }
    await writeFile(file, json);
}
