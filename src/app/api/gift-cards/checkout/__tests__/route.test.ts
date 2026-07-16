import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

vi.mock("@/lib/stripe", () => ({
  stripe: {
    checkout: {
      sessions: {
        create: vi.fn().mockResolvedValue({
          id: "cs_test123",
          url: "https://checkout.stripe.com/test",
        }),
      },
    },
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    giftCard: {
      create: vi.fn().mockResolvedValue({
        id: 1,
        code: "ANOV-G-ABCD1234",
        amount: 100,
        recipientEmail: "test@example.com",
        personalMessage: null,
        isPaid: true,
        expiresAt: new Date(),
        transactionExpireAt: new Date(),
        status: "IN_PROGRESS_PAYMENT",
      }),
      update: vi.fn().mockResolvedValue({
        id: 1,
        stripeSessionId: "cs_test123",
      }),
    },
  },
}));

describe("Gift Cards Checkout API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/gift-cards/checkout", () => {
    it("returns 400 if amount is missing", async () => {
      const { POST } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/gift-cards/checkout"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ recipientEmail: "test@example.com" }),
        },
      );
      const res = await POST(req as any);

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe("Montant et email du destinataire requis");
    });

    it("returns 400 if recipientEmail is missing", async () => {
      const { POST } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/gift-cards/checkout"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: "100" }),
        },
      );
      const res = await POST(req as any);

      expect(res.status).toBe(400);
    });

    it("returns 400 if amount is invalid", async () => {
      const { POST } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/gift-cards/checkout"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: "abc",
            recipientEmail: "test@example.com",
          }),
        },
      );
      const res = await POST(req as any);

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe("Montant invalide");
    });

    it("handles amount with currency symbol", async () => {
      const { POST } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/gift-cards/checkout"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: "100€",
            recipientEmail: "test@example.com",
          }),
        },
      );
      const res = await POST(req as any);

      expect(res.status).toBe(200);
    });

    it("creates gift card and returns Stripe session", async () => {
      const { POST } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/gift-cards/checkout"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: "100",
            recipientEmail: "test@example.com",
            personalMessage: "Test message",
          }),
        },
      );
      const res = await POST(req as any);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.sessionId).toBe("cs_test123");
      expect(data.url).toBeDefined();
    });

    it("handles amount with currency symbol", async () => {
      const { POST } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/gift-cards/checkout"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: "100€",
            recipientEmail: "test@example.com",
          }),
        },
      );
      const res = await POST(req as any);

      expect(res.status).toBe(200);
    });

    it("returns 500 on Stripe error", async () => {
      vi.mocked(stripe.checkout.sessions.create).mockRejectedValue(
        new Error("Stripe error"),
      );

      const { POST } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/gift-cards/checkout"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: "100",
            recipientEmail: "test@example.com",
          }),
        },
      );
      const res = await POST(req as any);

      expect(res.status).toBe(500);
      const data = await res.json();
      expect(data.error).toBe(
        "Erreur lors de la création de la session de paiement",
      );
    });
  });
});
