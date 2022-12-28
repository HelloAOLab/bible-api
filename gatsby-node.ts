import { GatsbyNode } from "gatsby";
import { FileSystemNode } from 'gatsby-source-filesystem';
import { readFile } from 'fs/promises';
import path from 'path';


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

    let promises: Promise<void>[] = [];

    const createPageForChapterFile = async (node: FileSystemNode) => {
        const fileData = await readFile(node.absolutePath, { encoding: 'utf-8' });
        const json = JSON.parse(fileData);

        const url = `/read/${node.relativePath.slice(0, node.relativePath.length - '.json'.length)}`;
        actions.createPage({
            path: url,
            component: path.resolve('./src/templates/chapter.tsx'),
            context: {
                chapter: json
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