import { NextRequest, NextResponse } from 'next/server';
import { sendConfirmationEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, date, time, guests } = body;

    if (!email || !name || !date || !time || !guests) {
      return NextResponse.json(
        { error: 'Champs manquants (email, name, date, time, guests)' },
        { status: 400 }
      );
    }

    console.log(`[TEST EMAIL] Envoi à ${email}`);
    const result = await sendConfirmationEmail({
      to: email,
      name,
      date,
      time,
      guests: parseInt(guests, 10),
      cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reservation/cancel?token=test`,
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
