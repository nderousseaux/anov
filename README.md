# ANØV — Restaurant

Site de l'anov restaurant, avec des fonctionnalités backend de gestion du restaurant :

- Site vitrine pour présenter le restaurant.
- CMS intégré pour gérer le contenu (textes, images, horaires, etc.).

Le site est développé avec Next.js, hébergé sur Vercel, et utilise Keystatic comme CMS intégré.

## Développement local

```bash
git clone <url> && cd anov
pnpm install
cp .env.example .env.local
pnpm dev
```

## Déploiement

Push sur `pprod` → preview Vercel → merge `pprod` → `main` → build auto.

Les images du CMS sont stockées dans le repository GitHub (`public/assets/`).

## Pages

| Route                       | Description                                       |
| --------------------------- | ------------------------------------------------- |
| `/`                         | Page d'accueil (Hero, Histoire, Galerie, Contact) |
| `/menu`                     | Carte du restaurant                               |
| `/admin`                    | Racine du dashboard admin                         |
| `/admin/cms` (`/keystatic`) | Éditeur CMS intégré                               |

## Architecture

```
content/              # Fichiers YAML du CMS (source de vérité)
keystatic.config.ts   # Configuration du CMS (schémas)
public/assets/        # Images statiques
src/
  app/
    layout.tsx        # Layout racine (fetch CMS + ClientLayout)
    page.tsx          # Page d'accueil
    menu/page.tsx     # Page carte
    admin/            # Dashboard admin (CMS + login)
    keystatic/        # Interface Keystatic
    api/              # Routes API
  components/         # Composants React
  lib/                # Utilitaires (auth, prisma...)
  middleware.ts       # Protection routes /admin et /keystatic
```
