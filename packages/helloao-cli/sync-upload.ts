import path from 'node:path';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { deflateSync, inflateSync } from 'node:zlib';
import { Database } from 'better-sqlite3';
import { getEnglishName, getNativeName } from 'all-iso-language-codes';
import { log } from '@helloao/tools';
import { DatasetOutput } from '@helloao/tools/generation/dataset.js';
import {
    generateApiForDataset,
    GenerateApiOptions,
    generateFilesForApi,
} from '@helloao/tools/generation/api.js';
import { PrismaClient } from './prisma-gen/client.js';
import * as database from './db.js';
import {
    mergeFileContents,
    SerializedFile,
    serializeFile,
    Uploader,
} from './files.js';
import {
    createUploader,
    UploadApiOptions,
    uploadFilesUsingUploader,
} from './uploads.js';
import { createFreeUseBibleApiOpenApiDocument } from './openapi.js';
import { getCodeHashes, getGeneratorVersion } from './processor.js';
import type { SyncItem, SyncItemKind, SyncOptions } from './sync.js';

/**
 * The configuration for a destination in the sync config.
 */
export interface SyncDestinationConfig extends Pick<
    UploadApiOptions,
    | 'profile'
    | 's3Region'
    | 'pretty'
    | 'useCommonName'
    | 'generateAudioFiles'
    | 'generateOpenApiDocument'
> {
    /**
     * The destination to upload the API files to.
     * Supports S3 (s3://bucket-name/path/to/folder), zip files, and local directories.
     * Relative paths are relative to the config file.
     */
    url: string;

    /**
     * Whether to generate complete translation files for each translation.
     * Defaults to true.
     */
    generateCompleteTranslationFiles?: boolean;

    /**
     * Whether to generate simplified chapter files for each translation and commentary chapter.
     * Defaults to true.
     */
    generateSimpleChapterFiles?: boolean;
}

/**
 * The result of uploading to a destination.
 */
export interface DestinationSyncResult {
    destination: string;

    /**
     * The items that were (or, in a dry run, would be) uploaded.
     */
    uploaded: SyncItem[];

    /**
     * The items that were (or, in a dry run, would be) removed from the destination.
     */
    removed: SyncItem[];

    /**
     * The number of files that were deleted from the destination.
     */
    deletedFiles: number;

    /**
     * Whether the mergable files (like available_translations.json) were uploaded.
     */
    uploadedMergedFiles: boolean;

    errors: string[];
}

interface UploadState {
    itemKind: SyncItemKind;
    itemId: string;
    sha256: string;
    generatorVersion: string;
}

/**
 * Uploads the given items to the given destination.
 * Only the items that changed since they were last uploaded to the destination are generated and uploaded,
 * and the files of items that are no longer in the given list are deleted from the destination.
 * Zip files are always written from scratch, so every item is written to them whenever anything changes.
 * @param db The database.
 * @param prisma The Prisma client for the database. Used to load the items.
 * @param destination The destination.
 * @param items The items that the destination should contain.
 * @param baseDir The directory that relative destination paths are relative to.
 * @param options The options for the sync.
 */
