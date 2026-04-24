import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { stripe, computeDeposit } from '@/lib/stripe';
import { assignTables } from '@/lib/availability';
import { sendConfirmationEmail } from '@/lib/email';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, date, time, guests, specialRequest, wantsSmsReminder } = body;

    // Validation minimale
    if (!name || !email || !phone || !date || !time || !guests) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 });
    }
    const guestsNum = parseInt(guests, 10);
    if (isNaN(guestsNum) || guestsNum < 1 || guestsNum > 30) {
      return NextResponse.json({ error: 'Nombre de couverts invalide' }, { status: 400 });
    }
    if (!/^[\w.+\-]+@[\w\-]+\.[a-z]{2,}$/i.test(email)) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 });
    }

    // Construire la date complète
    const [hours, minutes] = time.split(':').map(Number);
    const reservationDate = new Date(date);
    reservationDate.setHours(hours, minutes, 0, 0);
    if (reservationDate <= new Date()) {
      return NextResponse.json({ error: 'Date invalide' }, { status: 400 });
    }

    const depositCents = computeDeposit(guestsNum);
    const needsDeposit = depositCents > 0;

    // Créer la réservation en base (PENDING_PAYMENT)
    const reservation = await prisma.reservation.create({
      data: {
        name: name.trim().slice(0, 100),
        email: email.trim().toLowerCase().slice(0, 200),
        phone: phone.trim().slice(0, 30),
        date: reservationDate,
        guests: guestsNum,
        specialRequest: specialRequest?.trim().slice(0, 500) || null,
        wantsSmsReminder: Boolean(wantsSmsReminder),
        status: needsDeposit ? 'PENDING_PAYMENT' : 'CONFIRMED',
        depositAmount: depositCents || null,
      },
    });

    // Assigner les tables
    await assignTables(guestsNum, reservation.id, reservationDate);

    if (!needsDeposit) {
      // Confirmation immédiate sans paiement
      const cancelUrl = `${BASE_URL}/reservation/cancel?token=${reservation.cancelToken}`;
      const formattedDate = reservationDate.toLocaleDateString('fr-FR', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      });
      await sendConfirmationEmail({
        to: email,
        name,
        date: formattedDate,
        time,
        guests: guestsNum,
        cancelUrl,
      });
      return NextResponse.json({ status: 'confirmed', reservationId: reservation.id });
    }

    // Créer la session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Acompte réservation ANØV — ${guestsNum} pers.`,
              description: `${reservationDate.toLocaleDateString('fr-FR')} à ${time}`,
            },
            unit_amount: depositCents,
          },
          quantity: 1,
        },
      ],
      metadata: { reservationId: reservation.id },
      success_url: `${BASE_URL}/reservation/succes?id=${reservation.id}`,
      cancel_url: `${BASE_URL}/reservation?cancelled=1`,
      customer_email: email,
      expires_at: Math.floor(Date.now() / 1000) + 1800, // 30 min
    });

    // Sauvegarder le paymentIntent
    await prisma.reservation.update({
      where: { id: reservation.id },
      data: { stripePaymentIntentId: session.payment_intent as string },
    });

    return NextResponse.json({ status: 'payment_required', checkoutUrl: session.url });
  } catch (err) {
    console.error('[POST /api/reservations]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
