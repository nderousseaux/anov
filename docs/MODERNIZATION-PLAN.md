# Plan d'Audit et Modernisation Complexe - Application "l'Anøv"

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Audit complet et modernisation exhaustive de l'application Next.js l'Anøv pour améliorer l'organisation, la qualité du code, l'architecture et la maintenabilité.

**Architecture:** Application Next.js 15 avec Prisma/PostgreSQL, Keystatic pour le CMS, Filament pour l'admin panel. stack moderne mais nécessitant une refonte structurelle et une détection de code mort.

**Tech Stack:**

- Next.js 15.3.0 (App Router)
- TypeScript 5.7.0
- Prisma 7.8.0 (ORM)
- PostgreSQL (Neon)
- Keystatic 5.0.4 (CMS)
- Tailwind CSS 4.1.12
- Radix UI + Lucide React
- Stripe + Stripe.js
- Node.js 22.x

## Global Constraints

- Le code doit rester compatible avec Next.js 15 (App Router)
- Tous les fichiers TypeScript/TSX doivent avoir des types explicites
- Aucune dépendance ne doit être supprimée sans validation
- Les changements doivent être incremental et testables
- Le CI/CD doit passer après chaque commit

---

## Résultats de l'Audit (exécuté le 2026-06-20)

### Fichiers identifiés

- **Total fichiers source**: 128 fichiers TypeScript/TSX
- **Fichiers générés Prisma**: 5 fichiers dans `src/generated/prisma/`
- **Fichier `.bak` trouvé**: `src/components/History.tsx.bak`

### Fichiers de gros volume (>200 lignes)

| Fichier                                  | Lignes | Recommandation                       |
| ---------------------------------------- | ------ | ------------------------------------ |
| `src/app/admin/reservation/page.tsx`     | 740    | Refactoriser en plusieurs composants |
| `src/components/ui/sidebar.tsx`          | 726    | Peut être réduit/simplifié           |
| `src/components/OriginsMap.tsx`          | 612    | Extraire logic D3 dans un hook       |
| `src/app/admin/cheques-cadeaux/page.tsx` | 585    | Découper en sous-composants          |
| `src/app/reservation/page.tsx`           | 413    | Possible split                       |
| `src/app/api/admin/gift-cards/route.ts`  | 186    | OK (API route)                       |
| `src/lib/availability.ts`                | 222    | OK (service)                         |
| `src/components/History.tsx`             | 288    | Découper les sections                |
| `src/components/Navbar.tsx`              | 231    | Possible split                       |
| `src/components/Footer.tsx`              | 157    | OK                                   |
| `src/components/OriginsMap.tsx`          | 612    | Extraire D3 logic                    |

### Console.log à nettoyer

**Fichier**: `src/app/api/admin/gift-cards/route.ts`

- Ligne 115: `console.log('[admin/gift-cards] Email envoyé à:', emailValue);`
- Ligne 117: `console.error('[admin/gift-cards] Erreur lors de l\'envoi de l\'email:', error);`

**Fichier**: `src/app/api/stripe/webhook/route.ts`

- Ligne 12: `console.error('[stripe/webhook] STRIPE_WEBHOOK_SECRET manquant');`
- Ligne 26: `console.error('[stripe/webhook] Signature invalide :', err);`
- Ligne 42: `console.error('[stripe/webhook] Metadata incomplètes', meta);`
- Ligne 88: `console.log('[stripe/webhook] Email envoyé avec succès:', giftCard.recipientEmail);`
- Ligne 90: `console.log('[stripe/webhook] Aucun email à envoyer pour le chèque cadeau:', giftCard.code);`
- Ligne 96: `console.log('[stripe/webhook] Chèque cadeau activé:', giftCard.code);`
- Ligne 140: `console.log('[stripe/webhook] Réservation confirmée:', reservation.id);`
- Ligne 142: `console.error('[stripe/webhook] Erreur lors du traitement de la réservation:', error);`

**Fichier**: `src/lib/email.ts`

