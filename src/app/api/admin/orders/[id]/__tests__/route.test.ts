// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { getAdminFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { $Enums } from "@/generated/prisma";
import { stripe } from "@/lib/stripe";
import { sendProductOrderReadyEmail, sendCancellationEmail } from "@/lib/email";

// Mock at top level - must be before imports
vi.mock("@/lib/prisma", () => ({
  prisma: {
    productOrder: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock("@/lib/email", () => ({
  sendProductOrderReadyEmail: vi.fn().mockResolvedValue({}),
  sendCancellationEmail: vi.fn().mockResolvedValue({}),
}));

// The stripe module exports stripe as a Stripe instance object
// The mock should return stripe with checkout and refunds properties
vi.mock("@/lib/stripe", () => ({
  stripe: {
    checkout: {
      sessions: {
        retrieve: vi.fn(),
      },
    },
    refunds: {
      create: vi.fn(),
    },
  },
}));

vi.mock("@/lib/auth", () => ({
  getAdminFromCookies: vi.fn(),
}));

const { GET, PATCH } = await import("../route");

describe("Admin Order Detail API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/admin/orders/[id]", () => {
    it("returns 401 if not authenticated", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue(null);

      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/orders/1"),
        {
          method: "GET",
        },
      );
      const res = await GET(
        req as any,
        { params: Promise.resolve({ id: "1" }) } as any,
      );

      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toBe("Non autorisé");
    });

    it("returns order details for existing order", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });

      const order = {
        id: "1",
        code: "ANOV-PO-ABCD1234",
        productName: "Test Product",
        quantity: 2,
        totalPrice: 5000,
        deliveryMethod: $Enums.DeliveryMethod.PICKUP,
        customerName: "Test User",
        customerEmail: "test@example.com",
        customerPhone: "+33 6 12 34 56 78",
        status: $Enums.OrderStatus.CONFIRMED,
        createdAt: new Date("2024-06-15"),
        updatedAt: new Date("2024-06-15"),
        stripeSessionId: "cs_test123",
        transactionExpireAt: null,
      };

      vi.mocked(prisma.productOrder.findUnique).mockResolvedValue(order);

      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/orders/1"),
        {
          method: "GET",
        },
      );
      const res = await GET(
        req as any,
        { params: Promise.resolve({ id: "1" }) } as any,
      );

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.id).toBe("1");
      expect(data.code).toBe("ANOV-PO-ABCD1234");
    });

    it("returns 404 for non-existent order", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });

      vi.mocked(prisma.productOrder.findUnique).mockResolvedValue(null);

      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/orders/999"),
        {
          method: "GET",
        },
      );
      const res = await GET(
        req as any,
        { params: Promise.resolve({ id: "999" }) } as any,
      );

      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data.error).toBe("Commande non trouvée");
    });

    it("includes customer address if available", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });

      const order = {
        id: "1",
        code: "ANOV-PO-ABCD1234",
        productName: "Test Product",
        quantity: 2,
        totalPrice: 5000,
        deliveryMethod: $Enums.DeliveryMethod.DELIVERY,
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
        status: $Enums.OrderStatus.CONFIRMED,
        createdAt: new Date("2024-06-15"),
        updatedAt: new Date("2024-06-15"),
        stripeSessionId: null,
        transactionExpireAt: null,
      };

      vi.mocked(prisma.productOrder.findUnique).mockResolvedValue(order);

      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/orders/1"),
        {
          method: "GET",
        },
      );
      const res = await GET(
        req as any,
        { params: Promise.resolve({ id: "1" }) } as any,
      );

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.customerAddress).not.toBeNull();
      expect(data.customerAddress.city).toBe("Paris");
    });
  });

  describe("PATCH /api/admin/orders/[id]", () => {
    it("returns 401 if not authenticated", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue(null);

      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/orders/1"),
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "READY" }),
        },
      );
      const res = await PATCH(
        req as any,
        { params: Promise.resolve({ id: "1" }) } as any,
      );

      expect(res.status).toBe(401);
    });

    it("returns 400 if status is missing", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });

      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/orders/1"),
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        },
      );
      const res = await PATCH(
        req as any,
        { params: Promise.resolve({ id: "1" }) } as any,
      );

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe("Le statut est requis");
    });

    it("returns 404 for non-existent order", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });

      vi.mocked(prisma.productOrder.findUnique).mockResolvedValue(null);

      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/orders/999"),
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "READY" }),
        },
      );
      const res = await PATCH(
        req as any,
        { params: Promise.resolve({ id: "999" }) } as any,
      );

      expect(res.status).toBe(404);
    });

    it("updates order status", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });

      const updatedOrder = {
        id: "1",
        code: "ANOV-PO-ABCD1234",
        productName: "Test Product",
        quantity: 2,
        totalPrice: 5000,
        deliveryMethod: $Enums.DeliveryMethod.PICKUP,
        customerName: "Test User",
        customerEmail: "test@example.com",
        customerPhone: "+33 6 12 34 56 78",
        status: $Enums.OrderStatus.READY,
        createdAt: new Date("2024-06-15"),
        updatedAt: new Date("2024-06-16"),
        stripeSessionId: null,
        transactionExpireAt: null,
      };

      vi.mocked(prisma.productOrder.findUnique).mockResolvedValue({
        id: "1",
        code: "ANOV-PO-ABCD1234",
        productName: "Test Product",
        quantity: 2,
        totalPrice: 5000,
        deliveryMethod: $Enums.DeliveryMethod.PICKUP,
        customerName: "Test User",
        customerEmail: "test@example.com",
        customerPhone: "+33 6 12 34 56 78",
        status: $Enums.OrderStatus.CONFIRMED,
        createdAt: new Date("2024-06-15"),
        updatedAt: new Date("2024-06-15"),
        stripeSessionId: null,
        transactionExpireAt: null,
      });
      vi.mocked(prisma.productOrder.update).mockResolvedValue(updatedOrder);

      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/orders/1"),
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "READY" }),
        },
      );
      const res = await PATCH(
        req as any,
        { params: Promise.resolve({ id: "1" }) } as any,
      );

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.status).toBe($Enums.OrderStatus.READY);
    });

    it("handles NEXT status for delivery", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });

      const order = {
        id: "1",
        code: "ANOV-PO-ABCD1234",
        productName: "Test Product",
        quantity: 2,
        totalPrice: 5000,
        deliveryMethod: $Enums.DeliveryMethod.DELIVERY,
        customerName: "Test User",
        customerEmail: "test@example.com",
        customerPhone: "+33 6 12 34 56 78",
        status: $Enums.OrderStatus.CONFIRMED,
        createdAt: new Date("2024-06-15"),
        updatedAt: new Date("2024-06-16"),
        stripeSessionId: null,
        transactionExpireAt: null,
      };

      vi.mocked(prisma.productOrder.findUnique).mockResolvedValue({
        id: "1",
        code: "ANOV-PO-ABCD1234",
        productName: "Test Product",
        quantity: 2,
        totalPrice: 5000,
        deliveryMethod: $Enums.DeliveryMethod.DELIVERY,
        customerName: "Test User",
        customerEmail: "test@example.com",
        customerPhone: "+33 6 12 34 56 78",
        status: $Enums.OrderStatus.CONFIRMED,
        createdAt: new Date("2024-06-15"),
        updatedAt: new Date("2024-06-15"),
        stripeSessionId: null,
        transactionExpireAt: null,
      });
      vi.mocked(prisma.productOrder.update).mockResolvedValue({
        ...order,
        status: $Enums.OrderStatus.SHIPPED,
      });

      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/orders/1"),
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "NEXT" }),
        },
      );
      const res = await PATCH(
        req as any,
        { params: Promise.resolve({ id: "1" }) } as any,
      );

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.status).toBe($Enums.OrderStatus.SHIPPED);
    });

    it("validates status transition", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });

      vi.mocked(prisma.productOrder.findUnique).mockResolvedValue({
        id: "1",
        code: "ANOV-PO-ABCD1234",
        productName: "Test Product",
        quantity: 2,
        totalPrice: 5000,
        deliveryMethod: $Enums.DeliveryMethod.PICKUP,
        customerName: "Test User",
        customerEmail: "test@example.com",
        customerPhone: "+33 6 12 34 56 78",
        status: $Enums.OrderStatus.COMPLETED,
        createdAt: new Date("2024-06-15"),
        updatedAt: new Date("2024-06-15"),
        stripeSessionId: null,
        transactionExpireAt: null,
      });
      vi.mocked(prisma.productOrder.update).mockResolvedValue({
        id: "1",
        code: "ANOV-PO-ABCD1234",
        productName: "Test Product",
        quantity: 2,
        totalPrice: 5000,
        deliveryMethod: $Enums.DeliveryMethod.PICKUP,
        customerName: "Test User",
        customerEmail: "test@example.com",
        customerPhone: "+33 6 12 34 56 78",
        status: $Enums.OrderStatus.CANCELLED,
        createdAt: new Date("2024-06-15"),
        updatedAt: new Date("2024-06-16"),
        stripeSessionId: null,
        transactionExpireAt: null,
      });

      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/orders/1"),
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "READY" }),
        },
      );
      const res = await PATCH(
        req as any,
        { params: Promise.resolve({ id: "1" }) } as any,
      );

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain("Transition invalide");
    });

    it("sends email on READY status", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });

      const updatedOrder = {
        id: "1",
        code: "ANOV-PO-ABCD1234",
        productName: "Test Product",
        quantity: 2,
        totalPrice: 5000,
        deliveryMethod: $Enums.DeliveryMethod.PICKUP,
        customerName: "Test User",
        customerEmail: "test@example.com",
        customerPhone: "+33 6 12 34 56 78",
        status: $Enums.OrderStatus.READY,
        createdAt: new Date("2024-06-15"),
        updatedAt: new Date("2024-06-16"),
        stripeSessionId: null,
        transactionExpireAt: null,
      };

      vi.mocked(prisma.productOrder.findUnique).mockResolvedValue({
        id: "1",
        code: "ANOV-PO-ABCD1234",
        productName: "Test Product",
        quantity: 2,
        totalPrice: 5000,
        deliveryMethod: $Enums.DeliveryMethod.PICKUP,
        customerName: "Test User",
        customerEmail: "test@example.com",
        customerPhone: "+33 6 12 34 56 78",
        status: $Enums.OrderStatus.CONFIRMED,
        createdAt: new Date("2024-06-15"),
        updatedAt: new Date("2024-06-15"),
        stripeSessionId: null,
        transactionExpireAt: null,
      });
      vi.mocked(prisma.productOrder.update).mockResolvedValue(updatedOrder);

      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/orders/1"),
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "READY" }),
        },
      );
      await PATCH(req as any, { params: Promise.resolve({ id: "1" }) } as any);

      expect(sendProductOrderReadyEmail).toHaveBeenCalled();
    });

    it("processes refund on cancellation", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });

      const order = {
        id: "1",
        code: "ANOV-PO-ABCD1234",
        productName: "Test Product",
        quantity: 2,
        totalPrice: 5000,
        deliveryMethod: $Enums.DeliveryMethod.PICKUP,
        customerName: "Test User",
        customerEmail: "test@example.com",
        customerPhone: "+33 6 12 34 56 78",
        status: $Enums.OrderStatus.CANCELLED,
        createdAt: new Date("2024-06-15"),
        updatedAt: new Date("2024-06-16"),
        stripeSessionId: "cs_test123",
        transactionExpireAt: null,
      };

      vi.mocked(prisma.productOrder.findUnique).mockResolvedValue({
        id: "1",
        code: "ANOV-PO-ABCD1234",
        productName: "Test Product",
        quantity: 2,
        totalPrice: 5000,
        deliveryMethod: $Enums.DeliveryMethod.PICKUP,
        customerName: "Test User",
        customerEmail: "test@example.com",
        customerPhone: "+33 6 12 34 56 78",
        status: $Enums.OrderStatus.CONFIRMED,
        createdAt: new Date("2024-06-15"),
        updatedAt: new Date("2024-06-15"),
        stripeSessionId: "cs_test123",
        transactionExpireAt: null,
      });
      vi.mocked(prisma.productOrder.update).mockResolvedValue(order);

      vi.mocked(stripe.checkout.sessions.retrieve).mockResolvedValue({
        payment_intent: "pi_test123",
      });
      vi.mocked(stripe.refunds.create).mockResolvedValue({ id: "re_test123" });

      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/orders/1"),
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "CANCELLED" }),
        },
      );
      const res = await PATCH(
        req as any,
        { params: Promise.resolve({ id: "1" }) } as any,
      );

      expect(res.status).toBe(200);
      expect(stripe.checkout.sessions.retrieve).toHaveBeenCalledWith(
        "cs_test123",
      );
      expect(stripe.refunds.create).toHaveBeenCalled();
    });
  });
});
