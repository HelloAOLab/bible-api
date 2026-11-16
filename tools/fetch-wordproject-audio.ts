/**
 * Downloads the Wordproject audio Bibles (https://www.wordproject.org/bibles/audio/index.htm)
 * one zip per book, and unzips them into the folder structure the Free Use Bible API serves
 * audio from:
 *
 *     {output}/api/{translation}/{bookId}/{chapter}/audio/{reader}.mp3
 *
 * The reader is "wordproject" unless a set says otherwise (sets that share a translation with
 * another set, like the Cantonese reading of the Chinese Union Version, get their own reader).
 *
 * Which translation each audio Bible is written to, and how well it matches, is defined in
 * ./wordproject-audio.ts. Run with --list to see it.
 *
 * Usage:
 *
 *     npm run fetch:wordproject:audio -- --output ./audio-out
 *     npm run fetch:wordproject:audio -- --output ./audio-out --set 17_amharic --set 01_english
 *     npm run fetch:wordproject:audio -- --list
 *
 * Downloaded zips are kept in --cache so that a second run only downloads what is missing.
 */

import { existsSync } from 'node:fs';
import {
    mkdir,
    readFile,
    rename,
    rm,
    unlink,
    writeFile,
} from 'node:fs/promises';
import path from 'node:path';
import { parseArgs } from 'node:util';
import {
    configure,
    Uint8ArrayReader,
    Uint8ArrayWriter,
    ZipReader,
} from '@zip.js/zip.js';
import {
    bookChapterCountMap,
    bookOrderMap,
} from '../packages/helloao-tools/generation/book-order.ts';
import {
    DEFAULT_READER,
    getBookNumbers,
    getChapterFromEntryName,
    getZipUrls,
    WORDPROJECT_AUDIO_SETS,
    WORDPROJECT_MATCH_LEVELS,
    type WordprojectAudioSet,
    type WordprojectMatch,
} from './wordproject-audio.ts';

configure({ useWebWorkers: false });

const DEFAULT_CACHE = './sources/wordproject-audio';
const DEFAULT_MIN_MATCH: WordprojectMatch = 'poor';
const DOWNLOAD_ATTEMPTS = 2;

const HELP = `Usage: npm run fetch:wordproject:audio -- --output <dir> [options]

Downloads the Wordproject audio Bibles one zip per book and unzips them into
{output}/api/{translation}/{bookId}/{chapter}/audio/{reader}.mp3

Options:
  -o, --output <dir>        Directory to write the api/ tree into (required unless --list)
  -s, --set <id>            Only fetch this audio Bible, e.g. 17_amharic. Can be repeated
                            or comma separated. Defaults to every set.
      --min-match <level>   Skip sets whose translation match is worse than this:
                            ${WORDPROJECT_MATCH_LEVELS.filter((m) => m !== 'none').join(', ')} (default: ${DEFAULT_MIN_MATCH})
      --map <id>=<ids>      Write a set to these translations instead of the built-in ones,
                            e.g. --map 35_zulu=zul_bib. Comma separate several translations.
      --all-translations    Write a copy to every matching translation instead of only the first
      --cache <dir>         Where to keep downloaded zips (default: ${DEFAULT_CACHE})
      --delete-zips         Delete each zip after it is unzipped
      --mirror <url>        Another host to try when a download fails. Can be repeated.
      --concurrency <n>     Number of books to download at once (default: 3)
      --overwrite           Replace audio files that already exist
      --dry-run             Print what would be downloaded and written, without doing it
      --list                Print every audio Bible and its translations, then exit
  -h, --help                Show this help

Behind an HTTP proxy, set NODE_USE_ENV_PROXY=1 so Node's fetch uses HTTPS_PROXY.`;

/** Maps a book number (1 = GEN) to its book ID. */
const bookIdByNumber = new Map<number, string>(
    [...bookOrderMap].map(([id, order]) => [order, id])
);

interface Options {
    output: string;
    cache: string;
    allTranslations: boolean;
    deleteZips: boolean;
    mirrors: string[];
    overwrite: boolean;
    dryRun: boolean;
}

