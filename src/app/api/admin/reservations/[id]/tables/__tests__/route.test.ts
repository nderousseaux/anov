// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { getAdminFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pinReservation } from "@/lib/seating/db";

vi.mock("@/lib/prisma", () => ({ prisma: { $transaction: vi.fn() } }));
vi.mock("@/lib/auth", () => ({ getAdminFromCookies: vi.fn() }));
vi.mock("@/lib/seating/db", () => ({ pinReservation: vi.fn() }));

const put = async (body: unknown) => {
  const { PUT } = await import("../route");
  return PUT(
    new NextRequest(
      new URL("http://localhost:3000/api/admin/reservations/r1/tables"),
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    ),
    { params: Promise.resolve({ id: "r1" }) },
  );
};

describe("PUT /api/admin/reservations/[id]/tables", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });
    vi.mocked(prisma.$transaction).mockImplementation(async (cb) => cb({}));
    vi.mocked(pinReservation).mockResolvedValue({
      kind: "ok",
      pinnedTableIds: [3],
      warnings: [],
    });
  });

  it("returns 401 if not authenticated", async () => {
    vi.mocked(getAdminFromCookies).mockResolvedValue(null);
    expect((await put({ tableIds: [3] })).status).toBe(401);
    expect(pinReservation).not.toHaveBeenCalled();
  });

  it.each([
    [{}, "tableIds absent"],
    [{ tableIds: "3" }, "pas un tableau"],
    [{ tableIds: [1, 2, 3] }, "plus de 2 tables"],
    [{ tableIds: ["a"] }, "ids non numériques"],
    [{ tableIds: [0] }, "id nul"],
    [{ tableIds: [3], force: "oui" }, "force invalide"],
  ])("rejects %j (%s)", async (body) => {
    expect((await put(body)).status).toBe(400);
    expect(pinReservation).not.toHaveBeenCalled();
  });

  it("pins and returns the new tables", async () => {
    const res = await put({ tableIds: [3] });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ pinnedTableIds: [3], warnings: [] });
    expect(pinReservation).toHaveBeenCalledWith({}, "r1", [3], false);
  });

  it("unpins with an empty list", async () => {
    await put({ tableIds: [] });
    expect(pinReservation).toHaveBeenCalledWith({}, "r1", [], false);
  });

  it("returns 409 with the warnings and canForce", async () => {
    vi.mocked(pinReservation).mockResolvedValue({
      kind: "warnings",
      warnings: [
        "4 couverts sur 2 places",
        "le service devient sur-réservé : Bob",
      ],
    });
    const res = await put({ tableIds: [1] });
    expect(res.status).toBe(409);
    expect(await res.json()).toMatchObject({
      canForce: true,
      warnings: [
        "4 couverts sur 2 places",
        "le service devient sur-réservé : Bob",
      ],
    });
  });

  it("passes force through", async () => {
    await put({ tableIds: [1], force: true });
    expect(pinReservation).toHaveBeenCalledWith({}, "r1", [1], true);
  });

  it("maps not found and invalid", async () => {
    vi.mocked(pinReservation).mockResolvedValueOnce({ kind: "not_found" });
    expect((await put({ tableIds: [1] })).status).toBe(404);
    vi.mocked(pinReservation).mockResolvedValueOnce({
      kind: "invalid",
      error: "Table introuvable",
    });
    const res = await put({ tableIds: [1] });
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe("Table introuvable");
  });
});
