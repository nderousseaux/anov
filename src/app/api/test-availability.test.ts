import { describe, it, expect, vi } from "vitest";

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

vi.mock("@/lib/availability", () => ({
  getSlotsWithAvailability: vi.fn().mockResolvedValue([
    { time: "12:00", available: true },
    { time: "19:00", available: true },
  ]),
  getUnavailableDatesForMonth: vi.fn().mockResolvedValue([]),
}));

import { getSlotsWithAvailability } from "@/lib/availability";

describe("test mock", () => {
  it("test mock", async () => {
    const result = await getSlotsWithAvailability("2024-06-15", 2);
    console.log("Result:", result);
    expect(result).toHaveLength(2);
  });
});
