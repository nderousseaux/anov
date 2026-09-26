import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromCookies } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ email: string }> },
) {
  const admin = await getAdminFromCookies();
  if (!admin)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { email: rawEmail } = await params;
  const email = decodeURIComponent(rawEmail);

  const [reservations, giftCards, gourmetOffers, contactMessages, productOrders, note] =
    await Promise.all([
      prisma.reservation.findMany({
        where: { email: { equals: email, mode: "insensitive" } },
        orderBy: { date: "desc" },
      }),
      prisma.giftCard.findMany({
        where: { recipientEmail: { equals: email, mode: "insensitive" } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.gourmetOffer.findMany({
        where: { recipientEmail: { equals: email, mode: "insensitive" } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.contactMessage.findMany({
        where: { email: { equals: email, mode: "insensitive" } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.productOrder.findMany({
        where: { customerEmail: { equals: email, mode: "insensitive" } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.customerNote.findUnique({
        where: { email: email.toLowerCase() },
      }),
    ]);

  // Le nom affiché en titre de la fiche est le dernier nom renseigné,
  // tous formulaires confondus (réservation, commande, contact, bon cadeau, offre gourmande).
  const namedEvents: { name: string | null | undefined; createdAt: Date }[] = [
    ...reservations.map((r) => ({ name: r.name, createdAt: r.createdAt })),
    ...giftCards.map((g) => ({ name: g.name, createdAt: g.createdAt })),
    ...gourmetOffers.map((o) => ({ name: o.name, createdAt: o.createdAt })),
    ...contactMessages.map((c) => ({ name: c.name, createdAt: c.createdAt })),
    ...productOrders.map((p) => ({
      name: p.customerName,
      createdAt: p.createdAt,
    })),
  ];

  let name: string | null = null;
  let latestAt = -Infinity;
  for (const evt of namedEvents) {
    const trimmed = evt.name?.trim();
    if (!trimmed) continue;
    const t = evt.createdAt.getTime();
    if (t >= latestAt) {
      latestAt = t;
      name = trimmed;
    }
  }

  return NextResponse.json({
    name,
    reservations,
    giftCards,
    gourmetOffers,
    contactMessages,
    productOrders,
    note,
  });
}
