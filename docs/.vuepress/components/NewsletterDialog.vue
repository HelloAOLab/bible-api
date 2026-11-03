<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { useLabels } from '../composables/useLocale';

/**
 * Newsletter signup, registered as a root component in client.ts.
 *
 * Any element with the class js-newsletter-trigger opens it. Nothing is
 * requested from the email provider (Benchmark Email) until a visitor
 * submits it, and nothing is written to the browser. Same list as the AO Lab
 * newsletter on helloao.org.
 */

const ENDPOINT = 'https://lb.benchmarkemail.com//code/lbform/api';
/* Benchmark's form token, already percent-encoded. It is encoded once more
   when sent, exactly as Benchmark's own embed code does, so the list receives
   the same value. */
const TOKEN = 'mFcQnoBFKMTRrznJLzHAhsVHaffN5KY0DMasvGt8Kz7RfC4rKF5hHA%3D%3D';
const PRIVACY_URL = 'https://helloao.org/privacy.html';

const labels = useLabels();

const open = ref(false);
const done = ref(false);
const busy = ref(false);
const message = ref('');
const first = ref('');
const email = ref('');

const box = ref<HTMLDivElement>();
const firstInput = ref<HTMLInputElement>();
const emailInput = ref<HTMLInputElement>();
const doneTitle = ref<HTMLHeadingElement>();
const closeButton = ref<HTMLButtonElement>();
let lastFocus: Element | null = null;

async function show() {
    lastFocus = document.activeElement;
    message.value = '';
    open.value = true;
    document.documentElement.style.overflow = 'hidden';
    await nextTick();
    (done.value ? closeButton.value : firstInput.value)?.focus();
}

function close() {
    if (!open.value) return;
    open.value = false;
    document.documentElement.style.overflow = '';
    if (lastFocus instanceof HTMLElement) lastFocus.focus();
}

const validEmail = (v: string) =>
    /^[^\s@,;:\\/]+@[^\s@,;:\\/]+\.[^\s@,;:\\/.]{2,}$/.test(v);

function submit() {
    const n = labels.value.newsletter;
    const address = email.value.trim();
    if (!validEmail(address)) {
        message.value = n.invalid;
        emailInput.value?.focus();
        return;
    }
    message.value = '';
    busy.value = true;
    /* Benchmark answers with a tiny image whose width is the result. */
    const img = new Image();
    img.onload = async () => {
        busy.value = false;
        const w = img.width;
        if (w === 1) {
            done.value = true;
            await nextTick();
            doneTitle.value?.focus();
        } else if (w === 2) {
            message.value = n.already;
        } else if (w === 3 || w === 4) {
            message.value = n.invalid;
        } else if (w === 6) {
            message.value = n.unsubscribed;
        } else {
            message.value = n.error;
        }
    };
    img.onerror = () => {
        busy.value = false;
        message.value = n.error;
    };
    img.src =
        ENDPOINT +
        '?token=' +
        encodeURIComponent(TOKEN) +
        '&fldfirstname=' +
        encodeURIComponent(first.value.trim()) +
        '&fldemail=' +
        encodeURIComponent(address) +
        '&inst=' +
        Math.random();
}

function onClick(e: MouseEvent) {
    const t = (e.target as Element | null)?.closest?.('.js-newsletter-trigger');
    if (!t) return;
    e.preventDefault();
    show();
}

function onKey(e: KeyboardEvent) {
    if (!open.value) return;
    if (e.key === 'Escape') {
        close();
        return;
    }
    if (e.key !== 'Tab' || !box.value) return;
    const items = Array.from(
        box.value.querySelectorAll<HTMLElement>('button, input, a[href]')
    ).filter(
        (el) => !(el as HTMLButtonElement).disabled && el.offsetParent !== null
    );
    if (!items.length) return;
    const firstEl = items[0];
    const lastEl = items[items.length - 1];
    if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
    } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
    }
}

onMounted(() => {
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
});
onBeforeUnmount(() => {
    document.removeEventListener('click', onClick);
    document.removeEventListener('keydown', onKey);
});
</script>

