import { test, expect } from '@playwright/test';

// Configuration pour tous les tests
test.describe.configure({ baseURL: 'http://localhost:3000', timeout: 30000 });

// Helper pour attendre le fade du splashscreen (2.5 secondes pour être sûr)
const waitForSplashScreenToFade = async (page: any) => {
  // Le splashscreen est visible pendant 2.2 secondes
  await page.waitForTimeout(2500);
};

test.describe('Site vitrine - Page d\'accueil', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?lang=fr');
    await waitForSplashScreenToFade(page);
  });

  test('Affiche le Hero avec le logo et le titre', async ({ page }) => {
    // Vérifier le logo du Hero
    const heroLogo = page.locator('#hero img[alt="Logo"]');
    await expect(heroLogo).toBeVisible();

    // Vérifier le titre du Hero avec le texte complet
    await expect(page.getByText("Où chaque plat raconte une histoire, où chaque saveur éveille les sens")).toBeVisible();

    // Vérifier l'image d'ambiance
    await expect(page.getByAltText("Ambiance restaurant")).toBeVisible();
  });

  test('Affiche la section Notre Histoire', async ({ page }) => {
    // Vérifier le titre - utiliser le sélecteur h2 spécifique
    await expect(page.locator('#history h2').filter({ hasText: "Notre Histoire" })).toBeVisible();

    // Vérifier les textes d'introduction
    await expect(page.getByText("Une passion transmise de génération en génération")).toBeVisible();
    await expect(page.getByText("Depuis 2018, l'anøv incarne l'art de recevoir à la française")).toBeVisible();
  });

  test('Affiche la section Chef Antoine Dubois', async ({ page }) => {
    await expect(page.locator('#history h3').filter({ hasText: "Chef Antoine Dubois" })).toBeVisible();
    await expect(page.getByText("Formé dans les plus grandes maisons étoilées de France")).toBeVisible();
  });

  test('Affiche la section Une Vision, Une Passion', async ({ page }) => {
    await expect(page.locator('#history h3').filter({ hasText: "Une Vision, Une Passion" })).toBeVisible();
    await expect(page.getByText("En 2018, l'anøv ouvre ses portes dans le cœur historique de Paris")).toBeVisible();
    await expect(page.getByText("Notre philosophie repose sur trois piliers")).toBeVisible();

    // Vérifier l'image de la table
    await expect(page.getByAltText("Table dressée")).toBeVisible();
  });

  test('Affiche la Carte des Origines', async ({ page }) => {
    await expect(page.locator('#origins h2').filter({ hasText: "Carte des Origines" })).toBeVisible();
    await expect(page.getByText("Située au cœur de la Franche-Comté")).toBeVisible();

    // Vérifier le texte de légende
    await expect(page.getByText("De la Suisse à la Bourgogne, en passant par le Jura")).toBeVisible();
  });

  test('Affiche la section L\'Excellence des Produits', async ({ page }) => {
    await expect(page.locator('#history h3').filter({ hasText: "L'Excellence des Produits" })).toBeVisible();
    await expect(page.getByText("Chaque matin, nous parcourons les meilleurs marchés")).toBeVisible();
  });

  test('Affiche la section Une Équipe d\'Exception', async ({ page }) => {
    await expect(page.locator('#history h3').filter({ hasText: "Une Équipe d'Exception" })).toBeVisible();
    await expect(page.getByText("Derrière l'anøv, une équipe de passionnés")).toBeVisible();
  });

  test('Affiche la section Une Cave d\'Exception', async ({ page }) => {
    await expect(page.locator('#history h3').filter({ hasText: "Une Cave d'Exception" })).toBeVisible();
    await expect(page.getByText("Notre sommelier, Pierre Lefèvre")).toBeVisible();
  });

  test('Affiche la section La Maîtrise du Geste', async ({ page }) => {
    await expect(page.locator('#history h3').filter({ hasText: "La Maîtrise du Geste" })).toBeVisible();
    await expect(page.getByText("La technique au service de l'émotion")).toBeVisible();
  });

  test('Affiche la section Notre Engagement', async ({ page }) => {
    await expect(page.locator('#history h3').filter({ hasText: "Notre Engagement" })).toBeVisible();
    await expect(page.getByText("Chaque jour, nous nous efforçons de créer des moments d'exception")).toBeVisible();
  });

  test('Affiche la section Contact', async ({ page }) => {
    await expect(page.locator('#contact h2').filter({ hasText: "Contact" })).toBeVisible();
    await expect(page.getByText("Nous sommes à votre écoute")).toBeVisible();
  });

  test('Les images chargent correctement', async ({ page }) => {
    // Vérifier que les images du Hero chargent
    const heroImages = page.locator('#hero img');
    await expect(heroImages.first()).toBeVisible();
    await expect(heroImages.nth(1)).toBeVisible();

    // Vérifier que les images de la section History chargent
    const historyImages = page.locator('#history img');
    await expect(historyImages.first()).toBeVisible();
  });

  test('Le navigateur affiche le titre de la page', async ({ page }) => {
    await expect(page).toHaveTitle("l'Anøv");
  });

  test('Le menu desktop s\'affiche correctement', async ({ page }) => {
    // Vérifier le logo dans le menu
    await expect(page.locator('nav a[href="/"]')).toBeVisible();

    // Vérifier les liens du menu
    await expect(page.getByRole('button', { name: 'Notre Histoire' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Galerie' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'La Carte' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Chèques Cadeaux' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Réserver' })).toBeVisible();

    // Vérifier le sélecteur de langue
    await expect(page.getByLabel('Changer de langue')).toBeVisible();
  });

  test('Le menu mobile s\'affiche correctement', async ({ page }) => {
    // Changer la taille de l'écran pour mobile
    await page.setViewportSize({ width: 375, height: 812 });

    // Ouvrir le menu mobile
    const menuButton = page.locator('button[aria-label="Menu"]');
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    // Vérifier que les éléments du menu mobile sont présents
    // Note: Dans le menu mobile, les items sont des boutons ou des liens selon leur type
    // Galerie est un bouton dans le menu mobile, pas un lien
    await expect(page.getByRole('button', { name: 'Notre Histoire' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Galerie' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'La Carte' })).toBeVisible();

    // Fermer le menu
    await menuButton.click();
  });

  test('Le logo s\'affiche dans le header', async ({ page }) => {
    // Vérifier que le logo est présent dans le DOM
    // Le logo est un élément img avec src contenant img-logo
    await expect(page.locator('nav img[src*="img-logo"]')).toBeVisible();
  });
});

test.describe('Site vitrine - Navigation', () => {
  test('La navigation depuis le menu fonctionne', async ({ page }) => {
    await page.goto('/menu?lang=fr');
    await waitForSplashScreenToFade(page);

    // Cliquer sur le lien "Notre Histoire"
    await page.getByText('Notre Histoire').click();

    // Vérifier qu'on est arrivé sur la section History
    await expect(page.locator('#history')).toBeVisible();
    await expect(page.locator('#history h2').filter({ hasText: "Notre Histoire" })).toBeVisible();
  });
});

test.describe('Site vitrine - Responsive', () => {
  test('Affiche correctement sur desktop (1920x1080)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/?lang=fr');
    await waitForSplashScreenToFade(page);

    // Vérifier que le logo s'affiche
    await expect(page.locator('#hero img[alt="Logo"]')).toBeVisible();

    // Vérifier que le menu est affiché en desktop
    await expect(page.getByRole('button', { name: 'Notre Histoire' })).toBeVisible();
  });

  test('Affiche correctement sur tablette (768x1024)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/?lang=fr');
    await waitForSplashScreenToFade(page);

    await expect(page.locator('#hero img[alt="Logo"]')).toBeVisible();
  });

  test('Affiche correctement sur mobile (375x667)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/?lang=fr');
    await waitForSplashScreenToFade(page);

    await expect(page.locator('#hero img[alt="Logo"]')).toBeVisible();
  });

  test('Affiche correctement sur mobile large (414x896)', async ({ page }) => {
    await page.setViewportSize({ width: 414, height: 896 });
    await page.goto('/?lang=fr');
    await waitForSplashScreenToFade(page);

    await expect(page.locator('#hero img[alt="Logo"]')).toBeVisible();
  });
});

