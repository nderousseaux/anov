// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { getAdminFromCookies } from "@/lib/auth";
import { loadDayPlanning } from "@/lib/seating/db";

vi.mock("@/lib/prisma", () => ({ prisma: {} }));
vi.mock("@/lib/auth", () => ({ getAdminFromCookies: vi.fn() }));
vi.mock("@/lib/seating/db", () => ({ loadDayPlanning: vi.fn() }));

const get = async (query: string) => {
  const { GET } = await import("../route");
  return GET(
    new NextRequest(
      new URL(`http://localhost:3000/api/admin/planning${query}`),
    ),
  );
};

describe("GET /api/admin/planning", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getAdminFromCookies).mockResolvedValue({ id: 1 });
    vi.mocked(loadDayPlanning).mockResolvedValue({ tables: [], services: [] });
  });

  it("returns 401 if not authenticated", async () => {
    vi.mocked(getAdminFromCookies).mockResolvedValue(null);
    expect((await get("?date=2030-06-04")).status).toBe(401);
    expect(loadDayPlanning).not.toHaveBeenCalled();
  });

  it.each(["", "?date=", "?date=04-06-2030", "?date=2030-13-45", "?date=abc"])(
    "rejects an invalid date (%s)",
    async (query) => {
      const res = await get(query);
      expect(res.status).toBe(400);
      expect((await res.json()).error).toBe("date invalide");
    },
  );

  it("returns the planning of the day", async () => {
    const res = await get("?date=2030-06-04");

    expect(res.status).toBe(200);
    expect(loadDayPlanning).toHaveBeenCalledWith(
      expect.anything(),
      "2030-06-04",
    );
    expect(await res.json()).toEqual({ tables: [], services: [] });
  });
});
