import * as esbuild from 'esbuild';
import type { BuildOptions } from 'esbuild';
import { readFileSync } from 'fs';
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

async function entryPoints(path: string): Promise<string[]> {
    return await fg([
        `${path}/**/*.[tj]s`,
        `!${path}/**/*.spec.ts`,
        `!${path}/**/*.d.ts`,
        `!${path}/dist/**/*`,
        `!${path}/node_modules/**/*`,
    ]);
}

async function buildCli() {
    const options: BuildOptions = {
        entryPoints: [cliIndex, cliEntry],
        external: [...getExternals(cliPackageJson), '@helloao/cli'],
    };

    await Promise.all([
        // esbuild.build({
        //     sourcemap: true,
        //     platform: 'node',
        //     format: 'esm',
        //     target: 'esnext',
        //     entryPoints: await entryPoints('packages/helloao-cli'),
        //     outdir: path.resolve(cliDist, 'esm'),
        // }),
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
            outdir: path.resolve(toolsDist, 'cjs'),
        }),
    ]);

    console.log('Tools built successfully!');
}

async function build() {
    await buildTools();
    await buildCli();
}

build();
