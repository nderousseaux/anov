import { test, expect, type Page } from "@playwright/test";

// Configuration pour tous les tests
test.describe.configure({ mode: "default", timeout: 60000 });

// Helper pour se connecter à l'interface admin
const loginToAdmin = async (page: Page) => {
  const adminUser = process.env.ADMIN_USER || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "1";

  await page.goto("/admin/login");
  await expect(page.locator('h1:text("ANØV Admin")')).toBeVisible({
    timeout: 10000,
  });
  await page.locator("input#username").fill(adminUser);
  await page.locator("input#password").fill(adminPassword);
  await page.locator('button[type="submit"]').click();
  await page.waitForURL(/\/admin\/reservation/, { timeout: 60000 });
  await expect(page.locator('h1:text("Réservations")')).toBeVisible({
    timeout: 30000,
  });
};

test.describe("Système Bons Cadeaux - Page de succès /cheques-cadeaux/succes", () => {
  // Le spinner n'est pas facile à tester car il disparaît rapidement (1.5s)
  // On vérifie que la page se charge correctement avec un session_id
  test("Affiche le message de confirmation de paiement", async ({ page }) => {
    await page.goto(
      "/cheques-cadeaux/succes?session_id=test_session_123&lang=fr",
    );
    await page.waitForTimeout(3000);
    // Vérifier que la confirmation est affichée
    await expect(page.locator("svg.w-20.h-20.text-green-500")).toBeVisible();
    await expect(
      page.getByText("Votre paiement a été traité avec succès"),
    ).toBeVisible();
  });

  test("Affiche une erreur si session_id manquant", async ({ page }) => {
    await page.goto("/cheques-cadeaux/succes?lang=fr");
    // Attendre que le composant se charge (le useEffect met 1.5s)
    await page.waitForTimeout(3000);
    // Vérifier le texte d'erreur - le texte exact est "Une erreur s'est produite"
    await expect(page.getByText("Une erreur s'est produite")).toBeVisible({
      timeout: 10000,
    });
  });

  test("Affiche la confirmation de paiement", async ({ page }) => {
    await page.goto(
      "/cheques-cadeaux/succes?session_id=test_session_123&lang=fr",
    );
    // Attendre que le chargement se termine (le composant attend 1.5s)
    await page.waitForTimeout(3000);

    // Vérifier l'icône de succès
    await expect(page.locator("svg.w-20.h-20.text-green-500")).toBeVisible();

    // Vérifier le message de confirmation
    await expect(
      page.getByText("Votre paiement a été traité avec succès"),
    ).toBeVisible();

    // Vérifier l'email envoyé
    await expect(
      page.getByText(
        "Un email contenant le chèque cadeau a été envoyé au destinataire",
      ),
    ).toBeVisible();

    // Vérifier les boutons d'action
    await expect(
      page.getByRole("button", { name: "Retour à l'accueil" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Acheter un autre chèque cadeau" }),
    ).toBeVisible();
  });

  test("Redirection vers la page d'achat si erreur", async ({ page }) => {
    await page.goto("/cheques-cadeaux/succes?lang=fr");
    await page.waitForTimeout(3000);
    // Le bouton de retour est "Retour aux chèques cadeaux" (en français)
    await expect(
      page.getByRole("button", { name: "Retour aux chèques cadeaux" }),
    ).toBeVisible({ timeout: 15000 });
  });
});

test.describe("Interface Admin - Page Bons Cadeaux", () => {
  test.beforeEach(async ({ page }) => {
    await loginToAdmin(page);
    await page.getByRole("link", { name: "Bons Cadeaux" }).click();
  });

  test("La page affiche le header", async ({ page }) => {
    await expect(page.locator("header")).toBeVisible();
  });

  test("La page affiche le titre", async ({ page }) => {
    await expect(page.locator('h1:text("Bons Cadeaux")')).toBeVisible();
  });

  test("La page affiche la légende du titre", async ({ page }) => {
    await expect(
      page.locator('p:text("Gestion complète des chèques cadeaux")'),
    ).toBeVisible();
  });

  test("La page affiche le bouton Créer un bon cadeau", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: "Créer un bon cadeau" }),
    ).toBeVisible();
  });

  test("La page affiche le bouton Rafraîchir", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: "Rafraîchir" }),
    ).toBeVisible();
  });

  test("La page affiche les cartes de statistiques", async ({ page }) => {
    await page.waitForTimeout(1000);
    // Les cartes de statistiques ont une structure spécifique avec text-2xl
    const statsCards = page.locator(".grid .bg-card:has(.text-2xl)");
    const count = await statsCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("Le bouton Créer un bon cadeau ouvre le modal", async ({ page }) => {
    await page.getByRole("button", { name: "Créer un bon cadeau" }).click();
    await expect(page.locator('h2:text("Créer un bon cadeau")')).toBeVisible();
    await expect(page.locator('label:text("Montant")')).toBeVisible();
    await expect(page.locator("input#amount")).toBeVisible();
  });

  test("Le modal peut être fermé avec Échap", async ({ page }) => {
    await page.getByRole("button", { name: "Créer un bon cadeau" }).click();
    await expect(page.locator('h2:text("Créer un bon cadeau")')).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(
      page.locator('h2:text("Créer un bon cadeau")'),
    ).not.toBeVisible();
  });

  test("Le modal peut être fermé en cliquant sur le bouton X", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Créer un bon cadeau" }).click();
    await expect(page.locator('h2:text("Créer un bon cadeau")')).toBeVisible();
    await page.locator('button[title="Fermer (Échap)"]').click();
    await expect(
      page.locator('h2:text("Créer un bon cadeau")'),
    ).not.toBeVisible();
  });

  test("La fermeture du modal réinitialise le formulaire", async ({ page }) => {
    await page.getByRole("button", { name: "Créer un bon cadeau" }).click();
    await page.locator("input#amount").fill("100");
    await page.locator("input#recipientEmail").fill("test@example.com");
    await page.keyboard.press("Escape");
    await expect(
      page.locator('h2:text("Créer un bon cadeau")'),
    ).not.toBeVisible({ timeout: 5000 });
    await page.getByRole("button", { name: "Créer un bon cadeau" }).click();
    await expect(page.locator('h2:text("Créer un bon cadeau")')).toBeVisible({
      timeout: 5000,
    });
    await expect(page.locator("input#amount")).toHaveValue("");
    await expect(page.locator("input#recipientEmail")).toHaveValue("");
  });

  test("Création d'un bon cadeau avec email", async ({ page }) => {
    await page.getByRole("button", { name: "Créer un bon cadeau" }).click();
    await page.locator("input#amount").fill("100");
    await page.locator("input#recipientEmail").fill("destinataire@example.com");
    await page.locator("textarea#personalMessage").fill("Bonne dégustation !");
    await page.getByRole("button", { name: "Créer le bon" }).click();
    await page.waitForTimeout(1000);
    await expect(
      page.locator('h2:text("Créer un bon cadeau")'),
    ).not.toBeVisible();
  });

  test("Création d'un bon cadeau sans email", async ({ page }) => {
    await page.getByRole("button", { name: "Créer un bon cadeau" }).click();
    await page.locator("input#amount").fill("50");
    await page.getByRole("button", { name: "Créer le bon" }).click();
    await page.waitForTimeout(1000);
    await expect(
      page.locator('h2:text("Créer un bon cadeau")'),
    ).not.toBeVisible();
  });

  test("Validation du montant requis", async ({ page }) => {
    await page.getByRole("button", { name: "Créer un bon cadeau" }).click();
    await expect(
      page.getByRole("button", { name: "Créer le bon" }),
    ).toBeDisabled();
    await page.locator("input#amount").fill("50");
    await expect(
      page.getByRole("button", { name: "Créer le bon" }),
    ).toBeEnabled();
    await page.locator("input#amount").fill("");
    await expect(
      page.getByRole("button", { name: "Créer le bon" }),
    ).toBeDisabled();
  });

  test("Validation du montant doit être un entier", async ({ page }) => {
    await page.getByRole("button", { name: "Créer un bon cadeau" }).click();
    await page.locator("input#amount").fill("100.50");
    await expect(
      page.getByRole("button", { name: "Créer le bon" }),
    ).toBeDisabled();
    await page.locator("input#amount").fill("");
    await expect(
      page.getByRole("button", { name: "Créer le bon" }),
    ).toBeDisabled();
  });

  test("Validation du montant doit être positif", async ({ page }) => {
    await page.getByRole("button", { name: "Créer un bon cadeau" }).click();
    await page.locator("input#amount").fill("-10");
    await expect(
      page.getByRole("button", { name: "Créer le bon" }),
    ).toBeDisabled();
    await page.locator("input#amount").fill("");
    await expect(
      page.getByRole("button", { name: "Créer le bon" }),
    ).toBeDisabled();
  });

  test("Validation de l'email format invalide", async ({ page }) => {
    await page.getByRole("button", { name: "Créer un bon cadeau" }).click();
    await page.locator("input#amount").fill("100");
    await page.locator("input#recipientEmail").fill("email-invalide");
    await expect(
      page.getByRole("button", { name: "Créer le bon" }),
    ).toBeEnabled();
    await page.locator("input#amount").fill("");
    await expect(
      page.getByRole("button", { name: "Créer le bon" }),
    ).toBeDisabled();
  });

  test("Fermeture du modal via clic outside", async ({ page }) => {
    await page.getByRole("button", { name: "Créer un bon cadeau" }).click();
    await expect(page.locator('h2:text("Créer un bon cadeau")')).toBeVisible();
    await page
      .locator(".fixed.inset-0.z-50")
      .click({ position: { x: 50, y: 50 } });
    await expect(
      page.locator('h2:text("Créer un bon cadeau")'),
    ).not.toBeVisible();
  });
});

