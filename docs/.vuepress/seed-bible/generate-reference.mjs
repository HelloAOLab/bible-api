/**
 * Generates the Seed Bible extension API reference (docs/seed-bible/reference/)
 * from the type declarations of the `seed-bible` npm package this docs
 * package depends on.
 *
 * The reference documents the published package rather than the seed-bible
 * source, so it always matches what an extension developer installs. To
 * document a newer release, bump `seed-bible` in docs/package.json.
 *
 * Besides the markdown pages it writes `sidebar.json` next to them, which
 * .vuepress/config.ts turns into the reference's sidebar.
 *
 * Usage: node .vuepress/seed-bible/generate-reference.mjs
 */
import { Application, Converter, ReflectionKind } from 'typedoc';
import {
    MarkdownPageEvent,
    MarkdownRendererEvent,
    MemberRouter,
} from 'typedoc-plugin-markdown';
import { createRequire } from 'node:module';
import { existsSync, realpathSync } from 'node:fs';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const docsDir = path.resolve(here, '../..');
const outDir = path.join(docsDir, 'seed-bible', 'reference');

const PACKAGE = 'seed-bible';

/**
 * The entry points a third-party (sandboxed) extension imports. The package's
 * other entry points (`seed-bible`, `seed-bible/managers`, `seed-bible/i18n`)
 * are the app's internals, used only by the extensions built into Seed Bible.
 */
const ENTRY_POINTS = [
    { specifier: 'seed-bible/extensions', types: 'extensions/index.d.ts' },
    {
        specifier: 'seed-bible/extensions/testing',
        types: 'extensions/testing.d.ts',
    },
    { specifier: 'seed-bible/components', types: 'components/index.d.ts' },
];

/**
 * The name the reference gives the types an entry point uses but doesn't
 * export (see typedoc-plugin-missing-exports), so readers can still look
 * them up. They can't be imported, which the landing page explains.
 */
const UNEXPORTED_MODULE = 'Unexported types';

const require = createRequire(import.meta.url);
const packageJsonPath = require.resolve(`${PACKAGE}/package.json`);
const packageDir = path.dirname(packageJsonPath);
const { version } = require(packageJsonPath);
const entryPointFiles = ENTRY_POINTS.map(({ types }) =>
    realpathSync(path.join(packageDir, 'dist', types))
);

/**
 * TypeDoc treats everything under node_modules as external, which here would
 * include the package being documented. Keep the dependencies external
 * (Preact, signals, CasualOS), in both pnpm's layout
 * (node_modules/.pnpm/<name>@<version>/node_modules/<name>) and npm's.
 */
const externalPattern = [
    `**/node_modules/!(.pnpm|${PACKAGE})/**`,
    `**/node_modules/.pnpm/!(${PACKAGE}@*)/**`,
];

/**
 * TypeDoc only documents files its TypeScript program includes, and the
 * entry points live in the package store, so the tsconfig is written with
 * their real paths each run.
 */
async function writeTsconfig() {
    const cacheDir = path.join(here, '..', '.cache');
    const file = path.join(cacheDir, 'seed-bible-reference.tsconfig.json');
    await mkdir(cacheDir, { recursive: true });
    await writeFile(
        file,
        JSON.stringify({
            compilerOptions: {
                target: 'ES2022',
                module: 'ESNext',
                moduleResolution: 'Bundler',
                jsx: 'react-jsx',
                jsxImportSource: 'preact',
                lib: ['ES2022', 'DOM', 'DOM.Iterable'],
                strict: true,
                skipLibCheck: true,
                esModuleInterop: true,
                noEmit: true,
                types: [],
            },
            files: entryPointFiles,
        })
    );
    return file;
}

/**
 * The member router names each page after its module, and the modules are
 * named after the import specifier (`seed-bible/extensions`). Drop the
 * `seed-bible/` so the pages land at reference/extensions/ rather than
 * reference/seed-bible/extensions/.
 */
class ReferenceRouter extends MemberRouter {
    getIdealBaseName(reflection) {
        return super
            .getIdealBaseName(reflection)
            .replace(new RegExp(`^${PACKAGE}/`), '');
    }
}

const app = await Application.bootstrapWithPlugins({
    name: `Seed Bible extension API (v${version})`,
    entryPoints: entryPointFiles,
    out: outDir,
    plugin: ['typedoc-plugin-markdown', 'typedoc-plugin-missing-exports'],
    tsconfig: await writeTsconfig(),
    // The declarations were already type checked when the package was built;
    // checking them again here only surfaces quirks of their dependencies'
    // own declarations.
    skipErrorChecking: true,
    readme: 'none',
    excludeExternals: true,
    externalPattern,
    excludePrivate: true,
    excludeInternal: true,
    // The pages document compiled .d.ts files, so "Defined in
    // dist/extensions/index.d.ts:139" would only be noise.
    disableSources: true,
    internalModule: UNEXPORTED_MODULE,
    // VuePress serves a directory's README.md as its index page.
    entryFileName: 'README.md',
    // The site's sidebar and title take over from TypeDoc's own header.
    hidePageHeader: true,
    useCodeBlocks: true,
    parametersFormat: 'table',
    enumMembersFormat: 'table',
    typeDeclarationFormat: 'list',
    sanitizeComments: true,
    validation: { notExported: false, invalidLink: true, notDocumented: false },
});

