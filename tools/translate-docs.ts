/**
 * Machine-translates the English documentation in `docs/` into another
 * language using the Google Cloud Translation API (v3).
 *
 * Authentication uses Application Default Credentials, so the usual gcloud
 * setup is all that is needed:
 *
 *     gcloud auth application-default login
 *     gcloud auth application-default set-quota-project <project-id>
 *
 * The project must have the Cloud Translation API enabled
 * (`gcloud services enable translate.googleapis.com`).
 *
 * Usage:
 *
 *     pnpm translate:docs --list-languages
 *     pnpm translate:docs es fr zh-CN
 *     pnpm translate:docs es --force --out ./build/docs-es
 *
 * Each language is written to `docs/<language>/` by default, mirroring the
 * layout of the English docs so it can be registered as a VuePress locale.
 *
 * Only prose is translated. Code blocks, inline code, HTML tags, comments,
 * URLs and link destinations are passed through unchanged, and relative links
 * are rewritten so they still resolve from the translated file's location.
 */

import { GoogleAuth } from 'google-auth-library';
import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parseArgs } from 'node:util';

let __dirname = path.dirname(new URL(import.meta.url).pathname);
if (process.platform === 'win32' && __dirname.startsWith('/')) {
    __dirname = __dirname.substring(1);
}
const repoRoot = path.resolve(__dirname, '..');

const SOURCE_LANGUAGE = 'en';

/**
 * Written to the root of every generated translation so that later runs know
 * not to treat it as English source material.
 */
const MARKER_FILE = '.translated-docs';

/** Directories under the source root that never contain translatable pages. */
const IGNORED_DIRS = new Set(['node_modules', 'site-root']);

/** Frontmatter keys whose values are shown to readers. */
const TRANSLATABLE_FRONTMATTER_KEYS = new Set([
    'title',
    'headTitle',
    'description',
    'heroText',
    'tagline',
    'actionText',
    'details',
]);

/** Keep each request well under the API's 30k codepoint limit. */
const MAX_BATCH_CHARS = 20_000;
const MAX_BATCH_SEGMENTS = 100;

type Translator = (segments: string[]) => Promise<string[]>;

// ---------------------------------------------------------------------------
// Google Cloud Translation API
// ---------------------------------------------------------------------------

class GoogleTranslateClient {
    private auth = new GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/cloud-translation'],
    });
    private projectId: Promise<string>;

    constructor(projectId?: string) {
        this.projectId = projectId
            ? Promise.resolve(projectId)
            : this.auth.getProjectId().catch((err) => {
                  throw new Error(
                      'Unable to determine the Google Cloud project. Pass --project, set GOOGLE_CLOUD_PROJECT, ' +
                          'or run `gcloud auth application-default set-quota-project <project-id>`.\n' +
                          err.message
                  );
              });
    }

    private async parent() {
        return `projects/${await this.projectId}/locations/global`;
    }

    private async request<T>(
        url: string,
        method: 'GET' | 'POST',
        data?: unknown
    ): Promise<T> {
        const client = await this.auth.getClient();
        try {
            const res = await client.request<T>({ url, method, data });
            return res.data;
        } catch (err: any) {
            const message =
                err?.response?.data?.error?.message ?? err?.message ?? err;
            throw new Error(`Translation API request failed: ${message}`);
        }
    }

    async supportedLanguages(): Promise<
        { languageCode: string; displayName: string }[]
    > {
        const data = await this.request<{
            languages: {
                languageCode: string;
                displayName: string;
                supportTarget: boolean;
            }[];
        }>(
            `https://translation.googleapis.com/v3/${await this.parent()}/supportedLanguages?displayLanguageCode=${SOURCE_LANGUAGE}`,
            'GET'
        );
        return data.languages.filter((l) => l.supportTarget);
    }

    translator(targetLanguage: string): Translator {
        return async (segments) => {
            const results: string[] = [];
            for (const batch of batches(segments)) {
                const data = await this.request<{
                    translations: { translatedText: string }[];
                }>(
                    `https://translation.googleapis.com/v3/${await this.parent()}:translateText`,
                    'POST',
                    {
                        contents: batch,
                        mimeType: 'text/html',
                        sourceLanguageCode: SOURCE_LANGUAGE,
                        targetLanguageCode: targetLanguage,
                    }
                );
                results.push(...data.translations.map((t) => t.translatedText));
            }
            return results;
        };
    }
}

