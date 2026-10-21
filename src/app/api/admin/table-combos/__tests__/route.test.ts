// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { getAdminFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    table: { findMany: vi.fn() },
    tableCombo: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("@/lib/auth", () => ({ getAdminFromCookies: vi.fn() }));

const json = (method: string, body?: unknown) =>
  new NextRequest(new URL("http://localhost:3000/api/admin/table-combos"), {
    method,
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
const ctx = (id: string) => ({ params: Promise.resolve({ id }) });

const TABLES = [
  { id: 1, capacity: 2 },
  { id: 2, capacity: 4 },
  { id: 3, capacity: 3 },
];

describe("Admin table combos", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });
    // Émule le filtre `where: { id: { in } }` de la vraie base
    vi.mocked(prisma.table.findMany).mockImplementation(async (args) => {
      const ids = args?.where?.id?.in;
      return ids ? TABLES.filter((t) => ids.includes(t.id)) : TABLES;
    });
    vi.mocked(prisma.tableCombo.findMany).mockResolvedValue([]);
  });

  it("returns 401 if not authenticated", async () => {
    vi.mocked(getAdminFromCookies).mockResolvedValue(null);
    const { GET } = await import("../route");
    expect((await GET()).status).toBe(401);
  });

  it("lists combos with the sum as default capacity, or the override", async () => {
    vi.mocked(prisma.tableCombo.findMany).mockResolvedValue([
      { id: 1, tableIds: [1, 2], capacityOverride: null },
      { id: 2, tableIds: [1, 3], capacityOverride: 4 },
    ]);
    const { GET } = await import("../route");

    const data = await (await GET()).json();

    expect(data.map((c) => c.capacity)).toEqual([6, 4]);
  });

  describe("POST", () => {
    it.each([
      [{ tableIds: [1] }, "une seule table"],
      [{ tableIds: [1, 1] }, "deux fois la même table"],
      [{ tableIds: [1, 2, 3] }, "plus de 2 tables (v1)"],
      [{ tableIds: ["a", "b"] }, "ids non numériques"],
      [{ tableIds: [1, 2], capacityOverride: 0 }, "capacité nulle"],
      [{ tableIds: [1, 2], capacityOverride: 99 }, "capacité trop grande"],
    ])("rejects %j (%s)", async (body) => {
      const { POST } = await import("../route");
      const res = await POST(json("POST", body));
      expect(res.status).toBe(400);
      expect(prisma.tableCombo.create).not.toHaveBeenCalled();
    });

    it("returns 404 if a table does not exist", async () => {
      const { POST } = await import("../route");
      const res = await POST(json("POST", { tableIds: [1, 42] }));
      expect(res.status).toBe(404);
    });

    it("returns 409 for a pair that already exists, whatever the order", async () => {
      vi.mocked(prisma.tableCombo.findMany).mockResolvedValue([
        { id: 1, tableIds: [2, 1], capacityOverride: null },
      ]);
      const { POST } = await import("../route");
      const res = await POST(json("POST", { tableIds: [1, 2] }));
      expect(res.status).toBe(409);
    });

    it("creates a combo with sorted ids and no override by default", async () => {
      vi.mocked(prisma.tableCombo.create).mockResolvedValue({ id: 5 });
      vi.mocked(prisma.tableCombo.findMany)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([
          { id: 5, tableIds: [1, 2], capacityOverride: null },
        ]);
      const { POST } = await import("../route");

      const res = await POST(json("POST", { tableIds: [2, 1] }));

      expect(res.status).toBe(201);
      expect(prisma.tableCombo.create.mock.calls[0][0].data).toEqual({
        tableIds: [1, 2],
        capacityOverride: null,
      });
      expect((await res.json()).capacity).toBe(6);
    });
  });

  describe("PATCH / DELETE /[id]", () => {
    it("sets a custom capacity, or null to go back to the sum", async () => {
      vi.mocked(prisma.tableCombo.findUnique).mockResolvedValue({ id: 1 });
      vi.mocked(prisma.tableCombo.update).mockResolvedValue({ id: 1 });
      const { PATCH } = await import("../[id]/route");

      expect(
        (await PATCH(json("PATCH", { capacityOverride: 5 }), ctx("1"))).status,
      ).toBe(200);
      expect(prisma.tableCombo.update.mock.calls[0][0].data).toEqual({
        capacityOverride: 5,
      });

      await PATCH(json("PATCH", { capacityOverride: null }), ctx("1"));
      expect(prisma.tableCombo.update.mock.calls[1][0].data).toEqual({
        capacityOverride: null,
      });
    });

    it("requires capacityOverride and validates it", async () => {
      const { PATCH } = await import("../[id]/route");
      expect((await PATCH(json("PATCH", {}), ctx("1"))).status).toBe(400);
      expect(
        (await PATCH(json("PATCH", { capacityOverride: -3 }), ctx("1"))).status,
      ).toBe(400);
    });

    it("returns 404 for unknown combos", async () => {
      vi.mocked(prisma.tableCombo.findUnique).mockResolvedValue(null);
      const { PATCH, DELETE } = await import("../[id]/route");
      expect(
        (await PATCH(json("PATCH", { capacityOverride: 5 }), ctx("9"))).status,
      ).toBe(404);
      expect((await DELETE(json("DELETE"), ctx("9"))).status).toBe(404);
    });

    it("deletes a combo", async () => {
      vi.mocked(prisma.tableCombo.findUnique).mockResolvedValue({ id: 1 });
      const { DELETE } = await import("../[id]/route");
      const res = await DELETE(json("DELETE"), ctx("1"));
      expect(res.status).toBe(200);
      expect(prisma.tableCombo.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});
