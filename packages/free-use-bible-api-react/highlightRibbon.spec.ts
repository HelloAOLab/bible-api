/**
 * @jest-environment jsdom
 */
import {
    adjacentInlineRect,
    buildRibbonPath,
    type RibbonRect,
} from './highlightRibbon.js';

// Pull every numeric literal out of an SVG path `d` string.
function numbersIn(d: string): number[] {
    return (d.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);
}
function xsIn(d: string): number[] {
    return numbersIn(d).filter((_, i) => i % 2 === 0);
}
function ysIn(d: string): number[] {
    return numbersIn(d).filter((_, i) => i % 2 === 1);
}

// A comfortable line pitch for the test rectangles (bottom - top = 45 tall).
const PITCH = 65;

describe('buildRibbonPath', () => {
    it('returns an empty string when there are no lines', () => {
        expect(buildRibbonPath([], 8, 4, PITCH)).toBe('');
    });

    it('draws a closed, rounded path for a single line', () => {
        const lines: RibbonRect[] = [
            { left: 100, right: 500, top: 10, bottom: 55 },
        ];
        const d = buildRibbonPath(lines, 8, 4, PITCH);

        expect(d).toMatch(/^M /); // starts with a moveto
        expect(d.trim().endsWith('Z')).toBe(true); // closed
        expect(d).toContain('Q'); // has rounded corners
        expect(d).not.toContain('NaN');
        expect(numbersIn(d).every(Number.isFinite)).toBe(true);
    });

    it('spans a prose run (equal left, ragged right) without NaNs', () => {
        const lines: RibbonRect[] = [
            { left: 395, right: 1160, top: 140, bottom: 185 },
            { left: 395, right: 1150, top: 192, bottom: 237 },
            { left: 395, right: 1110, top: 244, bottom: 289 },
            { left: 395, right: 920, top: 296, bottom: 341 },
        ];
        const d = buildRibbonPath(lines, 8, 4, PITCH);

        expect(d).not.toContain('NaN');
        expect(numbersIn(d).every(Number.isFinite)).toBe(true);
        // The ribbon reaches beyond the text on both sides (padX = 4).
        expect(Math.min(...xsIn(d))).toBeLessThanOrEqual(395 - 4 + 0.01);
        expect(Math.max(...xsIn(d))).toBeGreaterThanOrEqual(1160 + 4 - 0.01);
    });

    it('handles poetry indentation (a left staircase that steps out and in)', () => {
        const lines: RibbonRect[] = [
            { left: 80, right: 980, top: 830, bottom: 880 },
            { left: 135, right: 390, top: 885, bottom: 935 },
            { left: 80, right: 400, top: 940, bottom: 990 },
            { left: 135, right: 770, top: 995, bottom: 1045 },
        ];
        const d = buildRibbonPath(lines, 8, 4, PITCH);

        expect(d).not.toContain('NaN');
        expect(numbersIn(d).every(Number.isFinite)).toBe(true);
        expect(d).toContain('Q');
    });

    it('clamps the radius on tiny rectangles (no overshoot, no NaN)', () => {
        const lines: RibbonRect[] = [{ left: 0, right: 2, top: 0, bottom: 2 }];
        const d = buildRibbonPath(lines, 20, 4, PITCH);

        expect(d).not.toContain('NaN');
        expect(numbersIn(d).every(Number.isFinite)).toBe(true);
    });

    it('extends the outer edges by half the line leading to fill the line slot', () => {
        // A 45-tall line in a 65 pitch has 20 of leading -> 10 above and below.
        const lines: RibbonRect[] = [
            { left: 100, right: 500, top: 10, bottom: 55 },
        ];
        // No radius so corners land exactly on the slot bounds.
        const ys = ysIn(buildRibbonPath(lines, 0, 4, PITCH));
        expect(Math.min(...ys)).toBeCloseTo(0, 1); // 10 - 10
        expect(Math.max(...ys)).toBeCloseTo(65, 1); // 55 + 10
        // (sanity: the rounded variant is still a valid closed path)
        expect(buildRibbonPath(lines, 8, 4, PITCH)).toContain('Q');
    });

    it('drops the horizontal pad on trimmed leading/trailing edges', () => {
        const lines: RibbonRect[] = [
            { left: 100, right: 500, top: 10, bottom: 55 },
        ];
        // radius 0 so the corners land exactly on the (padded) edges.
        const full = buildRibbonPath(lines, 0, 4, PITCH);
        expect(Math.min(...xsIn(full))).toBeCloseTo(96, 1); // 100 - 4
        expect(Math.max(...xsIn(full))).toBeCloseTo(504, 1); // 500 + 4

        // Trimming the leading edge pulls the left back to the glyph edge; the
        // trailing edge still pads by padX.
        const lead = buildRibbonPath(lines, 0, 4, PITCH, { leadPad: 0 });
        expect(Math.min(...xsIn(lead))).toBeCloseTo(100, 1);
        expect(Math.max(...xsIn(lead))).toBeCloseTo(504, 1);

        // Trimming the trailing edge pulls the right back; the leading edge still pads.
        const trail = buildRibbonPath(lines, 0, 4, PITCH, { trailPad: 0 });
        expect(Math.min(...xsIn(trail))).toBeCloseTo(96, 1);
        expect(Math.max(...xsIn(trail))).toBeCloseTo(500, 1);
    });

    it('maps lead/trail to mirrored physical edges in RTL', () => {
        const lines: RibbonRect[] = [
            { left: 100, right: 500, top: 10, bottom: 55 },
        ];
        // In RTL the run STARTS on the right, so leadPad trims the right edge and
        // trailPad trims the left edge — the mirror of LTR.
        const lead = buildRibbonPath(lines, 0, 4, PITCH, {
            leadPad: 0,
            rtl: true,
        });
        expect(Math.max(...xsIn(lead))).toBeCloseTo(500, 1); // right (start) trimmed
        expect(Math.min(...xsIn(lead))).toBeCloseTo(96, 1); // left still padded

        const trail = buildRibbonPath(lines, 0, 4, PITCH, {
            trailPad: 0,
            rtl: true,
        });
        expect(Math.min(...xsIn(trail))).toBeCloseTo(100, 1); // left (end) trimmed
        expect(Math.max(...xsIn(trail))).toBeCloseTo(504, 1); // right still padded
    });

    it('trims only the outer boundary lines, not interior line edges', () => {
        // A 3-line run: leadPad trims the FIRST line's left only; interior + last
        // lines keep padX on the left, and every right edge but the last keeps padX.
        const lines: RibbonRect[] = [
            { left: 200, right: 500, top: 0, bottom: 45 },
            { left: 100, right: 500, top: 65, bottom: 110 },
            { left: 100, right: 300, top: 130, bottom: 175 },
        ];
        const d = buildRibbonPath(lines, 0, 4, PITCH, {
            leadPad: 0,
            trailPad: 0,
        });
        const xs = xsIn(d);
        // First line left is untrimmed-glyph (200); interior lines still reach 100-4=96.
        expect(Math.min(...xs)).toBeCloseTo(96, 1);
        // Last line right is trimmed to the glyph (300); wider lines still reach 500+4=504.
        expect(Math.max(...xs)).toBeCloseTo(504, 1);
        expect(xs).toContain(200); // first line's trimmed leading edge is present
    });

    it("splits a run into separate ribbons when consecutive lines don't overlap", () => {
        // RTL mid-line start: the first (partial) line sits on the left, the wrapped
        // line lands on the right with no horizontal overlap. Forcing one polygon
        // would self-cross; instead we expect two disjoint sub-paths.
        const disjoint: RibbonRect[] = [
            { left: 100, right: 500, top: 0, bottom: 45 },
            { left: 550, right: 1000, top: 52, bottom: 97 },
        ];
        const d = buildRibbonPath(disjoint, 8, 4, PITCH, { rtl: true });
        expect((d.match(/M /g) ?? []).length).toBe(2); // two sub-paths
        expect(d).not.toContain('NaN');
        expect(numbersIn(d).every(Number.isFinite)).toBe(true);
    });

    it('keeps a run as one ribbon when consecutive lines overlap', () => {
        const overlapping: RibbonRect[] = [
            { left: 100, right: 500, top: 0, bottom: 45 },
            { left: 300, right: 1000, top: 52, bottom: 97 }, // overlaps [300,500]
        ];
        const d = buildRibbonPath(overlapping, 8, 4, PITCH);
        expect((d.match(/M /g) ?? []).length).toBe(1); // one continuous body
    });
});

