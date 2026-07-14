'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import {
  type Locale,
  DEFAULT_LOCALE,
  detectBrowserLocale,
  getLocaleFromString,
  type Translations,
} from '@/lib/langs';
import fr from '@/lib/translations/fr';
import en from '@/lib/translations/en';
import de from '@/lib/translations/de';

const translations: Record<Locale, Translations> = { fr, en, de } as const;

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => { },
  t: fr,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    const urlParam = new URLSearchParams(window.location.search).get('lang');
    const stored = localStorage.getItem('anov_locale');
    const resolved =
      getLocaleFromString(urlParam) ??
      getLocaleFromString(stored) ??
      detectBrowserLocale();
    setLocaleState(resolved);
    // Persist choice
    localStorage.setItem('anov_locale', resolved);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('anov_locale', newLocale);
    const url = new URL(window.location.href);
    if (newLocale === DEFAULT_LOCALE) {
      url.searchParams.delete('lang');
    } else {
      url.searchParams.set('lang', newLocale);
    }
    window.history.replaceState({}, '', url.toString());
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t: translations[locale] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
