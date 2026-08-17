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
};

type ClassifyInput = {
  attemptedFrom: string;
  attemptedTo: string;
  expectedFrom: string;
  expectedTo: string;
  stepIndex: number;
  attemptNumber: number;
};

export function classifyMistake({ attemptedFrom, attemptedTo, expectedFrom, expectedTo, stepIndex, attemptNumber }: ClassifyInput): PedagogicalMistake {
  const attemptedMove = `${attemptedFrom}–${attemptedTo}`;
  const expectedMove = `${expectedFrom}–${expectedTo}`;

  if (stepIndex === 0 && attemptedFrom === "e2") {
    return {
      attemptedMove,
      expectedMove,
      category: "centre",
      title: "Le centre mérite plus d’espace",
      explanation: attemptedTo === "e3"
        ? "Vous avancez le pion d’une case. C’est légal, mais e4 contrôle davantage de cases centrales et ouvre immédiatement les diagonales du fou et de la dame."
        : `Vous dirigez le pion vers ${attemptedTo}. Dans cette leçon, le pion du roi est votre levier le plus direct pour prendre le centre.`,
      recommendation: "Avant de jouer, demandez-vous quelle case centrale votre coup contrôle et quelles lignes il ouvre.",
      focus: "Contrôle du centre",
      attemptNumber,
    };
  }

  if (stepIndex === 1 && attemptedFrom === "g1") {
    return {
      attemptedMove,
      expectedMove,
      category: "developpement",
      title: "Développez une pièce vers une case active",
      explanation: attemptedTo === "h3"
        ? "Le cavalier va vers le bord. Depuis f3, il contrôle e5 et d4 et participe directement à la bataille centrale."
        : `Le cavalier arrive sur ${attemptedTo}. La case f3 lui donne plus d’influence et prépare plus naturellement le roque.`,
      recommendation: "Pour chaque pièce mineure, cherchez d’abord une case centrale qui augmente son nombre de possibilités.",
      focus: "Développement des pièces",
      attemptNumber,
    };
  }

  return {
    attemptedMove,
    expectedMove,
    category: "intention",
    title: "Votre idée mérite un meilleur point de départ",
    explanation: `Vous avez essayé ${attemptedMove}, alors que l’objectif de cette étape est ${expectedMove}. Le moteur va comparer les deux intentions pour rendre la différence concrète.`,
    recommendation: "Relisez la mission, observez la pièce concernée et cherchez le coup qui sert directement le principe étudié.",
    focus: stepIndex === 0 ? "Prise du centre" : "Développement harmonieux",
    attemptNumber,
  };
}

export function enrichMistakeWithEngine(mistake: PedagogicalMistake, bestMove: string | null | undefined): PedagogicalMistake {
  if (!bestMove) return mistake;
  const normalizedBest = bestMove.toLowerCase().replace(/[^a-h0-9]/g, "");
  const normalizedExpected = mistake.expectedMove.toLowerCase().replace("–", "");
  const confirmsLesson = normalizedBest === normalizedExpected;
  return {
    ...mistake,
    engineBestMove: bestMove,
    engineGap: confirmsLesson
      ? `Stockfish confirme ${bestMove} : votre objectif et le meilleur coup moteur vont dans la même direction.`
      : `Stockfish propose ${bestMove} plutôt que ${mistake.attemptedMove}. Comparez l’intention de ces deux coups avant de rejouer.`,
  };
}
