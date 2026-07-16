// @ts-nocheck
import { describe, it, expect, vi } from "vitest";
import { getSlotsWithAvailability } from "@/lib/availability";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    restaurantSettings: {
      findFirst: vi.fn(),
    },
    dayOverride: {
      findUnique: vi.fn(),
    },
    reservation: {
      findMany: vi.fn(),
    },
  },
}));

describe("getSlotsWithAvailability", () => {
  it("returns empty array for closed days", async () => {
    vi.mocked(prisma.restaurantSettings.findFirst).mockResolvedValue({
      id: 1,
      mealDuration: 90,
      openingDays: JSON.stringify([2, 3, 4, 5, 6]),
      openingSlots: JSON.stringify([
        "12:00",
        "12:30",
        "13:00",
        "19:00",
        "19:30",
        "20:00",
        "20:30",
        "21:00",
        "21:30",
      ]),
    });
    vi.mocked(prisma.dayOverride.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.reservation.findMany).mockResolvedValue([]);

    // Sunday (dow = 0) is not an opening day
    const result = await getSlotsWithAvailability("2024-06-16", 2);
    expect(result).toEqual([]);
  });
});
