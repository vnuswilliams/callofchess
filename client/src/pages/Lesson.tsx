import { useEffect, useMemo, useRef, useState } from "react";
import { Chess, type Square } from "chess.js";
import { Chessboard } from "react-chessboard";
import { ArrowLeft, Check, ChevronRight, CircleHelp, Lightbulb, RotateCcw, Sparkles, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation, useParams } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
import { PUBLIC_LESSON_ID_BY_KEY, toLessonKey } from "@/lib/lessonIds";
import { getNextLessonHref } from "@/lib/lessonNavigation";
import { getFirstIncompleteLessonDestination, LESSON_MOVE_ANIMATION_MS, LESSON_STEP_TRANSITION_DELAY_MS, LESSON_SUCCESS_ANIMATION_MS } from "@/lib/lessonTransition";
import { announceLearningPathProgressUpdated, mergeLessonProgress, normalizeProgressLessonIds, shouldAnnounceFirstCompletion, storeFirstCompletionNotice, type LearningPathProgressRow } from "@/lib/learningPathProgress";
import { getNextStepPosition, lessonCatalog, reconstructPosition, type LessonDefinition } from "@/lib/levelZeroLessons";
import TheoryLesson from "@/pages/TheoryLesson";
import DrawsLesson from "@/pages/DrawsLesson";
import ComputerLesson from "@/pages/ComputerLesson";
import { lessonWorkspaceLayout } from "@/lib/lessonLayout";
import CalculationLesson from "@/pages/CalculationLesson";
import { calculationLessonCatalog } from "@/lib/calculationLessons";

function BrandMark() {
  return <div className="grid h-10 w-10 place-items-center rounded-full border border-[#d69024] bg-[#173e37] text-xl text-[#e7ba61]" aria-hidden="true">♞</div>;
}

function LanguageToggle() {
  const { language, toggleLanguage, t } = useLanguage();
  return <button type="button" onClick={toggleLanguage} aria-label={`${t("language")}: ${language === "fr" ? t("english") : t("french")}`} className="min-h-11 border border-[#b8aa86] px-3 py-2 text-[.6rem] font-extrabold uppercase tracking-[.12em] text-[#173e37] transition-colors hover:border-[#d69024]"><span aria-hidden="true">{language === "fr" ? "EN" : "FR"}</span><span className="sr-only">{language === "fr" ? t("english") : t("french")}</span></button>;
}

function lessonTitle(lesson: LessonDefinition, language: "fr" | "en") {
  return lesson.title[language];
}

