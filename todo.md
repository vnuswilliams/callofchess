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

## Analyse Stockfish

- [x] Intégrer Stockfish côté navigateur dans un Web Worker.
- [x] Ajouter l’interface d’analyse avec profondeur, évaluation et meilleur coup.
- [x] Tester l’analyse, la fluidité et le déploiement Vercel.
- [x] Ouvrir la leçon après le déploiement 770179d et vérifier Stockfish en production.
- [x] Contrôler explicitement l’état « Analyse en cours » et l’absence de blocage visible du plateau en production.

The Stockfish 17.1 lite single-threaded engine returns depth 12, a centipawn evaluation and a principal variation in the local browser test. Vitest covers score formatting, mate formatting and UCI info parsing; all 3 tests and TypeScript checks pass. Desktop and mobile screenshots remain readable. Production verification at `https://lionchess.vercel.app/lecon/1` returns `+0.40`, depth `12`, best move `e2e4`, and a principal variation. A fresh runtime check confirmed the visible loading state, stop control, and unchanged board geometry during analysis.


Production runtime check: `https://lionchess.vercel.app/lecon/1` loads the Stockfish panel and its analysis button. A direct click returns `+0.40`, depth `12`, best move `e2e4`, and the principal variation `e2e4 · d7d5 · e4d5 · d8d5 · g1f3 · c8g4 · b1c3 · d5e6`. During a fresh production run, the button changed to `Analyse en cours`, became disabled, the `Arrêter` button appeared, and the board square remained present with the same geometry before and after the run, demonstrating a non-blocking visible UI.

## Validation pédagogique

Un déplacement volontaire `e2–e3` affiche « Diagnostic personnalisé · erreur 1 », le titre « Le centre mérite plus d’espace », une explication sur la portée de `e4`, un conseil actionnable sur le contrôle des cases centrales et le repère moteur `e2e4`. Après enrichissement, l’interface affiche aussi « Stockfish confirme e2e4 : votre objectif et le meilleur coup moteur vont dans la même direction. »

## Explications pédagogiques personnalisées

- [x] Capturer les coups joués et leur contexte pédagogique.
- [x] Classifier les erreurs avec Stockfish et des règles adaptées aux débutants.
- [x] Générer une explication claire et un conseil personnalisé pour chaque erreur.
- [x] Afficher le diagnostic dans la leçon et tester localement.
- [x] Publier la fonctionnalité pédagogique sur GitHub/Vercel et vérifier l’erreur e2–e3 en production.


## Amélioration du coaching : pourquoi le meilleur coup

- [x] Expliquer explicitement pourquoi le meilleur coup Stockfish est supérieur au coup joué.
- [x] Afficher les bénéfices concrets du meilleur coup : contrôle du centre, développement, lignes ouvertes, gain de tempo ou sécurité du roi.
- [x] Ajouter une phrase de principe à retenir et couvrir cette sortie par des tests Vitest.
- [ ] Publier les améliorations du coaching sur GitHub/Vercel puis vérifier en production que le panneau affiche aussi « pourquoi le meilleur coup est supérieur » et « le principe à retenir ».


## Nouvelles fonctionnalités demandées

- [x] Convertir les coups UCI et la feuille de partie en notation algébrique lisible.
- [x] Ajouter la leçon 02 sur le développement des pièces.
- [x] Ajouter la leçon 03 sur la sécurité du roi et le roque.
- [ ] Définir le modèle de progression utilisateur et la sauvegarde par le compte connecté.
- [ ] Ajouter les procédures serveur de lecture et d’enregistrement de progression.
- [ ] Ajouter l’interface de compte, connexion et état de progression.
- [ ] Tester les leçons, la notation, la sauvegarde et les parcours authentifiés.
- [ ] Publier la mise à jour sur GitHub/Vercel et vérifier la production.


## Internationalisation français / anglais

- [x] Ajouter un contexte de langue avec persistance locale et français par défaut.
- [x] Ajouter un sélecteur de langue accessible dans la navigation.
- [ ] Traduire la landing page, la navigation et les appels à l’action.
- [ ] Traduire tous les libellés restants des leçons et du feedback Stockfish en anglais, y compris les cartes de fin et les textes de progression.
- [ ] Tester la persistance de langue après rechargement et vérifier `/lecon/1`, `/lecon/2` et `/lecon/3` en français et en anglais.


## Authentification MVP : email, mot de passe et Passkey

