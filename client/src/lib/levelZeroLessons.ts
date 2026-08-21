import { Chess, type Square } from "chess.js";

export type BilingualText = { fr: string; en: string };
export type LessonMode = "theory" | "guided" | "draws" | "computer";

export type LessonStep = {
  from: string;
  to: string;
  san: string;
  answer: BilingualText;
  idea: BilingualText;
  reply?: string;
  replySan?: string;
  positionFen?: string;
};

export type TheorySection = {
  title: BilingualText;
  text: BilingualText;
  items?: Array<{ label: BilingualText; text: BilingualText }>;
};

export type DrawPosition = {
  id: "stalemate" | "repetition" | "fifty-move" | "insufficient-material";
  title: BilingualText;
  explanation: BilingualText;
  fen: string;
  setupMoves?: string[];
};

export type LessonDefinition = {
  key: string;
  number: string;
  mode: LessonMode;
  title: BilingualText;
  kicker: BilingualText;
  headline: BilingualText;
  objective: BilingualText;
  solution: BilingualText;
  startingFen: string;
  steps: LessonStep[];
  keyPoints: Array<{ title: BilingualText; text: BilingualText }>;
  theorySections: TheorySection[];
  drawPositions: DrawPosition[];
  computerGoal?: BilingualText;
};

const standardFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const emptyTheory: TheorySection[] = [];
const emptyDraws: DrawPosition[] = [];

