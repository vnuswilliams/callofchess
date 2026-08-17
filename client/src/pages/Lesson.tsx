/* Design reminder — L’Atelier de l’Ouverture: la leçon doit ressembler à une partie annotée, calme et précise; le safran indique le coup attendu. */
import { useEffect, useMemo, useState } from "react";
import { Chess, type Square } from "chess.js";
import { Chessboard } from "react-chessboard";
import { ArrowLeft, Check, ChevronRight, CircleHelp, Cpu, Lightbulb, Loader2, RotateCcw, Sparkles, SquareArrowOutUpRight, Trophy } from "lucide-react";
import { useStockfish } from "@/hooks/useStockfish";
import { classifyMistake, enrichMistakeWithEngine, formatEngineMove, formatPrincipalVariation, formatUciAsSan, type PedagogicalMistake } from "@/lib/pedagogicalFeedback";
import { Button } from "@/components/ui/button";
import { useParams } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";

type LessonStep = { from: string; to: string; san: string; answer: string; idea: string; reply: string; replySan: string };
type LessonDefinition = { number: string; title: string; kicker: string; headline: string; steps: LessonStep[] };

// Typed lesson data stays local and declarative: the board state is rebuilt
// from the authoritative move sequence instead of being duplicated in React state.
const lessonCatalog: Record<string, LessonDefinition> = {
  "1": {
    number: "01", title: "Le centre", kicker: "Ouverture · Le premier principe", headline: "Prenez le centre avec e4.",
    steps: [
      { from: "e2", to: "e4", san: "e4", answer: "Avancez le pion du roi de deux cases.", idea: "Prenez le centre : e4 ouvre une diagonale pour votre fou et donne de l’espace à votre dame.", reply: "e5", replySan: "e5" },
      { from: "g1", to: "f3", san: "Cf3", answer: "Développez le cavalier roi vers f3.", idea: "Votre cavalier contrôle les cases centrales e5 et d4 tout en préparant le roque.", reply: "Nc6", replySan: "Cc6" },
    ],
  },
  "2": {
    number: "02", title: "Le développement", kicker: "Ouverture · Donner une voix à chaque pièce", headline: "Sortez vos pièces avec intention.",
    steps: [
      { from: "d2", to: "d4", san: "d4", answer: "Ouvrez une ligne avec le pion dame.", idea: "d4 prend sa part du centre et libère le fou c1 pour participer rapidement à la partie.", reply: "d5", replySan: "d5" },
      { from: "g1", to: "f3", san: "Cf3", answer: "Développez le cavalier roi.", idea: "Cf3 contrôle e5 et d4, tout en préparant le roque et la connexion des pièces.", reply: "Nf6", replySan: "Cf6" },
      { from: "b1", to: "c3", san: "Cc3", answer: "Développez le second cavalier.", idea: "Cc3 soutient le centre et complète un développement harmonieux sans déplacer deux fois la même pièce.", reply: "e6", replySan: "e6" },
    ],
  },
  "3": {
    number: "03", title: "La sécurité", kicker: "Ouverture · Mettre le roi à l’abri", headline: "Roquez avant que la position ne s’ouvre.",
    steps: [
      { from: "e2", to: "e4", san: "e4", answer: "Ouvrez le centre avec e4.", idea: "e4 libère le fou f1 et prépare le développement nécessaire au roque.", reply: "e5", replySan: "e5" },
      { from: "g1", to: "f3", san: "Cf3", answer: "Développez le cavalier roi.", idea: "Cf3 contrôle le centre et libère la case g1 pour que le roi puisse roquer.", reply: "Nc6", replySan: "Cc6" },
      { from: "f1", to: "c4", san: "Fc4", answer: "Sortez le fou vers c4.", idea: "Fc4 complète le développement du côté roi et prépare le petit roque.", reply: "Bc5", replySan: "Fc5" },
      { from: "e1", to: "g1", san: "O-O", answer: "Roquez du côté roi.", idea: "Le roque met le roi à l’abri et active la tour f1 en un seul coup.", reply: "Be7", replySan: "Fe7" },
    ],
  },
};

// Progress restoration replays only validated user moves and their lesson replies,
// which keeps a resumed lesson deterministic across browsers and sessions.
function reconstructPosition(steps: LessonStep[], completedStep: number) {
  const game = new Chess();
  steps.slice(0, completedStep).forEach((step) => {
    game.move({ from: step.from as Square, to: step.to as Square });
    game.move(step.reply);
  });
  return game.fen();
}

