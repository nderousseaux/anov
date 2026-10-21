export type TableId = number;

export type ServiceKey = "lunch" | "dinner";

export const MIN_GROUP_SIZE = 1;
export const MAX_GROUP_SIZE = 8;
/** Nombre maximum de tables fusionnables dans une combinaison (v1). */
export const MAX_COMBO_SIZE = 2;

export interface SeatingTable {
  id: TableId;
  capacity: number;
}

/** Combinaison autorisée de tables, avec sa propre capacité (somme par défaut, côté appelant). */
export interface SeatingCombo {
  tableIds: TableId[];
  capacity: number;
}

/** Une façon de placer un groupe : une table seule ou une combinaison. */
export interface Config {
  tableIds: TableId[];
  capacity: number;
  /** Places perdues pour la taille de groupe demandée (capacity - size). */
  wasted: number;
}

/** Configs précalculées, indexées par taille de groupe. */
export type ConfigsBySize = Map<number, Config[]>;

export interface SeatingGroup {
  id: string;
  size: number;
  /** Réservation épinglée : placée d'office sur ces tables, jamais déplacée par l'algo. */
  pinnedTableIds?: TableId[];
}

/** groupId -> tables attribuées. */
export type Assignment = Record<string, TableId[]>;

export interface ServicePlan {
  assignments: Assignment;
  /** Groupes qui n'ont pas pu être placés (service sur-réservé ou épinglage conflictuel). */
  unplaced: string[];
}
