import { z } from 'zod';
import {
    Chapter,
    ChapterContent,
    ParseTree,
    Verse,
    VerseContent,
} from './types.js';
import { parseVerseReference, VerseRef } from '../utils.js';

export const chapterHeadingSchema = z.object({
    type: z.literal('chapter-heading'),
    data: z.object({
        chapter: z.coerce.number().int(),
    }),
});

export const metadataSchema = z.discriminatedUnion('type', [
    chapterHeadingSchema,
]);

export const codexSchema = z.object({
    cells: z.array(
        z.object({
            // kind: z.number().int(),
            language: z.string(),
            value: z.string(),
            metadata: z
                .object({
                    type: z.string(),
                })
                .passthrough()
                .nullable()
                .optional(),
        })
    ),
});

/**
 * Defines a parser for codex files.
 */
export class CodexParser {
    // TODO:
    // /**
    //  * Whether to preserve markdown in the parsed content.
    //  */
    // preserveMarkdown: boolean = true;

    private _noteCounter: number = 0;

    /**
     * Parses the specified USX content.
     *
     * @param usx The USX content to parse.
     * @returns The parse tree that was generated.
     */
    public parse(codex: string): ParseTree {
        const json = JSON.parse(codex);
        const data = codexSchema.parse(json);

        let root: ParseTree = {
            type: 'root',
            content: [],
        };

        let chapters: Map<number, Chapter> = new Map();
        let lastChapter: Chapter | null = null;

        function addChapterContent(
            chapterNumber: number,
            content: ChapterContent[]
        ) {
            let chapter = chapters.get(chapterNumber);
            if (!chapter) {
                chapter = {
                    type: 'chapter',
                    number: chapterNumber,
                    content: [],
                    footnotes: [],
                };
                lastChapter = chapter;
                chapters.set(chapterNumber, chapter);
            }

            chapter.content.push(...content);
        }

        function addReference(ref: VerseRef, content: Verse['content']) {
            addChapterContent(ref.chapter, [
                {
                    type: 'verse',
                    number: ref.verse,
                    content: content,
                },
            ]);
        }

        for (let cell of data.cells) {
            if (cell.language === 'scripture') {
                const lines = cell.value.split('\n');
                const references = lines.map(
                    (l) => parseVerseReference(l) ?? l
                );
                let currentRef: VerseRef | null = null;
                let content: Verse['content'] = [];
                for (let i = 0; i < references.length; i++) {
                    const ref = references[i];
                    const nextRef = references[i + 1];

                    if (typeof ref === 'string') {
                        // continuation on existing verse
                        // or line break between verses

                        if (ref === '') {
                            // line break

                            if (typeof nextRef === 'object') {
                                // between verses

                                if (
                                    currentRef &&
                                    currentRef.chapter === nextRef.chapter
                                ) {
                                    // in same chapter
                                    addChapterContent(currentRef.chapter, [
                                        {
                                            type: 'line_break',
                                        },
                                    ]);
                                } else {
                                    // do nothing since line breaks between chapters are ignored
                                }
                            } else {
                                // inside verse
                                content.push({
                                    lineBreak: true,
                                });
                            }
                        } else if (ref) {
                            content.push(ref);
                        }
                    } else {
                        if (!root.id) {
                            root.id = ref.book;
                        }

                        // new verse
                        if (currentRef) {
                            // finish previous verse
                            currentRef = null;
                            content = [];
                        }

                        currentRef = ref;

                        if (ref.content) {
                            content.push(ref.content);
                        }

                        addReference(ref, content);
                    }
                }
            } else if (cell.language === 'markdown') {
                if (cell.metadata) {
                    if (cell.metadata.type === 'chapter-heading') {
                        const metadata = metadataSchema.parse(cell.metadata);

                        const chapter = metadata.data.chapter;
                        addChapterContent(chapter, [
                            {
                                type: 'heading',
                                content: [cell.value],
                            },
                        ]);
                    }
                } else {
                    if (lastChapter) {
                        (lastChapter as Chapter).footnotes.push({
                            noteId: this._noteCounter++,
                            text: cell.value,
                            caller: null,
                        });
                    }
                }
            }
        }

        for (let chapter of chapters.values()) {
            root.content.push(chapter);
        }

        return root;
    }
}
