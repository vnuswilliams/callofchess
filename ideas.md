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


## Plan de conception — Chapitre 0 « Comprendre le jeu »

### Travail d’apprentissage
Le chapitre s’adresse à une personne qui ne sait pas encore jouer une partie complète. Sa première action est de comprendre le matériel et les règles dans une lecture calme ; elle pratique ensuite chaque notion sur un échiquier dédié ; elle termine par une vraie partie contre un adversaire informatique volontairement accessible. Le critère de sortie n’est pas la mémorisation d’un texte, mais la capacité à jouer légalement, à reconnaître l’échec et les nulles, puis à gagner une partie complète sans consulter les règles.

### Découpage pédagogique retenu
Le chapitre est organisé en huit leçons courtes et cohérentes. La leçon 01 est entièrement théorique et ne présente pas d’échiquier d’exercice : matériel, 64 cases, coordonnées, colonnes, rangées, diagonales, orientation correcte, rôle de chaque pièce, valeurs approximatives et principe du classement Elo. Les leçons 02 à 07 sont interactives : déplacements des six pièces, prises et promotion, échec/échec et mat, roque court et long, prise en passant, puis pat et les trois autres formes de nulle (répétition, règle des 50 coups et matériel insuffisant). La leçon 08 est une partie complète contre un ordinateur réglé pour jouer des coups légaux simples et pédagogiques, avec possibilité de recommencer ; sa victoire valide le passage au niveau 1.

| Leçon | Fonction | Échiquier | Validation |
| --- | --- | --- | --- |
| 01 | Comprendre le matériel, les coordonnées, les valeurs et Elo | Non, théorie uniquement | Parcourir les cartes théoriques et confirmer les notions |
| 02 | Déplacer roi, dame, tour, fou, cavalier et pion | Oui | Réussir une mission pour chaque pièce |
| 03 | Prendre et promouvoir | Oui | Réaliser une prise puis choisir une promotion |
| 04 | Comprendre échec et échec et mat | Oui | Donner échec puis trouver le mat |
| 05 | Exécuter roque court et roque long | Oui | Réaliser les deux roques dans des positions légales |
| 06 | Exécuter la prise en passant | Oui | Jouer la prise immédiatement après le double pas |
| 07 | Reconnaître les nulles | Oui | Produire un pat et explorer trois positions de nulle |
| 08 | Jouer une partie complète contre l’ordinateur | Oui | Gagner une partie légale sans aide obligatoire |

### Palette et typographie
La direction existante est conservée : ivoire de jeu `#F7F0DF`, surface papier `#FFFAF0`, encre vert profond `#173E37`, texte secondaire `#625D50`, safran du coup `#D69024`, succès feuillage `#467A5D` et erreur terre cuite `#C96442`. Le DM Serif Display reste réservé aux titres et aux grands principes ; Manrope porte les explications et les contrôles ; les coordonnées, valeurs et notations utilisent une chasse monospace. Les contrastes doivent rester lisibles dans les thèmes clair et sombre, avec un anneau de focus visible.

### Structure d’écran
La théorie est une lecture en fiches : un en-tête de chapitre, une progression verticale, une carte principale par notion et une bande de rappel en bas. Les exercices utilisent une structure stable : échiquier à gauche sur desktop, mission/feedback/historique à droite, puis empilement naturel sur mobile. La partie finale ajoute un bandeau d’état de partie, une indication claire du tour, un bouton « demander un indice » non obligatoire et un résumé de victoire qui explique pourquoi la partie est validée.

```text
[Retour · Chapitre 0 · Langue]
[Numéro] [Titre de la leçon]                 [Progression]

[Théorie : cartes de notions]       ou       [Échiquier + coordonnées]
[Principe à retenir]                         [Mission active]
[Valeur / définition / exemple]              [Feedback + historique]

[Précédent] [Continuer]
```

### Signature d’interaction
Chaque exercice révèle une « annotation de carnet » : la mission indique ce qu’il faut observer, le coup réussi inscrit sa notation dans la feuille, puis le feedback reformule la règle en une phrase. Pour la leçon 01, cette signature devient une frise matérielle sans plateau : six cartes de pièces, une table de valeurs et un mini-diagramme de coordonnées en CSS/HTML qui explique le repère sans devenir un exercice.

### États à traiter
Toutes les leçons doivent gérer le chargement de progression, l’absence de session connectée, l’erreur de sauvegarde silencieusement sûre, le coup incorrect, la réussite d’une étape, la fin de leçon, le verrouillage du chapitre suivant, le clavier/focus, le mobile étroit et `prefers-reduced-motion`. La partie contre ordinateur doit aussi gérer le tour de l’ordinateur, la réinitialisation, le mat, la nulle et l’abandon local sans enregistrer un résultat fictif.

### Critique de conception
La recherche UX générique suggère une esthétique éducative plus colorée et ludique, mais elle serait moins cohérente avec la marque déjà validée et risquerait de réduire la gravité utile des règles. Le plan conserve donc l’Atelier de l’Ouverture et n’emprunte que les exigences structurelles pertinentes : cible tactile d’au moins 44 px, contraste, focus clavier, absence de débordement à 375 px et réduction des animations. La signature reste spécifique aux échecs : coordonnées, feuille de coups, pièces et validation par position légale.
