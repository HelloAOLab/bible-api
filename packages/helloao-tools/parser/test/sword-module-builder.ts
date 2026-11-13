import { deflateSync } from 'zlib';
import { SwordTestamentFiles } from '../sword-module.js';
import { KJV_VERSIFICATION } from '../sword-versification.js';
import { BookId } from '../../utils.js';

/**
 * Builds the files for one testament of a SWORD commentary module, for use in tests.
 * Entries are given as [book, chapter, verse, text], where chapter 0 is the book introduction and verse 0 is the chapter introduction.
 * Entries with a text of null link to the entry before them.
 */
export function buildSwordTestament(
    testament: 'ot' | 'nt',
    entries: [BookId, number, number, string | null][],
    options: { compressed: boolean; sizeBytes?: 2 | 4 } = { compressed: true }
): SwordTestamentFiles {
    const sizeBytes = options.sizeBytes ?? 2;
    const indexes = new Map<string, number>();
    let index = 2;
    for (let [book, chapters] of KJV_VERSIFICATION[testament]) {
        indexes.set(`${book} 0 0`, index++);
        for (let c = 0; c < chapters.length; c++) {
            for (let v = 0; v <= chapters[c]; v++) {
                indexes.set(`${book} ${c + 1} ${v}`, index++);
            }
        }
    }

    const encoder = new TextEncoder();
    const locations: ({ start: number; size: number } | null)[] = new Array(
        index
    ).fill(null);
    const chunks: Uint8Array[] = [];
    let length = 0;
    let previous: { start: number; size: number } | null = null;
    for (let [book, chapter, verse, text] of entries) {
        const i = indexes.get(`${book} ${chapter} ${verse}`);
        if (i === undefined) {
            throw new Error(`Invalid reference ${book} ${chapter}:${verse}`);
        }
        if (text === null) {
            locations[i] = previous;
            continue;
        }
        const bytes = encoder.encode(text);
        previous = locations[i] = { start: length, size: bytes.length };
        chunks.push(bytes);
        length += bytes.length;
    }

    const block = new Uint8Array(length);
    let offset = 0;
    for (let chunk of chunks) {
        block.set(chunk, offset);
        offset += chunk.length;
    }

    const entrySize = (options.compressed ? 8 : 4) + sizeBytes;
    const indexData = new Uint8Array(index * entrySize);
    const indexView = new DataView(indexData.buffer);
    locations.forEach((location, i) => {
        if (!location) {
            return;
        }
        let o = i * entrySize;
        if (options.compressed) {
            indexView.setUint32(o, 0, true);
            o += 4;
        }
        indexView.setUint32(o, location.start, true);
        if (sizeBytes === 4) {
            indexView.setUint32(o + 4, location.size, true);
        } else {
            indexView.setUint16(o + 4, location.size, true);
        }
    });

    if (!options.compressed) {
        return { index: indexData, data: block };
    }

    const data = new Uint8Array(deflateSync(block));
    const blocks = new Uint8Array(12);
    const blocksView = new DataView(blocks.buffer);
    blocksView.setUint32(0, 0, true);
    blocksView.setUint32(4, data.length, true);
    blocksView.setUint32(8, block.length, true);
    return { blocks, index: indexData, data };
}
