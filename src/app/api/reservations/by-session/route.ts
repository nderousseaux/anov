import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id');
  if (!sessionId) {
    return NextResponse.json({ error: 'session_id manquant' }, { status: 400 });
  }

  const reservation = await prisma.reservation.findUnique({
    where: { stripeSessionId: sessionId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      date: true,
      guests: true,
      status: true,
    },
  });

  if (!reservation) {
    return NextResponse.json({ error: 'Réservation introuvable' }, { status: 404 });
  }

  return NextResponse.json(reservation);
}