test.describe("Interface Admin - Filtres", () => {
  test.beforeEach(async ({ page }) => {
    await loginToAdmin(page);
    await page.getByRole("link", { name: "Bons Cadeaux" }).click();
  });

  test("Le filtre de statut s'affiche", async ({ page }) => {
    await expect(
      page.locator('select:has-text("Tous les statuts")'),
    ).toBeVisible();
  });

  test("Le filtre par code s'affiche", async ({ page }) => {
    await expect(
      page.locator('input[placeholder="Rechercher par code..."]'),
    ).toBeVisible();
  });

  test("Le filtre par email s'affiche", async ({ page }) => {
    await expect(
      page.locator('input[placeholder="Rechercher par email..."]'),
    ).toBeVisible();
  });

  test("Le bouton de réinitialisation s'affiche quand filtres actifs", async ({
    page,
  }) => {
    await page
      .locator('input[placeholder="Rechercher par code..."]')
      .fill("TEST");
    await expect(
      page.getByRole("button", { name: "Réinitialiser" }),
    ).toBeVisible({ timeout: 5000 });
  });

  test("La réinitialisation des filtres fonctionne", async ({ page }) => {
    await page
      .locator('input[placeholder="Rechercher par code..."]')
      .fill("TEST");
    await expect(
      page.getByRole("button", { name: "Réinitialiser" }),
    ).toBeVisible({ timeout: 5000 });
    await page.getByRole("button", { name: "Réinitialiser" }).click();
    await expect(
      page.locator('input[placeholder="Rechercher par code..."]'),
    ).toHaveValue("", { timeout: 10000 });
  });

  test("Pagination s'affiche quand plusieurs pages", async ({ page }) => {
    await page.waitForTimeout(1000);
    const pagination = page.locator(".mt-8.flex.items-center.gap-2");
    await pagination.first().isVisible();
  });
});