export async function syncDestination(
    db: Database,
    prisma: PrismaClient,
    destination: SyncDestinationConfig,
    items: SyncItem[],
    baseDir: string,
    options: SyncOptions = {}
): Promise<DestinationSyncResult> {
    const logger = log.getLogger();
    const url = destination.url;
    const isS3 = /^[a-z0-9]+:\/\//.test(url);
    const target = isS3 ? url : path.resolve(baseDir, url);
    const isZip = path.extname(url) === '.zip';
    const generateOptions: GenerateApiOptions & { pretty?: boolean } = {
        useCommonName: destination.useCommonName,
        generateAudioFiles: destination.generateAudioFiles,
        generateCompleteTranslationFiles:
            destination.generateCompleteTranslationFiles ?? true,
        generateSimpleChapterFiles:
            destination.generateSimpleChapterFiles ?? true,
        pretty: destination.pretty,
    };
    const codeHashes =
        options.codeHashes === undefined ? getCodeHashes() : options.codeHashes;
    const generatorVersion = getGeneratorVersion(generateOptions, codeHashes);

    const result: DestinationSyncResult = {
        destination: url,
        uploaded: [],
        removed: [],
        deletedFiles: 0,
        uploadedMergedFiles: false,
        errors: [],
    };

    logger.log(`Syncing destination ${url}`);

    const currentHashes = getItemHashes(db);
    const states = new Map(
        (
            db
                .prepare(
                    'SELECT itemKind, itemId, sha256, generatorVersion FROM SyncUpload WHERE destination = ?;'
                )
                .all(url) as UploadState[]
        ).map((s) => [`${s.itemKind}:${s.itemId}`, s])
    );

    const present: SyncItem[] = [];
    for (let item of items) {
        if (currentHashes.has(`${item.kind}:${item.id}`)) {
            present.push(item);
        } else {
            logger.warn(
                `The ${item.kind} ${item.id} is not in the database. Skipping it.`
            );
        }
    }
    const presentKeys = new Set(present.map((i) => `${i.kind}:${i.id}`));

    let toUpload = present.filter((item) => {
        const key = `${item.kind}:${item.id}`;
        const state = states.get(key);
        return (
            options.reuploadAll ||
            !state ||
            state.sha256 !== currentHashes.get(key) ||
            state.generatorVersion !== generatorVersion
        );
    });
    const toRemove: SyncItem[] = [...states.values()]
        .filter((s) => !presentKeys.has(`${s.itemKind}:${s.itemId}`))
        .map((s) => ({ kind: s.itemKind, id: s.itemId }));

    const destinationState = db
        .prepare('SELECT * FROM SyncDestination WHERE destination = ?;')
        .get(url) as { mergedSha256: string } | undefined;

    if (isZip) {
        if (
            toUpload.length <= 0 &&
            toRemove.length <= 0 &&
            destinationState &&
            existsSync(target)
        ) {
            logger.log('The zip file is up to date.');
            return result;
        }
        // Zip files are written from scratch, so they need every item.
        toUpload = present;
    }

    result.uploaded = toUpload;
    result.removed = toRemove;
    logger.log(
        `Items: ${toUpload.length} to upload, ${toRemove.length} to remove, ${present.length - toUpload.length} unchanged.`
    );
    if (options.verbose || options.dryRun) {
        for (let item of toUpload) {
            logger.log(`  upload ${item.kind} ${item.id}`);
        }
        for (let item of toRemove) {
            logger.log(`  remove ${item.kind} ${item.id}`);
        }
    }

    if (options.dryRun) {
        return result;
    }

    const pendingCount = (
        db
            .prepare(
                'SELECT COUNT(*) as c FROM SyncPendingDelete WHERE destination = ?;'
            )
            .get(url) as { c: number }
    ).c;

    if (
        toUpload.length <= 0 &&
        toRemove.length <= 0 &&
        pendingCount <= 0 &&
        destinationState
    ) {
        const merged = await buildMergedFiles(
            db,
            url,
            presentKeys,
            destination
        );
        if (merged.sha256 === destinationState.mergedSha256) {
            logger.log('The destination is up to date.');
            return result;
        }
    }

    if (isZip) {
        // The zip file is only complete once the merged files have been written to it,
        // so forget it until then. Otherwise an interrupted sync would leave a partial zip file that looks up to date.
        db.prepare('DELETE FROM SyncDestination WHERE destination = ?;').run(
            url
        );
    }

    const uploader = createUploader(target, {
        profile: destination.profile,
        s3Region: destination.s3Region,
    });

    try {
        await uploadItems(
            db,
            prisma,
            uploader,
            url,
            toUpload,
            currentHashes,
            generatorVersion,
            generateOptions,
            isZip,
            options
        );

        result.uploadedMergedFiles = await uploadMergedFiles(
            db,
            uploader,
            url,
            presentKeys,
            destination,
            isZip || !destinationState,
            destinationState?.mergedSha256 ?? null,
            options
        );

        // The files of removed items are only deleted after the merged files no longer list them,
        // so the API never links to files that don't exist.
        markRemovedItems(db, url, toRemove, isZip);

        if (!isZip) {
            result.deletedFiles = await deletePendingFiles(db, uploader, url);
        }
    } catch (err) {
        const message = `Failed to sync ${url}: ${(err as Error)?.message ?? err}`;
        logger.error(message);
        result.errors.push(message);
    } finally {
        if (uploader.dispose) {
            await uploader.dispose();
        }
    }

    return result;
}