- Ligne 38: `console.log('Envoi email de confirmation désactivé - SMTP non configuré');`
- Ligne 83: `console.log('Envoi email de rappel désactivé - SMTP non configuré');`
- Ligne 124: `console.log('Envoi email d\'annulation désactivé - SMTP non configuré');`
- Ligne 160: `console.log('Envoi email de notification désactivé - SMTP non configuré');`
- Ligne 196: `console.log('Envoi email de confirmation désactivé - SMTP non configuré');`
- Ligne 234: `console.log('Envoi email de chèque cadeau désactivé - SMTP non configuré');`

### Fichiers avec `any` (à corriger)

- `src/context/LanguageContext.tsx` (ligne 16)
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/components/Gallery.tsx`
- `src/components/Hero.tsx`
- `src/components/OriginsMap.tsx`
- `src/components/LegalDocumentRenderer.tsx` (ligne 95)
- `src/components/Contact.tsx`
- `src/components/Footer.tsx`
- `src/components/History.tsx`
- `src/components/MenuContent.tsx`
- `src/lib/availability.ts`
- `src/lib/langs.ts` (ligne 34)
- `src/app/menu/page.tsx`
- `src/app/boutique/page.tsx`
- `src/app/cheques-cadeaux/page.tsx`
- `src/app/cheques-cadeaux/succes/GiftCardSuccessContent.tsx` (ligne 11)

---

### Task 1: Analyse de structure et identification des fichiers orphelins

**Files:**

- Analyser: `/Users/nderousseaux/Dev/anov/src/**/*.{ts,tsx,js,jsx}`
- Exclure: `node_modules/`, `.next/`, `dist/`

**Interfaces:**

- Consumes: None (audit initial)
- Produces: `docs/superpowers/plans/2026-06-20-file-analysis.md` (à créer)

- [ ] **Step 1: Identifier tous les fichiers source**

```bash
cd /Users/nderousseaux/Dev/anov
find src -type f \( -name "*.ts" -o -name "*.tsx" \) ! -path "*/node_modules/*" ! -path "*/.next/*" | sort > /tmp/all_files.txt
wc -l /tmp/all_files.txt
```

- [ ] **Step 2: Identifier les fichiers inutilisés (import/export analysis)**

```bash
# Chercher les imports inexistants dans src
grep -r "from ['\"]@/components/" src/ --include="*.ts" --include="*.tsx" | sed "s/.*from '\(.*\)'.*/\1/" | sort -u > /tmp/imports.txt

# Vérifier quels fichiers sont importés
for file in $(cat /tmp/all_files.txt); do
  basename=$(basename "$file" | sed 's/\.[^.]*$//')
  if ! grep -q "$basename" /tmp/imports.txt; then
    echo "Potentiellement inutilisé: $file"
  fi
done
```

- [ ] **Step 3: Identifier les fichiers inutilisés (export analysis)**

```bash
# Chercher les exports non utilisés
grep -r "export.*from" src/ --include="*.ts" --include="*.tsx" | sed "s/.*export.*'\(.*\)'.*/\1/" | sort -u > /tmp/exported.txt
```

- [ ] **Step 4: Identifier les fichiers "doublons" ou `.bak`**

```bash
# Trouver les fichiers .bak ou .old
find src -name "*.bak" -o -name "*.old" -o -name "*~"
```

- [ ] **Step 5: Créer le rapport d'analyse**

Créer le fichier `docs/superpowers/plans/2026-06-20-file-analysis.md` avec:

- Liste complète des fichiers
- Fichiers orphelins identifiés
- Fichiers `.bak` ou `~`
- Fichiers non importés
- Suggestions de suppression

---

### Task 2: Analyse de taille des fichiers et identification des candidats au refactoring

**Files:**

- Analyser: `/Users/nderousseaux/Dev/anov/src/**/*.ts`, `src/**/*.tsx`

**Interfaces:**

- Consumes: Résultat de Task 1
- Produces: `docs/superpowers/plans/2026-06-20-file-size-analysis.md`

- [ ] **Step 1: Lister tous les fichiers avec leur taille en lignes**

```bash
cd /Users/nderousseaux/Dev/anov
find src -type f \( -name "*.ts" -o -name "*.tsx" \) ! -path "*/node_modules/*" ! -path "*/.next/*" | while read f; do
  lines=$(wc -l < "$f")
  echo "$lines $f"
