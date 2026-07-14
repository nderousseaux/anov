// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

vi.mock("@/lib/stripe", () => ({
  stripe: {
    checkout: {
      sessions: {
        create: vi.fn(),
      },
    },
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    productOrder: {
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe("Boutique Checkout API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/boutique/checkout", () => {
    it("returns 400 if productName or productId is missing", async () => {
      const { POST } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/boutique/checkout"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        },
      );
      const res = await POST(req as any);

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe("Nom du produit ou ID de produit requis");
    });

    it("returns 400 if quantity is missing", async () => {
      const { POST } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/boutique/checkout"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productName: "Test Product" }),
        },
      );
      const res = await POST(req as any);

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe("Quantité et méthode de livraison requises");
    });

    it("returns 400 if deliveryMethod is missing", async () => {
      const { POST } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/boutique/checkout"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productName: "Test Product", quantity: 1 }),
        },
      );
      const res = await POST(req as any);

      expect(res.status).toBe(400);
    });

    it("returns 400 if quantity is less than 1", async () => {
      const { POST } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/boutique/checkout"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productName: "Test Product",
            quantity: 0,
            deliveryMethod: "PICKUP",
          }),
        },
      );
      const res = await POST(req as any);

      expect(res.status).toBe(400);
    });

    it("returns 400 if totalPrice is missing", async () => {
      const { POST } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/boutique/checkout"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productName: "Test Product",
            quantity: 1,
            deliveryMethod: "PICKUP",
          }),
        },
      );
      const res = await POST(req as any);

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe("Le prix total est requis");
    });

    it("creates order and returns Stripe session", async () => {
      const order = {
        id: 1,
        code: "ANOV-PO-ABCD1234",
        productName: "Test Product",
        quantity: 2,
        totalPrice: 5000,
        deliveryMethod: "PICKUP",
        customerName: "Test User",
        customerEmail: "test@example.com",
        customerPhone: "+33 6 12 34 56 78",
        status: "PENDING_PAYMENT",
        transactionExpireAt: new Date(),
      };

      vi.mocked(prisma.productOrder.create).mockResolvedValue(order);
      vi.mocked(prisma.productOrder.update).mockResolvedValue({
        ...order,
        stripeSessionId: "cs_test123",
      });

      vi.mocked(stripe.checkout.sessions.create).mockResolvedValue({
        id: "cs_test123",
        url: "https://checkout.stripe.com/test",
      });

      const { POST } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/boutique/checkout"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productName: "Test Product",
            quantity: 2,
            deliveryMethod: "PICKUP",
            totalPrice: 5000,
            customerName: "Test User",
            customerEmail: "test@example.com",
            customerPhone: "+33 6 12 34 56 78",
          }),
        },
      );
      const res = await POST(req as any);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.sessionId).toBe("cs_test123");
      expect(data.url).toBeDefined();
    });

    it("creates order with delivery address", async () => {
      const order = {
        id: 1,
        code: "ANOV-PO-ABCD1234",
        productName: "Test Product",
        quantity: 1,
        totalPrice: 2500,
        deliveryMethod: "DELIVERY",
        customerName: "Test User",
        customerEmail: "test@example.com",
        customerPhone: "+33 6 12 34 56 78",
        customerAddress: {
          firstName: "John",
          lastName: "Doe",
          address: "123 Main St",
          city: "Paris",
          zipCode: "75000",
          country: "France",
          phone: "+33 6 12 34 56 78",
        },
        status: "PENDING_PAYMENT",
        transactionExpireAt: new Date(),
      };

      vi.mocked(prisma.productOrder.create).mockResolvedValue(order);
      vi.mocked(prisma.productOrder.update).mockResolvedValue({
        ...order,
        stripeSessionId: "cs_test123",
      });

      vi.mocked(stripe.checkout.sessions.create).mockResolvedValue({
        id: "cs_test123",
        url: "https://checkout.stripe.com/test",
      });

      const { POST } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/boutique/checkout"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productName: "Test Product",
            quantity: 1,
            deliveryMethod: "DELIVERY",
            totalPrice: 2500,
            customerName: "Test User",
            customerEmail: "test@example.com",
            customerPhone: "+33 6 12 34 56 78",
            address: {
              firstName: "John",
              lastName: "Doe",
              address: "123 Main St",
              city: "Paris",
              zipCode: "75000",
              country: "France",
              phone: "+33 6 12 34 56 78",
            },
          }),
        },
      );
      const res = await POST(req as any);

      expect(res.status).toBe(200);
    });

    it("handles productImage with relative URL", async () => {
      vi.mocked(prisma.productOrder.create).mockResolvedValue({ id: 1 });
      vi.mocked(prisma.productOrder.update).mockResolvedValue({
        id: 1,
        stripeSessionId: "cs_test123",
      });

      vi.mocked(stripe.checkout.sessions.create).mockResolvedValue({
        id: "cs_test123",
        url: "https://checkout.stripe.com/test",
      });

      const { POST } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/boutique/checkout"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productName: "Test Product",
            productId: 123,
            quantity: 1,
            deliveryMethod: "PICKUP",
            totalPrice: 2500,
            productImage: "/assets/image.png",
            customerName: "Test User",
            customerEmail: "test@example.com",
            customerPhone: "+33 6 12 34 56 78",
          }),
        },
      );
      const res = await POST(req as any);

      expect(res.status).toBe(200);
    });

    it("handles productImage with absolute URL", async () => {
      vi.mocked(prisma.productOrder.create).mockResolvedValue({ id: 1 });
      vi.mocked(prisma.productOrder.update).mockResolvedValue({
        id: 1,
        stripeSessionId: "cs_test123",
      });

      vi.mocked(stripe.checkout.sessions.create).mockResolvedValue({
        id: "cs_test123",
        url: "https://checkout.stripe.com/test",
      });

      const { POST } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/boutique/checkout"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productName: "Test Product",
            productId: 123,
            quantity: 1,
            deliveryMethod: "PICKUP",
            totalPrice: 2500,
            productImage: "https://example.com/image.png",
            customerName: "Test User",
            customerEmail: "test@example.com",
            customerPhone: "+33 6 12 34 56 78",
          }),
        },
      );
      const res = await POST(req as any);

      expect(res.status).toBe(200);
    });

    it("returns 500 on Stripe error", async () => {
      vi.mocked(prisma.productOrder.create).mockResolvedValue({ id: 1 });
      vi.mocked(prisma.productOrder.update).mockResolvedValue({
        id: 1,
        stripeSessionId: "cs_test123",
      });

      vi.mocked(stripe.checkout.sessions.create).mockRejectedValue(
        new Error("Stripe error"),
      );

      const { POST } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/boutique/checkout"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productName: "Test Product",
            quantity: 1,
            deliveryMethod: "PICKUP",
            totalPrice: 2500,
            customerName: "Test User",
            customerEmail: "test@example.com",
            customerPhone: "+33 6 12 34 56 78",
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
