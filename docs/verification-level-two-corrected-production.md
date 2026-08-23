# Vérification production — Positions FEN corrigées du niveau 2

La page `https://callofchess.online/path` répond correctement après le déploiement associé au commit `3744dbd`. La section `La vision tactique` est visible avec `22 leçons · 22 exercices`, dans l’ordre des 16 motifs tactiques puis des 6 menaces.

Le projet Vercel `callofchess` indique un déploiement `READY` en cible `production`, avec les alias `callofchess.online`, `www.callofchess.online` et `callofchess.vercel.app`. Le commit servi est issu du dépôt `vnuswilliams/callofchess` et a été créé avec `payongvenus@gmail.com`.

La validation locale finale confirme `48/48` positions corrigées légales, `83` tests Vitest réussis avec le niveau 3 présent, le typecheck réussi et le build Vite réussi. Supabase a été mis à jour et contrôlé sur les 16 UUID tactiques : chaque leçon possède trois étapes et un premier SAN correspondant à son FEN de départ.


La vérification visuelle finale de la leçon `Attaque double` montre bien sur l’échiquier le roi noir en `f6`, la tour noire en `c5`, le cavalier blanc en `d2` et le roi blanc en `e1`. La mission affichée est cohérente avec la séquence : `Ne4+`, échec au roi f6 et attaque de la tour c5.
