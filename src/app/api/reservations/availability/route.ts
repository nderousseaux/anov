import { NextRequest, NextResponse } from 'next/server';
import { getAvailableSlots } from '@/lib/availability';

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date');
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'date invalide' }, { status: 400 });
  }

  // Refuse les dates dans le passé
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (new Date(date) < today) {
    return NextResponse.json({ slots: [] });
  }

  const slots = await getAvailableSlots(date);
  return NextResponse.json({ slots });
}
