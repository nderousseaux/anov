import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock all dependencies
vi.mock("@/lib/prisma", () => ({
  prisma: {
    reservation: {
      count: vi.fn().mockResolvedValue(0),
      findMany: vi.fn().mockResolvedValue([]),
      update: vi.fn().mockImplementation(async (params) => ({
        id: params.where.id,
        name: "Test User",
        email: "test@example.com",
        date: new Date("2024-06-15T19:00:00.000Z"),
        status: params.data.status,
        stripeSessionId: "test_session_id",
        depositPaidCents: 5000,
      })),
    },
    table: {
      findMany: vi.fn().mockResolvedValue([]),
    },
  },
}));

vi.mock("@/lib/auth", () => ({
  getAdminFromCookies: vi.fn(),
}));

vi.mock("@/lib/email", () => ({
  sendCancellationEmail: vi.fn(),
}));

vi.mock("@/lib/stripe", () => ({
  stripe: {
    checkout: {
      sessions: {
        retrieve: vi.fn().mockResolvedValue({ payment_intent: "test_intent" }),
      },
    },
    refunds: {
      create: vi.fn().mockResolvedValue({ id: "test_refund" }),
    },
  },
}));

// Import after mocking
describe("admin reservations API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/admin/reservations", () => {
    it("returns 401 if not authenticated", async () => {
      const { getAdminFromCookies } = await import("@/lib/auth");
      (getAdminFromCookies as any).mockResolvedValue(null);

      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/reservations"),
      );
      const res = await GET(req as any);

      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toBe("Non autorisé");
    });

    it("filters by status", async () => {
      const { getAdminFromCookies } = await import("@/lib/auth");
      (getAdminFromCookies as any).mockResolvedValue({
        id: 1,
        username: "admin",
      });

      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL(
          "http://localhost:3000/api/admin/reservations?status=CONFIRMED",
          "http://localhost:3000",
        ),
      );
      const res = await GET(req as any);

      expect(res.status).toBe(200);
    });

    it("filters by date", async () => {
      const { getAdminFromCookies } = await import("@/lib/auth");
      (getAdminFromCookies as any).mockResolvedValue({
        id: 1,
        username: "admin",
      });

      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL(
          "http://localhost:3000/api/admin/reservations?date=2024-06-15",
          "http://localhost:3000",
        ),
      );
      const res = await GET(req as any);

      expect(res.status).toBe(200);
    });

    it("returns reservations with pagination", async () => {
      const { getAdminFromCookies } = await import("@/lib/auth");
      (getAdminFromCookies as any).mockResolvedValue({
        id: 1,
        username: "admin",
      });

      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL(
          "http://localhost:3000/api/admin/reservations?page=1",
          "http://localhost:3000",
        ),
      );
      const res = await GET(req as any);

      expect(res.status).toBe(200);
    });
  });

  describe("PATCH /api/admin/reservations", () => {
    it("returns 401 if not authenticated", async () => {
      const { getAdminFromCookies } = await import("@/lib/auth");
      (getAdminFromCookies as any).mockResolvedValue(null);

      const { PATCH } = await import("../route");
      const req = new NextRequest(
        new URL(
          "http://localhost:3000/api/admin/reservations",
          "http://localhost:3000",
        ),
        {
          method: "PATCH",
          body: JSON.stringify({ id: 1, status: "CONFIRMED" }),
        },
      );
      const res = await PATCH(req as any);

      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toBe("Non autorisé");
    });

    it("updates reservation status to CONFIRMED", async () => {
      const { getAdminFromCookies } = await import("@/lib/auth");
      (getAdminFromCookies as any).mockResolvedValue({
        id: 1,
        username: "admin",
      });

      const { PATCH } = await import("../route");
      const req = new NextRequest(
        new URL(
          "http://localhost:3000/api/admin/reservations",
          "http://localhost:3000",
        ),
        {
          method: "PATCH",
          body: JSON.stringify({ id: 1, status: "CONFIRMED" }),
        },
      );
      const res = await PATCH(req as any);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.status).toBe("CONFIRMED");
    });

    it("updates reservation status to CANCELLED", async () => {
      const { getAdminFromCookies } = await import("@/lib/auth");
      (getAdminFromCookies as any).mockResolvedValue({
        id: 1,
        username: "admin",
      });

      const { PATCH } = await import("../route");
      const { sendCancellationEmail } = await import("@/lib/email");
      const req = new NextRequest(
        new URL(
          "http://localhost:3000/api/admin/reservations",
          "http://localhost:3000",
        ),
        {
          method: "PATCH",
          body: JSON.stringify({ id: 1, status: "CANCELLED" }),
        },
      );
      const res = await PATCH(req as any);

      expect(res.status).toBe(200);
      expect(sendCancellationEmail).toHaveBeenCalled();
    });

    it("updates reservation status to COMPLETED", async () => {
      const { getAdminFromCookies } = await import("@/lib/auth");
      (getAdminFromCookies as any).mockResolvedValue({
        id: 1,
        username: "admin",
      });

      const { PATCH } = await import("../route");
      const req = new NextRequest(
        new URL(
          "http://localhost:3000/api/admin/reservations",
          "http://localhost:3000",
        ),
        {
          method: "PATCH",
          body: JSON.stringify({ id: 1, status: "COMPLETED" }),
        },
      );
      const res = await PATCH(req as any);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.status).toBe("COMPLETED");
    });

    it("returns 400 for invalid status", async () => {
      const { getAdminFromCookies } = await import("@/lib/auth");
      (getAdminFromCookies as any).mockResolvedValue({
        id: 1,
        username: "admin",
      });

      const { PATCH } = await import("../route");
      const req = new NextRequest(
        new URL(
          "http://localhost:3000/api/admin/reservations",
          "http://localhost:3000",
        ),
        { method: "PATCH", body: JSON.stringify({ id: 1, status: "INVALID" }) },
      );
      const res = await PATCH(req as any);

      expect(res.status).toBe(400);
    });

    it("returns 400 for missing id", async () => {
      const { getAdminFromCookies } = await import("@/lib/auth");
      (getAdminFromCookies as any).mockResolvedValue({
        id: 1,
        username: "admin",
      });

      const { PATCH } = await import("../route");
      const req = new NextRequest(
        new URL(
          "http://localhost:3000/api/admin/reservations",
          "http://localhost:3000",
        ),
        { method: "PATCH", body: JSON.stringify({ status: "CONFIRMED" }) },
      );
      const res = await PATCH(req as any);

      expect(res.status).toBe(400);
    });
  });
});
