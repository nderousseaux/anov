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
 * A reservation at time R with duration D occupies all slots S where R <= S < R + D.
 */
function buildCoverageMap(
  reservations: { date: Date; guests: number }[],
  effectiveSlots: string[],
  mealDuration: number,
): Record<string, number> {
  const coverage: Record<string, number> = {};
  for (const r of reservations) {
    const resMin = r.date.getUTCHours() * 60 + r.date.getUTCMinutes();
    for (const slot of effectiveSlots) {
      const slotMin = slotToMinutes(slot);
      if (slotMin >= resMin && slotMin < resMin + mealDuration) {
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

  const reservations = await prisma.reservation.findMany({
    where: { date: { gte: dayStart, lte: dayEnd }, status: 'CONFIRMED' },
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

  const reservations = await prisma.reservation.findMany({
    where: { date: { gte: dayStart, lte: dayEnd }, status: 'CONFIRMED' },
    select: { date: true, guests: true },
  });

  const coverage = buildCoverageMap(reservations, effectiveSlots, config.mealDuration);
  return effectiveSlots.map((slot) => ({
    time: slot,
    available: Math.max(0, effectiveMaxCovers - (coverage[slot] ?? 0)),
  }));
}