interface BookTask {
    set: WordprojectAudioSet;
    reader: string;
    translations: string[];
    bookNumber: number;
    bookId: string;
}

interface BookResult {
    task: BookTask;
    error?: string;
    written: number;
    existing: number;
    chapters: Set<number>;
    problems: string[];
}

async function main() {
    const { values } = parseArgs({
        options: {
            output: { type: 'string', short: 'o' },
            set: { type: 'string', short: 's', multiple: true },
            'min-match': { type: 'string', default: DEFAULT_MIN_MATCH },
            map: { type: 'string', multiple: true },
            'all-translations': { type: 'boolean', default: false },
            cache: { type: 'string', default: DEFAULT_CACHE },
            'delete-zips': { type: 'boolean', default: false },
            mirror: { type: 'string', multiple: true },
            concurrency: { type: 'string', default: '3' },
            overwrite: { type: 'boolean', default: false },
            'dry-run': { type: 'boolean', default: false },
            list: { type: 'boolean', default: false },
            help: { type: 'boolean', short: 'h', default: false },
        },
    });

    if (values.help) {
        console.log(HELP);
        return;
    }

    if (values.list) {
        printSets(WORDPROJECT_AUDIO_SETS);
        return;
    }

    if (!values.output) {
        console.error('Missing required option: --output\n');
        console.error(HELP);
        process.exitCode = 1;
        return;
    }

    const minMatch = values['min-match'] as WordprojectMatch;
    const minMatchIndex = WORDPROJECT_MATCH_LEVELS.indexOf(minMatch);
    if (minMatchIndex < 0 || minMatch === 'none') {
        throw new Error(
            `--min-match must be one of ${WORDPROJECT_MATCH_LEVELS.filter((m) => m !== 'none').join(', ')}`
        );
    }

    const concurrency = parseInt(values.concurrency!, 10);
    if (!Number.isInteger(concurrency) || concurrency < 1) {
        throw new Error('--concurrency must be a positive whole number');
    }

    const overrides = parseMapOptions(values.map ?? []);
    const sets = selectSets(values.set ?? [], overrides);

    const options: Options = {
        output: path.resolve(values.output),
        cache: path.resolve(values.cache!),
        allTranslations: values['all-translations']!,
        deleteZips: values['delete-zips']!,
        mirrors: values.mirror ?? [],
        overwrite: values.overwrite!,
        dryRun: values['dry-run']!,
    };

    const tasks: BookTask[] = [];
    const skipped: string[] = [];
    const destinations = new Map<string, string>();

    for (const set of sets) {
        const overridden = overrides.get(set.id);
        const translations = overridden ?? set.translations;
        if (translations.length === 0) {
            skipped.push(
                `${set.id}: no matching translation in the API (use --map ${set.id}=<translation> to write it somewhere)`
            );
            continue;
        }
        if (
            !overridden &&
            WORDPROJECT_MATCH_LEVELS.indexOf(set.match) > minMatchIndex
        ) {
            skipped.push(
                `${set.id}: match is "${set.match}", below --min-match ${minMatch}`
            );
            continue;
        }

        const reader = set.reader ?? DEFAULT_READER;
        const targets = options.allTranslations
            ? translations
            : translations.slice(0, 1);

        for (const translation of targets) {
            for (const value of [translation, reader]) {
                if (/[\\/]/.test(value) || value === '.' || value === '..') {
                    throw new Error(
                        `${set.id}: "${value}" must not contain path separators`
                    );
                }
            }
            const key = `${translation}/${reader}`;
            const previous = destinations.get(key);
            if (previous) {
                throw new Error(
                    `${set.id} and ${previous} would both write ${translation}/.../audio/${reader}.mp3. Give one of them a different reader in tools/wordproject-audio.ts or a different --map.`
                );
            }
            destinations.set(key, set.id);
        }

        for (const bookNumber of getBookNumbers(set)) {
            tasks.push({
                set,
                reader,
                translations: targets,
                bookNumber,
                bookId: bookIdByNumber.get(bookNumber)!,
            });
        }
    }

    if (skipped.length > 0) {
        console.warn(`Skipping ${skipped.length} audio Bible(s):`);
        for (const s of skipped) console.warn(`  ${s}`);
        console.warn('');
    }

    const selected = [...new Set(tasks.map((t) => t.set))];
    for (const set of selected) {
        if (set.match === 'poor' && !overrides.has(set.id)) {
            console.warn(
                `warning: ${set.id} is a poor match for ${set.translations[0]}: ${set.notes ?? ''}`
            );
        }
    }

    console.log(
        `${options.dryRun ? '[dry-run] ' : ''}Fetching ${tasks.length} book(s) from ${selected.length} audio Bible(s) into ${path.join(options.output, 'api')}\n`
    );

    const results = await runPool(tasks, concurrency, (task) =>
        processBook(task, options)
    );

    printSummary(results, options);
}

