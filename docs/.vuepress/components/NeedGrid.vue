<script setup lang="ts">
/**
 * "The need" on the home page: the world's first languages, or its people, as
 * a grid of squares showing the most Scripture the API has for them. The
 * shape is the amount (a square for a full Bible, a triangle for a New
 * Testament, a small square for portions) and the ink is the licence: black
 * for open, grey for restricted. When the API has more under restrictive
 * terms than openly, the open shape is drawn inside the restricted one.
 * Drawn from needData.ts on a canvas.
 *
 * Hovering (or tapping) a square shows a card: a language's name, population
 * and best translations, from public/need-languages.json, which is fetched
 * the first time it is needed; or, in the people view, its group's totals.
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { usePageLang, withBase } from 'vuepress/client';
import { useLabels } from '../composables/useLocale';
import { fillLabel, labelHtml } from '../composables/formatLabel';
import { NEED, NEED_CODES, NEED_LEVELS, type NeedLevel } from '../needData';

type View = 'languages' | 'people';
/**
 * The most Scripture under any licence, and under an open one. `i` is the
 * language's place in needData.ts (and need-languages.json), or the group's
 * place in PEOPLE_GROUPS.
 */
type Cell = { any: NeedLevel; open: NeedLevel; i: number };

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
const percent = (value: number) =>
    format(value, { style: 'percent', maximumFractionDigits: 1 });

/**
 * The order squares are drawn in: languages with open Scripture first, by
 * the most of it (a full Bible, then a New Testament, then portions); then
 * those with only restricted Scripture, by the same; then those with none.
 * Where the API has more under restrictive terms than openly, the language
 * sits with its open level, after the ones whose best is open.
 */
function byAccess(x: Cell, y: Cell) {
    const key = (c: Cell) => {
        const open = NEED_LEVELS.indexOf(c.open);
        const any = NEED_LEVELS.indexOf(c.any);
        const restrictedOnly = c.open === 'none' && c.any !== 'none';
        return [
            c.any === 'none' ? 2 : restrictedOnly ? 1 : 0,
            restrictedOnly ? any : open,
            any,
        ];
    };
    const a = key(x);
    const b = key(y);
    return a[0] - b[0] || a[1] - b[1] || b[2] - a[2];
}

// needData.ts lists languages largest first; the sort is stable, so they
// stay largest first within each group.
const LANGUAGE_CELLS: Cell[] = Array.from(NEED.anyLevels, (c, i) => ({
    any: NEED_CODES[c],
    open: NEED_CODES[NEED.openLevels[i]],
    i,
})).sort(byAccess);
const totalLanguages = LANGUAGE_CELLS.length;

// Every (any, open) pair with people in it, in the same order.
const PEOPLE_GROUPS: (Cell & { people: number; languages: number })[] =
    Object.entries(NEED.people)
        .flatMap(([a, byOpen]) =>
            Object.entries(byOpen).map(([o, people]) => ({
                any: NEED_CODES[a],
                open: NEED_CODES[o],
                i: 0,
                people,
                languages: LANGUAGE_CELLS.filter(
                    (c) => c.any === NEED_CODES[a] && c.open === NEED_CODES[o]
                ).length,
            }))
        )
        .sort(byAccess)
        .map((g, i) => ({ ...g, i }));
const world = PEOPLE_GROUPS.reduce((s, g) => s + g.people, 0);

// The people view: a thousand squares, split between the groups by largest
// remainder so they add up.
const PEOPLE_SQUARES = 1000;
const PEOPLE_CELLS: Cell[] = (() => {
    const exact = PEOPLE_GROUPS.map((g) => (g.people / world) * PEOPLE_SQUARES);
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
    return PEOPLE_GROUPS.flatMap((g, i) =>
        Array.from({ length: whole[i] }, () => ({
            any: g.any,
            open: g.open,
            i: g.i,
        }))
    );
})();

const cells = computed(() =>
    view.value === 'languages' ? LANGUAGE_CELLS : PEOPLE_CELLS
);

/** Languages and people by their best level, and whether it is open. */
function tally(level: NeedLevel, open: boolean) {
    const match = (c: Cell) => c.any === level && (c.open === level) === open;
    return {
        languages: LANGUAGE_CELLS.filter(match).length,
        people: PEOPLE_GROUPS.filter(match).reduce((s, g) => s + g.people, 0),
    };
}

