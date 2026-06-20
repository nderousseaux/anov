'use client';

import { useState, type FormEvent } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Gift, CreditCard, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';
import { pickField } from '@/lib/langs';

interface BoutiqueContent {
  image?: string;
  title_fr?: string;
  title_en?: string;
  title_de?: string;
  subtitle_fr?: string;
  subtitle_en?: string;
  subtitle_de?: string;
  giftCardsTitle_fr?: string;
  giftCardsTitle_en?: string;
  giftCardsTitle_de?: string;
  giftCardsSubtitle_fr?: string;
  giftCardsSubtitle_en?: string;
  giftCardsSubtitle_de?: string;
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

export function BoutiqueContent({ content }: { content?: Record<string, unknown> | null }) {
  const { locale } = useLanguage();
  const [giftCard, setGiftCard] = useState({
    amount: '',
    recipient: '',
    message: '',
  });

  const c = (content ?? {}) as Record<string, unknown>;

  // Parse amounts from comma-separated string
  const amounts = ((c.amounts as string | undefined) || '50€, 100€, 150€, 200€, 250€, 500€')
    .split(',')
    .map((a: string) => a.trim())
    .filter((a: string) => a.length > 0);

  const handlePurchase = (e: FormEvent) => {
    e.preventDefault();
    toast.success('Merci pour votre achat !', {
      description: 'Un email de confirmation a été envoyé.',
    });
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="relative h-[36vh] sm:h-[55vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img
            src={(c.image as string) || 'https://images.unsplash.com/photo-1761095596755-99ba58997720?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwZGlzaCUyMHBsYXRpbmclMjBmaW5lJTIwZGluaW5mfGVufDF8fHx8MTc3MTUwOTU3N3ww&ixlib=rb-4.1.0&q=80&w=1080'}
            alt="Boutique"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-card" />
        </div>
        <div className="relative z-10 text-center sm:px-4 sm:pt-0 pt-16">
          <h1
            className="text-5xl sm:text-6xl md:text-7xl mb-6 text-primary"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {pickField(c, 'title', locale)}
          </h1>
          <p className="text-lg sm:text-2xl text-muted-foreground max-w-3xl mx-auto">
            {pickField(c, 'subtitle', locale)}
          </p>
        </div>
      </div>

      <section className="py-16 md:py-20 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Gift className="text-primary mx-auto mb-6" size={48} />
            <h2
              className="text-3xl sm:text-4xl mb-5 text-primary"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {pickField(c, 'giftCardsTitle', locale)}
            </h2>
            {pickField(c, 'giftCardsSubtitle', locale) && (
              <p className="text-base text-muted-foreground">
                {pickField(c, 'giftCardsSubtitle', locale)}
              </p>
            )}
          </div>

          <div className="max-w-2xl mx-auto">
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
                      <SelectItem key={amount} value={amount as string} className="text-foreground focus:bg-primary/20 data-[highlighted]:text-primary">
                        {amount}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <CreditCard size={20} />
                {pickField(c, 'submitButton', locale)}
              </Button>

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <ShoppingBag size={16} />
                <span>{pickField(c, 'paymentInfo', locale)}</span>
              </div>
            </form>
          </div>
        </div>
      </section>

      <div className="py-12 px-4 bg-card text-center">
        <p className="text-muted-foreground text-lg">
          {pickField(c, 'footerSecure', locale)} • {pickField(c, 'footerValid', locale)}
        </p>
      </div>
    </div>
  );
}
