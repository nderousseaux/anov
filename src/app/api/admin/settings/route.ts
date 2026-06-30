import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromCookies } from '@/lib/auth';

export async function GET() {
  const admin = await getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const settings = await prisma.restaurantSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });

  return NextResponse.json({
    maxCovers: settings.maxCovers,
    mealDuration: settings.mealDuration,
    openingDays: JSON.parse(settings.openingDays) as number[],
    openingSlots: JSON.parse(settings.openingSlots) as string[],
    depositPerGuestCents: settings.depositPerGuestCents,
    daysBeforeReminder: settings.daysBeforeReminder,
  });
}

export async function PUT(req: NextRequest) {
  const admin = await getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const body = await req.json();
  const { maxCovers, mealDuration, openingDays, openingSlots, depositPerGuestCents, daysBeforeReminder } = body;

  if (
    typeof maxCovers !== 'number' ||
    maxCovers < 1 ||
    typeof mealDuration !== 'number' ||
    mealDuration < 30 ||
    mealDuration % 30 !== 0 ||
    !Array.isArray(openingDays) ||
    openingDays.some((d: unknown) => typeof d !== 'number' || d < 0 || d > 6) ||
    !Array.isArray(openingSlots) ||
    openingSlots.some((s: unknown) => typeof s !== 'string') ||
    typeof depositPerGuestCents !== 'number' ||
    depositPerGuestCents < 0 ||
    typeof daysBeforeReminder !== 'number' ||
    daysBeforeReminder < 0 ||
    daysBeforeReminder > 30
  ) {
    return NextResponse.json({ error: 'Paramètres invalides' }, { status: 400 });
  }

  // Lire les paramètres actuels pour détecter ce qui est supprimé
  const current = await prisma.restaurantSettings.findFirst({ where: { id: 1 } });
  const currentDays: number[] = current ? (JSON.parse(current.openingDays) as number[]) : [];
  const currentSlots: string[] = current ? (JSON.parse(current.openingSlots) as string[]) : [];

  const removedDays = currentDays.filter((d) => !(openingDays as number[]).includes(d));
  const removedSlots = currentSlots.filter((s) => !(openingSlots as string[]).includes(s));

  if (removedDays.length > 0 || removedSlots.length > 0) {
    const now = new Date();
    const upcoming = await prisma.reservation.findMany({
      where: {
        date: { gt: now },
        status: 'CONFIRMED',
      },
      select: { date: true },
    });

    const impactedByDay: string[] = [];
    const impactedBySlot: string[] = [];

    for (const r of upcoming) {
      const dow = r.date.getUTCDay();
      const h = String(r.date.getUTCHours()).padStart(2, '0');
      const m = String(r.date.getUTCMinutes()).padStart(2, '0');
      const slotStr = `${h}:${m}`;
      const dateStr = r.date.toISOString().split('T')[0];

      if (removedDays.includes(dow) && !impactedByDay.includes(dateStr))
        impactedByDay.push(dateStr);
      if (removedSlots.includes(slotStr) && !impactedBySlot.includes(dateStr))
        impactedBySlot.push(dateStr);
    }

    if (impactedByDay.length > 0 || impactedBySlot.length > 0) {
      const lines: string[] = [];
      if (impactedByDay.length > 0)
        lines.push(`Jours fermés avec réservations actives : ${impactedByDay.join(', ')}`);
      if (impactedBySlot.length > 0)
        lines.push(`Créneaux supprimés avec réservations actives : ${impactedBySlot.join(', ')}`);
      return NextResponse.json(
        { error: 'impact', message: lines.join('\n') },
        { status: 409 }
      );
    }
  }

  const settings = await prisma.restaurantSettings.upsert({
    where: { id: 1 },
    update: {
      maxCovers,
      mealDuration,
      openingDays: JSON.stringify(openingDays),
      openingSlots: JSON.stringify(openingSlots),
      depositPerGuestCents,
      daysBeforeReminder,
    },
    create: {
      id: 1,
      maxCovers,
      mealDuration,
      openingDays: JSON.stringify(openingDays),
      openingSlots: JSON.stringify(openingSlots),
      depositPerGuestCents,
      daysBeforeReminder,
    },
  });

  return NextResponse.json({
    maxCovers: settings.maxCovers,
    mealDuration: settings.mealDuration,
    openingDays: JSON.parse(settings.openingDays) as number[],
    openingSlots: JSON.parse(settings.openingSlots) as string[],
    depositPerGuestCents: settings.depositPerGuestCents,
    daysBeforeReminder: settings.daysBeforeReminder,
  });
}
