# Vérification locale du parcours

Le 21 août 2026, la route `http://127.0.0.1:4173/path` s’affiche correctement avec la configuration publique Supabase injectée dans le serveur local. En session non connectée, la page affiche l’état consultable librement, le lien d’ouverture de compte et le niveau 0 comme accessible. La carte du niveau 0 propose bien des actions `JOUER` pour les six leçons disponibles.

La prévisualisation précédente sur le port 3000 était lancée sans variables Vite et affichait l’erreur de configuration Supabase ; ce point concerne uniquement l’environnement local et a été corrigé en relançant Vite sur le port 4173 avec les variables publiques déjà disponibles, sans les écrire dans le dépôt.

La route locale `/lesson/a116805b-1c51-4578-b66c-5c1d437c0cd6` affiche « LEÇON 07 / 08 », « Prendre le centre », une mission `e4` légale et une position jouable. La route `/lesson/fbdc9b42-1e39-44fc-8f3c-d4910ec99fc6` affiche « LEÇON 08 / 08 », « Développer avec intention », deux étapes guidées et le premier objectif `d4`. Aucun écran d’erreur ou débordement visible n’a été observé sur la prévisualisation desktop.

La route de production `https://callofchess.online/lesson/a116805b-1c51-4578-b66c-5c1d437c0cd6?deploy_check=410a953` a été ouverte dans le navigateur après le push. Elle sert une page `LEÇON 07 / 08`, « Prendre le centre », avec la mission `e4`, ce qui confirme que le bundle public contient le raccordement du niveau 1. La vérification publique porte sur le domaine demandé, sans utiliser de compte utilisateur ni exposer de donnée privée.
