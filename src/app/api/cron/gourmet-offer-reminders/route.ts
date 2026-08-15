import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendGourmetOfferExpirationReminder } from "@/lib/email";

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

  // Rechercher les offres gourmandes :
  // - status = ACTIVE (seules les offres actives sont envoyées, pas IN_PROGRESS qui expire en 10min)
  // - expiresAt dans la journée de J + 30 jours (1 mois avant l'expiration)
  // - reminderEmailSent = false (pas encore de rappel envoyé)
  const gourmetOffers = await prisma.gourmetOffer.findMany({
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

  for (const offer of gourmetOffers) {
    const formattedExpiresAt = offer.expiresAt
      ? offer.expiresAt.toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "";

    if (offer.recipientEmail) {
      try {
        await sendGourmetOfferExpirationReminder({
          to: offer.recipientEmail,
          code: offer.code,
          offerName: offer.offerName,
          expiresAt: formattedExpiresAt,
        });

        await prisma.gourmetOffer.update({
          where: { id: offer.id },
          data: { reminderEmailSent: true },
        });

        emailsSent++;
        console.log(
          `[Cron Gourmet Offer] Email de rappel envoyé à ${offer.recipientEmail} pour le code ${offer.code}`,
        );
      } catch (err) {
        console.error(`[Cron Gourmet Offer] Email failed for ${offer.id}`, err);
      }
    }
  }

  return NextResponse.json({
    emailsSent,
    dateTarget: targetDate.toISOString().split("T")[0],
  });
}
