import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import type { Reservation } from "@/generated/prisma";
import { lockAndCheckAvailability } from "@/lib/seating/db";
import { serviceOf } from "@/lib/seating";
import {
  sendCancellationEmail,
  sendConfirmationEmail,
  sendGiftCardEmail,
  sendGourmetOfferEmail,
  sendProductOrderConfirmationEmail,
} from "@/lib/email";

// Désactiver le body parser de Next.js pour lire le corps brut (requis par Stripe)
export const config = { api: { bodyParser: false } };

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    // Log missing webhook secret (for monitoring in production)
    return NextResponse.json(
      { error: "Configuration serveur incorrecte" },
      { status: 500 },
    );
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Signature manquante" }, { status: 400 });
  }

  let event;
  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    // Log error (for monitoring in production)
    return NextResponse.json(
      { error: "Webhook signature invalide" },
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const meta = session.metadata ?? {};

    // Gérer les chèques cadeaux
    if (meta.type === "gift_card" && meta.giftCardId) {
      await handleGiftCardPayment(meta.giftCardId, session.id);
    }
    // Gérer les offres gourmandes
    else if (meta.type === "gourmet_offer" && meta.gourmetOfferId) {
      await handleGourmetOfferPayment(meta.gourmetOfferId, session.id);
    }
    // Gérer les commandes produits
    else if (meta.type === "product_order" && meta.orderId) {
      await handleProductOrderPayment(meta.orderId, session.id);
    }
    // Gérer les réservations (supporte les deux formats)
    else if (
      (meta.name && meta.email && meta.date && meta.guests) || // ancien format
      (meta.reservation_name &&
        meta.reservation_email &&
        meta.reservation_date &&
        meta.reservation_guests) // nouveau format
    ) {
      try {
        await handleReservationPayment(session, meta);
      } catch (err) {
        // 500 : Stripe rejoue l'événement (le traitement est idempotent)
        console.error("[WEBHOOK] Échec du traitement de la réservation:", err);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
      }
    } else {
      // Log metadata issue (for monitoring)
      return NextResponse.json(
        { error: "Metadata manquantes" },
        { status: 400 },
      );
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
        status: "ACTIVE",
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
          expiresAt: giftCard.expiresAt
            ? giftCard.expiresAt.toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "",
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
 * Gère le paiement d'une offre gourmande
 */
async function handleGourmetOfferPayment(
  gourmetOfferId: string,
  sessionId: string,
) {
  try {
    // Récupérer l'offre gourmande
    const gourmetOffer = await prisma.gourmetOffer.findUnique({
      where: { id: gourmetOfferId },
    });

    if (!gourmetOffer) {
      // Log missing gourmet offer (for monitoring)
      return;
    }

    // Mettre à jour le statut de l'offre gourmande et effacer l'expiration de la transaction
    await prisma.gourmetOffer.update({
      where: { id: gourmetOfferId },
      data: {
        status: "ACTIVE",
        stripeSessionId: sessionId,
        transactionExpireAt: null, // La transaction est terminée
      },
    });

    // Envoyer l'email avec l'offre gourmande au destinataire (sans le prix)
    try {
      if (gourmetOffer.recipientEmail) {
        await sendGourmetOfferEmail({
          to: gourmetOffer.recipientEmail,
          code: gourmetOffer.code,
          offerName: gourmetOffer.offerName,
          offerDescription: gourmetOffer.offerDescription || undefined,
          personalMessage: gourmetOffer.personalMessage || undefined,
          expiresAt: gourmetOffer.expiresAt
            ? gourmetOffer.expiresAt.toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "",
        });
        // Email sent (for monitoring)
      } else {
        // No email to send for gourmet offer
      }
    } catch (emailError) {
      // Log email error (for monitoring)
    }

    // Gourmet offer activated (for monitoring)
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
    const specialRequest =
      meta.reservation_special_request || meta.specialRequest || null;

    let reservation;

    // Si on a un reservationId, on confirme l'existante (avec re-test si le hold a expiré)
    if (reservationId) {
      const outcome = await confirmPaidReservation(reservationId, session.id);
      if (outcome.kind === "already") return;
      if (outcome.kind !== "confirmed") {
        await refundSession(session);
        if (outcome.kind === "rejected")
          await notifyRejected(outcome.reservation);
        return;
      }
      reservation = outcome.reservation;
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
          status: "CONFIRMED",
          stripeSessionId: session.id,
        },
      });
    }

    // Récupérer la durée du repas depuis les paramètres du restaurant
    const restaurantSettings = await prisma.restaurantSettings.findUnique({
      where: { id: 1 },
    });
    const mealDuration = restaurantSettings?.mealDuration || 90;

    // Envoyer l'email de confirmation
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const resDate = new Date(reservation.date);
    const formattedDate = resDate.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
    try {
      if (!reservation.email) return;
      await sendConfirmationEmail({
        to: reservation.email,
        name: reservation.name,
        date: formattedDate,
        time: `${String(resDate.getUTCHours()).padStart(2, "0")}:${String(resDate.getUTCMinutes()).padStart(2, "0")}`,
        guests: reservation.guests,
        cancelUrl: `${baseUrl}/reservation/cancel?token=${reservation.cancelToken}`,
        // Passer la date ISO pour le fichier .ics
        icsDate: reservation.date.toISOString(),
        durationMinutes: mealDuration,
      });
      console.log(
        `[WEBHOOK] Email de confirmation envoyé à ${reservation.email}`,
      );
    } catch (emailError) {
      console.error(
        `[WEBHOOK] Erreur lors de l'envoi de l'email à ${reservation.email}:`,
        emailError,
      );
    }

    // Reservation confirmed (for monitoring)
  } catch (error) {
    console.error("[WEBHOOK] Erreur dans handleReservationPayment:", error);
    throw error;
  }
}

