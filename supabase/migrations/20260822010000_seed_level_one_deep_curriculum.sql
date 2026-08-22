begin;

-- Niveau 1 approfondi : contenu public uniquement, sans modification de lesson_progress.
with level as (select id from public.learning_levels where slug = 'fundamentals' limit 1)
insert into public.lessons (
  id, level_id, sort_order, title_fr, title_en, kicker_fr, kicker_en,
  headline_fr, headline_en, objective_fr, objective_en, starting_fen,
  steps, solution_fr, solution_en, is_published, updated_at
)
values
(
  'a116805b-1c51-4578-b66c-5c1d437c0cd6', (select id from level), 1,
  'Les objectifs d’une position', 'The goals of a position',
  'Fondamentaux · Lire avant d’agir', 'Fundamentals · Read before acting',
  'Un bon coup sert un objectif précis.', 'A good move serves a precise goal.',
  'Reconnaître six objectifs : mater, protéger le roi, gagner du matériel, créer une menace, améliorer une pièce et gagner un tempo.',
  'Recognize six goals: checkmate, king safety, winning material, creating a threat, improving a piece and gaining a tempo.',
  '7k/5Q2/6K1/8/8/8/8/8 w - - 0 1',
  $$[{"from":"f7","to":"g7","san":"Dg7#","answer_fr":"Trouvez l’échec et mat.","answer_en":"Find checkmate.","idea_fr":"Le mat termine la partie.","idea_en":"Checkmate ends the game."},{"from":"e1","to":"g1","san":"O-O","answer_fr":"Mettez le roi en sécurité.","answer_en":"Keep the king safe.","idea_fr":"Le roque protège le roi et active une tour.","idea_en":"Castling shelters the king and activates a rook."},{"from":"e2","to":"d3","san":"Dxd3","answer_fr":"Gagnez le matériel attaqué.","answer_en":"Win the attacked material.","idea_fr":"Vérifiez les prises avant le coup calme.","idea_en":"Check captures before a quiet move."},{"from":"d2","to":"c3","san":"Dxc3","answer_fr":"Répondez à la menace adverse.","answer_en":"Answer the opponent’s threat.","idea_fr":"Le fou attaquait la dame.","idea_en":"The bishop attacked the queen."},{"from":"b2","to":"c4","san":"Cc4","answer_fr":"Améliorez votre pièce la moins active.","answer_en":"Improve your least active piece.","idea_fr":"Une case centrale augmente son activité.","idea_en":"A central square increases its activity."},{"from":"e2","to":"e8","san":"Te8+","answer_fr":"Gagnez un tempo avec échec.","answer_en":"Gain a tempo with check.","idea_fr":"L’échec force une réponse.","idea_en":"Check forces a reply."}]$$::jsonb,
  'Avant de choisir un coup, nommez son objectif et vérifiez la réponse adverse.',
  'Before choosing a move, name its goal and check the opponent reply.', true, now()
),
(
  'fbdc9b42-1e39-44fc-8f3c-d4910ec99fc6', (select id from level), 2,
  'Les principes d’ouverture', 'Opening principles',
  'Ouverture · Comprendre, ne pas réciter', 'Opening · Understand, do not recite',
  'Construisez une position qui joue toute seule.', 'Build a position that plays itself.',
  'Relier centre, développement rapide, pièces mineures, roque, dame et tours connectées.',
  'Connect the center, rapid development, minor pieces, castling, queen timing and connected rooks.',
  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  $$[{"from":"e2","to":"e4","san":"e4","answer_fr":"Contrôlez le centre.","answer_en":"Control the center.","idea_fr":"e4 ouvre des lignes et gagne de l’espace.","idea_en":"e4 opens lines and gains space."},{"from":"g1","to":"f3","san":"Cf3","answer_fr":"Sortez une pièce mineure.","answer_en":"Develop a minor piece.","idea_fr":"Le cavalier contrôle le centre.","idea_en":"The knight controls the center."},{"from":"b1","to":"c3","san":"Cc3","answer_fr":"Développez la seconde pièce mineure.","answer_en":"Develop the second minor piece.","idea_fr":"Les pièces coordonnées contrôlent plus de cases.","idea_en":"Coordinated pieces control more squares."},{"from":"e1","to":"g1","san":"O-O","answer_fr":"Roquez et connectez vos tours.","answer_en":"Castle and connect your rooks.","idea_fr":"Le roi devient plus sûr et la tour plus active.","idea_en":"The king becomes safer and the rook more active."}]$$::jsonb,
  'Le début de partie sert à donner des cases à vos pièces, à les développer et à mettre le roi à l’abri.',
  'The opening gives your pieces squares, develops them and keeps the king safe.', true, now()
),
(
  'd7b4c6a1-0cb9-4e92-8d7a-7e2f1b1b8e01', (select id from level), 3,
  'Roi en sécurité et roquer', 'King safety and castling',
  'Fondamentaux · Le roi d’abord', 'Fundamentals · The king first',
  'Ne laissez pas votre roi jouer seul au centre.', 'Do not leave your king alone in the center.',
  'Préparer le roque, vérifier les cases traversées et choisir la sécurité avant une attaque décorative.',
  'Prepare castling, check the crossed squares and choose safety before a decorative attack.',
  'r1bqk2r/ppppbppp/2n2n2/4p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 4',
  $$[{"from":"e1","to":"g1","san":"O-O","answer_fr":"Roquez lorsque le chemin est libre.","answer_en":"Castle when the path is clear.","idea_fr":"Le roi quitte le centre.","idea_en":"The king leaves the center."},{"from":"e1","to":"g1","san":"O-O","answer_fr":"Choisissez la sécurité.","answer_en":"Choose safety.","idea_fr":"Le roque réduit les échecs contre le roi.","idea_en":"Castling reduces checks against the king."},{"from":"e1","to":"c1","san":"O-O-O","answer_fr":"Reconnaissez aussi le roque long.","answer_en":"Recognize queenside castling too.","idea_fr":"Le roi se déplace de deux cases vers la tour.","idea_en":"The king moves two squares toward the rook."}]$$::jsonb,
  'Un roi en sécurité vous donne le temps de développer et de créer des menaces.',
  'A safe king gives you time to develop and create threats.', true, now()
),
(
  'e10f3b2a-6d35-4f9d-a5f8-62f69f7d9c12', (select id from level), 4,
  'Gagner du matériel sans le donner', 'Win material without giving it away',
  'Fondamentaux · Compter avant de prendre', 'Fundamentals · Count before capturing',
  'Une prise utile commence par une vérification.', 'A useful capture starts with a check.',
  'Repérer une pièce attaquée, comparer les échanges et vérifier la recapture adverse.',
  'Spot an attacked piece, compare exchanges and check the opponent recapture.',
  '4k3/8/8/8/8/3r4/4Q3/4K3 w - - 0 1',
  $$[{"from":"e2","to":"d3","san":"Dxd3","answer_fr":"Prenez la tour exposée.","answer_en":"Capture the exposed rook.","idea_fr":"La dame gagne cinq points de matériel.","idea_en":"The queen wins five points of material."},{"from":"c3","to":"d4","san":"Fxd4","answer_fr":"Comparez les échanges.","answer_en":"Compare the exchanges.","idea_fr":"Le fou prend le cavalier.","idea_en":"The bishop captures the knight."},{"from":"d2","to":"c3","san":"Dxc3","answer_fr":"Supprimez la menace matérielle.","answer_en":"Remove the material threat.","idea_fr":"Une prise peut être défensive.","idea_en":"A capture can be defensive."}]$$::jsonb,
  'Comptez les attaquants, les défenseurs et la réponse adverse avant de prendre.',
  'Count attackers, defenders and the opponent reply before capturing.', true, now()
),
(
  'f24a9d63-4c1e-4bf9-9a2e-3a2f6c8d5b40', (select id from level), 5,
  'Créer des menaces et améliorer ses pièces', 'Create threats and improve your pieces',
  'Fondamentaux · Faire travailler ses pièces', 'Fundamentals · Make your pieces work',
  'Une menace oblige l’adversaire à vous écouter.', 'A threat makes the opponent listen.',
  'Créer une menace lisible, améliorer la pire pièce et coordonner les forces.',
  'Create a clear threat, improve the worst piece and coordinate your forces.',
  'r3k2r/pppq1ppp/2n5/4p3/2B1P3/2N2N2/PPPP1PPP/R2QK2R w KQkq - 0 1',
  $$[{"from":"c4","to":"f7","san":"Fxf7+","answer_fr":"Créez une menace avec tempo.","answer_en":"Create a threat with tempo.","idea_fr":"L’échec force une réponse.","idea_en":"Check forces a reply."},{"from":"b2","to":"c4","san":"Cc4","answer_fr":"Améliorez votre pire pièce.","answer_en":"Improve your worst piece.","idea_fr":"Le cavalier quitte le bord.","idea_en":"The knight leaves the edge."},{"from":"e2","to":"e8","san":"Te8+","answer_fr":"Activez une pièce en menaçant.","answer_en":"Activate a piece while threatening.","idea_fr":"Activité et menace avancent ensemble.","idea_en":"Activity and threat advance together."}]$$::jsonb,
  'Cherchez la pièce la moins utile, donnez-lui une meilleure case et créez une menace concrète.',
  'Find the least useful piece, give it a better square and create a concrete threat.', true, now()
),
(
  'a5c7e2f1-8b39-4d64-9e10-5f6a7b2c3d48', (select id from level), 6,
  'Que veut faire l’adversaire ?', 'What does the opponent want?',
  'Réflexe · La question avant chaque coup', 'Reflex · The question before every move',
  'Votre coup commence par une question.', 'Your move starts with a question.',
  'Installer le réflexe : que veut faire mon adversaire, puis qu’est-ce que mon coup lui permet ?',
  'Build the reflex: what does my opponent want, then what does my move allow them to do?',
  '4k3/8/8/8/8/2b5/3Q4/4K3 w - - 0 1',
  $$[{"from":"d2","to":"c3","san":"Dxc3","answer_fr":"Supprimez la menace.","answer_en":"Remove the threat.","idea_fr":"Le fou attaquait la dame.","idea_en":"The bishop attacked the queen."},{"from":"e2","to":"e8","san":"Dxe8+","answer_fr":"Répondez à la menace la plus forte.","answer_en":"Answer the strongest threat.","idea_fr":"La tour noire contrôlait la colonne e.","idea_en":"The black rook controlled the e-file."},{"from":"e1","to":"g1","san":"O-O","answer_fr":"Vérifiez ce que votre coup permet.","answer_en":"Check what your move allows.","idea_fr":"Le roque ne laisse pas le roi au centre.","idea_en":"Castling does not leave the king in the center."}]$$::jsonb,
  'Regardez d’abord les échecs, prises et menaces adverses. Ensuite seulement, choisissez votre idée.',
  'Look first for the opponent checks, captures and threats. Only then choose your idea.', true, now()
)
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

