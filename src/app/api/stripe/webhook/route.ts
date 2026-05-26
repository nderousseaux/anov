import { NextRequest, NextResponse } from 'next/server';
// SYSTEME DE PAIEMENT COMMENTE POUR L'INSTANT
// import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { sendConfirmationEmail } from '@/lib/email';

// Désactiver le body parser de Next.js pour lire le corps brut (requis par Stripe)
export const config = { api: { bodyParser: false } };

// SYSTEME DE PAIEMENT COMMENTE POUR L'INSTANT
// Le CMS est fonctionnel coté admin, le système de paiement sera activé ultérieurement

export async function POST(req: NextRequest) {
  // SYSTEME DE PAIEMENT DESACTIVE - Webhook Stripe inutilisable
  return NextResponse.json({
    message: 'Systeme de paiement temporairement desactive',
    testMode: true,
  });

  /* Code Stripe commenté pour l'instant
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('[stripe/webhook] STRIPE_WEBHOOK_SECRET manquant');
    return NextResponse.json({ error: 'Configuration serveur incorrecte' }, { status: 500 });
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Signature manquante' }, { status: 400 });
  }

  let event;
  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error('[stripe/webhook] Signature invalide :', err);
    return NextResponse.json({ error: 'Webhook signature invalide' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const meta = session.metadata ?? {};

    if (!meta.name || !meta.email || !meta.date || !meta.guests) {
      console.error('[stripe/webhook] Metadata incomplètes', meta);
      return NextResponse.json({ error: 'Metadata manquantes' }, { status: 400 });
    }

    // Créer la réservation en base maintenant que le paiement est confirmé
    const reservation = await prisma.reservation.create({
      data: {
        name: meta.name,
        email: meta.email,
        phone: meta.phone || null,
        date: new Date(meta.date),
        guests: parseInt(meta.guests, 10),
        specialRequest: meta.specialRequest || null,
        wantsSmsReminder: false,
        status: 'CONFIRMED',
        stripeSessionId: session.id,
      },
    });

    // Envoyer l'email de confirmation
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
      const resDate = new Date(reservation.date);
      await sendConfirmationEmail({
        to: reservation.email,
        name: reservation.name,
        date: resDate.toLocaleDateString('fr-FR', {
          weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
        }),
        time: `${String(resDate.getUTCHours()).padStart(2, '0')}:${String(resDate.getUTCMinutes()).padStart(2, '0')}`,
        guests: reservation.guests,
        cancelUrl: `${baseUrl}/reservation/cancel?token=${reservation.cancelToken}`,
      });
    } catch (emailErr) {
      console.error('[stripe/webhook] Échec envoi email :', emailErr);
    }
  }

  return NextResponse.json({ received: true });
  */
}
