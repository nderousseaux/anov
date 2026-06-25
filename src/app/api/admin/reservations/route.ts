import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromCookies } from '@/lib/auth';
import { sendCancellationEmail } from '@/lib/email';

export async function GET(req: NextRequest) {
  const admin = await getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const dateStr = searchParams.get('date');
  const status = searchParams.get('status');
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const perPage = 25;

  const now = new Date();
  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (dateStr) {
    const d = new Date(dateStr);
    const start = new Date(d); start.setHours(0, 0, 0, 0);
    const end = new Date(d); end.setHours(23, 59, 59, 999);
    where.date = { gte: start, lte: end };
  }

  // Exclure les réservations expirées (PENDING_PAYMENT avec transactionExpireAt dépassé)
  // Elles restent en PENDING_PAYMENT en base mais ne sont pas affichées
  where.AND = [
    {
      OR: [
        { status: { not: 'PENDING_PAYMENT' } },
        { transactionExpireAt: { gt: now } },
        { transactionExpireAt: null },
      ],
    },
  ];

  // Compter les réservations (CONFIRMED + PENDING_PAYMENT non expirés) pour les disponibilités
  const reservationCountWhere = {
    ...where,
    AND: [
      {
        OR: [
          { status: 'CONFIRMED' },
          {
            AND: [
              { status: 'PENDING_PAYMENT' },
              { OR: [{ transactionExpireAt: { gt: now } }, { transactionExpireAt: null }] },
            ],
          },
        ],
      },
    ],
  };

  // Compter SEULEMENT les réservations non expirées (CONFIRMED + PENDING_PAYMENT non expirés)
  // Pour les réservations affichées, on compte celles qui ne sont pas expirées
  const total = await prisma.reservation.count({
    where: {
      ...where,
      AND: [
        {
          OR: [
            { status: 'CONFIRMED' },
            {
              AND: [
                { status: 'PENDING_PAYMENT' },
                { OR: [{ transactionExpireAt: { gt: now } }, { transactionExpireAt: null }] },
              ],
            },
          ],
        },
      ],
    },
  });

  const reservations = await prisma.reservation.findMany({
    where,
    orderBy: { date: 'asc' },
    skip: (page - 1) * perPage,
    take: perPage,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      date: true,
      guests: true,
      status: true,
      specialRequest: true,
      wantsSmsReminder: true,
      transactionExpireAt: true,
      createdAt: true,
    },
  });

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
    select: {
      id: true,
      name: true,
      email: true,
      date: true,
      status: true,
    },
  });

  // Envoyer un email si la réservation est annulée
  if (status === 'CANCELLED' && updated.email) {
    const d = new Date(updated.date);
    const dateFr = d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
    const time = `${d.getUTCHours().toString().padStart(2, '0')}:${d.getUTCMinutes().toString().padStart(2, '0')}`;

    await sendCancellationEmail({
      to: updated.email,
      name: updated.name,
      date: dateFr,
      time: time,
    });
  }

  return NextResponse.json(updated);
}
