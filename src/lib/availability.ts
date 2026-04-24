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
      status: { in: ['PENDING_PAYMENT', 'CONFIRMED'] },
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
 * Assigns tables optimally to a reservation.
 * Tries to fill tables with least waste (first-fit decreasing).
 */
export async function assignTables(
  guests: number,
  reservationId: string,
  reservationDate: Date
): Promise<void> {
  const tables = await prisma.table.findMany({ orderBy: { capacity: 'desc' } });

  // Find occupied tables at this date/time (±30min window)
  const windowStart = new Date(reservationDate.getTime() - 30 * 60 * 1000);
  const windowEnd = new Date(reservationDate.getTime() + 30 * 60 * 1000);

  const occupied = await prisma.reservationTable.findMany({
    where: {
      reservation: {
        date: { gte: windowStart, lte: windowEnd },
        status: { in: ['PENDING_PAYMENT', 'CONFIRMED'] },
        id: { not: reservationId },
      },
    },
    select: { tableId: true },
  });
  const occupiedIds = new Set(occupied.map((o) => o.tableId));
  const available = tables.filter((t) => !occupiedIds.has(t.id));

  // Greedy assignment
  let remaining = guests;
  const assigned: number[] = [];
  for (const table of available) {
    if (remaining <= 0) break;
    assigned.push(table.id);
    remaining -= table.capacity;
  }

  if (assigned.length > 0) {
    await prisma.reservationTable.createMany({
      data: assigned.map((tableId) => ({ reservationId, tableId })),
      skipDuplicates: true,
    });
  }
}
