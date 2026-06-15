export type Locale = 'fr' | 'en' | 'de';

export const SUPPORTED_LOCALES: Locale[] = ['fr', 'en', 'de'];
export const DEFAULT_LOCALE: Locale = 'fr';

export const LOCALE_LABELS: Record<Locale, string> = {
  fr: 'FR',
  en: 'EN',
  de: 'DE',
};

export const LOCALE_NAMES: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
  de: 'Deutsch',
};

export function getLocaleFromString(value: string | null | undefined): Locale | null {
  if (value === 'fr' || value === 'en' || value === 'de') return value;
  return null;
}

export function detectBrowserLocale(): Locale {
  if (typeof navigator === 'undefined') return DEFAULT_LOCALE;
  const lang = navigator.language.toLowerCase();
  if (lang.startsWith('en')) return 'en';
  if (lang.startsWith('de')) return 'de';
  return 'fr';
}

/** Pick the localized variant of a field from a content object.
 *  Falls back to _fr, then bare key, then empty string. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function pickField(obj: Record<string, any>, key: string, locale: Locale): string {
  return (obj[`${key}_${locale}`] ?? obj[`${key}_fr`] ?? obj[key] ?? '') as string;
}
