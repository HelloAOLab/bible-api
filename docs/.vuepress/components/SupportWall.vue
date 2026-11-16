<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { RouteLink, usePageLang, withBase } from 'vuepress/client';
import { fillLabel, labelHtml } from '../composables/formatLabel';
import { useLabels } from '../composables/useLocale';
import { WALL_DATA, type WallSupporter } from '../wallData';

/**
 * The yearly support wall, drawn from WALL_DATA (wallData.ts) on a canvas.
 * Each square is one `unit` of yearly support. Used by the home page, which
 * also shows the Free Use Fund strip beneath it, and the Support page.
 */
const props = defineProps<{
    /** Show the Free Use Fund strip, linking to this page. */
    fundLink?: string;
    /** Show what one square is worth beside the legend. */
    showNote?: boolean;
}>();

const labels = useLabels();
const lang = usePageLang();

const D = WALL_DATA;
const YEAR = D.year;
const GOAL = D.goal;
const UNIT = D.unit;
const FULL = Math.floor(GOAL / UNIT);
const TAIL = GOAL - FULL * UNIT;
const CELLS = FULL + (TAIL ? 1 : 0);
const SUPPORTERS = (D.supporters || []).filter((s) => s && s.w > 0 && s.h > 0);

type Placed = WallSupporter & {
    x: number;
    y: number;
    claimed: number;
};
type Cell = { claimed: number; received: number; owner: number };
type Tokens = { ink: string; muted: string; line: string; paper: string };

