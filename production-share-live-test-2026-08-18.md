# Test réel du partage de badge — 2026-08-18

Une session utilisateur connectée est active sur `https://callofchess.online/profile`. Le profil affiche deux badges débloqués sur trois : `Premier pas` et `Œil de l’ouverture`. Le bouton `Partager un badge` est visible dans la carte de partage. Un clic réel sur ce bouton a été déclenché depuis le navigateur de production ; l’état après clic reste à contrôler dans l’étape suivante.


Après le clic, la page reste visuellement inchangée : le bouton affiche encore `Partager un badge`, aucun message `Partage prêt` ou `Lien copié` n’apparaît, et la console navigateur ne contient aucune erreur. Le clic doit être rejoué avec une interaction par coordonnées ou le bouton de copie doit être contrôlé séparément pour distinguer un problème d’automatisation d’un problème applicatif.


L’inspection DOM confirme que le bouton `Partager un badge` est actif (`disabled: false`) et correspond au bouton d’index DOM 4. Sa position réelle dans la fenêtre est `x=284..455`, `y=531..568`; les clics précédents à `y=383` ne ciblaient donc pas le bouton malgré l’annotation visuelle du navigateur.


Le clic rejoué sur les coordonnées exactes a réussi : le bouton est devenu `Lien copié`. L’URL publique générée est `https://callofchess.online/profile?badge=first-step`. Cette URL charge correctement la page Profil en production. Le test confirme donc le repli de partage vers la copie du lien sur cet appareil.
