import * as esbuild from 'esbuild';
import type { BuildOptions } from 'esbuild';
import { readFileSync } from 'fs';
import { readFile } from 'fs/promises';
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
    const cliExternal = [...getExternals(cliPackageJson), '@helloao/cli'];
    const toolsExternal = getExternals(toolsPackageJson);
    // Include tools dependencies as external since CLI imports from tools
    const external = [...cliExternal, ...toolsExternal, '@helloao/tools'];
    const options: BuildOptions = {
        entryPoints: [cliIndex, cliEntry],
        external,
    };

    await Promise.all([
        esbuild.build({
            ...esmOptions,
            ...options,
            entryPoints: [cliIndex],
            bundle: true,
            format: 'esm',
            platform: 'node',
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
    // Plugin to rewrite imports to .cjs for CJS builds
    const rewriteCjsImportsPlugin: esbuild.Plugin = {
        name: 'rewrite-cjs-imports',
        setup(build) {
            build.onLoad({ filter: /\.ts$/ }, async (args) => {
                const contents = await readFile(args.path, 'utf8');
                // Rewrite relative imports to .cjs for CJS builds
                // Handles:
                // - import ... from './file.js' → './file.cjs'
                // - import ... from '../file' → '../file.cjs' (if it's a local file)
                // - export * from './file.js' → './file.cjs'
                let rewritten = contents;
                
                // Replace .js extensions with .cjs in import statements
                rewritten = rewritten.replace(
                    /from\s+['"](\.\.?\/[^'"]*?)\.js['"]/g,
                    (match, importPath) => `from '${importPath}.cjs'`
                );
                
                // Replace .js extensions with .cjs in export * statements
                rewritten = rewritten.replace(
                    /export\s+\*\s+from\s+['"](\.\.?\/[^'"]*?)\.js['"]/g,
                    (match, importPath) => `export * from '${importPath}.cjs'`
                );
                
                // Add .cjs extension to relative imports without extension
                // Match: from '../utils' or from './types' (but not from './types.js' or from 'lodash')
                rewritten = rewritten.replace(
                    /from\s+['"](\.\.?\/[^'"/]+?)['"]/g,
                    (match, importPath) => {
                        // Skip if it already has an extension or ends with /
                        if (importPath.match(/\.(js|ts|json|node|cjs)$/) || importPath.endsWith('/')) {
                            return match;
                        }
                        return `from '${importPath}.cjs'`;
                    }
                );
                
                // Same for export * statements
                rewritten = rewritten.replace(
                    /export\s+\*\s+from\s+['"](\.\.?\/[^'"/]+?)['"]/g,
                    (match, importPath) => {
                        if (importPath.match(/\.(js|ts|json|node|cjs)$/) || importPath.endsWith('/')) {
                            return match;
                        }
                        return `export * from '${importPath}.cjs'`;
                    }
                );
                return { contents: rewritten, loader: 'ts' };
            });
        },
    };

    await Promise.all([
        esbuild.build({
            ...esmOptions,
            entryPoints: await entryPoints('packages/helloao-tools'),
            outdir: path.resolve(toolsDist, 'esm'),
        }),
        esbuild.build({
            ...cjsOptions,
            entryPoints: await entryPoints('packages/helloao-tools'),
            bundle: false,
            outdir: path.resolve(toolsDist, 'cjs'),
            plugins: [rewriteCjsImportsPlugin],
        }),
    ]);

    console.log('Tools built successfully!');
}

async function build() {
    await buildTools();
    await buildCli();
}

build();
