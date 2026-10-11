import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromCookies } from "@/lib/auth";

export async function GET() {
  const admin = await getAdminFromCookies();
  if (!admin)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const events = await prisma.event.findMany({
    where: { isActive: true },
    orderBy: { startDate: "asc" },
  });

  return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
  const admin = await getAdminFromCookies();
  if (!admin)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const body = await req.json();
    const { titleFr, titleEn, titleDe, descriptionFr, descriptionEn, descriptionDe, startDate, endDate, startService, endService } = body;

    if (!titleFr || !titleEn || !titleDe || !descriptionFr || !descriptionEn || !descriptionDe || !startDate || !endDate) {
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json({ error: "Dates invalides" }, { status: 400 });
    }

    if (start > end) {
      return NextResponse.json({ error: "La date de début doit être avant ou égale à la date de fin" }, { status: 400 });
    }

    // Si même jour, vérifier que startService <= endService
    if (startDate === endDate && startService && endService) {
      const serviceOrder = { lunch: 0, dinner: 1 };
      if (serviceOrder[startService as keyof typeof serviceOrder] > serviceOrder[endService as keyof typeof serviceOrder]) {
        return NextResponse.json({ error: "Le service de début doit être avant ou égal au service de fin" }, { status: 400 });
      }
    }

    const event = await prisma.event.create({
      data: {
        titleFr,
        titleEn,
        titleDe,
        descriptionFr,
        descriptionEn,
        descriptionDe,
        startDate: start,
        endDate: end,
        startService: startService === "all" ? null : startService ?? null,
        endService: endService === "all" ? null : endService ?? null,
        isActive: true,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/events]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}