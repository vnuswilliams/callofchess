# Échiquier

Échiquier est une landing page française pour un MVP d’apprentissage des échecs. Le projet est une application React et Vite pensée pour évoluer vers des leçons interactives, des puzzles quotidiens et un suivi de progression.

## Démarrage local

Le projet utilise Node.js 22 et pnpm.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

L’application est ensuite accessible via l’URL indiquée par Vite. La vérification de types et la construction de production sont disponibles avec :

```bash
pnpm check
pnpm build
```

## Déploiement Vercel

La configuration `vercel.json` fixe l’installation avec pnpm, lance `pnpm build` et publie le dossier statique `dist/public`. Le fallback vers `index.html` permet au routage client de fonctionner pour les futures pages de l’application.

Une fois le dépôt connecté à Vercel, chaque push vers la branche de production déclenche un déploiement de production ; les autres branches produisent des prévisualisations.

## Principes du projet

Le design « L’Atelier de l’Ouverture » associe une direction éditoriale tactile, des tons vert encre, ivoire et safran, ainsi qu’un mode sombre mémorisé. Les visuels sont référencés par des URL publiques afin d’être accessibles aussi bien depuis Vercel que dans l’environnement de développement.
