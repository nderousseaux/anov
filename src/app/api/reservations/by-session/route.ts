import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// SYSTEME DE PAIEMENT ACTIVE
// Le CMS est fonctionnel coté admin, le système de paiement Stripe est maintenant actif

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "Session ID manquant" }, { status: 400 });
  }

  // Récupérer la réservation par session Stripe
  const reservation = await prisma.reservation.findUnique({
    where: { stripeSessionId: sessionId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      date: true,
      guests: true,
      status: true,
      depositPaidCents: true,
    },
  });

  if (!reservation) {
    return NextResponse.json(
      { error: "Réservation introuvable" },
      { status: 404 },
    );
  }

  return NextResponse.json(reservation);
}
