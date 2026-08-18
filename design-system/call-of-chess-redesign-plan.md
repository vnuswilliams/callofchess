# Plan de refonte visuelle — Call of Chess

## Mission d’apprentissage
Call of Chess aide un débutant à comprendre une idée, essayer un coup, puis progresser sans surcharge cognitive. L’action primaire de l’accueil reste de commencer une leçon guidée; les écrans de parcours, profil et classement doivent ensuite rendre la progression lisible et honnête.

## Direction visuelle
La refonte conserve l’idée d’un atelier d’échecs mais la rend plus nette : surfaces ivoire lumineuses, encre bleu-vert profonde, accent safran réservé aux décisions et à la progression, et micro-détails inspirés de la notation et du damier. Le design ne doit pas ressembler à un dashboard SaaS générique : le damier, la position jouable, les repères de coup et la progression structurée portent la personnalité du produit.

| Token | Valeur | Usage |
| --- | --- | --- |
| Surface | `#F7F8F4` | Fond général de lecture |
| Surface élevée | `#FFFFFF` | Cartes, formulaires, blocs de contenu |
| Encre | `#102F2A` | Titres, navigation, CTA principal |
| Texte secondaire | `#53615B` | Paragraphes, métadonnées |
| Accent safran | `#D89A32` | Progression, focus visuel, action positive |
| Trait | `#D9DFD7` | Séparateurs discrets |
| Succès | `#2F8F68` | Réussite pédagogique |
| Erreur | `#B54747` | Erreurs explicites |

Les paires texte/surface sont choisies pour conserver un contraste lisible, les actions gardent une zone tactile minimale de 44 px et le focus clavier reste visible. Les animations sont courtes et supprimées lorsque `prefers-reduced-motion` est actif.

## Typographie
Les titres utilisent `DM Serif Display` pour conserver une voix éditoriale et mémorable. Le corps utilise `Manrope` pour la lisibilité, avec une échelle plus régulière, des interlignes généreux et des labels utilitaires en capitales espacées. Les chiffres de progression et la notation utilisent une largeur monospace afin d’améliorer l’orientation.

## Layout
Le site adopte une grille fluide avec un conteneur large, des marges respirantes et des cartes moins décorées. L’accueil met la position jouable et le premier coup au premier plan; les pages internes partagent un en-tête compact, des panneaux de contenu clairs et des états vides explicatifs.

```text
┌──────────────────────────────────────────────────────────┐
│ marque · parcours · méthode · puzzle · langue · compte   │
├──────────────────────────────────────────────────────────┤
│ objectif d’apprentissage       position / premier coup   │
│ texte court · CTA              échiquier focal            │
├──────────────────────────────────────────────────────────┤
│ parcours en 3 étapes · méthode · puzzle                  │
└──────────────────────────────────────────────────────────┘
```

## Signature
La signature est une bande de notation discrète (`e4`, `Nf3`, `…`) qui accompagne les blocs sans les recouvrir, combinée à un échiquier plus cadré et plus stable. Elle rappelle que chaque écran sert à choisir, comprendre ou mémoriser un coup.

## États obligatoires
Les écrans doivent garder des états de chargement, vide, indisponible, erreur, succès, déconnecté, mobile, focus clavier et réduction des animations. Aucune donnée utilisateur, score ou activité ne doit être inventée pour remplir l’interface.

## Critique
La palette et la structure sont spécifiques à l’apprentissage des échecs grâce à la position, au vocabulaire du coup et au parcours pédagogique. Les ombres, bordures et textures sont réduites; le contraste visuel est réservé à l’action principale et au retour pédagogique. Le design reste compatible avec le thème sombre existant.
