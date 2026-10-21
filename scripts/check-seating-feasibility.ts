#!/usr/bin/env tsx
/**
 * Contrôle en lecture seule : les réservations futures tiennent-elles dans le modèle
 * « un groupe par table et par service » ? Liste les (date, service) infaisables
 * (ex. anciennes rotations sur une même table). Aucune réservation n'est modifiée.
 */

import { config } from "dotenv";
config({ path: ".env.local" });

async function main() {
  // Import dynamique : le client Prisma lit DATABASE_URL à l'import.
  const { prisma } = await import("../src/lib/prisma");
  const { buildConfigs, onlinePool, planService, serviceOf } =
    await import("../src/lib/seating");

  const now = new Date();
  const [tables, dbCombos, reservations] = await Promise.all([
    prisma.table.findMany(),
    prisma.tableCombo.findMany(),
    prisma.reservation.findMany({
      where: {
        date: { gte: now },
        OR: [
          { status: "CONFIRMED" },
          {
            status: "PENDING_PAYMENT",
            OR: [
              { transactionExpireAt: { gt: now } },
              { transactionExpireAt: null },
            ],
          },
        ],
      },
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

  const pool = onlinePool(tables);
  const capacityById = new Map(pool.map((t) => [t.id, t.capacity]));
  const combos = dbCombos.map((c) => ({
    tableIds: c.tableIds,
    capacity:
      c.capacityOverride ??
      c.tableIds.reduce((sum, id) => sum + (capacityById.get(id) ?? 0), 0),
  }));
  const configs = buildConfigs(pool, combos);

  const byService = new Map<string, typeof reservations>();
  for (const r of reservations) {
    const key = `${r.date.toISOString().split("T")[0]} ${serviceOf(r.date)}`;
    byService.set(key, [...(byService.get(key) ?? []), r]);
  }

  let infeasible = 0;
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
    infeasible++;
    console.log(`✗ ${key} : ${unplaced.length} groupe(s) sans table`);
    for (const r of group.filter((g) => unplaced.includes(g.id))) {
      console.log(`    ${r.id}  ${r.name}  (${r.guests} pers.)`);
    }
  }

  console.log(
    `${byService.size} service(s) futurs contrôlés, ${infeasible} infaisable(s).`,
  );
  await prisma.$disconnect();
  process.exit(infeasible > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
