import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromCookies } from "@/lib/auth";
import {
  getTables,
  getTotalTableCapacity,
  computeServiceTurns,
} from "@/lib/tables";

function addMinutes(time: string, mins: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + mins;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

export async function GET(req: NextRequest) {
  const admin = await getAdminFromCookies();
  if (!admin)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const url = new URL(req.url);
  const fromStr =
    url.searchParams.get("from") ?? new Date().toISOString().split("T")[0];
  const days = Math.min(parseInt(url.searchParams.get("days") ?? "28"), 56);

  // Global settings
  const settings = await prisma.restaurantSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });

  const globalMealDuration = settings.mealDuration; // en minutes, multiple de 30
  const globalOpeningDays: number[] = JSON.parse(settings.openingDays);
  const globalSlots: string[] = JSON.parse(settings.openingSlots);

  // Couverts disponibles = calculés à partir des tables, de la durée d'un repas et des horaires
  const tables = await getTables();
  const totalTableCapacity = getTotalTableCapacity(tables);

  const fromDate = new Date(fromStr + "T00:00:00.000Z");
  const toDate = new Date(fromDate.getTime() + days * 86_400_000);

  // Overrides in range
  const overrides = await prisma.dayOverride.findMany({
    where: { date: { gte: fromDate, lt: toDate } },
  });
  const overrideByDate = new Map(
    overrides.map((o) => [o.date.toISOString().split("T")[0], o]),
  );

  const now = new Date();

  // Reservations in range - SEULEMENT CONFIRMED et PENDING_PAYMENT non expirés
  // PENDING_PAYMENT expirés (transactionExpireAt dépassé) sont ignorés
  const reservations = await prisma.reservation.findMany({
    where: {
      date: { gte: fromDate, lt: toDate },
      OR: [
        { status: "CONFIRMED" },
        {
          AND: [
            { status: "PENDING_PAYMENT" },
            {
              OR: [
                { transactionExpireAt: { gt: now } },
                { transactionExpireAt: null },
              ],
            },
          ],
        },
      ],
    },
    select: { date: true, guests: true },
  });

  const resByDate: Record<string, { guests: number; count: number }> = {};
  for (const r of reservations) {
    const d = r.date.toISOString().split("T")[0];
    if (!resByDate[d]) resByDate[d] = { guests: 0, count: 0 };
    resByDate[d].guests += r.guests;
    resByDate[d].count += 1;
  }

  const result = [];

  for (let i = 0; i < days; i++) {
    const d = new Date(fromDate.getTime() + i * 86_400_000);
    const dateStr = d.toISOString().split("T")[0];
    const dow = d.getUTCDay(); // 0=Sun, 1=Mon … 6=Sat
    const override = overrideByDate.get(dateStr) ?? null;
    const isGloballyOpen = globalOpeningDays.includes(dow);

    let effectiveOpen: boolean;
    let effectiveSlots: string[];

    if (override) {
      effectiveOpen = !override.closed;
      effectiveSlots = override.openingSlots
        ? (JSON.parse(override.openingSlots) as string[])
        : globalSlots;
    } else {
      effectiveOpen = isGloballyOpen;
      effectiveSlots = globalSlots;
    }

    const slots = effectiveOpen ? effectiveSlots : [];
    // Lunch = slots before 15h, dinner = 15h and after
    const lunchSlots = slots.filter((s) => parseInt(s) < 15);
    const dinnerSlots = slots.filter((s) => parseInt(s) >= 15);

    const lunchOpen = lunchSlots.length > 0 ? lunchSlots[0] : null;
    // La fermeture = dernier créneau + durée d'un repas
    const lunchClose =
      lunchSlots.length > 0
        ? addMinutes(lunchSlots[lunchSlots.length - 1], globalMealDuration)
        : null;
    const dinnerOpen = dinnerSlots.length > 0 ? dinnerSlots[0] : null;
    const dinnerClose =
      dinnerSlots.length > 0
        ? addMinutes(dinnerSlots[dinnerSlots.length - 1], globalMealDuration)
        : null;

    // Capacité journalière = couverts totaux des tables × nombre de tours possibles par service
    // (basé sur l'amplitude des créneaux du service et la durée d'un repas)
    const lunchTurns = computeServiceTurns(lunchSlots, globalMealDuration);
    const dinnerTurns = computeServiceTurns(dinnerSlots, globalMealDuration);
    const totalCapacity = totalTableCapacity * (lunchTurns + dinnerTurns);
    const dayStats = resByDate[dateStr] ?? { guests: 0, count: 0 };

    result.push({
      date: dateStr,
      dayOfWeek: dow,
      isGloballyOpen,
      hasOverride: override !== null,
      override: override
        ? {
            closed: override.closed,
            openingSlots: override.openingSlots
              ? (JSON.parse(override.openingSlots) as string[])
              : null,
          }
        : null,
      effectiveOpen,
      effectiveSlots,
      mealDuration: globalMealDuration,
      lunchOpen,
      lunchClose,
      dinnerOpen,
      dinnerClose,
      totalCapacity,
      reservedGuests: dayStats.guests,
      reservationCount: dayStats.count,
    });
  }

  return NextResponse.json(result);
}
