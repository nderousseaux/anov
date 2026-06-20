import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, formatDateShort, formatTime, isToday, getPreviousMonday, formatReservationDate, validateEmail, validatePhone, isNonEmpty, isPositiveNumber, isInRange } from '@/lib/utils';

describe('formatCurrency', () => {
  it('formats a number as euros', () => {
    const result = formatCurrency(25);
    expect(result).toContain('25');
    expect(result).toContain('€');
  });

  it('formats with different locale', () => {
    // Locale en-US formats as dollars, but the currency is EUR so it uses the currency code
    const result = formatCurrency(25.5, 'en-US');
    // The en-US locale formats with 1 decimal place
    expect(result).toBe('€25.5');
  });

  it('formats decimal amounts', () => {
    const result = formatCurrency(25.5);
    expect(result).toMatch(/^25,5[0]?\s€$/);
  });

  it('formats large amounts', () => {
    const result = formatCurrency(1000);
    // The result uses non-breaking space as thousands separator
    // Just check it contains the expected content
    expect(result).toMatch(/1\s?000\s€/);
    expect(result).toContain('€');
  });
});

describe('formatDate', () => {
  it('formats a date with default options', () => {
    const date = new Date('2024-06-15T00:00:00.000Z');
    const result = formatDate(date);
    expect(result).toBe('samedi 15 juin 2024');
  });

  it('formats with custom options', () => {
    const date = new Date('2024-06-15T00:00:00.000Z');
    expect(formatDate(date, { year: 'numeric', month: 'short', day: 'numeric' })).toBe('15 juin 2024');
  });

  it('handles ISO string input', () => {
    expect(formatDate('2024-06-15T00:00:00.000Z')).toBe('samedi 15 juin 2024');
  });
});

describe('formatDateShort', () => {
  it('formats date in short form', () => {
    const date = new Date('2024-06-15T00:00:00.000Z');
    expect(formatDateShort(date)).toBe('15 juin 2024');
  });
});

describe('formatTime', () => {
  it('formats time string', () => {
    expect(formatTime('14:30')).toBe('14:30');
    expect(formatTime('09:00')).toBe('09:00');
  });

  it('handles invalid time gracefully', () => {
    expect(formatTime('invalid')).toBe('invalid');
  });
});

describe('isToday', () => {
  it('returns true for today', () => {
    const today = new Date();
    expect(isToday(today)).toBe(true);
  });

  it('returns false for yesterday', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(isToday(yesterday)).toBe(false);
  });

  it('returns false for tomorrow', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    expect(isToday(tomorrow)).toBe(false);
  });

  it('handles ISO string input', () => {
    const todayStr = new Date().toISOString().split('T')[0];
    expect(isToday(todayStr)).toBe(true);
  });
});

describe('getPreviousMonday', () => {
  it('returns the previous Monday for a Sunday', () => {
    // June 16, 2024 is a Sunday
    const sunday = new Date('2024-06-16T00:00:00.000Z');
    const monday = getPreviousMonday(sunday);
    expect(monday.toISOString().split('T')[0]).toBe('2024-06-10'); // June 10, 2024 is a Monday
  });

  it('returns the previous Monday for a Wednesday', () => {
    // June 19, 2024 is a Wednesday
    const wednesday = new Date('2024-06-19T00:00:00.000Z');
    const monday = getPreviousMonday(wednesday);
    expect(monday.toISOString().split('T')[0]).toBe('2024-06-17'); // June 17, 2024 is a Monday
  });

  it('returns the previous Monday (not same day)', () => {
    // June 17, 2024 is a Monday, so the previous Monday is June 10
    const monday = new Date('2024-06-17T00:00:00.000Z');
    const result = getPreviousMonday(monday);
    expect(result.toISOString().split('T')[0]).toBe('2024-06-10');
  });

  it('handles ISO string input', () => {
    const dateStr = '2024-06-16'; // Sunday
    const monday = getPreviousMonday(dateStr);
    expect(monday.toISOString().split('T')[0]).toBe('2024-06-10');
  });
});

describe('formatReservationDate', () => {
  it('formats date for reservation display', () => {
    const date = new Date('2024-06-15T00:00:00.000Z');
    expect(formatReservationDate(date)).toBe('samedi 15 juin');
  });
});

describe('validateEmail', () => {
  it('validates correct email', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name@domain.fr')).toBe(true);
  });

  it('rejects invalid emails', () => {
    expect(validateEmail('invalid')).toBe(false);
    expect(validateEmail('test@')).toBe(false);
    expect(validateEmail('@example.com')).toBe(false);
  });
});

describe('validatePhone', () => {
  it('validates French phone numbers', () => {
    expect(validatePhone('0123456789')).toBe(true);
    expect(validatePhone('06 12 34 56 78')).toBe(true);
    expect(validatePhone('07-12-34-56-78')).toBe(true);
  });

  it('rejects invalid phone numbers', () => {
    expect(validatePhone('123456789')).toBe(false);
    expect(validatePhone('012345678')).toBe(false);
    expect(validatePhone('01234567890')).toBe(false);
  });
});

describe('isNonEmpty', () => {
  it('validates non-empty strings', () => {
    expect(isNonEmpty('hello')).toBe(true);
    expect(isNonEmpty('  hello  ')).toBe(true);
  });

  it('rejects empty strings', () => {
    expect(isNonEmpty('')).toBe(false);
    expect(isNonEmpty('   ')).toBe(false);
  });
});

describe('isPositiveNumber', () => {
  it('validates positive numbers', () => {
    expect(isPositiveNumber(1)).toBe(true);
    expect(isPositiveNumber(100)).toBe(true);
  });

  it('rejects negative numbers', () => {
    expect(isPositiveNumber(0)).toBe(false);
    expect(isPositiveNumber(-1)).toBe(false);
  });
});

describe('isInRange', () => {
  it('validates numbers in range', () => {
    expect(isInRange(5, 1, 10)).toBe(true);
    expect(isInRange(1, 1, 10)).toBe(true);
    expect(isInRange(10, 1, 10)).toBe(true);
  });

  it('rejects numbers out of range', () => {
    expect(isInRange(0, 1, 10)).toBe(false);
    expect(isInRange(11, 1, 10)).toBe(false);
  });
});
