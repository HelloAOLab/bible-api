import { watchEffect } from 'vue';
import {
    defineClientConfig,
    resolvers,
    useSiteLocaleData,
} from 'vuepress/client';
import AgentBootstrap from './components/AgentBootstrap.vue';
import NewsletterDialog from './components/NewsletterDialog.vue';
import ScrollCue from './components/ScrollCue.vue';
import FlywheelLayout from './layouts/FlywheelLayout.vue';
import FreeUseFundLayout from './layouts/FreeUseFundLayout.vue';
import HomeLayout from './layouts/HomeLayout.vue';
import NotFound from './layouts/NotFound.vue';
import OpenEcosystemLayout from './layouts/OpenEcosystemLayout.vue';
import SupportLayout from './layouts/SupportLayout.vue';

// Let a page set its full <title> through a `headTitle` frontmatter field,
// instead of the default "<page title> | <site title>".
const resolvePageHeadTitle = resolvers.resolvePageHeadTitle;
resolvers.resolvePageHeadTitle = (page, siteLocale) => {
    const headTitle = page.frontmatter.headTitle;
    return typeof headTitle === 'string'
        ? headTitle
        : resolvePageHeadTitle(page, siteLocale);
};

function textDirection(lang: string): 'ltr' | 'rtl' {
    try {
        const locale = new Intl.Locale(lang) as Intl.Locale & {
            getTextInfo?: () => { direction: 'ltr' | 'rtl' };
            textInfo?: { direction: 'ltr' | 'rtl' };
        };
        return (
            locale.getTextInfo?.().direction ??
            locale.textInfo?.direction ??
            'ltr'
        );
    } catch {
        return 'ltr';
    }
}

export default defineClientConfig({
    layouts: {
        FlywheelLayout,
        FreeUseFundLayout,
        HomeLayout,
        NotFound,
        OpenEcosystemLayout,
        SupportLayout,
    },

    // The newsletter dialog opens from any link with the class
    // js-newsletter-trigger. The scroll cue sits bottom right on every page.
    rootComponents: [NewsletterDialog, ScrollCue],

    // Components that markdown pages use by name.
    enhance({ app, router }) {
        app.component('AgentBootstrap', AgentBootstrap);

        if (__VUEPRESS_SSR__) {
            return;
        }
        // The links that seed-bible/referenceCodeLinks.mjs adds inside code
        // blocks are plain <a> tags, which the router doesn't see, so they
        // would reload the whole site. Send them through the router instead,
        // like the sidebar's links. A click meant to open a new tab or window
        // is left to the browser.
        document.addEventListener('click', (event) => {
            if (
                event.defaultPrevented ||
                event.button !== 0 ||
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey
            ) {
                return;
            }
            const link = (event.target as Element | null)?.closest?.(
                'a.code-link'
            );
            if (!(link instanceof HTMLAnchorElement)) {
                return;
            }
            const base = router.options.history.base;
            if (!link.pathname.startsWith(`${base}/`)) {
                return;
            }
            event.preventDefault();
            void router.push(
                link.pathname.slice(base.length) + link.search + link.hash
            );
        });
    },

    // Arabic and Urdu read right to left. The page's `lang` is set from the
    // locale, but nothing sets `dir`, so do it here as the reader switches
    // languages. It follows the locale of the address rather than the page,
    // since the one 404 page is shown in every locale.
    setup() {
        if (__VUEPRESS_SSR__) {
            return;
        }
        const siteLocale = useSiteLocaleData();
        watchEffect(() => {
            document.documentElement.dir = textDirection(siteLocale.value.lang);
        });
    },
});
