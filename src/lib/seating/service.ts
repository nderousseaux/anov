import type { SeatingTable, ServiceKey } from "./types";

/** Heure (UTC, cf. stockage de Reservation.date) à partir de laquelle on est au service du soir. */
const DINNER_START_HOUR = 15;

/** Service d'une réservation, déduit de l'heure de `date` (stockée en UTC « local »). */
export function serviceOf(date: Date): ServiceKey {
  return date.getUTCHours() < DINNER_START_HOUR ? "lunch" : "dinner";
}

/** Service d'un créneau "HH:mm". */
export function serviceOfSlot(slot: string): ServiceKey {
  return parseInt(slot, 10) < DINNER_START_HOUR ? "lunch" : "dinner";
}

export function groupSlotsByService(
  slots: string[],
): Record<ServiceKey, string[]> {
  const sorted = [...slots].sort();
  return {
    lunch: sorted.filter((s) => serviceOfSlot(s) === "lunch"),
    dinner: sorted.filter((s) => serviceOfSlot(s) === "dinner"),
  };
}

/** Pool de la réservation en ligne : tout sauf les tables réservées au walk-in. */
export function onlinePool<T extends SeatingTable & { walkIn?: boolean }>(
  tables: T[],
): T[] {
  return tables.filter((t) => !t.walkIn);
}

/** Capacité journalière : couverts du pool × nombre de services ouverts. */
export function dailyCapacity(
  poolTables: SeatingTable[],
  serviceCount: number,
): number {
  return poolTables.reduce((sum, t) => sum + t.capacity, 0) * serviceCount;
}
