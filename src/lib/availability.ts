import { prisma } from './prisma';

const DEFAULT_SLOTS = [
  '12:00', '12:30', '13:00', '13:30',
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
];

const DEFAULT_OPENING_DAYS = [2, 3, 4, 5, 6]; // Mar–Sam

/**
 * Returns a list of available time slots for a given date.
 * Respects global settings (openingDays, openingSlots, maxCovers)
 * and per-day DayOverride (closed, custom slots, custom maxCovers).
 */
export async function getAvailableSlots(dateStr: string): Promise<string[]> {
  const dbSettings = await prisma.restaurantSettings.findFirst({ where: { id: 1 } });
  const globalMaxCovers: number = dbSettings?.maxCovers ?? 20;
  const globalOpeningDays: number[] = dbSettings
    ? (JSON.parse(dbSettings.openingDays) as number[])
    : DEFAULT_OPENING_DAYS;
  const globalSlots: string[] = dbSettings
    ? (JSON.parse(dbSettings.openingSlots) as string[])
    : DEFAULT_SLOTS;

  // Parse date and get day-of-week
  const dateObj = new Date(dateStr + 'T00:00:00.000Z');
  const dow = dateObj.getUTCDay();

  // Check for a per-day override
  const override = await prisma.dayOverride.findUnique({
    where: { date: new Date(dateStr + 'T00:00:00.000Z') },
  });

  // Determine effective open/slots/maxCovers
  let effectiveOpen: boolean;
  let effectiveSlots: string[];
  let effectiveMaxCovers: number;

  if (override) {
    if (override.closed) return []; // explicitly closed
    effectiveOpen = true;
    effectiveSlots = override.openingSlots
      ? (JSON.parse(override.openingSlots) as string[])
      : globalSlots;
    effectiveMaxCovers = override.maxCovers ?? globalMaxCovers;
  } else {
    effectiveOpen = globalOpeningDays.includes(dow);
    if (!effectiveOpen) return []; // closed day of week
    effectiveSlots = globalSlots;
    effectiveMaxCovers = globalMaxCovers;
  }

  // Count reserved guests per slot on that day
  const dayStart = new Date(dateStr + 'T00:00:00.000Z');
  const dayEnd = new Date(dateStr + 'T23:59:59.999Z');

  const reservations = await prisma.reservation.findMany({
    where: {
      date: { gte: dayStart, lte: dayEnd },
      status: 'CONFIRMED',
    },
    select: { date: true, guests: true },
  });

  const guestsBySlot: Record<string, number> = {};
  for (const r of reservations) {
    const h = r.date.getUTCHours().toString().padStart(2, '0');
    const m = r.date.getUTCMinutes().toString().padStart(2, '0');
    const slot = `${h}:${m}`;
    guestsBySlot[slot] = (guestsBySlot[slot] ?? 0) + r.guests;
  }

  return effectiveSlots.filter((slot) => (guestsBySlot[slot] ?? 0) + 1 <= effectiveMaxCovers);
}

/**
 * Returns all configured slots for a given date with the number of remaining available places.
 * Closed days / slots return an empty array.
 */
export async function getSlotsWithAvailability(dateStr: string): Promise<{ time: string; available: number }[]> {
  const dbSettings = await prisma.restaurantSettings.findFirst({ where: { id: 1 } });
  const globalMaxCovers: number = dbSettings?.maxCovers ?? 20;
  const globalOpeningDays: number[] = dbSettings
    ? (JSON.parse(dbSettings.openingDays) as number[])
    : DEFAULT_OPENING_DAYS;
  const globalSlots: string[] = dbSettings
    ? (JSON.parse(dbSettings.openingSlots) as string[])
    : DEFAULT_SLOTS;

  const dateObj = new Date(dateStr + 'T00:00:00.000Z');
  const dow = dateObj.getUTCDay();

  const override = await prisma.dayOverride.findUnique({
    where: { date: new Date(dateStr + 'T00:00:00.000Z') },
  });

  let effectiveSlots: string[];
  let effectiveMaxCovers: number;

  if (override) {
    if (override.closed) return [];
    effectiveSlots = override.openingSlots
      ? (JSON.parse(override.openingSlots) as string[])
      : globalSlots;
    effectiveMaxCovers = override.maxCovers ?? globalMaxCovers;
  } else {
    if (!globalOpeningDays.includes(dow)) return [];
    effectiveSlots = globalSlots;
    effectiveMaxCovers = globalMaxCovers;
  }

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
    where: {
      date: { gte: dayStart, lte: dayEnd },
      status: 'CONFIRMED',
    },
    select: { date: true, guests: true },
  });

  const guestsBySlot: Record<string, number> = {};
  for (const r of reservations) {
    const h = r.date.getUTCHours().toString().padStart(2, '0');
    const m = r.date.getUTCMinutes().toString().padStart(2, '0');
    const slot = `${h}:${m}`;
    guestsBySlot[slot] = (guestsBySlot[slot] ?? 0) + r.guests;
  }

  return effectiveSlots.map((slot) => ({
    time: slot,
    available: Math.max(0, effectiveMaxCovers - (guestsBySlot[slot] ?? 0)),
  }));
}
