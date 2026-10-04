# Environnements

Trois environnements sont utilisés pour le développement et la production de l'application :

## Dev (développement local)
- Code source sur la machine locale.
- Executé avec `npm run dev`.
- Base de données PostgreSQL locale (container Docker).
- Stripe en mode sandbox, capturé avec un hook local.
- Mails capturés par Mailcatcher (container Docker).
- APP_ENV=dev

Les commandes pour le développement explicitées dans le [README](../README.md).
