import { serializeFilesForDataset, Uploader } from "./db";
import { getPrismaDbFromDir } from "./db";
import { parseS3Url, S3Uploader } from "./s3";
import { extname } from "path";
import { FilesUploader, ZipUploader } from "./files";
import { Readable } from "node:stream";

export interface UploadApiOptions {
    /**
     * The number of files to upload in each batch.
     */
    batchSize: string;

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
     * Whether to generate API files that use the common name instead of book IDs.
     */
    useCommonName?: boolean;

    /**
     * Whether to generate audio files for the API.
     */
    generateAudioFiles?: boolean;
}

/**
 * Loads and generates the API files and uploads them to the specified destination.
 * @param dest The destination to upload the API files to. Supported destinations are S3, zip files, and local directories.
 * @param options The options to use for the upload.
 */
export async function uploadApiFiles(dest: string, options: UploadApiOptions) {
    const db = getPrismaDbFromDir(process.cwd());
    try {
        const overwrite = !!options.overwrite;
        if (overwrite) {
            console.log('Overwriting existing files');
        }

        const overwriteCommonFiles = !!options.overwriteCommonFiles;
        if (overwriteCommonFiles) {
            console.log('Overwriting only common files');
        }

        let filePattern: RegExp | undefined;
        if (!!options.filePattern) {
            filePattern = new RegExp(options.filePattern, 'g');
            console.log('Using file pattern:', filePattern);
        }

        if (options.translations) {
            console.log('Generating for specific translations:', options.translations);
        } else {
            console.log('Generating for all translations');
        }

        let uploader: Uploader;
        if (dest.startsWith('s3://')) {
            console.log('Uploading to S3');
            // Upload to S3
            const url = dest;
            const s3Url = parseS3Url(url);
            if (!s3Url) {
                throw new Error(`Invalid S3 URL: ${url}`);
            }

            if (!s3Url.bucketName) {
                throw new Error(`Invalid S3 URL: ${url}\nUnable to determine bucket name`);
            }
            
            uploader = new S3Uploader(s3Url.bucketName, s3Url.objectKey, options.profile ?? null);
        } else if (extname(dest) === '.zip') {
            console.log('Writing to zip file:', dest);
            uploader = new ZipUploader(dest);
        } else if (dest) {
            console.log('Writing to local directory:', dest);
            uploader = new FilesUploader(dest);
        } else {
            console.error('Unsupported destination:', dest);
            process.exit(1);
        }

        try {
            let pageSize = parseInt(options.batchSize);

            for await(let files of serializeFilesForDataset(db, {
                useCommonName: !!options.useCommonName,
                generateAudioFiles: !!options.generateAudioFiles
            }, pageSize, options.translations)) {

                const batchSize = uploader.idealBatchSize ?? files.length;
                const totalBatches = Math.ceil(files.length / batchSize);
                console.log('Uploading', files.length, 'total files');
                console.log('Uploading in batches of', batchSize);

                let offset = 0;
                let batchNumber = 1;
                let batch = files.slice(offset, offset + batchSize);

                while (batch.length > 0) {
                    console.log('Uploading batch', batchNumber, 'of', totalBatches);
                    let writtenFiles = 0;
                    const promises = batch.map(async file => {
                        if (filePattern) {
                            if (!filePattern.test(file.path)) {
                                console.log('Skipping file:', file.path);
                                return;
                            }
                        }

                        const isAvailableTranslations = file.path.endsWith('available_translations.json');
                        const isCommonFile = !isAvailableTranslations;
                        if (await uploader.upload(file, overwrite || (overwriteCommonFiles && isCommonFile))) {
                            writtenFiles++;
                        } else {
                            console.warn('File already exists:', file.path);
                            console.warn('Skipping file');
                        }

                        if (file.content instanceof Readable) {
                            file.content.destroy();
                        }
                    });

                    await Promise.all(promises);

                    console.log('Wrote', writtenFiles, 'files');
                    batchNumber++;
                    offset += batchSize;
                    batch = files.slice(offset, offset + batchSize);
                }
            }
        } finally {
            if (uploader && uploader.dispose) {
                await uploader.dispose();
            }
        }
    } finally {
        db.$disconnect();
    }
}