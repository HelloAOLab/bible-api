import { loadDatasets, serializeDatasets, SerializedFile } from './db.js';
import { defaultProviderForOptions, parseS3Url, S3Uploader } from './s3.js';
import { extname } from 'path';
import { FilesUploader, Uploader, ZipUploader } from './files.js';
import { Readable } from 'node:stream';
import { DatasetOutput } from '@helloao/tools/generation/dataset.js';
import { PrismaClient } from './prisma-gen/index.js';
import { GenerateApiOptions } from '@helloao/tools/generation/api.js';
import { log } from '@helloao/tools';

export interface UploadApiFromDatabaseOptions
    extends UploadApiOptions,
        GenerateApiOptions {
    /**
     * The number of files to upload in each batch.
     */
    batchSize: string | number;
}

export interface UploadApiOptions {
    /**
     * Whether to overwrite existing files.
     */
    overwrite?: boolean;

    /**
     * Whether to only overwrite common files.
     * "Common files" are files that are similar between translations, like the books.json endpoint, or individual chapter endpoints.
     */
    overwriteCommonFiles?: boolean;

    /**
     * Whether to only overwrite merged files.
     * "Merged files" are files that are generated from multiple translations, like the available_translations.json endpoint.
     */
    overwriteMergedFiles?: boolean;

    /**
     * The file pattern regex that should be used to filter the files that are uploaded.
     */
    filePattern?: string;

    /**
     * The translations to generate API files for.
     */
    translations?: string[];

    /**
     * The AWS profile to use for uploading to S3.
     */
    profile?: string;

    /**
     * The AWS access key ID to use for uploading to S3.
     */
    accessKeyId?: string;

    /**
     * The AWS secret access key to use for uploading to S3.
     */
    secretAccessKey?: string;

    /**
     * The AWS region to use for uploading to S3.
     */
    s3Region?: string;

    /**
     * Whether to generate API files that use the common name instead of book IDs.
     */
    useCommonName?: boolean;

    /**
     * Whether to generate audio files for the API.
     */
    generateAudioFiles?: boolean;

    /**
     * Whether to generate pretty-printed JSON files.
     */
    pretty?: boolean;

    /**
     * Whether to output verbose log information.
     */
    verbose?: boolean;
}

/**
 * Loads and generates the API files from the database and uploads them to the specified destination.
 * @param db The database that the datasets should be loaded from.
 * @param dest The destination to upload the API files to. Supported destinations are S3, zip files, and local directories.
 * @param options The options to use for the upload.
 */
export async function uploadApiFilesFromDatabase(
    db: PrismaClient,
    dest: string,
    options: UploadApiFromDatabaseOptions
) {
    const logger = log.getLogger();
    if (options.overwrite) {
        logger.log('Overwriting existing files');
    }

    if (options.overwriteCommonFiles) {
        logger.log('Overwriting only common files');
    }

    if (!!options.filePattern) {
        logger.log('Using file pattern:', options.filePattern);
    }

    if (options.translations) {
        logger.log(
            'Generating for specific translations:',
            options.translations
        );
    } else {
        logger.log('Generating for all translations');
    }

    if (options.pretty) {
        logger.log('Generating pretty-printed JSON files');
    }

    const pageSize =
        typeof options.batchSize === 'number'
            ? options.batchSize
            : parseInt(options.batchSize);
    await serializeAndUploadDatasets(
        dest,
        loadDatasets(db, pageSize, options.translations),
        options
    );
}

/**
 * Generates the API files from the given datasets and uploads them to the specified destination.
 * @param dest The destination to upload the API files to. Supported destinations are S3, zip files, and local directories.
 * @param options The options to use for the upload.
 * @param datasets The datasets to generate the API files from.
 */
export async function serializeAndUploadDatasets(
    dest: string,
    datasets: AsyncIterable<DatasetOutput>,
    options: UploadApiOptions & GenerateApiOptions = {}
): Promise<void> {
    const logger = log.getLogger();
    const overwrite = !!options.overwrite;
    if (overwrite) {
        logger.log('Overwriting existing files');
    }

    const overwriteCommonFiles = !!options.overwriteCommonFiles;
    if (overwriteCommonFiles) {
        logger.log('Overwriting only common files');
    }

    const overwriteMergedFiles = !!options.overwriteMergedFiles;
    if (overwriteMergedFiles) {
        logger.log('Overwriting only merged files');
    }

    let filePattern: RegExp | undefined;
    if (!!options.filePattern) {
        filePattern = new RegExp(options.filePattern, 'g');
        logger.log('Using file pattern:', filePattern);
    }

    if (options.translations) {
        logger.log(
            'Generating for specific translations:',
            options.translations
        );
    } else {
        logger.log('Generating for all translations');
    }

    if (options.pretty) {
        logger.log('Generating pretty-printed JSON files');
    }

    const files = serializeDatasets(datasets, {
        ...options,
    });

    await uploadFiles(dest, options, files);
}

