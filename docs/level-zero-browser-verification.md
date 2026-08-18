# Vérification navigateur — Niveau 0

Le parcours local `/path` affiche le Niveau 0 comme premier niveau accessible avec **6 leçons et 6 exercices**. Les six intitulés, objectifs et liens canoniques `/lesson/:uuid` sont présents.

La leçon `/lesson/f3a1c235-5531-4c1c-845b-6d684808259b` affiche un échiquier orienté blanc avec coordonnées, la mission du premier coup, un bouton d’indice, la feuille de partie et les trois rappels pédagogiques.

La leçon `/lesson/32ffa48c-fa82-5825-9d6c-7ffb79a60781` affiche correctement la position personnalisée du roque et de la prise en passant, avec le pion blanc e5, le pion noir d5, le roi blanc e1 et la tour blanche h1.

La mesure du viewport navigateur a donné `innerWidth=1280`, `documentWidth=1265`, `horizontalOverflow=false`. Le rendu desktop ne présente donc pas de débordement horizontal. La responsivité mobile est couverte par les classes mobile-first et doit être recontrôlée dans un viewport mobile lors d’une validation QA dédiée.
