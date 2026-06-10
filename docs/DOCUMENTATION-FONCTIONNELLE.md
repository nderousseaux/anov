# Documentation Fonctionnelle — ANØV

> **Public :** restaurateur / responsable du restaurant
> **Objectif :** savoir comment gérer et mettre à jour le contenu du site web

---

## 1. Vue d'ensemble

Le site du restaurant est géré entièrement depuis le **CMS intégré** (Content Management System). Vous n'avez besoin d'aucune compétence technique pour modifier le contenu.

**Accès :** connectez-vous sur le site, puis rendez-vous sur `/admin/cms`.

---

## 2. Connexion à l'administration

1. Ouvrez le site du restaurant
2. Rendez-vous sur `/admin/login`
3. Saisissez votre identifiant et mot de passe
4. Vous accédez au tableau de bord administrateur

*[Capture d'écran : page de connexion admin]*

---

## 3. Modifier le contenu du site

Le contenu du site se gère depuis le CMS. Voici la correspondance entre les sections du site et les sections du CMS :

| Section du site | Section CMS | Contenu |
|---|---|---|
| **Page d'accueil** | | |
| Section haute | Hero | Image de fond + sous-titre |
| Notre histoire | Notre Histoire | 8 sections avec textes et images |
| Galerie photos | Galerie | Photos + légendes |
| Contact | Contact | Coordonnées, horaires, carte |
| **Navigation** | | |
| Menu en bas | Footer | Description + réseaux sociaux + avis |
| **Autre page** | | |
| Carte du restaurant | Menu | Onglets, catégories, plats |
| **Pages légales** | | |
| Mentions légales | Mentions légales | Contenu riche (titres, textes, liens) |
| Politique de confidentialité | Politique de confidentialité | Contenu riche (titres, textes, liens) |
| CGV | CGV | Contenu riche (titres, textes, liens) |

![Capture d'écran : accès au CMS depuis /admin/cms](public/assets/docs/cms-interface.png)

### Comment modifier un élément

1. Connectez-vous sur `/admin/login`
2. Accédez au CMS sur `/admin/cms`
3. Cliquez sur la section à modifier dans le menu de gauche
4. Modifiez le contenu (texte, images, etc.)
5. Cliquez sur **Save** (en haut à droite)
6. Cliquez sur **Commit** pour publier les modifications

![Capture d'écran : interface d'édition avec boutons Save et Commit](public/assets/docs/cms-edit.png)

### Gestion des origines

La section **Nos Origines** affiche une carte géographique avec des points placés sur les villes de fournisseurs (Besançon, Brest, Lyon, etc.). Le contenu est géré depuis `/admin/cms` → section **Origines** :

- **Points** : liste des fournisseurs avec coordonnées GPS (latitude/longitude)
- **Besançon** : centre de la carte, point d'origine des rayons

Chaque point peut avoir :
- Titre (fr/en/de)
- Description (fr/en/de)
- Image
- Lien "En savoir plus"

Les rayons partent de chaque ville vers Besançon pour symboliser le lien entre les fournisseurs et le restaurant.

### Ajouter des éléments

Pour ajouter une photo dans la galerie ou un plat dans le menu :

1. Ouvrez la section concernée (Galerie ou Menu)
2. Cliquez sur **Add item**
3. Remplissez les champs
4. **Save** puis **Commit**

![Capture d'écran : ajout d'un élément avec le bouton Add item](public/assets/docs/cms-add-item.png)

### Valider les modifications

Après avoir cliqué sur **Commit**, les modifications sont publiées et visibles au bout de quelques minutes sur le site.

---

## 6. Accéder à la boîte mail (IONOS)

Le site utilise une adresse e-mail hébergée chez **IONOS** pour recevoir les messages du formulaire de contact et les confirmations de réservation.

### Se connecter au webmail IONOS

1. Rendez-vous sur **[https://webmail.ionos.fr](https://webmail.ionos.fr)**
2. Saisissez votre adresse e-mail complète (ex. `contact@votre-restaurant.fr`)
3. Saisissez votre mot de passe
4. Cliquez sur **Se connecter**

![Capture d'écran : page de connexion webmail IONOS](public/assets/docs/ionos-login.png)

Vous accédez ensuite à votre boîte de réception IONOS, où vous retrouvez tous les e-mails envoyés depuis le site.

![Capture d'écran : boîte de réception webmail IONOS](public/assets/docs/ionos-inbox.png)

### Lien direct

> **Webmail IONOS :** [https://webmail.ionos.fr](https://webmail.ionos.fr)

### En cas de problème de connexion

- Vérifiez que l'adresse e-mail saisie est correcte (avec le bon domaine)
- Utilisez la fonction **Mot de passe oublié** sur la page de connexion IONOS
- Ou contactez le support IONOS : [https://www.ionos.fr/assistance](https://www.ionos.fr/assistance)

---

## 7. Contact technique

Pour toute question ou modification qui dépasse le CMS (configuration, technique), contactez votre développeur.

*[Nom du développeur / Email / Téléphone]*
