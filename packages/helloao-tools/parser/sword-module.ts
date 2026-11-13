import { BookId } from '../utils.js';
import {
    KJV_VERSIFICATION,
    SwordVersification,
} from './sword-versification.js';

/**
 * The configuration of a SWORD module, as read from its .conf file in the mods.d directory.
 */
export interface SwordModuleConfig {
    /**
     * The unique name of the module. (e.g. "Clarke")
     */
    name: string;

    /**
     * The values of the config, by key.
     * Keys that appear more than once (like GlobalOptionFilter) have more than one value.
     */
    values: Record<string, string[]>;
}

/**
 * Parses the given SWORD module .conf file.
 * See https://wiki.crosswire.org/DevTools:conf_Files
 * @param text The text of the .conf file.
 */
export function parseSwordConfig(text: string): SwordModuleConfig {
    const lines = text.replace(/^﻿/, '').split(/\r?\n/);
    let name: string | null = null;
    const values: Record<string, string[]> = {};

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        // Lines that end with a backslash continue on the next line.
        while (line.endsWith('\\') && i + 1 < lines.length) {
            line = line.slice(0, -1) + '\n' + lines[++i];
        }

        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) {
            continue;
        }

        if (name === null) {
            const section = /^\[(.+)\]$/.exec(trimmed);
            if (section) {
                name = section[1].trim();
            }
            continue;
        }

        const equals = line.indexOf('=');
        if (equals <= 0) {
            continue;
        }
        const key = line.slice(0, equals).trim();
        const value = line.slice(equals + 1).trim();
        (values[key] ??= []).push(value);
    }

    if (!name) {
        throw new Error(
            'Invalid SWORD module config: missing the [ModuleName] section.'
        );
    }

    return { name, values };
}

/**
 * Gets the first value for the given key in the given SWORD module config.
 * Keys are matched case-insensitively.
 * @param config The config.
 * @param key The key.
 */
export function getSwordConfigValue(
    config: SwordModuleConfig,
    key: string
): string | null {
    if (key in config.values) {
        return config.values[key][0] ?? null;
    }
    const lower = key.toLowerCase();
    for (let k in config.values) {
        if (k.toLowerCase() === lower) {
            return config.values[k][0] ?? null;
        }
    }
    return null;
}

/**
 * The SWORD module drivers that store commentaries, and that can be read.
 */
const COMMENTARY_DRIVERS = ['zcom', 'zcom4', 'rawcom', 'rawcom4'] as const;

type CommentaryDriver = (typeof COMMENTARY_DRIVERS)[number];

/**
 * Determines whether the given SWORD module config describes a commentary module.
 * @param config The config.
 */
export function isSwordCommentaryModule(config: SwordModuleConfig): boolean {
    const driver = getSwordConfigValue(config, 'ModDrv')?.toLowerCase();
    return COMMENTARY_DRIVERS.includes(driver as CommentaryDriver);
}

/**
 * Gets the paths of the files that make up the given commentary module, relative to its DataPath.
 * @param config The config of the module.
 */
export function getSwordCommentaryFileNames(config: SwordModuleConfig): {
    ot: SwordTestamentFileNames;
    nt: SwordTestamentFileNames;
} {
    const driver = getCommentaryDriver(config);
    const names = (testament: string): SwordTestamentFileNames =>
        driver.startsWith('z')
            ? {
                  blocks: `${testament}.bzs`,
                  index: `${testament}.bzv`,
                  data: `${testament}.bzz`,
              }
            : {
                  index: `${testament}.vss`,
                  data: testament,
              };
    return { ot: names('ot'), nt: names('nt') };
}

/**
 * The names of the files that store one testament of a commentary module.
 */
export interface SwordTestamentFileNames {
    /**
     * The block index. Only compressed (zCom) modules have one.
     */
    blocks?: string;

    /**
     * The verse index.
     */
    index: string;

    /**
     * The text data.
     */
    data: string;
}

