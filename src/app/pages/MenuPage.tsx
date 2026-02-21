import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

export function MenuPage() {
  const menuWeek = [
    {
      name: 'Tartare de daurade',
      description: 'Agrumes, avocat, huile de basilic',
      price: '28€',
    },
    {
      name: 'Saint-Jacques snackées',
      description: 'Purée de topinambour, émulsion noisette',
      price: '32€',
    },
    {
      name: 'Risotto aux truffes',
      description: 'Parmesan vieilli 36 mois, pousses de roquette',
      price: '34€',
    },
    {
      name: 'Foie gras poêlé',
      description: 'Chutney de figues, pain d\'épices maison',
      price: '36€',
    },
  ];

  const mainCourses = [
    {
      name: 'Magret de canard',
      description: 'Jus de porto, purée de céleri, légumes de saison rôtis',
      price: '38€',
    },
    {
      name: 'Loup de mer',
      description: 'Fenouil confit, beurre blanc aux agrumes, courgettes',
      price: '42€',
    },
    {
      name: 'Côte de veau',
      description: 'Jus corsé, girolles sautées, gratin dauphinois',
      price: '45€',
    },
    {
      name: 'Homard breton',
      description: 'Bisque réduite, légumes glacés, riz basmati',
      price: '58€',
    },
  ];

  const desserts = [
    {
      name: 'Tarte au citron meringuée',
      description: 'Meringue italienne légère, sorbet citron de Menton',
      price: '14€',
    },
    {
      name: 'Fondant au chocolat',
      description: 'Cœur coulant 70% cacao, glace vanille de Madagascar',
      price: '16€',
    },
    {
      name: 'Soufflé Grand Marnier',
      description: 'Servi chaud, sauce anglaise à la vanille',
      price: '18€',
    },
    {
      name: 'Millefeuille revisité',
      description: 'Crème diplomate, caramel au beurre salé',
      price: '15€',
    },
  ];

  const wines = [
    {
      name: 'Château Margaux 2015',
      type: 'Bordeaux Rouge - Margaux',
      description: 'Notes de cassis, vanille et cèdre',
      price: '180€',
    },
    {
      name: 'Chablis Grand Cru Les Clos',
      type: 'Bourgogne Blanc',
      description: 'Minéralité exceptionnelle, notes florales',
      price: '95€',
    },
    {
      name: 'Champagne Dom Pérignon',
      type: 'Brut Millésimé 2012',
      description: 'Bulles fines, arômes complexes',
      price: '250€',
    },
    {
      name: 'Sancerre Domaine Vacheron',
      type: 'Loire Blanc',
      description: 'Fraîcheur et vivacité, notes d\'agrumes',
      price: '65€',
    },
    {
      name: 'Châteauneuf-du-Pape',
      type: 'Rhône Rouge',
      description: 'Puissant et épicé, fruits rouges mûrs',
      price: '85€',
    },
    {
      name: 'Puligny-Montrachet',
      type: 'Bourgogne Blanc',
      description: 'Élégance et finesse, notes beurrées',
      price: '120€',
    },
  ];

  const cocktails = [
    {
      name: 'l’anøv Signature',
      description: 'Gin floral, elderflower, champagne, citron vert',
      price: '18€',
    },
    {
      name: 'Le Parisien',
      description: 'Cognac XO, vermouth rouge, angostura',
      price: '16€',
    },
    {
      name: 'Jardin Secret',
      description: 'Vodka, concombre, basilic, sirop de rose',
      price: '15€',
    },
    {
      name: 'Coucher de Soleil',
      description: 'Tequila, passion, pamplemousse, piment',
      price: '17€',
    },
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero Section */}
      <div className="relative h-[60vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1761095596755-99ba58997720?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwZGlzaCUyMHBsYXRpbmclMjBmaW5lJTIwZGluaW5nfGVufDF8fHx8MTc3MTUwOTU3N3ww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Carte gastronomique"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background" />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1
            className="text-5xl sm:text-6xl md:text-7xl mb-6 text-primary"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            La Carte
          </h1>
          <p
            className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Une cuisine créative et raffinée, renouvelée au fil des saisons
          </p>
        </div>
      </div>

      {/* Menu Content */}
      <section className="py-20 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="entrees" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-12 bg-secondary border border-primary/30">
              <TabsTrigger
                value="entrees"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-foreground"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Entrées
              </TabsTrigger>
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
                value="boissons"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-foreground"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Boissons
              </TabsTrigger>
            </TabsList>

            <TabsContent value="entrees">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
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
            </TabsContent>

            <TabsContent value="plats">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {mainCourses.map((dish, index) => (
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
                  className="text-3xl text-primary mb-4"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Menu Dégustation
                </h3>
                <p
                  className="text-foreground mb-2 text-lg"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  7 plats de saison composés par le Chef
                </p>
                <p
                  className="text-muted-foreground mb-6"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Accord mets et vins inclus
                </p>
                <span
                  className="text-4xl text-primary/90"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  125€
                </span>
              </div>
            </TabsContent>

            <TabsContent value="desserts">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
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

              <div className="mt-12">
                <img
                  src="https://images.unsplash.com/photo-1761095596755-99ba58997720?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwZGlzaCUyMHBsYXRpbmclMjBmaW5lJTIwZGluaW5nfGVufDF8fHx8MTc3MTUwOTU3N3ww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Dressage gastronomique"
                  className="w-full h-[400px] object-cover rounded-lg border-2 border-primary/30"
                />
              </div>
            </TabsContent>

            <TabsContent value="boissons">
              <div className="mb-16">
                <h3
                  className="text-3xl text-primary mb-8"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Vins
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {wines.map((wine, index) => (
                    <div
                      key={index}
                      className="bg-secondary p-6 rounded-lg border border-primary/20 hover:border-primary/50 transition-colors duration-300"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4
                            className="text-xl text-primary mb-1"
                            style={{ fontFamily: 'var(--font-display)' }}
                          >
                            {wine.name}
                          </h4>
                          <p
                            className="text-sm text-primary/90 mb-2"
                            style={{ fontFamily: 'var(--font-body)' }}
                          >
                            {wine.type}
                          </p>
                          <p
                            className="text-sm text-muted-foreground"
                            style={{ fontFamily: 'var(--font-body)' }}
                          >
                            {wine.description}
                          </p>
                        </div>
                        <span
                          className="text-lg text-primary/90 ml-4"
                          style={{ fontFamily: 'var(--font-body)' }}
                        >
                          {wine.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12">
                  <img
                    src="https://images.unsplash.com/photo-1769697064243-889f2e25d44a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW5lJTIwY2VsbGFyJTIwYm90dGxlcyUyMGVsZWdhbnR8ZW58MXx8fHwxNzcxNDkzNTEwfDA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Cave à vins"
                    className="w-full h-[400px] object-cover rounded-lg border-2 border-primary/30"
                  />
                </div>
              </div>

              <div className="mb-12">
                <h3
                  className="text-3xl text-primary mb-8"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Cocktails Signature
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {cocktails.map((cocktail, index) => (
                    <div
                      key={index}
                      className="bg-secondary p-6 rounded-lg border border-primary/20 hover:border-primary/50 transition-colors duration-300"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4
                            className="text-xl text-primary mb-2"
                            style={{ fontFamily: 'var(--font-display)' }}
                          >
                            {cocktail.name}
                          </h4>
                          <p
                            className="text-sm text-muted-foreground"
                            style={{ fontFamily: 'var(--font-body)' }}
                          >
                            {cocktail.description}
                          </p>
                        </div>
                        <span
                          className="text-lg text-primary/90"
                          style={{ fontFamily: 'var(--font-body)' }}
                        >
                          {cocktail.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-secondary p-6 rounded-lg border border-primary/30 text-center">
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
    </div>
  );
}