done | sort -rn > /tmp/file_sizes.txt
cat /tmp/file_sizes.txt
```

- [ ] **Step 2: Identifier les fichiers > 250 lignes**

Fichiers à revoir:

- `src/app/admin/reservation/page.tsx` (740 lignes)
- `src/components/ui/sidebar.tsx` (726 lignes)
- `src/components/OriginsMap.tsx` (612 lignes)
- `src/app/admin/cheques-cadeaux/page.tsx` (585 lignes)
- `src/app/reservation/page.tsx` (413 lignes)
- `src/app/api/admin/gift-cards/route.ts` (186 lignes)
- `src/lib/availability.ts` (222 lignes)

- [ ] **Step 3: Créer le rapport de détection de gros fichiers**

Créer `docs/superpowers/plans/2026-06-20-file-size-analysis.md` avec:

- Liste des fichiers > 200 lignes
- Recommandations de découpage
- Architecture proposée

---

### Task 3: Audit de qualité du code (console.log, TODO, code mort)

**Files:**

- Analyser: `/Users/nderousseaux/Dev/anov/src/**/*.ts`, `src/**/*.tsx`

**Interfaces:**

- Consumes: None
- Produces: `docs/superpowers/plans/2026-06-20-code-quality.md`

- [ ] **Step 1: Identifier tous les console.log**

```bash
cd /Users/nderousseaux/Dev/anov
grep -rn "console\.(log|error|warn)" src/ --include="*.ts" --include="*.tsx" --exclude-dir=node_modules | grep -v "generated/"
```

- [ ] **Step 2: Identifier les TODO/FIXME**

```bash
grep -rn "TODO\|FIXME\|XXX\|HACK" src/ --include="*.ts" --include="*.tsx" --exclude-dir=node-modules | grep -v "generated/"
```

- [ ] **Step 3: Identifier les imports inutilisés (ESLint)**

```bash
# Installer eslint si non présent, ou utiliser tsserver
cd /Users/nderousseaux/Dev/anov
npx tsc --noEmit --skipLibCheck
```

- [ ] **Step 4: Créer le rapport de qualité**

Créer `docs/superpowers/plans/2026-06-20-code-quality.md` avec:

- Liste des console.log à supprimer/remplacer
- Liste des TODO/FIXME à résoudre
- Liste des imports inutilisés
- Recommandations de cleanup

---

### Task 4: Analyse des dépendances (package.json)

**Files:**

- Analyser: `/Users/nderousseaux/Dev/anov/package.json`

**Interfaces:**

- Consumes: None
- Produces: `docs/superpowers/plans/2026-06-20-dependencies.md`

- [ ] **Step 1: Lister les dépendations directes**

```bash
cd /Users/nderousseaux/Dev/anov
jq '.dependencies' package.json | jq -r 'keys[]'
jq '.devDependencies' package.json | jq -r 'keys[]'
```

- [ ] **Step 2: Identifier les dépendances obsolètes**

```bash
# Vérifier les versions disponibles
npm view <package> versions --json | tail -5
```

- [ ] **Step 3: Analyser l'utilisation des dépendances**

Pour chaque dépendance, vérifier si elle est importée:

```bash
grep -r "import.*from ['\"]package-name['\"]\|import.*from ['\"]package-name" src/ --include="*.ts" --include="*.tsx"
```

- [ ] **Step 4: Créer le rapport de dépendances**

Créer `docs/superpowers/plans/2026-06-20-dependencies.md` avec:

- Liste des dépendances avec version actuelle/latest
- Dépendances inutilisées
- Recommandations de mise à jour
- Dépendances à supprimer

---

### Task 5: Analyse des tests et couverture

**Files:**

- Analyser: `/Users/nderousseaux/Dev/anov/__tests__/**`, `src/**/*.test.{ts,tsx}`, `src/**/*.spec.{ts,tsx}`

**Interfaces:**

- Consumes: None
- Produces: `docs/superpowers/plans/2026-06-20-tests.md`

- [ ] **Step 1: Identifier les fichiers de test existants**

```bash
find /Users/nderousseaux/Dev/anov -type f \( -name "*.test.*" -o -name "*.spec.*" -o -name "__tests__/*" \) 2>/dev/null
```

- [ ] **Step 2: Identifier les endpoints API sans tests**

Lister les fichiers dans `src/app/api/` et identifier ceux sans tests

- [ ] **Step 3: Créer le rapport de tests**

Créer `docs/superpowers/plans/2026-06-20-tests.md` avec:

- Couverture actuelle
- Fichiers critiques sans tests
- Plan de test recommandé

---

## Phases de Modernisation (Priorisées)

### Task 6: Déplacement et structuration des fichiers (refactoring)

**Prérequis:** Task 1, Task 2, Task 3 terminées

**Architecture proposée:**

```
src/
├── app/                 # Pages Next.js (unchanged)
├── components/          # Composants UI
│   ├── ui/             # Composants Radix/UI
│   ├── layout/         # Layouts (Header, Footer, etc.)
│   ├── features/       # Composants métier (ReservationForm, etc.)
│   └── shared/         # Composants partagés
├── lib/                # Utilitaires et services
│   ├── api/           # Appels API
│   ├── auth/          # Authentification
│   ├── email/         # Email utilities
│   ├── stripe/        # Stripe utils
│   └── prisma/        # Prisma helpers
├── types/              # Types TypeScript partagés
├── context/            # React Context
└── hooks/              # Custom hooks
```

**Interfaces:**

- Consumes: Résultats Tasks 1-5
- Produces: Nouvelle structure

- [ ] **Step 1: Créer la structure de dossiers**

```bash
mkdir -p /Users/nderousseaux/Dev/anov/src/components/layout
mkdir -p /Users/nderousseaux/Dev/anov/src/components/features
mkdir -p /Users/nderousseaux/Dev/anov/src/components/shared
mkdir -p /Users/nderousseaux/Dev/anov/src/lib/api
mkdir -p /Users/nderousseaux/Dev/anov/src/lib/auth
mkdir -p /Users/nderousseaux/Dev/anov/src/lib/stripe
mkdir -p /Users/nderousseaux/Dev/anov/src/lib/email
mkdir -p /Users/nderousseaux/Dev/anov/src/types
mkdir -p /Users/nderousseaux/Dev/anov/src/hooks
```

- [ ] **Step 2: Déplacer les fichiers (groupe par groupe)**

Déplacer les fichiers selon le plan:

- Layout components: `Footer.tsx`, `Navbar.tsx`, `LanguageSelector.tsx` → `components/layout/`
- Feature components: `History.tsx`, `Gallery.tsx`, `Contact.tsx`, `OriginsMap.tsx` → `components/features/`
- Admin components: `GiftCard*.tsx`, `AdminNav.tsx` → `components/admin/` (garder tel quel)
- Lib functions: voir Task 9 pour extraction

- [ ] **Step 3: Mettre à jour tous les imports**

```bash
cd /Users/nderousseaux/Dev/anov
# After moving files, update imports in app files
# Exemples:
# - src/app/page.tsx: import { History } from '@/components/features/History';
# - src/app/page.tsx: import { Gallery } from '@/components/features/Gallery';
# - src/app/page.tsx: import { Contact } from '@/components/features/Contact';
# - src/app/ClientLayout.tsx: import { Navbar } from '@/components/layout/Navbar';
# - src/app/ClientLayout.tsx: import { Footer } from '@/components/layout/Footer';
```

- [ ] **Step 4: Vérifier le build**

```bash
cd /Users/nderousseaux/Dev/anov
npm run build
```

---

### Task 7: Nettoyage du code (console.log, imports)

**Prérequis:** Task 3 terminée

- [ ] **Step 1: Supprimer les console.log de débogage**

**Fichier**: `src/lib/email.ts`
Supprimer ou remplacer les console.log par des logs via un logger (ex: winston) ou supprimer si pas critique:

```typescript
// Ancien
console.log("Envoi email de confirmation désactivé - SMTP non configuré");

