import { defineUserConfig } from 'vuepress';
import { backToTopPlugin } from '@vuepress/plugin-back-to-top';
import { mediumZoomPlugin } from '@vuepress/plugin-medium-zoom';
import { defaultTheme } from '@vuepress/theme-default';
import { viteBundler } from '@vuepress/bundler-vite';
import { searchPlugin } from '@vuepress/plugin-search';
import { seoPlugin } from '@vuepress/plugin-seo';
import { shikiPlugin } from '@vuepress/plugin-shiki';
import { sitemapPlugin } from '@vuepress/plugin-sitemap';
import { markdownIncludePlugin } from '@vuepress/plugin-markdown-include';
import type {
    DefaultThemeLocaleData,
    NavbarOptions,
    SidebarOptions,
} from '@vuepress/theme-default';
import type { SiteLocaleConfig } from 'vuepress';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { mergeLabels, type Labels } from './labels';
import type { Verses } from './verses';

const hostname = 'https://bible.helloao.org';
const base = '/docs/';
const title = 'Free Use Bible API';
const ogImage = `${hostname}${base}og-image.png`;

// Used as the site-wide fallback <meta name="description"> for any page that
// does not set its own `description` in frontmatter.
const description =
    'An easy-to-use and fully featured JSON API for Scripture. ' +
    'No API key, no usage limits, no copyright restrictions.';

/** Turns a page path into an absolute URL, including the `/docs/` base. */
const absolute = (path: string) =>
    `${hostname}${base}${path.replace(/^\//, '')}`;

/**
 * The chain of pages leading to `path`, starting at the site root.
 *
 * `/reference/translations/standard.html` becomes
 * `['/', '/reference/', '/reference/translations/', '/reference/translations/standard.html']`.
 */
const breadcrumbTrail = (path: string): string[] => {
    const segments = path.split('/').filter(Boolean);
    const trail = ['/'];
    let prefix = '';

    segments.forEach((segment, i) => {
        if (i === segments.length - 1 && segment.endsWith('.html')) {
            trail.push(`${prefix}/${segment}`);
        } else {
            prefix += `/${segment}`;
            trail.push(`${prefix}/`);
        }
    });

    return trail;
};

/** Fallback crumb label for the unlikely case that an ancestor has no page. */
const humanize = (path: string) =>
    path
        .replace(/\/$/, '')
        .split('/')
        .pop()!
        .replace(/\.html$/, '')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());

/**
 * Crumb labels for the section landing pages, which are titled by their H1
 * ("Introduction", "API") rather than by the name the navbar and sidebar use.
 * A breadcrumb that reads "Home > Introduction > Getting Started" does not
 * match how the site presents itself.
 */
const sectionNames: Record<string, string> = {
    '/guide/': 'Guide',
    '/reference/': 'Reference',
};

/**
 * Written by tools/translate-docs.ts to the root of every machine-translated
 * copy of the docs.
 */
const TRANSLATED_DOCS_MARKER = '.translated-docs';

/**
 * Names that read better in the language selector than the ones
 * `Intl.DisplayNames` gives ("Indonesia", "中文（中国）"), or than capitalizing
 * them below would (isiZulu).
 */
const languageNameOverrides: Record<string, string> = {
    id: 'Bahasa Indonesia',
    'zh-CN': '简体中文',
    zu: 'isiZulu',
};

/**
 * The language codes of the translated docs, found by looking for the
 * directories that tools/translate-docs.ts generated. A newly translated
 * language shows up in the language selector without touching this file.
 */
const docsDir = path.resolve(__dirname, '..');
const translatedLanguages = readdirSync(docsDir, { withFileTypes: true })
    .filter(
        (entry) =>
            entry.isDirectory() &&
            existsSync(path.join(docsDir, entry.name, TRANSLATED_DOCS_MARKER))
    )
    .map((entry) => entry.name)
    .sort();

/** The name of a language, written in that language. */
const nativeLanguageName = (lang: string) => {
    if (languageNameOverrides[lang]) {
        return languageNameOverrides[lang];
    }
    const name = new Intl.DisplayNames([lang], { type: 'language' }).of(lang);
    if (!name || name === lang) {
        return lang;
    }
    // Some languages write their own names in lowercase ("español"), which
    // looks out of place in a menu.
    return name.charAt(0).toLocaleUpperCase(lang) + name.slice(1);
};

const englishLabels: Labels = JSON.parse(
    readFileSync(path.join(__dirname, 'labels.json'), 'utf8')
);

