import { readFileSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

// CloudFront Functions are plain scripts with no module system, so load the
// file the way CloudFront does and pull `handler` out of its global scope.
const context: { handler?: (event: unknown) => any } = {};
vm.runInNewContext(
    readFileSync(path.join(__dirname, 'docs-index.js'), 'utf8'),
    context
);
const handler = context.handler!;

const run = (uri: string, querystring: Record<string, unknown> = {}) =>
    handler({ request: { method: 'GET', uri, querystring, headers: {} } });

describe('docs-index', () => {
    it.each([
        ['/docs/', '/docs/index.html'],
        ['/docs/guide/', '/docs/guide/index.html'],
        [
            '/docs/es/reference/translations/',
            '/docs/es/reference/translations/index.html',
        ],
    ])('should serve the index.html for %s', (uri, expected) => {
        expect(run(uri).uri).toBe(expected);
    });

    it.each([
        '/docs/guide/getting-started.html',
        '/docs/assets/app-abc123.js',
        '/docs/404.html',
        '/robots.txt',
        '/api/available_translations.json',
        '/documents/',
    ])('should leave %s alone', (uri) => {
        expect(run(uri).uri).toBe(uri);
    });

    it.each([
        ['/', '/docs/'],
        ['/docs', '/docs/'],
        ['/docs/guide', '/docs/guide/'],
    ])('should redirect %s to %s', (uri, expected) => {
        const response = run(uri);
        expect(response.statusCode).toBe(301);
        expect(response.headers.location.value).toBe(expected);
    });

    it('should keep the query string when redirecting', () => {
        const response = run('/docs/guide', {
            q: { value: 'verse' },
            tag: { value: 'a', multiValue: [{ value: 'a' }, { value: 'b' }] },
            flag: { value: '' },
        });
        expect(response.headers.location.value).toBe(
            '/docs/guide/?q=verse&tag=a&tag=b&flag'
        );
    });
});
