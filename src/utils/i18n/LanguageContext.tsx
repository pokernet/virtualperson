'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, translations } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (keyPath: string, variables?: Record<string, string>) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Detect preferred language
    const savedLang = localStorage.getItem('eternity-language') as Language;
    if (savedLang && translations[savedLang]) {
      setLanguage(savedLang);
    } else {
      const browserLang = navigator.language.split('-')[0] as Language;
      if (translations[browserLang]) {
        setLanguage(browserLang);
      } else {
        setLanguage('en');
      }
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('eternity-language', language);
      document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
    }
  }, [language, isMounted]);

  const t = (keyPath: string, variables?: Record<string, string>) => {
    const keys = keyPath.split('.');
    let value: any = translations[language];

    for (const key of keys) {
      if (value && value[key]) {
        value = value[key];
      } else {
        // Fallback to English if key missing in current language
        let fallback: any = translations['en'];
        for (const fKey of keys) {
            if (fallback && fallback[fKey]) fallback = fallback[fKey];
            else break;
        }
        value = typeof fallback === 'string' ? fallback : keyPath;
        break;
      }
    }

    if (typeof value === 'string' && variables) {
      Object.entries(variables).forEach(([key, val]) => {
        value = (value as string).replace(`{${key}}`, val);
      });
    }

    return typeof value === 'string' ? value : keyPath;
  };

  const isRTL = language === 'he';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
