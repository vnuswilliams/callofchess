# Cause racine du décalage Vercel/GitHub

Vérifié le 17 août 2026 dans le projet Vercel `vnuswilliams1/lionchess`.

La page **Settings → Git** confirme que le dépôt connecté est `vnuswilliams/echequier`, connecté environ six heures auparavant. Aucun Deploy Hook permanent n’est présent.

La page **Deployments** affiche le bandeau **GitHub Outage** : « Automatic deployments from GitHub are temporarily unavailable. You can manually create a new deployment. »

L’historique montre encore un déploiement Production basé sur `089958c`, ainsi que plusieurs redeploys de l’ancien snapshot. Les commits locaux plus récents existent dans le dépôt de travail, mais l’état local `main` est en avance de deux commits sur le remote `github/main`; le dernier commit distant connu est `b148a43`, tandis que le HEAD local est `132b6c86`.

Le remote `github` pointe vers `https://github.com/vnuswilliams/echequier.git`. Le remote `origin` pointe vers un artefact interne Cloudflare et ne doit pas être utilisé pour publier sur GitHub.

Conclusion : le projet Vercel n’est pas bloqué à cause du code du commit `089958c`. Le décalage vient de deux facteurs distincts : des commits locaux récents n’ont pas encore été poussés sur `github/main`, et l’incident GitHub empêche Vercel de recevoir automatiquement les nouveaux événements ou de résoudre certaines références de commit. La procédure corrective est de pousser explicitement vers le remote `github`, puis de relancer un déploiement manuel depuis Vercel lorsque l’interface l’accepte.


## Reprise constatée après correction

Après le push explicite vers `github/main` du commit `1bfc96d`, Vercel a créé un nouveau déploiement Production lié directement à `1bfc96d` et à la branche `main`. Son état est `Building` au moment du contrôle. Cette entrée n’est plus un redeploy d’un ancien snapshot ; elle référence le commit GitHub exact. Le bandeau GitHub Outage reste affiché, mais le pipeline a accepté cette publication manuelle.


## Déploiement rétabli

Le déploiement créé depuis `1bfc96d` est passé de `Building` à `Ready` en Production. Vercel affiche le lien GitHub vers `1bfc96d`, la branche `main` et l’URL de déploiement `lionchess-oa2uafbx5-vnuswilliams1.vercel.app`. Le projet ne reste donc plus bloqué sur `089958c` pour cette publication.


## Vérification publique

La route directe `/profil` répond correctement sur `https://lionchess-oa2uafbx5-vnuswilliams1.vercel.app/profil` et sur `https://callofchess.vercel.app/profil`. Le titre est `Mon parcours Échiquier — Échiquier`, et l’état non connecté affiche bien le parcours prévu. Le domaine canonique suit donc le nouveau déploiement Ready issu de `1bfc96d`.


## Publication du parcours

Le commit `a415fb6` contenant la page `/parcours`, le catalogue des 18 niveaux et ses tests est poussé sur `github/main`. Lors du contrôle Vercel, l’historique affiche encore `1bfc96d` comme dernier déploiement et le bandeau GitHub Outage est toujours visible ; `a415fb6` n’a pas encore été indexé. Le déploiement précédent reste Ready et continue de servir la version documentée précédente.


## Contrôle après publication du parcours

À 15:31, le dashboard Vercel affiche toujours `1bfc96d` comme dernier déploiement Production Ready. Le commit `a415fb6` est bien poussé sur GitHub mais n’apparaît pas encore dans l’historique Vercel. Le bandeau « GitHub Outage — Automatic deployments from GitHub are temporarily unavailable » reste visible. La création manuelle doit être relancée lorsque le formulaire accepte la référence ; le précédent déploiement reste stable.


## Vérification publique du parcours

Le domaine canonique `https://callofchess.vercel.app/parcours` renvoie actuellement la page 404 de l’ancien déploiement. L’historique Vercel confirme que `1bfc96d` reste le dernier déploiement Production Ready et que le bandeau GitHub Outage est toujours actif. Le commit `a415fb6` est présent sur `github/main`, mais n’est pas encore déployé.


## Tentative de création manuelle

Le lien Create Deployment fourni par Vercel a ouvert un ancien déploiement `Hwp4fzHSp` basé sur `6e1be0e`, marqué Ready mais Stale, et non le commit demandé `a415fb6`. Cela confirme que la panne GitHub empêche Vercel de résoudre la révision actuelle ; la production canonique reste sur une version antérieure et `/parcours` renvoie 404.


## Classement public — prérequis de sécurité

La création de `leaderboard_profiles` et de la fonction `get_public_leaderboard` a été tentée avec RLS et opt-in obligatoire, mais le canal SQL Supabase a renvoyé une erreur de connexion sans appliquer la migration. Aucune donnée de classement n’est donc affichée ou inventée. L’interface devra rester en état vide tant que cette migration n’est pas confirmée.
