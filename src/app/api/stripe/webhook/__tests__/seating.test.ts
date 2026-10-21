// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { lockAndCheckAvailability } from "@/lib/seating/db";
import {
  sendReservationUnavailableEmail,
  sendConfirmationEmail,
} from "@/lib/email";

vi.mock("@/lib/stripe", () => ({
  stripe: {
    webhooks: { constructEvent: vi.fn() },
    refunds: { create: vi.fn().mockResolvedValue({ id: "re_1" }) },
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    $transaction: vi.fn(),
    reservation: { create: vi.fn() },
    restaurantSettings: {
      findUnique: vi.fn().mockResolvedValue({ id: 1, mealDuration: 90 }),
    },
  },
}));

vi.mock("@/lib/seating/db", () => ({
  lockAndCheckAvailability: vi.fn(),
}));

vi.mock("@/lib/email", () => ({
  sendConfirmationEmail: vi.fn().mockResolvedValue({}),
  sendReservationUnavailableEmail: vi.fn().mockResolvedValue({}),
}));

const minutes = (n: number) => new Date(Date.now() + n * 60_000);

const reservation = (overrides = {}) => ({
  id: "res_1",
  name: "Test User",
  email: "test@example.com",
  date: new Date("2026-11-03T19:00:00.000Z"),
  guests: 4,
  depositPaidCents: 8000,
  status: "PENDING_PAYMENT",
  transactionExpireAt: minutes(10),
  cancelToken: "tok",
  ...overrides,
});

describe("stripe webhook — confirmation d'une réservation payée", () => {
  let txFindUnique: vi.Mock;
  let txUpdate: vi.Mock;

  async function callWebhook(sessionOverrides = {}) {
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
    vi.mocked(stripe.webhooks.constructEvent).mockReturnValue({
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_1",
          payment_intent: "pi_1",
          ...sessionOverrides,
          metadata: {
            name: "Test User",
            email: "test@example.com",
            date: "2026-11-03T19:00:00.000Z",
            guests: "4",
            reservationId: "res_1",
          },
        },
      },
    });
    const { POST } = await import("../route");
    return POST(
      new NextRequest(new URL("http://localhost:3000/api/stripe/webhook"), {
        method: "POST",
        headers: { "stripe-signature": "sig" },
        body: "{}",
      }) as any,
    );
  }

  beforeEach(() => {
    vi.clearAllMocks();
    txFindUnique = vi.fn();
    txUpdate = vi.fn().mockImplementation(async ({ data }) => ({
      ...reservation(),
      ...data,
    }));
    vi.mocked(prisma.$transaction).mockImplementation(async (cb) =>
      cb({
        reservation: { findUnique: txFindUnique, update: txUpdate },
      }),
    );
    vi.mocked(lockAndCheckAvailability).mockResolvedValue(true);
  });

  it("confirms without retesting while the hold is still valid", async () => {
    txFindUnique.mockResolvedValue(reservation());

    const res = await callWebhook();

    expect(res.status).toBe(200);
    expect(lockAndCheckAvailability).not.toHaveBeenCalled();
    expect(txUpdate.mock.calls[0][0].data).toMatchObject({
      status: "CONFIRMED",
      stripeSessionId: "cs_1",
      transactionExpireAt: null,
    });
    expect(sendConfirmationEmail).toHaveBeenCalledTimes(1);
    expect(stripe.refunds.create).not.toHaveBeenCalled();
  });

  it("retests under lock when the hold has expired, and confirms if it still fits", async () => {
    txFindUnique.mockResolvedValue(
      reservation({ transactionExpireAt: minutes(-5) }),
    );

    const res = await callWebhook();

    expect(res.status).toBe(200);
    expect(lockAndCheckAvailability).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        dateStr: "2026-11-03",
        service: "dinner",
        size: 4,
        excludeReservationId: "res_1",
      }),
    );
    expect(txUpdate.mock.calls[0][0].data.status).toBe("CONFIRMED");
    expect(stripe.refunds.create).not.toHaveBeenCalled();
  });

  it("cancels, refunds and notifies when the seat was taken after expiry", async () => {
    txFindUnique.mockResolvedValue(
      reservation({ transactionExpireAt: minutes(-5) }),
    );
    vi.mocked(lockAndCheckAvailability).mockResolvedValue(false);

    const res = await callWebhook();

    expect(res.status).toBe(200);
    expect(txUpdate.mock.calls[0][0].data.status).toBe("CANCELLED");
    expect(stripe.refunds.create).toHaveBeenCalledWith(
      { payment_intent: "pi_1" },
      { idempotencyKey: "refund-cs_1" },
    );
    expect(sendReservationUnavailableEmail).toHaveBeenCalledWith({
      to: "test@example.com",
      name: "Test User",
      date: "mardi 3 novembre",
      time: "19:00",
      refundedCents: 8000,
    });
    expect(sendConfirmationEmail).not.toHaveBeenCalled();
  });

  it("does not tell the customer they were refunded when nothing could be refunded", async () => {
    txFindUnique.mockResolvedValue(
      reservation({ transactionExpireAt: minutes(-5) }),
    );
    vi.mocked(lockAndCheckAvailability).mockResolvedValue(false);

    const res = await callWebhook({ payment_intent: null });

    expect(res.status).toBe(200);
    expect(stripe.refunds.create).not.toHaveBeenCalled();
    expect(sendReservationUnavailableEmail).not.toHaveBeenCalled();
  });

  it("does not email when the reservation had no email address", async () => {
    txFindUnique.mockResolvedValue(
      reservation({ transactionExpireAt: minutes(-5), email: null }),
    );
    vi.mocked(lockAndCheckAvailability).mockResolvedValue(false);

    await callWebhook();

    expect(stripe.refunds.create).toHaveBeenCalledTimes(1);
    expect(sendReservationUnavailableEmail).not.toHaveBeenCalled();
  });

  it("ignores a replayed event for an already confirmed reservation", async () => {
    txFindUnique.mockResolvedValue(reservation({ status: "CONFIRMED" }));

    const res = await callWebhook();

    expect(res.status).toBe(200);
    expect(txUpdate).not.toHaveBeenCalled();
    expect(sendConfirmationEmail).not.toHaveBeenCalled();
    expect(stripe.refunds.create).not.toHaveBeenCalled();
  });

  it("refunds a payment whose reservation no longer exists", async () => {
    txFindUnique.mockResolvedValue(null);

    const res = await callWebhook();

    expect(res.status).toBe(200);
    expect(stripe.refunds.create).toHaveBeenCalledTimes(1);
    expect(sendConfirmationEmail).not.toHaveBeenCalled();
  });

  it("returns 500 on a real failure so that Stripe retries", async () => {
    vi.mocked(prisma.$transaction).mockRejectedValue(new Error("db down"));

    const res = await callWebhook();

    expect(res.status).toBe(500);
  });
});
