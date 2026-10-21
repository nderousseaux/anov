// @ts-nocheck
import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";

// Mock at the very beginning, before any imports
vi.mock("@/lib/prisma", () => ({
  prisma: {
    restaurantSettings: {
      findFirst: vi.fn().mockResolvedValue({
        id: 1,
        mealDuration: 90,
        openingDays: JSON.stringify([2, 3, 4, 5, 6]),
        openingSlots: JSON.stringify(["12:00", "19:00"]),
      }),
    },
    dayOverride: {
      findUnique: vi.fn().mockResolvedValue(null),
      findMany: vi.fn().mockResolvedValue([]),
    },
    reservation: {
      findMany: vi.fn().mockResolvedValue([]),
    },
    table: {
      findMany: vi
        .fn()
        .mockResolvedValue([
          { id: 1, name: "Table 1", capacity: 2, posX: 0, posY: 0 },
        ]),
    },
  },
}));

vi.mock("@/lib/availability", async (importOriginal) => ({
  ...(await importOriginal()),
  getServicesAvailability: vi.fn(),
  getMonthServiceAvailability: vi.fn(),
}));

describe("Reservations Availability API", () => {
  describe("GET /api/reservations/availability", () => {
    it("returns 400 if guests is missing", async () => {
      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/reservations/availability"),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any);

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe("guests invalide (1 à 8)");
    });

    it("returns 400 if guests is less than 1", async () => {
      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/reservations/availability?guests=0"),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any);

      expect(res.status).toBe(400);
    });

    it("returns 400 if guests is more than 8", async () => {
      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/reservations/availability?guests=9"),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any);

      expect(res.status).toBe(400);
    });

    it("returns 400 if guests is not a number", async () => {
      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL(
          "http://localhost:3000/api/reservations/availability?guests=abc",
        ),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any);

      expect(res.status).toBe(400);
    });

    it("returns unavailable dates and available services for month", async () => {
      const { getMonthServiceAvailability } =
        await import("@/lib/availability");
      getMonthServiceAvailability.mockResolvedValue({
        "2024-06-15": [],
        "2024-06-16": [],
        "2024-06-17": ["lunch"],
      });

      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL(
          "http://localhost:3000/api/reservations/availability?month=2024-06&guests=2",
        ),
        { method: "GET" },
      );
      const res = await GET(req as any);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.unavailableDates).toEqual(["2024-06-15", "2024-06-16"]);
      expect(data.availableServices["2024-06-17"]).toEqual(["lunch"]);
    });

    it("accepts groups up to 8", async () => {
      const { getMonthServiceAvailability } =
        await import("@/lib/availability");
      getMonthServiceAvailability.mockResolvedValue({});
      const { GET } = await import("../route");
      const res = await GET(
        new NextRequest(
          new URL(
            "http://localhost:3000/api/reservations/availability?month=2030-01&guests=8",
          ),
        ) as any,
      );
      expect(res.status).toBe(200);
    });

    it("returns 400 for invalid month format", async () => {
      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL(
          "http://localhost:3000/api/reservations/availability?month=2024-6&guests=2",
        ),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any);

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe("month invalide");
    });

    it("returns services and their slots for a specific date", async () => {
      const { getServicesAvailability } = await import("@/lib/availability");
      getServicesAvailability.mockResolvedValue([
        { key: "lunch", slots: ["12:00"], started: false, available: true },
        { key: "dinner", slots: ["19:00"], started: false, available: false },
      ]);

      const { GET } = await import("../route");
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split("T")[0];

      const res = await GET(
        new NextRequest(
          new URL(
            `http://localhost:3000/api/reservations/availability?date=${tomorrowStr}&guests=2`,
          ),
        ) as any,
      );

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.services).toHaveLength(2);
      expect(data.slots).toEqual([
        { time: "12:00", available: true },
        { time: "19:00", available: false },
      ]);
    });

    it("returns empty slots for past dates", async () => {
      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL(
          "http://localhost:3000/api/reservations/availability?date=2020-06-15&guests=2",
        ),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.slots).toEqual([]);
    });

    it("returns 400 for invalid date format", async () => {
      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL(
          "http://localhost:3000/api/reservations/availability?date=15-06-2024&guests=2",
        ),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any);

      expect(res.status).toBe(400);
    });

    it("validates guests is an integer", async () => {
      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL(
          "http://localhost:3000/api/reservations/availability?guests=2.5",
        ),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any);

      expect(res.status).toBe(400);
    });

    it("hides services already started today from slots", async () => {
      const todayStr = new Date().toISOString().split("T")[0];

      const { getServicesAvailability } = await import("@/lib/availability");
      getServicesAvailability.mockResolvedValue([
        { key: "lunch", slots: ["12:00"], started: true, available: false },
        { key: "dinner", slots: ["19:00"], started: false, available: true },
      ]);

      const { GET } = await import("../route");
      const res = await GET(
        new NextRequest(
          new URL(
            `http://localhost:3000/api/reservations/availability?date=${todayStr}&guests=2`,
          ),
        ) as any,
      );

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.slots).toEqual([{ time: "19:00", available: true }]);
    });
  });
});
