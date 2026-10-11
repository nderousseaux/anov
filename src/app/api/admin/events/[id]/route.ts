import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromCookies } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminFromCookies();
  if (!admin)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;

  try {
    const body = await req.json();
    const { titleFr, titleEn, titleDe, descriptionFr, descriptionEn, descriptionDe, startDate, endDate, startService, endService, isActive } = body;

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return NextResponse.json({ error: "Événement non trouvé" }, { status: 404 });
    }

    const newStartDate = startDate ? new Date(startDate) : event.startDate;
    const newEndDate = endDate ? new Date(endDate) : event.endDate;
    const newStartService = startService ?? event.startService;
    const newEndService = endService ?? event.endService;

    if (isNaN(newStartDate.getTime()) || isNaN(newEndDate.getTime())) {
      return NextResponse.json({ error: "Dates invalides" }, { status: 400 });
    }

    if (newStartDate > newEndDate) {
      return NextResponse.json({ error: "La date de début doit être avant ou égale à la date de fin" }, { status: 400 });
    }

    // Si même jour, vérifier que startService <= endService
    if (newStartDate.getTime() === newEndDate.getTime() && newStartService && newEndService) {
      const serviceOrder = { lunch: 0, dinner: 1 };
      if (serviceOrder[newStartService as keyof typeof serviceOrder] > serviceOrder[newEndService as keyof typeof serviceOrder]) {
        return NextResponse.json({ error: "Le service de début doit être avant ou égal au service de fin" }, { status: 400 });
      }
    }

    const updated = await prisma.event.update({
      where: { id },
      data: {
        titleFr: titleFr ?? event.titleFr,
        titleEn: titleEn ?? event.titleEn,
        titleDe: titleDe ?? event.titleDe,
        descriptionFr: descriptionFr ?? event.descriptionFr,
        descriptionEn: descriptionEn ?? event.descriptionEn,
        descriptionDe: descriptionDe ?? event.descriptionDe,
        startDate: newStartDate,
        endDate: newEndDate,
        startService: newStartService === "all" ? null : newStartService,
        endService: newEndService === "all" ? null : newEndService,
        isActive: isActive ?? event.isActive,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("[PATCH /api/admin/events/[id]]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminFromCookies();
  if (!admin)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;

  try {
    await prisma.event.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/admin/events/[id]]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}