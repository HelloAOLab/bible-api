<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { usePageLang } from 'vuepress/client';
import SiteFooter from './SiteFooter.vue';
import SupportWall from './SupportWall.vue';
import { fillLabel, labelHtml } from '../composables/formatLabel';
import { useLabels } from '../composables/useLocale';
import type { Labels } from '../labels';
import { WALL_DATA } from '../wallData';

const FORM_URL =
    'https://better.giving/forms/8c81946b-9395-4007-b74f-da7498778c0c';
const NCF_URL =
    'https://secure.ncfgiving.com/charityprofile?cpid=a1HVx0000005n9lMAA&id=a0aVx00000DsuH6IAJ';
const FORECAST_URL =
    'https://docs.google.com/spreadsheets/d/1Y-9ZZHCfAKu6tgn4gpvoX-8JUtYgV5fAt8m2zh8GtLE/edit?gid=1143846038#gid=1143846038';
const DIRECTOR_EMAIL = 'craig@helloao.org';
const HELLO_EMAIL = 'hello@helloao.org';

const labels = useLabels();
const lang = usePageLang();
const s = computed(() => labels.value.support);

const UNIT = WALL_DATA.unit;
const YEAR = WALL_DATA.year;

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
const perMonth = (squares: number) =>
    fillLabel(labels.value.wall.perMonth, {
        amount: money((squares * UNIT) / 12),
    });
const squaresLabel = (n: number) =>
    fillLabel(n === 1 ? labels.value.wall.square : labels.value.wall.squares, {
        count: n,
    });

