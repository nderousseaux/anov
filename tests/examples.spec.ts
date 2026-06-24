import { test, expect } from '@playwright/test';

test.describe.configure({ baseURL: 'http://localhost:3000' });

test('affiche le titre sur la page daccueil', async ({ page }) => {
  // Naviguer vers la page d'accueil avec la langue française
  await page.goto('http://localhost:3000/?lang=fr');

  // Attendre que le splashscreen disparaisse
  await page.getByAltText("L'Anøv Restaurant").waitFor({ state: 'detached', timeout: 3000 });

  // Vérifier que le texte du titre s'affiche (le sous-titre du hero)
  await expect(page.getByText("Où chaque plat raconte une histoire, où chaque saveur éveille les sens")).toBeVisible();
});
