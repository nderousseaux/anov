// Types for translations

export type Locale = 'fr' | 'en' | 'de';

// Type definitions for translations
export interface NavTranslations {
  ourStory: string;
  gallery: string;
  theMenu: string;
  boutique: string;
  products: string;
  giftCards: string;
  reserve: string;
}

export interface FooterTranslations {
  followUs: string;
  ourReviews: string;
  reviews: string;
  pmr: string;
  aircon: string;
  legal: string;
  privacy: string;
  cgv: string;
  copyright: string;
}

export interface GalleryTranslations {
  title: string;
  subtitle: string;
}

export interface BoutiqueTranslations {
  title: string;
  subtitle: string;
  productsIntroTitle: string;
  productsIntroText: string;
  giftCardsIntroTitle: string;
  giftCardsIntroText: string;
  searchPlaceholder: string;
  all: string;
  deliverable: string;
  pickup: string;
  noProducts: string;
  productsCount: string;
  productsPlural: string;
  shown: string;
  shownPlural: string;
  product: {
    addToCart: string;
    deliveryPickup: string;
    deliveryDelivery: string;
    quantity: string;
    maxQuantity: string;
    submitOrder: string;
    cancel: string;
    name: string;
    placeholderName: string;
    email: string;
    placeholderEmail: string;
    phone: string;
    placeholderPhone: string;
    address: string;
    city: string;
    zipCode: string;
    successTitle: string;
    successDesc: string;
    errors: {
      name: string;
      email: string;
      phone: string;
      address: string;
      city: string;
      zipCode: string;
      quantity: string;
      delivery: string;
      network: string;
    };
    footer?: {
      secure: string;
      valid: string;
    };
  };
}

export interface ContactTranslations {
  name: string;
  email: string;
  subject: string;
  message: string;
  namePlaceholder: string;
  emailPlaceholder: string;
  subjectPlaceholder: string;
  messagePlaceholder: string;
  send: string;
  sending: string;
  successTitle: string;
  successDesc: string;
  errorTitle: string;
  errorDesc: string;
  connectionError: string;
  addressLabel: string;
  phoneLabel: string;
  mailLabel: string;
  hoursLabel: string;
  maps: string;
}

export interface ReservationTranslations {
  title: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  specialRequest: string;
  specialRequestPlaceholder: string;
  submit: string;
  submitting: string;
  selectDate: string;
  selectTime: string;
  selectGuests: string;
  loading: string;
  noSlots: string;
  available: string;
  pleaseSelectDate: string;
  submitSubmitting: string;
  placeholderPhone: string;
  placeholderEmail: string;
  placeholderName: string;
  lunch: string;
  dinner: string;
  errorSelectDate: string;
  errorSelectTime: string;
  errorReservation: string;
  errorNetwork: string;
}

export interface HeroTranslations {
  reserve: string;
}

export interface MenuTranslations {
  allergens: string;
}

export interface OriginsTranslations {
  clickToLearnMore: string;
}

export interface LegalTranslations {
  frenchOnly: string;
}

export interface Translations {
  nav: NavTranslations;
  footer: FooterTranslations;
  gallery: GalleryTranslations;
  boutique: BoutiqueTranslations;
  contact: ContactTranslations;
  reservation: ReservationTranslations;
  hero: HeroTranslations;
  menu: MenuTranslations;
  origins: OriginsTranslations;
  legal: LegalTranslations;
}

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
export function pickField<T extends Record<string, unknown>>(obj: T, key: string, locale: Locale): string {
  return (obj[`${key}_${locale}`] as string | undefined) ??
         (obj[`${key}_fr`] as string | undefined) ??
         (obj[key] as string | undefined) ??
         '';
}
