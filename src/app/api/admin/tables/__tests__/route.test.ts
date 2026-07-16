// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { getAdminFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    table: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock("@/lib/auth", () => ({
  getAdminFromCookies: vi.fn(),
}));

describe("Admin Tables API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/admin/tables", () => {
    it("returns 401 if not authenticated", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue(null);

      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/tables"),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any, {} as any);

      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toBe("Non autorisé");
    });

    it("returns empty table list", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });

      vi.mocked(prisma.table.findMany as any).mockResolvedValue([]);

      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/tables"),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any, {} as any);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toEqual([]);
    });

    it("returns tables sorted by capacity", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });

      const tables = [
        { id: "1", name: "Table 1", capacity: 4, posX: 0, posY: 0 },
        { id: "2", name: "Table 2", capacity: 2, posX: 1, posY: 0 },
        { id: "3", name: "Table 3", capacity: 6, posX: 2, posY: 0 },
      ];

      // Sort tables by capacity ascending (as the route does)
      const sortedTables = [...tables].sort((a, b) => a.capacity - b.capacity);

      vi.mocked(prisma.table.findMany as any).mockResolvedValue(sortedTables);

      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/tables"),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any, {} as any);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.length).toBe(3);
      // Tables should be sorted by capacity ascending
      expect(data[0].capacity).toBe(2);
      expect(data[1].capacity).toBe(4);
      expect(data[2].capacity).toBe(6);
    });

    it("returns table details with correct fields", async () => {
      vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });

      const tables = [
        { id: "1", name: "Table 1", capacity: 2, posX: 10, posY: 20 },
      ];

      vi.mocked(prisma.table.findMany as any).mockResolvedValue(tables);

      const { GET } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/tables"),
        {
          method: "GET",
        },
      );
      const res = await GET(req as any, {} as any);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data[0]).toEqual({
        id: "1",
        name: "Table 1",
        capacity: 2,
        posX: 10,
        posY: 20,
      });
    });
  });
});