/**
 * Parses --map options like "35_zulu=zul_bib,zul_abc".
 */
function parseMapOptions(values: string[]): Map<string, string[]> {
    const map = new Map<string, string[]>();
    for (const value of values) {
        const [id, list] = value.split('=');
        if (!id || !list) {
            throw new Error(
                `--map must look like <set>=<translation>, got "${value}"`
            );
        }
        const set = findSet(id.trim());
        map.set(
            set.id,
            list
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean)
        );
    }
    return map;
}

/**
 * Finds the sets with the given folder (e.g. 04_chinese), number (e.g. 04 or 4) or zip ID (e.g. 2_BR).
 * A number can match more than one set, e.g. 02 matches both Portuguese narrations.
 */
function findSets(id: string): WordprojectAudioSet[] {
    const exact = WORDPROJECT_AUDIO_SETS.filter(
        (s) => s.id === id || s.zipId === id
    );
    const sets =
        exact.length > 0
            ? exact
            : WORDPROJECT_AUDIO_SETS.filter(
                  (s) =>
                      /^\d+$/.test(id) &&
                      parseInt(s.id, 10) === parseInt(id, 10)
              );
    if (sets.length === 0) {
        throw new Error(
            `Unknown audio Bible "${id}". Run with --list to see the IDs.`
        );
    }
    return sets;
}

function findSet(id: string): WordprojectAudioSet {
    const sets = findSets(id);
    if (sets.length > 1) {
        throw new Error(
            `"${id}" matches ${sets.map((s) => s.id).join(' and ')}; use the full ID.`
        );
    }
    return sets[0];
}

function selectSets(
    values: string[],
    overrides: Map<string, string[]>
): WordprojectAudioSet[] {
    const ids = values
        .flatMap((v) => v.split(','))
        .map((v) => v.trim())
        .filter(Boolean);
    if (ids.length === 0) {
        return WORDPROJECT_AUDIO_SETS;
    }
    const sets = new Set(ids.flatMap(findSets));
    // A --map for a set that wasn't selected is almost certainly a mistake.
    for (const id of overrides.keys()) {
        if (![...sets].some((s) => s.id === id)) {
            console.warn(
                `warning: --map ${id} is ignored because --set doesn't include it`
            );
        }
    }
    return WORDPROJECT_AUDIO_SETS.filter((s) => sets.has(s));
}

async function processBook(
    task: BookTask,
    options: Options
): Promise<BookResult> {
    const result: BookResult = {
        task,
        written: 0,
        existing: 0,
        chapters: new Set(),
        problems: [],
    };
    const { set, bookNumber, bookId } = task;
    const urls = getZipUrls(set, bookNumber, options.mirrors);
    const zipPath = path.join(options.cache, set.id, `${bookNumber}.zip`);
    const label = `${set.id} ${bookId}`;

    if (options.dryRun) {
        console.log(`[dry-run] ${label}: ${urls[0]}`);
        for (const translation of task.translations) {
            console.log(
                `            -> ${path.relative(options.output, destinationPath(options.output, translation, bookId, '{chapter}', task.reader))}`
            );
        }
        return result;
    }

    try {
        if (!existsSync(zipPath)) {
            await downloadZip(urls, zipPath);
        }
    } catch (err) {
        result.error = errorMessage(err);
        console.error(`failed: ${label}: ${result.error}`);
        return result;
    }

    try {
        await extractBook(task, zipPath, options, result);
    } catch (err) {
        result.error = `could not unzip ${zipPath}: ${errorMessage(err)}`;
        console.error(`failed: ${label}: ${result.error}`);
        // Remove the broken zip so the next run downloads it again.
        await rm(zipPath, { force: true });
        return result;
    }

    if (options.deleteZips) {
        await rm(zipPath, { force: true });
    }

    console.log(
        `done: ${label}: ${result.chapters.size} chapter(s)` +
            (result.existing > 0 ? `, ${result.existing} already existed` : '')
    );
    return result;
}

