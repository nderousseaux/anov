import { config, fields, singleton } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },
  singletons: {
    hero: singleton({
      label: 'Hero',
      path: 'content/hero',
      schema: {
        image: fields.image({
          label: 'Image de fond',
          directory: 'public/assets',
          publicPath: '/assets/',
        }),
        subtitle: fields.text({
          label: 'Sous-titre',
          description: 'Texte affiché sous le titre principal sur la page d\'accueil',
        }),
      },
    }),
    histoire: singleton({
      label: 'Notre Histoire',
      path: 'content/histoire',
      schema: {
        introTitle: fields.text({ label: 'Section 1 — Titre' }),
        introText1: fields.text({ label: 'Section 1 — Paragraphe 1', multiline: true }),
        introText2: fields.text({ label: 'Section 1 — Paragraphe 2', multiline: true }),
        chefImage: fields.image({ label: 'Section 2 — Image', directory: 'public/assets/histoire', publicPath: '/assets/histoire/' }),
        chefName: fields.text({ label: 'Section 2 — Titre' }),
        chefText1: fields.text({ label: 'Section 2 — Paragraphe 1', multiline: true }),
        chefText2: fields.text({ label: 'Section 2 — Paragraphe 2', multiline: true }),
        visionTitle: fields.text({ label: 'Section 3 — Titre' }),
        visionText1: fields.text({ label: 'Section 3 — Paragraphe 1', multiline: true }),
        visionText2: fields.text({ label: 'Section 3 — Paragraphe 2', multiline: true }),
        visionText3: fields.text({ label: 'Section 3 — Paragraphe 3', multiline: true }),
        visionImage1: fields.image({ label: 'Section 3 — Image 1', directory: 'public/assets/histoire', publicPath: '/assets/histoire/' }),
        visionImage2: fields.image({ label: 'Section 3 — Image 2', directory: 'public/assets/histoire', publicPath: '/assets/histoire/' }),
        productsImage: fields.image({ label: 'Section 4 — Image', directory: 'public/assets/histoire', publicPath: '/assets/histoire/' }),
        productsTitle: fields.text({ label: 'Section 4 — Titre' }),
        productsText1: fields.text({ label: 'Section 4 — Paragraphe 1', multiline: true }),
        productsText2: fields.text({ label: 'Section 4 — Paragraphe 2', multiline: true }),
        teamImage: fields.image({ label: 'Section 5 — Image', directory: 'public/assets/histoire', publicPath: '/assets/histoire/' }),
        teamTitle: fields.text({ label: 'Section 5 — Titre' }),
        teamText1: fields.text({ label: 'Section 5 — Paragraphe 1', multiline: true }),
        teamText2: fields.text({ label: 'Section 5 — Paragraphe 2', multiline: true }),
        teamText3: fields.text({ label: 'Section 5 — Paragraphe 3', multiline: true }),
        wineTitle: fields.text({ label: 'Section 6 — Titre' }),
        wineText1: fields.text({ label: 'Section 6 — Paragraphe 1', multiline: true }),
        wineText2: fields.text({ label: 'Section 6 — Paragraphe 2', multiline: true }),
        wineText3: fields.text({ label: 'Section 6 — Paragraphe 3', multiline: true }),
        wineImage: fields.image({ label: 'Section 6 — Image', directory: 'public/assets/histoire', publicPath: '/assets/histoire/' }),
        gestureImage: fields.image({ label: 'Section 7 — Image', directory: 'public/assets/histoire', publicPath: '/assets/histoire/' }),
        gestureTitle: fields.text({ label: 'Section 7 — Titre' }),
        gestureText: fields.text({ label: 'Section 7 — Paragraphe', multiline: true }),
        engagementTitle: fields.text({ label: 'Section 8 — Titre' }),
        engagementText1: fields.text({ label: 'Section 8 — Paragraphe 1', multiline: true }),
        engagementText2: fields.text({ label: 'Section 8 — Paragraphe 2', multiline: true }),
      },
    }),
    galerie: singleton({
      label: 'Galerie',
      path: 'content/galerie',
      schema: {
        photos: fields.array(
          fields.object({
            image: fields.image({
              label: 'Image',
              directory: 'public/assets/gallery',
              publicPath: '/assets/gallery/',
            }),
            caption: fields.text({ label: 'Légende' }),
          }),
          { label: 'Photos' }
        ),
      },
    }),
    contact: singleton({
      label: 'Contact',
      path: 'content/contact',
      schema: {
        image: fields.image({
          label: 'Image de fond',
          directory: 'public/assets/contact',
          publicPath: '/assets/contact/',
        }),
        title: fields.text({ label: 'Titre' }),
        subtitle: fields.text({ label: 'Sous-titre' }),
        address: fields.text({ label: 'Adresse', multiline: true }),
        phone: fields.text({ label: 'Téléphone' }),
        email: fields.text({ label: 'Email' }),
        hoursLine1: fields.text({ label: 'Horaires — Ligne 1' }),
        hoursLine2: fields.text({ label: 'Horaires — Ligne 2' }),
        mapsUrl: fields.text({ label: 'Lien Google Maps' }),
      },
    }),
    menu: singleton({
      label: 'Menu',
      path: 'content/menu',
      schema: {
        heroImage: fields.text({ label: "Hero — URL de l'image" }),
        heroTitle: fields.text({ label: 'Hero — Titre' }),
        heroSubtitle: fields.text({ label: 'Hero — Sous-titre' }),

        semaineEntrees: fields.array(
          fields.object({
            name: fields.text({ label: 'Nom' }),
            description: fields.text({ label: 'Description' }),
            price: fields.text({ label: 'Prix' }),
          }),
          { label: 'Carte de la semaine — Entrées' }
        ),
        semainePlats: fields.array(
          fields.object({
            name: fields.text({ label: 'Nom' }),
            description: fields.text({ label: 'Description' }),
            price: fields.text({ label: 'Prix' }),
          }),
          { label: 'Carte de la semaine — Plats' }
        ),
        semaineDesserts: fields.array(
          fields.object({
            name: fields.text({ label: 'Nom' }),
            description: fields.text({ label: 'Description' }),
            price: fields.text({ label: 'Prix' }),
          }),
          { label: 'Carte de la semaine — Desserts' }
        ),
        semaineFormulePrix1: fields.text({ label: 'Formule midi — Prix (2 plats)' }),
        semaineFormulePrix2: fields.text({ label: 'Formule midi — Prix (3 plats)' }),

        dimancheTheme: fields.text({ label: 'Dimanche midi — Thème' }),
        dimancheDescription: fields.text({ label: 'Dimanche midi — Description', multiline: true }),
        dimancheMenu: fields.array(
          fields.object({
            course: fields.text({ label: 'Service (ex : Entrée)' }),
            name: fields.text({ label: 'Nom du plat' }),
            description: fields.text({ label: 'Description' }),
          }),
          { label: 'Dimanche midi — Plats' }
        ),
        dimanchePrix: fields.text({ label: 'Dimanche midi — Prix menu complet' }),

        soirEntrees: fields.array(
          fields.object({
            name: fields.text({ label: 'Nom' }),
            description: fields.text({ label: 'Description' }),
            price: fields.text({ label: 'Prix' }),
          }),
          { label: 'Carte du soir — Entrées' }
        ),
        soirPlats: fields.array(
          fields.object({
            name: fields.text({ label: 'Nom' }),
            description: fields.text({ label: 'Description' }),
            price: fields.text({ label: 'Prix' }),
          }),
          { label: 'Carte du soir — Plats' }
        ),
        soirDesserts: fields.array(
          fields.object({
            name: fields.text({ label: 'Nom' }),
            description: fields.text({ label: 'Description' }),
            price: fields.text({ label: 'Prix' }),
          }),
          { label: 'Carte du soir — Desserts' }
        ),
        soirDegustationPrix: fields.text({ label: 'Menu dégustation — Prix' }),

        vins: fields.array(
          fields.object({
            name: fields.text({ label: 'Nom' }),
            type: fields.text({ label: 'Type / Appellation' }),
            description: fields.text({ label: 'Description' }),
            price: fields.text({ label: 'Prix' }),
          }),
          { label: 'Vins' }
        ),
        vinsImage: fields.text({ label: "Vins — URL de l'image" }),

        cocktails: fields.array(
          fields.object({
            name: fields.text({ label: 'Nom' }),
            description: fields.text({ label: 'Description' }),
            price: fields.text({ label: 'Prix' }),
          }),
          { label: 'Cocktails' }
        ),
      },
    }),
    footer: singleton({
      label: 'Footer',
      path: 'content/footer',
      schema: {
        description: fields.text({ label: 'Description', multiline: true }),
        facebookUrl: fields.text({ label: 'Facebook — URL' }),
        instagramUrl: fields.text({ label: 'Instagram — URL' }),
        youtubeUrl: fields.text({ label: 'YouTube — URL' }),
        reviews: fields.array(
          fields.object({
            name: fields.text({ label: 'Plateforme' }),
            rating: fields.text({ label: 'Note' }),
            reviewCount: fields.text({ label: "Nombre d'avis" }),
          }),
          { label: 'Avis' }
        ),
        paymentMethods: fields.text({
          label: 'Moyens de paiement',
          description: 'Ex : CB · Visa · Mastercard · Espèces',
        }),
      },
    }),
  },
});
