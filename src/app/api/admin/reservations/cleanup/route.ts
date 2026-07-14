import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
  // Annuler toutes les réservations (PENDING_PAYMENT, CONFIRMED, COMPLETED)
  // Ne pas annuler les réservations déjà CANCELLED
  await prisma.reservation.updateMany({
    where: {
      status: {
        in: ["PENDING_PAYMENT", "CONFIRMED", "COMPLETED"],
      },
    },
    data: {
      status: "CANCELLED",
    },
  });

  return NextResponse.json({ message: "ok" });
}
