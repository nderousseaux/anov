import { prisma } from './prisma';

const DEFAULT_SLOTS = [
  '12:00', '12:30', '13:00', '13:30',
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
];

const DEFAULT_OPENING_DAYS = [2, 3, 4, 5, 6]; // Mar–Sam

const DEFAULT_MEAL_DURATION = 90; // minutes

type EffectiveConfig = { effectiveSlots: string[]; effectiveMaxCovers: number; mealDuration: number };

async function getEffectiveConfig(dateStr: string): Promise<EffectiveConfig | null> {
  const dateObj = new Date(dateStr + 'T00:00:00.000Z');
  const dow = dateObj.getUTCDay();

  const [dbSettings, override] = await Promise.all([
    prisma.restaurantSettings.findFirst({ where: { id: 1 } }),
    prisma.dayOverride.findUnique({ where: { date: dateObj } }),
  ]);

  const globalMaxCovers: number = dbSettings?.maxCovers ?? 20;
  const mealDuration: number = dbSettings?.mealDuration ?? DEFAULT_MEAL_DURATION;
  const globalOpeningDays: number[] = dbSettings
    ? (JSON.parse(dbSettings.openingDays) as number[])
    : DEFAULT_OPENING_DAYS;
  const globalSlots: string[] = dbSettings
    ? (JSON.parse(dbSettings.openingSlots) as string[])
    : DEFAULT_SLOTS;

  if (override) {
    if (override.closed) return null;
    return {
      effectiveSlots: override.openingSlots
        ? (JSON.parse(override.openingSlots) as string[])
        : globalSlots,
      effectiveMaxCovers: override.maxCovers ?? globalMaxCovers,
      mealDuration,
    };
  }

  if (!globalOpeningDays.includes(dow)) return null;
  return { effectiveSlots: globalSlots, effectiveMaxCovers: globalMaxCovers, mealDuration };
}

/**
 * Converts a "HH:MM" slot string to minutes since midnight.
 */