const mailto = (subject: string, body: string) =>
    `mailto:${HELLO_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

const intro = computed(() => fillLabel(s.value.intro, { year: YEAR }));
const giftBody = computed(() =>
    labelHtml(s.value.giftBody, {
        month: money(UNIT / 12),
        year: money(UNIT),
    })
);
const testimonyMail = computed(() =>
    mailto(s.value.testimonySubject, s.value.testimonyEmail)
);
const detailsMail = computed(() =>
    mailto(
        fillLabel(s.value.detailsSubject, { year: YEAR }),
        s.value.detailsEmail
    )
);
const logoBody = computed(() =>
    labelHtml(s.value.rows.logoBody, {
        sizes: `<a href="#logos" class="inref">${labelHtml(s.value.rows.logoSizesLink)}</a>`,
    })
);

/* ---------- testimony, gift or both ---------- */

type Choice = 'testimony' | 'gift' | 'both';
const CHOICES: Choice[] = ['testimony', 'gift', 'both'];
const choice = ref<Choice | null>(null);
// Until the page is interactive every panel shows, so nothing is hidden from
// a reader without script.
const ready = ref(false);
const shows = (...forChoices: Choice[]) =>
    !ready.value || (!!choice.value && forChoices.includes(choice.value));

const logos = ref<HTMLDetailsElement>();

function fromHash() {
    const h = location.hash;
    if (h === '#logos' || h === '#give' || h === '#recognition') {
        choice.value = 'gift';
    } else if (h === '#testimony') {
        choice.value = 'testimony';
    }
    if (h === '#logos' && logos.value) {
        logos.value.open = true;
        setTimeout(() => logos.value?.scrollIntoView({ block: 'start' }), 0);
    }
}

function openLogos(e: MouseEvent) {
    if ((e.target as Element).closest?.('a[href="#logos"]') && logos.value) {
        logos.value.open = true;
    }
}

/* ---------- logo sizes ---------- */

type Shape = keyof Labels['support']['shapes'];
const SHAPES: {
    id: Shape;
    smallest: [number, number];
    best: [number, number];
}[] = [
    { id: 'square', smallest: [3, 3], best: [4, 4] },
    { id: 'horizontal', smallest: [4, 2], best: [6, 3] },
    { id: 'wide', smallest: [6, 2], best: [9, 3] },
    { id: 'veryWide', smallest: [10, 2], best: [15, 3] },
    { id: 'tall', smallest: [2, 4], best: [3, 6] },
];
const sizeCell = ([w, h]: [number, number]) =>
    fillLabel(s.value.sizeCell, { w, h, squares: squaresLabel(w * h) });

/* ---------- the example wall ---------- */

// Placeholder gifts at the real wall's scale, so a giver can see what each
// logo size looks like. Same column counts as SupportWall.vue.
type ExCard = {
    who: string;
    kind?: string;
    msg?: string;
    story: string;
    gift: string;
};
type ExItem = {
    type: 'name' | 'logo' | 'anon';
    w: number;
    h: number;
    text: string;
    title: string;
    card?: ExCard;
};

const exItems = computed<ExItem[]>(() => {
    const e = s.value.example;
    const k = labels.value.wall.kinds;
    const shape = (id: Shape, w: number, h: number, extra = '') =>
        `${s.value.shapes[id].name}${extra} · ${w} × ${h} · ${perMonth(w * h)}`;
    return [
        {
            type: 'name',
            w: 4,
            h: 2,
            text: e.yourName,
            title: `${e.namedGift} · 4 × 2 · ${perMonth(8)}`,
            card: {
                who: e.yourName,
                kind: k.Individual,
                msg: e.message,
                story: e.namedStory,
                gift: `${squaresLabel(8)} · ${perMonth(8)}`,
            },
        },
        { type: 'logo', w: 3, h: 3, text: '', title: shape('square', 3, 3) },
        {
            type: 'anon',
            w: 4,
            h: 2,
            text: labels.value.wall.anonymous,
            title: `${e.anonymousGift} · 4 × 2 · ${perMonth(8)}`,
            card: {
                who: labels.value.wall.anonymous,
                kind: k.Business,
                story: e.anonymousStory,
                gift: `${squaresLabel(8)} · ${perMonth(8)} · ${e.pledgedSuffix}`,
            },
        },
        {
            type: 'logo',
            w: 4,
            h: 2,
            text: '',
            title: shape('horizontal', 4, 2),
        },
        { type: 'logo', w: 2, h: 4, text: '', title: shape('tall', 2, 4) },
        {
            type: 'logo',
            w: 6,
            h: 2,
            text: '',
            title: shape('wide', 6, 2),
            card: {
                who: e.yourOrganization,
                kind: k.Nonprofit,
                story: e.logoStory,
                gift: `${squaresLabel(12)} · ${perMonth(12)}`,
            },
        },
        {
            type: 'logo',
            w: 10,
            h: 2,
            text: '',
            title: shape('veryWide', 10, 2),
        },
        {
            type: 'logo',
            w: 15,
            h: 3,
            text: '',
            title: shape('veryWide', 15, 3, `, ${e.recommended}`),
        },
    ];
});

const exWall = ref<HTMLDivElement>();
const exWidth = ref(0);

const exLayout = computed(() => {
    const W = exWidth.value;
    if (!W) return null;
    const cols = W >= 900 ? 70 : W >= 560 ? 56 : 40;
    const gap = cols === 40 ? 1 : 2;
    const size = (W - gap * (cols - 1)) / cols;
    const e = s.value.example;
    const w = labels.value.wall;

    /* shelf-pack the examples under a top row of received and pledged
       squares */
    let x = 2;
    let y = 3;
    let shelf = 0;
    const taken = new Set<string>();
    const items = exItems.value.map((it) => {
        if (x + it.w - 1 > cols - 1) {
            x = 2;
            y += shelf + 1;
            shelf = 0;
        }
        const at = { x, y };
        x += it.w + 2;
        shelf = Math.max(shelf, it.h);
        for (let a = 0; a < it.w; a++)
            for (let b = 0; b < it.h; b++) taken.add(`${at.x + a},${at.y + b}`);

        // The biggest text that fits, trying shorter wordings for logos.
        const bw = it.w * size + (it.w - 1) * gap - 8;
        const bh = it.h * size + (it.h - 1) * gap - 4;
        const options =
            it.type === 'logo'
                ? [[e.yourLogo], [e.yourLogoShort, e.here], [e.logo]]
                : [[it.text]];
        let lines: string[] = [];
        let fontSize = 0;
        for (const o of options) {
            const len = Math.max(...o.map((l) => l.length));
            const fs = Math.min(bh / (o.length * 1.25), bw / (len * 0.6), 15);
            if (fs >= 7.5) {
                lines = o;
                fontSize = fs;
                break;
            }
        }
        return { ...it, ...at, lines, fontSize };
    });
    const rows = y + shelf;

    const cells: {
        x: number;
        y: number;
        cls: string;
        title: string;
        card?: ExCard;
    }[] = [];
    for (let r = 1; r <= rows; r++) {
        for (let c = 1; c <= cols; c++) {
            if (taken.has(`${c},${r}`)) continue;
            let cls = '';
            let title = w.open;
            let card: ExCard | undefined;
            if (r === 1 && c <= 14) {
                cls = 'rec';
                title = w.received;
                if (c === 6) {
                    card = {
                        who: w.anonymous,
                        kind: w.kinds.Individual,
                        story: e.squareStory,
                        gift: `${squaresLabel(1)} · ${perMonth(1)}`,
                    };
                } else if (c === 11) {
                    card = {
                        who: e.church,
                        kind: w.kinds.Nonprofit,
                        story: e.churchStory,
                        gift: `${squaresLabel(1)} · ${fillLabel(w.forYear, {
                            amount: money(UNIT),
                        })}`,
                    };
                }
            } else if (r === 1 && c <= 20) {
                cls = 'pl';
                title = w.pledged;
            }
            cells.push({ x: c, y: r, cls, title: card ? '' : title, card });
        }
    }
    return { cols, size, items, cells };
});

const exCard = ref<ExCard | null>(null);
const exCardPos = ref({ left: 0, top: 0 });
const exCardEl = ref<HTMLDivElement>();
let exPinned: EventTarget | null = null;

function showEx(card: ExCard, el: HTMLElement) {
    exCard.value = card;
    requestAnimationFrame(() => {
        const wall = exWall.value;
        const cd = exCardEl.value;
        if (!wall || !cd) return;
        const wr = wall.getBoundingClientRect();
        const br = el.getBoundingClientRect();
        const cw = cd.offsetWidth;
        exCardPos.value = {
            left: Math.max(
                0,
                Math.min(
                    wr.width - cw,
                    br.left - wr.left + br.width / 2 - cw / 2
                )
            ),
            top: br.bottom - wr.top + 8,
        };
    });
}
function exEnter(card: ExCard | undefined, e: PointerEvent) {
    if (card && e.pointerType === 'mouse' && !exPinned)
        showEx(card, e.currentTarget as HTMLElement);
}
function exLeave(e: PointerEvent) {
    if (e.pointerType === 'mouse' && !exPinned) exCard.value = null;
}
function exFocus(card: ExCard | undefined, e: FocusEvent) {
    if (card) showEx(card, e.currentTarget as HTMLElement);
}
function exBlur() {
    if (!exPinned) exCard.value = null;
}
function exClick(card: ExCard | undefined, e: MouseEvent) {
    if (!card) return;
    e.stopPropagation();
    if (exPinned === e.currentTarget) {
        exPinned = null;
        exCard.value = null;
        return;
    }
    exPinned = e.currentTarget;
    showEx(card, e.currentTarget as HTMLElement);
}
function closeEx() {
    if (exPinned) {
        exPinned = null;
        exCard.value = null;
    }
}

let resize: ResizeObserver | undefined;

onMounted(() => {
    ready.value = true;
    fromHash();
    window.addEventListener('hashchange', fromHash);
    document.addEventListener('click', closeEx);
    resize = new ResizeObserver(() => {
        exWidth.value = exWall.value?.clientWidth ?? 0;
    });
    if (exWall.value) resize.observe(exWall.value);
});

onBeforeUnmount(() => {
    window.removeEventListener('hashchange', fromHash);
    document.removeEventListener('click', closeEx);
    resize?.disconnect();
});
</script>

<template>
    <div class="fuba-page fuba-support" @click="openLogos">
        <main>
            <section class="hero">
                <div class="shell">
                    <h1>{{ s.title }}</h1>
                    <p class="sub">{{ intro }}</p>
                    <SupportWall />
                </div>
            </section>

            <section class="section help">
                <div class="shell">
                    <fieldset class="choose">
                        <legend>
                            <h2 class="choose-h">{{ s.chooseTitle }}</h2>
                        </legend>
                        <label v-for="c in CHOICES" :key="c" class="pick">
                            <input
                                v-model="choice"
                                type="radio"
                                name="help"
                                :value="c"
                            />
                            <span class="pick-body">
                                <span>
                                    <b>{{ s.choices[c].name }}</b>
                                    <small>{{ s.choices[c].detail }}</small>
                                </span>
                                <i aria-hidden="true">&rarr;</i>
                            </span>
                        </label>
                        <p class="choose-note">{{ s.chooseNote }}</p>
                    </fieldset>

                    <div
                        v-show="shows('testimony', 'both')"
                        id="testimony"
                        class="help-panel"
                    >
                        <h3 class="help-h">{{ s.testimonyTitle }}</h3>
                        <p>{{ s.testimonyBody }}</p>
                        <div class="cta left">
                            <a class="btn primary" :href="testimonyMail"
                                >{{ s.testimonyButton }}
                                <span aria-hidden="true">&rarr;</span></a
                            >
                        </div>
                    </div>

                    <div
                        v-show="shows('gift', 'both')"
                        id="give"
                        class="help-panel"
                    >
                        <h3 class="help-h">{{ s.giftTitle }}</h3>
                        <p v-html="giftBody"></p>
                        <div class="give-grid">
                            <div class="give-main">
                                <div class="give-form">
                                    <iframe
                                        :src="FORM_URL"
                                        allow="payment"
                                        loading="lazy"
                                        :title="s.formTitle"
                                    ></iframe>
                                </div>
                                <p class="give-alt">
                                    {{ s.formFallback }}
                                    <a
                                        :href="FORM_URL"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        >{{ s.formOpen }} &#8599;</a
                                    >
                                </p>
                            </div>

                            <aside class="ways">
                                <p class="ways-lead">
                                    <b>{{ s.waysLead }}</b>
                                </p>
                                <div class="way">
                                    <p class="what">
                                        <b>{{ s.otherWaysTitle }}</b>
                                        <span>{{ s.otherWaysBody }}</span>
                                    </p>
                                    <a
                                        class="to"
                                        :href="NCF_URL"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        >{{ s.otherWaysLink }} &#8599;</a
                                    >
                                </div>
                                <div class="way">
                                    <p class="what">
                                        <b>{{ s.booksTitle }}</b>
                                        <span>{{ s.booksBody }}</span>
                                    </p>
                                    <a
                                        class="to"
                                        :href="FORECAST_URL"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        >{{ s.booksLink }} &#8599;</a
                                    >
                                </div>
                                <div class="way">
                                    <p class="what">
                                        <b>{{ s.directorTitle }}</b>
                                        <span>{{ s.directorBody }}</span>
                                    </p>
                                    <a
                                        class="to"
                                        :href="`mailto:${DIRECTOR_EMAIL}`"
                                        >{{ DIRECTOR_EMAIL }}</a
                                    >
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>
            </section>

            <section
                v-show="shows('gift', 'both')"
                id="recognition"
                class="section alt help-panel"
            >
                <div class="shell">
                    <div class="head">
                        <h2>{{ s.recognitionTitle }}</h2>
                        <p>{{ s.recognitionBody }}</p>
                    </div>
                    <div
                        ref="exWall"
                        class="ex-wall"
                        role="img"
                        :aria-label="s.exampleLabel"
                        :style="
                            exLayout
                                ? {
                                      gridTemplateColumns: `repeat(${exLayout.cols}, ${exLayout.size}px)`,
                                      gridAutoRows: exLayout.size + 'px',
                                  }
                                : undefined
                        "
                    >
                        <template v-if="exLayout">
                            <div
                                v-for="(it, n) in exLayout.items"
                                :key="'i' + n"
                                class="ex-item"
                                :class="['ex-' + it.type, { story: it.card }]"
                                :title="it.card ? undefined : it.title"
                                :tabindex="it.card ? 0 : undefined"
                                :role="it.card ? 'button' : undefined"
                                :aria-label="
                                    it.card
                                        ? `${it.card.who}: ${it.card.story}`
                                        : undefined
                                "
                                :style="{
                                    gridColumn: `${it.x} / span ${it.w}`,
                                    gridRow: `${it.y} / span ${it.h}`,
                                    fontSize: it.fontSize + 'px',
                                }"
                                @pointerenter="exEnter(it.card, $event)"
                                @pointerleave="exLeave"
                                @focus="exFocus(it.card, $event)"
                                @blur="exBlur"
                                @click="exClick(it.card, $event)"
                            >
                                <template v-for="(line, k) in it.lines" :key="k"
                                    ><br v-if="k" />{{ line }}</template
                                >
                            </div>
                            <div
                                v-for="c in exLayout.cells"
                                :key="c.x + ',' + c.y"
                                class="ex-c"
                                :class="[c.cls, { story: c.card }]"
                                :title="c.title || undefined"
                                :tabindex="c.card ? 0 : undefined"
                                :role="c.card ? 'button' : undefined"
                                :aria-label="
                                    c.card
                                        ? `${c.card.who}: ${c.card.story}`
                                        : undefined
                                "
                                :style="{
                                    gridColumn: `${c.x} / span 1`,
                                    gridRow: `${c.y} / span 1`,
                                }"
                                @pointerenter="exEnter(c.card, $event)"
                                @pointerleave="exLeave"
                                @focus="exFocus(c.card, $event)"
                                @blur="exBlur"
                                @click="exClick(c.card, $event)"
                            ></div>
                        </template>
                        <div
                            v-show="exCard"
                            ref="exCardEl"
                            class="ex-card"
                            role="tooltip"
                            :style="{
                                left: exCardPos.left + 'px',
                                top: exCardPos.top + 'px',
                            }"
                        >
                            <template v-if="exCard">
                                <span class="wc-who">{{ exCard.who }}</span>
                                <span v-if="exCard.kind" class="wc-kind">{{
                                    exCard.kind
                                }}</span>
                                <span v-if="exCard.msg" class="wc-msg">{{
                                    exCard.msg
                                }}</span>
                                <q>{{ exCard.story }}</q>
                                <span class="wc-gift">{{ exCard.gift }}</span>
                            </template>
                        </div>
                    </div>
                    <p class="ex-cap">{{ s.exampleCaption }}</p>

                    <table class="options">
                        <tbody>
                            <tr>
                                <td>{{ s.rows.nameTitle }}</td>
                                <td>{{ s.rows.nameBody }}</td>
                            </tr>
                            <tr>
                                <td>{{ s.rows.storyTitle }}</td>
                                <td>{{ s.rows.storyBody }}</td>
                            </tr>
                            <tr>
                                <td>{{ s.rows.messageTitle }}</td>
                                <td>{{ s.rows.messageBody }}</td>
                            </tr>
                            <tr>
                                <td>{{ s.rows.logoTitle }}</td>
                                <td v-html="logoBody"></td>
                            </tr>
                            <tr class="logo-more">
                                <td colspan="2">
                                    <details id="logos" ref="logos">
                                        <summary>
                                            <span class="s-closed"
                                                >{{
                                                    s.sizesOpen
                                                }}&nbsp;&darr;</span
                                            >
                                            <span class="s-open"
                                                >{{
                                                    s.sizesClose
                                                }}&nbsp;&uarr;</span
                                            >
                                        </summary>
                                        <p class="logo-intro">
                                            {{ s.sizesIntro }}
                                        </p>
                                        <table class="sizes">
                                            <thead>
                                                <tr>
                                                    <th>
                                                        {{
                                                            s.sizesColumns.shape
                                                        }}
                                                    </th>
                                                    <th>
                                                        {{
                                                            s.sizesColumns
                                                                .smallest
                                                        }}
                                                    </th>
                                                    <th>
                                                        {{
                                                            s.sizesColumns
                                                                .recommended
                                                        }}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr
                                                    v-for="shape in SHAPES"
                                                    :key="shape.id"
                                                >
                                                    <td>
                                                        {{
                                                            s.shapes[shape.id]
                                                                .name
                                                        }}<span>{{
                                                            s.shapes[shape.id]
                                                                .ratio
                                                        }}</span>
                                                    </td>
                                                    <td
                                                        :data-label="
                                                            s.sizesColumns
                                                                .smallest
                                                        "
                                                    >
                                                        {{
                                                            sizeCell(
                                                                shape.smallest
                                                            )
                                                        }}<span>{{
                                                            perMonth(
                                                                shape
                                                                    .smallest[0] *
                                                                    shape
                                                                        .smallest[1]
                                                            )
                                                        }}</span>
                                                    </td>
                                                    <td
                                                        :data-label="
                                                            s.sizesColumns
                                                                .recommended
                                                        "
                                                    >
                                                        {{ sizeCell(shape.best)
                                                        }}<span>{{
                                                            perMonth(
                                                                shape.best[0] *
                                                                    shape
                                                                        .best[1]
                                                            )
                                                        }}</span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <p class="gift-note">
                                            {{ s.sizesNote }}
                                        </p>
                                    </details>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div v-show="shows('gift')" class="help-panel">
                        <p class="gift-note">{{ s.detailsNote }}</p>
                        <div class="cta left">
                            <a class="btn primary" :href="detailsMail"
                                >{{ s.detailsButton }}
                                <span aria-hidden="true">&rarr;</span></a
                            >
                        </div>
                    </div>
                </div>
            </section>

            <section class="section alt thanks">
                <div class="shell">
                    <h2>{{ s.thanksTitle }}</h2>
                    <p>{{ s.thanksBody }}</p>
                    <p class="sign">{{ s.signOff }}</p>
                    <p class="sign team">{{ s.team }}</p>
                </div>
            </section>
        </main>

        <SiteFooter />
    </div>
</template>

<style lang="scss">
.fuba-page.fuba-support {
    .hero {
        text-align: left;
        padding-bottom: clamp(20px, 3vw, 32px);
    }
    .hero .sub {
        max-width: 68ch;
        margin-left: 0;
        text-wrap: pretty;
    }
    .help {
        padding-top: clamp(36px, 4vw, 52px);
    }

    /* ---------- testimony / gift / both ---------- */
    .choose {
        border: 0;
        margin: 0;
        padding: 0;
        min-inline-size: 0;
        max-width: 760px;
        display: grid;
        gap: 10px;
    }
    .choose legend {
        padding: 0;
        margin: 0 0 16px;
    }
    .choose-h {
        margin: 0;
        font-size: clamp(24px, 2.6vw, 30px);
        letter-spacing: -0.03em;
    }
    .pick {
        position: relative;
        display: block;
        cursor: pointer;
    }
    .pick input {
        position: absolute;
        left: 20px;
        top: 50%;
        width: 18px;
        height: 18px;
        margin: -9px 0 0;
        accent-color: var(--text);
        cursor: pointer;
    }
    .pick-body {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
        min-height: 70px;
        padding: 14px 20px 14px 54px;
        border: 1px solid var(--line);
        border-radius: 12px;
        transition:
            border-color 0.15s ease,
            background 0.15s ease;
    }
    .pick b {
        display: block;
        font-size: 17px;
        letter-spacing: -0.015em;
        line-height: 1.3;
    }
    .pick small {
        display: block;
        margin-top: 2px;
        font-size: 14px;
        color: var(--muted);
    }
    .pick i {
        font-style: normal;
        font-size: 19px;
        color: var(--muted);
    }
    @media (hover: hover) {
        .pick:hover .pick-body {
            border-color: var(--muted);
        }
    }
    .pick input:checked + .pick-body {
        border-color: var(--text);
        box-shadow: inset 0 0 0 1px var(--text);
        background: var(--surface);
    }
    .pick input:checked + .pick-body i {
        color: var(--text);
    }
    .pick input:focus-visible + .pick-body {
        outline: 2px solid var(--line-strong);
        outline-offset: 3px;
    }
    .choose-note {
        margin: 6px 0 0;
        font-size: 13.5px;
        color: var(--muted);
    }
    #testimony,
    #give {
        margin-top: clamp(36px, 4vw, 52px);
    }
    #testimony {
        max-width: 760px;
    }
    .help-h {
        margin: 0 0 12px;
        font-size: clamp(22px, 2.4vw, 26px);
        letter-spacing: -0.03em;
    }
    #testimony p,
    #give > p {
        margin: 0 0 16px;
        color: var(--text-2);
        font-size: 16px;
        line-height: 1.6;
    }
    #give > p strong {
        color: var(--text);
    }

    /* ---------- the gift form ---------- */
    .give-form {
        max-width: 760px;
        margin: 0;
        border: 1px solid var(--line);
        border-radius: 12px;
        overflow: hidden;
        background: #fff;
    }
    .give-form iframe {
        display: block;
        width: 100%;
        height: 940px;
        border: 0;
    }
    .give-alt {
        margin: 14px 0 0;
        font-size: 15px;
        color: var(--muted);
    }
    .give-alt a {
        font-weight: 600;
        color: var(--text);
        text-decoration: underline;
        text-underline-offset: 3px;
    }
    .ways {
        margin: clamp(40px, 5vw, 64px) 0 0;
    }
    .ways-lead {
        margin: 0;
        padding: 0 0 18px;
        font-size: 17px;
        line-height: 1.5;
        color: var(--text);
    }
    .way {
        display: grid;
        grid-template-columns: 1fr;
        gap: 12px;
        padding: 20px 0;
        border-bottom: 1px solid var(--line);
    }
    .way:first-of-type {
        border-top: 1px solid var(--line);
    }
    .way .what {
        margin: 0;
    }
    .way .what b {
        display: block;
        font-size: 19px;
        letter-spacing: -0.02em;
        color: var(--text);
    }
    .way .what span {
        display: block;
        margin-top: 6px;
        color: var(--muted);
        font-size: 15.5px;
        max-width: 44ch;
    }
    .way .to {
        justify-self: start;
        font-size: 19px;
        font-weight: 600;
        letter-spacing: -0.03em;
        color: var(--text);
        border-bottom: 1px solid var(--line);
        padding-bottom: 2px;
        overflow-wrap: anywhere;
    }
    .way .to:hover {
        border-bottom-color: var(--line-strong);
    }
    @media (min-width: 761px) {
        .give-form iframe {
            height: 740px;
        }
    }
    @media (min-width: 1000px) {
        .give-grid {
            display: grid;
            grid-template-columns: minmax(0, 760px) minmax(0, 1fr);
            gap: clamp(40px, 4vw, 64px);
            align-items: start;
        }
        .give-grid .ways {
            margin: 0;
        }
    }

    /* ---------- how a gift appears ---------- */
    .ex-wall {
        position: relative;
        display: grid;
        gap: 2px;
        min-height: 40px;
        margin: clamp(24px, 3vw, 32px) 0 0;
    }
    .ex-wall > * {
        min-width: 0;
    }
    .ex-c {
        background: var(--line);
    }
    .ex-c.rec {
        background: var(--text);
    }
    .ex-c.pl {
        box-shadow: inset 0 0 0 1px
            color-mix(in srgb, var(--muted) 70%, transparent);
        background: transparent;
    }
    .story {
        position: relative;
        cursor: pointer;
    }
    .ex-c.story::after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        border-top: 5px solid var(--surface);
        border-left: 5px solid transparent;
    }
    .ex-item {
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        text-align: center;
        line-height: 1.2;
        letter-spacing: -0.01em;
        white-space: nowrap;
    }
    .ex-name {
        background: var(--text);
        color: var(--bg);
        font-weight: 700;
    }
    .ex-anon {
        box-shadow: inset 0 0 0 1px var(--muted);
        color: var(--text);
        font-style: italic;
        font-weight: 600;
    }
    .ex-logo {
        background: #fff;
        color: #555;
        border: 1px dashed #8a8a8a;
        font-weight: 600;
    }
    .ex-item.story::after {
        content: '';
        position: absolute;
        top: -1px;
        right: -1px;
        border-top: 9px solid var(--surface);
        border-left: 9px solid transparent;
    }
    .ex-wall .story:focus-visible {
        outline: 2px solid var(--line-strong);
        outline-offset: 2px;
    }
    @media (hover: hover) {
        .ex-wall .story:hover {
            outline: 2px solid var(--line-strong);
            outline-offset: 1px;
        }
    }
    .ex-card {
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
    }
    .ex-card q {
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
    .ex-cap {
        margin: 10px 0 0;
        font-size: 13.5px;
        color: var(--muted);
    }

    /* ---------- the options table and the logo sizes ---------- */
    table {
        display: table;
        width: 100%;
        margin: 28px 0 0;
        border-collapse: collapse;
        font-size: 15.5px;
    }
    tr {
        border: 0;
        background: none !important;
    }
    td,
    th {
        border: 0;
    }
    td {
        padding: 14px 0;
        border-bottom: 1px solid var(--line);
        vertical-align: top;
        color: var(--muted);
    }
    td:first-child {
        width: 30%;
        padding-right: 24px;
        color: var(--text);
        font-weight: 600;
    }
    td span {
        display: block;
        font-weight: 400;
        color: var(--muted);
        font-size: 14px;
    }
    .logo-more > td {
        padding-top: 14px;
        width: auto;
        padding-right: 0;
        font-weight: 400;
        color: var(--text-2);
    }
    .logo-more details {
        margin: 0 0 6px;
    }
    .logo-more summary {
        display: block;
        width: fit-content;
        list-style: none;
        font-size: 16px;
        cursor: pointer;
        font-weight: 600;
        color: var(--text);
        text-decoration: underline;
        text-underline-offset: 3px;
    }
    .logo-more summary::-webkit-details-marker {
        display: none;
    }
    .logo-more summary span {
        display: inline;
        font-size: inherit;
        color: inherit;
        font-weight: inherit;
    }
    .logo-more summary .s-open,
    .logo-more details[open] summary .s-closed {
        display: none;
    }
    .logo-more details[open] summary .s-open {
        display: inline;
    }
    .logo-intro {
        margin: 16px 0 18px;
        color: var(--text-2);
        font-size: 15.5px;
    }
    .sizes {
        margin: 0;
    }
    .sizes th {
        padding: 0 24px 10px 0;
        text-align: left;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--muted);
        background: none;
        border-bottom: 1px solid var(--line);
    }
    .sizes td {
        color: var(--text);
        font-weight: 400;
    }
    .sizes td:first-child {
        width: 34%;
        font-weight: 600;
    }
    .gift-note {
        margin: 18px 0 0;
        color: var(--muted);
        font-size: 15px;
    }
    .inref {
        color: var(--text);
    }

    /* ---------- thanks ---------- */
    .thanks h2 {
        font-size: clamp(28px, 3.5vw, 40px);
        letter-spacing: -0.035em;
        margin: 0;
    }
    .thanks p {
        margin: 16px 0 0;
        max-width: 68ch;
        color: var(--text-2);
        font-size: 18px;
        line-height: 1.6;
    }
    .thanks .sign {
        margin-top: 24px;
        color: var(--text);
        font-weight: 600;
    }
    .thanks .sign.team {
        margin-top: 1.6em;
    }

    @media (max-width: 620px) {
        .ex-wall {
            gap: 1px;
        }
        td:first-child {
            width: 38%;
        }
        .sizes thead {
            display: none;
        }
        .sizes tr {
            display: block;
            padding: 14px 0;
            border-bottom: 1px solid var(--line);
        }
        .sizes td {
            display: block;
            width: auto !important;
            padding: 3px 0;
            border: 0;
        }
        .sizes td[data-label]::before {
            content: attr(data-label) ': ';
            color: var(--muted);
        }
        .sizes td span {
            display: inline;
            margin-left: 6px;
        }
    }
}
</style>
