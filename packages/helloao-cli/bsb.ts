import path from 'node:path';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import {
    copyFile,
    mkdir,
    mkdtemp,
    readdir,
    rename,
    rm,
    writeFile,
} from 'node:fs/promises';
import fsExtra from 'fs-extra';
import { BlobWriter, Uint8ArrayReader, ZipReader } from '@zip.js/zip.js';
import { log } from '@helloao/tools';
import { InputTranslationMetadata } from '@helloao/tools/generation/common-types.js';
import {
    convertUsfmToUsx3,
    USFM_PREPROCESSING_VERSION,
    findBibleMultiConverterJar,
    printConversionInstructions,
    promptForBibleMultiConverter,
} from './conversion.js';
import { loadMetadataOverride } from './meta.js';

const { exists, readFile } = fsExtra;

/**
 * The URL of the zip file that contains the USFM files of the Berean Standard Bible.
 */
export const BSB_USFM_ZIP_URL = 'https://bereanbible.com/bsb_usfm.zip';

/**
 * The ID of the Berean Standard Bible in the API.
 */
export const BSB_TRANSLATION_ID = 'BSB';

/**
 * The name of the file that is written into the BSB translation directory.
 * It records the URL and SHA-256 hash of the downloaded zip so that unchanged downloads can be skipped.
 */
export const BSB_MARKER_FILE = 'bsb.txt';

/**
 * The metadata that is used for the BSB when the meta directory doesn't have a BSB.json file.
 */
export const BSB_METADATA: InputTranslationMetadata = {
    id: BSB_TRANSLATION_ID,
    name: 'Berean Standard Bible',
    direction: 'ltr',
    englishName: 'Berean Standard Bible',
    language: 'eng',
    licenseUrl: 'https://berean.bible/',
    shortName: 'BSB',
    website: 'https://berean.bible/',
    license: {
        attribution: 'not-required',
        commercialUse: 'allowed',
        derivatives: 'allowed',
        copyleft: false,
        publicDomain: true,
    },
};

/**
 * The options for fetching the BSB.
 */
export interface FetchBsbTranslationOptions {
    /**
     * The URL of the USFM zip file. Defaults to {@link BSB_USFM_ZIP_URL}.
     */
    url?: string;

    /**
     * Whether to convert the USFM files to USX3 with BibleMultiConverter. Defaults to true.
     */
    convertToUsx3?: boolean;

    /**
     * Path to BibleMultiConverter.jar file. If not provided, will search common locations.
     */
    bibleMultiConverterPath?: string;

    /**
     * Whether the translation should be replaced even if the downloaded zip and metadata haven't changed.
     * Defaults to false.
     */
    overwrite?: boolean;

    /**
     * The metadata to write. Defaults to the meta directory's BSB.json, or {@link BSB_METADATA}.
     */
    metadata?: InputTranslationMetadata;
}

/**
 * Downloads the BSB USFM zip from bereanbible.com and converts it to USX3 the same way that
 * translations are sourced from eBible (with BibleMultiConverter).
 *
 * The translation is written to `<dir>/BSB/` along with a `metadata.json` and a `bsb.txt` marker file,
 * so the directory can be imported with the import-translations command.
 * The existing translation directory is only replaced once the download and conversion have succeeded.
 * @param dir The directory that the translation should be written to.
 * @param options The options.
 * @returns Whether the translation was (re)written.
 */
