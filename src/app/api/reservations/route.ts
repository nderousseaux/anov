import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe, DEPOSIT_PER_GUEST_CENTS } from "@/lib/stripe";
import { HOLD_MINUTES, lockAndCheckAvailability } from "@/lib/seating/db";
import { MAX_GROUP_SIZE, serviceOf } from "@/lib/seating";
import { buildUrlWithEncodedData } from "@/lib/checkout-params";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, date, time, guests, specialRequest } = body;

    // Validation minimale
    if (!name || !email || !date || !time) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }
    if (guests === undefined || guests === null) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }
    const guestsNum = parseInt(guests, 10);
    if (isNaN(guestsNum) || guestsNum < 1 || guestsNum > MAX_GROUP_SIZE) {
      return NextResponse.json(
        { error: "Nombre de couverts invalide" },
        { status: 400 },
      );
    }
    if (!/^[\w.+\-]+@[\w\-]+\.[a-z]{2,}$/i.test(email)) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }
    if (phone && !/^\+?[\d\s\-().]{6,20}$/.test(phone.trim())) {
      return NextResponse.json(
        { error: "Numéro de téléphone invalide" },
        { status: 400 },
      );
    }

    // Construire la date complète (UTC pour cohérence avec getUTCHours() dans availability.ts)
    const reservationDate = new Date(`${date}T${time}:00.000Z`);
    if (reservationDate <= new Date()) {
      return NextResponse.json({ error: "Date invalide" }, { status: 400 });
    }

    // Calcul du dépôt: montant par couvert * nombre de couverts
    const depositAmount = DEPOSIT_PER_GUEST_CENTS * guestsNum;

    // Le hold (place bloquée en attendant le paiement) dure autant que la session Stripe
    const transactionExpireAt = new Date(Date.now() + HOLD_MINUTES * 60_000);

    // Créer d'abord la réservation en base pour obtenir le cancelToken
    // (le token est généré automatiquement par Prisma grâce au default(cuid()))
    // Le test de disponibilité est rejoué dans la même transaction que la création,
    // sous verrou (date, service), pour éviter les doubles réservations simultanées.
    const reservation = await prisma.$transaction(async (tx) => {
      const available = await lockAndCheckAvailability(tx, {
        dateStr: date,
        service: serviceOf(reservationDate),
        size: guestsNum,
      });
      if (!available) return null;

      return tx.reservation.create({
        data: {
          name: name,
          email: email.trim().toLowerCase(),
          phone: phone?.trim() || "",
          date: reservationDate,
          guests: guestsNum,
          specialRequest: specialRequest?.trim() || "",
          status: "PENDING_PAYMENT",
          depositPaidCents: depositAmount,
          transactionExpireAt,
          source: "WEB",
        },
      });
    });

    if (!reservation) {
      return NextResponse.json(
        { error: "Créneau complet pour ce nombre de couverts" },
        { status: 409 },
      );
    }

    // Stripe exige une session d'au moins 30 min : marge d'une minute sur le hold, pour
    // que la session ne soit jamais refusée parce que l'appel part quelques ms trop tard.
    const sessionExpiresAt = Math.floor(
      (Date.now() + (HOLD_MINUTES + 1) * 60_000) / 1000,
    );

    // Créer la session Stripe avec image de nourriture
    let stripeSession;
    try {
      stripeSession = await stripe.checkout.sessions.create({
        expires_at: sessionExpiresAt,
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "eur",
              product_data: {
                name: `Réservation au nom de ${name}`,
                description: `${date} à ${time} - ${guestsNum} couvert(s)`,
                images: [
                  "https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?w=400&q=80",
                ],
              },
              unit_amount: depositAmount,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${BASE_URL}/reservation/succes?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${BASE_URL}/reservation/cancel?token=${reservation.cancelToken}`,
        customer_email: email.trim().toLowerCase(),
        metadata: {
          name,
          email: email.trim().toLowerCase(),
          phone: phone?.trim() || "",
          date: reservationDate.toISOString(),
          guests: guestsNum.toString(),
          specialRequest: specialRequest?.trim() || "",
          reservationId: reservation.id,
        },
      });
    } catch (stripeErr) {
      // Pas de session : on libère tout de suite la place plutôt que d'attendre l'expiration du hold
      await prisma.reservation
        .delete({ where: { id: reservation.id } })
        .catch(() => undefined);
      throw stripeErr;
    }

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
    console.error("[POST /api/reservations]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