/**
 * The contents of the files that store one testament of a commentary module.
 */
export interface SwordTestamentFiles {
    blocks?: Uint8Array;
    index: Uint8Array;
    data: Uint8Array;
}

/**
 * An entry in a SWORD commentary module.
 */
export interface SwordCommentaryEntry {
    /**
     * The USFM ID of the book that the entry is for.
     */
    book: BookId;

    /**
     * The chapter that the entry is for.
     * 0 means that the entry is the introduction of the book.
     */
    chapter: number;

    /**
     * The verse that the entry is for.
     * 0 means that the entry is the introduction of the chapter.
     */
    verse: number;

    /**
     * The OSIS, ThML, or GBF markup of the entry.
     */
    text: string;
}

/**
 * Inflates zlib compressed data.
 */
export type InflateFunction = (data: Uint8Array) => Uint8Array;

/**
 * Reads the entries from the given SWORD commentary module.
 * Supports the zCom, zCom4, RawCom, and RawCom4 drivers, with the KJV versification.
 * Entries that link to the entry before them (because the comment covers a range of verses) are only included once, for the first verse.
 * @param config The config of the module.
 * @param files The contents of the files for each testament. Testaments that the module doesn't have can be omitted.
 * @param inflate The function that should be used to decompress zlib compressed blocks.
 */
export function readSwordCommentaryEntries(
    config: SwordModuleConfig,
    files: { ot?: SwordTestamentFiles | null; nt?: SwordTestamentFiles | null },
    inflate: InflateFunction
): SwordCommentaryEntry[] {
    const driver = getCommentaryDriver(config);
    const versification = getVersification(config);

    const cipherKey = getSwordConfigValue(config, 'CipherKey');
    if (cipherKey !== null) {
        throw new Error(
            `The SWORD module ${config.name} is encrypted, which is not supported.`
        );
    }

    const compressed = driver.startsWith('z');
    if (compressed) {
        const compressType = (
            getSwordConfigValue(config, 'CompressType') ?? 'ZIP'
        ).toUpperCase();
        if (compressType !== 'ZIP') {
            throw new Error(
                `The SWORD module ${config.name} uses the unsupported ${compressType} compression.`
            );
        }
    }

    const encoding = (
        getSwordConfigValue(config, 'Encoding') ?? 'Latin-1'
    ).toUpperCase();
    const decoder = new TextDecoder(
        encoding === 'UTF-8' ? 'utf-8' : 'windows-1252'
    );

    // zCom and RawCom store the entry sizes as 2 byte integers, while zCom4 and RawCom4 use 4 bytes.
    const sizeBytes = driver.endsWith('4') ? 4 : 2;

    const entries: SwordCommentaryEntry[] = [];
    for (let testament of ['ot', 'nt'] as const) {
        const testamentFiles = files[testament];
        if (!testamentFiles) {
            continue;
        }
        const getText = compressed
            ? createCompressedReader(testamentFiles, sizeBytes, inflate)
            : createRawReader(testamentFiles, sizeBytes);
        const indexSize = (compressed ? 8 : 4) + sizeBytes;
        const count = Math.floor(testamentFiles.index.length / indexSize);

        let previousKey: string | null = null;
        for (let ref of iterateTestament(versification[testament])) {
            if (ref.index >= count) {
                break;
            }
            const entry = getText(ref.index);
            if (!entry) {
                previousKey = null;
                continue;
            }
            if (entry.key === previousKey) {
                // The entry is linked to the previous one.
                continue;
            }
            previousKey = entry.key;

            if (!ref.book) {
                // Module and testament headings
                continue;
            }

            entries.push({
                book: ref.book,
                chapter: ref.chapter,
                verse: ref.verse,
                text: decoder.decode(entry.bytes),
            });
        }
    }

    return entries;
}

