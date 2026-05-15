import { config as loadEnv } from 'dotenv';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';

const MODE_ALIASES = {
  local: 'local',
  localhost: 'local',
  dev: 'development',
  development: 'development',
  preview: 'preview',
  preprod: 'preview',
  prod: 'production',
  production: 'production',
};

const modeArg = process.argv[2]?.toLowerCase();
const command = process.argv.slice(3);

if (!modeArg || command.length === 0) {
  console.error('Usage: node scripts/db-mode.mjs <local|development|preview|production> <command...>');
  process.exit(1);
}

const mode = MODE_ALIASES[modeArg];
if (!mode) {
  console.error(`Unknown mode "${modeArg}". Use local, development, preview, or production.`);
  process.exit(1);
}

const envFileByMode = {
  local: '.env.local',
  development: '.env.development.local',
  preview: '.env.preview.local',
  production: '.env.production.local',
};

let envFile = process.env.ENV_FILE ?? envFileByMode[mode];
if (!process.env.ENV_FILE && mode === 'development' && !existsSync(envFile)) {
  envFile = '.env.local';
}
loadEnv({ path: envFile, override: true });

const joinedCommand = command.join(' ');
const writeOps = [
  'prisma db push',
  'prisma migrate dev',
  'prisma migrate reset',
  'prisma migrate deploy',
  'prisma db execute',
  'prisma db seed',
  'prisma/seed.ts',
];
const isPotentialWrite = writeOps.some((op) => joinedCommand.includes(op));

if (mode === 'production' && isPotentialWrite && process.env.ALLOW_PROD_DB_WRITE !== 'true') {
  console.error('Blocked: write operation targeting production DB.');
  console.error('Set ALLOW_PROD_DB_WRITE=true only when this action is intentional.');
  process.exit(1);
}


const child = spawn(command[0], command.slice(1), {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    APP_ENV: mode,
    ENV_FILE: envFile,
  },
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});
