import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromCookies } from '@/lib/auth';

export async function GET() {
  const admin = await getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const [total, active, expired, totalAmount] = await Promise.all([
    prisma.giftCard.count(),
    prisma.giftCard.count({ where: { status: 'ACTIVE' } }),
    prisma.giftCard.count({ where: { status: 'EXPIRED' } }),
    prisma.giftCard.aggregate({
      _sum: { amount: true },
    }),
  ]);

  return NextResponse.json({
    totalIssued: total,
    totalAmount: totalAmount._sum.amount || 0,
    active,
    expired,
  });
}
