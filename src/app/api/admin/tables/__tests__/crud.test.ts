// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { getAdminFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    $transaction: vi.fn(),
    table: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    tableCombo: { deleteMany: vi.fn() },
    reservation: { count: vi.fn(), updateMany: vi.fn() },
  },
}));

vi.mock("@/lib/auth", () => ({ getAdminFromCookies: vi.fn() }));

const json = (method: string, body?: unknown) =>
  new NextRequest(new URL("http://localhost:3000/api/admin/tables"), {
    method,
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
const ctx = (id: string) => ({ params: Promise.resolve({ id }) });

describe("Admin tables CRUD", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });
  });

  describe("POST /api/admin/tables", () => {
    it("returns 401 if not authenticated", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue(null);
      const { POST } = await import("../route");
      const res = await POST(json("POST", { name: "T9", capacity: 2 }));
      expect(res.status).toBe(401);
    });

    it.each([
      [{ capacity: 2 }, "nom manquant"],
      [{ name: "  ", capacity: 2 }, "nom vide"],
      [{ name: "T9" }, "capacité manquante"],
      [{ name: "T9", capacity: 0 }, "capacité nulle"],
      [{ name: "T9", capacity: 2.5 }, "capacité non entière"],
      [{ name: "T9", capacity: 21 }, "capacité trop grande"],
      [{ name: "T9", capacity: 2, walkIn: "oui" }, "walkIn non booléen"],
      [{ name: "T9", capacity: 2, posX: 120 }, "position hors plan"],
    ])("rejects invalid input: %j (%s)", async (body) => {
      const { POST } = await import("../route");
      const res = await POST(json("POST", body));
      expect(res.status).toBe(400);
      expect(prisma.table.create).not.toHaveBeenCalled();
    });

    it("creates a table with defaults", async () => {
      vi.mocked(prisma.table.create).mockResolvedValue({ id: 7 });
      const { POST } = await import("../route");

      const res = await POST(json("POST", { name: " T9 ", capacity: 4 }));

      expect(res.status).toBe(201);
      expect(prisma.table.create.mock.calls[0][0].data).toEqual({
        name: "T9",
        capacity: 4,
        walkIn: false,
        posX: 50,
        posY: 50,
      });
    });

    it("returns 409 when the name is already used", async () => {
      vi.mocked(prisma.table.create).mockRejectedValue({ code: "P2002" });
      const { POST } = await import("../route");
      const res = await POST(json("POST", { name: "T1", capacity: 2 }));
      expect(res.status).toBe(409);
    });
  });

  describe("PATCH /api/admin/tables/[id]", () => {
    it("updates only the given fields (walk-in switch)", async () => {
      vi.mocked(prisma.table.findUnique).mockResolvedValue({ id: 3 });
      vi.mocked(prisma.table.update).mockResolvedValue({ id: 3, walkIn: true });
      const { PATCH } = await import("../[id]/route");

      const res = await PATCH(json("PATCH", { walkIn: true }), ctx("3"));

      expect(res.status).toBe(200);
      expect(prisma.table.update.mock.calls[0][0].data).toEqual({
        walkIn: true,
      });
    });

    it("returns 404 for an unknown table", async () => {
      vi.mocked(prisma.table.findUnique).mockResolvedValue(null);
      const { PATCH } = await import("../[id]/route");
      const res = await PATCH(json("PATCH", { capacity: 3 }), ctx("99"));
      expect(res.status).toBe(404);
    });

    it("rejects a non numeric id and invalid values", async () => {
      const { PATCH } = await import("../[id]/route");
      expect((await PATCH(json("PATCH", {}), ctx("abc"))).status).toBe(400);
      expect(
        (await PATCH(json("PATCH", { capacity: -1 }), ctx("3"))).status,
      ).toBe(400);
    });
  });

  describe("DELETE /api/admin/tables/[id]", () => {
    it("refuses while an upcoming reservation is pinned on the table", async () => {
      vi.mocked(prisma.table.findUnique).mockResolvedValue({ id: 3 });
      vi.mocked(prisma.reservation.count).mockResolvedValue(2);
      const { DELETE } = await import("../[id]/route");

      const res = await DELETE(json("DELETE"), ctx("3"));

      expect(res.status).toBe(409);
      expect((await res.json()).error).toContain("2 réservation(s)");
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it("deletes the table, its combos, and clears the legacy tableId", async () => {
      vi.mocked(prisma.table.findUnique).mockResolvedValue({ id: 3 });
      vi.mocked(prisma.reservation.count).mockResolvedValue(0);
      const { DELETE } = await import("../[id]/route");

      const res = await DELETE(json("DELETE"), ctx("3"));

      expect(res.status).toBe(200);
      expect(prisma.tableCombo.deleteMany).toHaveBeenCalledWith({
        where: { tableIds: { has: 3 } },
      });
      expect(prisma.reservation.updateMany).toHaveBeenCalledWith({
        where: { tableId: 3 },
        data: { tableId: null },
      });
      expect(prisma.table.delete).toHaveBeenCalledWith({ where: { id: 3 } });
      expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    });

    it("returns 404 for an unknown table", async () => {
      vi.mocked(prisma.table.findUnique).mockResolvedValue(null);
      const { DELETE } = await import("../[id]/route");
      expect((await DELETE(json("DELETE"), ctx("99"))).status).toBe(404);
    });
  });
});
