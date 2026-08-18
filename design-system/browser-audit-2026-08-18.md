# Audit navigateur — 18 août 2026

## Production observée

- `https://www.callofchess.online/` charge la landing page publiquement.
- La landing page contient les routes `/path`, `/account`, `/lesson/1`, `/lesson/2`, `/lesson/3`, ainsi que les ancres `#methode` et `#puzzle`.
- Le bouton de thème est visible et le site peut basculer entre clair et sombre.
- `/profile` en production affiche encore l’ancien header `← Retour au compte` et ne propose pas de navigation principale ; il expose donc bien la boucle signalée.

## Corrections locales déjà vérifiées

- Le profil local affiche `Call of Chess`, `Parcours`, `Classement` et `Gérer le compte` dans une vraie navigation.
- Le build local et TypeScript passent après les corrections globales de thème.
- Les nouveaux overrides couvrent les shells de pages, les cartes, les panneaux de leçon, les CTA primaires, les contrastes dark/light et les arrondis.

## Vérification locale complémentaire

La page Parcours locale a révélé un texte de jalon trop sombre sur les cartes vertes ; un override dark dédié a été ajouté pour les couleurs explicites de type `#3c4c43`, `#8d846f` et `#987019`.

La page Compte locale a révélé que le panneau de formulaire devenait blanc en mode sombre à cause d’un override trop large de `bg-[#173e37]`. Cet override a été corrigé pour conserver un panneau vert profond et un texte clair.

## Vérification multi-pages locale

La Leçon 1 rend correctement l’échiquier, les coordonnées `a–h · 1–8`, les panneaux de mission, conseil, analyse et feuille de partie. Le thème sombre conserve une zone board sombre distincte et des panneaux de contenu lisibles.

Le Classement rend correctement son état de chargement et son état vide/indisponible sans inventer de données. Les cartes et le panneau de confidentialité utilisent les surfaces sombres cohérentes du shell.

## Profil et Compte

Le Profil local présente désormais une navigation directe vers l’accueil, le parcours, le classement et la gestion du compte. La destination `/account` est distincte et ne renvoie plus automatiquement vers `/profile` pour un utilisateur connecté.

Le Compte local est lisible en mode sombre : les deux panneaux sont vert profond, les champs ont une surface intermédiaire contrastée et l’action principale saffran reste visible. Le fond du panneau est désormais piloté par `--coc-account-panel`, ce qui évite le conflit entre les classes utilitaires et le thème.
