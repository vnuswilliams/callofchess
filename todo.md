- [x] Définir la palette sombre et les règles de contraste.
- [x] Ajouter un interrupteur de thème accessible et mémorisé.
- [x] Vérifier le rendu sombre sur desktop et mobile.

## Validation

Le 17 août 2026, le sélecteur de thème a été testé dans la navigation desktop. Le libellé et l’icône changent entre « Sombre » et « Clair », et les zones principales conservent des contrastes lisibles dans le thème sombre. La structure de la landing page et les contrôles de navigation restent également adaptés au viewport mobile.

## Publication GitHub et Vercel

- [x] Vérifier les accès GitHub et Vercel disponibles pour cette tâche.
- [x] Ajouter la configuration de production Vercel et la documentation de déploiement.
- [x] Créer le dépôt GitHub privé et y publier la branche principale.
- [x] Déployer le projet sur Vercel et vérifier l’URL de production.

## Test du connecteur Vercel

- [x] Interroger les équipes et projets accessibles via le connecteur Vercel.
- [x] Présenter les capacités disponibles et la limite actuelle de déploiement.

## Résultat du test

Le connecteur Vercel répond correctement aux requêtes en lecture seule. Il retourne un espace accessible, `vnuswilliams` (`team_6YEmKGlfQ7Br7pSPTmpYmPyc`, slug `vnuswilliams1`), et l’inventaire des projets renvoie actuellement une liste vide dans cet espace. La création du projet Git associé a bien renvoyé un identifiant, mais la création du déploiement a été refusée avec une erreur d’autorisation 403.

## Reprise après autorisation

La session Vercel autorisée confirme que le projet `echequier` est associé au dépôt GitHub et qu’un push vers `main` déclenchera le déploiement de production.

Après le push de déclenchement, le tableau de bord Vercel affiche encore « No Production Deployment » et propose l’étape « Connect Git Repository ». L’intégration Git doit donc être finalisée dans le projet Vercel avant que les pushes vers `main` puissent lancer un déploiement.

Après l’autorisation, Vercel a bien détecté le commit `a0ae751` et a lancé une construction. L’aperçu revient toutefois à « No Production Deployment » : le statut et les journaux du déploiement doivent être consultés avant de considérer la publication comme terminée.

L’historique des déploiements affiche désormais une entrée de production pour le commit `a0ae751` sur `main`, avec l’URL `echequier-qwimgaqsb-vnuswilliams1.vercel.app`. La réponse HTTP de cette URL doit encore être vérifiée.

La landing page est servie correctement à l’adresse https://echequier-qwimgaqsb-vnuswilliams1.vercel.app ; le titre, les visuels, la navigation et le sélecteur de thème sont accessibles en production.