// Nouveau (option 1: logger)
import { logger } from "@/lib/logger";
logger.debug("Email service disabled - SMTP not configured");

// Ou option 2: suppression si non critique
// Simply remove the console.log line
```

**Fichier**: `src/app/api/stripe/webhook/route.ts`
Supprimer les console.log pour production:

```typescript
// Remplacer par:
import { logger } from "@/lib/logger";
logger.info(
  "[stripe/webhook] Email envoyé avec succès:",
  giftCard.recipientEmail,
);
```

**Fichier**: `src/app/api/admin/gift-cards/route.ts`
Supprimer les console.log de debug:

```typescript
// Remplacer par un logger ou supprimer
```

- [ ] **Step 2: Supprimer les imports inutilisés**

- [ ] **Step 2: Supprimer les imports inutilisés**

```bash
# Exemple: si un fichier importe 'lucide-react' mais n'utilise que 2 icones
# Remplacer par des imports spécifiques
import { Menu, X } from 'lucide-react';
```

- [ ] **Step 3: Supprimer les fichiers .bak**

```bash
find /Users/nderousseaux/Dev/anov/src -name "*.bak" -delete
```

- [ ] **Step 4: Vérifier que tout compile**

```bash
cd /Users/nderousseaux/Dev/anov
npx tsc --noEmit
npm run build
```

---

### Task 8: Création des types TypeScript manquants

**Prérequis:** Task 5 terminée

- [ ] **Step 1: Identifier les types non définis**

```bash
# Chercher les "any" dans le code
grep -rn "any" src/ --include="*.ts" --include="*.tsx" | grep -v "generated/"
```

- [ ] **Step 2: Créer les types**

Créer `src/types/` avec:

- `reservation.ts`
- `gift-card.ts`
- `user.ts`
- `api.ts`
- `ui.ts`

- [ ] **Step 3: Remplacer les `any`**

```typescript
// Exemple
interface GiftCardEmailData {
  to: string;
  code: string;
  amount: number;
  personalMessage?: string;
  expiresAt: string;
}
```

- [ ] **Step 4: Vérifier le build**

```bash
cd /Users/nderousseaux/Dev/anov
npx tsc --noEmit
```

---

### Task 9: Extraction des fonctions utilitaires

**Prérequis:** Task 2 terminée

- [ ] **Step 1: Identifier les fonctions réutilisables**

Fonctions à extraire:

- `formatCurrency(amount: number, currency: string = 'EUR'): string` (dans BoutiqueContent.tsx, GiftCardCard.tsx)
- `formatDate(date: Date, locale: Locale): string` (dans plusieurs endroits)
- `formatTime(iso: string): string` (dans AdminReservationsPage.tsx)
- `validateEmail(email: string): boolean` (dans ChequesCadeauxContent.tsx)
- `formatFullDate(dateStr: string, locale: Locale): string` (dans AdminReservationsPage.tsx)
- `isToday(dateStr: string): boolean` (dans AdminReservationsPage.tsx)
- `getPreviousMonday(): string` (dans AdminReservationsPage.tsx)

- [ ] **Step 2: Créer les fichiers utilitaires**

Créer `src/lib/utils/` avec:

**`src/lib/utils/currency.ts`**

```typescript
export function formatCurrency(
  amount: number,
  currency: string = "EUR",
): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    currencyDisplay: "symbol",
  }).format(amount);
}
```

**`src/lib/utils/date.ts`**

```typescript
import type { Locale } from "@/lib/langs";