const noOpenPeople = PEOPLE_GROUPS.filter((g) => g.open === 'none').reduce(
    (s, g) => s + g.people,
    0
);

const title = computed(() =>
    fillLabel(n.value.title, { people: compact(noOpenPeople) })
);
const lead = computed(() =>
    labelHtml(n.value.lead, {
        total: format(totalLanguages),
        full: format(tally('full', true).languages),
        restricted: format(
            LANGUAGE_CELLS.filter((c) => c.open === 'none' && c.any !== 'none')
                .length
        ),
    })
);
const caption = computed(() =>
    view.value === 'languages'
        ? n.value.captionLanguages
        : fillLabel(n.value.captionPeople, {
              size: compact(world / PEOPLE_SQUARES),
          })
);

function figure(t: { languages: number; people: number }) {
    return view.value === 'languages'
        ? { value: format(t.languages), detail: '' }
        : { value: percent(t.people / world), detail: compact(t.people) };
}

// The legend: a row for each amount, a column for each kind of licence.
const legendRows = computed(() =>
    (['full', 'newTestament', 'portions'] as NeedLevel[]).map((level) => ({
        level,
        name: n.value.levels[level],
        open: figure(tally(level, true)),
        restricted: figure(tally(level, false)),
    }))
);
const legendNone = computed(() => ({
    name: n.value.levels.none,
    ...figure(tally('none', true)),
}));

const ariaLabel = computed(() => {
    const part = (name: string, f: { value: string; detail: string }) =>
        `${name}: ${f.value}${f.detail ? ` (${f.detail})` : ''}`;
    return (
        caption.value +
        ' ' +
        legendRows.value
            .flatMap((r) => [
                part(`${r.name}, ${n.value.open}`, r.open),
                part(`${r.name}, ${n.value.restricted}`, r.restricted),
            ])
            .concat(part(legendNone.value.name, legendNone.value))
            .join('; ') +
        '.'
    );
});

/* ---------- drawing ---------- */

// Restricted Scripture is drawn in the ink at this strength.
const RESTRICTED_INK = 0.4;

/** The grid's columns, by width: finer for languages, coarser for people. */
function colsFor(width: number) {
    if (view.value === 'people') return width >= 620 ? 50 : 25;
    return Math.max(40, Math.floor(width / (width >= 620 ? 9 : 6)));
}

/** Adds a level's shape, in a square of side s at x, y, to the path. */
function shape(
    ctx: CanvasRenderingContext2D,
    level: NeedLevel,
    x: number,
    y: number,
    s: number
) {
    if (level === 'full') {
        ctx.rect(x, y, s, s);
    } else if (level === 'newTestament') {
        // the lower-left half
        ctx.moveTo(x, y);
        ctx.lineTo(x + s, y + s);
        ctx.lineTo(x, y + s);
        ctx.closePath();
    } else if (level === 'portions') {
        // a small square in the lower-left corner, inside the triangle
        const p = s * 0.46;
        ctx.rect(x, y + s - p, p, p);
    }
}

let progress = 1;
let raf = 0;
const shown = ref(false);
/** Where the squares were last drawn, for finding the one under a pointer. */
let layout = { cols: 1, size: 1, s: 1, count: 0 };

/* ---------- the hover card ---------- */

/** A language in need-languages.json; see tools/fill-docs-need.ts. */
type LanguageDetail = [
    code: string,
    name: string,
    population: number | null,
    translationCount: number,
    via: string | null,
    best: [
        id: string,
        shortName: string,
        name: string,
        level: string,
        open: 0 | 1,
    ][],
];

let details: LanguageDetail[] | null = null;
let loading: Promise<void> | null = null;
const detailsReady = ref(false);
function loadDetails() {
    loading ??= fetch(withBase('/need-languages.json'))
        .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
        .then((j) => {
            details = j.languages;
            detailsReady.value = true;
        })
        .catch(() => {
            // try again on the next hover
            loading = null;
        });
}

