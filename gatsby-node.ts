import { GatsbyNode } from "gatsby";
import { FileSystemNode } from 'gatsby-source-filesystem';
import { readFile } from 'fs/promises';
import path from 'path';
import type { Translation, TranslationBook, TranslationBookChapter, TranslationBooks } from './src/usfm-parser/generator';
import { sortBy } from "lodash";

export const createPages: GatsbyNode['createPages'] = async ({ actions, graphql }) => {
    const { data } = await graphql<{ allFile: { nodes: FileSystemNode[] }}>(`
        query {
            allFile {
                nodes {
                    id
                    absolutePath
                    relativePath
                    ext
                    base
                }
            }
        }
    `);

    if (!data) {
        throw new Error('Unable to read API files list!');
    }

    // const availableTranslations = data.allFile.nodes.find(n => n.base === 'available_translations.json');
    const allBooks = data.allFile.nodes.filter(n => n.base === 'books.json');

    let translationBooks = new Map<string, TranslationBook[]>;
    let translations = new Map<string, Translation>;

    for(let books of allBooks) {
        const fileData = await readFile(books.absolutePath, { encoding: 'utf-8' });
        const json: TranslationBooks = JSON.parse(fileData);

        translations.set(json.translation.id, json.translation);
        translationBooks.set(json.translation.id, json.books);
    }

    let promises: Promise<void>[] = [];

    const createChapterUrl = (path: string) => {
        if (path.startsWith('/api/')) {
            path = path.slice('/api/'.length);
        }

        const url = `/read/${path.slice(0, path.length - '.json'.length)}`;
        return url;
    };

    const createBookUrl = (path: string) => {
        if (path.startsWith('/api/')) {
            path = path.slice('/api/'.length);
        }

        const lastSlash = path.lastIndexOf('/');
        const url = `/read/${path.slice(0, lastSlash)}`;
        return url;
    };

    const createPageForChapterFile = async (node: FileSystemNode) => {
        const fileData = await readFile(node.absolutePath, { encoding: 'utf-8' });
        const json = JSON.parse(fileData);

        const url = createChapterUrl(node.relativePath);// `/read/${node.relativePath.slice(0, node.relativePath.length - '.json'.length)}`;

        const chapter: TranslationBookChapter = json;
        const nextChapterUrl = chapter.nextChapterApiLink ? createChapterUrl(chapter.nextChapterApiLink) : null;
        const previousChapterUrl = chapter.previousChapterApiLink ? createChapterUrl(chapter.previousChapterApiLink) : null;
        const bookUrl = createBookUrl(node.relativePath);

        const books = translationBooks.get(chapter.translation.id)?.map(b => ({
            ...b,
            firstChapterLink: createChapterUrl(b.firstChapterApiLink),
            lastChapterLink: createChapterUrl(b.lastChapterApiLink)
        }));

        const currentLanguage = chapter.translation.language;

        let contextTranslations = [...translations.values()];

        contextTranslations = sortBy(contextTranslations,
            // Sort first by translations that match the current language
            t => isSameRootLanguage(t.language, currentLanguage) ? 0 : 1,

            // If the current language is english, then
            // sort by the english name of the translation. Otherwise, sort by the actual name of the language
            t => isSameRootLanguage(currentLanguage, 'en') ? t.englishName : t.name);

        actions.createPage({
            path: url,
            component: path.resolve('./src/templates/chapter.tsx'),
            context: {
                chapter: json,
                books,
                translations: contextTranslations,
                nextChapterUrl,
                previousChapterUrl,
                bookUrl
            },
        });
    };

    for(let node of data.allFile.nodes) {
        if (node.ext !== '.json') {
            continue;
        }
        if (node.base === 'available_translations.json' || node.base === 'books.json') {
            continue;
        }
        promises.push(createPageForChapterFile(node));
    }

    await Promise.all(promises);
};

/**
 * Determines if the two given language tags represent the same root language.
 * That is, en-US and en-UK share the same root language: english.
 * @param first The first language tag.
 * @param second The second language tag.
 */
function isSameRootLanguage(first: string, second: string): boolean {
    return getRootLanguage(first) === getRootLanguage(second);
}

/**
 * Gets the root language from the given language tag.
 * @param lang The language tag.
 */
function getRootLanguage(lang: string): string | null {
    let firstDash = lang.indexOf('-');
    if (firstDash < 0) {
        return lang;
    }
    return lang.substring(0, firstDash);
}