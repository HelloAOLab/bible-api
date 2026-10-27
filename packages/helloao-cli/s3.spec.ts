import { DeleteObjectsCommand } from '@aws-sdk/client-s3';
import { getHttpUrl, parseS3Url, S3Uploader } from './s3';

describe('parseS3Url()', () => {
    const cases = [
        ['s3://bucket', { bucketName: 'bucket', objectKey: '' }] as const,
        [
            's3://bucket/value',
            { bucketName: 'bucket', objectKey: 'value' },
        ] as const,
        [
            's3://bucket/value/deep/path',
            { bucketName: 'bucket', objectKey: 'value/deep/path' },
        ] as const,
        ['wrong', undefined] as const,
    ];

    it.each(cases)('should parse %s', (url, expected) => {
        expect(parseS3Url(url)).toEqual(expected);
    });
});

describe('getHttpUrl()', () => {
    const cases = [
        ['s3://bucket', 'https://bucket.s3.amazonaws.com'] as const,
        ['s3://bucket/value', 'https://bucket.s3.amazonaws.com/value'] as const,
        [
            's3://bucket/value/deep/path',
            'https://bucket.s3.amazonaws.com/value/deep/path',
        ] as const,
        ['wrong', undefined] as const,
    ];

    it.each(cases)('should parse %s', (url, expected) => {
        expect(getHttpUrl(url)).toEqual(expected);
    });
});

describe('S3Uploader', () => {
    describe('delete()', () => {
        function createUploader(keyPrefix: string) {
            const uploader = new S3Uploader(
                'bucket',
                keyPrefix,
                { accessKeyId: 'id', secretAccessKey: 'secret' },
                'us-east-1'
            );
            const send = jest.fn(async (_command: any) => ({}));
            (uploader as any)._client = { send };
            return { uploader, send };
        }

        it('should delete the objects in batches of 1000 with the key prefix', async () => {
            const { uploader, send } = createUploader('prefix');
            const paths = Array.from(
                { length: 1500 },
                (_, i) => `/api/BSB/GEN/${i}.json`
            );

            await uploader.delete(paths);

            expect(send).toHaveBeenCalledTimes(2);
            const [first, second] = send.mock.calls.map(
                ([command]) => command as DeleteObjectsCommand
            );
            expect(first.input.Bucket).toBe('bucket');
            expect(first.input.Delete!.Objects).toHaveLength(1000);
            expect(first.input.Delete!.Objects![0]).toEqual({
                Key: 'prefix/api/BSB/GEN/0.json',
            });
            expect(second.input.Delete!.Objects).toHaveLength(500);
        });

        it('should throw if any object could not be deleted', async () => {
            const { uploader, send } = createUploader('');
            send.mockResolvedValueOnce({
                Errors: [
                    {
                        Key: 'api/BSB/GEN/1.json',
                        Code: 'AccessDenied',
                        Message: 'Access Denied',
                    },
                ],
            } as any);

            await expect(
                uploader.delete(['/api/BSB/GEN/1.json'])
            ).rejects.toThrow(/api\/BSB\/GEN\/1.json: AccessDenied/);
        });
    });
});
