import { planService } from "./canSeat";
import { onlinePool } from "./service";
import type {
  Assignment,
  ConfigsBySize,
  SeatingGroup,
  SeatingTable,
  TableId,
} from "./types";

/**
 * Effet d'un (dés)épinglage sur le service : réservations qui perdent leur table
 * (`newlyUnplaced`), hors celles qui n'en avaient déjà pas. `tableIds` vide = désépingler.
 */
export function evaluatePin(
  groups: SeatingGroup[],
  configs: ConfigsBySize,
  groupId: string,
  tableIds: TableId[],
): { newlyUnplaced: string[] } {
  const before = planService(groups, configs).unplaced;
  const after = planService(
    groups.map((g) =>
      g.id === groupId ? { ...g, pinnedTableIds: tableIds } : g,
    ),
    configs,
  ).unplaced;
  return { newlyUnplaced: after.filter((id) => !before.includes(id)) };
}

export type PlanningTable = SeatingTable & { walkIn: boolean };

export interface ServiceSummary {
  /** Réservation -> tables, calculé par l'algo (les épinglées gardent leurs tables). */
  assignments: Assignment;
  /** Réservations sans table dans le pool (service sur-réservé). */
  unplaced: string[];
  /** Couverts réservés (toutes les réservations qui comptent). */
  covers: number;
  /** Places du pool en ligne (hors tables walk-in). */
  capacity: number;
  tablesTotal: number;
  /** Tables du pool non utilisées par une réservation. */
  tablesFree: number;
  /** Tables walk-in occupées (par une réservation épinglée dessus). */
  walkInOccupied: TableId[];
}

/**
 * Synthèse d'un service pour le planning : affectation des tables, couverts, et tables
 * libres du pool en ligne. Les tables walk-in sont comptées à part.
 */
export function summarizeService(
  tables: PlanningTable[],
  configs: ConfigsBySize,
  groups: SeatingGroup[],
): ServiceSummary {
  const { assignments, unplaced } = planService(groups, configs);
  const pool = onlinePool(tables);
  const poolIds = new Set(pool.map((t) => t.id));

  const used = new Set<TableId>();
  const walkInOccupied = new Set<TableId>();
  for (const ids of Object.values(assignments)) {
    for (const id of ids) {
      if (poolIds.has(id)) used.add(id);
      else walkInOccupied.add(id);
    }
  }

  return {
    assignments,
    unplaced,
    covers: groups.reduce((sum, g) => sum + g.size, 0),
    capacity: pool.reduce((sum, t) => sum + t.capacity, 0),
    tablesTotal: pool.length,
    tablesFree: pool.length - used.size,
    walkInOccupied: [...walkInOccupied],
  };
}
