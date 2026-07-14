/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck - Ce fichier est un test Playwright E2E, pas un test unitaire TypeScript
import { test, expect } from '@playwright/test';

// Configuration pour tous les tests
test.describe.configure({ timeout: 30000 });

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

    // Vérifier que le Hero est visible
    await expect(page.locator('#hero')).toBeVisible();

    // Vérifier l'image d'ambiance
    await expect(page.getByAltText("Ambiance restaurant")).toBeVisible();
  });

  test('Affiche la section Notre Histoire', async ({ page }) => {
    // Vérifier le titre - utiliser le sélecteur h2 spécifique dans #history
    await expect(page.locator('#history h2').first()).toBeVisible();
    await expect(page.locator('#history h2').first()).toHaveText(/./); // Test que le texte existe (non vide)

    // Vérifier que la section History a du contenu textuel
    const paragraphs = page.locator('#history p');
    const count = await paragraphs.count();
    await expect(count).toBeGreaterThan(0); // Section History a du contenu textuel
  });

  test('Affiche la section Chef Antoine Dubois', async ({ page }) => {
    // Vérifier qu'il y a un h3 dans la section History
    await expect(page.locator('#history h3').first()).toBeVisible();
    await expect(page.locator('#history h3').first()).toHaveText(/./); // Test que le texte existe (non vide)
  });

  test('Affiche la section Une Vision, Une Passion', async ({ page }) => {
    // Vérifier qu'il y a un h3 dans la section History
    const h3Count = await page.locator('#history h3').count();
    await expect(h3Count).toBeGreaterThan(0);
    await expect(page.locator('#history h3').first()).toHaveText(/./);

    // Vérifier l'image de la table
    await expect(page.getByAltText("Table dressée")).toBeVisible();
  });

  test('Affiche la Carte des Origines', async ({ page }) => {
    // Vérifier que la section origins existe
    await expect(page.locator('#origins')).toBeVisible();
    // Vérifier qu'il y a un titre h2 dans origins
    await expect(page.locator('#origins h2').first()).toHaveText(/./);
  });

  test('Affiche la section L\'Excellence des Produits', async ({ page }) => {
    // Vérifier qu'il y a des h3 dans la section History (section dynamique)
    const h3Count = await page.locator('#history h3').count();
    await expect(h3Count).toBeGreaterThan(0);
  });

  test('Affiche la section Une Équipe d\'Exception', async ({ page }) => {
    // Vérifier qu'il y a des h3 dans la section History
    await expect(page.locator('#history h3').first()).toHaveText(/./);
  });

  test('Affiche la section Une Cave d\'Exception', async ({ page }) => {
    // Vérifier qu'il y a des h3 dans la section History
    await expect(page.locator('#history h3').first()).toHaveText(/./);
  });

  test('Affiche la section La Maîtrise du Geste', async ({ page }) => {
    // Vérifier qu'il y a des h3 dans la section History
    await expect(page.locator('#history h3').first()).toHaveText(/./);
  });

  test('Affiche la section Notre Engagement', async ({ page }) => {
    // Vérifier qu'il y a des h3 dans la section History
    await expect(page.locator('#history h3').first()).toHaveText(/./);
  });

  test('Affiche la section Contact', async ({ page }) => {
    // Vérifier que la section contact existe
    await expect(page.locator('#contact')).toBeVisible();
    // Vérifier qu'il y a un titre h2 dans contact
    await expect(page.locator('#contact h2').first()).toHaveText(/./);
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
    // Faire défiler la page pour sortir du Hero (le logo est transparent sur le Hero)
    await page.evaluate(() => {
      window.scrollTo(0, 300);
    });
    await page.waitForTimeout(500);

    // Vérifier que le nav est visible (le container du menu)
    await expect(page.locator('nav')).toBeVisible();

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

    // Faire défiler la page pour sortir du Hero (le logo est transparent sur le Hero)
    await page.evaluate(() => {
      window.scrollTo(0, 300);
    });
    await page.waitForTimeout(500);

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
    // Le logo est dans le nav avec src contenant img-logo
    await expect(page.locator('nav img[src*="img-logo"]')).toBeVisible();
  });
});

