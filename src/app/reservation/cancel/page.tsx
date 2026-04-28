'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { XCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ReservationCancelPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'cancelled' | 'already_cancelled' | 'error'>('loading');

  useEffect(() => {
    if (!token) { setStatus('error'); return; }
    fetch(`/api/reservations/cancel?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.message === 'cancelled') setStatus('cancelled');
        else if (data.message === 'already_cancelled') setStatus('already_cancelled');
        else setStatus('error');
      })
      .catch(() => setStatus('error'));
  }, [token]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center pt-20 px-4">
      <div className="max-w-md text-center">
        {status === 'loading' && (
          <p className="text-foreground text-xl" style={{ fontFamily: 'var(--font-body)' }}>
            Annulation en cours...
          </p>
        )}
        {status === 'cancelled' && (
          <>
            <CheckCircle size={64} className="text-primary mx-auto mb-4" />
            <h1 className="text-3xl text-primary mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              Réservation annulée
            </h1>
            <p className="text-muted-foreground mb-8" style={{ fontFamily: 'var(--font-body)' }}>
              Votre réservation a bien été annulée. Un email de confirmation vous a été envoyé.
            </p>
          </>
        )}
        {status === 'already_cancelled' && (
          <>
            <XCircle size={64} className="text-muted-foreground mx-auto mb-4" />
            <h1 className="text-3xl text-foreground mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              Déjà annulée
            </h1>
            <p className="text-muted-foreground mb-8" style={{ fontFamily: 'var(--font-body)' }}>
              Cette réservation a déjà été annulée.
            </p>
          </>
        )}
        {status === 'error' && (
          <>
            <XCircle size={64} className="text-destructive mx-auto mb-4" />
            <h1 className="text-3xl text-foreground mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              Lien invalide
            </h1>
            <p className="text-muted-foreground mb-8" style={{ fontFamily: 'var(--font-body)' }}>
              Ce lien d&apos;annulation est invalide ou a expiré.
            </p>
          </>
        )}
        <Link href="/">
          <Button
            variant="outline"
            className="border-primary/30 text-foreground hover:bg-primary/10"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Retour à l&apos;accueil
          </Button>
        </Link>
      </div>
    </div>
  );
}
