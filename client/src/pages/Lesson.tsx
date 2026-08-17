/* Design reminder — L’Atelier de l’Ouverture: la leçon doit ressembler à une partie annotée, calme et précise; le safran indique le coup attendu. */
import { useEffect, useMemo, useState } from "react";
import { Chess, type Square } from "chess.js";
import { Chessboard } from "react-chessboard";
import { ArrowLeft, Check, ChevronRight, CircleHelp, Cpu, Lightbulb, Loader2, RotateCcw, Sparkles, SquareArrowOutUpRight, Trophy } from "lucide-react";
import { useStockfish } from "@/hooks/useStockfish";
import { classifyMistake, enrichMistakeWithEngine, type PedagogicalMistake } from "@/lib/pedagogicalFeedback";
import { Button } from "@/components/ui/button";

const lessonSteps = [
  {
    from: "e2",
    to: "e4",
    san: "e4",
    answer: "Avancez le pion du roi de deux cases.",
    idea: "Prenez le centre : e4 ouvre une diagonale pour votre fou et donne de l’espace à votre dame.",
    reply: "e5",
    replySan: "e5",
  },
  {
    from: "g1",
    to: "f3",
    san: "Cf3",
    answer: "Développez le cavalier roi vers f3.",
    idea: "Votre cavalier contrôle les cases centrales e5 et d4 tout en préparant le roque.",
    reply: "Nc6",
    replySan: "Cc6",
  },
];

function BrandMark() {
  return <img className="h-10 w-10 object-contain" src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663890875436/WMeJhgIGICmYOuIM.png" alt="Symbole Échiquier" />;
}

