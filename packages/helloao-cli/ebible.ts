import { parse } from 'papaparse';
import { EBibleSource } from 'prisma-gen/index.js';
import { DateTime } from 'luxon';
import { sha256 } from 'hash.js';
import { getTranslationId } from '@helloao/tools/utils.js';

/**
 * Fetches eBible translation metadata and returns EBibleSource objects.
 */
export async function fetchEBibleMetadata(): Promise<EBibleSource[]> {
    const translationsResponse = await fetch(
        'https://ebible.org/Scriptures/translations.csv'
    );
    const translationsCsv = await translationsResponse.text();
    const ebibleTranslations = parse<{
        languageCode: string;
        translationId: string;
        languageName: string;
        languageNameInEnglish: string;
        dialect: string;
        homeDomain: string;
        title: string;
        description: string;
        Redistributable: string;
        Copyright: string;
        UpdateDate: string;
        publicationURL: string;
        OTbooks: string;
        OTchapters: string;
        OTverses: string;
        NTbooks: string;
        NTchapters: string;
        NTverses: string;
        DCbooks: string;
        DCchapters: string;
        DCverses: string;
        FCBHID: string;
        Certified: string;
        inScript: string;
        swordName: string;
        rodCode: string;
        textDirection: string;
        downloadable: string;
        font: string;
        shortTitle: string;
        PODISBN: string;
        script: string;
        sourceDate: string;
    }>(translationsCsv.trimEnd(), {
        header: true,
    });

    return ebibleTranslations.data.map((translation) => {
        const fcbhid = translation.FCBHID.trim();
        const languageCode = translation.languageCode.trim();

        const source: EBibleSource = {
            id: translation.translationId,
            translationId: getTranslationId(
                `${languageCode.toLowerCase()}_${fcbhid.slice(3).toLowerCase()}`
            ),
            title: translation.title.trim(),
            shortTitle: translation.shortTitle.trim(),
            textDirection: translation.textDirection.trim(),
            languageCode: languageCode,
            copyright: translation.Copyright.trim(),
            description: translation.description.trim(),
            oldTestamentBooks: parseInt(translation.OTbooks.trim()),
            oldTestamentChapters: parseInt(translation.OTchapters.trim()),
            oldTestamentVerses: parseInt(translation.OTverses.trim()),
            newTestamentBooks: parseInt(translation.NTbooks.trim()),
            newTestamentChapters: parseInt(translation.NTchapters.trim()),
            newTestamentVerses: parseInt(translation.NTverses.trim()),
            apocryphaBooks: parseInt(translation.DCbooks.trim()),
            apocryphaChapters: parseInt(translation.DCchapters.trim()),
            apocryphaVerses: parseInt(translation.DCverses.trim()),
            redistributable:
                translation.Redistributable.trim().toUpperCase() === 'TRUE'
                    ? 'TRUE'
                    : ('FALSE' as any),
            FCBHID: fcbhid,
            sourceDate: DateTime.fromISO(
                translation.sourceDate.trim()
            ).toISO() as any,
            updateDate: DateTime.fromISO(
                translation.UpdateDate.trim()
            ).toISO() as any,
            usfmDownloadDate: null,
            usfmDownloadPath: null,
            usfmZipUrl: null,
            usfmZipEtag: null,
            sha256: null,
        };

        source.sha256 = sha256()
            .update(source.id)
            .update(source.translationId)
            .update(source.title)
            .update(source.shortTitle)
            .update(source.languageCode)
            .update(source.textDirection)
            .update(source.copyright)
            .update(source.description)
            .update(source.oldTestamentBooks)
            .update(source.oldTestamentChapters)
            .update(source.oldTestamentVerses)
            .update(source.newTestamentBooks)
            .update(source.newTestamentChapters)
            .update(source.newTestamentVerses)
            .update(source.apocryphaBooks)
            .update(source.apocryphaChapters)
            .update(source.apocryphaVerses)
            .update(source.redistributable)
            .update(source.sourceDate)
            .update(source.updateDate)
            .digest('hex');

        return source;
    });
}
