import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromCookies } from "@/lib/auth";
import { sendCancellationEmail } from "@/lib/email";
import { stripe } from "@/lib/stripe";
import { parseAdminReservation } from "@/lib/seating/admin";
import { serviceOf } from "@/lib/seating";
import { lockAndCheckAvailability } from "@/lib/seating/db";

export async function GET(req: NextRequest) {
  const admin = await getAdminFromCookies();
  if (!admin)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const dateStr = searchParams.get("date");
  const status = searchParams.get("status");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const perPage = 25;

  const now = new Date();
  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (dateStr) {
    const d = new Date(dateStr);
    const start = new Date(d);
    start.setHours(0, 0, 0, 0);
    const end = new Date(d);
    end.setHours(23, 59, 59, 999);
    where.date = { gte: start, lte: end };
  }

  // Exclure les réservations expirées (PENDING_PAYMENT avec transactionExpireAt dépassé)
  // Elles restent en PENDING_PAYMENT en base mais ne sont pas affichées
  where.AND = [
    {
      OR: [
        { status: { not: "PENDING_PAYMENT" } },
        { transactionExpireAt: { gt: now } },
        { transactionExpireAt: null },
      ],
    },
  ];

  // Compter les réservations (CONFIRMED + PENDING_PAYMENT non expirés) pour les disponibilités
  const reservationCountWhere = {
    ...where,
    AND: [
      {
        OR: [
          { status: "CONFIRMED" },
          {
            AND: [
              { status: "PENDING_PAYMENT" },
              {
                OR: [
                  { transactionExpireAt: { gt: now } },
                  { transactionExpireAt: null },
                ],
              },
            ],
          },
        ],
      },
    ],
  };

  // Compter SEULEMENT les réservations non expirées (CONFIRMED + PENDING_PAYMENT non expirés)
  // Pour les réservations affichées, on compte celles qui ne sont pas expirées
  const total = await prisma.reservation.count({
    where: {
      ...where,
      AND: [
        {
          OR: [
            { status: "CONFIRMED" },
            {
              AND: [
                { status: "PENDING_PAYMENT" },
                {
                  OR: [
                    { transactionExpireAt: { gt: now } },
                    { transactionExpireAt: null },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  });

  const reservations = await prisma.reservation.findMany({
    where,
    orderBy: { date: "asc" },
    skip: (page - 1) * perPage,
    take: perPage,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      date: true,
      guests: true,
      status: true,
      specialRequest: true,
      wantsSmsReminder: true,
      depositPaidCents: true,
      transactionExpireAt: true,
      createdAt: true,
      tableId: true,
      table: { select: { name: true, capacity: true } },
    },
  });

  return NextResponse.json({
    data: reservations,
    total,
    page,
    pageSize: perPage,
  });
}

/**
 * Réservation saisie par le restaurateur (client au téléphone, client de passage).
 * Même validation que le web : le test de disponibilité est rejoué sous verrou
 * (date, service). Si le service est complet : 409 avec `canForce` ; avec `force: true`
 * la réservation est ajoutée quand même (elle apparaîtra « sans table »). Pas de paiement :
 * la réservation est directement confirmée.
 */
export async function POST(req: NextRequest) {
  const admin = await getAdminFromCookies();
  if (!admin)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const parsed = parseAdminReservation(await req.json().catch(() => null));
  if ("error" in parsed)
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  const v = parsed.value;

  const table =
    v.tableId === null
      ? null
      : await prisma.table.findUnique({ where: { id: v.tableId } });
  if (v.tableId !== null && !table)
    return NextResponse.json({ error: "Table introuvable" }, { status: 404 });
  if (table && v.guests > table.capacity && !v.force) {
    return NextResponse.json(
      {
        error: `La table ${table.name} n'a que ${table.capacity} place(s) pour ${v.guests} couverts`,
        canForce: true,
      },
      { status: 409 },
    );
  }

  const reservationDate = new Date(`${v.date}T${v.time}:00.000Z`);

  const result = await prisma.$transaction(async (tx) => {
    const available = await lockAndCheckAvailability(tx, {
      dateStr: v.date,
      service: serviceOf(reservationDate),
      size: v.guests,
      pinnedTableIds: table ? [table.id] : undefined,
    });
    if (!available && !v.force) return null;

    const reservation = await tx.reservation.create({
      data: {
        name: v.name,
        email: v.email,
        phone: v.phone,
        date: reservationDate,
        guests: v.guests,
        specialRequest: v.specialRequest,
        status: "CONFIRMED",
        source: v.source,
        pinnedTableIds: table ? [table.id] : [],
      },
      select: { id: true, name: true, date: true, guests: true, source: true },
    });
    return { reservation, forced: !available };
  });

  if (!result) {
    return NextResponse.json(
      {
        error: `Service complet pour ${v.guests} couvert${v.guests > 1 ? "s" : ""}`,
        canForce: true,
      },
      { status: 409 },
    );
  }

  return NextResponse.json(result, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const admin = await getAdminFromCookies();
  if (!admin)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id, status } = await req.json();
  const allowed = ["CONFIRMED", "CANCELLED", "COMPLETED"];
  if (!id || !allowed.includes(status)) {
    return NextResponse.json(
      { error: "Paramètres invalides" },
      { status: 400 },
    );
  }

  const updated = await prisma.reservation.update({
    where: { id },
    data: { status },
    select: {
      id: true,
      name: true,
      email: true,
      date: true,
      status: true,
      stripeSessionId: true,
      depositPaidCents: true,
    },
  });

  // Envoyer un email si la réservation est annulée
  if (status === "CANCELLED" && updated.email) {
    const d = new Date(updated.date);
    const dateFr = d.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    const time = `${d.getUTCHours().toString().padStart(2, "0")}:${d.getUTCMinutes().toString().padStart(2, "0")}`;

    await sendCancellationEmail({
      to: updated.email,
      name: updated.name,
      date: dateFr,
      time: time,
    });

    // Effectuer un remboursement Stripe si une session de paiement existe
    if (
      updated.stripeSessionId &&
      updated.depositPaidCents &&
      updated.depositPaidCents > 0
    ) {
      try {
        // Récupérer la session Stripe pour obtenir le payment_intent
        const session = await stripe.checkout.sessions.retrieve(
          updated.stripeSessionId,
        );
        const paymentIntentId = session.payment_intent as string;

        if (paymentIntentId) {
          const refund = await stripe.refunds.create({
            payment_intent: paymentIntentId,
            amount: updated.depositPaidCents,
          });

          console.log(
            `[REFUND] Remboursement de ${updated.depositPaidCents} cents créé: ${refund.id}`,
          );
        } else {
          console.warn(
            `[REFUND] Aucun payment_intent trouvé pour la session ${updated.stripeSessionId}`,
          );
        }
      } catch (refundError) {
        console.error(
          "[REFUND] Erreur lors du remboursement Stripe:",
          refundError,
        );
        // On ne bloque pas l'annulation si le refund échoue
      }
    }
  }

  return NextResponse.json(updated);
}
