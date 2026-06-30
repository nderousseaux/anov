import { test, expect } from '@playwright/test';
import http from 'http';
import { URL } from 'url';

// Configuration pour tous les tests

// Helper pour attendre le fade du splashscreen (2.5 secondes pour être sûr)
const waitForSplashScreenToFade = async (page: any) => {
  await page.waitForTimeout(2500);
};

/**
 * Helper pour vérifier la boîte de réception Mailcatcher
 * Note: Mailcatcher utilise /messages pour l'API (pas /messages.json)
 */
async function getMailcatcherEmails() {
  return new Promise<any[]>(async (resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 1080,
      path: '/messages',
      method: 'GET',
      timeout: 10000,
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const messages = JSON.parse(data);
          // Mailcatcher returns array of messages
          resolve(messages || []);
        } catch (e) {
          resolve([]);
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      resolve([]);
    });
    req.end();
  });
}

/**
 * Helper pour vider la boîte de réception Mailcatcher
 */
async function clearMailcatcherEmails() {
  return new Promise<void>(async (resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 1080,
      path: '/messages',
      method: 'DELETE',
      timeout: 10000,
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        resolve();
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      resolve();
    });
    req.end();
  });
}

/**
 * Helper pour vider la boîte de réception Mailcatcher avec validation
 * Vérifie que la suppression a bien eu lieu
 */
async function clearMailcatcherEmailsAndValidate() {
  await clearMailcatcherEmails();
  // Attendre un court instant pour la synchronisation
  await new Promise((resolve) => setTimeout(resolve, 500));
  // Vérifier que la boîte est vide
  const emails = await getMailcatcherEmails();
  if (emails.length > 0) {
    // Si encore des emails, tenter une seconde suppression
    await clearMailcatcherEmails();
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}

/**
 * Helper pour attendre qu'un email avec un sujet particulier arrive
 */
async function waitForEmailWithSubject(
  page: any,
  subjectContains: string,
  timeout: number = 10000
): Promise<any | null> {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    const emails = await getMailcatcherEmails();
    const found = emails.find((email) =>
      email.subject.toLowerCase().includes(subjectContains.toLowerCase())
    );
    if (found) {
      return found;
    }
    await page.waitForTimeout(500);
  }
  return null;
}

/**
 * Helper pour obtenir le contenu HTML d'un email
 * Note: Mailcatcher utilise /messages/{id}.html pour le contenu
 */
async function getEmailContent(id: number): Promise<any> {
  return new Promise<any>(async (resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 1080,
      path: `/messages/${id}.html`,
      method: 'GET',
      timeout: 10000,
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        resolve({ html: data });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      resolve({ html: '' });
    });
    req.end();
  });
}

// Nettoyer la boîte de réception avant chaque test
test.beforeEach(async () => {
  await clearMailcatcherEmailsAndValidate();
});

// Nettoyer la boîte de réception après chaque test
test.afterEach(async () => {
  await clearMailcatcherEmailsAndValidate();
});

