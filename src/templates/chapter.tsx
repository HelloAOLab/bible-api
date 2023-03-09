import * as React from 'react';
import type { TranslationBookChapter, ChapterData, ChapterContent, ChapterVerse } from '../usfm-parser/generator';
import type { PageProps } from 'gatsby';
import Layout from '../components/Layout';
import { FormatNumber } from '../components/Language';

type ArrayElement<ArrayType extends readonly unknown[]> = 
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

type Context = PageProps<any, { chapter: TranslationBookChapter }>;

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

function ChapterTemplate({ pageContext }: Context): any {
    const chapter: TranslationBookChapter = pageContext.chapter;
    return <Layout language={ chapter.translation.language }>
        <h1>{chapter.book.name} <FormatNumber value={chapter.chapter.number} /></h1>
        <h6>{chapter.translation.shortName ?? chapter.translation.name}</h6>
        {chapter.chapter.content.map((c, i) => <ChapterContent content={c} key={i} />)}
    </Layout>
}

export default ChapterTemplate;

export const Head = ({ pageContext }: Context) => {
    const chapter = pageContext.chapter;
    return <title className={ `lang-${chapter.translation.language}` }>{chapter.book.commonName} {chapter.chapter.number} &#x2022; {chapter.translation.shortName ?? chapter.translation.name}</title>
}