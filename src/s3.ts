import { S3Client, PutObjectCommand, HeadObjectCommand, } from "@aws-sdk/client-s3";
import { fromNodeProviderChain } from "@aws-sdk/credential-providers"; // ES6 import
import { SerializedFile, Uploader } from "./db";

export class S3Uploader implements Uploader {
    private _client: S3Client;

    private _bucketName: string;
    private _bucketRegion: string;
    private _keyPrefix: string;

    constructor(bucketRegion: string, bucketName: string, keyPrefix: string, profile: string | null) {
        this._bucketRegion = bucketRegion;
        this._bucketName = bucketName;
        this._keyPrefix = keyPrefix;
        this._client = new S3Client({
            credentials: fromNodeProviderChain({
                profile: profile ?? undefined,
            })
        });
    }

    async upload(file: SerializedFile, overwrite: boolean): Promise<boolean> {
        const key = this._keyPrefix ? `${this._keyPrefix}/${file.path}` : file.path;

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
        });

        await this._client.send(command);
        return true;
    }
}

export function parseS3Url(url: string) {
    const s3UrlPatterns = [
      
      // Virtual hosted-style
      
      // https://my-bucket.s3.us-west-2.amazonaws.com/puppy.png
      {regex: /^https?:\/\/([a-z0-9.\-]+)\.s3\.([a-z0-9\-]+)\.amazonaws\.com(\.cn)?(\/([^${}]*))?$/, captureGroupIndexes: {bucketName: 0, bucketRegion: 1, objectKey: 4}},
      // https://jbarr-public.s3.amazonaws.com/images/ritchie_and_thompson_pdp11.jpeg
      {regex: /^https?:\/\/([a-z0-9.\-]+)\.s3\.amazonaws\.com(\.cn)?(\/([^${}]*))?$/, captureGroupIndexes: {bucketName: 0, bucketRegion: -1, objectKey: 3}},
      // https://awsmp-fulfillment-cf-templates-prod.s3-external-1.amazonaws.com/key
      {regex: /^https?:\/\/([a-z0-9.\-]+)\.s3-[a-z0-9.\-]+\.amazonaws\.com(\.cn)?(\/([^${}]*))?$/, captureGroupIndexes: {bucketName: 0, bucketRegion: -1, objectKey: 3}},
      
      // Path styles
      
      // https://s3.us-west-2.amazonaws.com/mybucket/puppy.jpg
      {regex: /^https?:\/\/s3\.([a-z0-9\-]+)\.amazonaws\.com(\.cn)?(\/([^${}\/]*)(\/([^${}]*))?)?$/, captureGroupIndexes: {bucketName: 3, bucketRegion: 0, objectKey: 5}},
      // https://s3.amazonaws.com/jsb-public/classic_amazon_door_desk.png
      {regex: /^https?:\/\/s3\.amazonaws\.com(\.cn)?(\/([^${}\/]*)(\/([^${}]*))?)?$/, captureGroupIndexes: {bucketName: 2, bucketRegion: -1, objectKey: 4}},
      // https://s3-us-east-2.amazonaws.com/jsb-public/classic_amazon_door_desk.png
      {regex: /^https?:\/\/s3-([a-z0-9\-]+)\.amazonaws\.com(\.cn)?(\/([^${}\/]*)(\/([^${}]*))?)?$/, captureGroupIndexes: {bucketName: 3, bucketRegion: 0, objectKey: 5}}
    ];
    const offset = 1; // Results of match will include str input at first index followed by each capturing group
    for (const pattern of s3UrlPatterns) {
      const matched = url.match(pattern.regex);
      if (matched) {
        const arr = [...matched];
        const result: { [key: string]: string } = {};
        // Build returned object
        for (const [key, value] of Object.entries(pattern.captureGroupIndexes)) {
          // Set to "" for not explicitly found or if capture group is nested in another capture group not captured
          result[key] = value == -1 || !arr[offset + value] ? "" : arr[offset + value];
        }
        return result as {
            bucketName: string;
            bucketRegion: string;
            objectKey: string;
        };
      }
    }
    return undefined;
};