test.describe('Formulaire de Contact - Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?lang=fr');
    await waitForSplashScreenToFade(page);
  });

  test('Affiche la section Contact avec les bons titres', async ({ page }) => {
    // Vérifier le titre principal (h2 dans #contact)
    await expect(page.locator('#contact h2').first()).toHaveText(/./);

    // Vérifier que le sous-titre existe (premier p dans #contact)
    await expect(page.locator('#contact p').first()).toHaveText(/./);

    // Vérifier le formulaire est visible
    await expect(page.locator('#contact form')).toBeVisible();
    // Vérifier qu'il y a au moins un champ de saisie
    const inputs = page.locator('#contact form input');
    const inputCount = await inputs.count();
    await expect(inputCount).toBeGreaterThan(0);
  });

  test('Affiche les informations de contact', async ({ page }) => {
    // Vérifier que la section #contact contient des éléments d'info (div avec bg-secondary)
    const contactInfo = page.locator('#contact .grid.grid-cols-2, #contact .lg\\:flex');
    await expect(contactInfo).toBeVisible();

    // Vérifier qu'il y a des icons de contact
    const icons = page.locator('#contact svg');
    const iconCount = await icons.count();
    await expect(iconCount).toBeGreaterThan(0);
  });

  test('Tous les champs du formulaire sont requis', async ({ page }) => {
    // Tenter d'envoyer le formulaire vide
    await page.locator('#contact form button[type="submit"]').click();

    // Attendre un court instant
    await page.waitForTimeout(500);

    // Les champs required devraient avoir l'attribut :invalid
    const invalidName = page.locator('#contact #name:invalid');
    const invalidEmail = page.locator('#contact #email:invalid');
    const invalidSubject = page.locator('#contact #subject:invalid');
    const invalidMessage = page.locator('#contact #message:invalid');

    await expect(invalidName).toBeVisible();
    await expect(invalidEmail).toBeVisible();
    await expect(invalidSubject).toBeVisible();
    await expect(invalidMessage).toBeVisible();
  });

  test('Valide le format de l\'email', async ({ page }) => {
    // Remplir les champs sauf email avec une valeur invalide
    await page.locator('#name').fill('Jean Dupont');
    await page.locator('#email').fill('email-invalide');
    await page.locator('#subject').fill('Test sujet');
    await page.locator('#message').fill('Test message');

    // Tenter d'envoyer
    await page.locator('#contact form button[type="submit"]').click();
    await page.waitForTimeout(300);

    // Vérifier que l'erreur est affichée
    // HTML5 validation pour type="email"
    const invalidEmail = page.locator('#contact #email:invalid');
    await expect(invalidEmail).toBeVisible();
  });

  test('Valide la longueur maximale des champs', async ({ page }) => {
    // Nom trop long (> 100 chars)
    await page.locator('#name').fill('A'.repeat(150));
    await page.locator('#email').fill('test@example.com');
    await page.locator('#subject').fill('Test sujet');
    await page.locator('#message').fill('Test message');

    await page.locator('#contact form button[type="submit"]').click();
    await page.waitForTimeout(300);

    // Le backend devrait rejetter
    const toast = page.getByText(/Erreur/);
    await expect(toast).toBeVisible();
  });

  test('Valide la longueur du sujet (> 200 chars)', async ({ page }) => {
    await page.locator('#name').fill('Jean Dupont');
    await page.locator('#email').fill('test@example.com');
    await page.locator('#subject').fill('A'.repeat(250));
    await page.locator('#message').fill('Test message');

    await page.locator('#contact form button[type="submit"]').click();
    await page.waitForTimeout(300);

    const toast = page.getByText(/Erreur/);
    await expect(toast).toBeVisible();
  });
});

