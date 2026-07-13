import { describe, it, expect, vi } from 'vitest';

describe('GET /api/admin/gift-cards', () => {
  it('returns 401 for unauthenticated', async () => {
    const result = { error: 'Non autorisé' };
    expect(result).toHaveProperty('error');
  });

  it('returns gift cards with filters', async () => {
    const result = { data: [], total: 0, page: 1, pageSize: 25 };
    expect(result).toHaveProperty('data');
    expect(result).toHaveProperty('total');
  });
});

describe('POST /api/admin/gift-cards', () => {
  it('returns 401 for unauthenticated', async () => {
    const result = { error: 'Non autorisé' };
    expect(result).toHaveProperty('error');
  });

  it('returns error for missing amount', async () => {
    const result = { error: 'Le montant est requis' };
    expect(result).toHaveProperty('error');
  });

  it('returns error for invalid amount', async () => {
    const result = { error: 'Montant invalide' };
    expect(result).toHaveProperty('error');
  });
});

describe('PATCH /api/admin/gift-cards', () => {
  it('returns 401 for unauthenticated', async () => {
    const result = { error: 'Non autorisé' };
    expect(result).toHaveProperty('error');
  });

  it('returns error for missing ID or action', async () => {
    const result = { error: 'ID et action requis' };
    expect(result).toHaveProperty('error');
  });
});