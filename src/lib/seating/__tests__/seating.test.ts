import { describe, it, expect } from "vitest";
import {
  buildConfigs,
  canSeat,
  dailyCapacity,
  generateConfigs,
  groupSlotsByService,
  isAvailable,
  onlinePool,
  planService,
  serviceOf,
  type SeatingCombo,
  type SeatingGroup,
  type SeatingTable,
} from "..";

// Tables 2,3,3,4 : ids 1..4
const T2: SeatingTable = { id: 1, capacity: 2 };
const T3a: SeatingTable = { id: 2, capacity: 3 };
const T3b: SeatingTable = { id: 3, capacity: 3 };
const T4: SeatingTable = { id: 4, capacity: 4 };
const TABLES = [T2, T3a, T3b, T4];

// 2+4 listée avant 3+3 : un glouton prendrait 2+4 pour le 6 et échouerait.
const COMBOS: SeatingCombo[] = [
  { tableIds: [1, 4], capacity: 6 },
  { tableIds: [2, 3], capacity: 6 },
];

const g = (id: string, size: number, pinned?: number[]): SeatingGroup => ({
  id,
  size,
  pinnedTableIds: pinned,
});

describe("generateConfigs", () => {
  it("trie par places perdues croissantes", () => {
    const configs = generateConfigs(TABLES, [], 2);
    expect(configs.map((c) => c.tableIds)).toEqual([[1], [2], [3], [4]]);
    expect(configs.map((c) => c.wasted)).toEqual([0, 1, 1, 2]);
  });

  it("n'inclut que des configs minimales", () => {
    // 2+4 est écartée (la table de 4 suffit seule) ; 3+3 reste valide (aucune 3 ne suffit seule)
    const configs = generateConfigs(TABLES, COMBOS, 4);
    expect(configs.map((c) => c.tableIds)).toEqual([[4], [2, 3]]);
  });

  it("propose les combinaisons quand aucune table seule ne suffit", () => {
    const configs = generateConfigs(TABLES, COMBOS, 6);
    expect(configs.map((c) => c.tableIds)).toEqual([
      [1, 4],
      [2, 3],
    ]);
  });

  it("respecte la capacité modifiée d'une combinaison", () => {
    const reduced: SeatingCombo[] = [{ tableIds: [1, 4], capacity: 5 }];
    expect(generateConfigs(TABLES, reduced, 6)).toEqual([]);
    expect(generateConfigs(TABLES, reduced, 5)).toHaveLength(1);
  });

  it("ignore les combinaisons de plus de 2 tables", () => {
    const triple: SeatingCombo[] = [{ tableIds: [1, 2, 3], capacity: 8 }];
    expect(generateConfigs(TABLES, triple, 8)).toEqual([]);
  });
});

describe("canSeat / isAvailable", () => {
  const configs = buildConfigs(TABLES, COMBOS);

  it("1 personne est acceptée sur une table de 2", () => {
    expect(isAvailable([], 1, buildConfigs([T2], []))).toBe(true);
  });

  it("1 personne ne bloque pas un groupe de 4 s'il reste une solution", () => {
    const c = buildConfigs([T2, T4], []);
    const assignment = canSeat([g("solo", 1), g("new", 4)], c);
    expect(assignment).toEqual({ new: [4], solo: [1] });
    expect(isAvailable([g("solo", 1)], 4, c)).toBe(true);
  });

  it("1 personne bloque le 4 quand il n'y a pas d'alternative", () => {
    const c = buildConfigs([T4], []);
    expect(isAvailable([g("solo", 1)], 4, c)).toBe(false);
  });

  it("tables 2,3,3,4 : 6 + 4 + 2 → le 6 doit prendre 3+3 (le glouton échoue)", () => {
    // sanity : le glouton (première config) choisirait 2+4 pour le 6
    expect(configs.get(6)![0].tableIds).toEqual([1, 4]);

    const assignment = canSeat(
      [g("six", 6), g("four", 4), g("two", 2)],
      configs,
    );
    expect(assignment).toEqual({ six: [2, 3], four: [4], two: [1] });
  });

  it("tables 2,3,3,4 : un 6 existant + un nouveau 4 est accepté", () => {
    const assignment = canSeat([g("six", 6), g("new", 4)], configs);
    expect(assignment).not.toBeNull();
    const used = Object.values(assignment!).flat();
    expect(new Set(used).size).toBe(used.length);
  });

  it("groupe de 6 : 2+4 ou 3+3 selon les tables déjà prises", () => {
    // une 3 est prise → il reste 2+4
    const takenThree = canSeat([g("six", 6), g("p", 2, [2])], configs);
    expect(takenThree!.six).toEqual([1, 4]);

    // la 2 est prise → il reste 3+3
    const takenTwo = canSeat([g("six", 6), g("p", 2, [1])], configs);
    expect(takenTwo!.six).toEqual([2, 3]);

    // la 2 et une 3 sont prises → plus de 6 possible
    expect(
      canSeat([g("six", 6), g("p", 2, [1]), g("q", 3, [2])], configs),
    ).toBeNull();
  });

  it("n'utilise jamais une combinaison non autorisée", () => {
    // 3+3 n'est pas déclarée : un 6 ne passe pas, même avec deux 3 libres
    const c = buildConfigs([T3a, T3b], []);
    expect(isAvailable([], 6, c)).toBe(false);
  });

  it("refuse les tailles hors 1..8", () => {
    expect(isAvailable([], 0, configs)).toBe(false);
    expect(isAvailable([], 9, configs)).toBe(false);
  });

  it("service complet → faux ; libérer une réservation → vrai", () => {
    const c = buildConfigs([T2, T4], []);
    const full = [g("a", 2), g("b", 4)];
    expect(isAvailable(full, 2, c)).toBe(false);
    expect(isAvailable(full.slice(1), 2, c)).toBe(true);
  });

  it("respecte une réservation épinglée", () => {
    // le 2 est épinglé sur la table de 4 : il ne bouge pas, et le 3 prend une 3
    const assignment = canSeat([g("pin", 2, [4]), g("three", 3)], configs);
    expect(assignment!.pin).toEqual([4]);
    expect(assignment!.three).not.toContain(4);

    // sans combinaison, un nouveau 4 ne passe plus : la seule table de 4 est épinglée
    const noCombo = buildConfigs(TABLES, []);
    expect(isAvailable([g("pin", 2, [4])], 4, noCombo)).toBe(false);
  });

  it("deux épinglages sur la même table sont impossibles", () => {
    expect(canSeat([g("a", 2, [1]), g("b", 2, [1])], configs)).toBeNull();
  });
});