/** The labels for a translation, with English for any it is missing. */
const labelsFor = (lang: string): Labels => {
    const file = path.join(docsDir, lang, 'labels.json');
    return existsSync(file)
        ? mergeLabels(englishLabels, JSON.parse(readFileSync(file, 'utf8')))
        : englishLabels;
};

const navbar = (prefix: string, labels: Labels): NavbarOptions => [
    {
        text: labels.nav.guide,
        link: `${prefix}guide/`,
    },
    {
        text: labels.nav.reference,
        link: `${prefix}reference/`,
    },
    {
        text: labels.nav.sdks,
        link: `${prefix}sdks/`,
    },
    {
        text: 'GitHub',
        link: 'https://github.com/HelloAOLab/bible-api',
    },
    {
        text: labels.nav.donate,
        link: 'https://better.giving/marketplace/1118469',
    },
];

const sidebar = (prefix: string, labels: Labels): SidebarOptions => ({
    [`${prefix}guide/`]: [
        {
            text: labels.nav.guide,
            collapsible: false,
            children: [
                '',
                'getting-started',
                'making-requests',
                'downloads',
                'a-biblical-model-for-licensing-the-bible',
            ],
        },
    ],
    [`${prefix}reference/`]: [
        {
            text: labels.nav.reference,
            collapsible: false,
            children: [
                '',
                {
                    text: labels.nav.translationsBooksChapters,
                    link: 'translations/',
                    collapsible: true,
                    children: [
                        'translations/standard',
                        'translations/simplified',
                    ],
                },
                {
                    text: labels.nav.commentaries,
                    link: 'commentaries/',
                },
                {
                    text: labels.nav.datasets,
                    link: 'datasets/',
                },
                'openapi',
            ],
        },
    ],
    [`${prefix}sdks/`]: [
        {
            text: labels.nav.sdks,
            collapsible: false,
            children: ['', 'javascript'],
        },
    ],
});

/** Per-language site settings, keyed by the path each language lives under. */
const siteLocales: Record<string, SiteLocaleConfig> = {
    '/': { lang: 'en-US' },
    ...Object.fromEntries(
        translatedLanguages.map((lang) => [`/${lang}/`, { lang }])
    ),
};

/**
 * Per-language theme settings. `selectLanguageName` is what the navbar's
 * language selector lists, which the theme only shows when there is more
 * than one locale.
 */
const themeLocales: Record<string, DefaultThemeLocaleData> = {
    '/': {
        selectLanguageName: 'English',
        navbar: navbar('/', englishLabels),
        sidebar: sidebar('/', englishLabels),
    },
    ...Object.fromEntries(
        translatedLanguages.map((lang) => {
            const labels = labelsFor(lang);
            return [
                `/${lang}/`,
                {
                    selectLanguageName: nativeLanguageName(lang),
                    selectLanguageText: labels.nav.languages,
                    selectLanguageAriaLabel: labels.nav.selectLanguage,
                    navbar: navbar(`/${lang}/`, labels),
                    sidebar: sidebar(`/${lang}/`, labels),
                },
            ];
        })
    ),
};

/**
 * Every locale's labels, keyed like `locales`, for the custom layouts to read
 * through `useLabels()`.
 */
const siteLabels: Record<string, Labels> = {
    '/': englishLabels,
    ...Object.fromEntries(
        translatedLanguages.map((lang) => [`/${lang}/`, labelsFor(lang)])
    ),
};

/**
 * Every locale's home page verses, keyed like `locales`. See verses.ts.
 */
const readVerses = (file: string): Verses =>
    existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {};
const siteVerses: Record<string, Verses> = {
    '/': readVerses(path.join(__dirname, 'verses.json')),
    ...Object.fromEntries(
        translatedLanguages.map((lang) => [
            `/${lang}/`,
            readVerses(path.join(docsDir, lang, 'verses.json')),
        ])
    ),
};

// Translated section landing pages get translated crumb labels too.
for (const lang of translatedLanguages) {
    const labels = siteLabels[`/${lang}/`];
    sectionNames[`/${lang}/guide/`] = labels.nav.guide;
    sectionNames[`/${lang}/reference/`] = labels.nav.reference;
}

