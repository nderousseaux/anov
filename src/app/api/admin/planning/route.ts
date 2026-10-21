import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromCookies } from "@/lib/auth";
import { loadDayPlanning } from "@/lib/seating/db";

/** Planning d'un jour : réservations par service (midi / soir), tables attribuées, remplissage. */
export async function GET(req: NextRequest) {
  const admin = await getAdminFromCookies();
  if (!admin)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const date = req.nextUrl.searchParams.get("date");
  if (
    !date ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    isNaN(new Date(`${date}T00:00:00.000Z`).getTime())
  ) {
    return NextResponse.json({ error: "date invalide" }, { status: 400 });
  }

  return NextResponse.json(await loadDayPlanning(prisma, date));
}
