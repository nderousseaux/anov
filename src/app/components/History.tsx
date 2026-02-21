import React from 'react';

export function History() {
  return (
    <section id="history" className="bg-background">
      {/* Introduction avec plus d'espace */}
      <div className="py-40 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2
              className="text-6xl sm:text-7xl md:text-8xl mb-12 text-primary"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Notre Histoire
            </h2>
            <p
              className="text-2xl sm:text-3xl text-muted-foreground max-w-5xl mx-auto leading-relaxed mb-8"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Une passion transmise de génération en génération, un engagement envers l'excellence,
              et une vision unique de la gastronomie moderne.
            </p>
            <p
              className="text-xl sm:text-2xl text-foreground max-w-4xl mx-auto leading-relaxed"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Depuis 2018, l’anøv incarne l'art de recevoir à la française,
              où chaque détail compte et où chaque instant devient un souvenir inoubliable.
            </p>
          </div>
        </div>
      </div>

      {/* Full Width Image - Chef avec overlay */}
      <div className="relative h-screen w-full">
        <img
          src="https://images.unsplash.com/photo-1759521296047-89338c8e083d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwcG9ydHJhaXQlMjBwcm9mZXNzaW9uYWwlMjBraXRjaGVufGVufDF8fHx8MTc3MTQ3NTM2Nnww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Chef Antoine Dubois"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-16 md:p-24">
          <div className="max-w-5xl mx-auto">
            <h3
              className="text-5xl sm:text-6xl md:text-7xl mb-8 text-primary"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Chef Antoine Dubois
            </h3>
            <p
              className="text-xl sm:text-2xl md:text-3xl text-foreground mb-6 leading-relaxed"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Formé dans les plus grandes maisons étoilées de France, Antoine a parcouru le monde
              pour découvrir de nouvelles saveurs et techniques.
            </p>
            <p
              className="text-lg sm:text-xl text-muted-foreground leading-relaxed"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Son retour à Paris marque le début d'une aventure unique : créer un lieu où tradition
              et innovation se rencontrent, où le respect des produits s'allie à une créativité sans limite.
            </p>
          </div>
        </div>
      </div>

      {/* Espace de respiration */}
      <div className="h-32 bg-background" />

      {/* Story Section 1 - Vision */}
      <div className="py-40 px-4 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
            <div>
              <h3
                className="text-5xl sm:text-6xl mb-10 text-primary"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Une Vision, Une Passion
              </h3>
              <p
                className="text-xl text-foreground mb-8 leading-relaxed"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                En 2018, l’anøv ouvre ses portes dans le cœur historique de Paris.
                L'idée ? Créer un sanctuaire gastronomique où chaque détail compte,
                où chaque plat est une célébration des produits d'exception.
              </p>
              <p
                className="text-xl text-muted-foreground mb-8 leading-relaxed"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Notre philosophie repose sur trois piliers : le respect du produit,
                la créativité sans compromis, et une expérience client irréprochable.
              </p>
              <p
                className="text-lg text-muted-foreground leading-relaxed"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Ces valeurs guident chaque décision, de la sélection des ingrédients
                au service en salle. Elles sont au cœur de notre identité et font de chaque
                repas un moment d'exception.
              </p>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1765099271664-614c541196ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwdGFibGUlMjBzZXR0aW5nJTIwYW1iaWFuY2V8ZW58MXx8fHwxNzcxNDMyNjA1fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Table dressée"
                className="w-full h-[700px] object-cover rounded-lg shadow-2xl border-2 border-primary/30"
              />
            </div>
          </div>

          {/* Image supplémentaire dans cette section */}
          <div className="w-full h-[600px]">
            <img
              src="https://images.unsplash.com/photo-1761095596849-608b6a337c36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5lJTIwZGluaW5nJTIwZXhwZXJpZW5jZSUyMGVsZWdhbnQlMjB0YWJsZXxlbnwxfHx8fDE3NzE1OTQ1NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Expérience gastronomique"
              className="w-full h-full object-cover rounded-lg shadow-2xl border-2 border-primary/30"
            />
          </div>
        </div>
      </div>

      {/* Full Width Image - Ingredients */}
      <div className="relative h-screen w-full">
        <img
          src="https://images.unsplash.com/photo-1758221055278-cfff8d83b091?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGluZ3JlZGllbnRzJTIwdmVnZXRhYmxlcyUyMGdvdXJtZXR8ZW58MXx8fHwxNzcxNTA5NTc4fDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Ingrédients frais"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-16 md:p-24">
          <div className="max-w-5xl mx-auto">
            <h3
              className="text-5xl sm:text-6xl md:text-7xl mb-8 text-primary"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              L'Excellence des Produits
            </h3>
            <p
              className="text-xl sm:text-2xl md:text-3xl text-foreground mb-6 leading-relaxed"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Chaque matin, nous parcourons les meilleurs marchés pour sélectionner
              les produits les plus frais et savoureux.
            </p>
            <p
              className="text-lg sm:text-xl text-muted-foreground leading-relaxed"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Des légumes bio de nos maraîchers partenaires aux poissons de ligne de Bretagne,
              chaque ingrédient est choisi avec le plus grand soin. Nous privilégions les circuits courts
              et les producteurs locaux qui partagent notre passion pour l'excellence.
            </p>
          </div>
        </div>
      </div>

      {/* Espace de respiration */}
      <div className="h-32 bg-background" />

      {/* Story Section 2 - Team & Craft */}
      <div className="py-40 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          {/* L'Équipe */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
            <div className="order-2 lg:order-1">
              <img
                src="https://images.unsplash.com/photo-1762113246607-4299ec3f3214?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwdGVhbSUyMHN0YWZmJTIwc2VydmljZXxlbnwxfHx8fDE3NzE1OTQ1NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Notre équipe"
                className="w-full h-[700px] object-cover rounded-lg shadow-2xl border-2 border-primary/30"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h3
                className="text-5xl sm:text-6xl mb-10 text-primary"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Une Équipe d'Exception
              </h3>
              <p
                className="text-xl text-foreground mb-8 leading-relaxed"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Derrière l’anøv, une équipe de passionnés travaille en parfaite harmonie.
                Du chef de cuisine au maître d'hôtel, chacun apporte son expertise et son dévouement
                pour créer une expérience unique.
              </p>
              <p
                className="text-xl text-muted-foreground mb-8 leading-relaxed"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Notre brigade compte 15 personnes en cuisine et 8 en salle, tous sélectionnés
                pour leur talent et leur attachement aux valeurs de la maison. L'esprit d'équipe
                et la rigueur sont nos moteurs quotidiens.
              </p>
              <p
                className="text-lg text-muted-foreground leading-relaxed"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Nous formons également de jeunes talents, transmettant notre savoir-faire
                et notre passion pour perpétuer l'excellence de la gastronomie française.
              </p>
            </div>
          </div>

          {/* La Cave */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h3
                className="text-5xl sm:text-6xl mb-10 text-primary"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Une Cave d'Exception
              </h3>
              <p
                className="text-xl text-foreground mb-8 leading-relaxed"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Notre sommelier, Pierre Lefèvre, a constitué une cave de plus de 800 références.
                Des grands crus classés aux pépites de vignerons indépendants, chaque bouteille
                a été sélectionnée pour sublimer notre cuisine.
              </p>
              <p
                className="text-xl text-muted-foreground mb-8 leading-relaxed"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                L'accord mets et vins est pour nous un art à part entière. Pierre travaille
                en étroite collaboration avec Antoine pour créer des harmonies parfaites,
                révélant le meilleur de chaque plat et de chaque vin.
              </p>
              <p
                className="text-lg text-muted-foreground leading-relaxed"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Notre cave climatisée abrite des trésors de toutes les régions viticoles françaises,
                mais aussi des découvertes venues d'ailleurs, d'Italie au Nouveau Monde.
              </p>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1769697064243-889f2e25d44a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW5lJTIwY2VsbGFyJTIwYm90dGxlcyUyMGVsZWdhbnR8ZW58MXx8fHwxNzcxNDkzNTEwfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Cave à vins"
                className="w-full h-[700px] object-cover rounded-lg shadow-2xl border-2 border-primary/30"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Full Width Image - Cooking Process */}
      <div className="relative h-screen w-full">
        <img
          src="https://images.unsplash.com/photo-1765448856945-481569592cf3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwY29va2luZyUyMGZpcmUlMjBraXRjaGVuJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3MTU5NDU3NXww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Maîtrise du feu"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background" />
        <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-16 md:p-24">
          <div className="max-w-5xl mx-auto">
            <h3
              className="text-5xl sm:text-6xl md:text-7xl mb-8 text-primary"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              La Maîtrise du Geste
            </h3>
            <p
              className="text-xl sm:text-2xl md:text-3xl text-foreground leading-relaxed"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              La technique au service de l'émotion, la précision au service de la créativité.
              Chaque plat est le fruit d'un savoir-faire méticuleux et d'une passion sans faille.
            </p>
          </div>
        </div>
      </div>

      {/* Espace de respiration */}
      <div className="h-32 bg-background" />

      {/* Philosophie finale */}
      <div className="py-40 px-4 bg-background">
        <div className="max-w-5xl mx-auto text-center">
          <h3
            className="text-5xl sm:text-6xl md:text-7xl mb-12 text-primary"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Notre Engagement
          </h3>
          <p
            className="text-2xl sm:text-3xl text-foreground mb-10 leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Chaque jour, nous nous efforçons de créer des moments d'exception,
            de surprendre et d'émouvoir nos convives.
          </p>
          <p
            className="text-xl sm:text-2xl text-muted-foreground leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Notre ambition n'est pas seulement de nourrir, mais de créer des souvenirs,
            de raconter des histoires à travers nos assiettes, et de perpétuer l'excellence
            de la gastronomie française pour les générations futures.
          </p>
        </div>
      </div>
    </section>
  );
}
