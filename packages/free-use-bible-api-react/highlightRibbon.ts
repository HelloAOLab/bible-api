// Geometry + measurement for the highlight "ribbon" layer.
//
// Highlights are drawn as rounded shapes in an SVG layer *behind* the scripture
// text (see `useHighlightRibbons` in HighlightLayer.tsx). Because they sit behind the
// text they can be inflated for breathing room and rounded without ever shifting
// a line or covering a glyph. `collectLineRects` measures the live text geometry
// of one highlighted run; `buildRibbonPath` turns those per-line rectangles into
// a single continuous, rounded SVG path (rounded only at the run's outer corners,
// following the ragged right edge and any poetry indentation on the left).

export interface RibbonRect {
    left: number;
    right: number;
    top: number;
    bottom: number;
}

type Point = [number, number];

// Reader-relative sizing (multiplied by the content's computed font size so the
// ribbon scales with the reader's font-size setting). Tuned in the prototype.
export const RIBBON_RADIUS_EM = 0.4;
export const RIBBON_PAD_X_EM = 0.2;

// Drop points that repeat their predecessor, the cyclic closing duplicate, and
// any point that is collinear with its neighbours (a straight run of points).
// Leaving the closing duplicate in place makes the first corner look collinear
// (its previous edge has zero length) and it gets wrongly dropped.
function simplify(points: Point[]): Point[] {
    const compact: Point[] = [];
    for (const p of points) {
        const last = compact[compact.length - 1];
        if (
            !last ||
            Math.abs(last[0] - p[0]) > 0.05 ||
            Math.abs(last[1] - p[1]) > 0.05
        ) {
            compact.push(p);
        }
    }
    while (compact.length > 2) {
        const first = compact[0]!;
        const last = compact[compact.length - 1]!;
        if (
            Math.abs(first[0] - last[0]) <= 0.05 &&
            Math.abs(first[1] - last[1]) <= 0.05
        ) {
            compact.pop();
        } else {
            break;
        }
    }

    const result: Point[] = [];
    const n = compact.length;
    for (let i = 0; i < n; i++) {
        const a = compact[(i - 1 + n) % n]!;
        const b = compact[i]!;
        const c = compact[(i + 1) % n]!;
        const cross =
            (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
        if (Math.abs(cross) > 0.05) result.push(b);
    }
    return result;
}

// Inflate each line horizontally by padX and close the vertical gaps between
// lines (extend each line to meet its neighbour at the midpoint) so the run reads
// as one solid body. The very top and bottom are extended by half the line's
// leading — the empty space in a line slot — so the ribbon fills its full outer
// line slots too. That makes a ribbon meet a vertically-adjacent ribbon (even a
// different color) exactly at the shared slot boundary, with no leading gap
// between them, at any line height.
//
// `leadPad`/`trailPad` override padX on the run's two edges that can face a
// horizontal neighbour: the leading edge (where the run starts) and the trailing
// edge (where it ends). Which physical side that is depends on text direction —
// LTR: lead = first line's left, trail = last line's right; RTL mirrors it
// (lead = first line's right, trail = last line's left). The caller sets these to
// 0 where a differently-colored run abuts on the same visual line so the two
// colors don't crowd (see `useHighlightRibbons`). Every other edge always uses padX.
function inflate(
    lines: RibbonRect[],
    padX: number,
    linePitch: number,
    leadPad: number,
    trailPad: number,
    rtl: boolean
): RibbonRect[] {
    const n = lines.length;
    const out = lines.map((l, i) => {
        let leftPad = padX;
        let rightPad = padX;
        if (rtl) {
            if (i === 0) rightPad = leadPad; // run starts on the right
            if (i === n - 1) leftPad = trailPad; // run ends on the left
        } else {
            if (i === 0) leftPad = leadPad; // run starts on the left
            if (i === n - 1) rightPad = trailPad; // run ends on the right
        }
        return {
            left: l.left - leftPad,
            right: l.right + rightPad,
            top: l.top,
            bottom: l.bottom,
        };
    });
    // Prefer the measured spacing between the first two lines; fall back to the
    // passed line-height for single-line runs.
    const pitch = n > 1 ? out[1]!.top - out[0]!.top : linePitch;
    const halfLeadTop = Math.max(
        0,
        (pitch - (out[0]!.bottom - out[0]!.top)) / 2
    );
    const halfLeadBottom = Math.max(
        0,
        (pitch - (out[n - 1]!.bottom - out[n - 1]!.top)) / 2
    );
    for (let i = 0; i < n - 1; i++) {
        const a = out[i]!;
        const b = out[i + 1]!;
        const mid = (a.bottom + b.top) / 2;
        a.bottom = mid;
        b.top = mid;
    }
    out[0]!.top -= halfLeadTop;
    out[n - 1]!.bottom += halfLeadBottom;
    return out;
}

// Trace the outline of the vertically-contiguous stacked rectangles: across the
// top, down the (ragged) right staircase, across the bottom, up the (possibly
// indented) left staircase.
function outline(lines: RibbonRect[]): Point[] {
    const n = lines.length;
    const pts: Point[] = [];
    const first = lines[0]!;
    pts.push([first.left, first.top]);
    pts.push([first.right, first.top]);
    for (let i = 0; i < n; i++) {
        const line = lines[i]!;
        pts.push([line.right, line.bottom]);
        if (i < n - 1) pts.push([lines[i + 1]!.right, line.bottom]);
    }
    const last = lines[n - 1]!;
    pts.push([last.left, last.bottom]);
    for (let j = n - 1; j >= 0; j--) {
        const line = lines[j]!;
        pts.push([line.left, line.top]);
        if (j > 0) pts.push([lines[j - 1]!.left, line.top]);
    }
    return simplify(pts);
}

// Emit an SVG path that traces the polygon with a rounded corner (radius clamped
// to half the shorter adjacent edge) at every vertex — works for the convex
// outer corners and the concave staircase steps alike.
function roundedPath(points: Point[], radius: number): string {
    const n = points.length;
    if (n < 3) return '';
    let d = '';
    for (let i = 0; i < n; i++) {
        const prev = points[(i - 1 + n) % n]!;
        const cur = points[i]!;
        const next = points[(i + 1) % n]!;
        const v1x = prev[0] - cur[0];
        const v1y = prev[1] - cur[1];
        const l1 = Math.hypot(v1x, v1y) || 1;
        const v2x = next[0] - cur[0];
        const v2y = next[1] - cur[1];
        const l2 = Math.hypot(v2x, v2y) || 1;
        const r = Math.min(radius, l1 / 2, l2 / 2);
        const ax = cur[0] + (v1x / l1) * r;
        const ay = cur[1] + (v1y / l1) * r;
        const bx = cur[0] + (v2x / l2) * r;
        const by = cur[1] + (v2y / l2) * r;
        d +=
            (i === 0 ? 'M' : 'L') +
            ` ${ax.toFixed(2)} ${ay.toFixed(2)}` +
            ` Q ${cur[0].toFixed(2)} ${cur[1].toFixed(2)} ${bx.toFixed(2)} ${by.toFixed(2)}`;
    }
    return d + ' Z';
}

// A run's measured lines usually stack into one continuous body: each line
// horizontally overlaps the next, so the wrapped text flows underneath the line
// above it. When a run starts mid-line, though, its first (partial) line can sit
// to one side while its wrapped continuation lands on the *other* side of the
// next line with no horizontal overlap — most often in RTL, where a verse that
// begins mid-line is pushed to the left while its wrap starts back at the right
// margin. The two pieces never sit over each other, so forcing them into one
// polygon makes the outline self-cross (it renders as outward "points"). Split
// the lines into maximal groups of consecutive, horizontally-overlapping lines
// so each disjoint piece becomes its own clean ribbon.
function splitContiguousRuns(lines: RibbonRect[]): RibbonRect[][] {
    const groups: RibbonRect[][] = [];
    for (const line of lines) {
        const group = groups[groups.length - 1];
        const prev = group?.[group.length - 1];
        if (group && prev && line.left < prev.right && prev.left < line.right) {
            group.push(line);
        } else {
            groups.push([line]);
        }
    }
    return groups;
}

/**
 * Build the rounded SVG path (`d` attribute) for one highlighted run from its
 * per-line rectangles. `linePitch` is the line-height in px (used only for
 * single-line runs; multi-line runs derive the pitch from the measured lines).
 * `edges` overrides the horizontal pad on the run's leading and trailing edges
 * — pass 0 where a differently-colored run abuts on the same visual line so the
 * colors don't crowd; omit to pad both edges by padX like every other edge. Set
 * `edges.rtl` for right-to-left runs so lead/trail map to the mirrored physical
 * sides (see `inflate`). A run whose wrapped lines don't sit over one another is
 * split into several disjoint sub-paths (see `splitContiguousRuns`); the leading
 * pad applies only to the first piece and the trailing pad only to the last.
 * Returns "" when there is nothing to draw.
 */
export function buildRibbonPath(
    lines: RibbonRect[],
    radius: number,
    padX: number,
    linePitch: number,
    edges?: { leadPad?: number; trailPad?: number; rtl?: boolean }
): string {
    if (!lines.length) return '';
    const leadPad = edges?.leadPad ?? padX;
    const trailPad = edges?.trailPad ?? padX;
    const rtl = edges?.rtl ?? false;
    const groups = splitContiguousRuns(lines);
    const paths: string[] = [];
    for (let g = 0; g < groups.length; g++) {
        // The run's leading edge lives in the first piece, its trailing edge in the
        // last; interior pieces pad every edge normally.
        const gLead = g === 0 ? leadPad : padX;
        const gTrail = g === groups.length - 1 ? trailPad : padX;
        const sub = roundedPath(
            outline(inflate(groups[g]!, padX, linePitch, gLead, gTrail, rtl)),
            radius
        );
        if (sub) paths.push(sub);
    }
    return paths.join(' ');
}

export function isBlockLevel(node: Node): boolean {
    if (node.nodeType !== 1) return false;
    const display = getComputedStyle(node as Element).display;
    return (
        display === 'block' ||
        display === 'flex' ||
        display === 'grid' ||
        display === 'list-item' ||
        display === 'table'
    );
}

/**
 * Measure the tight, per-visual-line rectangles of a highlighted element,
 * relative to (originLeft, originTop) — pass the content box's top-left.
 *
 * Poetry lines are block-level, so measuring the element as a whole would report
 * full-column boxes. We instead recurse past any block-level line containers and
 * measure their *inline* contents: a Range over inline content yields one rect
 * per visual line (verse number aggregated in), tight to the text. Rectangles
 * sharing a line are then merged.
 */
export function collectLineRects(
    el: Element,
    originLeft: number,
    originTop: number
): RibbonRect[] {
    const range = document.createRange();
    // `Range.getClientRects` is a real-browser API; jsdom (unit tests) doesn't
    // implement it. Without layout there is nothing to measure, so bail cleanly.
    if (typeof range.getClientRects !== 'function') return [];
    const raw: RibbonRect[] = [];

    const walk = (node: Node) => {
        let hasBlockChild = false;
        for (let c = node.firstChild; c; c = c.nextSibling) {
            if (isBlockLevel(c)) {
                hasBlockChild = true;
                break;
            }
        }
        if (hasBlockChild) {
            for (let c = node.firstChild; c; c = c.nextSibling) {
                if (c.nodeType === 1) walk(c);
            }
            return;
        }
        range.selectNodeContents(node);
        const rects = range.getClientRects();
        for (let i = 0; i < rects.length; i++) {
            const r = rects[i];
            if (!r || r.width <= 0 || r.height <= 0) continue;
            raw.push({
                left: r.left - originLeft,
                right: r.right - originLeft,
                top: r.top - originTop,
                bottom: r.bottom - originTop,
            });
        }
    };
    walk(el);

    raw.sort((a, b) => a.top - b.top);
    const lines: RibbonRect[] = [];
    for (const cur of raw) {
        const group = lines[lines.length - 1];
        if (group && cur.top < group.bottom - 1) {
            group.left = Math.min(group.left, cur.left);
            group.right = Math.max(group.right, cur.right);
            group.top = Math.min(group.top, cur.top);
            group.bottom = Math.max(group.bottom, cur.bottom);
        } else {
            lines.push({
                left: cur.left,
                right: cur.right,
                top: cur.top,
                bottom: cur.bottom,
            });
        }
    }
    return lines;
}

/**
 * Measure the inline text sitting immediately next to `el` in reading order —
 * `side: "before"` for the content that precedes it, `"after"` for what follows
 * — as a rectangle relative to (originLeft, originTop). Returns the rect nearest
 * to `el` (the previous content's last visual line, or the next content's first).
 *
 * Returns null when a block boundary — a line break, heading, block-level poetry
 * line, or the absolutely-positioned ribbon layer — or the start/end of the flow
 * sits on that side, because then nothing shares a text line with `el`'s edge.
 *
 * The caller compares this against the run's own first/last line to tell whether
 * a highlight begins or ends mid-line, with another verse's text right beside it.
 * Where it does, the run's horizontal pad on that edge is dropped so the ribbon
 * doesn't reach over into that neighbouring text (see `useHighlightRibbons`).
 */
export function adjacentInlineRect(
    el: Element,
    side: 'before' | 'after',
    originLeft: number,
    originTop: number
): RibbonRect | null {
    const range = document.createRange();
    // No layout to measure against in jsdom (unit tests) — bail cleanly.
    if (typeof range.getClientRects !== 'function') return null;
    const step = (n: Node): Node | null =>
        side === 'before' ? n.previousSibling : n.nextSibling;
    for (let sib = step(el); sib; sib = step(sib)) {
        if (sib.nodeType === 3) {
            // Skip whitespace-only text nodes between elements.
            if (!sib.textContent || !sib.textContent.trim()) continue;
        } else if (sib.nodeType === 1) {
            const style = getComputedStyle(sib as Element);
            if (
                isBlockLevel(sib) ||
                style.position === 'absolute' ||
                style.position === 'fixed'
            ) {
                return null;
            }
        } else {
            continue;
        }
        range.selectNodeContents(sib);
        const rects = range.getClientRects();
        // The edge we face: the last drawable rect before us, or the first after us.
        let pick: DOMRect | null = null;
        for (let i = 0; i < rects.length; i++) {
            const r = rects[i];
            if (!r || r.width <= 0 || r.height <= 0) continue;
            if (side === 'before' || !pick) pick = r;
        }
        if (pick) {
            return {
                left: pick.left - originLeft,
                right: pick.right - originLeft,
                top: pick.top - originTop,
                bottom: pick.bottom - originTop,
            };
        }
        // Inline sibling with nothing drawable (e.g. empty) — keep scanning outward.
    }
    return null;
}
