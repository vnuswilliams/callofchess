import { Chess } from "chess.js";

export type EngineBeginnerExplanation = {
  label: string;
  summary: string;
  why: string;
  nextQuestion: string;
};

export type PedagogicalMistake = {
  attemptedMove: string;
  expectedMove: string;
  category: "centre" | "developpement" | "intention";
  title: string;
  explanation: string;
  recommendation: string;
  focus: string;
  attemptNumber: number;
  engineBestMove?: string | null;
  engineGap?: string;
  bestMoveWhy?: string;
  lessonTakeaway?: string;
};

type ClassifyInput = {
  attemptedFrom: string;
  attemptedTo: string;
  expectedFrom: string;
  expectedTo: string;
  stepIndex: number;
  attemptNumber: number;
  language?: "fr" | "en";
};

export function classifyMistake({ attemptedFrom, attemptedTo, expectedFrom, expectedTo, stepIndex, attemptNumber, language = "fr" }: ClassifyInput): PedagogicalMistake {
  const attemptedMove = `${attemptedFrom}–${attemptedTo}`;
  const isEnglish = language === "en";
  const expectedMove = `${expectedFrom}–${expectedTo}`;

  if (stepIndex === 0 && attemptedFrom === "e2") {
    return {
      attemptedMove,
      expectedMove,
      category: "centre",
      title: isEnglish ? "The center needs more space" : "Le centre mérite plus d’espace",
      explanation: attemptedTo === "e3"
        ? (isEnglish ? "You advance the pawn one square. It is legal, but e4 controls more central squares and immediately opens the bishop and queen diagonals." : "Vous avancez le pion d’une case. C’est légal, mais e4 contrôle davantage de cases centrales et ouvre immédiatement les diagonales du fou et de la dame.")
        : (isEnglish ? `You move the pawn to ${attemptedTo}. In this lesson, the king pawn is your most direct lever to claim the center.` : `Vous dirigez le pion vers ${attemptedTo}. Dans cette leçon, le pion du roi est votre levier le plus direct pour prendre le centre.`),
      recommendation: isEnglish ? "Before moving, ask which central square your move controls and which lines it opens." : "Avant de jouer, demandez-vous quelle case centrale votre coup contrôle et quelles lignes il ouvre.",
      focus: isEnglish ? "Center control" : "Contrôle du centre",
      attemptNumber,
    };
  }

  if (stepIndex === 1 && attemptedFrom === "g1") {
    return {
      attemptedMove,
      expectedMove,
      category: "developpement",
      title: isEnglish ? "Develop a piece on an active square" : "Développez une pièce vers une case active",
      explanation: attemptedTo === "h3"
        ? (isEnglish ? "The knight moves toward the edge. From f3, it controls e5 and d4 and joins the central battle directly." : "Le cavalier va vers le bord. Depuis f3, il contrôle e5 et d4 et participe directement à la bataille centrale.")
        : (isEnglish ? `The knight arrives on ${attemptedTo}. The f3 square gives it more influence and prepares castling more naturally.` : `Le cavalier arrive sur ${attemptedTo}. La case f3 lui donne plus d’influence et prépare plus naturellement le roque.`),
      recommendation: isEnglish ? "For each minor piece, first look for a central square that increases its options." : "Pour chaque pièce mineure, cherchez d’abord une case centrale qui augmente son nombre de possibilités.",
      focus: isEnglish ? "Piece development" : "Développement des pièces",
      attemptNumber,
    };
  }

  return {
    attemptedMove,
    expectedMove,
    category: "intention",
    title: isEnglish ? "Your idea needs a stronger starting point" : "Votre idée mérite un meilleur point de départ",
    explanation: isEnglish ? `You tried ${attemptedMove}, while this step asks for ${expectedMove}. The engine will compare both intentions to make the difference concrete.` : `Vous avez essayé ${attemptedMove}, alors que l’objectif de cette étape est ${expectedMove}. Le moteur va comparer les deux intentions pour rendre la différence concrète.`,
    recommendation: isEnglish ? "Read the mission again, observe the relevant piece and look for the move that directly serves the principle." : "Relisez la mission, observez la pièce concernée et cherchez le coup qui sert directement le principe étudié.",
    focus: stepIndex === 0 ? (isEnglish ? "Claiming the center" : "Prise du centre") : (isEnglish ? "Harmonious development" : "Développement harmonieux"),
    attemptNumber,
  };
}