function money(n: number) {
    try {
        return new Intl.NumberFormat(lang.value, {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(Math.round(n));
    } catch {
        return '$' + Math.round(n).toLocaleString('en-US');
    }
}
function count(n: number) {
    try {
        return n.toLocaleString(lang.value);
    } catch {
        return n.toLocaleString('en-US');
    }
}

const wall = ref<HTMLDivElement>();
const canvas = ref<HTMLCanvasElement>();
const fundCanvas = ref<HTMLCanvasElement>();
const card = ref<HTMLDivElement>();

// What the template shows; the canvas is drawn by hand.
const placed = ref<Placed[]>([]);
const cols = ref(0);
const rows = ref(0);
const overflow = ref(0);
const totals = ref({ claimed: 0, received: 0 });
const listOpen = ref(false);
const cardFor = ref<Placed | null>(null);
const cardPos = ref({ left: 0, top: 0 });
let pinned: Placed | null = null;
let cells: Cell[] = [];

const w = computed(() => labels.value.wall);
const stories = computed(() => placed.value.filter((p) => p.story));

const heading = computed(() => fillLabel(w.value.heading, { year: YEAR }));
const goal = computed(() =>
    labelHtml(w.value.goal, { amount: `<b>${money(GOAL)}</b>` })
);
const note = computed(() =>
    labelHtml(w.value.note, {
        month: money(UNIT / 12),
        year: money(UNIT),
    })
);
const storyCount = computed(() =>
    stories.value.length === 1
        ? w.value.storyCountOne
        : fillLabel(w.value.storyCountMany, {
              count: count(stories.value.length),
          })
);
const fundText = computed(() =>
    overflow.value > 0
        ? fillLabel(w.value.fundOverflow, {
              year: YEAR,
              amount: money(overflow.value),
          })
        : w.value.fundLabel
);
const ariaLabel = computed(() =>
    fillLabel(w.value.ariaLabel, {
        year: YEAR,
        squares: count(FULL),
        monthly: money(UNIT / 12),
        tail: TAIL ? fillLabel(w.value.ariaTail, { amount: money(TAIL) }) : '',
        received: money(totals.value.received),
        pledged: money(Math.min(GOAL, totals.value.claimed)),
    })
);

const who = (p: Placed) => (p.public ? p.name : w.value.anonymous);
const kind = (p: Placed) => (p.kind ? (w.value.kinds[p.kind] ?? p.kind) : '');

function gift(p: Placed) {
    const sq = p.w * p.h;
    const per = sq * UNIT;
    const squares = fillLabel(sq === 1 ? w.value.square : w.value.squares, {
        count: count(sq),
    });
    const amount =
        p.cadence === 'monthly'
            ? fillLabel(w.value.perMonth, { amount: money(per / 12) })
            : fillLabel(
                  p.cadence === 'one-time' ? w.value.oneTime : w.value.forYear,
                  { amount: money(per) }
              );
    const received = fillLabel(w.value.percentReceived, {
        percent: Math.round((p.received / p.claimed) * 100),
    });
    return `${squares} · ${amount} · ${received}`;
}

function hitLabel(p: Placed) {
    return (
        (p.public ? p.name : w.value.anonymousPartner) +
        (p.story ? `, ${w.value.hasStory}` : '') +
        '. ' +
        gift(p)
    );
}

function hitStyle(p: Placed) {
    return {
        left: (p.x / cols.value) * 100 + '%',
        top: (p.y / rows.value) * 100 + '%',
        width: `calc(${(p.w / cols.value) * 100}% - 1px)`,
        height: `calc(${(p.h / rows.value) * 100}% - 1px)`,
    };
}

// Only supporters with something to show on hover get a button.
const hits = computed(() =>
    placed.value.filter((p) => p.story || p.public || p.message || p.logo)
);

/* ---------- logos ---------- */

const images: Record<string, HTMLImageElement> = {};
function loadLogos() {
    SUPPORTERS.forEach((s) => {
        if (s.logo && !images[s.logo]) {
            const im = new Image();
            im.onload = () => draw();
            im.src = s.logo.startsWith('/') ? withBase(s.logo) : s.logo;
            images[s.logo] = im;
        }
    });
}
const logoReady = (p: Placed) => {
    const im = p.logo && images[p.logo];
    return !!(im && im.complete && im.naturalWidth);
};

/* a logo sits on white in both themes, so dark logos never disappear; a thin
   bar shows money still to come */
function logoTile(
    ctx: CanvasRenderingContext2D,
    p: Placed,
    x: number,
    y: number,
    w: number,
    h: number,
    t: Tokens
) {
    const im = images[p.logo!];
    const f = p.received / p.claimed;
    const bar = f < 1 ? 4 : 0;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, y, w, h);
    const pad = Math.max(2, Math.min(w, h) * 0.12);
    const sc = Math.min(
        (w - 2 * pad) / im.naturalWidth,
        (h - 2 * pad - bar) / im.naturalHeight
    );
    const iw = im.naturalWidth * sc;
    const ih = im.naturalHeight * sc;
    ctx.drawImage(im, x + (w - iw) / 2, y + (h - bar - ih) / 2, iw, ih);
    ctx.strokeStyle = f < 1 ? t.muted : t.ink;
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
    if (bar) {
        ctx.fillStyle = t.line;
        ctx.fillRect(x + 1, y + h - 4, w - 2, 3);
        ctx.fillStyle = t.ink;
        ctx.fillRect(x + 1, y + h - 4, (w - 2) * f, 3);
    }
}

/* ---------- layout ---------- */

const cap = (i: number) => (i < FULL ? UNIT : TAIL);
const colsFor = (width: number) => (width >= 900 ? 70 : width >= 560 ? 56 : 40);

function layout(): Int16Array {
    const c = cols.value;
    const r = (rows.value = Math.ceil(CELLS / c));
    const taken = new Int16Array(CELLS).fill(-1);
    const total = c * r;
    const fits = (x: number, y: number, w: number, h: number) => {
        if (x < 0 || y < 0 || x + w > c || y + h > r) return false;
        for (let j = 0; j < h; j++)
            for (let k = 0; k < w; k++) {
                const i = (y + j) * c + x + k;
                if (i >= FULL || taken[i] >= 0) return false;
            }
        return true;
    };
    placed.value = SUPPORTERS.map((s, n) => {
        const w = Math.min(s.w, c);
        const at = s.at || [0, 0];
        const sx = Math.round(at[0] * (c - w));
        const sy = Math.round(at[1] * (r - s.h));
        for (let t = 0; t < total; t++) {
            const p = (sy * c + sx + t) % total;
            const x = p % c;
            const y = Math.floor(p / c);
            if (fits(x, y, w, s.h)) {
                for (let j = 0; j < s.h; j++)
                    for (let k = 0; k < w; k++) taken[(y + j) * c + x + k] = n;
                const claimed = s.w * s.h * UNIT;
                return {
                    ...s,
                    w,
                    x,
                    y,
                    claimed,
                    received: Math.min(claimed, Math.max(0, s.received || 0)),
                };
            }
        }
        return null;
    }).filter((p): p is Placed => !!p);
    return taken;
}

function fund() {
    const taken = layout();
    const c = cols.value;
    cells = Array.from({ length: CELLS }, () => ({
        claimed: 0,
        received: 0,
        owner: -1,
    }));
    let claimed = 0;
    let received = 0;
    placed.value.forEach((p, n) => {
        const f = p.received / p.claimed;
        for (let j = 0; j < p.h; j++)
            for (let k = 0; k < p.w; k++) {
                const cell = cells[(p.y + j) * c + p.x + k];
                cell.owner = n;
                cell.claimed = UNIT;
                cell.received = UNIT * f;
            }
        claimed += p.claimed;
        received += p.received;
    });
    /* everyone else: claims take open squares from the top; received money
       fills them in the same order */
    const o = D.others || { claimed: 0, received: 0 };
    let pool = Math.max(0, o.claimed || 0);
    let got = Math.min(pool, Math.max(0, o.received || 0));
    for (let i = 0; i < CELLS && pool > 0; i++) {
        if (taken[i] >= 0) continue;
        const cell = cells[i];
        const amt = Math.min(cap(i), pool);
        cell.claimed = amt;
        cell.received = Math.min(amt, got);
        got -= cell.received;
        pool -= amt;
        claimed += amt;
        received += cell.received;
    }
    return { claimed, received, overflow: pool };
}

/* ---------- drawing ---------- */

function tokens(): Tokens {
    const cs = getComputedStyle(wall.value!);
    const v = (n: string) => cs.getPropertyValue(n).trim();
    return {
        ink: v('--text'),
        muted: v('--muted'),
        line: v('--line'),
        paper: v('--surface'),
    };
}

/* a dog-ear: the corner is cut away to the paper, and the folded flap shows
   below the crease */
function corner(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    c: number,
    t: Tokens,
    onInk: boolean
) {
    ctx.fillStyle = t.paper;
    ctx.beginPath();
    ctx.moveTo(x + w - c, y - 1);
    ctx.lineTo(x + w + 1, y - 1);
    ctx.lineTo(x + w + 1, y + c);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = onInk ? t.line : t.muted;
    ctx.beginPath();
    ctx.moveTo(x + w - c, y);
    ctx.lineTo(x + w - c, y + c);
    ctx.lineTo(x + w, y + c);
    ctx.closePath();
    ctx.fill();
}

function draw() {
    const el = wall.value;
    const cv = canvas.value;
    if (!el || !cv) return;
    const W = el.clientWidth;
    if (!W) return;
    const next = colsFor(W);
    if (next !== cols.value) {
        cols.value = next;
        render();
        return;
    }
    const c = cols.value;
    const size = W / c;
    const H = size * rows.value;
    const gap = Math.max(1, size * 0.12);
    const r = window.devicePixelRatio || 1;
    const t = tokens();
    const s = size - gap;
    cv.width = Math.round(W * r);
    cv.height = Math.round(H * r);
    cv.style.height = H + 'px';
    const ctx = cv.getContext('2d')!;
    ctx.setTransform(r, 0, 0, r, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const ps = placed.value;
    cells.forEach((cell, i) => {
        if (cell.owner >= 0 && ps[cell.owner].w * ps[cell.owner].h > 1) return;
        const x = (i % c) * size;
        const y = Math.floor(i / c) * size;
        const w = (s * cap(i)) / UNIT;
        if (!cell.claimed) {
            ctx.fillStyle = t.line;
            ctx.fillRect(x, y, w, s);
            return;
        }
        if (cell.received < cell.claimed) {
            ctx.strokeStyle = t.muted;
            ctx.globalAlpha = 0.7;
            ctx.lineWidth = 1;
            ctx.strokeRect(
                x + 0.5,
                y + 0.5,
                Math.max(0, w - 1),
                Math.max(0, s - 1)
            );
            ctx.globalAlpha = 1;
        }
        if (cell.received) {
            ctx.fillStyle = t.ink;
            ctx.fillRect(x, y, (w * cell.received) / cap(i), s);
        }
    });
    const font = getComputedStyle(document.body).fontFamily;
    ps.forEach((p) => {
        const x = p.x * size;
        const y = p.y * size;
        const w = p.w * size - gap;
        const h = p.h * size - gap;
        if (logoReady(p)) {
            logoTile(ctx, p, x, y, w, h, t);
        } else if (p.w * p.h > 1) {
            ctx.strokeStyle = p.received < p.claimed ? t.muted : t.ink;
            ctx.lineWidth = 1;
            ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
            const fw = (w * p.received) / p.claimed;
            ctx.fillStyle = t.ink;
            ctx.fillRect(x, y, fw, h);
            const label = who(p);
            const fs = Math.min(h * 0.36, w * 0.16, 15);
            if (fs >= 9) {
                ctx.font =
                    (p.public ? '700 ' : 'italic 600 ') + fs + 'px ' + font;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                for (const [cx, cw, col] of [
                    [x, fw, t.paper],
                    [x + fw, w - fw, t.ink],
                ] as [number, number, string][]) {
                    if (cw <= 0) continue;
                    ctx.save();
                    ctx.beginPath();
                    ctx.rect(cx, y, cw, h);
                    ctx.clip();
                    ctx.fillStyle = col;
                    ctx.fillText(label, x + w / 2, y + h / 2 + 0.5, w - 8);
                    ctx.restore();
                }
            }
        }
        if (p.story) {
            corner(
                ctx,
                x,
                y,
                w,
                p.w * p.h > 1
                    ? Math.max(8, Math.min(12, s * 0.6))
                    : Math.max(4, Math.min(10, s * 0.55)),
                t,
                !logoReady(p) && p.received / p.claimed >= 0.85
            );
        }
    });
    if (fundCanvas.value) drawFund(W, size, gap, t, r);
}

/* the Free Use Fund continues the grid below the line: three fading rows
   while empty, and as many rows as overflow needs once the year is fully
   claimed */
function drawFund(W: number, size: number, gap: number, t: Tokens, r: number) {
    const cv = fundCanvas.value!;
    const c = cols.value;
    const filled = overflow.value / UNIT;
    const n = Math.max(3, Math.ceil(filled / c) + 1);
    const H = size * n;
    const s = size - gap;
    cv.width = Math.round(W * r);
    cv.height = Math.round(H * r);
    cv.style.height = H + 'px';
    const ctx = cv.getContext('2d')!;
    ctx.setTransform(r, 0, 0, r, 0, 0);
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < n * c; i++) {
        const row = Math.floor(i / c);
        const x = (i % c) * size;
        const y = row * size;
        const f = Math.max(0, Math.min(1, filled - i));
        if (f > 0) {
            ctx.globalAlpha = 0.7;
            ctx.strokeStyle = t.muted;
            ctx.lineWidth = 1;
            ctx.strokeRect(x + 0.5, y + 0.5, s * f - 1, s - 1);
        } else {
            ctx.globalAlpha = Math.max(
                0.15,
                1 - (row - Math.floor(filled / c)) * 0.32
            );
            ctx.fillStyle = t.line;
            ctx.fillRect(x, y, s, s);
        }
    }
    ctx.globalAlpha = 1;
}

function render() {
    const tot = fund();
    overflow.value = tot.overflow;
    totals.value = { claimed: tot.claimed, received: tot.received };
    hideCard();
    draw();
}

/* ---------- the hover card ---------- */

function showCard(p: Placed, btn: HTMLElement, ev?: PointerEvent) {
    cardFor.value = p;
    // Measure once the card has its content.
    requestAnimationFrame(() => {
        const el = wall.value;
        const cd = card.value;
        if (!el || !cd || cardFor.value !== p) return;
        const wr = el.getBoundingClientRect();
        const br = btn.getBoundingClientRect();
        const cw = cd.offsetWidth;
        const ch = cd.offsetHeight;
        let left: number;
        let top: number;
        if (ev && ev.pointerType === 'mouse') {
            left = ev.clientX - wr.left + 16;
            top = ev.clientY - wr.top + 16;
            if (left + cw > wr.width) left = ev.clientX - wr.left - cw - 16;
        } else {
            left = br.left - wr.left + br.width / 2 - cw / 2;
            top = br.bottom - wr.top + 8;
            if (top + ch > wr.height && br.top - wr.top - ch - 8 > 0)
                top = br.top - wr.top - ch - 8;
        }
        cardPos.value = {
            left: Math.max(4, Math.min(wr.width - cw - 4, left)),
            top: Math.max(4, top),
        };
    });
}
function hideCard() {
    cardFor.value = null;
    pinned = null;
}

function onEnter(p: Placed, e: PointerEvent) {
    if (e.pointerType === 'mouse' && !pinned)
        showCard(p, e.currentTarget as HTMLElement, e);
}
function onLeave(e: PointerEvent) {
    if (e.pointerType === 'mouse' && !pinned) cardFor.value = null;
}
function onFocus(p: Placed, e: FocusEvent) {
    showCard(p, e.currentTarget as HTMLElement);
}
function onBlur() {
    if (!pinned) cardFor.value = null;
}
function onClick(p: Placed, e: MouseEvent) {
    e.stopPropagation();
    if (pinned === p) {
        hideCard();
        return;
    }
    pinned = p;
    showCard(p, e.currentTarget as HTMLElement);
}

/* ---------- lifecycle ---------- */

let resize: ResizeObserver | undefined;
let themeWatch: MutationObserver | undefined;
let darkQuery: MediaQueryList | undefined;
const onDocClick = (e: MouseEvent) => {
    if (pinned && !card.value?.contains(e.target as Node)) hideCard();
};
const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') hideCard();
};