function GuidedLesson() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const lessonKey = toLessonKey(id) ?? "1";
  const lesson = lessonCatalog[lessonKey] ?? lessonCatalog["1"];
  const lessonCount = Object.keys(lessonCatalog).length;
  const publicLessonId = PUBLIC_LESSON_ID_BY_KEY[lessonKey];
  const { t, language } = useLanguage();
  const copy = language === "fr" ? "fr" : "en";
  const [position, setPosition] = useState(lesson.steps[0]?.positionFen ?? lesson.startingFen);
  const [currentStep, setCurrentStep] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<"idle" | "wrong" | "correct" | "complete">("idle");
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [isComputerReplying, setIsComputerReplying] = useState(false);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const replyTimer = useRef<number | null>(null);
  const completedLessonIdsRef = useRef<Set<string>>(new Set());
  const completedProgressRef = useRef<LearningPathProgressRow | null>(null);
  const completionTransitionStartedRef = useRef(false);
  const completed = currentStep >= lesson.steps.length;
  const activeStep = lesson.steps[Math.min(currentStep, lesson.steps.length - 1)];

  const clearReplyTimer = () => {
    if (replyTimer.current !== null) window.clearTimeout(replyTimer.current);
    replyTimer.current = null;
    setIsComputerReplying(false);
  };

  useEffect(() => () => clearReplyTimer(), []);

  useEffect(() => {
    clearReplyTimer();
    completionTransitionStartedRef.current = false;
    completedProgressRef.current = null;
    setIsCelebrating(false);
    setPosition(lesson.steps[0]?.positionFen ?? lesson.startingFen);
    setCurrentStep(0);
    setShowHint(false);
    setFeedback("idle");
    setSelectedSquare(null);
  }, [lessonKey]);

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user || !active) return;
      const { data } = await supabase.from("lesson_progress").select("lesson_id, completed_steps, completed, current_fen").eq("user_id", user.id).limit(Object.keys(PUBLIC_LESSON_ID_BY_KEY).length);
      if (!active || !data) return;
      const progressRows = normalizeProgressLessonIds(data as LearningPathProgressRow[]);
      completedLessonIdsRef.current = new Set(progressRows.filter((row) => row.completed).map((row) => row.lesson_id));
      const currentProgress = progressRows.find((row) => row.lesson_id === publicLessonId);
      completedProgressRef.current = currentProgress ?? null;
      if (!currentProgress || !Number.isFinite(currentProgress.completed_steps)) return;
      const restoredStep = Math.min(lesson.steps.length, currentProgress.completed_steps);
      setCurrentStep(restoredStep);
      setPosition(reconstructPosition(lesson.steps, restoredStep, lesson.startingFen));
      if (currentProgress.completed) setFeedback("complete");
    }).catch(() => undefined);
    return () => { active = false; };
  }, [lessonKey, publicLessonId]);

  const history = useMemo(() => lesson.steps.slice(0, currentStep).map((step, index) => `${index + 1}. ${step.san}${step.replySan && step.replySan !== "—" ? `   ${step.replySan}` : ""}`), [currentStep, lesson.steps]);
  const historySignature = history.join("|");

  useEffect(() => {
    if (currentStep === 0) return;
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const previouslyCompleted = Boolean(completedProgressRef.current?.completed);
      const progress = mergeLessonProgress(completedProgressRef.current, {
        lesson_id: publicLessonId,
        completed_steps: currentStep,
        completed,
      });
      completedProgressRef.current = progress;
      if (shouldAnnounceFirstCompletion(previouslyCompleted, progress.completed)) storeFirstCompletionNotice(localStorage, user.id, publicLessonId);
      if (progress.completed) completedLessonIdsRef.current = new Set(completedLessonIdsRef.current).add(publicLessonId);
      const { error } = await supabase.from("lesson_progress").upsert({
        user_id: user.id,
        lesson_id: publicLessonId,
        completed_steps: progress.completed_steps,
        current_fen: position,
        move_history: history,
        completed: progress.completed,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id,lesson_id" });
      if (!error) announceLearningPathProgressUpdated();
    }).catch(() => undefined);
  }, [completed, currentStep, historySignature, position, publicLessonId]);

  useEffect(() => {
    if (!isCelebrating) return;
    let active = true;
    const timer = window.setTimeout(() => {
      const redirectToFirstIncompleteLesson = async () => {
        let completedIds = new Set(completedLessonIdsRef.current);
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data } = await supabase.from("lesson_progress").select("lesson_id, completed").eq("user_id", user.id).limit(Object.keys(PUBLIC_LESSON_ID_BY_KEY).length);
            if (data) completedIds = new Set(data.filter((row) => row.completed && typeof row.lesson_id === "string").map((row) => row.lesson_id));
          }
        } catch {
          // Keep the locally known completion set when the optional refresh is unavailable.
        }
        completedIds.add(publicLessonId);
        completedLessonIdsRef.current = completedIds;
        if (active) setLocation(getFirstIncompleteLessonDestination(completedIds));
      };
      void redirectToFirstIncompleteLesson();
    }, LESSON_SUCCESS_ANIMATION_MS);
    return () => { active = false; window.clearTimeout(timer); };
  }, [isCelebrating, publicLessonId, setLocation]);

  useEffect(() => {
    document.title = `${lessonTitle(lesson, copy)} — Call of Chess`;
    return () => { document.title = "Call of Chess — Apprendre les échecs simplement"; };
  }, [lesson, copy]);

  const highlightedSquares = useMemo(() => {
    if (!showHint || completed) return {};
    return {
      [activeStep.from]: { background: "radial-gradient(circle, rgba(214,144,36,.55) 18%, transparent 20%)" },
      [activeStep.to]: { background: "rgba(214,144,36,.35)" },
      ...(selectedSquare ? { [selectedSquare]: { boxShadow: "inset 0 0 0 4px #d69024" } } : {}),
    };
  }, [activeStep, completed, selectedSquare, showHint]);

  const resetLesson = () => {
    clearReplyTimer();
    completionTransitionStartedRef.current = false;
    setIsCelebrating(false);
    setPosition(lesson.steps[0]?.positionFen ?? lesson.startingFen);
    setCurrentStep(0);
    setShowHint(false);
    setFeedback("idle");
    setSelectedSquare(null);
  };

  const completeStep = (afterUserMove: Chess) => {
    const nextStep = currentStep + 1;
    const isFinalStep = nextStep === lesson.steps.length;
    const reply = activeStep.reply;
    const startCompletionTransition = () => {
      if (!isFinalStep || completionTransitionStartedRef.current) return;
      completionTransitionStartedRef.current = true;
      completedLessonIdsRef.current = new Set(completedLessonIdsRef.current).add(publicLessonId);
      setIsCelebrating(true);
    };
    if (!reply) {
      const afterUserMoveFen = afterUserMove.fen();
      const nextPosition = getNextStepPosition(lesson.steps, nextStep, afterUserMoveFen);
      setPosition(afterUserMoveFen);
      setCurrentStep(nextStep);
      setFeedback(isFinalStep ? "complete" : "correct");
      if (nextPosition !== afterUserMoveFen) {
        replyTimer.current = window.setTimeout(() => {
          setPosition(nextPosition);
          replyTimer.current = null;
        }, LESSON_STEP_TRANSITION_DELAY_MS);
      }
      startCompletionTransition();
      return;
    }
    setIsComputerReplying(true);
    replyTimer.current = window.setTimeout(() => {
      try {
        const afterReply = new Chess(afterUserMove.fen());
        afterReply.move(reply);
        setPosition(lesson.steps[nextStep]?.positionFen ?? afterReply.fen());
        setCurrentStep(nextStep);
        setFeedback(isFinalStep ? "complete" : "correct");
        startCompletionTransition();
      } catch {
        setFeedback("correct");
      } finally {
        setIsComputerReplying(false);
        replyTimer.current = null;
      }
    }, LESSON_STEP_TRANSITION_DELAY_MS);
  };

  const handlePieceDrop = (sourceSquare: string, targetSquare: string | null) => {
    if (!targetSquare || completed || isComputerReplying) return false;
    if (sourceSquare !== activeStep.from || targetSquare !== activeStep.to) {
      setFeedback("wrong");
      setShowHint(true);
      return false;
    }
    try {
      const afterUserMove = new Chess(position);
      afterUserMove.move({ from: sourceSquare as Square, to: targetSquare as Square, promotion: "q" });
      setPosition(afterUserMove.fen());
      setFeedback("correct");
      setShowHint(false);
      setSelectedSquare(null);
      completeStep(afterUserMove);
      return true;
    } catch {
      setFeedback("wrong");
      return false;
    }
  };

  const handleSquareClick = (square: string) => {
    if (completed || isComputerReplying) return;
    const clickedPiece = new Chess(position).get(square as Square);
    if (!selectedSquare) {
      if (clickedPiece?.color === "w") setSelectedSquare(square);
      return;
    }
    if (clickedPiece?.color === "w") {
      setSelectedSquare(square);
      return;
    }
    handlePieceDrop(selectedSquare, square);
  };

  const completionPercent = completed ? 100 : Math.max(6, Math.round((currentStep / lesson.steps.length) * 100));
  const feedbackTitle = feedback === "wrong" ? t("tryAgain") : feedback === "idle" ? t("inline_901c5496b0") : feedback === "complete" ? t("completed") : t("inline_85aa755eb6");
  const feedbackText = feedback === "wrong" ? t("wrongMove") : feedback === "complete" ? lesson.solution[copy] : feedback === "correct" ? t("inline_295297f9e2") : lesson.objective[copy];

  return (
    <div className="lesson-shell min-h-screen bg-[#f7f0df] text-[#203830]">
      {isCelebrating && <div className="lesson-success-overlay pointer-events-none fixed inset-0 z-50 grid place-items-center bg-[#173e37]/25 px-5" role="status" aria-live="assertive" aria-atomic="true"><div className="lesson-confetti" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <span key={index} />)}</div><div className="lesson-success-card w-full max-w-sm border border-[#6f977c] bg-[#e9f0e6] p-6 text-center shadow-[12px_14px_0_rgba(42,50,41,.16)] sm:p-8"><div className="lesson-success-medallion mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#d69024] text-[#173e37]" aria-hidden="true"><Trophy size={28} /></div><p className="display-font mt-5 text-3xl leading-none tracking-[-.04em] text-[#173e37]">{t("lessonSuccessTitle")}</p><p className="mt-3 text-sm leading-6 text-[#4e5146]">{t("inline_db305833f7")}</p><p className="mt-4 text-[.65rem] font-extrabold uppercase tracking-[.13em] text-[#467a5d]">{t("lessonSuccessNext")}</p></div></div>}
      <header className="lesson-header paper-texture border-b border-[#c9bb96]">
        <div className="mx-auto flex min-h-[76px] max-w-[1440px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
          <a href="/" className="flex items-center gap-3" aria-label={t("back")}><BrandMark /><div className="leading-none"><span className="display-font block text-[1.45rem] tracking-[-.04em]">Call of Chess</span><span className="block pt-1 text-[.58rem] font-extrabold uppercase tracking-[.16em] text-[#766d57]">{t("guidedLesson")}</span></div></a>
          <div className="hidden items-center gap-3 sm:flex"><span className="font-mono text-[.64rem] font-bold tracking-[.1em] text-[#9a6b18]">{t("lesson").toUpperCase()} {lesson.number} / {String(lessonCount).padStart(2, "0")}</span><span className="h-px w-10 bg-[#c5b58f]" /><span className="text-xs font-bold uppercase tracking-[.12em] text-[#59655e]">{lessonTitle(lesson, copy)}</span></div>
          <div className="flex items-center gap-3"><LanguageToggle /><a href="/path" className="hidden items-center gap-2 text-[.68rem] font-extrabold uppercase tracking-[.11em] text-[#173e37] transition-colors hover:text-[#a87416] sm:inline-flex"><ArrowLeft size={16} /> {t("back")}</a></div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-5 pb-20 pt-10 sm:px-8 lg:px-12 lg:pt-14">
        <div className="mb-9 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div><div className="flex items-center gap-3"><span className="h-px w-9 bg-[#d69024]" /><p className="eyebrow">{lesson.kicker[copy]}</p></div><h1 className="display-font mt-4 max-w-[15ch] text-5xl leading-[.9] tracking-[-.05em] text-[#173e37] sm:text-6xl">{lesson.headline[copy]}</h1><p className="mt-5 max-w-2xl text-sm leading-7 text-[#625d50]">{lesson.objective[copy]}</p></div>
          <div className="lesson-progress min-w-[245px] border-l border-[#c7b88f] pl-5"><div className="flex items-center justify-between text-[.62rem] font-extrabold uppercase tracking-[.14em] text-[#776e58]"><span>{t("progress")}</span><span>{completed ? t("completed") : `${currentStep + 1} / ${lesson.steps.length}`}</span></div><div className="mt-3 h-1.5 bg-[#ddd1b2]"><div className="h-full bg-[#d69024] transition-all duration-500" style={{ width: `${completionPercent}%` }} /></div></div>
        </div>

        <div className="lesson-workspace grid gap-8 xl:grid-cols-[minmax(0,1.23fr)_390px] xl:gap-12">
          <section className={`${lessonWorkspaceLayout.mobile.boardClass} relative overflow-hidden border border-[#bdaF83] bg-[#173e37] p-3 shadow-[15px_18px_0_rgba(42,50,41,.12)] sm:p-5`}>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 checker-line opacity-90" />
            <div className="mb-4 flex items-center justify-between px-1 text-[#fffaf0]"><div><p className="text-[.6rem] font-extrabold uppercase tracking-[.16em] text-[#e7ba61]">{t("chess.board")}</p><p className="display-font mt-1 text-2xl">{completed ? t("completed") : t("whiteToMove")}</p></div><div className="grid h-10 w-10 place-items-center border border-[#759287] text-[#e7ba61]"><Sparkles size={17} /></div></div>
            <div className="lesson-board-wrap mx-auto w-full max-w-[680px] bg-[#153d36] p-2 sm:p-3"><Chessboard options={{ id: `level-zero-${lessonKey}`, position, boardOrientation: "white", showNotation: true, allowDragging: !completed && !isComputerReplying, allowDrawingArrows: false, animationDurationInMs: LESSON_MOVE_ANIMATION_MS, darkSquareStyle: { backgroundColor: "#3a6658" }, lightSquareStyle: { backgroundColor: "#f0dfb9" }, squareStyles: highlightedSquares, canDragPiece: ({ piece }) => piece.pieceType.startsWith("w") && !completed && !isComputerReplying, onPieceDrop: ({ sourceSquare, targetSquare }) => handlePieceDrop(sourceSquare, targetSquare), onPieceClick: ({ square, piece }) => { if (piece.pieceType.startsWith("w") && square && !isComputerReplying) setSelectedSquare(square); }, onSquareClick: ({ square }) => handleSquareClick(square) }} /></div>
            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-[#66857c] pt-4 text-[#d9e0d6] sm:grid-cols-4" aria-label={t("chess.position")}><div><span className="block text-[.58rem] font-extrabold uppercase tracking-[.12em] text-[#9cb4a9]">{t("chess.position")}</span><strong className="mt-1 block font-mono text-sm text-[#fffaf0]">{String(Math.min(currentStep + 1, lesson.steps.length)).padStart(2, "0")} / {String(lesson.steps.length).padStart(2, "0")}</strong></div><div><span className="block text-[.58rem] font-extrabold uppercase tracking-[.12em] text-[#9cb4a9]">{t("chess.move")}</span><strong className="mt-1 block font-mono text-sm text-[#fffaf0]">{history.at(-1) ?? "—"}</strong></div><div><span className="block text-[.58rem] font-extrabold uppercase tracking-[.12em] text-[#9cb4a9]">{t("chess.board")}</span><strong className="mt-1 block font-mono text-sm text-[#fffaf0]">a–h · 1–8</strong></div><div><span className="block text-[.58rem] font-extrabold uppercase tracking-[.12em] text-[#9cb4a9]">{t("chess.white")}</span><strong className="mt-1 block text-sm text-[#fffaf0]">{isComputerReplying ? "…" : t("whiteToMove")}</strong></div></div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 px-1"><div className="flex items-center gap-2 text-xs text-[#d9e0d6]"><span className={`h-2 w-2 rounded-full ${isComputerReplying ? "animate-pulse bg-[#e7ba61]" : "bg-[#d69024]"}`} /> {isComputerReplying ? t("chess.computerReplying") : t("dragHint")}</div><Button variant="outline" size="sm" onClick={resetLesson} className="min-h-11 rounded-[.65rem] border-[#66857c] bg-transparent text-[.66rem] font-extrabold uppercase tracking-[.1em] text-[#fffaf0] hover:bg-[#284d43] hover:text-[#fffaf0]"><RotateCcw size={14} /> {t("reset")}</Button></div>
          </section>

          <aside className="contents">
            <section className={`${lessonWorkspaceLayout.mobile.missionClass} lesson-paper border border-[#cbbd99] bg-[#fffaf0] p-4 sm:p-7`}><div className="flex items-center justify-between"><span className="eyebrow">{t("inline_28d9964386")}</span><span className="font-mono text-xs font-bold text-[#a87416]">{completed ? "✓" : `0${currentStep + 1}`}</span></div>{completed ? <div className="mt-4 sm:mt-6"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d69024] text-[#173e37]"><Trophy size={22} /></div><h2 className="display-font mt-4 text-3xl leading-none tracking-[-.04em] text-[#173e37] sm:mt-5 sm:text-4xl">{t("inline_db305833f7")}</h2><p className="mt-3 leading-7 text-[#5f5b4e] sm:mt-4">{lesson.solution[copy]}</p></div> : <div className="mt-3 sm:mt-6"><h2 className="display-font text-3xl leading-none tracking-[-.04em] text-[#173e37] sm:text-4xl">{activeStep.answer[copy]}</h2><p className="mt-3 leading-7 text-[#5f5b4e] sm:mt-5">{activeStep.idea[copy]}</p></div>}{!completed && <Button variant="outline" onClick={() => setShowHint((value) => !value)} className="mt-4 min-h-11 w-full rounded-[.65rem] sm:mt-6 border-[#bcae88] bg-transparent text-[.67rem] font-extrabold uppercase tracking-[.1em] text-[#173e37] hover:bg-[#efe4cb]"><Lightbulb size={15} /> {showHint ? t("hideHint") : t("hint")}</Button>}{completed && <div className="mt-5 space-y-2 sm:mt-7"><a href={getNextLessonHref(lessonKey)} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[.65rem] bg-[#d69024] px-4 text-center text-[.67rem] font-extrabold uppercase tracking-[.1em] text-[#173e37] transition-colors hover:bg-[#e7ba61]"><ChevronRight size={15} /> {getNextLessonHref(lessonKey) === "/path" ? t("lessons.viewPath") : t("lessons.nextLesson")}</a><Button onClick={resetLesson} variant="outline" className="min-h-11 w-full rounded-[.65rem] border-[#bcae88] bg-transparent text-[.67rem] font-extrabold uppercase tracking-[.1em] text-[#173e37] hover:bg-[#efe4cb]"><RotateCcw size={15} /> {t("inline_3943304b7d")}</Button></div>}</section>
            <section className={`${lessonWorkspaceLayout.mobile.feedbackClass} border p-5 ${feedback === "wrong" ? "border-[#c96442] bg-[#fff0e7]" : feedback === "complete" ? "border-[#6f977c] bg-[#e9f0e6]" : feedback === "correct" ? "border-[#90a98d] bg-[#f2f4e9]" : "border-[#cbbd99] bg-[#f5ecd8]"}`} aria-live="polite"><div className="flex gap-3"><div className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full ${feedback === "wrong" ? "bg-[#c96442] text-white" : "bg-[#d69024] text-[#173e37]"}`}>{feedback === "wrong" ? <CircleHelp size={15} /> : <Check size={16} strokeWidth={3} />}</div><div><p className="text-[.65rem] font-extrabold uppercase tracking-[.13em] text-[#736954]">{feedbackTitle}</p><p className="mt-2 text-sm leading-6 text-[#4e5146]">{feedbackText}</p></div></div></section>
            <section className={`${lessonWorkspaceLayout.mobile.historyClass} rounded-xl border border-[#cbbd99] bg-[#ece0c1] p-5`}><p className="eyebrow">{t("moveSheet")}</p><div className="mt-4 min-h-13 border-l border-[#bfae83] pl-4 font-mono text-sm font-bold leading-7 text-[#28483f]">{history.length ? history.map((move) => <div key={move}>{move}</div>) : <span className="text-[#867c64]">{t("waitingMove")}</span>}</div>{completed && <div className="mt-4 flex items-center gap-2 border-t border-[#c7b48a] pt-4 text-[.65rem] font-extrabold uppercase tracking-[.12em] text-[#6c725c]"><Check size={14} className="text-[#467a5d]" /> {t("objectiveFilled")}</div>}</section>
          </aside>
        </div>

        {lesson.theorySections.length > 0 && <section className="mt-10 border border-[#cbbd99] bg-[#f5ecd8] p-5 sm:p-8" aria-labelledby="lesson-theory-title"><div className="flex flex-col gap-4 border-b border-[#d9c9a7] pb-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">{t("theoryBeforePractice")}</p><h2 id="lesson-theory-title" className="display-font mt-3 max-w-2xl text-3xl leading-none tracking-[-.04em] text-[#173e37] sm:text-4xl">{t("readThenPlay")}</h2></div>{lesson.reflection && <div className="max-w-sm border-l-2 border-[#d69024] pl-4"><p className="text-[.62rem] font-extrabold uppercase tracking-[.12em] text-[#9a6b18]">{t("reflectionQuestion")}</p><p className="mt-2 text-sm font-bold leading-6 text-[#28483f]">{lesson.reflection[copy]}</p></div>}</div><div className="mt-6 grid gap-px border border-[#d9c9a7] bg-[#d9c9a7] md:grid-cols-3">{lesson.theorySections.map((section, index) => <article key={section.title.fr} className="bg-[#fffaf0] p-5 sm:p-6"><span className="font-mono text-xs font-bold text-[#d69024]">{String(index + 1).padStart(2, "0")} /</span><h3 className="display-font mt-4 text-2xl leading-none text-[#173e37]">{section.title[copy]}</h3><p className="mt-3 text-sm leading-6 text-[#615d50]">{section.text[copy]}</p>{section.items && <div className="mt-4 space-y-3 border-t border-[#e2d8be] pt-4">{section.items.map((item) => <div key={item.label.fr}><p className="text-xs font-extrabold uppercase tracking-[.1em] text-[#9a6b18]">{item.label[copy]}</p><p className="mt-1 text-xs leading-5 text-[#756c58]">{item.text[copy]}</p></div>)}</div>}</article>)}</div></section>}
        <section className="lesson-notes mt-10 grid gap-px border border-[#cbbd99] bg-[#cbbd99] md:grid-cols-3" aria-label={t("chess.position")}>{lesson.keyPoints.map((point, index) => <div key={point.title.fr} className="bg-[#fffaf0] p-6"><span className="font-mono text-xs font-bold text-[#d69024]">{String(index + 1).padStart(2, "0")} /</span><h3 className="display-font mt-5 text-3xl text-[#173e37]">{point.title[copy]}</h3><p className="mt-3 text-sm leading-6 text-[#615d50]">{point.text[copy]}</p></div>)}</section>
      </main>
    </div>
  );
}


export default function Lesson() {
  const { id } = useParams<{ id: string }>();
  const lessonKey = toLessonKey(id) ?? "1";
  if (calculationLessonCatalog[lessonKey]) return <CalculationLesson />;
  const lesson = lessonCatalog[lessonKey] ?? lessonCatalog["1"];
  if (lesson.mode === "theory") return <TheoryLesson lesson={lesson} />;
  if (lesson.mode === "draws") return <DrawsLesson lesson={lesson} />;
  if (lesson.mode === "computer") return <ComputerLesson lesson={lesson} />;
  return <GuidedLesson />;
}