function explainBestMove(mistake: PedagogicalMistake, bestMove: string, language: "fr" | "en"): { why: string; takeaway: string } {
  const isEnglish = language === "en";
  if (mistake.category === "centre") {
    return {
      why: isEnglish ? `The best move ${bestMove} is stronger here because it takes more space in the center, controls d4 and f4, and immediately opens the bishop and queen diagonals. Your move ${mistake.attemptedMove} advances the pawn but gives your pieces less room.` : `Le meilleur coup ${bestMove} est supérieur ici parce qu’il occupe davantage le centre, contrôle les cases d4 et f4 et libère immédiatement les diagonales du fou et de la dame. Votre coup ${mistake.attemptedMove} avance le pion, mais laisse moins d’espace à vos pièces.`,
      takeaway: isEnglish ? "Remember: in the opening, prefer moves that gain space while opening lines for several pieces." : "À retenir : en ouverture, privilégiez le coup qui gagne de l’espace tout en ouvrant des lignes pour plusieurs pièces.",
    };
  }

  if (mistake.category === "developpement") {
    return {
      why: isEnglish ? `The best move ${bestMove} is stronger because it puts the knight on an active square: it influences the center, increases your options, and brings the king closer to castling. Your move ${mistake.attemptedMove} develops the piece toward a less useful square.` : `Le meilleur coup ${bestMove} est supérieur parce qu’il place le cavalier sur une case active : il influence le centre, augmente le nombre de réponses disponibles et rapproche le roi du roque. Votre coup ${mistake.attemptedMove} développe la pièce vers une case moins utile.`,
      takeaway: isEnglish ? "Remember: develop your pieces toward the center before seeking a maneuver on the edge." : "À retenir : développez vos pièces vers le centre avant de chercher une manœuvre sur le bord de l’échiquier.",
    };
  }

  return {
    why: isEnglish ? `The best move ${bestMove} is stronger because it directly follows this lesson’s principle and creates more possibilities for your pieces than ${mistake.attemptedMove}.` : `Le meilleur coup ${bestMove} est supérieur parce qu’il répond directement au principe de cette étape et crée plus de possibilités pour vos pièces que ${mistake.attemptedMove}.`,
    takeaway: isEnglish ? "Remember: the best move is not only legal; it must also serve the position’s plan." : "À retenir : le meilleur coup n’est pas seulement légal ; il doit aussi servir le plan de la position.",
  };
}

export function enrichMistakeWithEngine(mistake: PedagogicalMistake, bestMove: string | null | undefined, language: "fr" | "en" = "fr"): PedagogicalMistake {
  if (!bestMove) return mistake;
  const normalizedBest = bestMove.toLowerCase().replace(/[^a-h0-9]/g, "");
  const normalizedExpected = mistake.expectedMove.toLowerCase().replace("–", "");
  const confirmsLesson = normalizedBest === normalizedExpected;
  const { why, takeaway } = explainBestMove(mistake, bestMove, language);

  return {
    ...mistake,
    engineBestMove: bestMove,
    engineGap: confirmsLesson
      ? (language === "en" ? `Stockfish confirms ${bestMove}: your objective and the engine’s best move point in the same direction.` : `Stockfish confirme ${bestMove} : votre objectif et le meilleur coup moteur vont dans la même direction.`)
      : (language === "en" ? `Stockfish suggests ${bestMove} rather than ${mistake.attemptedMove}. Compare the purpose of both moves before trying again.` : `Stockfish propose ${bestMove} plutôt que ${mistake.attemptedMove}. Comparez l’intention de ces deux coups avant de rejouer.`),
    bestMoveWhy: why,
    lessonTakeaway: takeaway,
  };
}

