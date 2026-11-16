import { watchEffect } from 'vue';
import {
    defineClientConfig,
    resolvers,
    useSiteLocaleData,
} from 'vuepress/client';
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
