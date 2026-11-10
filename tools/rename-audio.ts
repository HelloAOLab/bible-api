/**
 * Renames a flat list of chapter audio files into the folder structure the
 * Free Use Bible API serves audio from:
 *
 *     {output}/api/{translation}/{bookId}/{chapter}/audio/{reader}.mp3
 *
 * Input files are expected to contain a book number and a chapter number in
 * their name, for example:
 *
 *     CUV_B01C001.mp3 -> api/{translation}/GEN/1/audio/{reader}.mp3
 *     CUV_B04C008.mp3 -> api/{translation}/NUM/8/audio/{reader}.mp3
 *
 * Book numbers follow the canonical order (01 = GEN ... 66 = REV, 67+ =
 * apocrypha) defined in packages/helloao-tools/generation/book-order.ts.
 *
 * Usage:
 *
 *     npm run rename:audio -- --input ./cuv-audio --translation cmn_cuv --reader default
 *
 * Options:
 *     --input, -i        Directory that holds the flat list of audio files. (required)
 *     --translation, -t  Translation ID, e.g. BSB. (required)
 *     --reader, -r       Reader ID, used as the file name, e.g. hays. (required)
 *     --output, -o       Directory to write the api/ tree into. Defaults to ./audio-out
 *     --pattern, -p      Regex with two capture groups (book number, chapter number)
 *                        matched against each file name. Defaults to B(\d+)C(\d+)
 *     --move             Move the files instead of copying them.
 *     --overwrite        Replace files that already exist at the destination.
 *     --dry-run          Print what would happen without touching any files.
 *     --help, -h         Show this help.
 */

import { existsSync } from 'node:fs';
import { copyFile, mkdir, readdir, rename, unlink } from 'node:fs/promises';
import path from 'node:path';
import { parseArgs } from 'node:util';
import {
    bookChapterCountMap,
    bookOrderMap,
} from '../packages/helloao-tools/generation/book-order.ts';

const DEFAULT_PATTERN = 'B(\\d+)C(\\d+)';
const AUDIO_EXTENSION = '.mp3';

const HELP = `Usage: npm run rename:audio -- --input <dir> --translation <id> --reader <id> [options]

Renames files like CUV_B01C001.mp3 into api/{translation}/GEN/1/audio/{reader}.mp3

Options:
  -i, --input <dir>         Directory that holds the flat list of audio files (required)
  -t, --translation <id>    Translation ID, e.g. BSB (required)
  -r, --reader <id>         Reader ID, used as the file name, e.g. hays (required)
  -o, --output <dir>        Directory to write the api/ tree into (default: ./audio-out)
  -p, --pattern <regex>     Regex with two capture groups: book number, chapter number
                            (default: ${DEFAULT_PATTERN}, case-insensitive)
      --move                Move files instead of copying them
      --overwrite           Replace files that already exist at the destination
      --dry-run             Print the plan without touching any files
  -h, --help                Show this help`;

/** Maps a book number (1 = GEN) to its book ID. */
const bookIdByNumber = new Map<number, string>(
    [...bookOrderMap].map(([id, order]) => [order, id])
);

interface PlannedFile {
    source: string;
    destination: string;
    bookId: string;
    chapter: number;
}