/**
 * Gets the current hash of every translation, commentary, and dataset in the database, keyed by "{kind}:{id}".
 */
function getItemHashes(db: Database): Map<string, string> {
    const hashes = new Map<string, string>();
    const tables = [
        ['translation', 'Translation'],
        ['commentary', 'Commentary'],
        ['dataset', 'Dataset'],
    ] as const;

    for (let [kind, table] of tables) {
        const rows = db.prepare(`SELECT id, sha256 FROM ${table};`).all() as {
            id: string;
            sha256: string | null;
        }[];
        for (let row of rows) {
            hashes.set(`${kind}:${row.id}`, row.sha256 ?? '');
        }
    }

    return hashes;
}

/**
 * Generates and uploads the files for the given items, and records them as uploaded.
 */
async function uploadItems(
    db: Database,
    prisma: PrismaClient,
    uploader: Uploader,
    destination: string,
    items: SyncItem[],
    currentHashes: Map<string, string>,
    generatorVersion: string,
    generateOptions: GenerateApiOptions & { pretty?: boolean },
    isZip: boolean,
    options: SyncOptions
) {
    const logger = log.getLogger();
    const batchSize = options.batchSize ?? 10;

    const getPaths = db.prepare(
        'SELECT paths FROM SyncUpload WHERE destination = @destination AND itemKind = @itemKind AND itemId = @itemId;'
    );
    const upsertUpload = db.prepare(`INSERT INTO SyncUpload(
        destination,
        itemKind,
        itemId,
        sha256,
        generatorVersion,
        paths,
        mergedJson,
        uploadedAt
    ) VALUES (
        @destination,
        @itemKind,
        @itemId,
        @sha256,
        @generatorVersion,
        @paths,
        @mergedJson,
        @uploadedAt
    ) ON CONFLICT(destination,itemKind,itemId) DO
        UPDATE SET
            sha256=excluded.sha256,
            generatorVersion=excluded.generatorVersion,
            paths=excluded.paths,
            mergedJson=excluded.mergedJson,
            uploadedAt=excluded.uploadedAt;`);
    const getPendingDeletes = db.prepare(
        'SELECT path FROM SyncPendingDelete WHERE destination = @destination AND itemKind = @itemKind AND itemId = @itemId;'
    );
    const deletePendingDelete = db.prepare(
        'DELETE FROM SyncPendingDelete WHERE destination = @destination AND path = @path;'
    );
    const insertPendingDelete = db.prepare(
        'INSERT OR IGNORE INTO SyncPendingDelete(destination, itemKind, itemId, path) VALUES (@destination, @itemKind, @itemId, @path);'
    );

    const recordUpload = db.transaction(
        (item: SyncItem, paths: string[], merged: Record<string, any>) => {
            const key = { destination, itemKind: item.kind, itemId: item.id };
            const newPaths = new Set(paths);

            // Files that the item no longer has need to be deleted from the destination.
            const previous = getPaths.get(key) as { paths: Buffer } | undefined;
            if (previous && !isZip) {
                for (let p of decodePaths(previous.paths)) {
                    if (!newPaths.has(p)) {
                        insertPendingDelete.run({ ...key, path: p });
                    }
                }
            }

            // Files that were waiting to be deleted but have just been uploaded again need to be kept.
            const pending = getPendingDeletes.all(key) as { path: string }[];
            for (let { path: p } of pending) {
                if (newPaths.has(p)) {
                    deletePendingDelete.run({ destination, path: p });
                }
            }

            upsertUpload.run({
                ...key,
                sha256: currentHashes.get(`${item.kind}:${item.id}`) ?? '',
                generatorVersion,
                paths: encodePaths(paths),
                mergedJson: JSON.stringify(merged),
                uploadedAt: new Date().toISOString(),
            });
        }
    );

    const apiOptions: GenerateApiOptions = {
        getEnglishName,
        getNativeName,
        ...generateOptions,
    };

    for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        logger.log(
            `Uploading items ${i + 1}-${i + batch.length} of ${items.length}`
        );

        for (let output of await loadItems(prisma, batch)) {
            const item = getSingleItem(output);
            const api = generateApiForDataset(output, apiOptions);
            const files = generateFilesForApi(api);

            const merged: Record<string, any> = {};
            const serialized: SerializedFile[] = [];
            for (let file of files) {
                if (file.mergable) {
                    merged[file.path] = file.content;
                    continue;
                }
                const s = await serializeFile(file.path, file.content, {
                    pretty: generateOptions.pretty,
                });
                if (s) {
                    serialized.push(s);
                }
            }

            if (options.verbose) {
                logger.log(
                    `Uploading ${serialized.length} files for ${item.kind} ${item.id}`
                );
            }

            await uploadFilesUsingUploader(
                uploader,
                { overwrite: true, verbose: options.verbose },
                toAsyncIterable([serialized])
            );

            recordUpload(
                item,
                serialized.map((f) => f.path),
                merged
            );
        }
    }
}

