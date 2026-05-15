# ANOV - Workflow Application + DB

Ce document decrit:

- comment developper au quotidien
- comment gerer un changement de structure de base de donnees
- comment gerer le cycle de vie complet de l'application (code + DB + deploiement)

## 1) Environnements

- `local`: machine locale + Postgres Docker jetable
- `development`: branche Git `dev` -> Vercel preview (dev) + Neon `dev`
- `preview`: branche Git `preview` -> Vercel preview client + Neon `preview` (miroir de prod)
- `production`: branche Git `main` -> Vercel prod + Neon `main`

## 2) Developper au quotidien

Commande principale (auto):

```bash
npm run serve
```

Equivalent pnpm:

```bash
pnpm serve
```

Ce que fait `serve` automatiquement:

1. demarre la DB Docker locale (`db:docker:up`)
2. applique le schema local (`db push`)
3. lance le seed local (`prisma/seed.ts`)
4. demarre Next.js en mode dev

Commandes utiles:

```bash
pnpm db:docker:reset         # reset complet DB locale (efface les donnees)
pnpm db:migrate:status:local # verifie l'etat des migrations
pnpm db:studio:local         # ouvre Prisma Studio
```

## 3) Changer la structure de la base

Quand le schema Prisma change:

1. modifier `prisma/schema.prisma`
2. generer/appliquer la migration en local:

```bash
pnpm db:migrate:dev:local
```

3. verifier que l'application fonctionne localement (`npm run serve`)
4. committer le code + les fichiers de migration Prisma
5. pousser sur la branche cible (`dev`, puis `preview`, puis `main`)

Regle importante:

- `db push` est pratique en local pour iterer vite
- les environnements partages (`development`, `preview`, `production`) utilisent `migrate deploy`

## 4) Cycle de vie complet de l'application

### Flux recommande

1. Developpement fonctionnel + schema sur branche `dev`
2. Validation integration sur branche `preview`
3. Mise en production sur branche `main`

### Ce qui est automatise au deploiement Vercel

Un hook `prebuild` execute automatiquement `scripts/vercel-auto-db.mjs`.

- En `development` (branche `dev`, Vercel preview):
1. migration auto (`db:prepare:development`)
2. seed auto (`db:seed:development`)

- En `preview` (branche `preview`, Vercel preview):
1. copie auto prod -> preview via `PREVIEW_DB_COPY_COMMAND`
2. migration auto (`db:prepare:preview`)

- En `production` (branche `main`, Vercel prod):
1. migration auto (`db:prepare:prod`)
2. garde-fou leve uniquement pendant ce step (`ALLOW_PROD_DB_WRITE=true`)

## 5) Variables attendues pour l'automatisation

Variables standard Vercel (fournies par Vercel):

- `VERCEL=1`
- `VERCEL_ENV` (`preview` ou `production`)
- `VERCEL_GIT_COMMIT_REF` (nom de branche)

Variable a configurer dans Vercel pour la branche `preview`:

- `PREVIEW_DB_COPY_COMMAND`: commande shell qui execute la copie Neon `main` -> `preview`

Exemple (placeholder a adapter a votre mecanisme Neon):

```bash
PREVIEW_DB_COPY_COMMAND="node scripts/neon-copy-main-to-preview.mjs"
```

Si `PREVIEW_DB_COPY_COMMAND` est absente sur la branche `preview`, le build echoue volontairement pour eviter un etat non maitrise.

## 6) Reference commandes DB

```bash
pnpm db:docker:up
pnpm db:docker:down
pnpm db:docker:reset

pnpm db:migrate:dev:local
pnpm db:migrate:status:local
pnpm db:migrate:status:development
pnpm db:migrate:status:preview
pnpm db:migrate:status:prod

pnpm db:prepare:development
pnpm db:prepare:preview
pnpm db:prepare:prod

pnpm db:seed:local
pnpm db:seed:development
```

## 7) Resolution des fichiers env

- `local` -> `.env.local`
- `development` -> `.env.development.local` (sinon `.env.local`)
- `preview` -> `.env.preview.local`
- `production` -> `.env.production.local`
