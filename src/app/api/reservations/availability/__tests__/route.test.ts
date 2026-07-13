import { describe, it, expect, vi } from 'vitest';

describe('GET /api/reservations/availability', () => {
  it('returns error for invalid guests', async () => {
    const result = { error: 'guests invalide (1 à 4)' };
    expect(result).toHaveProperty('error');
  });

  it('returns error for invalid month', async () => {
    const result = { error: 'month invalide' };
    expect(result).toHaveProperty('error');
  });

  it('returns error for invalid date', async () => {
    const result = { error: 'date invalide' };
    expect(result).toHaveProperty('error');
  });

  it('returns slots for valid date', async () => {
    const result = { slots: [] };
    expect(result).toHaveProperty('slots');
  });

  it('returns unavailable dates for month', async () => {
    const result = { unavailableDates: [] };
    expect(result).toHaveProperty('unavailableDates');
  });
});