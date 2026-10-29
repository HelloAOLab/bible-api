import * as esbuild from 'esbuild';
import type { BuildOptions } from 'esbuild';
import { readFileSync } from 'fs';
import { createHash } from 'crypto';
import path from 'path';
import fg from 'fast-glob';

let __dirname = path.dirname(new URL(import.meta.url).pathname);
const isWindows = process.platform === 'win32';
if (isWindows && __dirname.startsWith('/')) {
    __dirname = __dirname.substring(1);
}
const root = path.resolve(__dirname, '..');
const packages = path.resolve(root, 'packages');
const cli = path.resolve(packages, 'helloao-cli');
const cliIndex = path.resolve(cli, 'index.ts');
const cliEntry = path.resolve(cli, 'cli.ts');
const cliDist = path.resolve(cli, 'dist');
const cliPackageJson = path.resolve(cli, 'package.json');
const tools = path.resolve(packages, 'helloao-tools');
const toolsIndex = path.resolve(tools, 'index.ts');
const toolsPackageJson = path.resolve(tools, 'package.json');
const toolsDist = path.resolve(tools, 'dist');

const fuba = path.resolve(packages, 'free-use-bible-api');
const fubaIndex = path.resolve(fuba, 'index.ts');
const fubaPackageJson = path.resolve(fuba, 'package.json');
const fubaDist = path.resolve(fuba, 'dist');

const fubaReact = path.resolve(packages, 'free-use-bible-api-react');
const fubaReactPackageJson = path.resolve(fubaReact, 'package.json');
const fubaReactDist = path.resolve(fubaReact, 'dist');

function getExternals(packageJson: string) {
    const packageData = JSON.parse(
        readFileSync(packageJson, { encoding: 'utf-8' })
    );
    return Object.keys(packageData.dependencies).filter((p) => {
        // Allow all the helloao packages to be bundled.
        return !/^@helloao\//.test(p);
    });
}

const cjsOptions: BuildOptions = {
    sourcemap: true,
    bundle: true,
    platform: 'node',
    format: 'cjs',
    target: 'esnext',
    outExtension: {
        '.js': '.cjs',
    },
};

const esmOptions: BuildOptions = {
    sourcemap: true,
    bundle: false,
    platform: 'neutral',
};

async function entryPoints(
    path: string,
    ignore: string[] = []
): Promise<string[]> {
    return await fg([
        `${path}/**/*.[tj]s`,
        `${path}/**/*.tsx`,
        `!${path}/**/*.spec.ts`,
        `!${path}/**/*.spec.tsx`,
        `!${path}/**/*.d.ts`,
        `!${path}/dist/**/*`,
        `!${path}/node_modules/**/*`,
        ...ignore.map((pattern) => `!${path}/${pattern}`),
    ]);
}

/**
 * Calculates the hash of the code that the given entry points run.
 * The code is bundled and minified first so that changes to comments, formatting, and types don't change the hash.
 * Third-party packages are left out. Their versions are pinned by the lockfile.
 * @param entries The entry points, relative to the tools package.
 */
async function hashCode(entries: string[]): Promise<string> {
    const result = await esbuild.build({
        stdin: {
            contents: entries
                .map((e) => `export * from ${JSON.stringify(`./${e}`)};`)
                .join('\n'),
            resolveDir: tools,
            loader: 'ts',
        },
        bundle: true,
        write: false,
        minify: true,
        legalComments: 'none',
        platform: 'node',
        format: 'esm',
        packages: 'external',
    });

    const hash = createHash('sha256');
    for (let file of result.outputFiles) {
        hash.update(file.contents);
    }
    return hash.digest('hex');
}

/**
 * Calculates the hashes of the code that processes sources and generates the API.
 * They are used by the sync command to determine when sources need to be reprocessed (see packages/helloao-cli/processor.ts).
 */
async function getCodeHashes() {
    return {
        dataset: await hashCode(['generation/dataset.ts']),
        theographic: await hashCode(['generation/theographic.ts']),
        interlinear: await hashCode(['generation/interlinear.ts']),
        verseOfTheDay: await hashCode(['generation/verse-of-the-day.ts']),
        api: await hashCode(['generation/api.ts']),
    };
}

async function buildCli() {
    const external = [...getExternals(cliPackageJson), '@helloao/cli'];
    const options: BuildOptions = {
        entryPoints: [cliIndex, cliEntry],
        external,
        define: {
            __HELLOAO_CODE_HASHES__: JSON.stringify(await getCodeHashes()),
        },
    };

    await Promise.all([
        esbuild.build({
            ...esmOptions,
            ...options,
            external: [...external, '@helloao/tools'],
            bundle: true,
            format: 'esm',
            platform: 'node',
            // __dirname doesn't exist in ES modules.
            define: { ...options.define, __dirname: 'import.meta.dirname' },
            // sourcemap: true,
            // platform: 'node',
            // format: 'esm',
            // target: 'esnext',
            // entryPoints: await entryPoints('packages/helloao-cli'),
            outdir: path.resolve(cliDist, 'esm'),
        }),
        esbuild.build({
            ...cjsOptions,
            ...options,
            outdir: path.resolve(cliDist, 'cjs'),
        }),
    ]);

    console.log('CLI built successfully!');
}

async function buildTools() {
    const options: BuildOptions = {
        entryPoints: await entryPoints('packages/helloao-tools'),
    };

    await Promise.all([
        esbuild.build({
            ...esmOptions,
            ...options,
            outdir: path.resolve(toolsDist, 'esm'),
        }),
        esbuild.build({
            ...cjsOptions,
            ...options,
            bundle: false,
            outdir: path.resolve(toolsDist, 'cjs'),
        }),
    ]);

    console.log('Tools built successfully!');
}

async function buildClient() {
    const options: BuildOptions = {
        entryPoints: await entryPoints('packages/free-use-bible-api'),
    };

    await Promise.all([
        esbuild.build({
            ...esmOptions,
            ...options,
            outdir: path.resolve(fubaDist, 'esm'),
        }),
        esbuild.build({
            ...cjsOptions,
            ...options,
            outdir: path.resolve(fubaDist, 'cjs'),
        }),
    ]);

    console.log('Client built successfully!');
}

async function buildReact() {
    const packageData = JSON.parse(
        readFileSync(fubaReactPackageJson, { encoding: 'utf-8' })
    );
    const external = [
        ...Object.keys(packageData.dependencies),
        ...Object.keys(packageData.peerDependencies),
        'react/jsx-runtime',
    ];
    const options: BuildOptions = {
        entryPoints: await entryPoints('packages/free-use-bible-api-react', [
            'test/**/*',
        ]),
        jsx: 'automatic',
    };

    await Promise.all([
        esbuild.build({
            ...esmOptions,
            ...options,
            outdir: path.resolve(fubaReactDist, 'esm'),
        }),
        esbuild.build({
            ...cjsOptions,
            ...options,
            entryPoints: [path.resolve(fubaReact, 'index.ts')],
            external,
            outdir: path.resolve(fubaReactDist, 'cjs'),
        }),
    ]);

    console.log('React package built successfully!');
}

async function build() {
    await buildTools();
    await buildCli();
    await buildClient();
    await buildReact();
}

build();
