# Niveau 3 — Calculer les variantes

**Auteur : Manus AI**  
**Produit : Call of Chess**  
**Statut : conception avant implémentation**

## Intention pédagogique

Le Niveau 3 s’adresse à un apprenant qui reconnaît déjà les motifs tactiques élémentaires et doit maintenant remplacer le réflexe de deviner par une procédure de calcul. L’action principale de chaque écran est donc de **formuler une hypothèse, vérifier la réponse adverse et conserver la position future**. L’échiquier reste disponible comme repère, mais plusieurs exercices demandent explicitement de choisir une variante sans déplacer les pièces, afin de distinguer visualisation mentale et manipulation.

La méthode enseignée suit une boucle stable : observer la position, lister les coups candidats, examiner les échecs, les prises puis les menaces, calculer la réponse la plus forte de l’adversaire, rechercher la meilleure continuation, évaluer la position finale et comparer les variantes. La séquence CCT est présentée comme un ordre de recherche utile, non comme une règle qui rend automatiquement un coup meilleur. Cette prudence est cohérente avec l’analyse de Horváth, qui souligne que la reconnaissance des coups forcing devient une compétence automatisée par l’entraînement et non par la mémorisation d’un slogan [1], ainsi qu’avec le guide de calcul de ChessWorld, qui recommande deux ou trois candidats, une branche forcing claire et un arrêt lorsqu’une position peut être évaluée [2].

## Parcours proposé

| Leçon | Compétence observable | Exercice principal | Critère de réussite |
| --- | --- | --- | --- |
| 13 · La méthode de calcul | Appliquer la boucle complète sans sauter l’étape adverse. | Ordonner les étapes d’une réflexion et identifier la question de sécurité. | Les étapes sont dans l’ordre et la meilleure réponse adverse est nommée. |
| 14 · Les coups candidats | Réduire la recherche à deux ou trois coups plausibles. | Choisir le candidat forcing dans plusieurs positions. | Le candidat est sélectionné pour une raison concrète, pas pour son apparence. |
| 15 · Échecs, prises, menaces | Parcourir CCT sans calculer au hasard. | Classer et comparer les coups forcing. | L’apprenant vérifie l’échec, la prise, puis la menace, avec la réponse adverse. |
| 16 · La meilleure continuation | Répondre à la meilleure défense et poursuivre la ligne. | Choisir le deuxième coup après une réponse noire imposée. | La continuation conserve l’avantage ou réalise la menace sans omission. |
| 17 · Comparer les variantes | Évaluer deux lignes après leur point d’arrêt. | Comparer une ligne forcing et une ligne superficielle. | L’apprenant justifie son choix par roi, matériel, activité et menaces. |
| 18 · Visualiser un à trois coups | Maintenir une position future sans déplacer les pièces. | Donner la case finale ou la pièce arrivée après une petite variante. | La position mentale reste cohérente après un, deux puis trois demi-coups. |
| 19 · Visualiser cinq coups et reconstruire | Calculer une séquence tactique courte en profondeur. | Reconstituer la position finale et choisir la suite. | La ligne complète est retenue sans perdre une pièce ni inverser le trait.

Les leçons 13 à 17 correspondent au chapitre 8 « La méthode de calcul ». Les leçons 18 et 19 correspondent au chapitre 9 « Visualisation ». Le catalogue local et Supabase conserveront sept exercices publiés, afin que le Niveau 3 ne reste pas dans l’état dangereux d’un niveau partiellement mappé qui ne pourrait jamais atteindre 100 % de progression.

## Modèle d’exercice

Le code ajoutera un mode `calculation` séparé du mode guidé. Un exercice de calcul aura une position FEN, une consigne bilingue, un type d’action, une liste de réponses, une réponse correcte, une explication et un indice progressif. Les types nécessaires sont `order`, `choice`, `line`, `compare` et `visualize`. La logique pure calculera l’état de réponse, la progression et la rétroaction ; le composant React ne fera que rendre l’état et transmettre l’action de l’apprenant.

Chaque réponse incorrecte sera diagnostiquée selon l’étape manquée. Les messages distingueront le candidat non forcing, l’oubli de la réponse adverse, l’arrêt trop tôt, l’évaluation sans preuve et la mauvaise reconstitution de position. Le bouton d’indice révélera d’abord la catégorie de recherche, puis la question adverse, et seulement en dernier recours le premier coup de la ligne. Le bouton de réinitialisation effacera uniquement la tentative courante, sans diminuer une progression déjà validée.

## Direction visuelle et wireframe

### Learning job

