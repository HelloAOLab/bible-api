import { readdir, readFile } from 'fs/promises';
import * as path from 'path';
import { inflateSync } from 'zlib';
import { BlobReader, Entry, Uint8ArrayWriter, ZipReader } from '@zip.js/zip.js';
import { getAll639_2T, getEnglishName } from 'all-iso-language-codes';
import hash from 'hash.js';
import {
    getSwordCommentaryFileNames,
    getSwordConfigValue,
    isSwordCommentaryModule,
    parseSwordConfig,
    readSwordCommentaryEntries,
    SwordModuleConfig,
    SwordTestamentFileNames,
    SwordTestamentFiles,
} from '@helloao/tools/parser/sword-module.js';
import {
    SWORD_COMMENTARY_PARSER_VERSION,
    SwordCommentaryContent,
} from '@helloao/tools/parser/sword-commentary-parser.js';
import {
    InputCommentaryFile,
    InputCommentaryMetadata,
} from '@helloao/tools/generation/common-types.js';
import { DATASET_VERSION } from '@helloao/tools/generation/dataset.js';

const { sha256 } = hash;

/**
 * A SWORD module that was found in a commentary directory.
 */
export interface SwordModuleSource {
    /**
     * The path to the module. Either the .conf file, or the ZIP file that contains the module.
     */
    path: string;

    /**
     * The config of the module.
     */
    config: SwordModuleConfig;

    /**
     * Reads the given file from the SWORD library that the module is stored in.
     * Returns null if the file does not exist.
     * @param relativePath The path to the file, relative to the root of the library.
     */
    readFile(relativePath: string): Promise<Uint8Array | null>;
}

/**
 * Finds the SWORD commentary modules in the given directory.
 * Modules can either be extracted into the directory (so that it contains a mods.d directory with the .conf files),
 * or be stored in .zip files (like the ones that CrossWire distributes).
 * @param dir The directory.
 */
export async function findSwordCommentaryModules(
    dir: string
): Promise<SwordModuleSource[]> {
    const modules: SwordModuleSource[] = [];
    let entries: string[];
    try {
        entries = await readdir(dir);
    } catch {
        return modules;
    }

    if (entries.includes('mods.d')) {
        const modsDir = path.resolve(dir, 'mods.d');
        const confs = (await readdir(modsDir)).filter((f) =>
            f.toLowerCase().endsWith('.conf')
        );
        for (let conf of confs.sort()) {
            const confPath = path.resolve(modsDir, conf);
            const config = parseSwordConfig(await readFile(confPath, 'utf-8'));
            if (!isSwordCommentaryModule(config)) {
                continue;
            }
            modules.push({
                path: confPath,
                config,
                readFile: async (relativePath) => {
                    try {
                        return await readFile(path.resolve(dir, relativePath));
                    } catch (err: any) {
                        if (err?.code === 'ENOENT') {
                            return null;
                        }
                        throw err;
                    }
                },
            });
        }
    }

    for (let entry of entries
        .filter((e) => e.toLowerCase().endsWith('.zip'))
        .sort()) {
        modules.push(...(await readSwordZip(path.resolve(dir, entry))));
    }

    return modules;
}

async function readSwordZip(zipPath: string): Promise<SwordModuleSource[]> {
    // The reader is never closed because the module files are only read when they are needed.
    // It only holds the ZIP file in memory, which is released once the modules are no longer used.
    const zip = new ZipReader(
        new BlobReader(new Blob([await readFile(zipPath)]))
    );
    const entries = new Map<string, Entry>();
    for (let entry of await zip.getEntries()) {
        if (!entry.directory && entry.getData) {
            entries.set(normalizeLibraryPath(entry.filename), entry);
        }
    }

    const readEntry = async (name: string) => {
        const entry = entries.get(normalizeLibraryPath(name));
        return entry?.getData
            ? await entry.getData(new Uint8ArrayWriter())
            : null;
    };

    const modules: SwordModuleSource[] = [];
    for (let name of entries.keys()) {
        if (!/^mods\.d\/[^/]+\.conf$/i.test(name)) {
            continue;
        }
        const config = parseSwordConfig(
            new TextDecoder().decode((await readEntry(name))!)
        );
        if (!isSwordCommentaryModule(config)) {
            continue;
        }
        modules.push({ path: zipPath, config, readFile: readEntry });
    }
    return modules;
}

