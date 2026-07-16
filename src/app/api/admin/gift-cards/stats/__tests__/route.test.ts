// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromCookies } from "@/lib/auth";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    giftCard: {
      count: vi.fn(),
      aggregate: vi.fn(),
    },
  },
}));

vi.mock("@/lib/auth", () => ({
  getAdminFromCookies: vi.fn(),
}));

describe("Admin Gift Cards Stats API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/admin/gift-cards/stats", () => {
    it("returns 401 if not authenticated", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue(null);

      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/gift-cards/stats"),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any);

      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toBe("Non autorisé");
    });

    it("returns gift card statistics", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });

      const now = new Date();

      vi.mocked(prisma.giftCard.count).mockImplementation(() =>
        Promise.resolve(10),
      );
      vi.mocked(prisma.giftCard.aggregate).mockResolvedValue({
        _sum: { amount: 10000 },
        _count: { amount: 10 },
      });

      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/gift-cards/stats"),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.totalIssued).toBe(10);
    });

    it("returns active gift cards count", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });

      const now = new Date();

      vi.mocked(prisma.giftCard.count).mockImplementation(() =>
        Promise.resolve(5),
      );
      vi.mocked(prisma.giftCard.aggregate).mockResolvedValue({
        _sum: { amount: 25000 },
        _count: { amount: 5 },
      });

      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/gift-cards/stats"),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.active).toBe(5);
    });

    it("returns expired gift cards count", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });

      const now = new Date();

      vi.mocked(prisma.giftCard.count).mockImplementation(() =>
        Promise.resolve(2),
      );
      vi.mocked(prisma.giftCard.aggregate).mockResolvedValue({
        _sum: { amount: 30000 },
        _count: { amount: 2 },
      });

      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/gift-cards/stats"),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.expired).toBe(2);
    });

    it("returns in-progress payment count", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });

      const now = new Date();

      vi.mocked(prisma.giftCard.count).mockImplementation(() =>
        Promise.resolve(3),
      );
      vi.mocked(prisma.giftCard.aggregate).mockResolvedValue({
        _sum: { amount: 20000 },
        _count: { amount: 3 },
      });

      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/gift-cards/stats"),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.inProgress).toBe(3);
    });

    it("returns total amount for valid gift cards", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });

      vi.mocked(prisma.giftCard.count).mockImplementation(() =>
        Promise.resolve(10),
      );
      vi.mocked(prisma.giftCard.aggregate).mockResolvedValue({
        _sum: { amount: 50000 },
        _count: { amount: 10 },
      });

      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/gift-cards/stats"),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.totalAmount).toBe(50000);
    });
  });
});
