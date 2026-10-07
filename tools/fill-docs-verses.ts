/**
 * Fills in the Bible verses quoted on the docs home page for each translated
 * language, from the Free Use Bible API.
 *
 * Usage:
 *
 *     pnpm fill:docs-verses            # every translated language in docs/
 *     pnpm fill:docs-verses es fr      # just these languages
 *     pnpm fill:docs-verses --force    # replace verses that are already set
 *
 * For each language, a translation is chosen the way the Seed Bible app
 * chooses its default (see seed-bible-translations.ts), and its text, book
 * name, abbreviation and ID are written to `docs/<language>/verses.json`.
 * Verses already in that file are kept unless `--force` is passed, so they
 * can be edited by hand. A language whose nearest translation is English is
 * left out, since the English verses are already its fallback.
 *
 * Which verses are quoted is set by `HOME_VERSES` in docs/.vuepress/verses.ts.
 */

import { existsSync } from 'node:fs';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parseArgs } from 'node:util';
import {
    FreeUseBibleApi,
    type ChapterVerse,
} from '../packages/free-use-bible-api/index.ts';
import type { HomeVerse, Verses, VerseText } from '../docs/.vuepress/verses.ts';
// The docs package is CommonJS, so its named exports are only reachable
// through the default export when imported from here.
import versesModule from '../docs/.vuepress/verses.ts';
import { resolveNearestBibleTranslation } from './seed-bible-translations.ts';

const { HOME_VERSES } = versesModule;

let __dirname = path.dirname(new URL(import.meta.url).pathname);
if (process.platform === 'win32' && __dirname.startsWith('/')) {
    __dirname = __dirname.substring(1);
}
const repoRoot = path.resolve(__dirname, '..');
const docsDir = path.join(repoRoot, 'docs');

/** Written by translate-docs.ts to the root of each translated copy. */
const MARKER_FILE = '.translated-docs';
const VERSES_FILE = 'verses.json';

/**
 * Docs language codes that the Seed Bible names differently. Any other code
 * is looked up as it is, or by its base language ("pt-BR" → "pt").
 */
const DOCS_TO_SEED_LANGUAGE: Record<string, string> = {
    id: 'ind',
    'zh-CN': 'zh',
};

const SEED_TO_DOCS_LANGUAGE: Record<string, string> = {
    ind: 'id',
};

function seedLanguage(docsLanguage: string): string {
    return DOCS_TO_SEED_LANGUAGE[docsLanguage] ?? docsLanguage.split('-')[0];
}

async function translatedLanguages(): Promise<string[]> {
    const entries = await readdir(docsDir, { withFileTypes: true });
    return entries
        .filter(
            (entry) =>
                entry.isDirectory() &&
                existsSync(path.join(docsDir, entry.name, MARKER_FILE))
        )
        .map((entry) => entry.name)
        .sort();
}

async function readVerses(file: string): Promise<Verses> {
    return existsSync(file) ? JSON.parse(await readFile(file, 'utf8')) : {};
}

/** The verse's text on one line, without footnote markers or headings. */
function verseText(api: FreeUseBibleApi, verse: ChapterVerse): string {
    return api.getVerseText(verse).replace(/\s+/g, ' ').trim();
}

async function fetchVerse(
    api: FreeUseBibleApi,
    translationId: string,
    key: HomeVerse
): Promise<Omit<VerseText, 'language'>> {
    const { book, chapter, verse } = HOME_VERSES[key];
    const result = await api.getTranslationBookChapter(
        translationId,
        book,
        chapter
    );
    const found = result.chapter.content.find(
        (content): content is ChapterVerse =>
            content.type === 'verse' && content.number === verse
    );
    if (!found) {
        throw new Error(`${translationId} has no ${book} ${chapter}:${verse}.`);
    }
    return {
        text: verseText(api, found),
        bookName: result.book.name || result.book.commonName,
        translationAbbreviation:
            result.translation.shortName || result.translation.id,
        translationId: result.translation.id,
    };
}

const HELP = `Fill in the docs home page's Bible verses from the Free Use Bible API.

Usage: pnpm fill:docs-verses [options] [language...]

Arguments:
  language           Docs language code(s), e.g. es zh-CN. Defaults to every
                     translated language in docs/.

Options:
  --force            Replace verses that are already set
  --dry-run          Show the translation each language would use
  --endpoint <url>   API to use (default: https://bible.helloao.org/)
  -h, --help         Show this help
`;

async function main() {
    const { values, positionals } = parseArgs({
        allowPositionals: true,
        options: {
            force: { type: 'boolean', default: false },
            'dry-run': { type: 'boolean', default: false },
            endpoint: { type: 'string' },
            help: { type: 'boolean', short: 'h', default: false },
        },
    });

    if (values.help) {
        console.log(HELP);
        return;
    }

    const languages = positionals.length
        ? positionals
        : await translatedLanguages();
    const api = new FreeUseBibleApi({ endpoint: values.endpoint });
    const { translations } = await api.getAvailableTranslations();

    for (const lang of languages) {
        const file = path.join(docsDir, lang, VERSES_FILE);
        const existing = await readVerses(file);
        const missing = (Object.keys(HOME_VERSES) as HomeVerse[]).filter(
            (key) => values.force || !existing[key]
        );
        if (missing.length === 0) {
            console.log(`${lang}: skip (all verses set)`);
            continue;
        }

        const { translation, resolvedUiLanguage, usedFallback } =
            resolveNearestBibleTranslation(seedLanguage(lang), translations);
        if (resolvedUiLanguage === 'en') {
            console.log(
                `${lang}: skip (no translation found, so the English verses are used)`
            );
            continue;
        }

        const via = usedFallback ? ` via "${resolvedUiLanguage}"` : '';
        if (values['dry-run']) {
            console.log(`${lang}: would use ${translation.id}${via}`);
            continue;
        }

        const verses: Verses = { ...existing };
        let filled = 0;
        for (const key of missing) {
            try {
                verses[key] = {
                    ...(await fetchVerse(api, translation.id, key)),
                    ...(usedFallback
                        ? {
                              language:
                                  SEED_TO_DOCS_LANGUAGE[resolvedUiLanguage] ??
                                  resolvedUiLanguage,
                          }
                        : {}),
                };
                filled++;
            } catch (err) {
                console.error(
                    `${lang}: could not get ${key} from ${translation.id}: ${
                        err instanceof Error ? err.message : err
                    }`
                );
            }
        }

        // Keep the verses in the order the home page quotes them.
        const ordered = Object.fromEntries([
            ...(Object.keys(HOME_VERSES) as HomeVerse[])
                .filter((key) => verses[key])
                .map((key) => [key, verses[key]]),
            ...Object.entries(verses).filter(([key]) => !(key in HOME_VERSES)),
        ]);
        if (filled > 0) {
            await writeFile(file, JSON.stringify(ordered, null, 4) + '\n');
        }
        const outcome =
            filled === missing.length
                ? 'filled'
                : filled > 0
                  ? 'partly filled'
                  : 'not filled';
        console.log(`${lang}: ${outcome} from ${translation.id}${via}`);
        if (filled < missing.length) {
            process.exitCode = 1;
        }
    }
}

main().catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
});
