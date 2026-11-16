import { Database } from 'better-sqlite3';
import { log } from '@helloao/tools';
import { PrismaClient } from './prisma-gen/client.js';
import {
    createTypesenseClient,
    deleteTypesenseTranslationVerses,
    ensureTypesenseVerseCollection,
    uploadTypesenseTranslationVerses,
} from './actions.js';
import { DestinationSyncResult, getItemHashes } from './sync-upload.js';
import type { SyncItem, SyncOptions } from './sync.js';
import { createIdFilter } from './sync.js';

/**
 * The version of the code that uploads verses to Typesense.
 * Increment it when that code (or the collection schema) changes, so that every translation is re-uploaded by the next sync.
 */
export const TYPESENSE_UPLOAD_VERSION = 1;

/**
 * The configuration for a Typesense destination in the sync config.
 * The verses of each translation are uploaded to the `bibleVerses.{language}` collection, the same way the upload-typesense-verses command does.
 */
export interface SyncTypesenseDestinationConfig {
    type: 'typesense';

    /**
     * The URL of the Typesense node (like "https://search.example.com").
     * It also identifies the destination, so it is what --destination matches.
     */
    url: string;

    /**
     * The URLs of additional Typesense nodes in the same cluster.
     */
    nodes?: string[];

    /**
     * The Typesense API key. Defaults to the TYPESENSE_API_KEY environment variable.
     * Prefer the environment variable, so the key isn't stored in the config file.
     */
    apiKey?: string;

    /**
     * The IDs of the translations that should be uploaded. Supports * and ? wildcards and ignores case.
     * Defaults to every translation in the sync.
     */
    translations?: string[];
}

/**
 * The result of syncing a Typesense destination.
 */
export interface TypesenseDestinationSyncResult extends DestinationSyncResult {
    /**
     * The translations that were not uploaded because Typesense can't index their language.
     */
    skipped: SyncItem[];
}

interface UploadState {
    itemId: string;
    sha256: string;
    generatorVersion: string;
    mergedJson: string;
}

/**
 * The state that is recorded for each translation that was uploaded to a Typesense destination.
 * It is stored in the mergedJson column of the SyncUpload table.
 */
interface TypesenseUploadState {
    /**
     * The collection that the verses were uploaded to, or null if the translation was skipped.
     */
    collection: string | null;
}

/**
 * Gets the key that the uploads to the given Typesense destination are recorded under in the SyncUpload table.
 * @param destination The destination.
 */
export function getTypesenseDestinationKey(
    destination: Pick<SyncTypesenseDestinationConfig, 'url'>
): string {
    return `typesense:${destination.url}`;
}

/**
 * Uploads the verses of the given translations to the given Typesense destination.
 * Only the translations that changed since they were last uploaded are uploaded,
 * and the verses of translations that are no longer in the list (or no longer match the destination's translations) are deleted.
 * @param db The database.
 * @param prisma The Prisma client for the database. Used to load the verses.
 * @param destination The destination.
 * @param items The items that are in the sync. Only translations are uploaded.
 * @param options The options for the sync.
 */
