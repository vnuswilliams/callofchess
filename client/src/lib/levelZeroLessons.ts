import { Chess, type Square } from "chess.js";

export type BilingualText = { fr: string; en: string };

export type LessonStep = {
  from: string;
  to: string;
  san: string;
  answer: BilingualText;
  idea: BilingualText;
  reply?: string;
  replySan?: string;
};

export type LessonDefinition = {
  key: string;
  number: string;
  title: BilingualText;
  kicker: BilingualText;
  headline: BilingualText;
  objective: BilingualText;
  solution: BilingualText;
  startingFen: string;
  steps: LessonStep[];
  keyPoints: Array<{ title: BilingualText; text: BilingualText }>;
};

const standardFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export const lessonCatalog: Record<string, LessonDefinition> = {
  "1": {
    key: "1",
    number: "01",
    title: { fr: "Le repère des 64 cases", en: "The 64-square map" },
    kicker: { fr: "Matériel · Lire l’échiquier", en: "Equipment · Read the board" },
    headline: { fr: "Orientez l’échiquier et trouvez votre chemin.", en: "Orient the board and find your way." },
    objective: { fr: "Reconnaître les 64 cases, les colonnes, les rangées et les diagonales.", en: "Recognize the 64 squares, files, ranks and diagonals." },
    solution: { fr: "Le coin clair doit se trouver à droite. Une case se lit toujours lettre puis chiffre : e4, par exemple.", en: "The light corner belongs on the right. A square is always read letter then number: e4, for example." },
    startingFen: standardFen,
    steps: [
      { from: "e2", to: "e4", san: "e4", answer: { fr: "Avancez le pion e de deux cases.", en: "Move the e-pawn two squares." }, idea: { fr: "Une case est l’intersection d’une colonne et d’une rangée. e4 signifie colonne e, rangée 4.", en: "A square is the intersection of a file and a rank. e4 means file e, rank 4." }, reply: "e5", replySan: "e5" },
      { from: "g1", to: "f3", san: "Cf3", answer: { fr: "Placez le cavalier en f3.", en: "Place the knight on f3." }, idea: { fr: "Les colonnes vont de a à h, les rangées de 1 à 8. Une diagonale relie des cases de même couleur.", en: "Files run from a to h and ranks from 1 to 8. A diagonal connects squares of the same color." }, reply: "Nc6", replySan: "Cc6" },
      { from: "f1", to: "b5", san: "Fb5", answer: { fr: "Suivez la diagonale avec le fou.", en: "Follow the diagonal with the bishop." }, idea: { fr: "Le fou reste toujours sur la couleur de sa case de départ et se déplace en diagonale.", en: "A bishop always stays on the color of its starting square and moves diagonally." }, reply: "a6", replySan: "a6" },
    ],
    keyPoints: [
      { title: { fr: "Orientation", en: "Orientation" }, text: { fr: "Une case blanche doit être dans le coin inférieur droit.", en: "A light square must be in the lower-right corner." } },
      { title: { fr: "Coordonnées", en: "Coordinates" }, text: { fr: "Nommez d’abord la lettre, puis le chiffre.", en: "Say the letter first, then the number." } },
      { title: { fr: "Repère", en: "Reference" }, text: { fr: "Les coordonnées rendent chaque coup lisible et partageable.", en: "Coordinates make every move readable and shareable." } },
    ],
  },
  "2": {
    key: "2",
    number: "02",
    title: { fr: "Le mouvement des pièces", en: "How the pieces move" },
    kicker: { fr: "Pièces · Donner une voix à chacune", en: "Pieces · Give each one a voice" },
    headline: { fr: "Faites agir chaque pièce selon sa nature.", en: "Let each piece move according to its nature." },
    objective: { fr: "Différencier lignes, diagonales, saut du cavalier et marche du pion.", en: "Distinguish lines, diagonals, the knight jump and pawn movement." },
    solution: { fr: "La dame combine tour et fou ; le cavalier est la seule pièce qui saute ; le roi avance d’une case et le pion progresse vers l’avant.", en: "The queen combines rook and bishop movement; the knight is the only jumper; the king moves one square and the pawn advances forward." },
    startingFen: standardFen,
    steps: [
      { from: "e2", to: "e4", san: "e4", answer: { fr: "Ouvrez la partie avec le pion e.", en: "Open the game with the e-pawn." }, idea: { fr: "Le pion avance tout droit, mais il prend en diagonale. Depuis sa case initiale, il peut avancer d’une ou deux cases.", en: "A pawn advances straight but captures diagonally. From its starting square, it may move one or two squares." }, reply: "e5", replySan: "e5" },
      { from: "g1", to: "f3", san: "Cf3", answer: { fr: "Faites bondir le cavalier en f3.", en: "Jump the knight to f3." }, idea: { fr: "Le cavalier se déplace en L et peut sauter par-dessus les autres pièces.", en: "The knight moves in an L-shape and can jump over other pieces." }, reply: "Nc6", replySan: "Cc6" },
      { from: "f1", to: "c4", san: "Fc4", answer: { fr: "Faites glisser le fou vers c4.", en: "Slide the bishop to c4." }, idea: { fr: "Le fou suit une diagonale sans franchir de pièce.", en: "The bishop follows a diagonal without crossing a piece." }, reply: "Bc5", replySan: "Fc5" },
      { from: "d1", to: "e2", san: "De2", answer: { fr: "Placez la dame en e2.", en: "Place the queen on e2." }, idea: { fr: "La dame peut parcourir une ligne droite ou une diagonale, comme une tour et un fou réunis.", en: "The queen can travel in a straight line or a diagonal, like a rook and bishop combined." }, reply: "Qe7", replySan: "De7" },
      { from: "a2", to: "a4", san: "a4", answer: { fr: "Avancez le pion a pour ouvrir la tour.", en: "Advance the a-pawn to open the rook." }, idea: { fr: "Une tour se déplace en ligne droite, mais elle a besoin d’une ligne libre.", en: "A rook moves in straight lines, but it needs a clear line." }, reply: "a5", replySan: "a5" },
      { from: "a1", to: "a3", san: "Ta3", answer: { fr: "Faites monter la tour en a3.", en: "Bring the rook to a3." }, idea: { fr: "La tour parcourt plusieurs cases verticales tant qu’aucune pièce ne bloque son chemin.", en: "The rook can travel several squares vertically while no piece blocks its path." }, reply: "h6", replySan: "h6" },
      { from: "e1", to: "f1", san: "Rf1", answer: { fr: "Déplacez le roi d’une case en f1.", en: "Move the king one square to f1." }, idea: { fr: "Le roi avance d’une seule case dans toutes les directions et ne peut jamais se mettre en échec.", en: "The king moves one square in any direction and can never move into check." }, reply: "h5", replySan: "h5" },
    ],
    keyPoints: [
      { title: { fr: "Lignes", en: "Lines" }, text: { fr: "Tour et dame se déplacent en lignes droites.", en: "Rooks and queens move along straight lines." } },
      { title: { fr: "Diagonales", en: "Diagonals" }, text: { fr: "Fou et dame suivent les diagonales.", en: "Bishops and queens follow diagonals." } },
      { title: { fr: "Saut", en: "Jump" }, text: { fr: "Seul le cavalier peut traverser une pièce.", en: "Only the knight can jump over a piece." } },
    ],
  },
  "3": {
    key: "3",
    number: "03",
    title: { fr: "Prendre, promouvoir et compter", en: "Capture, promote and count" },
    kicker: { fr: "Pièces · La valeur d’un coup", en: "Pieces · The value of a move" },
    headline: { fr: "Gagnez du matériel sans perdre le fil.", en: "Win material without losing the thread." },
    objective: { fr: "Comprendre la prise, la promotion et la valeur approximative des pièces.", en: "Understand captures, promotion and the approximate value of the pieces." },
    solution: { fr: "Pion ≈ 1, cavalier/fou ≈ 3, tour ≈ 5, dame ≈ 9. Le roi n’a pas de prix : sa sécurité décide de la partie.", en: "Pawn ≈ 1, knight/bishop ≈ 3, rook ≈ 5, queen ≈ 9. The king has no price: its safety decides the game." },
    startingFen: "7k/4P3/8/3p4/4P3/8/8/4K3 w - - 0 1",
    steps: [
      { from: "e4", to: "d5", san: "exd5", answer: { fr: "Prenez le pion en d5.", en: "Capture the pawn on d5." }, idea: { fr: "Une prise remplace la pièce adverse par la vôtre. Ici, un pion gagne un pion : le matériel reste équilibré.", en: "A capture replaces the opponent’s piece with yours. Here, a pawn wins a pawn: material stays even." }, reply: "Kg7", replySan: "Kg7" },
      { from: "e7", to: "e8", san: "e8=D", answer: { fr: "Promouvez le pion en dame.", en: "Promote the pawn to a queen." }, idea: { fr: "Lorsqu’un pion atteint la dernière rangée, il devient dame, tour, fou ou cavalier. La dame est le choix le plus fréquent.", en: "When a pawn reaches the last rank, it becomes a queen, rook, bishop or knight. The queen is the most common choice." }, reply: "Kf6", replySan: "Kf6" },
    ],
    keyPoints: [
      { title: { fr: "Prise", en: "Capture" }, text: { fr: "On prend sur la case d’arrivée, jamais en traversant une pièce.", en: "You capture on the destination square, never while crossing a piece." } },
      { title: { fr: "Valeurs", en: "Values" }, text: { fr: "Les valeurs aident à comparer, mais l’activité compte aussi.", en: "Values help compare pieces, but activity matters too." } },
      { title: { fr: "Promotion", en: "Promotion" }, text: { fr: "Un pion arrivé au bout change de rôle immédiatement.", en: "A pawn reaching the end changes role immediately." } },
    ],
  },
  "4": {
    key: "4",
    number: "04",
    title: { fr: "Le roque et la prise en passant", en: "Castling and en passant" },
    kicker: { fr: "Règles spéciales · Deux exceptions", en: "Special rules · Two exceptions" },
    headline: { fr: "Utilisez les coups que l’échiquier ne montre pas au premier regard.", en: "Use the moves the board does not reveal at first glance." },
    objective: { fr: "Exécuter une prise en passant puis un roque court dans une position légale.", en: "Play en passant and then castle kingside in a legal position." },
    solution: { fr: "Le roque déplace le roi de deux cases vers la tour. La prise en passant se joue immédiatement après le double pas d’un pion adverse.", en: "Castling moves the king two squares toward the rook. En passant must be played immediately after an opposing pawn’s two-square advance." },
    startingFen: "4k3/8/8/3pP3/8/8/8/4K2R w K d6 0 1",
    steps: [
      { from: "e5", to: "d6", san: "exd6 e.p.", answer: { fr: "Prenez le pion d5 en passant.", en: "Capture the d5-pawn en passant." }, idea: { fr: "Le pion blanc passe en d6 et retire le pion noir comme s’il n’avait avancé que d’une case.", en: "The white pawn lands on d6 and removes the black pawn as if it had moved only one square." }, reply: "Kd7", replySan: "Kd7" },
      { from: "e1", to: "g1", san: "O-O", answer: { fr: "Roquez du côté roi.", en: "Castle kingside." }, idea: { fr: "Le roi et la tour bougent ensemble. Le roi se met à l’abri et la tour devient active en un seul coup.", en: "The king and rook move together. The king becomes safer and the rook becomes active in one move." }, reply: "Ke6", replySan: "Ke6" },
    ],
    keyPoints: [
      { title: { fr: "Roque", en: "Castling" }, text: { fr: "Ni le roi ni la tour ne doivent avoir bougé, et aucune case traversée ne peut être attaquée.", en: "Neither king nor rook may have moved, and no crossed square may be attacked." } },
      { title: { fr: "En passant", en: "En passant" }, text: { fr: "La prise est disponible pendant un seul coup.", en: "The capture is available for one move only." } },
      { title: { fr: "Légalité", en: "Legality" }, text: { fr: "Un coup spécial reste soumis à la règle du roi en sécurité.", en: "A special move is still subject to the king-safety rule." } },
    ],
  },
  "5": {
    key: "5",
    number: "05",
    title: { fr: "Échec, mat, pat et nulles", en: "Check, mate, stalemate and draws" },
    kicker: { fr: "Fin de partie · Lire le résultat", en: "Game endings · Read the result" },
    headline: { fr: "Reconnaissez le moment où la partie s’arrête.", en: "Recognize the moment the game stops." },
    objective: { fr: "Différencier échec, échec et mat, pat, répétition, règle des 50 coups et matériel insuffisant.", en: "Distinguish check, checkmate, stalemate, repetition, the 50-move rule and insufficient material." },
    solution: { fr: "Le mat est un échec sans réponse légale. Le pat n’est pas un échec mais le joueur n’a aucun coup. Certaines positions donnent nulle même sans accord des joueurs.", en: "Checkmate is check with no legal reply. Stalemate is no check but no legal move. Some positions are drawn even without agreement." },
    startingFen: "7k/5Q2/6K1/8/8/8/8/8 w - - 0 1",
    steps: [
      { from: "f7", to: "g7", san: "Dg7#", answer: { fr: "Donnez échec et mat avec la dame.", en: "Deliver checkmate with the queen." }, idea: { fr: "Le roi noir est en échec et ne peut ni fuir, ni prendre la dame, ni interposer une pièce : c’est mat.", en: "The black king is in check and cannot flee, capture the queen or block the line: that is checkmate." }, replySan: "—" },
    ],
    keyPoints: [
      { title: { fr: "Échec", en: "Check" }, text: { fr: "Le roi attaqué doit répondre immédiatement.", en: "An attacked king must respond immediately." } },
      { title: { fr: "Pat", en: "Stalemate" }, text: { fr: "Pas d’échec, mais aucun coup légal : la partie est nulle.", en: "No check, but no legal move: the game is drawn." } },
      { title: { fr: "Nulles", en: "Draws" }, text: { fr: "Répétition, 50 coups ou matériel insuffisant peuvent arrêter la partie.", en: "Repetition, 50 moves or insufficient material can end the game." } },
    ],
  },
  "6": {
    key: "6",
    number: "06",
    title: { fr: "Une partie légale", en: "A legal game" },
    kicker: { fr: "Synthèse · Jouer sans aide", en: "Synthesis · Play without help" },
    headline: { fr: "Mettez toutes les règles en mouvement.", en: "Put every rule into motion." },
    objective: { fr: "Jouer une courte séquence complète, lire la notation et reconnaître le mat final.", en: "Play a complete short sequence, read the notation and recognize the final checkmate." },
    solution: { fr: "Une partie est une suite de coups légaux : développer, vérifier les menaces, protéger le roi et reconnaître le résultat.", en: "A game is a sequence of legal moves: develop, check threats, protect the king and recognize the result." },
    startingFen: standardFen,
    steps: [
      { from: "e2", to: "e4", san: "e4", answer: { fr: "Commencez par e4.", en: "Start with e4." }, idea: { fr: "Le pion ouvre des lignes et occupe le centre.", en: "The pawn opens lines and occupies the center." }, reply: "e5", replySan: "e5" },
      { from: "f1", to: "c4", san: "Fc4", answer: { fr: "Développez le fou en c4.", en: "Develop the bishop to c4." }, idea: { fr: "Le fou vise f7, une case sensible près du roi noir.", en: "The bishop eyes f7, a sensitive square near the black king." }, reply: "Nc6", replySan: "Cc6" },
      { from: "d1", to: "h5", san: "Dh5", answer: { fr: "Placez la dame en h5.", en: "Place the queen on h5." }, idea: { fr: "La dame et le fou coordonnent leur pression sur f7.", en: "The queen and bishop coordinate their pressure on f7." }, reply: "Nf6", replySan: "Cf6" },
      { from: "h5", to: "f7", san: "Dxf7#", answer: { fr: "Terminez par le mat en f7.", en: "Finish with checkmate on f7." }, idea: { fr: "La dame prend f7 : le roi ne dispose plus d’aucune réponse légale.", en: "The queen captures f7: the king has no legal reply." }, replySan: "—" },
    ],
    keyPoints: [
      { title: { fr: "Lire", en: "Read" }, text: { fr: "La notation décrit les coups et permet de rejouer une partie.", en: "Notation describes moves and lets you replay a game." } },
      { title: { fr: "Vérifier", en: "Check" }, text: { fr: "Avant de jouer, demandez si votre roi reste en sécurité.", en: "Before moving, ask whether your king remains safe." } },
      { title: { fr: "Continuer", en: "Continue" }, text: { fr: "Le Niveau 1 développera les principes de décision.", en: "Level 1 will develop decision-making principles." } },
    ],
  },
};

export function reconstructPosition(steps: LessonStep[], completedStep: number, startingFen: string) {
  const game = new Chess(startingFen);
  steps.slice(0, completedStep).forEach((step) => {
    game.move({ from: step.from as Square, to: step.to as Square, promotion: "q" });
    if (step.reply) game.move(step.reply);
  });
  return game.fen();
}

