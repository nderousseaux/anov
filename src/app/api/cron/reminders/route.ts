import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendReminderEmail } from '@/lib/email';
import { sendSmsReminder } from '@/lib/sms';

// Protégé par un secret pour appels Vercel Cron
export async function GET(req: NextRequest) {
  const cronSecret = req.headers.get('x-cron-secret');
  if (process.env.CRON_SECRET && cronSecret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const now = new Date();
  const in48h = new Date(now.getTime() + 48 * 60 * 60 * 1000);
  const in47h = new Date(now.getTime() + 47 * 60 * 60 * 1000);

  // Réservations dans la fenêtre 47h–48h
  const reservations = await prisma.reservation.findMany({
    where: {
      status: 'CONFIRMED',
      date: { gte: in47h, lte: in48h },
      reminderEmailSent: false,
    },
  });

  let emailsSent = 0;
  let smsSent = 0;

  for (const r of reservations) {
    const formattedDate = r.date.toLocaleDateString('fr-FR', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });
    const time = r.date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
    const cancelUrl = `${BASE_URL}/reservation/cancel?token=${r.cancelToken}`;

    try {
      await sendReminderEmail({
        to: r.email,
        name: r.name,
        date: formattedDate,
        time,
        guests: r.guests,
        cancelUrl,
        icsDate: r.date.toISOString(),
      });
      await prisma.reservation.update({
        where: { id: r.id },
        data: { reminderEmailSent: true },
      });
      emailsSent++;
    } catch (err) {
      console.error(`[Cron] Email failed for ${r.id}`, err);
    }

    if (r.wantsSmsReminder && r.phone) {
      try {
        await sendSmsReminder({ to: r.phone, name: r.name, date: formattedDate, time });
        await prisma.reservation.update({
          where: { id: r.id },
          data: { reminderSmsSent: true },
        });
        smsSent++;
      } catch (err) {
        console.error(`[Cron] SMS failed for ${r.id}`, err);
      }
    }
  }

  return NextResponse.json({ emailsSent, smsSent });
}
