import { watchEffect } from 'vue';
import {
    defineClientConfig,
    resolvers,
    usePageFrontmatter,
    usePageLang,
} from 'vuepress/client';
import HomeLayout from './layouts/HomeLayout.vue';
import NotFound from './layouts/NotFound.vue';

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
        HomeLayout,
        NotFound,
    },

    // Arabic and Urdu read right to left. The page's `lang` is set from the
    // locale, but nothing sets `dir`, so do it here as the reader switches
    // languages. The home page's content lives in HomePage.vue and is only
    // written in English, so it stays left to right in every locale.
    setup() {
        if (__VUEPRESS_SSR__) {
            return;
        }
        const lang = usePageLang();
        const frontmatter = usePageFrontmatter();
        watchEffect(() => {
            document.documentElement.dir =
                frontmatter.value.layout === 'HomeLayout'
                    ? 'ltr'
                    : textDirection(lang.value);
        });
    },
});
