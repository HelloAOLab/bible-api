import {
    mkdtemp,
    mkdir,
    readdir,
    readFile,
    rm,
    writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import {
    createEBibleCoverage,
    createFetchBibleMetadata,
    createFetchBibleSource,
    downloadFetchBibleTranslation,
    FETCH_BIBLE_MARKER_FILE,
    fetchBibleLicense,
    fetchFetchBibleCatalog,
    fetchFetchBibleCollectionRevision,
    FetchBibleCatalogEntry,
    FetchBibleCollectionMeta,
    FetchBibleManifestItem,
    getFetchBibleBooks,
    getFetchBibleBookUrl,
    hasFetchBibleSourceChanged,
    isCoveredByEBible,
    isFetchBibleSourceIgnored,
    isFetchBibleTranslationDir,
    loadDownloadedEBibleCoverage,
    mapConcurrent,
    matchesFetchBibleTranslation,
} from './fetch-bible';

// prettier-ignore
const BOOKS_ORDERED = [
    'gen', 'exo', 'lev', 'num', 'deu', 'jos', 'jdg', 'rut', '1sa', '2sa',
    '1ki', '2ki', '1ch', '2ch', 'ezr', 'neh', 'est', 'job', 'psa', 'pro',
    'ecc', 'sng', 'isa', 'jer', 'lam', 'ezk', 'dan', 'hos', 'jol', 'amo',
    'oba', 'jon', 'mic', 'nam', 'hab', 'zep', 'hag', 'zec', 'mal', 'mat',
    'mrk', 'luk', 'jhn', 'act', 'rom', '1co', '2co', 'gal', 'eph', 'php',
    'col', '1th', '2th', '1ti', '2ti', 'tit', 'phm', 'heb', 'jas', '1pe',
    '2pe', '1jn', '2jn', '3jn', 'jud', 'rev',
];

function manifestItem(
    overrides: Partial<FetchBibleManifestItem> = {}
): FetchBibleManifestItem {
    return {
        name: {
            local: 'Gotna Kudi',
            local_abbrev: '',
            english: 'Ambulas Maprik New Testament',
            english_abbrev: 'MAP',
        },
        year: 1983,
        books_ot: [],
        books_nt: ['mat', 'mrk'],
        direction: 'ltr',
        copyright: {
            licenses: [
                {
                    license: 'cc-by-nc-nd',
                    url: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
                },
            ],
            attribution: 'Copyright © 1983 Wycliffe Bible Translators, Inc.',
            attribution_url:
                'https://ebible.org/Scriptures/details.php?id=abt-maprik',
        },
        tags: [],
        ...overrides,
    };
}

function collectionMeta(
    overrides: Partial<FetchBibleCollectionMeta> = {}
): FetchBibleCollectionMeta {
    const item = manifestItem();
    return {
        name: item.name,
        year: item.year,
        direction: item.direction,
        copyright: item.copyright,
        ids: { ebible: 'abt-maprik' },
        source: {
            service: 'ebible',
            format: 'usfm',
            url: 'https://ebible.org/Scriptures/abt-maprik_usfm.zip',
            updated: '2013-01-04',
            revision: 0,
        },
        tags: [],
        ...overrides,
    };
}

function catalogEntry(
    id: string,
    item: FetchBibleManifestItem,
    meta: FetchBibleCollectionMeta,
    git: { commitSha?: string; treeSha?: string } = {}
): FetchBibleCatalogEntry {
    return {
        source: createFetchBibleSource(
            id,
            item,
            meta,
            JSON.stringify(meta),
            git
        ),
        item,
        meta,
        books: getFetchBibleBooks(item, BOOKS_ORDERED),
        collectionUrl: 'https://collection.test',
    };
}

function jsonResponse(body: any, status: number = 200): Response {
    return new Response(JSON.stringify(body), { status });
}

function textResponse(body: string, status: number = 200): Response {
    return new Response(body, { status });
}

describe('getFetchBibleBooks()', () => {
    it('should expand whole testaments', () => {
        const books = getFetchBibleBooks(
            { books_ot: true, books_nt: true },
            BOOKS_ORDERED
        );
        expect(books).toEqual(BOOKS_ORDERED);
    });

    it('should use the listed books', () => {
        expect(
            getFetchBibleBooks(
                { books_ot: ['gen', 'exo'], books_nt: true },
                BOOKS_ORDERED
            )
        ).toEqual(['gen', 'exo', ...BOOKS_ORDERED.slice(39)]);
        expect(
            getFetchBibleBooks(
                { books_ot: [], books_nt: ['MAT'] },
                BOOKS_ORDERED
            )
        ).toEqual(['mat']);
    });
});

describe('getFetchBibleBookUrl()', () => {
    it('should point to the book file in the collection', () => {
        expect(
            getFetchBibleBookUrl(
                'https://example.com/collection/',
                'abt_map',
                'usfm',
                'MAT'
            )
        ).toBe('https://example.com/collection/bibles/abt_map/usfm/mat.usfm');
    });
});

describe('createFetchBibleSource()', () => {
    it('should create a source from the manifest and meta', () => {
        const meta = collectionMeta();
        const source = createFetchBibleSource(
            'abt_map',
            manifestItem(),
            meta,
            JSON.stringify(meta)
        );

        expect(source).toMatchObject({
            id: 'abt_map',
            translationId: 'abt_map',
            languageCode: 'abt',
            name: 'Gotna Kudi',
            englishName: 'Ambulas Maprik New Testament',
            abbreviation: 'MAP',
            textDirection: 'ltr',
            year: 1983,
            ebibleId: 'abt-maprik',
            gitCommitSha: null,
            gitTreeSha: null,
            sourceService: 'ebible',
            sourceFormat: 'usfm',
            sourceUpdated: '2013-01-04',
            sourceRevision: 0,
            downloadDate: null,
            downloadPath: null,
        });
        expect(source.sha256).toMatch(/^[0-9a-f]{64}$/);
    });

    it('should record the git revision', () => {
        const meta = collectionMeta();
        const source = createFetchBibleSource(
            'abt_map',
            manifestItem(),
            meta,
            JSON.stringify(meta),
            { commitSha: 'commit1', treeSha: 'tree1' }
        );
        expect(source.gitCommitSha).toBe('commit1');
        expect(source.gitTreeSha).toBe('tree1');
    });

    it('should map known translation IDs', () => {
        const meta = collectionMeta({ ids: { ebible: 'engbsb' } });
        const source = createFetchBibleSource(
            'eng_bsb',
            manifestItem(),
            meta,
            JSON.stringify(meta)
        );
        expect(source.translationId).toBe('BSB');
    });

    it('should change the hash when the source changes', () => {
        const meta = collectionMeta();
        const updated = collectionMeta({
            source: { ...meta.source, updated: '2024-01-01' },
        });
        const a = createFetchBibleSource(
            'abt_map',
            manifestItem(),
            meta,
            JSON.stringify(meta)
        );
        const b = createFetchBibleSource(
            'abt_map',
            manifestItem(),
            updated,
            JSON.stringify(updated)
        );
        const c = createFetchBibleSource(
            'abt_map',
            manifestItem({ books_nt: ['mat'] }),
            meta,
            JSON.stringify(meta)
        );
        const same = createFetchBibleSource(
            'abt_map',
            manifestItem(),
            meta,
            JSON.stringify(meta)
        );

        expect(a.sha256).not.toBe(b.sha256);
        expect(a.sha256).not.toBe(c.sha256);
        expect(a.sha256).toBe(same.sha256);
    });
});

describe('hasFetchBibleSourceChanged()', () => {
    it('should detect changes to the git tree', () => {
        expect(
            hasFetchBibleSourceChanged(
                { sha256: 'a', gitTreeSha: 'tree1' },
                { sha256: 'a', gitTreeSha: 'tree2' }
            )
        ).toBe(true);
    });

    it('should detect changes to the metadata', () => {
        expect(
            hasFetchBibleSourceChanged(
                { sha256: 'a', gitTreeSha: 'tree1' },
                { sha256: 'b', gitTreeSha: 'tree1' }
            )
        ).toBe(true);
    });

    it('should not report unchanged sources', () => {
        expect(
            hasFetchBibleSourceChanged(
                { sha256: 'a', gitTreeSha: 'tree1' },
                { sha256: 'a', gitTreeSha: 'tree1' }
            )
        ).toBe(false);
    });

    it('should fall back to the metadata when a git tree SHA is unknown', () => {
        expect(
            hasFetchBibleSourceChanged(
                { sha256: 'a', gitTreeSha: null },
                { sha256: 'a', gitTreeSha: 'tree1' }
            )
        ).toBe(false);
        expect(
            hasFetchBibleSourceChanged(
                { sha256: 'a', gitTreeSha: 'tree1' },
                { sha256: 'a', gitTreeSha: null }
            )
        ).toBe(false);
        expect(
            hasFetchBibleSourceChanged(
                { sha256: 'a', gitTreeSha: null },
                { sha256: 'b', gitTreeSha: null }
            )
        ).toBe(true);
    });
});

describe('fetchBibleLicense()', () => {
    const cases: [string, any, any][] = [
        [
            'cc-by-sa',
            { license: 'cc-by-sa', url: '' },
            {
                attribution: 'required',
                commercialUse: 'allowed',
                derivatives: 'allowed',
                copyleft: true,
                publicDomain: false,
            },
        ],
        [
            'cc-by-nc-nd',
            { license: 'cc-by-nc-nd', url: '' },
            {
                attribution: 'required',
                commercialUse: 'not-allowed',
                derivatives: 'not-allowed',
                copyleft: false,
                publicDomain: false,
            },
        ],
        [
            'public',
            {
                license: 'public',
                url: 'https://creativecommons.org/publicdomain/zero/1.0/',
            },
            {
                attribution: 'not-required',
                commercialUse: 'allowed',
                derivatives: 'allowed',
                copyleft: false,
                publicDomain: true,
            },
        ],
        [
            'custom restrictions',
            {
                license: {
                    forbid_limitless: false,
                    forbid_commercial: true,
                    forbid_derivatives: true,
                    forbid_attributionless: true,
                    forbid_other: false,
                },
                url: 'https://netbible.com/copyright/',
            },
            {
                attribution: 'required',
                commercialUse: 'not-allowed',
                derivatives: 'not-allowed',
                copyleft: false,
                publicDomain: false,
            },
        ],
        [
            'same-license restrictions',
            {
                license: {
                    forbid_commercial: false,
                    forbid_derivatives: 'same-license',
                    forbid_attributionless: false,
                },
                url: '',
            },
            {
                attribution: 'not-required',
                commercialUse: 'allowed',
                derivatives: 'allowed',
                copyleft: true,
                publicDomain: false,
            },
        ],
        [
            'unknown license with a CC URL',
            {
                license: 'other',
                url: 'https://creativecommons.org/licenses/by/4.0/',
            },
            {
                attribution: 'required',
                commercialUse: 'allowed',
                derivatives: 'allowed',
                copyleft: false,
                publicDomain: false,
            },
        ],
    ];

    it.each(cases)('should map %s', (_desc, license, expected) => {
        expect(
            fetchBibleLicense({
                attribution: '',
                attribution_url: '',
                licenses: [license],
            })
        ).toEqual(expected);
    });

    it('should return null when the license is unknown', () => {
        expect(
            fetchBibleLicense({
                attribution: '',
                attribution_url: '',
                licenses: [{ license: 'other', url: 'https://example.com' }],
            })
        ).toBeNull();
        expect(fetchBibleLicense(null)).toBeNull();
    });
});

describe('createFetchBibleMetadata()', () => {
    it('should create metadata that can be imported', () => {
        const metadata = createFetchBibleMetadata(
            catalogEntry('abt_map', manifestItem(), collectionMeta())
        );

        expect(metadata).toEqual({
            id: 'abt_map',
            name: 'Gotna Kudi',
            englishName: 'Ambulas Maprik New Testament',
            shortName: 'MAP',
            language: 'abt',
            direction: 'ltr',
            website: 'https://ebible.org/Scriptures/details.php?id=abt-maprik',
            licenseUrl: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
            licenseNotice: 'Copyright © 1983 Wycliffe Bible Translators, Inc.',
            license: {
                attribution: 'required',
                commercialUse: 'not-allowed',
                derivatives: 'not-allowed',
                copyleft: false,
                publicDomain: false,
            },
        });
    });

    it('should fall back to the translation ID for the short name', () => {
        const item = manifestItem({
            name: {
                local: 'Local Name',
                local_abbrev: '',
                english: '',
                english_abbrev: '',
            },
            direction: 'rtl',
        });
        const metadata = createFetchBibleMetadata(
            catalogEntry('arb_tma', item, collectionMeta())
        );

        expect(metadata.shortName).toBe('TMA');
        expect(metadata.englishName).toBe('Local Name');
        expect(metadata.direction).toBe('rtl');
    });
});

describe('isCoveredByEBible()', () => {
    const coverage = createEBibleCoverage([
        { id: 'abt-maprik', translationId: 'abt_map' },
        { id: 'engbsb', translationId: 'BSB' },
    ]);

    it('should match by eBible ID', () => {
        expect(
            isCoveredByEBible(
                { ebibleId: 'ABT-Maprik', translationId: 'other_id' },
                coverage
            )
        ).toBe(true);
    });

    it('should match by translation ID', () => {
        expect(
            isCoveredByEBible(
                { ebibleId: null, translationId: 'bsb' },
                coverage
            )
        ).toBe(true);
    });

    it('should not match other translations', () => {
        expect(
            isCoveredByEBible(
                { ebibleId: 'xyz', translationId: 'xyz_abc' },
                coverage
            )
        ).toBe(false);
    });
});

describe('matchesFetchBibleTranslation()', () => {
    const source = {
        id: 'eng_bsb',
        translationId: 'BSB',
        ebibleId: 'engbsb',
    };

    it('should match any of the IDs', () => {
        expect(matchesFetchBibleTranslation('eng_bsb', source)).toBe(true);
        expect(matchesFetchBibleTranslation('bsb', source)).toBe(true);
        expect(matchesFetchBibleTranslation('ENGBSB', source)).toBe(true);
        expect(matchesFetchBibleTranslation('kjv', source)).toBe(false);
    });

    it('should support the ignorelist', () => {
        expect(isFetchBibleSourceIgnored(source, ['engbsb'])).toBe(true);
        expect(isFetchBibleSourceIgnored(source, ['BSB'])).toBe(true);
        expect(isFetchBibleSourceIgnored(source, ['eng_kjv'])).toBe(false);
    });
});

describe('mapConcurrent()', () => {
    it('should preserve order and limit concurrency', async () => {
        let running = 0;
        let maxRunning = 0;
        const results = await mapConcurrent(
            [1, 2, 3, 4, 5, 6, 7],
            3,
            async (n) => {
                running++;
                maxRunning = Math.max(maxRunning, running);
                await new Promise((resolve) => setTimeout(resolve, 5));
                running--;
                return n * 2;
            }
        );
        expect(results).toEqual([2, 4, 6, 8, 10, 12, 14]);
        expect(maxRunning).toBe(3);
    });
});

describe('fetch.bible downloads', () => {
    const originalFetch = global.fetch;
    let dir: string;

    beforeEach(async () => {
        dir = await mkdtemp(path.join(tmpdir(), 'fetch-bible-spec-'));
    });

    afterEach(async () => {
        global.fetch = originalFetch;
        await rm(dir, { recursive: true, force: true });
    });

    const API = 'https://api.test';
    const RAW = 'https://raw.test';
    const collection = {
        repo: 'owner/collection',
        ref: 'main',
        githubApiUrl: API,
        githubRawUrl: RAW,
    };

    /**
     * Mocks the GitHub API responses for a collection whose bibles directory contains the given trees.
     */
    function githubApi(
        url: string,
        trees: Record<string, string>,
        truncated: boolean = false
    ): Response | null {
        if (url === `${API}/repos/owner/collection/commits/main`) {
            return jsonResponse({
                sha: 'commit1',
                commit: { tree: { sha: 'root1' } },
            });
        } else if (url === `${API}/repos/owner/collection/git/trees/root1`) {
            return jsonResponse({
                sha: 'root1',
                tree: [
                    { path: 'README.md', type: 'blob', sha: 'readme' },
                    { path: 'bibles', type: 'tree', sha: 'bibles1' },
                ],
                truncated: false,
            });
        } else if (url === `${API}/repos/owner/collection/git/trees/bibles1`) {
            return jsonResponse({
                sha: 'bibles1',
                tree: Object.entries(trees).map(([path, sha]) => ({
                    path,
                    type: 'tree',
                    sha,
                })),
                truncated,
            });
        }
        return null;
    }

    describe('fetchFetchBibleCollectionRevision()', () => {
        it('should get the commit and the tree of each translation', async () => {
            const requests: [string, any][] = [];
            global.fetch = jest.fn(async (url: any, init: any) => {
                requests.push([url, init]);
                return (
                    githubApi(url, {
                        abt_map: 'tree-abt',
                        xyz_new: 'tree-xyz',
                    }) ?? textResponse('', 404)
                );
            }) as any;

            const revision = await fetchFetchBibleCollectionRevision({
                ...collection,
                githubToken: 'token123',
            });

            expect(revision.commitSha).toBe('commit1');
            expect([...revision.trees]).toEqual([
                ['abt_map', 'tree-abt'],
                ['xyz_new', 'tree-xyz'],
            ]);
            expect(requests).toHaveLength(3);
            expect(requests[0][1].headers.Authorization).toBe(
                'Bearer token123'
            );
        });

        it('should throw when the listing is truncated', async () => {
            global.fetch = jest.fn(
                async (url: any) =>
                    githubApi(url, { abt_map: 'tree-abt' }, true) ??
                    textResponse('', 404)
            ) as any;

            await expect(
                fetchFetchBibleCollectionRevision(collection)
            ).rejects.toThrow('truncated');
        });

        it('should throw when the GitHub API fails', async () => {
            global.fetch = jest.fn(async () =>
                textResponse('rate limited', 403)
            ) as any;

            await expect(
                fetchFetchBibleCollectionRevision(collection)
            ).rejects.toThrow('403');
        });
    });

    describe('fetchFetchBibleCatalog()', () => {
        const meta = collectionMeta();
        const usxMeta = collectionMeta({
            ids: {},
            source: {
                service: 'dbl',
                format: 'usx',
                url: null,
                updated: '2024-01-01',
                revision: 1,
            },
        });
        const badMeta = collectionMeta({
            source: { ...meta.source, format: 'other' as any },
        });

        function mockCollection(useApi: boolean) {
            const urls: string[] = [];
            global.fetch = jest.fn(async (url: any) => {
                urls.push(url);
                const api = useApi
                    ? githubApi(url, {
                          abt_map: 'tree-abt',
                          xyz_new: 'tree-xyz',
                          bad_fmt: 'tree-bad',
                      })
                    : null;
                if (api) {
                    return api;
                } else if (url === 'https://manifest.test/manifest.json') {
                    return textResponse(
                        JSON.stringify({
                            bibles: {
                                abt_map: manifestItem(),
                                xyz_new: manifestItem({ books_nt: true }),
                                bad_fmt: manifestItem(),
                            },
                            books_ordered: BOOKS_ORDERED,
                        })
                    );
                } else if (url.endsWith('/abt_map/meta.json')) {
                    return textResponse(JSON.stringify(meta));
                } else if (url.endsWith('/xyz_new/meta.json')) {
                    return textResponse(JSON.stringify(usxMeta));
                } else if (url.endsWith('/bad_fmt/meta.json')) {
                    return textResponse(JSON.stringify(badMeta));
                }
                return textResponse('', 404);
            }) as any;
            return urls;
        }

        it('should combine the manifest, collection metadata, and git revision', async () => {
            const urls = mockCollection(true);

            const catalog = await fetchFetchBibleCatalog({
                ...collection,
                manifestUrl: 'https://manifest.test/manifest.json',
            });

            expect(catalog.map((e) => e.source.id)).toEqual([
                'abt_map',
                'xyz_new',
            ]);
            expect(catalog[0].books).toEqual(['mat', 'mrk']);
            expect(catalog[1].books).toEqual(BOOKS_ORDERED.slice(39));
            expect(catalog[1].source.sourceFormat).toBe('usx');
            expect(catalog[0].source.gitCommitSha).toBe('commit1');
            expect(catalog[0].source.gitTreeSha).toBe('tree-abt');
            expect(catalog[1].source.gitTreeSha).toBe('tree-xyz');

            // Files are downloaded from the commit, not the branch
            expect(catalog[0].collectionUrl).toBe(
                `${RAW}/owner/collection/commit1`
            );
            expect(urls).toContain(
                `${RAW}/owner/collection/commit1/bibles/abt_map/meta.json`
            );
        });

        it('should fall back to the ref when the GitHub API is unavailable', async () => {
            const urls = mockCollection(false);

            const catalog = await fetchFetchBibleCatalog({
                ...collection,
                manifestUrl: 'https://manifest.test/manifest.json',
            });

            expect(catalog.map((e) => e.source.id)).toEqual([
                'abt_map',
                'xyz_new',
            ]);
            expect(catalog[0].source.gitCommitSha).toBeNull();
            expect(catalog[0].source.gitTreeSha).toBeNull();
            expect(catalog[0].collectionUrl).toBe(
                `${RAW}/owner/collection/main`
            );
            expect(urls).toContain(
                `${RAW}/owner/collection/main/bibles/abt_map/meta.json`
            );
        });
    });

    describe('downloadFetchBibleTranslation()', () => {
        const usxMeta = collectionMeta({
            ids: {},
            source: {
                service: 'dbl',
                format: 'usx',
                url: null,
                updated: '2024-01-01',
                revision: 1,
            },
        });

        function mockBooks() {
            const urls: string[] = [];
            global.fetch = jest.fn(async (url: any) => {
                urls.push(url);
                const match = /bibles\/([^/]+)\/(usx|usfm)\/([^/.]+)\./.exec(
                    url
                );
                if (match) {
                    return textResponse(`<usx>${match[1]} ${match[3]}</usx>`);
                }
                return textResponse('', 404);
            }) as any;
            return urls;
        }

        it('should write the books, metadata, and marker file', async () => {
            const urls = mockBooks();
            const entry = catalogEntry('xyz_new', manifestItem(), usxMeta);
            const outputPath = path.join(dir, 'xyz_new');
            await mkdir(outputPath);
            await writeFile(path.join(outputPath, 'OLD.usx'), '');

            await downloadFetchBibleTranslation(entry, {
                outputPath,
                metadata: createFetchBibleMetadata(entry),
            });

            expect(urls.sort()).toEqual([
                'https://collection.test/bibles/xyz_new/usx/mat.usx',
                'https://collection.test/bibles/xyz_new/usx/mrk.usx',
            ]);
            expect((await readdir(outputPath)).sort()).toEqual([
                'MAT.usx',
                'MRK.usx',
                FETCH_BIBLE_MARKER_FILE,
                'metadata.json',
            ]);
            expect(
                await readFile(path.join(outputPath, 'MAT.usx'), 'utf-8')
            ).toBe('<usx>xyz_new mat</usx>');
            const metadata = JSON.parse(
                await readFile(path.join(outputPath, 'metadata.json'), 'utf-8')
            );
            expect(metadata.id).toBe('xyz_new');
            expect(metadata.language).toBe('xyz');
            expect(isFetchBibleTranslationDir(outputPath)).toBe(true);
        });

        it('should record the git revision in the marker file', async () => {
            mockBooks();
            const entry = catalogEntry('xyz_new', manifestItem(), usxMeta, {
                commitSha: 'commit1',
                treeSha: 'tree1',
            });
            const outputPath = path.join(dir, 'xyz_new');

            await downloadFetchBibleTranslation(entry, {
                outputPath,
                metadata: createFetchBibleMetadata(entry),
            });

            expect(
                await readFile(
                    path.join(outputPath, FETCH_BIBLE_MARKER_FILE),
                    'utf-8'
                )
            ).toBe(
                [
                    'This translation was downloaded from fetch.bible (xyz_new).',
                    'Source: https://collection.test/bibles/xyz_new/',
                    'Commit: commit1',
                    'Tree: tree1',
                    '',
                ].join('\n')
            );
        });

        it('should write the books to the download directory', async () => {
            mockBooks();
            const entry = catalogEntry(
                'abt_map',
                manifestItem(),
                collectionMeta()
            );
            const outputPath = path.join(dir, 'out', 'abt_map');
            const downloadDir = path.join(dir, 'temp', 'abt_map');

            await downloadFetchBibleTranslation(entry, {
                outputPath,
                downloadDir,
                metadata: createFetchBibleMetadata(entry),
            });

            expect((await readdir(downloadDir)).sort()).toEqual([
                'MAT.usfm',
                'MRK.usfm',
            ]);
            expect((await readdir(outputPath)).sort()).toEqual([
                FETCH_BIBLE_MARKER_FILE,
                'metadata.json',
            ]);
        });

        it('should not touch the output directory when a book fails to download', async () => {
            global.fetch = jest.fn(async (url: any) =>
                url.endsWith('mrk.usx')
                    ? textResponse('', 404)
                    : textResponse('<usx/>')
            ) as any;
            const entry = catalogEntry('xyz_new', manifestItem(), usxMeta);
            const outputPath = path.join(dir, 'xyz_new');
            await mkdir(outputPath);
            await writeFile(path.join(outputPath, 'OLD.usx'), '');

            await expect(
                downloadFetchBibleTranslation(entry, {
                    outputPath,
                    metadata: createFetchBibleMetadata(entry),
                })
            ).rejects.toThrow('mrk.usx: 404');
            expect(await readdir(outputPath)).toEqual(['OLD.usx']);
        });
    });

    describe('loadDownloadedEBibleCoverage()', () => {
        async function writeTranslation(
            name: string,
            metadata: object,
            fromFetchBible: boolean = false
        ) {
            await mkdir(path.join(dir, name), { recursive: true });
            await writeFile(
                path.join(dir, name, 'metadata.json'),
                JSON.stringify(metadata)
            );
            if (fromFetchBible) {
                await writeFile(
                    path.join(dir, name, FETCH_BIBLE_MARKER_FILE),
                    ''
                );
            }
        }

        it('should include translations whose metadata links to ebible.org', async () => {
            await writeTranslation('abt_map', {
                id: 'abt_map',
                licenseUrl:
                    'https://ebible.org/Scriptures/details.php?id=abt-maprik',
            });
            await writeTranslation('BSB', {
                id: 'BSB',
                licenseUrl: 'https://berean.bible/terms.htm',
                website: 'https://ebible.org/Scriptures/details.php?id=engbsb',
            });
            await writeTranslation('other', {
                id: 'other',
                licenseUrl: 'https://example.com',
            });

            const coverage = await loadDownloadedEBibleCoverage(null, dir);

            expect([...coverage.ebibleIds].sort()).toEqual([
                'abt-maprik',
                'engbsb',
            ]);
            expect([...coverage.translationIds].sort()).toEqual([
                'abt_map',
                'bsb',
            ]);
        });

        it('should ignore translations that were downloaded from fetch.bible', async () => {
            await writeTranslation(
                'abt_map',
                {
                    id: 'abt_map',
                    licenseUrl:
                        'https://ebible.org/Scriptures/details.php?id=abt-maprik',
                },
                true
            );

            const coverage = await loadDownloadedEBibleCoverage(null, dir);
            expect(coverage.ebibleIds.size).toBe(0);
            expect(coverage.translationIds.size).toBe(0);
        });

        it('should include translations that are tracked in the database', async () => {
            await writeTranslation('abt_map', { id: 'abt_map' });
            await writeTranslation('fet_chd', { id: 'fet_chd' }, true);
            const db = {
                prepare: () => ({
                    all: () => [
                        { id: 'abt-maprik', translationId: 'abt_map' },
                        { id: 'missing', translationId: 'mis_sng' },
                        { id: 'fetched', translationId: 'fet_chd' },
                    ],
                }),
            } as any;

            const inDir = await loadDownloadedEBibleCoverage(db, dir);
            expect([...inDir.translationIds]).toEqual(['abt_map']);

            const anywhere = await loadDownloadedEBibleCoverage(db);
            expect([...anywhere.translationIds].sort()).toEqual([
                'abt_map',
                'fet_chd',
                'mis_sng',
            ]);
        });
    });
});
