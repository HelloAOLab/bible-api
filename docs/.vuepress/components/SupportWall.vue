<script setup lang="ts">
/**
 * The support wall on the home page. One square is a year's support at
 * `unit` dollars ($240 a year, or $20 a month). A gift claims its squares as
 * an outline, and the ink fills from the left as money arrives. A folded
 * corner marks a partner's story, read on hover, focus, or tap. Colours come
 * from the page tokens and are re-read on every draw, so dark mode just works.
 *
 * Edit `support-wall.json` by hand. Nothing here needs to change.
 *
 *   year, goal, unit  The wall's year, its total, and one square's yearly amount.
 *   others            Running totals for everyone not listed by name: their
 *                     squares fill from the top of the wall in order. claimed
 *                     is what has been committed for the year; received is
 *                     what has arrived.
 *   supporters        One entry per named or story-bearing supporter. Their
 *                     squares are drawn as a rectangle.
 *
 * A supporter entry:
 *
 *   {
 *     "name": "Lumen",            shown when public is true
 *     "public": true,             false shows "Anonymous"
 *     "kind": "Business",         "Individual", "Nonprofit", or "Business"
 *     "w": 4, "h": 2,             the rectangle in squares; w x h x unit = claimed
 *     "received": 480,            dollars received so far this year
 *     "cadence": "monthly",       "monthly", "annual", or "one-time"
 *     "story": "How we use it",   optional; adds the folded corner
 *     "message": "A short line",  optional; up to 80 characters, shown on hover
 *     "logo": "/wall/lumen.svg",  optional; a file in .vuepress/public, drawn
 *                                 inside the rectangle on white
 *     "at": [0.2, 0.1]            optional spot, as fractions across and down
 *   }
 *
 * Current base (October 2026): three active monthly donors on better.giving,
 * $125 + $70 + $3 = $198 a month = $2,376 claimed for 2027, nothing received
 * yet. Shown anonymously until each donor agrees to be named.
 *
 * Claims beyond the goal are reported as going to the Free Use Fund, drawn
 * below the wall.
 */
import { computed, onBeforeUnmount, onMounted, ref, shallowRef } from 'vue';
import { usePageLang, withBase } from 'vuepress/client';
import { useLabels } from '../composables/useLocale';
import { fillLabel, labelHtml } from '../composables/formatLabel';
import wallData from '../support-wall.json';

interface Supporter {
    name?: string;
    public?: boolean;
    kind?: string;
    w: number;
    h: number;
    received?: number;
    cadence?: 'monthly' | 'annual' | 'one-time';
    story?: string;
    message?: string;
    logo?: string;
    at?: [number, number];
}

interface Placed extends Supporter {
    x: number;
    y: number;
    claimed: number;
    received: number;
}

interface Cell {
    claimed: number;
    received: number;
    owner: number;
}

interface Tokens {
    ink: string;
    muted: string;
    line: string;
    paper: string;
}

const data = wallData as {
    year: number;
    goal: number;
    unit: number;
    others?: { claimed?: number; received?: number };
    supporters?: Supporter[];
};

const YEAR = data.year;
const GOAL = data.goal;
const UNIT = data.unit;
const FULL = Math.floor(GOAL / UNIT);
const TAIL = GOAL - FULL * UNIT;
const CELLS = FULL + (TAIL ? 1 : 0);
const SUPPORTERS = (data.supporters ?? []).filter(
    (s) => s && s.w > 0 && s.h > 0
);

const labels = useLabels();
const lang = usePageLang();

const money = (n: number) => {
    let amount: string;
    try {
        amount = Math.round(n).toLocaleString(lang.value);
    } catch {
        amount = Math.round(n).toLocaleString('en-US');
    }
    return '$' + amount;
};

const wallEl = ref<HTMLDivElement>();
const canvasEl = ref<HTMLCanvasElement>();
const fundEl = ref<HTMLCanvasElement>();
const cardEl = ref<HTMLDivElement>();

const cols = ref(0);
const rows = ref(0);
const placed = shallowRef<Placed[]>([]);
const totals = shallowRef({ claimed: 0, received: 0, overflow: 0 });
let cells: Cell[] = [];

const cap = (i: number) => (i < FULL ? UNIT : TAIL);
const colsFor = (w: number) => (w >= 900 ? 70 : w >= 560 ? 56 : 40);

