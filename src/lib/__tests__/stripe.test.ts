import { describe, it, expect, beforeAll, beforeEach } from "vitest";

beforeAll(() => {
  process.env.STRIPE_SECRET_KEY = "test_stripe_key";
});

describe("Stripe utility", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should export DEPOSIT_PER_GUEST_CENTS constant", async () => {
    const { DEPOSIT_PER_GUEST_CENTS } = await import("@/lib/stripe");
    expect(DEPOSIT_PER_GUEST_CENTS).toBe(2000);
  });

  it("should have Stripe instance configured", async () => {
    const { stripe } = await import("@/lib/stripe");
    expect(stripe).toBeDefined();
  });

  it("should export stripe object", async () => {
    const { stripe } = await import("@/lib/stripe");
    expect(stripe).toHaveProperty("checkout");
    expect(stripe).toHaveProperty("refunds");
  });
});
