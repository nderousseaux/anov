import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

/**
 * Convertit une URL relative en URL absolue et nettoie les query params
 * (Stripe requiert des URLs simples pour les images de produit)
 */
function getAbsoluteImageUrl(imageUrl?: string): string {
  const fallback = "/assets/boutique/macarons.png";
  const resolvedUrl = imageUrl || fallback;

  if (resolvedUrl.startsWith("http://") || resolvedUrl.startsWith("https://")) {
    try {
      const urlObj = new URL(resolvedUrl);
      return urlObj.origin + urlObj.pathname;
    } catch {
      return getAbsoluteImageUrl(fallback);
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://anov.fr";
  const cleanBaseUrl = baseUrl.replace(/\/$/, "");
  const cleanImageUrl = resolvedUrl.startsWith("/")
    ? resolvedUrl
    : `/${resolvedUrl}`;

  return `${cleanBaseUrl}${cleanImageUrl}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      offerName,
      offerDescription,
      offerImage,
      price,
      recipientEmail,
      personalMessage,
    } = body;

    // Validation
    if (!offerName || !price) {
      return NextResponse.json(
        { error: "Nom et prix de l'offre requis" },
        { status: 400 },
      );
    }

    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      return NextResponse.json({ error: "Prix invalide" }, { status: 400 });
    }

    if (!recipientEmail) {
      return NextResponse.json(
        { error: "Email du destinataire requis" },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    // Générer un code unique pour l'offre gourmande
    const code = generateGourmetOfferCode();

    // Calculer la date d'expiration (12 mois)
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 12);

    // Calculer l'expiration de la transaction (10 minutes pour le paiement)
    const transactionExpireAt = new Date();
    transactionExpireAt.setMinutes(transactionExpireAt.getMinutes() + 10);

    // Créer l'offre gourmande dans la base de données (statut PENDING)
    const gourmetOffer = await prisma.gourmetOffer.create({
      data: {
        code,
        offerName,
        offerDescription: offerDescription || null,
        offerImage: offerImage || null,
        price: priceValue,
        recipientEmail,
        personalMessage: personalMessage || null,
        isPaid: true,
        expiresAt,
        transactionExpireAt,
        status: "IN_PROGRESS_PAYMENT",
      },
    });

    // Créer une session de paiement Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: offerName,
              description: "Offre Gourmande ANØV",
              images: [getAbsoluteImageUrl(offerImage)],
            },
            unit_amount: Math.round(priceValue * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/boutique/succes?type=gourmet-offer&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/boutique`,
      metadata: {
        type: "gourmet_offer",
        gourmetOfferId: gourmetOffer.id,
      },
    });

    // Mettre à jour l'offre gourmande avec l'ID de session Stripe
    await prisma.gourmetOffer.update({
      where: { id: gourmetOffer.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("[gourmet-offers/checkout] Erreur:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la session de paiement" },
      { status: 500 },
    );
  }
}

/**
 * Génère un code unique pour l'offre gourmande
 * Format : ANOV-OG-XXXX-XXXX (offre gourmande/client Stripe)
 */
function generateGourmetOfferCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Sans O, 0, I, 1 pour éviter la confusion
  const part1 = Array.from(
    { length: 4 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join("");
  const part2 = Array.from(
    { length: 4 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join("");
  return `ANOV-OG-${part1}-${part2}`;
}
