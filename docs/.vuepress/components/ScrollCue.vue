<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vuepress/client';
import { useLabels } from '../composables/useLocale';

/*
 * The scroll cue on every page: a down arrow in a ring that fills as you
 * read. A click moves to the next section (or the next heading on a docs
 * page, or a screen further down). It fades out near the bottom of the page
 * and on pages too short to scroll. It replaces the theme's back-to-top
 * button.
 */

const labels = useLabels();
const route = useRoute();

const cue = ref<HTMLButtonElement>();
const progress = ref(0);
const hidden = ref(true);
const onInvert = ref(false);

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
    const el = cue.value;
    if (!el) return;
    const c = el.getBoundingClientRect();
    const y = c.top + c.height / 2;
    onInvert.value = Array.from(
        document.querySelectorAll('section.invert')
    ).some((s) => {
        const r = s.getBoundingClientRect();
        return y >= r.top && y <= r.bottom;
    });
}

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
        class="fuba-scroll-cue"
        :class="{ 'on-invert': onInvert, gone: hidden }"
        :aria-label="labels.home.scrollCue"
        :tabindex="hidden ? -1 : 0"
        @click="next"
    >
        <svg class="cue-ring" viewBox="0 0 48 48" aria-hidden="true">
            <circle class="cue-track" cx="24" cy="24" r="22" />
            <circle
                class="cue-fill"
                cx="24"
                cy="24"
                r="22"
                pathLength="100"
                :stroke-dashoffset="100 - progress * 100"
            />
        </svg>
        <svg
            class="cue-arrow"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
        >
            <path d="M12 5v14M6 13l6 6 6-6" />
        </svg>
    </button>
</template>

<style lang="scss">
.fuba-scroll-cue {
    position: fixed;
    right: clamp(16px, 2.4vw, 32px);
    bottom: clamp(16px, 2.4vw, 32px);
    z-index: 40;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: var(--vp-c-bg);
    color: var(--vp-c-text);
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12);
    transition:
        opacity 0.25s ease,
        color 0.2s ease,
        background 0.2s ease;

    &.on-invert {
        background: var(--vp-c-accent-bg);
        color: var(--vp-c-accent-text);
    }
    &.gone {
        opacity: 0;
        pointer-events: none;
    }
    .cue-ring {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        transform: rotate(-90deg);
        fill: none;
        stroke-width: 2.5;
    }
    .cue-track {
        stroke: color-mix(in srgb, currentColor 18%, transparent);
    }
    .cue-fill {
        stroke: currentColor;
        stroke-dasharray: 100;
        stroke-linecap: round;
        transition: stroke-dashoffset 0.1s linear;
    }
    .cue-arrow {
        position: relative;
        width: 20px;
        height: 20px;
        animation: fuba-cue-sway 4.5s ease-in-out 1.5s infinite;
    }
    @media (hover: hover) {
        &:hover .cue-arrow {
            animation-play-state: paused;
        }
    }
    @media (prefers-reduced-motion: reduce) {
        .cue-arrow {
            animation: none;
        }
        .cue-fill {
            transition: none;
        }
    }
    @media print {
        display: none;
    }
}

@keyframes fuba-cue-sway {
    0%,
    72%,
    100% {
        transform: rotate(0);
    }
    78% {
        transform: rotate(-16deg);
    }
    86% {
        transform: rotate(12deg);
    }
    93% {
        transform: rotate(-5deg);
    }
}
</style>
