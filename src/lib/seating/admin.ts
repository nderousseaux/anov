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
