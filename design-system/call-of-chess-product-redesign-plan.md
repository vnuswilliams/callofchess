# Call of Chess — Product redesign plan

## Learning job

Call of Chess doit aider un joueur débutant à savoir quoi faire maintenant, comprendre pourquoi un coup fonctionne et voir sa progression sans friction. Chaque page aura donc une action principale explicite, un état de progression identifiable et un feedback lisible.

## Direction

L’inspiration vient des mécaniques d’apprentissage des produits comme Duolingo — chemin visible, objectifs courts, feedback immédiat, répétition et récompense — mais l’expression visuelle reste propre à Call of Chess : notation, cases, positions, lignes de progression et cartes de leçon servent de signature au lieu de mascottes ou de gamification décorative.

## Palette sémantique

| Token | Clair | Sombre | Usage |
| --- | --- | --- | --- |
| Surface | `#F7F8F4` | `#101F1B` | Fond principal |
| Surface élevée | `#FFFFFF` | `#18332C` | Cartes, panneaux, formulaires |
| Encre | `#102F2A` | `#EFF6EE` | Titres et texte fort |
| Texte secondaire | `#53615B` | `#BD CFC1` | Paragraphes et aides |
| Accent progression | `#D89A32` | `#E6B95E` | Progression, état actif, focus |
| Succès | `#2F8F68` | `#69C49A` | Réussite et validation |

La priorité est donnée aux contrastes sémantiques plutôt qu’aux couleurs explicites présentes dans les classes utilitaires. Les boutons primaires utilisent une paire stable encre/accent, les surfaces ne changent pas de sens entre clair et sombre, et les textes secondaires ne doivent jamais être placés sur une surface de même luminance.

## Typographie

Le display serif reste réservé aux titres de leçon, aux promesses de page et aux jalons de progression. Manrope reste la police de lecture et d’interface. Une police monospace est réservée à la notation, aux coordonnées et aux compteurs. Les titres suivent une échelle maîtrisée, avec une largeur de ligne courte et une priorité donnée à la lisibilité mobile.

## Layout

Chaque page suit cette structure :

```text
┌──────────────────────────────────────────────┐
│ Marque · navigation · langue · action compte │
├──────────────────────────────────────────────┤
│ Contexte / progression                       │
│ Titre + promesse + action principale         │
├──────────────────────────────────────────────┤
│ Contenu caractéristique de l’apprentissage   │
│ position · cartes · étapes · feedback        │
├──────────────────────────────────────────────┤
│ Prochaine action claire                      │
└──────────────────────────────────────────────┘
```

## Signature

La progression prendra la forme d’un chemin de positions : les cartes et les états de leçon doivent montrer le prochain geste concret, pas seulement un chiffre. Sur les leçons, l’échiquier reste le centre ; sur les pages de parcours et profil, les progressions sont reliées à des actions jouables.

## États obligatoires

Toutes les routes doivent couvrir les états chargement, vide, erreur, indisponible, succès, déconnecté, mode sombre, mobile, focus clavier et réduction de mouvement. Aucun faux score, faux classement ou contenu inventé ne doit être ajouté pour remplir un écran.

## Pages couvertes

La refonte concerne `/`, `/path`, `/lesson/:id`, `/profile`, `/account`, `/ranking`, `/404`, les alias français et les états connectés/déconnectés.
