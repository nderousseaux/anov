import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signAdminToken, COOKIE_NAME } from '@/lib/auth';
import { createHash, timingSafeEqual } from 'crypto';

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({ where: { email: username.toLowerCase() } });
    if (!admin) {
      // Délai constant pour éviter timing attack
      timingSafeEqual(Buffer.alloc(32), Buffer.alloc(32));
      return NextResponse.json({ error: 'Identifiants invalides' }, { status: 401 });
    }

    const inputHash = Buffer.from(hashPassword(password), 'hex');
    const storedHash = Buffer.from(admin.passwordHash, 'hex');
    if (inputHash.length !== storedHash.length || !timingSafeEqual(inputHash, storedHash)) {
      return NextResponse.json({ error: 'Identifiants invalides' }, { status: 401 });
    }

    const token = await signAdminToken(admin.id);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 8 * 3600,
      path: '/',
    });
    return response;
  } catch (err) {
    console.error('[POST /api/admin/auth]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, '', { maxAge: 0, path: '/' });
  return response;
}
