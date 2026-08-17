# Vérification Supabase en production

Le domaine canonique `https://callofchess.vercel.app/compte` répond après le redéploiement Vercel déclenché par l’ajout des variables publiques Supabase.

La page affiche les parcours :

- Connexion email/mot de passe ;
- Création de compte ;
- Connexion par Passkey.

Vercel confirme la présence des variables `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` dans les environnements Production et Preview. Les valeurs ne sont pas consignées dans le dépôt.
