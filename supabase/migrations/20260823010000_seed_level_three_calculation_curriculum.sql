begin;

-- Niveau 3 — Calculer les variantes. Le contenu est public et idempotent ;
-- lesson_progress n'est jamais modifié par ce seed.
update public.learning_levels
set title_fr = 'Calculer les variantes',
    title_en = 'Calculate variations',
    summary_fr = 'Organiser sa réflexion avec les coups candidats, les échecs, les prises, les menaces et la visualisation.',
    summary_en = 'Organize your thinking with candidate moves, checks, captures, threats and visualization.',
    milestone_fr = 'Comparer deux variantes sans déplacer les pièces.' ,
    milestone_en = 'Compare two variations without moving the pieces.'
where slug = 'calculation';

with level as (select id from public.learning_levels where slug = 'calculation' limit 1)
insert into public.lessons (
  id, level_id, sort_order, title_fr, title_en, kicker_fr, kicker_en,
  headline_fr, headline_en, objective_fr, objective_en, starting_fen,
  steps, solution_fr, solution_en, is_published, updated_at
)
values
('c0130001-3b6d-4a1f-8c22-5d4e9f7a1001', (select id from level), 1,
 'La méthode de calcul', 'The calculation method',
 'Niveau 3 · Penser dans l’ordre', 'Level 3 · Think in order',
 'Remplacez le hasard par une routine.', 'Replace guesswork with a routine.',
 'Appliquer une boucle de calcul : observer, proposer, vérifier, continuer et évaluer.', 'Apply a calculation loop: observe, propose, verify, continue and evaluate.',
 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
 $$[{"from":"e2","to":"e4","san":"e4","answer_fr":"Calculer la réponse adverse","answer_en":"Calculate the opponent’s reply","idea_fr":"Le candidat devient une variante quand la réponse adverse est testée.","idea_en":"A candidate becomes a variation when the opponent reply is tested."}]$$::jsonb,
 'Un coup candidat est une hypothèse tant que la meilleure réponse adverse n’est pas calculée.', 'A candidate move is only a hypothesis until the opponent’s best reply is calculated.', true, now()),
('c0130002-3b6d-4a1f-8c22-5d4e9f7a1002', (select id from level), 2,
 'Les coups candidats', 'Candidate moves',
 'Niveau 3 · Réduire la recherche', 'Level 3 · Narrow the search',
 'Deux ou trois idées suffisent pour commencer.', 'Two or three ideas are enough to start.',
 'Lister les coups forcing et ne retenir que les candidats qui répondent à la position.', 'List forcing moves and keep only candidates that answer the position.',
 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
 $$[{"from":"e2","to":"e4","san":"e4","answer_fr":"e4 : un coup central qui ouvre des lignes","answer_en":"e4: a central move that opens lines","idea_fr":"Chaque candidat doit avoir une raison concrète.","idea_en":"Every candidate needs a concrete reason."}]$$::jsonb,
 'Un bon candidat a une raison concrète : échec, prise, menace ou amélioration nécessaire.', 'A good candidate has a concrete reason: check, capture, threat or necessary improvement.', true, now()),
('c0130003-3b6d-4a1f-8c22-5d4e9f7a1003', (select id from level), 3,
 'Échecs, prises, menaces', 'Checks, captures, threats',
 'Niveau 3 · Chercher les coups forcing', 'Level 3 · Find forcing moves',
 'CCT donne une direction, pas une réponse automatique.', 'CCT gives direction, not an automatic answer.',
 'Parcourir les échecs, les prises puis les menaces avant d’élargir la recherche.', 'Scan checks, captures, then threats before widening the search.',
 'r1bqk2r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 4',
 $$[{"from":"c4","to":"f7","san":"Fxf7+","answer_fr":"Les échecs","answer_en":"Checks","idea_fr":"Les échecs réduisent souvent les réponses adverses.","idea_en":"Checks often reduce the opponent’s replies."}]$$::jsonb,
 'CCT est un ordre de recherche ; le meilleur coup peut parfois être une menace calme.', 'CCT is a search order; the best move can sometimes be a quiet threat.', true, now()),
