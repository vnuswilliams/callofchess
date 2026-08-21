# Vérification production avant la refonte du chapitre 0

- Domaine vérifié : `https://callofchess.online/lesson/f3a1c235-5531-4c1c-845b-6d684808259b`
- La route directe répond et la SPA charge sans 404.
- La version actuellement servie est l’ancienne leçon interactive « Le repère des 64 cases », avec un échiquier et la mission « Avancez le pion e de deux cases. ».
- Le titre de page est « Le repère des 64 cases — Call of Chess ».
- Le contenu de la refonte théorique n’est pas encore visible en production à ce stade ; il reste à publier puis à contrôler à nouveau.
- Le connecteur Vercel a retourné une liste de projets vide dans l’équipe accessible, donc le statut de production sera vérifié par la route publique et le contenu effectivement servi, conformément aux constats historiques du dépôt.


## Vérification locale du rendu

La route locale `/lesson/f3a1c235-5531-4c1c-845b-6d684808259b` charge la nouvelle leçon « Le matériel et le classement Elo — Call of Chess ». Le rendu ne contient plus d’échiquier d’exercice : il présente cinq cartes de théorie couvrant les 64 cases, les coordonnées, les six pièces, les valeurs approximatives, la sécurité du roi et Elo, avec le bouton « J’ai compris, continuer ». Le premier chargement sans variables `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` a correctement affiché l’erreur de configuration prévue ; le contrôle a ensuite été relancé avec ces variables injectées dans le processus local.


## Vérification locale de l’exercice des pièces

La route locale `/lesson/0ce3ec0e-348e-4300-b88a-c4a939cd8960` affiche « Déplacer les pièces » avec une position dédiée au roi en e4 et une mission vers d5. La page conserve l’échiquier interactif, la feuille de coups, l’indice et les repères de progression. Le premier exercice est lisible sur desktop et la structure reste compatible avec l’empilement mobile prévu par le layout existant.


## Vérification locale des coups spéciaux et nulles

La route locale de la leçon 05 (`/lesson/358114a7-8876-588e-bd0d-3fbcbfeecb14`) charge bien le module dédié « Coups spéciaux et parties nulles ». Le premier écran présente la mission de roque court, la position légale avec deux tours et les trois étapes spéciales annoncées. Le contenu explique également que la suite permettra d’explorer le pat, la répétition, la règle des 50 coups et le matériel insuffisant. La route voisine de la leçon 04 charge correctement l’exercice séparé d’échec et mat.


## Vérification locale de la partie finale

La route locale `/lesson/bc8a719d-d4e6-5d3e-90c1-58292c6fe8f4` charge la partie complète avec le statut « À vous de jouer », l’étiquette « Adversaire débutant », l’indice facultatif, le bouton de rejouer et la feuille de coups vide. Le plateau est correctement orienté pour les Blancs et le contrôle reste lisible sur desktop. La validation de progression n’est pas présentée comme acquise avant une victoire réelle.


## Test local de sélection par clic

Sur la leçon 02 locale, le clic sur la pièce en e4 puis le clic sur la case d5 ont été acceptés. La progression est passée de `1 / 6` à `2 / 6`, la feuille affiche `1. Rd5` et la mission suivante est apparue. Cela confirme le parcours tactile/souris distinct du glisser-déposer pour une étape de déplacement.


## Contrôle après publication du merge

Le commit `d1872b19e2205faf11f70e8737425da6fbad983c` est confirmé sur `origin/main` et via l’API GitHub avec l’identité `Payong Venus <payongvenus@gmail.com>`. Le domaine `https://callofchess.online/lesson/f3a1c235-5531-4c1c-845b-6d684808259b` répond toujours sans 404, mais son contenu reste l’ancienne leçon interactive « Le repère des 64 cases » avec échiquier et mission `e2–e4`. La nouvelle version locale est validée, tandis que la propagation ou le raccordement Vercel n’est pas encore visible sur le domaine canonique.


## Contrôle anti-cache

La route production avec `?v=d1872b1` ne révèle pas le nouveau bundle : le premier chargement reste ancien et la variante versionnée affiche ensuite une page blanche sans élément détecté. Cela confirme que la publication effective sur `callofchess.online` n’est pas validée et que l’invalidation/propagation Vercel doit être traitée séparément du push GitHub.


## Identification du projet Vercel

