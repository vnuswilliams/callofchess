begin;

-- Niveau 0 is already present in the curriculum. This migration enriches its copy
-- and makes the six public lessons deterministic without deleting prior content.
update public.learning_levels
set title_fr = 'Comprendre le jeu',
    title_en = 'Understand the game',
    summary_fr = 'Le plateau, les pièces, leurs déplacements et les règles pour jouer seul.',
    summary_en = 'The board, the pieces, their moves and the rules needed to play independently.',
    milestone_fr = 'Jouer une partie complète sans consulter les règles.',
    milestone_en = 'Play a complete game without checking the rules.'
where slug = 'rules';

with level as (
  select id from public.learning_levels where slug = 'rules' limit 1
)
insert into public.lessons (
  id, level_id, sort_order, title_fr, title_en, kicker_fr, kicker_en,
  headline_fr, headline_en, objective_fr, objective_en, starting_fen,
  steps, solution_fr, solution_en, is_published, updated_at
)
values
(
  'f3a1c235-5531-4c1c-845b-6d684808259b', (select id from level), 1,
  'Le repère des 64 cases', 'The 64-square map',
  'Matériel · Lire l’échiquier', 'Equipment · Read the board',
  'Orientez l’échiquier et trouvez votre chemin.', 'Orient the board and find your way.',
  'Reconnaître les 64 cases, les colonnes, les rangées et les diagonales.', 'Recognize the 64 squares, files, ranks and diagonals.',
  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  '[{"from":"e2","to":"e4","san":"e4","reply":"e5","replySan":"e5","answer_fr":"Avancez le pion e de deux cases.","answer_en":"Move the e-pawn two squares.","idea_fr":"Une case est l’intersection d’une colonne et d’une rangée. e4 signifie colonne e, rangée 4.","idea_en":"A square is the intersection of a file and a rank. e4 means file e, rank 4."},{"from":"g1","to":"f3","san":"Cf3","reply":"Nc6","replySan":"Cc6","answer_fr":"Placez le cavalier en f3.","answer_en":"Place the knight on f3.","idea_fr":"Les colonnes vont de a à h, les rangées de 1 à 8. Une diagonale relie des cases de même couleur.","idea_en":"Files run from a to h and ranks from 1 to 8. A diagonal connects squares of the same color."},{"from":"f1","to":"b5","san":"Fb5","reply":"a6","replySan":"a6","answer_fr":"Suivez la diagonale avec le fou.","answer_en":"Follow the diagonal with the bishop.","idea_fr":"Le fou reste toujours sur la couleur de sa case de départ et se déplace en diagonale.","idea_en":"A bishop always stays on the color of its starting square and moves diagonally."}]'::jsonb,
  'Le coin clair doit se trouver à droite. Une case se lit toujours lettre puis chiffre : e4, par exemple.',
  'The light corner belongs on the right. A square is always read letter then number: e4, for example.', true, now()
),
(
  '0ce3ec0e-348e-4300-b88a-c4a939cd8960', (select id from level), 2,
  'Le mouvement des pièces', 'How the pieces move',
  'Pièces · Donner une voix à chacune', 'Pieces · Give each one a voice',
  'Faites agir chaque pièce selon sa nature.', 'Let each piece move according to its nature.',
  'Différencier lignes, diagonales, saut du cavalier et marche du pion.', 'Distinguish lines, diagonals, the knight jump and pawn movement.',
  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  '[{"from":"e2","to":"e4","san":"e4","reply":"e5","replySan":"e5","answer_fr":"Ouvrez la partie avec le pion e.","answer_en":"Open the game with the e-pawn.","idea_fr":"Le pion avance tout droit, mais il prend en diagonale. Depuis sa case initiale, il peut avancer d’une ou deux cases.","idea_en":"A pawn advances straight but captures diagonally. From its starting square, it may move one or two squares."},{"from":"g1","to":"f3","san":"Cf3","reply":"Nc6","replySan":"Cc6","answer_fr":"Faites bondir le cavalier en f3.","answer_en":"Jump the knight to f3.","idea_fr":"Le cavalier se déplace en L et peut sauter par-dessus les autres pièces.","idea_en":"The knight moves in an L-shape and can jump over other pieces."},{"from":"f1","to":"c4","san":"Fc4","reply":"Bc5","replySan":"Fc5","answer_fr":"Faites glisser le fou vers c4.","answer_en":"Slide the bishop to c4.","idea_fr":"Le fou suit une diagonale sans franchir de pièce.","idea_en":"The bishop follows a diagonal without crossing a piece."},{"from":"d1","to":"e2","san":"De2","reply":"Qe7","replySan":"De7","answer_fr":"Placez la dame en e2.","answer_en":"Place the queen on e2.","idea_fr":"La dame peut parcourir une ligne droite ou une diagonale, comme une tour et un fou réunis.","idea_en":"The queen can travel in a straight line or a diagonal, like a rook and bishop combined."},{"from":"a2","to":"a4","san":"a4","reply":"a5","replySan":"a5","answer_fr":"Avancez le pion a pour ouvrir la tour.","answer_en":"Advance the a-pawn to open the rook.","idea_fr":"Une tour se déplace en ligne droite, mais elle a besoin d’une ligne libre.","idea_en":"A rook moves in straight lines, but it needs a clear line."},{"from":"a1","to":"a3","san":"Ta3","reply":"h6","replySan":"h6","answer_fr":"Faites monter la tour en a3.","answer_en":"Bring the rook to a3.","idea_fr":"La tour parcourt plusieurs cases verticales tant qu’aucune pièce ne bloque son chemin.","idea_en":"The rook can travel several squares vertically while no piece blocks its path."},{"from":"e1","to":"f1","san":"Rf1","reply":"h5","replySan":"h5","answer_fr":"Déplacez le roi d’une case en f1.","answer_en":"Move the king one square to f1.","idea_fr":"Le roi avance d’une seule case dans toutes les directions et ne peut jamais se mettre en échec.","idea_en":"The king moves one square in any direction and can never move into check."}]'::jsonb,
  'La dame combine tour et fou ; le cavalier est la seule pièce qui saute ; le roi avance d’une case et le pion progresse vers l’avant.',
  'The queen combines rook and bishop movement; the knight is the only jumper; the king moves one square and the pawn advances forward.', true, now()
),
(
  '4f9942af-62e4-4754-9e1b-cdad46dfbe7d', (select id from level), 3,
  'Prendre, promouvoir et compter', 'Capture, promote and count',
  'Pièces · La valeur d’un coup', 'Pieces · The value of a move',
  'Gagnez du matériel sans perdre le fil.', 'Win material without losing the thread.',
  'Comprendre la prise, la promotion et la valeur approximative des pièces.', 'Understand captures, promotion and the approximate value of the pieces.',
  '7k/4P3/8/3p4/4P3/8/8/4K3 w - - 0 1',
  '[{"from":"e4","to":"d5","san":"exd5","reply":"Kg7","replySan":"Kg7","answer_fr":"Prenez le pion en d5.","answer_en":"Capture the pawn on d5.","idea_fr":"Une prise remplace la pièce adverse par la vôtre. Ici, un pion gagne un pion.","idea_en":"A capture replaces the opponent’s piece with yours. Here, a pawn wins a pawn."},{"from":"e7","to":"e8","san":"e8=D","reply":"Kf6","replySan":"Kf6","answer_fr":"Promouvez le pion en dame.","answer_en":"Promote the pawn to a queen.","idea_fr":"Lorsqu’un pion atteint la dernière rangée, il devient dame, tour, fou ou cavalier.","idea_en":"When a pawn reaches the last rank, it becomes a queen, rook, bishop or knight."}]'::jsonb,
  'Pion ≈ 1, cavalier/fou ≈ 3, tour ≈ 5, dame ≈ 9. Le roi n’a pas de prix : sa sécurité décide de la partie.',
  'Pawn ≈ 1, knight/bishop ≈ 3, rook ≈ 5, queen ≈ 9. The king has no price: its safety decides the game.', true, now()
),
(
  '32ffa48c-fa82-5825-9d6c-7ffb79a60781', (select id from level), 4,
  'Le roque et la prise en passant', 'Castling and en passant',
  'Règles spéciales · Deux exceptions', 'Special rules · Two exceptions',
  'Utilisez les coups que l’échiquier ne montre pas au premier regard.', 'Use the moves the board does not reveal at first glance.',
  'Exécuter une prise en passant puis un roque court dans une position légale.', 'Play en passant and then castle kingside in a legal position.',
  '4k3/8/8/3pP3/8/8/8/4K2R w K d6 0 1',
  '[{"from":"e5","to":"d6","san":"exd6 e.p.","reply":"Kd7","replySan":"Kd7","answer_fr":"Prenez le pion d5 en passant.","answer_en":"Capture the d5-pawn en passant.","idea_fr":"Le pion blanc passe en d6 et retire le pion noir comme s’il n’avait avancé que d’une case.","idea_en":"The white pawn lands on d6 and removes the black pawn as if it had moved only one square."},{"from":"e1","to":"g1","san":"O-O","reply":"Ke6","replySan":"Ke6","answer_fr":"Roquez du côté roi.","answer_en":"Castle kingside.","idea_fr":"Le roi et la tour bougent ensemble. Le roi se met à l’abri et la tour devient active.","idea_en":"The king and rook move together. The king becomes safer and the rook becomes active."}]'::jsonb,
  'Le roque déplace le roi de deux cases vers la tour. La prise en passant se joue immédiatement après le double pas d’un pion adverse.',
  'Castling moves the king two squares toward the rook. En passant must be played immediately after an opposing pawn’s two-square advance.', true, now()
),
(
  '358114a7-8876-588e-bd0d-3fbcbfeecb14', (select id from level), 5,
  'Échec, mat, pat et nulles', 'Check, mate, stalemate and draws',
  'Fin de partie · Lire le résultat', 'Game endings · Read the result',
  'Reconnaissez le moment où la partie s’arrête.', 'Recognize the moment the game stops.',
  'Différencier échec, échec et mat, pat, répétition, règle des 50 coups et matériel insuffisant.', 'Distinguish check, checkmate, stalemate, repetition, the 50-move rule and insufficient material.',
  '7k/5Q2/6K1/8/8/8/8/8 w - - 0 1',
  '[{"from":"f7","to":"g7","san":"Dg7#","replySan":"—","answer_fr":"Donnez échec et mat avec la dame.","answer_en":"Deliver checkmate with the queen.","idea_fr":"Le roi noir est en échec et ne peut ni fuir, ni prendre la dame, ni interposer une pièce.","idea_en":"The black king is in check and cannot flee, capture the queen or block the line."}]'::jsonb,
  'Le mat est un échec sans réponse légale. Le pat n’est pas un échec mais le joueur n’a aucun coup. Certaines positions donnent nulle même sans accord des joueurs.',
  'Checkmate is check with no legal reply. Stalemate is no check but no legal move. Some positions are drawn even without agreement.', true, now()
),
(
  'bc8a719d-d4e6-5d3e-90c1-58292c6fe8f4', (select id from level), 6,
  'Une partie légale', 'A legal game',
  'Synthèse · Jouer sans aide', 'Synthesis · Play without help',
  'Mettez toutes les règles en mouvement.', 'Put every rule into motion.',
  'Jouer une courte séquence complète, lire la notation et reconnaître le mat final.', 'Play a complete short sequence, read the notation and recognize the final checkmate.',
  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  '[{"from":"e2","to":"e4","san":"e4","reply":"e5","replySan":"e5","answer_fr":"Commencez par e4.","answer_en":"Start with e4.","idea_fr":"Le pion ouvre des lignes et occupe le centre.","idea_en":"The pawn opens lines and occupies the center."},{"from":"f1","to":"c4","san":"Fc4","reply":"Nc6","replySan":"Cc6","answer_fr":"Développez le fou en c4.","answer_en":"Develop the bishop to c4.","idea_fr":"Le fou vise f7, une case sensible près du roi noir.","idea_en":"The bishop eyes f7, a sensitive square near the black king."},{"from":"d1","to":"h5","san":"Dh5","reply":"Nf6","replySan":"Cf6","answer_fr":"Placez la dame en h5.","answer_en":"Place the queen on h5.","idea_fr":"La dame et le fou coordonnent leur pression sur f7.","idea_en":"The queen and bishop coordinate their pressure on f7."},{"from":"h5","to":"f7","san":"Dxf7#","replySan":"—","answer_fr":"Terminez par le mat en f7.","answer_en":"Finish with checkmate on f7.","idea_fr":"La dame prend f7 : le roi ne dispose plus d’aucune réponse légale.","idea_en":"The queen captures f7: the king has no legal reply."}]'::jsonb,
  'Une partie est une suite de coups légaux : développer, vérifier les menaces, protéger le roi et reconnaître le résultat.',
  'A game is a sequence of legal moves: develop, check threats, protect the king and recognize the result.', true, now()
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

with level as (select id from public.learning_levels where slug = 'rules' limit 1)
insert into public.lesson_exercises (
  id, lesson_id, level_id, kind, sort_order, title_fr, title_en, goal_fr, goal_en,
  prompt_fr, prompt_en, solution_fr, solution_en, position_fen, expected_san
)
values
('b6b0eb8d-99e4-5d2d-ba61-7b353b381fca', 'f3a1c235-5531-4c1c-845b-6d684808259b', (select id from level), 'lesson', 1, 'Lire les 64 cases', 'Read the 64 squares', 'Orienter l’échiquier et nommer une case.', 'Orient the board and name a square.', 'Avancez le pion e de deux cases.', 'Move the e-pawn two squares.', 'Le coin clair est en bas à droite et une case se lit lettre puis chiffre.', 'The light corner is at the bottom right and a square is read letter then number.', 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 'e4'),
('f002ac4c-0777-54b2-b026-822514073b38', '0ce3ec0e-348e-4300-b88a-c4a939cd8960', (select id from level), 'lesson', 2, 'Déplacer les pièces', 'Move the pieces', 'Reconnaître les mouvements de chaque pièce.', 'Recognize each piece’s movement.', 'Faites bondir le cavalier en f3.', 'Jump the knight to f3.', 'Le cavalier est la seule pièce qui saute.', 'The knight is the only piece that jumps.', 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 'Nf3'),
('56a29f4a-6e8a-5e83-a45e-da08b49095c6', '4f9942af-62e4-4754-9e1b-cdad46dfbe7d', (select id from level), 'lesson', 3, 'Prendre et promouvoir', 'Capture and promote', 'Comparer les valeurs et transformer un pion.', 'Compare values and promote a pawn.', 'Prenez le pion en d5.', 'Capture the pawn on d5.', 'Pion 1, cavalier/fou 3, tour 5, dame 9 ; le roi est stratégique.', 'Pawn 1, knight/bishop 3, rook 5, queen 9; the king is strategic.', '7k/4P3/8/3p4/4P3/8/8/4K3 w - - 0 1', 'exd5'),
('de9e6477-bb6c-5e3b-bffd-40d24e60bff3', '32ffa48c-fa82-5825-9d6c-7ffb79a60781', (select id from level), 'lesson', 4, 'Les coups spéciaux', 'Special moves', 'Jouer le roque et la prise en passant.', 'Play castling and en passant.', 'Prenez le pion d5 en passant.', 'Capture the d5-pawn en passant.', 'La prise en passant est immédiate et le roque protège le roi.', 'En passant is immediate and castling protects the king.', '4k3/8/8/3pP3/8/8/8/4K2R w K d6 0 1', 'exd6'),
('9f559ad0-74f7-5b4a-9048-8ef701a7cb45', '358114a7-8876-588e-bd0d-3fbcbfeecb14', (select id from level), 'lesson', 5, 'Lire les fins de partie', 'Read game endings', 'Différencier mat, pat et nulle.', 'Distinguish mate, stalemate and draws.', 'Donnez échec et mat avec la dame.', 'Deliver checkmate with the queen.', 'Le mat est un échec sans réponse légale ; le pat est une nulle sans échec.', 'Mate is check with no legal reply; stalemate is a draw without check.', '7k/5Q2/6K1/8/8/8/8/8 w - - 0 1', 'Qg7#'),
('eb998ad8-d975-53da-b85a-c604eccce255', 'bc8a719d-d4e6-5d3e-90c1-58292c6fe8f4', (select id from level), 'review', 6, 'Jouer une partie légale', 'Play a legal game', 'Réviser toutes les règles dans une séquence guidée.', 'Review every rule in a guided sequence.', 'Commencez par e4.', 'Start with e4.', 'Développez, vérifiez les menaces, protégez le roi et reconnaissez le résultat.', 'Develop, check threats, protect the king and recognize the result.', 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 'e4')
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