export const lessonCatalog: Record<string, LessonDefinition> = {
  "1": {
    key: "1",
    number: "01",
    mode: "theory",
    title: { fr: "Le matériel et le classement Elo", en: "The equipment and Elo ratings" },
    kicker: { fr: "Théorie · Comprendre avant de jouer", en: "Theory · Understand before playing" },
    headline: { fr: "Apprenez à lire le terrain et le langage des échecs.", en: "Learn to read the board and the language of chess." },
    objective: { fr: "Identifier l’échiquier, les pièces, leurs valeurs approximatives et le principe du classement Elo.", en: "Identify the board, the pieces, their approximate values and the Elo rating principle." },
    solution: { fr: "Vous connaissez maintenant le matériel, le repère d’une case, le rôle de chaque pièce et la logique générale d’un classement Elo.", en: "You now know the equipment, how to read a square, each piece’s role and the general logic of an Elo rating." },
    startingFen: standardFen,
    steps: [],
    drawPositions: emptyDraws,
    theorySections: [
      {
        title: { fr: "L’échiquier : 64 cases", en: "The board: 64 squares" },
        text: { fr: "L’échiquier est un carré de 8 cases sur 8, soit 64 cases alternant clair et sombre. Pour l’installer correctement, placez toujours une case claire dans le coin inférieur droit de chaque joueur.", en: "The chessboard is an 8-by-8 square, so it has 64 squares alternating light and dark. To set it up correctly, always place a light square in each player's lower-right corner." },
        items: [
          { label: { fr: "Colonnes", en: "Files" }, text: { fr: "Les colonnes sont les lignes verticales nommées de a à h, de gauche à droite pour les Blancs.", en: "Files are the vertical lines named a through h, from left to right for White." } },
          { label: { fr: "Rangées", en: "Ranks" }, text: { fr: "Les rangées sont les lignes horizontales numérotées de 1 à 8, en partant du camp blanc.", en: "Ranks are the horizontal lines numbered 1 through 8, starting from White’s side." } },
          { label: { fr: "Diagonales", en: "Diagonals" }, text: { fr: "Une diagonale relie des cases en biais. Un fou reste toujours sur la couleur de sa case de départ.", en: "A diagonal connects squares at an angle. A bishop always stays on the color of its starting square." } },
        ],
      },
      {
        title: { fr: "Les coordonnées : lettre puis chiffre", en: "Coordinates: letter then number" },
        text: { fr: "Chaque case possède un nom unique formé par sa colonne puis sa rangée. e4 signifie donc colonne e, rangée 4. Les coordonnées permettent de décrire, vérifier et rejouer chaque coup.", en: "Each square has a unique name made from its file followed by its rank. e4 therefore means file e, rank 4. Coordinates let you describe, check and replay every move." },
        items: [
          { label: { fr: "Repère", en: "Reference" }, text: { fr: "Les Blancs commencent en bas ; les Noirs regardent le même échiquier depuis le haut.", en: "White starts at the bottom; Black faces the same board from the top." } },
          { label: { fr: "Exemple", en: "Example" }, text: { fr: "Le roi blanc commence en e1 et la dame blanche en d1.", en: "The white king starts on e1 and the white queen on d1." } },
        ],
      },
      {
        title: { fr: "Les six pièces", en: "The six pieces" },
        text: { fr: "Chaque pièce a une géométrie différente. Comprendre cette géométrie est plus important que mémoriser un nom de coup.", en: "Each piece has different geometry. Understanding that geometry matters more than memorizing an opening name." },
        items: [
          { label: { fr: "Roi", en: "King" }, text: { fr: "Il avance d’une case dans toutes les directions. Il ne peut jamais rester ou entrer en échec.", en: "It moves one square in any direction. It may never remain in or move into check." } },
          { label: { fr: "Dame", en: "Queen" }, text: { fr: "Elle se déplace en ligne droite ou en diagonale : elle combine la tour et le fou.", en: "It moves in straight lines or diagonals: it combines rook and bishop movement." } },
          { label: { fr: "Tour", en: "Rook" }, text: { fr: "Elle parcourt les lignes et les colonnes tant que son chemin est libre.", en: "It travels along ranks and files while its path is clear." } },
          { label: { fr: "Fou", en: "Bishop" }, text: { fr: "Il parcourt les diagonales et reste toute la partie sur sa couleur de départ.", en: "It travels along diagonals and remains on its starting square color." } },
          { label: { fr: "Cavalier", en: "Knight" }, text: { fr: "Il se déplace en L et est la seule pièce qui peut sauter par-dessus les autres.", en: "It moves in an L-shape and is the only piece that can jump over others." } },
          { label: { fr: "Pion", en: "Pawn" }, text: { fr: "Il avance vers le camp adverse, prend en diagonale et peut être promu en arrivant au bout.", en: "It advances toward the opponent, captures diagonally and can promote on the last rank." } },
        ],
      },
      {
        title: { fr: "Valeur approximative et sécurité du roi", en: "Approximate value and king safety" },
        text: { fr: "Les valeurs servent de repère pour comparer du matériel, mais elles ne remplacent jamais la position. Le roi n’est pas une pièce que l’on échange : sa sécurité est l’objectif stratégique de toute la partie.", en: "Values are a reference for comparing material, but they never replace the position. The king is not a piece you trade: its safety is the strategic objective of the whole game." },
        items: [
          { label: { fr: "Pion ≈ 1", en: "Pawn ≈ 1" }, text: { fr: "Une unité de base, souvent utilisée pour mesurer les échanges.", en: "The basic unit, often used to measure exchanges." } },
          { label: { fr: "Cavalier ≈ 3 · Fou ≈ 3", en: "Knight ≈ 3 · Bishop ≈ 3" }, text: { fr: "Les pièces mineures valent environ trois pions.", en: "The minor pieces are worth about three pawns." } },
          { label: { fr: "Tour ≈ 5 · Dame ≈ 9", en: "Rook ≈ 5 · Queen ≈ 9" }, text: { fr: "Une tour vaut environ cinq pions et une dame environ neuf.", en: "A rook is worth about five pawns and a queen about nine." } },
          { label: { fr: "Roi : valeur stratégique", en: "King: strategic value" }, text: { fr: "On ne lui attribue pas de valeur d’échange : perdre le roi signifie perdre la partie.", en: "It has no exchange value: losing the king means losing the game." } },
        ],
      },
      {
        title: { fr: "Le classement Elo", en: "Elo ratings" },
        text: { fr: "Le classement Elo est une estimation de la force de jeu, pas une note de connaissance. Après une partie, le classement monte davantage si vous battez un adversaire mieux classé et baisse davantage si vous perdez contre un adversaire moins bien classé. Le système compare des résultats attendus et réels ; il n’est pas une mesure parfaite et évolue avec les parties.", en: "An Elo rating estimates playing strength; it is not a grade for memorized knowledge. After a game, the rating rises more when you beat a higher-rated opponent and falls more when you lose to a lower-rated opponent. The system compares expected and actual results; it is not perfect and changes with games." },
        items: [
          { label: { fr: "Débutant", en: "Beginner" }, text: { fr: "Un premier classement devient plus parlant après plusieurs parties, car une seule partie ne suffit pas à mesurer une force stable.", en: "A first rating becomes more meaningful after several games because one game cannot measure stable strength." } },
          { label: { fr: "À retenir", en: "Remember" }, text: { fr: "L’Elo décrit une performance relative dans un système donné ; il ne définit pas votre potentiel.", en: "Elo describes relative performance in a given pool; it does not define your potential." } },
        ],
      },
    ],
    keyPoints: [
      { title: { fr: "Orienter", en: "Orient" }, text: { fr: "Case claire en bas à droite.", en: "Light square at the lower right." } },
      { title: { fr: "Nommer", en: "Name" }, text: { fr: "Lettre puis chiffre : e4.", en: "Letter then number: e4." } },
      { title: { fr: "Comparer", en: "Compare" }, text: { fr: "1 · 3 · 5 · 9, sans oublier le roi.", en: "1 · 3 · 5 · 9, without forgetting the king." } },
    ],
  },
  "2": {
    key: "2", number: "02", mode: "guided",
    title: { fr: "Déplacer les pièces", en: "Move the pieces" },
    kicker: { fr: "Pratique · Une géométrie à la fois", en: "Practice · One geometry at a time" },
    headline: { fr: "Faites agir chaque pièce selon sa nature.", en: "Let every piece move according to its nature." },
    objective: { fr: "Exercer le roi, la dame, la tour, le fou, le cavalier et le pion sur des positions simples.", en: "Practice the king, queen, rook, bishop, knight and pawn on simple positions." },
    solution: { fr: "Chaque pièce a sa trajectoire ; le cavalier saute, le pion avance et prend différemment, et le roi ne se met jamais en danger.", en: "Each piece has its path; the knight jumps, the pawn advances and captures differently, and the king never enters danger." },
    startingFen: standardFen,
    drawPositions: emptyDraws,
    theorySections: emptyTheory,
    steps: [
      { positionFen: "4k3/8/8/8/4K3/8/8/8 w - - 0 1", from: "e4", to: "d5", san: "Rd5", answer: { fr: "Déplacez le roi en d5.", en: "Move the king to d5." }, idea: { fr: "Le roi avance d’une seule case dans toutes les directions.", en: "The king moves one square in any direction." } },
      { positionFen: "4k3/8/8/8/4Q3/8/8/4K3 w - - 0 1", from: "e4", to: "h7", san: "Dh7+", answer: { fr: "Faites glisser la dame en h7.", en: "Slide the queen to h7." }, idea: { fr: "La dame combine les lignes droites et les diagonales.", en: "The queen combines straight lines and diagonals." } },
      { positionFen: "4k3/8/8/8/4R3/8/8/4K3 w - - 0 1", from: "e4", to: "a4", san: "Ta4", answer: { fr: "Placez la tour en a4.", en: "Place the rook on a4." }, idea: { fr: "La tour a besoin d’une ligne ou d’une colonne libre.", en: "The rook needs a clear rank or file." } },
      { positionFen: "4k3/8/8/8/4B3/8/8/4K3 w - - 0 1", from: "e4", to: "a8", san: "Fa8+", answer: { fr: "Suivez la diagonale avec le fou.", en: "Follow the diagonal with the bishop." }, idea: { fr: "Le fou reste sur la couleur de sa case de départ.", en: "The bishop stays on its starting square color." } },
      { positionFen: "4k3/8/8/8/4N3/8/8/4K3 w - - 0 1", from: "e4", to: "f6", san: "Cf6+", answer: { fr: "Faites bondir le cavalier en f6.", en: "Jump the knight to f6." }, idea: { fr: "Le cavalier se déplace en L et saute par-dessus les pièces.", en: "The knight moves in an L-shape and jumps over pieces." } },
      { positionFen: standardFen, from: "e2", to: "e4", san: "e4", answer: { fr: "Avancez le pion e de deux cases.", en: "Move the e-pawn two squares." }, idea: { fr: "Depuis sa case initiale, un pion peut avancer d’une ou deux cases.", en: "From its starting square, a pawn can move one or two squares." } },
    ],
    keyPoints: [
      { title: { fr: "Ligne", en: "Line" }, text: { fr: "Tour et dame avancent droit.", en: "Rook and queen move straight." } },
      { title: { fr: "Biais", en: "Diagonal" }, text: { fr: "Fou et dame suivent les diagonales.", en: "Bishop and queen follow diagonals." } },
      { title: { fr: "Saut", en: "Jump" }, text: { fr: "Seul le cavalier saute.", en: "Only the knight jumps." } },
    ],
  },
  "3": {
    key: "3", number: "03", mode: "guided",
    title: { fr: "Prises et promotion", en: "Captures and promotion" },
    kicker: { fr: "Pratique · Gagner du matériel", en: "Practice · Win material" },
    headline: { fr: "Prenez proprement, puis transformez votre pion.", en: "Capture cleanly, then transform your pawn." },
    objective: { fr: "Comprendre la prise, choisir une promotion et relier le coup à la valeur des pièces.", en: "Understand captures, choose a promotion and connect the move to piece values." },
    solution: { fr: "Une prise se fait sur la case d’arrivée ; un pion qui atteint la dernière rangée devient immédiatement dame, tour, fou ou cavalier.", en: "A capture happens on the destination square; a pawn reaching the last rank immediately becomes a queen, rook, bishop or knight." },
    startingFen: "7k/8/8/3p4/4P3/8/8/4K3 w - - 0 1",
    drawPositions: emptyDraws,
    theorySections: emptyTheory,
    steps: [
      { from: "e4", to: "d5", san: "exd5", answer: { fr: "Prenez le pion en d5.", en: "Capture the pawn on d5." }, idea: { fr: "Le pion prend en diagonale, même s’il avance tout droit.", en: "The pawn captures diagonally even though it advances straight." } },
      { positionFen: "7k/4P3/8/8/8/8/8/4K3 w - - 0 1", from: "e7", to: "e8", san: "e8=D", answer: { fr: "Promouvez le pion en dame.", en: "Promote the pawn to a queen." }, idea: { fr: "Le choix le plus fréquent est la dame, mais les quatre promotions sont légales.", en: "The most common choice is a queen, but all four promotions are legal." } },
    ],
    keyPoints: [
      { title: { fr: "Prendre", en: "Capture" }, text: { fr: "Une pièce remplace la pièce adverse sur la case d’arrivée.", en: "Your piece replaces the opponent’s piece on the destination square." } },
      { title: { fr: "Valeur", en: "Value" }, text: { fr: "Les valeurs 1, 3, 5 et 9 donnent un premier repère.", en: "Values 1, 3, 5 and 9 provide a first reference." } },
      { title: { fr: "Promouvoir", en: "Promote" }, text: { fr: "Le pion change de rôle dès la dernière rangée.", en: "The pawn changes role on the last rank." } },
    ],
  },
  "4": {
    key: "4", number: "04", mode: "guided",
    title: { fr: "Échec et échec et mat", en: "Check and checkmate" },
    kicker: { fr: "Pratique · Menacer le roi", en: "Practice · Threaten the king" },
    headline: { fr: "Faites la différence entre une menace et la fin de la partie.", en: "Tell the difference between a threat and the end of the game." },
    objective: { fr: "Donner échec, répondre à une menace et reconnaître un échec et mat.", en: "Give check, answer a threat and recognize checkmate." },
    solution: { fr: "L’échec oblige le roi à répondre. Le mat est un échec auquel aucune réponse légale ne permet d’échapper.", en: "Check forces the king to respond. Checkmate is check with no legal way out." },
    startingFen: "7k/8/8/8/8/8/5R2/6K1 w - - 0 1",
    drawPositions: emptyDraws,
    theorySections: emptyTheory,
    steps: [
      { positionFen: "7k/8/8/8/8/8/8/4Q1K1 w - - 0 1", from: "e1", to: "h4", san: "Dh4+", answer: { fr: "Donnez échec avec la dame en h4.", en: "Give check with the queen on h4." }, idea: { fr: "Le roi attaqué doit répondre au coup suivant.", en: "The attacked king must respond on the next move." } },
      { positionFen: "7k/5Q2/6K1/8/8/8/8/8 w - - 0 1", from: "f7", to: "g7", san: "Dg7#", answer: { fr: "Trouvez l’échec et mat en g7.", en: "Find checkmate on g7." }, idea: { fr: "Le roi ne peut ni fuir, ni prendre la dame, ni interposer une pièce.", en: "The king cannot flee, capture the queen or block the line." } },
    ],
    keyPoints: [
      { title: { fr: "Échec", en: "Check" }, text: { fr: "Le roi est attaqué et doit répondre.", en: "The king is attacked and must respond." } },
      { title: { fr: "Répondre", en: "Respond" }, text: { fr: "Fuir, prendre l’attaquant ou interposer une pièce.", en: "Move away, capture the attacker or block." } },
      { title: { fr: "Mat", en: "Mate" }, text: { fr: "Aucune réponse légale : la partie s’arrête.", en: "No legal response: the game ends." } },
    ],
  },
  "5": {
    key: "5", number: "05", mode: "draws",
    title: { fr: "Coups spéciaux et parties nulles", en: "Special moves and drawn games" },
    kicker: { fr: "Pratique · Les exceptions et les arrêts", en: "Practice · Exceptions and stops" },
    headline: { fr: "Jouez les exceptions, puis reconnaissez quand personne ne gagne.", en: "Play the exceptions, then recognize when nobody wins." },
    objective: { fr: "Exécuter les deux roques, la prise en passant, puis explorer le pat et les principales nulles.", en: "Play both castling moves and en passant, then explore stalemate and the main draws." },
    solution: { fr: "Le roque protège le roi sous conditions ; la prise en passant est immédiate ; le pat, la répétition, la règle des 50 coups et le matériel insuffisant produisent une nulle selon la position.", en: "Castling protects the king under conditions; en passant is immediate; stalemate, repetition, the 50-move rule and insufficient material draw the game according to the position." },
    startingFen: "4k3/8/8/8/8/8/8/R3K2R w KQ - 0 1",
    theorySections: emptyTheory,
    steps: [
      { positionFen: "4k3/8/8/8/8/8/8/R3K2R w KQ - 0 1", from: "e1", to: "g1", san: "O-O", reply: "Ke7", replySan: "Re7", answer: { fr: "Roquez du côté roi.", en: "Castle kingside." }, idea: { fr: "Le roi avance de deux cases et la tour vient à côté de lui. Ni le roi ni la tour ne doivent avoir bougé et le roi ne traverse aucune case attaquée.", en: "The king moves two squares and the rook comes beside it. Neither piece may have moved and the king may not cross an attacked square." } },
      { positionFen: "4k3/8/8/8/8/8/8/R3K2R w KQ - 0 1", from: "e1", to: "c1", san: "O-O-O", answer: { fr: "Roquez du côté dame.", en: "Castle queenside." }, idea: { fr: "Le roque long suit les mêmes conditions, avec la tour a1.", en: "Queenside castling follows the same conditions, using the a1 rook." } },
      { positionFen: "4k3/8/8/3pP3/8/8/8/4K2R w K d6 0 1", from: "e5", to: "d6", san: "exd6 e.p.", answer: { fr: "Prenez le pion d5 en passant.", en: "Capture the d5-pawn en passant." }, idea: { fr: "La prise n’est possible qu’immédiatement après le double pas adverse et le pion blanc arrive en d6.", en: "The capture is possible only immediately after the opposing double step and the white pawn lands on d6." } },
    ],
    drawPositions: [
      { id: "stalemate", title: { fr: "Pat", en: "Stalemate" }, explanation: { fr: "Le joueur au trait n’est pas en échec mais n’a aucun coup légal : la partie est nulle.", en: "The player to move is not in check but has no legal move: the game is drawn." }, fen: "7k/5Q2/5K2/8/8/8/8/8 b - - 0 1" },
      { id: "repetition", title: { fr: "Nulle par répétition", en: "Threefold repetition" }, explanation: { fr: "La même position revient trois fois avec le même joueur au trait et les mêmes droits : la partie peut être déclarée nulle.", en: "The same position occurs three times with the same side to move and the same rights: the game can be drawn." }, fen: standardFen, setupMoves: ["Nf3", "Nf6", "Ng1", "Ng8", "Nf3", "Nf6", "Ng1", "Ng8", "Nf3", "Nf6", "Ng1", "Ng8"] },
      { id: "fifty-move", title: { fr: "Règle des 50 coups", en: "50-move rule" }, explanation: { fr: "Après 50 coups de chaque joueur sans prise ni mouvement de pion, une nulle peut être réclamée selon les règles appliquées.", en: "After 50 moves by each side without a capture or pawn move, a draw can be claimed under the rules in force." }, fen: "8/8/8/8/8/2k5/8/2K5 w - - 100 1" },
      { id: "insufficient-material", title: { fr: "Matériel insuffisant", en: "Insufficient material" }, explanation: { fr: "Avec un matériel qui ne permet pas de mater, comme roi contre roi ou roi et cavalier contre roi, la partie est nulle.", en: "With material that cannot deliver checkmate, such as king versus king or king and knight versus king, the game is drawn." }, fen: "7k/8/8/8/8/8/6N1/6K1 w - - 0 1" },
    ],
    keyPoints: [
      { title: { fr: "Roquer", en: "Castle" }, text: { fr: "Le roi et une tour bougent ensemble sous conditions.", en: "The king and a rook move together under conditions." } },
      { title: { fr: "En passant", en: "En passant" }, text: { fr: "Une seule réponse, tout de suite.", en: "One immediate response only." } },
      { title: { fr: "Nulle", en: "Draw" }, text: { fr: "Une partie peut s’arrêter sans vainqueur.", en: "A game can end without a winner." } },
    ],
  },
  "6": {
    key: "6", number: "06", mode: "computer",
    title: { fr: "Jouer une partie complète", en: "Play a complete game" },
    kicker: { fr: "Validation · Jouer sans consulter les règles", en: "Checkpoint · Play without checking the rules" },
    headline: { fr: "Mettez toutes vos connaissances en mouvement.", en: "Put everything you learned into motion." },
    objective: { fr: "Jouer une partie légale contre un ordinateur accessible et la gagner pour débloquer le niveau 1.", en: "Play a legal game against an accessible computer and win to unlock level 1." },
    solution: { fr: "Développez vos pièces, protégez votre roi, vérifiez les menaces et jouez jusqu’au résultat. L’ordinateur joue volontairement des coups simples pour vous laisser apprendre.", en: "Develop your pieces, protect your king, check threats and play to the result. The computer deliberately plays simple moves so you can learn." },
    startingFen: standardFen,
    drawPositions: emptyDraws,
    theorySections: emptyTheory,
    computerGoal: { fr: "Gagner une partie complète contre l’ordinateur.", en: "Win a complete game against the computer." },
    steps: [],
    keyPoints: [
      { title: { fr: "Développer", en: "Develop" }, text: { fr: "Sortez les pièces et ouvrez des lignes.", en: "Bring out pieces and open lines." } },
      { title: { fr: "Protéger", en: "Protect" }, text: { fr: "Gardez votre roi hors d’échec.", en: "Keep your king out of check." } },
      { title: { fr: "Conclure", en: "Finish" }, text: { fr: "Jouez jusqu’au mat ou à la nulle.", en: "Play to checkmate or a draw." } },
    ],
  },
};

export function getNextStepPosition(steps: LessonStep[], nextStepIndex: number, afterUserMoveFen: string) {
  return steps[nextStepIndex]?.positionFen ?? afterUserMoveFen;
}

export function reconstructPosition(steps: LessonStep[], completedStep: number, startingFen: string) {
  let game = new Chess(startingFen);
  steps.slice(0, completedStep).forEach((step) => {
    if (step.positionFen) game = new Chess(step.positionFen);
    game.move({ from: step.from as Square, to: step.to as Square, promotion: "q" });
    if (step.reply) game.move(step.reply);
  });
  return game.fen();
}

export function createDrawPosition(position: DrawPosition) {
  const game = new Chess(position.fen);
  for (const move of position.setupMoves ?? []) game.move(move);
  return game;
}
