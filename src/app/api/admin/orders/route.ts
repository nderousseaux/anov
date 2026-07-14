import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromCookies } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const admin = await getAdminFromCookies();
  if (!admin)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const perPage = 25;

  const where: any = {};

  // Filter by status
  if (status) {
    where.status = status;
  }

  // Search filter (code, email, name)
  if (search) {
    where.OR = [
      { code: { contains: search, mode: "insensitive" } },
      { customerEmail: { contains: search, mode: "insensitive" } },
      { customerName: { contains: search, mode: "insensitive" } },
    ];
  }

  const [total, orders] = await Promise.all([
    prisma.productOrder.count({ where }),
    prisma.productOrder.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
  ]);

  // Filter out PENDING_PAYMENT orders where transaction has expired
  // Orders with transactionExpireAt in the past should be hidden from admin list
  const now = new Date();
  const filteredOrders = orders
    .filter((order) => {
      // Keep only valid status types (hide PROCESSING, EXPIRED, etc.)
      const validStatuses = [
        "PENDING_PAYMENT",
        "CONFIRMED",
        "READY",
        "SHIPPED",
        "COMPLETED",
        "CANCELLED",
      ];
      if (!validStatuses.includes(order.status)) return false;

      // Keep non-PENDING_PAYMENT orders
      if (order.status !== "PENDING_PAYMENT") return true;
      // Keep PENDING_PAYMENT orders that have not expired
      if (!order.transactionExpireAt) return true;
      return new Date(order.transactionExpireAt) > now;
    })
    .map((order: any) => ({
      id: order.id,
      code: order.code,
      productTitle: order.productName,
      quantity: order.quantity,
      totalPrice: order.totalPrice,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      deliveryMethod: order.deliveryMethod,
      status: order.status,
      createdAt: order.createdAt,
    }));

  // Adjust total to reflect filtered count (only for PENDING_PAYMENT status filter)
  const filteredTotal =
    status === "PENDING_PAYMENT" ? filteredOrders.length : total;

  return NextResponse.json({
    data: filteredOrders,
    total: filteredTotal,
    page,
    pageSize: perPage,
  });
}
