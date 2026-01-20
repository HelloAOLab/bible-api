import { z } from 'zod';
import {
    Chapter,
    ChapterContent,
    ParseTree,
    Verse,
    VerseContent,
} from './types.js';
import { getBookId, parseVerseReference, VerseRef } from '../utils.js';
import { ref } from 'process';

export const chapterHeadingSchema = z.object({
    type: z.literal('chapter-heading'),
    data: z.object({
        chapter: z.coerce.number().int(),
    }),
});

export const verseSchema = z.object({
    type: z.literal('text'),
    id: z.string(),
    bookCode: z.string().optional(),
    chapter: z.number().optional(),
    verse: z.number().optional(),
});

export const paratextSchema = z.object({
    type: z.literal('paratext'),
    id: z.string(),
});

export const metadataSchema = z.discriminatedUnion('type', [
    chapterHeadingSchema,
    verseSchema,
    paratextSchema,
]);

export const codexSchema = z.object({
    cells: z.array(
        z.object({
            kind: z.number(),
            languageId: z.string(),
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
     * Parses the specified codex content.
     *
     * @param codex The codex content to parse.
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

        function stripHTML(value: string) {
            return value.replace(/<[^>]*>/g, '');
        }

        function toHeading(content: string) {
            return {
                type: 'heading',
                content: [content],
            } satisfies ChapterContent;
        }

        function addLineBreaks(lines: Verse['content']) {
            return lines.reduce(
                (prev, current) => {
                    if (prev.length === 0) return [current];
                    else
                        return [
                            ...prev,
                            {
                                lineBreak: true,
                            },
                            current,
                        ] satisfies Verse['content'];
                },
                [] as Verse['content']
            );
        }

        let previousReference: VerseRef | null = null;
        let lines: Verse['content'] = [];

        for (let cell of data.cells) {
            if (cell.languageId === 'html' && cell.value) {
                if (!cell.metadata) continue; // ignore html cells without metadata

                const metadataResult = metadataSchema.safeParse(cell.metadata);

                if (!metadataResult.success) continue; // ignore cells with invalid/unknown metadata
                const metadata = metadataResult.data;
                if (metadata.type === 'text') {
                    let reference = parseVerseReference(metadata.id);
                    if (!reference) {
                        if (metadata.bookCode && metadata.chapter) {
                            const bookId = getBookId(metadata.bookCode);
                            if (!bookId) {
                                throw new Error(
                                    'Could not find book ID for code: ' +
                                        metadata.bookCode
                                );
                            }

                            if (metadata.verse) {
                                reference = {
                                    book: bookId,
                                    chapter: metadata.chapter,
                                    verse: metadata.verse,
                                };
                            } else if (previousReference?.verse) {
                                if (
                                    previousReference.chapter !==
                                        metadata.chapter ||
                                    previousReference.book !== bookId
                                ) {
                                    throw new Error(
                                        'Cannot infer verse number for non-consecutive verse reference.'
                                    );
                                }

                                // Sometimes codex doesn't include verse numbers for every cell, so we infer it from the previous reference
                                reference = {
                                    book: bookId,
                                    chapter: metadata.chapter,
                                    verse: previousReference.verse,
                                };
                            } else {
                                throw new Error(
                                    'Could not find verse reference in metadata.'
                                );
                            }
                        } else {
                            throw new Error(
                                'Could not find verse reference in metadata.'
                            );
                        }
                    }

                    if (
                        previousReference &&
                        (reference.book !== previousReference.book ||
                            reference.chapter !== previousReference.chapter ||
                            reference.verse !== previousReference.verse)
                    ) {
                        addReference(previousReference, addLineBreaks(lines));
                        lines = [];
                    }

                    previousReference = reference;

                    if (!root.id) root.id = reference.book; // set book id if not already set

                    const content = stripHTML(cell.value);

                    // add line breaks in heading if there are multiple lines
                    const newLines = content.split('\n');

                    lines.push(...newLines);
                } else if (metadata.type === 'paratext') {
                    const reference = parseVerseReference(`${metadata.id}:1`); // chapter headings do not have a verse reference always default to 1
                    if (reference) {
                        const content = stripHTML(cell.value);

                        // add line breaks in heading if there are multiple lines
                        const lines = content
                            .split('\n')
                            .reduce<ChapterContent[]>((prev, current) => {
                                if (prev.length === 0)
                                    return [toHeading(current)];
                                else
                                    return [
                                        ...prev,
                                        {
                                            type: 'line_break',
                                        },
                                        toHeading(current),
                                    ] satisfies ChapterContent[];
                            }, []);

                        lines.forEach((line) =>
                            addChapterContent(reference.chapter, [line])
                        );
                    } else {
                        // parse paratext that isn't a chapter reference as footnote
                        const content = stripHTML(cell.value);
                        if (!cell.metadata) {
                            if (lastChapter) {
                                (lastChapter as Chapter).footnotes.push({
                                    noteId: this._noteCounter++,
                                    text: content,
                                    caller: null,
                                });
                            }
                        }
                    }
                }
            }
        }

        if (previousReference) {
            addReference(previousReference, addLineBreaks(lines));
        }

        for (let chapter of chapters.values()) {
            root.content.push(chapter);
        }

        return root;
    }
}
