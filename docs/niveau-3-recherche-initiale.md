# Recherche initiale — Niveau 3 « Calculer les variantes »

## Source consultée

[1] Gabor Horváth, « The truth about checks-captures-threats », Chess.com, mise à jour du 15 août 2025 : https://www.chess.com/blog/GaborHorvath/the-truth-about-checks-captures-threats

La source rappelle que la recherche des coups forcing — échecs, prises et menaces — est une recommandation très répandue, mais qu’elle ne doit pas être réduite à une formule magique. Elle distingue le fait de « chercher » consciemment les coups forcing du niveau avancé où ces coups sont reconnus presque automatiquement. Elle relie cette reconnaissance à une pratique répétée : calculer des positions difficiles, résoudre des exercices tactiques en calculant plutôt qu’en devinant, analyser ses parties et pratiquer la visualisation sans échiquier. Conséquence pédagogique pour Call of Chess : le Niveau 3 doit transformer CCT en procédure guidée, puis faire progressivement disparaître l’aide, tout en demandant systématiquement la réponse adverse et la continuation.

## Source tentée mais non exploitable dans le navigateur

[2] Hearst et Knott, revue sur les échecs comme modèle de recherche cognitive, PMC: https://pmc.ncbi.nlm.nih.gov/articles/PMC2972788/

La page publique a présenté un contrôle reCAPTCHA et n’a pas fourni le contenu. Aucune affirmation détaillée ne doit être attribuée à cette source sans une récupération ultérieure par une autre voie publique vérifiable.

## Implications de conception retenues provisoirement

Le parcours doit enseigner une méthode ordonnée : observer la position, formuler les coups candidats, examiner les échecs puis les prises puis les menaces, calculer la meilleure réponse adverse, rechercher la continuation, puis comparer les variantes. Les exercices doivent distinguer reconnaissance, calcul concret et visualisation mentale. Une réponse incorrecte doit expliquer l’étape de calcul manquante plutôt que seulement signaler un mauvais coup. Les exercices de visualisation doivent commencer avec une seule demi-variation et augmenter graduellement la profondeur, avec reconstitution de position et notation comme preuves de compréhension.

## Sources complémentaires

[3] ChessWorld, « Chess Calculation Trainer & Adviser » : https://www.chessworld.net/chessclubs/openingguide/chess-calculation-evaluation-guide.asp

Le guide propose de commencer par la sélection des candidats : lister les échecs, les prises et les menaces, puis n’ajouter qu’un coup calme d’amélioration lorsque la position n’est pas forcing. Il recommande de limiter la liste à deux ou trois candidats, de calculer la branche forcing la plus propre, puis de s’arrêter à une position que l’on peut évaluer. Il identifie comme difficultés distinctes le choix du candidat, la réponse adverse, la netteté de la position future, la profondeur adaptée et le temps disponible. Cette décomposition soutient un curriculum en micro-compétences plutôt qu’un exercice unique de « trouver le meilleur coup ».

[4] Erik Jenner et al., « Evidence of Learned Look-Ahead in a Chess-Playing Neural Network », NeurIPS 2024 : https://proceedings.neurips.cc/paper_files/paper/2024/hash/37d9f19150fce07bced2a81fc87d47a6-Abstract-Conference.html

L’abstract rapporte des indices de look-ahead appris dans le réseau de Leela Chess Zero : représentation de coups futurs, circulation d’informations entre positions futures et antérieures, et prédiction du meilleur coup deux demi-coups à l’avance dans des positions à solution unique. Cette publication ne constitue pas une preuve directe de la meilleure méthode humaine, mais elle confirme que la représentation de l’information future et la relation entre positions successives sont des objets pertinents pour étudier le calcul. Pour Call of Chess, cela justifie des exercices qui demandent de conserver la position future, d’identifier ce qui a changé et de relier la variante à la décision présente.

## Décisions pédagogiques pour le Niveau 3

Le niveau sera structuré en sept leçons : (8.1) méthode de calcul et ordre de recherche, (8.2) coups candidats, (8.3) réponse adverse et meilleure continuation, (8.4) comparer les variantes, (9.1) visualiser un coup, (9.2) visualiser deux à trois coups et reconstruire la position, puis (9.3) approfondir cinq coups dans une position tactique. Chaque leçon mélangera explication courte, exercice guidé et au moins un exercice de vérification sans déplacement direct sur l’échiquier.

La progression sera graduelle : les premières tâches montreront les catégories CCT, puis masqueront les indices ; les tâches de visualisation demanderont d’abord une destination, ensuite une pièce et une position finale, enfin la meilleure ligne. Le feedback distinguera « mauvais candidat », « réponse adverse oubliée », « variante non évaluée » et « position future mal reconstruite ». Les positions devront rester légales et vérifiées par chess.js, avec des séquences suffisamment courtes pour éviter de transformer l’exercice en mémorisation arbitraire.
