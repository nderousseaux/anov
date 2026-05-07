import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, date, time, guests, specialRequest } = body;

    // Validation minimale
    if (!name || !email || !phone || !date || !time || !guests) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 });
    }
    const guestsNum = parseInt(guests, 10);
    if (isNaN(guestsNum) || guestsNum < 1 || guestsNum > 30) {
      return NextResponse.json({ error: 'Nombre de couverts invalide' }, { status: 400 });
    }
    if (!/^[\w.+\-]+@[\w\-]+\.[a-z]{2,}$/i.test(email)) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 });
    }

    // Construire la date complète (UTC pour cohérence avec getUTCHours() dans availability.ts)
    const reservationDate = new Date(`${date}T${time}:00.000Z`);
    if (reservationDate <= new Date()) {
      return NextResponse.json({ error: 'Date invalide' }, { status: 400 });
    }

    // Créer la réservation en base (CONFIRMED directement)
    const reservation = await prisma.reservation.create({
      data: {
        name: name.trim().slice(0, 100),
        email: email.trim().toLowerCase().slice(0, 200),
        phone: phone.trim().slice(0, 30),
        date: reservationDate,
        guests: guestsNum,
        specialRequest: specialRequest?.trim().slice(0, 500) || null,
        wantsSmsReminder: false,
        status: 'CONFIRMED',
      },
    });

    return NextResponse.json({ status: 'confirmed', reservationId: reservation.id });
  } catch (err) {
    console.error('[POST /api/reservations]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
