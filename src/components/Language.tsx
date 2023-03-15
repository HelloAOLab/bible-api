import * as React from 'react';

const LanguageContext = React.createContext('en');

export interface ProviderProps {
    locale: string;
    children?: React.ReactNode
}
export const LanguageProvider = ({ locale, children }: ProviderProps) => {
    // @ts-ignore
    return <LanguageContext.Provider value={locale}>
        {children}
    </LanguageContext.Provider>
}

export interface FormatNumberProps {
    value: number;
}
export const FormatNumber = (props: FormatNumberProps) => {
    // @ts-ignore
    return <LanguageContext.Consumer>
        {(locale: string) => {
            let n = new Intl.NumberFormat(locale);
            return n.format(props.value);
        }}
    </LanguageContext.Consumer>
}