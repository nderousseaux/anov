import { prisma } from "../prisma";
import type { Prisma } from "../../generated/prisma";
import { buildConfigs } from "./configs";
import { isAvailable } from "./canSeat";
import { onlinePool } from "./service";
import type { ConfigsBySize, SeatingGroup, ServiceKey } from "./types";

type DbClient = typeof prisma | Prisma.TransactionClient;

/** Durée pendant laquelle une réservation PENDING_PAYMENT bloque sa place (= durée de session Stripe). */
export const HOLD_MINUTES = 30;

/** Plage UTC couverte par un service d'une journée (midi < 15 h, soir ≥ 15 h). */
export function serviceRange(
  dateStr: string,
  service: ServiceKey,
): { gte: Date; lt: Date } {
  const dayStart = new Date(`${dateStr}T00:00:00.000Z`);
  const noon3pm = new Date(`${dateStr}T15:00:00.000Z`);
  const nextDay = new Date(dayStart.getTime() + 86_400_000);
  return service === "lunch"
    ? { gte: dayStart, lt: noon3pm }
    : { gte: noon3pm, lt: nextDay };
}

/** Réservations qui comptent : CONFIRMED, ou PENDING_PAYMENT dont le hold n'a pas expiré. */
export function activeReservationWhere(now: Date) {
  return {
    OR: [
      { status: "CONFIRMED" as const },
      {
        status: "PENDING_PAYMENT" as const,
        OR: [
          { transactionExpireAt: { gt: now } },
          { transactionExpireAt: null },
        ],
      },
    ],
  };
}

/**
 * Verrou transactionnel sur (date, service) : sérialise les créations concurrentes.
 * À appeler dans la transaction, avant `isServiceAvailable`. Libéré au commit/rollback.
 */
export async function lockService(
  tx: Prisma.TransactionClient,
  dateStr: string,
  service: ServiceKey,
): Promise<void> {
  const key = `seating:${dateStr}:${service}`;
  await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${key}))`;
}

/** Configs du pool : "online" exclut les tables walk-in, "all" les inclut (restaurateur). */
export async function loadConfigs(
  db: DbClient,
  pool: "online" | "all" = "online",
): Promise<ConfigsBySize> {
  const [tables, dbCombos] = await Promise.all([
    db.table.findMany({ select: { id: true, capacity: true, walkIn: true } }),
    db.tableCombo.findMany(),
  ]);
  const capacityById = new Map(tables.map((t) => [t.id, t.capacity]));
  const combos = dbCombos.map((c) => ({
    tableIds: c.tableIds,
    capacity:
      c.capacityOverride ??
      c.tableIds.reduce((sum, id) => sum + (capacityById.get(id) ?? 0), 0),
  }));
  return buildConfigs(pool === "online" ? onlinePool(tables) : tables, combos);
}

/** Groupes déjà présents dans un service (hors `excludeReservationId`). */
export async function loadServiceGroups(
  db: DbClient,
  dateStr: string,
  service: ServiceKey,
  excludeReservationId?: string,
): Promise<SeatingGroup[]> {
  const reservations = await db.reservation.findMany({
    where: {
      date: serviceRange(dateStr, service),
      ...(excludeReservationId ? { id: { not: excludeReservationId } } : {}),
      ...activeReservationWhere(new Date()),
    },
    select: { id: true, guests: true, pinnedTableIds: true },
  });
  return reservations.map((r) => ({
    id: r.id,
    size: r.guests,
    pinnedTableIds: r.pinnedTableIds,
  }));
}

export interface ServiceAvailabilityParams {
  dateStr: string;
  service: ServiceKey;
  size: number;
  excludeReservationId?: string;
  pool?: "online" | "all";
}

/** Existe-t-il une répartition valide du service avec un groupe de `size` en plus ? */
export async function isServiceAvailable(
  db: DbClient,
  params: ServiceAvailabilityParams,
): Promise<boolean> {
  const { dateStr, service, size, excludeReservationId, pool } = params;
  const [configs, groups] = await Promise.all([
    loadConfigs(db, pool),
    loadServiceGroups(db, dateStr, service, excludeReservationId),
  ]);
  return isAvailable(groups, size, configs);
}

/**
 * Verrouille (date, service) puis teste la disponibilité. À appeler au début de la
 * transaction de création, qui doit faire son `create` avant le commit.
 */
export async function lockAndCheckAvailability(
  tx: Prisma.TransactionClient,
  params: ServiceAvailabilityParams,
): Promise<boolean> {
  await lockService(tx, params.dateStr, params.service);
  return isServiceAvailable(tx, params);
}