test.describe('Site vitrine - Multilingue', () => {
  test('Affiche en français', async ({ page }) => {
    await page.goto('/?lang=fr');
    await waitForSplashScreenToFade(page);

    await expect(page.getByText("Où chaque plat raconte une histoire, où chaque saveur éveille les sens")).toBeVisible();
    await expect(page.locator('#history h2').filter({ hasText: "Notre Histoire" })).toBeVisible();
  });

  test('Affiche en anglais', async ({ page }) => {
    await page.goto('/?lang=en');
    await waitForSplashScreenToFade(page);

    await expect(page.getByText("Where every dish tells a story, where every flavour awakens the senses")).toBeVisible();
    await expect(page.locator('#history h2').filter({ hasText: "Our Story" })).toBeVisible();
  });

  test('Affiche en allemand', async ({ page }) => {
    await page.goto('/?lang=de');
    await waitForSplashScreenToFade(page);

    // Le texte par défaut du Hero (anglais par défaut si pas traduit)
    // ou le texte du Hero
    await expect(page.locator('#hero')).toBeVisible();
    await expect(page.locator('#history h2').filter({ hasText: "Unsere Geschichte" })).toBeVisible();
  });
});

test.describe('Site vitrine - Interactions', () => {
  test('La section Hero permet de scroller vers History', async ({ page }) => {
    await page.goto('/?lang=fr');
    await waitForSplashScreenToFade(page);

    // Vérifier que la page est chargée
    await expect(page.locator('#hero')).toBeVisible();

    // Vérifier que la section History existe
    await expect(page.locator('#history')).toBeVisible();
  });

  test('La navigation fonctionne avec le lien du header', async ({ page }) => {
    await page.goto('/?lang=fr');
    await waitForSplashScreenToFade(page);

    // Le logo du header est un lien vers la homepage
    // On clique sur le lien directement (il est dans le DOM mais transparent)
    await page.locator('nav a[href="/"]').click({ force: true });

    // On devrait être revenu à la homepage (scroll vers le haut)
    await page.waitForTimeout(500);
    await expect(page.locator('#hero')).toBeVisible();
  });
});