export async function syncTypesenseDestination(
    db: Database,
    prisma: PrismaClient,
    destination: SyncTypesenseDestinationConfig,
    items: SyncItem[],
    options: SyncOptions = {}
): Promise<TypesenseDestinationSyncResult> {
    const logger = log.getLogger();
    const url = destination.url;
    const key = getTypesenseDestinationKey(destination);
    const generatorVersion = String(TYPESENSE_UPLOAD_VERSION);

    const result: TypesenseDestinationSyncResult = {
        destination: url,
        uploaded: [],
        removed: [],
        skipped: [],
        deletedFiles: 0,
        uploadedMergedFiles: false,
        errors: [],
    };

    logger.log(`Syncing Typesense destination ${url}`);

    const currentHashes = getItemHashes(db);
    const filter = createIdFilter(destination.translations ?? []);
    const translations = items.filter(
        (item) => item.kind === 'translation' && filter(item.id)
    );

    const present: SyncItem[] = [];
    for (let item of translations) {
        if (currentHashes.has(`translation:${item.id}`)) {
            present.push(item);
        } else {
            logger.warn(
                `The translation ${item.id} is not in the database. Skipping it.`
            );
        }
    }

    for (let id of destination.translations ?? []) {
        if (
            !/[*?]/.test(id) &&
            !translations.some((t) => t.id.toLowerCase() === id.toLowerCase())
        ) {
            logger.warn(
                `The translation ${id} is not provided by any source in the sync config, so it can't be uploaded to ${url}.`
            );
        }
    }

    const presentIds = new Set(present.map((i) => i.id));
    const states = new Map(
        (
            db
                .prepare(
                    "SELECT itemId, sha256, generatorVersion, mergedJson FROM SyncUpload WHERE destination = ? AND itemKind = 'translation';"
                )
                .all(key) as UploadState[]
        ).map((s) => [s.itemId, s])
    );

    const toUpload = present.filter((item) => {
        const state = states.get(item.id);
        return (
            options.reuploadAll ||
            !state ||
            state.sha256 !== currentHashes.get(`translation:${item.id}`) ||
            state.generatorVersion !== generatorVersion
        );
    });
    const toRemove: SyncItem[] = [...states.keys()]
        .filter((id) => !presentIds.has(id))
        .map((id) => ({ kind: 'translation', id }));

    result.uploaded = toUpload;
    result.removed = toRemove;
    logger.log(
        `Translations: ${toUpload.length} to upload, ${toRemove.length} to remove, ${present.length - toUpload.length} unchanged.`
    );
    if (options.verbose || options.dryRun) {
        for (let item of toUpload) {
            logger.log(`  upload translation ${item.id}`);
        }
        for (let item of toRemove) {
            logger.log(`  remove translation ${item.id}`);
        }
    }

    if (options.dryRun || (toUpload.length <= 0 && toRemove.length <= 0)) {
        if (!options.dryRun) {
            logger.log('The destination is up to date.');
        }
        return result;
    }

    const apiKey = destination.apiKey ?? process.env.TYPESENSE_API_KEY;
    if (!apiKey) {
        const message = `Failed to sync ${url}: No Typesense API key. Set apiKey in the destination or the TYPESENSE_API_KEY environment variable.`;
        logger.error(message);
        result.errors.push(message);
        result.uploaded = [];
        result.removed = [];
        return result;
    }

    const client = createTypesenseClient(
        [url, ...(destination.nodes ?? [])],
        apiKey
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
        'translation',
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
    const deleteUpload = db.prepare(
        "DELETE FROM SyncUpload WHERE destination = @destination AND itemKind = 'translation' AND itemId = @itemId;"
    );
    const getCollection = (id: string) => {
        const state = states.get(id);
        return state
            ? (JSON.parse(state.mergedJson) as TypesenseUploadState).collection
            : null;
    };

    const failed = new Set<string>();

    for (let item of toRemove) {
        try {
            const collection = getCollection(item.id);
            if (collection) {
                logger.log(
                    `Deleting the verses of ${item.id} from ${collection}`
                );
                await deleteTypesenseTranslationVerses(
                    client,
                    item.id,
                    collection
                );
            }
            deleteUpload.run({ destination: key, itemId: item.id });
        } catch (err) {
            failed.add(`remove:${item.id}`);
            const message = `Failed to remove the translation ${item.id} from ${url}: ${(err as Error)?.message ?? err}`;
            logger.error(message);
            result.errors.push(message);
        }
    }

    const languages = new Map(
        (
            await prisma.translation.findMany({
                where: { id: { in: toUpload.map((i) => i.id) } },
                select: { id: true, language: true },
            })
        ).map((t) => [t.id, t.language])
    );
    const collections = new Map<string, string | null>();

    for (let i = 0; i < toUpload.length; i++) {
        const item = toUpload[i];
        const language = languages.get(item.id)!;
        try {
            let collection = collections.get(language);
            if (collection === undefined) {
                collection = await ensureTypesenseVerseCollection(
                    client,
                    language
                );
                collections.set(language, collection);
            }

            logger.log(
                `Uploading translation ${i + 1} of ${toUpload.length}: ${item.id}`
            );

            // Delete the verses that were uploaded before, so that verses that were removed from the translation
            // (or a translation whose language changed) don't stay in the index.
            const previousCollection = getCollection(item.id);
            if (previousCollection) {
                await deleteTypesenseTranslationVerses(
                    client,
                    item.id,
                    previousCollection
                );
            }

            if (collection) {
                await uploadTypesenseTranslationVerses(
                    client,
                    prisma,
                    { id: item.id, language },
                    collection
                );
            } else {
                result.skipped.push(item);
            }

            const state: TypesenseUploadState = { collection };
            upsertUpload.run({
                destination: key,
                itemId: item.id,
                sha256: currentHashes.get(`translation:${item.id}`) ?? '',
                generatorVersion,
                paths: Buffer.alloc(0),
                mergedJson: JSON.stringify(state),
                uploadedAt: new Date().toISOString(),
            });
        } catch (err) {
            failed.add(`upload:${item.id}`);
            const message = `Failed to upload the translation ${item.id} to ${url}: ${(err as Error)?.message ?? err}`;
            logger.error(message);
            result.errors.push(message);
        }
    }

    result.uploaded = toUpload.filter(
        (item) =>
            !failed.has(`upload:${item.id}`) &&
            !result.skipped.some((s) => s.id === item.id)
    );
    result.removed = toRemove.filter(
        (item) => !failed.has(`remove:${item.id}`)
    );

    if (result.skipped.length > 0) {
        logger.warn(
            `Skipped ${result.skipped.length} translations because Typesense can't index their language: ${result.skipped.map((i) => i.id).join(', ')}`
        );
    }

    return result;
}
