# Vérification production — 17 août 2026

La route `https://callofchess.vercel.app/parcours` renvoie encore une page Vercel `404 Page Not Found`, ce qui confirme que le déploiement public n’a pas encore intégré la route Parcours du commit récent.

La route `https://callofchess.vercel.app/profil` répond correctement avec le titre `Mon parcours Échiquier — Échiquier`, le contenu du profil et l’état non connecté. La production est donc partiellement à jour : les routes profil sont disponibles, mais `/parcours` reste absente du bundle public observé.
