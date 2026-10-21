import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { loadDayPlanning } from "@/lib/seating/db";

// Vraie base (anov_test) : voir vitest.integration.config.ts
vi.mock("@/lib/auth", () => ({
  getAdminFromCookies: vi.fn().mockResolvedValue({ id: 1 }),
}));
vi.mock("@/lib/stripe", () => ({ stripe: {} }));
vi.mock("@/lib/email", () => ({ sendCancellationEmail: vi.fn() }));

const DATE = "2030-06-04";

const post = async (body: Record<string, unknown>) => {
  const { POST } = await import("../route");
  return POST(
    new NextRequest(new URL("http://localhost:3000/api/admin/reservations"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Client",
        source: "PHONE",
        date: DATE,
        time: "19:30",
        guests: 2,
        ...body,
      }),
    }),
  );
};

describe.skipIf(!process.env.DATABASE_URL_TEST)(
  "ajout manuel de réservations (Postgres réel)",
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

    it("ajoute une réservation téléphone, confirmée et sans acompte, tant qu'il reste de la place", async () => {
      await prisma.table.create({ data: { name: "T1", capacity: 2 } });

      const res = await post({ phone: "+33 6 12 34 56 78" });

      expect(res.status).toBe(201);
      const saved = await prisma.reservation.findFirstOrThrow();
      expect(saved).toMatchObject({
        status: "CONFIRMED",
        source: "PHONE",
        email: null,
        depositPaidCents: null,
        transactionExpireAt: null,
        pinnedTableIds: [],
      });
    });

    it("répond complet (409) puis ajoute quand on force ; le planning signale la résa sans table", async () => {
      await prisma.table.create({ data: { name: "T1", capacity: 2 } });
      expect((await post({})).status).toBe(201);

      const full = await post({ name: "Deuxième" });
      expect(full.status).toBe(409);
      expect(await full.json()).toMatchObject({ canForce: true });
      expect(await prisma.reservation.count()).toBe(1);

      const forced = await post({ name: "Deuxième", force: true });
      expect(forced.status).toBe(201);
      expect((await forced.json()).forced).toBe(true);
      expect(await prisma.reservation.count()).toBe(2);

      const dinner = (await loadDayPlanning(prisma, DATE)).services[1];
      expect(dinner.summary.unplaced).toHaveLength(1);
    });

    it("deux ajouts simultanés sur la dernière place : un seul passe, l'autre reçoit 409", async () => {
      await prisma.table.create({ data: { name: "T1", capacity: 2 } });

      const results = await Promise.all([
        post({ name: "A" }),
        post({ name: "B" }),
      ]);

      expect(results.map((r) => r.status).sort()).toEqual([201, 409]);
      expect(await prisma.reservation.count()).toBe(1);
    });

    it("la réservation téléphone n'utilise pas les tables walk-in", async () => {
      await prisma.table.create({
        data: { name: "W1", capacity: 4, walkIn: true },
      });
      expect((await post({ guests: 2 })).status).toBe(409);
    });

    it("un client de passage s'ajoute sur une table walk-in libre, puis la table est occupée", async () => {
      const walk = await prisma.table.create({
        data: { name: "W1", capacity: 4, walkIn: true },
      });

      const first = await post({
        source: "WALK_IN",
        name: "",
        guests: 3,
        tableId: walk.id,
        time: "19:45",
      });
      expect(first.status).toBe(201);
      expect(await prisma.reservation.findFirstOrThrow()).toMatchObject({
        name: "Passage",
        source: "WALK_IN",
        pinnedTableIds: [walk.id],
      });

      const second = await post({
        source: "WALK_IN",
        guests: 2,
        tableId: walk.id,
      });
      expect(second.status).toBe(409);

      const dinner = (await loadDayPlanning(prisma, DATE)).services[1];
      expect(dinner.summary.walkInOccupied).toEqual([walk.id]);
      expect(dinner.summary.unplaced).toEqual([]);
    });

    it("un service sur-réservé (forcé) n'empêche pas d'asseoir un client de passage sur une table walk-in libre", async () => {
      await prisma.table.create({ data: { name: "T1", capacity: 2 } });
      const walk = await prisma.table.create({
        data: { name: "W1", capacity: 4, walkIn: true },
      });
      expect((await post({ guests: 8, force: true })).status).toBe(201); // ne tient nulle part

      const res = await post({
        source: "WALK_IN",
        guests: 2,
        tableId: walk.id,
      });

      expect(res.status).toBe(201);
      // une réservation ordinaire reste refusée tant que le service est sur-réservé
      expect((await post({ guests: 2 })).status).toBe(409);
    });

    it("refuse plus de couverts que de places sur la table imposée, sauf si on force", async () => {
      const walk = await prisma.table.create({
        data: { name: "W1", capacity: 2, walkIn: true },
      });

      const refused = await post({
        source: "WALK_IN",
        guests: 4,
        tableId: walk.id,
      });
      expect(refused.status).toBe(409);

      const forced = await post({
        source: "WALK_IN",
        guests: 4,
        tableId: walk.id,
        force: true,
      });
      expect(forced.status).toBe(201);
    });

    it("le service du midi et celui du soir sont indépendants", async () => {
      await prisma.table.create({ data: { name: "T1", capacity: 2 } });
      expect((await post({ time: "12:00" })).status).toBe(201);
      expect((await post({ time: "19:30" })).status).toBe(201);
      expect((await post({ time: "12:30" })).status).toBe(409);
    });
  },
);
