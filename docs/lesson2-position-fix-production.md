# Correctif de transition de la leçon 2

Le correctif local sélectionne maintenant `lesson.steps[nextStep].positionFen` quand une mission sans réponse informatique est validée. Le cas roi → dame est couvert par un test de régression.

Les vérifications locales du merge `3ef7fa4d070e95298852fabb5d230cf39e555a55` sont vertes : `pnpm check`, 16 fichiers Vitest / 45 tests et `pnpm build`.

Après le push, Vercel a créé le déploiement Production `EoaJxD1dZv1Jk87t9REkTxmDZySE` pour le commit `3ef7fa4`, actuellement en statut `Building`. L’ancienne production restait encore sur `c1345e4` au moment du premier contrôle ; la publication doit être recontrôlée après la fin du build.


## Vérification production

Le déploiement `EoaJxD1dZv1Jk87t9REkTxmDZySE` est passé en **Ready**, avec le commit `3ef7fa4` et `callofchess.online` comme domaine actuel. Sur `/lesson/0ce3ec0e-348e-4300-b88a-c4a939cd8960`, le coup `e4 → d5` fait passer la progression à `2 / 6`, affiche la mission « Faites glisser la dame en h7 » et l’échiquier contient bien la dame blanche en `e4` ainsi que le roi blanc en `e1`. Le bug signalé est donc corrigé et visible en production.
