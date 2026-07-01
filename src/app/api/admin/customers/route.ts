import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromCookies } from '@/lib/auth';

interface CustomerSummary {
  email: string;
  reservationCount: number;
  giftCardCount: number;
  contactCount: number;
  lastEventAt: string;
  hasNote: boolean;
}

export async function GET(req: NextRequest) {
  const admin = await getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const search = searchParams.get('search')?.trim().toLowerCase() ?? '';
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const perPage = 25;

  const [reservationGroups, giftCardGroups, contactGroups, notes] = await Promise.all([
    prisma.reservation.groupBy({
      by: ['email'],
      _count: { _all: true },
      _max: { date: true },
    }),
    prisma.giftCard.groupBy({
      by: ['recipientEmail'],
      where: { recipientEmail: { not: null } },
      _count: { _all: true },
      _max: { createdAt: true },
    }),
    prisma.contactMessage.groupBy({
      by: ['email'],
      _count: { _all: true },
      _max: { createdAt: true },
    }),
    prisma.customerNote.findMany({ select: { email: true } }),
  ]);

  const notesByEmail = new Set(notes.map((n) => n.email.toLowerCase()));
  const customers = new Map<string, CustomerSummary>();

  const getOrCreate = (rawEmail: string): CustomerSummary => {
    const key = rawEmail.toLowerCase();
    let entry = customers.get(key);
    if (!entry) {
      entry = {
        email: rawEmail,
        reservationCount: 0,
        giftCardCount: 0,
        contactCount: 0,
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

  for (const group of reservationGroups) {
    const entry = getOrCreate(group.email);
    entry.reservationCount = group._count._all;
    bumpLastEventAt(entry, group._max.date);
  }

  for (const group of giftCardGroups) {
    if (!group.recipientEmail) continue;
    const entry = getOrCreate(group.recipientEmail);
    entry.giftCardCount = group._count._all;
    bumpLastEventAt(entry, group._max.createdAt);
  }

  for (const group of contactGroups) {
    const entry = getOrCreate(group.email);
    entry.contactCount = group._count._all;
    bumpLastEventAt(entry, group._max.createdAt);
  }

  let all = Array.from(customers.values());

  if (search) {
    all = all.filter((c) => c.email.toLowerCase().includes(search));
  }

  all.sort((a, b) => new Date(b.lastEventAt).getTime() - new Date(a.lastEventAt).getTime());

  const total = all.length;
  const start = (page - 1) * perPage;
  const data = all.slice(start, start + perPage);

  return NextResponse.json({ data, total, page, pageSize: perPage });
}
