# Plan de conception — Niveau 0

## Travail d’apprentissage

Le parcours s’adresse à un débutant qui doit pouvoir reconnaître le matériel, lire un échiquier, déplacer les pièces et terminer une partie légale sans consulter une règle. L’action principale de chaque leçon est de **jouer le coup demandé sur l’échiquier**, puis de lire l’explication liée à la position obtenue.

## Direction visuelle

La page conserve la grammaire visuelle de Call of Chess : vert échiquier `#173e37` pour la zone de pratique, ivoire `#fffaf0` pour le support pédagogique, fond sable `#f7f0df`, or `#d69024` pour l’action et la progression, et rouge doux `#c96442` uniquement pour une tentative incorrecte. Le contraste texte/fond reste prioritaire ; les états ne reposent jamais sur la couleur seule.

La typographie garde le display serif existant pour les titres de notions et le monospace pour les coordonnées, la notation et les compteurs. Les explications restent courtes, structurées par « À retenir », « Votre coup » et « Réponse de l’adversaire ».

## Structure

Le parcours comprend six leçons :

1. **Le repère des 64 cases** : orientation, coordonnées, files, rangées et diagonales.
2. **Les six pièces** : mouvements du roi, de la dame, de la tour, du fou, du cavalier et du pion.
3. **Prendre, promouvoir et compter** : prise, valeur approximative et promotion.
4. **Le roque et la prise en passant** : les deux règles spéciales qui modifient le déplacement habituel.
5. **Échec, mat, pat et nulles** : reconnaître les fins de partie et le matériel insuffisant.
6. **Une partie légale, du premier coup au mat** : réviser l’enchaînement des règles dans une courte séquence guidée.

Chaque leçon contient une position de départ, de deux à quatre coups jouables par l’apprenant, une réponse légale de l’adversaire, la notation SAN, une explication bilingue et une solution bilingue. Les coups sont rejoués pour restaurer une progression enregistrée.

## Fil de mise en page

```text
[Retour / titre / langue]
[Objectif + progression]
[Échiquier et repères de position] [Explication du coup + feedback]
[Analyse facultative]            [Feuille de coups]
[Trois rappels / notion suivante]
```

Sur mobile, l’échiquier passe avant les panneaux et les contrôles conservent une cible d’au moins 44 px. Le board reste orienté blanc et affiche les coordonnées. Le surlignage montre le départ et l’arrivée uniquement lorsque l’utilisateur demande un indice.

## États prévus

Le chargement de route affiche l’état existant. Une leçon terminée expose un résumé, la notion retenue et le lien vers la suivante. Une tentative incorrecte explique le motif sans inventer la meilleure réponse. Les boutons désactivés indiquent clairement qu’une réponse de l’adversaire est en cours. Les libellés français et anglais restent synchronisés via le contenu bilingue des définitions. Les animations de réponse sont courtes et peuvent être réduites avec `prefers-reduced-motion`.

## Critique

La signature visuelle est l’**échiquier comme support de lecture** : chaque coup demandé est associé à une phrase concrète et à une réponse adverse visible dans la feuille de coups. Le design évite les statistiques décoratives, les badges artificiels et tout texte qui ne servirait pas la compréhension ou la pratique.
