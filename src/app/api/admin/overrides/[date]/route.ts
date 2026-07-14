import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromCookies } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: { date: string } },
) {
  const admin = await getAdminFromCookies();
  if (!admin)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const dateStr = params.date;

  // Vérifier que le jour n'est pas déjà passé
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selectedDate = new Date(dateStr + "T00:00:00.000Z");
  if (selectedDate < today) {
    return NextResponse.json(
      { error: "Impossible de modifier un jour déjà passé" },
      { status: 400 },
    );
  }

  const body = await req.json();
  const { closed, openingSlots } = body;

  if (typeof closed !== "boolean") {
    return NextResponse.json(
      { error: "Le champ 'closed' est required" },
      { status: 400 },
    );
  }

  // Créer ou mettre à jour l'override
  const override = await prisma.dayOverride.upsert({
    where: { date: selectedDate },
    update: {
      closed,
      openingSlots: openingSlots ? JSON.stringify(openingSlots) : null,
    },
    create: {
      date: selectedDate,
      closed,
      openingSlots: openingSlots ? JSON.stringify(openingSlots) : null,
    },
  });

  return NextResponse.json({ success: true, override });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { date: string } },
) {
  const admin = await getAdminFromCookies();
  if (!admin)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const dateStr = params.date;

  // Vérifier que le jour n'est pas déjà passé
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selectedDate = new Date(dateStr + "T00:00:00.000Z");
  if (selectedDate < today) {
    return NextResponse.json(
      { error: "Impossible de modifier un jour déjà passé" },
      { status: 400 },
    );
  }

  // Supprimer l'override
  await prisma.dayOverride.delete({
    where: { date: selectedDate },
  });

  return NextResponse.json({ success: true });
}