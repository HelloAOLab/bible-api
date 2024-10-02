import * as esbuild from 'esbuild';
import type { BuildOptions } from 'esbuild';
import { readFileSync } from 'fs';
import path from 'path';

let __dirname = path.dirname(new URL(import.meta.url).pathname);
const isWindows = process.platform === 'win32';
if (isWindows && __dirname.startsWith('/')) {
    __dirname = __dirname.substring(1);
}
const root = path.resolve(__dirname, '..');
const packages = path.resolve(root, 'packages');
const cli = path.resolve(packages, 'helloao-cli');
const cliIndex = path.resolve(cli, 'index.ts');
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

const commonOptions: BuildOptions = {
    sourcemap: true,
    bundle: true,
    platform: 'node',
    outExtension: {
        '.js': '.cjs',
    },
};

async function buildCli() {
    await esbuild.build({
        ...commonOptions,
        entryPoints: [cliIndex],
        outdir: cliDist,
        external: [...getExternals(cliPackageJson), '@helloao/cli'],
    });

    console.log('CLI built successfully!');
}

async function buildTools() {
    await esbuild.build({
        ...commonOptions,
        entryPoints: [toolsIndex],
        outdir: toolsDist,
        external: [...getExternals(toolsPackageJson)],
    });

    console.log('Tools built successfully!');
}

async function build() {
    await buildTools();
    await buildCli();
}

build();
