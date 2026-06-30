# Documentation Système de Bons Cadeaux - ANØV

## Table des matières
1. [Vue d'ensemble](#vue-densemble)
2. [État du bon cadeau](#état-du-bon-cadeau)
3. [Cas d'usage client (côté utilisateur)](#cas-dusage-client-côté-utilisateur)
4. [Cas d'usage administrateur](#cas-dusage-administrateur)
5. [Workflow complet d'achat client](#workflow-complet-dachat-client)
6. [Workflow complet de création admin](#workflow-complet-de-création-admin)
7. [Expérimentation des bons cadeaux](#expérimentation-des-bons-cadeaux)
8. [Gestion des paiements Stripe](#gestion-des-paiements-stripe)
9. [Emails et notifications](#emails-et-notifications)
10. [APIs et endpoints](#apis-et-endpoints)
11. [Cas edge (cas particuliers)](#cas-edge-cas-particuliers)

---

## Vue d'ensemble

Le système de bons cadeaux (« chèques cadeaux ») permet aux clients d'acheter des bons d'une valeur déterminée qui peuvent être utilisés pour payer n'importe quelle consommation dans le restaurant ANØV. Les bons cadeaux ont une **validité de 12 mois** à partir de la date de création.

Le système supporte deux canaux de création :
1. **Achat client via Stripe Checkout** (côté public) - paiement effectif
2. **Création admin manuelle** (côté admin) - bons gratuits

---

## État du bon cadeau

### Schéma de base de données (Prisma)

```prisma
enum GiftCardStatus {
  IN_PROGRESS_PAYMENT  // En cours de paiement
  ACTIVE               // Actif, utilisable
  USED                 // Utilisé
  EXPIRED              // Expiré
}
```

### Définition des statuts

| Statut | Description | Commentaires |
|--------|-------------|--------------|
| `IN_PROGRESS_PAYMENT` | Le client a initié le paiement via Stripe mais le paiement n'est pas encore confirmé | État temporaire - **expiration transaction à 10 min** |
| `ACTIVE` | Le bon est actif et utilisable (paiement validé ou création admin) | **Expiration naturelle à 12 mois** |
| `USED` | Le bon a été utilisé pour une réservation | Non remboursable |
| `EXPIRED` | Le bon a expiré (12 mois d'expiration naturelle) | Ne peut plus être utilisé |

### ⚠️ Différence importante : Expiration transaction vs Expiration naturelle

| Type d'expiration | Champ | Délai | Impact |
|-------------------|-------|-------|--------|
| **Expiration transaction** | `transactionExpireAt` | 10 minutes | Le bon est **exclu de l'affichage** dans l'interface admin, mais reste en base avec le statut `IN_PROGRESS_PAYMENT` |
| **Expiration naturelle** | `expiresAt` | 12 mois | Le bon devient `EXPIRED` ou reste `ACTIVE` mais est **inutilisable** - affiché dans l'interface admin avec statut `EXPIRED` |

**Important :** Ces deux types d'expiration sont indépendants :
- Un bon peut avoir `transactionExpireAt` dépassé (10min) mais `expiresAt` encore valide (12mois) → non affiché
- Un bon peut être `ACTIVE` mais avoir `expiresAt` dépassé → affiché comme `EXPIRED` (inutilisable)

---

## Cas d'usage client (côté utilisateur)

### 1. Page d'achat (`/cheques-cadeaux`)

**Comportement attendu :**
- L'utilisateur voit le formulaire d'achat avec :
  - Sélection de montant (dropdown : 50€, 100€, 150€, 200€, 250€, 500€)
  - Email du destinataire (obligatoire)
  - Message personnalisé (optionnel)
  - Bouton "Acheter maintenant"

**Validation client :**
```typescript
// Montant : doit être un nombre positif
if (!amount.trim()) → erreur
if (parseFloat(amount) <= 0) → erreur

// Email : regex validation
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) → erreur
```

### 2. Création de session Stripe (`/api/gift-cards/checkout`)

**Flux :**
1. L'utilisateur soumet le formulaire
2. API `/api/gift-cards/checkout` est appelée
3. Un bon cadeau est créé en base avec :
   - Code : `ANOV-G-XXXX-XXXX` (format client)
   - `status: IN_PROGRESS_PAYMENT`
   - `isPaid: true` (paiement attendu)
   - `transactionExpireAt`: +10 minutes
   - `expiresAt`: +12 mois
4. Session Stripe Checkout créée
5. Redirection vers Stripe

**Validation serveur :**
- Montant : doit être convertible en nombre, > 0
- Email : format valide
- Si validation échoue → erreur 400 avec message

### 3. Redirection vers Stripe

L'utilisateur est redirigé vers Stripe Checkout avec :
- URL de succès : `/cheques-cadeaux/succes?session_id={CHECKOUT_SESSION_ID}`
- URL d'annulation : `/cheques-cadeaux`

### 4. Page de succès (`/cheques-cadeaux/succes`)

**Comportement :**
- Si `session_id` absent → erreur affichée
- Si `session_id` présent → affichage de la confirmation
- Attend 1.5s avant affichage (laisse temps au webhook Stripe)

**Message affiché :**
```
Votre paiement a été traité avec succès.
Un email contenant le chèque cadeau a été envoyé au destinataire.
```

---

## Cas d'usage administrateur

### 1. Page d'administration (`/admin/cheques-cadeaux`)

**Fonctionnalités :**
- Vue d'ensemble avec statistiques
- Filtres : statut, code, email
- Pagination (25 par page)
- Création de nouveaux bons

**Statistiques affichées :**
| Statistique | Description |
|-------------|-------------|
| Total émis | Tous les bons SAUF ceux avec transaction expirée (10min) |
| Montant actif | Somme des bons ACTIVE/USED non expirés |
| Actifs | Bons ACTIVE non expirés |
| Expirés | Bons EXPIRED + ACTIVE expirés |

### 2. Création d'un bon via admin (`POST /api/admin/gift-cards`)

**Corps de la requête :**
```json
{
  "amount": 100,
  "recipientEmail": "destinataire@example.com",
  "personalMessage": "Bienvenue pour votre anniversaire"
}
```

**Comportement :**
- Code format : `ANOV-M-XXXX-XXXX` (format admin)
- `status: ACTIVE` (pas de paiement Stripe requis)
- `isPaid: false`
- `expiresAt`: +12 mois
- Email envoyé automatiquement si `recipientEmail` fourni

**Validation :**
- `amount` : nombre, > 0
- `recipientEmail` : optional, mais validé si présent
- Si email fourni, validation regex obligatoire

### 3. Filtrage des bons (`GET /api/admin/gift-cards`)

**Paramètres de requête :**
- `status`: filtre par statut (IN_PROGRESS_PAYMENT, ACTIVE, USED, EXPIRED)
- `code`: recherche insensible à la casse
- `email`: recherche dans les emails (insensible à la casse)
- `page`: numéro de page (défaut: 1)

**Logique spéciale :**
Les bons `IN_PROGRESS_PAYMENT` avec `transactionExpireAt` dépassé sont **exclus de l'affichage** (mais restent en base).

### 4. Actions admin sur les bons

#### a. Marquer comme utilisé (`PATCH /api/admin/gift-cards` with `action: 'markUsed'`)

**Comportement client (page admin) :**
- Le bouton "marquer comme utilisé" est affiché si `status === 'ACTIVE' || status === 'EXPIRED'`
- Si `EXPIRED`, confirmation demandée à l'utilisateur
- Si `ACTIVE` (non expiré), confirmation simple demandée

**Comportement backend (`/api/admin/gift-cards/route.ts`) :**
- Aucune vérification du statut actuel dans le code
- Le bon devient `status: USED` quel que soit son état actuel
- `usedAt: Date.now()` est set
- **Note importante :** Le backend est plus permissif que l'interface client

**Comportement réel (vérifié dans le code) :**
- Le frontend n'affiche le bouton que pour `ACTIVE` ou `EXPIRED`
- L'utilisateur ne peut pas cliquer sur le bouton pour `IN_PROGRESS_PAYMENT` ou `USED`
- Mais si l'API est appelée directement (sans passer par le frontend), le backend accepte n'importe quel statut

#### b. Remettre à non utilisé (`PATCH /api/admin/gift-cards` with `action: 'validate'`)

**Comportement client (page admin) :**
- Le bouton "remettre à non utilisé" est affiché si `status === 'ACTIVE' || status === 'USED'`
- Pour un bon `USED` : change en `ACTIVE`
- Note: Si le bon est `IN_PROGRESS_PAYMENT`, le bouton n'est pas affiché dans l'interface

**Comportement backend (`/api/admin/gift-cards/route.ts`) :**
- Le backend met toujours le statut à `ACTIVE`
- `usedAt: null` est set
- Peu importe le statut actuel (`IN_PROGRESS_PAYMENT`, `ACTIVE`, `USED`, `EXPIRED`) → devient `ACTIVE`
- **Note importante :** Le backend est plus permissif que l'interface client
- Le frontend n'affiche le bouton que pour `ACTIVE` ou `USED`, mais le backend accepte n'importe quel statut

#### c. Suppression (`PATCH /api/admin/gift-cards` with `action: 'delete'`)

**Comportement actuel (interface admin) :**
- Fonctionnalité désactivée dans le composant `GiftCardCard.tsx`
- `canDelete` est toujours `false` → le bouton supprimer n'est **jamais affiché**
- `handleDeleteGiftCard` dans la page admin renvoie directement une erreur : "La suppression de bons cadeaux n'est pas autorisée" : "La suppression de bons cadeaux n'est pas autorisée"

**Comportement backend (`/api/admin/gift-cards/route.ts`) :**
- Le backend **permet** la suppression via l'API si appelée directement
- `action === 'delete'` supprime le bon de la base de données
- Le backend n'a pas de vérification pour empêcher la suppression
- **Note importante :** Le frontend empêche l'utilisation de la fonctionnalité, mais le backend la supporte

**Comportement si l'API est appelée directement (via fetch/curl) :**
- Le bon est supprimé de la base de données
- Aucune confirmation n'est demandée
- Cette action est irréversible
- Note: Dans `GiftCardCard.tsx`, `canDelete` est toujours `false`, donc le bouton n'est jamais affiché

---

## Workflow complet d'achat client

```
1. Client remplit formulaire (montant, email, message)
   ↓
2. POST /api/gift-cards/checkout
   ↓
3. Création en base :
   - code: ANOV-G-XXXX-XXXX
   - status: IN_PROGRESS_PAYMENT
   - isPaid: true
   - transactionExpireAt: +10min
   - expiresAt: +12mois
   ↓
4. Session Stripe Checkout créée
   ↓
5. Redirection Stripe
   ↓
6a. Paiement confirmé → webhook Stripe
   └──→ status: ACTIVE, email envoyé
   ↓
6b. Paiement échoué/cancel
   └──→ Bon reste IN_PROGRESS_PAYMENT, expire après 10min
```

---

## Workflow complet de création admin

```
1. Admin clique "Créer un bon"
   ↓
2. Remplit le formulaire (montant, email optionnel, message)
   ↓
3. POST /api/admin/gift-cards
   ↓
4. Création en base :
   - code: ANOV-M-XXXX-XXXX
   - status: ACTIVE
   - isPaid: false
   - expiresAt: +12mois
   - transactionExpireAt: null
   ↓
5. Si email fourni → email envoyé automatiquement
   ↓
6. Admin voit le code dans l'alerte
   └──→ Code à partager manuellement si pas d'email
```

---

## Expérimentation des bons cadeaux

### 1. Expiration naturelle (12 mois)

**Logique :**
```typescript
// Compteur d'expiration ACTIVE → EXPIRED
expiresAt < now() → statut EXPIRED

// Query pour compter les expirés :
WHERE status = 'EXPIRED' 
   OR (status = 'ACTIVE' AND expiresAt < now())
```

### 2. Expiration transaction (10 minutes)

**Logique :**
```typescript
// Pour IN_PROGRESS_PAYMENT :
transactionExpireAt < now() → exclu de l'affichage

// Le bon reste en base avec IN_PROGRESS_PAYMENT
// Mais n'apparaît plus dans l'interface admin
```

### 3. Désactivation par admin

**Mécanisme :**
- Un bon `ACTIVE` peut être marqué `EXPIRED` manuellement
- Code d'action non implémenté (à ajouter si besoin)
- Alternativement : supprimer le bon (désactivé actuellement)

---

## Gestion des paiements Stripe

### Webhook Stripe (`POST /api/stripe/webhook`)

**Événements gérés :**

| Événement | Action |
|-----------|--------|
| `checkout.session.completed` | Traitement du paiement du bon |

**Traitement du webhook :**
```typescript
if (event.type === 'checkout.session.completed') {
  const meta = session.metadata ?? {};
  
  if (meta.type === 'gift_card' && meta.giftCardId) {
    await handleGiftCardPayment(giftCardId, sessionId);
  }
}
```

**Function `handleGiftCardPayment` :**
1. Récupère le bon via `giftCardId`
2. Met à jour :
   - `status: 'ACTIVE'`
   - `stripeSessionId: sessionId`
   - `transactionExpireAt: null` (transaction terminée)
3. Envoie l'email au destinataire

**Conditions d'erreur :**
- Webhook sans signature → 400
- Signature invalide → 400
- Metadata manquantes → 400

---

## Emails et notifications

### Email d'achat confirmé

**Contenu :**
```
Objet: Vous avez reçu un chèque cadeau l'Anøv

Vous avez reçu un chèque cadeau pour une expérience gastronomique chez l'Anøv.

Montant: XXX€
Code: ANOV-G-XXXX-XXXX

Comment utiliser :
1. Réservez votre table
2. Présentez ce code lors de votre visite
3. Profitez de votre expérience !

Valable jusqu'au [date d'expiration]
```

### Email admin (création manuelle)

**Identique au format ci-dessus**, mais avec l'email du créateur (si configuré)

### Email de rappel (pas implémenté)

**Fonction `sendGiftCardReminderEmail`** - non utilisée actuellement

---

## APIs et endpoints

### Client-facing APIs

#### `POST /api/gift-cards/checkout`

**Request body :**
```json
{
  "amount": "100€",
  "recipientEmail": "destinataire@example.com",
  "personalMessage": "Message personnalisé"
}
```

**Response (200) :**
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/..."
}
```

**Response (400) :**
```json
{ "error": "Montant et email du destinataire requis" }
{ "error": "Montant invalide" }
{ "error": "Email invalide" }
```

### Admin APIs

#### `GET /api/admin/gift-cards`

**Query params :**
- `status`: optionnel
- `code`: optionnel
- `email`: optionnel
- `page`: optionnel (défaut: 1)

**Response (200) :**
```json
{
  "data": [
    {
      "id": "xxx",
      "code": "ANOV-G-XXXX-XXXX",
      "amount": 100,
      "recipientEmail": "destinataire@example.com",
      "personalMessage": null,
      "isPaid": true,
      "status": "ACTIVE",
      "createdAt": "2026-06-30T...",
      "expiresAt": "2027-06-30T...",
      "transactionExpireAt": null,
      "usedAt": null
    }
  ],
  "total": 42,
  "page": 1,
  "pageSize": 25
}
```

#### `POST /api/admin/gift-cards`

**Request body :**
```json
{
  "amount": 100,
  "recipientEmail": "destinataire@example.com",
  "personalMessage": "Message"
}
```

**Response (201) :**
```json
{
  "id": "xxx",
  "code": "ANOV-M-XXXX-XXXX",
  "amount": 100,
  "recipientEmail": "destinataire@example.com",
  "personalMessage": "Message",
  "isPaid": false,
  "status": "ACTIVE",
  "createdAt": "2026-06-30T...",
  "expiresAt": "2027-06-30T...",
  "usedAt": null
}
```

#### `PATCH /api/admin/gift-cards`

**Request body :**
```json
{
  "id": "gift-card-id",
  "action": "validate" | "markUsed" | "delete"
}
```

**Response (200) :**
```json
{
  "success": true,
  "giftCard": { /* updated object */ }
}
```

#### `GET /api/admin/gift-cards/stats`

**Response (200) :**
```json
{
  "totalIssued": 42,
  "totalAmount": 12500,
  "active": 35,
  "expired": 7,
  "inProgress": 0
}
```

---

## Comportements edge cases

### Cas 1: Expiration transaction (10min) - paiement Stripe non complété

**Scenario :**
- Client crée un bon → paiement initié
- Client ferme la page ou annule le paiement

**Comportement :**
- Le bon reste en base avec `status: IN_PROGRESS_PAYMENT`
- `transactionExpireAt` expire après 10 minutes
- Le bon **n'apparaît plus dans l'interface admin** (exclu du filtre)
- **Le bon n'est pas supprimé de la base** - toujours visible via direct query

**Query admin :**
```sql
-- Le bon est exclu car transactionExpireAt < now()
WHERE status NOT IN_PROGRESS_PAYMENT 
   OR transactionExpireAt > now()
```

### Cas 1b: Expiration naturelle (12mois) - bon inutilisable

**Scenario :**
- Bon créé → `status: ACTIVE`, `expiresAt: +12mois`
- 12 mois passent sans utilisation

**Comportement :**
- Le bon **reste dans la base** avec `status: ACTIVE` (pas changé automatiquement)
- L'interface admin affiche le bon comme **EXPIRED** (via query conditionnelle)
- Le bon **ne peut plus être utilisé** pour une réservation

**Logique d'affichage :**
```sql
-- Pour compter les expirés :
WHERE status = 'EXPIRED' 
   OR (status = 'ACTIVE' AND expiresAt < now())

-- Pour l'affichage, le statut affiché est "Expiré" même si en base c'est ACTIVE
```

### Cas 2: Email non reçu

**Scenario :**
- Paiement Stripe réussi
- Email non délivré (SMTP error)

**Comportement :**
- Le bon est activé en base (`status: ACTIVE`)
- Email error est logué (monitoring)
- **Le bon reste actif** - admin peut renvoyer manuellement

### Cas 3: Marquer comme utilisé un bon expiré

**Scenario :**
- Admin clique "marquer comme utilisé" sur un bon `EXPIRED` (active expiré ou EXPIRED en base)

**Comportement :**
- Confirmation demandée :
  ```
  Attention, ce bon cadeau est expiré depuis le [date].
  Êtes-vous sûr de vouloir le marquer comme utilisé ?
  ```
- Si confirmé → `status: USED`
- Note: Le backend n'active pas la confirmation pour les bons `ACTIVE` non expirés

### Cas 3b: Marquer comme utilisé un bon IN_PROGRESS_PAYMENT

**Scenario :**
- Admin clique "marquer comme utilisé" sur un bon `IN_PROGRESS_PAYMENT`

**Comportement :**
- Aucune confirmation demandée (le backend ne vérifie pas le statut)
- Le bon devient `status: USED`
- `usedAt: Date.now()`
- Note: Ce comportement peut être surprenant car le paiement n'est pas encore confirmé

### Cas 3c: Marquer comme utilisé un bon USED

**Scenario :**
- Admin clique "marquer comme utilisé" sur un bon déja `USED`

**Comportement :**
- Le bon reste `status: USED`
- `usedAt` est mis à jour à la date courante
- Note: Le backend ne vérifie pas si le bon est déjà USED

### Cas 4: Remettre un bon USED à non utilisé

**Scenario :**
- Le bon est `USED`, admin clique "remettre à non utilisé"

**Comportement :**
- `status: USED → ACTIVE`
- `usedAt: null`
- Le bon est de nouveau utilisable

### Cas 5: Code de bon déjà existant (collision)

**Scenario :**
- Génération de code collision rare mais possible
- Le code est généré avec 8 caractères (4 + 4) alpha-numériques (sans O, I, 0)
- Total combinaisons: 36^8 ≈ 2.8 trillion (2.8 x 10^12) combinaisons

**Comportement actuel (dans le code) :**
- Aucune gestion de collision dans le code
- Prisma lève une erreur unique constraint
- L'API renvoie 500 (non géré plus finement)

**Comportement pour une amélioration future :**
- Implementer une boucle de retry avec nouveau code
- Augmenter la longueur du code pour réduire les collisions
- Actuellement, les collisions sont très rares (2.8 trillion combinaisons)

**Format des codes :**
- Client (Stripe) : `ANOV-G-XXXX-XXXX` (8 chars après le prefix)
- Admin (manuel) : `ANOV-M-XXXX-XXXX` (8 chars après le prefix)

### Cas 6: Webhook Stripe reçu après expiration transaction

**Scenario :**
- Paiement Stripe réussi après que `transactionExpireAt` ait expiré (10min)

**Comportement :**
- Le webhook `handleGiftCardPayment` met le bon en `ACTIVE`
- Le bon devient utilisable
- Cet état de fait peut créer une incohérence si l'utilisateur ne voit pas le bon avant

### Cas 7: Création admin avec email invalide

**Scenario :**
- Admin tente de créer un bon avec email invalide

**Comportement :**
- Backend renvoie erreur 400
- "Email invalide"

### Cas 8: Montant non entier (décimal)

**Scenario :**
- Admin entre "100.50" ou "100,50"

**Comportement :**
- Frontend : validation empêche la soumission
- Backend : parseFloat accepte "100.50", mais validation frontend refuse les décimales
- Pour admin : validation `if (createFormData.amount.includes('.'))` -> erreur

### Cas 9: Admin tente de supprimer un bon

**Scenario :**
- Admin clique sur le bouton supprimer

**Comportement :**
- Erreur affichée : "La suppression de bons cadeaux n'est pas autorisée"
- Le bon n'est pas supprimé

### Cas 10: BON EXPIRED avec isPaid: true

**Scenario :**
- Bons créés avec Stripe expirés (12mois passés)

**Comportement :**
- Affiché dans la liste admin avec statut EXPIRED
- Montant non inclus dans "Montant actif"
- Peut être marqué USED (action possible en admin)

### Cas 11: Pagination avec transaction expirée

**Scenario :**
- Plus de 25 bons dont certaines sont IN_PROGRESS_PAYMENT expirées

**Comportement :**
- Les IN_PROGRESS_PAYMENT expirées ne sont pas affichées
- Le compteur `total` exclut ces bons
- Pagination basée sur le total affiché

### Cas 12: Filtre par statut avec IN_PROGRESS_PAYMENT expiré

**Scenario :**
- Admin filtre par "En cours de paiement"

**Comportement :**
- Seuls les IN_PROGRESS_PAYMENT non expirés (transactionExpireAt > now()) sont affichés
- Les expirés ne sont pas retournés même si le filtre correspond

### Cas 13: Webhook avec giftCardId non trouvé

**Scenario :**
- Stripe webhook avec giftCardId qui n'existe pas en base

**Comportement :**
- `handleGiftCardPayment` log une erreur (silencieuse - return sans erreur)
- Ne lève pas d'exception (graceful handling)
- Retourne silently
- **Le webhook renvoie toujours `received: true` même si le giftCardId n'est pas trouvé**

### Cas 13b: PATCH API avec ID non trouvé

**Scenario :**
- Admin tente de valider/marquer/supprimer un bon avec un ID qui n'existe pas

**Comportement :**
- Prisma lève une erreur si l'ID n'existe pas (PrismaClientKnownRequestError)
- Le backend ne gère pas spécifiquement ce cas
- L'utilisateur verra probablement une erreur 500
- **Aucune vérification n'est faite avant l'appel Prisma**

### Cas 13c: PATCH API avec ID manquant

**Scenario :**
- Admin tente d'effectuer une action sans fournir l'ID

**Comportement :**
- Le backend renvoie erreur 400 : "ID et action requis"
- La requête ne passe pas à la base de données

### Cas 14: Webhook sans metadata pour gift card

**Scenario :**
- Stripe webhook sans metadata.type ou metadata.giftCardId

**Comportement :**
- Webhook traite les autres événements (reservations)
- Gift cards sont ignorés (no-op)

### Cas 14a: Webhook Stripe avec autre événement

**Scenario :**
- Stripe webhook reçu avec un événement autre que `checkout.session.completed`

**Comportement :**
- Le webhook ignore l'événement (no-op)
- Retourne `received: true` pour acknowledges l'événement
- Note: Le webhook ne traite que `checkout.session.completed`

### Cas 14b: Webhook Stripe avec paiement échoué (checkout.session.expired/failed)

**Scenario :**
- Stripe webhook reçu avec `checkout.session.expired` ou `checkout.session.failed`

**Comportement :**
- Le webhook ignore l'événement (no-op)
- Le bon reste `status: IN_PROGRESS_PAYMENT`
- Note: Le webhook ne traite que `checkout.session.completed`

### Cas 14c: Webhook Stripe avec giftCardId non trouvé

**Scenario :**
- Stripe webhook reçu avec giftCardId qui n'existe pas en base

**Comportement :**
- `handleGiftCardPayment` log une erreur (silencieuse - return sans erreur)
- Le webhook **ne renvoie pas d'erreur** - il retourne `received: true`
- Le webhook ne lève pas d'exception (graceful handling)
- **Comportement actuel :** Le webhook ne renvoie aucune erreur même si le giftCardId n'est pas trouvé

### Cas 15: Statistiques - Montant actif

**Scenario :**
- Calcul du montant total actif

**Comportement :**
- Exclut : EXPIRED, USED, IN_PROGRESS_PAYMENT (expiré), ACTIVE expirés
- Inclut : ACTIVE, USED (non expirés), IN_PROGRESS_PAYMENT (actif)

### Cas 16: Patch action 'validate' avec bon IN_PROGRESS_PAYMENT

**Scenario :**
- Admin tente de valider un bon avec statut IN_PROGRESS_PAYMENT

**Comportement backend :**
- Le bon est mis en `ACTIVE` (meme si déjà IN_PROGRESS_PAYMENT)
- `usedAt: null`
- **Comportement actuel (dans le code)** : Aucune vérification du statut actuel
- Le backend accepte n'importe quel statut et met `ACTIVE`

**Comportement client :**
- Le bouton "remettre à non utilisé" n'est pas affiché pour `IN_PROGRESS_PAYMENT`
- L'utilisateur ne peut pas cliquer sur le bouton pour ce statut

### Cas 17: Patch action 'markUsed' avec bon IN_PROGRESS_PAYMENT

**Scenario :**
- Admin tente de marquer comme utilisé un bon avec statut IN_PROGRESS_PAYMENT

**Comportement backend :**
- Le bon est mis en `USED` (meme si IN_PROGRESS_PAYMENT)
- `usedAt: Date.now()`
- **Comportement actuel (dans le code)** : Aucune vérification du statut actuel
- Le backend accepte n'importe quel statut et met `USED`

**Comportement client :**
- Le bouton "marquer comme utilisé" n'est pas affiché pour `IN_PROGRESS_PAYMENT`
- L'utilisateur ne peut pas cliquer sur le bouton pour ce statut

### Cas 18: Email manquant dans la réponse admin

**Scenario :**
- Admin crée un bon sans email (recipientEmail vide ou null)

**Comportement :**
- Le bon est créé avec `recipientEmail: null`
- Aucun email n'est envoyé
- Le code est affiché à la création (via alert())
- L'email reste `null` dans la base de données

### Cas 19: Webhook Stripe sans metadata

**Scenario :**
- Stripe webhook reçu sans metadata (ou metadata incomplète)

**Comportement :**
- Le webhook renvoie erreur 400 : "Metadata manquantes"
- L'événement est rejeté
- **Note :** Cela affecte à la fois les gift cards et les réservations

### Cas 19b: Webhook Stripe avec metadata invalide

**Scenario :**
- Stripe webhook reçu avec metadata mais sans les champs requis

**Comportement :**
- Si `meta.type === 'gift_card' && meta.giftCardId` → traité comme gift card
- Si metadata reservation (ancien ou nouveau format) → traité comme réservation
- Sinon → erreur 400 "Metadata manquantes"

### Cas 20: Bons avec payment en cours (IN_PROGRESS_PAYMENT) affichés

**Scenario :**
- Client a commencé le paiement, paiement en attente (moins de 10min)

**Comportement :**
- Le bon apparaît dans la liste admin avec statut "En cours de paiement"
- Le bon apparaît dans les statistiques sous "En cours"
- Le montant du bon est inclus dans le "Montant actif" (car isPaid = true)

---

## Gestion des codes

### Format des codes

| Type | Prefix | Format | Exemple |
|------|--------|--------|---------|
| Client (Stripe) | `ANOV-G-` | `ANOV-G-XXXX-XXXX` | `ANOV-G-ABCD-1234` |
| Admin (manuel) | `ANOV-M-` | `ANOV-M-XXXX-XXXX` | `ANOV-M-EFGH-5678` |

### Caractères utilisés

```
ABCDEFGHJKLMNPQRSTUVWXYZ23456789
```

**Note :** Les lettres `O`, `I` et le chiffre `0` sont exclus pour éviter la confusion visuelle.

---

## Limitations actuelles

### Fonctionnalités non implémentées

1. **Remboursement** : Pas de mécanisme de remboursement
2. **Validation par code** : Pas de page publique pour valider un code
3. **Historique d'utilisation** : `usedAt` enregistré mais pas d'historique détaillé
4. **Cancellation Stripe** : Si paiement annulé, pas de nettoyage automatique
5. **Rappel d'expiration** : Pas d'email de rappel avant expiration
6. **Vérification du statut** : Le backend `/api/admin/gift-cards` ne vérifie pas le statut actuel avant `markUsed` ou `validate`

### Fonctionnalités désactivées

1. **Suppression de bons** : Désactivée (message d'erreur fixe)
2. **Export CSV** : Non implémenté
3. **Filtres avancés** : Pas de filtre par date, montant, etc.

---
## Recommandations pour les tests e2e Playwright

### Scénarios à couvrir

#### Scénario 0: Différencier les deux types d'expiration
1. Créer un bon client → `status: IN_PROGRESS_PAYMENT`, `transactionExpireAt: +10min`, `expiresAt: +12mois`
2. Créer un bon admin → `status: ACTIVE`, `transactionExpireAt: null`, `expiresAt: +12mois`
3. Vérifier la différence entre `transactionExpireAt` (10min) et `expiresAt` (12mois)
4. Comprendre que `IN_PROGRESS_PAYMENT` est exclu après 10min, mais `ACTIVE` reste 12mois

#### Scénario 1: Achat client complet
1. Se rendre sur `/cheques-cadeaux`
2. Sélectionner montant (100€)
3. Remplir email valide
4. Soumettre le formulaire
5. Vérifier redirection vers Stripe
6. Simuler paiement Stripe
7. Vérifier redirection vers `/cheques-cadeaux/succes`
8. Vérifier email envoyé

#### Scénario 2: Achat client avec email invalide
1. Remplir email invalide
2. Vérifier erreur affichée

#### Scénario 3: Expiration transaction (10min) - paiement non complété
1. Créer un bon client
2. Attendre 10+ minutes (mock ou test)
3. Vérifier que le bon **n'apparaît pas** dans l'interface admin
4. Vérifier que le bon **existe toujours en base** avec statut `IN_PROGRESS_PAYMENT`
5. Vérifier que `transactionExpireAt < now()`

#### Scénario 4: Expiration naturelle (12mois) - bon inutilisable
1. Créer un bon admin ou client
2. Passer la date d'expiration (mock)
3. Vérifier que le bon **apparaît toujours** dans l'interface admin
4. Vérifier que le statut est affiché comme `EXPIRED` (ou `ACTIVE` avec `expiresAt < now()`)
5. Vérifier que le bon **ne peut pas être utilisé**

#### Scénario 5: Création admin
1. Se connecter admin
2. Créer un bon (100€, email: test@example.com)
3. Vérifier code format `ANOV-M-XXXX-XXXX`
4. Vérifier email envoyé

#### Scénario 6: Pagination et filtres
1. Créer plusieurs bons
2. Filtrer par statut
3. Filtrer par code
4. Filtrer par email
5. Vérifier pagination (25 par page)

#### Scénario 7: Marquer comme utilisé
1. Créer un bon `ACTIVE`
2. Marquer comme utilisé
3. Vérifier statut devient `USED`
4. Vérifier `usedAt` est set

#### Scénario 8: Remettre à non utilisé
1. Créer un bon, le marquer `USED`
2. Cliquer "remettre à non utilisé"
3. Vérifier statut devient `ACTIVE`
4. Vérifier `usedAt` est null

#### Scénario 9: Marquer un bon expiré (EXPIRED) comme utilisé
1. Créer un bon admin
2. Attendre expiration (12mois) ou modifier `expiresAt` en mock
3. Cliquer "marquer comme utilisé"
4. Confirmation demandée (attention expiré)
5. Vérifier devient `USED`

#### Scénario 10: Expiration naturelle simple (vérification d'affichage)
1. Créer un bon
2. Passer la date d'expiration (mock)
3. Vérifier apparaît comme `EXPIRED` dans la liste admin

#### Scénario 11: Expiration transaction (10min) - paiement non complété
1. Créer un bon client → `status: IN_PROGRESS_PAYMENT`, `transactionExpireAt: +10min`
2. Attendre 10+ minutes (mock ou test)
3. Vérifier que le bon **n'apparaît pas** dans l'interface admin
4. Vérifier que le bon **existe toujours en base** avec statut `IN_PROGRESS_PAYMENT`
5. Vérifier que `transactionExpireAt < now()`
#### Scénario 12: Paiement Stripe non complété (ancien comportement)
1. Initier le paiement
2. Simuler annulation sur Stripe
3. Vérifier que le bon reste en base avec `IN_PROGRESS_PAYMENT`
4. Vérifier que le bon est **exclu de l'affichage** après 10min

#### Scénario 13: Webhook Stripe reçu après expiration transaction
1. Créer un bon client
2. Attendre que `transactionExpireAt` expire (10min)
3. Simuler paiement Stripe réussi
4. Vérifier que le bon devient ACTIVE
5. Vérifier que l'email est envoyé

#### Scénario 14: Création admin avec email invalide
1. Admin tente de créer un bon avec email invalide
2. Vérifier erreur 400 "Email invalide"

#### Scénario 15: Montant décimal (décimal pour admin)
1. Admin entre "100.50" ou "100,50"
2. Vérifier erreur "Le montant doit être un nombre entier"

#### Scénario 15b: Montant décimal dans le format Stripe (checkout API)
1. Client entre "100.50" ou "100,50"
2. Backend: `parseFloat(amount.replace('€', '').trim())` accepte "100.50"
3. Vérifier que le montant est traité comme 100.50€
4. Vérifier que Stripe reçoit le montant en centimes (10050)

**Note sur la validation client vs serveur :**
- **Client (ChequesCadeauxContent.tsx)**: Utilise `parseFloat()` qui accepte les décimales (ex: "100.50")
- **Admin (page.tsx)**: Vérifie `createFormData.amount.includes('.')` et bloque les décimales
- **Backend (checkout API)**: Accepte les décimales via `parseFloat()`
- **Backend (admin API)**: Accepte les décimales via `parseFloat()`

#### Scénario 16: Suppression de bon désactivée
1. Admin tente de supprimer un bon
2. Vérifier message d'erreur "La suppression de bons cadeaux n'est pas autorisée"
3. Vérifier que le bon existe toujours en base

#### Scénario 17: Webhook avec giftCardId non trouvé
1. Webhook Stripe reçu avec giftCardId inexistant
2. Vérifier que l'API ne lève pas d'exception
3. Vérifier que le webhook retourne "received: true"

#### Scénario 18: Statistiques - Montant actif
1. Créer plusieurs bons (ACTIVE, USED, EXPIRED, IN_PROGRESS)
2. Vérifier que le montant actif n'inclut que les bons non expirés et non USED/EXPIRED

#### Scénario 19: Patch action 'validate' avec bon IN_PROGRESS_PAYMENT
1. Créer un bon client → `status: IN_PROGRESS_PAYMENT`
2. Admin clique "remettre à non utilisé"
3. Vérifier que le bon devient `ACTIVE` (pas `USED`)
4. Vérifier que `usedAt` est `null`

#### Scénario 20: Patch action 'markUsed' avec bon IN_PROGRESS_PAYMENT
1. Créer un bon client → `status: IN_PROGRESS_PAYMENT`
2. Admin clique "marquer comme utilisé"
3. Vérifier que le bon devient `USED` (pas `ACTIVE`)
4. Vérifier que `usedAt` est set

#### Scénario 21: Création admin sans email
1. Admin crée un bon sans email (recipientEmail vide)
2. Vérifier que le bon est créé avec `recipientEmail: null`
3. Vérifier que l'email n'est pas envoyé
4. Vérifier que le code est affiché dans l'alerte

#### Scénario 22: Webhook Stripe sans metadata
1. Stripe webhook reçu sans metadata (ou metadata incomplète)
2. Vérifier que le webhook renvoie erreur 400 "Metadata manquantes"
3. Vérifier que le webhook ne traite pas les gift cards

#### Scénario 23: Bons IN_PROGRESS_PAYMENT affichés (paiement en cours)
1. Client crée un bon → `status: IN_PROGRESS_PAYMENT`
2. Vérifier que le bon apparaît dans la liste admin
3. Vérifier que le statut affiché est "En cours de paiement"
4. Vérifier que le bon apparaît dans les statistiques sous "En cours"
5. Vérifier que le montant du bon est inclus dans "Montant actif"

#### Scénario 24: Webhook Stripe sans type de metadata
1. Stripe webhook reçu sans metadata.type
2. Vérifier que le webhook traite l'événement comme une réservation
3. Vérifier que le webhook ne traite pas le gift card

---

## Fichier de configuration Stripe

### Webhook endpoint

**URL :** `/api/stripe/webhook`

**Événements à souscrire :
- `checkout.session.completed`

**Signature webhook :** `STRIPE_WEBHOOK_SECRET` (required)

---

## Résumé des cas pour tests e2e Playwright

### Cas principaux à couvrir (18 cas)
1. **Expiration transaction (10min)** - Bons IN_PROGRESS_PAYMENT non affichés après expiration
2. **Expiration naturelle (12mois)** - Bons affichés comme EXPIRED après 12 mois
3. **Achat client complet** -流程 Stripe Checkout avec paiement confirmé
4. **Achat client échoué** - Email invalide ou montant invalide
5. **Création admin** - Création manuelle avec email ou sans email
6. **Filtres et pagination** - Filtre par statut, code, email avec 25 par page
7. **Marquer comme utilisé** - ACTIVE/EXPIRED → USED avec confirmation
8. **Remettre à non utilisé** - USED → ACTIVE
9. **Suppression désactivée** - Message d'erreur fixe

### Cas edge (6 cas)
10. **Webhook Stripe reçu après expiration transaction** - Paiement après 10min
11. **Webhook sans metadata** - Erreur 400 "Metadata manquantes"
12. **Webhook avec giftCardId non trouvé** - Graceful handling (no error)
13. **Statistiques - Montant actif** - Exclut EXPIRED, USED, IN_PROGRESS expirés
14. **Patch validate/IN_PROGRESS_PAYMENT** - Devient ACTIVE
15. **Patch markUsed/IN_PROGRESS_PAYMENT** - Devient USED

### Cas d'admin (4 cas)
16. **Email invalide admin** - 400 "Email invalide"
17. **Montant décimal admin** - Blocage par validation frontend
18. **Pagination avec transaction expirée** - Total exclut IN_PROGRESS expirés

---

## Références

- **Base de données :** `prisma/schema.prisma` - modèle `GiftCard`
- **API client :** `src/app/api/gift-cards/checkout/route.ts`
- **API admin :** `src/app/api/admin/gift-cards/route.ts`
- **Stats admin :** `src/app/api/admin/gift-cards/stats/route.ts`
- **Webhook Stripe :** `src/app/api/stripe/webhook/route.ts`
- **Component admin :** `src/app/admin/cheques-cadeaux/page.tsx`
- **Component client :** `src/components/shared/ChequesCadeauxContent.tsx`
- **Email template :** `src/lib/email.ts` - `sendGiftCardEmail()`
