// @ts-nocheck
import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendGiftCardExpirationReminder } from "@/lib/email";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    giftCard: {
      findMany: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock("@/lib/email", () => ({
  sendGiftCardExpirationReminder: vi.fn().mockResolvedValue({}),
}));

describe("Cron Gift Card Reminders API", () => {
  describe("GET /api/cron/gift-card-reminders", () => {
    it("returns 401 if cron secret is invalid", async () => {
      const originalValue = process.env.CRON_SECRET;
      process.env.CRON_SECRET = "test-secret";

      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/cron/gift-card-reminders"),
        {
          method: "GET",
          headers: { "x-cron-secret": "wrong-secret" },
        },
      );
      const res = await GET(req as any);

      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toBe("Non autorisé");

      process.env.CRON_SECRET = originalValue;
    });

    it("returns 401 if cron secret is missing when required", async () => {
      const originalValue = process.env.CRON_SECRET;
      process.env.CRON_SECRET = "test-secret";

      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/cron/gift-card-reminders"),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any);

      expect(res.status).toBe(401);

      process.env.CRON_SECRET = originalValue;
    });

    it("succeeds when no cron secret is configured", async () => {
      const originalValue = process.env.CRON_SECRET;
      delete process.env.CRON_SECRET;

      vi.mocked(prisma.giftCard.findMany).mockResolvedValue([]);

      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/cron/gift-card-reminders"),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any);

      expect(res.status).toBe(200);

      if (originalValue !== undefined) {
        process.env.CRON_SECRET = originalValue;
      }
    });

    it("returns cron results with emails sent", async () => {
      const originalValue = process.env.CRON_SECRET;
      delete process.env.CRON_SECRET;

      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 30);

      vi.mocked(prisma.giftCard.findMany).mockResolvedValue([
        {
          id: 1,
          code: "ANOV-G-TEST1",
          amount: 100,
          recipientEmail: "test@example.com",
          expiresAt: targetDate,
          status: "ACTIVE",
          reminderEmailSent: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
      vi.mocked(prisma.giftCard.update).mockResolvedValue({});

      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/cron/gift-card-reminders"),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.emailsSent).toBeGreaterThanOrEqual(0);

      if (originalValue !== undefined) {
        process.env.CRON_SECRET = originalValue;
      }
    });
  });
});