# Vérification production — 17 août 2026

La route canonique `https://callofchess.vercel.app/path` doit servir le parcours ; l’ancien chemin `/parcours` est désormais un alias de compatibilité qui redirige vers `/path`. Le déploiement public historique observé renvoyait une page Vercel `404 Page Not Found` sur l’ancien chemin, avant cette harmonisation.

La route canonique `https://callofchess.vercel.app/profile` sert le profil avec le titre `Mon parcours Échiquier — Échiquier`, son contenu et l’état non connecté. Les routes canoniques anglaises à vérifier après publication sont `/lesson/1`, `/account`, `/profile`, `/path` et `/ranking`.