function* batches(segments: string[]): Generator<string[]> {
    let batch: string[] = [];
    let chars = 0;
    for (const segment of segments) {
        if (
            batch.length > 0 &&
            (batch.length >= MAX_BATCH_SEGMENTS ||
                chars + segment.length > MAX_BATCH_CHARS)
        ) {
            yield batch;
            batch = [];
            chars = 0;
        }
        batch.push(segment);
        chars += segment.length;
    }
    if (batch.length > 0) {
        yield batch;
    }
}

// ---------------------------------------------------------------------------
// Markdown <-> HTML segments
//
// Each line of prose is converted into a small HTML snippet so that the API's
// HTML mode can be used: anything that must survive verbatim becomes a
// `translate="no"` span, links become <a> tags (so the link text is
// translated but the destination is not) and emphasis becomes <b>/<i> (so
// asterisks are not mangled). The response is then converted back.
// ---------------------------------------------------------------------------

const TOKEN = (i: number) => `\u0000${i}\u0000`;
const TOKEN_REGEX = /\u0000(\d+)\u0000/g;

/** Inline constructs that are copied through untranslated. */
const PROTECTED_INLINE = new RegExp(
    [
        /(`+)[\s\S]*?\1/.source, // inline code
        /<!--[\s\S]*?-->/.source, // HTML comments
        /<\/?[A-Za-z][^>]*>/.source, // HTML / Vue tags and autolinks
        /\{\{[\s\S]*?\}\}/.source, // Vue interpolation
        /\{#[^}]*\}/.source, // custom heading anchors
        /https?:\/\/[^\s<>()\]]+/.source, // bare URLs
        /&#?\w+;/.source, // existing HTML entities
        /\\[\\`*_{}[\]()#+\-.!|<>]/.source, // markdown escapes
    ].join('|'),
    'g'
);

interface Segment {
    html: string;
    tokens: string[];
}

function escapeHtml(text: string) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function unescapeHtml(text: string) {
    return text
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#0*39;|&apos;/g, "'")
        .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
        .replace(/&#x([0-9a-f]+);/gi, (_, n) =>
            String.fromCodePoint(parseInt(n, 16))
        )
        .replace(/&amp;/g, '&');
}

/** Converts a line of markdown prose into an HTML segment for translation. */
export function markdownToSegment(
    text: string,
    rewriteDestination: (dest: string) => string = (d) => d
): Segment {
    const tokens: string[] = [];
    const protect = (value: string) => {
        tokens.push(value);
        return TOKEN(tokens.length - 1);
    };

    // Link and image destinations, before anything else can match inside them.
    let s = text.replace(
        /\]\(([^()\s]*(?:\([^()\s]*\)[^()\s]*)*)((?:\s+"[^"]*")?)\)/g,
        (_, dest, title) => `](${protect(rewriteDestination(dest) + title)})`
    );
    s = s.replace(PROTECTED_INLINE, (match) =>
        protect(rewriteIncludes(match, rewriteDestination))
    );
    // Images are kept whole.
    s = s.replace(/!\[([^\]]*)\]\(\u0000(\d+)\u0000\)/g, (_, alt, i) =>
        protect(`![${alt}](${tokens[Number(i)]})`)
    );

    s = escapeHtml(s);
    s = s.replace(
        /\[([^\[\]]*)\]\(\u0000(\d+)\u0000\)/g,
        (_, label, i) => `<a href="${i}">${label}</a>`
    );
    s = s.replace(/\*\*(?=\S)([\s\S]*?\S)\*\*/g, '<b>$1</b>');
    s = s.replace(
        /(?<![*\w])\*(?=[^\s*])([^*]*?[^\s*])\*(?![*\w])/g,
        '<i>$1</i>'
    );
    s = s.replace(TOKEN_REGEX, (_, i) => `<span translate="no">${i}</span>`);

    return { html: s, tokens };
}

/** Converts a translated HTML segment back into markdown. */
export function segmentToMarkdown(html: string, tokens: string[]): string {
    const token = (i: string) => TOKEN(Number(i));
    let s = html;
    s = s.replace(/<span\b[^>]*>\s*(\d+)\s*<\/span>/g, (_, i) => token(i));
    // Markdown emphasis cannot start or end with whitespace, but the API often
    // puts spaces just inside tags. Move them outside, unless there is already
    // whitespace (or a bracket) there.
    const emphasis = (tag: string, marker: string) => {
        s = s.replace(
            new RegExp(`<${tag}>(\\s*)([\\s\\S]*?)(\\s*)</${tag}>`, 'g'),
            (match, before, inner, after, offset: number, all: string) => {
                if (!inner) return '';
                const prev = all[offset - 1] ?? '';
                const next = all[offset + match.length] ?? '';
                const lead = before && prev && !/[\s\[(]/.test(prev) ? ' ' : '';
                const trail = after && next && !/[\s\])]/.test(next) ? ' ' : '';
                return `${lead}${marker}${inner}${marker}${trail}`;
            }
        );
    };
    emphasis('b', '**');
    emphasis('i', '*');
    s = s.replace(
        /<a\b[^>]*?href="(\d+)"[^>]*>([\s\S]*?)<\/a>/g,
        (_, i, label) => `[${label.trim()}](${token(i)})`
    );
    s = unescapeHtml(s);
    return s.replace(TOKEN_REGEX, (_, i) => tokens[Number(i)]);
}

/** Rewrites the path in a VuePress `<!-- @include: path -->` directive. */
function rewriteIncludes(text: string, rewrite: (dest: string) => string) {
    return text.replace(
        /(<!--\s*@include:\s*)([^\s#{]+)/g,
        (_, prefix, dest) => prefix + rewrite(dest)
    );
}

// ---------------------------------------------------------------------------
// Document translation
// ---------------------------------------------------------------------------

interface DocumentOptions {
    translate: Translator;
    rewriteDestination: (dest: string) => string;
}

/**
 * Translates a markdown document. Prose is translated one line at a time,
 * which matches how the docs are written (one line per paragraph or list
 * item) and keeps the markdown structure intact.
 */
export async function translateMarkdown(
    source: string,
    { translate, rewriteDestination }: DocumentOptions
): Promise<string> {
    const eol = source.includes('\r\n') ? '\r\n' : '\n';
    const lines = source.split(/\r?\n/);
    const output: (string | (() => string))[] = [];
    const pending: { segment: Segment; result?: string }[] = [];

    /** Queues `text` for translation, keeping its surrounding whitespace. */
    const deferred = (text: string, wrap: (t: string) => string = (t) => t) => {
        const match = /^(\s*)([\s\S]*?)(\s*)$/.exec(text)!;
        const [, lead, body, trail] = match;
        const segment = markdownToSegment(body, rewriteDestination);
        // Nothing worth translating (e.g. only code or URLs).
        if (!/\p{L}/u.test(segment.html.replace(/<[^>]*>/g, ''))) {
            const restored = segmentToMarkdown(segment.html, segment.tokens);
            return () => wrap(lead + restored + trail);
        }
        const entry: { segment: Segment; result?: string } = { segment };
        pending.push(entry);
        return () => wrap(lead + entry.result! + trail);
    };

    let i = 0;

    // Frontmatter
    if (lines[0] === '---') {
        const end = lines.indexOf('---', 1);
        if (end > 0) {
            output.push(lines[0]);
            for (i = 1; i < end; i++) {
                const line = lines[i];
                const m = /^(\s*)([\w-]+)(\s*:\s*)(.+)$/.exec(line);
                if (m && TRANSLATABLE_FRONTMATTER_KEYS.has(m[2])) {
                    const value = parseYamlScalar(m[4]);
                    output.push(
                        deferred(
                            value,
                            (t) => `${m[1]}${m[2]}${m[3]}${yamlQuote(t)}`
                        )
                    );
                } else {
                    output.push(line);
                }
            }
            output.push(lines[end]);
            i = end + 1;
        }
    }

    let fence: string | null = null;
    let inComment = false;

    for (; i < lines.length; i++) {
        const line = lines[i];

        if (fence) {
            output.push(line);
            if (new RegExp(`^\\s*${fence}+\\s*$`).test(line)) {
                fence = null;
            }
            continue;
        }
        const fenceMatch = /^\s*(`{3,}|~{3,})/.exec(line);
        if (fenceMatch) {
            fence = fenceMatch[1];
            output.push(line);
            continue;
        }

        if (inComment) {
            output.push(rewriteIncludes(line, rewriteDestination));
            if (line.includes('-->')) inComment = false;
            continue;
        }
        if (/^\s*<!--/.test(line) && !line.includes('-->')) {
            inComment = true;
            output.push(rewriteIncludes(line, rewriteDestination));
            continue;
        }

        if (/^\s*$/.test(line)) {
            output.push(line);
            continue;
        }

        // Custom containers: `::: tip Optional Title`
        const container = /^(\s*:{3,}\s*[\w-]*\s*)(.*)$/.exec(line);
        if (container) {
            output.push(
                container[2]
                    ? deferred(container[2], (t) => container[1] + t)
                    : line
            );
            continue;
        }

        // Tables
        if (/^\s*\|/.test(line)) {
            if (/^[\s|:-]+$/.test(line)) {
                output.push(line);
                continue;
            }
            const cells = splitTableRow(line);
            const parts = cells.map((cell) =>
                /\S/.test(cell) ? deferred(cell) : () => cell
            );
            output.push(() => parts.map((p) => p()).join('|'));
            continue;
        }

        // Reference-style link definitions: `[id]: url "title"`
        if (/^\s*\[[^\]]+\]:\s*\S+/.test(line)) {
            output.push(
                line.replace(
                    /^(\s*\[[^\]]+\]:\s*)(\S+)/,
                    (_, p, dest) => p + rewriteDestination(dest)
                )
            );
            continue;
        }

        // Headings, block quotes and list items keep their markers.
        const prefix =
            /^(\s*(?:#{1,6}\s+|>\s?|[-*+]\s+(?:\[[ xX]\]\s+)?|\d+[.)]\s+)*)([\s\S]*)$/.exec(
                line
            )!;
        let text = prefix[2];
        // Join hard-wrapped paragraphs so sentences are translated whole.
        // The translation is written back as a single line.
        if (!/^\s*#/.test(prefix[1])) {
            while (i + 1 < lines.length && isContinuation(lines[i + 1])) {
                text += ' ' + lines[++i].trim();
            }
        }
        output.push(deferred(text, (t) => prefix[1] + t));
    }

    if (pending.length > 0) {
        const translated = await translate(pending.map((p) => p.segment.html));
        pending.forEach((entry, index) => {
            entry.result = segmentToMarkdown(
                translated[index],
                entry.segment.tokens
            ).trim();
        });
    }

    return output.map((o) => (typeof o === 'string' ? o : o())).join(eol);
}

/** Whether `line` continues the paragraph above it rather than starting a new block. */
function isContinuation(line: string): boolean {
    return !(
        /^\s*$/.test(line) ||
        /^\s*(`{3,}|~{3,}|:{3,}|<!--|\||#{1,6}\s|>|[-*+]\s|\d+[.)]\s)/.test(
            line
        ) ||
        /^\s*<\/?[A-Za-z]/.test(line) ||
        /^\s*\[[^\]]+\]:/.test(line) ||
        /^\s*([-*_])(\s*\1){2,}\s*$/.test(line)
    );
}

/** Splits a table row on unescaped pipes, keeping the outer empty cells. */
function splitTableRow(line: string): string[] {
    const cells: string[] = [];
    let current = '';
    let inCode = false;
    for (let i = 0; i < line.length; i++) {
        const c = line[i];
        if (c === '\\' && i + 1 < line.length) {
            current += c + line[++i];
        } else if (c === '`') {
            inCode = !inCode;
            current += c;
        } else if (c === '|' && !inCode) {
            cells.push(current);
            current = '';
        } else {
            current += c;
        }
    }
    cells.push(current);
    return cells;
}

function parseYamlScalar(value: string): string {
    const v = value.trim();
    if (v.startsWith("'") && v.endsWith("'") && v.length >= 2) {
        return v.slice(1, -1).replace(/''/g, "'");
    }
    if (v.startsWith('"') && v.endsWith('"') && v.length >= 2) {
        try {
            return JSON.parse(v);
        } catch {
            return v.slice(1, -1);
        }
    }
    return v;
}

function yamlQuote(value: string): string {
    return `'${value.replace(/'/g, "''")}'`;
}

// ---------------------------------------------------------------------------
// Files
// ---------------------------------------------------------------------------

async function exists(file: string) {
    try {
        await stat(file);
        return true;
    } catch {
        return false;
    }
}

async function findMarkdownFiles(
    sourceRoot: string,
    excluded: Set<string>
): Promise<string[]> {
    const results: string[] = [];
    const walk = async (dir: string) => {
        if (excluded.has(path.resolve(dir))) return;
        if (dir !== sourceRoot && (await exists(path.join(dir, MARKER_FILE)))) {
            return;
        }
        for (const entry of await readdir(dir, { withFileTypes: true })) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                if (
                    !entry.name.startsWith('.') &&
                    !IGNORED_DIRS.has(entry.name)
                ) {
                    await walk(full);
                }
            } else if (entry.isFile() && entry.name.endsWith('.md')) {
                results.push(full);
            }
        }
    };
    await walk(sourceRoot);
    return results.sort();
}