/**
 * Loads the given items from the database. Each item is returned as its own dataset output.
 */
async function loadItems(
    prisma: PrismaClient,
    items: SyncItem[]
): Promise<DatasetOutput[]> {
    const ids = (kind: SyncItemKind) =>
        items.filter((i) => i.kind === kind).map((i) => i.id);
    const outputs: DatasetOutput[] = [];

    const translationIds = ids('translation');
    if (translationIds.length > 0) {
        for await (let output of database.loadTranslationDatasets(
            prisma,
            translationIds.length,
            translationIds
        )) {
            for (let translation of output.translations) {
                outputs.push({ translations: [translation], commentaries: [] });
            }
        }
    }

    const commentaryIds = ids('commentary');
    if (commentaryIds.length > 0) {
        for await (let output of database.loadCommentaryDatasets(
            prisma,
            commentaryIds.length,
            commentaryIds
        )) {
            for (let commentary of output.commentaries) {
                outputs.push({ translations: [], commentaries: [commentary] });
            }
        }
    }

    const datasetIds = ids('dataset');
    if (datasetIds.length > 0) {
        for await (let output of database.loadDatasetDatasets(
            prisma,
            datasetIds.length,
            datasetIds
        )) {
            for (let dataset of output.datasets ?? []) {
                outputs.push({
                    translations: [],
                    commentaries: [],
                    datasets: [dataset],
                });
            }
        }
    }

    return outputs;
}

/**
 * Merges the mergable files (like available_translations.json) from every item in the destination and uploads them if they changed.
 * Also uploads the OpenAPI document, if enabled.
 * @returns Whether the files were uploaded.
 */
async function uploadMergedFiles(
    db: Database,
    uploader: Uploader,
    destination: string,
    presentKeys: Set<string>,
    config: SyncDestinationConfig,
    force: boolean,
    previousHash: string | null,
    options: SyncOptions
): Promise<boolean> {
    const logger = log.getLogger();
    const { files, sha256: mergedSha256 } = await buildMergedFiles(
        db,
        destination,
        presentKeys,
        config
    );

    if (!force && mergedSha256 === previousHash) {
        logger.log('The merged files are up to date.');
        return false;
    }

    logger.log(`Uploading ${files.length} merged files`);
    await uploadFilesUsingUploader(
        uploader,
        { overwrite: true, verbose: options.verbose },
        toAsyncIterable([files])
    );

    db.prepare(
        `INSERT INTO SyncDestination(destination, mergedSha256, uploadedAt) VALUES (@destination, @mergedSha256, @uploadedAt)
        ON CONFLICT(destination) DO UPDATE SET mergedSha256=excluded.mergedSha256, uploadedAt=excluded.uploadedAt;`
    ).run({
        destination,
        mergedSha256,
        uploadedAt: new Date().toISOString(),
    });

    return true;
}

/**
 * Builds the mergable files (like available_translations.json) from the parts that were recorded for each item in the destination,
 * and the OpenAPI document, if enabled.
 * Items are merged in order of their kind and ID, so the files only change when the items do.
 */
