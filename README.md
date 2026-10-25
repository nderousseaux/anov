# ANØV — Restaurant

Site de l'anov restaurant, avec des fonctionnalités backend de gestion du restaurant :

- Site vitrine pour présenter le restaurant.
- CMS intégré pour gérer le contenu (textes, images, horaires, etc.).

Le site est développé avec Next.js, hébergé sur Vercel, et utilise Keystatic comme CMS intégré.

## Développement local

```bash
$ pnpm install
$ cp .env.example .env.local
$ pnpm dev

# Le hook stripe doit être simulé
$ stripe listen --forward-to localhost:3000/api/stripe/webhook

# Lancement de la base de données et de Mailcatcher
$ docker compose up -d
``

### Base de données

```bash
$ pnpm prisma migrate dev
$ pnpm prisma db seed # Optionnel, pour les données de test
```

> En cas de problème avec la base de données, il est possible de la réinitialiser avec la commande suivante :
```bash
$ pnpm prisma migrate reset
```

## Environnements

Les détails sur les environnements de développement et de production sont disponibles dans le fichier [docs/ENVIRONMENTS.md](docs/ENVIRONMENTS.md).
Les branches `main` et `staging` sont déployées automatiquement sur Vercel, pour les environnements de production et de staging respectivement.
