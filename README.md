# Échiquier — plateforme d’apprentissage des échecs

Échiquier est une application React/Vite bilingue dédiée à l’apprentissage progressif des échecs. Elle combine des leçons jouables, des explications pédagogiques, une analyse Stockfish côté navigateur, un suivi de progression Supabase et un profil personnel avec statistiques, badges et partage social.

## Démarrage local

Le projet utilise Node.js 24 et pnpm. La version majeure est verrouillée par `package.json` (`engines.node: 24.x`) et `.nvmrc` afin de rester alignée avec Vercel.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Les vérifications principales sont :

```bash
pnpm check
pnpm test
pnpm build
```

Le serveur de développement est lancé par le script du projet et choisit le port fourni par l’environnement. Ne codez jamais un port fixe dans l’application.

## Architecture applicative

| Zone | Responsabilité |
| --- | --- |
| `client/src/App.tsx` | Providers globaux, analytics et routes SPA. |
| `client/src/pages/Lesson.tsx` | Leçons jouables, validation chess.js, feedback et progression. |
| `client/src/lib/levelZeroLessons.ts` | Catalogue partagé des leçons bilingues, positions FEN et séquences de coups des niveaux 0 et 1, enrichi avec le niveau 2. |
| `client/src/lib/levelTwoLessons.ts` | Catalogue bilingue approfondi des 22 leçons tactiques du Niveau 2, avec théorie et 66 positions d’exercice légales. |
| `client/src/pages/Account.tsx` | Inscription, connexion, récupération et gestion de session. |
| `client/src/pages/Profile.tsx` | Progression privée, statistiques, badges et partage. |
| `client/src/lib/supabase.ts` | Instance unique du client Supabase côté navigateur. |
| `client/src/lib/profileStats.ts` | Calcul pur des statistiques de progression. |
| `client/src/lib/profileBadges.ts` | Calcul pur des succès depuis les leçons terminées. |
| `client/src/contexts/LanguageContext.tsx` | Préférence de langue française/anglaise. |
| `vercel.json` | Build Vercel et réécriture des routes profondes de la SPA. |

La logique d’échecs et les calculs de profil sont séparés du rendu React. Cette séparation permet de tester les règles sans dépendre du navigateur et évite d’afficher des données inventées.

## Supabase et confidentialité

Le navigateur utilise uniquement `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`. Ces variables sont publiques par conception. La protection réelle repose sur Supabase Auth et les politiques Row Level Security des tables `profiles` et `lesson_progress`.

Les écrans de profil ne doivent jamais publier l’adresse email, les identifiants Supabase, les statistiques privées détaillées ou des données utilisateur inventées. Toute donnée publique future, comme un classement, devra utiliser un nom d’affichage explicite et une politique RLS dédiée.

## Tests

Les tests Vitest couvrent notamment le parsing Stockfish, le feedback pédagogique, la santé Supabase, les statistiques du profil, les seuils de badges et la légalité des séquences du Niveau 0. Les seeds curriculum sont `supabase/migrations/20260818010000_seed_level_zero_curriculum.sql`, `supabase/migrations/20260822010000_seed_level_one_deep_curriculum.sql` et `supabase/migrations/20260823010000_seed_level_two_tactical_curriculum.sql`. Avant chaque commit fonctionnel, exécutez `pnpm check && pnpm test && pnpm build`.

## Déploiement Vercel

Le projet Vercel de production est servi sur `https://www.callofchess.online`, avec le dépôt GitHub privé `vnuswilliams/callofchess` et la branche `main`. `vercel.json` configure l’installation pnpm, `pnpm build`, le dossier `dist/public` et la réécriture SPA nécessaire aux routes comme `/lesson/:id`, `/profile`, `/path` et `/ranking`. Les anciens chemins français redirigent vers leurs équivalents anglais.

Pour publier une version :

```bash
git status
git remote -v
git add -A
git commit -m "Describe the change"
git push origin main
```

Le remote `origin` pointe vers le dépôt GitHub officiel `vnuswilliams/callofchess`. Avant un push, l’identité Git doit être `Payong Venus <payongvenus@gmail.com>` afin de respecter le raccordement de publication du projet.

## Dépannage d’un déploiement bloqué

Si Vercel reste sur un ancien commit, vérifiez successivement les points suivants :

1. `git log --oneline -5` doit montrer le commit attendu localement.
2. `git rev-parse origin/main` doit correspondre au commit poussé.
3. Settings → Git doit afficher `vnuswilliams/callofchess` et la branche `main`.
4. L’historique Deployments doit afficher le SHA attendu, pas seulement un redeploy d’un ancien snapshot.
5. Le bandeau GitHub Outage doit être contrôlé avant de conclure à une erreur de code.

Un Deploy Hook peut servir de diagnostic ponctuel, mais il doit être révoqué après usage et son URL ne doit jamais être commitée ou communiquée. Les références et les constats de l’incident du 17 août 2026 sont conservés dans `vercel-github-root-cause.md`.

## Documentation complémentaire

Le guide [`docs/I18N.md`](docs/I18N.md) explique comment ajouter une langue, créer une clé de traduction, organiser les domaines JSON et vérifier la parité entre les langues.

Les fichiers `production-auth-verification.md`, `production-domain-verification.md`, `production-supabase-verification.md`, `supabase-schema-verification.md` et `vercel-github-root-cause.md` conservent les décisions et contrôles spécifiques réalisés pendant le projet. Les fichiers de statut temporaires d’audit ne doivent pas contenir de secrets ni de tokens de déploiement.
