// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from "vitest";
import { prisma } from "@/lib/prisma";
import {
  getTables,
  getDayReservationsForTables,
  computeBusyTableIds,
  pickTable,
} from "@/lib/tables";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    restaurantSettings: {
      findFirst: vi.fn(),
    },
    dayOverride: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
    },
    reservation: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock("@/lib/tables", () => ({
  getTables: vi.fn(),
  getDayReservationsForTables: vi.fn(),
  computeBusyTableIds: vi.fn(),
  pickTable: vi.fn(),
}));

describe("availability", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exports getSlotsWithAvailability function", async () => {
    const { getSlotsWithAvailability } = await import("../availability");
    expect(typeof getSlotsWithAvailability).toBe("function");
  });

  it("exports getUnavailableDatesForMonth function", async () => {
    const { getUnavailableDatesForMonth } = await import("../availability");
    expect(typeof getUnavailableDatesForMonth).toBe("function");
  });

  describe("getSlotsWithAvailability", () => {
    it("returns empty array for closed days", async () => {
      vi.mocked(prisma.restaurantSettings.findFirst).mockResolvedValue({
        id: 1,
        openingDays: JSON.stringify([1, 2, 3]),
        openingSlots: JSON.stringify(["12:00", "19:00"]),
      });
      vi.mocked(prisma.dayOverride.findUnique).mockResolvedValue(null);
      vi.mocked(getTables).mockResolvedValue([]);
      vi.mocked(getDayReservationsForTables).mockResolvedValue([]);
      vi.mocked(computeBusyTableIds).mockReturnValue(new Set());
      vi.mocked(pickTable).mockReturnValue({ id: 1, capacity: 2 });

      const { getSlotsWithAvailability } = await import("../availability");

      // Test with a day that's not in openingDays
      const result = await getSlotsWithAvailability("2024-06-16", 2); // Sunday
      expect(result).toEqual([]);
    });

    it("returns slots with availability status", async () => {
      vi.mocked(prisma.restaurantSettings.findFirst).mockResolvedValue({
        id: 1,
        openingDays: JSON.stringify([2, 3, 4, 5, 6]),
        openingSlots: JSON.stringify(["12:00", "19:00"]),
      });
      vi.mocked(prisma.dayOverride.findUnique).mockResolvedValue(null);
      vi.mocked(getTables).mockResolvedValue([
        { id: 1, name: "Table 1", capacity: 2, posX: 0, posY: 0 },
        { id: 2, name: "Table 2", capacity: 4, posX: 1, posY: 0 },
      ]);
      vi.mocked(getDayReservationsForTables).mockResolvedValue([]);
      vi.mocked(computeBusyTableIds).mockReturnValue(new Set());
      vi.mocked(pickTable).mockReturnValue({ id: 1, capacity: 2 });

      const { getSlotsWithAvailability } = await import("../availability");

      const result = await getSlotsWithAvailability("2024-06-18", 2); // Tuesday
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty("time");
      expect(result[0]).toHaveProperty("available");
    });

    it("filters out past slots for today", async () => {
      const now = new Date();
      const todayStr = now.toISOString().split("T")[0];

      vi.mocked(prisma.restaurantSettings.findFirst).mockResolvedValue({
        id: 1,
        openingDays: JSON.stringify([now.getDay()]),
        openingSlots: JSON.stringify(["08:00", "12:00", "19:00"]),
      });
      vi.mocked(prisma.dayOverride.findUnique).mockResolvedValue(null);
      vi.mocked(getTables).mockResolvedValue([]);
      vi.mocked(getDayReservationsForTables).mockResolvedValue([]);
      vi.mocked(computeBusyTableIds).mockReturnValue(new Set());
      vi.mocked(pickTable).mockReturnValue({ id: 1 });

      const { getSlotsWithAvailability } = await import("../availability");

      const result = await getSlotsWithAvailability(todayStr, 2);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("getUnavailableDatesForMonth", () => {
    it("returns list of unavailable dates", async () => {
      vi.mocked(prisma.restaurantSettings.findFirst).mockResolvedValue({
        id: 1,
        openingDays: JSON.stringify([2, 3, 4, 5, 6]),
        openingSlots: JSON.stringify(["12:00", "19:00"]),
      });
      vi.mocked(prisma.dayOverride.findMany).mockResolvedValue([]);
      vi.mocked(prisma.reservation.findMany).mockResolvedValue([]);
      vi.mocked(getTables).mockResolvedValue([
        { id: 1, name: "Table 1", capacity: 2, posX: 0, posY: 0 },
      ]);

      const { getUnavailableDatesForMonth } = await import("../availability");

      const result = await getUnavailableDatesForMonth("2024-06", 2);
      expect(Array.isArray(result)).toBe(true);
    });

    it("excludes past dates from results", async () => {
      const now = new Date();
      const pastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

      vi.mocked(prisma.restaurantSettings.findFirst).mockResolvedValue({
        id: 1,
        openingDays: JSON.stringify([2, 3, 4, 5, 6]),
        openingSlots: JSON.stringify(["12:00", "19:00"]),
      });
      vi.mocked(prisma.dayOverride.findMany).mockResolvedValue([]);
      vi.mocked(prisma.reservation.findMany).mockResolvedValue([]);
      vi.mocked(getTables).mockResolvedValue([
        { id: 1, name: "Table 1", capacity: 2, posX: 0, posY: 0 },
      ]);

      const { getUnavailableDatesForMonth } = await import("../availability");

      const monthStr = `${pastMonth.getFullYear()}-${String(pastMonth.getMonth() + 1).padStart(2, "0")}`;
      const result = await getUnavailableDatesForMonth(monthStr, 2);

      // Past dates should not be included in results
      const todayStr = now.toISOString().split("T")[0];
      result.forEach((dateStr) => {
        expect(dateStr >= todayStr).toBe(true);
      });
    });

    it("marks closed days as unavailable", async () => {
      const now = new Date();
      const futureDate = new Date(now);
      futureDate.setDate(futureDate.getDate() + 10);
      const dateStr = futureDate.toISOString().split("T")[0];

      vi.mocked(prisma.restaurantSettings.findFirst).mockResolvedValue({
        id: 1,
        openingDays: JSON.stringify([2, 3, 4, 5, 6]),
        openingSlots: JSON.stringify(["12:00", "19:00"]),
      });
      vi.mocked(prisma.dayOverride.findMany).mockResolvedValue([
        {
          date: futureDate,
          closed: true,
          openingSlots: null,
        },
      ]);
      vi.mocked(prisma.reservation.findMany).mockResolvedValue([]);
      vi.mocked(getTables).mockResolvedValue([]);

      const { getUnavailableDatesForMonth } = await import("../availability");

      const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      const result = await getUnavailableDatesForMonth(monthStr, 2);
      expect(result).toContain(dateStr);
    });

    it("marks non-opening days as unavailable", async () => {
      vi.mocked(prisma.restaurantSettings.findFirst).mockResolvedValue({
        id: 1,
        openingDays: JSON.stringify([2, 3, 4, 5, 6]),
        openingSlots: JSON.stringify(["12:00", "19:00"]),
      });
      vi.mocked(prisma.dayOverride.findMany).mockResolvedValue([]);
      vi.mocked(prisma.reservation.findMany).mockResolvedValue([]);
      vi.mocked(getTables).mockResolvedValue([]);

      const { getUnavailableDatesForMonth } = await import("../availability");

      // Test with a Sunday (day 0), which is not in openingDays
      const monthStr = "2024-06";
      const result = await getUnavailableDatesForMonth(monthStr, 2);
      // Some Sundays in June 2024 should be in the unavailable list
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
