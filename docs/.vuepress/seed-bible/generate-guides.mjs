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
import { slugify } from '@mdit-vue/shared';
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const docsDir = path.resolve(here, '../..');
const outDir = path.join(docsDir, 'seed-bible', 'guide');

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

/** Calls `fn` with each line that isn't inside a fenced code block. */
function forEachProseLine(lines, fn) {
    let fence = null;
    lines.forEach((line, i) => {
        const marker = /^\s*(`{3,}|~{3,})/.exec(line)?.[1];
        if (marker) {
            if (!fence) {
                fence = marker;
            } else if (
                marker[0] === fence[0] &&
                marker.length >= fence.length
            ) {
                fence = null;
            }
            return;
        }
        if (!fence) {
            fn(line, i);
        }
    });
}

/** A heading's text as both sites see it: links, emphasis and code marks removed. */
const headingText = (heading) =>
    heading
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/[`*_]/g, '')
        .trim();

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
    const seen = { github: new Map(), vuepress: new Map() };
    const unique = (counts, slug) => {
        const count = counts.get(slug) ?? 0;
        counts.set(slug, count + 1);
        return count ? `${slug}-${count}` : slug;
    };
    forEachProseLine(markdown.split('\n'), (line) => {
        const heading = /^#{1,6}\s+(.*?)\s*#*\s*$/.exec(line)?.[1];
        if (!heading) {
            return;
        }
        const text = headingText(heading);
        map.set(
            unique(seen.github, githubSlug(text)),
            unique(seen.vuepress, slugify(text))
        );
    });
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
    const body = lines.join('\n').trimEnd();
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
