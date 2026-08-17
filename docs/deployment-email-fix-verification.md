# Vérification de la correction de déploiement

## Résultat

Le déploiement Vercel du commit `51af0e8` était bloqué parce que son e-mail de commit était `1.0629668e+08+vnuswilliams@users.noreply.github.com`, une adresse que Vercel ne pouvait pas associer à un compte GitHub.

L’adresse `payongvenus@gmail.com` est déjà présente et vérifiée sur le compte GitHub `vnuswilliams`. L’identité Git du dépôt a été configurée de manière persistante avec :

```bash
git config --local user.name "vnuswilliams"
git config --local user.email "payongvenus@gmail.com"
```

La configuration globale de l’environnement a également été alignée sur la même adresse.

## Publication effectuée

Le guide `docs/DEPLOYMENT.md` a été mis à jour pour documenter cette configuration. Le commit `84f38cc6139dd0d938c4c06b46e3bae4c138004e` a été poussé sur `main`.

Vercel a créé le déploiement `lionchess-e6y93mbxr-vnuswilliams1.vercel.app` à partir de ce commit et l’a marqué **Ready**. Le domaine de production `https://callofchess.vercel.app/` et la route profonde `https://callofchess.vercel.app/lesson/1` répondent correctement.

## Limitation observée

Les anciennes entrées historiques restent affichées comme **Blocked** dans l’historique Vercel, car elles pointent vers des commits déjà créés avec l’ancienne adresse non associée. Le nouveau déploiement sain remplace fonctionnellement ces snapshots pour la production ; leur redeploy individuel ne changerait pas l’e-mail du commit historique.

La CI GitHub du nouveau commit a encore échoué indépendamment de Vercel. Le workflow exige les secrets GitHub `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`, mais le jeton disponible dans cette session n’a pas la permission de lire ou modifier les secrets du dépôt.
