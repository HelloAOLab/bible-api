import { useRouteLocale } from 'vuepress/client';

/**
 * Returns a function that turns an English page path ("/guide/") into the
 * same page in the language being viewed ("/es/guide/"), so links in the
 * custom layouts do not drop readers back into the English docs.
 */
export function useLocalePath() {
    const routeLocale = useRouteLocale();
    return (path: string) => routeLocale.value + path.replace(/^\//, '');
}
