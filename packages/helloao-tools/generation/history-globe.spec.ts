import {
    generateDatasetFromHistoryGlobe,
    HistoryGlobeFiles,
    HISTORY_GLOBE_DATASET,
} from './history-globe.js';
import { generateApiForDataset, generateFilesForApi } from './api.js';
import { DatasetOutput } from './dataset.js';

describe('generateDatasetFromHistoryGlobe()', () => {
    function createFiles(): HistoryGlobeFiles {
        return {
            places: [
                {
                    id: 'a15257a',
                    name: 'Jerusalem',
                    names: { ru: 'Иерусалим' },
                    kind: 'settlement',
                    lon: 35.2304,
                    lat: 31.77655,
                    verses: 4,
                    page: { en: '/en/place/jerusalem/' },
                },
                {
                    id: 'a149f13',
                    name: 'Judea',
                    kind: 'region',
                    lon: 35.1,
                    lat: 31.6,
                    verses: 1,
                },
                {
                    id: 'a9ca8ec',
                    name: 'Jordan River',
                    kind: 'river',
                    lon: 35.56,
                    lat: 32.3,
                    verses: 1,
                },
                {
                    id: 'a2b5b2f',
                    name: 'Elim',
                    kind: 'campsite',
                    lon: 33.1,
                    lat: 29.2,
                    verses: 1,
                },
                {
                    // A place of the wider ancient world that no verse names.
                    id: 'a0c0de1',
                    name: 'Carthage',
                    kind: 'settlement',
                    lon: 10.32,
                    lat: 36.85,
                    verses: 0,
                },
            ],
            verses: {
                'Acts.1.8': ['a15257a', 'a149f13'],
                'Acts.1.4': ['a15257a'],
                'Gen.14.18': ['a15257a'],
                'Acts.1.12': ['a15257a'],
                'Matt.3.13': ['a9ca8ec'],
                'Exod.15.27': ['a2b5b2f'],
            },
        };
    }

    it('should use the history globe dataset info by default', () => {
        const dataset = generateDatasetFromHistoryGlobe(createFiles());

        expect(dataset).toMatchObject({
            id: 'history-globe',
            name: 'History Globe',
            englishName: 'History Globe',
            website: 'https://historyglobe.app',
            licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
            language: 'eng',
            textDirection: 'ltr',
            books: [],
        });
        expect(dataset.licenseNotes).toBe(HISTORY_GLOBE_DATASET.licenseNotes);
        expect(dataset.people).toBeUndefined();
        expect(dataset.events).toBeUndefined();
        expect(dataset.peopleGroups).toBeUndefined();
    });

    it('should generate places with coordinates, feature types, and references', () => {
        const dataset = generateDatasetFromHistoryGlobe(createFiles());

        expect(dataset.places).toEqual([
            {
                id: 'a149f13',
                name: 'Judea',
                featureType: 'Region',
                latitude: 31.6,
                longitude: 35.1,
                references: [{ book: 'ACT', chapter: 1, verse: 8 }],
            },
            {
                id: 'a15257a',
                name: 'Jerusalem',
                featureType: 'City',
                latitude: 31.77655,
                longitude: 35.2304,
                references: [
                    { book: 'GEN', chapter: 14, verse: 18 },
                    { book: 'ACT', chapter: 1, verse: 4 },
                    { book: 'ACT', chapter: 1, verse: 8 },
                    { book: 'ACT', chapter: 1, verse: 12 },
                ],
            },
            {
                id: 'a2b5b2f',
                name: 'Elim',
                featureSubType: 'Campsite',
                latitude: 29.2,
                longitude: 33.1,
                references: [{ book: 'EXO', chapter: 15, verse: 27 }],
            },
            {
                id: 'a9ca8ec',
                name: 'Jordan River',
                featureType: 'Water',
                featureSubType: 'River',
                latitude: 32.3,
                longitude: 35.56,
                references: [{ book: 'MAT', chapter: 3, verse: 13 }],
            },
        ]);
    });

    it('should give no feature subtype to kinds that say nothing more', () => {
        const files = createFiles();
        files.places.push({
            id: 'a3d1c8e',
            name: 'En-hakkore',
            kind: 'special',
            lon: 34.9,
            lat: 31.6,
        });
        files.verses['Judg.15.19'] = ['a3d1c8e'];

        const dataset = generateDatasetFromHistoryGlobe(files);
        const place = dataset.places!.find((p) => p.id === 'a3d1c8e')!;

        expect(place.featureType).toBeUndefined();
        expect(place.featureSubType).toBeUndefined();
    });

    it('should leave out places that no verse names', () => {
        const dataset = generateDatasetFromHistoryGlobe(createFiles());

        expect(dataset.places!.map((p) => p.id)).not.toContain('a0c0de1');
    });

    it('should collapse consecutive verses into a single reference', () => {
        const files = createFiles();
        files.verses['Acts.1.5'] = ['a15257a'];
        files.verses['Acts.1.6'] = ['a15257a'];
        files.verses['Acts.1.7'] = ['a15257a'];

        const dataset = generateDatasetFromHistoryGlobe(files);
        const jerusalem = dataset.places!.find((p) => p.id === 'a15257a')!;

        expect(jerusalem.references).toEqual([
            { book: 'GEN', chapter: 14, verse: 18 },
            { book: 'ACT', chapter: 1, verse: 4, endVerse: 8 },
            { book: 'ACT', chapter: 1, verse: 12 },
        ]);
    });

    it('should skip unknown books and unknown place IDs', () => {
        const files = createFiles();
        files.verses['Tob.1.1'] = ['a15257a'];
        files.verses['Gen.1.1'] = ['unknown'];

        const dataset = generateDatasetFromHistoryGlobe(files);

        expect(dataset.places!.map((p) => p.id)).toEqual([
            'a149f13',
            'a15257a',
            'a2b5b2f',
            'a9ca8ec',
        ]);
        const jerusalem = dataset.places!.find((p) => p.id === 'a15257a')!;
        expect(jerusalem.references).toHaveLength(4);
    });

    it('should be deterministic', () => {
        const first = generateDatasetFromHistoryGlobe(createFiles());
        const second = generateDatasetFromHistoryGlobe(createFiles());

        expect(JSON.stringify(first)).toBe(JSON.stringify(second));
    });

    describe('generateApiForDataset()', () => {
        function createDatasetOutput(): DatasetOutput {
            return {
                translations: [],
                commentaries: [],
                datasets: [generateDatasetFromHistoryGlobe(createFiles())],
            };
        }

        it('should list the dataset in available datasets with a places link', () => {
            const api = generateApiForDataset(createDatasetOutput());

            expect(api.availableDatasets?.datasets).toMatchObject([
                {
                    id: 'history-globe',
                    listOfBooksApiLink: '/api/d/history-globe/books.json',
                    listOfPlacesApiLink: '/api/d/history-globe/places.json',
                    totalNumberOfPlaces: 4,
                },
            ]);
        });

        it('should generate place lists and contents', () => {
            const api = generateApiForDataset(createDatasetOutput());

            expect(api.datasetPlaces).toHaveLength(1);
            expect(api.datasetPlaces![0].places).toContainEqual({
                id: 'a15257a',
                name: 'Jerusalem',
                featureType: 'City',
                latitude: 31.77655,
                longitude: 35.2304,
                numberOfReferences: 4,
                thisPlaceApiLink: '/api/d/history-globe/places/a15257a.json',
            });

            const jerusalem = api.datasetPlaceContents!.find(
                (c) => c.place.id === 'a15257a'
            )!;
            expect(jerusalem.place.references).toHaveLength(4);
        });

        it('should generate files for the place and chapter endpoints', () => {
            const api = generateApiForDataset(createDatasetOutput());
            const files = generateFilesForApi(api);

            const paths = files.map((f) => f.path);
            expect(paths).toContain('/api/available_datasets.json');
            expect(paths).toContain('/api/d/history-globe/books.json');
            expect(paths).toContain('/api/d/history-globe/places.json');
            expect(paths).toContain('/api/d/history-globe/places/a15257a.json');
            expect(paths).toContain('/api/d/history-globe/GEN/14.json');
            expect(paths).toContain('/api/d/history-globe/ACT/1.json');
            expect(paths).not.toContain('/api/d/history-globe/people.json');
        });

        it('should generate chapter files with the places that appear in each chapter, in order of first mention', () => {
            const api = generateApiForDataset(createDatasetOutput());

            expect(
                api.datasetEntityBookChapters!.map((c) => c.thisChapterLink)
            ).toEqual([
                '/api/d/history-globe/GEN/14.json',
                '/api/d/history-globe/EXO/15.json',
                '/api/d/history-globe/MAT/3.json',
                '/api/d/history-globe/ACT/1.json',
            ]);

            const act1 = api.datasetEntityBookChapters![3];
            expect(act1.chapter).toEqual({
                number: 1,
                people: [],
                places: [
                    {
                        id: 'a15257a',
                        name: 'Jerusalem',
                        featureType: 'City',
                        latitude: 31.77655,
                        longitude: 35.2304,
                        apiLink: '/api/d/history-globe/places/a15257a.json',
                        verses: [4, 8, 12],
                    },
                    {
                        id: 'a149f13',
                        name: 'Judea',
                        featureType: 'Region',
                        latitude: 31.6,
                        longitude: 35.1,
                        apiLink: '/api/d/history-globe/places/a149f13.json',
                        verses: [8],
                    },
                ],
                events: [],
            });
            expect(act1.numberOfPlaces).toBe(2);
        });
    });
});
