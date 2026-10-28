import path from 'node:path';
import { createHash } from 'node:crypto';
import { mkdir, rename, rm, writeFile } from 'node:fs/promises';
import fsExtra from 'fs-extra';
import { DOMParser } from 'linkedom';
import { log } from '@helloao/tools';
import { InputTranslationMetadata } from '@helloao/tools/generation/common-types.js';
import { convertOsisToUsfm } from '@helloao/tools/parser/osis-to-usfm.js';

const { exists, readFile } = fsExtra;

/**
 * An OSIS translation that is downloaded from a pinned URL and converted to USFM.
 */
export interface OsisTranslationSource {
    /**
     * The URL of the OSIS XML file. Should point at a fixed commit so that the text doesn't change.
     */
    url: string;

    /**
     * The expected SHA-256 hash of the downloaded file.
     */
    sha256: string;

    /**
     * The metadata that is written alongside the converted USFM files.
     */
    metadata: InputTranslationMetadata;

    /**
     * Corrections for errors in the source, applied to the downloaded XML after its hash is checked.
     * Each `find` string must occur exactly once.
     */
    fixes?: OsisFix[];
}

/**
 * A correction to the text of an OSIS file.
 */
export interface OsisFix {
    /**
     * The text to replace. It must occur exactly once in the file.
     */
    find: string;

    /**
     * The replacement text.
     */
    replace: string;
}

const KOUGO_URL =
    'https://raw.githubusercontent.com/seven1m/open-bibles/3ca49fb73163f42297a32b7b1b1c40cf3dafd84b/jpn-kougo.osis.xml';
const BUNGO_URL =
    'https://raw.githubusercontent.com/KallynGowdy/open-bibles/b8bd6285c0a7e18acfe6abda56597135cb83338c/jpn-bungo.osis.xml';

/**
 * The OSIS translations that the fetch-osis-translations command downloads.
 */
export const OSIS_TRANSLATIONS: OsisTranslationSource[] = [
    {
        // The Japan Bible Society's 口語訳 (NT 1954, OT 1955). It was published as a work
        // credited to an organization, so its 50 year copyright term expired at the end of 2005.
        url: KOUGO_URL,
        sha256: '6930015f5d0faf49f3038a7e2f482aeb45939510b6acb8a8fb1945640c1d91b6',
        metadata: {
            id: 'jpn_kou',
            name: '口語訳',
            englishName: 'Japanese Kougo-yaku (1955)',
            shortName: '口語訳',
            language: 'jpn',
            direction: 'ltr',
            website:
                'https://github.com/seven1m/open-bibles/blob/3ca49fb73163f42297a32b7b1b1c40cf3dafd84b/jpn-kougo.osis.xml',
            licenseUrl:
                'https://github.com/seven1m/open-bibles/blob/3ca49fb73163f42297a32b7b1b1c40cf3dafd84b/jpn-kougo.osis.xml',
            licenseNotice:
                'The public domain Japan Bible Society 口語訳 edition, published in 1954 (New Testament) and 1955 (Old Testament), is taken from open-bibles commit 3ca49fb73163f42297a32b7b1b1c40cf3dafd84b with furigana removed.',
            license: {
                publicDomain: true,
                attribution: 'not-required',
                commercialUse: 'allowed',
                derivatives: 'allowed',
                copyleft: false,
            },
        },
    },
    {
        // The 文語訳: the Meiji 元訳 Old Testament (1887) and the Taisho 改訳 New Testament (1917).
        // Both were published as works credited to an organization, so their copyright terms have long expired.
        url: BUNGO_URL,
        sha256: '8fba325a2a04f03a85c06a6a4695684ae9bf55f1c69fecc4838d8b6384cdd2e8',
        metadata: {
            id: 'jpn_bun',
            name: '文語訳',
            englishName: 'Japanese Bungo-yaku (1887/1917)',
            shortName: '文語訳',
            language: 'jpn',
            direction: 'ltr',
            website:
                'https://github.com/KallynGowdy/open-bibles/blob/b8bd6285c0a7e18acfe6abda56597135cb83338c/jpn-bungo.osis.xml',
            licenseUrl:
                'https://github.com/KallynGowdy/open-bibles/blob/b8bd6285c0a7e18acfe6abda56597135cb83338c/jpn-bungo.osis.xml',
            licenseNotice:
                'The public domain 文語訳, with the Meiji Old Testament (1887) and the Taisho New Testament (1917), is taken from open-bibles commit b8bd6285c0a7e18acfe6abda56597135cb83338c with furigana removed.',
            license: {
                publicDomain: true,
                attribution: 'not-required',
                commercialUse: 'allowed',
                derivatives: 'allowed',
                copyleft: false,
            },
        },
        fixes: [
            // The source numbers 2 Samuel 19:25 and 2 Chronicles 2:13 as the verses before them.
            {
                find: '<verse osisID="2Sam.19.26"><w gloss="かれ">彼</w>エルサレム',
                replace:
                    '<verse osisID="2Sam.19.25"><w gloss="かれ">彼</w>エルサレム',
            },
            {
                find: '<verse osisID="2Chr.2.12"><w gloss="いま">今</w>',
                replace: '<verse osisID="2Chr.2.13"><w gloss="いま">今</w>',
            },
        ],
    },
];

/**
 * Converts an OSIS file into per-book USFM files.
 * @param file The OSIS XML file to read.
 * @param dir The output directory.
 * @param options Whether existing output files may be overwritten.
 */
