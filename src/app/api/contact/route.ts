import { NextRequest, NextResponse } from 'next/server';
import { sendContactNotification, sendContactConfirmation } from '@/lib/email';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validation des données
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    // Validation basique de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Adresse email invalide' },
        { status: 400 }
      );
    }

    // Validation de la longueur
    if (name.length > 100 || subject.length > 200 || message.length > 2000) {
      return NextResponse.json(
        { error: 'Un ou plusieurs champs dépassent la longueur maximale' },
        { status: 400 }
      );
    }

    // Persistance du message (pour la fiche client), sans bloquer l'envoi des emails
    try {
      await prisma.contactMessage.create({ data: { name, email, subject, message } });
    } catch (persistError) {
      console.error('Erreur lors de la persistance du message de contact:', persistError);
    }

    // Envoi des emails
    const [notificationResult, confirmationResult] = await Promise.allSettled([
      sendContactNotification({ name, email, subject, message }),
      sendContactConfirmation({ to: email, name }),
    ]);

    // Vérifier si au moins un email a été envoyé
    if (notificationResult.status === 'rejected' && confirmationResult.status === 'rejected') {
      console.error('Erreur lors de l\'envoi des emails:', {
        notification: notificationResult.reason,
        confirmation: confirmationResult.reason,
      });
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi du message. Veuillez réessayer.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Message envoyé avec succès',
        details: {
          notificationSent: notificationResult.status === 'fulfilled',
          confirmationSent: confirmationResult.status === 'fulfilled',
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Erreur API contact:', error);
    return NextResponse.json(
      { error: 'Erreur serveur. Veuillez réessayer.' },
      { status: 500 }
    );
  }
}
