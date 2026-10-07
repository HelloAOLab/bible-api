import {
    computed,
    inject,
    onMounted,
    provide,
    ref,
    type ComputedRef,
    type InjectionKey,
} from 'vue';
import { useRouteLocale } from 'vuepress/client';
import type { Labels } from '../labels';

// Every locale's labels, keyed by locale path. Defined in config.ts.
declare const __SITE_LABELS__: Record<string, Labels>;

const localeKey: InjectionKey<ComputedRef<string>> = Symbol('locale');

/**
 * The locale path ("/", "/es/") the custom layouts should render in: the
 * route's, unless an ancestor chose otherwise with `provideLocaleAfterMount`.
 */
export function useLocale(): ComputedRef<string> {
    return inject(localeKey, null) ?? useRouteLocale();
}

/**
 * There is one 404 page for every locale, rendered at build time in English.
 * Rendering it in the reader's language straight away would make the browser
 * disagree with the build-time HTML, so switch to it once mounted.
 */
export function provideLocaleAfterMount(): ComputedRef<string> {
    const routeLocale = useRouteLocale();
    const mounted = ref(false);
    onMounted(() => {
        mounted.value = true;
    });
    const locale = computed(() => (mounted.value ? routeLocale.value : '/'));
    provide(localeKey, locale);
    // A component cannot inject what it provides, so the caller passes this
    // to useLabels() and useLocalePath() itself.
    return locale;
}

/** The text of the custom layouts, in the language being viewed. */
export function useLabels(locale = useLocale()): ComputedRef<Labels> {
    return computed(
        () => __SITE_LABELS__[locale.value] ?? __SITE_LABELS__['/']
    );
}

/**
 * Returns a function that turns an English page path ("/guide/") into the
 * same page in the language being viewed ("/es/guide/"), so links in the
 * custom layouts do not drop readers back into the English docs.
 */
export function useLocalePath(locale = useLocale()) {
    return (path: string) => locale.value + path.replace(/^\//, '');
}
