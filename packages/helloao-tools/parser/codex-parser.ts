import { z } from 'zod';
import { ParseTree } from './types';

export const chapterHeadingSchema = z.object({
    type: z.literal('chapter-heading'),
    data: z.object({
        chapter: z.coerce.number().int(),
    }),
});

export const codexSchema = z.object({
    cells: z.array(z.object({
        kind: z.number().int(),
        language: z.enum([
            'markdown',
            'scripture',
        ]),
        value: z.string(),
        metadata: z.discriminatedUnion('type', [
            chapterHeadingSchema
        ]).optional().nullable()
    })),
});

/**
 * Defines a parser for codex files.
 */
export class CodexParser {

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
            content: []
        };

        return root;
    }

}