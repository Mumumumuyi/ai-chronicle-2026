import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage, TranslationDictionary, SUPPORTED_LANGUAGES, LanguageOption } from './types';
import { TRANSLATIONS } from './translations';
import { resolveLocation } from '../utils/routes';

interface LanguageContextValue {
  currentLang: SupportedLanguage;
  setLang: (lang: SupportedLanguage) => void;
  t: TranslationDictionary;
  languages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLang, setCurrentLangState] = useState<SupportedLanguage>(() => {
    // 0. A milestone URL (/milestone/… or /en/milestone/…) fixes the language, so
    //    crawlers and shared links always see the version the URL promises.
    const urlLang = resolveLocation().urlLang;
    if (urlLang) return urlLang;

    // 1. Try to read from localStorage
    const saved = localStorage.getItem('ai_chronicle_lang') as SupportedLanguage | null;
    if (saved && TRANSLATIONS[saved]) return saved;

    // 2. Try to auto-detect browser language
    if (typeof navigator !== 'undefined') {
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('zh')) return 'zh';
      if (browserLang.startsWith('es')) return 'es';
      if (browserLang.startsWith('de')) return 'de';
      if (browserLang.startsWith('fr')) return 'fr';
    }

    // 3. Default to English for global audience
    return 'en';
  });

  const setLang = (lang: SupportedLanguage) => {
    setCurrentLangState(lang);
    localStorage.setItem('ai_chronicle_lang', lang);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = currentLang;
    }
  }, [currentLang]);

  const value: LanguageContextValue = {
    currentLang,
    setLang,
    t: TRANSLATIONS[currentLang] || TRANSLATIONS.en,
    languages: SUPPORTED_LANGUAGES,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextValue => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