function slotToMinutes(slot: string): number {
  const [h, m] = slot.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Builds a map of slot → total guests occupying that slot, accounting for meal duration.
 * A reservation at time R with duration D occupies all slots S where:
 * - R - mealDuration <= S < R + mealDuration
 * This ensures that if a group arrives late (at R - mealDuration), they don't find
 * the table already taken - the blocking window extends X minutes before AND after.
 */
function buildCoverageMap(
  reservations: { date: Date; guests: number }[],
  effectiveSlots: string[],
  mealDuration: number,
): Record<string, number> {
  const coverage: Record<string, number> = {};
  for (const r of reservations) {
    const resMin = r.date.getUTCHours() * 60 + r.date.getUTCMinutes();
    // Blocking window: X minutes BEFORE the reservation time AND X minutes AFTER
    const startMin = resMin - mealDuration;
    const endMin = resMin + mealDuration;
    for (const slot of effectiveSlots) {
      const slotMin = slotToMinutes(slot);
      if (slotMin >= startMin && slotMin < endMin) {
        coverage[slot] = (coverage[slot] ?? 0) + r.guests;
      }
    }
  }
  return coverage;
}

/**
 * Returns a list of available time slots for a given date.
 * Respects global settings (openingDays, openingSlots, maxCovers)
 * and per-day DayOverride (closed, custom slots, custom maxCovers).
 */
export async function getAvailableSlots(dateStr: string): Promise<string[]> {
  const config = await getEffectiveConfig(dateStr);
  if (!config) return [];
  const { effectiveSlots, effectiveMaxCovers, mealDuration } = config;

  const dayStart = new Date(dateStr + 'T00:00:00.000Z');
  const dayEnd = new Date(dateStr + 'T23:59:59.999Z');
  const now = new Date();

  // Compter les réservations CONFIRMED et PENDING_PAYMENT non expirés
  // Exclure les PENDING_PAYMENT avec transactionExpireAt dépassé
  const reservations = await prisma.reservation.findMany({
    where: {
      date: { gte: dayStart, lte: dayEnd },
      OR: [
        { status: 'CONFIRMED' },
        {
          AND: [
            { status: 'PENDING_PAYMENT' },
            { OR: [{ transactionExpireAt: { gt: now } }, { transactionExpireAt: null }] },
          ],
        },
      ],
    },
    select: { date: true, guests: true },
  });

  const coverage = buildCoverageMap(reservations, effectiveSlots, mealDuration);
  return effectiveSlots.filter((slot) => (coverage[slot] ?? 0) + 1 <= effectiveMaxCovers);
}

/**
 * Returns all configured slots for a given date with the number of remaining available places.
 * Closed days / slots return an empty array.
 */
export async function getSlotsWithAvailability(dateStr: string): Promise<{ time: string; available: number }[]> {
  const config = await getEffectiveConfig(dateStr);
  if (!config) return [];
  let { effectiveSlots, effectiveMaxCovers } = config;

  // Pour le jour J : supprimer les services déjà entamés
  const now = new Date();
  const localToday = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  if (dateStr === localToday) {
    const currentMin = now.getHours() * 60 + now.getMinutes();
    // Grouper les créneaux en services (pause > 2h = nouveau service)
    const sorted = [...effectiveSlots].sort();
    const services: string[][] = sorted.length ? [[sorted[0]]] : [];
    for (let i = 1; i < sorted.length; i++) {
      const [ph, pm] = sorted[i - 1].split(':').map(Number);
      const [ch, cm] = sorted[i].split(':').map(Number);
      if ((ch * 60 + cm) - (ph * 60 + pm) > 120) services.push([]);
      services[services.length - 1].push(sorted[i]);
    }
    // Garder uniquement les services dont le premier créneau est dans le futur
    effectiveSlots = services
      .filter((svc) => {
        const [h, m] = svc[0].split(':').map(Number);
        return h * 60 + m > currentMin;
      })
      .flat();
  }

  const dayStart = new Date(dateStr + 'T00:00:00.000Z');
  const dayEnd = new Date(dateStr + 'T23:59:59.999Z');

  // Compter les réservations CONFIRMED et PENDING_PAYMENT non expirés
  // Exclure les PENDING_PAYMENT avec transactionExpireAt dépassé
  const reservations = await prisma.reservation.findMany({
    where: {
      date: { gte: dayStart, lte: dayEnd },
      OR: [
        { status: 'CONFIRMED' },
        {
          AND: [
            { status: 'PENDING_PAYMENT' },
            { OR: [{ transactionExpireAt: { gt: now } }, { transactionExpireAt: null }] },
          ],
        },
      ],
    },
    select: { date: true, guests: true },
  });

  const coverage = buildCoverageMap(reservations, effectiveSlots, config.mealDuration);
  return effectiveSlots.map((slot) => ({
    time: slot,
    available: Math.max(0, effectiveMaxCovers - (coverage[slot] ?? 0)),
  }));
}

/**
 * Returns the list of date strings (YYYY-MM-DD) in a given month that have no availability.
 * Only 3 DB queries regardless of the number of days in the month.
 */
export async function getUnavailableDatesForMonth(monthStr: string): Promise<string[]> {
  const [year, month] = monthStr.split('-').map(Number);
  // new Date(year, month, 0) → last day of the 1-indexed month (JS month index is month-1, day 0 = last day of month-1)
  const daysInMonth = new Date(year, month, 0).getDate();

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const paddedMonth = String(month).padStart(2, '0');
  const monthStart = new Date(`${year}-${paddedMonth}-01T00:00:00.000Z`);
  const monthEnd = new Date(`${year}-${paddedMonth}-${String(daysInMonth).padStart(2, '0')}T23:59:59.999Z`);

  const [dbSettings, overrides, reservations] = await Promise.all([
    prisma.restaurantSettings.findFirst({ where: { id: 1 } }),
    prisma.dayOverride.findMany({ where: { date: { gte: monthStart, lte: monthEnd } } }),
    // Compter les réservations CONFIRMED et PENDING_PAYMENT non expirés
    prisma.reservation.findMany({
      where: {
        date: { gte: monthStart, lte: monthEnd },
        OR: [
          { status: 'CONFIRMED' },
          {
            AND: [
              { status: 'PENDING_PAYMENT' },
              { OR: [{ transactionExpireAt: { gt: now } }, { transactionExpireAt: null }] },
            ],
          },
        ],
      },
      select: { date: true, guests: true },
    }),
  ]);

  const globalMaxCovers: number = dbSettings?.maxCovers ?? 20;
  const mealDuration: number = dbSettings?.mealDuration ?? DEFAULT_MEAL_DURATION;
  const globalOpeningDays: number[] = dbSettings
    ? (JSON.parse(dbSettings.openingDays) as number[])
    : DEFAULT_OPENING_DAYS;
  const globalSlots: string[] = dbSettings
    ? (JSON.parse(dbSettings.openingSlots) as string[])
    : DEFAULT_SLOTS;

  const overrideByDate = new Map<string, (typeof overrides)[0]>();
  for (const o of overrides) {
    overrideByDate.set(o.date.toISOString().split('T')[0], o);
  }

  const resByDate = new Map<string, { date: Date; guests: number }[]>();
  for (const r of reservations) {
    const d = r.date.toISOString().split('T')[0];
    if (!resByDate.has(d)) resByDate.set(d, []);
    resByDate.get(d)!.push(r);
  }

  const today = new Date();
  const currentMin = today.getHours() * 60 + today.getMinutes();

  const unavailable: string[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${paddedMonth}-${String(day).padStart(2, '0')}`;
    if (dateStr < todayStr) continue;

    const dow = new Date(dateStr + 'T00:00:00.000Z').getUTCDay();
    const override = overrideByDate.get(dateStr);

    let effectiveSlots: string[];
    let effectiveMaxCovers: number;

    if (override) {
      if (override.closed) { unavailable.push(dateStr); continue; }
      effectiveSlots = override.openingSlots
        ? (JSON.parse(override.openingSlots) as string[])
        : globalSlots;
      effectiveMaxCovers = override.maxCovers ?? globalMaxCovers;
    } else {
      if (!globalOpeningDays.includes(dow)) { unavailable.push(dateStr); continue; }
      effectiveSlots = globalSlots;
      effectiveMaxCovers = globalMaxCovers;
    }

    // Pour aujourd'hui, filtrer les créneaux déjà passés
    let filteredSlots = effectiveSlots;
    if (dateStr === todayStr) {
      filteredSlots = effectiveSlots.filter((slot) => {
        const [h, m] = slot.split(':').map(Number);
        return h * 60 + m > currentMin;
      });
    }

    const coverage = buildCoverageMap(resByDate.get(dateStr) ?? [], filteredSlots, mealDuration);
    const hasAvailability = filteredSlots.some((slot) => (coverage[slot] ?? 0) < effectiveMaxCovers);
    if (!hasAvailability) unavailable.push(dateStr);
  }

  return unavailable;
}
