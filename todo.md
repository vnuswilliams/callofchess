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


## Routes publiques en anglais

- [x] Remplacer la route publique `/classement` par `/ranking`.
- [x] Mettre à jour tous les liens internes, boutons, routes directes et références de documentation vers les noms anglais.
- [x] Ajouter une redirection de compatibilité depuis `/classement` vers `/ranking` si nécessaire.
- [x] Tester les routes anglaises, les liens internes, TypeScript, Vitest et le build.
- [ ] Pousser la version harmonisée sur GitHub et tenter le redéploiement Vercel.

## Déploiement automatique GitHub–Vercel — 17 août 2026

- [x] Déplacer la configuration `pnpm` hors de `package.json` vers `pnpm-workspace.yaml` pour supprimer le warning de pnpm 10.
- [x] Supprimer le script Umami non configuré qui provoquait des warnings Vite ; conserver Vercel Analytics et Speed Insights déjà intégrés.
- [x] Mettre à jour les métadonnées canoniques vers `callofchess.vercel.app`.
- [x] Documenter le contrôle du SHA GitHub contre le commit réellement déployé par Vercel.
- [x] Confirmer dans Vercel que le projet `lionchess` reste relié à `vnuswilliams/echequier`, branche `main`, et que les pushes déclenchent automatiquement un nouveau déploiement : le commit `633392f` a été créé automatiquement après le push.
- [x] Vérifier en production que le dernier SHA GitHub est le SHA servi par `callofchess.vercel.app` : le déploiement Vercel `633392f` est Ready et le domaine canonique répond correctement.

- [x] Passe interface, profil, responsive, métadonnées et partage — 2026-08-17

## E-mails d’authentification Call of Chess

- [x] Remplacer la Site URL Supabase `http://localhost:3000` par `https://callofchess.vercel.app` et autoriser cette URL de redirection.
- [x] Forcer les liens de confirmation d’inscription et de récupération vers l’origine canonique de production dans le client.
- [x] Préparer le modèle HTML responsive et contrasté Call of Chess dans `docs/email-template-confirm-signup.html`.
- [ ] Configurer un SMTP personnalisé avec une adresse d’envoi vérifiée afin de remplacer l’expéditeur par défaut Supabase Auth et activer le modèle personnalisé.

## Domaine Vercel confirmé

- [x] Vérifier dans le projet Vercel `callofchess` que le domaine de production affiché et fonctionnel est `https://www.callofchess.online`.
- [x] Aligner la Site URL et une redirection Supabase sur `https://www.callofchess.online` sans configurer de SMTP.
- [x] Remplacer les liens canoniques et les redirections d’authentification actifs de l’application par le domaine vérifié.

## Alignement UUID du code et de Supabase — 2026-08-18
- [x] Remplacer les URLs de leçons numériques par les UUID publics canoniques.
- [x] Ajouter la migration `20260818000000_convert_curriculum_ids_to_uuid.sql` pour les niveaux, leçons, exercices et progressions existantes.
- [x] Typer le client Supabase avec le schéma UUID et corriger `completed_steps` dans le code et le SQL du classement.
- [x] Vérifier Supabase après migration : 18 niveaux, 27 leçons, 23 exercices et 0 progression.
- [ ] Publier le code et vérifier le déploiement Vercel ; le test d’intégration Supabase local reste dépendant des variables `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`.

## Garantie UUID pour les futures tables — 2026-08-18
- [x] Ajouter l’event trigger `enforce_public_uuid_primary_keys` dans Supabase.
- [x] Refuser les tables publiques sans clé primaire ou avec une clé primaire non-UUID.
- [x] Tester une table UUID acceptée et une table `bigint` refusée, sans laisser de table de test.
- [x] Documenter le périmètre et la procédure administrative dans `docs/uuid-primary-key-policy.md`.
- [ ] Pousser et déployer cette nouvelle migration.

## Niveau 0 — Comprendre le jeu

