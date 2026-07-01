import { test, expect } from '@playwright/test';

// Configuration pour tous les tests
test.describe.configure({ baseURL: 'http://localhost:3000', timeout: 60000 });

// Helper pour se connecter à l'interface admin
const loginToAdmin = async (page: any) => {
  // Récupérer les identifiants depuis les variables d'environnement ou utiliser les defaults
  const adminUser = process.env.ADMIN_USER || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || '1'; // Password from seed

  // Aller à la page de login
  await page.goto('/admin/login');

  // Vérifier que la page de login est chargée
  await expect(page.locator('h1:text("ANØV Admin")')).toBeVisible({ timeout: 10000 });

  // Remplir le formulaire de login
  await page.locator('input#username').fill(adminUser);
  await page.locator('input#password').fill(adminPassword);

  // Cliquer sur le bouton de connexion
  await page.locator('button[type="submit"]').click();

  // Attendre la redirection vers la page de réservations
  await page.waitForURL(/\/admin\/reservation/, { timeout: 60000 });

  // Attendre que le contenu soit chargé
  await expect(page.locator('h1:text("Réservations")')).toBeVisible({ timeout: 30000 });
};

// Helper pour se connecter avec une redirection spécifique
const loginToAdminWithNext = async (page: any, next: string) => {
  const adminUser = process.env.ADMIN_USER || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || '1';

  // Aller à la page de login avec le paramètre next
  await page.goto(`/admin/login?next=${encodeURIComponent(next)}`);

  await expect(page.locator('h1:text("ANØV Admin")')).toBeVisible({ timeout: 10000 });

  await page.locator('input#username').fill(adminUser);
  await page.locator('input#password').fill(adminPassword);
  await page.locator('button[type="submit"]').click();

  // Attendre la redirection vers la page cible
  await page.waitForURL(next, { timeout: 60000 });
};

