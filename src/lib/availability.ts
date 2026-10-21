import { prisma } from "./prisma";
import {
  groupSlotsByService,
  isAvailable,
  serviceOf,
  type ServiceKey,
} from "./seating";
import {
  activeReservationWhere,
  isServiceAvailable,
  loadConfigs,
} from "./seating/db";

const DEFAULT_SLOTS = [
  "12:00",
  "12:15",
  "12:30",
  "12:45",
  "13:00",
  "13:15",
  "13:30",
  "13:45",
  "19:00",
  "19:15",
  "19:30",
  "19:45",
  "20:00",
  "20:15",
  "20:30",
  "20:45",
  "21:00",
  "21:15",
  "21:30",
];

const DEFAULT_OPENING_DAYS = [2, 3, 4, 5, 6]; // Mar–Sam

type EffectiveConfig = { effectiveSlots: string[] };

async function getEffectiveConfig(
  dateStr: string,
): Promise<EffectiveConfig | null> {
  const dateObj = new Date(dateStr + "T00:00:00.000Z");
  const dow = dateObj.getUTCDay();

  const [dbSettings, override] = await Promise.all([
    prisma.restaurantSettings.findFirst({ where: { id: 1 } }),
    prisma.dayOverride.findUnique({ where: { date: dateObj } }),
  ]);

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
    };
  }

  if (!globalOpeningDays.includes(dow)) return null;
  return { effectiveSlots: globalSlots };
}

function localDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function firstSlotMinutes(slots: string[]): number {
  const [h, m] = slots[0].split(":").map(Number);
  return h * 60 + m;
}

export interface ServiceAvailability {
  key: ServiceKey;
  slots: string[];
  /** Service déjà entamé aujourd'hui (premier créneau passé) : plus réservable. */
  started: boolean;
  available: boolean;
}

/**
 * Disponibilité par service (midi / soir) d'une date pour `guests` personnes : existe-t-il
 * une répartition valide de tous les groupes sur les tables du pool en ligne ?
 * Jour fermé -> tableau vide. L'heure d'arrivée n'entre pas dans le calcul.
 */
export async function getServicesAvailability(
  dateStr: string,
  guests: number,
): Promise<ServiceAvailability[]> {
  const config = await getEffectiveConfig(dateStr);
  if (!config) return [];

  const now = new Date();
  const isToday = dateStr === localDateStr(now);
  const currentMin = now.getHours() * 60 + now.getMinutes();

  const bySlots = groupSlotsByService(config.effectiveSlots);
  const result: ServiceAvailability[] = [];
  for (const key of ["lunch", "dinner"] as const) {
    const slots = bySlots[key];
    if (slots.length === 0) continue;
    const started = isToday && firstSlotMinutes(slots) <= currentMin;
    const available =
      !started &&
      (await isServiceAvailable(prisma, {
        dateStr,
        service: key,
        size: guests,
      }));
    result.push({ key, slots, started, available });
  }
  return result;
}

/**
 * Créneaux d'une date, avec `available` = le service du créneau a de la place.
 * Les services déjà entamés aujourd'hui ne sont pas retournés. Jour fermé -> [].
 */
export async function getSlotsWithAvailability(
  dateStr: string,
  guests: number,
): Promise<{ time: string; available: boolean }[]> {
  return servicesToSlots(await getServicesAvailability(dateStr, guests));
}

export function servicesToSlots(
  services: ServiceAvailability[],
): { time: string; available: boolean }[] {
  return services
    .filter((s) => !s.started)
    .flatMap((s) => s.slots.map((time) => ({ time, available: s.available })));
}

/**
 * Services disponibles pour `guests` personnes, par date (YYYY-MM-DD) du mois, à partir
 * d'aujourd'hui. Une date sans service disponible (fermée, complète, entamée) a un
 * tableau vide. Peu de requêtes quel que soit le nombre de jours.
 */
