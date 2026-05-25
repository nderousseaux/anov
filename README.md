# ANOV

## Développement

```bash
cp .env.example .env.local
pnpm install
```
Démarrage :
```bash
npm run db:start   # démarre le container PostgreSQL
npm run db:init    # applique les migrations et le seed
npm run dev        # démarre le serveur Next.js (http://localhost:3000)
```

### Commandes de gestion de la base de données

| Commande | Description |
|---|---|
| `npm run db:start` | Démarre le container Docker PostgreSQL |
| `npm run db:migrate` | Crée et applique les nouvelles migrations |
| `npm run db:init` | Migrations + seed (premier lancement) |
| `npm run db:reset` | Supprime tout, réapplique les migrations et le seed |