- [x] Vérifier le runtime de production : l’authentification et la persistance utilisent désormais le client Supabase côté navigateur, Supabase Auth et RLS en production.
- [x] Utiliser les utilisateurs et sessions gérés par Supabase Auth, avec profils et progression dans Supabase.
- [x] Implémenter l’inscription et la connexion par email/mot de passe via Supabase Auth ; le hachage est délégué à Supabase.
- [x] Ajouter déconnexion, session persistante Supabase, validation et messages d’erreur génériques dans l’interface ; le test E2E reste ouvert.
- [ ] Tester réellement l’enregistrement et la vérification des Passkeys avec WebAuthn en environnement HTTPS compatible.
- [x] Restaurer la position, l’historique de coups et l’état de la leçon à partir de `lesson_progress`.
- [ ] Ajouter des tests Vitest pour les handlers auth/progress et des tests client pour la page de compte.
- [x] Vérifier les parcours de compilation, build et tests locaux, puis publier le jalon MVP ; le test avec un compte réel reste ouvert.


## Migration Supabase et nouveau domaine

- [x] Inspecter les connecteurs Supabase, Vercel et GitHub disponibles.
- [x] Confirmer le projet Supabase, son URL et la clé publique anon sans exposer de secret serveur. Test `supabaseHealth.test.ts` réussi : l’endpoint Auth répond avec les variables publiques injectées.
- [x] Créer le schéma Supabase pour profils et progression avec RLS ; Passkeys est ensuite activé et rechargé avec succès dans Supabase Auth.
- [x] Configurer les variables Supabase côté Vercel et localement via les secrets publics `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`. Vercel les affiche en Production et Preview ; un redéploiement a été créé.
- [x] Remplacer les appels auth maison par Supabase Auth email/mot de passe dans l’application.
- [x] Ajouter récupération de compte et réinitialisation de mot de passe via Supabase Auth.
- [x] Activer et vérifier après rechargement Passkeys via Supabase Auth/WebAuthn avec RP ID `callofchess.vercel.app` et origine `https://callofchess.vercel.app`. Le test avec un authenticator réel reste ouvert.
- [x] Relier la progression des leçons aux utilisateurs Supabase authentifiés via `lesson_progress` et RLS.
- [x] Relier/vérifier le dépôt GitHub et le projet Vercel existants.
- [x] Remplacer `lionchess.vercel.app` par `callofchess.vercel.app` avec redirection 307 de l’ancien domaine.
- [ ] Tester réellement l’inscription, la récupération, la progression et Passkey sur `callofchess.vercel.app` avec un compte de test.


## Publication du correctif Supabase

- [x] Committer les changements Supabase, progression et suppression de l’ancienne API d’authentification.
- [x] Pousser le commit sur GitHub `main`.
- [ ] Vérifier que Vercel déploie ce commit sur `callofchess.vercel.app`.
- [ ] Vérifier que le bundle public contient bien Supabase Auth et corriger l’inscription si nécessaire.


## Rétablissement autonome du pipeline

- [x] Auditer les connecteurs GitHub, Vercel et Supabase ainsi que les références du projet.
- [x] Vérifier que GitHub main, le projet Vercel et le domaine callofchess pointent vers la même application.
- [ ] Déclencher ou réparer le déploiement Vercel depuis le commit GitHub actuel.
- [ ] Vérifier que callofchess.vercel.app sert le bundle Supabase Auth et tester l’inscription.
- [ ] Documenter le résultat final et la cause de tout blocage résiduel.


Constat final du diagnostic autonome : l’incident officiel GitHub du 17 août 2026 affecte actuellement les API, webhooks et téléchargements de contenu brut avec des taux d’erreur élevés. Vercel est correctement relié à `vnuswilliams/echequier`, mais ne peut pas résoudre le SHA `75d4d75` et ses Deploy Hooks redéploient l’ancien snapshot. Le domaine `callofchess.vercel.app` est correctement rattaché à Production ; le code local et Supabase sont sains. La publication du nouveau bundle reste donc suspendue jusqu’au rétablissement GitHub/Vercel.


## Retours visuels de l’inscription

- [x] Ajouter une animation de chargement visible pendant l’inscription et la connexion.
- [x] Afficher des messages d’erreur clairs et bilingues selon le contexte Supabase.
- [x] Ajouter un état de succès et une validation accessible pour le formulaire.
- [x] Couvrir les états visuels et les messages par des tests, puis vérifier le rendu responsive. (Tests bilingues des messages, rendu responsive et build vérifiés.)


## Confidentialité des libellés du compte

