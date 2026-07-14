'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Calendar, Clock, Users, Mail, Phone, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// SYSTEME DE PAIEMENT ACTIVE
// Le CMS est fonctionnel coté admin, le système de paiement Stripe est maintenant actif

type Reservation = {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  guests: number;
  status: string;
  transactionExpireAt: string | null;
};

function ReservationSuccessForm() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    // Vérifier le statut de la session Stripe
    if (sessionId) {
      fetch(`/api/reservations/by-session?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          if (data.id) {
            setReservation(data);
            // Vérifier si la réservation est expirée
            // EXPIRED est nowait le statut, mais on vérifie PENDING_PAYMENT + transactionExpireAt dépassé
            const now = new Date();
            const isExpired = data.status === 'PENDING_PAYMENT' &&
                              data.transactionExpireAt &&
                              new Date(data.transactionExpireAt) < now;
            setIsExpired(isExpired);
          } else {
            setError(data.error || 'Session introuvable');
          }
          setLoading(false);
        })
        .catch(() => {
          setError('Erreur lors de la vérification de la réservation');
          setLoading(false);
        });
    } else {
      setError('ID de session manquant');
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary text-xl">
          Chargement...
        </div>
      </div>
    );
  }

  if (error || !reservation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-20">
        <div className="text-center">
          <XCircle size={64} className="text-destructive mx-auto mb-4" />
          <p className="text-foreground text-xl mb-6">{error ?? 'Systeme de paiement temporairement desactive'}</p>
          <p className="text-muted-foreground text-sm mb-6">Veuillez utiliser le CMS admin pour faire vos reservations</p>
          <Link href="/reservation">
            <Button className="bg-primary text-primary-foreground">Faire une réservation via CMS</Button>
          </Link>
        </div>
      </div>
    );
  }

  const d = new Date(reservation.date);
  const formattedDate = d.toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  });
  const formattedTime = `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;

  // Si la réservation est expirée (PENDING_PAYMENT + transactionExpireAt dépassé)
  if (isExpired) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-16 px-4">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-10">
            <Clock size={72} className="text-amber-500 mx-auto mb-4" />
            <h1
              className="text-4xl sm:text-5xl text-amber-500 mb-3"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Transaction expirée
            </h1>
            <p className="text-muted-foreground">
              Votre paiement n&apos;a pas été complété dans les 10 minutes. La réservation a été annulée.
            </p>
          </div>
          <div className="bg-card border border-primary/20 rounded-lg p-8 space-y-5">
            <p className="text-foreground">
              Votre acompte n&apos;a pas été débité. Le créneau est de nouveau disponible.
            </p>
          </div>
          <div className="text-center mt-8">
            <Link href="/reservation">
              <Button className="bg-primary text-primary-foreground">
                Faire une nouvelle réservation
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-10">
          <CheckCircle size={72} className="text-primary mx-auto mb-4" />
          <h1
            className="text-4xl sm:text-5xl text-primary mb-3"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Réservation confirmée
          </h1>
          <p className="text-muted-foreground">Votre acompte a bien été reçu. Un email de confirmation vous a été envoyé.</p>
        </div>

        <div className="bg-card border border-primary/20 rounded-lg p-8 space-y-5">
          <div className="flex items-center gap-3 text-foreground">
            <Calendar size={20} className="text-primary shrink-0" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-3 text-foreground">
            <Clock size={20} className="text-primary shrink-0" />
            <span>{formattedTime}</span>
          </div>
          <div className="flex items-center gap-3 text-foreground">
            <Users size={20} className="text-primary shrink-0" />
            <span>
              {reservation.guests} personne{reservation.guests > 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex items-center gap-3 text-foreground">
            <Mail size={20} className="text-primary shrink-0" />
            <span>{reservation.email}</span>
          </div>
          {reservation.phone && (
            <div className="flex items-center gap-3 text-foreground">
              <Phone size={20} className="text-primary shrink-0" />
              <span>{reservation.phone}</span>
            </div>
          )}
        </div>

        <div className="text-center mt-8">
          <Link href="/">
            <Button
              variant="outline"
              className="border-primary/30 text-foreground hover:bg-primary/10"
            >
              Retour à l&apos;accueil
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ReservationSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center pt-20"><p className="text-foreground text-xl">Chargement...</p></div>}>
      <ReservationSuccessForm />
    </Suspense>
  );
}
