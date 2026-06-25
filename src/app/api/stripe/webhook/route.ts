import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { sendConfirmationEmail, sendGiftCardEmail } from '@/lib/email';

// Désactiver le body parser de Next.js pour lire le corps brut (requis par Stripe)
export const config = { api: { bodyParser: false } };

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    // Log missing webhook secret (for monitoring in production)
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
    // Log error (for monitoring in production)
    return NextResponse.json({ error: 'Webhook signature invalide' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const meta = session.metadata ?? {};

    // Gérer les chèques cadeaux
    if (meta.type === 'gift_card' && meta.giftCardId) {
      await handleGiftCardPayment(meta.giftCardId, session.id);
    }
    // Gérer les réservations (supporte les deux formats)
    else if (
      (meta.name && meta.email && meta.date && meta.guests) ||  // ancien format
      (meta.reservation_name && meta.reservation_email && meta.reservation_date && meta.reservation_guests)  // nouveau format
    ) {
      await handleReservationPayment(session, meta);
    } else {
      // Log metadata issue (for monitoring)
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
      // Log missing gift card (for monitoring)
      return;
    }

    // Mettre à jour le statut du chèque cadeau et effacer l'expiration de la transaction
    await prisma.giftCard.update({
      where: { id: giftCardId },
      data: {
        status: 'ACTIVE',
        stripeSessionId: sessionId,
        transactionExpireAt: null, // La transaction est terminée
      },
    });

    // Envoyer l'email avec le chèque cadeau au destinataire
    try {
      if (giftCard.recipientEmail) {
        await sendGiftCardEmail({
          to: giftCard.recipientEmail,
          code: giftCard.code,
          amount: giftCard.amount,
          personalMessage: giftCard.personalMessage || undefined,
          expiresAt: giftCard.expiresAt ? giftCard.expiresAt.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }) : '',
        });
        // Email sent (for monitoring)
      } else {
        // No email to send for gift card
      }
    } catch (emailError) {
      // Log email error (for monitoring)
    }

    // Gift card activated (for monitoring)
  } catch (error) {
    // Log error (for monitoring)
  }
}

/**
 * Gère le paiement d'une réservation
 */
async function handleReservationPayment(session: any, meta: any) {
  try {
    // Supporte les deux formats de metadata
    const reservationId = meta.reservationId || meta.id;
    const name = meta.reservation_name || meta.name;
    const email = meta.reservation_email || meta.email;
    const phone = meta.reservation_phone || meta.phone || null;
    const date = meta.reservation_date || meta.date;
    const guests = meta.reservation_guests || meta.guests;
    const specialRequest = meta.reservation_special_request || meta.specialRequest || null;

    let reservation;

    // Si on a un reservationId, on met à jour l'existant
    if (reservationId) {
      reservation = await prisma.reservation.update({
        where: { id: reservationId },
        data: {
          status: 'CONFIRMED',
          stripeSessionId: session.id,
          transactionExpireAt: null, // La transaction est terminée
        },
      });
    } else {
      // Ancien format: créer la réservation
      reservation = await prisma.reservation.create({
        data: {
          name,
          email,
          phone,
          date: new Date(date),
          guests: parseInt(guests, 10),
          specialRequest,
          wantsSmsReminder: false,
          status: 'CONFIRMED',
          stripeSessionId: session.id,
        },
      });
    }

    // Envoyer l'email de confirmation
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
    const resDate = new Date(reservation.date);
    try {
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
      console.log(`[WEBHOOK] Email de confirmation envoyé à ${reservation.email}`);
    } catch (emailError) {
      console.error(`[WEBHOOK] Erreur lors de l'envoi de l'email à ${reservation.email}:`, emailError);
    }

    // Reservation confirmed (for monitoring)
  } catch (error) {
    console.error('[WEBHOOK] Erreur dans handleReservationPayment:', error);
  }
}
