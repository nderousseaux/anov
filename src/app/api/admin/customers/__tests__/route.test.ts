import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock all dependencies BEFORE importing route
vi.mock("@/lib/prisma", () => ({
  prisma: {
    reservation: {
      findMany: vi.fn(),
    },
    giftCard: {
      findMany: vi.fn(),
    },
    gourmetOffer: {
      findMany: vi.fn(),
    },
    contactMessage: {
      findMany: vi.fn(),
    },
    productOrder: {
      findMany: vi.fn(),
    },
    customerNote: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock("@/lib/auth", () => ({
  getAdminFromCookies: vi.fn(),
}));

describe("Admin Customers API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/admin/customers", () => {
    it("returns 401 if not authenticated", async () => {
      const { getAdminFromCookies } = await import("@/lib/auth");
      (getAdminFromCookies as any).mockResolvedValue(null);

      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/customers"),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any);

      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toBe("Non autorisé");
    });

    it("returns customer list with pagination", async () => {
      const { getAdminFromCookies } = await import("@/lib/auth");
      (getAdminFromCookies as any).mockResolvedValue({ id: 1 });

      const { prisma } = await import("@/lib/prisma");
      (prisma.reservation.findMany as any).mockResolvedValue([
        {
          email: "test@example.com",
          name: "Test User",
          date: new Date("2024-06-15"),
          createdAt: new Date("2024-06-01"),
        },
      ]);
      (prisma.giftCard.findMany as any).mockResolvedValue([]);
      (prisma.gourmetOffer.findMany as any).mockResolvedValue([]);
      (prisma.contactMessage.findMany as any).mockResolvedValue([]);
      (prisma.productOrder.findMany as any).mockResolvedValue([]);
      (prisma.customerNote.findMany as any).mockResolvedValue([]);

      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/customers?page=1"),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.data).toBeInstanceOf(Array);
      expect(data.total).toBeGreaterThan(0);
      expect(data.page).toBe(1);
      expect(data.pageSize).toBe(25);
    });

    it("returns customers with search filter matching email", async () => {
      const { getAdminFromCookies } = await import("@/lib/auth");
      (getAdminFromCookies as any).mockResolvedValue({ id: 1 });

      const { prisma } = await import("@/lib/prisma");
      (prisma.reservation.findMany as any).mockResolvedValue([
        {
          email: "test@example.com",
          name: "Test User",
          date: new Date("2024-06-15"),
          createdAt: new Date("2024-06-01"),
        },
        {
          email: "another@test.com",
          name: "Someone Else",
          date: new Date("2024-06-10"),
          createdAt: new Date("2024-06-01"),
        },
      ]);
      (prisma.giftCard.findMany as any).mockResolvedValue([]);
      (prisma.gourmetOffer.findMany as any).mockResolvedValue([]);
      (prisma.contactMessage.findMany as any).mockResolvedValue([]);
      (prisma.productOrder.findMany as any).mockResolvedValue([]);
      (prisma.customerNote.findMany as any).mockResolvedValue([]);

      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/customers?search=example"),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.data.length).toBe(1);
      expect(data.data[0].email).toBe("test@example.com");
    });

    it("returns customers with search filter matching name", async () => {
      const { getAdminFromCookies } = await import("@/lib/auth");
      (getAdminFromCookies as any).mockResolvedValue({ id: 1 });

      const { prisma } = await import("@/lib/prisma");
      (prisma.reservation.findMany as any).mockResolvedValue([
        {
          email: "test@example.com",
          name: "Jean Dupont",
          date: new Date("2024-06-15"),
          createdAt: new Date("2024-06-01"),
        },
        {
          email: "another@test.com",
          name: "Marie Curie",
          date: new Date("2024-06-10"),
          createdAt: new Date("2024-06-01"),
        },
      ]);
      (prisma.giftCard.findMany as any).mockResolvedValue([]);
      (prisma.gourmetOffer.findMany as any).mockResolvedValue([]);
      (prisma.contactMessage.findMany as any).mockResolvedValue([]);
      (prisma.productOrder.findMany as any).mockResolvedValue([]);
      (prisma.customerNote.findMany as any).mockResolvedValue([]);

      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/customers?search=dupont"),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.data.length).toBe(1);
      expect(data.data[0].email).toBe("test@example.com");
    });

    it("includes gift card, contact message and product order counts", async () => {
      const { getAdminFromCookies } = await import("@/lib/auth");
      (getAdminFromCookies as any).mockResolvedValue({ id: 1 });

      const { prisma } = await import("@/lib/prisma");
      (prisma.reservation.findMany as any).mockResolvedValue([
        {
          email: "test@example.com",
          name: "Test User",
          date: new Date("2024-06-15"),
          createdAt: new Date("2024-06-01"),
        },
      ]);
      (prisma.giftCard.findMany as any).mockResolvedValue([
        {
          recipientEmail: "test@example.com",
          name: null,
          createdAt: new Date("2024-06-10"),
        },
        {
          recipientEmail: "test@example.com",
          name: null,
          createdAt: new Date("2024-06-02"),
        },
      ]);
      (prisma.gourmetOffer.findMany as any).mockResolvedValue([]);
      (prisma.contactMessage.findMany as any).mockResolvedValue([
        {
          email: "test@example.com",
          name: "Test User",
          createdAt: new Date("2024-06-05"),
        },
      ]);
      (prisma.productOrder.findMany as any).mockResolvedValue([
        {
          customerEmail: "test@example.com",
          customerName: "Test User",
          createdAt: new Date("2024-06-12"),
        },
      ]);
      (prisma.customerNote.findMany as any).mockResolvedValue([]);

      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/customers"),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.data[0].giftCardCount).toBe(2);
      expect(data.data[0].contactCount).toBe(1);
      expect(data.data[0].productOrderCount).toBe(1);
    });

    it("includes note status", async () => {
      const { getAdminFromCookies } = await import("@/lib/auth");
      (getAdminFromCookies as any).mockResolvedValue({ id: 1 });

      const { prisma } = await import("@/lib/prisma");
      (prisma.reservation.findMany as any).mockResolvedValue([
        {
          email: "test@example.com",
          name: "Test User",
          date: new Date("2024-06-15"),
          createdAt: new Date("2024-06-01"),
        },
      ]);
      (prisma.giftCard.findMany as any).mockResolvedValue([]);
      (prisma.gourmetOffer.findMany as any).mockResolvedValue([]);
      (prisma.contactMessage.findMany as any).mockResolvedValue([]);
      (prisma.productOrder.findMany as any).mockResolvedValue([]);
      (prisma.customerNote.findMany as any).mockResolvedValue([
        { email: "test@example.com" },
      ]);

      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/customers"),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.data[0].hasNote).toBe(true);
    });

    it("sorts by last event time descending", async () => {
      const { getAdminFromCookies } = await import("@/lib/auth");
      (getAdminFromCookies as any).mockResolvedValue({ id: 1 });

      const { prisma } = await import("@/lib/prisma");
      (prisma.reservation.findMany as any).mockResolvedValue([
        {
          email: "first@example.com",
          name: "First User",
          date: new Date("2024-06-01"),
          createdAt: new Date("2024-05-01"),
        },
        {
          email: "second@example.com",
          name: "Second User",
          date: new Date("2024-06-15"),
          createdAt: new Date("2024-05-01"),
        },
      ]);
      (prisma.giftCard.findMany as any).mockResolvedValue([]);
      (prisma.gourmetOffer.findMany as any).mockResolvedValue([]);
      (prisma.contactMessage.findMany as any).mockResolvedValue([]);
      (prisma.productOrder.findMany as any).mockResolvedValue([]);
      (prisma.customerNote.findMany as any).mockResolvedValue([]);

      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/customers"),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.data[0].email).toBe("second@example.com");
      expect(data.data[1].email).toBe("first@example.com");
    });

    it("returns the most recently provided name across all sources", async () => {
      const { getAdminFromCookies } = await import("@/lib/auth");
      (getAdminFromCookies as any).mockResolvedValue({ id: 1 });

      const { prisma } = await import("@/lib/prisma");
      (prisma.reservation.findMany as any).mockResolvedValue([
        {
          email: "test@example.com",
          name: "Old Name",
          date: new Date("2024-01-15"),
          createdAt: new Date("2024-01-01"),
        },
      ]);
      (prisma.giftCard.findMany as any).mockResolvedValue([]);
      (prisma.gourmetOffer.findMany as any).mockResolvedValue([]);
      (prisma.contactMessage.findMany as any).mockResolvedValue([]);
      (prisma.productOrder.findMany as any).mockResolvedValue([
        {
          customerEmail: "test@example.com",
          customerName: "New Name",
          createdAt: new Date("2024-06-01"),
        },
      ]);
      (prisma.customerNote.findMany as any).mockResolvedValue([]);

      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/customers"),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.data[0].name).toBe("New Name");
    });

    it("returns null name if no source ever provided one", async () => {
      const { getAdminFromCookies } = await import("@/lib/auth");
      (getAdminFromCookies as any).mockResolvedValue({ id: 1 });

      const { prisma } = await import("@/lib/prisma");
      (prisma.reservation.findMany as any).mockResolvedValue([]);
      (prisma.giftCard.findMany as any).mockResolvedValue([
        {
          recipientEmail: "test@example.com",
          name: null,
          createdAt: new Date("2024-06-10"),
        },
      ]);
      (prisma.gourmetOffer.findMany as any).mockResolvedValue([]);
      (prisma.contactMessage.findMany as any).mockResolvedValue([]);
      (prisma.productOrder.findMany as any).mockResolvedValue([]);
      (prisma.customerNote.findMany as any).mockResolvedValue([]);

      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/customers"),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.data[0].name).toBeNull();
    });
  });
});
