// SYSTEME DE PAIEMENT COMMENTE POUR L'INSTANT
// Le CMS est fonctionnel coté admin, le système de paiement sera activé ultérieurement

// import Stripe from 'stripe';
//
// if (!process.env.STRIPE_SECRET_KEY) {
//   throw new Error('STRIPE_SECRET_KEY is not set');
// }
//
// export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
//   apiVersion: '2025-04-30.basil',
// });
//
// /** Montant de l'acompte par couvert, en centimes (ex: 2000 = 20€) */
// export const DEPOSIT_PER_GUEST_CENTS = 2000;

export const stripe = null as any;
export const DEPOSIT_PER_GUEST_CENTS = 2000;
