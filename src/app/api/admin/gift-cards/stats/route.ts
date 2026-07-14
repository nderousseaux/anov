import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromCookies } from "@/lib/auth";
import { $Enums } from "@/generated/prisma";

export async function GET() {
  const admin = await getAdminFromCookies();
  if (!admin)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const now = new Date();

  // Utiliser les types Prisma pour éviter les erreurs d'enum
  const GiftCardStatus = $Enums.GiftCardStatus;

  // Compter SEULEMENT les cartes à afficher (exclure les transactions expirées à 10min)
  // Les cartes avec IN_PROGRESS_PAYMENT + transactionExpireAt dépassé ne doivent JAMAIS s'afficher
  // Mais leur statut reste IN_PROGRESS_PAYMENT en base (paiement non abouti)

  // Total émis = toutes les cartes SAUF celles avec transaction expirée (10 min)
  // Prisma: on utilise NOT avec OR pour exclure les transactions expirées
  const total = await prisma.giftCard.count({
    where: {
      OR: [
        { status: { not: GiftCardStatus.IN_PROGRESS_PAYMENT } },
        { transactionExpireAt: { gt: now } },
      ],
    },
  });

  // Actifs = SEULEMENT cartes ACTIVE non expirées (exclure les en cours de paiement et celles avec expiresAt dépassé)
  const activeCount = await prisma.giftCard.count({
    where: {
      status: GiftCardStatus.ACTIVE,
      expiresAt: { gt: now },
    },
  });

  // Expirés =
  // 1. Cartes avec le statut EXPIRED en base
  // 2. Cartes ACTIVE mais dont expiresAt est dépassé (1 an)
  const expiredCount = await prisma.giftCard.count({
    where: {
      OR: [
        { status: GiftCardStatus.EXPIRED },
        {
          AND: [{ status: GiftCardStatus.ACTIVE }, { expiresAt: { lt: now } }],
        },
      ],
    },
  });

  // En cours de paiement = IN_PROGRESS_PAYMENT sans transaction expirée
  const inProgressCount = await prisma.giftCard.count({
    where: {
      AND: [
        { status: GiftCardStatus.IN_PROGRESS_PAYMENT },
        { transactionExpireAt: { gt: now } },
      ],
    },
  });

  // Montant actif = somme des montants des cartes à afficher (exclure les EXPIRED, USED, les transactions expirées à 10min et les cartes actives expirées à 1 an)
  const totalAmountResult = await prisma.giftCard.aggregate({
    _sum: { amount: true },
    where: {
      AND: [
        {
          OR: [
            { status: { not: GiftCardStatus.IN_PROGRESS_PAYMENT } },
            { transactionExpireAt: { gt: now } },
          ],
        },
        { status: { notIn: [GiftCardStatus.EXPIRED, GiftCardStatus.USED] } },
        { expiresAt: { gt: now } }, // Exclure les cartes actives expirées
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
