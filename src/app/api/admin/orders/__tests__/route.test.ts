import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { getAdminFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { $Enums } from "@/generated/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    productOrder: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

vi.mock("@/lib/auth", () => ({
  getAdminFromCookies: vi.fn(),
}));

describe("Admin Orders API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/admin/orders", () => {
    it("returns 401 if not authenticated", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue(null);

      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/orders"),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any);

      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toBe("Non autorisé");
    });

    it("returns orders list with pagination", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });

      vi.mocked(prisma.productOrder.count).mockResolvedValue(2);
      vi.mocked(prisma.productOrder.findMany).mockResolvedValue([
        {
          id: "1",
          code: "ANOV-PO-ABCD1234",
          productName: "Test Product",
          quantity: 2,
          totalPrice: 5000,
          customerName: "Test User",
          customerEmail: "test@example.com",
          customerPhone: "+33 6 12 34 56 78",
          deliveryMethod: $Enums.DeliveryMethod.PICKUP,
          status: $Enums.OrderStatus.CONFIRMED,
          createdAt: new Date("2024-06-15"),
          updatedAt: new Date("2024-06-15"),
          stripeSessionId: null,
          transactionExpireAt: null,
        },
        {
          id: "2",
          code: "ANOV-PO-EFGH5678",
          productName: "Another Product",
          quantity: 1,
          totalPrice: 2500,
          customerName: "Another User",
          customerEmail: "another@example.com",
          customerPhone: "+33 6 98 76 54 32",
          deliveryMethod: $Enums.DeliveryMethod.DELIVERY,
          status: $Enums.OrderStatus.READY,
          createdAt: new Date("2024-06-14"),
          updatedAt: new Date("2024-06-14"),
          stripeSessionId: null,
          transactionExpireAt: null,
        },
      ]);

      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/orders?page=1"),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.data.length).toBe(2);
      expect(data.total).toBe(2);
      expect(data.page).toBe(1);
      expect(data.pageSize).toBe(25);
    });

    it("filters orders by status", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });

      vi.mocked(prisma.productOrder.count).mockResolvedValue(1);
      vi.mocked(prisma.productOrder.findMany).mockResolvedValue([
        {
          id: "1",
          code: "ANOV-PO-ABCD1234",
          productName: "Test Product",
          quantity: 2,
          totalPrice: 5000,
          customerName: "Test User",
          customerEmail: "test@example.com",
          customerPhone: "+33 6 12 34 56 78",
          deliveryMethod: $Enums.DeliveryMethod.PICKUP,
          status: $Enums.OrderStatus.CONFIRMED,
          createdAt: new Date("2024-06-15"),
          updatedAt: new Date("2024-06-15"),
          stripeSessionId: null,
          transactionExpireAt: null,
        },
      ]);

      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/orders?status=CONFIRMED"),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.data[0].status).toBe("CONFIRMED");
    });

    it("filters orders by search term", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });

      vi.mocked(prisma.productOrder.count).mockResolvedValue(1);
      vi.mocked(prisma.productOrder.findMany).mockResolvedValue([
        {
          id: "1",
          code: "ANOV-PO-ABCD1234",
          productName: "Test Product",
          quantity: 2,
          totalPrice: 5000,
          customerName: "John Smith",
          customerEmail: "john@example.com",
          customerPhone: "+33 6 12 34 56 78",
          deliveryMethod: $Enums.DeliveryMethod.PICKUP,
          status: $Enums.OrderStatus.CONFIRMED,
          createdAt: new Date("2024-06-15"),
          updatedAt: new Date("2024-06-15"),
          stripeSessionId: null,
          transactionExpireAt: null,
        },
      ]);

      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/orders?search=smith"),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.data.length).toBe(1);
      expect(data.data[0].customerName).toBe("John Smith");
    });

    it("excludes expired PENDING_PAYMENT orders", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });

      vi.mocked(prisma.productOrder.count).mockResolvedValue(2);
      vi.mocked(prisma.productOrder.findMany).mockResolvedValue([
        {
          id: "1",
          code: "ANOV-PO-ABCD1234",
          productName: "Test Product",
          quantity: 2,
          totalPrice: 5000,
          customerName: "Test User",
          customerEmail: "test@example.com",
          customerPhone: "+33 6 12 34 56 78",
          deliveryMethod: $Enums.DeliveryMethod.PICKUP,
          status: $Enums.OrderStatus.CONFIRMED,
          createdAt: new Date("2024-06-15"),
          updatedAt: new Date("2024-06-15"),
          stripeSessionId: null,
          transactionExpireAt: null,
        },
        {
          id: "2",
          code: "ANOV-PO-EXPIRED123",
          productName: "Expired Order",
          quantity: 1,
          totalPrice: 1000,
          customerName: "Expired User",
          customerEmail: "expired@example.com",
          customerPhone: "+33 6 11 11 11 11",
          deliveryMethod: $Enums.DeliveryMethod.PICKUP,
          status: $Enums.OrderStatus.PENDING_PAYMENT,
          transactionExpireAt: new Date("2024-06-01"),
          createdAt: new Date("2024-06-01"),
          updatedAt: new Date("2024-06-01"),
          stripeSessionId: null,
        },
      ]);

      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/orders"),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any);

      expect(res.status).toBe(200);
      const data = await res.json();
      // The expired PENDING_PAYMENT order should be filtered out
      expect(data.data.length).toBe(1);
      expect(data.data[0].status).toBe("CONFIRMED");
    });

    it("filters out orders with invalid status", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });

      vi.mocked(prisma.productOrder.count).mockResolvedValue(2);
      vi.mocked(prisma.productOrder.findMany).mockResolvedValue([
        {
          id: "1",
          code: "ANOV-PO-ABCD1234",
          productName: "Test Product",
          quantity: 2,
          totalPrice: 5000,
          customerName: "Test User",
          customerEmail: "test@example.com",
          customerPhone: "+33 6 12 34 56 78",
          deliveryMethod: $Enums.DeliveryMethod.PICKUP,
          status: $Enums.OrderStatus.CONFIRMED,
          createdAt: new Date("2024-06-15"),
          updatedAt: new Date("2024-06-15"),
          stripeSessionId: null,
          transactionExpireAt: null,
        },
        {
          id: "2",
          code: "ANOV-PO-INVALID123",
          productName: "Invalid Order",
          quantity: 1,
          totalPrice: 1000,
          customerName: "Invalid User",
          customerEmail: "invalid@example.com",
          customerPhone: "+33 6 22 22 22 22",
          deliveryMethod: $Enums.DeliveryMethod.PICKUP,
          status: $Enums.OrderStatus.PROCESSING,
          createdAt: new Date("2024-06-14"),
          updatedAt: new Date("2024-06-14"),
          stripeSessionId: null,
          transactionExpireAt: null,
        },
      ]);

      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/orders"),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.data.length).toBe(1);
      expect(data.data[0].status).toBe("CONFIRMED");
    });

    it("filters PENDING_PAYMENT orders with transactionExpireAt", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });

      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);

      vi.mocked(prisma.productOrder.count).mockResolvedValue(1);
      vi.mocked(prisma.productOrder.findMany).mockResolvedValue([
        {
          id: "1",
          code: "ANOV-PO-FUTURE123",
          productName: "Future Order",
          quantity: 1,
          totalPrice: 1000,
          customerName: "Future User",
          customerEmail: "future@example.com",
          customerPhone: "+33 6 33 33 33 33",
          deliveryMethod: $Enums.DeliveryMethod.PICKUP,
          status: $Enums.OrderStatus.PENDING_PAYMENT,
          transactionExpireAt: futureDate,
          createdAt: new Date(),
          updatedAt: new Date(),
          stripeSessionId: null,
        },
      ]);

      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL(
          "http://localhost:3000/api/admin/orders?status=PENDING_PAYMENT",
        ),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.data.length).toBe(1);
    });
  });
});
