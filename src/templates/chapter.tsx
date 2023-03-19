import * as React from 'react';
import Select, { StylesConfig, createFilter } from 'react-select';
import type { TranslationBookChapter, ChapterData, ChapterContent, ChapterVerse, TranslationBook, Translation, TranslationBooks } from '../usfm-parser/generator';
import type { PageProps } from 'gatsby';
import Layout from '../components/Layout';
import { FormatNumber } from '../components/Language';

type ArrayElement<ArrayType extends readonly unknown[]> = 
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

interface PageContext {
    chapter: TranslationBookChapter;
    books: TranslationBook[];
    translations: Translation[];
    nextChapterUrl: string;
    previousChapterUrl: string;
    bookUrl: string;
}

type Context = PageProps<any, PageContext>;

function ChapterContent( {content}: { content: ChapterContent }) {
    if (content.type === 'heading') {
        return <h3>{content.content.join(' ')}</h3>
    } else if(content.type === 'line_break') {
        return <br></br>
    } else if (content.type === 'verse') {
        return <Verse verse={content}></Verse>
    }

    return <></>
}

function WordsOfJesus({ children }: { children: string | string[] }) {
    return <span className='words-of-jesus'>{children}</span>
}

function Verse({verse}: { verse: ChapterVerse}) {
    return <span> <sup id={`V${verse.number}`} className="verse-marker"><em><FormatNumber value={verse.number}/></em></sup> {verse.content.map((c, i) => <VerseContent content={c} key={i}></VerseContent>)}</span>
}

function VerseContent({ content }: { content: ArrayElement<ChapterVerse['content']> }) {
    if (typeof content === 'string') {
        return <> {content}</>;
    } else if(typeof content === 'object') {
        if ('text' in content) {
            if (content.wordsOfJesus) {
                return <WordsOfJesus> {content.text}</WordsOfJesus>
            } else {
                return <> {content.text}</>;
            }
        } else if('noteId' in content) {
            return <></>;
        }
    }

    return <></>;
}

function PreviousChapterButton({ context, children }: { context: PageContext, children: any }) {
    if (context.previousChapterUrl) {
        return (<div className="chapter-button previous">
            <button title="Previous Chapter" aria-label="Previous Chapter" onClick={() => location.href = context.previousChapterUrl }>{children}</button>
        </div>);
    } else {
        return <></>;
    }
}

function NextChapterButton({ context, children }: { context: PageContext, children: any }) {
    if (context.nextChapterUrl) {
        return (<div className="chapter-button next">
            <button title="Next Chapter" aria-label="Next Chapter" onClick={() => location.href = context.nextChapterUrl }>{children}</button>
        </div>);
    } else {
        return <></>;
    }
}