export async function fetchBsbTranslation(
    dir: string,
    options: FetchBsbTranslationOptions = {}
): Promise<boolean> {
    const logger = log.getLogger();
    const {
        url = BSB_USFM_ZIP_URL,
        convertToUsx3 = true,
        overwrite = false,
    } = options;

    const metadataObject =
        options.metadata ??
        (await loadMetadataOverride(BSB_TRANSLATION_ID)) ??
        BSB_METADATA;
    const translationDir = path.resolve(dir, metadataObject.id);
    const metadata = JSON.stringify(metadataObject, null, 4) + '\n';

    let jarPath: string | null = null;
    if (convertToUsx3) {
        jarPath = await findBibleMultiConverterJar(
            options.bibleMultiConverterPath
        );
        if (!jarPath) {
            jarPath = await promptForBibleMultiConverter();
        }
        if (!jarPath) {
            printConversionInstructions();
            throw new Error(
                'BibleMultiConverter JAR not found. Cannot convert USFM to USX3.'
            );
        }
    }

    logger.log('Downloading', url);
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(
            `Failed to download ${url}: ${response.status} ${response.statusText}`
        );
    }
    const content = new Uint8Array(await response.arrayBuffer());
    const sha256 = createHash('sha256').update(content).digest('hex');
    const marker = `Source: ${url}\nSHA-256: ${sha256}\nFormat: ${
        convertToUsx3
            ? `USX3\nPreprocessing: ${USFM_PREPROCESSING_VERSION}`
            : 'USFM'
    }\n`;

    if (
        !overwrite &&
        (await readFileIfExists(path.join(translationDir, BSB_MARKER_FILE))) ===
            marker &&
        (await readFileIfExists(path.join(translationDir, 'metadata.json'))) ===
            metadata
    ) {
        logger.log(`${metadataObject.id} is up to date. Skipping.`);
        return false;
    }

    const tempDir = await mkdtemp(path.join(tmpdir(), 'bible-api-bsb-'));
    const partDir = `${translationDir}.part`;
    await rm(partDir, { recursive: true, force: true });
    try {
        const usfmDir = path.join(tempDir, 'usfm');
        const usfmFileCount = await extractUsfmFiles(content, usfmDir);
        if (usfmFileCount === 0) {
            throw new Error(`No USFM files were found in ${url}.`);
        }
        logger.log(`Extracted ${usfmFileCount} USFM files.`);

        if (convertToUsx3) {
            const success = await convertUsfmToUsx3(usfmDir, partDir, jarPath!);
            if (!success) {
                throw new Error(
                    `Failed to convert the ${metadataObject.id} USFM files to USX3.`
                );
            }
        } else {
            await mkdir(partDir, { recursive: true });
            for (const file of await readdir(usfmDir)) {
                await copyFile(
                    path.join(usfmDir, file),
                    path.join(partDir, file)
                );
            }
        }

        await writeFile(path.join(partDir, 'metadata.json'), metadata, 'utf-8');
        await writeFile(path.join(partDir, BSB_MARKER_FILE), marker, 'utf-8');
        await rm(translationDir, { recursive: true, force: true });
        await rename(partDir, translationDir);
    } catch (err) {
        await rm(partDir, { recursive: true, force: true });
        throw err;
    } finally {
        await rm(tempDir, { recursive: true, force: true });
    }

    logger.log(`Saved ${metadataObject.id} to ${translationDir}`);
    return true;
}

/**
 * Extracts the USFM files in the given zip into the given directory.
 * Files in subdirectories are placed directly in the directory, and `.sfm` files are given a `.usfm` extension.
 * @returns The number of USFM files that were extracted.
 */
async function extractUsfmFiles(
    zipContent: Uint8Array,
    dir: string
): Promise<number> {
    await mkdir(dir, { recursive: true });
    const zip = new ZipReader(new Uint8ArrayReader(zipContent));
    try {
        let count = 0;
        const written = new Set<string>();
        for (const entry of await zip.getEntries()) {
            if (entry.directory || !entry.getData) {
                continue;
            }
            const base = path.posix.basename(
                entry.filename.replace(/\\/g, '/')
            );
            if (base.startsWith('.') || !/\.u?sfm$/i.test(base)) {
                continue;
            }
            const name = base.replace(/\.u?sfm$/i, '.usfm');
            if (written.has(name.toLowerCase())) {
                throw new Error(
                    `The zip contains more than one USFM file named ${name}.`
                );
            }
            written.add(name.toLowerCase());
            const blob = await entry.getData(new BlobWriter());
            await writeFile(
                path.join(dir, name),
                new Uint8Array(await blob.arrayBuffer())
            );
            count++;
        }
        return count;
    } finally {
        await zip.close();
    }
}

async function readFileIfExists(file: string): Promise<string | null> {
    return (await exists(file)) ? await readFile(file, 'utf-8') : null;
}
