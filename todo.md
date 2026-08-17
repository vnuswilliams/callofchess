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

## Leçon interactive, partage et mesures

- [x] Installer la logique d’échecs et le composant d’échiquier interactif.
- [x] Créer une première leçon jouable avec objectif, indices et correction.
- [x] Ajouter des métadonnées Open Graph et Twitter adaptées aux réseaux sociaux.
- [x] Activer Vercel Analytics et Speed Insights pour le projet de production.
- [x] Tester la leçon, puis publier et vérifier la mise à jour Vercel.

La page `/lecon/1` affiche une position initiale jouable, une mission en deux coups (`e4` puis `Cf3`), des indices de cases, les réponses noires, une feuille de partie et une réinitialisation. Les boutons de la leçon utilisent le composant Button de shadcn/ui, adapté à l’identité graphique avec des variantes de couleur et des angles plus nets.

Web Analytics est activé dans Vercel sur l’offre Hobby incluse. Les composants React d’Analytics et de Speed Insights sont déjà intégrés dans l’application et seront pris en compte au prochain déploiement de production.

La page Vercel Speed Insights est active pour l’environnement Production. Elle affichera les Core Web Vitals dès que le nouveau déploiement et les premières visites auront généré des données.

Les vérifications TypeScript et la construction de production sont réussies. Les rendus desktop et mobile confirment l’intégrité de la landing page et de la première leçon interactive avant publication.

Le déploiement de production Vercel associé au commit `4ecd6e5` est prêt. La publication publique sous `lionchess.vercel.app` est contrôlée à l’étape finale.

Le contrôle de la route directe `/lecon/1` renvoie encore une erreur 404, tant sur le sous-domaine de production que sur l’URL de déploiement. La réécriture SPA Vercel est corrigée avant la validation finale en utilisant `/` comme destination, conformément au comportement `cleanUrls`.

Le commit correctif `feb9ac7` est publié sur GitHub. Le tableau des déploiements ne l’affiche pas encore : le déclenchement Git de Vercel est relancé pour appliquer le routage corrigé.

L’intégration Git reste connectée au dépôt `vnuswilliams/echequier`, mais le commit correctif n’apparaît toujours pas dans l’historique Vercel. Un déclenchement manuel de la branche principale est préparé pour appliquer la correction sans attendre le webhook.

Un déclencheur nommé `production-route-redeploy` est prêt pour la branche `main` dans les paramètres Git de Vercel.

Le déclencheur manuel a lancé un nouveau déploiement de production pour le commit correctif `feb9ac7`. Son état et la route directe de la leçon sont vérifiés avant la clôture.

La route publique `https://lionchess.vercel.app/lecon/1` est maintenant servie correctement. Les métadonnées Open Graph, l’image de partage, l’URL canonique ainsi que les scripts Vercel Analytics et Speed Insights sont présents dans la version de production.

Le déclencheur de déploiement temporaire a été révoqué après utilisation. Le projet conserve uniquement l’intégration GitHub standard pour les déploiements futurs.

Un test d’interaction par pointeur a été envoyé sur le mouvement attendu `e2–e4`. La leçon propose désormais également une sélection par clic de la pièce puis de sa destination, afin de couvrir les usages tactiles et souris. Les clics sur les cases `e2` puis `e4` ont été déclenchés pour valider ce second parcours de jeu; la séquence complète est vérifiée lors du contrôle suivant.

Après la validation de `e4`, le second coup `Cf3` a été déclenché par sélection des cases `g1` puis `f3`; l’état final de réussite est contrôlé ensuite.

Le test a montré que l’échiquier sépare les événements de clic sur une pièce et sur une case vide. La leçon est ajustée pour capter explicitement la sélection d’une pièce avant le clic sur sa destination, ce qui fiabilise le parcours tactile.

Le contrôle interactif associé au pion `e2` a été sollicité après cette correction; la destination `e4` et l’état de validation sont vérifiés dans l’étape suivante.

Les coordonnées de la case `e2` sont disponibles dans le rendu de la leçon pour contrôler la sélection directe de la pièce avant sa destination.

Le clic synthétique sur la pièce ne reproduit pas fidèlement le geste de pointeur géré par l’échiquier. La validation interactive est donc contrôlée principalement par la logique de glisser-déposer, avec la sélection par clic conservée comme amélioration d’accessibilité pour les interactions natives.

## Sous-domaine de production

- [x] Renommer le projet Vercel afin d’utiliser lionchess.vercel.app.
- [x] Vérifier que lionchess.vercel.app sert bien la version de production.

Le nom `lionchess` est prêt dans les paramètres Vercel. Vercel indique que ce renommage modifie les revendications OIDC du projet ; cette application statique n’utilise pas de fédération OIDC côté backend.

Le projet Vercel est bien renommé en `lionchess`, mais l’adresse `lionchess.vercel.app` retourne encore 404. Le domaine doit être associé explicitement au déploiement de production ou régénéré par un nouveau déploiement.

La gestion des domaines Vercel permet d’associer un domaine à l’environnement Production ; l’ajout explicite de `lionchess.vercel.app` est prêt à être effectué.

Le sous-domaine `lionchess.vercel.app` a été renseigné et l’environnement Production a été sélectionné dans le formulaire de domaine Vercel.

Le sous-domaine est maintenant associé à la production avec une configuration valide. `https://lionchess.vercel.app` sert correctement la landing page Échiquier.
