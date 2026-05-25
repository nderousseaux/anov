# Workflow Git / Vercel / Neon

## Environnements

| Branche Git | Vercel | DB | Usage |
|---|---|---|---|
| `main` | Production — `myapp.com` | Neon `main` | Production, jamais de push direct |
| `pprod` | Preview fixe — `pprod.myapp.vercel.app` | Neon `pprod` — refresh depuis `main` à chaque push | Validation client |
| `sandbox` | Preview fixe — `sandbox.myapp.vercel.app` | Neon `sandbox` | Dev déployé, tests perso |
| `feat/*` | Preview éphémère | Neon branche auto éphémère | Feature isolée, supprimée au merge |
| `dev` | — | Postgres locale | Dev local uniquement |

---

## Règles fondamentales

- `main` ne reçoit que des merges depuis `pprod`, jamais de push direct
- `dev` n'est jamais déployée sur Vercel
- Les **données de référence** (rôles, config, pays…) vivent dans des migrations, pas dans le seed
- Le **seed** est réservé aux données de test — il est idempotent (vérifie avant d'insérer)
- `migrate deploy` est idempotent — il peut toujours tourner au build sans risque
- `migrate dev` tourne uniquement en local sur la branche `dev`
- Le refresh de `pprod` depuis `main` se fait à chaque push (reset complet)

---

## Flux d'une feature

```
dev (local)
   │
   └──► feat/xxx  ──PR──►  pprod  ──PR──►  main
              │                │                │
         Neon auto         Neon pprod       Neon main
         éphémère          refresh prod     production
```

---

## Structure des fichiers

```
.env.local          # dev local — pointe vers Postgres locale
.env.sandbox        # optionnel — pour seeder sandbox manuellement
vercel.json         # build command
scripts/
  vercel-build.js   # logique de build conditionnelle
prisma/
  schema.prisma
  seed.ts
  migrations/
```

---

## `.env.local`

```bash
# Postgres locale — jamais de Neon ici
DATABASE_URL="postgresql://postgres:password@localhost:5432/myapp"
```

---

## `scripts/vercel-build.js`

```js
const { execSync } = require('child_process')

const branch = process.env.VERCEL_GIT_COMMIT_REF
const env = process.env.VERCEL_ENV // "production" | "preview"

function run(cmd) {
  execSync(cmd, { stdio: 'inherit' })
}

// migrate deploy doit utiliser l'URL directe (pas le pooler PgBouncer)
process.env.DATABASE_URL = process.env.DATABASE_URL_UNPOOLED

// pprod : reset depuis main puis migrate
if (branch === 'pprod') {
  run('neon branches delete pprod --project-id $NEON_PROJECT_ID --force || true')
  run('neon branches create --name pprod --parent main --project-id $NEON_PROJECT_ID')
  run('prisma migrate deploy')

// tous les autres environnements déployés : migrate uniquement
} else {
  run('prisma migrate deploy')
}

run('next build')
```

---

## `vercel.json`

```json
{
  "buildCommand": "node scripts/vercel-build.js"
}
```

---

## `package.json` — scripts

```json
{
  "scripts": {
    "dev": "next dev",

    "db:migrate": "prisma migrate dev",
    "db:migrate:deploy": "prisma migrate deploy",
    "db:seed": "prisma db seed",
    "db:studio": "prisma studio",
    "db:reset": "prisma migrate reset --force",

    "db:seed:sandbox": "dotenv -e .env.sandbox -- prisma db seed",

    "neon:refresh:pprod": "neon branches delete pprod --project-id $NEON_PROJECT_ID --force || true && neon branches create --name pprod --parent main --project-id $NEON_PROJECT_ID",
    "neon:refresh:sandbox": "neon branches delete sandbox --project-id $NEON_PROJECT_ID --force || true && neon branches create --name sandbox --parent main --project-id $NEON_PROJECT_ID",

    "vercel-build": "node scripts/vercel-build.js"
  },
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

---

## Variables d'environnement Vercel

Dans **Settings → Environment Variables** :

| Variable | Production | Preview | Notes |
|---|---|---|---|
| `DATABASE_URL` | URL Neon `main` (pooled) | injectée dynamiquement par Neon | Ne pas définir manuellement pour Preview si l'intégration Neon est active |
| `DATABASE_URL_UNPOOLED` | URL Neon `main` (direct) | idem | Obligatoire pour `migrate deploy` — incompatible avec PgBouncer |
| `NEON_PROJECT_ID` | ID du projet Neon | idem | Récupéré dans la console Neon |

---

## Seed idempotent — exemple

```ts
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // données de référence — upsert
  await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin', label: 'Administrateur' },
  })

  // données de test — vérifie avant d'insérer
  const existing = await prisma.user.findFirst({ where: { email: 'test@test.com' } })
  if (!existing) {
    await prisma.user.create({
      data: { email: 'test@test.com', name: 'Test User', roleId: 'admin' },
    })
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

---

## Setup initial (une seule fois)

```bash
# 1. Installer la CLI Neon
npm install neon

# 2. S'authentifier
neon auth

# 3. Créer les branches fixes pprod et sandbox depuis main
npm run neon:refresh:pprod
npm run neon:refresh:sandbox

# 4. Configurer le .env.local avec Postgres locale
DATABASE_URL="postgresql://postgres:password@localhost:5432/myapp"

# 5. Créer la DB locale et appliquer les migrations
createdb myapp
npm run db:migrate
```

---

## Commandes du quotidien

```bash
# Nouvelle migration en local (branche dev)
npm run db:migrate

# Seeder sandbox manuellement
npm run db:seed:sandbox

# Rafraîchir pprod depuis prod manuellement (hors push)
npm run neon:refresh:pprod

# Rafraîchir sandbox depuis prod
npm run neon:refresh:sandbox

# Inspecter la DB locale
npm run db:studio
```
