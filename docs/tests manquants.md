# Tests Manquants - Analyse du Projet ANOV

## Date de l'analyse

Juillet 2026

## Résumé Exécutif

Le projet possède une base de tests E2E Playwright solide, mais manque de tests unitaires approfondis pour les fonctions critiques du backend. De nombreux composants React ont seulement des "placeholder tests" qui vérifient simplement l'importation des modules.

---

## 1. Tests Unitaires Manquants (Vitest)

### Librairies Critiques (Priorité Haute)

#### `src/lib/availability.ts`

**État actuel :** Seulement un placeholder test

```typescript
// availability.test.ts
it("has placeholder tests for availability functions", () => {
  expect(true).toBe(true);
});
```

**Fonctions à tester :**

- `getAvailableSlots()` - Calcul des créneaux disponibles
- `getSlotsWithAvailability()` - Disponibilité par créneau
- `getUnavailableDatesForMonth()` - Dates indisponibles
- `getEffectiveConfig()` - Configuration effective (avec overrides)

#### `src/lib/auth.ts`

**État actuel :** Seulement un placeholder test

```typescript
// auth.test.ts
it("has placeholder tests for auth functions", () => {
  expect(true).toBe(true);
});
```

**Fonctions à tester :**

- `signAdminToken()` - Génération de token JWT
- `verifyAdminToken()` - Vérification de token
- `getAdminFromCookies()` - Récupération admin depuis cookies

#### `src/lib/stripe.ts`

**État actuel :** Seulement une constante testée

```typescript
it("should export DEPOSIT_PER_GUEST_CENTS constant", async () => {
  const { DEPOSIT_PER_GUEST_CENTS } = await import("@/lib/stripe");
  expect(DEPOSIT_PER_GUEST_CENTS).toBe(2000);
});
```

**Fonctions à tester :**

- `stripe` initialization
- `generateCheckoutSession()` (si existante)

---

### Tests Composants React (Vitest + React Testing Library)

#### `src/components/features/*`

**État actuel :** 5 tests placeholder, aucun test réel

**Tests à ajouter pour :**

- **Hero** - Affichage, images, clics
- **History** - Affichage contenu
- **Gallery** - Affichage images
- **MobileCarousel** - Carrousel mobile
- **OriginsMap** - Carte interactive

#### `src/components/layout/*`

**État actuel :** 4 tests placeholder, aucun test réel

**Tests à ajouter pour :**

- **Navbar** - Menu desktop, menu mobile, items
- **NavbarDropdown** - Dropdown functionality
- **LanguageSelector** - Changement de langue, options
- **Footer** - Liens, contenu

---

### Tests API Routes (Vitest)

#### `src/app/api/admin/*`

**État actuel :** Tests placeholder sans vérification réelle

**Routes à tester :**

- `GET /api/admin/auth` - Login admin
- `GET /api/admin/settings` - Récupération paramètres
- `PUT /api/admin/settings` - Mise à jour paramètres
- `GET /api/admin/tables` - Liste des tables
- `GET /api/admin/calendar` - Calendrier disponibilités
- `GET /api/admin/gift-cards` - Liste chèques cadeaux
- `POST /api/admin/gift-cards` - Création chèque cadeau
- `PATCH /api/admin/gift-cards/:id` - Mise à jour chèque
- `GET /api/admin/orders` - Liste commandes
- `GET /api/admin/orders/:id` - Détail commande
- `PATCH /api/admin/orders/:id` - Mise à jour commande (refund)
- `GET /api/admin/customers` - Liste clients
- `GET /api/admin/customers/:email` - Détail client
- `POST /api/admin/reservations` - Création réservation
- `DELETE /api/admin/reservations/cleanup` - Nettoyage

#### `src/app/api/boutique/*`

**État actuel :** Aucun test

**Routes à tester :**

- `POST /api/boutique/checkout` - Création session Stripe boutique
- Page `/boutique/succes` - Confirmation paiement

---

### Tests de Page (Vitest)

**État actuel :** Tests placeholder ne vérifiant que l'existence

**Pages à tester :**

- `src/app/admin/login/page.tsx` - Formulaire login admin
- `src/app/admin/reservation/page.tsx` - Gestion réservations
- `src/app/admin/cheques-cadeaux/page.tsx` - Gestion chèques cadeaux
- `src/app/admin/clients/page.tsx` - Gestion clients
- `src/app/admin/commandes/page.tsx` - Gestion commandes
- `src/app/admin/cms/[[...params]]/page.tsx` - Éditeur CMS

---

## 2. Tests E2E Playwright (Actuels)

### Tests Existants (Bons)

- **`tests/reservation.spec.ts`** - Tests de création de réservation
  - Tests API `/api/reservations` (POST)
  - Tests API `/api/reservations/availability`
  - Tests API `/api/reservations/[id]`
  - Tests API `/api/reservations/cancel`
  - Tests E2E complet (browser)
  - Tests Webhook Stripe