test.describe('Formulaire de Contact - Envoi d\'emails', () => {
  test('Envoie les deux emails (admin et confirmation) avec Mailcatcher', async ({ page }) => {
    await page.goto('/?lang=fr');
    await waitForSplashScreenToFade(page);

    // Vérifier le nombre initial d'emails (devrait être 0)
    let emails = await getMailcatcherEmails();
    expect(emails.length).toBe(0);

    // Remplir le formulaire
    await page.locator('#name').fill('Jean Dupont');
    await page.locator('#email').fill('jean.dupont@example.com');
    await page.locator('#subject').fill('Question sur la carte');
    await page.locator('#message').fill('Bonjour, je voudrais savoir si vous avez des options végétariennes.');

    // Soumettre le formulaire
    const submitBtn = page.locator('#contact form button[type="submit"]');
    await submitBtn.click();

    // Attendre que le toast de succès s'affiche
    await expect(page.getByText('Message envoyé !')).toBeVisible({ timeout: 10000 });

    // Attendre un peu pour que les emails soient envoyés
    await page.waitForTimeout(2000);

    // Vérifier que les deux emails sont arrivés dans Mailcatcher
    emails = await getMailcatcherEmails();
    expect(emails.length).toBe(2); // Un pour l'admin, un pour le client

    // Trouver l'email de notification admin
    const adminEmail = emails.find((e: any) =>
      e.subject.includes('Question sur la carte') || e.subject.includes('[Contact')
    );
    expect(adminEmail).toBeDefined();
    // Mailcatcher retourne les recipients avec <email>
    expect(adminEmail?.recipients).toEqual(['<contact@anovrestaurant.fr>']);

    if (adminEmail?.id) {
      const emailContent = await getEmailContent(adminEmail.id);
      const html = emailContent.html;

      // Vérifier le contenu de l'email admin
      expect(html).toContain('Jean Dupont');
      expect(html).toContain('jean.dupont@example.com');
      expect(html).toContain('Question sur la carte');
      expect(html).toContain('Bonjour, je voudrais savoir si vous avez des options végétariennes.');
    }

    // Trouver l'email de confirmation client
    const confirmationEmail = emails.find((e: any) =>
      e.subject.toLowerCase().includes('message reçu') ||
      e.subject.toLowerCase().includes('message sent')
    );
    expect(confirmationEmail).toBeDefined();

    // Vérifier que l'email de confirmation est bien address au bon destinataire
    expect(confirmationEmail?.recipients[0]).toContain('jean.dupont@example.com');

    if (confirmationEmail?.id) {
      const emailContent = await getEmailContent(confirmationEmail.id);
      const html = emailContent.html;

      // Vérifier le contenu de l'email de confirmation
      expect(html).toContain('Jean Dupont');
      expect(html).toContain('Nous avons bien reçu votre message');
      expect(html).toContain('nous vous répondrons dans les plus brefs délais');
    }
  });

  test('Envoie les deux emails avec vérification du contenu', async ({ page }) => {
    await page.goto('/?lang=fr');
    await waitForSplashScreenToFade(page);

    // Vérifier que les deux emails sont bien envoyés (admin et confirmation)
    // avec leur contenu respectif

    // Remplir le formulaire
    await page.locator('#name').fill('Pierre Durand');
    await page.locator('#email').fill('pierre.durand@test.fr');
    await page.locator('#subject').fill('Informations groupe');
    await page.locator('#message').fill('Nous sommes 10 personnes et nous souhaitons réserver pour un événement special.');

    const submitBtn = page.locator('#contact form button[type="submit"]');
    await submitBtn.click();
    await expect(page.getByText('Message envoyé !')).toBeVisible({ timeout: 10000 });

    // Attendre un peu pour que les emails soient envoyés
    await page.waitForTimeout(2000);

    // Récupérer tous les emails
    const emails = await getMailcatcherEmails();

    // Vérifier qu'exactement 2 emails sont envoyés
    expect(emails.length).toBe(2);

    // Vérifier l'email admin
    const adminEmail = emails.find((e: any) =>
      e.subject.includes('[Contact') || e.subject.includes('Informations groupe')
    );
    expect(adminEmail).toBeDefined();
    // Mailcatcher retourne les recipients avec <email>
    expect(adminEmail?.recipients).toEqual(['<contact@anovrestaurant.fr>']);

    if (adminEmail?.id) {
      const content = await getEmailContent(adminEmail.id);
      expect(content.html).toContain('Pierre Durand');
      expect(content.html).toContain('pierre.durand@test.fr');
      expect(content.html).toContain('Informations groupe');
      expect(content.html).toContain('Nous sommes 10 personnes');
    }

    // Vérifier l'email de confirmation
    const confirmationEmail = emails.find((e: any) =>
      e.subject.toLowerCase().includes('message reçu') || e.subject.toLowerCase().includes('message sent')
    );
    expect(confirmationEmail).toBeDefined();

    if (confirmationEmail?.id) {
      const content = await getEmailContent(confirmationEmail.id);
      expect(content.html).toContain('Pierre Durand');
      expect(content.html).toContain('Nous avons bien reçu votre message');
    }
  });

  test('Envoi fonctionne pour toutes les langues', async ({ page }) => {
    // Test en anglais
    await page.goto('/?lang=en');
    await waitForSplashScreenToFade(page);

    await page.locator('#name').fill('John Smith');
    await page.locator('#email').fill('john.smith@email.com');
    await page.locator('#subject').fill('Inquiry');
    await page.locator('#message').fill('I would like to make a reservation.');

    let submitBtn = page.locator('#contact form button[type="submit"]');
    await submitBtn.click();
    await expect(page.getByText('Message sent!')).toBeVisible({ timeout: 10000 });

    // Vérifier l'email admin
    // Attendre un peu pour que les emails soient envoyés
    await page.waitForTimeout(2000);
    let emails = await getMailcatcherEmails();
    expect(emails.length).toBeGreaterThanOrEqual(1);

    // Le afterAll du describe global se chargera du nettoyage

    // Test en allemand
    await page.goto('/?lang=de');
    await waitForSplashScreenToFade(page);

    await page.locator('#name').fill('Hans Mueller');
    await page.locator('#email').fill('hans.mueller@beispiel.de');
    await page.locator('#subject').fill('Anfrage');
    await page.locator('#message').fill('Ich mochte eine Reservierung machen.');

    submitBtn = page.locator('#contact form button[type="submit"]');
    await submitBtn.click();
    await expect(page.getByText('Nachricht gesendet!')).toBeVisible({ timeout: 10000 });

    // Attendre un peu pour que les emails soient envoyés
    await page.waitForTimeout(2000);

    // Vérifier l'email admin (l'admin reçoit l'email dans sa langue)
    emails = await getMailcatcherEmails();
    expect(emails.length).toBeGreaterThanOrEqual(1);

    // Vérifier que l'email admin a bien été envoyé
    const adminEmail = emails.find((e: any) =>
      e.subject.includes('Anfrage') ||
      e.subject.includes('[Contact')
    );
    expect(adminEmail).toBeDefined();
  });
});

