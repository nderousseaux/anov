import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import {
  findInfeasibleServices,
  isServiceAvailable,
  loadDayPlanning,
  lockAndCheckAvailability,
  lockService,
  serviceRange,
} from "../db";

// Vraie base (anov_test) : voir vitest.integration.config.ts
const DATE = "2030-06-04";
const SERVICE = "dinner" as const;
const AT = new Date(`${DATE}T19:00:00.000Z`);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const inMinutes = (n: number) => new Date(Date.now() + n * 60_000);

async function addReservation(
  overrides: Partial<
    Parameters<typeof prisma.reservation.create>[0]["data"]
  > = {},
) {
  return prisma.reservation.create({
    data: {
      name: "Client",
      email: "client@example.com",
      date: AT,
      guests: 2,
      status: "PENDING_PAYMENT",
      transactionExpireAt: inMinutes(30),
      ...overrides,
    },
  });
}

/** Création telle que dans POST /api/reservations : verrou + test + create dans une transaction. */
async function reserve(size: number, { lock = true } = {}) {
  return prisma.$transaction(async (tx) => {
    const ok = lock
      ? await lockAndCheckAvailability(tx, {
          dateStr: DATE,
          service: SERVICE,
          size,
        })
      : await isServiceAvailable(tx, {
          dateStr: DATE,
          service: SERVICE,
          size,
        });
    if (!ok) return null;
    // Laisse les autres transactions lire avant qu'on écrive : sans verrou, elles voient toutes « libre »
    await sleep(80);
    return tx.reservation.create({
      data: {
        name: "Client",
        email: "client@example.com",
        date: AT,
        guests: size,
        status: "PENDING_PAYMENT",
        transactionExpireAt: inMinutes(30),
      },
    });
  });
}

const countReservations = () => prisma.reservation.count();