const imgs: Record<string, HTMLImageElement> = {};
const logoReady = (p: Placed) => {
    const im = p.logo && imgs[p.logo];
    return !!(im && im.complete && im.naturalWidth);
};

/** Places the named supporters, returning which squares each one took. */
function layout(): Int16Array {
    rows.value = Math.ceil(CELLS / cols.value);
    const c = cols.value;
    const r = rows.value;
    const taken = new Int16Array(CELLS).fill(-1);
    const total = c * r;
    const fits = (x: number, y: number, w: number, h: number) => {
        if (x < 0 || y < 0 || x + w > c || y + h > r) return false;
        for (let j = 0; j < h; j++) {
            for (let k = 0; k < w; k++) {
                const i = (y + j) * c + x + k;
                if (i >= FULL || taken[i] >= 0) return false;
            }
        }
        return true;
    };
    placed.value = SUPPORTERS.map((s, n): Placed | null => {
        const w = Math.min(s.w, c);
        const at = s.at ?? [0, 0];
        const sx = Math.round(at[0] * (c - w));
        const sy = Math.round(at[1] * (r - s.h));
        for (let t = 0; t < total; t++) {
            const p = (sy * c + sx + t) % total;
            const x = p % c;
            const y = Math.floor(p / c);
            if (fits(x, y, w, s.h)) {
                for (let j = 0; j < s.h; j++) {
                    for (let k = 0; k < w; k++) {
                        taken[(y + j) * c + x + k] = n;
                    }
                }
                const claimed = s.w * s.h * UNIT;
                return {
                    ...s,
                    w,
                    x,
                    y,
                    claimed,
                    received: Math.min(claimed, Math.max(0, s.received ?? 0)),
                };
            }
        }
        return null;
    }).filter((p): p is Placed => !!p);
    return taken;
}

/** Fills the squares from the supporters and everyone else. */
function fund() {
    const taken = layout();
    cells = Array.from({ length: CELLS }, () => ({
        claimed: 0,
        received: 0,
        owner: -1,
    }));
    let claimed = 0;
    let received = 0;
    placed.value.forEach((p, n) => {
        const f = p.received / p.claimed;
        for (let j = 0; j < p.h; j++) {
            for (let k = 0; k < p.w; k++) {
                const c = cells[(p.y + j) * cols.value + p.x + k];
                c.owner = n;
                c.claimed = UNIT;
                c.received = UNIT * f;
            }
        }
        claimed += p.claimed;
        received += p.received;
    });
    // Everyone else: claims take open squares from the top, and received
    // money fills them in the same order.
    const o = data.others ?? {};
    let pool = Math.max(0, o.claimed ?? 0);
    let got = Math.min(pool, Math.max(0, o.received ?? 0));
    for (let i = 0; i < CELLS && pool > 0; i++) {
        if (taken[i] >= 0) continue;
        const c = cells[i];
        const amt = Math.min(cap(i), pool);
        c.claimed = amt;
        c.received = Math.min(amt, got);
        got -= c.received;
        pool -= amt;
        claimed += amt;
        received += c.received;
    }
    totals.value = { claimed, received, overflow: pool };
}

function tokens(): Tokens {
    const cs = getComputedStyle(wallEl.value!);
    const v = (n: string) => cs.getPropertyValue(n).trim();
    return {
        ink: v('--text'),
        muted: v('--muted'),
        line: v('--line'),
        paper: v('--surface'),
    };
}

/** A dog-ear: the corner is cut away to the paper, and the folded flap shows below the crease. */
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

