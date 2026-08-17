# Déploiement GitHub → Vercel

## Contrat attendu

Le dépôt source est `vnuswilliams/echequier`. La branche de production est `main` et le projet Vercel est `lionchess`, avec `callofchess.vercel.app` comme domaine canonique de l’application.

Le remote nommé `github` doit pointer vers :

```text
https://github.com/vnuswilliams/echequier.git
```

Le remote `origin` peut être injecté par l’environnement WebDev et pointer vers un artefact interne. Il ne doit pas être utilisé pour publier le code sur GitHub.

## Publication contrôlée

Avant de pousser, vérifiez la branche et le commit :

```bash
git status --short --branch
git log --oneline -5
git remote -v
pnpm check
pnpm test
pnpm build
```

Publiez ensuite explicitement vers le remote GitHub :

```bash
git add -A
git commit -m "Describe the change"
git push github main
```

Vérifiez que le remote suit le commit attendu :

```bash
git rev-parse HEAD
git rev-parse github/main
```

Les deux SHA doivent être identiques avant d’attendre Vercel.

## Vérification Vercel

Dans **Project Settings → Git**, le dépôt doit être `vnuswilliams/echequier`. Dans **Deployments**, cherchez le SHA exact du commit poussé. Une ligne « Redeploy of … » peut simplement republier un ancien snapshot ; elle ne prouve pas que le dernier commit GitHub a été compilé.

Pour une route SPA, vérifiez à la fois `/` et une route profonde comme `/lecon/1` ou `/profil`. Le fichier `vercel.json` doit conserver la réécriture vers `/` lorsque `cleanUrls` est activé.

## Incident `089958c`

Le commit `089958c` n’est pas une preuve de régression applicative. Il est seulement le dernier commit que Vercel a pu indexer avant l’incident GitHub du 17 août 2026. Le dashboard Vercel affichait alors une indisponibilité des déploiements automatiques GitHub, tandis que l’historique continuait à proposer des redeploys de snapshots anciens.

La procédure sûre est la suivante : pousser d’abord `github/main`, vérifier le SHA distant, puis relancer le déploiement manuel lorsque Vercel accepte à nouveau la référence. Tout Deploy Hook créé pour le diagnostic doit être révoqué immédiatement après usage. Ne committez jamais son URL.

## Environnement et secrets

Les variables publiques Supabase `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` doivent exister dans les environnements Vercel nécessaires. Aucun fichier `.env` ne doit être commité. Les secrets serveur, tokens de hook et cookies ne doivent jamais apparaître dans les logs, captures ou messages de commit.

## Références de diagnostic

Le rapport `vercel-github-root-cause.md` conserve les observations de l’incident. Les vérifications Supabase et de domaine sont archivées dans les fichiers `production-supabase-verification.md` et `production-domain-verification.md`.
