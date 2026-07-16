import { vi } from "vitest";
import { getSlotsWithAvailability } from "@/lib/availability";

vi.mock("@/lib/availability", () => ({
  getSlotsWithAvailability: vi.fn().mockResolvedValue([
    { time: "12:00", available: true },
    { time: "19:00", available: true },
  ]),
}));

export async function test() {
  const result = await getSlotsWithAvailability("2024-06-15", 2);
  console.log("Result:", result);
  return result;
}
