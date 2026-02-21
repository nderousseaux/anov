import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

export function MenuPage() {
  // ── Carte de la semaine ──────────────────────────────────────────────────
  const semaineEntrees = [
    { name: 'Velouté de butternut', description: 'Crème légère, huile de truffe, croûtons maison', price: '14€' },
    { name: 'Carpaccio de daurade', description: 'Agrumes, avocat, fleur de sel, herbes fraîches', price: '18€' },
    { name: 'Foie gras mi-cuit', description: 'Chutney de figues, brioche toastée maison', price: '22€' },
  ];
  const semainePlats = [
    { name: 'Suprême de volaille', description: 'Jus réduit, légumes de saison rôtis, purée maison', price: '28€' },
    { name: 'Pavé de saumon', description: 'Beurre blanc aux herbes, riz pilaf, épinards frais', price: '30€' },
    { name: "Risotto du moment", description: "Selon l'arrivage du marché, parmesan vieilli 24 mois", price: '26€' },
  ];
  const semaineDesserts = [
    { name: 'Crème brûlée vanille', description: 'Vanille de Madagascar, cassonade caramélisée', price: '10€' },
    { name: 'Tarte du jour', description: "Selon l'inspiration du Chef pâtissier", price: '11€' },
    { name: 'Assiette de fromages', description: 'Sélection affinée, confiture maison, pain aux noix', price: '14€' },
  ];

  // ── Dimanche midi – repas à thème ────────────────────────────────────────
  const dimancheTheme = 'Voyage en Bretagne';
  const dimancheDescription =
    "Chaque dimanche midi, notre Chef compose un repas autour d'un thème culinaire différent — une invitation à un voyage gastronomique renouvelé chaque semaine.";
  const dimancheMenu = [
    { course: 'Entrée', name: "Huîtres gratinées au beurre d'algues", description: 'Chapelure croustillante, zeste de citron vert' },
    { course: 'Plat', name: 'Homard breton rôti', description: 'Beurre blanc au cidre breton, pommes de terre nouvelles, haricots extra-fins' },
    { course: 'Fromage', name: 'Plateau de fromages bretons', description: 'Camembert affiné, tomme de pays, chèvre frais, miel de sarrasin' },
    { course: 'Dessert', name: 'Far breton revisité', description: 'Pruneaux flambés au lambig, glace vanille de Madagascar' },
  ];

  // ── Carte du soir (renouvelée tous les deux mois) ────────────────────────
  const soirEntrees = [
    { name: 'Saint-Jacques snackées', description: 'Purée de topinambour, émulsion noisette, copeaux de truffe', price: '32€' },
    { name: 'Terrine de foie gras', description: "Pain d'épices, gelée de Sauternes, poire pochée au verjus", price: '36€' },
    { name: 'Tartare de bœuf au couteau', description: 'Condiments classiques, chips maison, câpres, cornichons', price: '28€' },
    { name: 'Soupe de homard', description: "Bisque dorée, crème fleurette, piment d'Espelette", price: '34€' },
  ];
  const soirPlats = [
    { name: 'Magret de canard', description: 'Jus de porto, purée de céleri-rave, légumes de saison rôtis', price: '38€' },
    { name: "Loup de mer en croûte d'herbes", description: 'Fenouil confit, beurre blanc aux agrumes, courgettes', price: '42€' },
    { name: 'Côte de veau rôtie', description: 'Jus corsé, girolles sautées à l\'ail, gratin dauphinois', price: '45€' },
    { name: 'Homard breton thermidor', description: 'Bisque réduite, légumes glacés au beurre, riz basmati', price: '58€' },
  ];
  const soirDesserts = [
    { name: 'Soufflé Grand Marnier', description: 'Servi chaud à la minute, sauce anglaise à la vanille', price: '18€' },
    { name: 'Millefeuille revisité', description: 'Crème diplomate, caramel beurre salé, feuilletage caramélisé', price: '15€' },
    { name: 'Fondant chocolat Valrhona', description: 'Cœur coulant 70% cacao, glace vanille de Madagascar', price: '16€' },
    { name: 'Tarte au citron meringuée', description: 'Meringue italienne légère, sorbet citron de Menton', price: '14€' },
  ];

  // ── Vins ─────────────────────────────────────────────────────────────────
  const wines = [
    { name: 'Château Margaux 2015', type: 'Bordeaux Rouge – Margaux', description: 'Notes de cassis, vanille et cèdre. Grande longueur en bouche.', price: '180€' },
    { name: 'Chablis Grand Cru Les Clos', type: 'Bourgogne Blanc', description: 'Minéralité exceptionnelle, notes florales et de pierre à fusil.', price: '95€' },
    { name: 'Champagne Dom Pérignon', type: 'Brut Millésimé 2012', description: "Bulles fines, arômes complexes de brioche et d'agrumes.", price: '250€' },
    { name: 'Sancerre Domaine Vacheron', type: 'Loire Blanc', description: 'Fraîcheur et vivacité, notes de silex et d\'agrumes.', price: '65€' },
    { name: 'Châteauneuf-du-Pape', type: 'Rhône Rouge', description: 'Puissant et épicé, fruits rouges mûrs, tanins soyeux.', price: '85€' },
    { name: 'Puligny-Montrachet', type: 'Bourgogne Blanc', description: 'Élégance et finesse, notes beurrées et florales.', price: '120€' },
  ];

  // ── Cocktails ─────────────────────────────────────────────────────────────
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

  // ── Reusable cards ────────────────────────────────────────────────────────
  const DishCard = ({ name, description, price }: { name: string; description: string; price: string }) => (
    <div className="bg-secondary p-6 rounded-lg border border-primary/20 hover:border-primary/50 transition-colors duration-300">
      <div className="flex justify-between items-start mb-3 gap-4">
        <h3 className="text-lg text-primary" style={{ fontFamily: 'var(--font-display)' }}>{name}</h3>
        <span className="text-base text-primary/90 shrink-0" style={{ fontFamily: 'var(--font-body)' }}>{price}</span>
      </div>
      <p className="text-muted-foreground text-sm" style={{ fontFamily: 'var(--font-body)' }}>{description}</p>
    </div>
  );

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-2xl text-primary mb-5 pb-2 border-b border-primary/20" style={{ fontFamily: 'var(--font-display)' }}>
      {children}
    </h3>
  );

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero */}
      <div className="relative h-[55vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1761095596755-99ba58997720?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwZGlzaCUyMHBsYXRpbmclMjBmaW5lJTIwZGluaW5nfGVufDF8fHx8MTc3MTUwOTU3N3ww&ixlib=rb-4.1.0&q=80&w=1080"
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
            Nos Cartes
          </h1>
          <p
            className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Quatre formules, une seule promesse : une cuisine vivante, ancrée dans les saisons
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
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* ── Carte de la semaine ──────────────────────────────────── */}
            <TabsContent value="semaine">
              <p className="text-muted-foreground text-sm text-center mb-10" style={{ fontFamily: 'var(--font-body)' }}>
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
                <p className="text-foreground mb-2" style={{ fontFamily: 'var(--font-body)' }}>Entrée + Plat ou Plat + Dessert</p>
                <span className="text-3xl text-primary/90" style={{ fontFamily: 'var(--font-display)' }}>32€</span>
                <p className="text-muted-foreground mt-2 text-sm" style={{ fontFamily: 'var(--font-body)' }}>Entrée + Plat + Dessert — 38€</p>
              </div>
            </TabsContent>

            {/* ── Dimanche midi ──────────────────────────────────────────── */}
            <TabsContent value="dimanche">
              <div className="text-center mb-10">
                <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2" style={{ fontFamily: 'var(--font-body)' }}>Thème de ce dimanche</p>
                <h2 className="text-4xl text-primary mb-4" style={{ fontFamily: 'var(--font-display)' }}>{dimancheTheme}</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>{dimancheDescription}</p>
              </div>
              <div className="max-w-2xl mx-auto space-y-4 mb-10">
                {dimancheMenu.map((item, index) => (
                  <div key={index} className="bg-secondary rounded-lg border border-primary/20 hover:border-primary/40 transition-colors duration-300 overflow-hidden">
                    <div className="flex items-stretch">
                      <div className="w-24 sm:w-32 flex items-center justify-center bg-primary/10 border-r border-primary/20 px-3 py-5 shrink-0">
                        <span className="text-primary text-sm font-medium text-center" style={{ fontFamily: 'var(--font-body)' }}>{item.course}</span>
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg text-primary mb-1" style={{ fontFamily: 'var(--font-display)' }}>{item.name}</h3>
                        <p className="text-muted-foreground text-sm" style={{ fontFamily: 'var(--font-body)' }}>{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-secondary p-8 rounded-lg border border-primary/30 text-center max-w-md mx-auto">
                <h3 className="text-2xl text-primary mb-3" style={{ fontFamily: 'var(--font-display)' }}>Menu complet</h3>
                <p className="text-muted-foreground mb-4 text-sm" style={{ fontFamily: 'var(--font-body)' }}>Entrée · Plat · Fromage · Dessert</p>
                <span className="text-3xl text-primary/90" style={{ fontFamily: 'var(--font-display)' }}>68€</span>
                <p className="text-muted-foreground mt-3 text-xs" style={{ fontFamily: 'var(--font-body)' }}>Uniquement le dimanche à partir de 12h — Réservation conseillée</p>
              </div>
            </TabsContent>

            {/* ── Carte du soir ───────────────────────────────────────────── */}
            <TabsContent value="soir">
              <p className="text-muted-foreground text-sm text-center mb-10" style={{ fontFamily: 'var(--font-body)' }}>
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
                <p className="text-foreground mb-2" style={{ fontFamily: 'var(--font-body)' }}>7 plats de saison composés par le Chef</p>
                <p className="text-muted-foreground mb-6 text-sm" style={{ fontFamily: 'var(--font-body)' }}>Accord mets et vins inclus — disponible uniquement le soir</p>
                <span className="text-3xl text-primary/90" style={{ fontFamily: 'var(--font-display)' }}>125€</span>
              </div>
            </TabsContent>

            {/* ── Vins ────────────────────────────────────────────────────── */}
            <TabsContent value="vins">
              <p className="text-muted-foreground text-sm text-center mb-10" style={{ fontFamily: 'var(--font-body)' }}>
                Une sélection soigneusement choisie par notre sommelier
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {wines.map((wine, index) => (
                  <div key={index} className="bg-secondary p-6 rounded-lg border border-primary/20 hover:border-primary/50 transition-colors duration-300">
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <div className="flex-1">
                        <h4 className="text-lg text-primary mb-1" style={{ fontFamily: 'var(--font-display)' }}>{wine.name}</h4>
                        <p className="text-xs text-primary/70 uppercase tracking-wide mb-2" style={{ fontFamily: 'var(--font-body)' }}>{wine.type}</p>
                        <p className="text-sm text-muted-foreground" style={{ fontFamily: 'var(--font-body)' }}>{wine.description}</p>
                      </div>
                      <span className="text-lg text-primary/90 shrink-0" style={{ fontFamily: 'var(--font-body)' }}>{wine.price}</span>
                    </div>
                  </div>
                ))}
              </div>
              <img
                src="https://images.unsplash.com/photo-1769697064243-889f2e25d44a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW5lJTIwY2VsbGFyJTIwYm90dGxlcyUyMGVsZWdhbnR8ZW58MXx8fHwxNzcxNDkzNTEwfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Cave à vins"
                className="w-full h-[360px] object-cover rounded-lg border-2 border-primary/30 mb-8"
              />
              <div className="bg-secondary p-6 rounded-lg border border-primary/30 text-center">
                <p className="text-foreground" style={{ fontFamily: 'var(--font-body)' }}>Notre sommelier se fera un plaisir de vous conseiller selon vos préférences et vos plats</p>
              </div>
            </TabsContent>

            {/* ── Cocktails ───────────────────────────────────────────────── */}
            <TabsContent value="cocktails">
              <p className="text-muted-foreground text-sm text-center mb-10" style={{ fontFamily: 'var(--font-body)' }}>
                Créations de notre bartender — servis au bar ou en table
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {cocktails.map((cocktail, index) => (
                  <div key={index} className="bg-secondary p-6 rounded-lg border border-primary/20 hover:border-primary/50 transition-colors duration-300">
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <h4 className="text-xl text-primary" style={{ fontFamily: 'var(--font-display)' }}>{cocktail.name}</h4>
                      <span className="text-lg text-primary/90 shrink-0" style={{ fontFamily: 'var(--font-body)' }}>{cocktail.price}</span>
                    </div>
                    <p className="text-sm text-muted-foreground" style={{ fontFamily: 'var(--font-body)' }}>{cocktail.description}</p>
                  </div>
                ))}
              </div>
              {/* Mentions légales obligatoires */}
              <div className="bg-secondary/60 rounded-lg border border-primary/20 p-6 text-center space-y-2">
                <p className="text-foreground font-medium" style={{ fontFamily: 'var(--font-body)' }}>
                  L&apos;abus d&apos;alcool est dangereux pour la santé — À consommer avec modération
                </p>
                <p className="text-muted-foreground text-sm" style={{ fontFamily: 'var(--font-body)' }}>
                  La vente d&apos;alcool aux mineurs est interdite — Loi Évin
                </p>
                <p className="text-muted-foreground text-xs mt-3" style={{ fontFamily: 'var(--font-body)' }}>
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
