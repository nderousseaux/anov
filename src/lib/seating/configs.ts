import {
  MAX_COMBO_SIZE,
  MAX_GROUP_SIZE,
  MIN_GROUP_SIZE,
  type Config,
  type ConfigsBySize,
  type SeatingCombo,
  type SeatingTable,
} from "./types";

/** Capacité d'une combinaison : celle fixée par le restaurateur, sinon la somme de ses tables. */
export function comboCapacity(
  tableIds: number[],
  capacityOverride: number | null,
  capacityById: Map<number, number>,
): number {
  return (
    capacityOverride ??
    tableIds.reduce((sum, id) => sum + (capacityById.get(id) ?? 0), 0)
  );
}

/**
 * Configs possibles pour un groupe de `groupSize` : une table seule ou une combinaison
 * autorisée de capacité suffisante, **minimale** (retirer une table la rendrait
 * insuffisante). Triées par places perdues croissantes, puis moins de tables d'abord.
 *
 * Seules les tables de `tables` (le pool) sont utilisables : une combinaison qui
 * référence une table hors pool (ex. walk-in côté web) est ignorée.
 */
export function generateConfigs(
  tables: SeatingTable[],
  combos: SeatingCombo[],
  groupSize: number,
): Config[] {
  const capacityById = new Map(tables.map((t) => [t.id, t.capacity]));
  const make = (tableIds: number[], capacity: number): Config => ({
    tableIds,
    capacity,
    wasted: capacity - groupSize,
  });

  const configs: Config[] = [];

  for (const t of tables) {
    if (t.capacity >= groupSize) configs.push(make([t.id], t.capacity));
  }

  const validCombos = combos.filter(
    (c) =>
      c.tableIds.length >= 2 &&
      c.tableIds.length <= MAX_COMBO_SIZE &&
      new Set(c.tableIds).size === c.tableIds.length &&
      c.tableIds.every((id) => capacityById.has(id)),
  );

  for (const combo of validCombos) {
    if (combo.capacity < groupSize) continue;
    // Une seule de ses tables suffit : la combinaison n'est pas minimale.
    if (combo.tableIds.some((id) => capacityById.get(id)! >= groupSize))
      continue;
    // Une sous-combinaison autorisée suffit déjà : pas minimale non plus.
    const hasSufficientSubCombo = validCombos.some(
      (other) =>
        other !== combo &&
        other.capacity >= groupSize &&
        other.tableIds.length < combo.tableIds.length &&
        other.tableIds.every((id) => combo.tableIds.includes(id)),
    );
    if (hasSufficientSubCombo) continue;
    configs.push(make(combo.tableIds, combo.capacity));
  }

  return configs.sort(
    (a, b) =>
      a.wasted - b.wasted ||
      a.tableIds.length - b.tableIds.length ||
      a.tableIds[0] - b.tableIds[0],
  );
}

/** Précalcule les configs pour toutes les tailles de groupe acceptées en ligne. */
export function buildConfigs(
  tables: SeatingTable[],
  combos: SeatingCombo[],
): ConfigsBySize {
  const bySize: ConfigsBySize = new Map();
  for (let size = MIN_GROUP_SIZE; size <= MAX_GROUP_SIZE; size++) {
    bySize.set(size, generateConfigs(tables, combos, size));
  }
  return bySize;
}
