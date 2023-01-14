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
const Layout = ({ language, children }: Props) => {
    return <div className={`lang-${language}`}>
        <LanguageProvider locale={language} defaultLocale="en">
            {children}
        </LanguageProvider>
    </div>
};

export default Layout;