- **`tests/admin.spec.ts`** - Tests interface admin
  - Authentification admin
  - Navigation admin
  - Page réservations admin
  - Page Bons Cadeaux admin
  - Responsive (desktop/tablette/mobile)

- **`tests/cms.spec.ts`** - Tests contenu CMS
  - Hero section
  - History section
  - Contact section
  - Gallery
  - Origins Map
  - Multilingue (fr/en/de)

- **`tests/menu.spec.ts`** - Tests page menu
  - Onglets carte
  - Plats affichés
  - Navigation onglets

- **`tests/homepage.spec.ts`** - Tests page d'accueil
  - Hero, History, Origins
  - Menu responsive
  - Multilingue

- **`tests/gift-card.spec.ts`** - Tests chèques cadeaux
  - Page de succès
  - Modal création
  - Filtres
  - Statistiques

- **`tests/contact.spec.ts`** - Tests formulaire contact
  - Formulaire de contact
  - Envoi emails (Mailcatcher)
  - Validation email

---

### Tests E2E Manquants (Playwright)

#### `/tests/` - Manquants

1. **Test de la boutique**
   - Page `/boutique` affichage
   - Création produit
   - Session Stripe boutique
   - Webhook boutique

2. **Test de la page `/reservation/succes`**
   - Confirmation réservation
   - Email envoyé
   - Redirection

3. **Test de la page `/cheques-cadeaux/succes`**
   - Déjà testé dans `gift-card.spec.ts`, mais vérifier l'intégrité

4. **Test complet du workflow de paiement**
   - Réservation → Stripe → Webhook → Confirmation
   - Boutique → Stripe → Webhook → Confirmation
   - Chèque cadeau → Stripe → Webhook → Confirmation

5. **Test de la gestion de table**
   - Allocation de tables
   - Gestion des conflits (resto plein)
   - Tables de différentes capacités

6. **Test de la page `admin/clients/[email]`**
   - Détail client
   - Notes client
   - Historique

7. **Test de la page `admin/commandes/[id]`**
   - Détail commande
   - Mise à jour statut
   - Remboursement

8. **Test de la page `/reservation/cancel`**
   - Annulation par token
   - Email de confirmation
   - Remboursement Stripe

9. **Test du cron job**
   - `/api/cron/reminders` - Envoi rappels
   - SMS de rappel
   - Email de rappel

10. **Test de la page admin de gestion des tables**
    - Affichage tables
    - Création/modification tables

11. **Test de la page admin de gestion des overrides**
    - Création override (jour fermé)
    - Création override (horaires spéciales)

---

## 3. Fonctionnalités Critiques Non Testées

### Logique de disponibilité (Priorité Élevée)

```typescript
// src/lib/availability.ts - NON TESTÉ
getAvailableSlots(date: string, guests: number): Slot[]
getSlotsWithAvailability(date: string, guests: number): SlotWithAvailability[]
getUnavailableDatesForMonth(year: number, month: number): string[]
getEffectiveConfig(date: string): RestaurantConfig
```

### Logique d'attribution de table (Priorité Élevée)

```typescript
// src/lib/tables.ts - PARTIELLEMENT TESTÉ
// Tests unitaires existent mais pas d'intégration avec DB
assignTable({ dateStr, time, guests, mealDuration, isToday }): Table
pickTable(tables: Table[], busy: Set<number>, guests: number, isToday: boolean): Table | null
computeBusyTableIds(reservations: Reservation[], time: string, mealDuration: number): Set<number>
```

### Logique de calcul des créneaux (Priorité Moyenne)

```typescript
// src/lib/tables.ts - PARTIELLEMENT TESTÉ
computeServiceTurns(slots: string[], mealDuration: number): number
getTotalTableCapacity(tables: Table[]): number
```

### Authentification admin (Priorité Élevée)

```typescript
// src/lib/auth.ts - NON TESTÉ
signAdminToken(admin: Admin): string
verifyAdminToken(token: string): Admin | null
getAdminFromCookies(): Admin | null
```

### Webhook Stripe (Priorité Élevée)

```typescript
// src/app/api/stripe/webhook/route.ts - NON TESTÉ
handleGiftCardPayment();
handleReservationPayment();
handleProductOrderPayment();
```

### Cron job de rappel (Priorité Moyenne)

```typescript
// src/app/api/cron/reminders/route.ts - NON TESTÉ
sendSmsReminder();
sendReminderEmail();
```

---

## 4. Recommandations

### Priorité 1 (Tests Critiques)

1. **Créer un test d'intégration pour la logique d'attribution de tables**
   - Simuler un resto plein
   - Vérifier le fallback sur tables de plus grande capacité
   - Testez les cas limites (1 guest, 4 guests)

2. **Créer des tests unitaires pour `availability.ts`**
   - Tests avec mocking de Prisma
   - Tests avec overrides
   - Tests edge cases

3. **Créer des tests d'intégration pour `/api/reservations`**
   - Tests complets POST /api/reservations
   - Tests validation email, phone, guests
   - Tests cas d'erreurs (409, 400)

