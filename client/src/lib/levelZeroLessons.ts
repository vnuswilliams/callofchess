import { Chess, type Square } from "chess.js";
import { levelTwoLessons } from "./levelTwoLessons";

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
  definition: BilingualText;
  condition: BilingualText;
  example: BilingualText;
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
  reflection?: BilingualText;
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
      { id: "stalemate", title: { fr: "Pat", en: "Stalemate" }, explanation: { fr: "Le joueur au trait n’est pas en échec mais n’a aucun coup légal : la partie est nulle.", en: "The player to move is not in check but has no legal move: the game is drawn." }, definition: { fr: "Le pat est une position où le joueur dont c’est le tour n’est pas en échec, mais n’a aucun coup légal. La partie s’arrête immédiatement sans vainqueur.", en: "Stalemate is a position where the player to move is not in check but has no legal move. The game ends immediately without a winner." }, condition: { fr: "Pour reconnaître un pat, vérifiez que le roi n’est pas attaqué et que toutes les pièces du joueur au trait sont bloquées ou ne peuvent jouer légalement.", en: "To recognize stalemate, check that the king is not attacked and that every piece of the side to move is blocked or has no legal move." }, example: { fr: "Dans cette position, les Noirs jouent : le roi noir h8 n’est pas attaqué, mais la dame f7 et le roi f6 lui retirent toutes ses cases. Il n’a aucun coup : c’est un pat.", en: "In this position Black is to move: the black king on h8 is not attacked, but the queen on f7 and king on f6 cover every escape square. There is no legal move: stalemate." }, fen: "7k/5Q2/5K2/8/8/8/8/8 b - - 0 1" },
      { id: "repetition", title: { fr: "Nulle par répétition", en: "Threefold repetition" }, explanation: { fr: "La même position revient trois fois avec le même joueur au trait et les mêmes droits : la partie peut être déclarée nulle.", en: "The same position occurs three times with the same side to move and the same rights: the game can be drawn." }, definition: { fr: "La nulle par répétition arrive lorsque la même position complète revient au moins trois fois : mêmes pièces sur les mêmes cases, même joueur au trait et mêmes droits de roque ou de prise en passant.", en: "Threefold repetition occurs when the same complete position appears at least three times: the same pieces on the same squares, the same side to move and the same castling or en passant rights." }, condition: { fr: "La répétition doit concerner la position entière, pas seulement les pièces visibles. Les droits spéciaux et le joueur au trait doivent aussi être identiques ; la nulle peut alors être réclamée.", en: "The whole position must repeat, not just the visible pieces. Special rights and the side to move must also be identical; the draw can then be claimed." }, example: { fr: "La suite Cavalier f3, Cavalier f6, Cavalier g1, Cavalier g8 est répétée trois fois. La position de départ revient trois fois avec les mêmes droits : une nulle par répétition est possible.", en: "The sequence Knight f3, Knight f6, Knight g1, Knight g8 is repeated three times. The starting position returns three times with the same rights: a threefold-repetition draw is possible." }, fen: standardFen, setupMoves: ["Nf3", "Nf6", "Ng1", "Ng8", "Nf3", "Nf6", "Ng1", "Ng8", "Nf3", "Nf6", "Ng1", "Ng8"] },
      { id: "fifty-move", title: { fr: "Règle des 50 coups", en: "50-move rule" }, explanation: { fr: "Après 50 coups de chaque joueur sans prise ni mouvement de pion, une nulle peut être réclamée selon les règles appliquées.", en: "After 50 moves by each side without a capture or pawn move, a draw can be claimed under the rules in force." }, definition: { fr: "La règle des 50 coups permet de réclamer la nulle lorsque 50 coups ont été joués par chaque joueur sans prise et sans mouvement de pion.", en: "The 50-move rule allows a draw claim after each player has made 50 moves without a capture or a pawn move." }, condition: { fr: "Le compteur de demi-coups doit atteindre 100 : chaque demi-coup est un coup d’un joueur, et il est remis à zéro après une prise ou un mouvement de pion.", en: "The halfmove clock must reach 100: each halfmove is one player’s move, and the clock resets after a capture or a pawn move." }, example: { fr: "Ici, il ne reste que les rois et le compteur indique 100 demi-coups sans prise ni pion. Les 50 coups de chaque côté sont atteints : la nulle peut être réclamée.", en: "Here only the kings remain and the clock shows 100 halfmoves without a capture or pawn move. Both players have reached 50 moves: the draw can be claimed." }, fen: "8/8/8/8/8/2k5/8/2K5 w - - 100 1" },
      { id: "insufficient-material", title: { fr: "Matériel insuffisant", en: "Insufficient material" }, explanation: { fr: "Avec un matériel qui ne permet pas de mater, comme roi contre roi ou roi et cavalier contre roi, la partie est nulle.", en: "With material that cannot deliver checkmate, such as king versus king or king and knight versus king, the game is drawn." }, definition: { fr: "Le matériel est insuffisant lorsque les pièces restantes ne peuvent jamais produire un échec et mat légal, même avec une mauvaise défense adverse. La partie est alors nulle.", en: "Material is insufficient when the remaining pieces can never produce a legal checkmate, even with the opponent’s worst defense. The game is drawn." }, condition: { fr: "Il faut examiner toutes les pièces restantes et se demander si un mat est théoriquement possible. Roi contre roi, roi et cavalier contre roi ou roi et fou contre roi sont des exemples classiques.", en: "Examine all remaining pieces and ask whether checkmate is theoretically possible. King versus king, king and knight versus king, and king and bishop versus king are classic examples." }, example: { fr: "Dans cette position, les Blancs ont un roi et un cavalier contre le roi noir. Un seul cavalier ne peut pas mater : le résultat est donc une nulle immédiate.", en: "In this position White has a king and a knight against the black king. A lone knight cannot checkmate: the result is therefore an immediate draw." }, fen: "7k/8/8/8/8/8/6N1/6K1 w - - 0 1" },
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
  "7": {
    key: "7", number: "07", mode: "guided",
    title: { fr: "Les objectifs d’une position", en: "The goals of a position" },
    kicker: { fr: "Fondamentaux · Lire avant d’agir", en: "Fundamentals · Read before acting" },
    headline: { fr: "Un bon coup sert un objectif précis.", en: "A good move serves a precise goal." },
    objective: { fr: "Reconnaître six objectifs : mater, protéger le roi, gagner du matériel, créer une menace, améliorer une pièce et gagner un tempo.", en: "Recognize six goals: checkmate, king safety, winning material, creating a threat, improving a piece and gaining a tempo." },
    reflection: { fr: "Quel est l’objectif concret de cette position ?", en: "What is the concrete goal of this position?" },
    solution: { fr: "Avant de choisir un coup, nommez son objectif. Une position devient lisible quand vous savez ce que votre coup cherche à obtenir.", en: "Before choosing a move, name its goal. A position becomes readable when you know what your move is trying to achieve." },
    startingFen: standardFen,
    theorySections: [
      { title: { fr: "La question centrale", en: "The central question" }, text: { fr: "Un coup n’est pas bon parce qu’il est joli : il est bon s’il améliore concrètement votre position ou répond à un danger. Commencez par demander : quel est l’objectif de cette position ?", en: "A move is not good because it looks nice: it is good when it concretely improves your position or answers a danger. Start by asking: what is the goal of this position?" }, items: [{ label: { fr: "Six repères", en: "Six reference points" }, text: { fr: "Mat, roi en sécurité, matériel, menace, activité et tempo sont six façons de vérifier qu’un coup a un sens.", en: "Mate, king safety, material, threat, activity and tempo are six ways to check that a move has a purpose." } }] },
      { title: { fr: "Le tempo est un coup utile", en: "A tempo is a useful move" }, text: { fr: "Gagner un tempo signifie faire avancer votre plan pendant que l’adversaire doit répondre. Un échec, une prise ou une attaque de pièce peuvent forcer cette réponse.", en: "Gaining a tempo means advancing your plan while the opponent must respond. A check, a capture or an attack on a piece can force that reply." } },
      { title: { fr: "Ne pas confondre activité et agitation", en: "Do not confuse activity with movement" }, text: { fr: "Une pièce déplacée plusieurs fois n’est pas forcément mieux placée. Comparez toujours la case de départ, la case d’arrivée et ce que l’adversaire peut faire ensuite.", en: "A piece moved several times is not necessarily better placed. Always compare the starting square, the destination and what the opponent can do next." } },
    ],
    drawPositions: emptyDraws,
    steps: [
      { positionFen: "7k/5Q2/6K1/8/8/8/8/8 w - - 0 1", from: "f7", to: "g7", san: "Dg7#", answer: { fr: "Trouvez l’échec et mat.", en: "Find checkmate." }, idea: { fr: "Objectif 1 — le mat termine la partie, car le roi n’a aucune réponse légale.", en: "Goal 1 — checkmate ends the game because the king has no legal reply." } },
      { positionFen: "r3k2r/ppp2ppp/2n5/3pp3/8/2N2N2/PPPP1PPP/R3K2R w KQkq - 0 1", from: "e1", to: "g1", san: "O-O", answer: { fr: "Mettez le roi en sécurité.", en: "Keep the king safe." }, idea: { fr: "Objectif 2 — le roque met le roi à l’abri et active une tour.", en: "Goal 2 — castling shelters the king and activates a rook." } },
      { positionFen: "4k3/8/8/8/8/3r4/4Q3/4K3 w - - 0 1", from: "e2", to: "d3", san: "Dxd3", answer: { fr: "Gagnez le matériel qui est attaqué.", en: "Win the attacked material." }, idea: { fr: "Objectif 3 — vérifiez les prises avant de jouer un coup calme.", en: "Goal 3 — check captures before playing a quiet move." } },
      { positionFen: "4k3/8/8/8/8/2b5/3Q4/4K3 w - - 0 1", from: "d2", to: "c3", san: "Dxc3", answer: { fr: "Répondez à la menace adverse.", en: "Answer the opponent’s threat." }, idea: { fr: "Objectif 4 — le fou attaquait la dame : votre coup supprime le danger et gagne une pièce.", en: "Goal 4 — the bishop attacked your queen: your move removes the danger and wins a piece." } },
      { positionFen: "4k3/8/8/8/8/8/1N6/4K3 w - - 0 1", from: "b2", to: "c4", san: "Cc4", answer: { fr: "Améliorez votre pièce la moins active.", en: "Improve your least active piece." }, idea: { fr: "Objectif 5 — une case centrale augmente les cases contrôlées par le cavalier.", en: "Goal 5 — a central square increases the knight’s controlled squares." } },
      { positionFen: "k7/8/8/8/8/8/4R3/4K3 w - - 0 1", from: "e2", to: "e8", san: "Te8+", answer: { fr: "Gagnez un tempo avec un échec.", en: "Gain a tempo with check." }, idea: { fr: "Objectif 6 — l’échec force le roi à répondre pendant que votre tour devient active.", en: "Goal 6 — check forces the king to reply while your rook becomes active." } },
    ],
    keyPoints: [
      { title: { fr: "Objectif", en: "Goal" }, text: { fr: "Nommez ce que votre coup cherche à obtenir.", en: "Name what your move is trying to achieve." } },
      { title: { fr: "Conséquence", en: "Consequence" }, text: { fr: "Calculez la réponse adverse avant de conclure.", en: "Calculate the opponent’s reply before deciding." } },
      { title: { fr: "Tempo", en: "Tempo" }, text: { fr: "Un coup forcing fait avancer votre plan.", en: "A forcing move advances your plan." } },
    ],
  },
  "8": {
    key: "8", number: "08", mode: "guided",
    title: { fr: "Les principes d’ouverture", en: "Opening principles" },
    kicker: { fr: "Ouverture · Comprendre, ne pas réciter", en: "Opening · Understand, do not recite" },
    headline: { fr: "Construisez une position qui joue toute seule.", en: "Build a position that plays itself." },
    objective: { fr: "Relier centre, développement rapide, pièces mineures, roque, dame et tours connectées.", en: "Connect the center, rapid development, minor pieces, castling, queen timing and connected rooks." },
    reflection: { fr: "Quel principe de développement donne le plus de valeur à ce coup ?", en: "Which development principle gives this move the most value?" },
    solution: { fr: "Le début de partie sert à donner de l’espace à vos pièces, à sortir les pièces mineures, à roquer et à relier les tours. Chaque tempo compte.", en: "The opening gives your pieces space, develops the minor pieces, castles and connects the rooks. Every tempo matters." },
    startingFen: standardFen,
    theorySections: [
      { title: { fr: "Le centre donne des cases", en: "The center gives squares" }, text: { fr: "e4 ou d4 ne sont pas des mots de passe. Ces coups contrôlent des cases centrales, ouvrent des lignes et facilitent le développement. Le même principe vaut pour les Noirs avec …e5 ou …d5.", en: "e4 or d4 are not passwords. They control central squares, open lines and make development easier. The same principle applies to Black with …e5 or …d5." } },
      { title: { fr: "Développer avant d’attaquer", en: "Develop before attacking" }, text: { fr: "Sortez d’abord les cavaliers et les fous. Déplacer plusieurs fois la même pièce ou sortir la dame trop tôt coûte des tempi, sauf si une raison concrète le justifie.", en: "Develop knights and bishops first. Moving the same piece repeatedly or bringing the queen out early costs tempi unless a concrete reason justifies it." } },
      { title: { fr: "Le roque prépare la suite", en: "Castling prepares the next phase" }, text: { fr: "Roquer met le roi en sécurité et connecte progressivement les tours. L’objectif n’est pas de roquer par automatisme, mais de terminer le développement sans laisser le roi au centre.", en: "Castling keeps the king safe and gradually connects the rooks. The goal is not to castle automatically, but to complete development without leaving the king in the center." } },
    ],
    drawPositions: emptyDraws,
    steps: [
      { positionFen: standardFen, from: "e2", to: "e4", san: "e4", answer: { fr: "Contrôlez le centre.", en: "Control the center." }, idea: { fr: "e4 contrôle d5 et f5, ouvre le fou f1 et donne une direction à la partie.", en: "e4 controls d5 and f5, opens the f1 bishop and gives the game direction." } },
      { positionFen: "rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2", from: "g1", to: "f3", san: "Cf3", answer: { fr: "Sortez une pièce mineure.", en: "Develop a minor piece." }, idea: { fr: "Le cavalier contrôle e5 et d4, sans perdre un tempo à chercher une attaque.", en: "The knight controls e5 and d4 without spending a tempo looking for an attack." } },
      { positionFen: "rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2", from: "b1", to: "c3", san: "Cc3", answer: { fr: "Développez la seconde pièce mineure.", en: "Develop the second minor piece." }, idea: { fr: "Deux pièces développées coordonnent déjà le contrôle du centre.", en: "Two developed pieces already coordinate central control." } },
      { positionFen: "rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2", from: "c1", to: "f4", san: "Ff4", answer: { fr: "Développez le fou sans déplacer la dame.", en: "Develop the bishop without moving the queen." }, idea: { fr: "Une pièce mineure active vaut souvent mieux qu’une sortie précoce de la dame.", en: "An active minor piece is often better than an early queen sortie." } },
      { positionFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", from: "g1", to: "f3", san: "Cf3", answer: { fr: "Préférez le développement à la dame précoce.", en: "Prefer development to an early queen." }, idea: { fr: "Si aucune menace ne l’impose, ne donnez pas à l’adversaire un tempo en attaquant votre dame.", en: "If no threat demands it, do not give the opponent a tempo by exposing your queen." } },
      { positionFen: "r3k2r/ppp2ppp/2n5/3pp3/8/2N2N2/PPPP1PPP/R3K2R w KQkq - 0 1", from: "e1", to: "g1", san: "O-O", answer: { fr: "Roquez pour finir la mise en place.", en: "Castle to complete the setup." }, idea: { fr: "Après le roque, la tour h1 arrive en f1 et les tours peuvent se connecter.", en: "After castling, the h1 rook reaches f1 and the rooks can connect." } },
    ],
    keyPoints: [
      { title: { fr: "Centre", en: "Center" }, text: { fr: "L’espace central donne des cases aux pièces.", en: "Central space gives your pieces squares." } },
      { title: { fr: "Temps", en: "Time" }, text: { fr: "Ne rejouez pas une pièce sans nécessité.", en: "Do not replay a piece without a reason." } },
      { title: { fr: "Coordination", en: "Coordination" }, text: { fr: "Roquer et connecter les tours concluent la mise en place.", en: "Castling and connecting the rooks complete the setup." } },
    ],
  },
  "9": {
    key: "9", number: "09", mode: "guided",
    title: { fr: "Roi en sécurité et roquer", en: "King safety and castling" },
    kicker: { fr: "Fondamentaux · Le roi d’abord", en: "Fundamentals · The king first" },
    headline: { fr: "Ne laissez pas votre roi jouer seul au centre.", en: "Do not leave your king alone in the center." },
    objective: { fr: "Préparer le roque, vérifier les cases traversées et comprendre pourquoi la sécurité du roi passe avant une attaque décorative.", en: "Prepare castling, check the crossed squares and understand why king safety comes before a decorative attack." },
    reflection: { fr: "Mon roi est-il en sécurité avant que je cherche une attaque ?", en: "Is my king safe before I look for an attack?" },
    solution: { fr: "Le roi en sécurité vous donne le temps de développer et de créer des menaces sans subir un échec permanent.", en: "A safe king gives you time to develop and create threats without facing constant checks." },
    startingFen: standardFen,
    theorySections: [
      { title: { fr: "Les trois vérifications", en: "The three checks" }, text: { fr: "Avant de roquer, vérifiez que le roi et la tour n’ont pas bougé, que les cases entre eux sont libres et qu’aucune case du trajet n’est attaquée.", en: "Before castling, check that the king and rook have not moved, that the squares between them are empty and that no square on the route is attacked." } },
      { title: { fr: "Sécurité avant vitesse", en: "Safety before speed" }, text: { fr: "Un coup d’attaque qui laisse votre roi au centre peut coûter la partie. Demandez si l’adversaire a un échec, une prise ou une menace plus forte que votre idée.", en: "An attacking move that leaves your king in the center can lose the game. Ask whether the opponent has a check, capture or stronger threat than your idea." } },
    ],
    drawPositions: emptyDraws,
    steps: [
      { positionFen: "r1bqk2r/ppppbppp/2n2n2/4p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 4", from: "e1", to: "g1", san: "O-O", answer: { fr: "Roquez maintenant que le chemin est libre.", en: "Castle now that the path is clear." }, idea: { fr: "Le roi quitte le centre et la tour f1 devient active.", en: "The king leaves the center and the f1 rook becomes active." } },
      { positionFen: "r3k2r/ppp2ppp/2n5/3pp3/8/2N2N2/PPPP1PPP/R3K2R w KQkq - 0 1", from: "e1", to: "g1", san: "O-O", answer: { fr: "Choisissez la sécurité plutôt qu’un coup impatient.", en: "Choose safety over an impatient move." }, idea: { fr: "Le roque est un investissement de sécurité : il réduit les échecs possibles contre le roi.", en: "Castling is a safety investment: it reduces the checks available against your king." } },
      { positionFen: "r3k2r/ppp2ppp/2n5/3pp3/8/2N2N2/PPPP1PPP/R3K2R w KQkq - 0 1", from: "e1", to: "c1", san: "O-O-O", answer: { fr: "Reconnaissez aussi le roque long.", en: "Recognize queenside castling too." }, idea: { fr: "Le principe reste le même : le roi se déplace de deux cases vers une tour qui vient à côté de lui.", en: "The principle is the same: the king moves two squares toward a rook that comes beside it." } },
    ],
    keyPoints: [
      { title: { fr: "Préparer", en: "Prepare" }, text: { fr: "Libérez les cases entre roi et tour.", en: "Clear the squares between king and rook." } },
      { title: { fr: "Vérifier", en: "Check" }, text: { fr: "Le roi ne traverse pas une case attaquée.", en: "The king cannot cross an attacked square." } },
      { title: { fr: "Protéger", en: "Protect" }, text: { fr: "Un roi sûr peut ensuite créer des menaces.", en: "A safe king can then create threats." } },
    ],
  },
  "10": {
    key: "10", number: "10", mode: "guided",
    title: { fr: "Gagner du matériel sans le donner", en: "Win material without giving it away" },
    kicker: { fr: "Fondamentaux · Compter avant de prendre", en: "Fundamentals · Count before capturing" },
    headline: { fr: "Une prise utile commence par une vérification.", en: "A useful capture starts with a check." },
    objective: { fr: "Repérer une pièce attaquée, comparer les échanges et vérifier que votre coup ne laisse pas une pièce en prise.", en: "Spot an attacked piece, compare exchanges and check that your move does not leave a piece hanging." },
    reflection: { fr: "Après ma prise, quelle est la meilleure recapture adverse ?", en: "After my capture, what is the opponent’s best recapture?" },
    solution: { fr: "Gagner du matériel ne signifie pas prendre à tout prix. Comptez les défenseurs, les attaquants et la réponse adverse.", en: "Winning material does not mean capturing at all costs. Count defenders, attackers and the opponent’s reply." },
    startingFen: standardFen,
    theorySections: [
      { title: { fr: "La règle de la prise", en: "The capture rule" }, text: { fr: "Avant une prise, demandez : que recapture l’adversaire ? Après la prise, quelle pièce devient faible ? Une pièce gagnée qui permet un mat n’est pas un vrai gain.", en: "Before a capture, ask: what can the opponent recapture? After the capture, which piece becomes weak? A piece won while allowing mate is not a real gain." } },
      { title: { fr: "Valeur et position", en: "Value and position" }, text: { fr: "Les repères 1, 3, 5 et 9 aident à compter, mais l’activité et la sécurité du roi peuvent rendre un échange favorable ou dangereux.", en: "The 1, 3, 5 and 9 reference values help you count, but activity and king safety can make an exchange favorable or dangerous." } },
    ],
    drawPositions: emptyDraws,
    steps: [
      { positionFen: "4k3/8/8/8/8/3r4/4Q3/4K3 w - - 0 1", from: "e2", to: "d3", san: "Dxd3", answer: { fr: "Prenez la tour exposée.", en: "Capture the exposed rook." }, idea: { fr: "La dame gagne cinq points de matériel sans traverser une case occupée.", en: "The queen wins five points of material without crossing an occupied square." } },
      { positionFen: "4k3/8/8/8/3n4/2B5/8/4K3 w - - 0 1", from: "c3", to: "d4", san: "Fxd4", answer: { fr: "Comparez les échanges avant de prendre.", en: "Compare the exchanges before capturing." }, idea: { fr: "Le fou prend le cavalier : vérifiez toujours la valeur de la pièce et la sécurité de votre propre roi.", en: "The bishop captures the knight: always check the piece value and your own king’s safety." } },
      { positionFen: "4k3/8/8/8/8/2n5/3Q4/4K3 w - - 0 1", from: "d2", to: "c3", san: "Dxc3", answer: { fr: "Retirez la pièce qui pourrait vous faire perdre du matériel.", en: "Remove the piece that could make you lose material." }, idea: { fr: "La meilleure prise est parfois défensive : elle évite de laisser la dame ou le roi sous une menace concrète.", en: "The best capture is sometimes defensive: it prevents your queen or king from remaining under a concrete threat." } },
    ],
    keyPoints: [
      { title: { fr: "Compter", en: "Count" }, text: { fr: "Évaluez la pièce prise et la recapture.", en: "Evaluate the captured piece and the recapture." } },
      { title: { fr: "Défendre", en: "Defend" }, text: { fr: "Une prise peut supprimer une menace.", en: "A capture can remove a threat." } },
      { title: { fr: "Roi", en: "King" }, text: { fr: "Aucun gain matériel ne justifie un roi en danger.", en: "No material gain justifies an exposed king." } },
    ],
  },
  "11": {
    key: "11", number: "11", mode: "guided",
    title: { fr: "Créer des menaces et améliorer ses pièces", en: "Create threats and improve your pieces" },
    kicker: { fr: "Fondamentaux · Faire travailler ses pièces", en: "Fundamentals · Make your pieces work" },
    headline: { fr: "Une menace oblige l’adversaire à vous écouter.", en: "A threat makes the opponent listen." },
    objective: { fr: "Créer une menace lisible, améliorer la pire pièce et coordonner les forces avant de forcer une combinaison.", en: "Create a clear threat, improve the worst piece and coordinate your forces before forcing a combination." },
    reflection: { fr: "Quelle pièce travaille le moins, et quelle menace peut-elle aider à créer ?", en: "Which piece is doing the least, and what threat can it help create?" },
    solution: { fr: "Cherchez la pièce qui travaille le moins, donnez-lui une meilleure case et créez une menace que l’adversaire doit respecter.", en: "Find the piece doing the least, give it a better square and create a threat the opponent must respect." },
    startingFen: standardFen,
    theorySections: [
      { title: { fr: "Une menace est une question", en: "A threat is a question" }, text: { fr: "Une menace demande à l’adversaire de répondre : défendre une pièce, empêcher un mat, contrôler une case ou accepter une perte. Une attaque sans conséquence n’est qu’un déplacement.", en: "A threat asks the opponent to reply: defend a piece, stop mate, control a square or accept a loss. An attack without a consequence is just a move." } },
      { title: { fr: "La pire pièce d’abord", en: "The worst piece first" }, text: { fr: "Quand aucun coup forcing n’existe, améliorez la pièce la moins utile. Une pièce active augmente vos possibilités et réduit celles de l’adversaire.", en: "When there is no forcing move, improve the least useful piece. An active piece increases your options and reduces the opponent’s." } },
    ],
    drawPositions: emptyDraws,
    steps: [
      { positionFen: "r3k2r/pppq1ppp/2n5/4p3/2B1P3/2N2N2/PPPP1PPP/R2QK2R w KQkq - 0 1", from: "c4", to: "f7", san: "Fxf7+", answer: { fr: "Créez une menace avec tempo.", en: "Create a threat with tempo." }, idea: { fr: "L’échec force une réponse et attire l’attention sur le roi, les pièces et les cases faibles.", en: "Check forces a reply and focuses attention on the king, pieces and weak squares." } },
      { positionFen: "4k3/8/8/8/8/8/1N6/4K3 w - - 0 1", from: "b2", to: "c4", san: "Cc4", answer: { fr: "Améliorez votre pire pièce.", en: "Improve your worst piece." }, idea: { fr: "Le cavalier quitte le bord et contrôle davantage de cases centrales.", en: "The knight leaves the edge and controls more central squares." } },
      { positionFen: "k7/8/8/8/8/8/4R3/4K3 w - - 0 1", from: "e2", to: "e8", san: "Te8+", answer: { fr: "Activez une pièce en créant une menace.", en: "Activate a piece while creating a threat." }, idea: { fr: "La tour centralisée donne échec : activité et menace avancent ensemble.", en: "The centralized rook gives check: activity and threat advance together." } },
    ],
    keyPoints: [
      { title: { fr: "Menace", en: "Threat" }, text: { fr: "L’adversaire doit avoir une raison de répondre.", en: "The opponent must have a reason to reply." } },
      { title: { fr: "Activité", en: "Activity" }, text: { fr: "Une meilleure case augmente les possibilités.", en: "A better square increases your options." } },
      { title: { fr: "Coordonner", en: "Coordinate" }, text: { fr: "Les pièces doivent viser le même objectif.", en: "The pieces should aim at the same goal." } },
    ],
  },
  "12": {
    key: "12", number: "12", mode: "guided",
    title: { fr: "Que veut faire l’adversaire ?", en: "What does the opponent want?" },
    kicker: { fr: "Réflexe · La question avant chaque coup", en: "Reflex · The question before every move" },
    headline: { fr: "Votre coup commence par une question.", en: "Your move starts with a question." },
    objective: { fr: "Installer le réflexe : que veut faire mon adversaire, puis qu’est-ce que mon coup lui permet ?", en: "Build the reflex: what does my opponent want, then what does my move allow them to do?" },
    reflection: { fr: "Que veut faire mon adversaire ? Qu’est-ce que mon coup lui permet ?", en: "What does my opponent want? What does my move allow them to do?" },
    solution: { fr: "Regardez d’abord les échecs, les prises et les menaces adverses. Ensuite seulement, choisissez votre idée et vérifiez sa conséquence.", en: "Look first for the opponent’s checks, captures and threats. Only then choose your idea and check its consequence." },
    startingFen: standardFen,
    theorySections: [
      { title: { fr: "Le rituel en deux questions", en: "The two-question ritual" }, text: { fr: "Avant chaque coup, dites mentalement : « Que veut faire mon adversaire ? » Puis : « Qu’est-ce que mon coup permet à mon adversaire ? » Cette pause transforme un coup automatique en décision.", en: "Before every move, ask yourself: ‘What does my opponent want?’ Then: ‘What does my move allow my opponent to do?’ This pause turns an automatic move into a decision." } },
      { title: { fr: "Échecs, prises, menaces", en: "Checks, captures, threats" }, text: { fr: "Pour lire le plan adverse, commencez par les coups forcing. S’il n’y en a pas, cherchez la pièce qui attaque, la case qui s’ouvre ou le pion qui veut avancer.", en: "To read the opponent’s plan, start with forcing moves. If there are none, look for the piece that attacks, the square that opens or the pawn that wants to advance." } },
      { title: { fr: "Une permission coûte cher", en: "A permission has a cost" }, text: { fr: "Un coup peut être légal et pourtant permettre une menace. La dernière vérification est toujours concrète : quelle est la meilleure réponse adverse après mon coup ?", en: "A move can be legal and still allow a threat. The last check is always concrete: what is the opponent’s best reply after my move?" } },
    ],
    drawPositions: emptyDraws,
    steps: [
      { positionFen: "4k3/8/8/8/8/2b5/3Q4/4K3 w - - 0 1", from: "d2", to: "c3", san: "Dxc3", answer: { fr: "Commencez par supprimer la menace.", en: "Start by removing the threat." }, idea: { fr: "Le fou attaquait la dame. La question « que veut faire l’adversaire ? » trouve ici une réponse immédiate.", en: "The bishop attacked the queen. The question ‘what does the opponent want?’ has an immediate answer here." } },
      { positionFen: "4r1k1/8/8/8/8/8/4Q3/4K3 w - - 0 1", from: "e2", to: "e8", san: "Dxe8+", answer: { fr: "Répondez à la menace la plus forte.", en: "Answer the strongest threat." }, idea: { fr: "La tour noire regarde la colonne e : prendre la tour est plus urgent qu’un plan tranquille.", en: "The black rook controls the e-file: taking it is more urgent than a quiet plan." } },
      { positionFen: "r3k2r/ppp2ppp/2n5/3pp3/8/2N2N2/PPPP1PPP/R3K2R w KQkq - 0 1", from: "e1", to: "g1", san: "O-O", answer: { fr: "Vérifiez ce que votre coup permet.", en: "Check what your move allows." }, idea: { fr: "Le roque répond à la question de la sécurité : il ne laisse pas le roi au centre pendant que l’adversaire ouvre des lignes.", en: "Castling answers the safety question: it does not leave the king in the center while the opponent opens lines." } },
    ],
    keyPoints: [
      { title: { fr: "Observer", en: "Observe" }, text: { fr: "Cherchez d’abord le plan adverse.", en: "Look for the opponent’s plan first." } },
      { title: { fr: "Permettre", en: "Allow" }, text: { fr: "Testez la réponse adverse à votre coup.", en: "Test the opponent’s reply to your move." } },
      { title: { fr: "Décider", en: "Decide" }, text: { fr: "Choisissez ensuite votre propre objectif.", en: "Only then choose your own goal." } },
    ],
  },
};

Object.assign(lessonCatalog, levelTwoLessons);

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
