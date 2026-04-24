/**
 * Seed: crée les tables du restaurant + un compte admin par défaut.
 * Usage: pnpm tsx prisma/seed.ts
 */
import { createHash } from 'crypto';

async function main() {
  // Load env vars first (dynamic import to avoid ESM hoisting issues)
  const { config } = await import('dotenv');
  config();

  const { PrismaClient } = await import('../src/generated/prisma');
  const { PrismaNeon } = await import('@prisma/adapter-neon');

  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set');

  // PrismaNeon takes a PoolConfig (WebSocket-based Pool)
  const adapter = new PrismaNeon({ connectionString: url });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const prisma = new PrismaClient({ adapter } as any);

  function hashPassword(pw: string) {
    return createHash('sha256').update(pw).digest('hex');
  }

  // Tables du restaurant (15-20 couverts max)
  const tables = [
    { name: 'Table 1', capacity: 2 },
    { name: 'Table 2', capacity: 2 },
    { name: 'Table 3', capacity: 4 },
    { name: 'Table 4', capacity: 4 },
    { name: 'Table 5', capacity: 4 },
    { name: 'Table 6', capacity: 6 },
  ];

  for (const t of tables) {
    await prisma.table.upsert({
      where: { name: t.name },
      update: { capacity: t.capacity },
      create: t,
    });
  }

  // Compte admin par défaut
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@anov.fr';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'ChangeMe123!';
  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: hashPassword(adminPassword),
    },
  });

  console.log('✅ Seed terminé');
  console.log(`   Admin: ${adminEmail} / ${adminPassword}`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
