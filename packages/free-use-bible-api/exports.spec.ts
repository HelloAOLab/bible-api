import { FreeUseBibleApi } from './index';

it('should export the FreeUseBibleApi class', async () => {
    expect(FreeUseBibleApi).toBeDefined();
    expect(typeof FreeUseBibleApi).toBe('function');
});