export const MONTHS_ABBR = [
  "janv",
  "févr",
  "mars",
  "avr",
  "mai",
  "juin",
  "juil",
  "août",
  "sept",
  "oct",
  "nov",
  "déc",
];
export const MONTHS_FULL = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];
export const DAYS_SHORT = {
  0: "Dim",
  1: "Lun",
  2: "Mar",
  3: "Mer",
  4: "Jeu",
  5: "Ven",
  6: "Sam",
};
export const DAYS_FULL = {
  0: "Dimanche",
  1: "Lundi",
  2: "Mardi",
  3: "Mercredi",
  4: "Jeudi",
  5: "Vendredi",
  6: "Samedi",
};

export function formatDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatFullDate(dateStr: string, locale: Locale): string {
  const d = new Date(dateStr + "T00:00:00.000Z");
  const dayName =
    locale === "fr"
      ? DAYS_FULL[d.getUTCDay()]
      : locale === "en"
        ? [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ][d.getUTCDay()]
        : [
            "Sonntag",
            "Montag",
            "Dienstag",
            "Mittwoch",
            "Donnerstag",
            "Freitag",
            "Samstag",
          ][d.getUTCDay()];
  const monthName =
    locale === "fr"
      ? MONTHS_FULL[d.getUTCMonth()]
      : locale === "en"
        ? [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ][d.getUTCMonth()]
        : [
            "Januar",
            "Februar",
            "März",
            "April",
            "Mai",
            "Juni",
            "Juli",
            "August",
            "September",
            "Oktober",
            "November",
            "Dezember",
          ][d.getUTCMonth()];
  return `${dayName} ${d.getUTCDate()} ${monthName} ${d.getUTCFullYear()}`;
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}