describe("tables walk-in", () => {
  const all = [...TABLES.map((t) => ({ ...t, walkIn: false }))];
  all[3] = { ...T4, walkIn: true };
  const combos: SeatingCombo[] = [{ tableIds: [1, 4], capacity: 6 }];

  it("ne sont jamais utilisées par la réservation en ligne", () => {
    const web = onlinePool(all);
    expect(web.map((t) => t.id)).toEqual([1, 2, 3]);
    const c = buildConfigs(web, combos);
    expect(isAvailable([], 4, c)).toBe(false); // la seule table de 4 est walk-in
    expect(c.get(6)).toEqual([]); // la combo 2+4 contient la table walk-in
  });

  it("restent utilisables côté restaurateur (pool complet ou épinglage)", () => {
    const admin = buildConfigs(all, combos);
    expect(isAvailable([], 4, admin)).toBe(true);
    expect(isAvailable([], 6, admin)).toBe(true);

    // résa épinglée sur la table walk-in, même si elle n'est pas dans le pool web
    const c = buildConfigs(onlinePool(all), combos);
    const assignment = canSeat([g("walkin", 4, [4]), g("web", 3)], c);
    expect(assignment!.walkin).toEqual([4]);
    expect(assignment!.web).toEqual([2]);
  });
});

describe("planService", () => {
  const configs = buildConfigs(TABLES, COMBOS);

  it("équivaut à canSeat quand une solution existe", () => {
    const plan = planService([g("six", 6), g("four", 4), g("two", 2)], configs);
    expect(plan.unplaced).toEqual([]);
    expect(plan.assignments.six).toEqual([2, 3]);
  });

  it("liste les groupes non placés quand le service est sur-réservé", () => {
    const noCombo = buildConfigs(TABLES, []);
    const plan = planService([g("a", 4), g("b", 4), g("c", 2)], noCombo);
    expect(plan.unplaced).toEqual(["b"]);
    expect(plan.assignments.a).toEqual([4]);
    expect(plan.assignments.c).toEqual([1]);
  });

  it("signale un épinglage conflictuel", () => {
    const plan = planService([g("a", 2, [1]), g("b", 2, [1])], configs);
    expect(plan.unplaced).toEqual(["b"]);
  });
});

describe("service", () => {
  it("déduit le service de l'heure UTC", () => {
    expect(serviceOf(new Date("2026-11-03T12:30:00.000Z"))).toBe("lunch");
    expect(serviceOf(new Date("2026-11-03T19:00:00.000Z"))).toBe("dinner");
  });

  it("groupe les créneaux par service", () => {
    expect(groupSlotsByService(["19:00", "12:15", "12:00", "21:30"])).toEqual({
      lunch: ["12:00", "12:15"],
      dinner: ["19:00", "21:30"],
    });
  });

  it("capacité journalière = places du pool × services", () => {
    expect(dailyCapacity(TABLES, 2)).toBe(24);
    expect(dailyCapacity(TABLES, 0)).toBe(0);
  });
});