/**
 * Downloads the first URL that returns a zip file.
 */
async function downloadZip(urls: string[], zipPath: string) {
    const failures: string[] = [];
    for (const url of urls) {
        for (let attempt = 1; attempt <= DOWNLOAD_ATTEMPTS; attempt++) {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    failures.push(`${url}: HTTP ${response.status}`);
                    // A 404 won't change on retry.
                    break;
                }
                const data = new Uint8Array(await response.arrayBuffer());
                // Some hosts answer missing files with an HTML page.
                if (data.length < 4 || data[0] !== 0x50 || data[1] !== 0x4b) {
                    failures.push(`${url}: not a zip file`);
                    break;
                }
                await mkdir(path.dirname(zipPath), { recursive: true });
                const partPath = `${zipPath}.part`;
                await writeFile(partPath, data);
                await rename(partPath, zipPath);
                return;
            } catch (err) {
                if (attempt < DOWNLOAD_ATTEMPTS) {
                    await delay(1000 * attempt);
                } else {
                    failures.push(`${url}: ${errorMessage(err)}`);
                }
            }
        }
    }
    throw new Error(
        `no zip could be downloaded:\n    ${failures.join('\n    ')}`
    );
}

async function extractBook(
    task: BookTask,
    zipPath: string,
    options: Options,
    result: BookResult
) {
    const chapterCount = bookChapterCountMap.get(task.bookId)!;
    const zip = new ZipReader(
        new Uint8ArrayReader(new Uint8Array(await readFile(zipPath)))
    );
    try {
        const entries = (await zip.getEntries()).filter(
            (e) =>
                !e.directory &&
                /\.mp3$/i.test(e.filename) &&
                !e.filename.startsWith('__MACOSX/') &&
                !path.posix.basename(e.filename).startsWith('._')
        );

        const sources = new Map<number, string>();
        for (const entry of entries) {
            const chapter = getChapterFromEntryName(
                entry.filename,
                chapterCount,
                entries.length
            );
            if (chapter === null) {
                result.problems.push(
                    `${entry.filename}: no chapter number in the name`
                );
                continue;
            }
            if (chapter < 1 || chapter > chapterCount) {
                result.problems.push(
                    `${entry.filename}: chapter ${chapter} but ${task.bookId} has ${chapterCount}`
                );
                continue;
            }
            const previous = sources.get(chapter);
            if (previous) {
                result.problems.push(
                    `${entry.filename}: chapter ${chapter} already came from ${previous}`
                );
                continue;
            }
            sources.set(chapter, entry.filename);

            const destinations = task.translations.map((translation) =>
                destinationPath(
                    options.output,
                    translation,
                    task.bookId,
                    chapter.toString(),
                    task.reader
                )
            );
            const pending = options.overwrite
                ? destinations
                : destinations.filter((d) => !existsSync(d));
            result.existing += destinations.length - pending.length;
            result.chapters.add(chapter);
            if (pending.length === 0) {
                continue;
            }

            const data = await entry.getData!(new Uint8ArrayWriter());
            for (const destination of pending) {
                await mkdir(path.dirname(destination), { recursive: true });
                const partPath = `${destination}.part`;
                await writeFile(partPath, data);
                await rename(partPath, destination).catch(async (err) => {
                    await unlink(partPath).catch(() => {});
                    throw err;
                });
                result.written++;
            }
        }
    } finally {
        await zip.close();
    }
}

function destinationPath(
    output: string,
    translation: string,
    bookId: string,
    chapter: string,
    reader: string
) {
    return path.join(
        output,
        'api',
        translation,
        bookId,
        chapter,
        'audio',
        `${reader}.mp3`
    );
}

