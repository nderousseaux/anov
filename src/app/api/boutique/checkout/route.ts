import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productName, quantity, deliveryMethod, address } = body;

    // Validation
    if (!productName || !quantity || !deliveryMethod) {
      return NextResponse.json(
        { error: 'Nom du produit, quantité et méthode de livraison requis' },
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
    const { totalPrice } = body;
    if (!totalPrice) {
      return NextResponse.json(
        { error: 'Le prix total est requis' },
        { status: 400 }
      );
    }

    // Générer un code unique pour la commande
    const code = generateOrderCode();

    // Calculer la date d'expiration (10 minutes pour le paiement)
    const transactionExpireAt = new Date();
    transactionExpireAt.setMinutes(transactionExpireAt.getMinutes() + 10);

    // Créer la commande dans la base de données
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
      transactionExpireAt: Date;
      status: 'PENDING_PAYMENT';
    } = {
      code,
      productName,
      quantity,
      totalPrice,
      deliveryMethod,
      customerName: body.customerName || '',
      customerEmail: body.customerEmail || '',
      customerPhone: body.customerPhone || '',
      transactionExpireAt,
      status: 'PENDING_PAYMENT',
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
            },
            unit_amount: Math.round(totalPrice * 100), // Montant en centimes
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
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
      data: { stripeSessionId: session.id, expiresAt: session.expires_at ? new Date(session.expires_at * 1000) : null },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
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