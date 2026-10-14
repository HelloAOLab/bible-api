import { FreeUseBibleApi } from 'free-use-bible-api';
import { createBibleDataManager } from './BibleDataManager.js';
import { FakeBibleServer, makeTranslation } from './test/fakeApi.js';

describe('BibleDataManager', () => {
    let server: FakeBibleServer;

    beforeEach(() => {
        server = new FakeBibleServer().install();
    });

    afterEach(() => {
        server.uninstall();
    });

    it("downloads a translation's book list once and caches it", async () => {
        const dataManager = createBibleDataManager(new FreeUseBibleApi());

        expect(dataManager.getCachedTranslationBooks('BSB')).toBeNull();
        const books = await dataManager.getTranslationBooks('BSB');
        await dataManager.getTranslationBooks('BSB');

        expect(books.books.map((book) => book.id)).toEqual([
            'GEN',
            'EXO',
            'JHN',
        ]);
        expect(dataManager.getCachedTranslationBooks('BSB')).toBe(books);
        expect(
            server.requests.filter((url) => url.endsWith('/BSB/books.json'))
        ).toHaveLength(1);
        // Loading one translation's books only makes that translation known,
        // which is not the same as having the full list.
        expect(
            dataManager.availableTranslations.value.map((t) => t.id)
        ).toEqual(['BSB']);
        expect(dataManager.catalogLoaded.value).toBe(false);
    });

    it('remembers which endpoint each translation came from', async () => {
        server.translations.set('https://other.example.com/', [
            makeTranslation('OTH'),
        ]);
        const dataManager = createBibleDataManager(new FreeUseBibleApi());

        await dataManager.getTranslations();
        await dataManager.getTranslations('https://other.example.com');
        const chapter = await dataManager.getTranslationBookChapter(
            'OTH',
            'JHN',
            1
        );
        const next = await dataManager.getNextChapter(chapter);

        expect(dataManager.catalogLoaded.value).toBe(true);
        expect(dataManager.endpoints.value).toEqual([
            'https://bible.helloao.org/',
            'https://other.example.com/',
        ]);
        expect(
            dataManager.availableTranslations.value.map((t) => t.id)
        ).toEqual(['BSB', 'AAB', 'OTH']);
        expect(next?.chapter.number).toBe(2);
        expect(server.requests).toContain(
            'https://other.example.com/api/OTH/JHN/2.json'
        );
        expect(dataManager.getTranslationEndpointInfo('OTH')).toEqual({
            translationId: 'OTH',
            endpoint: 'https://other.example.com/',
            isDefault: false,
        });
        expect(dataManager.buildTranslationId('BSB')).toBe('BSB');
        expect(dataManager.buildTranslationId('OTH')).toBe(
            'https://other.example.com/api/OTH/books.json'
        );
    });

    it('returns null for the chapter before the first one', async () => {
        const dataManager = createBibleDataManager(new FreeUseBibleApi());
        const chapter = await dataManager.getTranslationBookChapter(
            'BSB',
            'GEN',
            1
        );
        const requestCount = server.requests.length;

        expect(await dataManager.getPreviousChapter(chapter)).toBeNull();
        expect(server.requests).toHaveLength(requestCount);
    });

    it('propagates a failed request', async () => {
        server.fail('/books.json');
        const dataManager = createBibleDataManager(new FreeUseBibleApi());

        await expect(dataManager.getTranslationBooks('BSB')).rejects.toThrow(
            'Failed to fetch'
        );
        expect(dataManager.getCachedTranslationBooks('BSB')).toBeNull();
    });
});
