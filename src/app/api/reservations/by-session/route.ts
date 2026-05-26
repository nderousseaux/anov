import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// SYSTEME DE PAIEMENT COMMENTE POUR L'INSTANT
// Le CMS est fonctionnel coté admin, le système de paiement sera activé ultérieurement

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id');
  if (!sessionId) {
    return NextResponse.json({ error: 'systeme de paiement temporairement desactive' }, { status: 400 });
  }

  // SYSTEME DE PAIEMENT DESACTIVE - Pas de réservations via Stripe pour l'instant
  return NextResponse.json({
    error: 'Systeme de paiement temporairement desactive. Veuillez utiliser le CMS admin.',
    testMode: true
  }, { status: 404 });

  /* Code commenté pour l'instant
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
  */
}