('c0130004-3b6d-4a1f-8c22-5d4e9f7a1004', (select id from level), 4,
 'La meilleure continuation', 'The best continuation',
 'Niveau 3 · Répondre à la défense', 'Level 3 · Answer the defense',
 'Le calcul commence vraiment après la réponse adverse.', 'Calculation really starts after the reply.',
 'Calculer la réponse la plus forte, puis trouver une continuation qui conserve le gain ou l’initiative.', 'Calculate the strongest reply, then find a continuation that keeps the gain or initiative.',
 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
 $$[{"from":"e2","to":"e4","san":"e4","answer_fr":"1. e4 e5 2. Cf3","answer_en":"1. e4 e5 2. Nf3","idea_fr":"Une variante alterne votre coup et la meilleure réponse adverse.","idea_en":"A variation alternates your move and the opponent’s best reply."}]$$::jsonb,
 'Ne calculez pas la réponse que vous espérez ; calculez celle qui résiste le mieux.', 'Do not calculate the reply you hope for; calculate the reply that resists best.', true, now()),
('c0130005-3b6d-4a1f-8c22-5d4e9f7a1005', (select id from level), 5,
 'Comparer les variantes', 'Compare variations',
 'Niveau 3 · Évaluer sans préférer', 'Level 3 · Evaluate without preferring',
 'Une variante se juge à sa position finale.', 'Judge a variation by its final position.',
 'Comparer deux lignes à profondeur égale avec le roi, le matériel, l’activité et les menaces.', 'Compare two lines at equal depth using king safety, material, activity and threats.',
 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
 $$[{"from":"e2","to":"e4","san":"e4","answer_fr":"Cf3 : développement et contrôle central","answer_en":"Nf3: development and central control","idea_fr":"Comparez les positions finales, pas la longueur des variantes.","idea_en":"Compare final positions, not variation length."}]$$::jsonb,
 'Ne choisissez pas la ligne qui vous plaît ; choisissez la position que vous pouvez expliquer.', 'Do not choose the line you like; choose the position you can explain.', true, now()),
('c0130006-3b6d-4a1f-8c22-5d4e9f7a1006', (select id from level), 6,
 'Visualiser un à trois coups', 'Visualize one to three moves',
 'Niveau 3 · Tenir la position future', 'Level 3 · Hold the future position',
 'Le plateau ne bouge pas : votre position mentale, oui.', 'The board stays still: your mental position moves.',
 'Visualiser une destination, puis suivre alternativement les coups sans déplacer les pièces affichées.', 'Visualize a destination, then follow alternating moves without moving the displayed pieces.',
 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
 $$[{"from":"e2","to":"e4","san":"e4","answer_fr":"Le pion blanc arrive en e4","answer_en":"The white pawn lands on e4","idea_fr":"Après chaque demi-coup, gardez la case et le trait en mémoire.","idea_en":"After every half-move, keep the square and the turn in mind."}]$$::jsonb,
 'Après chaque demi-coup, demandez quelle pièce a changé de case et qui a le trait.', 'After every half-move, ask which piece changed squares and who is to move.', true, now()),
('c0130007-3b6d-4a1f-8c22-5d4e9f7a1007', (select id from level), 7,
 'Visualiser cinq coups et reconstruire', 'Visualize five moves and rebuild',
 'Niveau 3 · Approfondir sans déplacer', 'Level 3 · Go deeper without moving',
 'Cinq demi-coups, une seule position à reconstruire.', 'Five half-moves, one position to rebuild.',
 'Maintenir une courte ligne tactique, retrouver la position finale et vérifier le prochain plan.', 'Hold a short tactical line, rebuild the final position and verify the next plan.',
 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
 $$[{"from":"e2","to":"e4","san":"e4","answer_fr":"Le fou blanc est en c4","answer_en":"The white bishop is on c4","idea_fr":"La profondeur n’a de valeur que si la position finale reste exacte.","idea_en":"Depth matters only if the final position remains accurate."}]$$::jsonb,
 'La profondeur n’a de valeur que si la position finale reste exacte et évaluable.', 'Depth matters only if the final position remains accurate and evaluable.', true, now())
on conflict (id) do update set
  level_id = excluded.level_id,
  sort_order = excluded.sort_order,
  title_fr = excluded.title_fr,
  title_en = excluded.title_en,
  kicker_fr = excluded.kicker_fr,
  kicker_en = excluded.kicker_en,
  headline_fr = excluded.headline_fr,
  headline_en = excluded.headline_en,
  objective_fr = excluded.objective_fr,
  objective_en = excluded.objective_en,
  starting_fen = excluded.starting_fen,
  steps = excluded.steps,
  solution_fr = excluded.solution_fr,
  solution_en = excluded.solution_en,
  is_published = excluded.is_published,
  updated_at = now();