<template>
    <div v-if="open" class="fuba-nl">
        <div class="nl-back" @click="close"></div>
        <div
            ref="box"
            class="nl-box"
            role="dialog"
            aria-modal="true"
            aria-labelledby="nl-title"
        >
            <button
                ref="closeButton"
                class="nl-x"
                type="button"
                :aria-label="labels.newsletter.close"
                @click="close"
            >
                <svg viewBox="0 0 10 10" aria-hidden="true">
                    <path d="M1 1l8 8M9 1L1 9" />
                </svg>
            </button>
            <form v-if="!done" novalidate @submit.prevent="submit">
                <h2 id="nl-title">{{ labels.newsletter.title }}</h2>
                <p>{{ labels.newsletter.intro }}</p>
                <label for="nl-first"
                    >{{ labels.newsletter.firstName }}
                    <em>{{ labels.newsletter.optional }}</em></label
                >
                <input
                    id="nl-first"
                    ref="firstInput"
                    v-model="first"
                    name="first"
                    type="text"
                    autocomplete="given-name"
                    maxlength="100"
                />
                <label for="nl-email">{{ labels.newsletter.email }}</label>
                <input
                    id="nl-email"
                    ref="emailInput"
                    v-model="email"
                    name="email"
                    type="email"
                    autocomplete="email"
                    maxlength="100"
                    required
                />
                <p class="nl-msg" role="alert">{{ message }}</p>
                <button class="nl-go" type="submit" :disabled="busy">
                    {{
                        busy
                            ? labels.newsletter.subscribing
                            : labels.newsletter.subscribe
                    }}
                </button>
                <p class="nl-fine">
                    {{ labels.newsletter.fine }}
                    <a :href="PRIVACY_URL">{{ labels.newsletter.howWeUse }}</a>
                </p>
            </form>
            <div v-else>
                <h2 id="nl-title" ref="doneTitle" tabindex="-1">
                    {{ labels.newsletter.thanksTitle }}
                </h2>
                <p>{{ labels.newsletter.thanksBody }}</p>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.fuba-nl {
    position: fixed;
    inset: 0;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 18px;

    .nl-back {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.6);
    }
    .nl-box {
        position: relative;
        width: 100%;
        max-width: 420px;
        max-height: 100%;
        overflow: auto;
        box-sizing: border-box;
        padding: 30px 28px 28px;
        background: var(--vp-c-bg);
        color: var(--vp-c-text);
        border: 1px solid var(--vp-c-divider);
        border-radius: 14px;
        box-shadow: 0 24px 70px rgba(0, 0, 0, 0.35);
    }
    .nl-x {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 36px;
        height: 36px;
        display: grid;
        place-items: center;
        border: 0;
        border-radius: 999px;
        background: transparent;
        color: var(--vp-c-text-mute);
        cursor: pointer;
    }
    .nl-x:hover {
        color: var(--vp-c-text);
        background: var(--vp-c-bg-alt);
    }
    .nl-x svg {
        width: 12px;
        height: 12px;
        stroke: currentColor;
        stroke-width: 2;
        stroke-linecap: round;
    }
    h2 {
        margin: 0;
        padding: 0 28px 0 0;
        border: 0;
        font-size: 22px;
        letter-spacing: -0.03em;
        line-height: 1.2;
    }
    p {
        margin: 10px 0 0;
        font-size: 15px;
        line-height: 1.5;
        color: var(--fuba-text-2);
    }
    label {
        display: block;
        margin-top: 18px;
        font-size: 13px;
        font-weight: 600;
        color: var(--vp-c-text);
    }
    label em {
        font-style: normal;
        font-weight: 400;
        color: var(--vp-c-text-mute);
    }
    input {
        display: block;
        width: 100%;
        box-sizing: border-box;
        margin-top: 6px;
        padding: 12px 14px;
        font: inherit;
        font-size: 16px;
        color: var(--vp-c-text);
        background: var(--vp-c-bg);
        border: 1px solid var(--vp-c-divider);
        border-radius: 8px;
    }
    input:focus {
        outline: 2px solid var(--vp-c-text);
        outline-offset: 1px;
        border-color: var(--vp-c-text);
    }
    .nl-msg {
        min-height: 1.5em;
        margin-top: 12px;
        font-size: 14px;
        color: var(--vp-c-text);
    }
    .nl-go {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-top: 6px;
        padding: 13px 22px;
        font: inherit;
        font-size: 15px;
        font-weight: 600;
        border: 0;
        border-radius: 8px;
        cursor: pointer;
        background: var(--vp-c-accent-bg);
        color: var(--vp-c-accent-text);
        transition: background-color 0.15s ease;
    }
    .nl-go:disabled {
        opacity: 0.6;
        cursor: default;
    }
    @media (hover: hover) {
        .nl-go:not(:disabled):hover {
            background: var(--fuba-text-2);
        }
    }
    .nl-fine {
        margin-top: 16px;
        font-size: 13px;
        color: var(--vp-c-text-mute);
    }
    .nl-fine a {
        color: var(--vp-c-text);
        text-decoration: underline;
        text-underline-offset: 3px;
    }
}
</style>
