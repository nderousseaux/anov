/** Validation des saisies d'administration des tables et combinaisons (pure, sans Prisma). */

import { MAX_COMBO_SIZE } from "./types";

export const MAX_TABLE_CAPACITY = 20;

export type TableInput = {
  name?: unknown;
  capacity?: unknown;
  walkIn?: unknown;
  posX?: unknown;
  posY?: unknown;
};

/** Valide les champs présents ; retourne un message d'erreur ou null. */
export function validateTableInput(
  body: TableInput,
  { partial }: { partial: boolean },
): string | null {
  const { name, capacity, walkIn, posX, posY } = body;
  if (!partial || name !== undefined) {
    if (typeof name !== "string" || !name.trim() || name.trim().length > 40)
      return "Nom invalide (1 à 40 caractères)";
  }
  if (!partial || capacity !== undefined) {
    if (
      !Number.isInteger(capacity) ||
      (capacity as number) < 1 ||
      (capacity as number) > MAX_TABLE_CAPACITY
    )
      return `Capacité invalide (1 à ${MAX_TABLE_CAPACITY})`;
  }
  if (walkIn !== undefined && typeof walkIn !== "boolean")
    return "walkIn invalide";
  for (const [label, v] of [
    ["posX", posX],
    ["posY", posY],
  ] as const) {
    if (v !== undefined && (typeof v !== "number" || v < 0 || v > 100))
      return `${label} invalide (0 à 100)`;
  }
  return null;
}

export type ComboInput = {
  tableIds?: unknown;
  capacityOverride?: unknown;
};

const MAX_COMBO_CAPACITY = 40;

/** capacityOverride : null (somme par défaut) ou entier 1..MAX_COMBO_CAPACITY. */
export function validateComboCapacity(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (
    !Number.isInteger(value) ||
    (value as number) < 1 ||
    (value as number) > MAX_COMBO_CAPACITY
  )
    return `Capacité invalide (1 à ${MAX_COMBO_CAPACITY})`;
  return null;
}

/** tableIds d'une nouvelle combinaison : 2..MAX_COMBO_SIZE ids entiers distincts. */
export function validateComboTableIds(value: unknown): string | null {
  if (
    !Array.isArray(value) ||
    value.length < 2 ||
    value.length > MAX_COMBO_SIZE ||
    value.some((id) => !Number.isInteger(id)) ||
    new Set(value).size !== value.length
  )
    return `Une combinaison associe ${MAX_COMBO_SIZE} tables distinctes`;
  return null;
}

export type AdminReservationSource = "PHONE" | "WALK_IN";

export interface AdminReservationInput {
  name: string;
  phone: string | null;
  email: string | null;
  /** YYYY-MM-DD */
  date: string;
  /** HH:mm */
  time: string;
  guests: number;
  source: AdminReservationSource;
  specialRequest: string | null;
  /** Table imposée (réservation épinglée) : typiquement une table walk-in. */
  tableId: number | null;
  /** Ajouter même si le service est complet. */
  force: boolean;
}

export const MAX_ADMIN_GUESTS = 20;

const PHONE_RE = /^\+?[\d\s\-().]{6,20}$/;
const EMAIL_RE = /^[\w.+\-]+@[\w\-]+\.[a-z]{2,}$/i;

const optionalString = (v: unknown): string | null =>
  typeof v === "string" && v.trim() ? v.trim() : null;

/** Valide le corps d'une réservation saisie par le restaurateur (téléphone ou passage). */
export function parseAdminReservation(
  body: unknown,
): { error: string } | { value: AdminReservationInput } {
  const b = (body ?? {}) as Record<string, unknown>;

  const source = b.source;
  if (source !== "PHONE" && source !== "WALK_IN")
    return { error: "source invalide (PHONE ou WALK_IN)" };

  const name =
    optionalString(b.name) ?? (source === "WALK_IN" ? "Passage" : null);
  if (!name || name.length > 100) return { error: "Nom invalide" };

  const { date, time } = b;
  if (
    typeof date !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    isNaN(new Date(`${date}T00:00:00.000Z`).getTime())
  )
    return { error: "Date invalide" };
  if (typeof time !== "string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time))
    return { error: "Heure invalide" };

  const guests = b.guests;
  if (
    !Number.isInteger(guests) ||
    (guests as number) < 1 ||
    (guests as number) > MAX_ADMIN_GUESTS
  )
    return { error: `Nombre de couverts invalide (1 à ${MAX_ADMIN_GUESTS})` };

  const phone = optionalString(b.phone);
  if (phone && !PHONE_RE.test(phone))
    return { error: "Numéro de téléphone invalide" };
  const email = optionalString(b.email)?.toLowerCase() ?? null;
  if (email && !EMAIL_RE.test(email)) return { error: "Email invalide" };

  const specialRequest = optionalString(b.specialRequest);
  if (specialRequest && specialRequest.length > 500)
    return { error: "Demande spéciale trop longue" };

  const tableId = b.tableId ?? null;
  if (
    tableId !== null &&
    (!Number.isInteger(tableId) || (tableId as number) < 1)
  )
    return { error: "tableId invalide" };

  if (b.force !== undefined && typeof b.force !== "boolean")
    return { error: "force invalide" };

  return {
    value: {
      name,
      phone,
      email,
      date,
      time,
      guests: guests as number,
      source,
      specialRequest,
      tableId: tableId as number | null,
      force: b.force === true,
    },
  };
}