function BrandMark() {
  return <img className="h-10 w-10 object-contain" src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663890875436/WMeJhgIGICmYOuIM.png" alt="Symbole Échiquier" />;
}

function LanguageToggle() {
  const { language, toggleLanguage, t } = useLanguage();
  return <button type="button" onClick={toggleLanguage} aria-label={`${t("language")}: ${language === "fr" ? t("english") : t("french")}`} className="border border-[#b8aa86] px-3 py-2 text-[.6rem] font-extrabold uppercase tracking-[.12em] text-[#173e37] transition-colors hover:border-[#d69024]"><span aria-hidden="true">{language === "fr" ? "EN" : "FR"}</span><span className="sr-only">{language === "fr" ? t("english") : t("french")}</span></button>;
}

function CoachingPanel({ mistake }: { mistake: PedagogicalMistake }) {
  const { t, language } = useLanguage();
  return (
    <section className="lesson-coaching border border-[#d6a16b] bg-[#fff1dc] p-5" aria-live="polite">
      <div className="flex items-start gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#d69024] text-[#173e37]"><Sparkles size={17} /></div>
        <div><p className="eyebrow text-[#9a6b18]">{t("personalized")} · {language === "fr" ? "erreur" : "mistake"} {mistake.attemptNumber}</p><h2 className="display-font mt-2 text-3xl leading-none text-[#173e37]">{mistake.title}</h2></div>
      </div>
      <p className="mt-4 text-sm leading-6 text-[#4e5146]">{mistake.explanation}</p>
      <div className="mt-4 border-l-2 border-[#d69024] pl-4"><p className="text-[.62rem] font-extrabold uppercase tracking-[.12em] text-[#9a6b18]">{language === "fr" ? "Votre prochain repère" : "Your next reference point"}</p><p className="mt-1 text-sm font-semibold leading-6 text-[#3c4c43]">{mistake.recommendation}</p></div>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-[.66rem] font-extrabold uppercase tracking-[.1em] text-[#796a4e]"><span>{t("focus")} · {mistake.focus}</span>{mistake.engineBestMove && <span className="border-l border-[#d6b37b] pl-3">{t("engineBest")} · {formatEngineMove(mistake.engineBestMove)}</span>}</div>
      {mistake.engineGap && <p className="mt-4 border-t border-[#e2c28d] pt-3 text-xs leading-5 text-[#66553a]">{mistake.engineGap}</p>}
      {mistake.bestMoveWhy && <div className="mt-4 border-t border-[#e2c28d] pt-4"><p className="text-[.62rem] font-extrabold uppercase tracking-[.12em] text-[#9a6b18]">{t("whyBest")}</p><p className="mt-1 text-sm leading-6 text-[#4e5146]">{mistake.bestMoveWhy}</p></div>}
      {mistake.lessonTakeaway && <div className="mt-4 bg-[#f8dfae] p-3"><p className="text-[.62rem] font-extrabold uppercase tracking-[.12em] text-[#8c6216]">{t("takeaway")}</p><p className="mt-1 text-sm font-semibold leading-6 text-[#3c4c43]">{mistake.lessonTakeaway}</p></div>}
    </section>
  );
}

export default function Lesson() {
  const { id = "1" } = useParams<{ id: string }>();
  const lesson = lessonCatalog[id] ?? lessonCatalog["1"];
  const lessonSteps = lesson.steps;
  const { t, language } = useLanguage();
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
  const activeStepCopy = language === "fr" ? activeStep : activeStep.san === "e4" ? { ...activeStep, answer: "Move the king pawn two squares.", idea: "Take the center: e4 opens a diagonal for your bishop and gives your queen more room." } : activeStep.san === "Cf3" ? { ...activeStep, answer: "Develop the king knight to f3.", idea: "Your knight controls the central squares e5 and d4 while preparing to castle." } : activeStep.san === "d4" ? { ...activeStep, answer: "Open a line with the queen pawn.", idea: "d4 claims central space and frees the c1 bishop to join the game." } : activeStep.san === "Cc3" ? { ...activeStep, answer: "Develop the second knight.", idea: "Nc3 supports the center and completes harmonious development without moving the same piece twice." } : activeStep.san === "Fc4" ? { ...activeStep, answer: "Develop the bishop to c4.", idea: "Bc4 completes kingside development and prepares castling." } : activeStep.san === "O-O" ? { ...activeStep, answer: "Castle kingside.", idea: "Castling shelters the king and activates the rook on f1 in one move." } : activeStep;

  useEffect(() => {
    if (mistake && analysis?.bestMove) setMistake((current) => current ? enrichMistakeWithEngine(current, analysis.bestMove, language) : current);
  }, [analysis?.bestMove, language, mistake]);

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user || !active) return;
      const { data } = await supabase
        .from("lesson_progress")
        .select("completed_step, completed")
        .eq("user_id", user.id)
        .eq("lesson_id", id)
        .maybeSingle();
      if (!active || !data || !Number.isFinite(data.completed_step)) return;
      const restoredStep = Math.min(lessonSteps.length, data.completed_step);
      setCurrentStep(restoredStep);
      setPosition(reconstructPosition(lessonSteps, restoredStep));
      if (data.completed) setFeedback("complete");
    }).catch(() => undefined);
    return () => { active = false; };
  }, [id, lessonSteps.length]);

  useEffect(() => {
    if (currentStep === 0) return;
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      await supabase.from("lesson_progress").upsert({
        user_id: user.id,
        lesson_id: id,
        completed_step: currentStep,
        completed,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id,lesson_id" });
    }).catch(() => undefined);
  }, [completed, currentStep, id]);

  useEffect(() => {
    document.title = `${language === "fr" ? "Leçon" : "Lesson"} ${lesson.number} — ${language === "fr" ? lesson.title : id === "1" ? "The center" : id === "2" ? "Development" : "King safety"} | Échiquier`;
    return () => { document.title = "Échiquier — Apprendre les échecs simplement"; };
  }, [id, language, lesson.number, lesson.title]);

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
      const diagnostic = classifyMistake({ attemptedFrom: sourceSquare, attemptedTo: targetSquare, expectedFrom: activeStep.from, expectedTo: activeStep.to, stepIndex: currentStep, attemptNumber: nextAttempt, language });
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

  const history = currentStep === 0 ? [] : currentStep === 1 ? [`1. ${lessonSteps[0]?.san ?? "—"}   ${lessonSteps[0]?.replySan ?? "—"}`] : lessonSteps.slice(0, currentStep).reduce<string[]>((items, step, index) => { const moveNumber = index + 1; const row = `${moveNumber}. ${step.san}   ${step.replySan}`; items.push(row); return items; }, []);
  const completionPercent = completed ? 100 : Math.max(8, Math.round((currentStep / lessonSteps.length) * 100));

  return (
    <div className="lesson-shell min-h-screen bg-[#f7f0df] text-[#203830]">
      <header className="lesson-header paper-texture border-b border-[#c9bb96]">
        <div className="mx-auto flex min-h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <a href="/" className="flex items-center gap-3" aria-label="Retour à l’accueil Échiquier"><BrandMark /><div className="leading-none"><span className="display-font block text-[1.55rem] tracking-[-.04em]">Échiquier</span><span className="block pt-1 text-[.58rem] font-extrabold uppercase tracking-[.16em] text-[#766d57]">{t("guidedLesson")}</span></div></a>
          <div className="hidden items-center gap-3 sm:flex"><span className="font-mono text-[.64rem] font-bold tracking-[.1em] text-[#9a6b18]">{t("lesson").toUpperCase()} {lesson.number} / 03</span><span className="h-px w-10 bg-[#c5b58f]" /><span className="text-xs font-bold uppercase tracking-[.12em] text-[#59655e]">{language === "fr" ? lesson.title : id === "1" ? "The center" : id === "2" ? "Development" : "King safety"}</span></div><LanguageToggle />
          <div className="flex items-center gap-4"><a href="/account" className="text-[.66rem] font-extrabold uppercase tracking-[.11em] text-[#173e37] transition-colors hover:text-[#a87416]">{t("account")}</a><a href="/" className="inline-flex items-center gap-2 text-[.68rem] font-extrabold uppercase tracking-[.11em] text-[#173e37] transition-colors hover:text-[#a87416]"><ArrowLeft size={16} /> {t("back")}</a></div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-5 pb-20 pt-10 sm:px-8 lg:px-12 lg:pt-14">
        <div className="mb-9 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div><div className="flex items-center gap-3"><span className="h-px w-9 bg-[#d69024]" /><p className="eyebrow">{language === "fr" ? lesson.kicker : id === "1" ? "Opening · The first principle" : id === "2" ? "Opening · Give every piece a voice" : "Opening · Keep the king safe"}</p></div><h1 className="display-font mt-4 max-w-[12ch] text-5xl leading-[.9] tracking-[-.05em] text-[#173e37] sm:text-6xl">{language === "fr" ? lesson.headline : id === "1" ? "Take the center with e4." : id === "2" ? "Develop your pieces with intent." : "Castle before the position opens."}</h1></div>
          <div className="lesson-progress min-w-[245px] border-l border-[#c7b88f] pl-5"><div className="flex items-center justify-between text-[.62rem] font-extrabold uppercase tracking-[.14em] text-[#776e58]"><span>{t("progress")}</span><span>{completed ? t("completed") : `${currentStep + 1} / ${lessonSteps.length}`}</span></div><div className="mt-3 h-1.5 bg-[#ddd1b2]"><div className="h-full bg-[#d69024] transition-all duration-500" style={{ width: `${completionPercent || 8}%` }} /></div></div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.23fr)_390px] xl:gap-12">
          <section className="lesson-board-card relative overflow-hidden border border-[#bdaF83] bg-[#173e37] p-3 shadow-[15px_18px_0_rgba(42,50,41,.12)] sm:p-5">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 checker-line opacity-90" />
            <div className="mb-4 flex items-center justify-between px-1 text-[#fffaf0]"><div><p className="text-[.6rem] font-extrabold uppercase tracking-[.16em] text-[#e7ba61]">{language === "fr" ? "Position de départ" : "Starting position"}</p><p className="display-font mt-1 text-2xl">{t("whiteToMove")}</p></div><div className="grid h-10 w-10 place-items-center border border-[#759287] text-[#e7ba61]"><Sparkles size={17} /></div></div>
            <div className="lesson-board-wrap mx-auto max-w-[680px] bg-[#153d36] p-2 sm:p-3">
              <Chessboard options={{ id: "first-opening-lesson", position, boardOrientation: "white", showNotation: true, allowDragging: !completed, allowDrawingArrows: false, animationDurationInMs: 220, darkSquareStyle: { backgroundColor: "#3a6658" }, lightSquareStyle: { backgroundColor: "#f0dfb9" }, squareStyles: highlightedSquares, canDragPiece: ({ piece }) => piece.pieceType.startsWith("w") && !completed, onPieceDrop: ({ sourceSquare, targetSquare }) => handlePieceDrop(sourceSquare, targetSquare), onPieceClick: ({ square, piece }) => { if (piece.pieceType.startsWith("w") && square) setSelectedSquare(square); }, onSquareClick: ({ square }) => handleSquareClick(square) }} />
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 px-1"><div className="flex items-center gap-2 text-xs text-[#d9e0d6]"><span className="h-2 w-2 rounded-full bg-[#d69024]" /> {t("dragHint")}</div><Button variant="outline" size="sm" onClick={resetLesson} className="rounded-[.65rem] border-[#66857c] bg-transparent text-[.66rem] font-extrabold uppercase tracking-[.1em] text-[#fffaf0] hover:bg-[#284d43] hover:text-[#fffaf0]"><RotateCcw size={14} /> {t("reset")}</Button></div>
          </section>

          <aside className="space-y-4">
            <section className="lesson-paper border border-[#cbbd99] bg-[#fffaf0] p-6 sm:p-7"><div className="flex items-center justify-between"><span className="eyebrow">{language === "fr" ? "Votre mission" : "Your mission"}</span><span className="font-mono text-xs font-bold text-[#a87416]">{completed ? "✓" : `0${currentStep + 1}`}</span></div>{completed ? <div className="mt-6"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d69024] text-[#173e37]"><Trophy size={22} /></div><h2 className="display-font mt-5 text-4xl leading-none tracking-[-.04em] text-[#173e37]">{language === "fr" ? "Très bien joué." : "Well played."}</h2><p className="mt-4 leading-7 text-[#5f5b4e]">{language === "fr" ? "Vous avez occupé le centre et développé une pièce. Ce sont les deux premiers gestes d’une bonne ouverture." : "You occupied the center and developed a piece. These are the first two habits of a sound opening."}</p></div> : <div className="mt-6"><h2 className="display-font text-4xl leading-none tracking-[-.04em] text-[#173e37]">{activeStepCopy.answer}</h2><p className="mt-5 leading-7 text-[#5f5b4e]">{activeStepCopy.idea}</p></div>}
              {!completed && <Button variant="outline" onClick={() => setShowHint((value) => !value)} className="mt-6 w-full rounded-[.65rem] border-[#bcae88] bg-transparent text-[.67rem] font-extrabold uppercase tracking-[.1em] text-[#173e37] hover:bg-[#efe4cb]"><Lightbulb size={15} /> {showHint ? t("hideHint") : t("hint")}</Button>}
              {completed && <Button onClick={resetLesson} className="mt-7 w-full rounded-[.65rem] bg-[#173e37] text-[.67rem] font-extrabold uppercase tracking-[.1em] text-[#fffaf0] hover:bg-[#285448]"><RotateCcw size={15} /> {language === "fr" ? "Rejouer la leçon" : "Replay the lesson"}</Button>}
            </section>

            <section className={`lesson-feedback border p-5 ${feedback === "wrong" ? "border-[#c96442] bg-[#fff0e7]" : feedback === "complete" ? "border-[#6f977c] bg-[#e9f0e6]" : feedback === "correct" ? "border-[#90a98d] bg-[#f2f4e9]" : "border-[#cbbd99] bg-[#f5ecd8]"}`}><div className="flex gap-3"><div className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full ${feedback === "wrong" ? "bg-[#c96442] text-white" : "bg-[#d69024] text-[#173e37]"}`}>{feedback === "wrong" ? <CircleHelp size={15} /> : <Check size={16} strokeWidth={3} />}</div><div><p className="text-[.65rem] font-extrabold uppercase tracking-[.13em] text-[#736954]">{feedback === "wrong" ? t("tryAgain") : feedback === "idle" ? (language === "fr" ? "Un conseil" : "A tip") : feedback === "complete" ? (language === "fr" ? "Séquence terminée" : "Sequence complete") : (language === "fr" ? "Coup validé" : "Move validated")}</p><p className="mt-2 text-sm leading-6 text-[#4e5146]">{feedback === "wrong" ? t("wrongMove") : feedback === "complete" ? (language === "fr" ? "Retenez ce rythme : centre, développement, puis sécurité du roi." : "Remember the rhythm: center, development, then king safety.") : feedback === "correct" ? (language === "fr" ? "La réponse noire est jouée. Continuez avec le prochain principe." : "Black has replied. Continue with the next principle.") : t("advice")}</p></div></div></section>

            {mistake && <CoachingPanel mistake={mistake} />}


            <section className="lesson-analysis border border-[#cbbd99] bg-[#173e37] p-5 text-[#fffaf0]">
              <div className="flex items-start justify-between gap-4">
                <div><p className="eyebrow text-[#e7ba61]">{t("localAnalysis")}</p><h2 className="display-font mt-2 text-3xl leading-none">{t("engineView")}</h2></div>
                <div className="grid h-10 w-10 shrink-0 place-items-center border border-[#66857c] text-[#e7ba61]"><Cpu size={18} /></div>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#d9e0d6]">{t("engineDescription")}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button onClick={handleAnalyze} disabled={!engineReady || isAnalyzing} className="rounded-[.65rem] bg-[#d69024] text-[.66rem] font-extrabold uppercase tracking-[.1em] text-[#173e37] hover:bg-[#e7ba61] disabled:opacity-50"><Cpu size={14} /> {isAnalyzing ? t("analyzing") : engineReady ? t("analyze") : t("loadingEngine")}</Button>
                {isAnalyzing && <Button variant="outline" onClick={stop} className="rounded-[.65rem] border-[#66857c] bg-transparent text-[.66rem] font-extrabold uppercase tracking-[.1em] text-[#fffaf0] hover:bg-[#284d43] hover:text-[#fffaf0]">{t("stop")}</Button>}
              </div>
              {showAnalysis && <div className="mt-5 border-t border-[#496d61] pt-4" aria-live="polite">
                {engineError && <p className="text-sm text-[#f1b3a0]">{engineError}</p>}
                {!engineError && !analysis && <p className="flex items-center gap-2 text-sm text-[#d9e0d6]"><Loader2 size={15} className="animate-spin" /> {language === "fr" ? "Préparation de l’analyse…" : "Preparing analysis…"}</p>}
                {analysis && <div className="grid grid-cols-2 gap-3 text-sm"><div><span className="block text-[.6rem] font-extrabold uppercase tracking-[.12em] text-[#9cb4a9]">{t("evaluation")}</span><strong className="mt-1 block font-mono text-2xl text-[#e7ba61]">{analysis.scoreLabel}</strong></div><div><span className="block text-[.6rem] font-extrabold uppercase tracking-[.12em] text-[#9cb4a9]">{t("depth")}</span><strong className="mt-1 block font-mono text-2xl text-[#fffaf0]">{analysis.depth || "—"}</strong></div><div className="col-span-2"><span className="block text-[.6rem] font-extrabold uppercase tracking-[.12em] text-[#9cb4a9]">{t("bestMove")}</span><strong className="mt-1 block font-mono text-lg text-[#fffaf0]">{analysis.bestMove ? formatUciAsSan(position, analysis.bestMove) : t("waitingAnalysis")}</strong></div><div className="col-span-2"><span className="block text-[.6rem] font-extrabold uppercase tracking-[.12em] text-[#9cb4a9]">{t("mainLine")}</span><p className="mt-1 font-mono text-xs leading-6 text-[#d9e0d6]">{analysis.principalVariation.length ? formatPrincipalVariation(position, analysis.principalVariation).join(" · ") : t("waitingAnalysis")}</p></div></div>}
              </div>}
              <p className="mt-4 flex items-center gap-2 text-[.65rem] uppercase tracking-[.1em] text-[#9cb4a9]"><SquareArrowOutUpRight size={13} /> {t("engineFooter")}</p>
            </section>

            <section className="lesson-history border border-[#cbbd99] bg-[#ece0c1] p-5"><p className="eyebrow">{t("moveSheet")}</p><div className="mt-4 min-h-13 border-l border-[#bfae83] pl-4 font-mono text-sm font-bold leading-7 text-[#28483f]">{history.length ? history.map((move) => <div key={move}>{move}</div>) : <span className="text-[#867c64]">{t("waitingMove")}</span>}</div>{completed && <div className="mt-4 flex items-center gap-2 border-t border-[#c7b48a] pt-4 text-[.65rem] font-extrabold uppercase tracking-[.12em] text-[#6c725c]"><Check size={14} className="text-[#467a5d]" /> {t("objectiveFilled")} <ChevronRight size={14} /></div>}</section>
          </aside>
        </div>

        <section className="lesson-notes mt-10 grid gap-px border border-[#cbbd99] bg-[#cbbd99] md:grid-cols-3"><div className="bg-[#fffaf0] p-6"><span className="font-mono text-xs font-bold text-[#d69024]">01 /</span><h3 className="display-font mt-5 text-3xl text-[#173e37]">{t("noteCenter")}</h3><p className="mt-3 text-sm leading-6 text-[#615d50]">{language === "fr" ? "Les cases e4, d4, e5 et d5 organisent la bataille dès les premiers coups." : "The e4, d4, e5 and d5 squares shape the battle from the first moves."}</p></div><div className="bg-[#fffaf0] p-6"><span className="font-mono text-xs font-bold text-[#d69024]">02 /</span><h3 className="display-font mt-5 text-3xl text-[#173e37]">{t("noteDevelopment")}</h3><p className="mt-3 text-sm leading-6 text-[#615d50]">{language === "fr" ? "Sortez vos cavaliers et vos fous avant de déplacer la même pièce plusieurs fois." : "Develop your knights and bishops before moving the same piece several times."}</p></div><div className="bg-[#fffaf0] p-6"><span className="font-mono text-xs font-bold text-[#d69024]">03 /</span><h3 className="display-font mt-5 text-3xl text-[#173e37]">{t("noteSafety")}</h3><p className="mt-3 text-sm leading-6 text-[#615d50]">{language === "fr" ? "Lorsque vos pièces sont prêtes, roquez pour mettre votre roi à l’abri." : "When your pieces are ready, castle to keep your king safe."}</p></div></section>
      </main>
    </div>
  );
}
