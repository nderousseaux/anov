// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { getAdminFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { lockAndCheckAvailability } from "@/lib/seating/db";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    $transaction: vi.fn(),
    table: { findUnique: vi.fn() },
  },
}));
vi.mock("@/lib/auth", () => ({ getAdminFromCookies: vi.fn() }));
vi.mock("@/lib/seating/db", () => ({ lockAndCheckAvailability: vi.fn() }));
vi.mock("@/lib/stripe", () => ({ stripe: {} }));
vi.mock("@/lib/email", () => ({ sendCancellationEmail: vi.fn() }));

const body = {
  name: "Mme Martin",
  source: "PHONE",
  date: "2030-06-04",
  time: "19:30",
  guests: 4,
};

const post = async (overrides = {}) => {
  const { POST } = await import("../route");
  return POST(
    new NextRequest(new URL("http://localhost:3000/api/admin/reservations"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, ...overrides }),
    }),
  );
};

describe("POST /api/admin/reservations", () => {
  let create: vi.Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });
    vi.mocked(lockAndCheckAvailability).mockResolvedValue(true);
    create = vi.fn().mockResolvedValue({ id: "res_1" });
    vi.mocked(prisma.$transaction).mockImplementation(async (cb) =>
      cb({ reservation: { create } }),
    );
  });

  it("returns 401 if not authenticated", async () => {
    vi.mocked(getAdminFromCookies).mockResolvedValue(null);
    expect((await post()).status).toBe(401);
  });

  it("returns 400 on invalid input", async () => {
    const res = await post({ guests: 0 });
    expect(res.status).toBe(400);
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it("creates a confirmed phone reservation without payment", async () => {
    const res = await post({ phone: "+33 6 12 34 56 78", email: "" });

    expect(res.status).toBe(201);
    expect(await res.json()).toMatchObject({ forced: false });
    expect(lockAndCheckAvailability).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        dateStr: "2030-06-04",
        service: "dinner",
        size: 4,
      }),
    );
    const data = create.mock.calls[0][0].data;
    expect(data).toMatchObject({
      status: "CONFIRMED",
      source: "PHONE",
      email: null,
      phone: "+33 6 12 34 56 78",
      pinnedTableIds: [],
    });
    expect(data.depositPaidCents).toBeUndefined();
    expect(data.transactionExpireAt).toBeUndefined();
    expect(data.date.toISOString()).toBe("2030-06-04T19:30:00.000Z");
  });

  it("derives the lunch service from the time", async () => {
    await post({ time: "12:15" });
    expect(lockAndCheckAvailability).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ service: "lunch" }),
    );
  });

  it("returns 409 with canForce when the service is full", async () => {
    vi.mocked(lockAndCheckAvailability).mockResolvedValue(false);

    const res = await post();

    expect(res.status).toBe(409);
    expect(await res.json()).toMatchObject({ canForce: true });
    expect(create).not.toHaveBeenCalled();
  });

  it("adds the reservation anyway when forced, and says so", async () => {
    vi.mocked(lockAndCheckAvailability).mockResolvedValue(false);

    const res = await post({ force: true });

    expect(res.status).toBe(201);
    expect((await res.json()).forced).toBe(true);
    expect(create).toHaveBeenCalledTimes(1);
  });

  describe("table imposée (client de passage)", () => {
    const walkInTable = { id: 6, name: "T6", capacity: 4, walkIn: true };

    it("pins the reservation on the table and checks availability around it", async () => {
      vi.mocked(prisma.table.findUnique).mockResolvedValue(walkInTable);

      const res = await post({
        source: "WALK_IN",
        name: "",
        guests: 3,
        tableId: 6,
      });

      expect(res.status).toBe(201);
      expect(lockAndCheckAvailability).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ pinnedTableIds: [6] }),
      );
      expect(create.mock.calls[0][0].data).toMatchObject({
        name: "Passage",
        source: "WALK_IN",
        pinnedTableIds: [6],
      });
    });

    it("returns 404 for an unknown table", async () => {
      vi.mocked(prisma.table.findUnique).mockResolvedValue(null);
      expect((await post({ tableId: 99 })).status).toBe(404);
    });

    it("refuses more guests than seats unless forced", async () => {
      vi.mocked(prisma.table.findUnique).mockResolvedValue(walkInTable);

      const refused = await post({ guests: 6, tableId: 6 });
      expect(refused.status).toBe(409);
      expect((await refused.json()).error).toContain("4 place(s)");
      expect(create).not.toHaveBeenCalled();

      const forced = await post({ guests: 6, tableId: 6, force: true });
      expect(forced.status).toBe(201);
    });
  });
});
