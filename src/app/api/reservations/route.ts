import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

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

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

    // Lire le montant de l'acompte depuis les paramètres du restaurant
    const restaurantSettings = await prisma.restaurantSettings.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1 },
    });
    const depositPerGuestCents = restaurantSettings.depositPerGuestCents;

    // Créer la session Stripe Checkout (mode intégré) — aucun enregistrement en base avant paiement
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      mode: 'payment',
      customer_email: email.trim().toLowerCase(),
      line_items: [
        {
          quantity: guestsNum,
          price_data: {
            currency: 'eur',
            unit_amount: depositPerGuestCents,
            product_data: {
              name: 'Acompte réservation — ANØV',
              description: `Table du ${new Date(reservationDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })} à ${time} · ${guestsNum} couvert${guestsNum > 1 ? 's' : ''}`,
            },
          },
        },
      ],
      // Toutes les données sont stockées dans les metadata — la réservation sera créée en base par le webhook
      metadata: {
        name: name.trim().slice(0, 100),
        email: email.trim().toLowerCase().slice(0, 200),
        phone: phone ? phone.trim().slice(0, 30) : '',
        date: reservationDate.toISOString(),
        guests: String(guestsNum),
        specialRequest: specialRequest?.trim().slice(0, 490) || '',
      },
      return_url: `${baseUrl}/reservation/succes?session_id={CHECKOUT_SESSION_ID}`,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    });

    return NextResponse.json({ clientSecret: session.client_secret, sessionId: session.id });
  } catch (err) {
    console.error('[POST /api/reservations]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
