# Diagnostic du bouton de niveau sur `/path`

Date du contrôle : 22 août 2026.

La page publique `https://callofchess.online/path` affiche 18 niveaux et 57 exercices structurés. Le niveau 0 présente six exercices jouables avec des liens `/lesson/:uuid`; son bouton global « Jouer la leçon » pointe actuellement vers la première leçon du niveau, indépendamment des progressions déjà terminées.

Le niveau 1 affiche trois exercices (« Prendre le centre », « Développer avec intention », « Le roi à l’abri »), mais le code local ne fournit actuellement des identifiants publics que pour les deux premiers. Les autres niveaux affichés sont verrouillés et ne présentent pas de bouton global jouable.

La correction doit donc sélectionner le premier exercice jouable non terminé dans l’ordre pédagogique du niveau. Si toutes les leçons jouables de ce niveau sont déjà terminées, elle doit conserver un repli sûr vers la dernière leçon jouable du niveau afin de ne jamais générer une route 404. Elle ne doit pas inventer de cible pour un exercice sans contenu/UUID publié.

La lecture Supabase confirme que `lesson_progress` contient `lesson_id` (UUID), `completed` et `completed_steps`, avec RLS activé. Aucune migration ni modification de données n’est nécessaire pour ce changement de navigation.

## Vérification locale

La version locale chargée sur `http://localhost:3000/path` conserve la mise en page éditoriale mobile/desktop et le bouton global du niveau 0. Les cartes des niveaux suivants restent verrouillées lorsqu’aucune session n’est active, ce qui est cohérent avec le code existant. Le helper de reprise est pur et ne change ni la structure Supabase ni les états visuels de la page.

Le contrôle DOM local confirme qu’un seul bouton global « Jouer la leçon » est rendu pour le niveau 0 ouvert et qu’il pointe vers `/lesson/f3a1c235-5531-4c1c-845b-6d684808259b` lorsque la progression est vide. Les liens individuels restent séparés et conservent leurs routes propres.

## Contrôle après publication

Après le push du commit `2356993`, la page `https://callofchess.online/path?resume-check=2356993` répond correctement et conserve la route `/path`, les cartes de niveaux et le bouton « Jouer la leçon » du niveau 0. Le connecteur Vercel n’expose toutefois aucun projet dans l’équipe autorisée (`projects: []`), donc l’état Ready et le SHA de déploiement ne peuvent pas être confirmés par ce connecteur dans cette session. La vérification publique de la page est positive, mais la présence exacte du nouveau chunk reste à confirmer par le contenu servi ou l’historique Vercel.

Le tableau de bord Vercel est accessible via le navigateur et montre le projet `callofchess`, le domaine `callofchess.online`, le dépôt `vnuswilliams/callofchess` et une entrée récente intitulée « Resume the latest unplayed lesson per level ». Le connecteur MCP Vercel ne reflète pas cette liste et retourne toujours `projects: []`; le tableau de bord navigateur devient donc la source de vérification du statut de déploiement pour cette session.

Le détail Vercel est maintenant confirmé dans le tableau de bord : déploiement `6hhyYu3FJW9AvLLEMnhJPtQ9wqV8`, statut **Ready**, environnement **Production**, domaine `callofchess.online`, branche `main`, commit `2356993 Resume the latest unplayed lesson per level`, créé il y a environ deux minutes. Le domaine canonique est donc bien associé à la version poussée.
