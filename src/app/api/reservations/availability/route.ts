import { NextRequest, NextResponse } from 'next/server';
import { getSlotsWithAvailability, getUnavailableDatesForMonth } from '@/lib/availability';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const month = searchParams.get('month');
  if (month) {
    if (!/^\d{4}-\d{2}$/.test(month)) {
      return NextResponse.json({ error: 'month invalide' }, { status: 400 });
    }
    const unavailableDates = await getUnavailableDatesForMonth(month);
    return NextResponse.json({ unavailableDates });
  }

  const date = searchParams.get('date');
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'date invalide' }, { status: 400 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (new Date(date) < today) {
    return NextResponse.json({ slots: [] });
  }

  const slots = await getSlotsWithAvailability(date);
  return NextResponse.json({ slots });
}
