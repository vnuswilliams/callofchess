# Vérification locale — Niveau 2

## Parcours `/path`

Le rendu local a été vérifié le 23 août 2026 sur Vite. La page affiche le niveau 2 sous le titre « La vision tactique », avec le résumé approfondi, l’indicateur `22 leçons · 22 exercices`, la progression `0/22` et le jalon « Reconnaître le motif, calculer la suite et répondre à la menace adverse ».

Les 22 entrées sont visibles dans l’ordre demandé : attaque double, fourchette, clouage, enfilade, attaque à la découverte, échec à la découverte, échec double, déviation, attraction, surcharge, élimination du défenseur, interférence, rayon X, sacrifice, coup intermédiaire, défense par contre-attaque, menace directe, menace double, menace de mat, menace positionnelle, menace tactique et menace latente. L’état verrouillé indique correctement que le niveau 1 doit être terminé avant l’accès.

Le parcours reste responsive à la largeur desktop observée. La version locale est consultable, les titres et objectifs sont lisibles et les leçons sont intégrées au système de navigation existant. Le premier écran a d’abord affiché un état de chargement, puis le rendu complet s’est stabilisé sans erreur visible.

## Limitation de la vérification

Le serveur de développement lancé en arrière-plan a rencontré un crash natif Node 22 lors de sa fermeture automatique. Une seconde session Vite interactive a permis de charger la page sur le port 3000 et d’effectuer la vérification. Une vérification mobile dédiée reste à effectuer après stabilisation du serveur local ou directement sur le déploiement de production.
