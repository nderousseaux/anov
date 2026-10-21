import {
  MAX_GROUP_SIZE,
  MIN_GROUP_SIZE,
  type Assignment,
  type ConfigsBySize,
  type SeatingGroup,
  type ServicePlan,
  type TableId,
} from "./types";

export const NEW_GROUP_ID = "__new__";

/**
 * Cherche une répartition valide de tous les groupes sur les tables du pool.
 * Les groupes épinglés sont placés d'abord sur leurs tables (leur capacité n'est pas
 * vérifiée : c'est une décision du restaurateur), puis les autres, du plus gros au
 * plus petit, par backtracking sur les configs. Retourne l'affectation, ou null.
 */
export function canSeat(
  groups: SeatingGroup[],
  configsBySize: ConfigsBySize,
): Assignment | null {
  const assignment: Assignment = {};
  const used = new Set<TableId>();
  const free: SeatingGroup[] = [];

  for (const group of groups) {
    if (group.pinnedTableIds && group.pinnedTableIds.length > 0) {
      for (const id of group.pinnedTableIds) {
        if (used.has(id)) return null;
        used.add(id);
      }
      assignment[group.id] = [...group.pinnedTableIds];
    } else {
      free.push(group);
    }
  }

  free.sort((a, b) => b.size - a.size);

  const place = (index: number): boolean => {
    if (index === free.length) return true;
    const group = free[index];
    for (const config of configsBySize.get(group.size) ?? []) {
      if (config.tableIds.some((id) => used.has(id))) continue;
      config.tableIds.forEach((id) => used.add(id));
      assignment[group.id] = config.tableIds;
      if (place(index + 1)) return true;
      config.tableIds.forEach((id) => used.delete(id));
      delete assignment[group.id];
    }
    return false;
  };

  return place(0) ? assignment : null;
}

/**
 * Peut-on ajouter un groupe de `newSize` aux `groups` déjà présents dans le service ?
 * Avec `pinnedTableIds`, le nouveau groupe est imposé sur ces tables (ex. client de passage
 * sur une table walk-in) : elles doivent être libres, et les autres groupes se placent autour.
 * Si toutes ces tables sont hors du pool (walk-in), elles n'interfèrent pas avec le placement
 * des autres groupes : il suffit qu'aucune autre réservation n'y soit épinglée. Un service
 * déjà sur-réservé n'empêche donc pas d'asseoir un client de passage sur une table libre.
 */
export function isAvailable(
  groups: SeatingGroup[],
  newSize: number,
  configsBySize: ConfigsBySize,
  pinnedTableIds?: TableId[],
): boolean {
  if (
    !Number.isInteger(newSize) ||
    newSize < MIN_GROUP_SIZE ||
    newSize > MAX_GROUP_SIZE
  ) {
    return false;
  }
  if (pinnedTableIds && pinnedTableIds.length > 0) {
    const poolIds = new Set(
      (configsBySize.get(1) ?? []).flatMap((config) => config.tableIds),
    );
    if (pinnedTableIds.every((id) => !poolIds.has(id))) {
      const taken = new Set(groups.flatMap((g) => g.pinnedTableIds ?? []));
      return pinnedTableIds.every((id) => !taken.has(id));
    }
  }
  return (
    canSeat(
      [...groups, { id: NEW_GROUP_ID, size: newSize, pinnedTableIds }],
      configsBySize,
    ) !== null
  );
}

/**
 * Plan d'affichage « au mieux », pour le plan de salle : identique à `canSeat` quand une
 * solution existe, sinon place ce qui peut l'être (épinglés d'abord) et liste le reste
 * dans `unplaced` (service sur-réservé, résa forcée, déplacement manuel impossible).
 */
export function planService(
  groups: SeatingGroup[],
  configsBySize: ConfigsBySize,
): ServicePlan {
  const full = canSeat(groups, configsBySize);
  if (full) return { assignments: full, unplaced: [] };

  const assignments: Assignment = {};
  const unplaced: string[] = [];
  const used = new Set<TableId>();
  const free: SeatingGroup[] = [];

  for (const group of groups) {
    const pinned = group.pinnedTableIds ?? [];
    if (pinned.length === 0) {
      free.push(group);
    } else if (pinned.some((id) => used.has(id))) {
      unplaced.push(group.id);
    } else {
      pinned.forEach((id) => used.add(id));
      assignments[group.id] = [...pinned];
    }
  }

  free.sort((a, b) => b.size - a.size);
  for (const group of free) {
    const config = (configsBySize.get(group.size) ?? []).find((c) =>
      c.tableIds.every((id) => !used.has(id)),
    );
    if (!config) {
      unplaced.push(group.id);
      continue;
    }
    config.tableIds.forEach((id) => used.add(id));
    assignments[group.id] = config.tableIds;
  }

  return { assignments, unplaced };
}
