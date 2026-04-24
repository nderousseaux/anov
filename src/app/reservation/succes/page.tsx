'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Calendar, Clock, Users, Mail, Phone, XCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';

type Reservation = {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  guests: number;
  status: string;
};

export default function ReservationSuccessPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) { setError('Réservation introuvable'); setLoading(false); return; }
    fetch(`/api/reservations/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setReservation(data);
      })
      .catch(() => setError('Erreur de chargement'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary text-xl" style={{ fontFamily: 'var(--font-body)' }}>
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
          <p className="text-foreground text-xl mb-6">{error ?? 'Réservation introuvable'}</p>
          <Link href="/reservation">
            <Button className="bg-primary text-primary-foreground">Faire une réservation</Button>
          </Link>
        </div>
      </div>
    );
  }

  const d = new Date(reservation.date);
  const formattedDate = d.toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  const formattedTime = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

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
          <p className="text-muted-foreground text-lg" style={{ fontFamily: 'var(--font-body)' }}>
            Un email de confirmation a été envoyé à {reservation.email}
          </p>
        </div>

        <div className="bg-card border border-primary/20 rounded-lg p-8 space-y-5">
          <div className="flex items-center gap-3 text-foreground">
            <Calendar size={20} className="text-primary shrink-0" />
            <span style={{ fontFamily: 'var(--font-body)' }}>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-3 text-foreground">
            <Clock size={20} className="text-primary shrink-0" />
            <span style={{ fontFamily: 'var(--font-body)' }}>{formattedTime}</span>
          </div>
          <div className="flex items-center gap-3 text-foreground">
            <Users size={20} className="text-primary shrink-0" />
            <span style={{ fontFamily: 'var(--font-body)' }}>
              {reservation.guests} personne{reservation.guests > 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex items-center gap-3 text-foreground">
            <Mail size={20} className="text-primary shrink-0" />
            <span style={{ fontFamily: 'var(--font-body)' }}>{reservation.email}</span>
          </div>
          <div className="flex items-center gap-3 text-foreground">
            <Phone size={20} className="text-primary shrink-0" />
            <span style={{ fontFamily: 'var(--font-body)' }}>{reservation.phone}</span>
          </div>
        </div>

        <p
          className="text-center text-sm text-muted-foreground mt-6"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Un rappel vous sera envoyé par email 48h avant votre réservation.
        </p>

        <div className="text-center mt-8">
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
    </div>
  );
}