function CoachingPanel({ mistake }: { mistake: PedagogicalMistake }) {
  return (
    <section className="lesson-coaching border border-[#d6a16b] bg-[#fff1dc] p-5" aria-live="polite">
      <div className="flex items-start gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#d69024] text-[#173e37]"><Sparkles size={17} /></div>
        <div><p className="eyebrow text-[#9a6b18]">Diagnostic personnalisé · erreur {mistake.attemptNumber}</p><h2 className="display-font mt-2 text-3xl leading-none text-[#173e37]">{mistake.title}</h2></div>
      </div>
      <p className="mt-4 text-sm leading-6 text-[#4e5146]">{mistake.explanation}</p>
      <div className="mt-4 border-l-2 border-[#d69024] pl-4"><p className="text-[.62rem] font-extrabold uppercase tracking-[.12em] text-[#9a6b18]">Votre prochain repère</p><p className="mt-1 text-sm font-semibold leading-6 text-[#3c4c43]">{mistake.recommendation}</p></div>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-[.66rem] font-extrabold uppercase tracking-[.1em] text-[#796a4e]"><span>Focus · {mistake.focus}</span>{mistake.engineBestMove && <span className="border-l border-[#d6b37b] pl-3">Repère moteur · {mistake.engineBestMove}</span>}</div>
      {mistake.engineGap && <p className="mt-4 border-t border-[#e2c28d] pt-3 text-xs leading-5 text-[#66553a]">{mistake.engineGap}</p>}
    </section>
  );
}

export default function Lesson() {
  const [position, setPosition] = useState(() => new Chess().fen());
  const [currentStep, setCurrentStep] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<"idle" | "wrong" | "correct" | "complete">("idle");
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [mistake, setMistake] = useState<PedagogicalMistake | null>(null);
  const [attempts, setAttempts] = useState(0);
  const { isReady: engineReady, isAnalyzing, analysis, error: engineError, analyze, stop } = useStockfish();

  const completed = currentStep >= lessonSteps.length;
  const activeStep = lessonSteps[Math.min(currentStep, lessonSteps.length - 1)];

  useEffect(() => {
    if (mistake && analysis?.bestMove) setMistake((current) => current ? enrichMistakeWithEngine(current, analysis.bestMove) : current);
  }, [analysis?.bestMove, mistake]);

  useEffect(() => {
    document.title = "Leçon 01 — Le centre | Échiquier";
    return () => { document.title = "Échiquier — Apprendre les échecs simplement"; };
  }, []);

  const resetLesson = () => {
    stop();
    setPosition(new Chess().fen());
    setCurrentStep(0);
    setShowHint(false);
    setFeedback("idle");
    setSelectedSquare(null);
    setShowAnalysis(false);
    setMistake(null);
    setAttempts(0);
  };

  const handleAnalyze = () => {
    setShowAnalysis(true);
    analyze(position, 12);
  };

  const handlePieceDrop = (sourceSquare: string, targetSquare: string | null) => {
    if (!targetSquare || completed) return false;
    if (sourceSquare !== activeStep.from || targetSquare !== activeStep.to) {
      const nextAttempt = attempts + 1;
      const diagnostic = classifyMistake({ attemptedFrom: sourceSquare, attemptedTo: targetSquare, expectedFrom: activeStep.from, expectedTo: activeStep.to, stepIndex: currentStep, attemptNumber: nextAttempt });
      setAttempts(nextAttempt);
      setMistake({ ...diagnostic, engineBestMove: analysis?.bestMove ?? null });
      setFeedback("wrong");
      setShowAnalysis(true);
      analyze(position, 12);
      return false;
    }

    const next = new Chess(position);
    try {
      next.move({ from: sourceSquare as Square, to: targetSquare as Square, promotion: "q" });
      next.move(activeStep.reply);
      setPosition(next.fen());
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setFeedback(nextStep === lessonSteps.length ? "complete" : "correct");
      setMistake(null);
      setShowHint(false);
      setSelectedSquare(null);
      return true;
    } catch {
      setFeedback("wrong");
      return false;
    }
  };

  const handleSquareClick = (square: string) => {
    if (completed) return;
    const clickedPiece = new Chess(position).get(square as Square);
    const isWhitePiece = clickedPiece?.color === "w";
    if (!selectedSquare) {
      if (isWhitePiece) setSelectedSquare(square);
      return;
    }
    if (isWhitePiece) {
      setSelectedSquare(square);
      return;
    }
    handlePieceDrop(selectedSquare, square);
  };

  const highlightedSquares = useMemo(() => {
    if (!showHint || completed) return {};
    return {
      [activeStep.from]: { background: "radial-gradient(circle, rgba(214,144,36,.55) 18%, transparent 20%)" },
      [activeStep.to]: { background: "rgba(214,144,36,.35)" },
      ...(selectedSquare ? { [selectedSquare]: { boxShadow: "inset 0 0 0 4px #d69024" } } : {}),
    };
  }, [activeStep, completed, selectedSquare, showHint]);

  const history = currentStep === 0 ? [] : ["1. e4   e5", ...(completed ? ["2. Cf3  Cc6"] : [])];
  const completionPercent = completed ? 100 : currentStep * 50;

  return (
    <div className="lesson-shell min-h-screen bg-[#f7f0df] text-[#203830]">
      <header className="lesson-header paper-texture border-b border-[#c9bb96]">
        <div className="mx-auto flex min-h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <a href="/" className="flex items-center gap-3" aria-label="Retour à l’accueil Échiquier"><BrandMark /><div className="leading-none"><span className="display-font block text-[1.55rem] tracking-[-.04em]">Échiquier</span><span className="block pt-1 text-[.58rem] font-extrabold uppercase tracking-[.16em] text-[#766d57]">Leçon guidée</span></div></a>
          <div className="hidden items-center gap-3 sm:flex"><span className="font-mono text-[.64rem] font-bold tracking-[.1em] text-[#9a6b18]">LEÇON 01 / 03</span><span className="h-px w-10 bg-[#c5b58f]" /><span className="text-xs font-bold uppercase tracking-[.12em] text-[#59655e]">Le centre</span></div>
          <a href="/" className="inline-flex items-center gap-2 text-[.68rem] font-extrabold uppercase tracking-[.11em] text-[#173e37] transition-colors hover:text-[#a87416]"><ArrowLeft size={16} /> Retour</a>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-5 pb-20 pt-10 sm:px-8 lg:px-12 lg:pt-14">
        <div className="mb-9 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div><div className="flex items-center gap-3"><span className="h-px w-9 bg-[#d69024]" /><p className="eyebrow">Ouverture · Le premier principe</p></div><h1 className="display-font mt-4 max-w-[12ch] text-5xl leading-[.9] tracking-[-.05em] text-[#173e37] sm:text-6xl">Prenez le centre avec <em>e4</em>.</h1></div>
          <div className="lesson-progress min-w-[245px] border-l border-[#c7b88f] pl-5"><div className="flex items-center justify-between text-[.62rem] font-extrabold uppercase tracking-[.14em] text-[#776e58]"><span>Progression</span><span>{completed ? "Terminé" : `${currentStep + 1} / 2`}</span></div><div className="mt-3 h-1.5 bg-[#ddd1b2]"><div className="h-full bg-[#d69024] transition-all duration-500" style={{ width: `${completionPercent || 8}%` }} /></div></div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.23fr)_390px] xl:gap-12">
          <section className="lesson-board-card relative overflow-hidden border border-[#bdaF83] bg-[#173e37] p-3 shadow-[15px_18px_0_rgba(42,50,41,.12)] sm:p-5">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 checker-line opacity-90" />
            <div className="mb-4 flex items-center justify-between px-1 text-[#fffaf0]"><div><p className="text-[.6rem] font-extrabold uppercase tracking-[.16em] text-[#e7ba61]">Position de départ</p><p className="display-font mt-1 text-2xl">Les blancs jouent</p></div><div className="grid h-10 w-10 place-items-center border border-[#759287] text-[#e7ba61]"><Sparkles size={17} /></div></div>
            <div className="lesson-board-wrap mx-auto max-w-[680px] bg-[#153d36] p-2 sm:p-3">
              <Chessboard options={{ id: "first-opening-lesson", position, boardOrientation: "white", showNotation: true, allowDragging: !completed, allowDrawingArrows: false, animationDurationInMs: 220, darkSquareStyle: { backgroundColor: "#3a6658" }, lightSquareStyle: { backgroundColor: "#f0dfb9" }, squareStyles: highlightedSquares, canDragPiece: ({ piece }) => piece.pieceType.startsWith("w") && !completed, onPieceDrop: ({ sourceSquare, targetSquare }) => handlePieceDrop(sourceSquare, targetSquare), onPieceClick: ({ square, piece }) => { if (piece.pieceType.startsWith("w") && square) setSelectedSquare(square); }, onSquareClick: ({ square }) => handleSquareClick(square) }} />
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 px-1"><div className="flex items-center gap-2 text-xs text-[#d9e0d6]"><span className="h-2 w-2 rounded-full bg-[#d69024]" /> Glissez une pièce ou sélectionnez sa case, puis sa destination.</div><Button variant="outline" size="sm" onClick={resetLesson} className="rounded-none border-[#66857c] bg-transparent text-[.66rem] font-extrabold uppercase tracking-[.1em] text-[#fffaf0] hover:bg-[#284d43] hover:text-[#fffaf0]"><RotateCcw size={14} /> Recommencer</Button></div>
          </section>

          <aside className="space-y-4">
            <section className="lesson-paper border border-[#cbbd99] bg-[#fffaf0] p-6 sm:p-7"><div className="flex items-center justify-between"><span className="eyebrow">Votre mission</span><span className="font-mono text-xs font-bold text-[#a87416]">{completed ? "✓" : `0${currentStep + 1}`}</span></div>{completed ? <div className="mt-6"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d69024] text-[#173e37]"><Trophy size={22} /></div><h2 className="display-font mt-5 text-4xl leading-none tracking-[-.04em] text-[#173e37]">Très bien joué.</h2><p className="mt-4 leading-7 text-[#5f5b4e]">Vous avez occupé le centre et développé une pièce. Ce sont les deux premiers gestes d’une bonne ouverture.</p></div> : <div className="mt-6"><h2 className="display-font text-4xl leading-none tracking-[-.04em] text-[#173e37]">{activeStep.answer}</h2><p className="mt-5 leading-7 text-[#5f5b4e]">{activeStep.idea}</p></div>}
              {!completed && <Button variant="outline" onClick={() => setShowHint((value) => !value)} className="mt-6 w-full rounded-none border-[#bcae88] bg-transparent text-[.67rem] font-extrabold uppercase tracking-[.1em] text-[#173e37] hover:bg-[#efe4cb]"><Lightbulb size={15} /> {showHint ? "Masquer l’indice" : "Voir l’indice"}</Button>}
              {completed && <Button onClick={resetLesson} className="mt-7 w-full rounded-none bg-[#173e37] text-[.67rem] font-extrabold uppercase tracking-[.1em] text-[#fffaf0] hover:bg-[#285448]"><RotateCcw size={15} /> Rejouer la leçon</Button>}
            </section>

            <section className={`lesson-feedback border p-5 ${feedback === "wrong" ? "border-[#c96442] bg-[#fff0e7]" : feedback === "complete" ? "border-[#6f977c] bg-[#e9f0e6]" : feedback === "correct" ? "border-[#90a98d] bg-[#f2f4e9]" : "border-[#cbbd99] bg-[#f5ecd8]"}`}><div className="flex gap-3"><div className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full ${feedback === "wrong" ? "bg-[#c96442] text-white" : "bg-[#d69024] text-[#173e37]"}`}>{feedback === "wrong" ? <CircleHelp size={15} /> : <Check size={16} strokeWidth={3} />}</div><div><p className="text-[.65rem] font-extrabold uppercase tracking-[.13em] text-[#736954]">{feedback === "wrong" ? "Essayez encore" : feedback === "idle" ? "Un conseil" : feedback === "complete" ? "Séquence terminée" : "Coup validé"}</p><p className="mt-2 text-sm leading-6 text-[#4e5146]">{feedback === "wrong" ? "Ce coup n’est pas l’objectif de cette étape. Utilisez l’indice si vous souhaitez revoir les cases à relier." : feedback === "complete" ? "Retenez ce rythme : centre, développement, puis sécurité du roi." : feedback === "correct" ? "La réponse noire est jouée. Continuez avec le prochain principe." : "Un bon coup d’ouverture aide vos pièces à respirer et contrôle les cases importantes."}</p></div></div></section>

            {mistake && <CoachingPanel mistake={mistake} />}


            <section className="lesson-analysis border border-[#cbbd99] bg-[#173e37] p-5 text-[#fffaf0]">
              <div className="flex items-start justify-between gap-4">
                <div><p className="eyebrow text-[#e7ba61]">Analyse locale</p><h2 className="display-font mt-2 text-3xl leading-none">Le regard du moteur</h2></div>
                <div className="grid h-10 w-10 shrink-0 place-items-center border border-[#66857c] text-[#e7ba61]"><Cpu size={18} /></div>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#d9e0d6]">Stockfish analyse cette position directement dans votre navigateur, sans envoyer votre partie à un serveur.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button onClick={handleAnalyze} disabled={!engineReady || isAnalyzing} className="rounded-none bg-[#d69024] text-[.66rem] font-extrabold uppercase tracking-[.1em] text-[#173e37] hover:bg-[#e7ba61] disabled:opacity-50"><Cpu size={14} /> {isAnalyzing ? "Analyse en cours" : engineReady ? "Analyser la position" : "Chargement du moteur"}</Button>
                {isAnalyzing && <Button variant="outline" onClick={stop} className="rounded-none border-[#66857c] bg-transparent text-[.66rem] font-extrabold uppercase tracking-[.1em] text-[#fffaf0] hover:bg-[#284d43] hover:text-[#fffaf0]">Arrêter</Button>}
              </div>
              {showAnalysis && <div className="mt-5 border-t border-[#496d61] pt-4" aria-live="polite">
                {engineError && <p className="text-sm text-[#f1b3a0]">{engineError}</p>}
                {!engineError && !analysis && <p className="flex items-center gap-2 text-sm text-[#d9e0d6]"><Loader2 size={15} className="animate-spin" /> Préparation de l’analyse…</p>}
                {analysis && <div className="grid grid-cols-2 gap-3 text-sm"><div><span className="block text-[.6rem] font-extrabold uppercase tracking-[.12em] text-[#9cb4a9]">Évaluation</span><strong className="mt-1 block font-mono text-2xl text-[#e7ba61]">{analysis.scoreLabel}</strong></div><div><span className="block text-[.6rem] font-extrabold uppercase tracking-[.12em] text-[#9cb4a9]">Profondeur</span><strong className="mt-1 block font-mono text-2xl text-[#fffaf0]">{analysis.depth || "—"}</strong></div><div className="col-span-2"><span className="block text-[.6rem] font-extrabold uppercase tracking-[.12em] text-[#9cb4a9]">Meilleur coup</span><strong className="mt-1 block font-mono text-lg text-[#fffaf0]">{analysis.bestMove ?? "Recherche…"}</strong></div><div className="col-span-2"><span className="block text-[.6rem] font-extrabold uppercase tracking-[.12em] text-[#9cb4a9]">Ligne principale</span><p className="mt-1 font-mono text-xs leading-6 text-[#d9e0d6]">{analysis.principalVariation.length ? analysis.principalVariation.join(" · ") : "Recherche en cours…"}</p></div></div>}
              </div>}
              <p className="mt-4 flex items-center gap-2 text-[.65rem] uppercase tracking-[.1em] text-[#9cb4a9]"><SquareArrowOutUpRight size={13} /> Moteur Stockfish 17.1 · profondeur pédagogique 12</p>
            </section>

            <section className="lesson-history border border-[#cbbd99] bg-[#ece0c1] p-5"><p className="eyebrow">Feuille de partie</p><div className="mt-4 min-h-13 border-l border-[#bfae83] pl-4 font-mono text-sm font-bold leading-7 text-[#28483f]">{history.length ? history.map((move) => <div key={move}>{move}</div>) : <span className="text-[#867c64]">En attente du premier coup…</span>}</div>{completed && <div className="mt-4 flex items-center gap-2 border-t border-[#c7b48a] pt-4 text-[.65rem] font-extrabold uppercase tracking-[.12em] text-[#6c725c]"><Check size={14} className="text-[#467a5d]" /> Objectif rempli <ChevronRight size={14} /></div>}</section>
          </aside>
        </div>

        <section className="lesson-notes mt-10 grid gap-px border border-[#cbbd99] bg-[#cbbd99] md:grid-cols-3"><div className="bg-[#fffaf0] p-6"><span className="font-mono text-xs font-bold text-[#d69024]">01 /</span><h3 className="display-font mt-5 text-3xl text-[#173e37]">Le centre</h3><p className="mt-3 text-sm leading-6 text-[#615d50]">Les cases e4, d4, e5 et d5 organisent la bataille dès les premiers coups.</p></div><div className="bg-[#fffaf0] p-6"><span className="font-mono text-xs font-bold text-[#d69024]">02 /</span><h3 className="display-font mt-5 text-3xl text-[#173e37]">Le développement</h3><p className="mt-3 text-sm leading-6 text-[#615d50]">Sortez vos cavaliers et vos fous avant de déplacer la même pièce plusieurs fois.</p></div><div className="bg-[#fffaf0] p-6"><span className="font-mono text-xs font-bold text-[#d69024]">03 /</span><h3 className="display-font mt-5 text-3xl text-[#173e37]">La sécurité</h3><p className="mt-3 text-sm leading-6 text-[#615d50]">Lorsque vos pièces sont prêtes, roquez pour mettre votre roi à l’abri.</p></div></section>
      </main>
    </div>
  );
}