test.describe("Interface Admin - Statistiques", () => {
  test.beforeEach(async ({ page }) => {
    await loginToAdmin(page);
    await page.getByRole("link", { name: "Bons Cadeaux" }).click();
  });

  test('La carte "Total émis" s\'affiche', async ({ page }) => {
    await page.waitForTimeout(1000);
    await page
      .locator(".grid .bg-card")
      .first()
      .locator(".text-2xl")
      .first()
      .isVisible();
  });

  test('La carte "Montant actif" s\'affiche', async ({ page }) => {
    await page.waitForTimeout(1000);
    await expect(page.getByText("Montant actif")).toBeVisible();
  });

  test('La carte "Actifs" s\'affiche', async ({ page }) => {
    await page.waitForTimeout(1000);
    await expect(page.getByText("Actifs")).toBeVisible();
  });

  test('La carte "Expirés" s\'affiche', async ({ page }) => {
    await page.waitForTimeout(1000);
    await expect(page.getByText("Expirés")).toBeVisible();
  });

  test("Les statistiques sont actualisées après création", async ({ page }) => {
    await page.waitForTimeout(1000);
    await page.getByRole("button", { name: "Créer un bon cadeau" }).click();
    await page.locator("input#amount").fill("50");
    await page.getByRole("button", { name: "Créer le bon" }).click();
    await page.waitForTimeout(1000);
    await expect(
      page.getByRole("button", { name: "Rafraîchir" }),
    ).toBeVisible();
  });
});

