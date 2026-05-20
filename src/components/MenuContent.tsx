'use client';

import { type ReactNode } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Dish = { name: string; description: string; price: string };
type MenuItem = { course: string; name: string; description: string };
type Wine = { name: string; type: string; description: string; price: string };
type Cocktail = { name: string; description: string; price: string };

type MenuData = {
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
  semaineEntrees: readonly Dish[];
  semainePlats: readonly Dish[];
  semaineDesserts: readonly Dish[];
  semaineFormulePrix1: string;
  semaineFormulePrix2: string;
  dimancheTheme: string;
  dimancheDescription: string;
  dimancheMenu: readonly MenuItem[];
  dimanchePrix: string;
  soirEntrees: readonly Dish[];
  soirPlats: readonly Dish[];
  soirDesserts: readonly Dish[];
  soirDegustationPrix: string;
  vins: readonly Wine[];
  vinsImage: string;
  cocktails: readonly Cocktail[];
};

const DishCard = ({ name, description, price }: Dish) => (
  <div className="bg-secondary p-6 rounded-lg border border-primary/20 hover:border-primary/50 transition-colors duration-300">
    <div className="flex justify-between items-start mb-3 gap-4">
      <h3 className="text-lg text-primary" style={{ fontFamily: 'var(--font-display)' }}>{name}</h3>
      <span className="text-base text-primary/90 shrink-0">{price}</span>
    </div>
    <p className="text-muted-foreground text-sm">{description}</p>
  </div>
);

const SectionTitle = ({ children }: { children: ReactNode }) => (
  <h3 className="text-2xl text-primary mb-5 pb-2 border-b border-primary/20" style={{ fontFamily: 'var(--font-display)' }}>
    {children}
  </h3>
);

