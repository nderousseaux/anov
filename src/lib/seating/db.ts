import { prisma } from "../prisma";
import type { Prisma } from "../../generated/prisma";
import { buildConfigs, comboCapacity } from "./configs";
import { isAvailable, planService } from "./canSeat";
import { onlinePool, serviceOf } from "./service";
import { summarizeService, type ServiceSummary } from "./planning";
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
    capacity: comboCapacity(c.tableIds, c.capacityOverride, capacityById),
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

export interface InfeasibleService {
  dateStr: string;
  service: ServiceKey;
  /** Réservations qui n'ont plus de table dans le pool en ligne. */
  unplaced: { id: string; name: string; guests: number }[];
}

/**
 * Services futurs dont les réservations ne tiennent plus (ou pas) sur les tables du pool
 * en ligne : anciennes rotations, table passée en walk-in, combinaison supprimée…
 * Lecture seule : on avertit le restaurateur, on n'annule jamais rien.
 */
export async function findInfeasibleServices(
  db: DbClient,
  now: Date = new Date(),
): Promise<InfeasibleService[]> {
  const [configs, reservations] = await Promise.all([
    loadConfigs(db),
    db.reservation.findMany({
      where: { date: { gte: now }, ...activeReservationWhere(now) },
      select: {
        id: true,
        name: true,
        date: true,
        guests: true,
        pinnedTableIds: true,
      },
      orderBy: { date: "asc" },
    }),
  ]);

  const byService = new Map<string, typeof reservations>();
  for (const r of reservations) {
    const key = `${r.date.toISOString().split("T")[0]} ${serviceOf(r.date)}`;
    byService.set(key, [...(byService.get(key) ?? []), r]);
  }

  const result: InfeasibleService[] = [];
  for (const [key, group] of byService) {
    const { unplaced } = planService(
      group.map((r) => ({
        id: r.id,
        size: r.guests,
        pinnedTableIds: r.pinnedTableIds,
      })),
      configs,
    );
    if (unplaced.length === 0) continue;
    const [dateStr, service] = key.split(" ") as [string, ServiceKey];
    result.push({
      dateStr,
      service,
      unplaced: group
        .filter((r) => unplaced.includes(r.id))
        .map((r) => ({ id: r.id, name: r.name, guests: r.guests })),
    });
  }
  return result;
}

export interface PlanningReservation {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  date: Date;
  guests: number;
  status: string;
  source: string;
  specialRequest: string | null;
  depositPaidCents: number | null;
  transactionExpireAt: Date | null;
  createdAt: Date;
  pinnedTableIds: number[];
  /** La réservation occupe une place dans le service (faux : annulée, etc.). */
  counting: boolean;
  /** Tables calculées par l'algo ; null si elle ne compte pas, ou si elle n'a pas pu être placée. */
  assignedTableIds: number[] | null;
}

export interface DayPlanning {
  tables: {
    id: number;
    name: string;
    capacity: number;
    posX: number;
    posY: number;
    walkIn: boolean;
  }[];
  services: {
    key: ServiceKey;
    reservations: PlanningReservation[];
    summary: ServiceSummary;
  }[];
}

/** Statuts qui occupent une place dans le service (un hold expiré est exclu en amont). */
const COUNTING_STATUSES = ["CONFIRMED", "COMPLETED", "PENDING_PAYMENT"];

/**
 * Planning d'une journée : réservations par service, tables attribuées (recalculées par
 * l'algo, les épinglées restant en place) et indicateurs de remplissage.
 */
export async function loadDayPlanning(
  db: DbClient,
  dateStr: string,
  now: Date = new Date(),
): Promise<DayPlanning> {
  const dayStart = new Date(`${dateStr}T00:00:00.000Z`);
  const dayEnd = new Date(dayStart.getTime() + 86_400_000);

  const [tables, configs, reservations] = await Promise.all([
    db.table.findMany({
      orderBy: [{ capacity: "asc" }, { id: "asc" }],
      select: {
        id: true,
        name: true,
        capacity: true,
        posX: true,
        posY: true,
        walkIn: true,
      },
    }),
    loadConfigs(db),
    db.reservation.findMany({
      where: {
        date: { gte: dayStart, lt: dayEnd },
        // Les holds expirés ne sont pas affichés (ils restent PENDING_PAYMENT en base)
        OR: [
          { status: { not: "PENDING_PAYMENT" } },
          { transactionExpireAt: { gt: now } },
          { transactionExpireAt: null },
        ],
      },
      orderBy: { date: "asc" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        date: true,
        guests: true,
        status: true,
        source: true,
        specialRequest: true,
        depositPaidCents: true,
        transactionExpireAt: true,
        createdAt: true,
        pinnedTableIds: true,
      },
    }),
  ]);

  const services = (["lunch", "dinner"] as const).map((key) => {
    const own = reservations.filter((r) => serviceOf(r.date) === key);
    const counting = own.filter((r) => COUNTING_STATUSES.includes(r.status));
    const summary = summarizeService(
      tables,
      configs,
      counting.map((r) => ({
        id: r.id,
        size: r.guests,
        pinnedTableIds: r.pinnedTableIds,
      })),
    );
    return {
      key,
      summary,
      reservations: own.map((r) => ({
        ...r,
        counting: COUNTING_STATUSES.includes(r.status),
        assignedTableIds: summary.assignments[r.id] ?? null,
      })),
    };
  });

  return { tables, services };
}