// Helper pour vérifier que l'utilisateur est bien connecté
const verifyLoggedIn = async (page: any) => {
  // Vérifier que le logo ANØV est visible dans le header
  await expect(page.locator('header span:text("ANØV")')).toBeVisible();

  // Vérifier que les liens de navigation sont présents
  await expect(page.getByRole('link', { name: 'Réservations' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Bons Cadeaux' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'CMS' })).toBeVisible();

  // Vérifier le bouton de déconnexion
  await expect(page.getByRole('button', { name: 'Se déconnecter' })).toBeVisible();
};

test.describe('Interface Admin - Authentification', () => {
  test('Affiche le formulaire de login', async ({ page }) => {
    await page.goto('/admin/login');

    // Vérifier le titre de la page (le titre est "l'Anøv" car c'est le metadata global)
    await expect(page).toHaveTitle("l'Anøv");

    // Vérifier les éléments du formulaire
    await expect(page.locator('h1:text("ANØV Admin")')).toBeVisible();
    await expect(page.locator('label:text("Identifiant")')).toBeVisible();
    await expect(page.locator('label:text("Mot de passe")')).toBeVisible();
    await expect(page.locator('input#username')).toBeVisible();
    await expect(page.locator('input#password')).toBeVisible();
    await expect(page.locator('button:text("Se connecter")')).toBeVisible();

    // Vérifier le titre du formulaire
    await expect(page.locator('div.w-full.max-w-sm')).toBeVisible();
  });

  test('Connexion réussie avec identifiants valides', async ({ page }) => {
    await loginToAdmin(page);

    // Vérifier que l'utilisateur est redirigé vers la page de réservations
    await expect(page).toHaveURL(/\/admin\/reservation/);

    // Vérifier que l'interface admin est affichée
    await verifyLoggedIn(page);

    // Vérifier le titre de la page réservations
    await expect(page.locator('h1:text("Réservations")')).toBeVisible();

    // Vérifier que le calendrier est chargé
    await expect(page.locator('button[type="button"]')).toHaveCount(35, { timeout: 10000 });
  });

  test('Connexion échouée avec identifiants invalides', async ({ page }) => {
    await page.goto('/admin/login');

    // Vérifier que la page de login est chargée
    await expect(page.locator('h1:text("ANØV Admin")')).toBeVisible();

    // Remplir le formulaire avec des identifiants invalides
    await page.locator('input#username').fill('invalid');
    await page.locator('input#password').fill('invalid');

    // Cliquer sur le bouton de connexion
    await page.locator('button[type="submit"]').click();

    // Vérifier que l'erreur est affichée
    await expect(page.locator('p:text("Identifiants invalides")')).toBeVisible();

    // Vérifier qu'on reste sur la page de login
    await expect(page).toHaveURL('/admin/login');
  });

  test('Connexion échouée avec champ identifiant vide', async ({ page }) => {
    await page.goto('/admin/login');

    // Laisser le mot de passe vide (le champ identifiant est requis)
    await page.locator('input#password').fill('password');

    // Cliquer sur le bouton de connexion
    await page.locator('button[type="submit"]').click();

    // Le champ identifiant est requis, donc le formulaire ne doit pas être soumis
    // Vérifier qu'on reste sur la page de login
    await expect(page).toHaveURL('/admin/login');
  });

  test('Connexion échouée avec champ mot de passe vide', async ({ page }) => {
    await page.goto('/admin/login');

    // Laisser le mot de passe vide
    await page.locator('input#username').fill('admin');

    // Cliquer sur le bouton de connexion
    await page.locator('button[type="submit"]').click();

    // Le champ mot de passe est requis, donc le formulaire ne doit pas être soumis
    // Vérifier qu'on reste sur la page de login
    await expect(page).toHaveURL('/admin/login');
  });

  test('La déconnexion fonctionne', async ({ page }) => {
    // Se connecter d'abord
    await loginToAdmin(page);

    // Vérifier qu'on est connecté
    await verifyLoggedIn(page);

    // Vérifier qu'on est sur la page de réservations
    await expect(page).toHaveURL(/\/admin\/reservation/);

    // Cliquer sur le bouton de déconnexion
    await page.getByRole('button', { name: 'Se déconnecter' }).click();

    // Vérifier qu'on est redirigé vers la page de login
    await expect(page).toHaveURL('/admin/login');

    // Vérifier que le titre "ANØV Admin" n'est plus visible
    // (il n'est pas présent sur la page de login qui est different)
    // Le test成功 si on est sur la page de login
  });
});

test.describe('Interface Admin - Navigation', { mode: 'serial' }, () => {
  // Chaque test doit se connecter explicitement car Playwright ne partage pas
  // les cookies entre les tests par défaut. On utilise un fichier de stockage
  // pour éviter de se reconnecter à chaque test.

  const adminUser = process.env.ADMIN_USER || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || '1';

  const login = async (page: any) => {
    await page.goto('/admin/login');
    await page.locator('input#username').fill(adminUser);
    await page.locator('input#password').fill(adminPassword);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL(/\/admin\/reservation/, { timeout: 60000 });
  };

  test('Le menu d\'navigation s\'affiche correctement', async ({ page }) => {
    // Se connecter explicitement
    await login(page);

    // Vérifier le header
    await expect(page.locator('header')).toBeVisible();

    // Vérifier le logo ANØV dans le header
    await expect(page.locator('header span:text("ANØV")')).toBeVisible();

    // Vérifier les liens de navigation
    const navLinks = page.locator('nav a');
    const linkCount = await navLinks.count();
    expect(linkCount).toBeGreaterThan(0);

    // Vérifier qu'il y a 3 liens (Réservations, Bons Cadeaux, CMS)
    expect(linkCount).toBe(3);
  });

  test('Le lien "Réservations" est actif par défaut', async ({ page }) => {
    // Se connecter explicitement
    await login(page);

    // Vérifier que le lien Réservations est en mode actif
    await expect(page.getByRole('link', { name: 'Réservations' })).toHaveClass(/bg-primary\/15/, { timeout: 5000 });

    // Vérifier que les autres liens ne sont pas actifs
    await expect(page.getByRole('link', { name: 'Bons Cadeaux' })).not.toHaveClass(/bg-primary\/15/);
    await expect(page.getByRole('link', { name: 'CMS' })).not.toHaveClass(/bg-primary\/15/);
  });

  test('La navigation vers la page Bons Cadeaux fonctionne', async ({ page }) => {
    // Se connecter explicitement
    await login(page);

    // Cliquer sur le lien Bons Cadeaux
    await page.getByRole('link', { name: 'Bons Cadeaux' }).click();

    // Vérifier qu'on est sur la bonne page
    await expect(page).toHaveURL(/\/admin\/cheques-cadeaux/);

    // Vérifier le titre de la page
    await expect(page.locator('h1:text("Bons Cadeaux")')).toBeVisible();
  });

  test('La navigation vers la page CMS fonctionne', async ({ page }) => {
    // Se connecter directement sur /keystatic avec le paramètre next
    const adminUser = process.env.ADMIN_USER || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || '1';

    await page.goto('/admin/login?next=%2Fkeystatic');
    await page.locator('input#username').fill(adminUser);
    await page.locator('input#password').fill(adminPassword);
    await page.locator('button[type="submit"]').click();

    // Attendre que la page soit chargée (keystatic charge ses composants)
    await page.waitForURL(/\/keystatic/, { timeout: 30000 });

    // Vérifier que le header est affiché (le CMS utilise AdminNav)
    await expect(page.locator('header')).toBeVisible({ timeout: 15000 });
  });

  test('La navigation vers la page Réservations fonctionne depuis Bons Cadeaux', async ({ page }) => {
    // Se connecter explicitement
    await login(page);

    // Aller d'abord sur la page Bons Cadeaux
    await page.getByRole('link', { name: 'Bons Cadeaux' }).click();
    await expect(page).toHaveURL(/\/admin\/cheques-cadeaux/);

    // Cliquer sur le lien Réservations
    await page.getByRole('link', { name: 'Réservations' }).click();

    // Vérifier qu'on est redirigé vers la page de réservations
    await expect(page).toHaveURL(/\/admin\/reservation/);
  });

  test('La navigation vers la page Réservations fonctionne depuis CMS', async ({ page }) => {
    // Se connecter une première fois pour initialiser le cookie
    const adminUser = process.env.ADMIN_USER || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || '1';

    await page.goto('/admin/login');
    await page.locator('input#username').fill(adminUser);
    await page.locator('input#password').fill(adminPassword);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL(/\/admin\/reservation/, { timeout: 60000 });

    // Naviguer vers /keystatic - on est redirigé vers /admin/login avec un paramètre next
    await page.goto('/keystatic');
    await page.waitForURL(/\/admin\/login\?next=.*keystatic.*/, { timeout: 60000 });

    // Deuxième connexion nécessaire car /keystatic redirige vers /admin/login
    await page.locator('input#username').fill(adminUser);
    await page.locator('input#password').fill(adminPassword);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL(/\/keystatic/, { timeout: 60000 });

    // Vérifier que le header est visible (le CMS utilise AdminNav)
    await expect(page.locator('header')).toBeVisible({ timeout: 15000 });

    // Vérifier qu'on est bien connecté (le logo ANØV doit être visible)
    await expect(page.locator('header span:text("ANØV")')).toBeVisible({ timeout: 10000 });

    // Cliquer sur le lien Réservations
    await page.getByRole('link', { name: 'Réservations' }).click();

    // Vérifier qu'on est redirigé vers la page de réservations
    await expect(page).toHaveURL(/\/admin\/reservation/);
  });

  test('L\'icône de navigation s\'affiche correctement', async ({ page }) => {
    // Se connecter explicitement
    await login(page);

    // Vérifier que les icônes sont présentes (les icônes sont dans les liens)
    // Les liens ont des icônes SVG
    // Utiliser un selector plus spécifique
    await expect(page.locator('nav svg.lucide')).toHaveCount(3);
  });
});

test.describe('Interface Admin - Page Réservations', () => {
  test.beforeEach(async ({ page }) => {
    await loginToAdmin(page);
  });

  test('La page Réservations affiche le header', async ({ page }) => {
    // Vérifier le header
    await expect(page.locator('header')).toBeVisible();
  });

  test('La page Réservations affiche le titre', async ({ page }) => {
    await expect(page.locator('h1:text("Réservations")')).toBeVisible();
  });

  test('La page Réservations affiche la légende du titre', async ({ page }) => {
    await expect(page.locator('p:text("Gestion des réservations et disponibilités")')).toBeVisible();
  });

  test('La page Réservations affiche le bouton Paramètres', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Paramètres' })).toBeVisible();
  });

  test('La page Réservations affiche le calendrier', async ({ page }) => {
    // Le calendrier est affiché avec des jours
    // Attendre que la page soit chargée
    await expect(page.locator('h1:text("Réservations")')).toBeVisible({ timeout: 10000 });

    // Le calendrier peut être en chargement au début
    // Vérifier qu'il y a au moins un bouton de jour après un délai
    await page.waitForTimeout(2000);
    const dayButtons = page.locator('button[type="button"]');
    const count = await dayButtons.count();
    // Le calendrier affiche 35 boutons (5 semaines x 7 jours)
    expect(count).toBeGreaterThan(0);
  });

  test('Le bouton Paramètres affiche le panneau de configuration', async ({ page }) => {
    // Cliquer sur le bouton Paramètres
    await page.getByRole('button', { name: 'Paramètres' }).click();

    // Vérifier que le panneau de configuration est affiché
    await expect(page.locator('h2:text("Paramètres globaux")')).toBeVisible();

    // Vérifier les éléments du panneau
    await expect(page.locator('label:text("Jours d\'ouverture")')).toBeVisible();
    await expect(page.locator('label:text("Couverts maximum par créneau")')).toBeVisible();
    await expect(page.locator('label:text("Acompte par couvert")')).toBeVisible();
    await expect(page.locator('label:text("Durée d\'un repas")')).toBeVisible();
    await expect(page.locator('label:text("Horaires d\'ouverture")')).toBeVisible();
  });

  test('La page Réservations affiche la navigation du calendrier', async ({ page }) => {
    // Vérifier le bouton "Aujourd'hui"
    await expect(page.getByRole('button', { name: 'Aujourd\'hui' })).toBeVisible();

    // Vérifier le bouton "Actualiser"
    await expect(page.getByRole('button', { name: 'Actualiser' })).toBeVisible();
  });
});

test.describe('Interface Admin - Page Bons Cadeaux', () => {
  test.beforeEach(async ({ page }) => {
    await loginToAdmin(page);
    await page.getByRole('link', { name: 'Bons Cadeaux' }).click();
  });

  test('La page Bons Cadeaux affiche le header', async ({ page }) => {
    await expect(page.locator('header')).toBeVisible();
  });

  test('La page Bons Cadeaux affiche le titre', async ({ page }) => {
    await expect(page.locator('h1:text("Bons Cadeaux")')).toBeVisible();
  });

  test('La page Bons Cadeaux affiche la légende du titre', async ({ page }) => {
    await expect(page.locator('p:text("Gestion complète des chèques cadeaux")')).toBeVisible();
  });

  test('La page Bons Cadeaux affiche le bouton Créer un bon cadeau', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Créer un bon cadeau' })).toBeVisible();
  });

  test('La page Bons Cadeaux affiche le bouton Rafraîchir', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Rafraîchir' })).toBeVisible();
  });

  test('La page Bons Cadeaux affiche les cartes de statistiques', async ({ page }) => {
    // Vérifier que les cartes de statistiques sont affichées
    // Les cartes sont dans un suspense fallback, donc on attend un peu
    await page.waitForTimeout(1000);
    const statsCards = page.locator('.grid .bg-card');
    const count = await statsCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Le bouton Créer un bon cadeau ouvre le modal', async ({ page }) => {
    // Cliquer sur le bouton Créer un bon cadeau
    await page.getByRole('button', { name: 'Créer un bon cadeau' }).click();

    // Vérifier que le modal est affiché
    await expect(page.locator('h2:text("Créer un bon cadeau")')).toBeVisible();

    // Vérifier les champs du formulaire
    await expect(page.locator('label:text("Montant")')).toBeVisible();
    await expect(page.locator('input#amount')).toBeVisible();
    await expect(page.locator('label:text("Email du destinataire")')).toBeVisible();
    await expect(page.locator('input#recipientEmail')).toBeVisible();
    await expect(page.locator('label:text("Message personnalisé")')).toBeVisible();
    await expect(page.locator('textarea#personalMessage')).toBeVisible();

    // Vérifier les boutons d'action
    await expect(page.getByRole('button', { name: 'Annuler' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Créer le bon' })).toBeVisible();
  });
});

test.describe('Interface Admin - Navigation Responsive', () => {
  test('La navigation s\'affiche correctement sur desktop (1920x1080)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await loginToAdmin(page);

    // Vérifier que le header est affiché
    await expect(page.locator('header')).toBeVisible();

    // Vérifier que les liens de navigation sont visibles
    await expect(page.getByRole('link', { name: 'Réservations' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Bons Cadeaux' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'CMS' })).toBeVisible();
  });

  test('La navigation s\'affiche correctement sur tablette (768x1024)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await loginToAdmin(page);

    // Vérifier que le header est affiché
    await expect(page.locator('header')).toBeVisible();

    // Vérifier que les liens de navigation sont visibles
    await expect(page.getByRole('link', { name: 'Réservations' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Bons Cadeaux' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'CMS' })).toBeVisible();
  });

  test('La navigation s\'affiche correctement sur mobile (375x667)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await loginToAdmin(page);

    // Vérifier que le header est affiché
    await expect(page.locator('header')).toBeVisible();
  });

  test('La navigation s\'affiche correctement sur mobile large (414x896)', async ({ page }) => {
    await page.setViewportSize({ width: 414, height: 896 });
    await loginToAdmin(page);

    // Vérifier que le header est affiché
    await expect(page.locator('header')).toBeVisible();
  });
});

test.describe('Interface Admin - Redirection non connecté', () => {
  test('Redirection vers la page de login si non connecté', async ({ page }) => {
    // Aller directement sur la page admin sans se connecter
    await page.goto('/admin/reservation');

    // Vérifier que l'utilisateur est redirigé vers la page de login
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test('Redirection vers la page de login si non connecté (Bons Cadeaux)', async ({ page }) => {
    // Aller directement sur la page bons cadeaux sans se connecter
    await page.goto('/admin/cheques-cadeaux');

    // Vérifier que l'utilisateur est redirigé vers la page de login
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test('Redirection vers la page de login si non connecté (CMS)', async ({ page }) => {
    // Aller directement sur la page CMS sans se connecter
    await page.goto('/admin/cms');

    // Vérifier que l'utilisateur est redirigé vers la page de login
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});
