import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Gift, CreditCard, ShoppingBag, Package, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export function ShopPage() {
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
    {
      name: 'Menu Gastronomique',
      description: 'Menu 7 services avec accords mets et vins',
      price: '195€',
      icon: '🌟',
    },
  ];

  const giftBoxes = [
    {
      name: 'Coffret Découverte',
      description: 'Sélection de produits artisanaux de nos partenaires',
      items: ['Huile d\'olive premium', 'Vinaigre balsamique', 'Sel de Guérande', 'Épices rares'],
      price: '85€',
    },
    {
      name: 'Coffret Prestige',
      description: 'Une sélection de nos meilleures créations',
      items: ['Terrines maison', 'Confitures artisanales', 'Chocolats fins', 'Vin sélectionné'],
      price: '150€',
    },
  ];

  const events = [
    {
      name: 'Dîner Chef\'s Table',
      description: 'Une soirée exclusive dans notre cuisine aux côtés du Chef',
      date: 'Sur réservation',
      price: '350€/pers.',
    },
    {
      name: 'Soirée Truffe',
      description: 'Menu spécial autour de la truffe noire du Périgord',
      date: 'Janvier - Février',
      price: '220€/pers.',
    },
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero Section */}
      <div className="relative h-[60vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1761095596755-99ba58997720?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwZGlzaCUyMHBsYXRpbmclMjBmaW5lJTIwZGluaW5nfGVufDF8fHx8MTc3MTUwOTU3N3ww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Boutique"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background" />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1
            className="text-5xl sm:text-6xl md:text-7xl mb-6 text-primary"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Boutique
          </h1>
          <p
            className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Offrez une expérience gastronomique inoubliable
          </p>
        </div>
      </div>

      {/* Gift Cards Section */}
      <section className="py-20 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Gift className="text-primary mx-auto mb-6" size={48} />
            <h2
              className="text-4xl sm:text-5xl mb-6 text-primary"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Chèques Cadeaux
            </h2>
            <p
              className="text-lg text-muted-foreground"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Un cadeau élégant pour tous les moments
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <form onSubmit={handlePurchase} className="bg-secondary p-8 rounded-lg border border-primary/30 space-y-6">
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
                <span>Paiement sécurisé • Livraison par email instantanée</span>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Experience Vouchers */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-4xl sm:text-5xl mb-6 text-primary"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Bons d'Expérience
            </h2>
            <p
              className="text-lg text-muted-foreground"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Des moments uniques à partager
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {experiences.map((exp, index) => (
              <div
                key={index}
                className="bg-card p-8 rounded-lg border border-primary/30 hover:border-primary/50 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{exp.icon}</span>
                    <h4
                      className="text-2xl text-primary group-hover:text-primary/90 transition-colors"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {exp.name}
                    </h4>
                  </div>
                  <span
                    className="text-2xl text-primary/90"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {exp.price}
                  </span>
                </div>
                <p
                  className="text-muted-foreground mb-6 text-lg"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {exp.description}
                </p>
                <Button
                  onClick={() => toast.success('Ajouté au panier!')}
                  className="w-full bg-secondary hover:bg-primary hover:text-primary-foreground text-foreground border border-primary/30 transition-all duration-300"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Sélectionner
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gift Boxes */}
      <section className="py-20 px-4 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Package className="text-primary mx-auto mb-6" size={48} />
            <h2
              className="text-4xl sm:text-5xl mb-6 text-primary"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Coffrets Cadeaux
            </h2>
            <p
              className="text-lg text-muted-foreground"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Des sélections raffinées de nos meilleurs produits
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {giftBoxes.map((box, index) => (
              <div
                key={index}
                className="bg-secondary p-8 rounded-lg border-2 border-primary/30 hover:border-primary transition-all duration-300"
              >
                <h4
                  className="text-2xl text-primary mb-4"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {box.name}
                </h4>
                <p
                  className="text-foreground mb-6 text-lg"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {box.description}
                </p>
                <ul className="space-y-2 mb-6">
                  {box.items.map((item, i) => (
                    <li
                      key={i}
                      className="text-muted-foreground flex items-start gap-2"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      <span className="text-primary">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between">
                  <span
                    className="text-3xl text-primary/90"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {box.price}
                  </span>
                  <Button
                    onClick={() => toast.success('Ajouté au panier!')}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    Acheter
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Events */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Calendar className="text-primary mx-auto mb-6" size={48} />
            <h2
              className="text-4xl sm:text-5xl mb-6 text-primary"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Événements Spéciaux
            </h2>
            <p
              className="text-lg text-muted-foreground"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Des expériences exclusives tout au long de l'année
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {events.map((event, index) => (
              <div
                key={index}
                className="bg-card p-8 rounded-lg border border-primary/30 hover:border-primary/50 transition-all duration-300"
              >
                <h4
                  className="text-2xl text-primary mb-3"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {event.name}
                </h4>
                <p
                  className="text-foreground mb-4 text-lg"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {event.description}
                </p>
                <div className="flex items-center justify-between mb-6">
                  <span
                    className="text-muted-foreground"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    📅 {event.date}
                  </span>
                  <span
                    className="text-xl text-primary/90"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {event.price}
                  </span>
                </div>
                <Button
                  onClick={() => toast.success('Nous vous contacterons pour finaliser votre réservation.')}
                  className="w-full bg-secondary hover:bg-primary hover:text-primary-foreground text-foreground border border-primary/30 transition-all duration-300"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Réserver
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-card p-8 rounded-lg border border-primary/30 text-center">
            <p
              className="text-muted-foreground text-lg"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              💳 Tous les achats sont sécurisés • Les bons et chèques cadeaux sont valables 12 mois
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
