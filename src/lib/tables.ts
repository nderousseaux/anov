import { prisma } from './prisma';
import type { Prisma } from '../generated/prisma';

type DbClient = typeof prisma | Prisma.TransactionClient;

export interface TableInfo {
  id: number;
  name: string;
  capacity: number;
  posX: number;
  posY: number;
}

export interface ReservationTableInfo {
  date: Date;
  tableId: number | null;
}

/**
 * For a given number of guests, the ordered list of table capacities allowed
 * on a future (non-same-day) booking. The first capacity with a free table wins.
 * 1 guest  -> table of 2 only (no fallback)
 * 2 guests -> table of 2, fallback table of 3 (never table of 4)
 * 3 guests -> table of 3, fallback table of 4
 * 4 guests -> table of 4 only
 */
const TIER_BY_GUESTS: Record<number, number[]> = {
  1: [2],
  2: [2, 3],
  3: [3, 4],
  4: [4],
};

function slotToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Estimates how many sequential non-overlapping seatings a single table can serve across a
 * list of opening slots for one service (e.g. lunch or dinner), given the meal duration
 * blocking window. Two reservations on the same table can only both be honored if they are
 * spaced at least mealDuration apart (see computeBusyTableIds's blocking window: a reservation
 * blocks [R - mealDuration, R + mealDuration)). Returns 0 when there are no slots for the service.
 */
export function computeServiceTurns(slots: string[], mealDuration: number): number {
  if (slots.length === 0) return 0;
  const minutes = slots.map(slotToMinutes);
  const span = Math.max(...minutes) - Math.min(...minutes);
  return Math.floor(span / mealDuration) + 1;
}

/**
 * Sums the capacity of every physical table (total number of seats in the restaurant).
 */
export function getTotalTableCapacity(tables: TableInfo[]): number {
  return tables.reduce((sum, t) => sum + t.capacity, 0);
}

/**
 * Returns the 6 physical tables of the restaurant, ordered by capacity.
 */
export async function getTables(db: DbClient = prisma): Promise<TableInfo[]> {
  return db.table.findMany({ orderBy: { capacity: 'asc' } });
}

/**
 * Fetches all active reservations (CONFIRMED or non-expired PENDING_PAYMENT) for a given day.
 */
export async function getDayReservationsForTables(db: DbClient, dateStr: string): Promise<ReservationTableInfo[]> {
  const dayStart = new Date(dateStr + 'T00:00:00.000Z');
  const dayEnd = new Date(dateStr + 'T23:59:59.999Z');
  const now = new Date();

  return db.reservation.findMany({
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
    select: { date: true, tableId: true },
  });
}

/**
 * Pure function: given a day's active reservations, returns the set of tableIds
 * occupied for a given time slot, accounting for the meal duration blocking window
 * (± mealDuration around the reservation time), mirroring buildCoverageMap in availability.ts
 * but per-table instead of summing guests.
 */
export function computeBusyTableIds(
  reservations: ReservationTableInfo[],
  time: string,
  mealDuration: number,
): Set<number> {
  const targetMin = slotToMinutes(time);
  const busy = new Set<number>();
  for (const r of reservations) {
    if (r.tableId == null) continue;
    const resMin = r.date.getUTCHours() * 60 + r.date.getUTCMinutes();
    if (targetMin >= resMin - mealDuration && targetMin < resMin + mealDuration) {
      busy.add(r.tableId);
    }
  }
  return busy;
}

/**
 * Pure function implementing the table-picking business rule.
 * - isToday=true: ignores the tier hierarchy, picks the smallest free table that fits the group.
 * - isToday=false: applies the strict tier hierarchy (see TIER_BY_GUESTS), never using a table
 *   that is not in the allowed tier for that guest count.
 * Returns null when no suitable table is free.
 */
export function pickTable(
  tables: TableInfo[],
  busyTableIds: Set<number>,
  guests: number,
  isToday: boolean,
): TableInfo | null {
  const free = tables.filter((t) => !busyTableIds.has(t.id));

  if (isToday) {
    const fitting = free.filter((t) => t.capacity >= guests);
    if (fitting.length === 0) return null;
    fitting.sort((a, b) => a.capacity - b.capacity || a.id - b.id);
    return fitting[0];
  }

  const tiers = TIER_BY_GUESTS[guests];
  if (!tiers) return null;
  for (const capacity of tiers) {
    const candidates = free.filter((t) => t.capacity === capacity).sort((a, b) => a.id - b.id);
    if (candidates.length > 0) return candidates[0];
  }
  return null;
}

export interface AssignTableParams {
  db?: DbClient;
  dateStr: string;
  time: string;
  guests: number;
  mealDuration: number;
  isToday: boolean;
}

/**
 * DB-backed convenience wrapper: fetches tables + the day's active reservations,
 * then applies pickTable. Meant to be called within a transaction at reservation
 * creation time (pass `db` = the transaction client) to avoid race conditions.
 */
export async function assignTable(params: AssignTableParams): Promise<TableInfo | null> {
  const { db = prisma, dateStr, time, guests, mealDuration, isToday } = params;
  const [tables, reservations] = await Promise.all([
    getTables(db),
    getDayReservationsForTables(db, dateStr),
  ]);
  const busy = computeBusyTableIds(reservations, time, mealDuration);
  return pickTable(tables, busy, guests, isToday);
}
