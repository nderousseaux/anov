import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-04-30.basil',
});

/** Acompte fixe : 20 € par convive pour les groupes ≥ 8 personnes */
export function computeDeposit(guests: number): number {
  if (guests < 8) return 0;
  return guests * 2000; // centimes : 20 €/personne
}
