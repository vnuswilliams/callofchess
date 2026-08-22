# Vérification locale — Niveau 1 approfondi

Le 22 août 2026, la route locale `/path` affiche le Niveau 1 avec six leçons et six exercices : les objectifs d’une position, les principes d’ouverture, roi en sécurité et roquer, gagner du matériel, créer des menaces et que veut faire l’adversaire. Le jalon visible rappelle « Avant chaque coup, demander ce que veut faire l’adversaire. »

La page reste dans la direction visuelle existante de l’Atelier de l’Ouverture : fond ivoire, titres éditoriaux, plateau et cartes de parcours. La capture desktop observée ne montre pas de débordement horizontal dans le premier écran. Le parcours non connecté affiche correctement l’état « À débloquer 0/6 » sans inventer de progression et invite à se connecter pour sauvegarder.

La vérification suivante doit ouvrir une leçon Niveau 1 directement, contrôler la bandeau « À lire avant de jouer », la question de réflexion, les positions et le rendu mobile. Les tests automatisés ont déjà confirmé la légalité des positions du catalogue et des réponses adverses.


La route locale `/lesson/a116805b-1c51-4578-b66c-5c1d437c0cd6` affiche `LEÇON 07 / 12`, le titre « Les objectifs d’une position », la mission de mat en un coup, puis le bandeau « À lire avant de jouer » avec la question « Quel est l’objectif concret de cette position ? ». Le clic sur la dame en f7 puis sur g7 a validé la position et avancé à la mission suivante ; l’historique affiche `1. Dg7#`. Le plateau et les cartes restent lisibles dans le viewport de contrôle, sans erreur visible.


La route directe de la leçon 12 `/lesson/a5c7e2f1-8b39-4d64-9e10-5f6a7b2c3d48` charge correctement `LEÇON 12 / 12`. En anglais, le titre, l’objectif, la mission, la carte d’aide et le bandeau théorique sont traduits : « What does my opponent want? What does my move allow them to do? ». Cette bascule confirme la parité FR/EN des nouveaux contenus visibles.


## Vérification de production

Le domaine canonique `https://callofchess.online` répond en HTTP 200 pour la route de la leçon 12. La variante `https://www.callofchess.online` redirige en HTTP 308 vers l’apex, servi par Vercel. Les en-têtes indiquent `server: Vercel`, une ressource HTML modifiée le 22 août 2026 à 06:10:56 UTC et un cache Vercel HIT. Les bundles JavaScript récupérés depuis le domaine contiennent les marqueurs bilingues `À lire avant de jouer` et `Read before playing`, ce qui confirme que la nouvelle interface est compilée et effectivement servie en production.

Le connecteur de diagnostic Vercel n’a pas exposé le projet existant dans l’équipe autorisée : l’inventaire renvoie zéro projet, la création signale toutefois que `callofchess` existe déjà, et la récupération par slug renvoie 404. Le déploiement a néanmoins été vérifié par le domaine public et les marqueurs du bundle ; aucune modification de configuration Vercel n’a été effectuée.