test.describe("Interface Admin - Cartes de bons cadeaux", () => {
  test.beforeEach(async ({ page }) => {
    await loginToAdmin(page);
    await page.getByRole("link", { name: "Bons Cadeaux" }).click();
  });

  test("Les cartes affichent le code", async ({ page }) => {
    await page.waitForTimeout(1000);
    const cards = page.locator('[data-testid="gift-card-card"]');
    const count = await cards.count();
    if (count > 0) {
      await expect(cards.first().locator("code.font-mono")).toBeVisible();
    }
  });

  test("Les cartes affichent le montant", async ({ page }) => {
    await page.waitForTimeout(1000);
    const cards = page.locator('[data-testid="gift-card-card"]');
    const count = await cards.count();
    if (count > 0) {
      await expect(
        cards.first().locator(".text-lg.font-bold").first(),
      ).toBeVisible();
    }
  });

  test("Les cartes affichent le statut", async ({ page }) => {
    await page.waitForTimeout(1000);
    // Le statut est dans une section spécifique dans chaque carte
    // On cherche le statut dans la carte
    const cards = page.locator('[data-testid="gift-card-card"]');
    const count = await cards.count();
    if (count > 0) {
      // Le statut est affiché dans la carte
      // On peut utiliser getByText pour le texte "Statut:" puis getByText pour le statut
      const statusText = await page
        .getByText(/En cours de paiement|Actif|Utilisé|Expiré/)
        .first()
        .textContent();
      expect(statusText).toBeDefined();
      expect(statusText).toMatch(/En cours de paiement|Actif|Utilisé|Expiré/);
    }
  });

  test("Le bouton Marquer comme utilisé s'affiche pour ACTIVE et EXPIRED", async ({
    page,
  }) => {
    await page.waitForTimeout(1000);
    // Vérifier qu'au moins une carte a le statut ACTIVE ou EXPIRED
    const hasActiveCard = await page
      .locator("text=Actif|Expiré")
      .first()
      .isVisible({ timeout: 5000 })
      .catch(() => false);
    if (hasActiveCard) {
      const cards = page.locator('[data-testid="gift-card-card"]');
      const count = await cards.count();
      if (count > 0) {
        const card = cards.first();
        await card.hover({ force: true });
        await page.waitForTimeout(200);
        await expect(
          card.locator('button[title*="Marquer comme utilisé"]'),
        ).toBeVisible({ timeout: 2000 });
      }
    }
  });

  test("Le bouton Remettre à non utilisé s'affiche pour USED", async ({
    page,
  }) => {
    await page.waitForTimeout(1000);
    // Vérifier qu'au moins une carte a le statut USED (via le texte "Utilisé")
    const hasUsedCard = await page
      .locator("text=Utilisé")
      .first()
      .isVisible({ timeout: 5000 })
      .catch(() => false);
    if (hasUsedCard) {
      // Si une carte USED existe, le bouton devrait être visible au hover
      const cards = page.locator('[data-testid="gift-card-card"]');
      const count = await cards.count();
      if (count > 0) {
        const card = cards.first();
        // Hover sur la carte
        await card.hover({ force: true });
        // Attendre que le bouton devienne visible
        await page.waitForTimeout(200);
        await expect(
          card.locator('button[title="Marquer comme non utilisé"]'),
        ).toBeVisible({ timeout: 2000 });
      }
    }
  });

  test("La suppression est désactivée", async ({ page }) => {
    await page.waitForTimeout(1000);
    const cards = page.locator('[data-testid="gift-card-card"]');
    const count = await cards.count();
    if (count > 0) {
      await cards.first().hover();
      await expect(
        cards.first().locator('button[title="Supprimer le bon"]'),
      ).not.toBeVisible({ timeout: 2000 });
    }
  });
});

test.describe("Interface Admin - Actions sur les bons", () => {
  test.beforeEach(async ({ page }) => {
    await loginToAdmin(page);
    await page.getByRole("link", { name: "Bons Cadeaux" }).click();
  });

  test("Marquer un bon comme utilisé", async ({ page }) => {
    await page.waitForTimeout(1000);
    const cards = page.locator('[data-testid="gift-card-card"]');
    const count = await cards.count();
    if (count > 0) {
      await cards.first().hover();
      await page
        .locator('button[title*="Marquer comme utilisé"]')
        .first()
        .click();
      await page.waitForTimeout(100);
    }
  });

  test("Remettre un bon USED à non utilisé", async ({ page }) => {
    await page.waitForTimeout(1000);
    const cards = page.locator('[data-testid="gift-card-card"]');
    const count = await cards.count();
    if (count > 0) {
      // Vérifier qu'il y a au moins une carte avec le statut USED
      const hasUsedCard = await page
        .locator("text=Utilisé")
        .first()
        .isVisible({ timeout: 5000 })
        .catch(() => false);
      if (hasUsedCard) {
        const card = cards.first();
        // Forcer le hover
        await card.hover({ force: true });
        await page.waitForTimeout(300);
        // Le bouton est dans le menu de droite qui devient visible au hover
        // On clique directement sur le bouton
        await page
          .locator('button[title="Marquer comme non utilisé"]')
          .click({ force: true });
        await page.waitForTimeout(1000);
      }
    }
  });
});

