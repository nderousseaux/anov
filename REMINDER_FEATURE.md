# Fonctionnalité de Rappel de Réservation

## Vue d'ensemble

Cette fonctionnalité permet à l'administrateur de configurer un nombre de jours X avant la réservation pour envoyer un rappel automatique par email aux clients.

## Configuration admin

### Paramètre `daysBeforeReminder`

Le nombre de jours avant la réservation pour envoyer un rappel est configuré dans les **Paramètres du Restaurant**.

- **Champ** : `daysBeforeReminder`
- **Type** : Number (entier)
- **Valeur par défaut** : 1 (rappel la veille)
- **Plage** : 0 à 30 jours

### Comment configurer

1. Connectez-vous à l'administration (`/admin`)
2. Allez dans les **Paramètres du Restaurant**
3. Modifiez le champ **Jours avant la réservation pour rappel**
4. Sauvegardez

## Fonctionnement du cron

### Exécution

Le script s'exécute **tous les jours à 17h** (heure locale du serveur).

### Endpoint

```
GET /api/cron/reminders
```

### Sécurité

L'endpoint est protégé par un secret (`CRON_SECRET` dans les variables d'environnement).

### Logique de rappel

Pour chaque réservation, les conditions suivantes sont vérifiées :

1. **Status** : `CONFIRMED` (pas `CANCELLED`, `EXPIRED`, etc.)
2. **Date** : La réservation est pour `J + daysBeforeReminder` (par défaut, demain)
3. **Rappel déjà envoyé** : `reminderEmailSent = false`
4. **Réservation le même jour** : Si la réservation a été créée le même jour (avant le dernier 17h), aucun rappel n'est envoyé

### Exceptions

- Si la réservation est **annulée** ou **expirée** : pas de rappel
- Si la réservation a été créée **le même jour avant 17h** : pas de rappel (l'utilisateur est déjà informé)

## Format du mail de rappel

Le mail de rappel contient les mêmes informations que le mail de confirmation :

- Date et heure de la réservation
- Nom du client
- Nombre de couverts
- Instructions pour annuler/modifier

**Message supplémentaire dans le mail de rappel :**
- Pour 1 jour avant : "Votre réservation est prévue demain."
- Pour plusieurs jours avant : "Votre réservation est prévue dans X jours."

## Scripts de test

### Script de rappel

```bash
pnpm tsx src/scripts/send-reminders.ts
```

### Script de création de réservation de test

```bash
pnpm tsx src/scripts/create-test-reservation.ts
```

## Configuration Vercel Cron

Pour exécuter automatiquement le script tous les jours à 17h sur Vercel, configurez un cron job dans `vercel.json` :

```json
{
  "vercel": {
    "cron": {
      "reminders": {
        "path": "/api/cron/reminders",
        "schedule": "0 17 * * *"
      }
    }
  }
}
```

Ou utilisez la variable d'environnement `CRON_SECRET` pour sécuriser l'appel.

## Base de données

### Modèle Reservation

Le modèle `Reservation` dispose des champs suivants pour les rappels :

- `reminderEmailSent` (Boolean) : indique si le rappel email a été envoyé
- `reminderSmsSent` (Boolean) : indique si le rappel SMS a été envoyé

### Modèle RestaurantSettings

- `daysBeforeReminder` (Integer) : nombre de jours avant pour envoyer le rappel
