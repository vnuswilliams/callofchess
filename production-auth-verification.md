# Vérification production de l’authentification

Le déploiement Vercel correspondant au commit `089958c5` est `lionchess-es8csc77f-vnuswilliams1.vercel.app`.

Après la fin du build, la requête GET `https://lionchess-es8csc77f-vnuswilliams1.vercel.app/api/auth/me` renvoie `{"user":null}`. La fonction serverless est donc détectée et répond correctement pour un visiteur anonyme. La page `/compte` a également été rendue correctement sur le déploiement précédent `lionchess-k3bhgbb0n-vnuswilliams1.vercel.app`.

Le domaine canonique `lionchess.vercel.app` doit encore être recontrôlé après propagation du nouveau déploiement. L’inscription avec de vraies données et le test Passkey restent volontairement non exécutés sans données utilisateur et appareil compatible.
