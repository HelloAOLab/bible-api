import path from 'node:path';
import fsExtra from 'fs-extra';
import { log } from '@helloao/tools';
import { InputTranslationMetadata } from '@helloao/tools/generation/index.js';

const { exists, readFile } = fsExtra;

let metaDir: string | null = null;
export async function getMetaPath() {
    if (metaDir) {
        return metaDir;
    }
    const metaPaths = ['../../meta'];

    for (let metaPath of metaPaths) {
        const fullPath = path.resolve(__dirname, metaPath);
        if (await exists(fullPath)) {
            metaDir = fullPath;
            return fullPath;
        }
    }

    return null;
}

/**
 * Loads the override metadata for the given translation from the meta directory, if it has one.
 */
export async function loadMetadataOverride(
    translationId: string
): Promise<InputTranslationMetadata | null> {
    const logger = log.getLogger();
    const metaDir = await getMetaPath();
    if (!metaDir) {
        return null;
    }

    const overridePath = path.resolve(metaDir, `${translationId}.json`);
    if (!(await exists(overridePath))) {
        return null;
    }

    logger.log(`Using override metadata file: ${overridePath}`);
    const overrideMetadata = await readFile(overridePath, 'utf-8');
    return JSON.parse(overrideMetadata);
}
