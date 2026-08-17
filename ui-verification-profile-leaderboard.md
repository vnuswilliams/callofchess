# Vérification UI — Profil et classement

- Desktop 1280×900 : `/profil` et `/classement` s’affichent sans débordement.
- Mobile 390×844 : les titres, l’encart de confidentialité, l’état vide et les boutons restent lisibles et dans la largeur.
- Le classement présente un état vide honnête lorsque la fonction Supabase agrégée n’est pas disponible ; aucune donnée fictive n’est affichée.
- Le profil non connecté ne révèle ni email ni statistiques et propose uniquement la connexion.
- Les actions de partage restent accessibles via les boutons de la carte de badge sur le profil connecté.
