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

  // Events in range
  const events = await prisma.event.findMany({
    where: {
      isActive: true,
      startDate: { lt: toDate },
      endDate: { gte: fromDate },
    },
    select: {
      id: true,
      titleFr: true,
      titleEn: true,
      titleDe: true,
      descriptionFr: true,
      descriptionEn: true,
      descriptionDe: true,
      startDate: true,
      endDate: true,
      startService: true,
      endService: true,
    },
  });

  // Group events by date with service granularity
  const eventsByDate: Record<string,
    {
      id: string;
      titleFr: string;
      titleEn: string;
      titleDe: string;
      descriptionFr: string;
      descriptionEn: string;
      descriptionDe: string;
      startDate: Date;
      endDate: Date;
      lunch: boolean;
      dinner: boolean
    }[]> = {};
  for (const e of events) {
    const start = new Date(e.startDate);
    const end = new Date(e.endDate);
    // Determine start and end service indices
    const startServiceIndex = e.startService === "lunch" ? 0 : e.startService === "dinner" ? 1 : 0; // null treated as lunch (start of day)
    const endServiceIndex = e.endService === "lunch" ? 0 : e.endService === "dinner" ? 1 : 1; // null treated as dinner (end of day)
    const startSlot = start.getTime() / (24 * 60 * 60 * 1000) * 2 + startServiceIndex;
    const endSlot = end.getTime() / (24 * 60 * 60 * 1000) * 2 + endServiceIndex;
    // Iterate over each slot from startSlot to endSlot inclusive
    for (let slot = Math.floor(startSlot); slot <= Math.floor(endSlot); slot++) {
      const dayNum = Math.floor(slot / 2);
      const slotIndex = slot % 2; // 0 = lunch, 1 = dinner
      const date = new Date(dayNum * 24 * 60 * 60 * 1000); // midnight of that day
      const dateStr = date.toISOString().split("T")[0];
      if (!eventsByDate[dateStr]) eventsByDate[dateStr] = [];
      // Mark which services this event covers for this date
      let existing = eventsByDate[dateStr].find(ev => ev.id === e.id);
      if (!existing) {
        existing = {
          id: e.id,
          titleFr: e.titleFr,
          titleEn: e.titleEn,
          titleDe: e.titleDe,
          descriptionFr: e.descriptionFr,
          descriptionEn: e.descriptionEn,
          descriptionDe: e.descriptionDe,
          startDate: e.startDate,
          endDate: e.endDate,
          lunch: false,
          dinner: false
        };
        eventsByDate[dateStr].push(existing);
      }
      if (slotIndex === 0) existing.lunch = true;
      else existing.dinner = true;
    }
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

    const dayEvents = eventsByDate[dateStr] ?? [];
    const formattedEvents = dayEvents.map((e) => ({
      id: e.id,
      titleFr: e.titleFr,
      titleEn: e.titleEn,
      titleDe: e.titleDe,
      descriptionFr: e.descriptionFr,
      descriptionEn: e.descriptionEn,
      descriptionDe: e.descriptionDe,
      startDate: e.startDate.toISOString(),
      endDate: e.endDate.toISOString(),
      lunch: e.lunch,
      dinner: e.dinner,
    }));

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
      events: formattedEvents,
    });
  }

  return NextResponse.json(result);
}
