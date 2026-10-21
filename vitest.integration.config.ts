import { config } from "dotenv";
import path from "path";
import { defineConfig } from "vitest/config";

config({ path: ".env.local" });

/**
 * Tests d'intégration (vraie base Postgres, sans mock) : `pnpm test:integration`.
 * Ils tournent sur une base dédiée `anov_test`, dérivée de DATABASE_URL, et seulement
 * si celle-ci est locale : on ne touche jamais une base distante. DATABASE_URL_TEST
 * peut la surcharger. Sans base de test, les tests sont ignorés.
 */
function resolveTestDatabaseUrl(): string | undefined {
  if (process.env.DATABASE_URL_TEST) return process.env.DATABASE_URL_TEST;
  const raw = process.env.DATABASE_URL?.replace(
    /\$\{([^}]+)\}/g,
    (_, name) => process.env[name] ?? "",
  );
  if (!raw) return undefined;
  const url = new URL(raw);
  if (!["localhost", "127.0.0.1"].includes(url.hostname)) return undefined;
  url.pathname = "/anov_test";
  return url.toString();
}

const testUrl = resolveTestDatabaseUrl();

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.integration.test.ts"],
    // Une seule base partagée : pas de fichiers en parallèle
    fileParallelism: false,
    env: {
      DATABASE_URL: testUrl ?? "",
      DATABASE_URL_TEST: testUrl ?? "",
      STRIPE_SECRET_KEY: "sk_test_123",
    },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
