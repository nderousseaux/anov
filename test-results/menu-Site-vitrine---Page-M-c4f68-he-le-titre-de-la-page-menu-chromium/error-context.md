# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: menu.spec.ts >> Site vitrine - Page Menu >> Affiche le titre de la page menu
- Location: tests/menu.spec.ts:18:3

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator: locator('div[style*="36vh"] h1').first()
Expected pattern: /./
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toHaveText" with timeout 5000ms
  - waiting for locator('div[style*="36vh"] h1').first()

```

```yaml
- navigation:
  - link "Logo l’anøv":
    - /url: /
    - img "Logo l’anøv"
  - button "Notre Histoire"
  - button "Galerie"
  - link "La Carte":
    - /url: /menu
  - link "Chèques Cadeaux":
    - /url: /cheques-cadeaux
  - link "Réserver":
    - /url: /reservation
    - button "Réserver"
  - button "Changer de langue":
    - img
    - text: FR
- main:
  - img "Carte gastronomique"
  - heading "Nos Cartes" [level=1]
  - paragraph: "Quatre formules, une seule promesse : une cuisine vivante, ancrée dans les saisons"
  - tablist:
    - tab "Carte de la semaine" [selected]
    - tab "Carte du soir"
    - tab "Vins"
    - tab "Cocktails"
  - tabpanel:
    - paragraph: Renouvelée chaque semaine selon les arrivages du marché
    - heading "Entrées" [level=3]
    - heading "Velouté de butternut" [level=3]
    - text: 14€
    - paragraph: Crème légère, huile de truffe, croûtons maison
    - heading "Carpaccio de daurade" [level=3]
    - text: 18€
    - paragraph: Agrumes, avocat, fleur de sel, herbes fraîches
    - heading "Foie gras mi-cuit" [level=3]
    - text: 22€
    - paragraph: Chutney de figues, brioche toastée maison
    - heading "Tartare de légumes" [level=3]
    - text: 16€
    - paragraph: Betterave, carotte, avocat, vinaigrette miso-sésame
    - img "Entrées"
    - heading "Plats" [level=3]
    - heading "Suprême de volaille" [level=3]
    - text: 28€
    - paragraph: Jus réduit, légumes de saison rôtis, purée maison
    - heading "Pavé de saumon" [level=3]
    - text: 30€
    - paragraph: Beurre blanc aux herbes, riz pilaf, épinards frais
    - heading "Risotto du moment" [level=3]
    - text: 26€
    - paragraph: Selon l'arrivage du marché, parmesan vieilli 24 mois
    - heading "Côte de porc ibérique" [level=3]
    - text: 29€
    - paragraph: Sauce romarin-miel, écrasée de pommes de terre, haricots verts
    - img "Plats"
    - heading "Desserts" [level=3]
    - heading "Crème brûlée vanille" [level=3]
    - text: 10€
    - paragraph: Vanille de Madagascar, cassonade caramélisée
    - heading "Tarte du jour" [level=3]
    - text: 11€
    - paragraph: Selon l'inspiration du Chef pâtissier
    - heading "Assiette de fromages" [level=3]
    - text: 14€
    - paragraph: Sélection affinée, confiture maison, pain aux noix
    - heading "Sorbet du moment" [level=3]
    - text: 9€
    - paragraph: Fruit de saison, coulis maison, tuile croustillante
    - heading "Formule du midi" [level=3]
    - paragraph: Entrée + Plat ou Plat + Dessert
    - paragraph: Entrée + Plat + Dessert — 38€
    - text: 32€
- contentinfo:
  - img "Logo l’Anøv"
  - paragraph: Une expérience gastronomique d'exception où chaque plat raconte une histoire spéciale.
  - heading "Suivez-nous" [level=4]
  - link "Facebook":
    - /url: "#"
    - img
  - link "Instagram":
    - /url: "#"
    - img
  - link "TikTok":
    - /url: "#"
    - img
  - heading "Nos Avis" [level=4]
  - text: TripAdvisor
  - img
  - text: 5.0 (248 avis) Google
  - img
  - text: 4.9 (312 avis) La Fourchette
  - img
  - text: 9.8 (189 avis)
  - img
  - text: CB · Visa · Mastercard · Amex · Espèces · Chèques
  - img
  - text: Accès PMR
  - img
  - text: Climatisé
  - paragraph: © 2026 l'Anøv · Tous droits réservés.
  - link "Mentions légales":
    - /url: /mentions-legales
  - link "Politique de confidentialité":
    - /url: /politique-de-confidentialite
  - link "CGV":
    - /url: /cgv
