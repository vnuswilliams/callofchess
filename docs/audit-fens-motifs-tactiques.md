# Audit des 16 positions FEN — motifs tactiques fondamentaux

## Conclusion générale

L’audit confirme le problème signalé. Plusieurs coups sont légaux au sens technique, mais la position ne contient pas le motif annoncé. D’autres coups sont tout simplement illégaux, notamment parce que la pièce de départ n’est pas sur la case indiquée, parce que le chemin est bloqué ou parce que le roi blanc est en échec et que le coup ne répond pas à cet échec.

La distinction importante est la suivante : **la légalité d’un coup ne prouve pas sa valeur pédagogique**. Une position doit aussi contenir les cibles, l’alignement, le défenseur, la menace ou la séquence de calcul nécessaires pour démontrer le motif.

## Résultats détaillés

| # | Motif | Coup fourni | Résultat technique | Diagnostic pédagogique |
|---:|---|---|---|---|
| 1 | Attaque double | `Ne4+` | Légal sous la forme `Ne4`, mais pas échec. | Il n’y a que le roi noir en e8 : aucune seconde cible. Le coup ne peut pas illustrer une attaque double. |
| 2 | Fourchette | `Nc7+` | Illégal : le cavalier blanc est en e2 et ne peut pas aller en c7. | Il n’existe pas de seconde pièce noire à fourcher ; le pion noir d3 ne correspond pas à l’indice. |
| 3 | Clouage | `Re8#` | Légal sous la forme `Rxe8#`. | Le coup capture directement une tour et mate le roi g8. La tour noire n’est pas clouée au roi : le roi est derrière sur une autre ligne. |
| 4 | Enfilade | `Re8+` | Légal sous la forme `Rxe8+`. | Le coup capture directement la tour e8. Il n’y a pas de cible de grande valeur devant une seconde cible derrière elle : ce n’est pas une enfilade. |
| 5 | Attaque à la découverte | `Rd8+` | Illégal : le chemin de la tour d3 est bloqué par le fou blanc d4. | La pièce qui devrait se déplacer pour ouvrir la ligne n’est pas la tour. Le mouvement attendu contredit la géométrie du diagramme. |
| 6 | Échec à la découverte | `Rd8+` | Illégal pour la même raison. | La position ne contient pas de batterie fonctionnelle permettant de libérer un échec par le déplacement de la pièce annoncée. |
| 7 | Échec double | `Nd5+` | Illégal : un cavalier en d3 ne peut pas aller en d5. | Il n’y a pas de coup identifié qui donne simultanément échec par la pièce déplacée et par une ligne libérée. |
| 8 | Déviation | `Rc8+` | Illégal : les blancs sont en échec par la tour noire e2 ; `Rc8+` ne répond pas à cet échec. | Aucun défenseur, aucune cible secondaire et aucune mission défensive identifiable ne sont présents. |
| 9 | Attraction | `Rc8+` | Illégal pour la même raison : le roi blanc e1 est en échec par la dame noire e2. | Aucune pièce n’est attirée sur une case vulnérable. Le motif annoncé n’est pas encodé dans la position. |
| 10 | Surcharge | `Rc8+` | Illégal : le roi blanc e1 est en échec par la tour noire e2. | Une seule tour noire est présente, sans deux missions défensives concurrentes. Il n’y a donc pas de surcharge démontrable. |
| 11 | Élimination du défenseur | `Rxe1+` | Illégal : la case e1 contient le roi blanc et une tour en c3 ne se déplace pas en diagonale vers e1. | La cible, le défenseur et la prise suivante ne sont pas définis par la position. |
| 12 | Interférence | `Bd3` | Légal. | C’est le seul cas qui correspond partiellement à son intitulé, mais aucune ligne noire de défense ou d’attaque ne passe par d3. Le coup est légal mais le motif n’est pas démontré. |
| 13 | Rayon X | `Re8+` | Le moteur produit `Rxe8`, sans échec valide : la destination contient le roi noir. | On ne capture jamais le roi dans une position d’échecs réelle. Il n’y a pas de pièce intermédiaire à travers laquelle une pression X pourrait s’exercer. |
| 14 | Sacrifice | `Qd8+` | Légal. | Le coup donne simplement échec. Aucune pièce n’est offerte, aucune capture forcée ni compensation concrète ne sont présentes. |
| 15 | Zwischenzug | `Qd8+` | Légal. | Un coup intermédiaire exige un contexte de reprise ou une capture imminente. Le FEN ne contient pas ce contexte ; la même position que le sacrifice ne peut pas démontrer le motif. |
| 16 | Défense par contre-attaque | `Qd8+` | Légal. | Il n’existe aucune menace adverse contre une pièce blanche ou une cible blanche à détourner. Le coup est un échec, pas une défense par contre-attaque démontrée. |

## Corrections de conception nécessaires

Les leçons 1 à 4 doivent recevoir de nouvelles pièces noires afin que les deux cibles et les alignements existent réellement. Les leçons 5 à 7 doivent être reconstruites autour de batteries explicites : une pièce mobile devant une tour, un fou ou une dame, puis une cible située derrière la ligne.

Les leçons 8 à 13 doivent être refaites avec une cible et un défenseur identifiables. Une déviation exige une pièce qui protège une cible, une attraction exige une case d’arrivée forcée, une surcharge exige au moins deux missions incompatibles, une élimination exige une prise suivie d’un gain, une interférence exige une ligne de défense coupée et un rayon X exige une pression exercée à travers une pièce intermédiaire.

Les leçons 14 à 16 ne peuvent pas partager le même FEN. Un sacrifice doit contenir une compensation calculable, un zwischenzug doit présenter une reprise possible mais inférieure au coup intermédiaire et une contre-attaque doit montrer une menace adverse réelle à laquelle le coup forcing répond.

## Décision recommandée

Ne pas publier ces 16 positions telles quelles. Le contenu doit être remplacé par des positions reconstruites à partir du motif visé, puis vérifié avec quatre tests distincts : légalité du coup, SAN attendu, présence de la géométrie tactique et cohérence entre l’indice et la meilleure continuation.


## Correction appliquée

Les 16 leçons interactives du catalogue local utilisent maintenant un module dédié `correctedTacticalSteps.ts` contenant 48 étapes, soit trois étapes par motif. Les textes théoriques et les identifiants publics ont été conservés ; seules les positions, coordonnées, SAN et indices spécifiques aux exercices ont été remplacés lorsque nécessaire.

La migration `20260823030000_correct_level_two_tactical_positions.sql` met à jour les mêmes données dans `public.lessons`. Elle a été appliquée avec succès au projet Supabase Call of Chess et vérifiée sur les 16 UUID : chaque leçon possède trois étapes et un premier SAN correspondant à la position de départ.

La validation finale a confirmé **48/48 positions légales**. Le typecheck, les **77 tests Vitest** et le build Vite de production passent lorsque la configuration publique Supabase est fournie. Un test dédié garantit que les 16 premières positions publiques restent synchronisées avec les FEN, cases et SAN corrigés.
