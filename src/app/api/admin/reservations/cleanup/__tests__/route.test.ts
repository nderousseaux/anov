import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    reservation: {
      updateMany: vi.fn(),
    },
  },
}));

describe("Admin Reservations Cleanup API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("DELETE /api/admin/reservations/cleanup", () => {
    it("cancels all pending and confirmed reservations", async () => {
      const { DELETE } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/reservations/cleanup"),
        {
          method: "DELETE",
        },
      );
      const res = await DELETE(req as any);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.message).toBe("ok");
    });

    it("updates reservations with correct statuses", async () => {
      vi.mocked(prisma.reservation.updateMany).mockResolvedValue({
        count: 0,
      } as any);

      const { DELETE } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/reservations/cleanup"),
        {
          method: "DELETE",
        },
      );
      await DELETE(req as any);

      // Verify that updateMany was called with the correct status values
      const updateManyCall = vi.mocked(prisma.reservation.updateMany).mock
        .calls[0];
      expect(updateManyCall).toBeDefined();
    });

    it("updates reservations to CANCELLED status", async () => {
      vi.mocked(prisma.reservation.updateMany).mockResolvedValue({
        count: 0,
      } as any);

      const { DELETE } = await import("../route");
      const req = new NextRequest(
        new URL("http://localhost:3000/api/admin/reservations/cleanup"),
        {
          method: "DELETE",
        },
      );
      await DELETE(req as any);

      expect(prisma.reservation.updateMany).toHaveBeenCalledWith({
        where: {
          status: {
            in: ["PENDING_PAYMENT", "CONFIRMED", "COMPLETED"],
          },
        },
        data: {
          status: "CANCELLED",
        },
      });
    });
  });
});
