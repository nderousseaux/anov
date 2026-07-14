// Vitest setup file
import {} from "vitest";

// Add any custom matchers or setup here

// Global types for vitest
declare global {
  const beforeEach: typeof import("vitest").beforeEach;
  const afterAll: typeof import("vitest").afterAll;
  const describe: typeof import("vitest").describe;
  const it: typeof import("vitest").it;
  const expect: typeof import("vitest").expect;
  const vi: typeof import("vitest").vi;
}
