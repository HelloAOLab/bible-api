/**
 * Writes docs/.vuepress/needData.ts, the data behind the "The need" section of
 * the docs home page, from the open-access-by-language reference data.
 *
 * Usage:
 *
 *     pnpm fill:docs-need <bible_open_access_by_language.csv> <bible_open_access_summary.csv>
 *
 * The reference data compares the Free Use Bible API catalog against the
 * speaker populations in the Joshua Project field dataset. It has one row per
 * ISO 639-3 language, sorted by first-language population, with the most
 * Scripture the API has in that language under an open licence (public
 * domain, CC BY or CC BY-SA). The home page uses its "inclusive" columns, in
 * which speakers of Arabic and Chinese varieties are counted as served by the
 * Standard Arabic and Mandarin Bibles.
 *
 * The summary is used to check the per-language populations. Only aggregates
 * and two levels per language are written; no names or populations of
 * individual languages.
 */

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parseArgs } from 'node:util';

let __dirname = path.dirname(new URL(import.meta.url).pathname);
if (process.platform === 'win32' && __dirname.startsWith('/')) {
    __dirname = __dirname.substring(1);
}

const OUT = path.resolve(__dirname, '../docs/.vuepress/needData.ts');

type Level = 'full_bible' | 'new_testament' | 'portions' | 'none';
const LEVELS: Level[] = ['full_bible', 'new_testament', 'portions', 'none'];
const CODE: Record<Level, string> = {
    full_bible: 'f',
    new_testament: 'n',
    portions: 'p',
    none: 'x',
};

/** A small CSV reader: quoted fields, doubled quotes, CRLF or LF. */
function parseCsv(text: string): Record<string, string>[] {
    const rows: string[][] = [];
    let row: string[] = [];
    let field = '';
    let quoted = false;
    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (quoted) {
            if (c === '"' && text[i + 1] === '"') {
                field += '"';
                i++;
            } else if (c === '"') {
                quoted = false;
            } else {
                field += c;
            }
        } else if (c === '"') {
            quoted = true;
        } else if (c === ',') {
            row.push(field);
            field = '';
        } else if (c === '\n' || c === '\r') {
            if (c === '\r' && text[i + 1] === '\n') i++;
            row.push(field);
            field = '';
            if (row.some((f) => f !== '')) rows.push(row);
            row = [];
        } else {
            field += c;
        }
    }
    row.push(field);
    if (row.some((f) => f !== '')) rows.push(row);
    const [head, ...body] = rows;
    return body.map((r) =>
        Object.fromEntries(head.map((h, i) => [h, r[i] ?? '']))
    );
}

function level(value: string, where: string): Level {
    if ((LEVELS as string[]).includes(value)) return value as Level;
    throw new Error(`Unknown level "${value}" in ${where}`);
}

async function main() {
    const { positionals } = parseArgs({ allowPositionals: true });
    const [byLanguagePath, summaryPath] = positionals;
    if (!byLanguagePath || !summaryPath) {
        console.error(
            'Usage: pnpm fill:docs-need <bible_open_access_by_language.csv> <bible_open_access_summary.csv>'
        );
        process.exit(1);
    }

    const languages = parseCsv(await readFile(byLanguagePath, 'utf8'));
    const summary = parseCsv(await readFile(summaryPath, 'utf8'));

    const population = (r: Record<string, string>) =>
        Number(r.primary_language_population || 0);
    // The grid runs largest language first.
    languages.sort((a, b) => population(b) - population(a));

    const rank = (l: Level) => LEVELS.length - 1 - LEVELS.indexOf(l);
    let anyCodes = '';
    let openCodes = '';
    // First-language speakers by [best level under any licence][best open
    // level], e.g. people['f']['n'] have a restricted full Bible and an open
    // New Testament.
    const people: Record<string, Record<string, number>> = {};
    for (const r of languages) {
        const any = level(r.api_best_level_any_inclusive, r.iso639_3);
        const open = level(r.api_best_level_open_inclusive, r.iso639_3);
        if (rank(open) > rank(any)) {
            throw new Error(`${r.iso639_3}: open level above any level`);
        }
        anyCodes += CODE[any];
        openCodes += CODE[open];
        const byOpen = (people[CODE[any]] ??= {});
        byOpen[CODE[open]] = (byOpen[CODE[open]] ?? 0) + population(r);
    }

    // Check the per-language populations against the summary's totals.
    for (const [basis, column] of [
        ['api_open_license', 'open'],
        ['api_any_license', 'any'],
    ] as const) {
        for (const r of summary) {
            if (r.scenario !== 'inclusive' || r.basis !== basis) continue;
            const code = CODE[level(r.best_level, 'the summary')];
            let sum = 0;
            for (const [a, byOpen] of Object.entries(people)) {
                for (const [o, n] of Object.entries(byOpen)) {
                    if ((column === 'open' ? o : a) === code) sum += n;
                }
            }
            if (sum !== Number(r.population)) {
                throw new Error(
                    `${basis} ${r.best_level}: ${sum} in the languages, ${r.population} in the summary`
                );
            }
        }
    }

    const peopleRows = LEVELS.map(
        (any) =>
            `        ${CODE[any]}: { ${LEVELS.filter(
                (open) => people[CODE[any]]?.[CODE[open]] !== undefined
            )
                .map(
                    (open) => `${CODE[open]}: ${people[CODE[any]][CODE[open]]}`
                )
                .join(', ')} },`
    ).join('\n');

    const today = new Date().toISOString().slice(0, 10);
    const out = `/**
 * The data behind "The need" on the docs home page (components/NeedGrid.vue).
 *
 * Generated by tools/fill-docs-need.ts on ${today}; do not edit by hand. Built
 * from the open-access-by-language reference data, which compares the Free
 * Use Bible API catalog (November 2026) against first-language populations
 * from the Joshua Project field dataset (June 2026).
 *
 * "Open" means public domain, CC BY or CC BY-SA; "restricted" is any other
 * licence. Speakers of Arabic and Chinese varieties are counted as served by
 * the Standard Arabic and Mandarin Bibles.
 */

export type NeedLevel = 'full' | 'newTestament' | 'portions' | 'none';

export const NEED_LEVELS: NeedLevel[] = [
    'full',
    'newTestament',
    'portions',
    'none',
];

/** How a level is written in \`NEED\`. */
export const NEED_CODES: Record<string, NeedLevel> = {
    f: 'full',
    n: 'newTestament',
    p: 'portions',
    x: 'none',
};

export const NEED = {
    /**
     * One character per language, largest first: the most Scripture the API
     * has in it under any licence (see NEED_CODES).
     */
    anyLevels:
        '${anyCodes}',
    /** The same languages: the most Scripture the API has under an open licence. */
    openLevels:
        '${openCodes}',
    /**
     * First-language speakers by the best level under any licence, then the
     * best open level.
     */
    people: {
${peopleRows}
    } as Record<string, Record<string, number>>,
};
`;
    await writeFile(OUT, out);
    console.log(
        `Wrote ${path.relative(process.cwd(), OUT)}: ${languages.length} languages.`
    );
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
