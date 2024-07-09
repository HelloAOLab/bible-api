import { S3Client, PutObjectCommand, HeadObjectCommand, NotFound, } from "@aws-sdk/client-s3";
import { fromNodeProviderChain } from "@aws-sdk/credential-providers"; // ES6 import
import { SerializedFile, Uploader } from "./db";

export class S3Uploader implements Uploader {
    private _client: S3Client;

    private _bucketName: string;
    private _keyPrefix: string;

    get idealBatchSize() {
        return 50;
    }

    constructor(bucketName: string, keyPrefix: string, profile: string | null) {
        this._bucketName = bucketName;
        this._keyPrefix = keyPrefix;
        this._client = new S3Client({
            credentials: fromNodeProviderChain({
                profile: profile ?? undefined,
            })
        });
    }

    async upload(file: SerializedFile, overwrite: boolean): Promise<boolean> {
        const path = file.path.startsWith('/') ? file.path.substring(1) : file.path;
        const key = this._keyPrefix ? `${this._keyPrefix}/${path}` : path;

        if (!overwrite) {
            const head =new HeadObjectCommand({
                Bucket: this._bucketName,
                Key: key
            });

            try {
                await this._client.send(head);
                return false;
            } catch(err: any) {
                if (err.name !== 'NotFound') {
                    // not found, so we can try to write the file.
                } else {
                    throw err;
                }
            }
        }

        const command = new PutObjectCommand({
            Bucket: this._bucketName,
            Key: key,
            Body: file.content,
            ContentType: 'application/json'
        });

        await this._client.send(command);
        return true;
    }
}

export function parseS3Url(url: string) {
    const regex = /^s3:\/\/([a-z0-9.\-]+)(\/[^${}]*)?$/;
    const matched = url.match(regex);
    if (matched) {
        const arr = [...matched];
        return {
            bucketName: arr[1],
            objectKey: arr[2] ?? "",
        };
    }
    return undefined;
};