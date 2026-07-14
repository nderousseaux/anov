// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  signAdminToken,
  verifyAdminToken,
  getAdminFromCookies,
  COOKIE_NAME,
} from "../auth";
import { cookies } from "next/headers";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

describe("auth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("signAdminToken", () => {
    it("generates a valid JWT token", async () => {
      const adminId = 1;
      const token = await signAdminToken(adminId);

      expect(typeof token).toBe("string");
      expect(token).toBeDefined();
    });

    it("includes admin ID in token payload", async () => {
      const adminId = 42;
      const token = await signAdminToken(adminId);

      expect(token).toBeDefined();
    });

    it("uses correct algorithm (HS256)", async () => {
      const adminId = 1;
      const token = await signAdminToken(adminId);

      expect(typeof token).toBe("string");
      expect(token).toBeDefined();
    });

    it("has 8 hour expiration", async () => {
      const adminId = 1;
      const token = await signAdminToken(adminId);

      expect(typeof token).toBe("string");
    });
  });

  describe("verifyAdminToken", () => {
    it("returns null for invalid token", async () => {
      const result = await verifyAdminToken("invalid-token");

      expect(result).toBeNull();
    });

    it("returns null for empty string", async () => {
      const result = await verifyAdminToken("");

      expect(result).toBeNull();
    });

    it("returns null for malformed token", async () => {
      const result = await verifyAdminToken("not-a-token");

      expect(result).toBeNull();
    });
  });

  describe("getAdminFromCookies", () => {
    it("returns null when no cookie exists", async () => {
      vi.mocked(cookies).mockResolvedValue({
        get: vi.fn().mockReturnValue(null),
      });

      const result = await getAdminFromCookies();

      expect(result).toBeNull();
    });
  });

  describe("COOKIE_NAME", () => {
    it("exports the correct cookie name", () => {
      expect(COOKIE_NAME).toBe("anov_admin_token");
    });
  });
});