function isExternal(dest: string) {
    return /^([a-z][a-z0-9+.-]*:|\/\/|#)/i.test(dest) || dest.startsWith('@');
}

/**
 * Builds a function that rewrites a link destination from `sourceFile` so it
 * resolves to the same page from `outputFile`.
 *
 * - Links to other docs pages point at the translated copy.
 * - Links to anything outside the docs (e.g. package READMEs) keep pointing
 *   at the original file.
 * - Site-absolute links (`/guide/`) are prefixed with the locale path when the
 *   output is inside the docs directory.
 */
export function destinationRewriter(
    sourceRoot: string,
    outputRoot: string,
    sourceFile: string,
    outputFile: string
) {
    const localePrefix = path.relative(sourceRoot, outputRoot);
    const isLocale =
        !localePrefix.startsWith('..') && !path.isAbsolute(localePrefix);

    return (dest: string) => {
        if (!dest || isExternal(dest)) return dest;
        const [, pathPart, suffix] = /^([^#?]*)(.*)$/.exec(dest)!;
        if (!pathPart) return dest;

        if (pathPart.startsWith('/')) {
            if (!isLocale) return dest;
            return (
                '/' +
                path.posix.join(
                    localePrefix.split(path.sep).join('/'),
                    pathPart
                ) +
                suffix
            );
        }

        const target = path.resolve(path.dirname(sourceFile), pathPart);
        const relToSource = path.relative(sourceRoot, target);
        const mapped =
            relToSource.startsWith('..') || path.isAbsolute(relToSource)
                ? target
                : path.join(outputRoot, relToSource);
        let rel = path
            .relative(path.dirname(outputFile), mapped)
            .split(path.sep)
            .join('/');
        if (!rel.startsWith('.')) rel = './' + rel;
        if (pathPart.endsWith('/') && !rel.endsWith('/')) rel += '/';
        return rel + suffix;
    };
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const HELP = `Translate the documentation using the Google Cloud Translation API.

Usage: pnpm translate:docs [options] <language...>

Arguments:
  language             Target language code(s) supported by Google Translate
                       (e.g. es, fr, zh-CN). See --list-languages.

Options:
  --source <dir>       Directory containing the English docs (default: docs)
  --out <dir>          Output directory. "{lang}" is replaced with the language
                       code (default: <source>/{lang})
  --project <id>       Google Cloud project to bill. Defaults to
                       GOOGLE_CLOUD_PROJECT or the ADC quota project.
  --force              Re-translate files even if the output is up to date
  --dry-run            List the files that would be translated
  --list-languages     Print the supported target languages and exit
  -h, --help           Show this help

Authentication uses Application Default Credentials:
  gcloud auth application-default login
  gcloud auth application-default set-quota-project <project-id>
`;

async function main() {
    const { values, positionals } = parseArgs({
        allowPositionals: true,
        options: {
            source: { type: 'string', default: 'docs' },
            out: { type: 'string' },
            project: { type: 'string' },
            force: { type: 'boolean', default: false },
            'dry-run': { type: 'boolean', default: false },
            'list-languages': { type: 'boolean', default: false },
            help: { type: 'boolean', short: 'h', default: false },
        },
    });

    if (values.help) {
        console.log(HELP);
        return;
    }

    const client = new GoogleTranslateClient(
        values.project ?? process.env.GOOGLE_CLOUD_PROJECT
    );

    if (values['list-languages']) {
        for (const lang of await client.supportedLanguages()) {
            console.log(`${lang.languageCode.padEnd(10)} ${lang.displayName}`);
        }
        return;
    }

    if (positionals.length === 0) {
        console.error(HELP);
        process.exitCode = 1;
        return;
    }

    const sourceRoot = path.resolve(repoRoot, values.source!);
    const outTemplate =
        values.out ?? path.join(path.relative(repoRoot, sourceRoot), '{lang}');

    let supported: Set<string> | null = null;
    if (!values['dry-run']) {
        const languages = await client.supportedLanguages();
        supported = new Set(languages.map((l) => l.languageCode.toLowerCase()));
    }

    const languages = positionals;
    const outputRoots = new Map(
        languages.map((lang) => [
            lang,
            path.resolve(repoRoot, outTemplate.replace(/\{lang\}/g, lang)),
        ])
    );

    for (const lang of languages) {
        if (lang.toLowerCase() === SOURCE_LANGUAGE) {
            throw new Error('The docs are already in English.');
        }
        if (supported && !supported.has(lang.toLowerCase())) {
            throw new Error(
                `"${lang}" is not a supported target language. Run with --list-languages to see the options.`
            );
        }
    }

    const files = await findMarkdownFiles(
        sourceRoot,
        new Set(outputRoots.values())
    );

    for (const lang of languages) {
        const outputRoot = outputRoots.get(lang)!;
        const translate = client.translator(lang);
        console.log(
            `\nTranslating ${files.length} files to "${lang}" -> ${path.relative(repoRoot, outputRoot) || '.'}`
        );

        let translated = 0;
        for (const sourceFile of files) {
            const rel = path.relative(sourceRoot, sourceFile);
            const outputFile = path.join(outputRoot, rel);

            if (!values.force && (await exists(outputFile))) {
                const [src, out] = await Promise.all([
                    stat(sourceFile),
                    stat(outputFile),
                ]);
                if (out.mtimeMs >= src.mtimeMs) {
                    console.log(`  skip  ${rel} (up to date)`);
                    continue;
                }
            }

            if (values['dry-run']) {
                console.log(`  would translate  ${rel}`);
                continue;
            }

            const source = await readFile(sourceFile, 'utf8');
            const result = await translateMarkdown(source, {
                translate,
                rewriteDestination: destinationRewriter(
                    sourceRoot,
                    outputRoot,
                    sourceFile,
                    outputFile
                ),
            });
            await mkdir(path.dirname(outputFile), { recursive: true });
            await writeFile(outputFile, result);
            translated++;
            console.log(`  done  ${rel}`);
        }

        if (!values['dry-run']) {
            await mkdir(outputRoot, { recursive: true });
            await writeFile(
                path.join(outputRoot, MARKER_FILE),
                `Machine translation of ${path.relative(outputRoot, sourceRoot).split(path.sep).join('/')} ` +
                    `from "${SOURCE_LANGUAGE}" to "${lang}" generated by tools/translate-docs.ts.\n`
            );
        }
        console.log(`Translated ${translated} file(s) to "${lang}".`);
    }
}

const isMain =
    process.argv[1] &&
    path.resolve(process.argv[1]) ===
        path.resolve(__dirname, 'translate-docs.ts');
if (isMain) {
    main().catch((err) => {
        console.error(err instanceof Error ? err.message : err);
        process.exit(1);
    });
}
