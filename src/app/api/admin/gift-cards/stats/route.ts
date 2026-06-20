import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromCookies } from '@/lib/auth';

export async function GET() {
  const admin = await getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const now = new Date();

  // Compter SEULEMENT les cartes à afficher (exclure les transactions expirées à 10min)
  // Les cartes avec IN_PROGRESS_PAYMENT + transactionExpireAt dépassé ne doivent JAMAIS s'afficher
  // Mais leur statut reste IN_PROGRESS_PAYMENT en base (paiement non abouti)

  // Total émis = toutes les cartes SAUF celles avec transaction expirée (10 min)
  // Prisma: on utilise AND avec un tableau pour combiner plusieurs conditions
  const total = await prisma.giftCard.count({
    where: {
      AND: [
        {
          NOT: {
            status: 'IN_PROGRESS_PAYMENT',
            transactionExpireAt: { lt: now },
          },
        },
      ],
    },
  });

  // Actifs = cartes ACTIVE ou IN_PROGRESS_PAYMENT (sans transaction expirée)
  // Prisma: on combine les conditions avec AND, et OR avec OR (majuscule)
  const activeCount = await prisma.giftCard.count({
    where: {
      AND: [
        {
          OR: [
            { status: 'ACTIVE' },
            { status: 'IN_PROGRESS_PAYMENT' },
          ],
        },
        {
          OR: [
            { transactionExpireAt: { gt: now } },
            { transactionExpireAt: null },
          ],
        },
      ],
    },
  });

  // Expirés = statut EXPIRED (date d'expiration 1 an dépassée)
  const expiredCount = await prisma.giftCard.count({
    where: { status: 'EXPIRED' },
  });

  // En cours de paiement = IN_PROGRESS_PAYMENT sans transaction expirée
  const inProgressCount = await prisma.giftCard.count({
    where: {
      AND: [
        { status: 'IN_PROGRESS_PAYMENT' },
        { transactionExpireAt: { gt: now } },
      ],
    },
  });

  // Montant actif = somme des montants des cartes à afficher (exclure les EXPIRED, USED et les transactions expirées)
  const totalAmountResult = await prisma.giftCard.aggregate({
    _sum: { amount: true },
    where: {
      AND: [
        {
          NOT: {
            status: 'IN_PROGRESS_PAYMENT',
            transactionExpireAt: { lt: now },
          },
        },
        {
          status: { notIn: ['EXPIRED', 'USED'] },
        },
      ],
    },
  });

  return NextResponse.json({
    totalIssued: total,
    totalAmount: totalAmountResult._sum.amount || 0,
    active: activeCount,
    expired: expiredCount,
    inProgress: inProgressCount,
  });
}
