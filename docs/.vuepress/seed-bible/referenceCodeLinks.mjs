/**
 * A VuePress plugin that links the types in the Seed Bible pages' code
 * blocks to the API reference: `SandboxNote` in `Promise<SandboxNote[]>`
 * becomes a link to the SandboxNote page.
 *
 * Markdown can't put links inside a code block, so this works on the
 * highlighted HTML instead. It wraps the code block renderer that
 * @vuepress/plugin-shiki installs, so it must be listed after shikiPlugin.
 */
import { existsSync } from 'node:fs';
import path from 'node:path';
import { readReferenceIndex } from './markdown.mjs';

/** The languages whose code names types. */
const CODE_LANGUAGES = /^(ts|tsx|typescript|js|jsx|javascript)$/;

/**
 * @param {{ docsDir: string, base: string }} options `docsDir` is the docs
 *     source directory and `base` the site's base path (`/docs/`).
 */
export const referenceCodeLinksPlugin =
    ({ docsDir, base }) =>
    () => ({
        name: 'seed-bible-reference-code-links',

        extendsMarkdown(md) {
            const referenceDir = path.join(docsDir, 'seed-bible', 'reference');
            if (!existsSync(referenceDir)) {
                // config.ts already warns that the reference is missing.
                return;
            }
            const { symbols } = readReferenceIndex(referenceDir);
            // A one- or two-letter name (the `T` component) is more often a
            // type parameter or a variable in an example.
            const names = [...symbols.keys()]
                .filter((name) => name.length >= 3)
                .sort((a, b) => b.length - a.length);
            if (!names.length) {
                return;
            }
            const pattern = new RegExp(`\\b(${names.join('|')})\\b`, 'g');

            const renderFence = md.renderer.rules.fence;
            md.renderer.rules.fence = (tokens, idx, options, env, self) => {
                const html = renderFence(tokens, idx, options, env, self);
                const page = env.filePathRelative?.split(path.sep).join('/');
                const language = tokens[idx].info.trim().split(/\s+/)[0];
                if (
                    !page?.startsWith('seed-bible/') ||
                    !CODE_LANGUAGES.test(language)
                ) {
                    return html;
                }
                // A type's own page doesn't link to itself.
                const ownPage = page.replace(/^seed-bible\/reference\//, '');

                const link = (name) => {
                    const target = symbols.get(name);
                    if (target === ownPage) {
                        return name;
                    }
                    const href = `${base}seed-bible/reference/${target.replace(/\.md$/, '.html')}`;
                    return `<a class="code-link" href="${href}">${name}</a>`;
                };

                // Only the text between tags, inside the <pre>, so neither
                // attributes nor the line numbers are touched.
                return html.replace(/<pre[\s\S]*?<\/pre>/, (pre) =>
                    pre.replace(
                        />([^<]+)</g,
                        (_, text) => `>${text.replace(pattern, link)}<`
                    )
                );
            };
        },
    });
