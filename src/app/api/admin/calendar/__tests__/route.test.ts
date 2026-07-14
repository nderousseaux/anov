import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { getAdminFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  getTables,
  getTotalTableCapacity,
  computeServiceTurns,
} from "@/lib/tables";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    restaurantSettings: {
      upsert: vi.fn(),
      findUnique: vi.fn(),
    },
    dayOverride: {
      findMany: vi.fn(),
    },
    reservation: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock("@/lib/auth", () => ({
  getAdminFromCookies: vi.fn(),
}));

vi.mock("@/lib/tables", () => ({
  getTables: vi.fn(),
  getTotalTableCapacity: vi.fn(),
  computeServiceTurns: vi.fn(),
}));

describe("Admin Calendar API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/admin/calendar", () => {
    it("returns 401 if not authenticated", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue(null);

      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/calendar"),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any);

      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toBe("Non autorisé");
    });

    it("returns calendar data for default range (28 days)", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });

      vi.mocked(getTables).mockResolvedValue([
        { id: 1, name: "Table 1", capacity: 2, posX: 0, posY: 0 },
        { id: 2, name: "Table 2", capacity: 4, posX: 1, posY: 0 },
      ]);
      vi.mocked(getTotalTableCapacity).mockReturnValue(6);
      vi.mocked(computeServiceTurns).mockReturnValue(1);
      vi.mocked(prisma.restaurantSettings.upsert).mockResolvedValue({
        id: 1,
        mealDuration: 90,
        maxCovers: 50,
        openingDays: JSON.stringify([1, 2, 3, 4, 5]),
        openingSlots: JSON.stringify(["12:00", "19:00"]),
        depositPerGuestCents: 2000,
        daysBeforeReminder: 3,
      });
      vi.mocked(prisma.dayOverride.findMany).mockResolvedValue([]);
      vi.mocked(prisma.reservation.findMany).mockResolvedValue([]);

      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/calendar"),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(28);
    });

    it("returns calendar data with custom days parameter", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });

      vi.mocked(getTables).mockResolvedValue([]);
      vi.mocked(getTotalTableCapacity).mockReturnValue(0);
      vi.mocked(computeServiceTurns).mockReturnValue(0);
      vi.mocked(prisma.restaurantSettings.upsert).mockResolvedValue({
        id: 1,
        mealDuration: 90,
        maxCovers: 50,
        openingDays: JSON.stringify([1, 2, 3, 4, 5]),
        openingSlots: JSON.stringify(["12:00", "19:00"]),
        depositPerGuestCents: 2000,
        daysBeforeReminder: 3,
      });
      vi.mocked(prisma.dayOverride.findMany).mockResolvedValue([]);
      vi.mocked(prisma.reservation.findMany).mockResolvedValue([]);

      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/calendar?days=7"),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.length).toBe(7);
    });

    it("caps days at 56", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });

      vi.mocked(getTables).mockResolvedValue([]);
      vi.mocked(getTotalTableCapacity).mockReturnValue(0);
      vi.mocked(computeServiceTurns).mockReturnValue(0);
      vi.mocked(prisma.restaurantSettings.upsert).mockResolvedValue({
        id: 1,
        mealDuration: 90,
        maxCovers: 50,
        openingDays: JSON.stringify([1, 2, 3, 4, 5]),
        openingSlots: JSON.stringify(["12:00", "19:00"]),
        depositPerGuestCents: 2000,
        daysBeforeReminder: 3,
      });
      vi.mocked(prisma.dayOverride.findMany).mockResolvedValue([]);
      vi.mocked(prisma.reservation.findMany).mockResolvedValue([]);

      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/calendar?days=100"),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.length).toBe(56);
    });

    it("handles day overrides correctly", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });

      vi.mocked(getTables).mockResolvedValue([]);
      vi.mocked(getTotalTableCapacity).mockReturnValue(0);
      vi.mocked(computeServiceTurns).mockReturnValue(0);

      const overrideDate = new Date();
      const overrideDateStr = overrideDate.toISOString().split("T")[0];

      vi.mocked(prisma.restaurantSettings.upsert).mockResolvedValue({
        id: 1,
        mealDuration: 90,
        maxCovers: 50,
        openingDays: JSON.stringify([1, 2, 3, 4, 5]),
        openingSlots: JSON.stringify(["12:00", "19:00"]),
        depositPerGuestCents: 2000,
        daysBeforeReminder: 3,
      });
      vi.mocked(prisma.dayOverride.findMany).mockResolvedValue([
        {
          id: 1,
          date: overrideDate,
          maxCovers: null,
          openingSlots: JSON.stringify(["12:30", "19:30"]),
          closed: false,
        },
      ]);
      vi.mocked(prisma.reservation.findMany).mockResolvedValue([]);

      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL(
          `http://localhost:3000/api/admin/calendar?from=${overrideDateStr}`,
        ),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.length).toBe(28);
    });
  });
});