- [x] Structurer six leçons bilingues : échiquier, mouvements, prises/promotion, coups spéciaux, fins de partie et synthèse.
- [x] Ajouter les positions FEN, les coups guidés, les réponses adverses, les explications et les rappels de notion.
- [x] Relier les six exercices au parcours `/path` et aux routes canoniques `/lesson/:id`.
- [x] Étendre la restauration et la sauvegarde de `lesson_progress` aux six leçons.
- [x] Seed Supabase avec une migration idempotente : `20260818010000_seed_level_zero_curriculum.sql`.
- [x] Tester la légalité de toutes les séquences avec chess.js et vérifier le rendu local du parcours et de deux leçons.


## Correctif partage des badges — 2026-08-18

- [x] Remplacer le partage natif dépendant d’une cible disponible par un partage avec repli automatique vers la copie du lien.
- [x] Ajouter le repli textarea lorsque la permission Clipboard API est refusée.
- [x] Remplacer le message « appareil » par un message d’erreur neutre, en français et en anglais.
- [x] Ajouter les tests Vitest du partage natif, du repli après échec et de la copie de secours.
- [x] Pousser le correctif et vérifier qu’il est servi sur https://www.callofchess.online.

Le commit `2c31a5a` est poussé sur `main` avec l’auteur `payongvenus@gmail.com`. Le domaine `https://callofchess.online/profile` répond correctement et le bundle public contient le nouveau message neutre ainsi que le code du partage avec repli vers la copie. La validation du bouton lui-même avec un badge débloqué reste une action manuelle nécessitant une session authentifiée.

La correction ne nécessite pas de migration Supabase ni de modification de données utilisateur.


## Test réel du partage de badge — 2026-08-18

Le test a été effectué depuis une session utilisateur connectée sur `https://callofchess.online/profile`. Le badge `Premier pas` a été partagé avec succès : le bouton est devenu `Lien copié`, puis l’URL publique `https://callofchess.online/profile?badge=first-step` a chargé correctement la page Profil. Aucun message lié à un appareil indisponible n’est apparu. Le comportement validé est le repli vers la copie du lien lorsque le partage natif n’est pas disponible dans le navigateur de test.

## Correctif mission et échiquier mobile — 18 août 2026

- [x] Rendre la mission active sticky et compacte sur mobile, sans modifier la composition desktop.
- [x] Dimensionner l’échiquier à la largeur disponible et prévenir les débordements horizontaux.
- [x] Ajouter un test Vitest du contrat de layout responsive.
- [x] Valider le typecheck, le test ciblé, le build et les aperçus mobile/desktop locaux.
- [ ] Confirmer que ce commit est servi sur `https://callofchess.online`.

## Animation de réussite et passage automatique — 21 août 2026

- [x] Afficher une animation courte et accessible après la réussite d’une leçon.
- [x] Rediriger automatiquement vers la leçon canonique suivante après la fin de l’animation.
- [x] Retourner vers `/path` après la dernière leçon, sans inventer d’identifiant.
- [x] Maintenir les messages français et anglais et respecter `prefers-reduced-motion`.
- [x] Vérifier le parcours interactif desktop, le rendu mobile 390×844, `pnpm check`, Vitest et `pnpm build`.
- [x] Pousser avec l’identité Git `payongvenus@gmail.com` et confirmer le déploiement réellement servi sur `https://callofchess.online`.

La transition utilise une durée de 1,2 seconde. Elle ne se déclenche qu’après une nouvelle complétion, pas lors de la restauration d’une leçon déjà terminée, afin d’éviter une redirection inattendue au rechargement.

Le commit `da52a268d552258d03af7b7048289ceec5b6783c` a été poussé sur `main` avec l’auteur `Payong Venus <payongvenus@gmail.com>`. Le domaine `https://callofchess.online/lesson/bc8a719d-d4e6-5d3e-90c1-58292c6fe8f4` sert le chunk dynamique `Lesson-Ch1vqSWF.js`, qui contient la durée `1200`, la destination `/path` et la surcouche `lesson-success-overlay`. L’inventaire Vercel via le connecteur retourne toutefois zéro projet et le slug direct `callofchess` renvoie 404 ; la preuve de production retenue est donc la route publique et le bundle effectivement servi.

