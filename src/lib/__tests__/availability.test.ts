// @ts-nocheck
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { prisma } from "@/lib/prisma";
import { buildConfigs } from "@/lib/seating";
import { isServiceAvailable, loadConfigs } from "@/lib/seating/db";
import {
  getMonthServiceAvailability,
  getServicesAvailability,
  getSlotsWithAvailability,
  getUnavailableDatesForMonth,
} from "../availability";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    restaurantSettings: { findFirst: vi.fn() },
    dayOverride: { findUnique: vi.fn(), findMany: vi.fn() },
    reservation: { findMany: vi.fn() },
  },
}));

vi.mock("@/lib/seating/db", async (importOriginal) => ({
  ...(await importOriginal()),
  isServiceAvailable: vi.fn(),
  loadConfigs: vi.fn(),
}));

const SETTINGS = {
  id: 1,
  openingDays: JSON.stringify([2, 3, 4, 5, 6]), // mar–sam
  openingSlots: JSON.stringify(["12:00", "12:30", "19:00", "19:30"]),
};

describe("availability", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Lundi 2 novembre 2026, 10h (heure locale)
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 10, 2, 10, 0));
    vi.mocked(prisma.restaurantSettings.findFirst).mockResolvedValue(SETTINGS);
    vi.mocked(prisma.dayOverride.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.dayOverride.findMany).mockResolvedValue([]);
    vi.mocked(prisma.reservation.findMany).mockResolvedValue([]);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("getServicesAvailability", () => {
    it("returns nothing for a closed day", async () => {
      expect(await getServicesAvailability("2026-11-08", 2)).toEqual([]); // dimanche
    });

    it("returns nothing for an overridden closed day", async () => {
      vi.mocked(prisma.dayOverride.findUnique).mockResolvedValue({
        closed: true,
        openingSlots: null,
      });
      expect(await getServicesAvailability("2026-11-03", 2)).toEqual([]);
    });

    it("splits slots into lunch and dinner with per-service availability", async () => {
      vi.mocked(isServiceAvailable).mockImplementation(
        async (_db, { service }) => service === "lunch",
      );

      const services = await getServicesAvailability("2026-11-03", 2);

      expect(services).toEqual([
        {
          key: "lunch",
          slots: ["12:00", "12:30"],
          started: false,
          available: true,
        },
        {
          key: "dinner",
          slots: ["19:00", "19:30"],
          started: false,
          available: false,
        },
      ]);
      expect(isServiceAvailable).toHaveBeenCalledWith(
        prisma,
        expect.objectContaining({ dateStr: "2026-11-03", size: 2 }),
      );
    });

    it("does not offer a service already started today", async () => {
      vi.setSystemTime(new Date(2026, 10, 3, 12, 15)); // mardi, midi entamé
      vi.mocked(isServiceAvailable).mockResolvedValue(true);

      const services = await getServicesAvailability("2026-11-03", 2);

      expect(services.find((s) => s.key === "lunch")).toMatchObject({
        started: true,
        available: false,
      });
      expect(services.find((s) => s.key === "dinner").available).toBe(true);
    });
  });

  describe("getSlotsWithAvailability", () => {
    it("flattens services into slots sharing their service availability", async () => {
      vi.mocked(isServiceAvailable).mockImplementation(
        async (_db, { service }) => service === "dinner",
      );

      expect(await getSlotsWithAvailability("2026-11-03", 2)).toEqual([
        { time: "12:00", available: false },
        { time: "12:30", available: false },
        { time: "19:00", available: true },
        { time: "19:30", available: true },
      ]);
    });

    it("drops started services", async () => {
      vi.setSystemTime(new Date(2026, 10, 3, 12, 15));
      vi.mocked(isServiceAvailable).mockResolvedValue(true);

      const slots = await getSlotsWithAvailability("2026-11-03", 2);
      expect(slots.map((s) => s.time)).toEqual(["19:00", "19:30"]);
    });
  });

  describe("getMonthServiceAvailability", () => {
    beforeEach(() => {
      // Une seule table de 2 : un seul groupe par service
      vi.mocked(loadConfigs).mockResolvedValue(
        buildConfigs([{ id: 1, capacity: 2 }], []),
      );
    });

    const booking = (iso: string, guests = 2) => ({
      id: `r-${iso}`,
      date: new Date(iso),
      guests,
      pinnedTableIds: [],
    });

    it("computes available services per date from reservations", async () => {
      vi.mocked(prisma.reservation.findMany).mockResolvedValue([
        booking("2026-11-03T12:00:00.000Z"), // mardi midi complet
        booking("2026-11-03T19:00:00.000Z"), // mardi soir complet
        booking("2026-11-04T12:30:00.000Z"), // mercredi midi complet
      ]);

      const result = await getMonthServiceAvailability("2026-11", 2);

      expect(result["2026-11-03"]).toEqual([]);
      expect(result["2026-11-04"]).toEqual(["dinner"]);
      expect(result["2026-11-05"]).toEqual(["lunch", "dinner"]);
    });

    it("excludes closed days, overrides and non-opening days", async () => {
      vi.mocked(prisma.dayOverride.findMany).mockResolvedValue([
        {
          date: new Date("2026-11-05T00:00:00.000Z"),
          closed: true,
          openingSlots: null,
        },
      ]);

      const result = await getMonthServiceAvailability("2026-11", 2);

      expect(result["2026-11-05"]).toEqual([]);
      expect(result["2026-11-08"]).toEqual([]); // dimanche
    });

    it("ignores past dates", async () => {
      const result = await getMonthServiceAvailability("2026-11", 2);
      expect(result["2026-11-01"]).toBeUndefined();
      expect(result["2026-11-02"]).toEqual([]); // lundi, fermé
    });

    it("hides services already started today", async () => {
      vi.setSystemTime(new Date(2026, 10, 3, 12, 15));
      const result = await getMonthServiceAvailability("2026-11", 2);
      expect(result["2026-11-03"]).toEqual(["dinner"]);
    });

    it("a group larger than any table or combination is never available", async () => {
      const result = await getMonthServiceAvailability("2026-11", 6);
      expect(result["2026-11-03"]).toEqual([]);
    });

    it("counts a pinned reservation against its table", async () => {
      vi.mocked(loadConfigs).mockResolvedValue(
        buildConfigs(
          [
            { id: 1, capacity: 2 },
            { id: 2, capacity: 4 },
          ],
          [],
        ),
      );
      vi.mocked(prisma.reservation.findMany).mockResolvedValue([
        { ...booking("2026-11-03T12:00:00.000Z"), pinnedTableIds: [2] },
      ]);

      const result = await getMonthServiceAvailability("2026-11", 4);

      expect(result["2026-11-03"]).toEqual(["dinner"]); // la seule table de 4 est prise le midi
    });
  });

  describe("getUnavailableDatesForMonth", () => {
    it("lists the dates from today on without any available service", async () => {
      vi.mocked(loadConfigs).mockResolvedValue(
        buildConfigs([{ id: 1, capacity: 2 }], []),
      );
      vi.mocked(prisma.reservation.findMany).mockResolvedValue([
        {
          id: "a",
          date: new Date("2026-11-03T12:00:00.000Z"),
          guests: 2,
          pinnedTableIds: [],
        },
        {
          id: "b",
          date: new Date("2026-11-03T19:00:00.000Z"),
          guests: 2,
          pinnedTableIds: [],
        },
      ]);

      const result = await getUnavailableDatesForMonth("2026-11", 2);

      expect(result).toContain("2026-11-03"); // complet
      expect(result).toContain("2026-11-08"); // dimanche
      expect(result).not.toContain("2026-11-04");
      expect(result).not.toContain("2026-11-01"); // passé
    });
  });
});
