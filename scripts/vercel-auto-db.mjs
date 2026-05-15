import { spawnSync } from 'node:child_process';

function runPnpm(script, extraEnv = {}) {
  const result = spawnSync('pnpm', [script], {
    stdio: 'inherit',
    env: { ...process.env, ...extraEnv },
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function runShell(command) {
  const result = spawnSync(command, {
    stdio: 'inherit',
    shell: true,
    env: process.env,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

const isVercel = process.env.VERCEL === '1';
const vercelEnv = process.env.VERCEL_ENV;
const gitBranch = process.env.VERCEL_GIT_COMMIT_REF;

if (!isVercel || !vercelEnv) {
  console.log('[db:auto] Skip: hors environnement Vercel.');
  process.exit(0);
}

console.log(`[db:auto] Vercel env=${vercelEnv} branch=${gitBranch ?? 'unknown'}`);

if (vercelEnv === 'production') {
  console.log('[db:auto] Production: migration deploy automatique.');
  runPnpm('db:prepare:prod', { ALLOW_PROD_DB_WRITE: 'true' });
  process.exit(0);
}

if (vercelEnv === 'preview') {
  if (gitBranch === 'dev') {
    console.log('[db:auto] Dev branch: migrate deploy + seed automatique sur development.');
    runPnpm('db:prepare:development');
    runPnpm('db:seed:development');
    process.exit(0);
  }

  if (gitBranch === 'preview') {
    const copyCommand = process.env.PREVIEW_DB_COPY_COMMAND;
    if (!copyCommand) {
      console.error('[db:auto] PREVIEW_DB_COPY_COMMAND manquant pour la branche preview.');
      console.error('[db:auto] Definir une commande de copie prod->preview (Neon branch copy), puis redeployer.');
      process.exit(1);
    }

    console.log('[db:auto] Preview branch: copie prod->preview, puis migrate deploy.');
    runShell(copyCommand);
    runPnpm('db:prepare:preview');
    process.exit(0);
  }

  console.log('[db:auto] Preview hors branches dev/preview: migrate deploy preview uniquement.');
  runPnpm('db:prepare:preview');
  process.exit(0);
}

console.log('[db:auto] Aucun workflow DB automatique pour cet environnement Vercel.');
