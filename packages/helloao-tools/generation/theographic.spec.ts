import {
    generateDatasetFromTheographic,
    slugify,
    stripMarkdownLinks,
    TheographicFiles,
    THEOGRAPHIC_DATASET,
} from './theographic.js';
import { generateApiForDataset, generateFilesForApi } from './api.js';
import { DatasetOutput } from './dataset.js';

describe('slugify()', () => {
    const cases = [
        ['Creation of Adam and Eve', 'creation-of-adam-and-eve'],
        ['Saul is converted', 'saul-is-converted'],
        ['Tribe of Benjamin', 'tribe-of-benjamin'],
        ["Israel's Exodus", 'israel-s-exodus'],
        ['  Trimmed  ', 'trimmed'],
    ];

    it.each(cases)('should slugify %s', (input, expected) => {
        expect(slugify(input)).toBe(expected);
    });
});

describe('stripMarkdownLinks()', () => {
    it('should replace markdown links with their text', () => {
        expect(
            stripMarkdownLinks(
                'court ([Esther 1:10](/esth#Esth.1.10); [2:21](/esth#Esth.2.21)).'
            )
        ).toBe('court (Esther 1:10; 2:21).');
    });

    it('should leave plain text alone', () => {
        expect(stripMarkdownLinks('Hello, world!')).toBe('Hello, world!');
    });
});