function ChapterHeader( { context }: { context: PageContext }) {
    const chapter = context.chapter;
    const bookOptions = context.books.map(b => ({
        value: b.id,
        label: b.commonName
    }));
    const currentBook = {
        value: chapter.book.id,
        label: chapter.book.commonName
    };

    let chapterOptions = [] as any;
    for (let i = 1; i <= chapter.book.numberOfChapters; i++) {
        chapterOptions.push({
            value: i,
            label: i
        });
    }
    const currentChapter = {
        value: chapter.chapter.number,
        label: chapter.chapter.number
    };

    function createTranslationOption(t: Translation) {
        const label = t.shortName ? 
            (<span>{t.name} (<small>{t.shortName}</small>)</span>) :
            (<span>{t.name}</span>);
        return {
            value: t.id,
            label: label,
            data: t
        };
    }

    const translationOptions = context.translations.map(createTranslationOption);
    const currentTranslation = {
        value: chapter.translation.id,
        label: chapter.translation.shortName,
        data: chapter.translation
    };

    const createBookUrl = (path: string) => {
        if (path.startsWith('/api/')) {
            path = path.slice('/api/'.length);
        }

        const lastSlash = path.lastIndexOf('/');
        const url = `/read/${path.slice(0, lastSlash)}`;
        return url;
    };

    const onSelectBook = (value: any) => {
        const b = context.books.find(b => b.id === value.value);
        location.href = (b as any)?.firstChapterLink;
    };
    
    const onSelectChapter = (value: any) => {
        location.href = `${context.bookUrl}/${value.value}`;
    };

    const filterTranslations = createFilter({
        ignoreCase: true,
        ignoreAccents: true,
        stringify: (option) => {
            const translation = (option.data as any).data as Translation;
            let language = translation.language;
            if (Intl && Intl.DisplayNames) {
                const names = new Intl.DisplayNames([], {
                    type: 'language',
                    languageDisplay: 'standard'
                });
                language = `${translation.language} ${names.of(translation.language)}`
            }

            return `${translation.shortName} ${translation.name} ${translation.englishName} ${language}`;
        }
    })

    // const filterTranslations = (value: any, search: string) => {
    //     const translation = value.value as Translation;

    //     return translation.shortName?.includes(search) ||
    //         translation.name.includes(search) ||
    //         translation.englishName.includes(search);
    // }

    const onSelectTranslation = async (value: any) => {
        const translationId = value.value;
        const response = await fetch(`/api/${translationId}/books.json`);
        const translationBooks: TranslationBooks = await response.json();

        const book = translationBooks.books.find(b => b.id === chapter.book.id) ?? translationBooks.books[0];
        const url = createBookUrl(book.firstChapterApiLink);
        location.href = `${url}/${chapter.chapter.number}`;
    };

    const selectStyle: StylesConfig = {
        container: (baseStyles, state) => ({
            ...baseStyles,
            display: 'inline-block',
        }),
        control: (baseStyles, state) => ({
            ...baseStyles,
            backgroundColor: 'var(--background-color)',
            color: 'var(--text-color)',
            border: 'none'
        }),
        valueContainer: (baseStyles, state) => ({
            ...baseStyles,
            paddingInlineStart: '0'
        }),
        singleValue: (baseStyles, state) => ({
            ...baseStyles,
            color: 'var(--text-color)',
            marginInlineStart: '0'
        }),
        indicatorSeparator: (baseStyles, state) => ({
            ...baseStyles,
            display: 'none'
        }),
        menuList: (baseStyles, state) => ({
            ...baseStyles,
            backgroundColor: 'var(--inverse-background-color)',
            color: 'var(--inverse-text-color)',
            minWidth: '400px'
        }),
        input: (baseStyles, state) => ({
            ...baseStyles,
            color: 'var(--text-color)'
        }),
    };

    const bookSelectStyle: StylesConfig = {
        ...selectStyle,
    };

    const chapterSelectStyle: StylesConfig = {
        ...selectStyle,
    };

    const translationSelectStyle: StylesConfig = {
        ...selectStyle
    };

    return (<>
        {/* @ts-ignore */}
        <h1><Select styles={bookSelectStyle} defaultValue={currentBook} options={bookOptions as any} onChange={onSelectBook} /> <Select styles={chapterSelectStyle} defaultValue={currentChapter} options={chapterOptions} onChange={onSelectChapter} /></h1>
        <h6><Select styles={translationSelectStyle} defaultValue={currentTranslation} options={translationOptions as any} onChange={onSelectTranslation} filterOption={filterTranslations} /></h6>
    </>);
}

function ChapterTemplate({ pageContext }: Context): any {
    const chapter: TranslationBookChapter = pageContext.chapter;
    return <Layout language={ chapter.translation.language }>
        <div className="chapter-layout">
            <div className="large chapter-buttons" aria-hidden="true">
                <PreviousChapterButton context={pageContext}>&lt;</PreviousChapterButton>
            </div>
            <main className="chapter-container">
                <ChapterHeader context={pageContext}/>
                <nav className="sr-only-on-large chapter-buttons primary">
                    <PreviousChapterButton context={pageContext}>Previous</PreviousChapterButton>
                    <NextChapterButton context={pageContext}>Next</NextChapterButton>
                </nav>
                <div className='chapter-content'>
                    {chapter.chapter.content.map((c, i) => <ChapterContent content={c} key={i} />)}
                </div>
                <nav className="sr-only-on-large chapter-buttons second">
                    <PreviousChapterButton context={pageContext}>Previous</PreviousChapterButton>
                    <NextChapterButton context={pageContext}>Next</NextChapterButton>
                </nav>
            </main>
            <div className="large chapter-buttons" aria-hidden="true">
                <NextChapterButton context={pageContext}>&gt;</NextChapterButton>
            </div>
        </div>
    </Layout>
}

export default ChapterTemplate;

export const Head = ({ pageContext }: Context) => {
    const chapter = pageContext.chapter;
    return <title className={ `lang-${chapter.translation.language}` }>{chapter.book.commonName} {chapter.chapter.number} &#x2022; {chapter.translation.shortName ?? chapter.translation.name}</title>
}

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