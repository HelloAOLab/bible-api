<script setup lang="ts">
import { onMounted, ref, resolveComponent } from 'vue';
import { RouteLink } from 'vuepress/client';
import ParentLayout from '@vuepress/theme-default/layouts/Layout.vue';
import SiteFooter from '../components/SiteFooter.vue';

// Registered globally by the search plugin. Resolved here, as the theme's
// navbar does, so it renders in the build-time HTML as well as the browser.
const SearchBox = resolveComponent('SearchBox');

// The navbar already has a search box bound to the "s" and "/" hotkeys, so
// the one on this page gets none of its own.
const searchLocales = { '/': { placeholder: 'Search the docs' } };

// Show the address that failed, so a typo is easy to spot. It is only known
// in the browser, since the 404 page is rendered once at build time.
const missingPath = ref('');

// A random scene from ascii.rest. It is picked in the browser, not at build
// time, so each visit can get a different one without the build-time HTML
// disagreeing with the page once it loads.
const SCENES = [
    'alpine-dawn',
    'aurora-fjord',
    'deep-reef',
    'desert-night',
    'earthrise',
    'kyoto-dusk',
    'marine-drive',
    'misty-forest',
    'night-coast',
    'ocean-sunset',
    'storm-plains',
    'varanasi-ghats',
];
const scene = ref('');

// The scene runs in a sandboxed iframe, so ascii.rest's script has no access
// to this page: no cookies, storage, DOM or navigation.
const sceneDoc = (piece: string) =>
    '<!doctype html><html><head><meta charset="utf-8">' +
    '<style>html,body{margin:0;height:100%;overflow:hidden}' +
    'ascii-art{display:block;width:100%;height:100%}</style>' +
    '<script type="module" src="https://ascii.rest/ascii.js"><' +
    '/script></head><body>' +
    `<ascii-art piece="${piece}"></ascii-art></body></html>`;

onMounted(() => {
    missingPath.value = decodeURI(window.location.pathname);
    scene.value = SCENES[Math.floor(Math.random() * SCENES.length)];
});
</script>

<template>
    <ParentLayout>
        <template #page>
            <div class="fuba-404">
                <main class="not-found">
                    <iframe
                        v-if="scene"
                        class="scene"
                        sandbox="allow-scripts"
                        referrerpolicy="no-referrer"
                        :srcdoc="sceneDoc(scene)"
                        title="Decorative ASCII art scene"
                        aria-hidden="true"
                        tabindex="-1"
                    ></iframe>
                    <p class="code">Error 404</p>
                    <h1>Page not found</h1>
                    <p class="lead">
                        We couldn't find the page you were looking for. The link
                        may be broken, or the page may have moved.
                    </p>
                    <p v-if="missingPath" class="path">
                        <code>{{ missingPath }}</code>
                    </p>

                    <div class="search">
                        <p class="label">Search the docs</p>
                        <SearchBox :locales="searchLocales" :hot-keys="[]" />
                    </div>

                    <p class="label">Or try one of these</p>
                    <div class="options">
                        <RouteLink class="option" to="/">
                            <b>Home page</b>
                            <span>Start from the beginning of the docs.</span>
                        </RouteLink>
                        <RouteLink class="option" to="/guide/">
                            <b>Guide</b>
                            <span>Learn how to use the API, step by step.</span>
                        </RouteLink>
                    </div>
                </main>
                <SiteFooter />
            </div>
        </template>
    </ParentLayout>
</template>

<style lang="scss">
.fuba-404 {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    padding-top: var(--navbar-height);
    background: var(--vp-c-bg);
    color: var(--vp-c-text);

    .not-found {
        flex: 1;
        box-sizing: border-box;
        width: 100%;
        max-width: 640px;
        margin: 0 auto;
        padding: clamp(48px, 10vw, 112px) 28px clamp(56px, 10vw, 112px);
    }

    .scene {
        display: block;
        width: 100%;
        aspect-ratio: 2 / 1;
        margin: 0 0 40px;
        border: 0;
        border-radius: 10px;
    }

    .code {
        margin: 0;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--vp-c-text-mute);
    }

    h1 {
        margin: 10px 0 0;
        padding: 0;
        border: 0;
        font-size: clamp(36px, 6vw, 52px);
        font-weight: 700;
        line-height: 1.05;
        letter-spacing: -0.03em;
    }

    .lead {
        margin: 18px 0 0;
        font-size: 18px;
        line-height: 1.55;
        color: var(--fuba-text-2);
    }

    .path {
        margin: 14px 0 0;
        overflow-wrap: anywhere;

        code {
            font-size: 14px;
        }
    }

    .label {
        margin: 0 0 10px;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--vp-c-text-mute);
    }

    .search {
        margin: 40px 0 36px;
    }

    // The plugin styles its box for the navbar: small, and collapsed to an
    // icon on narrow screens. Here it is the main control, so make it full
    // width at every size.
    .search-box {
        display: block;
        margin: 0;

        input,
        input:focus {
            width: 100%;
            height: 48px;
            padding-inline: 2.5rem 1rem;
            border: 1px solid var(--vp-c-border);
            border-radius: 8px;
            background-position: 0.9rem 50%;
            font-size: 16px;
            line-height: 48px;
            cursor: text;
            inset-inline-start: 0;
        }
        input:focus {
            border-color: var(--fuba-line-strong);
        }
        .suggestions {
            top: 52px;
            inset-inline: 0;
            width: auto;
            z-index: 2;
        }
    }

    .options {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
    }

    .option {
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 18px 20px;
        border: 1px solid var(--vp-c-divider);
        border-radius: 10px;
        color: var(--vp-c-text);
        text-decoration: none;
        transition: border-color 0.15s ease;

        b {
            font-size: 16px;
        }
        b::after {
            content: ' \2192';
        }
        span {
            font-size: 14px;
            line-height: 1.45;
            color: var(--vp-c-text-mute);
        }
        &:hover {
            border-color: var(--fuba-line-strong);
        }
        &:focus-visible {
            outline: 2px solid var(--fuba-line-strong);
            outline-offset: 3px;
        }
    }

    @media (max-width: 620px) {
        .not-found {
            padding-inline: 16px;
        }
        .options {
            grid-template-columns: 1fr;
        }
    }
}
</style>
