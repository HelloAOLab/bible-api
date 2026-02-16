import {
    ParseTree,
    Chapter,
    Verse,
    Heading,
    Footnote,
    VerseContent,
    Text,
    FootnoteReference,
} from './types';

export class LockmanParser {
    parse(text: string): ParseTree[] {
        const roots: ParseTree[] = [];
        let currentRoot: ParseTree | null = null;
        let currentChapter: Chapter | null = null;
        let currentVerse: Verse | null = null;

        // Splits text into tokens based on structural tags
        // Identify major blocks: BN, CN, SH, and Verse Starters (V, C, PM, A, PO)
        // Note: SH and CN content is strictly inside the tag.
        // Verse content follows the tag.
        // We use a regex that captures the tag AND its "attributes" like {{..}}Num<T> for verses.

        // Regex for structural separators
        // Captures:
        // 1. Title: <BN>...</BN>
        // 2. Chapter Heading: <CN>...</CN>
        // 3. Section Heading: <SH>...</SH>
        // 4. Verse Start: (<V>|<C>|<PM>|<A>|<PO>){{...}}Number<T>

        const structureRegex =
            /(<BN>.*?<\/BN>)|(<CN>.*?<\/CN>)|(<SH>.*?<\/SH>)|((?:<V>|<C>|<PM>|<A>|<PO>)\{\{.*?\}\}\d+<T>)/g;

        let lastIndex = 0;
        let match;

        while ((match = structureRegex.exec(text)) !== null) {
            const fullMatch = match[0];
            const startIndex = match.index;

            // Content belonging to the PREVIOUS structural element
            if (startIndex > lastIndex) {
                const content = text.substring(lastIndex, startIndex);
                if (currentVerse && currentChapter) {
                    this.parseVerseContent(
                        content,
                        currentVerse,
                        currentChapter
                    );
                }
            }

            lastIndex = startIndex + fullMatch.length;

            if (match[1]) {
                // <BN>Title</BN>
                // Start of a NEW Book
                const title = match[1].replace(/<\/?BN>/g, '').trim();

                currentRoot = {
                    type: 'root',
                    title: title,
                    content: [],
                };
                roots.push(currentRoot);

                // Reset context for new book
                currentChapter = null;
                currentVerse = null;
            } else if (match[2]) {
                // <CN>CHAPTER 1</CN>
                // Start new Chapter
                // Ensure we have a root (handle case where no <BN> provided, implicitly create one? Or just attach to last root)
                if (!currentRoot) {
                    // Fallback if no <BN> was found first
                    currentRoot = {
                        type: 'root',
                        content: [],
                    };
                    roots.push(currentRoot);
                }

                const inner = match[2].replace(/<\/?CN>/g, '').trim();
                const numMatch = inner.match(/\d+/);
                const num = numMatch ? parseInt(numMatch[0], 10) : 0;

                currentChapter = {
                    type: 'chapter',
                    number: num,
                    content: [],
                    footnotes: [],
                };
                currentRoot.content.push(currentChapter);
                currentVerse = null;
            } else if (match[3]) {
                // <SH>Heading</SH>
                if (!currentRoot) {
                    currentRoot = { type: 'root', content: [] };
                    roots.push(currentRoot);
                }

                const inner = match[3].replace(/<\/?SH>/g, '').trim();
                const heading: Heading = {
                    type: 'heading',
                    content: [inner],
                };
                if (currentChapter) {
                    currentChapter.content.push(heading);
                } else {
                    // Start of book heading? Not typical in this structure but possible
                    currentRoot.content.push(heading);
                }
            } else if (match[4]) {
                // Verse Start: <Tag>{{Ref}}Number<T>
                // Extract Verse Number
                const tagContent = match[4];
                // Regex to extract digits before <T>
                const vNumMatch = tagContent.match(/(\d+)<T>$/);
                const vNum = vNumMatch ? parseInt(vNumMatch[1], 10) : 0;

                if (currentChapter) {
                    // Check for Paragraph Marker
                    if (tagContent.startsWith('<PM>')) {
                        currentChapter.content.push({ type: 'line_break' });
                    }

                    currentVerse = {
                        type: 'verse',
                        number: vNum,
                        content: [],
                    };
                    currentChapter.content.push(currentVerse);
                }
            }
        }

        // Process remaining text after the last match
        if (lastIndex < text.length) {
            const content = text.substring(lastIndex);
            if (currentVerse && currentChapter) {
                this.parseVerseContent(content, currentVerse, currentChapter);
            }
        }

        return roots;
    }

