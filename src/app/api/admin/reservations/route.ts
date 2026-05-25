import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromCookies } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const admin = await getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const dateStr = searchParams.get('date');
  const status = searchParams.get('status');
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const perPage = 25;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (dateStr) {
    const d = new Date(dateStr);
    const start = new Date(d); start.setHours(0, 0, 0, 0);
    const end = new Date(d); end.setHours(23, 59, 59, 999);
    where.date = { gte: start, lte: end };
  }

  const [total, reservations] = await Promise.all([
    prisma.reservation.count({ where }),
    prisma.reservation.findMany({
      where,
      orderBy: { date: 'asc' },
      skip: (page - 1) * perPage,
      take: perPage,

    }),
  ]);

  return NextResponse.json({ data: reservations, total, page, pageSize: perPage });
}

export async function PATCH(req: NextRequest) {
  const admin = await getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const { id, status } = await req.json();
  const allowed = ['CONFIRMED', 'CANCELLED', 'COMPLETED'];
  if (!id || !allowed.includes(status)) {
    return NextResponse.json({ error: 'Paramètres invalides' }, { status: 400 });
  }

  const updated = await prisma.reservation.update({
    where: { id },
    data: { status },
  });
  return NextResponse.json(updated);
}
