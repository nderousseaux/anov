import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, recipientEmail, personalMessage } = body;

    // Validation
    if (!amount || !recipientEmail) {
      return NextResponse.json(
        { error: 'Montant et email du destinataire requis' },
        { status: 400 }
      );
    }

    const amountValue = parseFloat(amount.replace('€', '').trim());
    if (isNaN(amountValue) || amountValue <= 0) {
      return NextResponse.json(
        { error: 'Montant invalide' },
        { status: 400 }
      );
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      );
    }

    // Générer un code unique pour le chèque cadeau
    const code = generateGiftCardCode();

    // Calculer la date d'expiration (12 mois)
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 12);

    // Créer le chèque cadeau dans la base de données (statut PENDING_PAYMENT)
    // isPaid: true pour les bons créés via le site client (payés)
    const giftCard = await prisma.giftCard.create({
      data: {
        code,
        amount: amountValue,
        recipientEmail,
        personalMessage: personalMessage || null,
        isPaid: true,
        expiresAt,
        status: 'PENDING_PAYMENT',
      },
    });

    // Créer une session de paiement Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Chèque Cadeau ANØV',
              description: `Chèque cadeau de ${amountValue}€`,
              images: ['https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?w=400&q=80'],
            },
            unit_amount: Math.round(amountValue * 100), // Montant en centimes
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cheques-cadeaux/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cheques-cadeaux`,
      metadata: {
        type: 'gift_card',
        giftCardId: giftCard.id,
      },
    });

    // Mettre à jour le chèque cadeau avec l'ID de session Stripe
    await prisma.giftCard.update({
      where: { id: giftCard.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('[gift-cards/checkout] Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la session de paiement' },
      { status: 500 }
    );
  }
}

/**
 * Génère un code unique pour le chèque cadeau
 * Format : ANOV-G-XXXX-XXXX (gift/client Stripe)
 */
function generateGiftCardCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Sans O, 0, I, 1 pour éviter la confusion
  const part1 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const part2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `ANOV-G-${part1}-${part2}`;
}