function getCommentaryDriver(config: SwordModuleConfig): CommentaryDriver {
    const driver = getSwordConfigValue(config, 'ModDrv')?.toLowerCase();
    if (!COMMENTARY_DRIVERS.includes(driver as CommentaryDriver)) {
        throw new Error(
            `The SWORD module ${config.name} uses the ${driver ?? 'missing'} driver, but only ${COMMENTARY_DRIVERS.join(', ')} commentaries are supported.`
        );
    }
    return driver as CommentaryDriver;
}

function getVersification(config: SwordModuleConfig): SwordVersification {
    const versification = getSwordConfigValue(config, 'Versification') ?? 'KJV';
    if (versification.toUpperCase() !== 'KJV') {
        throw new Error(
            `The SWORD module ${config.name} uses the ${versification} versification, but only KJV is supported.`
        );
    }
    return KJV_VERSIFICATION;
}

interface IndexRef {
    index: number;
    book: BookId | null;
    chapter: number;
    verse: number;
}

/**
 * Iterates the references in the index of a testament.
 * SWORD indexes start with a heading for the module and a heading for the testament.
 * Then each book has a heading (its introduction), and each chapter has a heading (its introduction) followed by its verses.
 */
function* iterateTestament(
    books: readonly (readonly [BookId, readonly number[]])[]
): Generator<IndexRef> {
    let index = 0;
    yield { index: index++, book: null, chapter: 0, verse: 0 };
    yield { index: index++, book: null, chapter: 0, verse: 0 };
    for (let [book, chapters] of books) {
        yield { index: index++, book, chapter: 0, verse: 0 };
        for (let c = 0; c < chapters.length; c++) {
            for (let verse = 0; verse <= chapters[c]; verse++) {
                yield { index: index++, book, chapter: c + 1, verse };
            }
        }
    }
}

interface RawEntry {
    /**
     * The key that identifies where the entry is stored. Entries that are linked together have the same key.
     */
    key: string;
    bytes: Uint8Array;
}

function readUint(data: DataView, offset: number, bytes: number): number {
    return bytes === 4
        ? data.getUint32(offset, true)
        : data.getUint16(offset, true);
}

function view(data: Uint8Array): DataView {
    return new DataView(data.buffer, data.byteOffset, data.byteLength);
}

function createRawReader(
    files: SwordTestamentFiles,
    sizeBytes: number
): (index: number) => RawEntry | null {
    const index = view(files.index);
    const entrySize = 4 + sizeBytes;
    return (i) => {
        const start = index.getUint32(i * entrySize, true);
        const size = readUint(index, i * entrySize + 4, sizeBytes);
        if (size <= 0 || start + size > files.data.length) {
            return null;
        }
        return {
            key: `${start}:${size}`,
            bytes: files.data.subarray(start, start + size),
        };
    };
}

function createCompressedReader(
    files: SwordTestamentFiles,
    sizeBytes: number,
    inflate: InflateFunction
): (index: number) => RawEntry | null {
    if (!files.blocks) {
        throw new Error('Compressed SWORD modules require a block index.');
    }
    const blocks = view(files.blocks);
    const blockCount = Math.floor(files.blocks.length / 12);
    const index = view(files.index);
    const entrySize = 8 + sizeBytes;

    // Only one block is cached because entries are read in order.
    let cachedBlock = -1;
    let cachedData: Uint8Array | null = null;
    const getBlock = (block: number) => {
        if (block !== cachedBlock) {
            const start = blocks.getUint32(block * 12, true);
            const compressedSize = blocks.getUint32(block * 12 + 4, true);
            cachedData = inflate(
                files.data.subarray(start, start + compressedSize)
            );
            cachedBlock = block;
        }
        return cachedData!;
    };

    return (i) => {
        const block = index.getUint32(i * entrySize, true);
        const start = index.getUint32(i * entrySize + 4, true);
        const size = readUint(index, i * entrySize + 8, sizeBytes);
        if (size <= 0 || block >= blockCount) {
            return null;
        }
        const data = getBlock(block);
        return {
            key: `${block}:${start}:${size}`,
            bytes: data.subarray(start, start + size),
        };
    };
}
