import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { sendConfirmationEmail } from '@/lib/email';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

export async function POST(req: NextRequest) {
  const signature = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: 'Signature manquante' }, { status: 400 });
  }

  let event;
  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('[Webhook] Signature invalide', err);
    return NextResponse.json({ error: 'Signature invalide' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const reservationId = session.metadata?.reservationId;

    if (!reservationId) {
      return NextResponse.json({ error: 'metadata manquant' }, { status: 400 });
    }

    const reservation = await prisma.reservation.update({
      where: { id: reservationId },
      data: {
        status: 'CONFIRMED',
        depositPaid: true,
        stripePaymentIntentId: session.payment_intent as string,
      },
    });

    const cancelUrl = `${BASE_URL}/reservation/cancel?token=${reservation.cancelToken}`;
    const formattedDate = reservation.date.toLocaleDateString('fr-FR', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });
    const time = reservation.date.toLocaleTimeString('fr-FR', {
      hour: '2-digit', minute: '2-digit',
    });

    await sendConfirmationEmail({
      to: reservation.email,
      name: reservation.name,
      date: formattedDate,
      time,
      guests: reservation.guests,
      cancelUrl,
    });
  }

  return NextResponse.json({ received: true });
}
