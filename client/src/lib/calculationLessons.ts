import { Chess } from "chess.js";

export type CalculationBilingualText = { fr: string; en: string };
export type CalculationAction = "order" | "choice" | "line" | "compare" | "visualize";

export type CalculationAnswer = {
  id: string;
  label: CalculationBilingualText;
  correct: boolean;
};

export type CalculationMove = {
  uci: string;
  san: string;
};

export type CalculationExercise = {
  id: string;
  action: CalculationAction;
  title: CalculationBilingualText;
  prompt: CalculationBilingualText;
  fen: string;
  depth: number;
  solutionLine: CalculationMove[];
  answers: CalculationAnswer[];
  explanation: CalculationBilingualText;
  hint: CalculationBilingualText;
  opponentQuestion: CalculationBilingualText;
};

export type CalculationLesson = {
  key: string;
  number: string;
  title: CalculationBilingualText;
  kicker: CalculationBilingualText;
  headline: CalculationBilingualText;
  objective: CalculationBilingualText;
  principle: CalculationBilingualText;
  exercises: CalculationExercise[];
  keyPoints: Array<{ title: CalculationBilingualText; text: CalculationBilingualText }>;
};

const standardFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const afterCenterExchangeFen = "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2";
const openDevelopmentFen = "r1bqk2r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 4";

function move(uci: string, san: string): CalculationMove {
  return { uci, san };
}

function exercise(
  id: string,
  action: CalculationAction,
  title: CalculationBilingualText,
  prompt: CalculationBilingualText,
  fen: string,
  depth: number,
  solutionLine: CalculationMove[],
  answers: CalculationAnswer[],
  explanation: CalculationBilingualText,
  hint: CalculationBilingualText,
  opponentQuestion: CalculationBilingualText,
): CalculationExercise {
  return { id, action, title, prompt, fen, depth, solutionLine, answers, explanation, hint, opponentQuestion };
}

const answer = (id: string, fr: string, en: string, correct = false): CalculationAnswer => ({ id, label: { fr, en }, correct });

