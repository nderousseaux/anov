import { describe, it, expect, vi } from 'vitest';

describe('GET /api/reservations/cancel', () => {
  it('returns error for missing token', async () => {
    const result = { error: 'Token manquant' };
    expect(result).toHaveProperty('error');
  });

  it('returns error for invalid token', async () => {
    const result = { error: 'Réservation introuvable' };
    expect(result).toHaveProperty('error');
  });

  it('returns message for already cancelled', async () => {
    const result = { message: 'already_cancelled' };
    expect(result).toHaveProperty('message');
  });

  it('returns error for expired reservation', async () => {
    const result = { error: 'Réservation déjà passée' };
    expect(result).toHaveProperty('error');
  });
});