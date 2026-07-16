# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: gift-card.spec.ts >> Interface Admin - Page Bons Cadeaux >> La page affiche le titre
- Location: tests/gift-card.spec.ts:100:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('h1:text("Bons Cadeaux")')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('h1:text("Bons Cadeaux")')

```

```yaml
- banner:
  - text: ANØV
  - navigation:
    - link "Réservations":
      - /url: /admin/reservation
      - img
      - text: Réservations
    - link "Bons Cadeaux":
      - /url: /admin/cheques-cadeaux
      - img
      - text: Bons Cadeaux
    - link "Commandes":
      - /url: /admin/commandes
      - img
      - text: Commandes
    - link "Fiches Client":
      - /url: /admin/clients
      - img
      - text: Fiches Client
    - link "CMS":
      - /url: /admin/cms
      - img
      - text: CMS
  - button "Se déconnecter":
    - img
    - text: Se déconnecter
- main:
  - heading "Réservations" [level=1]
  - paragraph: Gestion des réservations et disponibilités
  - button "Paramètres":
    - img
    - text: Paramètres
  - button:
    - img
  - text: juillet 2026
  - button:
    - img
  - button "Aujourd'hui":
    - img
    - text: Aujourd'hui
  - button "Actualiser":
    - img
    - text: Actualiser
  - text: Lun Mar Mer Jeu Ven Sam Dim
  - button "29 juin Fermé"
  - button "30 juin 🌞 12:00–15:00 🌙 19:00–23:00 0/72 cvrt"
  - button "1 juil 🌞 12:00–15:00 🌙 19:00–23:00 0/72 cvrt"
  - button "2 juil 🌞 12:00–15:00 🌙 19:00–23:00 0/72 cvrt"
  - button "3 juil 🌞 12:00–15:00 🌙 19:00–23:00 0/72 cvrt"
  - button "4 juil 🌞 12:00–15:00 🌙 19:00–23:00 0/72 cvrt"
  - button "5 juil Fermé"
  - button "6 juil Fermé"
  - button "7 juil 🌞 12:00–15:00 🌙 19:00–23:00 0/72 cvrt"
  - button "8 juil 🌞 12:00–15:00 🌙 19:00–23:00 0/72 cvrt"
  - button "9 juil 🌞 12:00–15:00 🌙 19:00–23:00 0/72 cvrt"
  - button "10 juil 🌞 12:00–15:00 🌙 19:00–23:00 0/72 cvrt"
  - button "11 juil 🌞 12:00–15:00 🌙 19:00–23:00 0/72 cvrt"
  - button "12 juil Fermé"
  - button "13 juil Fermé"
  - button "14 juil 🌞 12:00–15:00 🌙 19:00–23:00 0/72 cvrt"
  - button "15 juil ✱ Fermé"
  - button "16 juil 🌞 12:00–15:00 🌙 19:00–23:00 0/72 cvrt"
  - button "17 juil 🌞 12:00–15:00 🌙 19:00–23:00 0/72 cvrt"
  - button "18 juil 🌞 12:00–15:00 🌙 19:00–23:00 0/72 cvrt"
  - button "19 juil Fermé"
  - button "20 juil Fermé"
  - button "21 juil 🌞 12:00–15:00 🌙 19:00–23:00 0/72 cvrt"
  - button "22 juil 🌞 12:00–15:00 🌙 19:00–23:00 0/72 cvrt"
  - button "23 juil 🌞 12:00–15:00 🌙 19:00–23:00 0/72 cvrt"
  - button "24 juil 🌞 12:00–15:00 🌙 19:00–23:00 0/72 cvrt"
  - button "25 juil 🌞 12:00–15:00 🌙 19:00–23:00 0/72 cvrt"
  - button "26 juil Fermé"
  - button "27 juil Fermé"
  - button "28 juil 🌞 12:00–15:00 🌙 19:00–23:00 0/72 cvrt"
  - button "29 juil 🌞 12:00–15:00 🌙 19:00–23:00 0/72 cvrt"
  - button "30 juil 🌞 12:00–15:00 🌙 19:00–23:00 0/72 cvrt"
  - button "31 juil 🌞 12:00–15:00 🌙 19:00–23:00 0/72 cvrt"
  - button "1 août 🌞 12:00–15:00 🌙 19:00–23:00 0/72 cvrt"
  - button "2 août Fermé"