onMounted(() => {
    loadLogos();
    cols.value = colsFor(wall.value!.clientWidth || 1100);
    render();

    let lastW = 0;
    resize = new ResizeObserver(() => {
        const width = wall.value?.clientWidth ?? 0;
        if (width !== lastW) {
            lastW = width;
            hideCard();
            draw();
        }
    });
    resize.observe(wall.value!);
    // The theme toggle changes the tokens the canvas is painted with.
    themeWatch = new MutationObserver(() => draw());
    themeWatch.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme', 'class'],
    });
    darkQuery = matchMedia('(prefers-color-scheme: dark)');
    darkQuery.addEventListener('change', draw);
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
});

onBeforeUnmount(() => {
    resize?.disconnect();
    themeWatch?.disconnect();
    darkQuery?.removeEventListener('change', draw);
    document.removeEventListener('click', onDocClick);
    document.removeEventListener('keydown', onKey);
});

// Names on the canvas ("Anonymous") follow the language.
watch(labels, () => draw());
</script>

<template>
    <div class="support-wall">
        <div class="wall-head">
            <span class="wall-head-l">{{ heading }}</span>
            <span class="wall-head-r"><span v-html="goal"></span></span>
        </div>
        <div v-if="stories.length" class="wall-top">
            <span>{{ storyCount }}</span>
            <button
                type="button"
                class="wall-link"
                :aria-expanded="listOpen"
                @click="listOpen = !listOpen"
            >
                {{ listOpen ? w.hideStories : w.readStories }}
            </button>
        </div>
        <div ref="wall" class="wall">
            <canvas ref="canvas" role="img" :aria-label="ariaLabel"></canvas>
            <div class="wall-hits">
                <button
                    v-for="(p, i) in hits"
                    :key="i"
                    type="button"
                    class="wall-hit"
                    :style="hitStyle(p)"
                    :aria-label="hitLabel(p)"
                    @pointerenter="onEnter(p, $event)"
                    @pointermove="onEnter(p, $event)"
                    @pointerleave="onLeave"
                    @focus="onFocus(p, $event)"
                    @blur="onBlur"
                    @click="onClick(p, $event)"
                ></button>
            </div>
            <div
                v-show="cardFor"
                ref="card"
                class="wall-card"
                role="tooltip"
                :style="{
                    left: cardPos.left + 'px',
                    top: cardPos.top + 'px',
                }"
            >
                <template v-if="cardFor">
                    <span class="wc-who">{{ who(cardFor) }}</span>
                    <span v-if="cardFor.kind" class="wc-kind">{{
                        kind(cardFor)
                    }}</span>
                    <span v-if="cardFor.message" class="wc-msg">{{
                        cardFor.message
                    }}</span>
                    <q v-if="cardFor.story">{{ cardFor.story }}</q>
                    <span class="wc-gift">{{ gift(cardFor) }}</span>
                </template>
            </div>
        </div>
        <div class="wall-key">
            <div class="wall-legend">
                <span><i class="k-rec"></i>{{ w.received }}</span>
                <span v-if="stories.length"
                    ><i class="k-story"></i>{{ w.story }}</span
                >
                <span><i class="k-cl"></i>{{ w.pledged }}</span>
                <span><i class="k-av"></i>{{ w.open }}</span>
            </div>
            <p v-if="props.showNote" class="wall-note" v-html="note"></p>
        </div>
        <div v-if="props.fundLink" class="wall-fund">
            <h3 class="wall-fund-h">{{ w.fundTitle }}</h3>
            <p class="wall-fund-label">
                <span>{{ fundText }}</span>
                <RouteLink :to="props.fundLink"
                    >{{ w.fundLink }}&nbsp;&rarr;</RouteLink
                >
            </p>
            <canvas ref="fundCanvas" aria-hidden="true"></canvas>
        </div>
        <ul v-if="listOpen && stories.length" class="wall-list">
            <li v-for="(p, i) in stories" :key="i">
                <q>{{ p.story }}</q>
                <b>{{ who(p) }}</b>
                <span>{{ (p.kind ? kind(p) + ' · ' : '') + gift(p) }}</span>
            </li>
        </ul>
    </div>
