import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromCookies } from "@/lib/auth";
import { pinReservation } from "@/lib/seating/db";

/**
 * Déplace une réservation sur une table ou une combinaison autorisée (elle est alors
 * épinglée : l'algo ne la déplace plus), ou la rend à l'algo (`tableIds: []`).
 * Si le changement a des conséquences (tables trop petites, une réservation perdrait sa
 * table), 409 avec les avertissements et `canForce` ; `force: true` l'applique quand même.
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getAdminFromCookies();
  if (!admin)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;
  const body = (await req.json().catch(() => null)) as {
    tableIds?: unknown;
    force?: unknown;
  } | null;

  const tableIds = body?.tableIds;
  if (
    !Array.isArray(tableIds) ||
    tableIds.length > 2 ||
    tableIds.some((t) => !Number.isInteger(t) || (t as number) < 1)
  ) {
    return NextResponse.json({ error: "tableIds invalide" }, { status: 400 });
  }
  if (body?.force !== undefined && typeof body.force !== "boolean") {
    return NextResponse.json({ error: "force invalide" }, { status: 400 });
  }

  const result = await prisma.$transaction((tx) =>
    pinReservation(tx, id, tableIds as number[], body?.force === true),
  );

  switch (result.kind) {
    case "not_found":
      return NextResponse.json(
        { error: "Réservation introuvable" },
        { status: 404 },
      );
    case "invalid":
      return NextResponse.json({ error: result.error }, { status: 400 });
    case "warnings":
      return NextResponse.json(
        {
          error: result.warnings.join(" · "),
          warnings: result.warnings,
          canForce: true,
        },
        { status: 409 },
      );
    case "ok":
      return NextResponse.json({
        pinnedTableIds: result.pinnedTableIds,
        warnings: result.warnings,
      });
  }
}
