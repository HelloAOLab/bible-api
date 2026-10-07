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

export default defineUserConfig({
    base,
    lang: 'en-US',

    title,
    description: description,
    bundler: viteBundler() as any,

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
        navbar: [
            {
                text: 'Guide',
                link: '/guide/',
            },
            {
                text: 'Reference',
                link: '/reference/',
            },
            {
                text: 'SDKs',
                link: '/sdks/',
            },
            {
                text: 'GitHub',
                link: 'https://github.com/HelloAOLab/bible-api',
            },
            {
                text: 'Donate',
                link: 'https://better.giving/marketplace/1118469',
            },
        ],
        sidebar: {
            '/guide/': [
                {
                    text: 'Guide',
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
            '/reference/': [
                {
                    text: 'Reference',
                    collapsible: false,
                    children: [
                        '',
                        {
                            text: 'Translations, Books, & Chapters',
                            collapsible: true,
                            children: [
                                'translations/',
                                'translations/standard',
                                'translations/simplified',
                            ],
                        },
                        {
                            text: 'Commentaries',
                            collapsible: true,
                            children: ['commentaries/'],
                        },
                        {
                            text: 'Datasets',
                            collapsible: true,
                            children: ['datasets/'],
                        },
                        'openapi',
                    ],
                },
            ],
            '/sdks/': [
                {
                    text: 'SDKs',
                    collapsible: false,
                    children: ['', 'javascript'],
                },
            ],
        },
    }),

    plugins: [
        searchPlugin(),
        shikiPlugin({
            // options
            langs: ['ts', 'json'],
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