describe('generateDatasetFromTheographic()', () => {
    function createFiles(): TheographicFiles {
        return {
            books: [
                {
                    id: 'bookGen',
                    fields: {
                        osisName: 'Gen',
                        bookName: 'Genesis',
                        bookOrder: 1,
                    },
                },
                {
                    id: 'bookActs',
                    fields: {
                        osisName: 'Acts',
                        bookName: 'Acts',
                        bookOrder: 44,
                    },
                },
            ],
            verses: [
                {
                    id: 'verseGen11',
                    fields: {
                        osisRef: 'Gen.1.1',
                        verseNum: '1',
                        book: ['bookGen'],
                    },
                },
                {
                    id: 'verseGen21',
                    fields: {
                        osisRef: 'Gen.2.1',
                        verseNum: '1',
                        book: ['bookGen'],
                    },
                },
                {
                    id: 'verseActs91',
                    fields: {
                        osisRef: 'Acts.9.1',
                        verseNum: '1',
                        book: ['bookActs'],
                    },
                },
                {
                    id: 'verseActs92',
                    fields: {
                        osisRef: 'Acts.9.2',
                        verseNum: '2',
                        book: ['bookActs'],
                    },
                },
            ],
            people: [
                {
                    id: 'personAdam',
                    fields: {
                        slug: 'adam_2',
                        name: 'Adam',
                        displayTitle: 'Adam',
                        gender: 'Male',
                        children: ['personSeth'],
                        memberOf: ['groupHumanity'],
                        timeline: ['eventCreation'],
                        verses: ['verseGen21', 'verseGen11'],
                        dictText: [
                            'The first man ([Gen. 1:26](/gen#Gen.1.26)).',
                        ],
                    },
                },
                {
                    id: 'personSeth',
                    fields: {
                        slug: 'seth_10',
                        name: 'Seth',
                        displayTitle: 'Seth',
                        gender: 'Male',
                        birthYear: '-3874',
                        father: ['personAdam'],
                        birthPlace: ['placeEden'],
                        verses: ['verseGen21'],
                    },
                },
            ],
            places: [
                {
                    id: 'placeEden',
                    fields: {
                        slug: 'eden_1',
                        kjvName: 'Eden',
                        esvName: 'Eden',
                        displayTitle: 'Eden',
                        featureType: 'Region',
                        latitude: '31.777444',
                        longitude: '35.234935',
                        hasBeenHere: ['personAdam'],
                        peopleBorn: ['personSeth'],
                        eventsHere: ['eventCreation'],
                        verses: ['verseGen11', 'verseGen21'],
                        aliases: 'Paradise, Garden of God',
                    },
                },
            ],
            events: [
                {
                    id: 'eventCreation',
                    fields: {
                        title: 'Creation of Adam and Eve',
                        eventID: 1,
                        startDate: '-4003',
                        duration: '1D',
                        participants: ['personAdam'],
                        locations: ['placeEden'],
                        groups: ['groupHumanity'],
                        verses: ['verseGen11', 'verseGen21', 'verseActs92'],
                    },
                },
                {
                    id: 'eventFall',
                    fields: {
                        title: 'The Fall',
                        eventID: 2,
                        startDate: '-4003',
                        duration: '1D',
                        predecessor: ['eventCreation'],
                        verses: ['verseActs91', 'verseActs92'],
                    },
                },
            ],
            peopleGroups: [
                {
                    id: 'groupHumanity',
                    fields: {
                        groupName: 'Humanity',
                        members: ['personAdam', 'personSeth'],
                        events_dev: ['eventCreation'],
                    },
                },
            ],
        };
    }

    it('should use the theographic dataset info by default', () => {
        const dataset = generateDatasetFromTheographic(createFiles());

        expect(dataset.id).toBe('theographic');
        expect(dataset.name).toBe('Theographic Bible Metadata');
        expect(dataset.website).toBe(
            'https://github.com/robertrouse/theographic-bible-metadata'
        );
        expect(dataset.licenseUrl).toBe(
            'https://creativecommons.org/licenses/by-sa/4.0/'
        );
        expect(dataset.language).toBe('eng');
        expect(dataset.textDirection).toBe('ltr');
        expect(dataset.books).toEqual([]);
    });

    it('should generate people with resolved relationships and references', () => {
        const dataset = generateDatasetFromTheographic(createFiles());

        expect(dataset.people).toEqual([
            {
                id: 'adam_2',
                name: 'Adam',
                gender: 'Male',
                description: ['The first man (Gen. 1:26).'],
                children: [{ id: 'seth_10', name: 'Seth' }],
                memberOf: [{ id: 'humanity', name: 'Humanity' }],
                events: [
                    {
                        id: 'creation-of-adam-and-eve_1',
                        name: 'Creation of Adam and Eve',
                    },
                ],
                references: [
                    { book: 'GEN', chapter: 1, verse: 1 },
                    { book: 'GEN', chapter: 2, verse: 1 },
                ],
            },
            {
                id: 'seth_10',
                name: 'Seth',
                gender: 'Male',
                birthYear: -3874,
                birthPlace: { id: 'eden_1', name: 'Eden' },
                father: [{ id: 'adam_2', name: 'Adam' }],
                references: [{ book: 'GEN', chapter: 2, verse: 1 }],
            },
        ]);
    });

    it('should generate places with resolved relationships and references', () => {
        const dataset = generateDatasetFromTheographic(createFiles());

        expect(dataset.places).toEqual([
            {
                id: 'eden_1',
                name: 'Eden',
                kjvName: 'Eden',
                esvName: 'Eden',
                aliases: ['Paradise', 'Garden of God'],
                featureType: 'Region',
                latitude: 31.777444,
                longitude: 35.234935,
                people: [{ id: 'adam_2', name: 'Adam' }],
                peopleBorn: [{ id: 'seth_10', name: 'Seth' }],
                events: [
                    {
                        id: 'creation-of-adam-and-eve_1',
                        name: 'Creation of Adam and Eve',
                    },
                ],
                references: [
                    { book: 'GEN', chapter: 1, verse: 1 },
                    { book: 'GEN', chapter: 2, verse: 1 },
                ],
            },
        ]);
    });

    it('should generate events with resolved relationships and references', () => {
        const dataset = generateDatasetFromTheographic(createFiles());

        expect(dataset.events).toEqual([
            {
                id: 'creation-of-adam-and-eve_1',
                name: 'Creation of Adam and Eve',
                startDate: '-4003',
                duration: '1D',
                participants: [{ id: 'adam_2', name: 'Adam' }],
                locations: [{ id: 'eden_1', name: 'Eden' }],
                groups: [{ id: 'humanity', name: 'Humanity' }],
                references: [
                    { book: 'GEN', chapter: 1, verse: 1 },
                    { book: 'GEN', chapter: 2, verse: 1 },
                    { book: 'ACT', chapter: 9, verse: 2 },
                ],
            },
            {
                id: 'the-fall_2',
                name: 'The Fall',
                startDate: '-4003',
                duration: '1D',
                predecessor: {
                    id: 'creation-of-adam-and-eve_1',
                    name: 'Creation of Adam and Eve',
                },
                references: [
                    { book: 'ACT', chapter: 9, verse: 1, endVerse: 2 },
                ],
            },
        ]);
    });

    it('should generate people groups with resolved relationships', () => {
        const dataset = generateDatasetFromTheographic(createFiles());

        expect(dataset.peopleGroups).toEqual([
            {
                id: 'humanity',
                name: 'Humanity',
                members: [
                    { id: 'adam_2', name: 'Adam' },
                    { id: 'seth_10', name: 'Seth' },
                ],
                events: [
                    {
                        id: 'creation-of-adam-and-eve_1',
                        name: 'Creation of Adam and Eve',
                    },
                ],
                references: [],
            },
        ]);
    });

    it('should collapse consecutive verses into a single reference', () => {
        const dataset = generateDatasetFromTheographic(createFiles());

        const fall = dataset.events?.find((e) => e.id === 'the-fall_2');
        expect(fall?.references).toEqual([
            { book: 'ACT', chapter: 9, verse: 1, endVerse: 2 },
        ]);
    });

    it('should be deterministic', () => {
        const first = generateDatasetFromTheographic(createFiles());
        const second = generateDatasetFromTheographic(createFiles());

        expect(JSON.stringify(first)).toBe(JSON.stringify(second));
    });

    describe('generateApiForDataset()', () => {
        function createDatasetOutput(): DatasetOutput {
            return {
                translations: [],
                commentaries: [],
                datasets: [generateDatasetFromTheographic(createFiles())],
            };
        }

        it('should list the dataset in available datasets with entity links', () => {
            const api = generateApiForDataset(createDatasetOutput());

            expect(api.availableDatasets?.datasets).toMatchObject([
                {
                    id: 'theographic',
                    listOfBooksApiLink: '/api/d/theographic/books.json',
                    listOfPeopleApiLink: '/api/d/theographic/people.json',
                    listOfPlacesApiLink: '/api/d/theographic/places.json',
                    listOfEventsApiLink: '/api/d/theographic/events.json',
                    listOfPeopleGroupsApiLink: '/api/d/theographic/groups.json',
                    totalNumberOfPeople: 2,
                    totalNumberOfPlaces: 1,
                    totalNumberOfEvents: 2,
                    totalNumberOfPeopleGroups: 1,
                },
            ]);
        });

        it('should generate people lists and contents', () => {
            const api = generateApiForDataset(createDatasetOutput());

            expect(api.datasetPeople).toHaveLength(1);
            expect(api.datasetPeople![0].people).toEqual([
                {
                    id: 'adam_2',
                    name: 'Adam',
                    gender: 'Male',
                    numberOfReferences: 2,
                    thisPersonApiLink: '/api/d/theographic/people/adam_2.json',
                },
                {
                    id: 'seth_10',
                    name: 'Seth',
                    gender: 'Male',
                    numberOfReferences: 1,
                    thisPersonApiLink: '/api/d/theographic/people/seth_10.json',
                },
            ]);

            expect(api.datasetPeopleContents).toHaveLength(2);
            const seth = api.datasetPeopleContents![1];
            expect(seth.thisPersonApiLink).toBe(
                '/api/d/theographic/people/seth_10.json'
            );
            expect(seth.person.father).toEqual([
                {
                    id: 'adam_2',
                    name: 'Adam',
                    apiLink: '/api/d/theographic/people/adam_2.json',
                },
            ]);
            expect(seth.person.birthPlace).toEqual({
                id: 'eden_1',
                name: 'Eden',
                apiLink: '/api/d/theographic/places/eden_1.json',
            });
        });

        it('should generate place lists and contents', () => {
            const api = generateApiForDataset(createDatasetOutput());

            expect(api.datasetPlaces).toHaveLength(1);
            expect(api.datasetPlaces![0].places).toEqual([
                {
                    id: 'eden_1',
                    name: 'Eden',
                    featureType: 'Region',
                    latitude: 31.777444,
                    longitude: 35.234935,
                    numberOfReferences: 2,
                    thisPlaceApiLink: '/api/d/theographic/places/eden_1.json',
                },
            ]);

            const eden = api.datasetPlaceContents![0];
            expect(eden.place.events).toEqual([
                {
                    id: 'creation-of-adam-and-eve_1',
                    name: 'Creation of Adam and Eve',
                    apiLink:
                        '/api/d/theographic/events/creation-of-adam-and-eve_1.json',
                },
            ]);
        });

        it('should generate event lists and contents', () => {
            const api = generateApiForDataset(createDatasetOutput());

            expect(api.datasetEvents).toHaveLength(1);
            expect(api.datasetEvents![0].events).toEqual([
                {
                    id: 'creation-of-adam-and-eve_1',
                    name: 'Creation of Adam and Eve',
                    startDate: '-4003',
                    numberOfReferences: 3,
                    thisEventApiLink:
                        '/api/d/theographic/events/creation-of-adam-and-eve_1.json',
                },
                {
                    id: 'the-fall_2',
                    name: 'The Fall',
                    startDate: '-4003',
                    numberOfReferences: 1,
                    thisEventApiLink:
                        '/api/d/theographic/events/the-fall_2.json',
                },
            ]);

            const fall = api.datasetEventContents![1];
            expect(fall.event.predecessor).toEqual({
                id: 'creation-of-adam-and-eve_1',
                name: 'Creation of Adam and Eve',
                apiLink:
                    '/api/d/theographic/events/creation-of-adam-and-eve_1.json',
            });
        });

        it('should generate people group lists and contents', () => {
            const api = generateApiForDataset(createDatasetOutput());

            expect(api.datasetPeopleGroups).toHaveLength(1);
            expect(api.datasetPeopleGroups![0].groups).toEqual([
                {
                    id: 'humanity',
                    name: 'Humanity',
                    numberOfMembers: 2,
                    thisPeopleGroupApiLink:
                        '/api/d/theographic/groups/humanity.json',
                },
            ]);

            const humanity = api.datasetPeopleGroupContents![0];
            expect(humanity.group.members).toEqual([
                {
                    id: 'adam_2',
                    name: 'Adam',
                    apiLink: '/api/d/theographic/people/adam_2.json',
                },
                {
                    id: 'seth_10',
                    name: 'Seth',
                    apiLink: '/api/d/theographic/people/seth_10.json',
                },
            ]);
        });

        it('should respect the path prefix', () => {
            const api = generateApiForDataset(createDatasetOutput(), {
                pathPrefix: '/hello',
            });

            expect(api.availableDatasets?.datasets[0].listOfPeopleApiLink).toBe(
                '/hello/api/d/theographic/people.json'
            );
            expect(api.datasetPeopleContents![0].thisPersonApiLink).toBe(
                '/hello/api/d/theographic/people/adam_2.json'
            );
        });

        it('should generate files for the entity endpoints', () => {
            const api = generateApiForDataset(createDatasetOutput());
            const files = generateFilesForApi(api);

            const paths = files.map((f) => f.path);
            expect(paths).toContain('/api/available_datasets.json');
            expect(paths).toContain('/api/d/theographic/books.json');
            expect(paths).toContain('/api/d/theographic/people.json');
            expect(paths).toContain('/api/d/theographic/people/adam_2.json');
            expect(paths).toContain('/api/d/theographic/people/seth_10.json');
            expect(paths).toContain('/api/d/theographic/places.json');
            expect(paths).toContain('/api/d/theographic/places/eden_1.json');
            expect(paths).toContain('/api/d/theographic/events.json');
            expect(paths).toContain(
                '/api/d/theographic/events/creation-of-adam-and-eve_1.json'
            );
            expect(paths).toContain(
                '/api/d/theographic/events/the-fall_2.json'
            );
            expect(paths).toContain('/api/d/theographic/groups.json');
            expect(paths).toContain('/api/d/theographic/groups/humanity.json');
        });
    });
});