Le public est un débutant avancé qui connaît les motifs mais calcule encore au hasard. La page doit lui faire pratiquer une seule habitude à la fois. L’action primaire est toujours « Choisir la variante » ou « Vérifier la position », tandis que l’échiquier et la ligne candidate servent de preuves visuelles.

### Palette

| Token | Valeur | Usage |
| --- | --- | --- |
| Surface papier | `#fffaf0` | Cartes de consigne et de réponse. |
| Encre verte | `#173e37` | Échiquier, titres et éléments de décision. |
| Safran | `#d69024` | Progression, sélection et action primaire. |
| Texte secondaire | `#5f5b4e` | Explications et aide persistante. |
| Succès | `#467a5d` | Confirmation accompagnée d’une icône et d’un texte. |
| Erreur | `#b94f36` | Diagnostic accompagné d’une explication et d’une reprise. |

Cette palette réutilise l’identité existante de Call of Chess et reste plus adaptée au sujet que la palette générique retournée par la recherche UI/UX. Les contrastes doivent être vérifiés sur les surfaces claires et sombres ; la couleur ne sera jamais le seul signal d’état.

### Typographie

Les titres continuent d’utiliser le traitement display déjà présent dans le produit. Le corps reste dans la police lisible existante, avec une taille mobile d’au moins 16 px pour les paragraphes longs. La notation, les coordonnées et les profondeurs utilisent une police monospace avec chiffres tabulaires afin de stabiliser la lecture des variantes.

### Wireframe

```text
┌─────────────────────────────────────────────────────────┐
│ ← Parcours     Niveau 3 / 07       FR | EN              │
├─────────────────────────────────────────────────────────┤
│  OBJECTIF                                               │
│  Calculer une réponse, pas deviner un coup              │
│  Progression ━━━━━━━━━━━━━━━  2 / 4                     │
├──────────────────────────┬──────────────────────────────┤
│  ÉCHIQUIER / POSITION     │  MISSION                     │
│  (repère, pas déplacement)│  Question concrète           │
│                           │  [candidat A]                │
│  Ligne actuelle           │  [candidat B]                │
│  1. ...  2. ...           │  [candidat C]                │
│                           │  [Indice] [Vérifier]         │
├──────────────────────────┴──────────────────────────────┤
│  DIAGNOSTIC : étape manquée + réponse adverse + reprise │
├─────────────────────────────────────────────────────────┤
│  MÉTHODE · VISUALISER · RÉPÉTER                         │
└─────────────────────────────────────────────────────────┘
```

### Signature

La signature de l’interface sera une **ligne de calcul matérialisée** : chaque demi-coup validé apparaît dans une bande monospace séparée de la position réelle. En visualisation, la position réelle ne bouge pas ; la bande « position imaginée » et la question « qui a le trait ? » rendent visible la conservation mentale sans tricher avec un déplacement de pièce.

### États et accessibilité

| État | Comportement attendu |
| --- | --- |
| Chargement | Réserver l’espace de la page et annoncer le statut dans une région `role=status`. |
| Prêt | Un seul CTA primaire, options clavier atteignables, échiquier avec libellé explicite. |
| Sélection | Focus visible, option sélectionnée annoncée avec `aria-pressed` ou radio sémantique. |
| Erreur | Message proche de la réponse, cause et reprise, sans rouge seul. |
| Succès | Icône, texte et progression mis à jour dans `aria-live="polite"`. |
| Indisponible | Repli local informatif si Supabase n’est pas configuré ; aucune donnée fictive. |
| Mobile | Échiquier dimensionné à la largeur disponible, options empilées, cibles d’au moins 44 px. |
| Clavier | Tabulation logique, Entrée/Espace pour choisir, pas de drag obligatoire. |
| Réduction de mouvement | Pas de confettis ni transition nécessaire à la compréhension. |

## Vérification du contenu

Les FEN, coups SAN et réponses adverses seront validés par `chess.js` dans les tests Vitest. Les positions ne seront pas choisies pour leur apparence mais pour leur capacité à isoler une seule compétence. Les exercices de visualisation ne seront pas présentés comme une mesure d’intelligence : ils évaluent une habitude entraînable, avec une profondeur progressive et une possibilité de recommencer.

## Références

[1]: https://www.chess.com/blog/GaborHorvath/the-truth-about-checks-captures-threats "Gabor Horváth — The truth about checks-captures-threats"
[2]: https://www.chessworld.net/chessclubs/openingguide/chess-calculation-evaluation-guide.asp "ChessWorld — Chess Calculation Trainer & Adviser"
[3]: https://proceedings.neurips.cc/paper_files/paper/2024/hash/37d9f19150fce07bced2a81fc87d47a6-Abstract-Conference.html "Jenner et al. — Evidence of Learned Look-Ahead in a Chess-Playing Neural Network"
