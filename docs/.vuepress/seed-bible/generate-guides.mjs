/**
 * Brings Seed Bible's extension guides (the developer guide, the extension
 * API guide and the security model) into the docs site, under
 * docs/seed-bible/guide/.
 *
 * They're written in the seed-bible repository, in docs/. They're taken from
 * the release tag of the `seed-bible` version in docs/package.json, the same
 * version the generated API reference documents, so the guides and the
 * reference always describe the same release. The download is cached in
 * .vuepress/.cache, so it only happens once per version.
 *
 * GitHub and VuePress name heading anchors differently ("1. Quick start" is
 * #1-quick-start on GitHub and #_1-quick-start here), so links between and
 * within the guides are rewritten to the anchors VuePress gives. Links to
 * other files in the seed-bible repository point at them on GitHub.
 *
 * Usage: node .vuepress/seed-bible/generate-guides.mjs
 */
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
    forEachProseLine,
    headingText,
    headings,
    readReferenceIndex,
    uniqueSlugs,
} from './markdown.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const docsDir = path.resolve(here, '../..');
const outDir = path.join(docsDir, 'seed-bible', 'guide');
const referenceDir = path.join(docsDir, 'seed-bible', 'reference');

const REPO = 'HelloAOLab/seed-bible';

/** The guides, by their file name in seed-bible's docs/. */
const GUIDES = [
    'developer-guide.md',
    'extension-api.md',
    'extension-security.md',
];

const require = createRequire(import.meta.url);
const { version } = require('seed-bible/package.json');
const tag = `v${version}`;
const cacheDir = path.join(here, '..', '.cache', 'seed-bible-guides', tag);

async function download(file) {
    const cached = path.join(cacheDir, file);
    if (existsSync(cached)) {
        return readFile(cached, 'utf8');
    }
    const url = `https://raw.githubusercontent.com/${REPO}/${tag}/docs/${file}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(
            `Could not download ${url} (HTTP ${response.status}). Is ${tag} tagged in ${REPO}?`
        );
    }
    const text = await response.text();
    await mkdir(cacheDir, { recursive: true });
    await writeFile(cached, text);
    return text;
}

/** GitHub's anchor for a heading. */
const githubSlug = (text) =>
    text
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s_-]/gu, '')
        .replace(/\s/g, '-');

/**
 * Maps each GitHub anchor in a guide to the anchor VuePress gives the same
 * heading. Both add -1, -2, … to repeated anchors, in document order.
 */
function anchorMap(markdown) {
    const map = new Map();
    const unique = uniqueSlugs();
    for (const { text, anchor } of headings(markdown)) {
        map.set(unique(githubSlug(text)), anchor);
    }
    // Explicit anchors (<a id="…">) are the same on both sites.
    for (const [, id] of markdown.matchAll(/<a id="([^"]+)"><\/a>/g)) {
        map.set(id, id);
    }
    return map;
}

/** The first paragraph after the title, as plain text, for the page's description. */
function description(markdown) {
    const paragraph = markdown
        .split(/\n\s*\n/)
        .map((block) => block.trim())
        .find((block) => block && !/^(#|---|```|[-*|>]|\d+\.)/.test(block));
    const text = (paragraph ?? '')
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/[`*_]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    return text.length > 200 ? `${text.slice(0, 197).trimEnd()}…` : text;
}

const sources = new Map();
for (const file of GUIDES) {
    sources.set(file, await download(file));
}
const anchors = new Map(
    [...sources].map(([file, markdown]) => [file, anchorMap(markdown)])
);

const problems = [];

/** Rewrites one link destination found in `file`. */
function rewriteLink(file, destination) {
    if (/^[a-z][a-z0-9+.-]*:|^\/\//i.test(destination)) {
        return destination;
    }
    const [, target, hash] = /^([^#]*)(?:#(.*))?$/.exec(destination);
    const targetFile = target
        ? path.posix.normalize(path.posix.join('docs', target))
        : `docs/${file}`;
    const guide = targetFile.replace(/^docs\//, '');

    if (!GUIDES.includes(guide)) {
        // Anywhere else in the seed-bible repository.
        return `https://github.com/${REPO}/blob/${tag}/${targetFile}${hash ? `#${hash}` : ''}`;
    }
    let anchor = '';
    if (hash) {
        const mapped = anchors.get(guide).get(hash);
        if (!mapped) {
            problems.push(`${file}: no heading for the link to ${destination}`);
        }
        anchor = `#${mapped ?? hash}`;
    }
    return target ? `./${guide}${anchor}` : anchor;
}

const reference = readReferenceIndex(referenceDir);

/**
 * Whether a documented name is distinctive enough to link wherever it
 * appears. A one- or two-letter name (the `T` component) is more often a
 * type parameter or a variable in an example.
 */
const linkableName = (name) => !!name && name.length >= 3;

/**
 * What a piece of inline code names in the API reference, if anything.
 * `section` is the `sb` property whose section of the guide it's in
 * (`sb.notes`), where the guide calls its methods by their bare names.
 */
function referenceTarget(code, section) {
    // `sb.notes`, `sb.notes.create`, `sb.permissions.request(...)`
    const member = /^(sb(?:\.\w+){0,2})(?:\(.*\))?$/.exec(code)?.[1];
    if (member && reference.members.has(member)) {
        return reference.members.get(member);
    }
    // `create` or `create(...)` in the sb.notes section
    const method = /^(\w+)(?:\(.*\))?$/.exec(code)?.[1];
    if (section && method && reference.members.has(`${section}.${method}`)) {
        return reference.members.get(`${section}.${method}`);
    }
    // `SandboxNote`, `defineExtension`, `createTestHost(extension)`
    const name = /^(\w+)(?:\(.*\))?$/.exec(code)?.[1];
    return (linkableName(name) && reference.symbols.get(name)) ?? null;
}

