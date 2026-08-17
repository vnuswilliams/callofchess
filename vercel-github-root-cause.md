# Cause racine du décalage Vercel/GitHub

Vérifié le 17 août 2026 dans le projet Vercel `vnuswilliams1/lionchess`.

La page **Settings → Git** confirme que le dépôt connecté est `vnuswilliams/echequier`, connecté environ six heures auparavant. Aucun Deploy Hook permanent n’est présent.

La page **Deployments** affiche le bandeau **GitHub Outage** : « Automatic deployments from GitHub are temporarily unavailable. You can manually create a new deployment. »

L’historique montre encore un déploiement Production basé sur `089958c`, ainsi que plusieurs redeploys de l’ancien snapshot. Les commits locaux plus récents existent dans le dépôt de travail, mais l’état local `main` est en avance de deux commits sur le remote `github/main`; le dernier commit distant connu est `b148a43`, tandis que le HEAD local est `132b6c86`.

Le remote `github` pointe vers `https://github.com/vnuswilliams/echequier.git`. Le remote `origin` pointe vers un artefact interne Cloudflare et ne doit pas être utilisé pour publier sur GitHub.

Conclusion : le projet Vercel n’est pas bloqué à cause du code du commit `089958c`. Le décalage vient de deux facteurs distincts : des commits locaux récents n’ont pas encore été poussés sur `github/main`, et l’incident GitHub empêche Vercel de recevoir automatiquement les nouveaux événements ou de résoudre certaines références de commit. La procédure corrective est de pousser explicitement vers le remote `github`, puis de relancer un déploiement manuel depuis Vercel lorsque l’interface l’accepte.