L’URL de projet supposée `https://vercel.com/vnuswilliams/callofchess` renvoie 404 car l’équipe utilise le slug `vnuswilliams1`. Le tableau d’équipe `https://vercel.com/vnuswilliams1` affiche bien le projet `callofchess`, le domaine `callofchess.online`, le dépôt `vnuswilliams/callofchess` et le dernier déploiement visible `Document smart lesson redirect production`, daté d’environ une heure. Le connecteur Vercel utilisé en lecture avait donc interrogé le mauvais périmètre ou ne remontait pas ce projet malgré son existence dans l’interface web.


## Correction du build Vercel

Le premier déploiement du merge `d1872b1` a été créé en Production mais a échoué avec une erreur Rollup : `TheoryLesson.tsx` importait `getLessonCompletionDestination`, supprimé par la redirection intelligente distante. Le module de transition exporte désormais `getFirstIncompleteLessonDestination` ; la vue théorique a été adaptée pour interroger les progressions authentifiées, mémoriser la leçon 01 complétée et rediriger vers la première leçon incomplète.

Le correctif local passe `pnpm check`, `pnpm build` et les 42 tests Vitest. Le commit `60b1a6b9acd1ac508a4ced1d5e71e1bd9bf2d194` a été poussé sur `origin/main` avec `Payong Venus <payongvenus@gmail.com>`. Le déploiement Vercel de ce commit reste à vérifier.


## Déploiement correctif détecté

Le tableau de bord Vercel du vrai projet `https://vercel.com/vnuswilliams1/callofchess` affiche maintenant le commit `60b1a6b Corriger la transition de la leçon théorique`, créé « Just now » sur `main`, avec les domaines `callofchess.online` et `callofchess.vercel.app`. Le contrôle suivant a été ouvert sur `about:blank` par le navigateur et ne permet pas encore de lire le statut final ; la route canonique doit être rechargée directement après la fin de la construction.


## État de production après le second déploiement

Après détection du commit `60b1a6b`, la route `https://callofchess.online/lesson/f3a1c235-5531-4c1c-845b-6d684808259b` affiche une page blanche sans éléments détectés. La console navigateur ne renvoie aucun message exploitable. Le build local est vert, mais la production n’est donc pas encore validée comme fonctionnelle ; il faut inspecter l’aperçu Vercel et son état final avant de conclure.


## Déploiement Ready et comparaison de domaine

Le projet Vercel affiche le déploiement `7UpZSiTj29WJTFwDRJ9kXrYQ2bjR` en statut **Ready**, créé à partir du commit `60b1a6b` sur `main`, avec `callofchess.online` comme domaine associé. L’URL de déploiement `https://callofchess-opbvh81ic-vnuswilliams1.vercel.app/lesson/f3a1c235-5531-4c1c-845b-6d684808259b` sert bien la nouvelle page théorique complète, sans échiquier, avec matériel, six pièces, valeurs et Elo. Le domaine custom `callofchess.online` affichait encore une page blanche au même moment ; la publication du bundle est donc validée sur le déploiement Ready mais le rattachement/propagation du domaine custom reste à confirmer.


## Validation finale du domaine custom

Après propagation, `https://callofchess.online/lesson/f3a1c235-5531-4c1c-845b-6d684808259b?deploy=60b1a6b` sert correctement le nouveau chapitre 0. La page affiche « Le matériel et le classement Elo », cinq cartes théoriques, les 64 cases, coordonnées, colonnes/rangées/diagonales, les six pièces, valeurs `1 · 3 · 5 · 9`, sécurité du roi et principe Elo, sans échiquier d’exercice. Le bouton « J’ai compris, continuer » est présent. La version est donc visible sur le domaine custom demandé ; le paramètre de requête a servi à forcer la vérification après propagation CDN.


## Validation production sans cache-buster

Le tableau Vercel affiche maintenant le déploiement `73NXshxfhFV6cetQVy17iT1BUQft` en **Ready**, construit à partir du commit `e72c1bb Documenter la publication du chapitre 0`, sur `main`, avec `callofchess.online` associé. La route propre `https://callofchess.online/lesson/f3a1c235-5531-4c1c-845b-6d684808259b` sert désormais la page théorique complète sans paramètre : titre « Le matériel et le classement Elo », cartes du matériel et bouton « J’ai compris, continuer ». La production sur le domaine demandé est donc vérifiée.
