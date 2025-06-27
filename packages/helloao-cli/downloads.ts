import { log } from '@helloao/tools';
import { BlobWriter, Entry, ZipReader } from '@zip.js/zip.js';
import { createWriteStream } from 'fs-extra';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import { Readable } from 'node:stream';
import { finished } from 'node:stream/promises';
import { exists } from 'fs-extra';
import { writeFile } from 'node:fs/promises';

export async function downloadFile(
    url: string,
    path: string,
    onProgress?: (progress: number) => void
) {
    const logger = log.getLogger();
    logger.log('Downloading', url, 'to', path);
    const response = await fetch(url);
    await downloadResponse(response, path, onProgress);
}

export async function downloadResponse(
    response: Response,
    path: string,
    onProgress?: (progress: number) => void
) {
    const totalSize = Number(response.headers.get('content-length'));
    const reader = response.body!;
    const writeStream = createWriteStream(path);
    const readable = Readable.fromWeb(reader as any);
    if (onProgress) {
        let downloadedSize = 0;
        readable.on('data', (chunk) => {
            downloadedSize += chunk.length;
            onProgress(downloadedSize / totalSize);
        });
    }
    await finished(readable.pipe(writeStream));
}

/**
 * Unzips a ZipReader to a specified directory.
 * @param zip The ZipReader instance to read from.
 * @param directory The directory to unzip files into.
 * @param overwrite Wether to overwrite existing files.
 * @param entryFilter A filter function to determine which entries to unzip.
 * @param closeWhenDone Whether to close the ZipReader when done.
 * @returns The number of files that matched the entry filter.
 */
export async function unzipToDirectory(
    zip: ZipReader<unknown>,
    directory: string,
    overwrite: boolean,
    entryFilter: (entry: Entry) => boolean = () => true,
    closeWhenDone: boolean = true
): Promise<number> {
    try {
        const logger = log.getLogger();
        const entries = await zip.getEntries();
        let usfmFileCount = 0;

        for (let entry of entries) {
            if (
                entry.getData &&
                entry.directory === false &&
                entryFilter(entry)
            ) {
                usfmFileCount++;
                const outputPath = path.resolve(directory, entry.filename);

                if (!overwrite && (await exists(outputPath))) {
                    logger.log(
                        `File already exists, skipping: ${entry.filename}`
                    );
                    continue;
                } else if (overwrite && (await exists(outputPath))) {
                    logger.log(`Overwriting existing file: ${entry.filename}`);
                }

                const blob = await entry.getData(
                    new BlobWriter('text/plain'),
                    {}
                );
                await writeFile(
                    outputPath,
                    new Uint8Array(await blob.arrayBuffer())
                );
            }
        }

        return usfmFileCount;
    } finally {
        if (closeWhenDone) {
            await zip.close();
        }
    }
}