// A minimal fake DOM node whose measured rects and computed style we control, so
// we can exercise adjacentInlineRect's sibling walk without a real layout engine.
type FakeNode = {
    nodeType: number;
    textContent?: string;
    previousSibling: FakeNode | null;
    nextSibling: FakeNode | null;
    __rects: Array<{
        left: number;
        right: number;
        top: number;
        bottom: number;
        width: number;
        height: number;
    }>;
    __style: { display: string; position: string };
};

function rect(left: number, top: number, right: number, bottom: number) {
    return {
        left,
        top,
        right,
        bottom,
        width: right - left,
        height: bottom - top,
    };
}

function fakeNode(over: Partial<FakeNode> = {}): FakeNode {
    return {
        nodeType: 1,
        previousSibling: null,
        nextSibling: null,
        __rects: [],
        __style: { display: 'inline', position: 'static' },
        ...over,
    };
}

// Wire an ordered list of siblings together via previous/next pointers.
function chain(nodes: FakeNode[]) {
    for (let i = 0; i < nodes.length; i++) {
        nodes[i]!.previousSibling = nodes[i - 1] ?? null;
        nodes[i]!.nextSibling = nodes[i + 1] ?? null;
    }
}

describe('adjacentInlineRect', () => {
    const realCreateRange = document.createRange;
    const realGetComputedStyle = globalThis.getComputedStyle;

    afterEach(() => {
        document.createRange = realCreateRange;
        globalThis.getComputedStyle = realGetComputedStyle;
    });

    // Stub createRange/getComputedStyle so the function measures our fake nodes.
    function install() {
        let selected: FakeNode | null = null;
        document.createRange = (() => ({
            getClientRects: () =>
                (selected?.__rects ?? []) as unknown as DOMRectList,
            selectNodeContents: (n: unknown) => {
                selected = n as FakeNode;
            },
        })) as unknown as typeof document.createRange;
        globalThis.getComputedStyle = ((n: unknown) =>
            (n as FakeNode)
                .__style as unknown as CSSStyleDeclaration) as typeof getComputedStyle;
    }

    it("returns the previous inline text's last line, relative to the origin", () => {
        // prev has two lines; the one nearest the run (its last) is what we face.
        const prev = fakeNode({
            __rects: [rect(10, 0, 90, 20), rect(10, 25, 60, 45)],
        });
        const run = fakeNode();
        chain([prev, run]);
        install();

        const r = adjacentInlineRect(
            run as unknown as Element,
            'before',
            10,
            5
        );
        // Nearest rect (10,25,60,45) shifted by origin (10,5).
        expect(r).toEqual({ left: 0, right: 50, top: 20, bottom: 40 });
    });

    it("returns the next inline text's first line", () => {
        const run = fakeNode();
        const next = fakeNode({
            __rects: [rect(200, 25, 260, 45), rect(80, 50, 140, 70)],
        });
        chain([run, next]);
        install();

        const r = adjacentInlineRect(run as unknown as Element, 'after', 0, 0);
        expect(r).toEqual({ left: 200, right: 260, top: 25, bottom: 45 });
    });

    it('stops at a block-level boundary (a line break) with null', () => {
        const lineBreak = fakeNode({
            __style: { display: 'block', position: 'static' },
            __rects: [rect(0, 0, 300, 5)],
        });
        const run = fakeNode();
        chain([lineBreak, run]);
        install();

        expect(
            adjacentInlineRect(run as unknown as Element, 'before', 0, 0)
        ).toBeNull();
    });

    it('stops at the out-of-flow ribbon layer (position: absolute) with null', () => {
        const layer = fakeNode({
            __style: { display: 'inline', position: 'absolute' },
            __rects: [rect(0, 0, 300, 400)],
        });
        const run = fakeNode();
        chain([layer, run]);
        install();

        expect(
            adjacentInlineRect(run as unknown as Element, 'before', 0, 0)
        ).toBeNull();
    });

    it('skips whitespace-only text nodes to reach the real neighbour', () => {
        const prev = fakeNode({ __rects: [rect(10, 0, 90, 20)] });
        const space = fakeNode({ nodeType: 3, textContent: '  ' });
        const run = fakeNode();
        chain([prev, space, run]);
        install();

        const r = adjacentInlineRect(run as unknown as Element, 'before', 0, 0);
        expect(r).toEqual({ left: 10, right: 90, top: 0, bottom: 20 });
    });

    it('returns null when there is no sibling on that side', () => {
        const run = fakeNode();
        install();
        expect(
            adjacentInlineRect(run as unknown as Element, 'before', 0, 0)
        ).toBeNull();
    });
});

describe('buildRibbonPath (slot adjacency)', () => {
    it('makes two vertically-adjacent runs meet at the shared slot boundary', () => {
        // Two single-line runs on consecutive lines (pitch 65): run A on the first
        // slot, run B on the next. Their touching edges should land on the same y.
        const runA = buildRibbonPath(
            [{ left: 100, right: 400, top: 0, bottom: 45 }],
            0,
            4,
            PITCH
        );
        const runB = buildRibbonPath(
            [{ left: 100, right: 400, top: 65, bottom: 110 }],
            0,
            4,
            PITCH
        );
        const aBottom = Math.max(...ysIn(runA)); // 45 + 10
        const bTop = Math.min(...ysIn(runB)); // 65 - 10
        expect(aBottom).toBeCloseTo(55, 1);
        expect(bTop).toBeCloseTo(55, 1);
        expect(aBottom).toBeCloseTo(bTop, 1); // no gap between the two ribbons
    });
});
