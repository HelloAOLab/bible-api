import {
    S3Client,
    PutObjectCommand,
    HeadObjectCommand,
    NotFound,
} from '@aws-sdk/client-s3';
import { fromNodeProviderChain } from '@aws-sdk/credential-providers'; // ES6 import
import { SerializedFile, Uploader } from './files.js';
import { AwsCredentialIdentity, Provider } from '@smithy/types';
import { input, password } from '@inquirer/prompts';
import { log } from '@helloao/tools';

export class S3Uploader implements Uploader {
    private _client: S3Client;

    private _bucketName: string;
    private _keyPrefix: string;

    get idealBatchSize() {
        return 75;
    }

    constructor(
        bucketName: string,
        keyPrefix: string,
        profile:
            | string
            | null
            | AwsCredentialIdentity
            | Provider<AwsCredentialIdentity>,
        region?: string
    ) {
        this._bucketName = bucketName;
        this._keyPrefix = keyPrefix;
        this._client = new S3Client({
            region: region,
            credentials:
                !profile || typeof profile === 'string'
                    ? fromNodeProviderChain({ profile: profile ?? undefined })
                    : profile,
        });

        if ((!process.env.AWS_REGION || !process.env.AWS_PROFILE) && !region) {
            const logger = log.getLogger();
            logger.warn(
                'No AWS_REGION or AWS_PROFILE environment variable set. This may cause issues with the S3 client.'
            );
        }
    }

    async upload(file: SerializedFile, overwrite: boolean): Promise<boolean> {
        const logger = log.getLogger();
        const path = file.path.startsWith('/')
            ? file.path.substring(1)
            : file.path;
        const key = this._keyPrefix ? `${this._keyPrefix}/${path}` : path;

        const hash = file.sha256?.();
        const head = new HeadObjectCommand({
            Bucket: this._bucketName,
            Key: key,
            ChecksumMode: 'ENABLED',
        });

        if (hash || !overwrite) {
            try {
                const existingFile = await this._client.send(head);
                let matches = true;
                if (hash && existingFile.ChecksumSHA256) {
                    if (
                        hash.localeCompare(
                            existingFile?.ChecksumSHA256 ?? '',
                            undefined,
                            {
                                sensitivity: 'base',
                            }
                        ) === 0
                    ) {
                        // File is already uploaded and matches the checksum.
                        return false;
                    } else {
                        // File is already uploaded but the checksums don't match.
                        matches = false;
                    }
                } else {
                    // File is already uploaded but the checksum is not available.
                    logger.log(`[s3] Checksum not available: ${key}`);

                    // Assume the file has changed and needs to be uploaded again.
                    matches = false;
                }

                if (matches && !overwrite) {
                    return false;
                }
            } catch (err: any) {
                if (err instanceof NotFound) {
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
            ContentType: 'application/json',
            ChecksumSHA256: hash,
            ChecksumAlgorithm: 'SHA256',
        });

        await this._client.send(command);
        return true;
    }
}

/**
 * Parses the given S3 URL into its bucket name and object key.
 * @param url The URL to parse.
 */
export function parseS3Url(url: string) {
    const regex = /^s3:\/\/([a-z0-9.\-]+)(\/[^${}]*)?$/;
    const matched = url.match(regex);
    if (matched) {
        const arr = [...matched];
        let key = arr[2] ?? '';
        if (key.startsWith('/')) {
            key = key.substring(1);
        }
        return {
            bucketName: arr[1],
            objectKey: key,
        };
    }
    return undefined;
}

/**
 * Gets the HTTP URL for the given S3 URL.
 * @param s3Url The S3 URL to convert.
 */
export function getHttpUrl(s3Url: string) {
    const parsed = parseS3Url(s3Url);
    if (!parsed) {
        return undefined;
    }
    const { bucketName, objectKey } = parsed;
    if (objectKey) {
        return `https://${bucketName}.s3.amazonaws.com/${objectKey}`;
    } else {
        return `https://${bucketName}.s3.amazonaws.com`;
    }
}

/**
 * A provider that gets the credentials directly from the user input.
 */
export const askForAccessKeyProvider: Provider<
    AwsCredentialIdentity
> = async () => {
    const accessKeyId = await input({
        message: 'Enter your AWS Access Key ID',
    });
    const secretAccessKey = await password({
        message: 'Enter your AWS Secret Access Key',
    });

    return {
        accessKeyId,
        secretAccessKey,
    };
};

/**
 * Defines a provider that tries to get the credentials from the given list of providers.
 * @param providers The providers to try.
 */
export function providerChain(
    ...providers: Provider<AwsCredentialIdentity>[]
): Provider<AwsCredentialIdentity> {
    return async () => {
        for (const provider of providers) {
            const creds = await provider();
            if (creds?.accessKeyId && creds?.secretAccessKey) {
                return creds;
            }
        }

        return {
            accessKeyId: '',
            secretAccessKey: '',
        };
    };
}

/**
 * Gets the default provider for the given options.
 *
 * Defaults first to using the provided access key and secret access key, then to using the given profile, then finally to asking the user for the access key.
 * @param options
 */
export function defaultProviderForOptions(options: {
    accessKeyId?: string;
    secretAccessKey?: string;
    profile?: string;
}): Provider<AwsCredentialIdentity> | AwsCredentialIdentity {
    if (options.accessKeyId && options.secretAccessKey) {
        return {
            accessKeyId: options.accessKeyId,
            secretAccessKey: options.secretAccessKey,
        };
    }

    return providerChain(
        fromNodeProviderChain({ profile: options.profile }),
        askForAccessKeyProvider
    );
}