const referenceHref = (target) => `../reference/${target}`;

/** Matches any documented name as a whole word, longest first. */
const symbolPattern = new RegExp(
    `\\b(${[...reference.symbols.keys()]
        .filter(linkableName)
        .sort((a, b) => b.length - a.length)
        .join('|')})\\b`,
    'g'
);

/**
 * Links a guide to the API reference:
 *
 * - Inline code naming something in the reference (`SandboxNote`,
 *   `sb.notes.create`) links to it, the first time it appears in a section.
 * - A heading naming something (### `sb.notes`) gets a "Reference:" line
 *   under it, since a link inside the heading itself would be easy to miss.
 * - A TypeScript code block that uses documented types gets a "Reference:"
 *   line after it, listing them; links can't go inside the code.
 *
 * Runs after the guide's own links are rewritten, so it only adds links.
 */
function linkToReference(lines) {
    const out = [];
    let linked = new Set();
    let section = null;
    let fence = null;
    let block = [];

    const referenceLine = (indent, targets) =>
        `${indent}**Reference:** ${targets
            .map(([text, target]) => `[\`${text}\`](${referenceHref(target)})`)
            .join(' · ')}`;

    /** Keeps the targets not yet linked in this section, and marks them linked. */
    const fresh = (targets) => {
        const result = [];
        for (const [text, target] of targets) {
            if (target && !linked.has(target)) {
                linked.add(target);
                result.push([text, target]);
            }
        }
        return result;
    };

    for (const line of lines) {
        const marker = /^(\s*)(`{3,}|~{3,})(\w*)/.exec(line);
        if (fence) {
            out.push(line);
            if (
                marker &&
                marker[2][0] === fence.marker[0] &&
                marker[2].length >= fence.marker.length
            ) {
                if (/^(ts|tsx|js|jsx|typescript)$/.test(fence.language)) {
                    const names = [
                        ...new Set(
                            [...block.join('\n').matchAll(symbolPattern)].map(
                                (match) => match[1]
                            )
                        ),
                    ];
                    const targets = fresh(
                        names.map((name) => [name, reference.symbols.get(name)])
                    );
                    if (targets.length) {
                        out.push('', referenceLine(fence.indent, targets));
                    }
                }
                fence = null;
            } else {
                block.push(line);
            }
            continue;
        }
        if (marker) {
            fence = {
                indent: marker[1],
                marker: marker[2],
                language: marker[3],
            };
            block = [];
            out.push(line);
            continue;
        }

        const heading = /^(#{1,6})\s/.exec(line)?.[1].length;
        if (heading) {
            if (heading <= 3) {
                linked = new Set();
                section = /^#{1,3}\s+`(sb\.\w+)`\s*$/.exec(line)?.[1] ?? null;
            }
            out.push(line);
            const targets = fresh(
                [...line.matchAll(/`([^`]+)`/g)].map((match) => [
                    match[1].replace(/\(.*\)$/, ''),
                    referenceTarget(match[1]),
                ])
            );
            if (heading > 1 && targets.length) {
                out.push('', referenceLine('', targets));
            }
            continue;
        }

        out.push(
            line.replace(
                /(\[[^\]]*\]\([^)]*\))|`([^`]+)`/g,
                (match, link, code) => {
                    if (link) {
                        return match;
                    }
                    const target = referenceTarget(code, section);
                    if (!target || linked.has(target)) {
                        return match;
                    }
                    linked.add(target);
                    return `[${match}](${referenceHref(target)})`;
                }
            )
        );
    }
    return out;
}

if (existsSync(outDir)) {
    await rm(outDir, { recursive: true });
}
await mkdir(outDir, { recursive: true });

for (const [file, markdown] of sources) {
    const lines = markdown.split('\n');
    forEachProseLine(lines, (line, i) => {
        lines[i] = line.replace(
            /(\]\()([^)\s]+)(\))/g,
            (_, open, destination, close) =>
                `${open}${rewriteLink(file, destination)}${close}`
        );
    });
    const body = linkToReference(lines).join('\n').trimEnd();
    const title = headingText(/^#\s+(.*)$/m.exec(markdown)?.[1] ?? file);
    const source = `https://github.com/${REPO}/blob/${tag}/docs/${file}`;

    await writeFile(
        path.join(outDir, file),
        [
            '---',
            `title: ${JSON.stringify(title)}`,
            `description: ${JSON.stringify(description(markdown))}`,
            '---',
            '',
            body,
            '',
            '---',
            '',
            `_From [\`docs/${file}\`](${source}) in Seed Bible ${tag}._`,
            '',
        ].join('\n')
    );
}

// The guide/ directory's own page, so /seed-bible/guide/ isn't a dead end.
await writeFile(
    path.join(outDir, 'README.md'),
    [
        '---',
        'title: Guides',
        `description: ${JSON.stringify(`Guides to building Seed Bible extensions, from Seed Bible ${tag}.`)}`,
        '---',
        '',
        '# Guides',
        '',
        ...GUIDES.map((file) => {
            const markdown = sources.get(file);
            const title = headingText(
                /^#\s+(.*)$/m.exec(markdown)?.[1] ?? file
            );
            return `- **[${title}](./${file})**: ${description(markdown)}`;
        }),
        '',
    ].join('\n')
);

if (problems.length) {
    console.error(problems.join('\n'));
    process.exit(1);
}

console.log(
    `Seed Bible guides from ${REPO}@${tag} written to ${path.relative(process.cwd(), outDir)}`
);