describe.skipIf(!process.env.DATABASE_URL_TEST)(
  "attribution par service (Postgres réel)",
  () => {
    beforeEach(async () => {
      await prisma.reservation.deleteMany();
      await prisma.tableCombo.deleteMany();
      await prisma.table.deleteMany();
    });

    afterAll(async () => {
      await prisma.reservation.deleteMany();
      await prisma.tableCombo.deleteMany();
      await prisma.table.deleteMany();
      await prisma.$disconnect();
    });

    it("deux créations simultanées sur la dernière place : une seule réussit", async () => {
      await prisma.table.create({ data: { name: "T1", capacity: 2 } });

      const results = await Promise.all([reserve(2), reserve(2)]);

      expect(results.filter(Boolean)).toHaveLength(1);
      expect(await countReservations()).toBe(1);
    });

    it("même chose avec beaucoup de requêtes concurrentes", async () => {
      await prisma.table.createMany({
        data: [
          { name: "T1", capacity: 2 },
          { name: "T2", capacity: 2 },
        ],
      });

      const results = await Promise.all(
        Array.from({ length: 6 }, () => reserve(2)),
      );

      expect(results.filter(Boolean)).toHaveLength(2); // 2 tables, 2 places
      expect(await countReservations()).toBe(2);
    });

    it("sans le verrou, la même course produit des doublons (le test a des dents)", async () => {
      await prisma.table.create({ data: { name: "T1", capacity: 2 } });

      const results = await Promise.all([
        reserve(2, { lock: false }),
        reserve(2, { lock: false }),
      ]);

      expect(results.filter(Boolean).length).toBeGreaterThan(1);
    });

    it("le verrou est par (date, service) : un autre service n'attend pas", async () => {
      await prisma.table.create({ data: { name: "T1", capacity: 2 } });
      await addReservation({ date: new Date(`${DATE}T12:00:00.000Z`) }); // midi complet

      expect(
        await isServiceAvailable(prisma, {
          dateStr: DATE,
          service: "lunch",
          size: 2,
        }),
      ).toBe(false);
      expect(
        await isServiceAvailable(prisma, {
          dateStr: DATE,
          service: "dinner",
          size: 2,
        }),
      ).toBe(true);
    });

    it("service complet → faux ; supprimer une réservation → vrai", async () => {
      await prisma.table.create({ data: { name: "T1", capacity: 2 } });
      const booking = await addReservation();

      const check = () =>
        isServiceAvailable(prisma, {
          dateStr: DATE,
          service: SERVICE,
          size: 2,
        });
      expect(await check()).toBe(false);

      await prisma.reservation.delete({ where: { id: booking.id } });
      expect(await check()).toBe(true);
    });

    it("un hold expiré ne compte pas, un hold valide et une résa confirmée oui", async () => {
      await prisma.table.createMany({
        data: [
          { name: "T1", capacity: 2 },
          { name: "T2", capacity: 2 },
        ],
      });
      await addReservation({ transactionExpireAt: inMinutes(-1) }); // expiré
      await addReservation({ status: "CONFIRMED", transactionExpireAt: null });

      const check = () =>
        isServiceAvailable(prisma, {
          dateStr: DATE,
          service: SERVICE,
          size: 2,
        });
      expect(await check()).toBe(true); // reste une table

      await addReservation({ transactionExpireAt: inMinutes(10) }); // hold valide
      expect(await check()).toBe(false);
    });

    it("les tables walk-in sont exclues du web mais utilisables par le restaurateur", async () => {
      await prisma.table.create({
        data: { name: "W1", capacity: 4, walkIn: true },
      });

      const check = (pool: "online" | "all") =>
        isServiceAvailable(prisma, {
          dateStr: DATE,
          service: SERVICE,
          size: 4,
          pool,
        });
      expect(await check("online")).toBe(false);
      expect(await check("all")).toBe(true);
    });

    it("une combinaison déclarée permet un groupe de 6, sa capacité modifiée le limite", async () => {
      const [a, b] = await Promise.all([
        prisma.table.create({ data: { name: "T1", capacity: 3 } }),
        prisma.table.create({ data: { name: "T2", capacity: 3 } }),
      ]);
      const check = (size: number) =>
        isServiceAvailable(prisma, { dateStr: DATE, service: SERVICE, size });

      expect(await check(6)).toBe(false); // pas de combinaison déclarée

      const combo = await prisma.tableCombo.create({
        data: { tableIds: [a.id, b.id] },
      });
      expect(await check(6)).toBe(true); // somme par défaut

      await prisma.tableCombo.update({
        where: { id: combo.id },
        data: { capacityOverride: 5 },
      });
      expect(await check(6)).toBe(false);
      expect(await check(5)).toBe(true);
    });

    it("respecte une réservation épinglée", async () => {
      const [t2, t4] = await Promise.all([
        prisma.table.create({ data: { name: "T1", capacity: 2 } }),
        prisma.table.create({ data: { name: "T2", capacity: 4 } }),
      ]);
      await addReservation({ guests: 2, pinnedTableIds: [t4.id] });

      const check = (size: number) =>
        isServiceAvailable(prisma, { dateStr: DATE, service: SERVICE, size });
      expect(await check(4)).toBe(false); // la table de 4 est épinglée
      expect(await check(2)).toBe(true); // la table de 2 reste libre
      expect(t2.id).toBeDefined();
    });

    it("lockService est réentrant dans une même transaction et couvre la plage du service", async () => {
      await prisma.$transaction(async (tx) => {
        await lockService(tx, DATE, SERVICE);
        await lockService(tx, DATE, SERVICE);
      });
      const { gte, lt } = serviceRange(DATE, SERVICE);
      expect(gte.toISOString()).toBe(`${DATE}T15:00:00.000Z`);
      expect(lt.toISOString()).toBe("2030-06-05T00:00:00.000Z");
    });

    it("findInfeasibleServices signale les services qui ne tiennent plus", async () => {
      const [t1, t2] = await Promise.all([
        prisma.table.create({ data: { name: "T1", capacity: 2 } }),
        prisma.table.create({ data: { name: "T2", capacity: 2 } }),
      ]);
      await addReservation();
      await addReservation();
      expect(await findInfeasibleServices(prisma)).toEqual([]);

      // T2 passe en walk-in : un des deux groupes n'a plus de table dans le pool en ligne
      await prisma.table.update({
        where: { id: t2.id },
        data: { walkIn: true },
      });
      const result = await findInfeasibleServices(prisma);
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({ dateStr: DATE, service: SERVICE });
      expect(result[0].unplaced).toHaveLength(1);

      // épinglée sur la table walk-in, la résa est placée : plus d'alerte
      const [first] = await prisma.reservation.findMany();
      await prisma.reservation.update({
        where: { id: first.id },
        data: { pinnedTableIds: [t2.id] },
      });
      expect(await findInfeasibleServices(prisma)).toEqual([]);
      expect(t1.id).toBeDefined();
    });

    it("findInfeasibleServices ignore le passé et les holds expirés", async () => {
      await prisma.table.create({ data: { name: "T1", capacity: 2 } });
      await addReservation();
      await addReservation({ transactionExpireAt: inMinutes(-1) }); // expiré
      await addReservation({
        date: new Date("2020-06-04T19:00:00.000Z"), // passé
        status: "CONFIRMED",
        transactionExpireAt: null,
      });

      expect(await findInfeasibleServices(prisma)).toEqual([]);
    });

    it("loadDayPlanning : réservations par service, tables attribuées et remplissage", async () => {
      const t1 = await prisma.table.create({
        data: { name: "T1", capacity: 2 },
      });
      await prisma.table.create({ data: { name: "T2", capacity: 2 } });
      const walk = await prisma.table.create({
        data: { name: "W1", capacity: 4, walkIn: true },
      });
      const lunch = new Date(`${DATE}T12:00:00.000Z`);
      const pinned = await addReservation({
        name: "Épinglée",
        guests: 3,
        status: "CONFIRMED",
        transactionExpireAt: null,
        pinnedTableIds: [walk.id],
      });
      await addReservation({
        name: "Midi",
        date: lunch,
        status: "CONFIRMED",
        transactionExpireAt: null,
      });
      await addReservation({
        name: "Dîner",
        status: "CONFIRMED",
        transactionExpireAt: null,
      });
      await addReservation({
        name: "Annulée",
        status: "CANCELLED",
        transactionExpireAt: null,
      });
      await addReservation({
        name: "Expirée",
        transactionExpireAt: inMinutes(-5),
      });
      await addReservation({
        name: "Autre jour",
        date: new Date("2030-06-05T19:00:00.000Z"),
        status: "CONFIRMED",
        transactionExpireAt: null,
      });

      const planning = await loadDayPlanning(prisma, DATE);

      expect(planning.tables.map((t) => t.name)).toEqual(["T1", "T2", "W1"]);
      const [lunchService, dinnerService] = planning.services;
      expect(lunchService.key).toBe("lunch");
      expect(lunchService.reservations.map((r) => r.name)).toEqual(["Midi"]);
      expect(lunchService.summary).toMatchObject({
        covers: 2,
        tablesTotal: 2,
        tablesFree: 1,
      });

      // dîner : l'annulée est listée mais ne compte pas ; l'expirée et l'autre jour sont absentes
      const names = dinnerService.reservations.map((r) => r.name).sort();
      expect(names).toEqual(["Annulée", "Dîner", "Épinglée"]);
      expect(dinnerService.summary).toMatchObject({
        covers: 5,
        tablesFree: 1,
        unplaced: [],
        walkInOccupied: [walk.id],
      });
      const byName = Object.fromEntries(
        dinnerService.reservations.map((r) => [r.name, r]),
      );
      expect(byName["Épinglée"].assignedTableIds).toEqual([walk.id]);
      expect(byName["Annulée"].assignedTableIds).toBeNull();
      expect(byName["Annulée"].counting).toBe(false);
      expect(byName["Dîner"].counting).toBe(true);
      expect(byName["Dîner"].assignedTableIds).toHaveLength(1);
      expect(pinned.id).toBe(byName["Épinglée"].id);
      expect(t1.id).toBeDefined();
    });
  },
);
