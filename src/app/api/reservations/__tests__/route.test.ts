// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { lockAndCheckAvailability } from "@/lib/seating/db";

vi.mock("@/lib/seating/db", () => ({
  HOLD_MINUTES: 30,
  lockAndCheckAvailability: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    $transaction: vi.fn(),
    reservation: {
      update: vi.fn().mockResolvedValue({ stripeSessionId: "cs_test123" }),
      delete: vi.fn().mockResolvedValue({}),
    },
  },
}));

vi.mock("@/lib/stripe", () => ({
  stripe: {
    checkout: {
      sessions: {
        create: vi.fn(),
      },
    },
  },
  DEPOSIT_PER_GUEST_CENTS: 2000,
}));

function futureDateStr(days = 7) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

function postRequest(overrides: Record<string, unknown> = {}) {
  return new NextRequest(new URL("http://localhost:3000/api/reservations"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Test User",
      email: "test@example.com",
      date: futureDateStr(),
      time: "19:00",
      guests: 2,
      ...overrides,
    }),
  });
}

describe("Reservations API", () => {
  let POST: typeof import("../route").POST;
  let txCreate: vi.Mock;

  beforeEach(async () => {
    vi.clearAllMocks();
    txCreate = vi.fn().mockResolvedValue({
      id: "res_1",
      cancelToken: "token_1",
      name: "Test User",
      email: "test@example.com",
    });
    vi.mocked(prisma.$transaction).mockImplementation(async (cb) =>
      cb({ reservation: { create: txCreate } }),
    );
    vi.mocked(lockAndCheckAvailability).mockResolvedValue(true);
    vi.mocked(stripe.checkout.sessions.create).mockResolvedValue({
      id: "cs_test123",
      url: "https://checkout.stripe.com/test",
    });
    vi.mocked(prisma.reservation.update).mockResolvedValue({
      id: "res_1",
      stripeSessionId: "cs_test123",
    });

    POST = (await import("../route")).POST;
  });

  describe("POST /api/reservations", () => {
    it("returns 400 if required fields are missing", async () => {
      const req = new NextRequest(
        new URL("http://localhost:3000/api/reservations"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        },
      );
      const res = await POST(req as any);

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe("Champs manquants");
    });

    it("returns 400 if guests is invalid", async () => {
      const req = new NextRequest(
        new URL("http://localhost:3000/api/reservations"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Test User",
            email: "test@example.com",
            date: "2024-06-15",
            time: "19:00",
            guests: 0,
          }),
        },
      );
      const res = await POST(req as any);

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe("Nombre de couverts invalide");
    });

    it("returns 400 if guests exceeds maximum", async () => {
      const req = new NextRequest(
        new URL("http://localhost:3000/api/reservations"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Test User",
            email: "test@example.com",
            date: "2024-06-15",
            time: "19:00",
            guests: 9,
          }),
        },
      );
      const res = await POST(req as any);

      expect(res.status).toBe(400);
    });

    it("returns 400 if email is invalid", async () => {
      const req = new NextRequest(
        new URL("http://localhost:3000/api/reservations"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Test User",
            email: "invalid-email",
            date: "2024-06-15",
            time: "19:00",
            guests: 2,
          }),
        },
      );
      const res = await POST(req as any);

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe("Email invalide");
    });

    it("returns 400 if phone is invalid", async () => {
      const req = new NextRequest(
        new URL("http://localhost:3000/api/reservations"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Test User",
            email: "test@example.com",
            date: "2024-06-15",
            time: "19:00",
            guests: 2,
            phone: "invalid-phone",
          }),
        },
      );
      const res = await POST(req as any);

      expect(res.status).toBe(400);
    });

    it("returns 400 if date is in the past", async () => {
      const req = new NextRequest(
        new URL("http://localhost:3000/api/reservations"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Test User",
            email: "test@example.com",
            date: "2020-06-15",
            time: "19:00",
            guests: 2,
          }),
        },
      );
      const res = await POST(req as any);

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe("Date invalide");
    });

    it("accepts a group of 8", async () => {
      const res = await POST(postRequest({ guests: 8 }));
      expect(res.status).toBe(200);
      expect(lockAndCheckAvailability).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ size: 8, service: "dinner" }),
      );
    });

    it("creates reservation and returns Stripe session URL", async () => {
      const res = await POST(
        postRequest({ phone: "+33 6 12 34 56 78", specialRequest: "Anniv" }),
      );

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.url).toBe("https://checkout.stripe.com/test");
      expect(data.sessionId).toBe("cs_test123");
      expect(txCreate.mock.calls[0][0].data).toMatchObject({
        status: "PENDING_PAYMENT",
        source: "WEB",
        guests: 2,
      });
    });

    it("derives the service from the arrival time", async () => {
      await POST(postRequest({ time: "12:30" }));
      expect(lockAndCheckAvailability).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ service: "lunch" }),
      );
    });

    it("returns 409 if the service is full", async () => {
      vi.mocked(lockAndCheckAvailability).mockResolvedValue(false);

      const res = await POST(postRequest());

      expect(res.status).toBe(409);
      expect(txCreate).not.toHaveBeenCalled();
      expect(stripe.checkout.sessions.create).not.toHaveBeenCalled();
    });

    it("calculates correct deposit amount", async () => {
      const res = await POST(postRequest({ guests: 4 }));

      expect(res.status).toBe(200);
      const args = vi.mocked(stripe.checkout.sessions.create).mock.calls[0][0];
      expect(args.line_items[0].price_data.unit_amount).toBe(8000);
    });

    it("holds the seat for as long as the Stripe session lasts", async () => {
      await POST(postRequest());

      const { transactionExpireAt } = txCreate.mock.calls[0][0].data;
      const holdMs = transactionExpireAt.getTime() - Date.now();
      expect(holdMs).toBeGreaterThan(29 * 60_000);
      expect(holdMs).toBeLessThanOrEqual(30 * 60_000);

      const { expires_at } = vi.mocked(stripe.checkout.sessions.create).mock
        .calls[0][0];
      // Stripe impose au moins 30 min de session
      expect(expires_at * 1000 - Date.now()).toBeGreaterThanOrEqual(
        30 * 60_000,
      );
    });

    it("releases the seat if the Stripe session cannot be created", async () => {
      vi.mocked(stripe.checkout.sessions.create).mockRejectedValue(
        new Error("stripe down"),
      );

      const res = await POST(postRequest());

      expect(res.status).toBe(500);
      expect(prisma.reservation.delete).toHaveBeenCalledWith({
        where: { id: "res_1" },
      });
    });
  });
});