/** A logo sits on white in both themes, so dark logos never disappear; a thin bar shows money still to come. */
function logoTile(
    ctx: CanvasRenderingContext2D,
    p: Placed,
    x: number,
    y: number,
    w: number,
    h: number,
    t: Tokens
) {
    const im = imgs[p.logo!];
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

function draw() {
    const wall = wallEl.value;
    const canvas = canvasEl.value;
    if (!wall || !canvas) return;
    const W = wall.clientWidth;
    if (!W) return;
    const next = colsFor(W);
    if (next !== cols.value) {
        cols.value = next;
        fund();
    }
    const size = W / cols.value;
    const H = size * rows.value;
    const gap = Math.max(1, size * 0.12);
    const r = window.devicePixelRatio || 1;
    const t = tokens();
    const s = size - gap;
    canvas.width = Math.round(W * r);
    canvas.height = Math.round(H * r);
    canvas.style.height = H + 'px';
    const ctx = canvas.getContext('2d')!;
    ctx.setTransform(r, 0, 0, r, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const list = placed.value;
    cells.forEach((c, i) => {
        if (c.owner >= 0 && list[c.owner].w * list[c.owner].h > 1) return;
        const x = (i % cols.value) * size;
        const y = Math.floor(i / cols.value) * size;
        const w = (s * cap(i)) / UNIT;
        if (!c.claimed) {
            ctx.fillStyle = t.line;
            ctx.fillRect(x, y, w, s);
            return;
        }
        if (c.received < c.claimed) {
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
        if (c.received) {
            ctx.fillStyle = t.ink;
            ctx.fillRect(x, y, (w * c.received) / cap(i), s);
        }
    });
    const font = getComputedStyle(wall).fontFamily;
    list.forEach((p) => {
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
            const label = p.public
                ? (p.name ?? '')
                : labels.value.home.wallAnonymous;
            const fs = Math.min(h * 0.36, w * 0.16, 15);
            if (fs >= 9) {
                ctx.font =
                    (p.public ? '700 ' : 'italic 600 ') + fs + 'px ' + font;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                // The name in paper over the filled part, in ink over the rest.
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
            const c =
                p.w * p.h > 1
                    ? Math.max(8, Math.min(12, s * 0.6))
                    : Math.max(4, Math.min(10, s * 0.55));
            corner(
                ctx,
                x,
                y,
                w,
                c,
                t,
                !logoReady(p) && p.received / p.claimed >= 0.85
            );
        }
    });
    drawFund(W, size, gap, t, r);
}

/**
 * The Free Use Fund continues the grid below the line: three fading rows
 * while empty, and as many rows as the overflow needs once the year is fully
 * claimed.
 */
function drawFund(W: number, size: number, gap: number, t: Tokens, r: number) {
    const c = fundEl.value;
    if (!c) return;
    const filled = totals.value.overflow / UNIT;
    const n = Math.max(3, Math.ceil(filled / cols.value) + 1);
    const H = size * n;
    const s = size - gap;
    c.width = Math.round(W * r);
    c.height = Math.round(H * r);
    c.style.height = H + 'px';
    const ctx = c.getContext('2d')!;
    ctx.setTransform(r, 0, 0, r, 0, 0);
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < n * cols.value; i++) {
        const row = Math.floor(i / cols.value);
        const x = (i % cols.value) * size;
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
                1 - (row - Math.floor(filled / cols.value)) * 0.32
            );
            ctx.fillStyle = t.line;
            ctx.fillRect(x, y, s, s);
        }
    }
    ctx.globalAlpha = 1;
}

const home = computed(() => labels.value.home);

const ariaLabel = computed(() =>
    fillLabel(home.value.wallLabel, {
        year: YEAR,
        squares: CELLS.toLocaleString(lang.value),
        monthly: money(UNIT / 12),
        received: money(totals.value.received),
        claimed: money(Math.min(GOAL, totals.value.claimed)),
    })
);

const fundText = computed(() =>
    totals.value.overflow > 0
        ? fillLabel(home.value.fundFull, {
              year: YEAR,
              amount: money(totals.value.overflow),
          })
        : home.value.fundBody
);

const stories = computed(() => placed.value.filter((p) => p.story));
const storyCount = computed(() =>
    stories.value.length === 1
        ? home.value.wallStoryOne
        : fillLabel(home.value.wallStoryMany, { count: stories.value.length })
);
const listOpen = ref(false);

const supporterName = (p: Placed) =>
    p.public ? (p.name ?? '') : home.value.wallAnonymous;

function gift(p: Placed) {
    const sq = p.w * p.h;
    const per = sq * UNIT;
    const squares =
        sq === 1
            ? home.value.wallSquaresOne
            : fillLabel(home.value.wallSquaresMany, { count: sq });
    const amount =
        p.cadence === 'monthly'
            ? fillLabel(home.value.wallMonthly, { amount: money(per / 12) })
            : fillLabel(
                  p.cadence === 'one-time'
                      ? home.value.wallOneTime
                      : home.value.wallYearly,
                  { amount: money(per) }
              );
    const percent = fillLabel(home.value.wallPercentReceived, {
        percent: Math.round((p.received / p.claimed) * 100),
    });
    return `${squares} · ${amount} · ${percent}`;
}

