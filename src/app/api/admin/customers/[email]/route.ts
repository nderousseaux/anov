import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromCookies } from '@/lib/auth';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  const admin = await getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const { email: rawEmail } = await params;
  const email = decodeURIComponent(rawEmail);

  const [reservations, giftCards, contactMessages, note] = await Promise.all([
    prisma.reservation.findMany({
      where: { email: { equals: email, mode: 'insensitive' } },
      orderBy: { date: 'desc' },
    }),
    prisma.giftCard.findMany({
      where: { recipientEmail: { equals: email, mode: 'insensitive' } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.contactMessage.findMany({
      where: { email: { equals: email, mode: 'insensitive' } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.customerNote.findUnique({
      where: { email: email.toLowerCase() },
    }),
  ]);

  return NextResponse.json({ reservations, giftCards, contactMessages, note });
}
