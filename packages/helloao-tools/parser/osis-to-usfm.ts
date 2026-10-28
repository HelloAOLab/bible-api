import { osisBookMap } from '../generation/theographic.js';

interface OsisVerse {
    number: number;
    label: string;
    suffix: string;
    before: string;
    text: string;
}

/** Gets the reference used by a container or milestone verse. */
function verseRef(element: Element): string {
    return element.getAttribute('osisID') || element.getAttribute('sID') || '';
}

/** Parses one OSIS verse reference, including an optional split suffix. */
function parseOsisVerseRef(reference: string): {
    book: string;
    chapter: string;
    verse: string;
    suffix: string;
} | null {
    const match = reference.match(/^([^.]+)\.(\d+)\.(\d+)(?:!([a-z]+))?$/);
    return match
        ? {
              book: match[1],
              chapter: match[2],
              verse: match[3],
              suffix: match[4] || '',
          }
        : null;
}

/**
 * Converts the supported OSIS subset into one USFM string per book.
 * The parser is supplied by the caller, as with USXParser.
 * @param xml The OSIS document to convert.
 * @param domParser The DOM parser used to read the XML.
 * @returns The converted USFM books.
 */
export function convertOsisToUsfm(
    xml: string,
    domParser: DOMParser
): { bookId: string; usfm: string }[] {
    const document = domParser.parseFromString(xml, 'text/xml');
    const books: { bookId: string; usfm: string }[] = [];
    let nearestVerse = '';

    const fail = (
        element: Element,
        reason = 'Unsupported OSIS markup'
    ): never => {
        let verse =
            (element.nodeName === 'verse'
                ? verseRef(element) || element.getAttribute('eID')
                : null) ||
            (element.querySelector('verse')
                ? verseRef(element.querySelector('verse')!)
                : '') ||
            nearestVerse;
        // Before the first verse, locate it in the enclosing chapter or book.
        let parent = element.parentElement;
        while (!verse && parent) {
            const nearby = parent.querySelector('verse');
            verse = nearby ? verseRef(nearby) : '';
            parent = parent.parentElement;
        }
        verse ||= element.getAttribute('osisID') || '';
        throw new Error(
            `${reason}: <${element.nodeName} type="${element.getAttribute('type') || ''}"> at ${verse || 'document'}`
        );
    };

    // Source line breaks and indentation must not introduce spaces into Japanese.
    const clean = (text: string) =>
        text.replace(/[ \t]*[\r\n]+[ \t\r\n]*/g, '');
    const inlineText = (element: Element): string => {
        let result = '';
        for (const node of Array.from(element.childNodes)) {
            if (node.nodeType === 3) {
                result += clean(node.textContent || '');
            } else if (node.nodeType === 1) {
                const child = node as Element;
                if (child.nodeName !== 'w') fail(child);
                result += inlineText(child);
            }
        }
        return result;
    };

    const convertBook = (book: Element) => {
        nearestVerse = '';
        const osisId = book.getAttribute('osisID') || '';
        const bookId = osisBookMap.get(osisId);
        if (!bookId) fail(book, `Unknown OSIS book ID ${osisId}`);
        if (books.some((book) => book.bookId === bookId))
            fail(book, `Duplicate OSIS book ID ${osisId}`);
        let title = '';
        let body = '';
        let chapterNumber = '';
        let verses: OsisVerse[] = [];
        let pending = '';
        let current: OsisVerse | null = null;
        let afterPoetry = false;

        const flushChapter = () => {
            if (!chapterNumber) return;
            let ordered = verses;
            if (verses.some((verse) => verse.suffix)) {
                const groups = new Map<number, OsisVerse[]>();
                for (const verse of verses) {
                    const group = groups.get(verse.number) || [];
                    group.push(verse);
                    groups.set(verse.number, group);
                }
                ordered = [...groups.entries()]
                    .sort(([a], [b]) => a - b)
                    .map(([, parts]) => {
                        parts.sort((a, b) => a.suffix.localeCompare(b.suffix));
                        return {
                            ...parts[0],
                            before: parts.map((part) => part.before).join(''),
                            text: parts.map((part) => part.text).join(''),
                        };
                    });
            }
            body += `\n\\c ${chapterNumber}`;
            for (const verse of ordered) {
                body += `${verse.before}\n\\v ${verse.label} ${verse.text.trim()}`;
            }
            body += pending;
            verses = [];
            pending = '';
            current = null;
        };
        const marker = (value: string) => {
            afterPoetry = false;
            if (current && !current.text.trim() && value === '\\p')
                current.before += `\n${value}`;
            else if (current) current.text += `\n${value}\n`;
            else pending += `\n${value}`;
        };
        const walk = (element: Element): void => {
            switch (element.nodeName) {
                case 'chapter': {
                    if (element.hasAttribute('eID')) {
                        flushChapter();
                        chapterNumber = '';
                        return;
                    }
                    const reference = verseRef(element);
                    const match = reference.match(/^([^.]+)\.(\d+)$/);
                    if (!match || match[1] !== osisId)
                        fail(element, 'Invalid OSIS chapter reference');
                    flushChapter();
                    chapterNumber = match![2];
                    nearestVerse = '';
                    break;
                }
                case 'title': {
                    const type = element.getAttribute('type');
                    if (type === 'main') title = inlineText(element).trim();
                    else if (type === 'psalm')
                        marker(`\\d ${inlineText(element).trim()}`);
                    else if (type === 'chapter') inlineText(element);
                    else fail(element);
                    return;
                }
                case 'p':
                    marker('\\p');
                    break;
                case 'l':
                    marker('\\q1');
                    break;
                case 'lg':
                    break;
                case 'w':
                    break;
                case 'verse': {
                    if (element.hasAttribute('eID')) {
                        current = null;
                        return;
                    }
                    const reference = verseRef(element);
                    nearestVerse = reference;
                    const refs = reference
                        .trim()
                        .split(/\s+/)
                        .map(parseOsisVerseRef);
                    if (refs.some((ref) => !ref))
                        fail(element, 'Invalid OSIS verse reference');
                    if (
                        refs.some(
                            (ref) =>
                                ref!.book !== osisId ||
                                ref!.chapter !== chapterNumber
                        )
                    )
                        fail(
                            element,
                            `OSIS verse reference does not match enclosing chapter ${osisId}.${chapterNumber}`
                        );
                    const first = refs[0]!;
                    const last = refs[refs.length - 1]!;
                    current = {
                        number: Number(first.verse),
                        label:
                            first.verse === last.verse
                                ? first.verse
                                : `${first.verse}-${last.verse}`,
                        suffix: first.suffix,
                        before: pending,
                        text: '',
                    };
                    afterPoetry = false;
                    pending = '';
                    verses.push(current);
                    break;
                }
                default:
                    fail(element);
            }
            walkChildren(element);
            if (element.nodeName === 'verse' && !element.hasAttribute('sID'))
                current = null;
            if (element.nodeName === 'lg') afterPoetry = true;
            if (element.nodeName === 'chapter') current = null;
        };
        const walkChildren = (element: Element): void => {
            for (const node of Array.from(element.childNodes)) {
                if (node.nodeType === 1) walk(node as Element);
                else if (node.nodeType === 3) {
                    const text = clean(node.textContent || '');
                    if (!current) {
                        if (text.trim())
                            fail(
                                element,
                                `Text outside a verse in chapter ${osisId}.${chapterNumber}: ${text.trim().slice(0, 80)}`
                            );
                        continue;
                    }
                    if (afterPoetry && text.trim()) {
                        current.text += '\n\\p\n';
                        afterPoetry = false;
                    }
                    current.text += text;
                }
            }
        };
        walkChildren(book);
        flushChapter();
        const header = title
            ? `\n\\h ${title}\n\\toc1 ${title}\n\\toc2 ${title}\n\\mt1 ${title}`
            : '';
        books.push({
            bookId: bookId!,
            usfm: `\\id ${bookId}${header}${body}\n`,
        });
    };
    const walkDocument = (element: Element): void => {
        if (element.nodeName === 'header') return;
        // Testament headings (e.g. 旧約聖書) aren't part of any book.
        if (
            element.nodeName === 'head' &&
            element.parentElement?.nodeName === 'div'
        )
            return;
        if (element.nodeName === 'div') {
            const type = element.getAttribute('type');
            if (type === 'book') {
                convertBook(element);
                return;
            }
            if (type !== 'x-testament' && type !== 'bookgroup') fail(element);
        } else if (!['osis', 'osisText'].includes(element.nodeName))
            fail(element);
        for (const child of Array.from(element.children)) walkDocument(child);
    };
    if (document.documentElement?.nodeName !== 'osis')
        throw new Error('Invalid OSIS document: expected an <osis> root');
    if (!document.querySelector('osisText'))
        throw new Error('Invalid OSIS document: missing <osisText>');
    walkDocument(document.documentElement);
    if (books.length === 0)
        throw new Error('Invalid OSIS document: no books found');
    return books;
}
