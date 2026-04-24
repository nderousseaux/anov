import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendCancellationEmail } from '@/lib/email';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  if (!token) {
    return NextResponse.json({ error: 'Token manquant' }, { status: 400 });
  }

  const reservation = await prisma.reservation.findUnique({
    where: { cancelToken: token },
  });

  if (!reservation) {
    return NextResponse.json({ error: 'Réservation introuvable' }, { status: 404 });
  }

  if (reservation.status === 'CANCELLED') {
    return NextResponse.json({ message: 'already_cancelled' });
  }

  if (reservation.status === 'COMPLETED') {
    return NextResponse.json({ error: 'Réservation déjà passée' }, { status: 400 });
  }

  await prisma.reservation.update({
    where: { id: reservation.id },
    data: { status: 'CANCELLED' },
  });

  const formattedDate = reservation.date.toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  const time = reservation.date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  await sendCancellationEmail({
    to: reservation.email,
    name: reservation.name,
    date: formattedDate,
    time,
  });

  return NextResponse.json({ message: 'cancelled' });
}
