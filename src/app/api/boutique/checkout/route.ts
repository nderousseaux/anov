import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

/**
 * Convertit une URL relative en URL absolue
 * Nettoie les URLs pour Stripe (pas de query params)
 * @param imageUrl - L'URL de l'image (relative ou absolue)
 * @returns L'URL absolue de l'image
 */
function getAbsoluteImageUrl(imageUrl?: string): string {
  if (!imageUrl) return '/assets/boutique/macarons.png';

  // Si l'URL commence par http:// ou https://
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    try {
      // Essayer de parsing l'URL
      const urlObj = new URL(imageUrl);
      // Retourner l'URL sans query params (Stripe préfère les URLs simples)
      return urlObj.origin + urlObj.pathname;
    } catch {
      // Si l'URL n'est pas valide, utiliser l'image par défaut
      return '/assets/boutique/macarons.png';
    }
  }

  // Si c'est une URL relative, on la convertit en URL absolue
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://anov.fr';
  // Retirer le slash final de la base URL si présent
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');
  // Ajouter le slash initial à l'image URL si absent
  const cleanImageUrl = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;

  return `${cleanBaseUrl}${cleanImageUrl}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productName, productId, quantity, deliveryMethod, address, customerName, customerEmail, customerPhone, totalPrice: bodyTotalPrice, productImage } = body;
    const totalPrice = bodyTotalPrice || (body.price as number || 0) * quantity;

    // Validation
    if (!productName && !productId) {
      return NextResponse.json(
        { error: 'Nom du produit ou ID de produit requis' },
        { status: 400 }
      );
    }

    if (!quantity || !deliveryMethod) {
      return NextResponse.json(
        { error: 'Quantité et méthode de livraison requises' },
        { status: 400 }
      );
    }

    if (quantity < 1) {
      return NextResponse.json(
        { error: 'La quantité doit être d\'au moins 1' },
        { status: 400 }
      );
    }

    // Calculer le prix total (à partir du frontend ou d'une source de prix)
    // Pour ce MVP, on suppose que le prix est passé dans le body
    const totalPriceValue = body.totalPrice || (body.price as number || 0) * quantity;
    if (!totalPriceValue) {
      return NextResponse.json(
        { error: 'Le prix total est requis' },
        { status: 400 }
      );
    }

    // Générer un code unique pour la commande
    const code = generateOrderCode();

    // Créer la commande dans la base de données
    const now = new Date();
    const transactionExpireAt = new Date(now.getTime() + 15 * 60000); // +15 minutes

    const orderData: {
      code: string;
      productName: string;
      quantity: number;
      totalPrice: number;
      deliveryMethod: 'PICKUP' | 'DELIVERY';
      customerName: string;
      customerEmail: string;
      customerPhone: string;
      customerAddress?: { create: any };
      status: 'PENDING_PAYMENT';
    } = {
      code,
      productName: productName || `Produit #${productId}`,
      quantity,
      totalPrice: totalPriceValue,
      deliveryMethod,
      customerName: body.customerName || '',
      customerEmail: body.customerEmail || '',
      customerPhone: body.customerPhone || '',
      status: 'PENDING_PAYMENT',
      transactionExpireAt,
    };

    if (address && (deliveryMethod === 'DELIVERY' || deliveryMethod === 'PICKUP')) {
      orderData.customerAddress = {
        create: {
          firstName: address.firstName || '',
          lastName: address.lastName || '',
          address: address.address || '',
          city: address.city || '',
          zipCode: address.zipCode || '',
          country: address.country || 'France',
          phone: address.phone || '',
        },
      };
    }

    const order = await prisma.productOrder.create({
      data: orderData,
    });

    // Créer une session de paiement Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: productName,
              description: `Quantité: ${quantity}`,
              images: [getAbsoluteImageUrl(productImage)],
            },
            unit_amount: Math.round(totalPrice * 100), // Montant en centimes
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: customerEmail,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/boutique/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/boutique`,
      metadata: {
        type: 'product_order',
        orderId: order.id,
        quantity: quantity.toString(),
      },
    });

    // Mettre à jour la commande avec l'ID de session Stripe
    await prisma.productOrder.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url, customerEmail, customerName, customerPhone });
  } catch (error) {
    console.error('[boutique/checkout] Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la session de paiement' },
      { status: 500 }
    );
  }
}

/**
 * Génère un code unique pour la commande
 * Format : ANOV-PO-XXXX-XXXX (product order)
 */
function generateOrderCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const part1 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const part2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `ANOV-PO-${part1}-${part2}`;
}