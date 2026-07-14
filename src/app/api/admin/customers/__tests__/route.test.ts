import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock all dependencies BEFORE importing route
vi.mock("@/lib/prisma", () => ({
  prisma: {
    reservation: {
      groupBy: vi.fn(),
    },
    giftCard: {
      groupBy: vi.fn(),
    },
    contactMessage: {
      groupBy: vi.fn(),
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
      (prisma.reservation.groupBy as any).mockResolvedValue([
        {
          email: "test@example.com",
          _count: { _all: 3 },
          _max: { date: new Date("2024-06-15") },
        },
      ]);
      (prisma.giftCard.groupBy as any).mockResolvedValue([]);
      (prisma.contactMessage.groupBy as any).mockResolvedValue([]);
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

    it("returns customers with search filter", async () => {
      const { getAdminFromCookies } = await import("@/lib/auth");
      (getAdminFromCookies as any).mockResolvedValue({ id: 1 });

      const { prisma } = await import("@/lib/prisma");
      (prisma.reservation.groupBy as any).mockResolvedValue([
        {
          email: "test@example.com",
          _count: { _all: 3 },
          _max: { date: new Date("2024-06-15") },
        },
        {
          email: "another@test.com",
          _count: { _all: 1 },
          _max: { date: new Date("2024-06-10") },
        },
      ]);
      (prisma.giftCard.groupBy as any).mockResolvedValue([]);
      (prisma.contactMessage.groupBy as any).mockResolvedValue([]);
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

    it("includes gift card and contact message counts", async () => {
      const { getAdminFromCookies } = await import("@/lib/auth");
      (getAdminFromCookies as any).mockResolvedValue({ id: 1 });

      const { prisma } = await import("@/lib/prisma");
      (prisma.reservation.groupBy as any).mockResolvedValue([
        {
          email: "test@example.com",
          _count: { _all: 3 },
          _max: { date: new Date("2024-06-15") },
        },
      ]);
      (prisma.giftCard.groupBy as any).mockResolvedValue([
        {
          recipientEmail: "test@example.com",
          _count: { _all: 2 },
          _max: { createdAt: new Date("2024-06-10") },
        },
      ]);
      (prisma.contactMessage.groupBy as any).mockResolvedValue([
        {
          email: "test@example.com",
          _count: { _all: 1 },
          _max: { createdAt: new Date("2024-06-05") },
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
    });

    it("includes note status", async () => {
      const { getAdminFromCookies } = await import("@/lib/auth");
      (getAdminFromCookies as any).mockResolvedValue({ id: 1 });

      const { prisma } = await import("@/lib/prisma");
      (prisma.reservation.groupBy as any).mockResolvedValue([
        {
          email: "test@example.com",
          _count: { _all: 1 },
          _max: { date: new Date("2024-06-15") },
        },
      ]);
      (prisma.giftCard.groupBy as any).mockResolvedValue([]);
      (prisma.contactMessage.groupBy as any).mockResolvedValue([]);
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
      (prisma.reservation.groupBy as any).mockResolvedValue([
        {
          email: "first@example.com",
          _count: { _all: 1 },
          _max: { date: new Date("2024-06-01") },
        },
        {
          email: "second@example.com",
          _count: { _all: 1 },
          _max: { date: new Date("2024-06-15") },
        },
      ]);
      (prisma.giftCard.groupBy as any).mockResolvedValue([]);
      (prisma.contactMessage.groupBy as any).mockResolvedValue([]);
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
  });
});
