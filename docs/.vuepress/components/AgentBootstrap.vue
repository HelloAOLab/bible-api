<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';

// A box of instructions for a coding agent, with a button that copies them.
// The instructions are the slot: a fenced `text` code block written in the
// page's markdown, so they're readable (and searchable) without JavaScript.

const root = ref<HTMLElement | null>(null);
const status = ref<'idle' | 'copied' | 'failed'>('idle');
let reset: ReturnType<typeof setTimeout> | undefined;

/**
 * The code block's text. Shiki puts each line in its own element with the
 * line breaks between them, so textContent keeps the lines intact (the line
 * numbers are outside the <code> element).
 */
const instructions = () =>
    root.value?.querySelector('pre code')?.textContent?.trimEnd() ?? '';

async function copy() {
    clearTimeout(reset);
    try {
        await navigator.clipboard.writeText(instructions());
        status.value = 'copied';
    } catch {
        status.value = 'failed';
    }
    reset = setTimeout(() => (status.value = 'idle'), 2500);
}

onBeforeUnmount(() => clearTimeout(reset));
</script>

<template>
    <section
        ref="root"
        class="agent-bootstrap"
        aria-labelledby="agent-bootstrap-title"
    >
        <div class="agent-bootstrap-header">
            <div>
                <p id="agent-bootstrap-title" class="agent-bootstrap-title">
                    Agent bootstrap
                </p>
                <p class="agent-bootstrap-lead">
                    Building with a coding agent such as Claude Code or Codex?
                    Copy these instructions and paste them into it. It will ask
                    what you want to build, then create the project, read the
                    API and write, check and test the extension.
                </p>
            </div>
            <button type="button" class="agent-bootstrap-copy" @click="copy">
                {{
                    status === 'copied'
                        ? 'Copied'
                        : status === 'failed'
                          ? 'Copy failed'
                          : 'Copy instructions'
                }}
            </button>
        </div>
        <span class="agent-bootstrap-status" role="status" aria-live="polite">{{
            status === 'copied'
                ? 'Instructions copied to the clipboard.'
                : status === 'failed'
                  ? 'Could not copy. Select the text below and copy it instead.'
                  : ''
        }}</span>
        <details class="agent-bootstrap-details">
            <summary>Show the instructions</summary>
            <slot />
        </details>
    </section>
</template>

<style lang="scss">
.agent-bootstrap {
    margin: 1.5rem 0 2rem;
    padding: 1.25rem;
    border: 1px solid var(--vp-c-border);
    border-radius: 12px;
    background: var(--vp-c-bg-alt);
}

.agent-bootstrap-header {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    justify-content: space-between;

    @media (max-width: 600px) {
        flex-direction: column;
    }
}

.agent-bootstrap-title {
    margin: 0;
    font-weight: 600;
    font-size: 1.1rem;
}

.agent-bootstrap-lead {
    margin: 0.4rem 0 0;
    color: var(--vp-c-text-mute);
}

.agent-bootstrap-copy {
    flex-shrink: 0;
    min-width: 10.5rem;
    padding: 0.6rem 1rem;
    border: none;
    border-radius: 8px;
    background: var(--vp-c-accent-bg);
    color: var(--vp-c-accent-text);
    font: inherit;
    font-weight: 600;
    cursor: pointer;

    &:hover {
        background: var(--vp-c-accent-hover);
    }

    &:focus-visible {
        outline: 2px solid var(--vp-c-accent);
        outline-offset: 2px;
    }
}

.agent-bootstrap-status {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
}

.agent-bootstrap-details {
    margin-top: 0.75rem;

    summary {
        cursor: pointer;
        color: var(--vp-c-text-mute);
    }

    // The instructions are prose, so wrap them instead of scrolling sideways,
    // and drop the line numbers, which would no longer line up.
    div[class*='language-'] {
        margin-bottom: 0;

        pre {
            white-space: pre-wrap;
            overflow-wrap: anywhere;
        }

        // The gutter is the line numbers' column and the ::after rule
        // beside it.
        .line-numbers,
        &::after {
            display: none;
        }

        pre {
            margin-left: 0;
            padding-left: 1.25rem;
        }
    }
}
</style>