export function explainEngineForBeginner(scoreCp: number | null, mate: number | null, bestMove: string | null, language: "fr" | "en" = "fr", mistake?: PedagogicalMistake | null): EngineBeginnerExplanation {
  const fr = language === "fr";
  const move = bestMove ?? (fr ? "le coup recommandé" : "the recommended move");
  const attempted = mistake?.attemptedMove;
  if (mate !== null) {
    return {
      label: fr ? "Alerte tactique" : "Tactical alert",
      summary: fr ? `Le moteur voit un mat en ${Math.abs(mate)}. La priorité n’est plus de gagner de l’espace : il faut chercher les échecs, les captures et les menaces immédiates.` : `The engine sees mate in ${Math.abs(mate)}. The priority is no longer gaining space: look for checks, captures and immediate threats.`,
      why: fr ? `${move} est le premier repère donné par Stockfish pour éviter ou créer cette menace. ${attempted ? `Votre coup ${attempted} ne répond pas assez directement au danger.` : "La position demande une réponse concrète."}` : `${move} is Stockfish’s first reference for avoiding or creating this threat. ${attempted ? `Your move ${attempted} does not answer the danger directly enough.` : "The position requires a concrete response."}`,
      nextQuestion: fr ? "Qu’est-ce qui est menacé dès le prochain coup ?" : "What is threatened on the very next move?",
    };
  }
  const score = scoreCp === null ? null : Math.abs(scoreCp);
  const label = score === null || score < 35 ? (fr ? "Position équilibrée" : "Balanced position") : score < 100 ? (fr ? "Petit avantage" : "Small advantage") : score < 220 ? (fr ? "Avantage clair" : "Clear advantage") : (fr ? "Danger important" : "Serious danger");
  const summary = score === null || score < 35
    ? (fr ? "La position reste proche de l’équilibre. Le bon coup est surtout celui qui améliore vos pièces et garde un plan simple." : "The position is close to balanced. The best move is mainly the one that improves your pieces and keeps a simple plan.")
    : (fr ? `Stockfish détecte ${label.toLowerCase()}. ${attempted ? `Le coup ${attempted} laisse donc une réponse plus forte à l’adversaire.` : "Un détail concret de la position devient prioritaire."}` : `Stockfish detects ${label.toLowerCase()}. ${attempted ? `The move ${attempted} therefore allows a stronger reply.` : "A concrete detail in the position becomes the priority."}`);
  return {
    label,
    summary,
    why: fr ? `${move} est recommandé parce qu’il améliore immédiatement la position : il crée une menace, gagne du temps ou rend vos pièces plus actives. ${attempted ? `Comparez-le à ${attempted} : ce dernier répond moins directement au besoin de la position.` : "Observez la différence sur l’échiquier plutôt que de retenir le score seul."}` : `${move} is recommended because it immediately improves the position: it creates a threat, gains time or makes your pieces more active. ${attempted ? `Compare it with ${attempted}: that move answers the position less directly.` : "Observe the difference on the board instead of memorising the score alone."}`,
    nextQuestion: fr ? "Avant votre prochain coup, quelle pièce est la moins active et quelle menace devez-vous vérifier ?" : "Before your next move, which piece is least active and which threat should you check?",
  };
}

export function formatEngineMove(move: string): string {
  const normalized = move.toLowerCase().replace(/[^a-h0-9]/g, "");
  if (normalized.length < 4) return move;
  return `${normalized.slice(0, 2)}–${normalized.slice(2, 4)}`;
}

export function formatUciAsSan(fen: string, move: string): string {
  const normalized = move.toLowerCase().replace(/[^a-h0-9qrbn]/g, "");
  if (normalized.length < 4) return move;
  try {
    const chess = new Chess(fen);
    const result = chess.move({ from: normalized.slice(0, 2), to: normalized.slice(2, 4), promotion: normalized.slice(4, 5) || undefined });
    return result.san;
  } catch {
    return formatEngineMove(move);
  }
}

export function formatPrincipalVariation(fen: string, moves: string[]): string[] {
  try {
    const chess = new Chess(fen);
    return moves.map((move) => {
      const normalized = move.toLowerCase().replace(/[^a-h0-9qrbn]/g, "");
      const result = chess.move({ from: normalized.slice(0, 2), to: normalized.slice(2, 4), promotion: normalized.slice(4, 5) || undefined });
      return result.san;
    });
  } catch {
    return moves.map(formatEngineMove);
  }
}