// The squares that answer the pointer: anyone with something to show.
const hits = computed(() =>
    cols.value
        ? placed.value
              .filter((p) => p.story || p.public || p.message || p.logo)
              .map((p) => ({
                  p,
                  style: {
                      left: (p.x / cols.value) * 100 + '%',
                      top: (p.y / rows.value) * 100 + '%',
                      width: `calc(${(p.w / cols.value) * 100}% - 1px)`,
                      height: `calc(${(p.h / rows.value) * 100}% - 1px)`,
                  },
                  label:
                      (p.public ? p.name : home.value.wallAnonymousPartner) +
                      (p.story ? ', ' + home.value.wallHasStory : '') +
                      '. ' +
                      gift(p),
              }))
        : []
);

const card = shallowRef<Placed | null>(null);
const cardPos = ref({ left: 0, top: 0 });
let pinned: HTMLElement | null = null;

function showCard(p: Placed, btn: HTMLElement, ev?: PointerEvent) {
    card.value = p;
    // Measure once the card has rendered with the new supporter in it.
    requestAnimationFrame(() => {
        const wall = wallEl.value;
        const el = cardEl.value;
        if (!wall || !el) return;
        const wr = wall.getBoundingClientRect();
        const br = btn.getBoundingClientRect();
        const cw = el.offsetWidth;
        const ch = el.offsetHeight;
        let left: number;
        let top: number;
        if (ev && ev.pointerType === 'mouse') {
            left = ev.clientX - wr.left + 16;
            top = ev.clientY - wr.top + 16;
            if (left + cw > wr.width) left = ev.clientX - wr.left - cw - 16;
        } else {
            left = br.left - wr.left + br.width / 2 - cw / 2;
            top = br.bottom - wr.top + 8;
            if (top + ch > wr.height && br.top - wr.top - ch - 8 > 0) {
                top = br.top - wr.top - ch - 8;
            }
        }
        cardPos.value = {
            left: Math.max(4, Math.min(wr.width - cw - 4, left)),
            top: Math.max(4, top),
        };
    });
}

function hideCard() {
    card.value = null;
    pinned = null;
}

function onPointer(p: Placed, e: PointerEvent) {
    if (e.pointerType === 'mouse' && !pinned) {
        showCard(p, e.currentTarget as HTMLElement, e);
    }
}

function onLeave(e: PointerEvent) {
    if (e.pointerType === 'mouse' && !pinned) card.value = null;
}

function onBlur() {
    if (!pinned) card.value = null;
}

function onClick(p: Placed, e: MouseEvent) {
    e.stopPropagation();
    const btn = e.currentTarget as HTMLElement;
    if (pinned === btn) {
        hideCard();
        return;
    }
    pinned = btn;
    showCard(p, btn);
}

const onDocumentClick = (e: MouseEvent) => {
    if (pinned && !cardEl.value?.contains(e.target as Node)) hideCard();
};
const onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') hideCard();
};

let resizeObserver: ResizeObserver | undefined;
let themeObserver: MutationObserver | undefined;
let darkQuery: MediaQueryList | undefined;

onMounted(() => {
    SUPPORTERS.forEach((s) => {
        if (s.logo && !imgs[s.logo]) {
            const im = new Image();
            im.onload = () => draw();
            im.src = s.logo.startsWith('/') ? withBase(s.logo) : s.logo;
            imgs[s.logo] = im;
        }
    });

    cols.value = colsFor(wallEl.value?.clientWidth || 1100);
    fund();
    draw();

    let lastW = 0;
    resizeObserver = new ResizeObserver(() => {
        const w = wallEl.value?.clientWidth ?? 0;
        if (w !== lastW) {
            lastW = w;
            hideCard();
            draw();
        }
    });
    resizeObserver.observe(wallEl.value!);
    themeObserver = new MutationObserver(draw);
    themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme', 'class'],
    });
    darkQuery = matchMedia('(prefers-color-scheme: dark)');
    darkQuery.addEventListener('change', draw);
    document.addEventListener('click', onDocumentClick);
    document.addEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => {
    resizeObserver?.disconnect();
    themeObserver?.disconnect();
    darkQuery?.removeEventListener('change', draw);
    document.removeEventListener('click', onDocumentClick);
    document.removeEventListener('keydown', onKeydown);
});
</script>

