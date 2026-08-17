# Échiquier — plateforme d’apprentissage des échecs

Échiquier est une application React/Vite bilingue dédiée à l’apprentissage progressif des échecs. Elle combine des leçons jouables, des explications pédagogiques, une analyse Stockfish côté navigateur, un suivi de progression Supabase et un profil personnel avec statistiques, badges et partage social.

## Démarrage local

Le projet utilise Node.js 22 et pnpm.

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
| `client/src/pages/Lesson.tsx` | Leçons jouables, validation chess.js, feedback et Stockfish. |
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

Les tests Vitest couvrent notamment le parsing Stockfish, le feedback pédagogique, la santé Supabase, les statistiques du profil et les seuils de badges. Avant chaque commit fonctionnel, exécutez `pnpm check && pnpm test && pnpm build`.

## Déploiement Vercel

Le projet Vercel attendu est `lionchess`, connecté au dépôt GitHub `vnuswilliams/echequier` et à la branche `main`. `vercel.json` configure l’installation pnpm, `pnpm build`, le dossier `dist/public` et la réécriture SPA nécessaire aux routes comme `/lecon/1` et `/profil`.

Pour publier une version :

```bash
git status
git remote -v
git add -A
git commit -m "Describe the change"
git push github main
```

Le remote `github` est la destination GitHub officielle. Le remote `origin` peut pointer vers un artefact interne du projet et ne doit pas être utilisé pour publier sur GitHub.

## Dépannage d’un déploiement bloqué

Si Vercel reste sur un ancien commit, vérifiez successivement les points suivants :

1. `git log --oneline -5` doit montrer le commit attendu localement.
2. `git rev-parse github/main` doit correspondre au commit poussé.
3. Settings → Git doit afficher `vnuswilliams/echequier` et la branche `main`.
4. L’historique Deployments doit afficher le SHA attendu, pas seulement un redeploy d’un ancien snapshot.
5. Le bandeau GitHub Outage doit être contrôlé avant de conclure à une erreur de code.

Un Deploy Hook peut servir de diagnostic ponctuel, mais il doit être révoqué après usage et son URL ne doit jamais être commitée ou communiquée. Les références et les constats de l’incident du 17 août 2026 sont conservés dans `vercel-github-root-cause.md`.

## Documentation complémentaire

Les fichiers `production-auth-verification.md`, `production-domain-verification.md`, `production-supabase-verification.md`, `supabase-schema-verification.md` et `vercel-github-root-cause.md` conservent les décisions et contrôles spécifiques réalisés pendant le projet. Les fichiers de statut temporaires d’audit ne doivent pas contenir de secrets ni de tokens de déploiement.
