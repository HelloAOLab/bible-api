import * as React from 'react';
import { Link } from 'gatsby';
import { LanguageProvider } from './Language';
// import { IntlProvider, FormattedNumber } from 'react-intl';
import '../sakura.css';
import '../extra.css';

type Props = {
    language: string;
    children?: React.ReactNode
};

function getLanguageDirection(locale: string) {
    let direction: string | null = null;
    if (locale && Intl && Intl.Locale) {
        const l: any = new Intl.Locale(locale);
        const info = l.textInfo;

        if (typeof info === 'object') {
            direction = info.direction;
        }
    }

    return direction;
}

const Layout = ({ language, children }: Props) => {
    const dir = getLanguageDirection(language);
    return <div className={`lang-${language}${dir ? ` dir-${dir}` : ''}`}>
        <LanguageProvider locale={language} defaultLocale="en">
            {children}
        </LanguageProvider>
    </div>
};

export default Layout;