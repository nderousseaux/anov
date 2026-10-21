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
  const { findInfeasibleServices } = await import("../src/lib/seating/db");

  const infeasible = await findInfeasibleServices(prisma);
  for (const { dateStr, service, unplaced } of infeasible) {
    console.log(
      `✗ ${dateStr} ${service} : ${unplaced.length} groupe(s) sans table`,
    );
    for (const r of unplaced) {
      console.log(`    ${r.id}  ${r.name}  (${r.guests} pers.)`);
    }
  }
  console.log(`${infeasible.length} service(s) futur(s) infaisable(s).`);

  await prisma.$disconnect();
  process.exit(infeasible.length > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
