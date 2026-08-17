# Vérification i18n

Le 17 août 2026, la landing locale a été ouverte puis le bouton de langue a été activé. Le bouton `EN` a basculé vers `FR`, les liens principaux sont devenus `The path`, `The method`, `Daily puzzle`, et le hero affiche `The first move matters`, `Your next move can change everything.`, `Start the lesson` et `View the method`.

La préférence est persistée par `localStorage` via `LanguageContext`. La vérification a aussi confirmé que `/lecon/2` affiche bien la leçon « Development » côté route et conserve l’échiquier jouable.

Les sections secondaires de la landing et certains libellés du footer restent encore en français en mode anglais. Cette couverture doit être complétée avant de considérer l’internationalisation comme exhaustive.
