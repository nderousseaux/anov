'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';

// SYSTEME DE PAIEMENT COMMENTE POUR L'INSTANT
// Le CMS est fonctionnel coté admin, le système de paiement sera activé ultérieurement

export default function PaiementPage() {
  const router = useRouter();

  useEffect(() => {
    // Rediriger vers la page de réservation car le paiement est désactivé
    router.push('/reservation');
  }, [router]);

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

        {/* Titre */}
        <div className="mb-8">
          <h1
            className="text-3xl sm:text-4xl text-foreground mb-3"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Paiement de l&apos;acompte
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            SYSTEME DE PAIEMENT TEMPORAIREMENT DESACTIVE.
            Veuillez faire votre réservation via le CMS admin.
          </p>
        </div>

        {/* Séparateur doré */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-primary/20" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
          <div className="flex-1 h-px bg-primary/20" />
        </div>

        {/* Message d'information */}
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-center">
          <div className="text-destructive">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-semibold text-foreground">Paiement temporairement désactivé</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Le système de paiement Stripe est en maintenance.
            Pour faire une réservation, veuillez utiliser le CMS admin.
          </p>
        </div>
      </div>
    </div>
  );
}
