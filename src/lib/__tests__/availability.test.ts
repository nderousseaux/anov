import { describe, it, expect } from "vitest";

// availability.ts imports from prisma which needs mocking
// Since availability functions have complex database dependencies,
// we test the basic exports here

describe("availability", () => {
  it("exports getSlotsWithAvailability function", async () => {
    const { getSlotsWithAvailability } = await import("../availability");
    expect(typeof getSlotsWithAvailability).toBe("function");
  });

  it("exports getUnavailableDatesForMonth function", async () => {
    const { getUnavailableDatesForMonth } = await import("../availability");
    expect(typeof getUnavailableDatesForMonth).toBe("function");
  });
});
