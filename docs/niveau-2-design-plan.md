# Plan de conception — Niveau 2 : La vision tactique

## Travail d’apprentissage

Le niveau 2 s’adresse au joueur qui connaît les règles et les principes fondamentaux, mais qui ne reconnaît pas encore les mécanismes tactiques dans une position réelle. Le besoin immédiat est de passer d’une intuition vague (« il y a peut-être quelque chose ») à une lecture structurée : repérer les pièces non protégées, les alignements, les cases critiques, les menaces forcées et les ressources défensives. Chaque leçon doit avoir une seule notion centrale et conduire à une décision observable sur l’échiquier.

L’action principale de chaque page est **trouver le coup tactique ou défensif juste**, après avoir lu une explication complète. Les 16 motifs tactiques sont présentés dans l’ordre demandé, puis les 6 formes de menace montrent comment ces motifs se manifestent dans une partie.

## Progression pédagogique

| Bloc | Leçons | Intention |
| --- | --- | --- |
| Motifs de multiplication des attaques | Attaque double, fourchette | Voir comment un seul coup crée plusieurs cibles ; distinguer le concept général et sa forme typique au cavalier. |
| Motifs d’alignement | Clouage, enfilade, rayon X | Lire les lignes, la pièce de valeur derrière la première cible et les attaques indirectes. |
| Motifs de révélation | Attaque à la découverte, échec à la découverte, échec double | Comprendre la pièce qui se déplace, la ligne qui s’ouvre et le caractère forcing de l’échec double. |
| Motifs de manipulation | Déviation, attraction, surcharge, élimination du défenseur, interférence | Identifier la défense qui tient la position puis la détourner, la charger, la supprimer ou couper la coordination. |
| Motifs dynamiques | Sacrifice, zwischenzug, défense par contre-attaque | Comparer le matériel immédiat à l’initiative et répondre activement à une menace. |
| Nature des menaces | Menace directe, double, de mat, positionnelle, tactique, latente | Classer ce que le coup adverse cherche à obtenir et choisir une réponse proportionnée. |

Chaque leçon contient quatre sections théoriques : **définition**, **mécanisme**, **méthode de détection**, puis **piège fréquent et règle de transfert**. Elle se termine par trois exercices jouables : découverte guidée, application ciblée et position de synthèse. Le feedback de chaque exercice nomme le motif et explique la conséquence, au lieu de fournir uniquement un verdict.

## Palette

| Token | Valeur | Usage |
| --- | --- | --- |
| Surface papier | `#fffaf0` | Texte long et fiches de théorie. |
| Surface atelier | `#f7f0df` | Fond général clair, cohérent avec les niveaux précédents. |
| Encre | `#173e37` | Titres, plateau, actions principales et forte lisibilité. |
| Safran décision | `#d69024` | Progression, cases critiques et appel à l’action principal. |
| Succès | `#467a5d` | Réussite accompagnée d’un texte ou d’une icône. |
| Erreur | `#c96442` | Tentative incorrecte accompagnée d’une explication et d’une nouvelle action. |

La palette reprend l’atelier existant plutôt que de créer une nouvelle identité. Les couleurs fonctionnelles ne sont jamais le seul signal : chaque réussite et chaque erreur comportent un titre, une phrase et une icône accessible. Le texte courant reste dimensionné pour une lecture confortable sur mobile.

## Typographie

Les titres utilisent le traitement `display-font` existant pour donner à chaque motif une identité de chapitre. Le corps reste en sans-serif lisible, avec une hauteur de ligne généreuse. Les coups, coordonnées et compteurs utilisent une police monospace/tabulaire afin de stabiliser la lecture des variantes et de la progression.

## Mise en page

La structure conserve l’atelier de l’ouverture : l’échiquier est l’artefact principal, la théorie est une fiche de carnet et le feedback reste immédiatement adjacent à l’action. Sur mobile, le plateau et la mission passent avant la théorie ; sur desktop, le plateau occupe la colonne principale et la mission, le feedback et la feuille de partie forment la colonne de travail.

```text
┌──────────────────────────────────────────────────────────────┐
│ Niveau 2 · motif · progression · langue                     │
├───────────────────────────────┬──────────────────────────────┤
│                               │ Mission : question tactique │
│          ÉCHIQUIER            │ Méthode + indice + feedback  │
│     pièce → case cible        │ Feuille de coups              │
├───────────────────────────────┴──────────────────────────────┤
│ Définition · mécanisme · détection · erreur fréquente         │
├──────────────────────────────────────────────────────────────┤
│ Trois idées à retenir · retour au parcours · leçon suivante   │
└──────────────────────────────────────────────────────────────┘
```

## Signature

La signature du niveau 2 est la **ligne tactique annotée** : chaque exercice révèle visuellement les deux cases utiles après une demande d’indice, tandis que le texte explique la relation entre cible, défenseur et conséquence. L’échiquier reste le support de raisonnement ; aucune image décorative n’est nécessaire.

## États à traiter

Les leçons doivent gérer le chargement du parcours, l’absence de compte connecté, la progression vide, la tentative incorrecte, la réussite de l’étape, la réussite complète, le passage à la leçon suivante, les petits écrans, la navigation clavier de remplacement du glisser-déposer et la préférence `prefers-reduced-motion`. Les animations restent courtes et ne bloquent jamais la saisie. Les textes sont toujours disponibles en français et en anglais via les objets bilingues du catalogue et les traductions existantes.

## Critique appliquée

Le niveau 2 ne doit pas devenir un tableau de statistiques ou une collection de cartes décoratives. La distinction propre aux échecs vient des positions, des alignements, de la feuille de coups et de la question tactique. La densité de contenu est portée par les sections théoriques et les exercices, tandis que l’interface conserve une seule action dominante : jouer le coup qui démontre la notion.
