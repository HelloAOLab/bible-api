<script setup lang="ts">
/**
 * "The need" on the home page: the world's first languages, or its people, as
 * a grid of squares shaded by the most Scripture the API has for them under
 * an open licence. Drawn from needData.ts on a canvas.
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { usePageLang } from 'vuepress/client';
import { useLabels } from '../composables/useLocale';
import { fillLabel, labelHtml } from '../composables/formatLabel';
import { NEED, NEED_CODES, NEED_LEVELS, type NeedLevel } from '../needData';

type View = 'languages' | 'people';

const labels = useLabels();
const lang = usePageLang();
const n = computed(() => labels.value.home.need);

const view = ref<View>('languages');
const box = ref<HTMLElement>();
const canvas = ref<HTMLCanvasElement>();

/* ---------- numbers ---------- */

function format(value: number, options: Intl.NumberFormatOptions = {}) {
    try {
        return new Intl.NumberFormat(lang.value, options).format(value);
    } catch {
        return new Intl.NumberFormat('en-US', options).format(value);
    }
}
const compact = (value: number) =>
    format(value, {
        notation: 'compact',
        compactDisplay: 'long',
        maximumFractionDigits: 1,
    });

const LANGUAGE_CELLS: NeedLevel[] = Array.from(
    NEED.languageLevels,
    (c) => NEED_CODES[c]
);
const totalLanguages = LANGUAGE_CELLS.length;
const world = NEED_LEVELS.reduce((s, l) => s + NEED.people[l], 0);

// The people view: a thousand squares, split between the levels by largest
// remainder so they add up, best level first.
const PEOPLE_SQUARES = 1000;
const PEOPLE_CELLS: NeedLevel[] = (() => {
    const exact = NEED_LEVELS.map(
        (l) => (NEED.people[l] / world) * PEOPLE_SQUARES
    );
    const whole = exact.map(Math.floor);
    let left = PEOPLE_SQUARES - whole.reduce((a, b) => a + b, 0);
    exact
        .map((x, i) => [x - Math.floor(x), i])
        .sort((a, b) => b[0] - a[0])
        .forEach(([, i]) => {
            if (left > 0) {
                whole[i]++;
                left--;
            }
        });
    return NEED_LEVELS.flatMap((l, i) => Array(whole[i]).fill(l));
})();

const cells = computed(() =>
    view.value === 'languages' ? LANGUAGE_CELLS : PEOPLE_CELLS
);

const title = computed(() =>
    fillLabel(n.value.title, { people: compact(NEED.people.none) })
);
const lead = computed(() =>
    labelHtml(n.value.lead, {
        total: format(totalLanguages),
        full: format(NEED.languages.full),
        restricted: format(NEED.restrictedOnly),
    })
);
const caption = computed(() =>
    view.value === 'languages'
        ? n.value.captionLanguages
        : fillLabel(n.value.captionPeople, {
              size: compact(world / PEOPLE_SQUARES),
          })
);

const legend = computed(() =>
    NEED_LEVELS.map((level) => ({
        level,
        name: n.value.levels[level],
        value:
            view.value === 'languages'
                ? format(NEED.languages[level])
                : format(NEED.people[level] / world, {
                      style: 'percent',
                      maximumFractionDigits: 1,
                  }),
        detail: view.value === 'people' ? compact(NEED.people[level]) : '',
    }))
);

const ariaLabel = computed(
    () =>
        caption.value +
        ' ' +
        legend.value
            .map(
                (l) =>
                    `${l.name}: ${l.value}${l.detail ? ` (${l.detail})` : ''}`
            )
            .join(', ') +
        '.'
);

/* ---------- drawing ---------- */

// How strongly each level is inked; "none" is drawn in the line colour.
const INK: Record<NeedLevel, number> = {
    full: 1,
    newTestament: 0.55,
    portions: 0.3,
    none: 0,
};

/** The grid's columns, by width: finer for languages, coarser for people. */
function colsFor(width: number) {
    if (view.value === 'people') return width >= 620 ? 50 : 25;
    return Math.max(40, Math.floor(width / (width >= 620 ? 8 : 5)));
}

let progress = 1;
let raf = 0;
const shown = ref(false);

function draw() {
    const el = box.value;
    const cv = canvas.value;
    if (!el || !cv) return;
    const W = el.clientWidth;
    if (!W) return;
    const list = cells.value;
    const cols = colsFor(W);
    const size = W / cols;
    const rows = Math.ceil(list.length / cols);
    const H = size * rows;
    const gap = Math.max(1, size * (view.value === 'people' ? 0.16 : 0.2));
    const s = size - gap;
    const r = window.devicePixelRatio || 1;
    cv.width = Math.round(W * r);
    cv.height = Math.round(H * r);
    cv.style.height = H + 'px';
    const ctx = cv.getContext('2d')!;
    ctx.setTransform(r, 0, 0, r, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const cs = getComputedStyle(el);
    const ink = cs.getPropertyValue('--text').trim();
    const line = cs.getPropertyValue('--line').trim();
    // Squares are shaded in order as the grid comes into view.
    const upTo = shown.value ? progress * list.length : 0;
    // One pass per colour keeps the fill style changes to four.
    for (const level of NEED_LEVELS) {
        const alpha = INK[level];
        ctx.fillStyle = alpha ? ink : line;
        ctx.globalAlpha = alpha || 1;
        list.forEach((cell, i) => {
            const lit = i < upTo;
            if ((lit ? cell : 'none') !== level) return;
            ctx.fillRect((i % cols) * size, Math.floor(i / cols) * size, s, s);
        });
    }
    ctx.globalAlpha = 1;
}

function animate(duration: number) {
    cancelAnimationFrame(raf);
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
        progress = 1;
        draw();
        return;
    }
    const start = performance.now();
    const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        // ease out
        progress = 1 - Math.pow(1 - t, 3);
        draw();
        if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
}