with level as (select id from public.learning_levels where slug = 'calculation' limit 1)
insert into public.lesson_exercises (
  id, lesson_id, level_id, kind, sort_order, title_fr, title_en, goal_fr, goal_en,
  prompt_fr, prompt_en, solution_fr, solution_en, position_fen, expected_san
)
values
('c2130001-3b6d-4a1f-8c22-5d4e9f7a1001', 'c0130001-3b6d-4a1f-8c22-5d4e9f7a1001', (select id from level), 'calculation', 1, 'Ordonner la réflexion', 'Put the thought process in order', 'Calculer la réponse adverse.', 'Calculate the opponent reply.', 'Quelle étape vient après le coup candidat ?', 'Which step comes after the candidate move?', 'Testez la meilleure réponse adverse.', 'Test the opponent best reply.', 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 'e4'),
('c2130002-3b6d-4a1f-8c22-5d4e9f7a1002', 'c0130001-3b6d-4a1f-8c22-5d4e9f7a1001', (select id from level), 'calculation', 2, 'La dernière vérification', 'The final verification', 'Tester ce que votre coup permet.', 'Test what your move allows.', 'Quelle question ferme la boucle ?', 'Which question closes the loop?', 'Cherchez la meilleure ressource adverse.', 'Search for the opponent best resource.', 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2', 'Cf3'),
('c2130003-3b6d-4a1f-8c22-5d4e9f7a1003', 'c0130002-3b6d-4a1f-8c22-5d4e9f7a1002', (select id from level), 'calculation', 3, 'Le premier filtre', 'The first filter', 'Retenir un candidat concret.', 'Keep a concrete candidate.', 'Quel coup mérite d’entrer dans vos candidats ?', 'Which move deserves to enter your candidates?', 'e4 gagne de l’espace et libère une ligne.', 'e4 gains space and opens a line.', 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 'e4'),
('c2130004-3b6d-4a1f-8c22-5d4e9f7a1004', 'c0130002-3b6d-4a1f-8c22-5d4e9f7a1002', (select id from level), 'calculation', 4, 'Forcing ou décoratif ?', 'Forcing or decorative?', 'Donner priorité à la sécurité.', 'Prioritize safety.', 'Quel candidat oblige une réponse ?', 'Which candidate forces a reply?', 'Le roque répond à une priorité concrète.', 'Castling answers a concrete priority.', 'r1bqk2r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 4', 'O-O'),
('c2130005-3b6d-4a1f-8c22-5d4e9f7a1005', 'c0130003-3b6d-4a1f-8c22-5d4e9f7a1003', (select id from level), 'calculation', 5, 'Commencer par les échecs', 'Start with checks', 'Parcourir CCT.', 'Scan CCT.', 'Quelle famille vérifiez-vous en premier ?', 'Which family do you check first?', 'Les échecs réduisent souvent les réponses.', 'Checks often reduce replies.', 'r1bqk2r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 4', 'Fxf7+'),
('c2130006-3b6d-4a1f-8c22-5d4e9f7a1006', 'c0130003-3b6d-4a1f-8c22-5d4e9f7a1003', (select id from level), 'calculation', 6, 'La prise n’est pas suffisante', 'A capture is not enough', 'Calculer la réponse.', 'Calculate the reply.', 'Que faut-il faire après une prise ?', 'What must you do after a capture?', 'Contrôlez la recapture ou la menace.', 'Check the recapture or threat.', 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2', 'Cf3'),
('c2130007-3b6d-4a1f-8c22-5d4e9f7a1007', 'c0130004-3b6d-4a1f-8c22-5d4e9f7a1004', (select id from level), 'calculation', 7, 'Ne choisir qu’après la défense', 'Choose only after the defense', 'Respecter la réponse noire.', 'Respect Black’s reply.', 'Quelle séquence complète la ligne ?', 'Which sequence completes the line?', '1. e4 e5 2. Cf3.', '1. e4 e5 2. Nf3.', 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 'e4 e5 Cf3'),
('c2130008-3b6d-4a1f-8c22-5d4e9f7a1008', 'c0130004-3b6d-4a1f-8c22-5d4e9f7a1004', (select id from level), 'calculation', 8, 'Poursuivre l’initiative', 'Keep the initiative', 'Développer avec tempo.', 'Develop with tempo.', 'Quelle continuation suit e4 e5 ?', 'Which continuation follows e4 e5?', 'Cf3 développe et contrôle le centre.', 'Nf3 develops and controls the center.', 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 'e4 e5 Cf3'),
('c2130009-3b6d-4a1f-8c22-5d4e9f7a1009', 'c0130005-3b6d-4a1f-8c22-5d4e9f7a1005', (select id from level), 'calculation', 9, 'Comparer à profondeur égale', 'Compare at equal depth', 'Évaluer la position finale.', 'Evaluate the final position.', 'Quelle ligne est la plus explicable ?', 'Which line is easiest to explain?', 'Cf3 développe et garde le centre.', 'Nf3 develops and keeps the center.', 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 'e4 e5 Cf3'),
('c2130010-3b6d-4a1f-8c22-5d4e9f7a1010', 'c0130005-3b6d-4a1f-8c22-5d4e9f7a1005', (select id from level), 'calculation', 10, 'Savoir s’arrêter', 'Know when to stop', 'Arrêter sur une position évaluable.', 'Stop at an evaluable position.', 'Quand arrêter une branche ?', 'When should you stop a branch?', 'Quand la position finale est claire.', 'When the final position is clear.', 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2', 'Cf3'),
('c2130011-3b6d-4a1f-8c22-5d4e9f7a1011', 'c0130006-3b6d-4a1f-8c22-5d4e9f7a1006', (select id from level), 'calculation', 11, 'Un coup à l’avance', 'One move ahead', 'Visualiser une destination.', 'Visualize a destination.', 'Où arrive le pion après e4 ?', 'Where does the pawn land after e4?', 'Le pion arrive en e4.', 'The pawn lands on e4.', 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 'e4'),
('c2130012-3b6d-4a1f-8c22-5d4e9f7a1012', 'c0130006-3b6d-4a1f-8c22-5d4e9f7a1006', (select id from level), 'calculation', 12, 'Trois demi-coups', 'Three half-moves', 'Garder le trait exact.', 'Keep the exact turn.', 'Où est le cavalier après e4 e5 Cf3 ?', 'Where is the knight after e4 e5 Nf3?', 'Le cavalier blanc est en f3.', 'The white knight is on f3.', 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 'e4 e5 Cf3'),
('c2130013-3b6d-4a1f-8c22-5d4e9f7a1013', 'c0130007-3b6d-4a1f-8c22-5d4e9f7a1007', (select id from level), 'calculation', 13, 'Cinq demi-coups', 'Five half-moves', 'Reconstruire la position finale.', 'Rebuild the final position.', 'Où se trouve le fou après e4 e5 Cf3 Cc6 Fc4 ?', 'Where is the bishop after e4 e5 Nf3 Nc6 Bc4?', 'Le fou blanc est en c4.', 'The white bishop is on c4.', 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 'e4 e5 Cf3 Cc6 Fc4'),
('c2130014-3b6d-4a1f-8c22-5d4e9f7a1014', 'c0130007-3b6d-4a1f-8c22-5d4e9f7a1007', (select id from level), 'calculation', 14, 'Reconstituer avant de choisir', 'Rebuild before choosing', 'Conserver le trait noir final.', 'Keep Black to move at the end.', 'Quelle ligne complète respecte cinq demi-coups ?', 'Which complete line respects five half-moves?', '1. e4 e5 2. Cf3 Cc6 3. Fc4.', '1. e4 e5 2. Nf3 Nc6 3. Bc4.', 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 'e4 e5 Cf3 Cc6 Fc4')
on conflict (id) do update set
  lesson_id = excluded.lesson_id,
  level_id = excluded.level_id,
  kind = excluded.kind,
  sort_order = excluded.sort_order,
  title_fr = excluded.title_fr,
  title_en = excluded.title_en,
  goal_fr = excluded.goal_fr,
  goal_en = excluded.goal_en,
  prompt_fr = excluded.prompt_fr,
  prompt_en = excluded.prompt_en,
  solution_fr = excluded.solution_fr,
  solution_en = excluded.solution_en,
  position_fen = excluded.position_fen,
  expected_san = excluded.expected_san;

commit;
