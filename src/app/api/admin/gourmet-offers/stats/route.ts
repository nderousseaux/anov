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
  const GourmetOfferStatus = $Enums.GourmetOfferStatus;

  // Compter SEULEMENT les offres à afficher (exclure les transactions expirées à 10min)
  const total = await prisma.gourmetOffer.count({
    where: {
      OR: [
        { status: { not: GourmetOfferStatus.IN_PROGRESS_PAYMENT } },
        { transactionExpireAt: { gt: now } },
      ],
    },
  });

  // Actifs = SEULEMENT offres ACTIVE non expirées
  const activeCount = await prisma.gourmetOffer.count({
    where: {
      status: GourmetOfferStatus.ACTIVE,
      expiresAt: { gt: now },
    },
  });

  // Expirés =
  // 1. Offres avec le statut EXPIRED en base
  // 2. Offres ACTIVE mais dont expiresAt est dépassé (1 an)
  const expiredCount = await prisma.gourmetOffer.count({
    where: {
      OR: [
        { status: GourmetOfferStatus.EXPIRED },
        {
          AND: [
            { status: GourmetOfferStatus.ACTIVE },
            { expiresAt: { lt: now } },
          ],
        },
      ],
    },
  });

  // En cours de paiement = IN_PROGRESS_PAYMENT sans transaction expirée
  const inProgressCount = await prisma.gourmetOffer.count({
    where: {
      AND: [
        { status: GourmetOfferStatus.IN_PROGRESS_PAYMENT },
        { transactionExpireAt: { gt: now } },
      ],
    },
  });

  // Montant actif = somme des prix des offres à afficher (exclure les EXPIRED, USED, les transactions expirées à 10min et les offres actives expirées à 1 an)
  const totalAmountResult = await prisma.gourmetOffer.aggregate({
    _sum: { price: true },
    where: {
      AND: [
        {
          OR: [
            { status: { not: GourmetOfferStatus.IN_PROGRESS_PAYMENT } },
            { transactionExpireAt: { gt: now } },
          ],
        },
        {
          status: {
            notIn: [GourmetOfferStatus.EXPIRED, GourmetOfferStatus.USED],
          },
        },
        { expiresAt: { gt: now } }, // Exclure les offres actives expirées
      ],
    },
  });

  return NextResponse.json({
    totalIssued: total,
    totalAmount: totalAmountResult._sum.price || 0,
    active: activeCount,
    expired: expiredCount,
    inProgress: inProgressCount,
  });
}