- region "Notifications alt+T"
- alert
```

# Test source

```ts
  1   | import { test, expect, type Page } from "@playwright/test";
  2   | 
  3   | // Configuration pour tous les tests
  4   | test.describe.configure({ mode: "default", timeout: 60000 });
  5   | 
  6   | // Helper pour se connecter à l'interface admin
  7   | const loginToAdmin = async (page: Page) => {
  8   |   const adminUser = process.env.ADMIN_USER || "admin";
  9   |   const adminPassword = process.env.ADMIN_PASSWORD || "1";
  10  | 
  11  |   await page.goto("/admin/login");
  12  |   await expect(page.locator('h1:text("ANØV Admin")')).toBeVisible({
  13  |     timeout: 10000,
  14  |   });
  15  |   await page.locator("input#username").fill(adminUser);
  16  |   await page.locator("input#password").fill(adminPassword);
  17  |   await page.locator('button[type="submit"]').click();
  18  |   await page.waitForURL(/\/admin\/reservation/, { timeout: 60000 });
  19  |   await expect(page.locator('h1:text("Réservations")')).toBeVisible({
  20  |     timeout: 30000,
  21  |   });
  22  | };
  23  | 
  24  | test.describe("Système Bons Cadeaux - Page de succès /cheques-cadeaux/succes", () => {
  25  |   // Le spinner n'est pas facile à tester car il disparaît rapidement (1.5s)
  26  |   // On vérifie que la page se charge correctement avec un session_id
  27  |   test("Affiche le message de confirmation de paiement", async ({ page }) => {
  28  |     await page.goto(
  29  |       "/cheques-cadeaux/succes?session_id=test_session_123&lang=fr",
  30  |     );
  31  |     await page.waitForTimeout(3000);
  32  |     // Vérifier que la confirmation est affichée
  33  |     await expect(page.locator("svg.w-20.h-20.text-green-500")).toBeVisible();
  34  |     await expect(
  35  |       page.getByText("Votre paiement a été traité avec succès"),
  36  |     ).toBeVisible();
  37  |   });
  38  | 
  39  |   test("Affiche une erreur si session_id manquant", async ({ page }) => {
  40  |     await page.goto("/cheques-cadeaux/succes?lang=fr");
  41  |     // Attendre que le composant se charge (le useEffect met 1.5s)
  42  |     await page.waitForTimeout(3000);
  43  |     // Vérifier le texte d'erreur - le texte exact est "Une erreur s'est produite"
  44  |     await expect(page.getByText("Une erreur s'est produite")).toBeVisible({
  45  |       timeout: 10000,
  46  |     });
  47  |   });
  48  | 
  49  |   test("Affiche la confirmation de paiement", async ({ page }) => {
  50  |     await page.goto(
  51  |       "/cheques-cadeaux/succes?session_id=test_session_123&lang=fr",
  52  |     );
  53  |     // Attendre que le chargement se termine (le composant attend 1.5s)
  54  |     await page.waitForTimeout(3000);
  55  | 
  56  |     // Vérifier l'icône de succès
  57  |     await expect(page.locator("svg.w-20.h-20.text-green-500")).toBeVisible();
  58  | 
  59  |     // Vérifier le message de confirmation
  60  |     await expect(
  61  |       page.getByText("Votre paiement a été traité avec succès"),
  62  |     ).toBeVisible();
  63  | 
  64  |     // Vérifier l'email envoyé
  65  |     await expect(
  66  |       page.getByText(
  67  |         "Un email contenant le chèque cadeau a été envoyé au destinataire",
  68  |       ),
  69  |     ).toBeVisible();
  70  | 
  71  |     // Vérifier les boutons d'action
  72  |     await expect(
  73  |       page.getByRole("button", { name: "Retour à l'accueil" }),
  74  |     ).toBeVisible();
  75  |     await expect(
  76  |       page.getByRole("button", { name: "Acheter un autre chèque cadeau" }),
  77  |     ).toBeVisible();
  78  |   });
  79  | 
  80  |   test("Redirection vers la page d'achat si erreur", async ({ page }) => {
  81  |     await page.goto("/cheques-cadeaux/succes?lang=fr");
  82  |     await page.waitForTimeout(3000);
  83  |     // Le bouton de retour est "Retour aux chèques cadeaux" (en français)
  84  |     await expect(
  85  |       page.getByRole("button", { name: "Retour aux chèques cadeaux" }),
  86  |     ).toBeVisible({ timeout: 15000 });
  87  |   });
  88  | });
  89  | 
  90  | test.describe("Interface Admin - Page Bons Cadeaux", () => {
  91  |   test.beforeEach(async ({ page }) => {
  92  |     await loginToAdmin(page);
  93  |     await page.getByRole("link", { name: "Bons Cadeaux" }).click();
  94  |   });
  95  | 
  96  |   test("La page affiche le header", async ({ page }) => {
  97  |     await expect(page.locator("header")).toBeVisible();
  98  |   });
  99  | 
  100 |   test("La page affiche le titre", async ({ page }) => {
> 101 |     await expect(page.locator('h1:text("Bons Cadeaux")')).toBeVisible();
      |                                                           ^ Error: expect(locator).toBeVisible() failed
  102 |   });
  103 | 
  104 |   test("La page affiche la légende du titre", async ({ page }) => {
  105 |     await expect(
  106 |       page.locator('p:text("Gestion complète des chèques cadeaux")'),
  107 |     ).toBeVisible();
  108 |   });
  109 | 
  110 |   test("La page affiche le bouton Créer un bon cadeau", async ({ page }) => {
  111 |     await expect(
  112 |       page.getByRole("button", { name: "Créer un bon cadeau" }),
  113 |     ).toBeVisible();
  114 |   });
  115 | 
  116 |   test("La page affiche le bouton Rafraîchir", async ({ page }) => {
  117 |     await expect(
  118 |       page.getByRole("button", { name: "Rafraîchir" }),
  119 |     ).toBeVisible();
  120 |   });
  121 | 
  122 |   test("La page affiche les cartes de statistiques", async ({ page }) => {
  123 |     await page.waitForTimeout(1000);
  124 |     // Les cartes de statistiques ont une structure spécifique avec text-2xl
  125 |     const statsCards = page.locator(".grid .bg-card:has(.text-2xl)");
  126 |     const count = await statsCards.count();
  127 |     expect(count).toBeGreaterThan(0);
  128 |   });
  129 | 
  130 |   test("Le bouton Créer un bon cadeau ouvre le modal", async ({ page }) => {
  131 |     await page.getByRole("button", { name: "Créer un bon cadeau" }).click();
  132 |     await expect(page.locator('h2:text("Créer un bon cadeau")')).toBeVisible();
  133 |     await expect(page.locator('label:text("Montant")')).toBeVisible();
  134 |     await expect(page.locator("input#amount")).toBeVisible();
  135 |   });
  136 | 
  137 |   test("Le modal peut être fermé avec Échap", async ({ page }) => {
  138 |     await page.getByRole("button", { name: "Créer un bon cadeau" }).click();
  139 |     await expect(page.locator('h2:text("Créer un bon cadeau")')).toBeVisible();
  140 |     await page.keyboard.press("Escape");
  141 |     await expect(
  142 |       page.locator('h2:text("Créer un bon cadeau")'),
  143 |     ).not.toBeVisible();
  144 |   });
  145 | 
  146 |   test("Le modal peut être fermé en cliquant sur le bouton X", async ({
  147 |     page,
  148 |   }) => {
  149 |     await page.getByRole("button", { name: "Créer un bon cadeau" }).click();
  150 |     await expect(page.locator('h2:text("Créer un bon cadeau")')).toBeVisible();
  151 |     await page.locator('button[title="Fermer (Échap)"]').click();
  152 |     await expect(
  153 |       page.locator('h2:text("Créer un bon cadeau")'),
  154 |     ).not.toBeVisible();
  155 |   });
  156 | 
  157 |   test("La fermeture du modal réinitialise le formulaire", async ({ page }) => {
  158 |     await page.getByRole("button", { name: "Créer un bon cadeau" }).click();
  159 |     await page.locator("input#amount").fill("100");
  160 |     await page.locator("input#recipientEmail").fill("test@example.com");
  161 |     await page.keyboard.press("Escape");
  162 |     await expect(
  163 |       page.locator('h2:text("Créer un bon cadeau")'),
  164 |     ).not.toBeVisible({ timeout: 5000 });
  165 |     await page.getByRole("button", { name: "Créer un bon cadeau" }).click();
  166 |     await expect(page.locator('h2:text("Créer un bon cadeau")')).toBeVisible({
  167 |       timeout: 5000,
  168 |     });
  169 |     await expect(page.locator("input#amount")).toHaveValue("");
  170 |     await expect(page.locator("input#recipientEmail")).toHaveValue("");
  171 |   });
  172 | 
  173 |   test("Création d'un bon cadeau avec email", async ({ page }) => {
  174 |     await page.getByRole("button", { name: "Créer un bon cadeau" }).click();
  175 |     await page.locator("input#amount").fill("100");
  176 |     await page.locator("input#recipientEmail").fill("destinataire@example.com");
  177 |     await page.locator("textarea#personalMessage").fill("Bonne dégustation !");
  178 |     await page.getByRole("button", { name: "Créer le bon" }).click();
  179 |     await page.waitForTimeout(1000);
  180 |     await expect(
  181 |       page.locator('h2:text("Créer un bon cadeau")'),
  182 |     ).not.toBeVisible();
  183 |   });
  184 | 
  185 |   test("Création d'un bon cadeau sans email", async ({ page }) => {
  186 |     await page.getByRole("button", { name: "Créer un bon cadeau" }).click();
  187 |     await page.locator("input#amount").fill("50");
  188 |     await page.getByRole("button", { name: "Créer le bon" }).click();
  189 |     await page.waitForTimeout(1000);
  190 |     await expect(
  191 |       page.locator('h2:text("Créer un bon cadeau")'),
  192 |     ).not.toBeVisible();
  193 |   });
  194 | 
  195 |   test("Validation du montant requis", async ({ page }) => {
  196 |     await page.getByRole("button", { name: "Créer un bon cadeau" }).click();
  197 |     await expect(
  198 |       page.getByRole("button", { name: "Créer le bon" }),
  199 |     ).toBeDisabled();
  200 |     await page.locator("input#amount").fill("50");
  201 |     await expect(
```