import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// SYSTEME DE PAIEMENT COMMENTE POUR L'INSTANT
// Le CMS est fonctionnel coté admin, le système de paiement sera activé ultérieurement
// import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, date, time, guests, specialRequest } = body;

    // Validation minimale
    if (!name || !email || !date || !time || !guests) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 });
    }
    const guestsNum = parseInt(guests, 10);
    if (isNaN(guestsNum) || guestsNum < 1 || guestsNum > 30) {
      return NextResponse.json({ error: 'Nombre de couverts invalide' }, { status: 400 });
    }
    if (!/^[\w.+\-]+@[\w\-]+\.[a-z]{2,}$/i.test(email)) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 });
    }
    if (phone && !/^\+?[\d\s\-().]{6,20}$/.test(phone.trim())) {
      return NextResponse.json({ error: 'Numéro de téléphone invalide' }, { status: 400 });
    }

    // Construire la date complète (UTC pour cohérence avec getUTCHours() dans availability.ts)
    const reservationDate = new Date(`${date}T${time}:00.000Z`);
    if (reservationDate <= new Date()) {
      return NextResponse.json({ error: 'Date invalide' }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

    // SYSTEME DE PAIEMENT COMMENTE POUR L'INSTANT
    // Le CMS est fonctionnel coté admin, le système de paiement sera activé ultérieurement
    // Pour l'instant, on renvoie juste une réponse de test pour permettre la validation des données

    return NextResponse.json({
      message: 'Systeme de paiement temporairement desactive. Reservations via CMS uniquement.',
      testMode: true,
      formData: {
        name,
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || '',
        date: reservationDate.toISOString(),
        guests: guestsNum,
        specialRequest: specialRequest?.trim() || ''
      }
    });
  } catch (err) {
    console.error('[POST /api/reservations]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
