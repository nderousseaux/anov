// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { setAssignTable } from "../utils";

vi.mock("@/lib/tables", () => ({
  assignTable: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    $transaction: vi.fn(),
    restaurantSettings: {
      findFirst: vi.fn(),
    },
    table: {
      findMany: vi.fn(),
    },
    reservation: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn().mockResolvedValue({ stripeSessionId: "cs_test123" }),
    },
  },
}));

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
  DEPOSIT_PER_GUEST_CENTS: 2000,
}));

describe("Reservations API", () => {
  let POST: typeof import("../route").POST;
  let assignTableMock: vi.Mock;

  beforeEach(async () => {
    // Get the mocked assignTable
    const tablesMod = await import("@/lib/tables");
    assignTableMock = vi.mocked(tablesMod.assignTable);
    // Set default implementation to return a table
    assignTableMock.mockImplementation(async (params: any) => {
      console.error("assignTable called with params:", JSON.stringify(params));
      return { id: 1, name: "Table 1", capacity: 4, posX: 0, posY: 0 };
    });

    // Also set the override
    setAssignTable(assignTableMock);

    const routeMod = await import("../route");
    POST = routeMod.POST;
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
            guests: 5,
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

    it("creates reservation and returns Stripe session URL", async () => {
      vi.mocked(prisma.$transaction).mockImplementation(async (cb) => {
        const tx = {
          reservation: {
            create: vi
              .fn()
              .mockResolvedValue({
                id: 1,
                name: "Test User",
                email: "test@example.com",
              }),
            findMany: vi.fn().mockResolvedValue([]),
          },
          table: { findMany: vi.fn().mockResolvedValue([]) },
        };
        return cb(tx);
      });
      vi.mocked(prisma.restaurantSettings.findFirst).mockResolvedValue({
        id: 1,
        mealDuration: 90,
      });
      vi.mocked(prisma.reservation.update).mockResolvedValue({
        id: 1,
        stripeSessionId: "cs_test123",
      });
      assignTableMock.mockResolvedValue({
        id: 1,
        name: "Table 1",
        capacity: 2,
        posX: 0,
        posY: 0,
      });

      const today = new Date();
      const futureDate = new Date(today);
      futureDate.setDate(futureDate.getDate() + 7);
      const dateStr = futureDate.toISOString().split("T")[0];

      const req = new NextRequest(
        new URL("http://localhost:3000/api/reservations"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Test User",
            email: "test@example.com",
            phone: "+33 6 12 34 56 78",
            date: dateStr,
            time: "19:00",
            guests: 2,
            specialRequest: "Anniversary",
          }),
        },
      );
      const res = await POST(req as any);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.url).toBe("https://checkout.stripe.com/test");
      expect(data.sessionId).toBe("cs_test123");
    });

    it("returns 409 if no table available", async () => {
      vi.mocked(prisma.$transaction).mockImplementation(async (cb) => {
        const tx = {
          reservation: {
            create: vi.fn(),
            findMany: vi.fn().mockResolvedValue([]),
          },
          table: { findMany: vi.fn().mockResolvedValue([]) },
        };
        return cb(tx);
      });
      vi.mocked(prisma.restaurantSettings.findFirst).mockResolvedValue({
        id: 1,
        mealDuration: 90,
      });
      assignTableMock.mockResolvedValue(null);

      const today = new Date();
      const futureDate = new Date(today);
      futureDate.setDate(futureDate.getDate() + 7);
      const dateStr = futureDate.toISOString().split("T")[0];

      const req = new NextRequest(
        new URL("http://localhost:3000/api/reservations"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Test User",
            email: "test@example.com",
            date: dateStr,
            time: "19:00",
            guests: 2,
          }),
        },
      );
      const res = await POST(req as any);

      expect(res.status).toBe(409);
    });

    it("calculates correct deposit amount", async () => {
      vi.mocked(prisma.$transaction).mockImplementation(async (cb) => {
        const tx = {
          reservation: {
            create: vi.fn().mockResolvedValue({
              id: 1,
              name: "Test User",
              email: "test@example.com",
              phone: "+33 6 12 34 56 78",
              date: new Date("2026-07-21T19:00:00.000Z"),
              guests: 4,
              specialRequest: "",
              status: "PENDING_PAYMENT",
              depositPaidCents: 8000,
              transactionExpireAt: new Date(),
              cancelToken: "test-token",
              stripeSessionId: null,
              tableId: 1,
            }),
            findMany: vi.fn().mockResolvedValue([]),
          },
          table: {
            findMany: vi
              .fn()
              .mockResolvedValue([
                { id: 1, name: "Table 1", capacity: 4, posX: 0, posY: 0 },
              ]),
          },
        };
        return cb(tx);
      });
      vi.mocked(prisma.restaurantSettings.findFirst).mockResolvedValue({
        id: 1,
        mealDuration: 90,
      });
      console.log(
        "Test: assignTableMock before mockResolvedValue:",
        assignTableMock,
      );
      assignTableMock.mockResolvedValue({
        id: 1,
        name: "Table 1",
        capacity: 4,
        posX: 0,
        posY: 0,
      });
      console.log(
        "Test: assignTableMock after mockResolvedValue:",
        assignTableMock,
      );

      const dateStr = "2026-07-21";

      const req = new NextRequest(
        new URL("http://localhost:3000/api/reservations"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Test User",
            email: "test@example.com",
            date: dateStr,
            time: "19:00",
            guests: 4,
          }),
        },
      );
      const res = await POST(req as any);

      expect(res.status).toBe(200);
    });
  });
});
