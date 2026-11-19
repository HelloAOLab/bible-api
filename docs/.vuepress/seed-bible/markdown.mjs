/**
 * Markdown helpers shared by the Seed Bible generators: finding headings
 * outside code blocks, and the anchors VuePress gives them.
 */
import { slugify } from '@mdit-vue/shared';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

/** Calls `fn` with each line that isn't inside a fenced code block. */
export function forEachProseLine(lines, fn) {
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
export const headingText = (heading) =>
    heading
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/[`*_]/g, '')
        .trim();

/** Adds -1, -2, … to repeated anchors, in document order, as VuePress and GitHub both do. */
export const uniqueSlugs = () => {
    const counts = new Map();
    return (slug) => {
        const count = counts.get(slug) ?? 0;
        counts.set(slug, count + 1);
        return count ? `${slug}-${count}` : slug;
    };
};

/** Every heading in a page, with the anchor VuePress gives it. */
export function headings(markdown) {
    const unique = uniqueSlugs();
    const found = [];
    forEachProseLine(markdown.split('\n'), (line) => {
        const match = /^(#{1,6})\s+(.*?)\s*#*\s*$/.exec(line);
        if (!match) {
            return;
        }
        const text = headingText(match[2]);
        found.push({
            level: match[1].length,
            raw: match[2],
            text,
            anchor: unique(slugify(text)),
        });
    });
    return found;
}

/**
 * Indexes the generated API reference, so other pages can link into it.
 *
 * - `symbols`: each documented name (`SandboxNote`, `defineExtension`,
 *   `Button`) to its page, relative to the reference's root. A name
 *   documented in more than one place goes to the exported one, in
 *   seed-bible/extensions first.
 * - `members`: `sb`, `sb.<property>` and `sb.<property>.<member>` to their
 *   place on the `SandboxContext` page, since `sb` is a `SandboxContext`.
 */
export function readReferenceIndex(referenceDir) {
    if (!existsSync(referenceDir)) {
        throw new Error(
            `The API reference hasn't been generated yet (${referenceDir}). Run generate-reference.mjs first.`
        );
    }
    const files = readdirSync(referenceDir, { recursive: true })
        .map((file) => file.split(path.sep).join('/'))
        .filter((file) => file.endsWith('.md') && !file.endsWith('README.md'));
    const rank = (file) =>
        (file.includes('/Unexported-types/') ? 10 : 0) +
        (file.startsWith('extensions/testing/')
            ? 1
            : file.startsWith('extensions/')
              ? 0
              : 2);

    const symbols = new Map();
    for (const file of files.sort((a, b) => rank(a) - rank(b))) {
        const name = path.posix.basename(file, '.md');
        if (!symbols.has(name)) {
            symbols.set(name, file);
        }
    }

    const members = new Map();
    const contextPage = symbols.get('SandboxContext');
    if (contextPage) {
        members.set('sb', contextPage);
        let property = null;
        for (const heading of headings(
            readFileSync(path.join(referenceDir, contextPage), 'utf8')
        )) {
            if (heading.level === 3) {
                property = heading.text;
                members.set(
                    `sb.${property}`,
                    `${contextPage}#${heading.anchor}`
                );
            } else if (heading.level === 4 && property) {
                members.set(
                    `sb.${property}.${heading.text}`,
                    `${contextPage}#${heading.anchor}`
                );
            } else if (heading.level < 3) {
                property = null;
            }
        }
    }
    return { symbols, members };
}
