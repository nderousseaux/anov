import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromCookies } from "@/lib/auth";
import { validateTableInput, type TableInput } from "@/lib/seating/admin";

const tableSelect = {
  id: true,
  name: true,
  capacity: true,
  posX: true,
  posY: true,
  walkIn: true,
} as const;

export async function GET() {
  const admin = await getAdminFromCookies();
  if (!admin)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const tables = await prisma.table.findMany({
    orderBy: [{ capacity: "asc" }, { id: "asc" }],
    select: tableSelect,
  });

  return NextResponse.json(tables);
}

export async function POST(req: NextRequest) {
  const admin = await getAdminFromCookies();
  if (!admin)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = (await req.json()) as TableInput;
  const error = validateTableInput(body, { partial: false });
  if (error) return NextResponse.json({ error }, { status: 400 });

  try {
    const table = await prisma.table.create({
      data: {
        name: (body.name as string).trim(),
        capacity: body.capacity as number,
        walkIn: (body.walkIn as boolean | undefined) ?? false,
        posX: (body.posX as number | undefined) ?? 50,
        posY: (body.posY as number | undefined) ?? 50,
      },
      select: tableSelect,
    });
    return NextResponse.json(table, { status: 201 });
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
