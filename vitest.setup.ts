// Vitest setup file
import { beforeAll, vi } from "vitest";

// Mock process.env for tests that need it
// Using NodeJS.ProcessEnv to match Node.js type definitions
if (!process.env) {
  process.env = {} as NodeJS.ProcessEnv;
}
process.env.STRIPE_SECRET_KEY = "sk_test_123";
process.env.NEXTAUTH_SECRET = "test-secret-key-for-testing";
process.env.SMTP_HOST = "smtp.test.com";
process.env.SMTP_USER = "testuser";
process.env.SMTP_PASSWORD = "testpassword";
process.env.DATABASE_URL =
  "postgresql://test:test@localhost:5432/test?schema=public";

// Mock next/headers before it's imported
const mockCookies = vi
  .fn()
  .mockReturnValue({ get: vi.fn().mockReturnValue(undefined) });
vi.mock("next/headers", () => ({
  cookies: () => mockCookies(),
  headers: vi.fn(),
}));

// Mock jose before it's imported
vi.mock("jose", () => ({
  SignJWT: class {
    private payload: Record<string, unknown> = {};
    private secret = "";
    private header: Record<string, unknown> = { alg: "HS256" };
    private issuedAt = false;
    private expirationTime: number | null = null;

    setProtectedHeader(header: Record<string, unknown>) {
      this.header = header;
      return this;
    }

    setIssuedAt() {
      this.issuedAt = true;
      return this;
    }

    setExpirationTime(exp: string) {
      if (typeof exp === "string") {
        // Parse 8h as 8 hours in seconds
        const match = exp.match(/(\d+)h/);
        if (match) {
          this.expirationTime = parseInt(match[0]) * 60 * 60;
        }
      }
      return this;
    }

    sign(secret: string) {
      this.secret = secret;
      // Return a mock JWT token
      const encodedHeader = Buffer.from(JSON.stringify(this.header)).toString(
        "base64url",
      );
      const encodedPayload = Buffer.from(JSON.stringify(this.payload)).toString(
        "base64url",
      );
      const signature = "mocksignature";
      return `${encodedHeader}.${encodedPayload}.${signature}`;
    }

    setPayload(payload: Record<string, unknown>) {
      this.payload = payload;
      return this;
    }
  },
  jwtVerify: vi
    .fn()
    .mockImplementation(async (token: string, _secret: string) => {
      // Decode the mock token
      const parts = token.split(".");
      if (parts.length !== 3) {
        throw new Error("Invalid token");
      }
      try {
        const payload = JSON.parse(
          Buffer.from(parts[1], "base64url").toString(),
        );
        return { payload };
      } catch {
        throw new Error("Invalid token");
      }
    }),
}));

beforeAll(() => {
  // Set up environment variables for tests
  process.env.STRIPE_SECRET_KEY = "sk_test_123";
  process.env.NEXTAUTH_SECRET = "test-secret-key-for-testing";
  process.env.SMTP_HOST = "smtp.test.com";
  process.env.SMTP_USER = "testuser";
  process.env.SMTP_PASSWORD = "testpassword";
  process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
  process.env.NEXT_PUBLIC_BASE_URL = "http://localhost:3000";
});

// Global types for vitest
declare global {
  const beforeEach: typeof import("vitest").beforeEach;
  const afterAll: typeof import("vitest").afterAll;
  const describe: typeof import("vitest").describe;
  const it: typeof import("vitest").it;
  const expect: typeof import("vitest").expect;
  const vi: typeof import("vitest").vi;
}
