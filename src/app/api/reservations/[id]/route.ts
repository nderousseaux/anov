import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const reservation = await prisma.reservation.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      date: true,
      guests: true,
      status: true,
      depositPaidCents: true,
      // Exclude sensitive fields
      stripeSessionId: false,
      cancelToken: false,
      createdAt: false,
      updatedAt: false,
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
