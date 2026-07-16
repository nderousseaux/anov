# Feature: Boutique - Page Produits avec MenuDropdown

## Contexte

Le site ANØV est un restaurant de prestige avec :

- **Stack** : Next.js 15 + TypeScript + Prisma + PostgreSQL + Keystatic
- **Paiements** : Stripe (déjà utilisé pour réservations et chèques cadeaux)
- **i18n** : 3 langues (FR, EN, DE)

**Point clé :** La page `/cheques-cadeaux` **ne change pas** - elle reste inchangée et fonctionnelle.

---

## Objectif

Ajouter une nouvelle page `/boutique` pour vendre des **produits physiques**, avec :

- Un menu déroulant dans la navigation (au lieu d'un simple lien)
- Deux options : **Produits** (nouveau) et **Chèques Cadeaux** (existant, inchangé)

---

## 1. Navigation - Menu Dropdown

### Modification dans `Navbar.tsx`

Remplacer l'item "boutique" actuel (lien direct vers `/cheques-cadeaux`) par un **menu déroulant** avec deux options :

**Avant :**

```typescript
{ type: 'link', label: t.nav.boutique, href: '/cheques-cadeaux' },
```

**Après :**

```typescript
{
  type: 'dropdown',
  label: t.nav.boutique,
  items: [
    { label: 'Produits', href: '/boutique' },
    { label: 'Chèques Cadeaux', href: '/cheques-cadeaux' },
  ],
},
```

### Structure du dropdown (Desktop)

```
┌─────────────────────┐
│  Boutique ▼        │  ← Click pour ouvrir
├─────────────────────┤
│  Produits          │
│  Chèques Cadeaux   │
└─────────────────────┘
```

### Structure du dropdown (Mobile)

```
┌─────────────────────┐
│  Boutique ▼         │
├─────────────────────┤
│  - Produits         │
│  - Chèques Cadeaux  │
└─────────────────────┘
```

---

## 2. Page Produits - `/boutique` (NOUVELLE PAGE)

**IMPORTANT :** `/cheques-cadeaux` **n'est PAS modifiée** - elle continue à fonctionner comme avant.

### Contenu de `/boutique`

```
/boutique
├── Hero section (image + titre "Nos Produits")
├── Section: Nos Produits Physiques
│   ├── Grid de produits (images, titre, description, prix)
│   └── Bouton " Commander"
├── Section: Chèques Cadeaux (bienvenue, pas de produit)
│   ├── Card avec CTA "Acheter un chèque cadeau"
│   └── Lien vers /cheques-cadeaux
└── Footer
```

### Structure des produits

```
Product:
- Titre (FR/EN/DE)
- Image(s) principale(s)
- Description (FR/EN/DE)
- Prix
- Quantité maximale commandable
- Est-livrable (booléen)
```

### Comportement du client

1. **Voit les produits** → `/boutique`
2. **Clique sur " Commander"** → Modal/Formulaire
3. **Remplit le formulaire :**
   - Quantité
   - Mode de livraison (Pickup au restaurant / Livraison à domicile)
   - Si livraison : adresse complète
4. **Valide → Stripe Checkout**
5. **Reçoit confirmation par email**

---

## 3. Page Admin - Gestion des commandes

### Nouveau menu dans `/admin` :

Le menu admin existing a 4 items. Ajouter un **5ème item** :

```
Admin Menu:
├── CMS (keystatic)
├── Clients
├── Réservations
├── Chèques Cadeaux
└── Commandes  ← NOUVEAU
```

### Page `/admin/commandes`

Liste de toutes les commandes produits avec :

| Code         | Produit     | Qté | Total | Client     | Date  | Statut   | Actions   |
| ------------ | ----------- | --- | ----- | ---------- | ----- | -------- | --------- |
| ANOV-PO-XXXX | Nom produit | 2   | 150€  | client@... | 12/07 | En cours | View/Edit |

**Actions possibles :**

- `PENDING_PAYMENT` → Aucune (en attente Stripe)
- `CONFIRMED` → "Marquer comme en préparation"
- `PROCESSING` → "Marquer comme prêt/ envoyé"
- `READY/SHIPPED` → "Marquer comme terminé"
- `CANCELLED` → "Rembourser" (mail au client)

### Fiche Client - Historique des commandes

Quand l'admin clique sur un client (email) dans la liste ou dans `/admin/clients` :

- Page `/admin/clients/:email` (ou modal dans la liste)
- Affiche :
  - **Informations du client** (nom, email, téléphone)
  - **Historique complet des commandes produits**
    - Code, Produit, Qté, Total, Date, Statut
    - Tri par date (plus récent en premier)
    - Pagination
  - **Historique des réservations** (existant)
  - **Historique des chèques cadeaux** (existant)

```
Admin → Clients → Clic sur email
└── /admin/clients/toto@example.com

    Client: toto@example.com
    ┌─────────────────────────────────────────────┐
    │ Commandes Produits                         │
    │ ┌───────────────────────────────────────┐  │
    │ │ Code | Prod | Qté | Total | Date | États│  │
    │ │ ANOV-PO-0001 | Produit A | 2 | 100€ | 10/07 | Terminé │
    │ │ ANOV-PO-0002 | Produit B | 1 | 50€  | 11/07 | Expédié │
    │ └───────────────────────────────────────┘  │
    └─────────────────────────────────────────────┘
```

#### Stats par client

- Nombre total de commandes
- Montant total dépensé
- Dernière commande
- Moyenne de panier

---

## 4. Base de données (Prisma)

### Modèle `Product`

```prisma
model Product {
  id             String     @id @default(cuid())
  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt
  code           String     @unique // ANOV-P-XXXX-XXXX
  title_fr       String
  title_en       String
  title_de       String
  description_fr String?    @text
  description_en String?    @text
  description_de String?    @text
  price          Float      // en euros
  maxOrder       Int        @default(1)
  isDeliverable  Boolean    @default(true)
  images         ProductImage[]
}

model ProductImage {
  id        String   @id @default(cuid())
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  productId String
  image     String   // URL dans /assets/products/
  alt_fr    String?
  alt_en    String?
  alt_de    String?
}
```

### Modèle `ProductOrder`

```prisma
model ProductOrder {
  id                String         @id @default(cuid())
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
  code              String         @unique // ANOV-PO-XXXX-XXXX
  product           Product        @relation(fields: [productId], references: [id])
  productId         String
  quantity          Int
  totalPrice        Float
  deliveryMethod    DeliveryMethod @default(PICKUP)
  customerName      String
  customerEmail     String
  customerPhone     String
  customerAddress   ProductAddress?
  stripeSessionId   String?        @unique
  status            OrderStatus    @default(PENDING_PAYMENT)
  expiresAt         DateTime?
  transactionExpireAt DateTime?
}

model ProductAddress {
  id          String        @id @default(cuid())
  order       ProductOrder  @relation(fields: [orderId], references: [id])
  orderId     String
  firstName   String
  lastName    String
  address     String
  city        String
  zipCode     String
  country     String         @default("France")
  phone       String
}

enum DeliveryMethod {
  PICKUP    // Retrait au restaurant
  DELIVERY  // Livraison à domicile
}

enum OrderStatus {
  PENDING_PAYMENT   // Paiement Stripe en cours
  CONFIRMED         // Paiement réussi
  PROCESSING        // En préparation
  SHIPPED           // Envoyé (delivery)
  READY             // Prêt (pickup)
  COMPLETED         // Réception par client
  CANCELLED         // Remboursé/annulé
  EXPIRED           // Session Stripe expirée
}
```

### Mise à jour de GiftCard (sans changement fonctionnel)

```prisma
// GiftCard reste inchangé - fonctionne comme avant
model GiftCard {
  id                  String         @id @default(cuid())
  createdAt           DateTime       @default(now())
  updatedAt           DateTime       @updatedAt
  code                String         @unique
  amount              Float
  recipientEmail      String?
  personalMessage     String?
  isPaid              Boolean        @default(false)
  status              GiftCardStatus @default(IN_PROGRESS_PAYMENT)
  stripeSessionId     String?        @unique
  expiresAt           DateTime?
  transactionExpireAt DateTime?
  usedAt              DateTime?
}

enum GiftCardStatus {
  IN_PROGRESS_PAYMENT
  ACTIVE
  USED
  EXPIRED
}
```

---

## 5. API Endpoints

### `/api/boutique/products` (GET)

```typescript
// Response
{
  products: [
    {
      id: "...",
      code: "ANOV-P-XXXX",
      title_fr: "...",
      title_en: "...",
      title_de: "...",
      price: 49.9,
      maxOrder: 5,
      isDeliverable: true,
      images: [{ image: "/assets/products/item1.jpg", alt_fr: "...", ... }],
    }
  ],
  total: 10
}
```

### `/api/boutique/checkout` (POST)

```typescript
// Request
{
  productId: "...",
  quantity: 2,
  deliveryMethod: "DELIVERY" | "PICKUP",
  address?: {
    firstName: "...",
    lastName: "...",
    address: "...",
    city: "...",
    zipCode: "...",
    country: "...",
    phone: "..."
  }
}

// Response
{
  sessionId: "...",  // Stripe session ID
  url: "https://checkout.stripe.com/..."
}
```

### `/api/admin/orders` (GET)

```typescript
// Query params
?status=CONFIRMED&code=ANOV-PO&email=client@&page=1

// Response
{
  data: [...orders],
  total: 100,
  page: 1,
  pageSize: 25
}
```

---

## 6. Stripe Webhook

Dans `src/app/api/stripe/webhook/route.ts` :

```typescript
if (event.type === "checkout.session.completed") {
  const session = event.data.object;
  const meta = session.metadata ?? {};

  // Gestion chèques cadeaux (EXISTANT - inchangé)
  if (meta.type === "gift_card" && meta.giftCardId) {
    await handleGiftCardPayment(meta.giftCardId, session.id);
  }

  // NOUVEAU : Gestion commandes produits
  else if (meta.type === "product_order" && meta.orderId) {
    await handleProductOrderPayment(meta.orderId, session.id);
  }
}
```

---

## 7. Keystatic Configuration

### Ajouter à `keystatic.config.ts`

```typescript
boutique: singleton({
  label: 'Boutique',
  path: 'content/boutique',
  schema: {
    // Hero section
    heroImage: fields.image({
      label: 'Image de fond',
      directory: 'public/assets/boutique',
      publicPath: '/assets/boutique/',
    }),
    heroTitle_fr: fields.text({ label: 'Titre hero 🇫🇷' }),
    heroTitle_en: fields.text({ label: 'Titre hero 🇬🇧' }),
    heroTitle_de: fields.text({ label: 'Titre hero 🇩🇪' }),
    heroSubtitle_fr: fields.text({ label: 'Sous-titre hero 🇫🇷' }),
    heroSubtitle_en: fields.text({ label: 'Sous-titre hero 🇬🇧' }),
    heroSubtitle_de: fields.text({ label: 'Sous-titre hero 🇩🇪' }),

    // Section produits (texte introductif)
    productsIntroTitle_fr: fields.text({ label: 'Titre intro produits 🇫🇷' }),
    productsIntroTitle_en: fields.text({ label: 'Titre intro produits 🇬🇧' }),
    productsIntroTitle_de: fields.text({ label: 'Titre intro produits 🇩🇪' }),
    productsIntroText_fr: fields.text({ label: 'Texte intro produits 🇫🇷', multiline: true }),
    productsIntroText_en: fields.text({ label: 'Texte intro produits 🇬🇧', multiline: true }),
    productsIntroText_de: fields.text({ label: 'Texte intro produits 🇩🇪', multiline: true }),

    // Section chèques cadeaux
    giftCardsIntroTitle_fr: fields.text({ label: 'Titre intro chèques 🇫🇷' }),
    giftCardsIntroTitle_en: fields.text({ label: 'Titre intro chèques 🇬🇧' }),
    giftCardsIntroTitle_de: fields.text({ label: 'Titre intro chèques 🇩🇪' }),
    giftCardsIntroText_fr: fields.text({ label: 'Texte intro chèques 🇫🇷', multiline: true }),
    giftCardsIntroText_en: fields.text({ label: 'Texte intro chèques 🇬🇧', multiline: true }),
    giftCardsIntroText_de: fields.text({ label: 'Texte intro chèques 🇩🇪', multiline: true }),
  },
}),
```

---

## 8. Structure des fichiers à créer

```
src/
├── app/
│   └── boutique/           ← NOUVEAU
│       ├── page.tsx        # Page principale boutique
│       └── succes/         # Page de succès Stripe
│           └── page.tsx
├── app/api/
│   └── boutique/
│       ├── products/route.ts   # GET /api/boutique/products
│       └── checkout/route.ts   # POST /api/boutique/checkout
│   └── admin/
│       └── orders/
│           ├── route.ts        # GET /api/admin/orders
│           └── [id]/route.ts   # PATCH /api/admin/orders/[id]
├── components/
│   └── features/
│       └── Boutique/
│           ├── ProductGrid.tsx    # Grid des produits
│           ├── ProductCard.tsx    # Carte produit
│           ├── OrderForm.tsx      # Formulaire de commande
│           └── OrderStatusBadge.tsx
└── context/
    └── OrderContext.tsx          # Optionnel (state global)
```

### Fichiers à modifier

- `src/components/layout/Navbar.tsx` → Menu boutique devient dropdown
- `src/lib/translations/{fr,en,de}.ts` → Traductions boutique
- `prisma/schema.prisma` → Ajouter modèles Product, ProductOrder, ProductAddress
- `src/app/api/stripe/webhook/route.ts` → Ajouter handler produits

---

## 9. NavigationDropdown - Composant réutilisable

### Code à ajouter dans `Navbar.tsx`

```typescript
type NavItem =
  | { type: 'section'; label: string; section: string }
  | { type: 'link'; label: string; href: string }
  | { type: 'dropdown'; label: string; items: { label: string; href: string }[] }
  | { type: 'cta'; label: string; href: string }
  | { type: 'separator' };

// Dans la déclaration navItems :
{
  type: 'dropdown',
  label: t.nav.boutique,
  items: [
    { label: 'Produits', href: '/boutique' },
    { label: 'Chèques Cadeaux', href: '/cheques-cadeaux' },
  ],
},
```

### Composant Dropdown (à créer)

```typescript
// src/components/layout/NavbarDropdown.tsx
export function NavbarDropdown({
  label,
  items,
}: {
  label: string;
  items: { label: string; href: string }[];
}) {
  const [open, setOpen] = useState(false);
  // ... implementation
}
```

---

## 10. Cycle de vie d'une commande

```
1. Client visite /boutique
   ↓
2. Client clique " Commander" sur un produit
   ↓
3. Remplit formulaire (quantité, livraison)
   ↓
4. Crée ProductOrder (status: PENDING_PAYMENT)
   ↓
5. Crée session Stripe Checkout
   ↓
6. Stripe checkout.session.completed
   ↓
7. ProductOrder.status = CONFIRMED
   ↓
8. Email de confirmation envoyé
   ↓
9. Admin voit la commande dans /admin/commandes
   ↓
10. Admin update statut: PROCESSING → SHIPPED/READY → COMPLETED
```

---

## 11. Priorisation

**Phase 1 (MVP - sans Keystatic) :**

1. DB schema + migration (Product, ProductOrder, ProductAddress)
2. API `/api/boutique/products` + `/api/boutique/checkout`
3. Navbar → dropdown avec deux items
4. Page `/boutique` avec 2-3 produits en dur
5. Page admin `/admin/commandes` (base)

**Phase 2 (Avec Keystatic) :** 6. Keystatic config + contenu 7. Design/UX amélioré 8. Tests

---

## Résumé des points clés

| Élément                 | Status                           |
| ----------------------- | -------------------------------- |
| `/cheques-cadeaux`      | **INchangé** - page existante    |
| `/boutique`             | **NOUVEAU** - page pour produits |
| Menu "Boutique"         | **MODIFIÉ** - devient dropdown   |
| Admin "Chèques Cadeaux" | **INchangé**                     |
| Admin "Commandes"       | **NOUVEAU** - 5ème item          |
| Stripe checkout         | **EXTENDU** - supporte produits  |
