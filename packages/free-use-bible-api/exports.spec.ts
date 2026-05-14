import { getAvailableTranslations } from './index';

it('should export the getAvailableTranslations function', async () => {
    expect(getAvailableTranslations).toBeDefined();
    expect(typeof getAvailableTranslations).toBe('function');
});