export function MenuContent({ content }: { content: MenuData | null }) {
  const c = content ?? ({} as MenuData);

  const semaineEntrees = c.semaineEntrees ?? [];
  const semainePlats = c.semainePlats ?? [];
  const semaineDesserts = c.semaineDesserts ?? [];
  const dimancheMenu = c.dimancheMenu ?? [];
  const soirEntrees = c.soirEntrees ?? [];
  const soirPlats = c.soirPlats ?? [];
  const soirDesserts = c.soirDesserts ?? [];
  const vins = c.vins ?? [];
  const cocktails = c.cocktails ?? [];

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero */}
      <div className="relative h-[55vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img
            src={c.heroImage ?? ''}
            alt="Carte gastronomique"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-card" />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1
            className="text-5xl sm:text-6xl md:text-7xl mb-6 text-primary"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {c.heroTitle ?? 'Nos Cartes'}
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto">
            {c.heroSubtitle ?? ''}
          </p>
        </div>
      </div>

      {/* Menu Content */}
      <section className="py-16 md:py-20 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="semaine" className="w-full">
            <TabsList className="w-full flex flex-wrap h-auto gap-1 mb-10 bg-secondary border border-primary/30 p-1">
              {[
                { value: 'semaine', label: 'Carte de la semaine' },
                { value: 'dimanche', label: 'Dimanche midi' },
                { value: 'soir', label: 'Carte du soir' },
                { value: 'vins', label: 'Vins' },
                { value: 'cocktails', label: 'Cocktails' },
              ].map(({ value, label }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="flex-1 basis-[calc(50%-0.25rem)] sm:basis-[calc(20%-0.25rem)] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-foreground"
                >
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* ── Carte de la semaine ──────────────────────────────────── */}
            <TabsContent value="semaine">
              <p className="text-muted-foreground text-sm text-center mb-10">
                Renouvelée chaque semaine selon les arrivages du marché
              </p>
              <div className="mb-10">
                <SectionTitle>Entrées</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {semaineEntrees.map((d, i) => <DishCard key={i} {...d} />)}
                </div>
              </div>
              <div className="mb-10">
                <SectionTitle>Plats</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {semainePlats.map((d, i) => <DishCard key={i} {...d} />)}
                </div>
              </div>
              <div className="mb-10">
                <SectionTitle>Desserts</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {semaineDesserts.map((d, i) => <DishCard key={i} {...d} />)}
                </div>
              </div>
              <div className="bg-secondary p-8 rounded-lg border border-primary/30 text-center">
                <h3 className="text-2xl text-primary mb-3" style={{ fontFamily: 'var(--font-display)' }}>Formule du midi</h3>
                <p className="text-foreground mb-2">Entrée + Plat ou Plat + Dessert</p>
                <span className="text-3xl text-primary/90" style={{ fontFamily: 'var(--font-display)' }}>{c.semaineFormulePrix1 ?? ''}</span>
                <p className="text-muted-foreground mt-2 text-sm">Entrée + Plat + Dessert — {c.semaineFormulePrix2 ?? ''}</p>
              </div>
            </TabsContent>

            {/* ── Dimanche midi ──────────────────────────────────────────── */}
            <TabsContent value="dimanche">
              <div className="text-center mb-10">
                <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">Thème de ce dimanche</p>
                <h2 className="text-4xl text-primary mb-4" style={{ fontFamily: 'var(--font-display)' }}>{c.dimancheTheme ?? ''}</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">{c.dimancheDescription ?? ''}</p>
              </div>
              <div className="max-w-2xl mx-auto space-y-4 mb-10">
                {dimancheMenu.map((item, index) => (
                  <div key={index} className="bg-secondary rounded-lg border border-primary/20 hover:border-primary/40 transition-colors duration-300 overflow-hidden">
                    <div className="flex items-stretch">
                      <div className="w-24 sm:w-32 flex items-center justify-center bg-primary/10 border-r border-primary/20 px-3 py-5 shrink-0">
                        <span className="text-primary text-sm font-medium text-center">{item.course}</span>
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg text-primary mb-1" style={{ fontFamily: 'var(--font-display)' }}>{item.name}</h3>
                        <p className="text-muted-foreground text-sm">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-secondary p-8 rounded-lg border border-primary/30 text-center max-w-md mx-auto">
                <h3 className="text-2xl text-primary mb-3" style={{ fontFamily: 'var(--font-display)' }}>Menu complet</h3>
                <p className="text-muted-foreground mb-4 text-sm">Entrée · Plat · Fromage · Dessert</p>
                <span className="text-3xl text-primary/90" style={{ fontFamily: 'var(--font-display)' }}>{c.dimanchePrix ?? ''}</span>
                <p className="text-muted-foreground mt-3 text-xs">Uniquement le dimanche à partir de 12h — Réservation conseillée</p>
              </div>
            </TabsContent>

            {/* ── Carte du soir ───────────────────────────────────────────── */}
            <TabsContent value="soir">
              <p className="text-muted-foreground text-sm text-center mb-10">
                Renouvelée tous les deux mois · Actuelle depuis début {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
              </p>
              <div className="mb-10">
                <SectionTitle>Entrées</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {soirEntrees.map((d, i) => <DishCard key={i} {...d} />)}
                </div>
              </div>
              <div className="mb-10">
                <SectionTitle>Plats</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {soirPlats.map((d, i) => <DishCard key={i} {...d} />)}
                </div>
              </div>
              <div className="mb-10">
                <SectionTitle>Desserts</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {soirDesserts.map((d, i) => <DishCard key={i} {...d} />)}
                </div>
              </div>
              <div className="bg-secondary p-8 rounded-lg border border-primary/30 text-center">
                <h3 className="text-2xl text-primary mb-3" style={{ fontFamily: 'var(--font-display)' }}>Menu Dégustation</h3>
                <p className="text-foreground mb-2">7 plats de saison composés par le Chef</p>
                <p className="text-muted-foreground mb-6 text-sm">Accord mets et vins inclus — disponible uniquement le soir</p>
                <span className="text-3xl text-primary/90" style={{ fontFamily: 'var(--font-display)' }}>{c.soirDegustationPrix ?? ''}</span>
              </div>
            </TabsContent>

            {/* ── Vins ────────────────────────────────────────────────────── */}
            <TabsContent value="vins">
              <p className="text-muted-foreground text-sm text-center mb-10">
                Une sélection soigneusement choisie par notre sommelier
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {vins.map((wine, index) => (
                  <div key={index} className="bg-secondary p-6 rounded-lg border border-primary/20 hover:border-primary/50 transition-colors duration-300">
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <div className="flex-1">
                        <h4 className="text-lg text-primary mb-1" style={{ fontFamily: 'var(--font-display)' }}>{wine.name}</h4>
                        <p className="text-xs text-primary/70 uppercase tracking-wide mb-2">{wine.type}</p>
                        <p className="text-sm text-muted-foreground">{wine.description}</p>
                      </div>
                      <span className="text-lg text-primary/90 shrink-0">{wine.price}</span>
                    </div>
                  </div>
                ))}
              </div>
              {c.vinsImage && (
                <img
                  src={c.vinsImage}
                  alt="Cave à vins"
                  className="w-full h-[360px] object-cover rounded-lg border-2 border-primary/30 mb-8"
                />
              )}
              <div className="bg-secondary p-6 rounded-lg border border-primary/30 text-center">
                <p className="text-foreground">Notre sommelier se fera un plaisir de vous conseiller selon vos préférences et vos plats</p>
              </div>
            </TabsContent>

            {/* ── Cocktails ───────────────────────────────────────────────── */}
            <TabsContent value="cocktails">
              <p className="text-muted-foreground text-sm text-center mb-10">
                Créations de notre bartender — servis au bar ou en table
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {cocktails.map((cocktail, index) => (
                  <div key={index} className="bg-secondary p-6 rounded-lg border border-primary/20 hover:border-primary/50 transition-colors duration-300">
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <h4 className="text-xl text-primary" style={{ fontFamily: 'var(--font-display)' }}>{cocktail.name}</h4>
                      <span className="text-lg text-primary/90 shrink-0">{cocktail.price}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{cocktail.description}</p>
                  </div>
                ))}
              </div>
              <div className="bg-secondary/60 rounded-lg border border-primary/20 p-6 text-center space-y-2">
                <p className="text-foreground font-medium">
                  L&apos;abus d&apos;alcool est dangereux pour la santé — À consommer avec modération
                </p>
                <p className="text-muted-foreground text-sm">
                  La vente d&apos;alcool aux mineurs est interdite — Loi Évin
                </p>
                <p className="text-muted-foreground text-xs mt-3">
                  Des versions sans alcool sont disponibles sur demande
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
