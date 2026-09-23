# Documentation Technique - Anov Restaurant

**Version:** 1.0  
**Dernière mise à jour:** Juillet 2026  
**Auteur:** Développeur

---

## Table des matières

1. [Vue d'ensemble du projet](#vue-densemble-du-projet)
2. [Stack technique](#stack-technique)
3. [Architecture de l'application](#architecture-de-lapplication)
4. [Base de données](#base-de-données)
5. [Système de gestion de contenu (CMS)](#système-de-gestion-de-contenu-cms)
6. [API Routes](#api-routes)
7. [Authentication](#authentication)
8. [Gestion des langues](#gestion-des-langues)
9. [Système de réservations](#système-de-réservations)
10. [Paiements](#paiements)
11. [Emails et SMS](#emails-et-sms)
12. [Configuration](#configuration)

---

## Vue d'ensemble du projet

**Anov** est un site web de restaurant moderne qui permet :

- La réservation en ligne de tables
- La vente de chèques cadeaux
- La boutique de produits
- La gestion des contacts
- Un CMS pour la gestion du contenu du site

### Point d'entrée

```
src/
├── app/                 # Next.js App Router
│   ├── layout.tsx       # Root layout (fetches CMS data)
│   ├── ClientLayout.tsx # Layout client (Navbar, Footer, SplashScreen)
│   ├── page.tsx         # Page d'accueil
│   ├── menu/page.tsx    # Page menu
│   ├── admin/           # Dashboard admin (JWT auth)
│   ├── keystatic/       # Interface CMS Keystatic
│   └── api/             # API routes
├── components/          # React components
│   ├── layout/          # Navbar, Footer, LanguageSelector
│   ├── features/        # Hero, History, Gallery, Contact
│   └── ui/              # shadcn/ui components
├── context/             # React contexts (LanguageContext)
├── lib/                 # Utilitaires (prisma, auth, email, availability)
└── middleware.ts        # Protection des routes admin
```

---

## Stack technique

| Composant | Technologie | Version |
|-----------|-------------|---------|
| Framework | Next.js | 15.3.0 (App Router) |
| Base de données | PostgreSQL | (Neon en prod, Docker en local) |
| ORM | Prisma | 7.8.0 |
| CMS | Keystatic | 0.5.50 |
| UI Framework | React | 18.3.1 |
| Styles | Tailwind CSS | 4.1.12 |
| Composants UI | shadcn/ui | (Radix UI) |
| Authentification | JWT (jose) | |
| Paiements | Stripe | 22.2.0-beta.3 |
| Emails | Nodemailer | |
| SMS | Twilio | |

---

## Architecture de l'application

### Page d'accueil (`src/app/page.tsx`)
- Fetch des données CMS (hero, histoire, galerie, contact, origines)
- Composants : Hero, History, Gallery, OriginsMap, Contact
- URL paramètre `?lang=fr|en|de` pour la langue

### Page menu (`src/app/menu/page.tsx`)
- Fetch du menu depuis Keystatic
- Structure : Onglets → Catégories → Plats
- Affichage des prix et descriptions

### Layout client (`src/app/ClientLayout.tsx`)
- Navbar avec navigation et langue
- Footer avec infos contact
- SplashScreen (animation d'entrée)
- LanguageProvider (localStorage)

### Authentification admin
- Middleware protège `/admin/*`, `/keystatic/*`
- JWT stocké dans cookie `anov_admin_token`
-Expiration : 8h

---

## Base de données

### Schéma Prisma

```prisma
# Modèles principaux
Reservation      # Réservations de tables
Table            # Tables du restaurant (T1-T6)
Admin            # Comptes administrateurs
RestaurantSettings # Configuration du restaurant
DayOverride      # Overrides per-date (fermeture, horaires)

# E-commerce
GiftCard         # Chèques cadeaux
ProductOrder     # Commandes boutique
ProductAddress   # Adresses de livraison

# Autres
ContactMessage   # Messages de contact
CustomerNote     # Notes clients
```

### Modèle Reservation

| Champ | Type | Description |
|-------|------|-------------|
| id | String (cuid) | ID unique |
| name | String | Nom du client |
| email | String | Email |
| phone | String? | Téléphone optionnel |
| date | DateTime | Date et heure de la réservation |
| guests | Int | Nombre de couverts |
| specialRequest | String? | Demandes spéciales |
| wantsSmsReminder | Boolean | Rappel SMS |
| status | ReservationStatus | PENDING_PAYMENT, CONFIRMED, CANCELLED, COMPLETED, EXPIRED |
| stripeSessionId | String? | Session Stripe |
| depositPaidCents | Int? | Montant de l'acompte |
| tableId | Int? | Table attribuée |
| reminderEmailSent | Boolean | Rappel email envoyé |
| reminderSmsSent | Boolean | Rappel SMS envoyé |

### Modèle Table

| Champ | Type | Description |
|-------|------|-------------|
| id | Int | ID auto-increment |
| name | String | Nom de la table (T1-T6) |
| capacity | Int | Capacité (2-4 personnes) |
| posX/posY | Float | Position D3.js |

### Modèle GiftCard

| Champ | Type | Description |
|-------|------|-------------|
| id | String (cuid) | ID unique |
| code | String | Code unique (ANOV-G-XXXX-XXXX) |
| amount | Float | Montant |
| recipientEmail | String | Destinataire |
| personalMessage | String? | Message personnel |
| isPaid | Boolean | Payment effectué |
| status | GiftCardStatus | IN_PROGRESS_PAYMENT, ACTIVE, USED, EXPIRED |
| expiresAt | DateTime | Date d'expiration (12 mois) |

### Modèle RestaurantSettings (Singleton)

| Champ | Type | Description |
|-------|------|-------------|
| id | Int | 1 (singleton) |
| maxCovers | Int | Nombre maximum de couverts |
| mealDuration | Int | Durée du repas (par défaut 90 min) |
| openingDays | String | Jours ouverts [2,3,4,5,6] (Mar-Sam) |
| openingSlots | String | Creneaux ["12:00", "12:15", ...] |
| depositPerGuestCents | Int | Dépôt par couvert (2000 = 20€) |
| daysBeforeReminder | Int | Jours avant rappel (par défaut 3) |

---

## Système de gestion de contenu (CMS)

### Keystatic Configuration

**Fichier :** `src/keystatic.config.ts`  
**Mode:** GitHub (production) / Local (développement)

### Singletons CMS

| Nom | Fichier | Description |
|-----|---------|-------------|
| hero | `content/hero.yaml` | Image et sous-titre (3 langues) |
| histoire | `content/histoire.yaml` | "Notre histoire" (8 sections) |
| origines | `content/origines.yaml` | Carte des origines |
| galerie | `content/galerie.yaml` | Galerie photos |
| contact | `content/contact.yaml` | Info contact, horaires |
| menu | `content/menu.yaml` | Menu structure (onglets/catégories/plats) |
| footer | `content/footer.yaml` | Footer, réseaux sociaux |
| mentionsLegales | `content/mentions-legales.mdoc` | Mentions légales |
| politiqueConfidentialite | `content/politique-de-confidentialite.mdoc` | RGPD |
| cgv | `content/cgv.yaml` | CGV |
| boutique | `content/boutique.yaml` | Boutique et chèques cadeaux |
| giftCardSuccess | `content/gift-card-success.yaml` | Page de succès |
| chequesCadeaux | `content/cheques-cadeaux.yaml` | Configuration chèques |
| reservation | `content/reservation.yaml` | Page réservation |

### Format YAML

Tous les champs supportent 3 langues :
- `_fr` : français
- `_en` : anglais  
- `_de` : allemand

---

## API Routes

### `/api/reservations` (POST)

Crée une réservation avec Stripe checkout.

**Request body:**
```json
{
  "name": "Jean Dupont",
  "email": "jean@exemple.com",
  "phone": "+33612345678",
  "date": "2026-07-20",
  "time": "19:00",
  "guests": 4,
  "specialRequest": "Fête d'anniversaire"
}
```

**Response:**
```json
{
  "url": "https://checkout.stripe.com/...",
  "sessionId": "cs_test_..."
}
```

**Logique :**
1. Validation des données
2. Vérification des disponibilités via `getSlotsWithAvailability()`
3. Attribution d'une table via `getAssignTable()`
4. Création de la réservation en base
5. Création de la session Stripe (20€/personne)
6. Retour de l'URL de paiement

### `/api/contact` (POST)

Envoie le message de contact par email.

**Request body:**
```json
{
  "name": "Jean",
  "email": "jean@exemple.com",
  "subject": "Question sur le menu",
  "message": "J'aimerais savoir..."
}
```

### `/api/gift-cards/checkout` (POST)

Crée un chèque cadeau avec Stripe.

**Request body:**
```json
{
  "amount": "100€",
  "recipientEmail": "destinataire@exemple.com",
  "personalMessage": "Bonne fête !"
}
```

### `/api/boutique/checkout` (POST)

Crée une commande boutique.

**Request body:**
```json
{
  "productName": "Macarons (24)",
  "quantity": 2,
  "deliveryMethod": "DELIVERY",
  "price": 60,
  "customerName": "Jean Dupont",
  "customerEmail": "jean@exemple.com",
  "customerPhone": "+33612345678",
  "address": {...}
}
```

### `/api/stripe/webhook` (POST)

Webhook Stripe pour les événements de paiement.

**Gestion :**
- `checkout.session.completed` → Confirmation de la réservation
- Mise à jour du statut de la réservation/gift card

### `/api/cron/reminders` (GET)

Cron job pour les rappels de réservations.

**Protection :** Header `x-cron-secret`

**Logique :**
- Envoi de rappels 1 jour avant (email ou SMS)
- Réservations CONFIRMED uniquement
- SMS si téléphone renseigné, sinon email

### `/api/cron/gift-card-reminders` (GET)

Cron job pour les rappels d'expiration des chèques cadeaux.

**Logique :**
- Envoi 30 jours avant l'expiration
- Chèques ACTIVE uniquement

---

## Authentication

### JWT (jose)

**Fichier :** `src/lib/auth.ts`

```typescript
// Signer un token
signAdminToken(adminId) → string

// Vérifier un token
verifyAdminToken(token) → { sub, role } | null

// Obtenir l'admin depuis les cookies
getAdminFromCookies() → { id } | null
```

**Claims :**
- `sub` : admin ID
- `role` : "admin"

**Expiration :** 8 heures

**Cookie :** `anov_admin_token`

### Middleware de protection

**Fichier :** `src/middleware.ts`

Protège :
- `/admin/*`
- `/keystatic/*`
- `/api/keystatic/*`

**Logique :**
1. Redirection vers `/admin/login` si pas de token
2. Vérification du token JWT
3. Redirection si role !== "admin"

---

## Gestion des langues

### Internationalisation (i18n)

**3 langues supportées :**
- `fr` : français (par défaut)
- `en` : anglais
- `de` : allemand

### Implementation

**URL Parameter :** `?lang=fr|en|de`

**Storage :** localStorage `anov_locale`

**Context :** `src/context/LanguageContext.tsx`

**Translation files :**
- `src/lib/translations/fr.ts`
- `src/lib/translations/en.ts`
- `src/lib/translations/de.ts`

### Utilisation

```tsx
// Dans un composant
const { lang, t } = useLanguage();
t("nav.home"); // "Accueil"
```

---

## Système de réservations

### Disponibilité des tables

**Fichier :** `src/lib/availability.ts`

#### Fonctions principales

```typescript
// Récupérer les créneaux disponibles pour une date
getSlotsWithAvailability(dateStr, guests) → { time, available }[]

// Récupérer les dates sans disponibilité pour un mois
getUnavailableDatesForMonth(monthStr, guests) → string[]
```

#### Logique de disponibilité

1. **Vérification du jour :**
   - Les jours de fermeture sont dans `RestaurantSettings.openingDays`
   - Format : `[2,3,4,5,6]` (mardi à samedi)
   - Les overrides sont dans `DayOverride`

2. **Créneaux :**
   - Par défaut : 19 créneaux (12:00-13:45, 19:00-21:30)
   - 15 minutes d'intervalle
   - Filtrage pour aujourd'hui (créneaux passés)

3. **Logique de table :**
   - 6 tables : T1(2), T2(2), T3(3), T4(3), T5(4), T6(4)
   - Allocation basée sur le nombre de couverts
   - **1 guest** → table de 2
   - **2 guests** → table de 2 ou 3
   - **3 guests** → table de 3 ou 4
   - **4 guests** → table de 4
   - Même jour : smallest fitting table

### Attribution de table

**Fichier :** `src/lib/tables.ts`

```typescript
// Attribution d'une table pour une réservation
getAssignTable(db, dateStr, time, guests, mealDuration) → Table | null
```

**Logique :**
1. Récupérer les réservations du jour
2. Calculer les tables occupées (avec `computeBusyTableIds`)
3. Choisir une table disponible avec `pickTable`
4. Créer la réservation avec la table attribuée (transaction)

---

## Paiements

### Stripe Integration

**Fichier :** `src/lib/stripe.ts`

```typescript
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export const DEPOSIT_PER_GUEST_CENTS = 2000; // 20€
```

### Sessions de paiement

**Chargement de l'image :**
- Image fixe pour les réservations : `https://images.unsplash.com/...`

**Modes :**
- `payment` : paiement direct (deposit, gift card, boutique)

**Metadata :**
- `reservationId`, `giftCardId`, `orderId`

**URLs de callback :**
- `success_url` : `/reservation/succes?session_id=...`
- `cancel_url` : `/reservation/cancel?token=...`

### Webhook Stripe

**Endpoint :** `/api/stripe/webhook`

**Gestion des événements :**

```typescript
switch (event.type) {
  case 'checkout.session.completed':
    // Réservation : update status to CONFIRMED
    // Gift card : update status to ACTIVE
    // Product order : update status to CONFIRMED
    break;
}
```

---

## Emails et SMS

### Email (Nodemailer)

**Fichier :** `src/lib/email.ts`

#### Templates

| Fonction | Usage |
|----------|-------|
| `sendConfirmationEmail()` | Confirmation de réservation |
| `sendReminderEmail()` | Rappel 1 jour avant |
| `sendCancellationEmail()` | Annulation |
| `sendContactNotification()` | Nouveau message de contact |
| `sendContactConfirmation()` | Confirmation contact |
| `sendGiftCardEmail()` | Envoi du chèque cadeau |
| `sendGiftCardExpirationReminder()` | Rappel expiration |
| `sendProductOrderConfirmation()` | Confirmation commande |
| `sendProductOrderReady()` | Commande prête/envoyée |

#### Structure des emails

- En-tête : `l'Anøv <noreply@anov.fr>`
- Style : Georgia, serif, max-width 600px
- Couleurs : `#e3cb6b` (jaune), `#1a1a1a` (noir)
- Pièce jointe : fichier `.ics` (calendrier)

### SMS (Twilio)

**Fichier :** `src/lib/sms.ts`

```typescript
// Configuration
TWILO_SID, TWILO_AUTH, TWILO_PHONE_NUMBER
RESTAURANT_PHONE
```

#### Fonction

```typescript
sendSmsReminder({ to, name, date, time, guests, daysBefore })
```

**Format :**
```
ANØV — Bonjour Jean, votre réservation pour 4 personnes est prévue demain, le lundi 20 juillet à 19:00. À bientôt ! Pour nous contacter : +33612345678
```

---

## Configuration

### Variables d'environnement

**Fichier :** `.env.local`

#### Base de données
```
DATABASE_URL=postgresql://... (Neon en prod, Docker en local)
```

#### Stripe
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

#### SMTP
```
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=info@anov.fr
SMTP_PASSWORD=...
SMTP_FROM="l'Anøv <noreply@anov.fr>"
CONTACT_EMAIL=contact@anovrestaurant.fr
```

#### Twilio
```
TWILO_SID=AC...
TWILO_AUTH=...
TWILO_PHONE_NUMBER=+337...
```

#### JWT
```
NEXTAUTH_SECRET=... (min 32 chars)
```

#### Application
```
NEXT_PUBLIC_BASE_URL=https://anov.fr
RESTAURANT_PHONE=+33612345678
RESTAURANT_ADDRESS=12 Rue de la République, 25000 Besançon
```

#### Cron
```
CRON_SECRET=... (protège les webhooks)
```

### Configuration Keystatic

**Fichier :** `src/keystatic.config.ts`

```typescript
export default config({
  storage: {
    kind: "github",  // ou "local" en dev
    repo: "nderousseaux/anov",
  },
  singletons: { /* ... */ }
});
```

---

## Déploiement

### Environnements

- **Local** : Docker + PostgreSQL + Mailcatcher
- **Production** : Vercel + Neon PostgreSQL + SMTP

### Commandes

```bash
pnpm install        # Install dependencies
pnpm dev            # Start dev server
pnpm db:start       # Docker (PostgreSQL + Mailcatcher)
pnpm db:migrate     # Prisma migrations
pnpm db:reset       # Reset + seed
pnpm test           # Vitest tests
pnpm test:ui        # Tests with UI
```

### Vercel Deployment

- Push → `pprod` → Preview
- Merge `pprod` → `main` → Production

---

## Structure du contenu CMS

### Images

Les images sont stockées dans `public/assets/` :

```
public/assets/
├── hero/
├── histoire/
├── gallery/
├── contact/
├── origins/
└── boutique/
```

### Fichiers YAML

Tous les singletons sont dans `content/*.yaml` :

```yaml
# Exemple : hero.yaml
image: /assets/hero/background.jpg
subtitle_fr: "Une expérience gastronomique à Besançon"
subtitle_en: "A gastronomic experience in Besançon"
subtitle_de: "Ein gastronomisches Erlebnis in Besançon"
```

---

## Cron Jobs

### Rappels de réservation

**Endpoint :** `/api/cron/reminders`

**Frequency :** Tous les jours

**Logique :**
1. Trouver les réservations pour J+1
2. Envoyer SMS (si téléphone) ou email
3. Marquer le rappel comme envoyé

### Rappels d'expiration chèques

**Endpoint :** `/api/cron/gift-card-reminders`

**Frequency :** Tous les jours

**Logique :**
1. Trouver les chèques expirant dans 30 jours
2. Envoyer email de rappel
3. Marquer le rappel comme envoyé

---

## Tests

### Unit tests (Vitest)

```bash
pnpm test           # All tests
pnpm test:ui        # UI mode
pnpm test --watch   # Watch mode
```

### E2E tests (Playwright)

```bash
pnpm test:e2e
```

---

## Checklist de développement

### Avant de déployer

- [ ] Vérifier les variables d'environnement
- [ ] Exécuter les migrations Prisma
- [ ] Vérifier les tests passent
- [ ] Vérifier l'authentification admin
- [ ] Vérifier Stripe webhook
- [ ] Vérifier les emails (SMTP)
- [ ] Vérifier les SMS (Twilio)
- [ ] Vérifier les traductions

---

## Contact

Pour toute question technique, contacter le développeur principal.