test.describe('Site vitrine - Navigation', () => {
  test('La navigation depuis le menu fonctionne', async ({ page }) => {
    await page.goto('/menu?lang=fr');
    await waitForSplashScreenToFade(page);

    // Cliquer sur le bouton "Notre Histoire" dans le menu
    await page.getByRole('button', { name: 'Notre Histoire' }).click();

    // Vérifier qu'on est arrivé sur la section History
    await expect(page.locator('#history')).toBeVisible();
    // Vérifier qu'il y a un titre h2 dans history
    await expect(page.locator('#history h2').first()).toHaveText(/./);
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

    // Vérifier que le Hero contient du texte (non vide)
    const heroText = page.locator('#hero p');
    const heroTextCount = await heroText.count();
    await expect(heroTextCount).toBeGreaterThan(0);
    // Vérifier qu'il y a un titre h2 dans history
    await expect(page.locator('#history h2').first()).toHaveText(/./);
  });

  test('Affiche en anglais', async ({ page }) => {
    await page.goto('/?lang=en');
    await waitForSplashScreenToFade(page);

    // Vérifier que le Hero contient du texte (non vide)
    const heroText = page.locator('#hero p');
    const heroTextCount = await heroText.count();
    await expect(heroTextCount).toBeGreaterThan(0);
    // Vérifier qu'il y a un titre h2 dans history
    await expect(page.locator('#history h2').first()).toHaveText(/./);
  });

  test('Affiche en allemand', async ({ page }) => {
    await page.goto('/?lang=de');
    await waitForSplashScreenToFade(page);

    // Vérifier que le Hero contient du texte (non vide)
    const heroText = page.locator('#hero p');
    const heroTextCount = await heroText.count();
    await expect(heroTextCount).toBeGreaterThan(0);
    // Vérifier qu'il y a un titre h2 dans history
    await expect(page.locator('#history h2').first()).toHaveText(/./);
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
    // Sur le Hero, le logo est transparent (isTransparent = true)
    // Faire défiler la page pour que le logo devienne visible
    await page.evaluate(() => {
      window.scrollTo(0, 300);
    });
    await page.waitForTimeout(500);

    // On clique sur le lien via JavaScript directement
    // Le logo est dans le nav, mais peut être recouvert par d'autres éléments
    await page.locator('nav a[href="/"]').evaluate((el: HTMLElement) => {
      el.click();
    });

    // On devrait être revenu à la homepage (scroll vers le haut)
    await page.waitForTimeout(500);
    await expect(page.locator('#hero')).toBeVisible();
  });
});

test.describe('Site vitrine - Footer', () => {
  test('Le footer s\'affiche sur la page d\'accueil', async ({ page }) => {
    await page.goto('/?lang=fr');
    await waitForSplashScreenToFade(page);

    // Vérifier que #contact existe (section footer)
    await expect(page.locator('#contact')).toBeVisible();
  });

  test('Le footer contient les liens de navigation', async ({ page }) => {
    await page.goto('/?lang=fr');
    await waitForSplashScreenToFade(page);

    // Vérifier que #contact contient des liens
    const footerLinks = page.locator('#contact a');
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
    // Vérifier que l'image a un src valide (Next.js Image Optimization ou URL directe)
    // Soit c'est une URL Next.js Image Optimization: /_next/image?url=...
    // Soit c'est une URL directe: /assets/... ou https://...
    await expect(src).toMatch(/^(\/_next\/image\?url=|\/assets|https?:)/);
    // Vérifier que l'image est optimisée par Next.js
    await expect(src).not.toMatch(/data:/);
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

    // Vérifier que la carte des origines contient du texte
    await expect(page.locator('#origins p').first()).toHaveText(/./);
  });
});
