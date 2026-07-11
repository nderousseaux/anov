Ajoute une nouvelle fonctionnalité : "boutique"

Dans le menu coté utilisateur : on remplace l'item cheques cadeaux par "boutique" -> avec deux sous-item -> produit et cheque cadeau



Un produit :

- Titre
- Image(s)
- Description
- Prix
- Commande maximum
- Est-livrable



## Sur la page produit, coté utilisateur

On a un magasin d'objet.

L'utilisateur peut voir quelques photos des objets, en acheter (en passant par stripe). Décider si ils se font livrer ou si ils vont le chercher au restaurant (pour les produit livrable).

Si c'est livrable, ils renseignent leur adresse avant de passer par stripe.

Quand l'utilisateur paye, il recoit un mail de confirmation

## Coté admin

- Les produits sont configurable dans keystatic
- On ajoute un cinquième item coté admin : "commandes" :

- Liste de toutes les commandes , avec toutes les infos pertinentes
  - et la possibilité de les trier

Cycle de vie d'une commande

- commandé : l'utilisateur à payé et à recu un mail de confirmation.
  - L'admin peut le faire passer à "envoyé" (ou "pret" si le client vient le chercher sur place)
  - quand il passe à envoyé ou pret -> mail au client
- envoyé ou pret
-  finalisé
  - L'admin peut passer à finalisé après le envoyé ou pret manuellement
    - (quand le client l'a recu ou recupéré)
  - Pas de mail dans ce cas là

à tout moment -> même envoyé, même finalisé etc... on peut faire un remboursment  (mail envoyé)



## Coté stripe

- faire comme bons cadeau et reservation
  - "pending payement" -> puis disparait si 15 minutes sans payement finalisé
