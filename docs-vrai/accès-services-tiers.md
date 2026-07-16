# Accès aux Services Tiers - Anov Restaurant

**Version:** 1.0  
**Dernière mise à jour:** Juillet 2026  
**Auteur:** Développeur / Administrateur

---

## Table des matières

1. [Introduction](#introduction)
2. [Stripe - Paiement](#stripe---paiement)
3. [PostgreSQL (Neon) - Base de données](#postgresql-neon---base-de-données)
4. [SMTP - Envoi d'emails](#smtp---envoi-demails)
5. [Twilio - Envoi de SMS](#twilio---envoi-de-sms)
6. [GitHub - CMS](#github---cms)
7. [Vercel - Hébergement](#vercel---hébergement)
8. [Liste des clés API](#liste-des-cles-api)
9. [Sécurité](#sécurité)

---

## Introduction

Ce document répertorie tous les services tiers utilisés par l'application **Anov Restaurant**, avec les clés d'accès nécessaires et leur usage.

---

## Stripe - Paiement

### Service
**Stripe** est une plateforme de paiement en ligne utilisée pour :
- Réservations (acompte de 20€/personne)
- Chèques cadeaux
- Commandes boutique

### Configuration

| Clé | Description | Type |
|-----|-------------|------|
| `STRIPE_SECRET_KEY` | Clé secrète (API) | Secret |
| `STRIPE_PUBLISHABLE_KEY` | Clé publique (frontend) | Public |

### Emplacement
- **Fichier :** `.env.local`
- **Format :**
```bash
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxx
```

### Endpoints
- `/api/reservations` - Création de réservation
- `/api/gift-cards/checkout` - Création de chèque cadeau
- `/api/boutique/checkout` - Création de commande boutique
- `/api/stripe/webhook` - Webhook de paiement

---

## PostgreSQL (Neon) - Base de données

### Service
**PostgreSQL** via **Neon** (serveurless PostgreSQL) est utilisé pour stocker :
- Réservations
- Chèques cadeaux
- Commandes boutique
- Messages de contact
- Utilisateurs admin
- Paramètres du restaurant

### Configuration

| Clé | Description | Type |
|-----|-------------|------|
| `DATABASE_URL` | URL de connexion PostgreSQL | Secret |

### Emplacement
- **Fichier :** `.env.local`
- **Format :**
```bash
# En production (Neon)
DATABASE_URL=postgresql://user:pass@ep-xxx-xxx.neon.tech/dbname?sslmode=require

# En local (Docker)
DATABASE_URL=postgresql://anov:anov@localhost:5432/anov
```

### Connexion
- **Fichier :** `src/lib/prisma.ts`
- **ORM :** Prisma 7.8.0
- **Adapter :** PostgreSQL (Neon ou local)

### Schema
```prisma
model Reservation {}
model Table {}
model Admin {}
model RestaurantSettings {}
model DayOverride {}
model GiftCard {}
model ProductOrder {}
model ProductAddress {}
model ContactMessage {}
model CustomerNote {}
```

---

## SMTP - Envoi d'emails

### Service
**Nodemailer** avec un serveur SMTP pour envoyer :
- Confirmations de réservation
- Rappels (email)
- Annulations
- Messages de contact
- Chèques cadeaux
- Commandes boutique

### Configuration

| Clé | Description | Type | Required |
|-----|-------------|------|----------|
| `SMTP_HOST` | Serveur SMTP | Secret | Oui |
| `SMTP_PORT` | Port SMTP (587) | Public | Non |
| `SMTP_SECURE` | SSL/TLS (false) | Public | Non |
| `SMTP_USER` | Adresse email | Secret | Oui |
| `SMTP_PASSWORD` | Mot de passe | Secret | Oui |
| `SMTP_FROM` | Email d'expéditeur | Public | Non |
| `CONTACT_EMAIL` | Email pour contact | Public | Non |

### Emplacement
- **Fichier :** `.env.local`
- **Format :**
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=contact@anovrestaurant.fr
SMTP_PASSWORD=xxxxxxxxxxxx
SMTP_FROM="l'Anøv <noreply@anov.fr>"
CONTACT_EMAIL=contact@anovrestaurant.fr
```

### Utilisation
- **Fichier :** `src/lib/email.ts`
- **Bibliothèque :** Nodemailer
- **Port par défaut :** 587 (TLS)

### Test local (Mailcatcher)
```bash
SMTP_HOST=localhost
SMTP_PORT=1080
```
Mailcatcher est accessible sur `http://localhost:1080`

---

## Twilio - Envoi de SMS

### Service
**Twilio** est utilisé pour envoyer des SMS de rappel de réservation.

### Configuration

| Clé | Description | Type | Required |
|-----|-------------|------|----------|
| `TWILO_SID` | SID Twilio | Secret | Oui |
| `TWILO_AUTH` | Auth Token Twilio | Secret | Oui |
| `TWILO_PHONE_NUMBER` | Numéro d'envoi | Public | Non |

### Emplacement
- **Fichier :** `.env.local`
- **Format :**
```bash
TWILO_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILO_AUTH=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILO_PHONE_NUMBER=+33757000000
```

### Utilisation
- **Fichier :** `src/lib/sms.ts`
- **Bibliothèque :** twilio-node
- **Format des numéros :** E.164 (+33612345678)

### Fonction
```typescript
sendSmsReminder({
  to: "+33612345678",
  name: "Jean Dupont",
  date: "lundi 20 juillet",
  time: "19:00",
  guests: 4
})
```

---

## GitHub - CMS

### Service
**GitHub** est utilisé par **Keystatic** pour stocker et éditer le contenu du site.

### Configuration

| Clé | Description | Type | Required |
|-----|-------------|------|----------|
| `KEYSTATIC_GITHUB_CLIENT_ID` | GitHub App Client ID | Secret | Oui |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | GitHub App Secret | Secret | Oui |
| `KEYSTATIC_SECRET` | Secret Keystatic | Secret | Oui |
| `KEYSTATIC_GITHUB_REPOSITORY` | Repo (owner/repo) | Public | Oui |

### Emplacement
- **Fichier :** `.env.local`
- **Format :**
```bash
KEYSTATIC_GITHUB_CLIENT_ID=Iv1.xxxxxxxxxxxxxxxx
KEYSTATIC_GITHUB_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
KEYSTATIC_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
KEYSTATIC_GITHUB_REPOSITORY=nderousseaux/anov
```

### Emplacement des fichiers
- `content/hero.yaml`
- `content/histoire.yaml`
- `content/origines.yaml`
- `content/galerie.yaml`
- `content/contact.yaml`
- `content/menu.yaml`
- `content/footer.yaml`
- `content/boutique.yaml`
- `content/gift-card-success.yaml`
- `content/cheques-cadeaux.yaml`
- `content/reservation.yaml`
- `content/mentions-legales.mdoc`
- `content/politique-de-confidentialite.mdoc`
- `content/cgv.yaml`

### Mode local (développement)
```typescript
// src/keystatic.config.ts
export default config({
  storage: {
    kind: "local",  // Pour le dev
  },
  // ...
});
```

### Mode GitHub (production)
```typescript
// src/keystatic.config.ts
export default config({
  storage: {
    kind: "github",
    repo: "nderousseaux/anov",
  },
  // ...
});
```

---

## Vercel - Hébergement

### Service
**Vercel** est la plateforme d'hébergement pour :
- L'application Next.js
- Les API routes
- Les images statiques
- Le déploiement continu

### Configuration

| Variable | Description |
|----------|-------------|
| `VERCEL_URL` | URL de preview |
| `VERCEL_PROJECT_ID` | ID du projet |
| `VERCEL_ORG_ID` | ID de l'organisation |

### Déploiement
- **Branch `main`** → Production
- **Branch `pprod`** → Preview
- **Push automatique** → Déploiement

### Cron Jobs (Vercel Cron)

| Endpoint | Fréquence | Secret |
|----------|-----------|--------|
| `/api/cron/reminders` | Tous les jours | `CRON_SECRET` |
| `/api/cron/gift-card-reminders` | Tous les jours | `CRON_SECRET` |

---

## Liste des clés API

### Clés à configurer dans `.env.local`

| Clé | Description | Valeur par défaut | Required |
|-----|-------------|-------------------|----------|
| `DATABASE_URL` | PostgreSQL | - | Oui |
| `STRIPE_SECRET_KEY` | Stripe API | - | Oui |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publique | - | Oui |
| `SMTP_HOST` | SMTP host | - | Oui |
| `SMTP_PORT` | SMTP port | 587 | Non |
| `SMTP_SECURE` | SSL enabled | false | Non |
| `SMTP_USER` | SMTP user | - | Oui |
| `SMTP_PASSWORD` | SMTP pass | - | Oui |
| `SMTP_FROM` | From email | noreply@anov.fr | Non |
| `CONTACT_EMAIL` | Contact email | - | Non |
| `TWILO_SID` | Twilio SID | - | Oui |
| `TWILO_AUTH` | Twilio auth | - | Oui |
| `TWILO_PHONE_NUMBER` | Twilio from | +33757000000 | Non |
| `NEXTAUTH_SECRET` | JWT secret | - | Oui |
| `CRON_SECRET` | Cron auth | - | Oui |
| `NEXT_PUBLIC_BASE_URL` | Base URL | - | Non |

### Clés GitHub (Keystatic)

| Clé | Description |
|-----|-------------|
| `KEYSTATIC_GITHUB_CLIENT_ID` | |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | |
| `KEYSTATIC_SECRET` | |
| `KEYSTATIC_GITHUB_REPOSITORY` | |

---

## Sécurité

### Bonnes pratiques

1. **Ne jamais committer les fichiers `.env`**
   - Le fichier `.gitignore` exclut `.env.local`
   - Le fichier `.env.example` contient des valeurs factices

2. **Utiliser des variables d'environnement**
   - Les clés sont chargées via `.env.local`
   - Never hardcode secrets in code

3. **Protéger les routes sensibles**
   - `/admin/*` et `/keystatic/*` sont protégés
   - `/api/cron/*` sont protégés par `CRON_SECRET`

4. **Chiffrement**
   - Les mots de passe admin sont hashés (SHA-256)
   - Les emails sont stockés en clair (nécessaire pour l'envoi)

5. **JWT Token**
   - Duration: 8 hours
   - Stocké dans un cookie (httpOnly)
   - Renouvellement automatique

### Fichiers sensibles à ne pas partager

```
.env.local           # Toutes les clés API
.git/                # Dépôt Git
node_modules/        # Dépendances
```

### Fichiers publics

```
.env.example         # Exemple de configuration
public/              # Assets publics
src/                 # Code source
```

---

## Checklist de configuration

### En local

- [ ] `DATABASE_URL` configuré (Docker)
- [ ] `NEXTAUTH_SECRET` configuré
- [ ] `SMTP_*` configuré (Mailcatcher)
- [ ] `TWILO_*` configuré (optionnel pour tests)
- [ ] Lancer `pnpm db:start`
- [ ] Lancer `pnpm dev`

### En production (Vercel)

- [ ] `DATABASE_URL` configuré (Neon)
- [ ] `STRIPE_SECRET_KEY` configuré
- [ ] `STRIPE_PUBLISHABLE_KEY` configuré
- [ ] `SMTP_*` configuré
- [ ] `TWILO_*` configuré
- [ ] `NEXTAUTH_SECRET` configuré
- [ ] `CRON_SECRET` configuré
- [ ] `KEYSTATIC_*` configuré (GitHub)
- [ ] Cron jobs configurés

---

## Contact

Pour les clés API, contacter le développeur principal.