<template>
    <div class="support-wall">
        <div class="wall-head">
            <span class="wall-head-l">{{
                fillLabel(home.wallYear, { year: YEAR })
            }}</span>
            <span
                class="wall-head-r"
                v-html="labelHtml(home.wallGoal, { amount: money(GOAL) })"
            ></span>
        </div>
        <div v-if="stories.length" class="wall-top">
            <span>{{ storyCount }}</span>
            <button
                type="button"
                class="wall-link"
                :aria-expanded="listOpen"
                aria-controls="wall-list"
                @click="listOpen = !listOpen"
            >
                {{ listOpen ? home.wallHideStories : home.wallReadStories }}
            </button>
        </div>
        <div ref="wallEl" class="wall">
            <canvas ref="canvasEl" role="img" :aria-label="ariaLabel"></canvas>
            <div class="wall-hits">
                <button
                    v-for="(hit, i) in hits"
                    :key="i"
                    type="button"
                    class="wall-hit"
                    :style="hit.style"
                    :aria-label="hit.label"
                    @pointerenter="onPointer(hit.p, $event)"
                    @pointermove="onPointer(hit.p, $event)"
                    @pointerleave="onLeave"
                    @focus="
                        showCard(hit.p, $event.currentTarget as HTMLElement)
                    "
                    @blur="onBlur"
                    @click="onClick(hit.p, $event)"
                ></button>
            </div>
            <div
                v-if="card"
                ref="cardEl"
                class="wall-card"
                role="tooltip"
                :style="{
                    left: cardPos.left + 'px',
                    top: cardPos.top + 'px',
                }"
            >
                <span class="wc-who">{{ supporterName(card) }}</span>
                <span v-if="card.kind" class="wc-kind">{{ card.kind }}</span>
                <span v-if="card.message" class="wc-msg">{{
                    card.message
                }}</span>
                <q v-if="card.story">{{ card.story }}</q>
                <span class="wc-gift">{{ gift(card) }}</span>
            </div>
        </div>
        <div class="wall-key">
            <div class="wall-legend">
                <span><i class="k-rec"></i>{{ home.wallReceived }}</span>
                <span><i class="k-story"></i>{{ home.wallStory }}</span>
                <span><i class="k-cl"></i>{{ home.wallClaimed }}</span>
                <span><i class="k-av"></i>{{ home.wallOpen }}</span>
            </div>
            <p
                class="wall-note"
                v-html="
                    labelHtml(home.wallSquare, {
                        monthly: money(UNIT / 12),
                        yearly: money(UNIT),
                    })
                "
            ></p>
        </div>
        <div class="wall-fund">
            <h3 class="wall-fund-h">{{ home.fundTitle }}</h3>
            <p class="wall-fund-label">
                <span>{{ fundText }}</span>
                <a href="#fund">{{ home.fundLink }}&nbsp;&darr;</a>
            </p>
            <canvas ref="fundEl" aria-hidden="true"></canvas>
        </div>
        <ul
            v-if="stories.length"
            v-show="listOpen"
            id="wall-list"
            class="wall-list"
        >
            <li v-for="(p, i) in stories" :key="i">
                <q>{{ p.story }}</q>
                <b>{{ supporterName(p) }}</b>
                <span>{{ (p.kind ? p.kind + ' · ' : '') + gift(p) }}</span>
            </li>
        </ul>
    </div>
</template>

<style lang="scss">
// Tokens come from .fuba-home, which this sits in.
.support-wall {
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
        font-size: 15px;
        color: var(--muted);
    }
    .wall-head-r strong {
        margin-right: 3px;
        font-size: 17px;
        font-weight: 700;
        color: var(--text);
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
        border-radius: 1px;
        background: transparent;
        cursor: pointer;
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
        box-shadow: 0 10px 30px rgb(0 0 0 / 16%);
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
    .k-rec,
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
    .k-cl {
        border: 1px solid var(--muted);
    }
    .k-av {
        background: var(--line);
    }
    .wall-note {
        margin: 0;
        font-size: 15px;
        color: var(--muted);
    }
    .wall-note strong {
        color: var(--text);
        font-weight: 700;
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
