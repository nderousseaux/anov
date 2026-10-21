import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromCookies } from "@/lib/auth";
import {
  validateComboCapacity,
  validateComboTableIds,
  type ComboInput,
} from "@/lib/seating/admin";
import { comboCapacity } from "@/lib/seating";

/** Combinaisons avec leur capacité effective (réglée, sinon somme des tables). */
async function listCombos() {
  const [combos, tables] = await Promise.all([
    prisma.tableCombo.findMany({ orderBy: { id: "asc" } }),
    prisma.table.findMany({ select: { id: true, capacity: true } }),
  ]);
  const capacityById = new Map(tables.map((t) => [t.id, t.capacity]));
  return combos.map((c) => ({
    id: c.id,
    tableIds: c.tableIds,
    capacityOverride: c.capacityOverride,
    capacity: comboCapacity(c.tableIds, c.capacityOverride, capacityById),
  }));
}

export async function GET() {
  const admin = await getAdminFromCookies();
  if (!admin)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  return NextResponse.json(await listCombos());
}

export async function POST(req: NextRequest) {
  const admin = await getAdminFromCookies();
  if (!admin)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = (await req.json()) as ComboInput;
  const error =
    validateComboTableIds(body.tableIds) ??
    validateComboCapacity(body.capacityOverride);
  if (error) return NextResponse.json({ error }, { status: 400 });

  const tableIds = [...(body.tableIds as number[])].sort((a, b) => a - b);

  const [tables, existing] = await Promise.all([
    prisma.table.findMany({
      where: { id: { in: tableIds } },
      select: { id: true },
    }),
    prisma.tableCombo.findMany(),
  ]);
  if (tables.length !== tableIds.length) {
    return NextResponse.json({ error: "Table introuvable" }, { status: 404 });
  }
  const key = tableIds.join(",");
  const duplicate = existing.some(
    (c) => [...c.tableIds].sort((a, b) => a - b).join(",") === key,
  );
  if (duplicate) {
    return NextResponse.json(
      { error: "Cette combinaison existe déjà" },
      { status: 409 },
    );
  }

  const created = await prisma.tableCombo.create({
    data: {
      tableIds,
      capacityOverride: (body.capacityOverride as number | null) ?? null,
    },
  });
  const combo = (await listCombos()).find((c) => c.id === created.id);
  return NextResponse.json(combo, { status: 201 });
}
