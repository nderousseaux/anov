import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendReminderEmail } from "@/lib/email";
import { sendSmsReminder } from "@/lib/sms";

// Protégé par un secret pour appels Vercel Cron
export async function GET(req: NextRequest) {
  const cronSecret = req.headers.get("x-cron-secret");
  if (process.env.CRON_SECRET && cronSecret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  // Récupérer la durée du repas et le nombre de jours avant la réservation
  const restaurantSettings = await prisma.restaurantSettings.findUnique({
    where: { id: 1 },
  });
  const mealDuration = restaurantSettings?.mealDuration || 90;
  const daysBeforeReminder = restaurantSettings?.daysBeforeReminder || 1;

  const now = new Date();

  // On cherche les réservations à envoyer en rappel
  // Elles doivent être à J + daysBeforeReminder (par défaut 1 = demain)
  const targetDate = new Date(now);
  targetDate.setDate(targetDate.getDate() + daysBeforeReminder);

  // Définir la plage horaire : de 00:00 à 23:59 du jour ciblé
  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);

  // Réservations pour le jour ciblé
  // Conditions :
  // - status = CONFIRMED (pas annulée, pas expirée)
  // - reminderEmailSent = false ET reminderSmsSent = false (pas encore de rappel envoyé, quel que soit le canal)
  // - Si l'utilisateur a réservé aujourd'hui (quelque soit l'heure), pas de rappel
  const reservations = await prisma.reservation.findMany({
    where: {
      status: "CONFIRMED",
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
      reminderEmailSent: false,
      reminderSmsSent: false,
    },
  });

  let emailsSent = 0;
  let smsSent = 0;

  for (const r of reservations) {
    // Vérifier si la réservation a été faite aujourd'hui (quelque soit l'heure)
    const reservationCreatedAt = new Date(r.createdAt);
    const isSameDayReservation =
      reservationCreatedAt.getDate() === now.getDate() &&
      reservationCreatedAt.getMonth() === now.getMonth() &&
      reservationCreatedAt.getFullYear() === now.getFullYear();

    if (isSameDayReservation) {
      console.log(`[Cron] Réservation ${r.id} exclue : réservée aujourd'hui`);
      continue;
    }

    const formattedDate = r.date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const time = r.date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const BASE_URL =
      process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const cancelUrl = `${BASE_URL}/reservation/cancel?token=${r.cancelToken}`;

    // Si l'utilisateur a renseigné un numéro de téléphone, on envoie un SMS de rappel
    // à la place du mail (mêmes modalités). Sinon, on envoie le mail.
    if (r.phone) {
      try {
        await sendSmsReminder({
          to: r.phone,
          name: r.name,
          date: formattedDate,
          time,
          guests: r.guests,
          daysBefore: daysBeforeReminder,
        });
        await prisma.reservation.update({
          where: { id: r.id },
          data: { reminderSmsSent: true },
        });
        smsSent++;
        console.log(
          `[Cron] SMS de rappel envoyé à ${r.phone} pour ${formattedDate}`,
        );
      } catch (err) {
        console.error(`[Cron] SMS failed for ${r.id}`, err);
      }
      continue;
    }

    try {
      await sendReminderEmail({
        to: r.email,
        name: r.name,
        date: formattedDate,
        time,
        guests: r.guests,
        cancelUrl,
        icsDate: r.date.toISOString(),
        durationMinutes: mealDuration,
        daysBefore: daysBeforeReminder,
      });
      await prisma.reservation.update({
        where: { id: r.id },
        data: { reminderEmailSent: true },
      });
      emailsSent++;
      console.log(
        `[Cron] Email de rappel envoyé à ${r.email} pour ${formattedDate}`,
      );
    } catch (err) {
      console.error(`[Cron] Email failed for ${r.id}`, err);
    }
  }

  return NextResponse.json({
    emailsSent,
    smsSent,
    dateTarget: targetDate.toISOString().split("T")[0],
  });
}
