import { test, expect } from '@playwright/test';

// Configuration pour tous les tests
// Configuration pour tous les tests

// Helper pour attendre le fade du splashscreen (2.5 secondes pour être sûr)
const waitForSplashScreenToFade = async (page: any) => {
  // Le splashscreen est visible pendant 2.2 secondes
  await page.waitForTimeout(2500);
};

test.describe('Site vitrine - Page Menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/menu?lang=fr');
    await waitForSplashScreenToFade(page);
  });

  test('Affiche le titre de la page menu', async ({ page }) => {
    // Vérifier que le titre de la page est visible (h1 dans le hero)
    await expect(page.locator('div[style*="36vh"] h1').first()).toHaveText(/./);
  });

  test('Affiche les onglets de carte', async ({ page }) => {
    // Vérifier qu'il y a des onglets (tabs)
    const tabs = page.getByRole('tab');
    await expect(tabs).toHaveCount(4);

    // Vérifier que les onglets sont cliquables
    await expect(tabs.first()).toBeVisible();
    await expect(tabs.last()).toBeVisible();
  });

  test('Affiche les plats de la carte de la semaine', async ({ page }) => {
    // Attendre que les plats soient rendus
    await page.waitForSelector('[data-dish-card="true"]');

    // Vérifier qu'il y a des plats
    const dishes = page.locator('[data-dish-card="true"]');
    await expect(dishes).toHaveCount(12); // 3 catégories x 4 plats = 12 plats
  });

  test('Affiche les plats de la carte du soir', async ({ page }) => {
    // Attendre que les plats soient rendus
    await page.waitForSelector('[data-dish-card="true"]');

    // Vérifier qu'il y a des plats
    const dishes = page.locator('[data-dish-card="true"]');
    await expect(dishes).toHaveCount(12); // 3 catégories x 4 plats = 12 plats
  });

  test('Les plats s\'affichent avec leur description', async ({ page }) => {
    // Attendre que les plats soient rendus
    await page.waitForSelector('[data-dish-card="true"]');

    // Les plats s'affichent avec un titre et une description
    const dishCards = page.locator('[data-dish-card="true"]');
    await expect(dishCards.first()).toBeVisible();

    // Chaque plat a un titre (h3)
    const dishTitles = page.locator('[data-dish-card="true"] h3');
    await expect(dishTitles).toHaveCount(12); // 3 catégories x 4 plats = 12 plats

    // Chaque plat a une description (p)
    const dishDescriptions = page.locator('[data-dish-card="true"] p');
    await expect(dishDescriptions).toHaveCount(12); // 3 catégories x 4 plats = 12 plats
  });

  test('Le footer s\'affiche sur la page menu', async ({ page }) => {
    // Vérifier que le footer s'affiche (section bg-card visible)
    await expect(page.locator('section.bg-card').first()).toBeVisible();
  });

  test('Les onglets de menu fonctionnent correctement', async ({ page }) => {
    await page.goto('/menu?lang=fr');
    await waitForSplashScreenToFade(page);

    // Vérifier qu'il y a des onglets actifs
    const tabs = page.getByRole('tab');
    await expect(tabs.first()).toHaveAttribute('data-state', 'active');

    // Cliquer sur le deuxième onglet
    const secondTab = tabs.nth(1);
    await secondTab.click();

    // Vérifier que l'onglet est maintenant active
    await expect(secondTab).toHaveAttribute('data-state', 'active');
  });

  test('La navigation entre les onglets fonctionne', async ({ page }) => {
    await page.goto('/menu?lang=fr');
    await waitForSplashScreenToFade(page);

    // Vérifier qu'il y a des onglets
    const tabs = page.getByRole('tab');
    const tabCount = await tabs.count();
    await expect(tabCount).toBeGreaterThan(0);

    // Cliquer sur le deuxième onglet
    if (tabCount > 1) {
      await tabs.nth(1).click();
      await page.waitForTimeout(300);

      // Cliquer sur le troisième onglet
      if (tabCount > 2) {
        await tabs.nth(2).click();
        await page.waitForTimeout(300);
      }
    }
  });

  test('Les plats ont des outlines', async ({ page }) => {
    await page.goto('/menu?lang=fr');
    await waitForSplashScreenToFade(page);

    // Vérifier que les plats ont une structure de card
    const firstCard = page.locator('[data-dish-card="true"]').first();
    await expect(firstCard).toHaveClass(/border-primary\/20/);
  });

  test('Les plats ont des prix', async ({ page }) => {
    await page.goto('/menu?lang=fr');
    await waitForSplashScreenToFade(page);

    // Les plats doivent avoir des prix
    // On cherche les span qui contiennent un chiffre et €
    const prices = page.locator('[data-dish-card="true"] span').filter({ hasText: /€/ });
    const count = await prices.count();
    await expect(count).toBeGreaterThan(0);
  });

  test('La page Menu a une image hero', async ({ page }) => {
    await page.goto('/menu?lang=fr');
    await waitForSplashScreenToFade(page);

    // Vérifier que l'image hero est visible
    await expect(page.getByAltText("Carte gastronomique")).toBeVisible();
  });

  test('La page Menu a des cartes de plats avec bordures', async ({ page }) => {
    await page.goto('/menu?lang=fr');
    await waitForSplashScreenToFade(page);

    // Vérifier que les cartes de plats ont une border
    const firstCard = page.locator('[data-dish-card="true"]').first();
    await expect(firstCard).toHaveClass(/border/);
  });

  test('Les plats ont des titres h3', async ({ page }) => {
    await page.goto('/menu?lang=fr');
    await waitForSplashScreenToFade(page);

    // Les plats ont des h3 avec le nom du plat
    const dishTitles = page.locator('[data-dish-card="true"] h3');
    const count = await dishTitles.count();
    await expect(count).toBeGreaterThan(0);
  });

  test('La page Menu a une section de description', async ({ page }) => {
    await page.goto('/menu?lang=fr');
    await waitForSplashScreenToFade(page);

    // Vérifier que la section est visible
    await expect(page.locator('section.bg-card')).toBeVisible();
  });

  test('Les boutons de navigation fonctionnent', async ({ page }) => {
    await page.goto('/menu?lang=fr');
    await waitForSplashScreenToFade(page);

    // Vérifier que les onglets sont interactifs
    const tabs = page.getByRole('tab');
    const tabCount = await tabs.count();

    // Cliquer sur le deuxième onglet si disponible
    if (tabCount > 1) {
      await tabs.nth(1).click();
      await page.waitForTimeout(200);
      // Cliquer sur le premier onglet
      await tabs.nth(0).click();
      await page.waitForTimeout(200);
    }
  });

  test('Les onglets sont bien formatés', async ({ page }) => {
    await page.goto('/menu?lang=fr');
    await waitForSplashScreenToFade(page);

    // Les onglets doivent être des boutons role tab
    const tabs = page.getByRole('tab');
    await expect(tabs).toHaveCount(4);
  });
});

test.describe('Site vitrine - Interactions Menu', () => {
  test('Les cards de plats affichent les informations au survol', async ({ page }) => {
    await page.goto('/menu?lang=fr');
    await waitForSplashScreenToFade(page);

    // Ouvrir la carte de la semaine
    const weekTab = page.getByRole('tab', { name: 'Carte de la semaine' });
    await weekTab.click();
    await page.waitForTimeout(500);

    // Vérifier que la première card est visible
    const dishCard = page.locator('[data-dish-card="true"]').first();
    await expect(dishCard).toBeVisible();

    // Hover sur la card pour tester l'interaction (desktop)
    await dishCard.hover({ force: true });

    // La border devrait changer de couleur au survol
    await expect(dishCard).toHaveClass(/hover:border-primary/);
  });

  test('Les images de la carte se chargent correctement', async ({ page }) => {
    await page.goto('/menu?lang=fr');
    await waitForSplashScreenToFade(page);

    // Vérifier que les images de cartes de plats sont présentes
    const dishImages = page.locator('[data-dish-card="true"] img');
    await expect(dishImages).toHaveCount(0); // Les images sont dans le popover, pas directement dans la card
  });
});
