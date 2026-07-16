import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendGiftCardExpirationReminder } from "@/lib/email";

// Protégé par un secret pour appels Vercel Cron
export async function GET(req: NextRequest) {
  const cronSecret = req.headers.get("x-cron-secret");
  if (process.env.CRON_SECRET && cronSecret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const now = new Date();

  // Calculer la date cible : 30 jours à partir d'aujourd'hui
  const targetDate = new Date(now);
  targetDate.setDate(targetDate.getDate() + 30);

  // Définir la plage horaire : journée entière de J + 30 jours
  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);

  // Rechercher les bons cadeaux :
  // - status = ACTIVE (seuls les bons actifs sont envoyés, pas IN_PROGRESS qui expire en 15min)
  // - expiresAt dans la journée de J + 30 jours (1 mois avant l'expiration)
  // - reminderEmailSent = false (pas encore de rappel envoyé)
  const giftCards = await prisma.giftCard.findMany({
    where: {
      status: "ACTIVE",
      expiresAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
      reminderEmailSent: false,
      recipientEmail: {
        not: null,
      },
    },
  });

  let emailsSent = 0;

  for (const card of giftCards) {
    const formattedExpiresAt = card.expiresAt
      ? card.expiresAt.toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "";

    if (card.recipientEmail) {
      try {
        await sendGiftCardExpirationReminder({
          to: card.recipientEmail,
          code: card.code,
          amount: card.amount,
          expiresAt: formattedExpiresAt,
        });

        await prisma.giftCard.update({
          where: { id: card.id },
          data: { reminderEmailSent: true },
        });

        emailsSent++;
        console.log(
          `[Cron Gift Card] Email de rappel envoyé à ${card.recipientEmail} pour le code ${card.code}`,
        );
      } catch (err) {
        console.error(`[Cron Gift Card] Email failed for ${card.id}`, err);
      }
    }
  }

  return NextResponse.json({
    emailsSent,
    dateTarget: targetDate.toISOString().split("T")[0],
  });
}