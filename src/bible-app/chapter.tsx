import React from 'react';
import type { TranslationBookChapter, ChapterData, ChapterContent, ChapterVerse } from '../usfm-parser/generator';

type ArrayElement<ArrayType extends readonly unknown[]> = 
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export function Chapter({chapter}: { chapter: TranslationBookChapter }): any {
    return (<div>
        <h1>{chapter.book.commonName} ${chapter.chapter.number}</h1>
        {chapter.chapter.content.map(c => <ChapterContent content={c} />)}
    </div>)
}

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

function Verse({verse}: { verse: ChapterVerse}) {
    return <span><em>{verse.number}</em> {verse.content.map(c => <VerseContent content={c}></VerseContent>)}</span>
}

function VerseContent({ content }: { content: ArrayElement<ChapterVerse['content']> }) {
    if (typeof content === 'string') {
        return <>{content}</>;
    } else if(typeof content === 'object') {
        if ('text' in content) {
            return <>content.text</>;
        } else if('noteId' in content) {
            return <></>;
        }
    }

    return <></>;
}