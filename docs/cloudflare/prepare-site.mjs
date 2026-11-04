// Lays out the built docs site for Cloudflare Workers static assets.
//
// VuePress builds the site with a `/docs/` base into build/docs, so the files
// must be served from under /docs/. This copies them to
// build/cloudflare-docs/docs, adds the site-root files (robots.txt), and writes
// a `_redirects` file that sends the site root to the docs, as the CloudFront
// function in ../cloudfront/docs-index.js does.
//
// Pass `--preview` for preview versions: it adds a `_headers` file that marks
// every page `noindex`, so preview URLs stay out of search engines.
//
// Usage: node cloudflare/prepare-site.mjs [--preview]

import { cp, mkdir, rm, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const docsDir = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '..'
);
const buildDir = path.resolve(docsDir, '../build/docs');
const outDir = path.resolve(docsDir, '../build/cloudflare-docs');
const preview = process.argv.includes('--preview');

try {
    await access(path.join(buildDir, 'index.html'));
} catch {
    console.error(
        `No built docs found in ${buildDir}. Run \`pnpm build\` in docs/ first.`
    );
    process.exit(1);
}

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });
await cp(buildDir, path.join(outDir, 'docs'), { recursive: true });
await cp(path.join(docsDir, 'site-root'), outDir, { recursive: true });

await writeFile(path.join(outDir, '_redirects'), '/ /docs/ 301\n');

if (preview) {
    await writeFile(
        path.join(outDir, '_headers'),
        '/*\n  X-Robots-Tag: noindex\n'
    );
    // Preview URLs must never be crawled, whatever the production robots.txt says.
    await writeFile(
        path.join(outDir, 'robots.txt'),
        'User-agent: *\nDisallow: /\n'
    );
}

console.log(
    `Prepared ${preview ? 'preview' : 'production'} docs site in ${outDir}`
);