</template>

<style lang="scss">
.support-wall {
    .wall-note {
        margin: 0;
        font-size: 15px;
        color: var(--muted);
    }
    .wall-note b,
    .wall-note strong {
        color: var(--text);
        font-weight: 700;
    }
    .wall-head {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: baseline;
        gap: 4px 20px;
        margin: clamp(36px, 4vw, 52px) 0 14px;
    }
    .wall-head-l {
        font-size: 17px;
        font-weight: 700;
        letter-spacing: -0.01em;
    }
    .wall-head-r {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        gap: 6px 22px;
        font-size: 15px;
        color: var(--muted);
    }
    .wall-head-r b {
        font-size: 17px;
        color: var(--text);
        font-weight: 700;
        margin-right: 3px;
    }
    .wall-top {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: baseline;
        gap: 6px 20px;
        margin: 0 0 12px;
        font-size: 14px;
        color: var(--muted);
    }
    .wall-link {
        padding: 0;
        border: 0;
        background: none;
        font: inherit;
        font-weight: 600;
        color: var(--text);
        cursor: pointer;
        text-decoration: underline;
        text-underline-offset: 3px;
    }
    .wall {
        position: relative;
    }
    canvas {
        display: block;
        width: 100%;
    }
    .wall-hits {
        position: absolute;
        inset: 0;
    }
    .wall-hit {
        position: absolute;
        margin: 0;
        padding: 0;
        border: 0;
        background: transparent;
        cursor: pointer;
        border-radius: 1px;
    }
    .wall-hit:focus-visible {
        outline: 2px solid var(--line-strong);
        outline-offset: 2px;
    }
    @media (hover: hover) {
        .wall-hit:hover {
            outline: 2px solid var(--line-strong);
            outline-offset: 1px;
        }
    }
    .wall-card {
        position: absolute;
        z-index: 6;
        width: min(330px, calc(100% - 8px));
        padding: 16px 18px;
        border: 1px solid var(--line);
        border-radius: 10px;
        background: var(--bg);
        color: var(--text);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.16);
        pointer-events: none;
    }
    .wc-who {
        display: block;
        font-size: 16px;
        font-weight: 700;
        letter-spacing: -0.01em;
    }
    .wc-kind {
        display: block;
        font-size: 13px;
        color: var(--muted);
    }
    .wc-msg {
        display: block;
        margin: 10px 0 0;
        font-size: 15px;
        font-weight: 600;
        color: var(--text);
    }
    .wall-card q {
        display: block;
        margin: 12px 0 0;
        font-size: 15px;
        line-height: 1.5;
        color: var(--text-2);
    }
    .wc-gift {
        display: block;
        margin: 12px 0 0;
        padding-top: 10px;
        border-top: 1px solid var(--line);
        font-size: 12.5px;
        color: var(--muted);
    }
    .wall-key {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: baseline;
        gap: 10px 28px;
        margin-top: 18px;
    }
    .wall-legend {
        display: flex;
        flex-wrap: wrap;
        gap: 8px 18px;
        margin: 0;
        font-size: 13.5px;
        color: var(--muted);
    }
    .wall-legend i {
        position: relative;
        display: inline-block;
        width: 12px;
        height: 12px;
        margin-right: 6px;
        vertical-align: -2px;
    }
    .k-rec {
        background: var(--text);
    }
    .k-cl {
        border: 1px solid var(--muted);
    }
    .k-av {
        background: var(--line);
    }
    .k-story {
        background: var(--text);
    }
    .k-story::after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        border-top: 6px solid var(--surface);
        border-left: 6px solid transparent;
    }
    .wall-fund {
        margin-top: clamp(18px, 2vw, 24px);
        padding-top: 14px;
        border-top: 1px solid var(--line-strong);
    }
    .wall-fund-h {
        margin: 0;
        font-size: clamp(22px, 2.4vw, 28px);
        letter-spacing: -0.03em;
    }
    .wall-fund-label {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: baseline;
        gap: 6px 24px;
        margin: 8px 0 14px;
        font-size: clamp(16px, 1.5vw, 18px);
        line-height: 1.7;
        color: var(--text-2);
    }
    .wall-fund-label a {
        flex: 0 0 auto;
        font-weight: 600;
        color: var(--text);
        text-decoration: underline;
        text-underline-offset: 3px;
        white-space: nowrap;
    }
    .wall-list {
        list-style: none;
        margin: 28px 0 0;
        padding: 0;
        border-top: 1px solid var(--line);
    }
    .wall-list li {
        padding: 18px 0;
        border-bottom: 1px solid var(--line);
    }
    .wall-list q {
        display: block;
        font-size: 17px;
        line-height: 1.5;
        color: var(--text-2);
    }
    .wall-list b {
        display: block;
        margin-top: 8px;
        font-size: 14.5px;
    }
    .wall-list span {
        font-size: 13px;
        color: var(--muted);
    }
    @media (max-width: 620px) {
        .wall-legend {
            gap: 6px 14px;
        }
    }
}
</style>
