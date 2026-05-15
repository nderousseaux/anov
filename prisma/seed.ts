/**
 * Seed: crée les tables du restaurant + un compte admin par défaut.
 * Usage: pnpm tsx prisma/seed.ts
 */
import { createHash } from 'crypto';
import { existsSync } from 'fs';

const MODE_ALIASES: Record<string, 'local' | 'development' | 'preview' | 'production'> = {
  local: 'local',
  localhost: 'local',
  dev: 'development',
  development: 'development',
  preview: 'preview',
  preprod: 'preview',
  prod: 'production',
  production: 'production',
};

function resolveAppMode() {
  const rawMode = (process.env.APP_ENV ?? 'development').toLowerCase();
  return MODE_ALIASES[rawMode] ?? 'development';
}

function resolveEnvFile() {
  if (process.env.ENV_FILE) {
    return process.env.ENV_FILE;
  }

  const mode = resolveAppMode();
  if (mode === 'local') return '.env.local';
  if (mode === 'development') {
    return existsSync('.env.development.local') ? '.env.development.local' : '.env.local';
  }
  if (mode === 'preview') return '.env.preview.local';
  if (mode === 'production') return '.env.production.local';
  return '.env.local';
}

async function main() {
  // Load env vars first (dynamic import to avoid ESM hoisting issues)
  const { config } = await import('dotenv');
  config({ path: resolveEnvFile() });

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
