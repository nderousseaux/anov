interface HistoireContent {
  introTitle?: string | null;
  introText1?: string | null;
  introText2?: string | null;
  chefImage?: string | null;
  chefName?: string | null;
  chefText1?: string | null;
  chefText2?: string | null;
  visionTitle?: string | null;
  visionText1?: string | null;
  visionText2?: string | null;
  visionText3?: string | null;
  visionImage1?: string | null;
  visionImage2?: string | null;
  productsImage?: string | null;
  productsTitle?: string | null;
  productsText1?: string | null;
  productsText2?: string | null;
  teamImage?: string | null;
  teamTitle?: string | null;
  teamText1?: string | null;
  teamText2?: string | null;
  teamText3?: string | null;
  wineTitle?: string | null;
  wineText1?: string | null;
  wineText2?: string | null;
  wineText3?: string | null;
  wineImage?: string | null;
  gestureImage?: string | null;
  gestureTitle?: string | null;
  gestureText?: string | null;
  engagementTitle?: string | null;
  engagementText1?: string | null;
  engagementText2?: string | null;
}

export function History({ content }: { content?: HistoireContent | null }) {
  const c = content ?? {};
  return (
    <section id="history" className="bg-background">
      {/* Introduction avec plus d'espace */}
      <div className="py-20 md:py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-20">
            <h2
              className="text-4xl sm:text-5xl md:text-6xl mb-8 text-primary"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {c.introTitle ?? 'Notre Histoire'}
            </h2>
            <p
              className="text-base sm:text-xl text-foreground max-w-4xl mx-auto leading-relaxed mb-6"
            >
              {c.introText1 ?? ''}
            </p>
            <p
              className="text-sm sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            >
              {c.introText2 ?? ''}
            </p>
          </div>
        </div>
      </div>

      {/* Full Width Image - Chef avec overlay */}
      <div className="relative">
        <div className="relative h-screen w-full">
          <img
            src={c.chefImage ?? "https://images.unsplash.com/photo-1759521296047-89338c8e083d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwcG9ydHJhaXQlMjBwcm9mZXNzaW9uYWwlMjBraXRjaGVufGVufDF8fHx8MTc3MTQ3NTM2Nnww&ixlib=rb-4.1.0&q=80&w=1080"}
            alt="Chef Antoine Dubois"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>

        {/* Espace de respiration */}
        <div className="h-20 bg-background" />

        <div className="absolute bottom-0 sm:bottom-20 left-0 right-0 p-8 sm:p-16 md:p-24">
          <div className="max-w-5xl mx-auto">
            <h3
              className="text-4xl sm:text-5xl md:text-6xl mb-6 text-primary"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {c.chefName ?? 'Chef Antoine Dubois'}
            </h3>
            <p
              className="text-base sm:text-xl text-foreground mb-5 leading-relaxed"
            >
              {c.chefText1 ?? ''}
            </p>
            <p
              className="text-sm sm:text-lg text-muted-foreground leading-relaxed"
            >
              {c.chefText2 ?? ''}
            </p>
          </div>
        </div>
      </div>

      {/* Story Section 1 - Vision */}
      <div className="py-28 md:py-32 px-4 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-16 items-center mb:10 sm:mb-24">
            <div>
              <h3
                className="text-4xl sm:text-5xl md:text-6xl mb-6 text-primary"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {c.visionTitle ?? 'Une Vision, Une Passion'}
              </h3>
              <p
                className="text-base sm:text-xl text-foreground mb-6 leading-relaxed"
              >
                {c.visionText1 ?? ''}
              </p>
              <p
                className="text-sm sm:text-lg text-muted-foreground leading-relaxed mb-6"
              >
                {c.visionText2 ?? ''}
              </p>
              <p
                className="text-sm sm:text-lg text-muted-foreground leading-relaxed"
              >
                {c.visionText3 ?? ''}
              </p>
            </div>
            <div className="group overflow-hidden rounded-lg border-2 border-primary/30 shadow-2xl hover:border-primary transition-all duration-300">
              <img
                src={c.visionImage1 ?? "https://images.unsplash.com/photo-1765099271664-614c541196ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwdGFibGUlMjBzZXR0aW5nJTIwYW1iaWFuY2V8ZW58MXx8fHwxNzcxNDMyNjA1fDA&ixlib=rb-4.1.0&q=80&w=1080"}
                alt="Table dressée"
                className="w-full h-[560px] object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Image supplémentaire dans cette section */}
          <div className="w-full h-[480px] group overflow-hidden rounded-lg border-2 border-primary/30 shadow-2xl hover:border-primary transition-all duration-300 hidden sm:block">
            <img
              src={c.visionImage2 ?? "https://images.unsplash.com/photo-1761095596849-608b6a337c36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5lJTIwZGluaW5nJTIwZXhwZXJpZW5jZSUyMGVsZWdhbnQlMjB0YWJsZXxlbnwxfHx8fDE3NzE1OTQ1NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080"}
              alt="Expérience gastronomique"
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        </div>
      </div>

      {/* Full Width Image - Ingredients */}
      <div className="relative">
        <div className="relative h-screen w-full">
          <img
            src={c.productsImage ?? "https://images.unsplash.com/photo-1758221055278-cfff8d83b091?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGluZ3JlZGllbnRzJTIwdmVnZXRhYmxlcyUyMGdvdXJtZXR8ZW58MXx8fHwxNzcxNTA5NTc4fDA&ixlib=rb-4.1.0&q=80&w=1080"}
            alt="Ingrédients frais"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        </div>

        {/* Espace de respiration */}
        <div className="h-20 bg-background" />

        <div className="absolute bottom-0 sm:bottom-20 left-0 right-0 p-8 sm:p-16 md:p-24">
          <div className="max-w-5xl mx-auto">
            <h3
              className="text-4xl sm:text-5xl md:text-6xl mb-6 text-primary"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {c.productsTitle ?? "L'Excellence des Produits"}
            </h3>
            <p
              className="text-base sm:text-xl text-foreground mb-5 leading-relaxed"
            >
              {c.productsText1 ?? ''}
            </p>
            <p
              className="text-sm sm:text-lg text-muted-foreground leading-relaxed"
            >
              {c.productsText2 ?? ''}
            </p>
          </div>
        </div>
      </div>

      {/* Story Section 2 - Team & Craft */}
      <div className="py-28 md:py-32 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          {/* L'Équipe */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-16 items-center mb-24">
            <div className="order-2 lg:order-1 group overflow-hidden rounded-lg border-2 border-primary/30 shadow-2xl hover:border-primary transition-all duration-300">
              <img
                src={c.teamImage ?? "https://images.unsplash.com/photo-1762113246607-4299ec3f3214?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwdGVhbSUyMHN0YWZmJTIwc2VydmljZXxlbnwxfHx8fDE3NzE1OTQ1NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080"}
                alt="Notre équipe"
                className="w-full h-[560px] object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h3
                className="text-4xl sm:text-5xl md:text-6xl mb-6 text-primary"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {c.teamTitle ?? "Une Équipe d'Exception"}
              </h3>
              <p
                className="text-base sm:text-xl text-foreground mb-6 leading-relaxed"
              >
                {c.teamText1 ?? ''}
              </p>
              <p
                className="text-sm sm:text-lg text-muted-foreground mb-6 leading-relaxed"
              >
                {c.teamText2 ?? ''}
              </p>
              <p
                className="text-sm sm:text-lg text-muted-foreground leading-relaxed"
              >
                {c.teamText3 ?? ''}
              </p>
            </div>
          </div>

          {/* La Cave */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-16 items-center">
            <div>
              <h3
                className="text-4xl sm:text-5xl md:text-6xl mb-6 text-primary"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {c.wineTitle ?? "Une Cave d'Exception"}
              </h3>
              <p
                className="text-base sm:text-xl text-foreground mb-6 leading-relaxed"
              >
                {c.wineText1 ?? ''}
              </p>
              <p
                className="text-sm sm:text-lg text-muted-foreground mb-6 leading-relaxed"
              >
                {c.wineText2 ?? ''}
              </p>
              <p
                className="text-sm sm:text-lg text-muted-foreground leading-relaxed"
              >
                {c.wineText3 ?? ''}
              </p>
            </div>
            <div className="group overflow-hidden rounded-lg border-2 border-primary/30 shadow-2xl hover:border-primary transition-all duration-300">
              <img
                src={c.wineImage ?? "https://images.unsplash.com/photo-1769697064243-889f2e25d44a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW5lJTIwY2VsbGFyJTIwYm90dGxlcyUyMGVsZWdhbnR8ZW58MXx8fHwxNzcxNDkzNTEwfDA&ixlib=rb-4.1.0&q=80&w=1080"}
                alt="Cave à vins"
                className="w-full h-[560px] object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Full Width Image - Cooking Process */}
      <div className="relative">
        <div className="relative h-screen w-full">
          <img
            src={c.gestureImage ?? "https://images.unsplash.com/photo-1765448856945-481569592cf3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwY29va2luZyUyMGZpcmUlMjBraXRjaGVuJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3MTU5NDU3NXww&ixlib=rb-4.1.0&q=80&w=1080"}
            alt="Maîtrise du feu"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background" />
        </div>

        {/* Espace de respiration */}
        <div className="h-20 bg-background" />

        <div className="absolute bottom-0 sm:bottom-20 left-0 right-0 p-8 sm:p-16 md:p-24">
          <div className="max-w-5xl mx-auto">
            <h3
              className="text-4xl sm:text-5xl md:text-6xl mb-6 text-primary"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {c.gestureTitle ?? 'La Maîtrise du Geste'}
            </h3>
            <p
              className="text-base sm:text-xl text-foreground leading-relaxed"
            >
              {c.gestureText ?? ''}
            </p>
          </div>
        </div>
      </div>

      {/* Philosophie finale */}
      <div className="py-28 md:py-32 px-4 bg-background">
        <div className="max-w-5xl mx-auto text-center">
          <h3
            className="text-4xl sm:text-5xl md:text-6xl mb-8 text-primary"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {c.engagementTitle ?? 'Notre Engagement'}
          </h3>
          <p
            className="text-base sm:text-xl text-foreground mb-6 leading-relaxed"
          >
            {c.engagementText1 ?? ''}
          </p>
          <p
            className="text-sm sm:text-lg text-muted-foreground leading-relaxed"
          >
            {c.engagementText2 ?? ''}
          </p>
        </div>
      </div>
    </section>
  );
}
