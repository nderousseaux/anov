import { test, expect } from '@playwright/test';

test.describe.configure({ baseURL: 'http://localhost:3000' });

test('affiche le titre sur la page daccueil', async ({ page }) => {
  await page.goto('/');

  // Vérifier que le logo est affiché (dans le hero)
  const logo = page.locator('#hero img[alt="Logo"]');
  await expect(logo).toBeVisible();

  // Vérifier que le sous-titre du hero s'affiche (via le sélecteur du p tag spécifique)
  await expect(page.locator('#hero p[style*="font-family:var(--font-display)"]').first()).toBeVisible();
});