with level as (select id from public.learning_levels where slug = 'fundamentals' limit 1)
insert into public.lesson_exercises (
  id, lesson_id, level_id, kind, sort_order, title_fr, title_en, goal_fr, goal_en,
  prompt_fr, prompt_en, solution_fr, solution_en, position_fen, expected_san
)
values
('b1a1a1a1-1111-4b11-8111-111111111111', 'a116805b-1c51-4578-b66c-5c1d437c0cd6', (select id from level), 'lesson', 1, 'Les objectifs d’une position', 'The goals of a position', 'Relier chaque coup à un objectif.', 'Connect each move to a goal.', 'Quel est l’objectif concret de la position ?', 'What is the concrete goal of the position?', 'Un coup utile sert un objectif et vérifie la réponse adverse.', 'A useful move serves a goal and checks the opponent reply.', '7k/5Q2/6K1/8/8/8/8/8 w - - 0 1', 'Qg7#'),
('b2a2a2a2-2222-4b22-8222-222222222222', 'fbdc9b42-1e39-44fc-8f3c-d4910ec99fc6', (select id from level), 'lesson', 2, 'Les principes d’ouverture', 'Opening principles', 'Comprendre centre, développement et sécurité.', 'Understand center, development and safety.', 'Quel principe donne le plus de valeur à ce coup ?', 'Which principle gives this move the most value?', 'Développez les pièces mineures, roquez et connectez les tours.', 'Develop minor pieces, castle and connect the rooks.', 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 'e4'),
('b3a3a3a3-3333-4b33-8333-333333333333', 'd7b4c6a1-0cb9-4e92-8d7a-7e2f1b1b8e01', (select id from level), 'puzzle', 3, 'Roi en sécurité et roquer', 'King safety and castling', 'Choisir la sécurité avant l’attaque.', 'Choose safety before attack.', 'Mon roi est-il en sécurité ?', 'Is my king safe?', 'Le roque met le roi à l’abri et active une tour.', 'Castling shelters the king and activates a rook.', 'r1bqk2r/ppppbppp/2n2n2/4p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 4', 'O-O'),
('b4a4a4a4-4444-4b44-8444-444444444444', 'e10f3b2a-6d35-4f9d-a5f8-62f69f7d9c12', (select id from level), 'puzzle', 4, 'Gagner du matériel', 'Win material', 'Compter avant de prendre.', 'Count before capturing.', 'Quelle prise gagne du matériel sans laisser le roi en danger ?', 'Which capture wins material without exposing the king?', 'Comptez attaquants, défenseurs et recapture.', 'Count attackers, defenders and recapture.', '4k3/8/8/8/8/3r4/4Q3/4K3 w - - 0 1', 'Qxd3'),
('b5a5a5a5-5555-4b55-8555-555555555555', 'f24a9d63-4c1e-4bf9-9a2e-3a2f6c8d5b40', (select id from level), 'puzzle', 5, 'Créer des menaces', 'Create threats', 'Améliorer une pièce et menacer.', 'Improve a piece and threaten.', 'Quelle pièce peut créer une menace avec tempo ?', 'Which piece can create a threat with tempo?', 'Une menace force une réponse concrète.', 'A threat forces a concrete reply.', 'k7/8/8/8/8/8/4R3/4K3 w - - 0 1', 'Re8+'),
('b6a6a6a6-6666-4b66-8666-666666666666', 'a5c7e2f1-8b39-4d64-9e10-5f6a7b2c3d48', (select id from level), 'calculation', 6, 'Que veut faire l’adversaire ?', 'What does the opponent want?', 'Observer puis vérifier ce que le coup permet.', 'Observe, then check what the move allows.', 'Que veut faire mon adversaire ?', 'What does my opponent want?', 'Répondez d’abord aux échecs, prises et menaces.', 'Answer checks, captures and threats first.', '4k3/8/8/8/8/2b5/3Q4/4K3 w - - 0 1', 'Qxc3')
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
