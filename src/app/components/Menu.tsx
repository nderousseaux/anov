import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export function Menu() {
  const semaineItems = [
    { name: 'Velouté de butternut', description: 'Crème légère, huile de truffe, croûtons maison', price: '14€' },
    { name: 'Suprême de volaille', description: 'Jus réduit, légumes de saison rôtis, purée maison', price: '28€' },
    { name: 'Pavé de saumon', description: 'Beurre blanc aux herbes, riz pilaf, épinards frais', price: '30€' },
    { name: 'Crème brûlée vanille', description: 'Vanille de Madagascar, cassonade caramélisée', price: '10€' },
  ];

  const soirItems = [
    { name: 'Saint-Jacques snackées', description: 'Purée de topinambour, émulsion noisette, truffe', price: '32€' },
    { name: 'Magret de canard', description: 'Jus de porto, purée de céleri-rave, légumes rôtis', price: '38€' },
    { name: 'Côte de veau rôtie', description: 'Jus corsé, girolles sautées, gratin dauphinois', price: '45€' },
    { name: 'Fondant chocolat Valrhona', description: 'Cœur coulant 70% cacao, glace vanille Madagascar', price: '16€' },
  ];

  const boissonsItems = [
    { name: 'Château Margaux 2015', category: 'Bordeaux Rouge', price: '180€' },
    { name: 'Chablis Grand Cru Les Clos', category: 'Bourgogne Blanc', price: '95€' },
    { name: "l'anøv Signature", category: 'Cocktail signature', price: '18€' },
    { name: 'Le Parisien', category: 'Cocktail', price: '16€' },
  ];

  return (
    <section id="menu" className="py-20 px-4 bg-card">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2
            className="text-4xl sm:text-5xl md:text-6xl mb-4 text-primary"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Nos Cartes
          </h2>
          <p
            className="text-lg text-muted-foreground"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Carte de la semaine · Dimanche midi · Carte du soir · Vins · Cocktails
          </p>
        </div>

        <Tabs defaultValue="semaine" className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-12 bg-secondary border border-primary/30">
            <TabsTrigger
              value="semaine"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-foreground"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              La semaine
            </TabsTrigger>
            <TabsTrigger
              value="soir"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-foreground"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Le soir
            </TabsTrigger>
            <TabsTrigger
              value="boissons"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-foreground"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Vins &amp; Cocktails
            </TabsTrigger>
          </TabsList>

          <TabsContent value="semaine">
            <p className="text-muted-foreground text-sm text-center mb-6" style={{ fontFamily: 'var(--font-body)' }}>
              Renouvelée chaque semaine selon le marché
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {semaineItems.map((dish, index) => (
                <div
                  key={index}
                  className="bg-secondary p-6 rounded-lg border border-primary/20 hover:border-primary/50 transition-colors duration-300"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl text-primary" style={{ fontFamily: 'var(--font-display)' }}>{dish.name}</h3>
                    <span className="text-lg text-primary/90" style={{ fontFamily: 'var(--font-body)' }}>{dish.price}</span>
                  </div>
                  <p className="text-muted-foreground" style={{ fontFamily: 'var(--font-body)' }}>{dish.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 bg-secondary p-6 rounded-lg border border-primary/30 text-center">
              <p className="text-foreground text-sm" style={{ fontFamily: 'var(--font-body)' }}>Formule midi : Entrée + Plat — 32€ · Entrée + Plat + Dessert — 38€</p>
            </div>
          </TabsContent>

          <TabsContent value="soir">
            <p className="text-muted-foreground text-sm text-center mb-6" style={{ fontFamily: 'var(--font-body)' }}>
              Carte renouvelée tous les deux mois
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {soirItems.map((dish, index) => (
                <div
                  key={index}
                  className="bg-secondary p-6 rounded-lg border border-primary/20 hover:border-primary/50 transition-colors duration-300"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl text-primary" style={{ fontFamily: 'var(--font-display)' }}>{dish.name}</h3>
                    <span className="text-lg text-primary/90" style={{ fontFamily: 'var(--font-body)' }}>{dish.price}</span>
                  </div>
                  <p className="text-muted-foreground" style={{ fontFamily: 'var(--font-body)' }}>{dish.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-12 bg-secondary p-8 rounded-lg border border-primary/30 text-center">
              <h3 className="text-2xl text-primary mb-4" style={{ fontFamily: 'var(--font-display)' }}>Menu Dégustation</h3>
              <p className="text-foreground mb-2" style={{ fontFamily: 'var(--font-body)' }}>7 plats de saison composés par le Chef</p>
              <p className="text-muted-foreground mb-4" style={{ fontFamily: 'var(--font-body)' }}>Accord mets et vins inclus</p>
              <span className="text-3xl text-primary/90" style={{ fontFamily: 'var(--font-display)' }}>125€</span>
            </div>
          </TabsContent>

          <TabsContent value="boissons">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {boissonsItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-secondary p-6 rounded-lg border border-primary/20 hover:border-primary/50 transition-colors duration-300"
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-xl text-primary" style={{ fontFamily: 'var(--font-display)' }}>{item.name}</h3>
                    <span className="text-lg text-primary/90" style={{ fontFamily: 'var(--font-body)' }}>{item.price}</span>
                  </div>
                  <p className="text-sm text-muted-foreground" style={{ fontFamily: 'var(--font-body)' }}>{item.category}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 bg-secondary p-6 rounded-lg border border-primary/30 text-center">
              <p className="text-foreground text-sm" style={{ fontFamily: 'var(--font-body)' }}>Notre sommelier vous conseille — L&apos;abus d&apos;alcool est dangereux pour la santé</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
