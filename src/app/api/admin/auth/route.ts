import { NextRequest, NextResponse } from "next/server";
import { signAdminToken, COOKIE_NAME } from "@/lib/auth";
import { timingSafeEqual } from "crypto";

function constantTimeCompare(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

async function issueToken() {
  // On utilise un ID fixe pour l'admin (qui n'est plus en base)
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, await signAdminToken(1), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 8 * 3600,
    path: "/",
  });
  return response;
}

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    const envLogin = process.env.ADMIN_LOGIN;
    const envPasswd = process.env.ADMIN_PASSWD;

    if (!envLogin || !envPasswd) {
      console.error("ADMIN_LOGIN or ADMIN_PASSWD not set in environment");
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }

    if (constantTimeCompare(username, envLogin) && constantTimeCompare(password, envPasswd)) {
      return await issueToken();
    }

    // Délai constant pour éviter les attaques de timing
    await new Promise((resolve) => setTimeout(resolve, 200));
    return NextResponse.json(
      { error: "Identifiants invalides" },
      { status: 401 },
    );
  } catch (err) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, "", { maxAge: 0, path: "/" });
  return response;
}