4. **Créer des tests de webhook Stripe**
   - Test complet du webhook
   - Simulation d'événements Stripe

### Priorité 2 (Tests Importants)

5. **Créer des tests pour `auth.ts`**
   - Test de sign/verify token
   - Test de validation de cookie

6. **Créer des tests pour `/api/admin/*`**
   - Test de toutes les routes admin
   - Test de la validation des inputs

7. **Créer des tests pour la boutique**
   - Page `/boutique`
   - Page `/boutique/succes`
   - Webhook boutique

### Priorité 3 (Amélioration)

8. **Créer des tests E2E complets**
   - workflow complet: Réserver → Stripe → Confirmation
   - workflow complet: Boutique → Stripe → Confirmation
   - workflow complet: Chèque cadeau → Stripe → Confirmation

9. **Créer des tests pour les composants React**
   - Utiliser React Testing Library
   - Tests d'interaction (click, input, etc.)
   - Tests de rendu conditionnel

10. **Créer des tests de performance**
    - Time to first byte
    - Temps de chargement des pages
    - Temps de réponse des API

---

## 5. Scores de Couverture Estimés

| Composant                | Couverture Actuelle | Couverture Cible |
| ------------------------ | ------------------- | ---------------- |
| Tests E2E (Playwright)   | ~60%                | ~90%             |
| Tests Unitaires (Vitest) | ~20%                | ~80%             |
| **Total estimé**         | **~40%**            | **~85%**         |

**Note :** Les tests E2E couvrent bien les workflows complets mais manquent de tests pour les cas d'erreurs et edge cases.

---

## 6. Checklist de Test à Compléter

### API Tests

- [ ] `/api/reservations` - POST (tous les cas d'erreur)
- [ ] `/api/reservations` - GET par ID
- [ ] `/api/reservations` - PATCH (admin)
- [ ] `/api/reservations/cancel` - token validation
- [ ] `/api/reservations/availability` - GET
- [ ] `/api/admin/auth` - login/logout
- [ ] `/api/admin/settings` - GET/PUT
- [ ] `/api/admin/tables` - GET
- [ ] `/api/admin/calendar` - GET
- [ ] `/api/admin/gift-cards` - GET/POST/PATCH
- [ ] `/api/admin/orders` - GET
- [ ] `/api/admin/orders/[id]` - GET/PATCH (refund)
- [ ] `/api/admin/customers` - GET
- [ ] `/api/admin/customers/[email]` - GET
- [ ] `/api/admin/reservations` - GET/PATCH
- [ ] `/api/stripe/webhook` - checkout.session.completed

### Unit Tests

- [ ] `src/lib/availability.ts` - getAvailableSlots, getSlotsWithAvailability
- [ ] `src/lib/auth.ts` - signAdminToken, verifyAdminToken, getAdminFromCookies
- [ ] `src/lib/email.ts` - generateICS, send emails
- [ ] `src/lib/sms.ts` - toE164, sendSmsReminder
- [ ] `src/lib/langs.ts` - getLocaleFromString, detectBrowserLocale, pickField
- [ ] `src/lib/utils.ts` - formatCurrency, formatDate, validateEmail, etc.
- [ ] `src/lib/tables.ts` - assignTable, pickTable, computeBusyTableIds

### Component Tests

- [ ] Hero (React Testing Library)
- [ ] History (React Testing Library)
- [ ] Gallery (React Testing Library)
- [ ] MobileCarousel (React Testing Library)
- [ ] OriginsMap (React Testing Library)
- [ ] Navbar (React Testing Library)
- [ ] NavbarDropdown (React Testing Library)
- [ ] LanguageSelector (React Testing Library)
- [ ] Footer (React Testing Library)
- [ ] Contact (React Testing Library)
- [ ] ReservationForm (React Testing Library)
- [ ] All admin pages (React Testing Library)

### E2E Tests

- [ ] Workflow complet réservation
- [ ] Workflow complet boutique
- [ ] Workflow complet chèque cadeau
- [ ] Admin workflow complet
- [ ] Multilingue (fr/en/de)
- [ ] Responsive (desktop/tablette/mobile)
- [ ] Gestion resto plein (409)
- [ ] Gestion des overrides
- [ ] Cron job (reminders)
- [ ] Webhook Stripe (tous les types)
- [ ] Annulation et remboursement

---

## Conclusion

Le projet a une bonne base de tests E2E mais nécessite :

1. **Plus de tests unitaires** pour la logique métier
2. **Plus de tests d'intégration** pour les API routes
3. **Plus de tests de composants** pour React
4. **Tests de cas d'erreurs** pour la validation
5. **Tests de performance** pour les temps de réponse

**Estimation temps pour couverture complète :**

- Tests unitaires : 20-30h
- Tests d'intégration API : 15-20h
- Tests composants React : 10-15h
- Tests E2E supplémentaires : 10-15h
- **Total : 55-80 heures**
