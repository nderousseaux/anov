import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// Vraie base (anov_test) : voir vitest.integration.config.ts
vi.mock("@/lib/auth", () => ({
  getAdminFromCookies: vi.fn().mockResolvedValue({ id: 1 }),
}));

const req = (method: string, body?: unknown) =>
  new NextRequest(new URL("http://localhost:3000/api/admin/tables"), {
    method,
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
const ctx = (id: number) => ({ params: Promise.resolve({ id: String(id) }) });

const AT = new Date("2030-06-04T19:00:00.000Z");

describe.skipIf(!process.env.DATABASE_URL_TEST)(
  "réglages des tables (Postgres réel)",
  () => {
    const wipe = async () => {
      await prisma.reservation.deleteMany();
      await prisma.tableCombo.deleteMany();
      await prisma.table.deleteMany();
    };
    beforeEach(wipe);
    afterAll(async () => {
      await wipe();
      await prisma.$disconnect();
    });

    it("crée, renomme, bascule en walk-in et refuse un doublon de nom", async () => {
      const tables = await import("../route");
      const one = await tables.POST(req("POST", { name: "T1", capacity: 2 }));
      expect(one.status).toBe(201);
      const created = await one.json();

      expect(
        (await tables.POST(req("POST", { name: "T1", capacity: 4 }))).status,
      ).toBe(409);

      const { PATCH } = await import("../[id]/route");
      const patched = await PATCH(
        req("PATCH", { name: "Terrasse", walkIn: true }),
        ctx(created.id),
      );
      expect(await patched.json()).toMatchObject({
        name: "Terrasse",
        walkIn: true,
        capacity: 2,
      });

      const list = await (await tables.GET()).json();
      expect(list).toHaveLength(1);
      expect(list[0].walkIn).toBe(true);
    });

    it("gère les combinaisons : doublon refusé, capacité par défaut puis modifiée", async () => {
      const a = await prisma.table.create({ data: { name: "A", capacity: 3 } });
      const b = await prisma.table.create({ data: { name: "B", capacity: 3 } });
      const combos = await import("../../table-combos/route");
      const comboById = await import("../../table-combos/[id]/route");

      const created = await combos.POST(
        req("POST", { tableIds: [b.id, a.id] }),
      );
      expect(created.status).toBe(201);
      const combo = await created.json();
      expect(combo).toMatchObject({ tableIds: [a.id, b.id], capacity: 6 });

      expect(
        (await combos.POST(req("POST", { tableIds: [a.id, b.id] }))).status,
      ).toBe(409);

      await comboById.PATCH(
        req("PATCH", { capacityOverride: 5 }),
        ctx(combo.id),
      );
      const [listed] = await (await combos.GET()).json();
      expect(listed.capacity).toBe(5);
    });

    it("supprimer une table supprime ses combinaisons et efface l'ancien tableId", async () => {
      const a = await prisma.table.create({ data: { name: "A", capacity: 3 } });
      const b = await prisma.table.create({ data: { name: "B", capacity: 3 } });
      await prisma.tableCombo.create({ data: { tableIds: [a.id, b.id] } });
      const legacy = await prisma.reservation.create({
        data: {
          name: "Ancien",
          email: "a@example.com",
          date: new Date("2020-01-01T19:00:00.000Z"),
          guests: 2,
          status: "COMPLETED",
          tableId: a.id,
        },
      });

      const { DELETE } = await import("../[id]/route");
      const res = await DELETE(req("DELETE"), ctx(a.id));

      expect(res.status).toBe(200);
      expect(await prisma.tableCombo.count()).toBe(0);
      expect(await prisma.table.count()).toBe(1);
      expect(
        (await prisma.reservation.findUnique({ where: { id: legacy.id } }))
          ?.tableId,
      ).toBeNull();
    });

    it("refuse de supprimer une table où une réservation à venir est épinglée", async () => {
      const a = await prisma.table.create({ data: { name: "A", capacity: 4 } });
      await prisma.reservation.create({
        data: {
          name: "Épinglée",
          email: "p@example.com",
          date: AT,
          guests: 2,
          status: "CONFIRMED",
          pinnedTableIds: [a.id],
        },
      });

      const { DELETE } = await import("../[id]/route");
      const res = await DELETE(req("DELETE"), ctx(a.id));

      expect(res.status).toBe(409);
      expect(await prisma.table.count()).toBe(1);
    });

    it("l'endpoint d'alerte liste les services devenus impossibles", async () => {
      const a = await prisma.table.create({ data: { name: "A", capacity: 2 } });
      for (const name of ["R1", "R2"]) {
        await prisma.reservation.create({
          data: {
            name,
            email: "r@example.com",
            date: AT,
            guests: 2,
            status: "CONFIRMED",
          },
        });
      }
      const { GET } = await import("../../seating/infeasible/route");

      const { infeasibleServices } = await (await GET()).json();

      expect(infeasibleServices).toHaveLength(1);
      expect(infeasibleServices[0].unplaced).toHaveLength(1);
      expect(a.id).toBeDefined();
    });
  },
);