function normalizeLibraryPath(p: string): string {
    return path.posix.normalize(p.replace(/\\/g, '/')).replace(/^(\.\/)+/, '');
}

/**
 * Loads the given SWORD commentary module as an input file.
 * @param source The module.
 * @param metadata The metadata for the commentary.
 */
export async function loadSwordCommentaryFile(
    source: SwordModuleSource,
    metadata: InputCommentaryMetadata
): Promise<InputCommentaryFile> {
    const { config } = source;
    const dataPath = getSwordConfigValue(config, 'DataPath');
    if (!dataPath) {
        throw new Error(
            `The SWORD module ${config.name} does not have a DataPath.`
        );
    }

    const fileNames = getSwordCommentaryFileNames(config);
    const readTestament = async (
        names: SwordTestamentFileNames
    ): Promise<SwordTestamentFiles | null> => {
        const read = (name: string) =>
            source.readFile(path.posix.join(dataPath, name));
        const index = await read(names.index);
        const data = await read(names.data);
        if (!index || !data) {
            return null;
        }
        const blocks = names.blocks ? await read(names.blocks) : undefined;
        if (names.blocks && !blocks) {
            return null;
        }
        return { index, data, blocks: blocks ?? undefined };
    };

    const ot = await readTestament(fileNames.ot);
    const nt = await readTestament(fileNames.nt);
    if (!ot && !nt) {
        throw new Error(
            `Could not find the data files for the SWORD module ${config.name} in ${dataPath}.`
        );
    }

    const content: SwordCommentaryContent = {
        sourceType: getSwordConfigValue(config, 'SourceType'),
        entries: readSwordCommentaryEntries(config, { ot, nt }, (data) =>
            inflateSync(data)
        ),
    };
    const json = JSON.stringify(content);

    return {
        fileType: 'commentary/sword',
        name: source.path,
        content: json,
        metadata,
        sha256: sha256()
            .update(json)
            .update(`${SWORD_COMMENTARY_PARSER_VERSION}:${DATASET_VERSION}`)
            .digest('hex'),
    };
}

/**
 * Gets the commentary metadata that is described by the given SWORD module config.
 * @param config The config.
 */
export function getSwordCommentaryMetadata(
    config: SwordModuleConfig
): InputCommentaryMetadata {
    const description =
        getSwordConfigValue(config, 'Description') ?? config.name;
    const moduleInfoUrl = `https://www.crosswire.org/sword/modules/ModInfo.jsp?modName=${encodeURIComponent(config.name)}`;
    const textSource = getSwordConfigValue(config, 'TextSource');
    const distributionLicense = getSwordConfigValue(
        config,
        'DistributionLicense'
    );
    const copyright =
        getSwordConfigValue(config, 'ShortCopyright') ??
        getSwordConfigValue(config, 'Copyright');

    const notice = [
        copyright,
        distributionLicense && !/public\s*domain/i.test(distributionLicense)
            ? distributionLicense
            : null,
    ].filter((n): n is string => !!n);

    return {
        id: config.name.toLowerCase(),
        name: description,
        englishName: description,
        language: getSwordLanguage(getSwordConfigValue(config, 'Lang')),
        direction:
            getSwordConfigValue(config, 'Direction')?.toUpperCase() === 'RTOL'
                ? 'rtl'
                : 'ltr',
        website:
            textSource && /^https?:\/\//i.test(textSource)
                ? textSource
                : moduleInfoUrl,
        licenseUrl: moduleInfoUrl,
        licenseNotice: notice.length > 0 ? notice.join(' ') : null,
    };
}

/**
 * Converts the given SWORD language code (a BCP 47 tag like "en" or "grc") into an ISO 639-3 code.
 * @param lang The language code.
 */
export function getSwordLanguage(lang: string | null): string {
    const code = (lang ?? 'en').split(/[-_]/)[0].toLowerCase();
    if (code.length !== 2) {
        return code;
    }
    const name = getEnglishName(code);
    return (
        (name && getAll639_2T().find((c) => getEnglishName(c) === name)) || code
    );
}