const hovered = ref<{ cell: Cell; index: number } | null>(null);
const cardPos = ref({ left: 0, top: 0, below: true });
const ringPos = ref({ left: 0, top: 0, size: 0 });

function status(any: NeedLevel, open: NeedLevel) {
    if (any === 'none') return n.value.levels.none;
    if (open === any) {
        return fillLabel(n.value.statusOpen, { level: n.value.levels[any] });
    }
    if (open === 'none') {
        return fillLabel(n.value.statusRestricted, {
            level: n.value.levels[any],
        });
    }
    return fillLabel(n.value.statusMixed, {
        any: n.value.levels[any],
        open: n.value.levels[open],
    });
}

const card = computed(() => {
    const h = hovered.value;
    if (!h) return null;
    const { cell } = h;
    if (view.value === 'people') {
        const g = PEOPLE_GROUPS[cell.i];
        return {
            kind: 'group' as const,
            title: status(g.any, g.open),
            people: fillLabel(n.value.groupPeople, {
                people: compact(g.people),
                percent: percent(g.people / world),
            }),
            languages: fillLabel(n.value.groupLanguages, {
                count: format(g.languages),
            }),
        };
    }
    if (!detailsReady.value || !details) {
        return { kind: 'loading' as const, title: n.value.loading };
    }
    const [code, name, population, count, via, best] = details[cell.i];
    const viaName = via ? details.find((d) => d[0] === via)?.[1] : null;
    return {
        kind: 'language' as const,
        title: name,
        code,
        status: status(cell.any, cell.open),
        population:
            population === null
                ? n.value.populationUnknown
                : fillLabel(n.value.population, {
                      count: compact(population),
                  }),
        via: viaName ? fillLabel(n.value.via, { language: viaName }) : '',
        count: count
            ? fillLabel(n.value.translationCount, { count: format(count) })
            : '',
        best: best.map(([id, shortName, tName, level, open]) => ({
            id,
            shortName,
            name: tName,
            level: NEED_CODES[level],
            open: !!open,
            what: fillLabel(
                open ? n.value.statusOpen : n.value.statusRestricted,
                {
                    level: n.value.levels[NEED_CODES[level]],
                }
            ),
        })),
    };
});

/**
 * The square under a point in the grid, or -1. A gap counts as the square
 * before it, so the card doesn't flicker between squares.
 */
function cellAt(x: number, y: number) {
    const { cols, size, count } = layout;
    const col = Math.floor(x / size);
    const row = Math.floor(y / size);
    if (col < 0 || col >= cols || row < 0) return -1;
    const i = row * cols + col;
    return i < count ? i : -1;
}

