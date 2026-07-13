import { describe, it, expect, vi } from 'vitest';
import {
  getLocaleFromString,
  detectBrowserLocale,
  pickField,
  LOCALE_LABELS,
  LOCALE_NAMES,
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
} from '../langs';

describe('langs', () => {
  describe('getLocaleFromString', () => {
    it('returns fr for "fr"', () => {
      expect(getLocaleFromString('fr')).toBe('fr');
    });

    it('returns en for "en"', () => {
      expect(getLocaleFromString('en')).toBe('en');
    });

    it('returns de for "de"', () => {
      expect(getLocaleFromString('de')).toBe('de');
    });

    it('returns null for invalid locale', () => {
      expect(getLocaleFromString('es')).toBeNull();
      expect(getLocaleFromString('it')).toBeNull();
      expect(getLocaleFromString('zh')).toBeNull();
    });

    it('returns null for null', () => {
      expect(getLocaleFromString(null)).toBeNull();
    });

    it('returns null for undefined', () => {
      expect(getLocaleFromString(undefined)).toBeNull();
    });

    it('returns null for empty string', () => {
      expect(getLocaleFromString('')).toBeNull();
    });

    it('is case-sensitive', () => {
      expect(getLocaleFromString('FR')).toBeNull();
      expect(getLocaleFromString('EN')).toBeNull();
    });
  });

  describe('detectBrowserLocale', () => {
    const originalNavigator = global.navigator;

    beforeEach(() => {
      // Setup navigator mock
      delete (global as any).navigator;
    });

    it('returns fr as default when navigator is not available', () => {
      const result = detectBrowserLocale();
      expect(result).toBe('fr');
    });

    it('returns en for English browser language', () => {
      (global as any).navigator = {
        language: 'en-US',
      };
      const result = detectBrowserLocale();
      expect(result).toBe('en');
    });

    it('returns en for British English', () => {
      (global as any).navigator = {
        language: 'en-GB',
      };
      const result = detectBrowserLocale();
      expect(result).toBe('en');
    });

    it('returns de for German browser language', () => {
      (global as any).navigator = {
        language: 'de-DE',
      };
      const result = detectBrowserLocale();
      expect(result).toBe('de');
    });

    it('returns fr for French browser language', () => {
      (global as any).navigator = {
        language: 'fr-FR',
      };
      const result = detectBrowserLocale();
      expect(result).toBe('fr');
    });

    it('returns fr for unknown language', () => {
      (global as any).navigator = {
        language: 'es-ES',
      };
      const result = detectBrowserLocale();
      expect(result).toBe('fr');
    });

    it('handles lowercase language codes', () => {
      (global as any).navigator = {
        language: 'en',
      };
      const result = detectBrowserLocale();
      expect(result).toBe('en');
    });
  });

  describe('pickField', () => {
    it('returns localized field value', () => {
      const obj = {
        title_fr: 'TitreFrancais',
        title_en: 'TitleEnglish',
        title_de: 'TitelDeutsch',
      };

      expect(pickField(obj, 'title', 'fr')).toBe('TitreFrancais');
      expect(pickField(obj, 'title', 'en')).toBe('TitleEnglish');
      expect(pickField(obj, 'title', 'de')).toBe('TitelDeutsch');
    });

    it('falls back to _fr when locale field missing', () => {
      const obj = {
        title_fr: 'TitreFrancais',
      };

      expect(pickField(obj, 'title', 'en')).toBe('TitreFrancais');
      expect(pickField(obj, 'title', 'de')).toBe('TitreFrancais');
    });

    it('falls back to bare key when no localized fields', () => {
      const obj = {
        title: 'TitreGeneral',
      };

      expect(pickField(obj, 'title', 'fr')).toBe('TitreGeneral');
      expect(pickField(obj, 'title', 'en')).toBe('TitreGeneral');
    });

    it('returns empty string when nothing found', () => {
      const obj = {};

      expect(pickField(obj, 'title', 'fr')).toBe('');
      expect(pickField(obj, 'name', 'en')).toBe('');
    });

    it('handles null/undefined values', () => {
      const obj = {
        title_fr: null,
        title_en: undefined,
      };

      expect(pickField(obj, 'title', 'fr')).toBe('');
      expect(pickField(obj, 'title', 'en')).toBe('');
    });
  });

  describe('SUPPORTED_LOCALES', () => {
    it('contains all supported locales', () => {
      expect(SUPPORTED_LOCALES).toEqual(['fr', 'en', 'de']);
    });

    it('includes default locale', () => {
      expect(SUPPORTED_LOCALES).toContain(DEFAULT_LOCALE);
    });
  });

  describe('LOCALE_LABELS', () => {
    it('has correct labels', () => {
      expect(LOCALE_LABELS.fr).toBe('FR');
      expect(LOCALE_LABELS.en).toBe('EN');
      expect(LOCALE_LABELS.de).toBe('DE');
    });
  });

  describe('LOCALE_NAMES', () => {
    it('has correct names', () => {
      expect(LOCALE_NAMES.fr).toBe('Français');
      expect(LOCALE_NAMES.en).toBe('English');
      expect(LOCALE_NAMES.de).toBe('Deutsch');
    });
  });
});