- [x] Retirer les mentions Supabase Auth, récupération par email et bêta Passkeys de l’interface utilisateur.
- [x] Remplacer ces mentions par des formulations neutres, compréhensibles et bilingues.
- [x] Vérifier que les messages d’erreur ne révèlent pas de détail technique ou de fournisseur.


## Publication de la version finale du compte

- [x] Valider les derniers changements de la page de compte avec TypeScript, tests et build.
- [x] Pousser la version finale sur GitHub `main`.
- [ ] Redéployer cette version sur Vercel.
- [ ] Vérifier la page `/compte` et les nouveaux libellés sur `callofchess.vercel.app`.


## Profil utilisateur et statistiques

- [x] Ajouter une route de profil utilisateur accessible depuis le compte.
- [x] Afficher les statistiques personnelles calculées à partir des données disponibles.
- [x] Afficher l’historique des parties ou des sessions de leçon sans données fictives.
- [x] Prévoir les états non connecté, chargement, erreur et historique vide.
- [x] Ajouter les libellés français et anglais et vérifier le rendu responsive.
- [x] Ajouter ou mettre à jour les tests, puis sauvegarder la version livrable.


## Trois améliorations du profil

- [ ] Persister les parties réellement jouées avec leur leçon, résultat, nombre de coups et date.
- [x] Enrichir les statistiques avec taux de complétion, étapes moyennes et activité récente.
- [x] Ajouter une visualisation de progression basée uniquement sur les données utilisateur réelles.
- [x] Ajouter les tests et vérifier les états bilingues et responsive.


## Publication des trois améliorations du profil

- [x] Valider les statistiques enrichies et la visualisation de progression.
- [x] Pousser les changements du profil sur GitHub `main`.
- [ ] Tenter le redéploiement Vercel depuis le commit final.
- [x] Vérifier et documenter le statut de production Vercel.


## Graphique de progression et partage social

- [x] Remplacer les barres simples par un graphique de progression éditorial plus attrayant, basé sur les données réelles.
- [x] Ajouter une carte de partage social avec aperçu joli, texte bilingue et actions Web Share/copie de lien.
- [x] Mettre à jour les métadonnées de partage sans exposer l’email ni les statistiques privées.
- [x] Corriger les tests du profil et vérifier le rendu desktop/mobile et les états de partage.


## Badges et succès du profil

- [x] Définir des badges calculés uniquement à partir des leçons terminées.
- [x] Afficher les badges débloqués et verrouillés avec leur progression.
- [x] Ajouter les libellés français et anglais et des états accessibles.
- [x] Tester le calcul des badges et vérifier le rendu desktop/mobile.


## Roadmap pédagogique A → Z

- [x] Lire et structurer les 18 niveaux de la roadmap fournie en progression pédagogique cohérente.
- [x] Créer un modèle de parcours avec niveaux, chapitres, objectifs, prérequis et exercices.
- [x] Ajouter une première sélection d’exercices jouables couvrant les fondamentaux, tactiques, calcul, finales et stratégie.
- [x] Intégrer une page Parcours avec progression visuelle, verrouillage par prérequis et accès aux leçons.
- [x] Ajouter les traductions FR/EN et les états de chargement, vide et non connecté.
- [x] Tester TypeScript, Vitest, build, routes directes et rendu responsive.
- [ ] Pousser les changements sur GitHub et tenter le redéploiement Vercel.


## Classement, partage de badges et notifications

- [x] Auditer les profils et la progression afin de définir un classement basé sur des données réelles, sans email public.
- [x] Ajouter le classement général avec rang, score de progression et état vide explicite.
- [x] Ajouter une carte interactive de partage pour un badge choisi, sans statistiques privées.
- [x] Ajouter Web Share/copie de lien et textes FR/EN pour la carte de badge.
- [x] Détecter un nouveau badge débloqué et afficher une notification ainsi qu’une animation accessible.
- [ ] Ajouter les tests, vérifier confidentialité, responsive et publication GitHub/Vercel.


## Réalignement Vercel et documentation

- [x] Comparer le commit Vercel bloqué `089958c` avec le HEAD actuel de GitHub `main`.
- [x] Vérifier le dépôt, la branche de production, les paramètres de build et l’historique Vercel.
- [x] Corriger le raccordement ou documenter précisément le blocage GitHub/Vercel sans laisser de hook permanent.
- [x] Annoter les zones clés du code avec des commentaires utiles et non redondants.
- [x] Ajouter une documentation de développement, de déploiement, de Supabase et de dépannage Vercel.
- [x] Tester, pousser les corrections sur GitHub et tenter le redéploiement Vercel.
