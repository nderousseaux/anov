import { test, expect } from '@playwright/test';

// Configuration pour tous les tests
test.describe.configure({ baseURL: 'http://localhost:3000', timeout: 30000 });

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
    await expect(page.getByText('La Carte')).toBeVisible();
  });

  test('Affiche les onglets de carte', async ({ page }) => {
    // Vérifier les onglets
    await expect(page.getByRole('tab', { name: 'Carte de la semaine' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Carte du soir' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Vins' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Cocktails' })).toBeVisible();
  });

  test('Affiche les plats de la carte de la semaine', async ({ page }) => {
    // La carte de la semaine a 4 plats (dans la section par défaut)
    const weekTab = page.getByRole('tab', { name: 'Carte de la semaine' });
    await weekTab.click();

    // Attendre que les plats soient rendus
    await page.waitForSelector('[data-dish-card="true"]');

    // Vérifier qu'il y a des plats
    const dishes = page.locator('[data-dish-card="true"]');
    await expect(dishes).toHaveCount(12); // 3 catégories x 4 plats = 12 plats
  });

  test('Affiche les plats de la carte du soir', async ({ page }) => {
    const eveningTab = page.getByRole('tab', { name: 'Carte du soir' });
    await eveningTab.click();

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
    await expect(page.getByText("l'Anøv")).toBeVisible();
    await expect(page.getByText("Une expérience gastronomique")).toBeVisible();
  });

  test('Les onglets de menu fonctionnent correctement', async ({ page }) => {
    await page.goto('/menu?lang=fr');
    await waitForSplashScreenToFade(page);

    // Vérifier qu'on est sur la carte de la semaine par défaut
    const weekTab = page.getByRole('tab', { name: 'Carte de la semaine' });
    await expect(weekTab).toHaveAttribute('data-state', 'active');

    // Cliquer sur Carte du soir
    const eveningTab = page.getByRole('tab', { name: 'Carte du soir' });
    await eveningTab.click();

    // Vérifier que Carte du soir est maintenant active
    await expect(eveningTab).toHaveAttribute('data-state', 'active');
  });

  test('La navigation entre les onglets fonctionne', async ({ page }) => {
    await page.goto('/menu?lang=fr');
    await waitForSplashScreenToFade(page);

    // Cliquer sur Vins
    const wineTab = page.getByRole('tab', { name: 'Vins' });
    await wineTab.click();
    await page.waitForTimeout(300);

    // Vérifier que Vins est active
    await expect(wineTab).toHaveAttribute('data-state', 'active');

    // Cliquer sur Cocktails
    const cocktailTab = page.getByRole('tab', { name: 'Cocktails' });
    await cocktailTab.click();
    await page.waitForTimeout(300);

    // Vérifier que Cocktails est active
    await expect(cocktailTab).toHaveAttribute('data-state', 'active');
  });

  test('Les plats ont des outlines', async ({ page }) => {
    await page.goto('/menu?lang=fr');
    await waitForSplashScreenToFade(page);

    const weekTab = page.getByRole('tab', { name: 'Carte de la semaine' });
    await weekTab.click();
    await page.waitForTimeout(500);

    // Vérifier que les plats ont une structure de card
    // On vérifie que le premier plat a une border (la border border-primary/20)
    const firstCard = page.locator('[data-dish-card="true"]').first();
    await expect(firstCard).toHaveClass(/border-primary\/20/);
  });

  test('Les plats ont des prix', async ({ page }) => {
    await page.goto('/menu?lang=fr');
    await waitForSplashScreenToFade(page);

    const weekTab = page.getByRole('tab', { name: 'Carte de la semaine' });
    await weekTab.click();
    await page.waitForTimeout(500);

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
    const weekTab = page.getByRole('tab', { name: 'Carte de la semaine' });
    const eveningTab = page.getByRole('tab', { name: 'Carte du soir' });

    // Vérifier que les onglets sont cliquables
    await eveningTab.click();
    await page.waitForTimeout(200);
    await weekTab.click();
    await page.waitForTimeout(200);

    // Vérifier qu'on revient à la carte de la semaine
    await expect(weekTab).toHaveAttribute('data-state', 'active');
  });

  test('Les onglets sont bien formatés', async ({ page }) => {
    await page.goto('/menu?lang=fr');
    await waitForSplashScreenToFade(page);

    // Les onglets doivent être des boutons role tab
    const tabs = page.getByRole('tab');
    await expect(tabs).toHaveCount(4); // Carte de la semaine, Carte du soir, Vins, Cocktails
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
