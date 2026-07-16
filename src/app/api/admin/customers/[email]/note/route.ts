import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromCookies } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ email: string }> },
) {
  const admin = await getAdminFromCookies();
  if (!admin)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { email: rawEmail } = await params;
  const email = decodeURIComponent(rawEmail).toLowerCase();

  const { content } = await req.json();
  if (typeof content !== "string") {
    return NextResponse.json({ error: "Contenu invalide" }, { status: 400 });
  }

  const note = await prisma.customerNote.upsert({
    where: { email },
    update: { content },
    create: { email, content },
  });

  return NextResponse.json(note);
}
