import { defineClientConfig, resolvers } from 'vuepress/client';
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

export default defineClientConfig({
    layouts: {
        HomeLayout,
        NotFound,
    },
});
