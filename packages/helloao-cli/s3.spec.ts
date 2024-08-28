import { getHttpUrl, parseS3Url } from './s3';

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
