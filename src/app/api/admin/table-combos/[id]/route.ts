import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromCookies } from "@/lib/auth";
import { validateComboCapacity, type ComboInput } from "@/lib/seating/admin";

type Params = { params: Promise<{ id: string }> };

function parseId(raw: string): number | null {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

/** Seule la capacité est modifiable : pour changer les tables, supprimer puis recréer. */
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

  const body = (await req.json()) as ComboInput;
  if (body.capacityOverride === undefined) {
    return NextResponse.json(
      { error: "capacityOverride requis (null = somme)" },
      { status: 400 },
    );
  }
  const error = validateComboCapacity(body.capacityOverride);
  if (error) return NextResponse.json({ error }, { status: 400 });

  const existing = await prisma.tableCombo.findUnique({ where: { id } });
  if (!existing)
    return NextResponse.json(
      { error: "Combinaison introuvable" },
      { status: 404 },
    );

  const combo = await prisma.tableCombo.update({
    where: { id },
    data: {
      capacityOverride: (body.capacityOverride as number | null) ?? null,
    },
  });
  return NextResponse.json(combo);
}

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

  const existing = await prisma.tableCombo.findUnique({ where: { id } });
  if (!existing)
    return NextResponse.json(
      { error: "Combinaison introuvable" },
      { status: 404 },
    );

  await prisma.tableCombo.delete({ where: { id } });
  return NextResponse.json({ deleted: true });
}
