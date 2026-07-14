import { describe, it, expect, beforeAll } from "vitest";

describe("Stripe utility", () => {
  beforeAll(() => {
    process.env.STRIPE_SECRET_KEY = "test_stripe_key";
  });

  it("should export DEPOSIT_PER_GUEST_CENTS constant", async () => {
    const { DEPOSIT_PER_GUEST_CENTS } = await import("@/lib/stripe");
    expect(DEPOSIT_PER_GUEST_CENTS).toBe(2000);
  });
});
