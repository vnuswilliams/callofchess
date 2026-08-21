# Production des leçons spéciales et ordinateur

Le commit `8ab8cc00fe4d449529bc7d4f73f68b9eaa79f9f2` a été poussé sur `main` avec l’identité `Payong Venus <payongvenus@gmail.com>`. Vercel a créé le déploiement `9h3PoqQzwKwqQx8wPx4XVufnTodU`, aperçu `https://callofchess-nvu0boq19-vnuswilliams1.vercel.app`, et son statut est `Ready`. Le domaine de production associé est `https://callofchess.online`.

Le bundle doit encore être contrôlé sur les routes de la leçon des coups spéciaux et de la partie ordinateur, notamment pour les interactions clic-clic récemment ajoutées.


La route canonique des coups spéciaux charge correctement le déploiement 8ab8cc0 après un bref état « Chargement… ». Le plateau du roque court et la mission `O-O` sont présents. Le résumé général de la carte d’introduction conserve sa phrase synthétique, tandis que les explications détaillées des nulles apparaissent après avoir terminé les trois coups spéciaux et ouvert la zone des positions de nulle.


Le second correctif, commit `738494bfa5c66c919c76a7759914e4d350803227`, a été détecté puis déployé par Vercel sous `https://callofchess-pkbxmm5vx-vnuswilliams1.vercel.app`. Le déploiement Vercel `JCP57WLuipsKMFu51oGKmYv4xAB4` est maintenant `Ready`. Il remplace le premier correctif 8ab8cc0 pour la vérification des clics, avec les événements `onSquareMouseDown` et `onSquareClick` dédupliqués.

Vérification interactive du preview `callofchess-pkbxmm5vx-vnuswilliams1.vercel.app` : les coordonnées de capture visuelle ne correspondaient pas aux coordonnées CSS de la page défilée. Après calcul du rectangle DOM réel (`e1` autour de x=454, y=760 ; `g1` autour de x=618, y=760), le clic-clic `e1` puis `g1` a fonctionné. La progression est passée de 14 % à 29 %, l’écran est passé à la leçon 2/3 « O-O-O » et la feuille de partie affiche `1. O-O Re7`. Le correctif 738494b fonctionne donc pour le roque court par clic-clic.

Pour la deuxième position, les rectangles DOM réels sont `e1` x=413.5..495.5 et `c1` x=249.5..331.5, avec y=719.45..801.45. Le clic au centre réel de e1 a sélectionné le roi et l’encadrement orange de sélection est visible. Le clic-clic suivant `e1` puis `c1` a fonctionné : la progression est passée à 43 %, l’écran est passé à la leçon 3/3 « exd6 e.p. », et la feuille de partie contient `2. O-O-O`.

Le preview 738494b de la leçon ordinateur charge également correctement : le titre indique « Adversaire débutant · ≈ 500 Elo · 06 / 06 », le statut « À vous de jouer » et le bouton d’indice facultatif sont présents. Après un défilement d’une viewport, l’échiquier est entièrement visible et les cases de départ et de destination peuvent être ciblées par leurs rectangles DOM. Les rectangles relevés pour le premier coup sont `e2` x=413.5..495.5, y=636.66..718.66 et `e4` x=413.5..495.5, y=472.66..554.66 ; le clic au centre de e2 a sélectionné le pion et maintenu le statut « À vous de jouer ».
