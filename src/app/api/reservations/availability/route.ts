import { NextRequest, NextResponse } from "next/server";
import {
  getMonthServiceAvailability,
  getServicesAvailability,
  servicesToSlots,
  unavailableDates,
} from "@/lib/availability";
import { MAX_GROUP_SIZE } from "@/lib/seating";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const guestsParam = searchParams.get("guests");
  const guests = parseInt(guestsParam ?? "", 10);
  if (!guestsParam || isNaN(guests) || guests < 1 || guests > MAX_GROUP_SIZE) {
    return NextResponse.json(
      { error: `guests invalide (1 à ${MAX_GROUP_SIZE})` },
      { status: 400 },
    );
  }

  const month = searchParams.get("month");
  if (month) {
    if (!/^\d{4}-\d{2}$/.test(month)) {
      return NextResponse.json({ error: "month invalide" }, { status: 400 });
    }
    const availableServices = await getMonthServiceAvailability(month, guests);
    return NextResponse.json({
      unavailableDates: unavailableDates(availableServices),
      availableServices,
    });
  }

  const date = searchParams.get("date");
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "date invalide" }, { status: 400 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (new Date(date) < today) {
    return NextResponse.json({ slots: [], services: [] });
  }

  const services = await getServicesAvailability(date, guests);
  return NextResponse.json({ slots: servicesToSlots(services), services });
}
