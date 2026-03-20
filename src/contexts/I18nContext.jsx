import { createContext, useState, useContext, useEffect } from 'react';
import zhTW from '../locales/zh-TW.json';
import enUS from '../locales/en-US.json';

const translations = {
  'zh-TW': zhTW,
  'en-US': enUS,
};

const I18nContext = createContext();

export const useTranslation = () => {
    return useContext(I18nContext);
};

export const I18nProvider = ({ children }) => {
    const [locale, setLocale] = useState('zh-TW'); // default

    const t = (key) => {
        const keys = key.split('.');
        let val = translations[locale];
        for (let k of keys) {
            if (!val) break;
            val = val[k];
        }
        return val || key; // fallback to key
    };

    const value = { t, locale, setLocale };

    return (
        <I18nContext.Provider value={value}>
            {children}
        </I18nContext.Provider>
    );
};