const CARD_WIDTH = 300;
function onPointer(e: PointerEvent) {
    const el = box.value;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const index = cellAt(x, y);
    if (index < 0) {
        if (e.pointerType === 'mouse') hovered.value = null;
        return;
    }
    if (view.value === 'languages') loadDetails();
    if (hovered.value?.index !== index) {
        hovered.value = { cell: cells.value[index], index };
    }
    const { cols, size, s } = layout;
    ringPos.value = {
        left: (index % cols) * size,
        top: Math.floor(index / cols) * size,
        size: s,
    };
    const W = el.clientWidth;
    const width = Math.min(CARD_WIDTH, W);
    const left = Math.max(0, Math.min(W - width, x + 16));
    const below = y < el.clientHeight - 200 || y < 220;
    cardPos.value = { left, top: below ? y + 18 : y - 14, below };
}
function onLeave(e: PointerEvent) {
    if (e.pointerType === 'mouse') hovered.value = null;
}
const onDocPointer = (e: PointerEvent) => {
    if (!box.value?.contains(e.target as Node)) hovered.value = null;
};

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
    layout = { cols, size, s, count: list.length };
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
    // Squares are filled in order as the grid comes into view.
    const upTo = shown.value ? progress * list.length : 0;
    const at = (i: number) => [(i % cols) * size, Math.floor(i / cols) * size];

    // Three passes, one path each: the empty squares, the restricted shapes
    // in grey, then the open shapes in black on top.
    ctx.fillStyle = line;
    ctx.beginPath();
    list.forEach((cell, i) => {
        if (i < upTo && cell.any === 'full') return;
        const [x, y] = at(i);
        ctx.rect(x, y, s, s);
    });
    ctx.fill();

    ctx.fillStyle = ink;
    for (const pass of ['any', 'open'] as const) {
        ctx.globalAlpha = pass === 'any' ? RESTRICTED_INK : 1;
        ctx.beginPath();
        list.forEach((cell, i) => {
            if (i >= upTo) return;
            if (pass === 'any' && cell.any === cell.open) return;
            const [x, y] = at(i);
            shape(ctx, cell[pass], x, y, s);
        });
        ctx.fill();
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

watch(view, () => {
    hovered.value = null;
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
    document.addEventListener('pointerdown', onDocPointer);

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
    document.removeEventListener('pointerdown', onDocPointer);
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
                        @click="view = 'languages'"
                    >
                        {{ n.viewLanguages }}
                    </button>
                    <button
                        type="button"
                        :aria-pressed="view === 'people'"
                        @click="view = 'people'"
                    >
                        {{ n.viewPeople }}
                    </button>
                </div>
            </div>
            <div
                ref="box"
                class="need-grid"
                @pointermove="onPointer"
                @pointerdown="onPointer"
                @pointerleave="onLeave"
            >
                <canvas
                    ref="canvas"
                    role="img"
                    :aria-label="ariaLabel"
                ></canvas>
                <template v-if="card">
                    <span
                        class="need-ring"
                        aria-hidden="true"
                        :style="{
                            left: ringPos.left + 'px',
                            top: ringPos.top + 'px',
                            width: ringPos.size + 'px',
                            height: ringPos.size + 'px',
                        }"
                    ></span>
                    <div
                        class="need-card"
                        :class="{ above: !cardPos.below }"
                        role="tooltip"
                        :style="{
                            left: cardPos.left + 'px',
                            top: cardPos.top + 'px',
                        }"
                    >
                        <template v-if="card.kind === 'language'">
                            <span class="nc-title"
                                >{{ card.title }}
                                <small>{{ card.code }}</small></span
                            >
                            <span class="nc-line">{{ card.population }}</span>
                            <span class="nc-line">{{ card.status }}</span>
                            <span v-if="card.via" class="nc-note">{{
                                card.via
                            }}</span>
                            <ul v-if="card.best.length" class="nc-list">
                                <li v-for="t in card.best" :key="t.id">
                                    <i
                                        class="need-shape"
                                        :class="[
                                            t.level,
                                            t.open ? 'open' : 'restricted',
                                        ]"
                                    ></i>
                                    <span>
                                        <b dir="auto">{{ t.name }}</b>
                                        <small
                                            >{{ t.shortName || t.id }} ·
                                            {{ t.what }}</small
                                        >
                                    </span>
                                </li>
                            </ul>
                            <span v-if="card.count" class="nc-foot">{{
                                card.count
                            }}</span>
                        </template>
                        <template v-else-if="card.kind === 'group'">
                            <span class="nc-title">{{ card.title }}</span>
                            <span class="nc-line">{{ card.people }}</span>
                            <span class="nc-line">{{ card.languages }}</span>
                        </template>
                        <span v-else class="nc-line">{{ card.title }}</span>
                    </div>
                </template>
            </div>

            <div class="need-legend" aria-hidden="true">
                <span></span>
                <span class="need-col">{{ n.open }}</span>
                <span class="need-col">{{ n.restricted }}</span>
                <template v-for="row in legendRows" :key="row.level">
                    <span class="need-name">{{ row.name }}</span>
                    <span class="need-fig">
                        <i class="need-shape open" :class="row.level"></i>
                        <b>{{ row.open.value }}</b>
                        <small v-if="row.open.detail">{{
                            row.open.detail
                        }}</small>
                    </span>
                    <span class="need-fig">
                        <i class="need-shape restricted" :class="row.level"></i>
                        <b>{{ row.restricted.value }}</b>
                        <small v-if="row.restricted.detail">{{
                            row.restricted.detail
                        }}</small>
                    </span>
                </template>
                <span class="need-name">{{ legendNone.name }}</span>
                <span class="need-fig need-fig-none">
                    <i class="need-shape none"></i>
                    <b>{{ legendNone.value }}</b>
                    <small v-if="legendNone.detail">{{
                        legendNone.detail
                    }}</small>
                </span>
            </div>
            <p class="need-source">{{ n.mixed }} {{ n.source }}</p>
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
    .need-grid {
        position: relative;
        touch-action: manipulation;
    }
    .need-grid canvas {
        display: block;
        width: 100%;
    }
    .need-ring {
        position: absolute;
        pointer-events: none;
        outline: 2px solid var(--text);
        outline-offset: 1px;
    }
    .need-card {
        position: absolute;
        z-index: 6;
        width: min(300px, 100%);
        padding: 14px 16px;
        border: 1px solid var(--line);
        border-radius: 10px;
        background: var(--bg);
        color: var(--text);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.16);
        pointer-events: none;
        font-size: 14px;
        line-height: 1.4;
    }
    .need-card.above {
        transform: translateY(-100%);
    }
    .nc-title {
        display: block;
        font-size: 16px;
        font-weight: 750;
        letter-spacing: -0.01em;
    }
    .nc-title small {
        margin-left: 4px;
        font-size: 12px;
        font-weight: 600;
        color: var(--muted);
    }
    .nc-line {
        display: block;
        margin-top: 2px;
        color: var(--text-2);
    }
    .nc-note {
        display: block;
        margin-top: 6px;
        font-size: 12.5px;
        color: var(--muted);
    }
    .nc-list {
        list-style: none;
        margin: 10px 0 0;
        padding: 10px 0 0;
        border-top: 1px solid var(--line);
    }
    .nc-list li {
        display: flex;
        align-items: baseline;
        gap: 8px;
    }
    .nc-list li + li {
        margin-top: 7px;
    }
    .nc-list .need-shape {
        transform: translateY(1px);
    }
    .nc-list b {
        display: block;
        font-weight: 650;
        overflow-wrap: anywhere;
    }
    .nc-list small {
        display: block;
        font-size: 12px;
        color: var(--muted);
    }
    .nc-foot {
        display: block;
        margin-top: 10px;
        font-size: 12.5px;
        color: var(--muted);
    }

    /* the legend: amount by licence */
    .need-legend {
        display: grid;
        grid-template-columns: minmax(0, 1fr) repeat(2, minmax(0, 150px));
        align-items: baseline;
        column-gap: 20px;
        margin-top: 22px;
    }
    .need-legend > span {
        padding: 9px 0;
        border-bottom: 1px solid var(--line);
    }
    .need-col {
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--muted);
    }
    .need-legend > span:nth-child(-n + 3) {
        padding-top: 0;
        border-bottom-color: var(--text);
    }
    .need-legend > span:nth-last-child(-n + 2) {
        border-bottom: 0;
    }
    .need-name {
        font-size: 15px;
        font-weight: 700;
        letter-spacing: -0.01em;
    }
    .need-fig {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        column-gap: 8px;
    }
    .need-fig-none {
        grid-column: 2 / -1;
    }
    .need-fig b {
        font-size: clamp(20px, 2vw, 26px);
        font-weight: 800;
        letter-spacing: -0.03em;
        line-height: 1.1;
    }
    .need-fig small {
        flex-basis: 100%;
        padding-left: 20px;
        font-size: 13px;
        color: var(--muted);
    }
    .need-shape {
        flex: none;
        width: 12px;
        height: 12px;
        background: var(--text);
    }
    .need-shape.restricted {
        background: color-mix(in srgb, var(--text) 40%, transparent);
    }
    .need-shape.newTestament {
        clip-path: polygon(0 0, 100% 100%, 0 100%);
    }
    .need-shape.portions {
        clip-path: polygon(0 54%, 46% 54%, 46% 100%, 0 100%);
    }
    .need-shape.none {
        background: var(--line);
    }

    .need-source {
        margin: 24px 0 0;
        max-width: 80ch;
        font-size: 13px;
        line-height: 1.5;
        color: var(--muted);
    }
    @media (max-width: 620px) {
        .need-caption {
            font-size: 14px;
        }
        .need-legend {
            grid-template-columns: minmax(0, 1fr) repeat(2, minmax(0, 96px));
            column-gap: 12px;
        }
        .need-name {
            font-size: 14px;
        }
    }
}
</style>
