import {
    ccLicenseFromUrl,
    extractCcLicenseFromDetailsHtml,
    isPublicDomainCopyrightText,
    detectEBibleLicense,
} from './ebible-license';

describe('ccLicenseFromUrl()', () => {
    const cases = [
        [
            'https://creativecommons.org/licenses/by/4.0/',
            {
                attribution: 'required',
                commercialUse: 'allowed',
                derivatives: 'allowed',
                copyleft: false,
                publicDomain: false,
            },
        ],
        [
            'https://creativecommons.org/licenses/by-sa/4.0/',
            {
                attribution: 'required',
                commercialUse: 'allowed',
                derivatives: 'allowed',
                copyleft: true,
                publicDomain: false,
            },
        ],
        [
            'https://creativecommons.org/licenses/by-nd/4.0/',
            {
                attribution: 'required',
                commercialUse: 'allowed',
                derivatives: 'not-allowed',
                copyleft: false,
                publicDomain: false,
            },
        ],
        [
            'https://creativecommons.org/licenses/by-nc/4.0/',
            {
                attribution: 'required',
                commercialUse: 'not-allowed',
                derivatives: 'allowed',
                copyleft: false,
                publicDomain: false,
            },
        ],
        [
            'https://creativecommons.org/licenses/by-nc-sa/4.0/',
            {
                attribution: 'required',
                commercialUse: 'not-allowed',
                derivatives: 'allowed',
                copyleft: true,
                publicDomain: false,
            },
        ],
        [
            'https://creativecommons.org/licenses/by-nc-nd/4.0/',
            {
                attribution: 'required',
                commercialUse: 'not-allowed',
                derivatives: 'not-allowed',
                copyleft: false,
                publicDomain: false,
            },
        ],
        [
            'https://creativecommons.org/publicdomain/zero/1.0/',
            {
                attribution: 'not-required',
                commercialUse: 'allowed',
                derivatives: 'allowed',
                copyleft: false,
                publicDomain: true,
            },
        ],
        [
            'https://creativecommons.org/publicdomain/mark/1.0/',
            {
                attribution: 'not-required',
                commercialUse: 'allowed',
                derivatives: 'allowed',
                copyleft: false,
                publicDomain: true,
            },
        ],
        [
            'HTTPS://WWW.CREATIVECOMMONS.ORG/LICENSES/BY-SA/4.0/',
            {
                attribution: 'required',
                commercialUse: 'allowed',
                derivatives: 'allowed',
                copyleft: true,
                publicDomain: false,
            },
        ],
        ['https://example.com/licenses/by/4.0/', null],
        ['not a url at all', null],
    ] as const;

    it.each(cases)('should map %s', (url, expected) => {
        expect(ccLicenseFromUrl(url)).toEqual(expected);
    });
});

describe('extractCcLicenseFromDetailsHtml()', () => {
    it('should find a creativecommons.org link inside prose', () => {
        const html = `
            <html>
                <body>
                    <p>Copyright 2020 Some Org.</p>
                    <p>This translation is made available under a
                    <a href="https://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0</a>
                    license.</p>
                </body>
            </html>
        `;

        expect(extractCcLicenseFromDetailsHtml(html)).toEqual({
            attribution: 'required',
            commercialUse: 'allowed',
            derivatives: 'allowed',
            copyleft: true,
            publicDomain: false,
        });
    });

    it('should find a creativecommons.org link with a www prefix and query string', () => {
        const html = `<a href="https://www.creativecommons.org/licenses/by/4.0/?ref=ebible">License</a>`;

        expect(extractCcLicenseFromDetailsHtml(html)).toEqual({
            attribution: 'required',
            commercialUse: 'allowed',
            derivatives: 'allowed',
            copyleft: false,
            publicDomain: false,
        });
    });

    it('should return null when there is no creativecommons.org link', () => {
        const html = `
            <html>
                <body>
                    <p>Copyright 2020 Some Org. All rights reserved.</p>
                    <a href="https://ebible.org/">Home</a>
                </body>
            </html>
        `;

        expect(extractCcLicenseFromDetailsHtml(html)).toBeNull();
    });
});

describe('isPublicDomainCopyrightText()', () => {
    const cases = [
        ['This work has been dedicated to the Public Domain.', true],
        ['public domain', true],
        ['PUBLIC DOMAIN', true],
        ['Copyright 2020 Some Org. All rights reserved.', false],
        [null, false],
        [undefined, false],
        ['', false],
    ] as const;

    it.each(cases)('should evaluate %s as %s', (copyright, expected) => {
        expect(isPublicDomainCopyrightText(copyright)).toBe(expected);
    });
});

describe('detectEBibleLicense()', () => {
    const originalFetch = global.fetch;

    afterEach(() => {
        global.fetch = originalFetch;
        jest.restoreAllMocks();
    });

    it('should use the license from a creativecommons.org link on the details page', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            text: async () =>
                `<a href="https://creativecommons.org/licenses/by-sa/4.0/">License</a>`,
        }) as any;

        const license = await detectEBibleLicense({
            id: 'engwmb',
            copyright: 'Copyright 2015 Some Org. Public domain.',
        });

        expect(license).toEqual({
            attribution: 'required',
            commercialUse: 'allowed',
            derivatives: 'allowed',
            copyleft: true,
            publicDomain: false,
        });
    });

    it('should fall back to the copyright text when the details page has no CC link', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            text: async () => `<a href="https://ebible.org/">Home</a>`,
        }) as any;

        const license = await detectEBibleLicense({
            id: 'engwmb',
            copyright: 'This text has been dedicated to the public domain.',
        });

        expect(license).toEqual({
            attribution: 'not-required',
            commercialUse: 'allowed',
            derivatives: 'allowed',
            copyleft: false,
            publicDomain: true,
        });
    });

    it('should fall back to the copyright text when the fetch fails', async () => {
        global.fetch = jest.fn().mockRejectedValue(new Error('network error')) as any;

        const license = await detectEBibleLicense({
            id: 'engwmb',
            copyright: 'Public Domain.',
        });

        expect(license).toEqual({
            attribution: 'not-required',
            commercialUse: 'allowed',
            derivatives: 'allowed',
            copyleft: false,
            publicDomain: true,
        });
    });

    it('should return null when neither signal is present', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            text: async () => `<a href="https://ebible.org/">Home</a>`,
        }) as any;

        const license = await detectEBibleLicense({
            id: 'engwmb',
            copyright: 'Copyright 2015 Some Org. All rights reserved.',
        });

        expect(license).toBeNull();
    });

    it('should not consult the copyright text fallback when a CC link is found', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            text: async () =>
                `<a href="https://creativecommons.org/licenses/by-nc-nd/4.0/">License</a>`,
        }) as any;

        const license = await detectEBibleLicense({
            id: 'engwmb',
            copyright: 'This text has been dedicated to the public domain.',
        });

        expect(license).toEqual({
            attribution: 'required',
            commercialUse: 'not-allowed',
            derivatives: 'not-allowed',
            copyleft: false,
            publicDomain: false,
        });
    });
});