async function main() {
    const { values } = parseArgs({
        options: {
            input: { type: 'string', short: 'i' },
            output: { type: 'string', short: 'o', default: './audio-out' },
            translation: { type: 'string', short: 't' },
            reader: { type: 'string', short: 'r' },
            pattern: { type: 'string', short: 'p', default: DEFAULT_PATTERN },
            move: { type: 'boolean', default: false },
            overwrite: { type: 'boolean', default: false },
            'dry-run': { type: 'boolean', default: false },
            help: { type: 'boolean', short: 'h', default: false },
        },
    });

    if (values.help) {
        console.log(HELP);
        return;
    }

    const missing = (['input', 'translation', 'reader'] as const).filter(
        (key) => !values[key]
    );
    if (missing.length > 0) {
        console.error(
            `Missing required option(s): ${missing.map((m) => `--${m}`).join(', ')}\n`
        );
        console.error(HELP);
        process.exitCode = 1;
        return;
    }

    const input = path.resolve(values.input!);
    const output = path.resolve(values.output!);
    const translation = values.translation!;
    const reader = values.reader!;
    const dryRun = values['dry-run']!;
    const pattern = new RegExp(values.pattern!, 'i');

    for (const [name, value] of [
        ['translation', translation],
        ['reader', reader],
    ]) {
        if (/[\\/]/.test(value) || value === '.' || value === '..') {
            throw new Error(
                `--${name} must not contain path separators: ${value}`
            );
        }
    }

    const entries = await readdir(input, { withFileTypes: true });
    const audioFiles = entries
        .filter(
            (e) =>
                e.isFile() &&
                path.extname(e.name).toLowerCase() === AUDIO_EXTENSION
        )
        .map((e) => e.name)
        .sort();

    const planned: PlannedFile[] = [];
    const skipped: string[] = [];
    const destinations = new Map<string, string>();

    for (const name of audioFiles) {
        const match = pattern.exec(path.basename(name, path.extname(name)));
        if (!match || match.length < 3) {
            skipped.push(`${name}: does not match ${pattern}`);
            continue;
        }

        const bookNumber = parseInt(match[1], 10);
        const chapter = parseInt(match[2], 10);
        const bookId = bookIdByNumber.get(bookNumber);
        if (!bookId) {
            skipped.push(`${name}: unknown book number ${bookNumber}`);
            continue;
        }

        const chapterCount = bookChapterCountMap.get(bookId);
        if (
            chapter < 1 ||
            (chapterCount !== undefined && chapter > chapterCount)
        ) {
            skipped.push(
                `${name}: ${bookId} has ${chapterCount ?? '?'} chapters, got chapter ${chapter}`
            );
            continue;
        }

        const destination = path.join(
            output,
            'api',
            translation,
            bookId,
            chapter.toString(),
            'audio',
            `${reader}${AUDIO_EXTENSION}`
        );

        const previous = destinations.get(destination);
        if (previous) {
            skipped.push(
                `${name}: ${bookId} ${chapter} already provided by ${previous}`
            );
            continue;
        }
        destinations.set(destination, name);

        planned.push({
            source: path.join(input, name),
            destination,
            bookId,
            chapter,
        });
    }

    const verb = values.move ? 'move' : 'copy';
    let done = 0;
    let existing = 0;

    for (const file of planned) {
        const relative = path.relative(output, file.destination);
        if (existsSync(file.destination) && !values.overwrite) {
            existing++;
            console.warn(
                `exists, skipping: ${relative}  (use --overwrite to replace)`
            );
            continue;
        }

        console.log(
            `${dryRun ? `[dry-run] ${verb}` : verb}: ${path.basename(file.source)} -> ${relative}`
        );
        if (dryRun) {
            done++;
            continue;
        }

        await mkdir(path.dirname(file.destination), { recursive: true });
        if (values.move) {
            await moveFile(file.source, file.destination);
        } else {
            await copyFile(file.source, file.destination);
        }
        done++;
    }

    if (skipped.length > 0) {
        console.warn(`\nSkipped ${skipped.length} file(s):`);
        for (const s of skipped) {
            console.warn(`  ${s}`);
        }
    }

    reportMissingChapters(planned);

    console.log(
        `\n${dryRun ? 'Would ' + verb : verb === 'move' ? 'Moved' : 'Copied'} ${done} file(s) into ${path.join(output, 'api', translation)}` +
            (existing > 0 ? `, ${existing} already existed` : '') +
            (skipped.length > 0 ? `, ${skipped.length} skipped` : '')
    );

    if (skipped.length > 0) {
        process.exitCode = 1;
    }
}

/** Lists chapters missing from any book that has at least one file. */
function reportMissingChapters(planned: PlannedFile[]) {
    const chaptersByBook = new Map<string, Set<number>>();
    for (const file of planned) {
        let set = chaptersByBook.get(file.bookId);
        if (!set) {
            set = new Set();
            chaptersByBook.set(file.bookId, set);
        }
        set.add(file.chapter);
    }

    const gaps: string[] = [];
    for (const [bookId, chapters] of chaptersByBook) {
        const count = bookChapterCountMap.get(bookId);
        if (!count) continue;
        const missing: number[] = [];
        for (let c = 1; c <= count; c++) {
            if (!chapters.has(c)) missing.push(c);
        }
        if (missing.length > 0) {
            gaps.push(`  ${bookId}: ${missing.join(', ')}`);
        }
    }

    if (gaps.length > 0) {
        console.warn(`\nBooks with missing chapters:`);
        for (const g of gaps) console.warn(g);
    }
}

async function moveFile(source: string, destination: string) {
    try {
        await rename(source, destination);
    } catch (err: any) {
        if (err?.code !== 'EXDEV') throw err;
        // Different file system: fall back to copy + delete.
        await copyFile(source, destination);
        await unlink(source);
    }
}

main().catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exitCode = 1;
});
