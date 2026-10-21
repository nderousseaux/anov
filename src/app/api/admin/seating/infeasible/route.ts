import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromCookies } from "@/lib/auth";
import { findInfeasibleServices } from "@/lib/seating/db";

/** Services à venir dont les réservations ne tiennent pas sur les tables du pool en ligne. */
export async function GET() {
  const admin = await getAdminFromCookies();
  if (!admin)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  return NextResponse.json({
    infeasibleServices: await findInfeasibleServices(prisma),
  });
}
