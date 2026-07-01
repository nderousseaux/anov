import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromCookies } from '@/lib/auth';

export async function GET() {
  const admin = await getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const tables = await prisma.table.findMany({
    orderBy: { capacity: 'asc' },
    select: { id: true, name: true, capacity: true, posX: true, posY: true },
  });

  return NextResponse.json(tables);
}
