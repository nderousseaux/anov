import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromCookies } from '@/lib/auth';

type Params = { params: Promise<{ date: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const admin = await getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const { date } = await params;
  const dateObj = new Date(date + 'T00:00:00.000Z');

  const override = await prisma.dayOverride.findUnique({ where: { date: dateObj } });
  if (!override) return NextResponse.json(null);

  return NextResponse.json({
    closed: override.closed,
    openingSlots: override.openingSlots ? (JSON.parse(override.openingSlots) as string[]) : null,
  });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const admin = await getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const { date } = await params;
  const dateObj = new Date(date + 'T00:00:00.000Z');
  const body = await req.json();

  const override = await prisma.dayOverride.upsert({
    where: { date: dateObj },
    update: {
      closed: body.closed ?? false,
      openingSlots: body.openingSlots ? JSON.stringify(body.openingSlots) : null,
    },
    create: {
      date: dateObj,
      closed: body.closed ?? false,
      openingSlots: body.openingSlots ? JSON.stringify(body.openingSlots) : null,
    },
  });

  return NextResponse.json({
    closed: override.closed,
    openingSlots: override.openingSlots ? (JSON.parse(override.openingSlots) as string[]) : null,
  });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const admin = await getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const { date } = await params;
  const dateObj = new Date(date + 'T00:00:00.000Z');

  try {
    await prisma.dayOverride.delete({ where: { date: dateObj } });
  } catch {
    // Not found — ignore
  }

  return NextResponse.json({ success: true });
}
