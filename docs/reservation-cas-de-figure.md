# Documentation Exhausive des Cas de Figure - Processus de Réservation ANØV

> **Document généré le:** 12 juillet 2026  
> **Version du code analyisée:** Next.js 15 + Prisma + PostgreSQL + Stripe  
> **Objectif:** Fournir une liste exhaustive de tous les cas, options et comportements pour écrire des tests e2e sur les **réservations de tables**

---

## Table des Matières

1. [Introduction - Réservation de Tables](#introduction---réservation-de-tables)
2. [Cas de Figure - Abandon de Paiement Stripe](#cas-de-figure---abandon-de-paiement-stripe)
3. [Cas de Figure - Resto Plein (Conflit de Tables)](#cas-de-figure---resto-plein-conflit-de-tables)
4. [Cas de Figure - Race Conditions](#cas-de-figure---race-conditions)
5. [Cas de Figure - Back Button (Navigateur)](#cas-de-figure---back-button-navigateur)
6. [Cas de Figure - API Public `/api/reservations`](#cas-de-figure---api-public-apireservations)
7. [Cas de Figure - API Public `/api/reservations/availability`](#cas-de-figure---api-public-apireservationsavailability)
8. [Cas de Figure - API Public `/api/reservations/[id]`](#cas-de-figure---api-public-apireservationsid)
9. [Cas de Figure - API Public `/api/reservations/cancel`](#cas-de-figure---api-public-apireservationscancel)
10. [Cas de Figure - API d'Admin `/api/admin/reservations`](#cas-de-figure---api-dadmin-apicadminreservations)
11. [Cas de Figure - API d'Admin `/api/admin/tables`](#cas-de-figure---api-dadmin-apicadmintables)
12. [Cas de Figure - API d'Admin `/api/admin/overrides/[date]`](#cas-de-figure---api-dadmin-apicadminoverridesdate)
13. [Cas de Figure - API d'Admin `/api/admin/calendar`](#cas-de-figure---api-dadmin-apicadmincalendar)
14. [Cas de Figure - API d'Admin `/api/admin/settings`](#cas-de-figure---api-dadmin-apicadminsettings)
15. [Cas de Figure - Stripe Webhook pour Réservations](#cas-de-figure---stripe-webhook-pour-réservations)
16. [Cas de Figure - Cron Rappels](#cas-de-figure---cron-rappels)
17. [Cas de Figure - Table Allocation Logic](#cas-de-figure---table-allocation-logic)
18. [Liste Complète des Statuts de Réservation](#liste-complète-des-statuts-de-réservation)
19. [Architecture des Données - Réservation](#architecture-des-données---réservation)
20. [Test Cases Recommandés](#test-cases-recommandés)

---

## Introduction - Réservation de Tables

Ce document décrit **TOUS** les cas de figure possibles pour le processus de **réservation de tables** chez ANØV:

- Réservation de tables (avec acompte via Stripe)
- Gestion des disponibilités (heures, jours, table-based allocation)
- Interface admin pour gérer les réservations
- Système de rappels par email/SMS
- Annulation de réservations

**Ce document EXCLUDES:**
- Chèques cadeaux (gift cards)
- Commandes produits (boutique)
- Formulaire de contact

---

## Cas de Figure - Abandon de Paiement Stripe

### Cas 1: Utilisateur ferme la fenêtre Stripe

**Setup:**
1. Client remplit le formulaire
2. POST `/api/reservations` → Réservation créée en `PENDING_PAYMENT`
3. Stripe Checkout ouvert
4. **Client ferme la fenêtre sans terminer**

**Comportement:**
- La session Stripe existe mais n'est **jamais complétée**
- La réservation reste en statut `PENDING_PAYMENT`
- **Aucune mise à jour** ne se produit (pas de webhook)
- Le `transactionExpireAt` expire après 10 minutes

**État final:**
- Réservation: `PENDING_PAYMENT` (dans la base)
- `transactionExpireAt` est dépassé
- **Affichage**: La réservation **n'est pas affichée** en admin (exclue)
- **Base**: La réservation reste en base (historique)

**Flux:**
```
1. POST /api/reservations → PENDING_PAYMENT + session Stripe
2. Stripe Checkout ouvert
3. Utilisateur ferme la fenêtre
4. Aucun webhook reçu
5. transactionExpireAt expire (10 min)
6. Réservation non affichée (exclue par le filtre)
```

### Cas 2: Utilisateur clique "Annuler" sur Stripe

**Comportement:**
- Même que Cas 1 - pas de webhook
- Réservation reste `PENDING_PAYMENT` jusqu'à expiration
- URL de retour: `/reservation/cancel?token=XXX`

### Cas 3: Erreur de paiement Stripe

**Comportement:**
- Stripe affiche une erreur
- La session n'est pas complétée
- Même comportement que ci-dessus

**Important:**
- Pas de clean up automatique des réservations non payées
- Les données restent en base pour audit/historic
- Les réservations expirées sont **filtrées** de l'affichage

---

## Cas de Figure - Resto Plein (Conflit de Tables)

### Setup de base:
- 6 tables: 2×2 (capacité 2), 2×3 (capacité 3), 2×4 (capacité 4)
- Total capacité: 12 couverts
- Meal duration: 90 minutes
- 2 services (midi: 12:00-13:30, soir: 19:00-21:00)

### Scénario 1: Resto complet pour un créneau

**Setup:**
- 12 couverts déjà réservés pour le créneau 19:00
- Nouveau client essaie de réserver pour 19:00

**Résultat:**
```
1. GET /api/reservations/availability?date=2026-08-15&guests=2
2. Résultat: {"slots": [{"time": "19:00", "available": false}, ...]}
3. Tentative de POST → 409 "Créneau complet pour ce nombre de couverts"
```

### Scénario 2: Resto complet avec seulement des tables de 2

**Setup:**
- 3 réservations pour 1 guest (table de 2)
- 2×3, 2×4 tables disponibles
- Nouveau client: 3 guests

**Comportement:**
```
1. Table de 2 occupée → pas de fallback possible (1 guest → table de 2 uniquement)
2. Table de 3 disponible → OK (3 guests → table de 3 ou 4)
3. Si tables de 3 occupées → Table de 4 (fallback)
4. Si tables de 4 occupées → 409
```

**Règle:** 3 guests → table de 3 ou 4, **jamais** table de 2

### Scénario 3: Resto complet avec tables de 4

**Setup:**
- 2×4 tables occupées
- Nouveau client: 4 guests

**Comportement:**
```
1. Table de 4 occupée
2. Pas de fallback (4 guests → table de 4 uniquement)
3. Résultat: 409 "Créneau complet pour ce nombre de couverts"
```

### Scénario 4: Resto complet pour une date

**Setup:**
- Toutes les tables sont réservées pour un jour
- Nouveau client essaie de réserver

**Comportement:**
```
1. GET /api/reservations/availability?month=2026-08&guests=2
2. Tous les jours sont complets ou fermés
3. Résultat: {"unavailableDates": ["2026-08-01", "2026-08-15", ...]}
4. L'utilisateur voit qu'aucun jour n'est disponible
```

### Scénario 5: Service complet (tous les créneaux)

**Setup:**
- Tous les créneaux sont complets (midi ET soir)
- Client essaie de réserver

**Résultat:**
- `available: false` pour tous les slots
- POST → 409

---

## Cas de Figure - Race Conditions

### Scénario: 3 personnes veulent réserver la même table

**Setup:**
- 1 table de 2 disponible
- 3 clients essaient de réserver en même temps (ou quasi simultanément)

**Comportement:**
```
1. Transaction atomique: prisma.$transaction()
2. La première requête réussit (table attribuée + réservation créée)
3. Les 2 suivantes échouent avec 409 (table déjà attribuée)
```

**Flux détaillé:**
```
Client A (t=0ms): GET /api/reservations/availability → table disponible
Client A (t=10ms): POST /api/reservations → table assignée, réservation créée
Client B (t=15ms): GET /api/reservations/availability → table occupée
Client B (t=20ms): POST /api/reservations → 409 "Créneau complet"
Client C (t=25ms): GET /api/reservations/availability → table occupée
Client C (t=30ms): POST /api/reservations → 409 "Créneau complet"
```

**Protection:**
- L'attribution de table est **dans la même transaction** que la création
- Pas de race condition possible
- Si 2 demandes arrivent simultanément, la base bloque la seconde

---

## Cas de Figure - Back Button (Navigateur)

### Scénario 1: Utilisateur revient en arrière après Stripe

**Setup:**
1. Client remplit le formulaire
2. Redirigé vers Stripe Checkout
3. Client clique "Retour" (navigateur)
4. Retour sur la page de confirmation Stripe

**Comportement:**
```
1. Session Stripe: PENDING_PAYMENT (existe déjà en base)
2. TransactionExpireAt: encore valide (10 min)
3. Si le client complète le paiement → CONFIRMED
4. Si le client ne complète pas → expiration automatique (10 min)
5. Si le client clique "Annuler" sur Stripe → URL de cancel
```

**Important:**
- La session Stripe reste active (pas de clean up)
- Le paiement peut être complété plus tard
- Si expiration: la réservation reste mais est non affichée

### Scénario 2: Cancel URL de Stripe

**Comportement:**
```
1. Client clique "Annuler" sur Stripe
2. Redirigé vers /reservation/cancel?token=XXX
3. GET /api/reservations/cancel?token=XXX
4. Réservation supprimée (DELETE)
5. Aucun email envoyé
```

---

## Cas de Figure - API Public `/api/reservations`

### POST `/api/reservations` - Création d'une Réservation

#### 1. Cas de Succès

| Étape | Action | Résultat |
|-------|--------|----------|
| 1 | Validation des champs (name, email, date, time, guests 1-4) | Passé |
| 2 | Calcul du dépôt | `depositPaidCents = 2000 × guests` |
| 3 | Attribution de table (dans transaction) | Table disponible |
| 4 | Création de la réservation | `PENDING_PAYMENT` |
| 5 | Session Stripe créée | URL retournée |

**Exemple de réponse:**
```json
{
  "url": "https://checkout.stripe.com/c/payment/sess_xxx",
  "sessionId": "cs_test_xxx"
}
```

#### 2. Cas d'Erreur - Validation

| Cas | Code HTTP | Message |
|-----|-----------|---------|
| `name` manquant | 400 | "Champs manquants" |
| `email` manquant | 400 | "Champs manquants" |
| `date` manquant | 400 | "Champs manquants" |
| `time` manquant | 400 | "Champs manquants" |
| `guests` manquant | 400 | "Champs manquants" |
| `guests` = 0 | 400 | "Nombre de couverts invalide" |
| `guests` = 5 | 400 | "Nombre de couverts invalide" |
| `guests` = "abc" | 400 | "Nombre de couverts invalide" |
| `email` format invalide | 400 | "Email invalide" |
| `date` dans le passé | 400 | "Date invalide" |
| `phone` format invalide | 400 | "Numéro de téléphone invalide" |

#### 3. Cas d'Erreur - Table Indisponible

| Cas | Code HTTP | Message |
|-----|-----------|---------|
| Aucune table disponible pour le créneau | 409 | "Créneau complet pour ce nombre de couverts" |

#### 4. Cas d'Erreur - Stripe

| Cas | Code HTTP | Message |
|-----|-----------|---------|
| Stripe API error | 500 | "Erreur serveur" |

---

## Cas de Figure - API Public `/api/reservations/availability`

### GET `/api/reservations/availability?date=YYYY-MM-DD&guests=N`

#### Cas 1: Jour normal avec disponibilité

**Request:** `GET /api/reservations/availability?date=2026-08-15&guests=2`

**Résultat:**
```json
{
  "slots": [
    {"time": "12:00", "available": true},
    {"time": "12:30", "available": true},
    {"time": "13:00", "available": false},
    {"time": "19:00", "available": true},
    {"time": "19:30", "available": false},
    {"time": "20:00", "available": true}
  ]
}
```

#### Cas 2: Jour fermé (jour de repos hebdomadaire)

**Request:** `GET /api/reservations/availability?date=2026-07-20&guests=2`  
(2026-07-20 est un lundi, jour de fermeture par défaut)

**Résultat:**
```json
{"slots": []}
```

#### Cas 3: Jour fermé par Override

**Request:** `GET /api/reservations/availability?date=2026-07-15&guests=2`  
(2026-07-15 a un override `closed: true` en base)

**Résultat:**
```json
{"slots": []}
```

#### Cas 4: Jour avec custom slots override

**Request:** `GET /api/reservations/availability?date=2026-07-15&guests=2`  
(override avec slots personnalisés: ["12:00", "19:00"])

**Résultat:**
```json
{
  "slots": [
    {"time": "12:00", "available": true},
    {"time": "19:00", "available": false}
  ]
}
```

#### Cas 5: Aujourd'hui - Filtre des heures passées

**Request:** `GET /api/reservations/availability?date=2026-07-12&guests=2`  
**Temps actuel:** 14:30

**Résultat:**
```json
{
  "slots": [
    {"time": "15:00", "available": true},
    {"time": "15:30", "available": false},
    {"time": "19:00", "available": true}
  ]
}
```
**Note:** Les créneaux `12:00`, `12:30`, `13:00`, `13:30` sont **exclus** (déjà passés).

#### Cas 6: Date passée

**Request:** `GET /api/reservations/availability?date=2020-01-01&guests=2`

**Résultat:**
```json
{"slots": []}
```

#### Cas 7: Validation des paramètres

| Cas | Code | Message |
|-----|------|---------|
| `guests=0` | 400 | "guests invalide (1 à 4)" |
| `guests=5` | 400 | "guests invalide (1 à 4)" |
| `guests=abc` | 400 | "guests invalide (1 à 4)" |
| `date=2026/07/15` (mauvais format) | 400 | "date invalide" |
| `date=2020-01-01` (passé) | 200 | `{"slots": []}` |

---

### GET `/api/reservations/availability?month=YYYY-MM&guests=N`

Liste les dates **indisponibles** d'un mois complet.

**Request:** `GET /api/reservations/availability?month=2026-08&guests=2`

**Résultat:**
```json
{
  "unavailableDates": [
    "2026-08-01",  // Lundi (jour de fermeture par défaut)
    "2026-08-15",  // Jour complet pour 2 couverts
    "2026-08-22"   // Jour complet pour 2 couverts
  ]
}
```

**Comportement:**
- Exclut les dates passées
- Exclut les lundis (jour de fermeture par défaut)
- Retourne seulement les dates où **aucun slot** n'a de disponibilité

---

## Cas de Figure - API Public `/api/reservations/[id]`

### GET `/api/reservations/[id]` - Get reservation by ID

| Cas | Résultat |
|-----|----------|
| Réservation existante | `{"id", "name", "email", "phone", "date", "guests", "status", "depositPaidCents"}` |
| Réservation non trouvée | 404 "Réservation introuvable" |

**Utilisation typique:** Afficher les détails de la réservation avant annulation

---

## Cas de Figure - API Public `/api/reservations/cancel`

### GET `/api/reservations/cancel?token=XXX`

| État de la réservation | Résultat |
|------------------------|----------|
| Token valide, statut `PENDING_PAYMENT` | 200 `{"message": "deleted"}`, réservation supprimée |
| Token valide, statut `CONFIRMED` | 200 `{"message": "deleted"}`, réservation supprimée |
| Token valide, statut `CANCELLED` | 200 `{"message": "already_cancelled"}` |
| Token valide, statut `COMPLETED` | 400 "Réservation déjà passée" |
| Token valide, statut `PENDING_PAYMENT` **expiré** | 400 "Réservation déjà passée" |
| Token invalide | 404 "Réservation introuvable" |
| Token manquant | 400 "Token manquant" |

**Note:** L'annulation **supprime** la réservation (pas un soft delete), et **n'envoie pas d'email**.

---

## Cas de Figure - API d'Admin `/api/admin/reservations`

### GET `/api/admin/reservations` - Listage des réservations

#### Filtres:

| Paramètre | Type | Description |
|-----------|------|-------------|
| `date` | string (YYYY-MM-DD) | Filtrer par date exacte |
| `status` | string | Filtrer par statut |
| `page` | int | Pagination (défaut: 1) |
| `perPage` | int | Items par page (défaut: 25) |

#### Exclusion automatique:

**Les PENDING_PAYMENT expirés ne sont JAMAIS affichés** (mais restent en base):
```sql
WHERE status != 'PENDING_PAYMENT' 
   OR (status = 'PENDING_PAYMENT' AND transactionExpireAt > now())
```

#### Résultat:

```json
{
  "data": [
    {
      "id": "res_xxx",
      "name": "Jean Dupont",
      "email": "jean@test.fr",
      "phone": "+33612345678",
      "date": "2026-08-15T19:00:00.000Z",
      "guests": 2,
      "status": "CONFIRMED",
      "specialRequest": "Besoin d'une chaise haute",
      "wantsSmsReminder": false,
      "depositPaidCents": 4000,
      "transactionExpireAt": null,
      "createdAt": "2026-07-12T10:00:00.000Z",
      "tableId": 3,
      "table": {"name": "Table 3", "capacity": 3}
    }
  ],
  "total": 42,
  "page": 1,
  "pageSize": 25
}
```

#### Comportement selon status:

| Status | Comportement dans l'affichage |
|--------|-------------------------------|
| `CONFIRMED` | Affiché |
| `PENDING_PAYMENT` (non expiré) | Affiché |
| `PENDING_PAYMENT` (expiré) | **EXCLU** (mais reste en base) |
| `CANCELLED` | Affiché |
| `COMPLETED` | Affiché |

---

### PATCH `/api/admin/reservations` - Mise à jour du statut

#### Corps de la requête:
```json
{
  "id": "res_xxx",
  "status": "CONFIRMED|CANCELLED|COMPLETED"
}
```

#### Statuts autorisés:

| Statut cible | Action | Email envoyé | Refund Stripe |
|--------------|--------|--------------|---------------|
| `CONFIRMED` | Marquer comme confirmé | Non | Non |
| `CANCELLED` | Annuler la réservation | Oui (sendCancellationEmail) | Oui (si stripeSessionId existe) |
| `COMPLETED` | Marquer comme terminé | Non | Non |

#### Cas d'erreur:

| Cas | Code HTTP | Message |
|-----|-----------|---------|
| `id` manquant | 400 | "Paramètres invalides" |
| `status` manquant | 400 | "Paramètres invalides" |
| `status` invalide (ex: `PENDING_PAYMENT`) | 400 | "Paramètres invalides" |
| Réservation `EXPIRED` (PENDING_PAYMENT avec transactionExpireAt passé) | 400 | "Impossible de modifier une réservation expirée. Elle doit être annulée." |

#### Refund Stripe:

Lorsqu'une réservation est annulée:
1. Email envoyé (sendCancellationEmail)
2. Si `stripeSessionId` existe → Refund Stripe
3. Si `depositPaidCents > 0` → Montant du refund
4. Si `payment_intent` existe → Refund créé

---

## Cas de Figure - API d'Admin `/api/admin/tables`

### GET `/api/admin/tables`

**Résultat:**
```json
[
  {"id": 1, "name": "Table 1", "capacity": 2, "posX": 10.5, "posY": 20.0},
  {"id": 2, "name": "Table 2", "capacity": 2, "posX": 30.0, "posY": 20.0},
  {"id": 3, "name": "Table 3", "capacity": 3, "posX": 50.0, "posY": 25.0},
  {"id": 4, "name": "Table 4", "capacity": 3, "posX": 70.0, "posY": 25.0},
  {"id": 5, "name": "Table 5", "capacity": 4, "posX": 20.0, "posY": 50.0},
  {"id": 6, "name": "Table 6", "capacity": 4, "posX": 60.0, "posY": 50.0}
]
```

**Tri:** Par `capacity ASC` (ordre croissant de capacité)

**Utilisation:** Vue schéma du floor plan dans l'admin

---

## Cas de Figure - API d'Admin `/api/admin/overrides/[date]`

### GET `/api/admin/overrides/[date]`

| Cas | Résultat |
|-----|----------|
| Override existant | `{"closed": false, "openingSlots": ["12:00", "19:00"]}` |
| Override non trouvé | 200 `null` |

### PUT `/api/admin/overrides/[date]` - Créer/Modifier un override

| Mode | `closed` | `openingSlots` | Résultat |
|------|----------|----------------|----------|
| Global (réinitialiser) | `false` | `null` | Override supprimé |
| Closed | `true` | `null` | Jour fermé |
| Custom | `false` | `["12:00", "19:00"]` | Horaires personnalisés |

#### Cas de blocage:

| Cas | Code HTTP | Message |
|-----|-----------|---------|
| Past day (date passée) | 400 | "Impossible de modifier le calendrier d'un jour déjà passé." |
| Closed avec réservations actives | 400 | "Impossible de fermer ce jour : X réservation(s) active(s) en cours. Annulez-les d'abord." |
| Custom slots avec réservations impactées | 400 | "Impossible de retirer ces créneaux : X réservation(s) active(s) seraient impactées. Annulez-les d'abord." |

**Note:** Les réservations "actives" = `CONFIRMED` ou `PENDING_PAYMENT` non expiré

### DELETE `/api/admin/overrides/[date]` - Supprimer un override

| Cas | Résultat |
|-----|----------|
| Override existant | 200 `{success: true}` |
| Override non existant | 200 `{success: true}` (idempotent) |

---

## Cas de Figure - API d'Admin `/api/admin/calendar`

### GET `/api/admin/calendar?from=YYYY-MM-DD&days=N`

**Paramètres:**
- `from`: Date de début (YYYY-MM-DD)
- `days`: Nombre de jours à retourner

**Résultat par jour:**
```json
{
  "date": "2026-07-15",
  "dayOfWeek": 2,
  "isGloballyOpen": true,
  "hasOverride": false,
  "override": null,
  "effectiveOpen": true,
  "effectiveSlots": ["12:00", "12:30", "13:00", "19:00", "19:30", "20:00"],
  "mealDuration": 90,
  "lunchOpen": "12:00",
  "lunchClose": "14:30",
  "dinnerOpen": "19:00",
  "dinnerClose": "21:30",
  "totalCapacity": 12,
  "reservedGuests": 8,
  "reservationCount": 3
}
```

#### Cas 1: Jour ouvert global

| Champ | Valeur |
|-------|--------|
| `isGloballyOpen` | `true` |
| `hasOverride` | `false` |
| `effectiveOpen` | `true` |
| `effectiveSlots` | Slots globaux |

#### Cas 2: Jour fermé global (lundi par défaut)

| Champ | Valeur |
|-------|--------|
| `isGloballyOpen` | `false` |
| `hasOverride` | `false` |
| `effectiveOpen` | `false` |
| `effectiveSlots` | `[]` |

#### Cas 3: Override closed

| Champ | Valeur |
|-------|--------|
| `isGloballyOpen` | `true` |
| `hasOverride` | `true` |
| `override.closed` | `true` |
| `effectiveOpen` | `false` |
| `effectiveSlots` | `[]` |

#### Cas 4: Override custom slots

| Champ | Valeur |
|-------|--------|
| `isGloballyOpen` | `true` |
| `hasOverride` | `true` |
| `override.closed` | `false` |
| `override.openingSlots` | `["12:00", "19:00"]` |
| `effectiveOpen` | `true` |
| `effectiveSlots` | `["12:00", "19:00"]` |

#### Calcul de `totalCapacity`:
```
totalCapacity = tables_count × service_turns
service_turns = (dernier_slot - premier_slot) / mealDuration + 1
```

Exemple: 6 tables × 2 services = 12 couverts disponibles

#### Calcul de `reservedGuests`:
Somme des `guests` pour les réservations **CONFIRMED** + **PENDING_PAYMENT non expiré**

---

## Cas de Figure - API d'Admin `/api/admin/settings`

### GET `/api/admin/settings`

**Résultat:**
```json
{
  "mealDuration": 90,
  "openingDays": [2, 3, 4, 5, 6], // Mar-Sam
  "openingSlots": ["12:00", "12:30", "13:00", "13:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"],
  "depositPerGuestCents": 2000,
  "daysBeforeReminder": 1
}
```

### PUT `/api/admin/settings` - Mise à jour

#### Validation:

| Paramètre | Type | Range | Défaut |
|-----------|------|-------|--------|
| `mealDuration` | number | 30, 60, 90, 120, 150, 180... (multiple de 30) | 90 |
| `openingDays` | number[] | [0-6] (Dim-Sam) | [2,3,4,5,6] |
| `openingSlots` | string[] | Format "HH:MM" | Default slots |
| `depositPerGuestCents` | number | ≥ 0 | 2000 |
| `daysBeforeReminder` | number | 0-30 | 1 |

#### Comportement:

1. **Validation stricte** des types
2. **Detection d'impact** si:
   - Jours supprimés avec réservations actives
   - Slots supprimés avec réservations actives
3. **Block** si impact détecté → 409 "impact"

#### Cas de blocage:

| Cas | Code HTTP | Message |
|-----|-----------|---------|
| Supprimer un jour avec réservations | 409 | "Jours fermés avec réservations actives : 2026-08-15" |
| Supprimer un slot avec réservations | 409 | "Créneaux supprimés avec réservations actives : 19:00" |
| Validation OK | 200 | Settings updated |

#### Validation errors:

| Cas | Code | Message |
|-----|------|---------|
| `mealDuration = 45` | 400 | "Paramètres invalides" (non divisible par 30) |
| `mealDuration = 0` | 400 | "Paramètres invalides" |
| `openingDays includes 7` | 400 | "Paramètres invalides" (out of range) |
| `openingSlots invalid format` | 400 | "Paramètres invalides" |
| `depositPerGuestCents = -100` | 400 | "Paramètres invalides" |
| `daysBeforeReminder = 35` | 400 | "Paramètres invalides" |

---

## Cas de Figure - Stripe Webhook pour Réservations

### Webhook: `checkout.session.completed`

#### Cas A: Réservation (ancien format - legacy)

**Metadata:**
```json
{
  "name": "Jean Dupont",
  "email": "jean@test.fr",
  "phone": "+33612345678",
  "date": "2026-08-15T19:00:00.000Z",
  "guests": "2",
  "specialRequest": "Besoin d'une chaise haute",
  "reservationId": "res_123"
}
```

**Résultat:**
- Réservation `res_123` → `CONFIRMED`
- `transactionExpireAt` → `null`
- Email de confirmation envoyé avec ICS attachment
- Aucun autre traitement

#### Cas B: Réservation (nouveau format - current)

**Metadata:**
```json
{
  "reservation_name": "Jean Dupont",
  "reservation_email": "jean@test.fr",
  "reservation_phone": "+33612345678",
  "reservation_date": "2026-08-15T19:00:00.000Z",
  "reservation_guests": "2",
  "reservation_special_request": "Besoin d'une chaise haute",
  "reservationId": "res_123"
}
```

**Résultat:** Identique au Cas A

#### Cas C: Metadata manquantes

**Metadata:**
```json
{}
```

**Résultat:**
- Log error
- 400 "Metadata manquantes"

#### Cas D: Type non reconnu

**Metadata:**
```json
{"type": "unknown"}
```

**Résultat:**
- Log error
- 400 "Metadata manquantes"

#### Cas E: Error handling

| Cas | Code | Message |
|-----|------|---------|
| Webhook secret missing | 500 | "Configuration serveur incorrecte" |
| Signature manquante | 400 | "Signature manquante" |
| Signature invalide | 400 | "Webhook signature invalide" |
| Event parsing error | 400 | "Webhook signature invalide" |

---

## Cas de Figure - Cron Rappels

### GET `/api/cron/reminders`

#### Conditions d'envoi:

| Condition | Description |
|-----------|-------------|
| Status = `CONFIRMED` | Seulement les réservations confirmées |
| `reminderEmailSent = false` AND `reminderSmsSent = false` | Pas déjà rappelé |
| Date = `today + daysBeforeReminder` | Réservation pour le jour cible |
| Pas une réservation d'aujourd'hui | Exclure les réservations faites aujourd'hui |

#### Comportement selon phone:

| Cas | Phone | Action | Résultat |
|-----|-------|--------|----------|
| A avec phone | `+33612345678` | SMS | `reminderSmsSent = true` |
| A sans phone | `null` | Email | `reminderEmailSent = true` |
| B déjà rappelé (email) | - | Skip | Aucun envoi |
| B déjà rappelé (sms) | - | Skip | Aucun envoi |
| C aujourd'hui (même heure) | - | Skip | Aucun envoi |

#### Paramètres configurables:

| Paramètre | Défaut | Description |
|-----------|--------|-------------|
| `daysBeforeReminder` | 1 | Jours avant la réservation |
| `mealDuration` | 90 | Durée du repas (pas utilisée pour les SMS) |

#### Réponse:

```json
{
  "emailsSent": 5,
  "smsSent": 2,
  "dateTarget": "2026-08-15"
}
```

#### Cas de figure Cron:

| daysBeforeReminder | Date réservation | Date cron | Résultat |
|--------------------|------------------|-----------|----------|
| 1 (default) | 2026-08-15 | 2026-08-14 | SMS/Email envoyé |
| 0 | 2026-08-15 | 2026-08-15 | Skip (same day) |
| 1 | 2026-08-15 | 2026-08-15 | Skip (same day - réservation aujourd'hui) |
| 2 | 2026-08-16 | 2026-08-15 | Skip (pas encore) |
| 1 | 2026-08-14 | 2026-08-14 | Skip (passé) |

#### SMS (Twilio):

**Message:**
```
ANØV — Bonjour [name], votre réservation pour [guests] personne(s) est prévue demain,
le [date] à [time]. À bientôt ! Pour nous contacter : [restaurantPhone]
```

**Format de numéro:**
- `0612345678` → `+33612345678`
- `+33 6 12 34 56 78` → `+33612345678`

#### Erreurs Twilio:

| Cas | Comportement |
|-----|--------------|
| Twilio non configuré | Warning log, null returned |
| Numéro invalide | Erreur Twilio, log error |
| SMS non envoyé | Exception catched, pas d'envoi |

#### SMS vs Email:

- Si `phone` est présent → **SMS** (pas d'email)
- Si `phone` est null → **Email**
- Le flag `reminderSmsSent = true` empêche l'email si SMS envoyé
- Le flag `reminderEmailSent = true` empêche le SMS si email envoyé

---

## Cas de Figure - Table Allocation Logic

### Algorithme `pickTable`

#### Règles par défaut:

| Guests | Tier(s) autorisé(s) | Fallback |
|--------|---------------------|----------|
| 1 | [2] | Aucun (pas de fallback) |
| 2 | [2, 3] | Table de 3 (jamais 4) |
| 3 | [3, 4] | Table de 4 |
| 4 | [4] | Aucun (pas de fallback) |

#### Cas de Figure - Algorithme `pickTable`:

| Cas | Guests | Tables disponibles | Résultat |
|-----|--------|-------------------|----------|
| Future, tier exact | 2 | Table de 2 | Table de 2 |
| Future, tier exact | 3 | Table de 3 | Table de 3 |
| Future, tier exact | 4 | Table de 4 | Table de 4 |
| Future, tier pas dispo | 2 | Table de 2 occupée | Table de 3 (fallback) |
| Future, pas de fallback | 1 | Table de 2 occupée | `null` (pas de table) |
| Future, pas de fallback | 1 | Pas de table de 2 | `null` |
| Same-day, disponible | 3 | Tables de 2, 3, 4 | Plus petite ≥3 (table de 3) |
| Same-day, pas dispo | 4 | Tables de 4 occupées | `null` |
| Service turn conflict | 2 | Table de 2 occupée (≤90min) | Table de 3 (fallback) |

#### Comportement spécifique:

| Cas | isToday | Comportement |
|-----|---------|--------------|
| Future booking | `false` | Stratified allocation (tier hierarchy) |
| Same-day booking | `true` | Smallest fitting table (pas de tier) |

---

## Calcul de Disponibilité (`computeBusyTableIds`)

### Règle de blocage:

Une réservation bloque une table pour `± mealDuration` autour du créneau.

**Formule:**
```
targetMin >= resMin - mealDuration AND targetMin < resMin + mealDuration
```

### Exemple:

| Slot | Reservation time | mealDuration | Block window | Table 2 busy? |
|------|------------------|--------------|--------------|---------------|
| 12:00 | 12:00 | 90 min | 10:30 - 13:30 | Oui |
| 12:00 | 12:30 | 90 min | 11:00 - 14:00 | Oui |
| 19:00 | 12:00 | 90 min | 10:30 - 13:30 | Non |

### Service turns:

**Formule:**
```
service_turns = floor((dernier_slot - premier_slot) / mealDuration) + 1
```

**Exemple:**
```
Slots: 12:00, 12:30, 13:00, 13:30, 19:00, 19:30, 20:00
Meal duration: 90 minutes

Service 1 (midi): 12:00-13:30 → (90min span / 90min duration) + 1 = 2 service turns
Service 2 (soir): 19:00-20:00 → (120min span / 90min duration) + 1 = 2 service turns

Total tables utilisables: 6 × 2 + 6 × 2 = 24 couverts disponibles
```

---

## Liste Complète des Statuts de Réservation

### ReservationStatus

| Status | Description | Transition |
|--------|-------------|------------|
| `IN_PROGRESS_PAYMENT` | Paiement Stripe initié mais non complété | → PENDING_PAYMENT |
| `PENDING_PAYMENT` | Réservation créée, paiement Stripe en attente | → CONFIRMED (webhook), DELETE (cancel API) |
| `CONFIRMED` | Paiement reçu | → COMPLETED (admin) |
| `CANCELLED` | Réservation annulée | Aucune (terminal) |
| `COMPLETED` | Réservation terminée (post-visit) | Aucune (terminal) |
| `EXPIRED` | PENDING_PAYMENT avec transactionExpireAt passé | Aucune (terminal, non affiché) |

**Note:** `IN_PROGRESS_PAYMENT` n'est pas utilisé pour les réservations de tables (uniquement pour gift cards). Les réservations passent directement à `PENDING_PAYMENT`.

---

## Architecture des Données - Réservation

### Schema Prisma (Réservation)

```prisma
model Reservation {
  id                  String            @id @default(cuid())
  createdAt           DateTime          @default(now())
  updatedAt           DateTime          @updatedAt
  name                String
  email               String
  phone               String?
  date                DateTime
  guests              Int
  specialRequest      String?
  wantsSmsReminder    Boolean           @default(false)
  status              ReservationStatus @default(PENDING_PAYMENT)
  stripeSessionId     String?           @unique
  expiresAt           DateTime?
  reminderEmailSent   Boolean           @default(false)
  reminderSmsSent     Boolean           @default(false)
  cancelToken         String            @unique @default(cuid())
  transactionExpireAt DateTime?
  depositPaidCents    Int?
  tableId             Int?
  table               Table?            @relation(fields: [tableId], references: [id])
}
```

### Relations:

```
Reservation --(tableId)--> Table
```

### Workflow de Création:

```
1. POST /api/reservations
   ├─ Validation (name, email, date, time, guests 1-4)
   ├─ Calcul du dépôt (2000 × guests)
   ├─ Attribution de table (dans transaction)
   ├─ Création de la réservation (PENDING_PAYMENT)
   ├─ Création de la session Stripe
   └─ Retour URL de paiement

2. Webhook Stripe (checkout.session.completed)
   ├─ Mise à jour → CONFIRMED
   ├─ Email de confirmation (avec ICS)
   └─ Clear transactionExpireAt

3. Cron Rappels (1 jour avant)
   ├─ SMS (si phone) ou Email
   └─ Flag reminderSmsSent/reminderEmailSent

4. Annulation
   ├─ GET /api/reservations/cancel?token
   └─ DELETE (ou PATCH admin → CANCELLED + refund)
```

---

## Test Cases Recommandés

### API Tests

#### POST `/api/reservations`

- [ ] Success - Création avec 1 guest
- [ ] Success - Création avec 2 guests
- [ ] Success - Création avec 3 guests
- [ ] Success - Création avec 4 guests
- [ ] Error - Champs manquants (name)
- [ ] Error - Champs manquants (email)
- [ ] Error - Champs manquants (date)
- [ ] Error - Champs manquants (time)
- [ ] Error - Champs manquants (guests)
- [ ] Error - Guests < 1
- [ ] Error - Guests > 4
- [ ] Error - Guests non numérique
- [ ] Error - Email invalide
- [ ] Error - Date dans le passé
- [ ] Error - Phone format invalide
- [ ] Error - Table non disponible (409)
- [ ] Error - Stripe error (500)
- [ ] **Edge case** - Abandon paiement (fermeture fenêtre Stripe)
- [ ] **Edge case** - Back button après Stripe
- [ ] **Edge case** - Race condition (2 clients simultanés)
- [ ] **Edge case** - Resto complet (toutes tables occupées)
- [ ] **Edge case** - 3 guests avec tables de 2 uniquement disponibles

#### GET `/api/reservations/availability`

- [ ] Success - Jour normal, slots disponibles
- [ ] Success - Jour fermé (lundi)
- [ ] Success - Jour avec override closed
- [ ] Success - Jour avec override custom
- [ ] Success - Aujourd'hui, filtre heures passées
- [ ] Success - Date passée (empty slots)
- [ ] Error - Guests invalide (0)
- [ ] Error - Guests invalide (5)
- [ ] Error - Guests invalide (abc)
- [ ] Error - Date format invalide
- [ ] Success - Month query - dates indisponibles

#### GET `/api/reservations/[id]`

- [ ] Success - Réservation existante
- [ ] Error - Réservation non trouvée (404)

#### GET `/api/reservations/cancel?token=xxx`

- [ ] Success - Token valide, PENDING_PAYMENT
- [ ] Success - Token valide, CONFIRMED
- [ ] Success - Token valide, CANCELLED (already_cancelled)
- [ ] Error - Token valide, COMPLETED
- [ ] Error - Token valide, PENDING_PAYMENT expiré
- [ ] Error - Token invalide (404)
- [ ] Error - Token manquant (400)

#### PATCH `/api/admin/reservations`

- [ ] Success - CONFIRMED
- [ ] Success - CANCELLED
- [ ] Success - COMPLETED
- [ ] Error - ID manquant (400)
- [ ] Error - Status invalide (400)
- [ ] Error - Réservation EXPIRED (400)
- [ ] Success - Refund Stripe (si stripeSessionId existe)

#### GET `/api/admin/reservations`

- [ ] Success - No filters
- [ ] Success - Filter by status=CONFIRMED
- [ ] Success - Filter by status=PENDING_PAYMENT (non expiré)
- [ ] Success - Filter by date
- [ ] Success - Pagination
- [ ] Success - PENDING_PAYMENT expiré EXCLU

#### GET `/api/admin/tables`

- [ ] Success - Structure correcte
- [ ] Success - Tri par capacity ASC

#### GET/PUT/DELETE `/api/admin/overrides/[date]`

- [ ] Success - GET existant
- [ ] Success - GET non existant (null)
- [ ] Success - PUT closed
- [ ] Success - PUT custom slots
- [ ] Success - PUT global (delete)
- [ ] Success - DELETE existant
- [ ] Success - DELETE non existant (idempotent)
- [ ] Error - Past day modification (400)
- [ ] Error - Closed avec réservations actives (400)
- [ ] Error - Custom slots avec réservations impactées (400)

#### GET `/api/admin/calendar`

- [ ] Success - Jour ouvert global
- [ ] Success - Jour fermé global
- [ ] Success - Override closed
- [ ] Success - Override custom
- [ ] Success - Calcul de totalCapacity
- [ ] Success - Calcul de reservedGuests

#### GET/PUT `/api/admin/settings`

- [ ] Success - GET settings
- [ ] Success - PUT valid settings
- [ ] Error - mealDuration non divisible par 30
- [ ] Error - mealDuration = 0
- [ ] Error - openingDays out of range
- [ ] Error - deposit < 0
- [ ] Error - impact detection (409)

#### Webhook Stripe

- [ ] Success - Réservation (ancien format)
- [ ] Success - Réservation (nouveau format)
- [ ] Error - Metadata manquantes (400)
- [ ] Success - Webhook signature validation
- [ ] Error - Signature manquante (400)
- [ ] Error - Signature invalide (400)

#### Cron Reminders

- [ ] Success - SMS si phone présent
- [ ] Success - Email si phone null
- [ ] Success - Skip si déjà rappelé
- [ ] Success - Skip si réservation aujourd'hui
- [ ] Success - daysBeforeReminder=0 (same day)
- [ ] Success - daysBeforeReminder=1 (tomorrow)

### E2E Tests (Playwright)

#### Reservation Flow

```
1. Home → Menu → Date selection → Time selection
2. Guest count selection → Form → Submit
3. Redirect to Stripe → Complete payment
4. Success page → Check DB status = CONFIRMED
5. Email reçu avec ICS
```

#### Admin Dashboard Flow

```
1. Login → Calendar view
2. Select date → Override (closed/custom)
3. View reservations → Change status
4. Settings update
```

#### Cancellation Flow

```
1. GET /api/reservations/cancel?token (valid)
2. PATCH /api/admin/reservations (CANCELLED)
3. Email reçu
4. Refund Stripe (si applicable)
```

#### Availability Flow

```
1. GET /api/reservations/availability?date=...&guests=...
2. Check slots disponibles
3. Make reservation
4. GET /api/reservations/availability?date=...&guests=...
5. Check slots disponibles diminue
```

#### Edge Cases Flow

```
1. Resto complet → Vérifier message d'erreur 409
2. Abandon paiement → Vérifier non affichage en admin
3. Race condition → Vérifier une seule réservation créée
4. Back button après Stripe → Vérifier session Stripe active
```

---

## Cas de Figure - Réservation Dernière Minute (Same-Day)

### Cas 1: Réservation same-day (aujourd'hui)

**Setup:**
- Date = aujourd'hui (ex: 2026-07-12)
- Heure = 15:00
- Heure actuelle = 14:30

**Comportement:**
- `isToday = true`
- Algorithme: **Smallest fitting table** (pas de tier hierarchy)
- Table de 2, 3 ou 4 selon disponibilité

**Différence avec future booking:**
- Future: `isToday = false` → tier hierarchy (table de 2 pour 2 guests)
- Same-day: `isToday = true` → plus grande table ≥ guests

### Cas 2: Same-day avec slots déjà passés

**Setup:**
- Date = aujourd'hui (2026-07-12)
- Heure actuelle = 14:30

**Comportement:**
- Slots avant 15:00 **exclus** (déjà passés)
- Seuls les slots à partir de 15:00 sont disponibles

**Flux:**
```
GET /api/reservations/availability?date=2026-07-12&guests=2
→ Résultat: slots à partir de "15:00" uniquement
```

---

## Cas de Figure - Annulation et Remboursement

### Cas 1: Annulation admin avec refund

**Setup:**
- Réservation CONFIRMED
- stripeSessionId existe
- depositPaidCents = 4000

**Comportement:**
1. PATCH admin → CANCELLED
2. Email envoyé (sendCancellationEmail)
3. Stripe refund créé (4000 cents)
4. Réservation affichée avec statut CANCELLED

### Cas 2: Annulation admin sans stripeSessionId

**Setup:**
- Réservation CONFIRMED
- stripeSessionId = null (ex: créée manuellement)

**Comportement:**
1. PATCH admin → CANCELLED
2. Email envoyé (sendCancellationEmail)
3. **Aucun refund** (pas de session Stripe)
4. Réservation affichée avec statut CANCELLED

### Cas 3: Annulation via cancel API (client)

**Setup:**
- Réservation PENDING_PAYMENT
- Token valide

**Comportement:**
1. GET /api/reservations/cancel?token=XXX
2. Réservation **supprimée** (DELETE, pas UPDATE)
3. Aucun email envoyé
4. Réservation **disparait** de la base

### Cas 4: Annulation après confirmation (PENDING_PAYMENT → CONFIRMED → CANCELLED)

**Setup:**
- Client a payé, statut = CONFIRMED
- Admin annule

**Comportement:**
1. PATCH admin → CANCELLED
2. Email envoyé
3. Stripe refund créé
4. Réservation affichée avec statut CANCELLED

---

## Cas de Figure - Gestion Admin

### Cas 1: Affichage des réservations expirées

**Setup:**
- Réservation PENDING_PAYMENT avec `transactionExpireAt` dépassé

**Comportement:**
- Réservation **N'est PAS affichée** en admin
- Réservation **existe** en base
- Filtre: `transactionExpireAt > now` ou `transactionExpireAt = null`

### Cas 2: Tentative de modification d'une réservation expirée

**Setup:**
- Réservation PENDING_PAYMENT expirée
- Admin essaie de la modifier en CONFIRMED

**Comportement:**
```
1. Tentative de PATCH → CANCELLED
2. Alert: "Impossible de modifier une réservation expirée. Elle doit être annulée."
3. Réservation non modifiable (sauf CANCELLED)
```

### Cas 3: Overriding un jour avec réservations actives

**Setup:**
- Jour avec 3 réservations CONFIRMED
- Admin essaie de fermer ce jour

**Comportement:**
```
1. PUT override → closed: true
2. Alert: "Impossible de fermer ce jour : 3 réservation(s) active(s) en cours. Annulez-les d'abord."
3. Override non enregistré
```

### Cas 4: Overriding avec custom slots impactant des réservations

**Setup:**
- Jour avec réservations à 19:00
- Admin retire 19:00 des slots

**Comportement:**
```
1. PUT override → openingSlots: ["12:00", "20:00"]
2. Alert: "Impossible de retirer ces créneaux : 3 réservation(s) active(s) seraient impactées. Annulez-les d'abord."
3. Override non enregistré
```

### Cas 5: Past day override modification

**Setup:**
- Date passée (ex: 2026-07-01)
- Admin essaie de modifier l'override

**Comportement:**
```
1. PUT override
2. Alert: "Impossible de modifier le calendrier d'un jour déjà passé."
3. Override non modifié
```

---

## Cas de Figure - Calculs de Disponibilité

### Cas 1: Service turns (midi)

**Setup:**
- Slots midi: 12:00, 12:30, 13:00, 13:30
- Meal duration: 90 min

**Calcul:**
```
Span: 13:30 - 12:00 = 90 minutes
Service turns: floor(90 / 90) + 1 = 2
Tables × 2 services = 12 couverts disponibles
```

### Cas 2: Service turns (soir)

**Setup:**
- Slots soir: 19:00, 19:30, 20:00, 20:30, 21:00, 21:30
- Meal duration: 90 min

**Calcul:**
```
Span: 21:30 - 19:00 = 150 minutes
Service turns: floor(150 / 90) + 1 = 3
Tables × 3 = 18 couverts disponibles
```

### Cas 3: Gaps entre services

**Setup:**
- Slots: 12:00, 12:30, 19:00, 19:30
- Gap: 19:00 - 13:30 = 5h30 > 2h

**Comportement:**
- 2 services distincts (midi et soir)
- Chaque service a ses propres service turns

### Cas 4: Aujourd'hui - Filtre des services

**Setup:**
- Heure actuelle: 14:30
- Slots: 12:00, 12:30, 13:00, 13:30, 19:00, 19:30

**Comportement:**
- Service midi: premier slot 12:00, dernier 13:30
- Dernier slot (13:30) < actuel (14:30) → **filtre**
- Seul le service soir (19:00+) reste disponible

---

## Cas de Figure - Pagination

### GET `/api/admin/reservations`

| Page | Per Page | Comportement |
|------|----------|--------------|
| 1 | 25 | Réservations 1-25 |
| 2 | 25 | Réservations 26-50 |
| 3 | 25 | Réservations 51-75 |
| 1 | 10 | Réservations 1-10 |

**Résultat:**
```json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "pageSize": 25
}
```

### Pagination avec filtres

| Filtre | Résultat |
|--------|----------|
| `date=2026-08-15` | Total = réservations du jour |
| `status=CONFIRMED` | Total = réservations confirmées |
| Aucun filtre | Total = toutes réservations non expirées |

---

## Cas de Figure - Format de Date et Heure

### Cas 1: Date au format incorrect

**Request:** `GET /api/reservations/availability?date=2026/07/15&guests=2`

**Résultat:** 400 "date invalide"

### Cas 2: Date ISO 8601

**Request:** `GET /api/reservations/availability?date=2026-07-15&guests=2`

**Résultat:** 200 + données valides

### Cas 3: Heure au format incorrect

**Request:** `POST /api/reservations` avec `time: "19h00"`

**Comportement:**
- `reservationDate = new Date("2026-08-15T19h00:00.000Z")`
- Date invalide → 400 "Date invalide"

### Cas 4: Heure correcte

**Request:** `POST /api/reservations` avec `time: "19:00"`

**Comportement:**
- `reservationDate = new Date("2026-08-15T19:00:00.000Z")`
- Date valide → 200

---

## Cas de Figure - Timezone Handling

### Cas 1: Date stockée en UTC

**Setup:**
- Client réside en France
- Date sélectionnée: 2026-08-15 19:00

**Comportement:**
- Stocké en UTC: `2026-08-15T17:00:00.000Z` (été = UTC+2)
- Affiché en France: 19:00 (local)

### Cas 2: Calcul de same-day avec timezone

**Setup:**
- Heure actuelle Paris: 14:30
- Date: 2026-07-12

**Comportement:**
- `todayStr = new Date().toISOString().split('T')[0]`
- `dateStr === todayStr` → true (UTC)
- Heure locale 14:30 → UTC 12:30 (été)

### Cas 3: getUTCHours() pour heure de slot

**Setup:**
- Reservation: 2026-08-15T17:00:00.000Z (UTC)
- Heure locale: 19:00

**Comportement:**
- `getUTCHours()` = 17 (heures UTC)
- `getUTCMinutes()` = 0
- Slot = "17:00" (format UTC pour comparaison)

---

## Cas de Figure - Dépôt et Acompte

### Calcul du dépôt

**Formule:**
```
depositPaidCents = depositPerGuestCents × guests
```

**Exemples:**
| Guests | depositPerGuestCents | depositPaidCents |
|--------|---------------------|------------------|
| 1 | 2000 | 2000 |
| 2 | 2000 | 4000 |
| 3 | 2000 | 6000 |
| 4 | 2000 | 8000 |

### Modification du dépôt

**Setup:**
- Admin change `depositPerGuestCents` de 2000 à 3000
- Réservations existantes: non impactées (dépôt déjà payé)

**Comportement:**
- Nouvelles réservations: nouveau montant
- Réservations existantes: montant d'origine (pas de mise à jour)

---

## Cas de Figure - Table de Réserve (visuelle)

### Table de Réserve

**Setup:**
- Table "Réserve" (table de 2)
- Position: posX=50, posY=85
- **Table de réserve** = purement visuelle

**Comportement:**
- N'est **pas** dans la base de données
- N'est **pas** prise en compte par l'algorithme
- Affichée uniquement dans le schéma admin
- Utilisée pour **visualisation** (table d'appoint)

**Code:**
```typescript
const RESERVE_TABLE = { name: 'Réserve', posX: 50, posY: 85 };
```

---

## Cas de Figure - Réservation sans Table

### Cas 1: Pas de tableId

**Setup:**
- Réservation créée mais tableId = null

**Comportement:**
- Affichée dans l'admin avec "Table: -"
- `tableId` peut être null si:
  - Reservation créée manuellement
  - Problème d'attribution de table

**Note:** Normalement, une réservation **a toujours une table** (constraint non-null dans la DB schema)

---

## Test Cases Recommandés

### API Tests