import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { loadDayPlanning } from "@/lib/seating/db";

// Vraie base (anov_test) : voir vitest.integration.config.ts
vi.mock("@/lib/auth", () => ({
  getAdminFromCookies: vi.fn().mockResolvedValue({ id: 1 }),
}));

const DATE = "2030-06-04";
const AT = new Date(`${DATE}T19:30:00.000Z`);

const put = async (id: string, body: unknown) => {
  const { PUT } = await import("../route");
  return PUT(
    new NextRequest(
      new URL(`http://localhost:3000/api/admin/reservations/${id}/tables`),
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    ),
    { params: Promise.resolve({ id }) },
  );
};

const book = (
  name: string,
  guests: number,
  extra: Record<string, unknown> = {},
) =>
  prisma.reservation.create({
    data: {
      name,
      email: `${name}@example.com`,
      date: AT,
      guests,
      status: "CONFIRMED",
      ...extra,
    },
  });

const dinner = async () => (await loadDayPlanning(prisma, DATE)).services[1];
const tableOf = async (id: string) =>
  (await dinner()).reservations.find((r) => r.id === id)!.assignedTableIds;

describe.skipIf(!process.env.DATABASE_URL_TEST)(
  "déplacement et épinglage (Postgres réel)",
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

    // T1(2) T2(2) T3(3) T4(3) T5(4) — T6(4) est walk-in
    async function room() {
      const t: Record<string, number> = {};
      for (const [name, capacity, walkIn] of [
        ["T1", 2, false],
        ["T2", 2, false],
        ["T3", 3, false],
        ["T4", 3, false],
        ["T5", 4, false],
        ["T6", 4, true],
      ] as const) {
        t[name] = (
          await prisma.table.create({ data: { name, capacity, walkIn } })
        ).id;
      }
      return t;
    }

    it("déplace une réservation sur une autre table : elle est épinglée et l'algo la respecte", async () => {
      const t = await room();
      const r = await book("Martin", 2);

      const res = await put(r.id, { tableIds: [t.T5] });

      expect(res.status).toBe(200);
      expect(
        (await prisma.reservation.findUniqueOrThrow({ where: { id: r.id } }))
          .pinnedTableIds,
      ).toEqual([t.T5]);
      expect(await tableOf(r.id)).toEqual([t.T5]);
    });

    it("désépingler rend la réservation à l'algo", async () => {
      const t = await room();
      const r = await book("Martin", 2, { pinnedTableIds: [t.T5] });

      const res = await put(r.id, { tableIds: [] });

      expect(res.status).toBe(200);
      expect(
        (await prisma.reservation.findUniqueOrThrow({ where: { id: r.id } }))
          .pinnedTableIds,
      ).toEqual([]);
      expect(await tableOf(r.id)).not.toEqual([t.T5]); // placée au plus juste (table de 2)
    });

    it("autorise une table walk-in comme destination (décision du restaurateur)", async () => {
      const t = await room();
      const r = await book("Martin", 3);

      expect((await put(r.id, { tableIds: [t.T6] })).status).toBe(200);
      expect((await dinner()).summary.walkInOccupied).toEqual([t.T6]);
    });

    it("déplace sur une combinaison autorisée, refuse une combinaison non déclarée", async () => {
      const t = await room();
      await prisma.tableCombo.create({ data: { tableIds: [t.T3, t.T4] } });
      const r = await book("Groupe", 6);

      const refused = await put(r.id, { tableIds: [t.T1, t.T2] });
      expect(refused.status).toBe(400);
      expect((await refused.json()).error).toContain("pas autorisée");

      expect((await put(r.id, { tableIds: [t.T3, t.T4] })).status).toBe(200);
      expect(await tableOf(r.id)).toEqual([t.T3, t.T4]);
    });

    it("avertit si les tables sont trop petites, applique seulement avec force", async () => {
      const t = await room();
      const r = await book("Quatre", 4);

      const warned = await put(r.id, { tableIds: [t.T1] });
      expect(warned.status).toBe(409);
      const body = await warned.json();
      expect(body.canForce).toBe(true);
      expect(body.warnings[0]).toContain("4 couverts sur 2 places");
      expect(
        (await prisma.reservation.findUniqueOrThrow({ where: { id: r.id } }))
          .pinnedTableIds,
      ).toEqual([]);

      expect((await put(r.id, { tableIds: [t.T1], force: true })).status).toBe(
        200,
      );
      expect(
        (await prisma.reservation.findUniqueOrThrow({ where: { id: r.id } }))
          .pinnedTableIds,
      ).toEqual([t.T1]);
    });

    it("avertit quand le déplacement ferait perdre sa table à une autre réservation", async () => {
      const t = await room();
      // les deux seules tables de 4 du pool : T5 (en ligne) ; une résa de 4 l'occupe
      const quatre = await book("Quatre", 4);
      const petit = await book("Petit", 2);
      expect(await tableOf(quatre.id)).toEqual([t.T5]);

      const warned = await put(petit.id, { tableIds: [t.T5] });

      expect(warned.status).toBe(409);
      expect((await warned.json()).warnings.join(" ")).toContain("Quatre");
      // rien n'a changé tant qu'on n'a pas forcé
      expect(await tableOf(quatre.id)).toEqual([t.T5]);

      expect(
        (await put(petit.id, { tableIds: [t.T5], force: true })).status,
      ).toBe(200);
      expect((await dinner()).summary.unplaced).toContain(quatre.id);
    });

    it("une réservation annulée ne peut pas être déplacée ; id inconnu → 404", async () => {
      const t = await room();
      const r = await book("Annulée", 2, { status: "CANCELLED" });

      expect((await put(r.id, { tableIds: [t.T1] })).status).toBe(400);
      expect((await put("inconnue", { tableIds: [t.T1] })).status).toBe(404);
    });

    it("refuse une table inconnue", async () => {
      await room();
      const r = await book("Martin", 2);
      expect((await put(r.id, { tableIds: [999999] })).status).toBe(400);
    });

    it("deux déplacements simultanés sur la même table : le second est averti, sans corruption", async () => {
      const t = await room();
      const a = await book("A", 2);
      const b = await book("B", 2);

      const results = await Promise.all([
        put(a.id, { tableIds: [t.T5] }),
        put(b.id, { tableIds: [t.T5] }),
      ]);

      // sérialisés par le verrou : le premier passe, le second voit la table prise
      expect(results.map((r) => r.status).sort()).toEqual([200, 409]);
    });
  },
);