/**
 * Runs the given function over the items with at most `limit` running at once.
 */
async function runPool<T, R>(
    items: T[],
    limit: number,
    fn: (item: T) => Promise<R>
): Promise<R[]> {
    const results: R[] = new Array(items.length);
    let next = 0;
    async function worker() {
        while (next < items.length) {
            const index = next++;
            results[index] = await fn(items[index]);
        }
    }
    await Promise.all(
        Array.from({ length: Math.min(limit, items.length) }, worker)
    );
    return results;
}

function printSummary(results: BookResult[], options: Options) {
    if (options.dryRun) {
        return;
    }

    const bySet = new Map<WordprojectAudioSet, BookResult[]>();
    for (const r of results) {
        const list = bySet.get(r.task.set) ?? [];
        list.push(r);
        bySet.set(r.task.set, list);
    }

    let failedBooks = 0;
    let written = 0;
    let existing = 0;
    let incomplete = 0;

    console.log('\nSummary:');
    for (const [set, list] of bySet) {
        const failures = list.filter((r) => r.error);
        const gaps: string[] = [];
        const problems: string[] = [];
        for (const r of list) {
            written += r.written;
            existing += r.existing;
            problems.push(...r.problems.map((p) => `${r.task.bookId}: ${p}`));
            if (r.error) continue;
            const count = bookChapterCountMap.get(r.task.bookId)!;
            const missing: number[] = [];
            for (let c = 1; c <= count; c++) {
                if (!r.chapters.has(c)) missing.push(c);
            }
            if (missing.length > 0) {
                gaps.push(`${r.task.bookId} ${missing.join(', ')}`);
            }
        }
        failedBooks += failures.length;
        if (gaps.length > 0 || problems.length > 0) incomplete++;

        const ok = list.length - failures.length;
        const translations = list[0].task.translations.join(', ');
        console.log(
            `  ${set.id} -> ${translations} (${list[0].task.reader}, ${set.match}): ${ok}/${list.length} books`
        );
        if (failures.length > 0) {
            // The full reasons were printed as each book failed.
            console.log(
                `      failed (${failures.length}): ${failures.map((f) => f.task.bookId).join(', ')}`
            );
        }
        if (gaps.length > 0) {
            console.log(`      missing chapters: ${gaps.join('; ')}`);
        }
        for (const p of problems) {
            console.log(`      ${p}`);
        }
    }

    console.log(
        `\nWrote ${written} file(s)` +
            (existing > 0
                ? `, ${existing} already existed (use --overwrite to replace)`
                : '') +
            (failedBooks > 0 ? `, ${failedBooks} book(s) failed` : '') +
            (incomplete > 0
                ? `, ${incomplete} audio Bible(s) have missing or unexpected files`
                : '')
    );

    if (failedBooks > 0) {
        process.exitCode = 1;
    }
}

function printSets(sets: WordprojectAudioSet[]) {
    const rows = sets.map((s) => [
        s.id,
        s.name,
        s.books === 'nt' ? 'NT' : 'all',
        s.match,
        s.translations.join(', ') || '-',
        s.reader ?? DEFAULT_READER,
    ]);
    const header = [
        'id',
        'language',
        'books',
        'match',
        'translations',
        'reader',
    ];
    const widths = header.map((h, i) =>
        Math.max(h.length, ...rows.map((r) => r[i].length))
    );
    const line = (r: string[]) =>
        r
            .map((c, i) => c.padEnd(widths[i]))
            .join('  ')
            .trimEnd();
    console.log(line(header));
    console.log(line(widths.map((w) => '-'.repeat(w))));
    for (const r of rows) console.log(line(r));

    const flagged = sets.filter((s) => s.match !== 'exact' && s.notes);
    if (flagged.length > 0) {
        console.log('\nNotes:');
        for (const s of flagged) {
            console.log(`  ${s.id} (${s.match}): ${s.notes}`);
        }
    }
}

function errorMessage(err: unknown): string {
    if (err instanceof Error) {
        const cause = (err as any).cause;
        return cause instanceof Error
            ? `${err.message} (${cause.message})`
            : err.message;
    }
    return String(err);
}

function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

main().catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exitCode = 1;
});
