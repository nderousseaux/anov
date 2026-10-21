// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { getAdminFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    restaurantSettings: { upsert: vi.fn() },
    dayOverride: { findMany: vi.fn() },
    reservation: { findMany: vi.fn() },
    table: { findMany: vi.fn() },
    event: { findMany: vi.fn() },
  },
}));

vi.mock("@/lib/auth", () => ({
  getAdminFromCookies: vi.fn(),
}));

// Tables 2 + 4 en ligne, et une table de 4 réservée au walk-in
const TABLES = [
  { id: 1, capacity: 2, walkIn: false },
  { id: 2, capacity: 4, walkIn: false },
  { id: 3, capacity: 4, walkIn: true },
];

const SETTINGS = {
  id: 1,
  mealDuration: 90,
  openingDays: JSON.stringify([0, 1, 2, 3, 4, 5, 6]),
  openingSlots: JSON.stringify(["12:00", "19:00"]),
  depositPerGuestCents: 2000,
  daysBeforeReminder: 3,
};

async function getCalendar(query = "") {
  const { GET } = await import("../route");
  const res = await GET(
    new NextRequest(
      new URL(`http://localhost:3000/api/admin/calendar${query}`),
      { method: "GET" },
    ) as any,
  );
  return res;
}

describe("Admin Calendar API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });
    vi.mocked(prisma.table.findMany).mockResolvedValue(TABLES);
    vi.mocked(prisma.restaurantSettings.upsert).mockResolvedValue(SETTINGS);
    vi.mocked(prisma.dayOverride.findMany).mockResolvedValue([]);
    vi.mocked(prisma.reservation.findMany).mockResolvedValue([]);
    vi.mocked(prisma.event.findMany).mockResolvedValue([]);
  });

  describe("GET /api/admin/calendar", () => {
    it("returns 401 if not authenticated", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue(null);

      const res = await getCalendar();

      expect(res.status).toBe(401);
      expect((await res.json()).error).toBe("Non autorisé");
    });

    it("returns calendar data for default range (28 days)", async () => {
      const res = await getCalendar();

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(28);
    });

    it("returns calendar data with custom days parameter", async () => {
      const data = await (await getCalendar("?days=7")).json();
      expect(data.length).toBe(7);
    });

    it("caps days at 56", async () => {
      const data = await (await getCalendar("?days=100")).json();
      expect(data.length).toBe(56);
    });

    it("computes the daily capacity from the online pool times the open services", async () => {
      const data = await (await getCalendar("?days=1")).json();

      // (2 + 4) places en ligne × 2 services : la table walk-in ne compte pas
      expect(data[0].totalCapacity).toBe(12);
    });

    it("counts a single open service once", async () => {
      vi.mocked(prisma.restaurantSettings.upsert).mockResolvedValue({
        ...SETTINGS,
        openingSlots: JSON.stringify(["19:00", "19:30", "20:00"]),
      });

      const data = await (await getCalendar("?days=1")).json();

      // plus de rotation : trois créneaux du soir = un seul service
      expect(data[0].totalCapacity).toBe(6);
    });

    it("has no capacity on a closed day", async () => {
      vi.mocked(prisma.restaurantSettings.upsert).mockResolvedValue({
        ...SETTINGS,
        openingDays: JSON.stringify([]),
      });

      const data = await (await getCalendar("?days=1")).json();

      expect(data[0].effectiveOpen).toBe(false);
      expect(data[0].totalCapacity).toBe(0);
    });

    it("handles day overrides correctly", async () => {
      const overrideDate = new Date();
      const overrideDateStr = overrideDate.toISOString().split("T")[0];
      vi.mocked(prisma.dayOverride.findMany).mockResolvedValue([
        {
          id: 1,
          date: overrideDate,
          maxCovers: null,
          openingSlots: JSON.stringify(["19:30"]),
          closed: false,
        },
      ]);

      const res = await getCalendar(`?from=${overrideDateStr}`);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.length).toBe(28);
      // l'exception ne garde que le soir : un seul service
      expect(data[0].hasOverride).toBe(true);
      expect(data[0].totalCapacity).toBe(6);
    });

    it("sums reserved guests by day", async () => {
      const day = new Date().toISOString().split("T")[0];
      vi.mocked(prisma.reservation.findMany).mockResolvedValue([
        { date: new Date(`${day}T12:00:00.000Z`), guests: 2 },
        { date: new Date(`${day}T19:00:00.000Z`), guests: 4 },
      ]);

      const data = await (await getCalendar(`?from=${day}&days=1`)).json();

      expect(data[0].reservedGuests).toBe(6);
      expect(data[0].reservationCount).toBe(2);
    });
  });
});