export async function getMonthServiceAvailability(
  monthStr: string,
  guests: number,
): Promise<Record<string, ServiceKey[]>> {
  const [year, month] = monthStr.split("-").map(Number);
  // new Date(year, month, 0) → dernier jour du mois (month est 1-indexé ici)
  const daysInMonth = new Date(year, month, 0).getDate();

  const now = new Date();
  const todayStr = localDateStr(now);
  const currentMin = now.getHours() * 60 + now.getMinutes();

  const paddedMonth = String(month).padStart(2, "0");
  const monthStart = new Date(`${year}-${paddedMonth}-01T00:00:00.000Z`);
  const monthEnd = new Date(
    `${year}-${paddedMonth}-${String(daysInMonth).padStart(2, "0")}T23:59:59.999Z`,
  );

  const [dbSettings, overrides, reservations, configs] = await Promise.all([
    prisma.restaurantSettings.findFirst({ where: { id: 1 } }),
    prisma.dayOverride.findMany({
      where: { date: { gte: monthStart, lte: monthEnd } },
    }),
    prisma.reservation.findMany({
      where: {
        date: { gte: monthStart, lte: monthEnd },
        ...activeReservationWhere(now),
      },
      select: { id: true, date: true, guests: true, pinnedTableIds: true },
    }),
    loadConfigs(prisma),
  ]);

  const globalOpeningDays: number[] = dbSettings
    ? (JSON.parse(dbSettings.openingDays) as number[])
    : DEFAULT_OPENING_DAYS;
  const globalSlots: string[] = dbSettings
    ? (JSON.parse(dbSettings.openingSlots) as string[])
    : DEFAULT_SLOTS;

  const overrideByDate = new Map<string, (typeof overrides)[0]>();
  for (const o of overrides) {
    overrideByDate.set(o.date.toISOString().split("T")[0], o);
  }

  // Groupes déjà présents, par "date service"
  const groupsByService = new Map<
    string,
    { id: string; size: number; pinnedTableIds: number[] }[]
  >();
  for (const r of reservations) {
    const key = `${r.date.toISOString().split("T")[0]} ${serviceOf(r.date)}`;
    const list = groupsByService.get(key) ?? [];
    list.push({ id: r.id, size: r.guests, pinnedTableIds: r.pinnedTableIds });
    groupsByService.set(key, list);
  }

  const result: Record<string, ServiceKey[]> = {};

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${paddedMonth}-${String(day).padStart(2, "0")}`;
    if (dateStr < todayStr) continue;

    const dow = new Date(dateStr + "T00:00:00.000Z").getUTCDay();
    const override = overrideByDate.get(dateStr);

    let effectiveSlots: string[];
    if (override) {
      if (override.closed) {
        result[dateStr] = [];
        continue;
      }
      effectiveSlots = override.openingSlots
        ? (JSON.parse(override.openingSlots) as string[])
        : globalSlots;
    } else {
      if (!globalOpeningDays.includes(dow)) {
        result[dateStr] = [];
        continue;
      }
      effectiveSlots = globalSlots;
    }

    const bySlots = groupSlotsByService(effectiveSlots);
    const isToday = dateStr === todayStr;
    result[dateStr] = (["lunch", "dinner"] as const).filter((key) => {
      const slots = bySlots[key];
      if (slots.length === 0) return false;
      if (isToday && firstSlotMinutes(slots) <= currentMin) return false;
      return isAvailable(
        groupsByService.get(`${dateStr} ${key}`) ?? [],
        guests,
        configs,
      );
    });
  }

  return result;
}

/**
 * Dates (YYYY-MM-DD) du mois, aujourd'hui ou plus tard, sans aucun service disponible.
 */
export async function getUnavailableDatesForMonth(
  monthStr: string,
  guests: number,
): Promise<string[]> {
  return unavailableDates(await getMonthServiceAvailability(monthStr, guests));
}

export function unavailableDates(
  byDate: Record<string, ServiceKey[]>,
): string[] {
  return Object.entries(byDate)
    .filter(([, services]) => services.length === 0)
    .map(([dateStr]) => dateStr);
}
