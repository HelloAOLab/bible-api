/** Gets this module directory in CommonJS and native ESM builds. */
export async function getModuleDirectory(): Promise<string> {
    return typeof __dirname !== 'undefined'
        ? __dirname
        : (await import('./module-dir.mjs')).dirname;
}
