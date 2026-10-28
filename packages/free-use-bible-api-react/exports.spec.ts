import * as pkg from './index.js';

it('exports the managers, hooks, and components', () => {
    expect(typeof pkg.createBibleDataManager).toBe('function');
    expect(typeof pkg.createBibleReadingState).toBe('function');
    expect(typeof pkg.useBibleDataManager).toBe('function');
    expect(typeof pkg.useBibleReadingState).toBe('function');
    expect(typeof pkg.useSignalValue).toBe('function');
    expect(typeof pkg.BibleReader).toBe('function');
    expect(typeof pkg.ChapterContent).toBe('function');
});
