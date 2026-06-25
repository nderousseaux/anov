import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

  // Les réservations PENDING_PAYMENT avec transactionExpireAt dépassé ne peuvent pas être annulées
  // (elles sont automatiquement considérées comme expirées)
  const now = new Date();
  const isExpired = reservation.status === 'PENDING_PAYMENT' &&
                    reservation.transactionExpireAt &&
                    new Date(reservation.transactionExpireAt) < now;
  if (reservation.status === 'COMPLETED' || isExpired) {
    return NextResponse.json({ error: 'Réservation déjà passée' }, { status: 400 });
  }

  // Supprimer la réservation (au lieu de la marquer comme CANCELLED)
  // et ne pas envoyer d'email
  await prisma.reservation.delete({
    where: { id: reservation.id },
  });

  return NextResponse.json({ message: 'deleted' });
}
