import { createWriteStream } from "fs-extra";
import { Readable } from "node:stream";
import { finished } from "node:stream/promises";

export async function downloadFile(url: string, path: string) {
    console.log('Downloading', url, 'to', path);
    const reader = await fetch(url).then(r => r.body!);
    const writeStream = createWriteStream(path);
    await finished(Readable.fromWeb(reader as any).pipe(writeStream))
}