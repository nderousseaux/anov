import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { sendConfirmationEmail, sendGiftCardEmail } from '@/lib/email';

// Désactiver le body parser de Next.js pour lire le corps brut (requis par Stripe)
export const config = { api: { bodyParser: false } };

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('[stripe/webhook] STRIPE_WEBHOOK_SECRET manquant');
    return NextResponse.json({ error: 'Configuration serveur incorrecte' }, { status: 500 });
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Signature manquante' }, { status: 400 });
  }

  let event;
  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error('[stripe/webhook] Signature invalide :', err);
    return NextResponse.json({ error: 'Webhook signature invalide' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const meta = session.metadata ?? {};

    // Gérer les chèques cadeaux
    if (meta.type === 'gift_card' && meta.giftCardId) {
      await handleGiftCardPayment(meta.giftCardId, session.id);
    }
    // Gérer les réservations
    else if (meta.name && meta.email && meta.date && meta.guests) {
      await handleReservationPayment(session, meta);
    } else {
      console.error('[stripe/webhook] Metadata incomplètes', meta);
      return NextResponse.json({ error: 'Metadata manquantes' }, { status: 400 });
    }
  }

  return NextResponse.json({ received: true });
}

/**
 * Gère le paiement d'un chèque cadeau
 */
async function handleGiftCardPayment(giftCardId: string, sessionId: string) {
  try {
    // Récupérer le chèque cadeau
    const giftCard = await prisma.giftCard.findUnique({
      where: { id: giftCardId },
    });

    if (!giftCard) {
      console.error('[stripe/webhook] Chèque cadeau introuvable:', giftCardId);
      return;
    }

    // Mettre à jour le statut du chèque cadeau
    await prisma.giftCard.update({
      where: { id: giftCardId },
      data: {
        status: 'ACTIVE',
        stripeSessionId: sessionId,
      },
    });

    // Envoyer l'email avec le chèque cadeau au destinataire
    try {
      await sendGiftCardEmail({
        to: giftCard.recipientEmail,
        code: giftCard.code,
        amount: giftCard.amount,
        personalMessage: giftCard.personalMessage || undefined,
        expiresAt: giftCard.expiresAt.toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
      });
      console.log('[stripe/webhook] Email envoyé avec succès:', giftCard.recipientEmail);
    } catch (emailError) {
      console.error('[stripe/webhook] Erreur lors de l\'envoi de l\'email:', emailError);
    }

    console.log('[stripe/webhook] Chèque cadeau activé:', giftCard.code);
  } catch (error) {
    console.error('[stripe/webhook] Erreur lors du traitement du chèque cadeau:', error);
  }
}

/**
 * Gère le paiement d'une réservation
 */
async function handleReservationPayment(session: any, meta: any) {
  try {
    // Créer la réservation en base maintenant que le paiement est confirmé
    const reservation = await prisma.reservation.create({
      data: {
        name: meta.name,
        email: meta.email,
        phone: meta.phone || null,
        date: new Date(meta.date),
        guests: parseInt(meta.guests, 10),
        specialRequest: meta.specialRequest || null,
        wantsSmsReminder: false,
        status: 'CONFIRMED',
        stripeSessionId: session.id,
      },
    });

    // Envoyer l'email de confirmation
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
    const resDate = new Date(reservation.date);
    await sendConfirmationEmail({
      to: reservation.email,
      name: reservation.name,
      date: resDate.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      }),
      time: `${String(resDate.getUTCHours()).padStart(2, '0')}:${String(resDate.getUTCMinutes()).padStart(2, '0')}`,
      guests: reservation.guests,
      cancelUrl: `${baseUrl}/reservation/cancel?token=${reservation.cancelToken}`,
    });

    console.log('[stripe/webhook] Réservation confirmée:', reservation.id);
  } catch (error) {
    console.error('[stripe/webhook] Erreur lors du traitement de la réservation:', error);
  }
}
