# Plan de transition après réussite d’une leçon

## Travail d’apprentissage
L’apprenant doit recevoir une confirmation visuelle brève et compréhensible après le dernier coup correct, puis poursuivre naturellement le parcours sans devoir chercher le bouton suivant. L’action principale reste la pratique de la position ; l’animation ne doit pas masquer le résultat ni être nécessaire pour comprendre l’état.

## Palette
- Surface de la confirmation : `#fffaf0`
- Texte principal : `#173e37`
- Accent de progression : `#d69024`
- Succès : `#467a5d`
- Surface de succès : `#e9f0e6`
- Bordure : `#6f977c`

Les couleurs réutilisent les tokens visuels de la page de leçon et ne reposent pas uniquement sur la couleur : le message, l’icône et l’état textuel signalent aussi la réussite.

## Typographie
Réutiliser `display-font` pour le titre de réussite et la hiérarchie existante de la page pour le message court. Aucun nouveau style typographique n’est nécessaire.

## Structure
Après la validation du dernier coup, une carte de réussite temporaire est affichée au-dessus de l’espace de leçon. Elle conserve une hauteur et un contenu limités, puis la navigation client se fait vers `/lesson/:id` pour la leçon suivante ; après la dernière leçon, elle revient vers `/path`.

```text
┌────────────────────────────────────────────┐
│ ✓  Leçon terminée                          │
│    Très bien joué.                         │
│    La prochaine leçon arrive…              │
└────────────────────────────────────────────┘
       échiquier + mission + feedback
```

## Signature
Une courte pulsation de la médaille de réussite, suivie d’un déplacement doux de la carte vers son état suivant. La durée cible est de 1,2 s ; `prefers-reduced-motion` désactive les transformations et conserve uniquement l’état textuel avant la redirection.

## États
- Succès déclenché uniquement lors d’une nouvelle complétion, pas lors de la restauration d’une leçon déjà terminée.
- Animation en cours : navigation automatique désactivée par l’état local et annoncée via `aria-live`.
- Réduction de mouvement : aucun déplacement/pulsation, délai court conservé pour laisser lire le message.
- Dernière leçon : destination sûre `/path`, sans UUID inventé.
- Erreur ou coup incorrect : comportement actuel conservé.
- Mobile et desktop : carte centrée dans la largeur disponible, sans débordement ni cible interactive trop petite.

## Vérification TDD
Ajouter une fonction pure testée pour calculer la destination de transition (`/lesson/:id` suivante ou `/path`) et un test de durée/état si le composant permet une vérification déterministe. Écrire les tests avant le code de production, observer l’échec, puis implémenter au minimum nécessaire.
