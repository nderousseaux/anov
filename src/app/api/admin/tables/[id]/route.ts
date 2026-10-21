import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromCookies } from "@/lib/auth";
import { validateTableInput, type TableInput } from "@/lib/seating/admin";
import { activeReservationWhere } from "@/lib/seating/db";

type Params = { params: Promise<{ id: string }> };

function parseId(raw: string): number | null {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const admin = await getAdminFromCookies();
  if (!admin)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const id = parseId((await params).id);
  if (id === null)
    return NextResponse.json(
      { error: "Identifiant invalide" },
      { status: 400 },
    );

  const body = (await req.json()) as TableInput;
  const error = validateTableInput(body, { partial: true });
  if (error) return NextResponse.json({ error }, { status: 400 });

  const existing = await prisma.table.findUnique({ where: { id } });
  if (!existing)
    return NextResponse.json({ error: "Table introuvable" }, { status: 404 });

  try {
    const table = await prisma.table.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: (body.name as string).trim() }),
        ...(body.capacity !== undefined && {
          capacity: body.capacity as number,
        }),
        ...(body.walkIn !== undefined && { walkIn: body.walkIn as boolean }),
        ...(body.posX !== undefined && { posX: body.posX as number }),
        ...(body.posY !== undefined && { posY: body.posY as number }),
      },
      select: {
        id: true,
        name: true,
        capacity: true,
        posX: true,
        posY: true,
        walkIn: true,
      },
    });
    return NextResponse.json(table);
  } catch (err) {
    if ((err as { code?: string }).code === "P2002") {
      return NextResponse.json(
        { error: "Une table porte déjà ce nom" },
        { status: 409 },
      );
    }
    throw err;
  }
}

/**
 * Supprime une table (et les combinaisons qui l'utilisent). Refusé tant qu'une réservation
 * à venir est épinglée dessus. L'ancien lien `tableId` des réservations est effacé.
 */
export async function DELETE(_req: NextRequest, { params }: Params) {
  const admin = await getAdminFromCookies();
  if (!admin)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const id = parseId((await params).id);
  if (id === null)
    return NextResponse.json(
      { error: "Identifiant invalide" },
      { status: 400 },
    );

  const existing = await prisma.table.findUnique({ where: { id } });
  if (!existing)
    return NextResponse.json({ error: "Table introuvable" }, { status: 404 });

  const now = new Date();
  const pinned = await prisma.reservation.count({
    where: {
      pinnedTableIds: { has: id },
      date: { gte: now },
      ...activeReservationWhere(now),
    },
  });
  if (pinned > 0) {
    return NextResponse.json(
      {
        error: `${pinned} réservation(s) à venir sont épinglées sur cette table : déplacez-les d'abord`,
      },
      { status: 409 },
    );
  }

  await prisma.$transaction([
    prisma.tableCombo.deleteMany({ where: { tableIds: { has: id } } }),
    prisma.reservation.updateMany({
      where: { tableId: id },
      data: { tableId: null },
    }),
    prisma.table.delete({ where: { id } }),
  ]);

  return NextResponse.json({ deleted: true });
}
