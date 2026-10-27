<script setup lang="ts">
import { computed } from 'vue';
import { useLabels } from '../composables/useLocale';
import type { Labels } from '../labels';

const labels = useLabels();

type Mark = 'y' | 'p' | 'n';
const markLabel = computed<Record<Mark, string>>(() => ({
    y: labels.value.compare.markYes,
    p: labels.value.compare.markConditional,
    n: labels.value.compare.markNotGranted,
}));

type CompareColumn = keyof Labels['compare']['columns'];
const COMPARE_COLUMNS: CompareColumn[] = [
    'account',
    'usage',
    'permission',
    'storage',
    'openSource',
];

// The notes for each cell are in labels.json, under the same row and column.
const COMPARE_ROWS: {
    id: keyof Labels['compare']['rows'];
    name: string;
    ours?: boolean;
    marks: Mark[];
}[] = [
    {
        id: 'ours',
        name: 'Free Use Bible API',
        ours: true,
        marks: ['y', 'y', 'y', 'y', 'y'],
    },
    { id: 'apiBible', name: 'API.Bible', marks: ['n', 'n', 'n', 'p', 'p'] },
    {
        id: 'youVersion',
        name: 'YouVersion Platform',
        marks: ['n', 'n', 'n', 'p', 'p'],
    },
    {
        id: 'bibleBrain',
        name: 'Bible Brain',
        marks: ['n', 'n', 'n', 'p', 'y'],
    },
];

const compareRows = computed(() =>
    COMPARE_ROWS.map((row) => ({
        ...row,
        cells: COMPARE_COLUMNS.map(
            (column, i) =>
                [row.marks[i], labels.value.compare.rows[row.id][column]] as [
                    Mark,
                    string,
                ]
        ),
    }))
);
</script>

<template>
    <div class="compare-matrix">
        <div class="matrix-wrap">
            <table class="matrix">
                <caption class="vh">
                    {{
                        labels.compare.caption
                    }}
                </caption>
                <thead>
                    <tr>
                        <th scope="col" class="matrix-corner">
                            {{ labels.compare.corner }}
                        </th>
                        <th
                            v-for="col in COMPARE_COLUMNS"
                            :key="col"
                            scope="col"
                        >
                            <span>{{ labels.compare.columns[col] }}</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="row in compareRows"
                        :key="row.name"
                        :class="{ 'ours-row': row.ours }"
                    >
                        <th scope="row">{{ row.name }}</th>
                        <td v-for="([mark, note], i) in row.cells" :key="i">
                            <span class="m" :class="mark" :title="note"></span>
                            <span class="vh">
                                {{ markLabel[mark] }}. {{ note }}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="matrix-foot">
            <p class="legend">
                <span
                    ><span class="m y"></span>
                    {{ labels.compare.markYes }}</span
                >
                <span
                    ><span class="m p"></span>
                    {{ labels.compare.markConditional }}</span
                >
                <span
                    ><span class="m n"></span>
                    {{ labels.compare.markNotGranted }}</span
                >
            </p>
            <p class="legend-note">
                {{ labels.compare.storageNote }}
            </p>
        </div>
    </div>
</template>

<style lang="scss">
// The comparison table on the Compare page. It sits inside the theme's page
// content, so it undoes the theme's table styles.
.compare-matrix {
    --bg: var(--vp-c-bg);
    --surface: var(--vp-c-bg-alt);
    --surface-2: var(--fuba-surface-2);
    --text: var(--vp-c-text);
    --muted: var(--vp-c-text-mute);
    --line: var(--vp-c-divider);
    --line-strong: var(--fuba-line-strong);

    margin: 24px 0;
    font-variant-numeric: lining-nums tabular-nums;

    .matrix-wrap {
        overflow-x: auto;
        border: 1px solid var(--line);
        border-radius: 12px;
        -webkit-overflow-scrolling: touch;
    }
    .matrix {
        display: table;
        width: 100%;
        margin: 0;
        border-collapse: collapse;
        font-size: 14px;
        min-width: 560px;
    }
    .matrix tr {
        border: 0;
        background: none;
    }
    .matrix th,
    .matrix td {
        padding: 0;
        border: 0;
        text-align: center;
        vertical-align: middle;
    }
    .matrix thead th {
        padding: 14px 8px;
        background: var(--surface);
        border-bottom: 1px solid var(--line);
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.07em;
        text-transform: uppercase;
        color: var(--muted);
        line-height: 1.3;
    }
    .matrix thead th span {
        display: block;
        max-width: 15ch;
        margin: 0 auto;
    }
    .matrix .matrix-corner {
        text-align: left;
    }
    .matrix tbody th {
        position: sticky;
        left: 0;
        z-index: 1;
        padding: 13px 16px;
        text-align: left;
        background: var(--bg);
        border-bottom: 1px solid var(--line);
        border-right: 1px solid var(--line);
        font-size: 14.5px;
        font-weight: 600;
        white-space: nowrap;
    }
    .matrix thead th:first-child {
        position: sticky;
        left: 0;
        z-index: 3;
        text-align: left;
        padding-left: 16px;
        border-right: 1px solid var(--line);
    }
    .matrix tbody td {
        position: relative;
        padding: 13px 8px;
        border-bottom: 1px solid var(--line);
    }
    .matrix tbody tr:last-child th,
    .matrix tbody tr:last-child td {
        border-bottom: 0;
    }
    .matrix .ours-row th,
    .matrix .ours-row td {
        background: var(--surface-2);
        font-weight: 700;
    }
    .m {
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 999px;
        border: 1.5px solid var(--line-strong);
        cursor: help;
    }
    .m.y {
        background: var(--line-strong);
    }
    .m.p {
        background: linear-gradient(
            90deg,
            var(--line-strong) 50%,
            transparent 50%
        );
    }
    .m.n {
        border-color: var(--muted);
        opacity: 0.38;
    }
    .matrix-foot {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        gap: 10px clamp(18px, 3vw, 40px);
        margin-top: 16px;
    }
    .legend {
        margin: 0;
        display: flex;
        gap: 18px;
        font-size: 13.5px;
        font-weight: 600;
        white-space: nowrap;
    }
    .legend span span.m {
        margin-right: 6px;
        vertical-align: -1px;
        cursor: default;
    }
    .legend-note {
        margin: 0;
        flex: 1 1 380px;
        max-width: 74ch;
        font-size: 13.5px;
        line-height: 1.5;
        color: var(--muted);
    }
    .vh {
        position: absolute;
        width: 1px;
        height: 1px;
        margin: -1px;
        padding: 0;
        overflow: hidden;
        clip: rect(0 0 0 0);
        white-space: nowrap;
        border: 0;
    }

    @media (max-width: 720px) {
        .matrix tbody th {
            white-space: normal;
            max-width: 126px;
            padding: 11px 12px;
            font-size: 13px;
        }
        .matrix thead th:first-child {
            padding-left: 12px;
            font-size: 10px;
        }
        .matrix tbody td {
            padding: 11px 6px;
        }
    }
    @media (max-width: 620px) {
        .matrix-foot {
            gap: 12px;
        }
        .legend-note {
            flex-basis: 100%;
        }
        .matrix {
            min-width: 0;
        }
        .matrix tbody th {
            max-width: 76px;
            padding: 10px 6px;
            font-size: 12px;
        }
        .matrix thead th {
            padding: 10px 2px;
            font-size: 9px;
            letter-spacing: 0.04em;
        }
        .matrix thead th:first-child {
            padding-left: 8px;
        }
        .matrix tbody td {
            padding: 10px 2px;
        }
    }
}
</style>
