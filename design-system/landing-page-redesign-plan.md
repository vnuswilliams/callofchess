# Call of Chess — Landing page redesign plan

## Learning job

La landing page doit conduire un visiteur curieux vers une première leçon jouable. Son action principale est **Commencer la leçon** ; les actions secondaires servent à comprendre le parcours et la méthode avant de jouer.

## Palette

| Token | Valeur | Usage |
| --- | --- | --- |
| Surface | `#f7f8f4` | Fond principal et respiration éditoriale |
| Surface élevée | `#ffffff` | Cartes et contenus interactifs |
| Encre | `#102f2a` | Titres, CTA principal et section méthode |
| Texte doux | `#53615b` | Paragraphes et navigation secondaire |
| Saffran | `#d89a32` | Progression, accent et état actif |
| Ligne | `#d9dfd7` | Séparation et structure |

## Type

Le display serif conserve la personnalité éditoriale du produit pour les thèses et titres. Manrope reste la police de lecture et d’interface. Les labels utilitaires utilisent une casse compacte et constante, avec une hauteur minimale de 44 px pour les actions tactiles.

## Layout

La page suit une progression verticale : **thèse → parcours en trois étapes → méthode en trois gestes → puzzle du jour → première leçon**. Chaque section doit avoir une action ou une destination cohérente, sans carte décorative non interactive.

```text
[Navigation: Parcours | Méthode | Puzzle | Commencer]
[Hero: promesse + board vivant | Commencer la leçon]
[Parcours: 01 -> /lesson/1 | 02 -> /lesson/2 | 03 -> /lesson/3]
[Méthode: idée -> position -> réflexe | Voir le puzzle]
[Puzzle: position + bénéfices | Essayer le puzzle]
[CTA final: reprendre le fil | Commencer la leçon]
[Footer: Call of Chess]
```

## Signature

La signature est le **fil du premier coup** : le même CTA et la même direction de lecture reviennent du hero au puzzle puis à la leçon, tandis que les cartes du parcours deviennent réellement jouables.

## États et qualité

Les liens internes utilisent `Link`, les ancres restent réservées aux sections de la landing page, et les actions sont des boutons lorsqu’elles déclenchent un état. Les liens ont des dimensions et des états hover/focus/active communs. La page doit rester lisible sur mobile, éviter le débordement horizontal et respecter `prefers-reduced-motion`.