async function buildMergedFiles(
    db: Database,
    destination: string,
    presentKeys: Set<string>,
    config: SyncDestinationConfig
): Promise<{ files: SerializedFile[]; sha256: string }> {
    const rows = db
        .prepare(
            'SELECT itemKind, itemId, mergedJson FROM SyncUpload WHERE destination = ? ORDER BY itemKind ASC, itemId ASC;'
        )
        .all(destination) as {
        itemKind: string;
        itemId: string;
        mergedJson: string;
    }[];

    const contents = new Map<string, any[]>();
    for (let row of rows) {
        if (!presentKeys.has(`${row.itemKind}:${row.itemId}`)) {
            continue;
        }
        const merged = JSON.parse(row.mergedJson) as Record<string, any>;
        for (let [p, content] of Object.entries(merged)) {
            let list = contents.get(p);
            if (!list) {
                list = [];
                contents.set(p, list);
            }
            list.push(content);
        }
    }

    const files: SerializedFile[] = [];
    for (let [p, list] of [...contents.entries()].sort(([a], [b]) =>
        a < b ? -1 : a > b ? 1 : 0
    )) {
        const file = await serializeFile(p, mergeFileContents(list), {
            pretty: config.pretty,
        });
        if (file) {
            files.push(file);
        }
    }

    if (config.generateOpenApiDocument !== false) {
        const file = await serializeFile(
            '/openapi.json',
            createFreeUseBibleApiOpenApiDocument(),
            { pretty: true }
        );
        if (file) {
            files.push(file);
        }
    }

    const hash = createHash('sha256');
    for (let file of files) {
        hash.update(file.path);
        hash.update('\0');
        hash.update(file.content as string);
        hash.update('\0');
    }

    return { files, sha256: hash.digest('hex') };
}

/**
 * Forgets the given items for the destination and queues their files to be deleted.
 */
function markRemovedItems(
    db: Database,
    destination: string,
    items: SyncItem[],
    isZip: boolean
) {
    const getPaths = db.prepare(
        'SELECT paths FROM SyncUpload WHERE destination = @destination AND itemKind = @itemKind AND itemId = @itemId;'
    );
    const deleteUpload = db.prepare(
        'DELETE FROM SyncUpload WHERE destination = @destination AND itemKind = @itemKind AND itemId = @itemId;'
    );
    const insertPendingDelete = db.prepare(
        'INSERT OR IGNORE INTO SyncPendingDelete(destination, itemKind, itemId, path) VALUES (@destination, @itemKind, @itemId, @path);'
    );

    const markAll = db.transaction(() => {
        for (let item of items) {
            const key = { destination, itemKind: item.kind, itemId: item.id };
            const row = getPaths.get(key) as { paths: Buffer } | undefined;
            if (row && !isZip) {
                for (let p of decodePaths(row.paths)) {
                    insertPendingDelete.run({ ...key, path: p });
                }
            }
            deleteUpload.run(key);
        }
    });

    markAll();
}

/**
 * Deletes the files that are queued to be deleted from the destination.
 * @returns The number of files that were deleted.
 */
async function deletePendingFiles(
    db: Database,
    uploader: Uploader,
    destination: string
): Promise<number> {
    const logger = log.getLogger();
    const paths = (
        db
            .prepare(
                'SELECT path FROM SyncPendingDelete WHERE destination = ? ORDER BY path ASC;'
            )
            .all(destination) as { path: string }[]
    ).map((r) => r.path);

    if (paths.length <= 0) {
        return 0;
    }

    if (!uploader.delete) {
        logger.warn(
            `The destination does not support deleting files. ${paths.length} files that are no longer used were left in place.`
        );
        return 0;
    }

    logger.log(`Deleting ${paths.length} files that are no longer used`);
    const deletePending = db.prepare(
        'DELETE FROM SyncPendingDelete WHERE destination = @destination AND path = @path;'
    );
    const forget = db.transaction((chunk: string[]) => {
        for (let p of chunk) {
            deletePending.run({ destination, path: p });
        }
    });

    for (let i = 0; i < paths.length; i += 1000) {
        const chunk = paths.slice(i, i + 1000);
        await uploader.delete(chunk);
        forget(chunk);
    }

    return paths.length;
}

function getSingleItem(output: DatasetOutput): SyncItem {
    if (output.translations.length > 0) {
        return { kind: 'translation', id: output.translations[0].id };
    } else if (output.commentaries.length > 0) {
        return { kind: 'commentary', id: output.commentaries[0].id };
    } else {
        return { kind: 'dataset', id: output.datasets![0].id };
    }
}

function encodePaths(paths: string[]): Buffer {
    return deflateSync(JSON.stringify(paths));
}

function decodePaths(paths: Buffer): string[] {
    return JSON.parse(inflateSync(paths).toString('utf-8'));
}

async function* toAsyncIterable<T>(values: T[]): AsyncGenerator<T> {
    yield* values;
}
