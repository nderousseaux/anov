import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-04-22.preview',
});

/** Montant de l'acompte par couvert, en centimes (ex: 2000 = 20€) */
export const DEPOSIT_PER_GUEST_CENTS = 2000;
