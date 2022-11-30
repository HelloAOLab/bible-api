import { usfmParser } from './usfm-parser';

it('should return the correct value', () => {
    expect(usfmParser()).toBe('Hello world!');
});
