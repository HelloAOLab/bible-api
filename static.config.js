import { readdir, readFile } from 'fs/promises';
import path from 'path';

const apiPath = path.resolve(__dirname, './build/api');
const availableTranslationsPath = path.resolve(apiPath, 'available_translations.json');

export default {
    async getRoutes() {
        let routes = [];

        const availableTranslations = await readdir(apiPath);

        for(let translation of availableTranslations) {
            if(translation === 'available_translations.json') {
                continue;
            }
            const translationPath = path.resolve(apiPath, translation);

            const books = await readdir(translationPath);

            for(let book of books) {
                const bookPath = path.resolve(translationPath, book);

                const chapters = await readdir(bookPath);

                for(let chapter of chapters) {
                    const chapterPath = path.resolve(bookPath, chapter);

                    const chapterData = JSON.parse(await readFile(chapterPath, { encoding: 'utf-8' }));

                    routes.push({
                        path: `${translation}/${book}/${path.basename(chapter, '.json')}`,
                        template: 'src/bible-app/Chapter',
                        getData: () => ({
                            chapter: chapterData
                        })
                    });
                }

            }

        }
    }
}