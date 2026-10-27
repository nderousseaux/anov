# Environnements

Trois environnements sont utilisés pour le développement et la production de l'application :

## Dev (développement local)
- Code source sur la machine locale.
- Executé avec `pnpm run dev`.
- Base de données PostgreSQL locale (container Docker).
- Stripe en mode sandbox, capturé avec un hook local.
- Mails capturés par Mailcatcher (container Docker).
- NEXT_PUBLIC_APP_ENV=development
- Toutes les branches autres que `main` et `staging`.

Les commandes pour le développement explicitées dans le [README](../README.md).

## Staging (pré-production)
- Code source sur la branche `staging`.
- Executé sur un serveur de pré-production, avec `pnpm run build`.
<!-- - Avec les variables d'environnement définies dans vercel. -->
<!-- - Base de données PostgreSQL sur le serveur de pré-production, copiée depuis la base de production.
- Stripe en mode sandbox, capturé avec un hook sur le serveur de pré-production.
- Mails capturés par Mailpit, service hébergé sur un serveur perso.
- NEXT_PUBLIC_APP_ENV=staging -->
