import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { strings } from '../utils/translations';

export type Language = 'en-US' | 'fr-FR';

interface LanguageContextType {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: string, replacements?: { [key: string]: string | number | undefined }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'repIQLanguage';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>(() => {
        try {
            const savedLang = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
            return (savedLang === 'en-US' || savedLang === 'fr-FR') ? savedLang : 'en-US';
        } catch {
            return 'en-US';
        }
    });

    const setLanguage = (lang: Language) => {
        try {
            window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
        } catch (error) {
            console.error("Could not save language to local storage", error);
        }
        setLanguageState(lang);
    };

    const t = useCallback((key: string, replacements?: { [key: string]: string | number | undefined }) => {
        const langStrings = strings[language] || strings['en-US'];
        
        let text = key.split('.').reduce((obj: any, k: string) => {
             return obj && typeof obj === 'object' ? obj[k] : undefined;
        }, langStrings);
        
        if (typeof text !== 'string') {
             console.warn(`Translation key not found: ${key}`);
             return key;
        }

        if (replacements) {
            Object.keys(replacements).forEach(rKey => {
                const value = replacements[rKey];
                if (value !== undefined) {
                  text = text.replace(new RegExp(`\\{${rKey}\\}`, 'g'), String(value));
                }
            });
        }
        return text;
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useTranslation = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useTranslation must be used within a LanguageProvider');
    }
    return context;
};