- region "Notifications alt+T"
- alert
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | // Configuration pour tous les tests
  4   | // Configuration pour tous les tests
  5   | 
  6   | // Helper pour attendre le fade du splashscreen (2.5 secondes pour être sûr)
  7   | const waitForSplashScreenToFade = async (page: any) => {
  8   |   // Le splashscreen est visible pendant 2.2 secondes
  9   |   await page.waitForTimeout(2500);
  10  | };
  11  | 
  12  | test.describe('Site vitrine - Page Menu', () => {
  13  |   test.beforeEach(async ({ page }) => {
  14  |     await page.goto('/menu?lang=fr');
  15  |     await waitForSplashScreenToFade(page);
  16  |   });
  17  | 
  18  |   test('Affiche le titre de la page menu', async ({ page }) => {
  19  |     // Vérifier que le titre de la page est visible (h1 dans le hero)
> 20  |     await expect(page.locator('div[style*="36vh"] h1').first()).toHaveText(/./);
      |                                                                 ^ Error: expect(locator).toHaveText(expected) failed
  21  |   });
  22  | 
  23  |   test('Affiche les onglets de carte', async ({ page }) => {
  24  |     // Vérifier qu'il y a des onglets (tabs)
  25  |     const tabs = page.getByRole('tab');
  26  |     await expect(tabs).toHaveCount(4);
  27  | 
  28  |     // Vérifier que les onglets sont cliquables
  29  |     await expect(tabs.first()).toBeVisible();
  30  |     await expect(tabs.last()).toBeVisible();
  31  |   });
  32  | 
  33  |   test('Affiche les plats de la carte de la semaine', async ({ page }) => {
  34  |     // Attendre que les plats soient rendus
  35  |     await page.waitForSelector('[data-dish-card="true"]');
  36  | 
  37  |     // Vérifier qu'il y a des plats
  38  |     const dishes = page.locator('[data-dish-card="true"]');
  39  |     await expect(dishes).toHaveCount(12); // 3 catégories x 4 plats = 12 plats
  40  |   });
  41  | 
  42  |   test('Affiche les plats de la carte du soir', async ({ page }) => {
  43  |     // Attendre que les plats soient rendus
  44  |     await page.waitForSelector('[data-dish-card="true"]');
  45  | 
  46  |     // Vérifier qu'il y a des plats
  47  |     const dishes = page.locator('[data-dish-card="true"]');
  48  |     await expect(dishes).toHaveCount(12); // 3 catégories x 4 plats = 12 plats
  49  |   });
  50  | 
  51  |   test('Les plats s\'affichent avec leur description', async ({ page }) => {
  52  |     // Attendre que les plats soient rendus
  53  |     await page.waitForSelector('[data-dish-card="true"]');
  54  | 
  55  |     // Les plats s'affichent avec un titre et une description
  56  |     const dishCards = page.locator('[data-dish-card="true"]');
  57  |     await expect(dishCards.first()).toBeVisible();
  58  | 
  59  |     // Chaque plat a un titre (h3)
  60  |     const dishTitles = page.locator('[data-dish-card="true"] h3');
  61  |     await expect(dishTitles).toHaveCount(12); // 3 catégories x 4 plats = 12 plats
  62  | 
  63  |     // Chaque plat a une description (p)
  64  |     const dishDescriptions = page.locator('[data-dish-card="true"] p');
  65  |     await expect(dishDescriptions).toHaveCount(12); // 3 catégories x 4 plats = 12 plats
  66  |   });
  67  | 
  68  |   test('Le footer s\'affiche sur la page menu', async ({ page }) => {
  69  |     // Vérifier que le footer s'affiche (section bg-card visible)
  70  |     await expect(page.locator('section.bg-card').first()).toBeVisible();
  71  |   });
  72  | 
  73  |   test('Les onglets de menu fonctionnent correctement', async ({ page }) => {
  74  |     await page.goto('/menu?lang=fr');
  75  |     await waitForSplashScreenToFade(page);
  76  | 
  77  |     // Vérifier qu'il y a des onglets actifs
  78  |     const tabs = page.getByRole('tab');
  79  |     await expect(tabs.first()).toHaveAttribute('data-state', 'active');
  80  | 
  81  |     // Cliquer sur le deuxième onglet
  82  |     const secondTab = tabs.nth(1);
  83  |     await secondTab.click();
  84  | 
  85  |     // Vérifier que l'onglet est maintenant active
  86  |     await expect(secondTab).toHaveAttribute('data-state', 'active');
  87  |   });
  88  | 
  89  |   test('La navigation entre les onglets fonctionne', async ({ page }) => {
  90  |     await page.goto('/menu?lang=fr');
  91  |     await waitForSplashScreenToFade(page);
  92  | 
  93  |     // Vérifier qu'il y a des onglets
  94  |     const tabs = page.getByRole('tab');
  95  |     const tabCount = await tabs.count();
  96  |     await expect(tabCount).toBeGreaterThan(0);
  97  | 
  98  |     // Cliquer sur le deuxième onglet
  99  |     if (tabCount > 1) {
  100 |       await tabs.nth(1).click();
  101 |       await page.waitForTimeout(300);
  102 | 
  103 |       // Cliquer sur le troisième onglet
  104 |       if (tabCount > 2) {
  105 |         await tabs.nth(2).click();
  106 |         await page.waitForTimeout(300);
  107 |       }
  108 |     }
  109 |   });
  110 | 
  111 |   test('Les plats ont des outlines', async ({ page }) => {
  112 |     await page.goto('/menu?lang=fr');
  113 |     await waitForSplashScreenToFade(page);
  114 | 
  115 |     // Vérifier que les plats ont une structure de card
  116 |     const firstCard = page.locator('[data-dish-card="true"]').first();
  117 |     await expect(firstCard).toHaveClass(/border-primary\/20/);
  118 |   });
  119 | 
  120 |   test('Les plats ont des prix', async ({ page }) => {
```