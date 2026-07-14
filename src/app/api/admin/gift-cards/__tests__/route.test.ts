import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { getAdminFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { $Enums } from "@/generated/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    giftCard: {
      count: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("@/lib/auth", () => ({
  getAdminFromCookies: vi.fn(),
}));

describe("Admin Gift Cards API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/admin/gift-cards", () => {
    it("returns 401 if not authenticated", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue(null);

      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/gift-cards"),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any);

      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toBe("Non autorisé");
    });

    it("returns gift cards list with pagination", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });

      vi.mocked(prisma.giftCard.count).mockResolvedValue(2);
      vi.mocked(prisma.giftCard.findMany).mockResolvedValue([
        {
          id: "1",
          code: "ANOV-M-ABCD1234",
          amount: 100,
          status: $Enums.GiftCardStatus.ACTIVE,
          createdAt: new Date(),
          updatedAt: new Date(),
          stripeSessionId: null,
          expiresAt: null,
          transactionExpireAt: null,
          recipientEmail: null,
          personalMessage: null,
          isPaid: false,
          usedAt: null,
        },
        {
          id: "2",
          code: "ANOV-M-EFGH5678",
          amount: 200,
          status: $Enums.GiftCardStatus.ACTIVE,
          createdAt: new Date(),
          updatedAt: new Date(),
          stripeSessionId: null,
          expiresAt: null,
          transactionExpireAt: null,
          recipientEmail: null,
          personalMessage: null,
          isPaid: false,
          usedAt: null,
        },
      ]);

      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/gift-cards?page=1"),
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

    it("filters by status", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });

      vi.mocked(prisma.giftCard.count).mockResolvedValue(1);
      vi.mocked(prisma.giftCard.findMany).mockResolvedValue([
        {
          id: "1",
          code: "ANOV-M-ABCD1234",
          amount: 100,
          status: $Enums.GiftCardStatus.ACTIVE,
          createdAt: new Date(),
          updatedAt: new Date(),
          stripeSessionId: null,
          expiresAt: null,
          transactionExpireAt: null,
          recipientEmail: null,
          personalMessage: null,
          isPaid: false,
          usedAt: null,
        },
      ]);

      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/gift-cards?status=ACTIVE"),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.data[0].status).toBe("ACTIVE");
    });

    it("filters by code", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });

      vi.mocked(prisma.giftCard.count).mockResolvedValue(1);
      vi.mocked(prisma.giftCard.findMany).mockResolvedValue([
        {
          id: "1",
          code: "ANOV-M-ABCD1234",
          amount: 100,
          status: $Enums.GiftCardStatus.ACTIVE,
          createdAt: new Date(),
          updatedAt: new Date(),
          stripeSessionId: null,
          expiresAt: null,
          transactionExpireAt: null,
          recipientEmail: null,
          personalMessage: null,
          isPaid: false,
          usedAt: null,
        },
      ]);

      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/gift-cards?code=ABCD"),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.data[0].code).toBe("ANOV-M-ABCD1234");
    });

    it("filters by email", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });

      vi.mocked(prisma.giftCard.count).mockResolvedValue(1);
      vi.mocked(prisma.giftCard.findMany).mockResolvedValue([
        {
          id: "1",
          code: "ANOV-M-ABCD1234",
          amount: 100,
          status: $Enums.GiftCardStatus.ACTIVE,
          recipientEmail: "test@example.com",
          createdAt: new Date(),
          updatedAt: new Date(),
          stripeSessionId: null,
          expiresAt: null,
          transactionExpireAt: null,
          personalMessage: null,
          isPaid: false,
          usedAt: null,
        },
      ]);

      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/gift-cards?email=test"),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.data[0].recipientEmail).toBe("test@example.com");
    });

    it("excludes expired transactions for IN_PROGRESS_PAYMENT status", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });

      const now = new Date();

      vi.mocked(prisma.giftCard.count).mockResolvedValue(1);
      vi.mocked(prisma.giftCard.findMany).mockResolvedValue([
        {
          id: "1",
          code: "ANOV-M-ABCD1234",
          amount: 100,
          status: $Enums.GiftCardStatus.IN_PROGRESS_PAYMENT,
          transactionExpireAt: new Date(now.getTime() + 600000),
          createdAt: new Date(),
          updatedAt: new Date(),
          stripeSessionId: null,
          expiresAt: null,
          recipientEmail: null,
          personalMessage: null,
          isPaid: false,
          usedAt: null,
        },
      ]);

      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL(
          "http://localhost:3000/api/admin/gift-cards?status=IN_PROGRESS_PAYMENT",
        ),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any);

      expect(res.status).toBe(200);
    });
  });

  describe("POST /api/admin/gift-cards", () => {
    it("returns 401 if not authenticated", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue(null);

      const { POST } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/gift-cards"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: 100 }),
        },
      );
      const res = await POST(req as any);

      expect(res.status).toBe(401);
    });

    it("returns 400 if amount is missing", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });

      const { POST } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/gift-cards"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        },
      );
      const res = await POST(req as any);

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe("Le montant est requis");
    });

    it("returns 400 if amount is invalid", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });

      const { POST } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/gift-cards"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: -10 }),
        },
      );
      const res = await POST(req as any);

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe("Montant invalide");
    });

    it("returns 400 if email is invalid", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });

      const { POST } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/gift-cards"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: 100,
            recipientEmail: "invalid-email",
          }),
        },
      );
      const res = await POST(req as any);

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe("Email invalide");
    });

    it("creates a gift card with valid data", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });

      const createdGiftCard = {
        id: "1",
        code: "ANOV-M-ABCD1234",
        amount: 100,
        recipientEmail: "test@example.com",
        personalMessage: null,
        isPaid: false,
        status: $Enums.GiftCardStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
        stripeSessionId: null,
        expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 12)),
        transactionExpireAt: null,
        usedAt: null,
      };

      vi.mocked(prisma.giftCard.create).mockResolvedValue(createdGiftCard);

      const { POST } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/gift-cards"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: 100,
            recipientEmail: "test@example.com",
            personalMessage: "Test message",
          }),
        },
      );
      const res = await POST(req as any);

      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.amount).toBe(100);
      expect(data.recipientEmail).toBe("test@example.com");
    });

    it("creates a gift card without email", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });

      const createdGiftCard = {
        id: "1",
        code: "ANOV-M-ABCD1234",
        amount: 100,
        recipientEmail: null,
        personalMessage: null,
        isPaid: false,
        status: $Enums.GiftCardStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
        stripeSessionId: null,
        expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 12)),
        transactionExpireAt: null,
        usedAt: null,
      };

      vi.mocked(prisma.giftCard.create).mockResolvedValue(createdGiftCard);

      const { POST } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/gift-cards"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: 100 }),
        },
      );
      const res = await POST(req as any);

      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.recipientEmail).toBeNull();
    });
  });

  describe("PATCH /api/admin/gift-cards", () => {
    it("returns 401 if not authenticated", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue(null);

      const { PATCH } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/gift-cards"),
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: "1", action: "validate" }),
        },
      );
      const res = await PATCH(req as any);

      expect(res.status).toBe(401);
    });

    it("returns 400 if id or action is missing", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });

      const { PATCH } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/gift-cards"),
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: "1" }),
        },
      );
      const res = await PATCH(req as any);

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe("ID et action requis");
    });

    it("validates a gift card", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });

      const updatedGiftCard = {
        id: "1",
        code: "ANOV-M-ABCD1234",
        amount: 100,
        status: $Enums.GiftCardStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
        stripeSessionId: null,
        expiresAt: null,
        transactionExpireAt: null,
        recipientEmail: null,
        personalMessage: null,
        isPaid: false,
        usedAt: null,
      };

      vi.mocked(prisma.giftCard.update).mockResolvedValue(updatedGiftCard);

      const { PATCH } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/gift-cards"),
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: "1", action: "validate" }),
        },
      );
      const res = await PATCH(req as any);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
    });

    it("marks a gift card as used", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });

      const updatedGiftCard = {
        id: "1",
        code: "ANOV-M-ABCD1234",
        amount: 100,
        status: $Enums.GiftCardStatus.USED,
        createdAt: new Date(),
        updatedAt: new Date(),
        stripeSessionId: null,
        expiresAt: null,
        transactionExpireAt: null,
        recipientEmail: null,
        personalMessage: null,
        isPaid: false,
        usedAt: new Date(),
      };

      vi.mocked(prisma.giftCard.update).mockResolvedValue(updatedGiftCard);

      const { PATCH } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/gift-cards"),
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: "1", action: "markUsed" }),
        },
      );
      const res = await PATCH(req as any);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.giftCard.status).toBe("USED");
    });

    it("deletes a gift card", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });

      vi.mocked(prisma.giftCard.delete).mockResolvedValue({
        id: "1",
        code: "ANOV-M-ABCD1234",
        amount: 100,
        status: $Enums.GiftCardStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
        stripeSessionId: null,
        expiresAt: null,
        transactionExpireAt: null,
        recipientEmail: null,
        personalMessage: null,
        isPaid: false,
        usedAt: null,
      });

      const { PATCH } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/gift-cards"),
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: "1", action: "delete" }),
        },
      );
      const res = await PATCH(req as any);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
    });

    it("returns 400 for invalid action", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });

      const { PATCH } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/gift-cards"),
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: "1", action: "invalidAction" }),
        },
      );
      const res = await PATCH(req as any);

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe("Action invalide");
    });
  });
});
