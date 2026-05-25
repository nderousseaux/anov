/**
 * Seed: crée les tables du restaurant + un compte admin par défaut.
 * Usage: pnpm tsx prisma/seed.ts
 */
import { createHash } from 'crypto';

async function main() {
  // Load env vars first (dynamic import to avoid ESM hoisting issues)
  const { config } = await import('dotenv');
  config({ path: '.env.local' });

  const { PrismaClient } = await import('../src/generated/prisma');
  const { PrismaPg } = await import('@prisma/adapter-pg');

  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set');

  const expandedUrl = url.replace(/\$\{([^}]+)\}/g, (_, name) => process.env[name] ?? '');
  const adapter = new PrismaPg({ connectionString: expandedUrl });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const prisma = new PrismaClient({ adapter } as any);

  function hashPassword(pw: string) {
    return createHash('sha256').update(pw).digest('hex');
  }

  // Compte admin par défaut (email fixe, mot de passe via ADMIN_PASSWORD)
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'ChangeMe123!';
  await prisma.admin.upsert({
    where: { email: 'admin' },
    update: {},
    create: {
      email: 'admin',
      passwordHash: hashPassword(adminPassword),
    },
  });

  console.log('✅ Seed terminé');
  console.log(`   Admin: admin / ${adminPassword}`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
