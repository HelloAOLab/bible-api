<script setup lang="ts">
/**
 * The relay on the home page's #since section: one mark per generation from
 * Paul's letters to the reader, filled in order when it scrolls into view.
 *
 * It is also a hidden timeline. On desktop the reader's dot can be dragged
 * (or moved with the arrow keys) from Paul's letters toward "You". Nothing
 * changes until someone does; then the stops, the five activity words in the
 * section's paragraph, and a short panel come alive. On touch screens and
 * narrow windows the line stays a static picture.
 *
 * Styles are in HomePage.vue (.relay, .relay-panel). Milestones are in
 * ../relayMilestones.ts.
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { useLabels } from '../composables/useLocale';
import {
    RELAY_ACTS,
    RELAY_MILESTONES as M,
    type RelayMilestone,
} from '../relayMilestones';

const DOTS = 66;
const N = M.length;

const labels = useLabels();
const t = computed(() => labels.value.home.timeline);

const fig = ref<HTMLElement>();
const line = ref<HTMLElement>();
const panel = ref<HTMLElement>();

const go = ref(false);
const canDrag = ref(false);
const live = ref(false);
const dragging = ref(false);
const idx = ref(0);

const m = computed<RelayMilestone>(() => M[idx.value]);
// Keep the last two words of a title together.
const title = computed(() => m.value.title.replace(/ (\S+)$/, ' $1'));

let you: HTMLElement | null = null;
let dots: HTMLElement[] = [];
let words: HTMLElement[] = [];
let section: HTMLElement | null = null;
let cur = 0;
let maxX = 0;
let drag: { x: number } | null = null;
const cleanups: (() => void)[] = [];

const reducedMotion = () =>
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

function measure() {
    if (!line.value || !you) return;
    maxX = Math.max(0, line.value.clientWidth - you.offsetWidth);
}

function place(x: number, ease = false) {
    if (!you) return;
    cur = Math.max(0, Math.min(maxX, x));
    you.style.transition = ease ? 'translate .22s ease' : 'none';
    you.style.translate = `${cur}px 0`;
    const c = cur + you.offsetWidth / 2;
    dots.forEach((d) =>
        d.classList.toggle('past', d.offsetLeft + d.offsetWidth / 2 <= c)
    );
}

function show(i: number) {
    idx.value = i;
    const acts = M[i].acts.map((a) => RELAY_ACTS.indexOf(a));
    words.forEach((w, wi) => w.classList.toggle('on', acts.includes(wi)));
    if (you) {
        you.setAttribute('aria-valuenow', String(i + 1));
        you.setAttribute('aria-valuetext', `${M[i].when}: ${M[i].title}`);
    }
}

const at = (i: number) => (maxX * i) / (N - 1);

async function wake() {
    if (live.value || !section) return;
    // Pin the content where it is, so the panel grows downward and nothing
    // above it moves.
    const sh = section.querySelector('.shell') as HTMLElement | null;
    if (sh) {
        const top =
            sh.getBoundingClientRect().top - section.getBoundingClientRect().top;
        section.style.justifyContent = 'flex-start';
        section.style.paddingTop = `${top}px`;
    }
    live.value = true;
    section.classList.add('live');
    show(0);
    await nextTick();
    const p = panel.value;
    if (!p) return;
    const h = p.offsetHeight;
    const mt = getComputedStyle(p).marginTop;
    const still = reducedMotion();
    p.style.overflow = 'hidden';
    const a = p.animate(
        still
            ? [{ opacity: 0 }, { opacity: 1 }]
            : [
                  { height: '0px', marginTop: '0px', opacity: 0, offset: 0 },
                  { opacity: 0, offset: 0.35 },
                  { height: `${h}px`, marginTop: mt, opacity: 1, offset: 1 },
              ],
        { duration: still ? 300 : 700, easing: 'cubic-bezier(.2,.7,.2,1)' }
    );
    a.onfinish = () => {
        p.style.overflow = '';
    };
}

function onPointerDown(e: PointerEvent) {
    if (!you) return;
    e.preventDefault();
    you.focus({ preventScroll: true });
    measure();
    wake();
    drag = { x: e.clientX - cur };
    dragging.value = true;
    you.setPointerCapture(e.pointerId);
}

function onPointerMove(e: PointerEvent) {
    if (!drag) return;
    place(e.clientX - drag.x);
    const i = Math.round((cur / (maxX || 1)) * (N - 1));
    if (i !== idx.value) show(i);
}

function onPointerEnd() {
    if (!drag) return;
    drag = null;
    dragging.value = false;
    place(at(idx.value), true);
}

const KEYS: Record<string, number> = {
    ArrowRight: 1,
    ArrowUp: 1,
    ArrowLeft: -1,
    ArrowDown: -1,
    Home: -N,
    End: N,
    PageUp: 5,
    PageDown: -5,
};

function onKey(e: KeyboardEvent) {
    const k = KEYS[e.key];
    if (k === undefined) return;
    e.preventDefault();
    measure();
    const was = live.value;
    wake();
    const i = was
        ? Math.max(0, Math.min(N - 1, idx.value + k))
        : Math.max(0, Math.min(N - 1, k > 0 ? Math.min(k, N - 1) : 0));
    show(i);
    place(at(i), true);
}

// Once the timeline is open, Left and Right move it while the line is on
// screen, even if focus moved.
function onDocKey(e: KeyboardEvent) {
    if (!live.value || e.target === you || e.defaultPrevented) return;
    const el = e.target as HTMLElement | null;
    if (
        el &&
        (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))
    )
        return;
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const r = line.value?.getBoundingClientRect();
    if (!r || r.bottom < 0 || r.top > innerHeight) return;
    onKey(e);
}

onMounted(() => {
    // Fill the line in order once it is in view.
    if (fig.value && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    go.value = true;
                    io.disconnect();
                }
            },
            { threshold: 0.6 }
        );
        io.observe(fig.value);
        cleanups.push(() => io.disconnect());
    } else {
        go.value = true;
    }

    // Desktop only: on touch screens and narrow windows the line stays a
    // static picture.
    if (
        window.matchMedia(
            '(hover: none), (pointer: coarse), (max-width: 760px)'
        ).matches
    )
        return;
    if (!line.value || !fig.value) return;
    you = line.value.querySelector('i.you');
    if (!you) return;
    dots = [...line.value.querySelectorAll<HTMLElement>('i:not(.you)')];
    section = fig.value.closest('section');
    words = section
        ? [...section.querySelectorAll<HTMLElement>('.fg-p strong')]
        : [];
    canDrag.value = true;

    you.tabIndex = 0;
    you.setAttribute('role', 'slider');
    you.setAttribute('aria-label', t.value.slider);
    you.setAttribute('aria-valuemin', '1');
    you.setAttribute('aria-valuemax', String(N));
    you.addEventListener('pointerdown', onPointerDown);
    you.addEventListener('pointermove', onPointerMove);
    you.addEventListener('pointerup', onPointerEnd);
    you.addEventListener('pointercancel', onPointerEnd);
    you.addEventListener('keydown', onKey);
    document.addEventListener('keydown', onDocKey);
    const ro = new ResizeObserver(() => {
        if (!live.value) return;
        measure();
        place(at(idx.value));
    });
    ro.observe(line.value);
    cleanups.push(() => {
        ro.disconnect();
        document.removeEventListener('keydown', onDocKey);
    });
});

onBeforeUnmount(() => {
    cleanups.forEach((f) => f());
    if (section) {
        section.classList.remove('live');
        section.style.justifyContent = '';
        section.style.paddingTop = '';
    }
});
</script>

<template>
    <figure
        ref="fig"
        class="relay"
        :class="{ go, 'can-drag': canDrag, live, dragging }"
        :role="canDrag ? undefined : 'img'"
        :aria-label="labels.home.relayLabel"
    >
        <div ref="line" class="relay-line">
            <i
                v-for="n in DOTS"
                :key="n"
                :class="{ you: n === 1 || n === DOTS }"
                :style="{ '--n': n - 1 }"
            ></i>
        </div>
        <figcaption>
            <span>{{ labels.home.relayStart }}</span>
            <span>{{ labels.home.relayEnd }}</span>
        </figcaption>
    </figure>
    <div v-if="live" ref="panel" class="relay-panel">
        <div class="rp-inner">
            <p class="rp-when">{{ m.when }}</p>
            <h3 class="rp-title">{{ title }}</h3>
            <p class="rp-body">{{ m.body }}</p>
            <p class="rp-src">
                <a
                    v-for="s in m.src"
                    :key="s.u"
                    :href="s.u"
                    target="_blank"
                    rel="noopener noreferrer"
                    >{{ s.t }} ↗</a
                >
            </p>
            <details class="rp-note">
                <summary>{{ t.about }}</summary>
                <p>{{ m.note }}</p>
            </details>
            <p class="rp-hint">{{ t.hint }}</p>
        </div>
    </div>
</template>
