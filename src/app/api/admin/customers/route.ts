import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromCookies } from "@/lib/auth";

interface CustomerSummary {
  email: string;
  name: string | null;
  reservationCount: number;
  giftCardCount: number;
  gourmetOfferCount: number;
  contactCount: number;
  productOrderCount: number;
  lastEventAt: string;
  hasNote: boolean;
}

export async function GET(req: NextRequest) {
  const admin = await getAdminFromCookies();
  if (!admin)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const search = searchParams.get("search")?.trim().toLowerCase() ?? "";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const perPage = 25;

  const [reservations, giftCards, gourmetOffers, contactMessages, productOrders, notes] =
    await Promise.all([
      prisma.reservation.findMany({
        select: { email: true, name: true, date: true, createdAt: true },
      }),
      prisma.giftCard.findMany({
        where: { recipientEmail: { not: null } },
        select: { recipientEmail: true, name: true, createdAt: true },
      }),
      prisma.gourmetOffer.findMany({
        where: { recipientEmail: { not: null } },
        select: { recipientEmail: true, name: true, createdAt: true },
      }),
      prisma.contactMessage.findMany({
        select: { email: true, name: true, createdAt: true },
      }),
      prisma.productOrder.findMany({
        select: { customerEmail: true, customerName: true, createdAt: true },
      }),
      prisma.customerNote.findMany({ select: { email: true } }),
    ]);

  const notesByEmail = new Set(notes.map((n) => n.email.toLowerCase()));
  const customers = new Map<string, CustomerSummary>();
  // Suit le nom le plus récemment renseigné pour chaque email, tous formulaires confondus
  const latestNameByEmail = new Map<string, { name: string; createdAt: Date }>();

  const getOrCreate = (rawEmail: string): CustomerSummary => {
    const key = rawEmail.toLowerCase();
    let entry = customers.get(key);
    if (!entry) {
      entry = {
        email: rawEmail,
        name: null,
        reservationCount: 0,
        giftCardCount: 0,
        gourmetOfferCount: 0,
        contactCount: 0,
        productOrderCount: 0,
        lastEventAt: new Date(0).toISOString(),
        hasNote: notesByEmail.has(key),
      };
      customers.set(key, entry);
    }
    return entry;
  };

  const bumpLastEventAt = (entry: CustomerSummary, date: Date | null) => {
    if (!date) return;
    if (new Date(entry.lastEventAt).getTime() < date.getTime()) {
      entry.lastEventAt = date.toISOString();
    }
  };

  const registerName = (
    rawEmail: string,
    name: string | null | undefined,
    createdAt: Date,
  ) => {
    const trimmed = name?.trim();
    if (!trimmed) return;
    const key = rawEmail.toLowerCase();
    const current = latestNameByEmail.get(key);
    if (!current || createdAt.getTime() >= current.createdAt.getTime()) {
      latestNameByEmail.set(key, { name: trimmed, createdAt });
    }
  };

  for (const r of reservations) {
    const entry = getOrCreate(r.email);
    entry.reservationCount += 1;
    bumpLastEventAt(entry, r.date);
    registerName(r.email, r.name, r.createdAt);
  }

  for (const g of giftCards) {
    if (!g.recipientEmail) continue;
    const entry = getOrCreate(g.recipientEmail);
    entry.giftCardCount += 1;
    bumpLastEventAt(entry, g.createdAt);
    registerName(g.recipientEmail, g.name, g.createdAt);
  }

  for (const o of gourmetOffers) {
    if (!o.recipientEmail) continue;
    const entry = getOrCreate(o.recipientEmail);
    entry.gourmetOfferCount += 1;
    bumpLastEventAt(entry, o.createdAt);
    registerName(o.recipientEmail, o.name, o.createdAt);
  }

  for (const c of contactMessages) {
    const entry = getOrCreate(c.email);
    entry.contactCount += 1;
    bumpLastEventAt(entry, c.createdAt);
    registerName(c.email, c.name, c.createdAt);
  }

  for (const p of productOrders) {
    const entry = getOrCreate(p.customerEmail);
    entry.productOrderCount += 1;
    bumpLastEventAt(entry, p.createdAt);
    registerName(p.customerEmail, p.customerName, p.createdAt);
  }

  for (const [key, entry] of customers) {
    entry.name = latestNameByEmail.get(key)?.name ?? null;
  }

  let all = Array.from(customers.values());

  if (search) {
    all = all.filter(
      (c) =>
        c.email.toLowerCase().includes(search) ||
        (c.name?.toLowerCase().includes(search) ?? false),
    );
  }

  all.sort(
    (a, b) =>
      new Date(b.lastEventAt).getTime() - new Date(a.lastEventAt).getTime(),
  );

  const total = all.length;
  const start = (page - 1) * perPage;
  const data = all.slice(start, start + perPage);

  return NextResponse.json({ data, total, page, pageSize: perPage });
}
