const PLACEHOLDER = /\{\{\s*(\w+)\s*\}\}/g;

const escapeHtml = (text: string) =>
    text.replace(
        /[&<>"']/g,
        (c) =>
            ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;',
            })[c]!
    );

/** Replaces the `{{ name }}` placeholders in a label. */
export function fillLabel(
    label: string,
    values: Record<string, string | number>
): string {
    return label.replace(PLACEHOLDER, (match, name) =>
        name in values ? String(values[name]) : match
    );
}

/**
 * Renders a label that uses `**bold**` or whose placeholders are filled with
 * markup, for `v-html`. The label itself is escaped; `html` values are
 * inserted as they are, so they must be trusted markup.
 */
export function labelHtml(
    label: string,
    html: Record<string, string> = {}
): string {
    return fillLabel(
        escapeHtml(label).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'),
        html
    );
}
