// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { getAdminFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    restaurantSettings: {
      upsert: vi.fn(),
      findFirst: vi.fn(),
    },
    reservation: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock("@/lib/auth", () => ({
  getAdminFromCookies: vi.fn(),
}));

describe("Admin Settings API", () => {
  describe("GET /api/admin/settings", () => {
    it("returns 401 if not authenticated", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue(null);

      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/settings"),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any);

      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toBe("Non autorisé");
    });

    it("returns settings when authenticated", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });

      vi.mocked(prisma.restaurantSettings.upsert).mockResolvedValue({
        id: "1",
        maxCovers: 20,
        mealDuration: 90,
        openingDays: JSON.stringify([2, 3, 4, 5, 6]),
        openingSlots: JSON.stringify(["12:00", "19:00"]),
        depositPerGuestCents: 2000,
        daysBeforeReminder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/settings"),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.mealDuration).toBe(90);
    });
  });

  describe("PUT /api/admin/settings", () => {
    it("returns 401 if not authenticated", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue(null);

      const { PUT } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/settings"),
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        },
      );
      const res = await PUT(req as any);

      expect(res.status).toBe(401);
    });

    it("returns 400 if settings are invalid", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });

      const { PUT } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/settings"),
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mealDuration: 25,
          }),
        },
      );
      const res = await PUT(req as any);

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe("Paramètres invalides");
    });

    it("returns 200 when updating settings", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });

      vi.mocked(prisma.restaurantSettings.findFirst).mockResolvedValue({
        id: "1",
        maxCovers: 20,
        mealDuration: 90,
        openingDays: JSON.stringify([1, 2, 3, 4, 5]),
        openingSlots: JSON.stringify(["12:00", "19:00"]),
        depositPerGuestCents: 2000,
        daysBeforeReminder: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      vi.mocked(prisma.restaurantSettings.upsert).mockResolvedValue({
        id: "1",
        maxCovers: 20,
        mealDuration: 120,
        openingDays: JSON.stringify([1, 2, 3, 4]),
        openingSlots: JSON.stringify(["11:00", "19:00"]),
        depositPerGuestCents: 3000,
        daysBeforeReminder: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      // Mock findMany for the route
      vi.mocked(prisma.reservation.findMany).mockResolvedValue([]);

      const { PUT } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/settings"),
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mealDuration: 120,
            openingDays: [1, 2, 3, 4],
            openingSlots: ["11:00", "19:00"],
            depositPerGuestCents: 3000,
            daysBeforeReminder: 5,
          }),
        },
      );
      const res = await PUT(req as any);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.mealDuration).toBe(120);
      expect(data.openingDays).toEqual([1, 2, 3, 4]);
    });

    it("returns 409 when updating removes days/slots that impact upcoming reservations", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });

      // Create a future date that falls on day 5 (samedi, which will be removed)
      // Use a specific date that's in the future and falls on day 5
      const futureDate = new Date("2026-07-31T12:00:00.000Z"); // Samedi 31 juillet 2026

      vi.mocked(prisma.restaurantSettings.upsert).mockResolvedValue({
        id: "1",
        maxCovers: 20,
        mealDuration: 90,
        openingDays: JSON.stringify([1, 2, 3, 4]),
        openingSlots: JSON.stringify(["12:00"]),
        depositPerGuestCents: 2000,
        daysBeforeReminder: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      vi.mocked(prisma.restaurantSettings.findFirst).mockResolvedValue({
        id: "1",
        maxCovers: 20,
        mealDuration: 90,
        openingDays: JSON.stringify([1, 2, 3, 4, 5]),
        openingSlots: JSON.stringify(["12:00", "19:00"]),
        depositPerGuestCents: 2000,
        daysBeforeReminder: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      // Add a reservation on the future date
      vi.mocked(prisma.reservation.findMany).mockResolvedValue([
        {
          id: "1",
          name: "Test User",
          email: "test@example.com",
          date: futureDate,
          guests: 2,
          status: "CONFIRMED" as const,
          createdAt: new Date(),
          updatedAt: new Date(),
          cancelToken: "token",
          wantsSmsReminder: false,
          reminderEmailSent: false,
          reminderSmsSent: false,
          phone: null,
          specialRequest: null,
          depositPaidCents: null,
          tableId: null,
          stripeSessionId: null,
          expiresAt: null,
          transactionExpireAt: null,
        },
      ]);

      const { PUT } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/settings"),
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mealDuration: 90,
            openingDays: [1, 2, 3, 4],
            openingSlots: ["12:00"],
            depositPerGuestCents: 2000,
            daysBeforeReminder: 3,
          }),
        },
      );
      const res = await PUT(req as any);

      expect(res.status).toBe(409);
      const data = await res.json();
      expect(data.error).toBe("impact");
    });
  });
});
