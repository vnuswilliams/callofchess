# Vérification locale — transition de réussite

- La route canonique `/lesson/bc8a719d-d4e6-5d3e-90c1-58292c6fe8f4` charge correctement avec les variables publiques Supabase injectées.
- Le rendu desktop conserve l’échiquier, la mission, le feedback et la feuille de partie existants.
- La fonctionnalité ajoutée repose sur une carte temporaire `role=status` avec annonce bilingue, une médaille de réussite et une transition CSS courte.
- L’animation est activée uniquement par la nouvelle complétion ; une progression déjà restaurée comme terminée ne déclenche pas automatiquement une navigation.
- Le serveur local sans variables Supabase affiche l’état d’erreur prévu par l’application ; cela a été corrigé pour la vérification visuelle en redémarrant avec les variables publiques disponibles, sans les écrire dans le dépôt.

La vérification interactive desktop a validé la sélection du pion e2 puis la destination e4 : la progression est passée à 02 / 04, la feuille affiche `1. e4 e5` et le feedback bilingue reste cohérent. Le comportement de jeu existant n’est pas régressé par l’ajout de la transition.

Après défilement, le deuxième coup de la leçon 06 est visible dans le viewport local. Les positions mesurées sont `f1` à x=495.5, y=540.3 et `c4` à x=249.5, y=294.3, ce qui permet une interaction native précise sans modifier le code de test.

La vérification interactive a ensuite validé f1–c4. La progression est passée à 03 / 04, le feedback indique que la réponse noire est jouée et la feuille affiche `2. Fc4 Cc6`. La sélection par pièce puis destination fonctionne toujours.

La troisième séquence d1–h5 a été validée localement. La page affiche 04 / 04, la feuille contient `3. Dh5 Cf6` et la mission finale « Terminez par le mat en f7 ». Le parcours atteint donc correctement l’état juste avant la complétion.

Après le clic final h5–f7, la carte temporaire de réussite est apparue immédiatement au-dessus de la page avec « Leçon terminée », « Très bien joué. » et « La prochaine leçon arrive… ». L’état sous-jacent affiche `4. Dxf7#` et « Objectif rempli », confirmant que l’animation est déclenchée au bon moment et n’efface pas le résultat pédagogique.

Une capture headless en 390×844 confirme le rendu mobile : l’en-tête reste lisible, la mission apparaît avant l’échiquier selon le layout mobile existant, les contrôles conservent une taille utilisable et aucun débordement horizontal n’est visible dans le premier viewport. La capture source est conservée comme artefact de vérification local.

## Ajustement de l’animation — 21 août 2026

La durée de transition est passée de 1,2 seconde à 2,4 secondes. Le test interactif local de la séquence complète atteint bien l’état « Leçon terminée » avant la navigation ; à environ 450 ms après le coup final, l’URL reste encore sur la leçon et 18 particules de confettis sont présentes dans la surcouche. Les confettis utilisent les couleurs de Call of Chess — vert encre, safran, or clair, vert succès et terre cuite — et sont masqués avec `prefers-reduced-motion`.

Une seconde vérification interactive locale s’arrête à 300 ms après le mat final : l’URL reste sur la leçon, la surcouche `.lesson-success-overlay` est active et les 18 confettis sont présents. La redirection n’intervient donc pas avant l’affichage de la célébration.

La capture mobile 390×844 après l’ajustement conserve l’ordre mission puis échiquier, les textes lisibles et aucun débordement horizontal dans le premier viewport. La couche de confettis reste hors du flux normal et ne modifie pas la géométrie de la page.
