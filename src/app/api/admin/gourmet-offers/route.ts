import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromCookies } from "@/lib/auth";
import { sendGourmetOfferEmail } from "@/lib/email";

export async function GET(req: NextRequest) {
  const admin = await getAdminFromCookies();
  if (!admin)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const status = searchParams.get("status");
  const code = searchParams.get("code");
  const email = searchParams.get("email");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const perPage = 25;

  const now = new Date();
  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (code) where.code = { contains: code, mode: "insensitive" };
  if (email) where.recipientEmail = { contains: email, mode: "insensitive" };

  // Exclure les offres avec transaction expirée (10 min) - mais garder IN_PROGRESS_PAYMENT en base
  const andFilters = [];
  if (status) andFilters.push({ status });
  andFilters.push({
    OR: [
      { status: { not: "IN_PROGRESS_PAYMENT" } },
      { transactionExpireAt: { gt: now } },
      { transactionExpireAt: null },
    ],
  });
  where.AND = andFilters;

  const [total, gourmetOffers] = await Promise.all([
    prisma.gourmetOffer.count({ where }),
    prisma.gourmetOffer.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
  ]);

  return NextResponse.json({
    data: gourmetOffers,
    total,
    page,
    pageSize: perPage,
  });
}

export async function POST(req: NextRequest) {
  const admin = await getAdminFromCookies();
  if (!admin)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const { offerName, price, recipientEmail, personalMessage } = body;

  // Validation
  if (!offerName || !offerName.trim()) {
    return NextResponse.json(
      { error: "Le nom de l'offre est requis" },
      { status: 400 },
    );
  }

  const priceValue = parseFloat(price);
  if (isNaN(priceValue) || priceValue <= 0) {
    return NextResponse.json({ error: "Prix invalide" }, { status: 400 });
  }

  // recipientEmail est optionnel pour les créations admin
  let emailValue: string | null = null;
  if (recipientEmail && recipientEmail.trim() !== "") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }
    emailValue = recipientEmail;
  }

  // Générer un code unique pour l'offre gourmande (format manuel/admin)
  const code = generateAdminGourmetOfferCode();

  // Calculer la date d'expiration (12 mois)
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + 12);

  // Créer l'offre gourmande dans la base de données (statut ACTIVE par défaut pour admin)
  // isPaid = false pour les créations admin (gratuites)
  const gourmetOffer = await prisma.gourmetOffer.create({
    data: {
      code,
      offerName: offerName.trim(),
      price: priceValue,
      recipientEmail: emailValue,
      personalMessage: personalMessage || null,
      isPaid: false, // Création admin = toujours gratuit
      expiresAt,
      status: "ACTIVE",
    },
    select: {
      id: true,
      code: true,
      offerName: true,
      price: true,
      recipientEmail: true,
      personalMessage: true,
      isPaid: true,
      status: true,
      createdAt: true,
      expiresAt: true,
      usedAt: true,
    },
  });

  // Envoyer l'email au destinataire si un email a été fourni (sans le prix)
  if (emailValue) {
    try {
      await sendGourmetOfferEmail({
        to: emailValue,
        code: gourmetOffer.code,
        offerName: gourmetOffer.offerName,
        personalMessage: gourmetOffer.personalMessage || undefined,
        expiresAt: gourmetOffer.expiresAt
          ? gourmetOffer.expiresAt.toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : "",
      });
      // Email sent (for monitoring)
    } catch (error) {
      // Log email error (for monitoring)
    }
  }

  return NextResponse.json(gourmetOffer, { status: 201 });
}

/**
 * Génère un code unique pour l'offre gourmande
 * Format : ANOV-OGM-XXXX-XXXX (manuel/admin)
 */
function generateAdminGourmetOfferCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Sans O, 0, I, 1 pour éviter la confusion
  const part1 = Array.from(
    { length: 4 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join("");
  const part2 = Array.from(
    { length: 4 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join("");
  return `ANOV-OGM-${part1}-${part2}`;
}

export async function PATCH(req: NextRequest) {
  const admin = await getAdminFromCookies();
  if (!admin)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const { id, action } = body;

  if (!id || !action) {
    return NextResponse.json({ error: "ID et action requis" }, { status: 400 });
  }

  if (action === "validate") {
    // Valider l'offre gourmande (PENDING_PAYMENT → ACTIVE ou ACTIVE → USED)
    // Si l'offre est déjà utilisée (USED), on la remet en active (non utilisée)
    const gourmetOffer = await prisma.gourmetOffer.update({
      where: { id },
      data: {
        status: "ACTIVE",
        usedAt: null, // Si l'offre était USED, on la met à null pour la marquer comme "non utilisée"
      },
      select: { id: true, code: true, status: true, usedAt: true },
    });
    return NextResponse.json({ success: true, gourmetOffer });
  } else if (action === "markUsed") {
    // Marquer l'offre comme utilisée (ACTIVE → USED)
    const gourmetOffer = await prisma.gourmetOffer.update({
      where: { id },
      data: {
        status: "USED",
        usedAt: new Date(),
      },
      select: { id: true, code: true, status: true, usedAt: true },
    });
    return NextResponse.json({ success: true, gourmetOffer });
  } else if (action === "delete") {
    // Supprimer l'offre gourmande
    await prisma.gourmetOffer.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ error: "Action invalide" }, { status: 400 });
  }
}