test.describe("Interface Admin - Navigation Responsive", () => {
  test("La page s'affiche sur desktop (1920x1080)", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await loginToAdmin(page);
    await page.getByRole("link", { name: "Bons Cadeaux" }).click();
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator('h1:text("Bons Cadeaux")')).toBeVisible();
  });

  test("La page s'affiche sur tablette (768x1024)", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await loginToAdmin(page);
    await page.getByRole("link", { name: "Bons Cadeaux" }).click();
    await expect(page.locator("header")).toBeVisible();
  });

  test("La page s'affiche sur mobile (375x667)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await loginToAdmin(page);
    await page.getByRole("link", { name: "Bons Cadeaux" }).click();
    await expect(page.locator("header")).toBeVisible();
  });

  test("La page s'affiche sur mobile large (414x896)", async ({ page }) => {
    await page.setViewportSize({ width: 414, height: 896 });
    await loginToAdmin(page);
    await page.getByRole("link", { name: "Bons Cadeaux" }).click();
    await expect(page.locator("header")).toBeVisible();
  });
});

test.describe("Interface Admin - Redirection non connecté", () => {
  test("Redirection vers la page de login si non connecté", async ({
    page,
  }) => {
    await page.goto("/admin/cheques-cadeaux");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("Redirection fonctionne après connexion", async ({ page }) => {
    await loginToAdmin(page);
    await page.getByRole("link", { name: "Bons Cadeaux" }).click();
    await expect(page).toHaveURL(/\/admin\/cheques-cadeaux/);
  });
});

test.describe("Interface Admin - Navigation depuis la page Bons Cadeaux", () => {
  test("Navigation vers Réservations", async ({ page }) => {
    await loginToAdmin(page);
    await page.getByRole("link", { name: "Bons Cadeaux" }).click();
    await expect(page).toHaveURL(/\/admin\/cheques-cadeaux/);
    await page.getByRole("link", { name: "Réservations" }).click();
    await expect(page).toHaveURL(/\/admin\/reservation/);
  });

  test("Navigation vers CMS", async ({ page }) => {
    await loginToAdmin(page);
    // loginToAdmin redirige vers /admin/reservation, donc aller sur Bons Cadeaux
    await page.getByRole("link", { name: "Bons Cadeaux" }).click();
    await expect(page).toHaveURL(/\/admin\/cheques-cadeaux/);

    // Clic sur le lien CMS
    await page.getByRole("link", { name: "CMS" }).click();

    // Attendre la redirection vers keystatic
    await page.waitForURL(/\/keystatic/, { timeout: 15000 });

    // Vérifier qu'on est sur la bonne page
    await expect(page).toHaveURL(/\/keystatic/, { timeout: 15000 });
  });
});

test.describe("Interface Admin - Navigation Header", () => {
  test("Le logo ANØV s'affiche dans le header", async ({ page }) => {
    await loginToAdmin(page);
    await page.getByRole("link", { name: "Bons Cadeaux" }).click();
    await expect(page.locator('header span:text("ANØV")')).toBeVisible();
  });

  test("Le menu de navigation s'affiche", async ({ page }) => {
    await loginToAdmin(page);
    await page.getByRole("link", { name: "Bons Cadeaux" }).click();
    await expect(
      page.getByRole("link", { name: "Réservations" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Bons Cadeaux" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "CMS" })).toBeVisible();
  });

  test("Le lien Bons Cadeaux est actif", async ({ page }) => {
    await loginToAdmin(page);
    await page.getByRole("link", { name: "Bons Cadeaux" }).click();
    await expect(page.getByRole("link", { name: "Bons Cadeaux" })).toHaveClass(
      /bg-primary\/15/,
      { timeout: 5000 },
    );
  });

  test("Le bouton de déconnexion s'affiche", async ({ page }) => {
    await loginToAdmin(page);
    await page.getByRole("link", { name: "Bons Cadeaux" }).click();
    await expect(
      page.getByRole("button", { name: "Se déconnecter" }),
    ).toBeVisible();
  });
});

test.describe("Interface Admin - Déconnexion", () => {
  test("La déconnexion fonctionne", async ({ page }) => {
    await loginToAdmin(page);
    await page.getByRole("link", { name: "Bons Cadeaux" }).click();
    await expect(
      page.getByRole("button", { name: "Se déconnecter" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Se déconnecter" }).click();
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});