/**
 * Uploads the given serialized files to the specified destination.
 * @param dest The destination to upload the API files to. Supported destinations are S3, zip files, and local directories.
 * @param options The options to use for the upload.
 * @param datasets The datasets to generate the API files from.
 */
export async function uploadFiles(
    dest: string,
    options: UploadApiOptions,
    serializedFiles: AsyncIterable<SerializedFile[]>
): Promise<void> {
    const logger = log.getLogger();
    let uploader: Uploader;
    if (dest.startsWith('s3://')) {
        logger.log('Uploading to S3');
        // Upload to S3
        const url = dest;
        const s3Url = parseS3Url(url);
        if (!s3Url) {
            throw new Error(`Invalid S3 URL: ${url}`);
        }

        if (!s3Url.bucketName) {
            throw new Error(
                `Invalid S3 URL: ${url}\nUnable to determine bucket name`
            );
        }

        uploader = new S3Uploader(
            s3Url.bucketName,
            s3Url.objectKey,
            defaultProviderForOptions(options),
            options.s3Region
        );
    } else if (dest.startsWith('console://')) {
        logger.log('Uploading to console');
        uploader = {
            idealBatchSize: 50,
            async upload(
                file: SerializedFile,
                _overwrite: boolean
            ): Promise<boolean> {
                logger.log(file.path);
                logger.log(file.content);
                return true;
            },
        };
    } else if (extname(dest) === '.zip') {
        logger.log('Writing to zip file:', dest);
        uploader = new ZipUploader(dest);
    } else if (dest) {
        logger.log('Writing to local directory:', dest);
        uploader = new FilesUploader(dest);
    } else {
        logger.error('Unsupported destination:', dest);
        process.exit(1);
    }

    try {
        await uploadFilesUsingUploader(uploader, options, serializedFiles);
    } catch (err) {
        logger.error('Error uploading files:', err);
        throw err;
    } finally {
        if (uploader && uploader.dispose) {
            await uploader.dispose();
        }
    }
}

/**
 * Uploads the given serialized files using the given uploader.
 * @param uploader The uploader to use.
 * @param options The options to use for the upload.
 * @param datasets The datasets to generate the API files from.
 */
export async function uploadFilesUsingUploader(
    uploader: Uploader,
    options: UploadApiOptions,
    serializedFiles: AsyncIterable<SerializedFile[]>
): Promise<void> {
    const logger = log.getLogger();
    const overwrite = !!options.overwrite;
    const overwriteCommonFiles = !!options.overwriteCommonFiles;
    const overwriteMergedFiles = !!options.overwriteMergedFiles;

    let filePattern: RegExp | undefined;
    if (!!options.filePattern) {
        filePattern = new RegExp(options.filePattern, 'g');
    }

    for await (let files of serializedFiles) {
        const batchSize = uploader.idealBatchSize ?? files.length;
        const totalBatches = Math.ceil(files.length / batchSize);
        logger.log('Uploading', files.length, 'total files');
        logger.log('Uploading in batches of', batchSize);

        let offset = 0;
        let batchNumber = 1;
        let batch = files.slice(offset, offset + batchSize);

        while (batch.length > 0) {
            logger.log('Uploading batch', batchNumber, 'of', totalBatches);
            let writtenFiles = 0;
            const promises = batch.map(async (file) => {
                if (filePattern) {
                    if (!filePattern.test(file.path)) {
                        logger.log('Skipping file:', file.path);
                        return;
                    }
                }

                const isAvailableTranslations = file.path.endsWith(
                    'available_translations.json'
                );
                const isAvailableCommentaries = file.path.endsWith(
                    'available_commentaries.json'
                );
                // "Common" files are files that are similar between translations, like the books.json endpoint, or individual chapter endpoints.
                const isCommonFile =
                    !isAvailableTranslations && !isAvailableCommentaries;
                const isMergedFile =
                    isAvailableCommentaries || isAvailableTranslations;
                if (
                    await uploader.upload(
                        file,
                        overwrite ||
                            (overwriteCommonFiles && isCommonFile) ||
                            (isMergedFile && overwriteMergedFiles)
                    )
                ) {
                    if (options.verbose) {
                        logger.log('Uploaded file:', file.path);
                    }
                    writtenFiles++;
                } else if (options.verbose) {
                    logger.warn('File already exists:', file.path);
                    logger.warn('Skipping file');
                }

                if (file.content instanceof Readable) {
                    file.content.destroy();
                }
            });

            await Promise.all(promises);

            logger.log('Wrote', writtenFiles, 'files');
            logger.log('Skipped', batch.length - writtenFiles, 'files');
            batchNumber++;
            offset += batchSize;
            batch = files.slice(offset, offset + batchSize);
        }
    }
}
