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
  });
}

export async function PUT(req: NextRequest) {
  const admin = await getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const body = await req.json();
  const { maxCovers, mealDuration, openingDays, openingSlots } = body;

  if (
    typeof maxCovers !== 'number' ||
    maxCovers < 1 ||
    typeof mealDuration !== 'number' ||
    mealDuration < 30 ||
    mealDuration % 30 !== 0 ||
    !Array.isArray(openingDays) ||
    openingDays.some((d: unknown) => typeof d !== 'number' || d < 0 || d > 6) ||
    !Array.isArray(openingSlots) ||
    openingSlots.some((s: unknown) => typeof s !== 'string')
  ) {
    return NextResponse.json({ error: 'Paramètres invalides' }, { status: 400 });
  }

  const settings = await prisma.restaurantSettings.upsert({
    where: { id: 1 },
    update: {
      maxCovers,
      mealDuration,
      openingDays: JSON.stringify(openingDays),
      openingSlots: JSON.stringify(openingSlots),
    },
    create: {
      id: 1,
      maxCovers,
      mealDuration,
      openingDays: JSON.stringify(openingDays),
      openingSlots: JSON.stringify(openingSlots),
    },
  });

  return NextResponse.json({
    maxCovers: settings.maxCovers,
    mealDuration: settings.mealDuration,
    openingDays: JSON.parse(settings.openingDays) as number[],
    openingSlots: JSON.parse(settings.openingSlots) as string[],
  });
}
