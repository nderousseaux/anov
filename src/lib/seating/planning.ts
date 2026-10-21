import { planService } from "./canSeat";
import { onlinePool } from "./service";
import type {
  Assignment,
  ConfigsBySize,
  SeatingGroup,
  SeatingTable,
  TableId,
} from "./types";

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