## Refonte approfondie du Niveau 0 — 21 août 2026

- [x] Remplacer la première leçon par une lecture théorique sans échiquier : matériel, 64 cases, coordonnées, orientation, pièces, valeurs approximatives et classement Elo.
- [x] Séparer les exercices de déplacement, prises/promotion et échec/mat dans des positions dédiées.
- [x] Ajouter une leçon interactive des coups spéciaux avec roque court, roque long et prise en passant.
- [x] Ajouter quatre positions interactives de nulle : pat, répétition, règle des 50 coups et matériel insuffisant.
- [x] Remplacer la synthèse guidée par une partie complète contre un adversaire informatique débutant, avec victoire nécessaire pour valider le niveau 0.
- [x] Maintenir les six identifiants publics existants afin de préserver les progressions Supabase déjà enregistrées.
- [x] Ajouter les traductions françaises et anglaises des nouveaux états, feedbacks et boutons.
- [x] Ajouter les tests Vitest du catalogue, des positions de nulle et de l’adversaire débutant.
- [x] Vérifier localement `pnpm check`, `pnpm test -- --run` avec les variables Supabase publiques injectées et `pnpm build`.
- [x] Vérifier avant publication que `https://callofchess.online/lesson/f3a1c235-5531-4c1c-845b-6d684808259b` sert encore l’ancienne version sans 404.
- [x] Pousser le commit avec `Payong Venus <payongvenus@gmail.com>` et contrôler que le nouveau contenu est effectivement servi sur `https://www.callofchess.online`.

## Ajustement de la célébration de victoire — 21 août 2026

- [x] Prolonger l’affichage de la réussite à 2,4 secondes avant la redirection.
- [x] Ajouter un jet de 18 confettis avec les couleurs du site Call of Chess.
- [x] Conserver une annonce accessible et masquer les confettis lorsque `prefers-reduced-motion` est actif.
- [x] Vérifier localement que la carte et les confettis sont encore présents à 300–450 ms après le coup final, puis que la navigation arrive après la séquence complète.
- [x] Pousser cette nouvelle version et confirmer le bundle servi sur `https://callofchess.online`.

Le commit `cc966a6780426c1ee438c4a92fff0d2d29a9bd2a` a été poussé sur `main` avec l’identité `Payong Venus <payongvenus@gmail.com>`. Le bundle de leçon public `Lesson-CpgFF8YL.js` contient la temporisation `2400`, le markup `lesson-confetti` et la destination `/path`. Le connecteur Vercel retourne encore zéro projet dans l’équipe accessible, mais la route publique et le chunk servi confirment la version active sur `callofchess.online`.

## Redirection intelligente et déblocage du niveau 1 — 21 août 2026

- [x] Ne plus rediriger mécaniquement vers l’UUID immédiatement suivant ; choisir la première leçon publique non terminée.
- [x] Ajouter la leçon réussie au jeu local avant la navigation et rafraîchir la lecture Supabase à la fin de la célébration.
- [x] Normaliser dans `/path` les identifiants historiques de `lesson_progress` vers les UUID publics canoniques.
- [x] Revenir à `/path` lorsque les huit leçons jouables publiées sont terminées.
- [x] Relier les deux leçons de niveau 1 déjà publiées (`Prendre le centre` et `Développer avec intention`) aux exercices et aux routes `/lesson/:id`.
- [x] Vérifier les tests ciblés, la suite Vitest, le typecheck, le build, la parité des locales et le rendu local des routes 07/08.
- [ ] Pousser et vérifier le déploiement de cette correction sur `https://callofchess.online`.

Le chapitre 0 refondu est publié par le commit `60b1a6b9acd1ac508a4ced1d5e71e1bd9bf2d194` après correction du build Vercel. Le déploiement Ready `7UpZSiTj29WJTFwDRJ9kXrYQ2bjR` sert la leçon théorique sur `https://callofchess.online` ; la route a été recontrôlée avec un paramètre de cache après propagation CDN.