export const calculationLessonCatalog: Record<string, CalculationLesson> = {
  "35": {
    key: "35",
    number: "01",
    title: { fr: "La méthode de calcul", en: "The calculation method" },
    kicker: { fr: "Niveau 3 · Penser dans l’ordre", en: "Level 3 · Think in order" },
    headline: { fr: "Remplacez le hasard par une routine.", en: "Replace guesswork with a routine." },
    objective: { fr: "Appliquer une boucle de calcul : observer, proposer, vérifier, continuer et évaluer.", en: "Apply a calculation loop: observe, propose, verify, continue and evaluate." },
    principle: { fr: "Un coup candidat n’est qu’une hypothèse tant que vous n’avez pas calculé la meilleure réponse adverse.", en: "A candidate move is only a hypothesis until you calculate the opponent’s best reply." },
    exercises: [
      exercise("13-order", "order", { fr: "Ordonner la réflexion", en: "Put the thought process in order" }, { fr: "Quelle étape vient juste après la formulation d’un coup candidat ?", en: "Which step comes right after proposing a candidate move?" }, standardFen, 1, [move("e2e4", "e4")], [answer("calculate", "Calculer la réponse adverse", "Calculate the opponent’s reply", true), answer("play", "Jouer immédiatement", "Play immediately"), answer("engine", "Consulter le moteur avant de réfléchir", "Check the engine before thinking")], { fr: "Le candidat devient une variante seulement quand vous testez la réponse adverse.", en: "A candidate becomes a variation only when you test the opponent’s reply." }, { fr: "Ne passez pas directement de l’idée au déplacement.", en: "Do not jump straight from the idea to the move." }, { fr: "Quelle est la réponse la plus forte après votre idée ?", en: "What is the strongest reply after your idea?" }),
      exercise("13-loop", "choice", { fr: "La dernière vérification", en: "The final verification" }, { fr: "Avant de jouer, quelle question ferme la boucle ?", en: "Before playing, which question closes the loop?" }, afterCenterExchangeFen, 2, [move("g1f3", "Cf3")], [answer("allow", "Qu’est-ce que mon coup permet ?", "What does my move allow?", true), answer("style", "Est-ce le coup le plus élégant ?", "Is it the most elegant move?"), answer("speed", "Puis-je jouer plus vite ?", "Can I play faster?")], { fr: "La vérification finale cherche la meilleure ressource adverse, même si votre idée semble bonne.", en: "The final verification searches for the opponent’s best resource, even when your idea looks good." }, { fr: "Regardez une dernière fois du côté adverse.", en: "Look at the opponent’s side one last time." }, { fr: "Votre coup laisse-t-il un échec, une prise ou une menace ?", en: "Does your move allow a check, capture or threat?" }),
    ],
    keyPoints: [{ title: { fr: "Observer", en: "Observe" }, text: { fr: "Lisez les menaces avant vos idées.", en: "Read threats before your ideas." } }, { title: { fr: "Calculer", en: "Calculate" }, text: { fr: "Une ligne se poursuit jusqu’à une position évaluable.", en: "A line continues until the position can be evaluated." } }, { title: { fr: "Vérifier", en: "Verify" }, text: { fr: "La meilleure réponse adverse termine votre contrôle.", en: "The best opponent reply completes your check." } }],
  },
  "36": {
    key: "36",
    number: "02",
    title: { fr: "Les coups candidats", en: "Candidate moves" },
    kicker: { fr: "Niveau 3 · Réduire la recherche", en: "Level 3 · Narrow the search" },
    headline: { fr: "Deux ou trois idées suffisent pour commencer.", en: "Two or three ideas are enough to start." },
    objective: { fr: "Lister les coups forcing et ne retenir que les candidats qui répondent à la position.", en: "List forcing moves and keep only candidates that answer the position." },
    principle: { fr: "Un bon candidat a une raison concrète : échec, prise, menace ou amélioration nécessaire.", en: "A good candidate has a concrete reason: check, capture, threat or necessary improvement." },
    exercises: [
      exercise("14-list", "choice", { fr: "Le premier filtre", en: "The first filter" }, { fr: "Dans cette position calme, quel coup mérite d’entrer dans vos candidats ?", en: "In this quiet position, which move deserves to enter your candidate list?" }, standardFen, 1, [move("e2e4", "e4")], [answer("center", "e4 : un coup central qui ouvre des lignes", "e4: a central move that opens lines", true), answer("edge", "h3 : un coup de bord sans urgence", "h3: a non-urgent edge move"), answer("repeat", "Dh5 : sortir la dame sans menace", "Qh5: bring out the queen without a threat")], { fr: "e4 est un candidat parce qu’il gagne de l’espace et libère le fou f1.", en: "e4 is a candidate because it gains space and frees the f1 bishop." }, { fr: "Cherchez l’effet concret du coup sur plusieurs pièces.", en: "Look for the move’s concrete effect on several pieces." }, { fr: "L’adversaire peut-il répondre par une menace plus forte ?", en: "Can the opponent answer with a stronger threat?" }),
      exercise("14-forcing", "choice", { fr: "Forcing ou décoratif ?", en: "Forcing or decorative?" }, { fr: "Quel candidat oblige l’adversaire à répondre immédiatement ?", en: "Which candidate forces the opponent to reply immediately?" }, openDevelopmentFen, 1, [move("e1g1", "O-O")], [answer("castle", "O-O : le roi se met en sécurité", "O-O: the king becomes safe", true), answer("rook", "a3 : une attente sans menace", "a3: a waiting move without a threat"), answer("queen", "Dh5 : une sortie de dame prématurée", "Qh5: a premature queen sortie")], { fr: "Le roque répond à une priorité positionnelle : la sécurité du roi et la coordination de la tour.", en: "Castling answers a positional priority: king safety and rook coordination." }, { fr: "Un candidat peut être calme mais doit avoir une urgence ou un gain clair.", en: "A candidate can be quiet, but it needs a clear purpose or urgency." }, { fr: "Votre roi est-il encore au centre après le coup ?", en: "Is your king still in the center after the move?" }),
    ],
    keyPoints: [{ title: { fr: "Limiter", en: "Limit" }, text: { fr: "Deux ou trois candidats évitent la dispersion.", en: "Two or three candidates prevent dispersion." } }, { title: { fr: "Forcer", en: "Force" }, text: { fr: "Commencez par ce qui réduit les réponses adverses.", en: "Start with moves that reduce the opponent’s replies." } }, { title: { fr: "Justifier", en: "Justify" }, text: { fr: "Chaque candidat doit avoir une raison.", en: "Every candidate needs a reason." } }],
  },
  "37": {
    key: "37",
    number: "03",
    title: { fr: "Échecs, prises, menaces", en: "Checks, captures, threats" },
    kicker: { fr: "Niveau 3 · Chercher les coups forcing", en: "Level 3 · Find forcing moves" },
    headline: { fr: "CCT donne une direction, pas une réponse automatique.", en: "CCT gives direction, not an automatic answer." },
    objective: { fr: "Parcourir les échecs, les prises puis les menaces avant d’élargir la recherche.", en: "Scan checks, captures, then threats before widening the search." },
    principle: { fr: "CCT est un ordre de recherche : le meilleur coup peut parfois être une menace calme.", en: "CCT is a search order: the best move can sometimes be a quiet threat." },
    exercises: [
      exercise("15-cct", "choice", { fr: "Commencer par les échecs", en: "Start with checks" }, { fr: "Quelle famille de coups vérifiez-vous en premier ?", en: "Which move family do you check first?" }, openDevelopmentFen, 1, [move("c4f7", "Fxf7+")], [answer("checks", "Les échecs", "Checks", true), answer("quiet", "Les coups les plus jolis", "The prettiest moves"), answer("random", "Un coup au hasard", "A random move")], { fr: "Les échecs réduisent souvent les réponses adverses et méritent un premier scan.", en: "Checks often reduce the opponent’s replies and deserve an initial scan." }, { fr: "CCT signifie trois catégories de coups forcing.", en: "CCT names three categories of forcing moves." }, { fr: "Après votre candidat, quel échec adverse devez-vous vérifier ?", en: "After your candidate, which opponent check must you verify?" }),
      exercise("15-capture", "choice", { fr: "La prise n’est pas suffisante", en: "A capture is not enough" }, { fr: "Après avoir repéré une prise, quelle est l’étape indispensable ?", en: "After spotting a capture, what is essential?" }, afterCenterExchangeFen, 2, [move("g1f3", "Cf3"), move("b8c6", "Cc6")], [answer("reply", "Calculer la recapture ou la menace adverse", "Calculate the recapture or opponent threat", true), answer("celebrate", "Prendre sans regarder la suite", "Capture without checking the follow-up"), answer("stop", "S’arrêter dès que le matériel monte", "Stop as soon as material increases")], { fr: "Une prise n’est bonne qu’après le contrôle de la réponse adverse.", en: "A capture is good only after checking the opponent’s reply." }, { fr: "La valeur de la prise ne termine pas le calcul.", en: "The value of the capture does not end the calculation." }, { fr: "Que peut reprendre ou attaquer l’adversaire au coup suivant ?", en: "What can the opponent recapture or attack next?" }),
    ],
    keyPoints: [{ title: { fr: "Échecs", en: "Checks" }, text: { fr: "Réponses adverses souvent réduites.", en: "Often fewer opponent replies." } }, { title: { fr: "Prises", en: "Captures" }, text: { fr: "Comptez la suite, pas seulement le gain immédiat.", en: "Count the follow-up, not only the immediate gain." } }, { title: { fr: "Menaces", en: "Threats" }, text: { fr: "Une menace calme peut être la plus forte.", en: "A quiet threat can be the strongest." } }],
  },
  "38": {
    key: "38",
    number: "04",
    title: { fr: "La meilleure continuation", en: "The best continuation" },
    kicker: { fr: "Niveau 3 · Répondre à la défense", en: "Level 3 · Answer the defense" },
    headline: { fr: "Le calcul commence vraiment après la réponse adverse.", en: "Calculation really starts after the reply." },
    objective: { fr: "Calculer la réponse la plus forte, puis trouver une continuation qui conserve le gain ou l’initiative.", en: "Calculate the strongest reply, then find a continuation that keeps the gain or initiative." },
    principle: { fr: "Ne calculez pas la réponse que vous espérez ; calculez celle qui résiste le mieux.", en: "Do not calculate the reply you hope for; calculate the reply that resists best." },
    exercises: [
      exercise("16-reply", "line", { fr: "Ne choisir qu’après la défense", en: "Choose only after the defense" }, { fr: "Quelle séquence respecte la réponse noire avant votre troisième coup ?", en: "Which sequence respects Black’s reply before your third move?" }, standardFen, 3, [move("e2e4", "e4"), move("e7e5", "e5"), move("g1f3", "Cf3")], [answer("line", "1. e4 e5 2. Cf3", "1. e4 e5 2. Nf3", true), answer("skip", "1. e4 Cf3 sans réponse noire", "1. e4 Nf3 without Black’s reply"), answer("hope", "1. e4 d5 2. Cf3 en supposant e5", "1. e4 d5 2. Nf3 while assuming e5")], { fr: "La ligne garde le coup noir réel dans la position avant de choisir la continuation.", en: "The line keeps Black’s actual move in the position before choosing the continuation." }, { fr: "Une variante alterne toujours votre coup et la meilleure réponse adverse.", en: "A variation always alternates your move and the opponent’s best reply." }, { fr: "Quelle réponse noire vous gêne le plus ?", en: "Which Black reply troubles you most?" }),
      exercise("16-continue", "choice", { fr: "Poursuivre l’initiative", en: "Keep the initiative" }, { fr: "Après e4 e5, quelle continuation développe une pièce avec tempo de jeu ?", en: "After e4 e5, which continuation develops a piece while keeping the initiative?" }, standardFen, 3, [move("e2e4", "e4"), move("e7e5", "e5"), move("g1f3", "Cf3")], [answer("develop", "Cf3 : développer et contrôler le centre", "Nf3: develop and control the center", true), answer("queen", "Dh5 : attaquer sans finir le développement", "Qh5: attack without completing development"), answer("pawn", "h4 : créer un bruit de pion", "h4: make a pawn move without a target")], { fr: "Cf3 améliore une pièce et prépare la suite sans perdre de temps.", en: "Nf3 improves a piece and prepares the next phase without wasting time." }, { fr: "Cherchez une continuation qui fait deux choses utiles.", en: "Look for a continuation that does two useful things." }, { fr: "Quelle pièce adverse gagne le plus de temps si vous sortez la dame ?", en: "Which opponent piece gains the most time if you bring out the queen?" }),
    ],
    keyPoints: [{ title: { fr: "Résister", en: "Resist" }, text: { fr: "Choisissez la meilleure défense adverse.", en: "Choose the opponent’s best defense." } }, { title: { fr: "Poursuivre", en: "Continue" }, text: { fr: "Une ligne ne s’arrête pas au premier avantage.", en: "A line does not stop at the first advantage." } }, { title: { fr: "Alterner", en: "Alternate" }, text: { fr: "Blanc, Noir, Blanc : gardez le trait exact.", en: "White, Black, White: keep the exact move order." } }],
  },
  "39": {
    key: "39",
    number: "05",
    title: { fr: "Comparer les variantes", en: "Compare variations" },
    kicker: { fr: "Niveau 3 · Évaluer sans préférer", en: "Level 3 · Evaluate without preferring" },
    headline: { fr: "Une variante se juge à sa position finale.", en: "Judge a variation by its final position." },
    objective: { fr: "Comparer deux lignes à profondeur égale avec le roi, le matériel, l’activité et les menaces.", en: "Compare two lines at equal depth using king safety, material, activity and threats." },
    principle: { fr: "Ne choisissez pas la ligne qui vous plaît : choisissez la position que vous pouvez expliquer.", en: "Do not choose the line you like; choose the position you can explain." },
    exercises: [
      exercise("17-equal", "compare", { fr: "Comparer à profondeur égale", en: "Compare at equal depth" }, { fr: "Quelle ligne est la plus facile à justifier après e4 e5 ?", en: "Which line is easiest to justify after e4 e5?" }, standardFen, 3, [move("e2e4", "e4"), move("e7e5", "e5"), move("g1f3", "Cf3")], [answer("line-a", "Cf3 : développement et contrôle central", "Nf3: development and central control", true), answer("line-b", "Dh5 : même profondeur mais dame exposée", "Qh5: same depth but an exposed queen"), answer("unknown", "La ligne la plus longue, sans position finale", "The longest line, without a final position")], { fr: "La première ligne améliore une pièce et contrôle le centre ; elle est explicable avec des critères concrets.", en: "The first line improves a piece and controls the center; it is explainable with concrete criteria." }, { fr: "Comparez toujours les positions finales, pas la longueur des variantes.", en: "Always compare final positions, not variation length." }, { fr: "Qui est le plus en sécurité, et quelles pièces sont actives ?", en: "Whose king is safer, and which pieces are active?" }),
      exercise("17-stop", "compare", { fr: "Savoir s’arrêter", en: "Know when to stop" }, { fr: "Quand pouvez-vous arrêter de calculer une branche ?", en: "When can you stop calculating a branch?" }, afterCenterExchangeFen, 2, [move("g1f3", "Cf3")], [answer("evaluate", "Quand la position finale est claire et évaluable", "When the final position is clear and evaluable", true), answer("depth", "Jamais avant dix coups", "Never before ten moves"), answer("feeling", "Dès que vous aimez le premier coup", "As soon as you like the first move")], { fr: "Le but n’est pas d’atteindre une profondeur arbitraire, mais de comprendre la position obtenue.", en: "The goal is not an arbitrary depth, but understanding the position reached." }, { fr: "Demandez-vous ce qui a changé sur le dernier échiquier.", en: "Ask what changed on the last board." }, { fr: "Pouvez-vous nommer le roi, le matériel et la menace de chaque camp ?", en: "Can you name each side’s king, material and threat?" }),
    ],
    keyPoints: [{ title: { fr: "Roi", en: "King" }, text: { fr: "La sécurité pèse dans toute comparaison.", en: "Safety matters in every comparison." } }, { title: { fr: "Matériel", en: "Material" }, text: { fr: "Un gain compte avec sa recapture.", en: "A gain counts with its recapture." } }, { title: { fr: "Activité", en: "Activity" }, text: { fr: "Une position claire vaut mieux qu’une ligne interminable.", en: "A clear position is better than an endless line." } }],
  },
  "40": {
    key: "40",
    number: "06",
    title: { fr: "Visualiser un à trois coups", en: "Visualize one to three moves" },
    kicker: { fr: "Niveau 3 · Tenir la position future", en: "Level 3 · Hold the future position" },
    headline: { fr: "Le plateau ne bouge pas : votre position mentale, oui.", en: "The board stays still: your mental position moves." },
    objective: { fr: "Visualiser une destination, puis suivre alternativement les coups sans déplacer les pièces affichées.", en: "Visualize a destination, then follow alternating moves without moving the displayed pieces." },
    principle: { fr: "Après chaque demi-coup, demandez quelle pièce a changé de case et qui a le trait.", en: "After every half-move, ask which piece changed squares and who is to move." },
    exercises: [
      exercise("18-one", "visualize", { fr: "Un coup à l’avance", en: "One move ahead" }, { fr: "Sans toucher aux pièces, où arrive le pion après 1. e4 ?", en: "Without touching the pieces, where does the pawn land after 1. e4?" }, standardFen, 1, [move("e2e4", "e4")], [answer("e4", "Le pion blanc arrive en e4", "The white pawn lands on e4", true), answer("e3", "Le pion blanc arrive en e3", "The white pawn lands on e3"), answer("d4", "Le pion blanc arrive en d4", "The white pawn lands on d4")], { fr: "Visualiser un coup commence par une relation simple entre départ, arrivée et trait.", en: "Visualizing one move starts with a simple relation between start, destination and turn." }, { fr: "Le pion e part de la colonne e.", en: "The e-pawn starts on the e-file." }, { fr: "Après e4, quel camp joue ?", en: "After e4, which side moves?" }),
      exercise("18-three", "visualize", { fr: "Trois demi-coups", en: "Three half-moves" }, { fr: "Reconstituez la dernière pièce déplacée après 1. e4 e5 2. Cf3.", en: "Rebuild the last moved piece after 1. e4 e5 2. Nf3." }, standardFen, 3, [move("e2e4", "e4"), move("e7e5", "e5"), move("g1f3", "Cf3")], [answer("knight-f3", "Le cavalier blanc est en f3", "The white knight is on f3", true), answer("knight-e5", "Le cavalier blanc est en e5", "The white knight is on e5"), answer("bishop-c4", "Le fou blanc est en c4", "The white bishop is on c4")], { fr: "La réponse conserve e4 et e5, puis déplace seulement le cavalier g1 vers f3.", en: "The answer keeps e4 and e5, then moves only the g1 knight to f3." }, { fr: "Suivez les demi-coups dans l’ordre, sans sauter le coup noir.", en: "Follow the half-moves in order without skipping Black’s move." }, { fr: "Qui a le trait après 2. Cf3 ?", en: "Who moves after 2. Nf3?" }),
    ],
    keyPoints: [{ title: { fr: "Départ", en: "Start" }, text: { fr: "Nommez la case de départ.", en: "Name the starting square." } }, { title: { fr: "Arrivée", en: "Destination" }, text: { fr: "Nommez la case finale.", en: "Name the final square." } }, { title: { fr: "Trait", en: "Turn" }, text: { fr: "Gardez l’alternance en mémoire.", en: "Keep the alternation in mind." } }],
  },
  "41": {
    key: "41",
    number: "07",
    title: { fr: "Visualiser cinq coups et reconstruire", en: "Visualize five moves and rebuild" },
    kicker: { fr: "Niveau 3 · Approfondir sans déplacer", en: "Level 3 · Go deeper without moving" },
    headline: { fr: "Cinq demi-coups, une seule position à reconstruire.", en: "Five half-moves, one position to rebuild." },
    objective: { fr: "Maintenir une courte ligne tactique, retrouver la position finale et vérifier le prochain plan.", en: "Hold a short tactical line, rebuild the final position and verify the next plan." },
    principle: { fr: "La profondeur n’a de valeur que si la position finale reste exacte et évaluable.", en: "Depth matters only if the final position remains accurate and evaluable." },
    exercises: [
      exercise("19-five", "visualize", { fr: "Cinq demi-coups", en: "Five half-moves" }, { fr: "Après 1. e4 e5 2. Cf3 Cc6 3. Fc4, où se trouve le fou blanc ?", en: "After 1. e4 e5 2. Nf3 Nc6 3. Bc4, where is the white bishop?" }, standardFen, 5, [move("e2e4", "e4"), move("e7e5", "e5"), move("g1f3", "Cf3"), move("b8c6", "Cc6"), move("f1c4", "Fc4")], [answer("c4", "Le fou blanc est en c4", "The white bishop is on c4", true), answer("f4", "Le fou blanc est en f4", "The white bishop is on f4"), answer("g2", "Le fou blanc est resté en g2", "The white bishop stayed on g2")], { fr: "La ligne conserve le pion blanc e4, le pion noir e5, le cavalier f3, le cavalier c6 et finit par Fc4.", en: "The line keeps the white pawn on e4, black pawn on e5, knight on f3, knight on c6 and ends with Bc4." }, { fr: "Récitez la ligne par paires : Blanc, Noir, Blanc, Noir, Blanc.", en: "Recite the line in pairs: White, Black, White, Black, White." }, { fr: "Quelle pièce n’a pas bougé entre la position initiale et la fin ?", en: "Which piece did not move between the start and the end?" }),
      exercise("19-rebuild", "line", { fr: "Reconstituer avant de choisir", en: "Rebuild before choosing" }, { fr: "Quelle suite complète respecte les cinq demi-coups et conserve le trait noir final ?", en: "Which complete line respects the five half-moves and leaves Black to move?" }, standardFen, 5, [move("e2e4", "e4"), move("e7e5", "e5"), move("g1f3", "Cf3"), move("b8c6", "Cc6"), move("f1c4", "Fc4")], [answer("complete", "1. e4 e5 2. Cf3 Cc6 3. Fc4", "1. e4 e5 2. Nf3 Nc6 3. Bc4", true), answer("incomplete", "1. e4 e5 2. Cf3", "1. e4 e5 2. Nf3"), answer("wrong-turn", "1. e4 e5 2. Cc3 Cf6 3. Fc4", "1. e4 e5 2. Nc3 Nf6 3. Bc4")], { fr: "La ligne complète permet de reconstruire la position et de savoir que les Noirs ont le trait.", en: "The complete line rebuilds the position and shows that Black is to move." }, { fr: "Comptez cinq demi-coups avant d’évaluer.", en: "Count five half-moves before evaluating." }, { fr: "Quel camp joue après le cinquième demi-coup ?", en: "Which side moves after the fifth half-move?" }),
    ],
    keyPoints: [{ title: { fr: "Tenir", en: "Hold" }, text: { fr: "Ne laissez aucune pièce disparaître mentalement.", en: "Do not let any piece disappear mentally." } }, { title: { fr: "Reconstruire", en: "Rebuild" }, text: { fr: "Comparez départ et arrivée pièce par pièce.", en: "Compare start and finish piece by piece." } }, { title: { fr: "Évaluer", en: "Evaluate" }, text: { fr: "La position finale indique si la ligne vaut le calcul.", en: "The final position shows whether the line was worth calculating." } }],
  },
};

export function getCalculationStepState(answers: CalculationAnswer[], selectedId: string | null): "idle" | "wrong" | "correct" {
  if (!selectedId) return "idle";
  return answers.find((item) => item.id === selectedId)?.correct ? "correct" : "wrong";
}

export function getCalculationProgress(completedExercises: number, totalExercises: number, completed: boolean): number {
  if (totalExercises <= 0) return 0;
  if (completed && completedExercises >= totalExercises) return 100;
  return Math.min(100, Math.max(0, Math.round((completedExercises / totalExercises) * 100)));
}

export function validateCalculationLine(actualUci: string[], expectedUci: string[]): boolean {
  return actualUci.length === expectedUci.length && actualUci.every((move, index) => move === expectedUci[index]);
}

export function validateCalculationCatalogue(): void {
  for (const lesson of Object.values(calculationLessonCatalog)) {
    for (const exercise of lesson.exercises) {
      const game = new Chess(exercise.fen);
      for (const moveToPlay of exercise.solutionLine) game.move(moveToPlay.uci);
    }
  }
}