export default defineUserConfig({
    base,
    lang: 'en-US',
    locales: siteLocales,

    define: {
        __SITE_LABELS__: siteLabels,
        __SITE_VERSES__: siteVerses,
    },

    title,
    description: description,
    bundler: viteBundler() as any,

    extendsPage: (page) => {
        // The 404 page has no sidebar of its own (the theme otherwise warns
        // about it), and should not be titled after the site home.
        if (page.path === '/404.html') {
            page.title = page.data.title = 'Page not found';
            page.frontmatter.title = page.title;
            page.frontmatter.sidebar = false;
        }
    },

    head: [
        ['link', { rel: 'icon', href: '/docs/favicon.png' }],
        ['link', { rel: 'apple-touch-icon', href: '/docs/favicon.png' }],
        ['meta', { name: 'theme-color', content: '#ffffff' }],
        // og:type/title/description/image are emitted per page by seoPlugin
        // below, so they are deliberately not set here: a static site-wide
        // value would give every page the home page's card.
        //
        // Every page does share the same 1200x630 image, so the card type can
        // be set globally. Without this the seo plugin only emits twitter:card
        // for pages that declare their own `banner`/`cover`, and X renders the
        // small summary card instead of the large one.
        ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
        ['meta', { name: 'twitter:image', content: ogImage }],
        ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
        [
            'meta',
            { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
        ],
    ],

    theme: defaultTheme({
        logo: '/seed_bible_logo.png',
        logoDark: '/seed_bible_logo_dark.png',
        logoAlt: 'Seed Bible',
        themePlugins: {
            // Disable the default theme's built-in prismjs highlighter since
            // shikiPlugin (registered below) already highlights code blocks.
            // Having both enabled caused code fences (and their titles) to be
            // rendered twice.
            prismjs: false,
        },
        repo: '',
        editLink: false,
        docsDir: '',
        editLinkText: '',
        lastUpdated: false,
        contributors: false,
        locales: themeLocales,
    }),

    plugins: [
        searchPlugin({
            // A home page's markdown body holds contributor notes for GitHub
            // that HomeLayout never renders, so keep its headings out of search.
            isSearchable: (page) => page.frontmatter.layout !== 'HomeLayout',
        }),
        shikiPlugin({
            // options
            langs: ['ts', 'json', 'bash'],
            theme: 'dark-plus',
        }),
        seoPlugin({
            hostname,
            author: {
                name: 'AO Lab',
                url: 'https://helloao.org/',
            },
            fallBackImage: ogImage,
            // The plugin's string form of `canonical` ignores `base`, which
            // would emit https://bible.helloao.org/guide/ instead of
            // https://bible.helloao.org/docs/guide/. Build it explicitly.
            canonical: (page) =>
                `${hostname}${base}${page.path.replace(/^\//, '')}`,
            // Only the guides are articles. Typing the API reference and the
            // SDK index as Article (with an author) misdescribes them, and it
            // would also give them og:type=article.
            isArticle: (page) => page.path.startsWith('/guide/'),
            // Defensive fallbacks: a page without its own title/description
            // would otherwise get an empty og:title or og:description.
            ogp: (ogp) => ({
                ...ogp,
                'og:title': ogp['og:title'] || title,
                'og:description': ogp['og:description'] || description,
            }),
            jsonLd: (jsonLd) => {
                const next: Record<string, unknown> = { ...jsonLd };

                if (next['@type'] === 'Article') {
                    // Developer documentation, not general-interest writing.
                    next['@type'] = 'TechArticle';
                } else {
                    next.name = next.name || title;
                }

                // `lastUpdated` and the git plugin are both off, so the plugin
                // emits `dateModified: null`. A literal null is not a valid
                // schema.org Date, so drop empty values entirely.
                for (const [key, value] of Object.entries(next)) {
                    if (value == null) {
                        delete next[key];
                    }
                }

                return next as typeof jsonLd;
            },
            // Breadcrumbs are a separate JSON-LD block, so they go in via
            // customHead rather than the single-object `jsonLd` hook.
            customHead: (head, page, app) => {
                if (page.path === '/404.html') {
                    return;
                }

                const trail = breadcrumbTrail(page.path);

                // A lone "Home" crumb tells search engines nothing.
                if (trail.length < 2) {
                    return;
                }

                head.push([
                    'script',
                    { type: 'application/ld+json' },
                    JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'BreadcrumbList',
                        itemListElement: trail.map((path, i) => ({
                            '@type': 'ListItem',
                            position: i + 1,
                            name:
                                i === 0
                                    ? 'Home'
                                    : sectionNames[path] ||
                                      app.pages.find((p) => p.path === path)
                                          ?.title ||
                                      humanize(path),
                            item: absolute(path),
                        })),
                    }),
                ]);
            },
        }),
        sitemapPlugin({
            hostname,
        }),
        backToTopPlugin(),
        mediumZoomPlugin(),
        markdownIncludePlugin({}),
    ],
});
