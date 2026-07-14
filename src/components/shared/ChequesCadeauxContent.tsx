'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Gift, CreditCard, ShoppingBag } from 'lucide-react';

import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';
import { pickField } from '@/lib/langs';

interface ChequesCadeauxContent {
  image?: string | null;
  title_fr?: string;
  title_en?: string;
  title_de?: string;
  subtitle_fr?: string;
  subtitle_en?: string;
  subtitle_de?: string;
  labelAmount_fr?: string;
  labelAmount_en?: string;
  labelAmount_de?: string;
  placeholderAmount_fr?: string;
  placeholderAmount_en?: string;
  placeholderAmount_de?: string;
  amounts?: string;
  labelRecipient_fr?: string;
  labelRecipient_en?: string;
  labelRecipient_de?: string;
  placeholderRecipient_fr?: string;
  placeholderRecipient_en?: string;
  placeholderRecipient_de?: string;
  labelMessage_fr?: string;
  labelMessage_en?: string;
  labelMessage_de?: string;
  placeholderMessage_fr?: string;
  placeholderMessage_en?: string;
  placeholderMessage_de?: string;
  submitButton_fr?: string;
  submitButton_en?: string;
  submitButton_de?: string;
  paymentInfo_fr?: string;
  paymentInfo_en?: string;
  paymentInfo_de?: string;
  footerSecure_fr?: string;
  footerSecure_en?: string;
  footerSecure_de?: string;
  footerValid_fr?: string;
  footerValid_en?: string;
  footerValid_de?: string;
}

export function ChequesCadeauxContent({ content }: { content?: ChequesCadeauxContent | null }) {
  const { locale } = useLanguage();
  const [giftCard, setGiftCard] = useState({
    amount: '',
    recipient: '',
    message: '',
  });
  const [errors, setErrors] = useState({
    amount: '',
    recipient: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const c = (content ?? {}) as Record<string, unknown>;

  // Parse amounts from comma-separated string
  const amounts = (((c.amounts as string) || '50€, 100€, 150€, 200€, 250€, 500€') as string)
    .split(',')
    .map((a: string) => a.trim())
    .filter((a: string) => a.length > 0);

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = { amount: '', recipient: '' };

    // Validation du montant (doit être un float positif)
    if (!giftCard.amount.trim()) {
      newErrors.amount = 'Veuillez entrer un montant';
      isValid = false;
    } else {
      const amount = parseFloat(giftCard.amount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = 'Le montant doit être un nombre positif';
        isValid = false;
      }
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!giftCard.recipient.trim()) {
      newErrors.recipient = 'Veuillez entrer un email';
      isValid = false;
    } else if (!emailRegex.test(giftCard.recipient)) {
      newErrors.recipient = 'Veuillez entrer un email valide';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handlePurchase = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs', {
        description: 'Les champs marqués ont des erreurs.',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Appeler l'API pour créer une session de paiement Stripe
      const response = await fetch('/api/gift-cards/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: giftCard.amount,
          recipientEmail: giftCard.recipient,
          personalMessage: giftCard.message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création de la session de paiement');
      }

      // Rediriger vers Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('URL de paiement manquante');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
      toast.error('Erreur lors de l\'achat', {
        description: errorMessage,
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="relative h-[36vh] sm:h-[55vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img
            src={(c.image as string | undefined) || 'https://images.unsplash.com/photo-1761095596755-99ba58997720?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwZGlzaCUyMHBsYXRpbmclMjBmaW5lJTIwZGluaW5mfGVufDF8fHx8MTc3MTUwOTU3N3ww&ixlib=rb-4.1.0&q=80&w=1080'}
            alt="Chèques Cadeaux"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-card" />
        </div>
        <div className="relative z-10 text-center sm:px-4 sm:pt-0 pt-16">
          <h1
            className="text-5xl sm:text-6xl md:text-7xl mb-6 text-primary"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {pickField(c, 'title', locale) || 'Chèques Cadeaux'}
          </h1>
          {pickField(c, 'subtitle', locale) && (
            <p className="text-lg sm:text-2xl text-muted-foreground max-w-3xl mx-auto">
              {pickField(c, 'subtitle', locale)}
            </p>
          )}
        </div>
      </div>

      <section className="py-16 md:py-20 px-4 bg-card">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <Gift className="text-primary mx-auto mb-4" size={48} />
            <h2
              className="text-xl sm:text-2xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
            </h2>
          </div>

          <form onSubmit={handlePurchase} className="bg-secondary p-8 rounded-lg border border-primary/30 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-foreground">
                {pickField(c, 'labelAmount', locale)}
              </Label>
              <Select value={giftCard.amount} onValueChange={(value) => setGiftCard({ ...giftCard, amount: value })}>
                <SelectTrigger className="bg-background/30 border-primary/30 text-foreground">
                  <SelectValue placeholder={pickField(c, 'placeholderAmount', locale)} />
                </SelectTrigger>
                <SelectContent className="bg-secondary border-primary/30">
                  {amounts.map((amount) => (
                    <SelectItem key={amount} value={amount} className="text-foreground focus:bg-primary/20 data-[highlighted]:text-primary">
                      {amount}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipient" className="text-foreground">
                {pickField(c, 'labelRecipient', locale)}
              </Label>
              <Input
                id="recipient"
                type="email"
                required
                value={giftCard.recipient}
                onChange={(e) => setGiftCard({ ...giftCard, recipient: e.target.value })}
                className="bg-background/30 border-primary/30 text-foreground focus:border-primary"
                placeholder={pickField(c, 'placeholderRecipient', locale)}
              />
              {errors.recipient && <p className="text-sm text-red-500">{errors.recipient}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-foreground">
                {pickField(c, 'labelMessage', locale)}
              </Label>
              <textarea
                id="message"
                value={giftCard.message}
                onChange={(e) => setGiftCard({ ...giftCard, message: e.target.value })}
                className="w-full bg-background/30 border border-primary/30 text-foreground rounded-md p-3 min-h-[100px] focus:border-primary focus:bg-background/50 focus:outline-none transition-colors duration-300"
                placeholder={pickField(c, 'placeholderMessage', locale)}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 transition-all duration-300 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground"></div>
                  <span>Redirection vers le paiement...</span>
                </>
              ) : (
                <>
                  <CreditCard size={20} />
                  {pickField(c, 'submitButton', locale)}
                </>
              )}
            </Button>

            <div className="flex-col">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-2">
                <ShoppingBag size={16} />
                <span>{pickField(c, 'paymentInfo', locale)}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <span>{pickField(c, 'footerSecure', locale)} • {pickField(c, 'footerValid', locale)}</span>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
