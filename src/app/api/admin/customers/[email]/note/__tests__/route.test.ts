import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { getAdminFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    customerNote: {
      upsert: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("@/lib/auth", () => ({
  getAdminFromCookies: vi.fn(),
}));

describe("Admin Customer Note API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("PUT /api/admin/customers/[email]/note", () => {
    it("returns 401 if not authenticated", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue(null);

      const { PUT } = await import("../route");
      const req = new NextRequest(
        new URL(
          "http://localhost:3000/api/admin/customers/test@example.com/note",
        ),
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: "Test note" }),
        },
      );
      const res = await PUT(
        req as any,
        { params: Promise.resolve({ email: "test@example.com" }) } as any,
      );

      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toBe("Non autorisé");
    });

    it("returns 400 if content is not a string", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });

      const { PUT } = await import("../route");
      const req = new NextRequest(
        new URL(
          "http://localhost:3000/api/admin/customers/test@example.com/note",
        ),
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: 123 }),
        },
      );
      const res = await PUT(
        req as any,
        { params: Promise.resolve({ email: "test@example.com" }) } as any,
      );

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe("Contenu invalide");
    });

    it("returns 400 if content is missing", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });

      const { PUT } = await import("../route");
      const req = new NextRequest(
        new URL(
          "http://localhost:3000/api/admin/customers/test@example.com/note",
        ),
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        },
      );
      const res = await PUT(
        req as any,
        { params: Promise.resolve({ email: "test@example.com" }) } as any,
      );

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe("Contenu invalide");
    });

    it("creates a new note", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });

      const createdNote = {
        id: 1,
        email: "test@example.com",
        content: "Customer has special dietary needs",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.customerNote.upsert).mockResolvedValue(createdNote);

      const { PUT } = await import("../route");
      const req = new NextRequest(
        new URL(
          "http://localhost:3000/api/admin/customers/test@example.com/note",
        ),
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: "Customer has special dietary needs",
          }),
        },
      );
      const res = await PUT(
        req as any,
        { params: Promise.resolve({ email: "test@example.com" }) } as any,
      );

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.email).toBe("test@example.com");
      expect(data.content).toBe("Customer has special dietary needs");
    });

    it("updates an existing note", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });

      const updatedNote = {
        id: 1,
        email: "test@example.com",
        content: "Updated note content",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.customerNote.upsert).mockResolvedValue(updatedNote);

      const { PUT } = await import("../route");
      const req = new NextRequest(
        new URL(
          "http://localhost:3000/api/admin/customers/test@example.com/note",
        ),
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: "Updated note content" }),
        },
      );
      const res = await PUT(
        req as any,
        { params: Promise.resolve({ email: "test@example.com" }) } as any,
      );

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.content).toBe("Updated note content");
    });

    it("handles email case-insensitively", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });

      vi.mocked(prisma.customerNote.upsert).mockResolvedValue({
        id: 1,
        email: "test@example.com",
        content: "Test note",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const { PUT } = await import("../route");
      const req = new NextRequest(
        new URL(
          "http://localhost:3000/api/admin/customers/TEST@Example.COM/note",
        ),
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: "Test note" }),
        },
      );
      const res = await PUT(
        req as any,
        { params: Promise.resolve({ email: "TEST@Example.COM" }) } as any,
      );

      expect(res.status).toBe(200);
    });

    it("handles empty string content", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });

      const { PUT } = await import("../route");
      const req = new NextRequest(
        new URL(
          "http://localhost:3000/api/admin/customers/test@example.com/note",
        ),
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: "" }),
        },
      );
      const res = await PUT(
        req as any,
        { params: Promise.resolve({ email: "test@example.com" }) } as any,
      );

      expect(res.status).toBe(200);
    });
  });
});
