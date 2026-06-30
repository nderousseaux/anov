import { NextRequest, NextResponse } from 'next/server';
import { sendConfirmationEmail } from '@/lib/email';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, date, time, guests, durationMinutes } = body;

    if (!email || !name || !date || !time || !guests) {
      return NextResponse.json(
        { error: 'Champs manquants (email, name, date, time, guests)' },
        { status: 400 }
      );
    }

    // Récupérer la durée du repas par défaut si non fournie
    let duration = durationMinutes || 90;
    // Si durationMinutes n'est pas fourni, on peut le récupérer depuis la base
    if (durationMinutes === undefined || durationMinutes === null) {
      const restaurantSettings = await prisma.restaurantSettings.findUnique({
        where: { id: 1 },
      });
      duration = restaurantSettings?.mealDuration || 90;
    }

    console.log(`[TEST EMAIL] Envoi à ${email}`);
    const result = await sendConfirmationEmail({
      to: email,
      name,
      date,
      time,
      guests: parseInt(guests, 10),
      cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reservation/cancel?token=test`,
      durationMinutes: duration,
    });

    console.log(`[TEST EMAIL] Résultat:`, result);

    return NextResponse.json({
      success: true,
      message: `Email envoyé à ${email}`,
    });
  } catch (err) {
    console.error('[TEST EMAIL] Erreur:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
