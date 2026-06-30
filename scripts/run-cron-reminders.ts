#!/usr/bin/env tsx
/**
 * Script pour lancer manuellement le cron de rappels
 * Appelle l'API /api/cron/reminders
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

async function main() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    console.error('[Cron] CRON_SECRET non définie dans .env.local');
    process.exit(1);
  }

  console.log('[Cron] Appel de /api/cron/reminders...');

  const res = await fetch(`${baseUrl}/api/cron/reminders`, {
    headers: { 'x-cron-secret': cronSecret },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    console.error('[Cron] Erreur:', res.status, data.error);
    process.exit(1);
  }

  const data = await res.json();
  console.log('[Cron] Résultats:', JSON.stringify(data, null, 2));
}

main().catch((err) => {
  console.error('[Cron] Erreur:', err);
  process.exit(1);
});
