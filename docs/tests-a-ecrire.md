# Tests à Écrire - ANØV

**Date:** 2026-07-12  
**Objectif:** Compléter la couverture des tests unitaires

---

## Résumé Actuel

- **Tests unitaires (Vitest):** 2 fichiers
- **Tests E2E (Playwright):** 7 fichiers
- **Composants React:** 77+ fichiers (aucun test unitaire)
- **Librairies:** 6+ fichiers (couverture partielle)

---

## 1. Logique Métier - `src/lib/`

### `availability.ts` - HIGH PRIORITY
**Fonctions à tester :**
```typescript
- getEffectiveConfig(dateStr: string): Promise<EffectiveConfig | null>
- getSlotsWithAvailability(dateStr: string, guests: number): Promise<{time: string, available: boolean}[]>
- getUnavailableDatesForMonth(monthStr: string, guests: number): Promise<string[]>
```

**Cas de test à couvrir :**
- Configuration par défaut (slots, jours ouverture)
- Override par `dayOverride` (jour fermé, slots personnalisés)
- Logique de filtrage pour aujourd'hui (créneaux passés)
- Table de disponibilité avec 1, 2, 3, 4 guests
- Gestion des dates passées
- Gestion des mois entiers

### `tables.ts` - HIGH PRIORITY
**Fonctions à tester :**
```typescript
- computeServiceTurns(slots: string[], mealDuration: number): number
- getTotalTableCapacity(tables: TableInfo[]): number
- getTables(db: DbClient): Promise<TableInfo[]>
- getDayReservationsForTables(db: DbClient, dateStr: string): Promise<ReservationTableInfo[]>
- computeBusyTableIds(reservations: ReservationTableInfo[], time: string, mealDuration: number): Set<number>
- pickTable(tables: TableInfo[], busyTableIds: Set<number>, guests: number, isToday: boolean): TableInfo | null
- assignTable(params: AssignTableParams): Promise<TableInfo | null>
```

**Cas de test à couvrir :**
- TIER_BY_GUESTS mapping (1→table2, 2→table2/3, 3→table3/4, 4→table4)
- Calcul de tables occupées avec blocking window (mealDuration ±)
- Attribution table isToday vs future (flexibilité vs stricte)
- Fallback de table (ex: 3 guests → table 3, puis table 4)
- Gestion de reservations expirées

### `auth.ts` - MEDIUM PRIORITY
**Fonctions à tester :**
```typescript
- signAdminToken(adminId: number): Promise<string>
- verifyAdminToken(token: string): Promise<{sub: string, role: string} | null>
- getAdminFromCookies(): Promise<{id: number} | null>
```

**Cas de test à couvrir :**
- Signature de token avec différentes IDs
- Vérification de token valide
- Vérification de token expiré
- Vérification de token modifié
- Récupération depuis cookies (avec/sans token, token invalide)

### `email.ts` - MEDIUM PRIORITY
**Fonctions à tester :**
```typescript
- generateICS(): string
- sendConfirmationEmail(): Promise<string | null>
- sendReminderEmail(): Promise<string | null>
- sendCancellationEmail(): Promise<string | null>
- sendContactNotification(): Promise<string | null>
- sendContactConfirmation(): Promise<string | null>
- sendProductOrderConfirmationEmail(): Promise<string | null>
- sendProductOrderReadyEmail(): Promise<string | null>
- sendGiftCardEmail(): Promise<string | null>
```

**Cas de test à couvrir :**
- Génération ICS (format,timezone,escape characters)
- Envoi d'emails avec/sans SMTP configuré
- Gestion des erreurs d'envoi
- Format HTML des emails
- pièces jointes .ics

### `sms.ts` - LOW PRIORITY
**Fonctions à tester :**
```typescript
- toE164(phone: string): string
- sendSmsReminder(): Promise<void>
```

**Cas de test à couvrir :**
- Normalisation numéro français (06 → +336)
- Format E.164
- Gestion quand Twilio non configuré

### `langs.ts` - LOW PRIORITY
**Fonctions à tester :**
```typescript
- getLocaleFromString(value: string | null): Locale | null
- detectBrowserLocale(): Locale
- pickField<T>(obj: T, key: string, locale: Locale): string
```

**Cas de test à couvrir :**
- Détection locale navigateur
- Pick field avec fallback (_fr, bare key)
- Gestion des locales invalides

---

## 2. Composants React - `src/components/`

### Composants Features (HIGH PRIORITY)
**Fichiers à tester :**
```typescript
- Hero.tsx
- History.tsx
- Gallery.tsx
- Contact.tsx
- ReservationForm.tsx
- MobileCarousel.tsx
- OriginsMap.tsx
```

**Pourquoi:** Ce sont les composants principaux de l'interface utilisateur

### Composants Layout (MEDIUM PRIORITY)
**Fichiers à tester :**
```typescript
- Navbar.tsx
- NavbarDropdown.tsx
- Footer.tsx
- LanguageSelector.tsx
```

**Pourquoi:** Navigation principale de l'application

### Composants Admin (MEDIUM PRIORITY)
**Fichiers à tester :**
```typescript
- AdminNav.tsx
- GiftCardFilters.tsx
- GiftCardStats.tsx
- GiftCardCard.tsx
- GiftCardStatusBadge.tsx
- OrderDetailContent.tsx
```

### Composants Shared (LOW PRIORITY)
**Fichiers à tester :**
```typescript
- SplashScreen.tsx
- LegalDocumentRenderer.tsx
- MenuContent.tsx
- LegalLanguageNotice.tsx
- ChequesCadeauxContent.tsx
```