app.renderer.defineRouter('seed-bible-reference', ReferenceRouter);
app.options.setValue('router', 'seed-bible-reference');

app.converter.on(Converter.EVENT_RESOLVE_BEGIN, (context) => {
    for (const module of context.project.children ?? []) {
        if (!module.kindOf(ReflectionKind.Module)) {
            continue;
        }
        const entry = ENTRY_POINTS.find(
            ({ specifier }) => specifier === `${PACKAGE}/${module.name}`
        );
        if (entry) {
            module.name = entry.specifier;
        }
    }
});

app.renderer.on(MarkdownPageEvent.END, (page) => {
    if (
        page.model.kindOf(ReflectionKind.Module) &&
        page.model.name === UNEXPORTED_MODULE
    ) {
        page.contents = page.contents.replace(
            `# ${UNEXPORTED_MODULE}\n`,
            `# ${UNEXPORTED_MODULE}\n\n` +
                "Types that this package's exports use, but that it doesn't export by name. " +
                "They're here so you can see their shape; you can't import them. " +
                'Write the value directly, or derive the type from an export that uses it ' +
                'with an indexed type, like `SandboxError["code"]`.\n'
        );
    }
});

let navigation;
app.renderer.on(MarkdownRendererEvent.END, (event) => {
    navigation = event.navigation;
});

const project = await app.convert();
if (!project) {
    console.error('Could not read the seed-bible type declarations.');
    process.exit(1);
}

if (existsSync(outDir)) {
    await rm(outDir, { recursive: true });
}
await mkdir(outDir, { recursive: true });
await app.generateOutputs(project);

if (app.logger.hasErrors()) {
    process.exit(1);
}

const linkOf = (item) => item.path?.replace(/\\/g, '/');

/**
 * Turns part of TypeDoc's navigation tree into VuePress sidebar items, with
 * links relative to the reference's root
 * (`extensions/interfaces/SandboxContext.md`). Groups ("Interfaces",
 * "Functions", …) become collapsible.
 */
const toSidebarItem = (item) => {
    const link = linkOf(item);
    if (!item.children?.length) {
        return link ? { text: item.title, link } : null;
    }
    return {
        text: item.title,
        ...(link ? { link } : {}),
        collapsible: true,
        children: item.children.map(toSidebarItem).filter(Boolean),
    };
};

/** Every navigation item in the tree, depth first. */
const flatten = (items) =>
    items.flatMap((item) => [item, ...flatten(item.children ?? [])]);

/**
 * TypeDoc nests the modules by the segments of their names
 * (seed-bible › extensions › testing). The sidebar lists each entry point at
 * the top level instead, under the name it's imported by, in the order of
 * ENTRY_POINTS.
 */
const moduleLinks = new Map(
    ENTRY_POINTS.map(({ specifier }) => [
        `${specifier.replace(`${PACKAGE}/`, '')}/README.md`,
        specifier,
    ])
);
const allItems = flatten(navigation ?? []);

const sidebar = ENTRY_POINTS.map(({ specifier }) => {
    const module = allItems.find(
        (item) => moduleLinks.get(linkOf(item)) === specifier
    );
    if (!module) {
        throw new Error(`No reference page was generated for ${specifier}.`);
    }
    const children = [];
    let unexported = [];
    for (const child of module.children ?? []) {
        if (moduleLinks.has(linkOf(child))) {
            // Another entry point (extensions/testing), listed on its own.
            continue;
        }
        if (child.kind === undefined && child.title === 'Modules') {
            // The only module inside an entry point is the one
            // typedoc-plugin-missing-exports adds; it goes last.
            unexported = child.children.map(toSidebarItem).filter(Boolean);
            continue;
        }
        const sidebarItem = toSidebarItem(child);
        if (sidebarItem) {
            children.push(sidebarItem);
        }
    }
    return {
        text: specifier,
        link: linkOf(module),
        collapsible: true,
        children: [...children, ...unexported],
    };
});

await writeFile(
    path.join(outDir, 'sidebar.json'),
    JSON.stringify({ version, items: sidebar }, null, 4) + '\n'
);

console.log(
    `Seed Bible extension API reference for seed-bible@${version} written to ${path.relative(process.cwd(), outDir)}`
);
