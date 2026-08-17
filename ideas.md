# Directions de design — Échiquier

## Trois pistes explorées

| Nom | Introduction très brève | Probabilité |
| --- | --- | --- |
| **L’Atelier de l’Ouverture** | Un univers éditorial chaleureux, inspiré du papier de jeu, des livres annotés et de l’objet échiquéen. Il rend l’apprentissage précis mais jamais intimidant. | 0.07 |
| **Club après minuit** | Une esthétique nocturne et feutrée, évoquant un club d’échecs contemporain et une lumière de table concentrée. Elle valorise la stratégie et le rituel. | 0.03 |
| **Carnet de tournoi** | Une direction graphique vivante à la frontière du cahier d’entraînement et de l’affiche sportive. Elle rend visible la progression par des notes, repères et tracés. | 0.09 |

## Direction retenue — L’Atelier de l’Ouverture

### Mouvement de design

Un **éditorial tactile contemporain**, influencé par les manuels d’échecs annotés, les typographies de presse et les papiers de jeu patinés. L’interface doit avoir le calme d’un bureau de joueur concentré, tout en restant nette et contemporaine.

### Principes directeurs

1. **Stratégie lisible** : chaque bloc hiérarchise une idée à la fois et guide naturellement le regard.
2. **Chaleur maîtrisée** : des tons ivoire, encre et bois remplacent les interfaces froides ou ludiques à l’excès.
3. **Matière discrète** : damier, lignes d’annotation et ombres douces suggèrent le jeu physique sans surcharger l’écran.
4. **Asymétrie utile** : les compositions décalées donnent un mouvement éditorial, avec les informations essentielles toujours faciles à parcourir.

### Philosophie chromatique

Le fond **ivoire de jeu** apporte le confort d’une page de livre ouverte. L’**encre noire**, presque brune, incarne la concentration et assure la lecture. Le **vert damier profond** relie l’identité au plateau sans employer les codes numériques attendus. Le **safran mat** intervient comme repère de décision : il signale l’action, le coup à jouer et le progrès, avec une énergie élégante plutôt qu’un effet promotionnel.

### Paradigme de mise en page

La page se construit comme une **partie annotée** : une colonne narrative à gauche, un plateau et des cartes qui glissent dans le rythme de lecture à droite, puis des rubans d’informations qui interrompent volontairement la grille. Les sections alternent entre zones blanches respirantes et panneaux vert encre, évitant le modèle de landing page uniformément centré.

### Éléments signatures

1. Un **plateau d’échecs légèrement incliné**, ponctué de marqueurs de coups safran.
2. Des **annotations de notation algébrique** (`e4`, `Cf3`, `+`) utilisées comme éléments graphiques.
3. Un **liseré damier** fin et irrégulier, présent sur les séparateurs, les cartes et le pied de page.

### Philosophie d’interaction

L’interface doit répondre comme un échiquier : précise, calme, sans distraction. Les boutons ont un léger mouvement d’enfoncement ; les cartes découvrent un repère de coup au survol ; les liens de navigation se soulignent comme une annotation au crayon.

### Animation

Les entrées utilisent seulement opacité et translation courte, avec une cascade légère pour les cartes. Le plateau de héros flotte de manière imperceptible et les marqueurs de coups se révèlent doucement. Durées entre 160 et 280 ms, courbes vives mais souples ; toute animation est désactivée lorsque `prefers-reduced-motion` est activé.

### Système typographique

**DM Serif Display** porte les titres : affirmée, éditoriale, avec une légère solennité. **Manrope** porte les interfaces et le corps de texte : très lisible, contemporain et compact. Les titres sont volontairement grands, avec des ruptures de ligne expressives ; les données et notations emploient une chasse plus dense et un espacement des lettres légèrement accru.

### Essence de marque

**Échiquier transforme chaque premier coup en une progression claire, pour les débutants qui souhaitent apprendre les échecs en pratiquant réellement.**

Personnalité : **exigeante, encourageante, sereine**.

### Voix de marque

La voix est directe, experte sans jargon, et invite à l’action avec confiance. Les titres évitent les promesses vagues : ils parlent d’un coup, d’une habitude ou d’un cap franchi. Les CTA sont courts et concrets.

Exemples :

> « Votre premier bon coup commence ici. »

> « Jouer la position »

### Logotype et symbole

Le symbole est un **cavalier géométrique dans une case tournée à 45°**, avec une petite entaille safran qui évoque le déplacement en L. Il doit rester simple et fort, même en favicon. Le mot-symbole combine le dessin net de DM Serif Display et une lettre `Q` subtilement inspirée d’une trajectoire de cavalier.

### Couleur signature

**Safran du Coup — `#D69024`** : un or terreux, immédiatement associé au moment décisif et au progrès.
