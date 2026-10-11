import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const dateStr = url.searchParams.get("date");
    const locale = url.searchParams.get("locale") ?? "fr";

    if (!dateStr) {
      return NextResponse.json({ error: "Date requise" }, { status: 400 });
    }

    const date = new Date(dateStr + "T00:00:00.000Z");
    if (isNaN(date.getTime())) {
      return NextResponse.json({ error: "Date invalide" }, { status: 400 });
    }

    const events = await prisma.event.findMany({
      where: {
        isActive: true,
        startDate: { lte: date },
        endDate: { gte: date },
      },
      orderBy: { startDate: "asc" },
      select: {
        id: true,
        titleFr: true,
        titleEn: true,
        titleDe: true,
        descriptionFr: true,
        descriptionEn: true,
        descriptionDe: true,
        startDate: true,
        endDate: true,
        startService: true,
        endService: true,
      },
    });

    if (events.length === 0) {
      return NextResponse.json({ events: [] });
    }

    // Return localized events
    const localizedEvents = events.map((e) => {
      const localeKey = locale === "en" ? "En" : locale === "de" ? "De" : "Fr";
      return {
        id: e.id,
        title: e[`title${localeKey}` as keyof typeof e],
        description: e[`description${localeKey}` as keyof typeof e],
        startDate: e.startDate.toISOString(),
        endDate: e.endDate.toISOString(),
        startService: e.startService,
        endService: e.endService,
      };
    });

    return NextResponse.json({ events: localizedEvents });
  } catch (err) {
    console.error("[GET /api/events]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}