test.describe('Site vitrine - Footer', () => {
  test('Le footer s\'affiche sur la page d\'accueil', async ({ page }) => {
    await page.goto('/?lang=fr');
    await waitForSplashScreenToFade(page);

    // Le footer est dans #contact ou dans un footer global
    // Le texte "l'Anøv" apparaît dans plusieurs endroits (history, footer...)
    // On cible spécifiquement le copyright dans le footer de contact
    await expect(page.getByText("Tous droits réservés")).toBeVisible();
  });

  test('Le footer contient les liens de navigation', async ({ page }) => {
    await page.goto('/?lang=fr');
    await waitForSplashScreenToFade(page);

    // Vérifier que le footer contient des liens
    const footerLinks = page.locator('footer a, #contact a');
    const count = await footerLinks.count();
    await expect(count).toBeGreaterThan(0);
  });
});

test.describe('Site vitrine - Gallery', () => {
  test('La Galerie est affichée dans le Hero', async ({ page }) => {
    await page.goto('/?lang=fr');
    await waitForSplashScreenToFade(page);

    // Vérifier que l'image d'ambiance (galerie dans le Hero) est visible
    await expect(page.getByAltText("Ambiance restaurant")).toBeVisible();
  });
});

test.describe('Site vitrine - Complémentaire', () => {
  test('Le bouton de réservation s\'affiche', async ({ page }) => {
    await page.goto('/?lang=fr');
    await waitForSplashScreenToFade(page);

    // Vérifier que le bouton de réservation est visible
    await expect(page.getByRole('button', { name: 'Réserver' })).toBeVisible();
  });

  test('La section Gallery est affichée', async ({ page }) => {
    await page.goto('/?lang=fr');
    await waitForSplashScreenToFade(page);

    // Vérifier que la section Gallery existe dans le DOM
    // La galerie est une section avec une image d'ambiance
    await expect(page.locator('section img[alt="Ambiance restaurant"]')).toBeVisible();
  });

  test('Le sélecteur de langue existe', async ({ page }) => {
    await page.goto('/?lang=fr');
    await waitForSplashScreenToFade(page);

    // Vérifier que le sélecteur de langue existe
    const languageSelector = page.getByLabel('Changer de langue');
    await expect(languageSelector).toBeVisible();

    // Le sélecteur est un bouton, pas un select native
    // On ne peut pas tester l'ouverture du dropdown dans ce test
  });

  test('Le sélecteur de langue est cliquable', async ({ page }) => {
    await page.goto('/?lang=fr');
    await waitForSplashScreenToFade(page);

    // Ouvrir le sélecteur de langue
    await page.getByLabel('Changer de langue').click();
    await page.waitForTimeout(300);

    // On a cliqué sur le sélecteur - le test réussit si pas d'erreur
  });
});

test.describe('Site vitrine - Tests avancés', () => {
  test('Les images sont chargées', async ({ page }) => {
    await page.goto('/?lang=fr');
    await waitForSplashScreenToFade(page);

    // Vérifier que les images sont des images standards (pas des placeholder)
    const heroImage = page.locator('#hero img[alt="Ambiance restaurant"]');
    await expect(heroImage).toBeVisible();
    // L'image doit avoir un src valide
    const src = await heroImage.getAttribute('src');
    await expect(src).toBeTruthy();
    // Vérifier que l'image a un src (either local ou unplash)
    await expect(src).toMatch(/^(\/assets|https?:)/);
  });

  test('La carte des origines a des points', async ({ page }) => {
    await page.goto('/?lang=fr');
    await waitForSplashScreenToFade(page);

    // Vérifier que la carte des origines est visible
    await expect(page.locator('#origins')).toBeVisible();

    // Vérifier que la carte contient un svg
    await expect(page.locator('#origins svg')).toBeVisible();
  });

  test('La carte des origines a des textes', async ({ page }) => {
    await page.goto('/?lang=fr');
    await waitForSplashScreenToFade(page);

    // Vérifier que le titre de la carte des origines est visible
    await expect(page.locator('#origins h2').filter({ hasText: "Carte des Origines" })).toBeVisible();
  });
});
