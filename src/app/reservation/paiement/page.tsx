'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js';
import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PaiementPage() {
  const router = useRouter();

  // Lire le secret UNE seule fois depuis sessionStorage via l'initialiseur lazy de useState.
  // useEffect double-fire (React Strict Mode) ne pose pas de problème car l'initialiseur
  // ne tourne qu'au premier montage réel et l'état est préservé entre les simulations.
  const [checkoutData] = useState<{ clientSecret: string; sessionId: string } | null>(() => {
    if (typeof window === 'undefined') return null;
    const cs = sessionStorage.getItem('stripe_client_secret');
    const sid = sessionStorage.getItem('stripe_session_id');
    if (cs && sid) {
      sessionStorage.removeItem('stripe_client_secret');
      sessionStorage.removeItem('stripe_session_id');
      return { clientSecret: cs, sessionId: sid };
    }
    return null;
  });

  const clientSecret = checkoutData?.clientSecret ?? null;
  const sessionId = checkoutData?.sessionId ?? null;

  useEffect(() => {
    if (!clientSecret) {
      router.push('/reservation');
    }
  }, [clientSecret, router]);

  return (
    <div className="min-h-screen bg-background">

      {/* En-tête minimaliste aux couleurs du site */}
      <header className="border-b border-primary/20 bg-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img
              src="/assets/img-logo.jpg"
              alt="ANØV"
              className="h-12 sm:h-14 w-auto -translate-y-1"
            />
          </Link>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Lock size={14} className="text-primary/70" />
            <span>Paiement sécurisé</span>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Fil d'Ariane */}
        <Link
          href="/reservation"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm mb-8 group"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
          Retour à la réservation
        </Link>

        {/* Titre */}
        <div className="mb-8">
          <h1
            className="text-3xl sm:text-4xl text-foreground mb-3"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Paiement de l&apos;acompte
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Votre table sera confirmée dès réception du paiement.
            L&apos;acompte sera déduit de votre addition le soir de votre venue.
          </p>
        </div>

        {/* Séparateur doré */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-primary/20" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
          <div className="flex-1 h-px bg-primary/20" />
        </div>

        {/* Formulaire Stripe intégré */}
        {clientSecret ? (
          <div className="rounded-lg overflow-hidden border border-primary/20 shadow-lg shadow-black/40">
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={{
                clientSecret,
                onComplete: () => {
                  if (sessionId) {
                    window.location.href = `/reservation/succes?session_id=${encodeURIComponent(sessionId)}`;
                  }
                },
              }}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
            <div className="w-6 h-6 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
            <span className="text-sm">Chargement du formulaire de paiement…</span>
          </div>
        )}

        {/* Pied de page sécurité */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          Paiement traité par{' '}
          <span className="text-foreground/60 font-medium">Stripe</span>
          {' '}— vos données bancaires ne transitent jamais par nos serveurs.
        </p>
      </div>
    </div>
  );
}
