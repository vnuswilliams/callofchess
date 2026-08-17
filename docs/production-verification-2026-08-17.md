# Vérification production — 2026-08-17

Le domaine `https://callofchess.vercel.app/` répond et rend la landing page ainsi que la route profonde `/lesson/1` sans 404. La landing page de production contient toutefois encore l’ancien branding `Échiquier` et l’ancien tableau statique, tandis que le dépôt local actuel contient le branding et l’échiquier interactif de Call of Chess. La route `/lesson/1` rend l’ancien panneau Stockfish avec les indicateurs techniques existants (`Analyse locale`, `Le regard du moteur`, profondeur pédagogique), et non encore le nouveau résumé pédagogique ajouté localement.

Le connecteur Vercel accessible dans cette session est actif, mais `list_projects` ne renvoie aucun projet pour l’équipe `vnuswilliams` (`team_6YEmKGlfQ7Br7pSPTmpYmPyc`). La récupération MCP du domaine public a également échoué avec `Unable to create shareable URL`. Il n’est donc pas possible de confirmer ici le commit de production ni de déclencher ou vérifier un déploiement Vercel via le projet existant.

Conclusion : la production est accessible et les routes SPA fonctionnent, mais elle sert un commit antérieur. Le dépôt local doit être poussé après validation des nouveaux changements, puis le projet Vercel relié doit être vérifié séparément avec son identifiant de projet ou depuis le tableau de bord Vercel.
