'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { pickField } from '@/lib/langs';

interface GiftCardSuccessContentProps {
  content: any;
}

export default function GiftCardSuccessContent({ content }: GiftCardSuccessContentProps) {
  const { locale } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams?.get('session_id');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const c = content ?? {};

  useEffect(() => {
    if (!sessionId) {
      setError('Session invalide');
      setIsLoading(false);
    } else {
      // Simuler une petite attente pour laisser le temps au webhook de traiter
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {locale === 'fr' ? 'Traitement de votre paiement...' :
              locale === 'en' ? 'Processing your payment...' :
                'Verarbeitung Ihrer Zahlung...'}
          </p>
        </div>
      </div>
    );
  }

  if (error || !sessionId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-20 px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4">
            {locale === 'fr' ? 'Une erreur s\'est produite' :
              locale === 'en' ? 'An error occurred' :
                'Ein Fehler ist aufgetreten'}
          </h1>
          <p className="text-muted-foreground mb-6">
            {locale === 'fr' ? 'Nous n\'avons pas pu traiter votre paiement. Veuillez réessayer ou nous contacter.' :
              locale === 'en' ? 'We were unable to process your payment. Please try again or contact us.' :
                'Wir konnten Ihre Zahlung nicht verarbeiten. Bitte versuchen Sie es erneut oder kontaktieren Sie uns.'}
          </p>
          <Button onClick={() => router.push('/cheques-cadeaux')}>
            {locale === 'fr' ? 'Retour aux chèques cadeaux' :
              locale === 'en' ? 'Back to gift cards' :
                'Zurück zu Geschenkgutscheinen'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-card border border-primary/30 rounded-lg p-8 md:p-12 text-center">
          {/* Icône de succès */}
          <div className="mb-6">
            <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto" />
          </div>

          {/* Titre principal */}
          <h1
            className="text-3xl md:text-4xl mb-4 text-primary"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {pickField(c, 'title', locale)}
          </h1>

          {/* Message de confirmation */}
          <div className="space-y-4 mb-8">
            <p className="text-lg text-foreground">
              {pickField(c, 'confirmationText', locale)}
            </p>

            <div className="bg-secondary border border-primary/20 rounded-lg p-6">
              <Mail className="w-12 h-12 text-primary mx-auto mb-3" />
              <p className="text-foreground font-medium">
                {pickField(c, 'emailSentTitle', locale)}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {pickField(c, 'emailSentDescription', locale)}
              </p>
            </div>
          </div>

          {/* Informations complémentaires */}
          <div className="bg-background/50 border border-primary/10 rounded-lg p-4 mb-8 text-sm text-muted-foreground">
            <p>
              <strong>{pickField(c, 'helpTitle', locale)}</strong> {pickField(c, 'helpText', locale)}
            </p>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="border-primary/30"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {pickField(c, 'buttonHome', locale)}
            </Button>
            <Button
              onClick={() => router.push('/cheques-cadeaux')}
              className="bg-primary hover:bg-primary/90"
            >
              {pickField(c, 'buttonAnother', locale)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