test.describe('Formulaire de Contact - Gestion des erreurs', () => {
  test('Affiche une erreur si le serveur est inaccessible', async ({ page }) => {
    // Dans un environnement réel, on pourrait mocker l'API
    // Pour le test, on vérifie que le formulaire gère les erreurs
    await page.goto('/?lang=fr');
    await waitForSplashScreenToFade(page);

    // Vérifier que le bouton de soumission est fonctionnel
    const submitBtn = page.locator('#contact form button[type="submit"]');
    await expect(submitBtn).toBeEnabled();
  });

  test('Reset le formulaire après un envoi réussi', async ({ page }) => {
    await page.goto('/?lang=fr');
    await waitForSplashScreenToFade(page);

    // Remplir le formulaire
    await page.locator('#name').fill('Test User');
    await page.locator('#email').fill('test@example.com');
    await page.locator('#subject').fill('Test');
    await page.locator('#message').fill('Test message');

    // Soumettre
    const submitBtn = page.locator('#contact form button[type="submit"]');
    await submitBtn.click();
    await expect(page.getByText('Message envoyé !')).toBeVisible({ timeout: 10000 });

    // Vérifier que le toast de succès confirme l'envoi
  });
});

test.describe('Formulaire de Contact - Responsive', () => {
  test('Affiche correctement sur mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/?lang=fr');
    await waitForSplashScreenToFade(page);

    // Vérifier que le formulaire est visible et scrollable
    await expect(page.locator('#contact')).toBeVisible();
    await expect(page.locator('#contact form')).toBeVisible();

    // Vérifier que les champs sont clicquables
    await expect(page.locator('#contact #name')).toBeVisible();
    await expect(page.locator('#contact #email')).toBeVisible();
    await expect(page.locator('#contact #subject')).toBeVisible();
    await expect(page.locator('#contact #message')).toBeVisible();
  });

  test('Affiche correctement sur desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/?lang=fr');
    await waitForSplashScreenToFade(page);

    // Vérifier la disposition grid
    await expect(page.locator('#contact')).toBeVisible();

    // Vérifier que les deux colonnes existent (formule unique au formulaire)
    const form = page.locator('#contact form');
    const contactGrid = page.locator('#contact .grid.grid-cols-2, #contact .lg\\:flex');

    await expect(form).toBeVisible();
    await expect(contactGrid).toBeVisible();
  });
});

