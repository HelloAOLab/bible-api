import { isEmptyOrWhitespace } from "./utils";


describe('isEmptyOrWhitespace()', () => {
    const cases = [
        ['emtpy', true, ''] as const,
        ['null', true, null] as const,
        ['undef', true, undefined] as const,
        ['space', true, ' '] as const,
        ['tab', true, '\t'] as const,
        ['letters', false, 'abc'] as const,
        ['newline', true, '\n'] as const,
    ] as const;

    it.each(cases)('should return %s for %s', (_desc, expected, input) => {
        expect(isEmptyOrWhitespace(input)).toBe(expected);
    });
});