### Composants Boutique (LOW PRIORITY)
**Fichiers à tester :**
```typescript
- BoutiqueSectionClient.tsx
- ProductGrid.tsx
- ProductCard.tsx
- GiftCardButton.tsx
- OrderForm.tsx
- OrderStatusBadge.tsx
```

---

## 3. API Routes - Unit Tests

**Routes non testées via vitest (seulement E2E actuellement) :**

### Admin API
```typescript
- src/app/api/admin/gift-cards/route.ts (GET, POST, PATCH)
- src/app/api/admin/orders/route.ts (GET)
- src/app/api/admin/settings/route.ts
- src/app/api/admin/tables/route.ts
- src/app/api/admin/calendar/route.ts
- src/app/api/admin/auth/route.ts
- src/app/api/admin/reservations/route.ts
- src/app/api/admin/gift-cards/stats/route.ts
- src/app/api/admin/customers/route.ts
- src/app/api/admin/customers/[email]/route.ts
- src/app/api/admin/customers/[email]/note/route.ts
- src/app/api/admin/overrides/[date]/route.ts
- src/app/api/admin/reservations/cleanup/route.ts
```

### Boutique & Gift Cards
```typescript
- src/app/api/boutique/checkout/route.ts
- src/app/api/gift-cards/checkout/route.ts
```

### Reservation
```typescript
- src/app/api/reservations/cancel/route.ts
- src/app/api/reservations/by-session/route.ts
```

### Keystatic
```typescript
- src/app/api/keystatic/route.ts
- src/app/api/keystatic/[...params]/route.ts
```

### Webhook
```typescript
- src/app/api/stripe/webhook/route.ts (seulement E2E)
```

### Cron
```typescript
- src/app/api/cron/reminders/route.ts
```

### Utility
```typescript
- src/app/api/test-email/route.ts
```

---

## 4. Pages React - Unit Tests

### Pages Admin
```typescript
- src/app/admin/login/page.tsx
- src/app/admin/reservation/page.tsx
- src/app/admin/cheques-cadeaux/page.tsx
- src/app/admin/clients/page.tsx
- src/app/admin/commandes/page.tsx
- src/app/admin/cms/layout.tsx
- src/app/admin/cms/[[...params]]/page.tsx
- src/app/admin/clients/[email]/page.tsx
- src/app/admin/commandes/[id]/page.tsx
```

### Pages Client
```typescript
- src/app/menu/page.tsx
- src/app/boutique/page.tsx
- src/app/cheques-cadeaux/page.tsx
- src/app/cgv/page.tsx
- src/app/politique-de-confidentialite/page.tsx
- src/app/mentions-legales/page.tsx
```

### Pages de Transaction
```typescript
- src/app/reservation/succes/page.tsx
- src/app/reservation/cancel/page.tsx
- src/app/reservation/paiement/page.tsx
- src/app/boutique/succes/page.tsx
- src/app/cheques-cadeaux/succes/page.tsx
- src/app/cheques-cadeaux/succes/GiftCardSuccessContent.tsx
```

### Keystatic
```typescript
- src/app/keystatic/layout.tsx
- src/app/keystatic/[[...params]]/page.tsx
```

### App Layout
```typescript
- src/app/layout.tsx
- src/app/ClientLayout.tsx
```

---

## 5. Composants UI (shadcn) - LOW PRIORITY

**30+ composants** (souvent testés via E2E)

Fichiers à potentiellement tester :
```typescript
- button, input, textarea, select
- checkbox, radio-group, toggle, switch
- accordion, collapsible, dialog, drawer
- popover, tooltip, hover-card, dropdown-menu
- menubar, navigation-menu, sidebar
- card, badge, separator, progress, table
- calendar, form, carousel
- alert, alert-dialog
- menubar, context-menu, resizable
- breadcrumb, separator
```

---

## Ordre de Priorité Recommandé

### Phase 1 - Logique Critique (2-3 semaines)
1. `availability.ts` - Disponibilité des tables
2. `tables.ts` - Attribution des tables
3. `auth.ts` - Authentification JWT

### Phase 2 - Email & Communication (1-2 semaines)
4. `email.ts` - Toutes les fonctions d'envoi
5. `sms.ts` - Envoi SMS

### Phase 3 - Composants Principaux (2-3 semaines)
6. `Hero.tsx`, `History.tsx`, `Gallery.tsx`, `Contact.tsx`
7. `ReservationForm.tsx`
8. `Navbar.tsx`, `Footer.tsx`, `LanguageSelector.tsx`
9. `AdminNav.tsx`, `GiftCardCard.tsx`, `GiftCardStats.tsx`

### Phase 4 - Pages (1-2 semaines)
10. Pages admin (login, reservation, cheques-cadeaux)
11. Pages boutique et chèques cadeaux

### Phase 5 - Finition (1 semaine)
12. API Routes non testées
13. Pages de transaction (succès, annulation)

---

## Estimation

| Category | Composants/Fichiers | Effort Estimé |
|----------|--------------------|---------------|
| Librairies (logique) | 6 fichiers | 3-4 jours |
| Composants React | 77+ fichiers | 2-3 semaines |
| API Routes | 20+ fichiers | 1-2 semaines |
| Pages | 20+ fichiers | 1-2 semaines |
| **TOTAL** | ~120+ fichiers | 4-6 semaines |

---

## Notes

- Les tests E2E (Playwright) testent déjà les **flots complet utilisateur**
- Les tests unitaires ciblent la **logique métier et les fonctions pures**
- Composants React peuvent être testés en:
  - Unitaire (Vitest + React Testing Library)
  - E2E (Playwright - déjà fait pour les pages principales)
  - Snapshots (optionnel)

---

*Document généré le 2026-07-12*