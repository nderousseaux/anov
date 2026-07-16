#!/usr/bin/env tsx
/**
 * Script pour lancer manuellement le cron de rappels de bons cadeaux
 * Appelle l'API /api/cron/gift-card-reminders
 */

import { config } from "dotenv";
config({ path: ".env.local" });

async function main() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    process.exit(1);
  }

  const res = await fetch(`${baseUrl}/api/cron/gift-card-reminders`, {
    headers: { "x-cron-secret": cronSecret },
  });

  if (!res.ok) {
    await res.json().catch(() => ({}));
    process.exit(1);
  }

  await res.json();
}

main().catch(() => {
  process.exit(1);
});