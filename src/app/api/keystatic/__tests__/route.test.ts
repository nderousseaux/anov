import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@keystatic/next/route-handler", () => ({
  makeRouteHandler: vi.fn().mockImplementation(() => ({
    GET: vi.fn().mockResolvedValue({}),
    POST: vi.fn().mockResolvedValue({}),
  })),
}));

describe("Keystatic API", () => {
  describe("GET /api/keystatic", () => {
    it("delegates to makeRouteHandler", async () => {
      const { GET } = await import("../route");

      const req = new NextRequest(
        new URL("http://localhost:3000/api/keystatic"),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any);

      expect(res).toBeDefined();
    });
  });

  describe("POST /api/keystatic", () => {
    it("delegates to makeRouteHandler", async () => {
      const { POST } = await import("../route");

      const req = new NextRequest(
        new URL("http://localhost:3000/api/keystatic"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        },
      );
      const res = await POST(req as any);

      expect(res).toBeDefined();
    });
  });
});
