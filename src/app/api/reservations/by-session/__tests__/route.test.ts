// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    reservation: {
      findUnique: vi.fn(),
    },
  },
}));

describe("Reservations By Session API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/reservations/by-session", () => {
    it("returns 400 if session_id is missing", async () => {
      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/reservations/by-session"),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any);

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe("Session ID manquant");
    });

    it("returns 404 if reservation not found", async () => {
      vi.mocked(prisma.reservation.findUnique).mockResolvedValue(null);

      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL(
          "http://localhost:3000/api/reservations/by-session?session_id=cs_test123",
        ),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any);

      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data.error).toBe("Réservation introuvable");
    });

    it("returns reservation details for valid session", async () => {
      const reservation = {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        phone: "+33 6 12 34 56 78",
        date: new Date("2024-06-15T19:00:00.000Z"),
        guests: 2,
        status: "CONFIRMED",
        depositPaidCents: 4000,
      };

      vi.mocked(prisma.reservation.findUnique).mockResolvedValue(reservation);

      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL(
          "http://localhost:3000/api/reservations/by-session?session_id=cs_test123",
        ),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.id).toBe(1);
      expect(data.name).toBe("Test User");
      expect(data.status).toBe("CONFIRMED");
    });

    it("excludes transactionExpireAt from response", async () => {
      const reservation = {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        phone: "+33 6 12 34 56 78",
        date: new Date("2024-06-15T19:00:00.000Z"),
        guests: 2,
        status: "CONFIRMED",
        depositPaidCents: 4000,
      };

      vi.mocked(prisma.reservation.findUnique).mockResolvedValue(reservation);

      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL(
          "http://localhost:3000/api/reservations/by-session?session_id=cs_test123",
        ),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).not.toHaveProperty("transactionExpireAt");
    });
  });
});
