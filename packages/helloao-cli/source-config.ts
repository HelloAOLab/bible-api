import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { z } from 'zod';
import {
    sourceAllTranslations,
    SourceAllTranslationsOptions,
    SourceTranslationsResult,
} from './actions.js';

/**
 * The types of sources that source-all-translations can download translations from.
 */
export type SourceConfigSourceType = 'ebible' | 'fetch-bible' | 'osis' | 'bsb';

/**
 * A source of translations in the source config.
 */
export interface SourceConfigSource {
    /**
     * The type of source.
     * - `ebible`: the translations from eBible. Required.
     * - `fetch-bible`: the translations from the fetch.bible collection that eBible doesn't provide.
     * - `osis`: the pinned OSIS translations (see fetch-osis-translations).
     * - `bsb`: the Berean Standard Bible from bereanbible.com (see fetch-bsb).
     */
    type: SourceConfigSourceType;

    /**
     * The directory that the translations should be downloaded to, relative to the config file.
     */
    path: string;

    /**
     * The URL of the fetch.bible manifest. Only for `fetch-bible` sources.
     */
    manifestUrl?: string;

    /**
     * The GitHub repository (owner/name) of the fetch.bible collection. Only for `fetch-bible` sources.
     */
    repo?: string;

    /**
     * The branch (or other git ref) of the fetch.bible collection. Only for `fetch-bible` sources.
     */
    ref?: string;
}

/**
 * The configuration for the source-all-translations command.
 */
export interface SourceConfig {
    /**
     * The path to the database that tracks downloads, relative to the config file.
     */
    db?: string;

    /**
     * The IDs (eBible ID, fetch.bible ID, or translation ID) of translations that should never be downloaded.
     * Applied in addition to the ignorelist.txt file of each source directory.
     */
    ignorelist?: string[];

    /**
     * Whether USFM files should be converted to USX3. Defaults to true.
     */
    convertToUsx3?: boolean;

    /**
     * The path to BibleMultiConverter.jar, relative to the config file.
     */
    bibleMultiConverterPath?: string;

    /**
     * The maximum number of BibleMultiConverter processes to run at once.
     */
    conversionConcurrency?: number;

    /**
     * The sources that translations should be downloaded from, and the directories they are downloaded to.
     * Sources that are left out are not downloaded from (except for eBible, which is required).
     */
    sources: SourceConfigSource[];
}

/**
 * A source config whose paths can be resolved.
 */
export interface LoadedSourceConfig extends SourceConfig {
    /**
     * The directory that the paths in the config are relative to.
     */
    baseDir: string;
}

const fetchBibleOnlyFields = ['manifestUrl', 'repo', 'ref'] as const;

const sourceConfigSchema = z.object({
    db: z.string().optional(),
    ignorelist: z.array(z.string()).optional(),
    convertToUsx3: z.boolean().optional(),
    bibleMultiConverterPath: z.string().optional(),
    conversionConcurrency: z.number().int().positive().optional(),
    sources: z
        .array(
            z
                .object({
                    type: z.enum(['ebible', 'fetch-bible', 'osis', 'bsb']),
                    path: z.string(),
                    manifestUrl: z.url().optional(),
                    repo: z
                        .string()
                        .regex(/^[^/\s]+\/[^/\s]+$/, 'Must be owner/name.')
                        .optional(),
                    ref: z.string().optional(),
                })
                .superRefine((source, ctx) => {
                    if (source.type === 'fetch-bible') {
                        return;
                    }
                    for (const field of fetchBibleOnlyFields) {
                        if (source[field] !== undefined) {
                            ctx.addIssue({
                                code: 'custom',
                                message: `${field} is only allowed for fetch-bible sources.`,
                                path: [field],
                            });
                        }
                    }
                })
        )
        .superRefine((sources, ctx) => {
            const seen = new Set<string>();
            sources.forEach((source, index) => {
                if (seen.has(source.type)) {
                    ctx.addIssue({
                        code: 'custom',
                        message: `There can only be one ${source.type} source.`,
                        path: [index, 'type'],
                    });
                }
                seen.add(source.type);
            });
            if (!seen.has('ebible')) {
                ctx.addIssue({
                    code: 'custom',
                    message: 'An ebible source is required.',
                });
            }
        }),
});

/**
 * Loads and validates the source config from the given JSON file.
 * @param configPath The path to the config file.
 */
export async function loadSourceConfig(
    configPath: string
): Promise<LoadedSourceConfig> {
    const fullPath = path.resolve(configPath);
    const json = JSON.parse(await readFile(fullPath, 'utf-8'));
    const result = sourceConfigSchema.safeParse(json);
    if (!result.success) {
        throw new Error(
            `Invalid source config ${fullPath}:\n${z.prettifyError(result.error)}`
        );
    }

    return {
        ...result.data,
        baseDir: path.dirname(fullPath),
    };
}

/**
 * Converts the given source config into the output directory and options for sourceAllTranslations().
 * @param config The source config.
 * @param options The options that override the config (e.g. from the command line).
 */
export function getSourceAllTranslationsOptions(
    config: LoadedSourceConfig,
    options: SourceAllTranslationsOptions = {}
): { outputDir: string; options: SourceAllTranslationsOptions } {
    const resolve = (p: string) => path.resolve(config.baseDir, p);
    const find = (type: SourceConfigSourceType) =>
        config.sources.find((source) => source.type === type);

    const ebible = find('ebible')!;
    const fetchBible = find('fetch-bible');
    const osis = find('osis');
    const bsb = find('bsb');

    return {
        outputDir: resolve(ebible.path),
        options: {
            convertToUsx3: config.convertToUsx3,
            bibleMultiConverterPath: config.bibleMultiConverterPath
                ? resolve(config.bibleMultiConverterPath)
                : undefined,
            conversionConcurrency: config.conversionConcurrency,
            ...withoutUndefined(options),
            db: options.db ?? (config.db ? resolve(config.db) : undefined),
            ignorelist: [
                ...(config.ignorelist ?? []),
                ...(options.ignorelist ?? []),
            ],
            includeFetchBible: !!fetchBible,
            fetchBibleDir: fetchBible ? resolve(fetchBible.path) : undefined,
            manifestUrl: fetchBible?.manifestUrl ?? options.manifestUrl,
            repo: fetchBible?.repo ?? options.repo,
            ref: fetchBible?.ref ?? options.ref,
            includeOsis: !!osis,
            osisDir: osis ? resolve(osis.path) : undefined,
            includeBsb: !!bsb,
            bsbDir: bsb ? resolve(bsb.path) : undefined,
        },
    };
}

/**
 * Downloads the translations from the sources in the source config at the given path.
 * @param configPath The path to the source config file.
 * @param translations The translations to download. If omitted, every translation is downloaded.
 * @param options The options that override the config (e.g. from the command line).
 */
export async function sourceAllTranslationsFromConfig(
    configPath: string,
    translations?: string[],
    options: SourceAllTranslationsOptions = {}
): Promise<SourceTranslationsResult> {
    const config = await loadSourceConfig(configPath);
    const resolved = getSourceAllTranslationsOptions(config, options);
    return await sourceAllTranslations(
        resolved.outputDir,
        translations,
        resolved.options
    );
}

function withoutUndefined<T extends object>(value: T): Partial<T> {
    return Object.fromEntries(
        Object.entries(value).filter(([, v]) => v !== undefined)
    ) as Partial<T>;
}
