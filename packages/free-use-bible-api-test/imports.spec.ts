import { Configuration, FreeUseBibleApi } from 'free-use-bible-api';

const basePath = process.env.FREE_USE_BIBLE_API_BASE_URL ?? 'https://bible.helloao.org';
const api = new FreeUseBibleApi(new Configuration({ basePath }));

describe('imports', () => {
    jest.setTimeout(30_000);

    it('should be defined', () => {
        expect(FreeUseBibleApi).toBeDefined();
    });

    it('lists available translations', async () => {
        const result = await api.getAvailableTranslations();

        expect(Array.isArray(result.translations)).toBe(true);
        expect(result.translations.length).toBeGreaterThan(0);
        expect(result.translations.some((translation) => translation.id === 'BSB')).toBe(true);
    });

    it('lists books for the BSB translation', async () => {
        const result = await api.getTranslationBooks({ translation: 'BSB' });

        expect(result.translation.id).toBe('BSB');
        expect(Array.isArray(result.books)).toBe(true);
        expect(result.books.length).toBeGreaterThan(0);
        expect(result.books.some((book) => book.id === 'GEN')).toBe(true);
    });

    it('retrieves Genesis 1 for the BSB translation', async () => {
        const result = await api.getTranslationBookChapter({
            translation: 'BSB',
            book: 'GEN',
            chapter: 1,
        });

        expect(result.translation.id).toBe('BSB');
        expect(result.book.id).toBe('GEN');
        expect(result.chapter.number).toBe(1);
        expect(result.numberOfVerses).toBeGreaterThan(0);
        expect(result.chapter.content.length).toBeGreaterThan(0);
    });

    it('retrieves the next chapter for the BSB translation', async () => {
        const result = await api.getTranslationBookChapter({
            translation: 'BSB',
            book: 'GEN',
            chapter: 1,
        });
        
        const nextChapterResult = await api.getNextChapter(result);
        expect(nextChapterResult).not.toBeNull();
        expect(nextChapterResult!.translation.id).toBe('BSB');
        expect(nextChapterResult!.book.id).toBe('GEN');
        expect(nextChapterResult!.chapter.number).toBe(2);
        expect(nextChapterResult!.numberOfVerses).toBeGreaterThan(0);
        expect(nextChapterResult!.chapter.content.length).toBeGreaterThan(0);
    });

    it('retrieves the previous chapter for the BSB translation', async () => {
        const result = await api.getTranslationBookChapter({
            translation: 'BSB',
            book: 'GEN',
            chapter: 2,
        });
        
        const previousChapterResult = await api.getPreviousChapter(result);
        expect(previousChapterResult).not.toBeNull();
        expect(previousChapterResult!.translation.id).toBe('BSB');
        expect(previousChapterResult!.book.id).toBe('GEN');
        expect(previousChapterResult!.chapter.number).toBe(1);
        expect(previousChapterResult!.numberOfVerses).toBeGreaterThan(0);
        expect(previousChapterResult!.chapter.content.length).toBeGreaterThan(0);
    });
});