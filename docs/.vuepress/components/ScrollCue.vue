<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vuepress/client';
import { useLabels } from '../composables/useLocale';

/*
 * The scroll cue on every page. It looks like the theme's back-to-top button
 * (same circle, progress ring and icon, from @vuepress/plugin-back-to-top),
 * but the icon points down and a click moves to the next section (or the
 * next heading on a docs page, or a screen further down). It fades out near
 * the bottom of the page and on pages too short to scroll. The theme's own
 * button is turned off in config.ts.
 */

const labels = useLabels();
const route = useRoute();

const cue = ref<HTMLButtonElement>();
const progress = ref(0);
const hidden = ref(true);

const reducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const navbarHeight = () =>
    document.querySelector<HTMLElement>('.vp-navbar')?.offsetHeight ?? 0;

function targets() {
    return Array.from(
        document.querySelectorAll<HTMLElement>(
            'main > section, .fuba-footer, .vp-page [vp-content] h2, .vp-page [vp-content] h3'
        )
    );
}

function update() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - innerHeight;
    progress.value = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
    hidden.value = max < 200 || scrollY + innerHeight >= doc.scrollHeight - 160;
}

// The plugin's ring: a dash as long as the share of the page read.
const dash = () => {
    const pct = progress.value * 100;
    return `${Math.PI * pct * 0.48} ${Math.PI * (100 - pct) * 0.48}`;
};

function next() {
    const head = navbarHeight();
    const target = targets().find(
        (t) =>
            t.getBoundingClientRect().top > head + 8 &&
            (t.tagName !== 'SECTION' || t.offsetHeight > 150)
    );
    const top = target
        ? target.getBoundingClientRect().top + scrollY - head - 8
        : scrollY + innerHeight * 0.85;
    window.scrollTo({ top, behavior: reducedMotion() ? 'auto' : 'smooth' });
}

onMounted(() => {
    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    update();
    // Content can finish laying out after mount (fonts, the wall, images).
    setTimeout(update, 600);
});
onBeforeUnmount(() => {
    removeEventListener('scroll', update);
    removeEventListener('resize', update);
});
watch(
    () => route.path,
    () => nextTick(() => setTimeout(update, 50))
);
</script>

<template>
    <button
        ref="cue"
        type="button"
        class="vp-back-to-top-button fuba-scroll-cue"
        :class="{ gone: hidden }"
        :aria-label="labels.home.scrollCue"
        :tabindex="hidden ? -1 : 0"
        @click="next"
    >
        <span class="vp-scroll-progress" aria-hidden="true">
            <svg>
                <circle
                    cx="26"
                    cy="26"
                    r="24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="4"
                    :stroke-dasharray="dash()"
                />
            </svg>
        </span>
        <div class="back-to-top-icon" aria-hidden="true"></div>
    </button>
</template>

<style lang="scss">
/* From @vuepress/plugin-back-to-top 2.0.0-rc.131 (config.css and
   BackToTop.css), so the button looks the same as before. */
:root {
    --back-to-top-icon: url("data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Cpath fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='4' d='M24.008 14.1V42M12 26l12-12 12 12M12 6h24'/%3E%3C/svg%3E");
    --back-to-top-c-bg: var(--vp-c-bg);
    --back-to-top-c-accent-bg: var(--vp-c-accent-bg);
    --back-to-top-c-accent-hover: var(--vp-c-accent-hover);
    --back-to-top-c-shadow: var(--vp-c-shadow);
    --back-to-top-c-icon: currentcolor;
}

.vp-back-to-top-button {
    inset-inline-end: 1rem;
    z-index: 100;
    background: var(--back-to-top-c-bg);
    width: 48px;
    height: 48px;
    color: var(--back-to-top-c-accent-bg);
    box-shadow: 2px 2px 10px 4px var(--back-to-top-c-shadow);
    cursor: pointer;
    border-width: 0;
    border-radius: 50%;
    padding: 12px;
    bottom: 4rem;
    position: fixed !important;
    transition: opacity 0.25s ease;
}
@media (max-width: 959px) {
    .vp-back-to-top-button {
        transform-origin: 100% 100%;
        transform: scale(0.8);
    }
}
@media print {
    .vp-back-to-top-button {
        display: none;
    }
}
.vp-back-to-top-button:hover {
    color: var(--back-to-top-c-accent-hover);
}
.vp-back-to-top-button .back-to-top-icon {
    background: var(--back-to-top-c-icon);
    width: 24px;
    height: 24px;
    -webkit-mask-image: var(--back-to-top-icon);
    mask-image: var(--back-to-top-icon);
    margin: 0 auto;
    overflow: hidden;
    -webkit-mask-position: 50%;
    mask-position: 50%;
    -webkit-mask-size: cover;
    mask-size: cover;
}
.vp-scroll-progress {
    inset-inline-end: -2px;
    width: 52px;
    height: 52px;
    position: absolute;
    bottom: -2px;
}
.vp-scroll-progress svg {
    width: 100%;
    height: 100%;
}
.vp-scroll-progress circle {
    opacity: 0.9;
    transform-origin: 50%;
    transform: rotate(-90deg);
}

/* Ours: the icon points down, and the button fades out at the bottom. */
.fuba-scroll-cue .back-to-top-icon {
    transform: rotate(180deg);
}
.fuba-scroll-cue.gone {
    opacity: 0;
    pointer-events: none;
}
</style>
