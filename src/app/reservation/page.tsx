import { Suspense } from 'react';
import { createReader } from '@keystatic/core/reader';
import config from '@/keystatic.config';
import { ReservationForm } from '@/components/features/ReservationForm';

export default async function ReservationPage() {
  const reader = createReader(process.cwd(), config);
  const reservationContent = await reader.singletons.reservation.read();

  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center pt-20"><p className="text-foreground text-xl">Chargement...</p></div>}>
      <ReservationForm content={reservationContent as Record<string, unknown> | null} />
    </Suspense>
  );
}
