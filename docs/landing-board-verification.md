# Vérification de l’échiquier de landing

Date : 2026-08-17.

La prévisualisation locale configurée sur le port 3001 rend bien le contenu de la landing page. Le hero contient désormais un échiquier React Chessboard avec les libellés « Partie en direct », « Une partie générée à l’arrivée », le compteur de coups, la position de départ et le contrôle « Pause ». Les contrôles de lecture sont présents dans le contenu extrait, et le plateau est configuré pour accepter les déplacements manuels lorsque la lecture automatique est en pause.

La première prévisualisation sur le port 3000 était blanche parce que les variables publiques Supabase n’étaient pas injectées dans l’environnement Vite ; l’import de l’application échouait avec « Supabase public configuration is missing ». Le serveur a ensuite été relancé avec les variables de développement déjà disponibles dans l’environnement, sur le port 3001. Aucune variable ni aucun secret n’a été ajouté au dépôt.

Le rendu visuel de la capture navigateur reste blanc dans cet environnement malgré le contenu DOM/Markdown correctement extrait ; le contenu de la page confirme toutefois le montage de la landing page et du composant d’échiquier.
