import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { stripe, DEPOSIT_PER_GUEST_CENTS } from '@/lib/stripe';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, date, time, guests, specialRequest } = body;

    // Validation minimale
    if (!name || !email || !date || !time || !guests) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 });
    }
    const guestsNum = parseInt(guests, 10);
    if (isNaN(guestsNum) || guestsNum < 1 || guestsNum > 30) {
      return NextResponse.json({ error: 'Nombre de couverts invalide' }, { status: 400 });
    }
    if (!/^[\w.+\-]+@[\w\-]+\.[a-z]{2,}$/i.test(email)) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 });
    }
    if (phone && !/^\+?[\d\s\-().]{6,20}$/.test(phone.trim())) {
      return NextResponse.json({ error: 'Numéro de téléphone invalide' }, { status: 400 });
    }

    // Construire la date complète (UTC pour cohérence avec getUTCHours() dans availability.ts)
    const reservationDate = new Date(`${date}T${time}:00.000Z`);
    if (reservationDate <= new Date()) {
      return NextResponse.json({ error: 'Date invalide' }, { status: 400 });
    }

    // Calcul du dépôt: montant par couvert * nombre de couverts
    const depositAmount = DEPOSIT_PER_GUEST_CENTS * guestsNum;

    // Calculer l'expiration de la transaction (10 minutes pour le paiement)
    const transactionExpireAt = new Date();
    transactionExpireAt.setMinutes(transactionExpireAt.getMinutes() + 10);

    // Créer d'abord la réservation en base pour obtenir le cancelToken
    // (le token est généré automatiquement par Prisma grâce au default(cuid()))
    const reservation = await prisma.reservation.create({
      data: {
        name: name,
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || '',
        date: reservationDate,
        guests: guestsNum,
        specialRequest: specialRequest?.trim() || '',
        status: 'PENDING_PAYMENT',
        depositPaidCents: depositAmount,
        transactionExpireAt,
      },
    });

    // Calculer l'expiration de la session (10 minutes pour le paiement)
    const sessionExpireAt = new Date();
    sessionExpireAt.setMinutes(sessionExpireAt.getMinutes() + 10);

    // Créer la session Stripe avec image de nourriture
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Réservation au nom de ${name}`,
              description: `${date} à ${time} - ${guestsNum} couvert(s)`,
              images: ['https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?w=400&q=80'],
            },
            unit_amount: depositAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${BASE_URL}/reservation/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/reservation/cancel?token=${reservation.cancelToken}`,
      customer_email: email.trim().toLowerCase(),
      metadata: {
        name,
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || '',
        date: reservationDate.toISOString(),
        guests: guestsNum.toString(),
        specialRequest: specialRequest?.trim() || '',
        reservationId: reservation.id,
      },
    });

    // Mettre à jour la réservation avec l'ID de la session Stripe
    await prisma.reservation.update({
      where: { id: reservation.id },
      data: {
        stripeSessionId: stripeSession.id,
      },
    });

    return NextResponse.json({
      url: stripeSession.url,
      sessionId: stripeSession.id,
    });
  } catch (err) {
    console.error('[POST /api/reservations]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
