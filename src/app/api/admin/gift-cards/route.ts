import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromCookies } from '@/lib/auth';
import { sendGiftCardEmail } from '@/lib/email';

export async function GET(req: NextRequest) {
  const admin = await getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const status = searchParams.get('status');
  const code = searchParams.get('code');
  const email = searchParams.get('email');
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const perPage = 25;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (code) where.code = { contains: code, mode: 'insensitive' };
  if (email) where.recipientEmail = { contains: email, mode: 'insensitive' };

  const [total, giftCards] = await Promise.all([
    prisma.giftCard.count({ where }),
    prisma.giftCard.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
  ]);

  return NextResponse.json({
    data: giftCards,
    total,
    page,
    pageSize: perPage,
  });
}

export async function POST(req: NextRequest) {
  const admin = await getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const body = await req.json();
  const { amount, recipientEmail, personalMessage } = body;

  // Validation
  if (!amount) {
    return NextResponse.json({ error: 'Le montant est requis' }, { status: 400 });
  }

  const amountValue = parseFloat(amount);
  if (isNaN(amountValue) || amountValue <= 0) {
    return NextResponse.json({ error: 'Montant invalide' }, { status: 400 });
  }

  // recipientEmail est optionnel pour les créations admin
  // Si email est fourni, on le valide
  let emailValue: string | null = null;
  if (recipientEmail && recipientEmail.trim() !== '') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 });
    }
    emailValue = recipientEmail;
  }

  // Générer un code unique pour le chèque cadeau (format manuel/admin)
  const code = generateAdminGiftCardCode();

  // Calculer la date d'expiration (12 mois)
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + 12);

  // Créer le chèque cadeau dans la base de données (statut ACTIVE par défaut pour admin)
  // isPaid = false pour les créations admin (gratuites)
  const giftCard = await prisma.giftCard.create({
    data: {
      code,
      amount: amountValue,
      recipientEmail: emailValue,
      personalMessage: personalMessage || null,
      isPaid: false, // Création admin = toujours gratuit
      expiresAt,
      status: 'ACTIVE',
    },
    select: {
      id: true,
      code: true,
      amount: true,
      recipientEmail: true,
      personalMessage: true,
      isPaid: true,
      status: true,
      createdAt: true,
      expiresAt: true,
      usedAt: true,
    },
  });

  // Envoyer l'email au destinataire si un email a été fourni
  if (emailValue) {
    try {
      await sendGiftCardEmail({
        to: emailValue,
        code: giftCard.code,
        amount: giftCard.amount,
        personalMessage: giftCard.personalMessage || undefined,
        expiresAt: giftCard.expiresAt.toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
      });
      console.log('[admin/gift-cards] Email envoyé à:', emailValue);
    } catch (error) {
      console.error('[admin/gift-cards] Erreur lors de l\'envoi de l\'email:', error);
    }
  }

  return NextResponse.json(giftCard, { status: 201 });
}

/**
 * Génère un code unique pour le chèque cadeau
 * Format : ANOV-M-XXXX-XXXX (manuel/admin)
 */
function generateAdminGiftCardCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Sans O, 0, I, 1 pour éviter la confusion
  const part1 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const part2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `ANOV-M-${part1}-${part2}`;
}

/**
 * Génère un code unique pour le chèque cadeau
 * Format : ANOV-G-XXXX-XXXX (gift/client Stripe)
 */
function generateGiftCardCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Sans O, 0, I, 1 pour éviter la confusion
  const part1 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `ANOV-G-${part1}`;
}

export async function PATCH(req: NextRequest) {
  const admin = await getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const body = await req.json();
  const { id, action } = body;

  if (!id || !action) {
    return NextResponse.json({ error: 'ID et action requis' }, { status: 400 });
  }

  if (action === 'validate') {
    // Valider le bon cadeau (PENDING_PAYMENT → ACTIVE ou ACTIVE → USED)
    // Si le bon est déjà utilisé (USED), on le remet en active (non utilisé)
    const giftCard = await prisma.giftCard.update({
      where: { id },
      data: {
        status: 'ACTIVE',
        usedAt: null, // Si le bon était USED, on le met à null pour le marquer comme "non utilisé"
      },
      select: { id: true, code: true, status: true, usedAt: true },
    });
    return NextResponse.json({ success: true, giftCard });
  } else if (action === 'markUsed') {
    // Marquer le bon comme utilisé (ACTIVE → USED)
    const giftCard = await prisma.giftCard.update({
      where: { id },
      data: {
        status: 'USED',
        usedAt: new Date(),
      },
      select: { id: true, code: true, status: true, usedAt: true },
    });
    return NextResponse.json({ success: true, giftCard });
  } else if (action === 'delete') {
    // Supprimer le bon cadeau
    await prisma.giftCard.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ error: 'Action invalide' }, { status: 400 });
  }
}
