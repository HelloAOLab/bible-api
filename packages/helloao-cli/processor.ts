import { createHash } from 'node:crypto';
import { PARSER_VERSION } from '@helloao/tools/parser/usx-parser.js';
import { LOCKMAN_PARSER_VERSION } from '@helloao/tools/parser/lockman-parser.js';
import { DATASET_VERSION } from '@helloao/tools/generation/dataset.js';
import { GenerateApiOptions } from '@helloao/tools/generation/api.js';

/**
 * The hashes of the code that processes sources and generates the API.
 * Injected by the build (see tools/build.ts), which hashes the minified bundle of each group of code.
 * Minifying first means that changes to comments and formatting don't cause sources to be reprocessed.
 */
declare const __HELLOAO_CODE_HASHES__: CodeHashes;

/**
 * The hashes of each group of processing code.
 */
export interface CodeHashes {
    /**
     * The hash of the code that parses translations and commentaries (@helloao/tools/generation/dataset.ts and its imports).
     */
    dataset: string;

    /**
     * The hash of the code that generates the Theographic dataset.
     */
    theographic: string;

    /**
     * The hash of the code that generates the interlinear and lexicon datasets.
     */
    interlinear: string;

    /**
     * The hash of the code that generates the History Globe dataset.
     */
    historyGlobe: string;

    /**
     * The hash of the code that generates the verse of the day dataset (including the list of verses).
     */
    verseOfTheDay: string;

    /**
     * The hash of the code that generates the API files (@helloao/tools/generation/api.ts and its imports).
     */
    api: string;
}

/**
 * The version of the code in this package that imports the processed sources into the database.
 * Increment this when a change to the import code (e.g. db.ts) changes what is stored for a source,
 * so that every source gets re-imported on the next sync.
 */
export const IMPORT_VERSION = 1;

/**
 * The version of the code in this package that generates and uploads the API files during a sync.
 * Increment this when a change causes different files to be generated for the same database,
 * so that every item gets re-uploaded on the next sync.
 */
export const UPLOAD_VERSION = 1;

/**
 * The version of the code in this package that loads API files (see the load*FromDirectory functions in files.ts).
 * That code isn't part of @helloao/tools, so the build doesn't hash it.
 * Increment this when a change causes different items to be loaded from the same API files,
 * so that every "api" source gets re-imported on the next sync.
 */
export const API_LOADER_VERSION = 1;

/**
 * The types of sources that can be synced.
 */
export type SyncSourceType =
    | 'translation'
    | 'commentary'
    | 'theographic'
    | 'interlinear'
    | 'history-globe'
    | 'verse-of-the-day'
    | 'api';

/**
 * Gets the code hashes that were injected by the build.
 * Returns null when the code is running without being built (e.g. in tests or through tsx),
 * in which case only the declared version numbers identify the processor.
 */
export function getCodeHashes(): CodeHashes | null {
    try {
        return __HELLOAO_CODE_HASHES__;
    } catch {
        return null;
    }
}

/**
 * Gets the version of the processor that is used to import the given type of source.
 * When this changes, all sources of the type need to be reprocessed.
 * @param type The type of source.
 * @param codeHashes The code hashes to use. Defaults to the ones that were injected by the build.
 */
export function getProcessorVersion(
    type: SyncSourceType,
    codeHashes: CodeHashes | null = getCodeHashes()
): string {
    let versions: object;
    if (type === 'translation' || type === 'commentary') {
        versions = {
            import: IMPORT_VERSION,
            dataset: DATASET_VERSION,
            parser: PARSER_VERSION,
            lockmanParser: LOCKMAN_PARSER_VERSION,
            code: codeHashes?.dataset ?? null,
        };
    } else if (type === 'theographic') {
        versions = {
            import: IMPORT_VERSION,
            code: codeHashes?.theographic ?? null,
        };
    } else if (type === 'verse-of-the-day') {
        versions = {
            import: IMPORT_VERSION,
            code: codeHashes?.verseOfTheDay ?? null,
        };
    } else if (type === 'history-globe') {
        versions = {
            import: IMPORT_VERSION,
            code: codeHashes?.historyGlobe ?? null,
        };
    } else if (type === 'api') {
        versions = {
            import: IMPORT_VERSION,
            apiLoader: API_LOADER_VERSION,
        };
    } else {
        versions = {
            import: IMPORT_VERSION,
            code: codeHashes?.interlinear ?? null,
        };
    }

    return hashJson(versions);
}

/**
 * Gets the version of the generator that is used to generate the API files with the given options.
 * When this changes, all items need to be re-uploaded.
 * @param options The options that the API is generated with.
 * @param codeHashes The code hashes to use. Defaults to the ones that were injected by the build.
 */
export function getGeneratorVersion(
    options: GenerateApiOptions & { pretty?: boolean },
    codeHashes: CodeHashes | null = getCodeHashes()
): string {
    return hashJson({
        upload: UPLOAD_VERSION,
        code: codeHashes?.api ?? null,
        options: {
            pretty: !!options.pretty,
            useCommonName: !!options.useCommonName,
            generateAudioFiles: !!options.generateAudioFiles,
            generateCompleteTranslationFiles:
                !!options.generateCompleteTranslationFiles,
            generateSimpleChapterFiles: !!options.generateSimpleChapterFiles,
            pathPrefix: options.pathPrefix ?? '',
        },
    });
}

function hashJson(value: unknown): string {
    return createHash('sha256').update(JSON.stringify(value)).digest('hex');
}