function show(next: View) {
    if (next === view.value) return;
    view.value = next;
}

watch(view, () => {
    if (shown.value) animate(700);
    else draw();
});
watch(labels, () => draw());

let resize: ResizeObserver | undefined;
let themeWatch: MutationObserver | undefined;
let darkQuery: MediaQueryList | undefined;
let seen: IntersectionObserver | undefined;

onMounted(() => {
    let lastW = 0;
    resize = new ResizeObserver(() => {
        const width = box.value?.clientWidth ?? 0;
        if (width !== lastW) {
            lastW = width;
            draw();
        }
    });
    resize.observe(box.value!);
    // The theme toggle changes the tokens the canvas is painted with.
    themeWatch = new MutationObserver(() => draw());
    themeWatch.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme', 'class'],
    });
    darkQuery = matchMedia('(prefers-color-scheme: dark)');
    darkQuery.addEventListener('change', draw);

    const reveal = () => {
        shown.value = true;
        animate(1600);
    };
    if ('IntersectionObserver' in window) {
        seen = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    seen?.disconnect();
                    reveal();
                }
            },
            { threshold: 0.3 }
        );
        seen.observe(box.value!);
    } else {
        reveal();
    }
    draw();
});

onBeforeUnmount(() => {
    cancelAnimationFrame(raf);
    resize?.disconnect();
    themeWatch?.disconnect();
    seen?.disconnect();
    darkQuery?.removeEventListener('change', draw);
});
</script>

<template>
    <div class="need">
        <p class="need-eyebrow">{{ n.eyebrow }}</p>
        <h2 class="fg-h need-h">{{ title }}</h2>
        <p class="fg-p need-lead" v-html="lead"></p>

        <div class="need-chart">
            <div class="need-bar">
                <p class="need-caption">{{ caption }}</p>
                <div class="need-views" role="group" :aria-label="n.views">
                    <button
                        type="button"
                        :aria-pressed="view === 'languages'"
                        @click="show('languages')"
                    >
                        {{ n.viewLanguages }}
                    </button>
                    <button
                        type="button"
                        :aria-pressed="view === 'people'"
                        @click="show('people')"
                    >
                        {{ n.viewPeople }}
                    </button>
                </div>
            </div>
            <div ref="box" class="need-grid">
                <canvas
                    ref="canvas"
                    role="img"
                    :aria-label="ariaLabel"
                ></canvas>
            </div>
            <ul class="need-legend">
                <li v-for="item in legend" :key="item.level">
                    <span class="need-swatch" :class="item.level"></span>
                    <span class="need-name">{{ item.name }}</span>
                    <b>{{ item.value }}</b>
                    <span v-if="item.detail" class="need-detail">{{
                        item.detail
                    }}</span>
                </li>
            </ul>
            <p class="need-source">{{ n.source }}</p>
        </div>
    </div>
</template>

<style lang="scss">
.fuba-page .need {
    .need-eyebrow {
        margin: 0 0 18px;
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--muted);
    }
    .need-h {
        max-width: 22ch;
    }
    .need-lead {
        max-width: 50ch;
    }
    .need-chart {
        max-width: 880px;
        margin: clamp(40px, 6vh, 64px) auto 0;
        text-align: left;
    }
    .need-bar {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        gap: 12px 20px;
        padding-bottom: 12px;
        margin-bottom: 14px;
        border-bottom: 2px solid var(--text);
    }
    .need-caption {
        margin: 0;
        font-size: 15px;
        font-weight: 600;
        color: var(--text-2);
    }
    .need-views {
        display: inline-flex;
        padding: 3px;
        border: 1px solid var(--line);
        border-radius: 999px;
        background: var(--bg);
    }
    .need-views button {
        padding: 6px 14px;
        border: 0;
        border-radius: 999px;
        background: transparent;
        color: var(--text-2);
        font: inherit;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
    }
    .need-views button[aria-pressed='true'] {
        background: var(--text);
        color: var(--bg);
    }
    .need-grid canvas {
        display: block;
        width: 100%;
    }
    .need-legend {
        list-style: none;
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 14px 20px;
        margin: 20px 0 0;
        padding: 0;
    }
    .need-legend li {
        display: grid;
        grid-template-columns: auto 1fr;
        align-items: center;
        column-gap: 8px;
    }
    .need-swatch {
        width: 12px;
        height: 12px;
        border-radius: 1px;
        background: var(--text);
    }
    .need-swatch.newTestament {
        background: color-mix(in srgb, var(--text) 55%, transparent);
    }
    .need-swatch.portions {
        background: color-mix(in srgb, var(--text) 30%, transparent);
    }
    .need-swatch.none {
        background: var(--line);
    }
    .need-name {
        font-size: 13px;
        font-weight: 600;
        color: var(--text-2);
    }
    .need-legend b {
        grid-column: 2;
        font-size: clamp(22px, 2.2vw, 30px);
        font-weight: 800;
        letter-spacing: -0.03em;
        line-height: 1.15;
    }
    .need-detail {
        grid-column: 2;
        font-size: 13px;
        color: var(--muted);
    }
    .need-source {
        margin: 24px 0 0;
        max-width: 80ch;
        font-size: 13px;
        line-height: 1.5;
        color: var(--muted);
    }
    @media (max-width: 620px) {
        .need-legend {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .need-caption {
            font-size: 14px;
        }
    }
}
</style>
