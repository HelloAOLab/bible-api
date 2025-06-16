import { log } from '@helloao/tools';
import { createWriteStream } from 'fs-extra';
import { createReadStream } from 'node:fs';
import { Readable } from 'node:stream';
import { finished } from 'node:stream/promises';

export async function downloadFile(
    url: string,
    path: string,
    onProgress?: (progress: number) => void
) {
    const logger = log.getLogger();
    logger.log('Downloading', url, 'to', path);
    const response = await fetch(url);
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