export function isToday(dateStr: string): boolean {
  return dateStr === new Date().toISOString().split("T")[0];
}

export function getPreviousMonday(): string {
  const now = new Date();
  const d = new Date(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()),
  );
  const dow = d.getUTCDay();
  d.setUTCDate(d.getUTCDate() - (dow === 0 ? 6 : dow - 1));
  return d.toISOString().split("T")[0];
}
```

**`src/lib/utils/validation.ts`**

```typescript
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
```

- [ ] **Step 3: Réécrire les composants**

```typescript
// Exemple: Dans ChequesCadeauxContent.tsx
import { formatCurrency } from "@/lib/utils/currency";
import { validateEmail } from "@/lib/utils/validation";

// Remplacer:
const formatted = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
}).format(amount);

// Par:
import { formatCurrency } from "@/lib/utils/currency";
const formatted = formatCurrency(amount, "EUR");
```

- [ ] **Step 4: Vérifier le build**

```bash
cd /Users/nderousseaux/Dev/anov
npm run build
```

---

### Task 10: Tests unitaires pour les fonctions critiques

**Prérequis:** Task 4 terminée

- [ ] **Step 1: Créer le fichier de test pour `lib/stripe.ts`**

```typescript
// src/lib/__tests__/stripe.test.ts
import { describe, it, expect } from "vitest";
import { stripe } from "../stripe";

describe("stripe", () => {
  it("should initialize stripe with correct API key", () => {
    expect(stripe).toBeDefined();
    expect(stripe?.getPublishableKey()).toBeDefined();
  });
});
```

- [ ] **Step 2: Créer le fichier de test pour `lib/availability.ts`**

```typescript
// src/lib/__tests__/availability.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getAvailableSlots,
  getSlotsWithAvailability,
  getUnavailableDatesForMonth,
} from "../availability";
import { prisma } from "../prisma";

vi.mock("../prisma", () => ({
  prisma: {
    restaurantSettings: { findFirst: vi.fn() },
    dayOverride: { findUnique: vi.fn(), findMany: vi.fn() },
    reservation: { findMany: vi.fn() },
  },
}));

describe("availability", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return available slots for a valid date", async () => {
    vi.mocked(prisma.restaurantSettings.findFirst).mockResolvedValue({
      maxCovers: 20,
      mealDuration: 90,
      openingDays: JSON.stringify([2, 3, 4, 5, 6]),
      openingSlots: JSON.stringify([
        "12:00",
        "12:30",
        "13:00",
        "19:00",
        "19:30",
        "20:00",
      ]),
    });
    vi.mocked(prisma.dayOverride.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.reservation.findMany).mockResolvedValue([]);

    const slots = await getAvailableSlots("2026-06-21");
    expect(slots.length).toBeGreaterThan(0);
  });

  it("should return empty array for closed day", async () => {
    vi.mocked(prisma.dayOverride.findUnique).mockResolvedValue({
      closed: true,
    } as any);

    const slots = await getAvailableSlots("2026-06-21");
    expect(slots).toEqual([]);
  });
});
```

- [ ] **Step 3: Créer le fichier de test pour `lib/email.ts`**

```typescript
// src/lib/__tests__/email.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { sendConfirmationEmail, sendGiftCardEmail } from "../email";