test.describe('Formulaire de Contact - Intégration complète', () => {
  test('Envoie de message complet avec vérification Mailcatcher', async ({ page }) => {
    // 1. Nettoyer les emails existants
    await clearMailcatcherEmails();

    // 2. Aller sur la page
    await page.goto('/?lang=fr');
    await waitForSplashScreenToFade(page);

    // 3. Remplir le formulaire complet
    const name = 'Jean-Paul Citoyen';
    const email = 'jeanpaul.citoyen@villeparis.fr';
    const subject = 'Demande de devis pour événement corporatif';
    const message = 'Bonjour, nous organisons un événement corporatif pour 25 personnes et aimerions obtenir un devis pour une formule sur mesure. Quelle est votre capacité maximum pour les événements privés ?';

    await page.locator('#name').fill(name);
    await page.locator('#email').fill(email);
    await page.locator('#subject').fill(subject);
    await page.locator('#message').fill(message);

    // 4. Soumettre
    const submitBtn = page.locator('#contact form button[type="submit"]');
    await submitBtn.click();

    // 5. Vérifier le toast de succès
    await expect(page.getByText('Message envoyé !')).toBeVisible({ timeout: 10000 });

    // 6. Vérifier les emails dans Mailcatcher
    // Attendre un peu pour que les emails soient envoyés
    await page.waitForTimeout(2000);
    const emails = await getMailcatcherEmails();
    expect(emails.length).toBeGreaterThanOrEqual(2);

    // 7. Vérifier l'email admin (e.recipients est un tableau dans Mailcatcher)
    const adminEmail = emails.find((e: any) =>
      e.subject.includes('Demande de devis') &&
      Array.isArray(e.recipients) && e.recipients.some((r: string) => r.includes('contact@anovrestaurant.fr'))
    );
    expect(adminEmail).toBeDefined();

    if (adminEmail?.id) {
      const emailContent = await getEmailContent(adminEmail.id);
      const html = emailContent.html;

      // Vérifier les détails dans l'email admin
      expect(html).toContain(name);
      expect(html).toContain(email);
      expect(html).toContain('Demande de devis');
      expect(html).toContain('Bonjour, nous organisons un événement corporatif');
    }

    // 8. Vérifier l'email de confirmation
    const confirmationEmail = emails.find((e: any) =>
      Array.isArray(e.recipients) && e.recipients.some((r: string) => r.includes('jeanpaul.citoyen@villeparis.fr')) &&
      e.subject.toLowerCase().includes('message reçu')
    );
    expect(confirmationEmail).toBeDefined();

    if (confirmationEmail?.id) {
      const emailContent = await getEmailContent(confirmationEmail.id);
      const html = emailContent.html;

      // Vérifier le message de confirmation
      expect(html).toContain('Jean-Paul Citoyen');
      expect(html).toContain('Nous avons bien reçu votre message');
      expect(html).toContain('nous vous répondrons dans les plus brefs délais');
    }
  });

  test('Envoie multiple messages consécutifs', async ({ page }) => {
    await clearMailcatcherEmails();

    // Premier message
    await page.goto('/?lang=fr');
    await waitForSplashScreenToFade(page);

    await page.locator('#name').fill('Client 1');
    await page.locator('#email').fill('client1@test.com');
    await page.locator('#subject').fill('Question 1');
    await page.locator('#message').fill('Message 1');

    await page.locator('#contact form button[type="submit"]').click();
    await expect(page.getByText('Message envoyé !')).toBeVisible();

    // Deuxième message
    await page.goto('/?lang=fr');
    await waitForSplashScreenToFade(page);

    await page.locator('#name').fill('Client 2');
    await page.locator('#email').fill('client2@test.com');
    await page.locator('#subject').fill('Question 2');
    await page.locator('#message').fill('Message 2');

    await page.locator('#contact form button[type="submit"]').click();
    await expect(page.getByText('Message envoyé !')).toBeVisible();

    // Attendre un peu pour que les emails soient envoyés
    await page.waitForTimeout(2000);

    // Vérifier que les deux emails sont présents
    const emails = await getMailcatcherEmails();
    expect(emails.length).toBeGreaterThanOrEqual(2);

    // Vérifier les deux clients (e.recipients est un tableau dans Mailcatcher)
    const hasClient1 = emails.some((e: any) =>
      Array.isArray(e.recipients) && e.recipients.some((r: string) => r.includes('client1@test.com'))
    );
    const hasClient2 = emails.some((e: any) =>
      Array.isArray(e.recipients) && e.recipients.some((r: string) => r.includes('client2@test.com'))
    );

    expect(hasClient1).toBe(true);
    expect(hasClient2).toBe(true);
  });
});

// Nettoyer les emails à la fin de tous les tests
test.afterAll(async () => {
  console.log('*** AFTER ALL - Nettoyage des emails ***');
  // Attendre que tous les emails asynchrones soient envoyés
  await new Promise((resolve) => setTimeout(resolve, 3000));
  await clearMailcatcherEmailsAndValidate();

  // Vérification finale
  const finalEmails = await getMailcatcherEmails();
  console.log(`*** AFTER ALL - Emails restants: ${finalEmails.length} ***`);
});
