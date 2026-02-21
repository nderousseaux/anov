import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Gift, CreditCard, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

export function Shop() {
  const [giftCard, setGiftCard] = useState({
    amount: '',
    recipient: '',
    message: '',
  });

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Achat confirmé!', {
      description: 'Le chèque cadeau sera envoyé par email dans quelques instants.',
    });
    setGiftCard({ amount: '', recipient: '', message: '' });
  };

  const experiences = [
    {
      name: 'Dîner Romantique',
      description: 'Menu dégustation pour 2 personnes avec champagne',
      price: '250€',
      icon: '💝',
    },
    {
      name: 'Atelier Cuisine',
      description: 'Cours de cuisine avec le Chef (4 heures)',
      price: '180€',
      icon: '👨‍🍳',
    },
    {
      name: 'Dégustation Vins',
      description: 'Soirée dégustation avec notre sommelier',
      price: '120€',
      icon: '🍷',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2
          className="text-4xl sm:text-5xl mb-4 text-primary"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Boutique Cadeaux
        </h2>
        <p
          className="text-lg text-muted-foreground"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Offrez une expérience gastronomique inoubliable
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Gift Cards */}
        <div className="bg-card p-8 rounded-lg border border-primary/30">
          <div className="flex items-center gap-3 mb-6">
            <Gift className="text-primary" size={32} />
            <h3
              className="text-3xl text-primary"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Chèques Cadeaux
            </h3>
          </div>

          <form onSubmit={handlePurchase} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-foreground">
                Montant
              </Label>
              <Select value={giftCard.amount} onValueChange={(value) => setGiftCard({ ...giftCard, amount: value })}>
                <SelectTrigger className="bg-background/30 border-primary/30 text-foreground">
                  <SelectValue placeholder="Choisir un montant" />
                </SelectTrigger>
                <SelectContent className="bg-secondary border-primary/30">
                  {['50€', '100€', '150€', '200€', '250€', '500€'].map((amount) => (
                    <SelectItem key={amount} value={amount} className="text-foreground focus:bg-primary/20">
                      {amount}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipient" className="text-foreground">
                Email du destinataire
              </Label>
              <Input
                id="recipient"
                type="email"
                required
                value={giftCard.recipient}
                onChange={(e) => setGiftCard({ ...giftCard, recipient: e.target.value })}
                className="bg-background/30 border-primary/30 text-foreground focus:border-primary"
                placeholder="destinataire@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-foreground">
                Message personnel
              </Label>
              <textarea
                id="message"
                value={giftCard.message}
                onChange={(e) => setGiftCard({ ...giftCard, message: e.target.value })}
                className="w-full bg-background/30 border border-primary/30 text-foreground rounded-md p-3 min-h-[100px] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Ajoutez un message personnalisé..."
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 transition-all duration-300 flex items-center justify-center gap-2"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <CreditCard size={20} />
              Acheter maintenant
            </Button>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <ShoppingBag size={16} />
              <span>Paiement sécurisé</span>
            </div>
          </form>
        </div>

        {/* Experiences */}
        <div className="space-y-6">
          <h3
            className="text-3xl text-primary mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Bons d'Expérience
          </h3>

          {experiences.map((exp, index) => (
            <div
              key={index}
              className="bg-card p-6 rounded-lg border border-primary/30 hover:border-primary/50 transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{exp.icon}</span>
                  <h4
                    className="text-xl text-primary group-hover:text-primary/90 transition-colors"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {exp.name}
                  </h4>
                </div>
                <span
                  className="text-xl text-primary/90"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {exp.price}
                </span>
              </div>
              <p
                className="text-muted-foreground mb-4"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {exp.description}
              </p>
              <Button
                onClick={() => toast.success('Ajouté au panier!')}
                className="w-full bg-secondary hover:bg-muted text-foreground border border-primary/30 transition-all duration-300"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Sélectionner
              </Button>
            </div>
          ))}

          <div className="bg-card p-6 rounded-lg border border-primary/30 text-center">
            <p
              className="text-muted-foreground"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Les bons d'expérience sont valables 12 mois à compter de la date d'achat
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