    private parseVerseContent(text: string, verse: Verse, chapter: Chapter) {
        // Remove line breaks that are just formatting in the source file
        // But keep spaces.
        // The source has newlines. We should arguably treat them as spaces.
        let cleanText = text.replace(/\s+/g, ' ');

        // If this block of text is at the end of a verse, we might want to trim trailing space.
        // However, we don't strictly know if it's the end, but in this parser structure,
        // parseVerseContent is called with the *entire* text between structure markers.
        // So `text` is "Verse 1 " (because of newline).
        // It's generally safe to trim key whitespace if it's just a newline in source.

        // Actually, let's just trim the WHOLE thing if it's creating issues.
        // But we want to preserve internal spacing.
        // The issue is simply that `\n` -> ` ` and it's at the end.

        // Let's rely on the fact that if the text ends in space, and it's followed by a tag that starts a new structural element, that space is likely superfluous.
        // But we don't know the future here easily.

        // Let's modify the tests to EXPECT the space, OR modify the parser to trip trailing spaces for "text" nodes.
        // Given the requirement is "validate the parsed structure", and the input has newlines,
        // Normalize whitespace: replace newlines/tabs with spaces, and trim leading/trailing space
        // This handles cases where source text has newlines for formatting that shouldn't appear in the output.
        // However, we preserve internal spaces between words.
        cleanText = cleanText.replace(/\s+/g, ' ').trim();

        // Regex to separate text from special inline blocks:
        // 1. Footnotes: <$F ... $E>
        // 2. Cross References: <$R ... $RE>  (To be removed)
        // 3. Formatting Tags: <RA>, <N1>, etc. (To be removed?)
        // 4. Italics in curly braces: {text}

        // Note: Curly braces are nested inside footnotes sometimes, but stripped there.
        // At the verse level, they denote italics.

        const segmentRegex =
            /(<\$F.*?\$E>)|(<\$R.*?\$RE>)|(<[^>]+>)|(\{.*?\})/g;

        let lastIdx = 0;
        let m;

        while ((m = segmentRegex.exec(cleanText)) !== null) {
            const snippet = cleanText.substring(lastIdx, m.index);
            if (snippet) {
                // Add plain text
                this.addText(verse, snippet);
            }

            if (m[1]) {
                // Footnote <$F ... $E>
                this.processFootnote(m[1], verse, chapter);
            } else if (m[2]) {
                // Cross Ref -> Ignore
            } else if (m[3]) {
                // Other tag -> Ignore (e.g. <RA>, <N1>, <FA>)
                // These are often just markers or anchors.
            } else if (m[4]) {
                // Italics {text}
                const content = m[4].substring(1, m[4].length - 1);
                // We push a Text object with italics: true
                // Check if we need to decode inside? Usually just text.
                if (content) {
                    verse.content.push({
                        text: content,
                        italics: true,
                    } as Text);
                }
            }

            lastIdx = segmentRegex.lastIndex;
        }

        const remaining = cleanText.substring(lastIdx);
        if (remaining) {
            this.addText(verse, remaining);
        }
    }

    private addText(verse: Verse, text: string) {
        if (!text) return;

        // Merge with previous string if possible
        const lastItem = verse.content[verse.content.length - 1];
        if (typeof lastItem === 'string') {
            verse.content[verse.content.length - 1] = lastItem + text;
        } else {
            verse.content.push(text);
        }
    }

    private processFootnote(block: string, verse: Verse, chapter: Chapter) {
        // block is <$F...$E>
        // Inner content has tags like <FN>, <FNC>, <N1>...
        // We want the readable text.
        // Remove known technical tags.

        // Remove outer $F...$E
        let inner = block.replace(/^<\$F/, '').replace(/\$E>$/, '');

        // Remove internal technical tags
        // Remove <FN>...</FN> completely
        inner = inner.replace(/<FN>.*?<\/FN>/g, '');

        // Remove other tags <N1>, <FA> but keep content
        // Also remove italics curly braces (keep content inside)
        const text = inner
            .replace(/<[^>]+>/g, '')
            .replace(/[\{\}]/g, '')
            .trim();

        if (!text) return;

        const noteId = chapter.footnotes.length + 1;

        const fn: Footnote = {
            noteId: noteId,
            text: text,
            caller: '+',
            reference: {
                chapter: chapter.number,
                verse: verse.number,
            },
        };
        chapter.footnotes.push(fn);

        verse.content.push({
            noteId: noteId,
        } as FootnoteReference);
    }
}
