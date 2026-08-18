# Vérification du domaine de production

Le tableau de bord Vercel authentifié confirme que le projet `callofchess` est relié au dépôt GitHub `vnuswilliams/callofchess` et que son déploiement de production actuel est **Ready**.

| Élément | Valeur vérifiée |
| --- | --- |
| Projet Vercel | `callofchess` |
| Domaine de production affiché par Vercel | `https://www.callofchess.online` |
| Domaine de déploiement Vercel | `callofchess-epm7reypu-vnuswilliams1.vercel.app` |
| Commit actuellement servi au moment de l’inspection Vercel | `25c8aba` — `refactor: refresh Call of Chess visual system` |
| Branche de production | `main` |
| Dépôt lié | `vnuswilliams/callofchess` |
| Statut | `Ready` |

La route `https://www.callofchess.online/account` répond et affiche le titre `Compte — Call of Chess`. `callofchess.vercel.app` répond également publiquement, mais Vercel affiche `www.callofchess.online` comme domaine de production principal.

La configuration Supabase a été alignée sur le domaine vérifié : la **Site URL** est maintenant `https://www.callofchess.online`, et cette même URL a été ajoutée aux redirections autorisées. L’ancien alias `https://callofchess.vercel.app` reste temporairement autorisé pour éviter de casser un ancien lien, mais il n’est plus utilisé comme destination canonique.

Aucun SMTP ni modèle d’e-mail personnalisé n’a été configuré.