export async function convertOsisToUsfmFiles(
    file: string,
    dir: string,
    options: { overwrite?: boolean } = {}
): Promise<void> {
    const logger = log.getLogger();
    const xml = await readFile(file, 'utf-8');
    const books = convertOsisToUsfm(xml, new DOMParser() as any);
    await writeUsfmBooks(books, dir, !!options.overwrite);
    logger.log(`Wrote ${books.length} USFM books to ${dir}`);
}

/**
 * The name of the file that is written into each translation directory that was fetched from an OSIS source.
 * It records the URL and SHA-256 hash of the source so that unchanged translations can be skipped.
 */
export const OSIS_MARKER_FILE = 'osis.txt';

/**
 * The options for fetching OSIS translations.
 */
export interface FetchOsisTranslationsOptions {
    /**
     * Whether translations that were already fetched from the same source (with the same metadata) should be skipped.
     * Defaults to false.
     */
    skipUnchanged?: boolean;
}

/**
 * Downloads the given OSIS translations, checks their hashes, and converts them into USFM.
 * Each translation is written to `<dir>/<id>/` as one USFM file per book plus a `metadata.json`,
 * so the directory can be imported with the import-translations command.
 * A translation's directory is only replaced once its download and conversion have succeeded.
 * @param dir The directory that the translations should be written to.
 * @param sources The translations to fetch.
 * @param options The options.
 * @returns The IDs of the translations that were downloaded.
 */
export async function fetchOsisTranslations(
    dir: string,
    sources: OsisTranslationSource[] = OSIS_TRANSLATIONS,
    options: FetchOsisTranslationsOptions = {}
): Promise<string[]> {
    const logger = log.getLogger();
    const downloaded: string[] = [];

    for (const source of sources) {
        const translationDir = path.resolve(dir, source.metadata.id);
        const marker = createOsisMarker(source);
        const metadata = JSON.stringify(source.metadata, null, 4) + '\n';
        if (
            options.skipUnchanged &&
            (await readFileIfExists(
                path.join(translationDir, OSIS_MARKER_FILE)
            )) === marker &&
            (await readFileIfExists(
                path.join(translationDir, 'metadata.json')
            )) === metadata
        ) {
            logger.log(`${source.metadata.id} is up to date. Skipping.`);
            continue;
        }

        logger.log('Downloading', source.url);
        const response = await fetch(source.url);
        if (!response.ok) {
            throw new Error(
                `Failed to download ${source.url}: ${response.status} ${response.statusText}`
            );
        }

        const content = Buffer.from(await response.arrayBuffer());
        const sha256 = createHash('sha256').update(content).digest('hex');
        if (sha256 !== source.sha256) {
            throw new Error(
                `Downloaded ${source.url} has SHA-256 ${sha256}, expected ${source.sha256}.`
            );
        }

        const books = convertOsisToUsfm(
            applyOsisFixes(content.toString('utf-8'), source.fixes ?? []),
            new DOMParser() as any
        );

        const partDir = `${translationDir}.part`;
        await rm(partDir, { recursive: true, force: true });
        try {
            await writeUsfmBooks(books, partDir, false);
            await writeFile(
                path.join(partDir, 'metadata.json'),
                metadata,
                'utf-8'
            );
            await writeFile(
                path.join(partDir, OSIS_MARKER_FILE),
                marker,
                'utf-8'
            );
            await rm(translationDir, { recursive: true, force: true });
            await rename(partDir, translationDir);
        } catch (err) {
            await rm(partDir, { recursive: true, force: true });
            throw err;
        }

        logger.log(
            `Saved ${source.metadata.id} (${books.length} books) to ${translationDir}`
        );
        downloaded.push(source.metadata.id);
    }

    return downloaded;
}

/**
 * Applies the given fixes to an OSIS file.
 * @param xml The OSIS XML.
 * @param fixes The fixes to apply.
 */
export function applyOsisFixes(xml: string, fixes: OsisFix[]): string {
    for (const fix of fixes) {
        const count = xml.split(fix.find).length - 1;
        if (count !== 1) {
            throw new Error(
                `OSIS fix expected to find ${JSON.stringify(fix.find)} once, but found it ${count} times.`
            );
        }
        xml = xml.replace(fix.find, () => fix.replace);
    }
    return xml;
}

/**
 * Creates the contents of the marker file for the given OSIS translation.
 */
function createOsisMarker(source: OsisTranslationSource): string {
    let marker = `Source: ${source.url}\nSHA-256: ${source.sha256}\n`;
    if (source.fixes?.length) {
        const fixes = createHash('sha256')
            .update(JSON.stringify(source.fixes))
            .digest('hex');
        marker += `Fixes: ${fixes}\n`;
    }
    return marker;
}

async function readFileIfExists(file: string): Promise<string | null> {
    return (await exists(file)) ? await readFile(file, 'utf-8') : null;
}

/**
 * Writes the given USFM books to `<dir>/<book id>.usfm`.
 * Every destination is checked before any book is written.
 * @param books The converted books.
 * @param dir The output directory.
 * @param overwrite Whether existing files may be replaced.
 */
async function writeUsfmBooks(
    books: { bookId: string; usfm: string }[],
    dir: string,
    overwrite: boolean
): Promise<void> {
    const files = books.map((book) => ({
        path: path.join(dir, `${book.bookId.toLowerCase()}.usfm`),
        content: book.usfm,
    }));
    if (!overwrite) {
        for (const file of files) {
            if (await exists(file.path)) {
                throw new Error(
                    `File already exists: ${file.path}. Use --overwrite to replace it.`
                );
            }
        }
    }
    await mkdir(dir, { recursive: true });
    for (const file of files) {
        await writeFile(file.path, file.content, {
            encoding: 'utf-8',
            flag: overwrite ? 'w' : 'wx',
        });
    }
}
