'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function ReservationCancelRedirect() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'cancelled' | 'already_cancelled' | 'error' | 'deleted'>('loading');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }

    fetch(`/api/reservations/cancel?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.message === 'deleted') setStatus('deleted');
        else if (data.message === 'cancelled') setStatus('cancelled');
        else if (data.message === 'already_cancelled') setStatus('already_cancelled');
        else setStatus('error');
      })
      .catch(() => setStatus('error'));
  }, [token]);

  useEffect(() => {
    if (status !== 'loading') {
      // Rediriger vers la page de réservation après un court délai
      const timer = setTimeout(() => {
        router.push('/reservation');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [status, router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      {status === 'loading' && (
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Traitement de l'annulation...</p>
        </div>
      )}
      {status === 'deleted' && (
        <div className="text-center">
          <p className="text-muted-foreground">Votre réservation a été supprimée.</p>
          <p className="text-muted-foreground mt-2">Redirection vers la page de réservation...</p>
        </div>
      )}
      {status === 'cancelled' && (
        <div className="text-center">
          <p className="text-muted-foreground">Votre réservation a bien été annulée.</p>
          <p className="text-muted-foreground mt-2">Redirection vers la page de réservation...</p>
        </div>
      )}
      {status === 'already_cancelled' && (
        <div className="text-center">
          <p className="text-muted-foreground">Cette réservation avait déjà été annulée.</p>
          <p className="text-muted-foreground mt-2">Redirection vers la page de réservation...</p>
        </div>
      )}
      {status === 'error' && (
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Redirection vers la page de réservation...</p>
          <p className="text-sm text-muted-foreground">Si la redirection ne se fait pas, <a href="/reservation" className="text-primary underline">cliquez ici</a></p>
        </div>
      )}
    </div>
  );
}

export default function ReservationCancelPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground text-xl">Chargement...</p>
      </div>
    }>
      <ReservationCancelRedirect />
    </Suspense>
  );
}