type ConfirmOutcome =
  | { kind: "confirmed"; reservation: Reservation }
  | { kind: "already" }
  | { kind: "missing" }
  | { kind: "rejected"; reservation: Reservation };

/**
 * Confirme une réservation payée. Tant que son hold est valide, sa place est déjà comptée
 * dans la disponibilité : on confirme sans rien retester. Si le hold a expiré (ou si la
 * réservation a été annulée entre-temps), la place a pu être reprise : on rejoue le test
 * sous verrou (date, service) en excluant cette réservation ; s'il échoue, on l'annule.
 */
async function confirmPaidReservation(
  reservationId: string,
  sessionId: string,
): Promise<ConfirmOutcome> {
  return prisma.$transaction(async (tx): Promise<ConfirmOutcome> => {
    const existing = await tx.reservation.findUnique({
      where: { id: reservationId },
    });
    if (!existing) return { kind: "missing" };
    // Événement Stripe rejoué : déjà traité
    if (existing.status === "CONFIRMED") return { kind: "already" };

    const holdValid =
      existing.status === "PENDING_PAYMENT" &&
      (!existing.transactionExpireAt ||
        existing.transactionExpireAt > new Date());

    if (!holdValid) {
      const stillFits = await lockAndCheckAvailability(tx, {
        dateStr: existing.date.toISOString().split("T")[0],
        service: serviceOf(existing.date),
        size: existing.guests,
        excludeReservationId: existing.id,
      });
      if (!stillFits) {
        await tx.reservation.update({
          where: { id: existing.id },
          data: { status: "CANCELLED", stripeSessionId: sessionId },
        });
        return { kind: "rejected", reservation: existing };
      }
    }

    const reservation = await tx.reservation.update({
      where: { id: existing.id },
      data: {
        status: "CONFIRMED",
        stripeSessionId: sessionId,
        transactionExpireAt: null, // La transaction est terminée
      },
    });
    return { kind: "confirmed", reservation };
  });
}

/** Remboursement intégral du paiement d'une session (idempotent côté Stripe). */
async function refundSession(session: any) {
  const paymentIntent =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;
  if (!paymentIntent) {
    console.warn(
      `[WEBHOOK] Aucun payment_intent à rembourser pour ${session.id}`,
    );
    return;
  }
  await stripe.refunds.create(
    { payment_intent: paymentIntent },
    { idempotencyKey: `refund-${session.id}` },
  );
  console.warn(`[WEBHOOK] Paiement ${paymentIntent} remboursé (place perdue)`);
}

async function notifyRejected(reservation: Reservation) {
  if (!reservation.email) return;
  const d = new Date(reservation.date);
  try {
    await sendCancellationEmail({
      to: reservation.email,
      name: reservation.name,
      date: d.toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        timeZone: "UTC",
      }),
      time: `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`,
    });
  } catch (emailError) {
    console.error("[WEBHOOK] Email d'annulation non envoyé:", emailError);
  }
}

/**
 * Gère le paiement d'une commande produit
 */
async function handleProductOrderPayment(orderId: string, sessionId: string) {
  try {
    // Récupérer la commande
    const order = await prisma.productOrder.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      // Log missing order (for monitoring)
      return;
    }

    // Mettre à jour le statut de la commande
    await prisma.productOrder.update({
      where: { id: orderId },
      data: {
        status: "CONFIRMED",
        stripeSessionId: sessionId,
        transactionExpireAt: null, // La transaction est terminée
      },
    });

    // Envoyer l'email de confirmation au client
    try {
      await sendProductOrderConfirmationEmail({
        to: order.customerEmail,
        name: order.customerName,
        orderCode: order.code,
        productName: order.productName,
        quantity: order.quantity,
        amount: order.totalPrice,
        deliveryMethod: order.deliveryMethod,
      });
      console.log(
        `[WEBHOOK] Email de confirmation envoyé à ${order.customerEmail} pour la commande ${order.code}`,
      );
    } catch (emailError) {
      console.error(
        `[WEBHOOK] Erreur lors de l'envoi de l'email à ${order.customerEmail}:`,
        emailError,
      );
    }

    // Product order confirmed (for monitoring)
  } catch (error) {
    console.error("[WEBHOOK] Erreur dans handleProductOrderPayment:", error);
  }
}
