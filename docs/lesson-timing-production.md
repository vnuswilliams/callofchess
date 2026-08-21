# Cadence des transitions de mouvements

Le commit local `6fd1043c04c645b55b1d87d6026be16ca41e3be2` contient l’animation de plateau à 650 ms et un délai de 950 ms avant le chargement de l’exercice suivant. Les vérifications locales sont vertes : `pnpm check`, 16 fichiers Vitest / 46 tests et `pnpm build`.

Après le push, le tableau Vercel affichait encore la production Ready sur `5b054cb` et un nouveau déploiement « Ralentir les transitions des mouvements » en construction. Le rafraîchissement suivant a conservé l’ancien aperçu ; le statut du nouveau déploiement doit être recontrôlé avant de tester le rythme sur le domaine public.


La liste Vercel des déploiements confirme le commit `6fd1043` avec l’aperçu `callofchess-7hmtu3vi1-vnuswilliams1.vercel.app`, marqué « Just now ». Les interactions par index ont ensuite été rendues obsolètes par le chargement dynamique et le navigateur est revenu sur `about:blank`; la vérification doit donc utiliser directement l’URL d’aperçu et la route de leçon plutôt que le clic du tableau.


## Vérification de la cadence sur l’aperçu

L’aperçu `https://callofchess-7hmtu3vi1-vnuswilliams1.vercel.app/lesson/0ce3ec0e-348e-4300-b88a-c4a939cd8960` sert le commit `6fd1043`. Juste après le coup `e4 → d5`, la page affiche `Progression 2 / 6`, la mission de la dame et la position intermédiaire avec le roi blanc réellement en `d5`. Cette fenêtre visible confirme que le mouvement n’est plus remplacé instantanément par l’exercice suivant ; l’animation de 650 ms et le délai de 950 ms laissent le temps de voir l’arrivée.


## Validation finale sur le domaine canonique

La route propre `https://callofchess.online/lesson/0ce3ec0e-348e-4300-b88a-c4a939cd8960` sert le nouveau comportement. Après le coup `e4 → d5`, la production affiche `Progression 2 / 6`, la mission de la dame et la pièce blanche arrivée en `d5` avant le chargement de la position de la dame. Le mouvement est maintenant suffisamment lent pour être suivi visuellement.
