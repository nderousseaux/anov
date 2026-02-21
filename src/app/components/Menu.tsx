import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export function Menu() {
  const menuWeek = [
    {
      name: 'Tartare de daurade',
      description: 'Agrumes, avocat, huile de basilic',
      price: '28€',
    },
    {
      name: 'Risotto aux truffes',
      description: 'Parmesan vieilli, pousses de roquette',
      price: '32€',
    },
    {
      name: 'Magret de canard',
      description: 'Jus de porto, purée de céleri, légumes de saison',
      price: '38€',
    },
    {
      name: 'Loup de mer',
      description: 'Fenouil confit, beurre blanc aux agrumes',
      price: '42€',
    },
  ];

  const desserts = [
    {
      name: 'Tarte au citron meringuée',
      description: 'Meringue italienne, sorbet citron',
      price: '14€',
    },
    {
      name: 'Fondant au chocolat',
      description: 'Cœur coulant, glace vanille de Madagascar',
      price: '16€',
    },
    {
      name: 'Soufflé Grand Marnier',
      description: 'Servi chaud, sauce anglaise',
      price: '18€',
    },
  ];

  const wines = [
    {
      name: 'Château Margaux 2015',
      type: 'Bordeaux Rouge',
      price: '180€',
    },
    {
      name: 'Chablis Grand Cru',
      type: 'Bourgogne Blanc',
      price: '95€',
    },
    {
      name: 'Champagne Dom Pérignon',
      type: 'Brut Millésimé',
      price: '250€',
    },
    {
      name: 'Sancerre Domaine Vacheron',
      type: 'Loire Blanc',
      price: '65€',
    },
  ];

  return (
    <section id="menu" className="py-20 px-4 bg-card">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2
            className="text-4xl sm:text-5xl md:text-6xl mb-4 text-primary"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            La Carte
          </h2>
          <p
            className="text-lg text-muted-foreground"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Une cuisine créative et raffinée, renouvelée au fil des saisons
          </p>
        </div>

        <Tabs defaultValue="plats" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-12 bg-secondary border border-primary/30">
            <TabsTrigger
              value="plats"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-foreground"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Plats
            </TabsTrigger>
            <TabsTrigger
              value="desserts"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-foreground"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Desserts
            </TabsTrigger>
            <TabsTrigger
              value="vins"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-foreground"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Vins
            </TabsTrigger>
          </TabsList>

          <TabsContent value="plats">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {menuWeek.map((dish, index) => (
                <div
                  key={index}
                  className="bg-secondary p-6 rounded-lg border border-primary/20 hover:border-primary/50 transition-colors duration-300"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3
                      className="text-xl text-primary"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {dish.name}
                    </h3>
                    <span
                      className="text-lg text-primary/90"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {dish.price}
                    </span>
                  </div>
                  <p
                    className="text-muted-foreground"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {dish.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-secondary p-8 rounded-lg border border-primary/30 text-center">
              <h3
                className="text-2xl text-primary mb-4"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Menu Dégustation
              </h3>
              <p
                className="text-foreground mb-2"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                7 plats de saison composés par le Chef
              </p>
              <p
                className="text-muted-foreground mb-4"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Accord mets et vins inclus
              </p>
              <span
                className="text-3xl text-primary/90"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                125€
              </span>
            </div>
          </TabsContent>

          <TabsContent value="desserts">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {desserts.map((dessert, index) => (
                <div
                  key={index}
                  className="bg-secondary p-6 rounded-lg border border-primary/20 hover:border-primary/50 transition-colors duration-300"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3
                      className="text-xl text-primary"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {dessert.name}
                    </h3>
                    <span
                      className="text-lg text-primary/90"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {dessert.price}
                    </span>
                  </div>
                  <p
                    className="text-muted-foreground"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {dessert.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Plating Image */}
            <div className="mt-12">
              <img
                src="https://images.unsplash.com/photo-1761095596755-99ba58997720?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwZGlzaCUyMHBsYXRpbmclMjBmaW5lJTIwZGluaW5nfGVufDF8fHx8MTc3MTUwOTU3N3ww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Dressage gastronomique"
                className="w-full h-[400px] object-cover rounded-lg border-2 border-primary/30"
              />
            </div>
          </TabsContent>

          <TabsContent value="vins">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {wines.map((wine, index) => (
                <div
                  key={index}
                  className="bg-secondary p-6 rounded-lg border border-primary/20 hover:border-primary/50 transition-colors duration-300"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3
                        className="text-xl text-primary mb-1"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {wine.name}
                      </h3>
                      <p
                        className="text-sm text-muted-foreground"
                        style={{ fontFamily: 'var(--font-body)' }}
                      >
                        {wine.type}
                      </p>
                    </div>
                    <span
                      className="text-lg text-primary/90"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {wine.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Wine Cellar Image */}
            <div className="mt-12">
              <img
                src="https://images.unsplash.com/photo-1769697064243-889f2e25d44a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW5lJTIwY2VsbGFyJTIwYm90dGxlcyUyMGVsZWdhbnR8ZW58MXx8fHwxNzcxNDkzNTEwfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Cave à vins"
                className="w-full h-[400px] object-cover rounded-lg border-2 border-primary/30"
              />
            </div>

            <div className="mt-8 bg-secondary p-6 rounded-lg border border-primary/30 text-center">
              <p
                className="text-foreground"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Notre sommelier se fera un plaisir de vous conseiller selon vos préférences
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