describe("email", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return null when SMTP not configured", async () => {
    const result = await sendConfirmationEmail({
      to: "test@example.com",
      name: "Test User",
      date: "2026-06-21",
      time: "19:00",
      guests: 2,
      cancelUrl: "http://localhost:3000/cancel",
    });
    expect(result).toBeNull();
  });
});
```

- [ ] **Step 4: Exécuter les tests**

```bash
cd /Users/nderousseaux/Dev/anov
# Installer vitest si pas déjà présent
pnpm add -D vitest @vitest/ui
# Créer le fichier de config
echo "export default { test: { environment: 'node' } }" > vitest.config.ts
# Lancer les tests
npx vitest run
```

- [ ] **Step 5: Installer vitest et configurer**

```bash
cd /Users/nderousseaux/Dev/anov
pnpm add -D vitest @vitest/ui
```

Créer `vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
  },
});
```

Créer `src/lib/__tests__/stripe.test.ts`, `src/lib/__tests__/availability.test.ts`, `src/lib/__tests__/email.test.ts`

---

### Task 11: Finalisation et validation

- [ ] **Step 1: Vérification complète**

```bash
cd /Users/nderousseaux/Dev/anov
# Build
npm run build

# Types
npx tsc --noEmit

# Lint (si ESLint configuré)
npx eslint src/
```

- [ ] **Step 2: Commit des changements**

```bash
cd /Users/nderousseaux/Dev/anov
git add .
git commit -m "refactor: modernize codebase - restructure, clean, type"
```

- [ ] **Step 3: Documentation**

Créer `docs/MODERNIZATION.md` avec:

- Nouvelle structure
- Guidelines de contribution
- Checklist de maintenance

---

## Ordre de priorité recommandé

### Phase 1 - Nettoyage immédiat (risque faible, impact élevé)

1. Task 7: Supprimer les console.log et les fichiers .bak
2. Task 8: Créer les types TypeScript manquants (remplacer `any`)

### Phase 2 - Refactoring structurel

3. Task 6: Déplacement et structuration des fichiers
4. Task 9: Extraction des fonctions utilitaires

### Phase 3 - Tests et validation

5. Task 10: Tests unitaires pour les fonctions critiques
6. Task 11: Finalisation et validation

---

## Checklist de validation

- [ ] Tous les fichiers `.bak` supprimés
- [ ] Tous les `console.log` de débogage supprimés ou remplacés
- [ ] Tous les imports inutilisés nettoyés
- [ ] Tous les types `any` remplacés par des types explicites
- [ ] Structure de dossiers réorganisée
- [ ] Tous les composants extraits dans le bon dossier
- [ ] Build réussi sans erreurs
- [ ] TSC `--noEmit` passe sans erreurs
- [ ] Tests unitaires créés pour les fonctions critiques
- [ ] Documentation mise à jour

---

## Estimation de l'effort

| Phase                            | Durée estimée    | Risque    |
| -------------------------------- | ---------------- | --------- |
| Phase 1: Nettoyage (Tasks 7-8)   | 2-3 heures       | Faible    |
| Phase 2: Refactoring (Tasks 6-9) | 6-8 heures       | Moyen     |
| Phase 3: Tests (Task 10)         | 4-5 heures       | Faible    |
| Phase 4: Finalisation (Task 11)  | 2-3 heures       | Faible    |
| **Total**                        | **14-19 heures** | **Moyen** |

---

## Ressources

- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Keystatic Docs](https://keystatic.com/docs)
- [Radix UI](https://www.radix-ui.com/docs)
