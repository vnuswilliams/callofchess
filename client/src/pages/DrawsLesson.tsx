import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Check, CircleHelp, RotateCcw, Trophy } from "lucide-react";
import { Chessboard } from "react-chessboard";
import { Link } from "wouter";
import { Chess, type Square } from "chess.js";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
import { PUBLIC_LESSON_ID_BY_KEY } from "@/lib/lessonIds";
import { createDrawPosition, type LessonDefinition } from "@/lib/levelZeroLessons";
import { describeGameResult } from "@/lib/beginnerComputer";
import { announceLearningPathProgressUpdated, shouldAnnounceFirstCompletion, storeFirstCompletionNotice } from "@/lib/learningPathProgress";

export default function DrawsLesson({ lesson }: { lesson: LessonDefinition }) {
  const { language, toggleLanguage, t } = useLanguage();
  const copy = language === "fr" ? "fr" : "en";
  const [specialStep, setSpecialStep] = useState(0);
  const [specialPosition, setSpecialPosition] = useState(lesson.steps[0]?.positionFen ?? lesson.startingFen);
  const [feedback, setFeedback] = useState<"idle" | "wrong" | "correct">("idle");
  const [selectedSpecialSquare, setSelectedSpecialSquare] = useState<string | null>(null);
  const [selectedDraw, setSelectedDraw] = useState(lesson.drawPositions[0].id);
  const [drawGame, setDrawGame] = useState(() => createDrawPosition(lesson.drawPositions[0]));
  const [visitedDraws, setVisitedDraws] = useState<Set<string>>(new Set([lesson.drawPositions[0].id]));
  const [completed, setCompleted] = useState(false);

  const activeStep = lesson.steps[specialStep];
  const currentDraw = lesson.drawPositions.find((position) => position.id === selectedDraw) ?? lesson.drawPositions[0];
  const drawResult = describeGameResult(drawGame);
  const specialComplete = specialStep >= lesson.steps.length;
  const totalProgress = Math.round(((specialStep + visitedDraws.size) / (lesson.steps.length + lesson.drawPositions.length)) * 100);

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user || !active) return;
      const { data } = await supabase.from("lesson_progress").select("completed").eq("user_id", user.id).eq("lesson_id", PUBLIC_LESSON_ID_BY_KEY["5"]).maybeSingle();
      if (active && data?.completed) setCompleted(true);
    }).catch(() => undefined);
    return () => { active = false; };
  }, []);

  useEffect(() => {
    document.title = `${lesson.title[copy]} — Call of Chess`;
    return () => { document.title = "Call of Chess — Apprendre les échecs simplement"; };
  }, [copy, lesson.title]);

  const history = useMemo(() => lesson.steps.slice(0, specialStep).map((step, index) => `${index + 1}. ${step.san}${step.replySan ? `   ${step.replySan}` : ""}`), [lesson.steps, specialStep]);

  const saveCompletion = async () => {
    setCompleted(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    if (shouldAnnounceFirstCompletion(completed, true)) storeFirstCompletionNotice(localStorage, user.id, PUBLIC_LESSON_ID_BY_KEY["5"]);
    const { error } = await supabase.from("lesson_progress").upsert({
      user_id: user.id,
      lesson_id: PUBLIC_LESSON_ID_BY_KEY["5"],
      completed_steps: lesson.steps.length,
      current_fen: drawGame.fen(),
      move_history: [...history, ...Array.from(visitedDraws)],
      completed: true,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id,lesson_id" });
    if (!error) announceLearningPathProgressUpdated();
  };

  const handleSpecialDrop = (sourceSquare: string, targetSquare: string | null) => {
    if (!targetSquare || specialComplete || !activeStep) return false;
    if (sourceSquare !== activeStep.from || targetSquare !== activeStep.to) {
      setFeedback("wrong");
      return false;
    }
    try {
      const game = new Chess(activeStep.positionFen ?? specialPosition);
      game.move({ from: sourceSquare as Square, to: targetSquare as Square, promotion: "q" });
      if (activeStep.reply) game.move(activeStep.reply);
      setSpecialStep((step) => step + 1);
      setSpecialPosition(lesson.steps[specialStep + 1]?.positionFen ?? game.fen());
      setSelectedSpecialSquare(null);
      setFeedback("correct");
      return true;
    } catch {
      setFeedback("wrong");
      return false;
    }
  };

  const handleSpecialSquareClick = (square: string) => {
    if (specialComplete || !activeStep) return;
    const game = new Chess(specialPosition);
    const piece = game.get(square as Square);
    if (!selectedSpecialSquare) {
      if (piece?.color === "w") setSelectedSpecialSquare(square);
      return;
    }
    if (piece?.color === "w") {
      setSelectedSpecialSquare(square);
      return;
    }
    handleSpecialDrop(selectedSpecialSquare, square);
  };

  const specialSquareStyles = selectedSpecialSquare ? { [selectedSpecialSquare]: { boxShadow: "inset 0 0 0 4px #d69024" } } : {};
  const selectDraw = (id: typeof selectedDraw) => {
    const next = lesson.drawPositions.find((position) => position.id === id) ?? lesson.drawPositions[0];
    setSelectedDraw(next.id);
    setDrawGame(createDrawPosition(next));
    setVisitedDraws((current) => new Set([...Array.from(current), next.id]));
  };

  const handleDrawDrop = (sourceSquare: string, targetSquare: string | null) => {
    if (!targetSquare) return false;
    try {
      const next = new Chess(drawGame.fen());
      next.move({ from: sourceSquare as Square, to: targetSquare as Square, promotion: "q" });
      setDrawGame(next);
      return true;
    } catch {
      return false;
    }
  };

  const reset = () => {
    setSpecialStep(0);
    setSpecialPosition(lesson.steps[0]?.positionFen ?? lesson.startingFen);
    setFeedback("idle");
    setSelectedSpecialSquare(null);
    setSelectedDraw(lesson.drawPositions[0].id);
    setDrawGame(createDrawPosition(lesson.drawPositions[0]));
    setVisitedDraws(new Set([lesson.drawPositions[0].id]));
    setCompleted(false);
  };

  return <div className="min-h-screen bg-[#f7f0df] text-[#203830]"><header className="paper-texture border-b border-[#c9bb96]"><div className="mx-auto flex min-h-[76px] max-w-[1440px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-12"><Link href="/path" className="inline-flex items-center gap-3 text-[#173e37]" aria-label={t("back")}><span className="grid h-10 w-10 place-items-center rounded-full border border-[#d69024] bg-[#173e37] text-xl text-[#e7ba61]" aria-hidden="true">♞</span><span className="display-font text-[1.35rem]">Call of Chess</span></Link><div className="flex items-center gap-3"><span className="hidden text-[.65rem] font-extrabold uppercase tracking-[.12em] text-[#756c58] sm:inline">{t("boardExercise")} · 05 / 06</span><button type="button" onClick={toggleLanguage} className="min-h-11 border border-[#b8aa86] px-3 py-2 text-[.6rem] font-extrabold uppercase tracking-[.12em] text-[#173e37]" aria-label={t("language")}>{language === "fr" ? "EN" : "FR"}</button></div></div></header><main className="mx-auto max-w-[1440px] px-5 pb-20 pt-10 sm:px-8 lg:px-12 lg:pt-14"><div className="mb-9 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end"><div><p className="eyebrow">{lesson.kicker[copy]}</p><h1 className="display-font mt-4 max-w-[16ch] text-5xl leading-[.9] tracking-[-.05em] text-[#173e37] sm:text-7xl">{lesson.headline[copy]}</h1><p className="mt-5 max-w-2xl text-sm leading-7 text-[#625d50]">{lesson.objective[copy]}</p></div><div className="border-l border-[#c7b88f] pl-5"><div className="flex justify-between text-[.62rem] font-extrabold uppercase tracking-[.14em] text-[#776e58]"><span>{t("progress")}</span><span>{totalProgress}%</span></div><div className="mt-3 h-1.5 w-52 bg-[#ddd1b2]"><div className="h-full bg-[#d69024] transition-all" style={{ width: `${Math.max(5, totalProgress)}%` }} /></div></div></div>

{!specialComplete ? <section className="grid gap-8 xl:grid-cols-[minmax(0,1.2fr)_390px] xl:gap-12"><div className="border border-[#bdae83] bg-[#173e37] p-3 shadow-[15px_18px_0_rgba(42,50,41,.12)] sm:p-5"><div className="mb-4 flex items-center justify-between text-[#fffaf0]"><div><p className="text-[.6rem] font-extrabold uppercase tracking-[.16em] text-[#e7ba61]">{t("boardExercise")}</p><p className="display-font mt-1 text-2xl">{t("lesson")} {specialStep + 1} / {lesson.steps.length}</p></div><span className="font-mono text-sm text-[#e7ba61]">{activeStep?.san}</span></div><div className="mx-auto w-full max-w-[680px] bg-[#153d36] p-2 sm:p-3"><Chessboard options={{ id: "level-zero-special", position: specialPosition, boardOrientation: "white", showNotation: true, allowDragging: true, squareStyles: specialSquareStyles, darkSquareStyle: { backgroundColor: "#3a6658" }, lightSquareStyle: { backgroundColor: "#f0dfb9" }, onPieceDrop: ({ sourceSquare, targetSquare }) => handleSpecialDrop(sourceSquare, targetSquare), onPieceClick: ({ square, piece }) => { if (piece?.pieceType.startsWith("w") && square) setSelectedSpecialSquare(square); }, onSquareClick: ({ square }) => handleSpecialSquareClick(square) }} /></div><div className="mt-4 flex items-center justify-between gap-3 border-t border-[#66857c] pt-4 text-xs text-[#d9e0d6]"><span>{t("dragHint")}</span><button type="button" onClick={reset} className="inline-flex min-h-11 items-center gap-2 border border-[#66857c] px-3 text-[.66rem] font-extrabold uppercase tracking-[.1em] text-[#fffaf0] hover:bg-[#284d43]"><RotateCcw size={14} /> {t("reset")}</button></div></div><aside className="space-y-4"><section className="border border-[#cbbd99] bg-[#fffaf0] p-5 sm:p-7"><p className="eyebrow">{t("inline_28d9964386")}</p><h2 className="display-font mt-4 text-3xl leading-none text-[#173e37] sm:text-4xl">{activeStep?.answer[copy]}</h2><p className="mt-4 text-sm leading-7 text-[#5f5b4e]">{activeStep?.idea[copy]}</p></section><section className={`border p-5 ${feedback === "wrong" ? "border-[#c96442] bg-[#fff0e7]" : feedback === "correct" ? "border-[#90a98d] bg-[#f2f4e9]" : "border-[#cbbd99] bg-[#f5ecd8]"}`} aria-live="polite"><div className="flex gap-3"><div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#d69024] text-[#173e37]">{feedback === "wrong" ? <CircleHelp size={15} /> : <Check size={16} strokeWidth={3} />}</div><p className="text-sm leading-6 text-[#4e5146]">{feedback === "wrong" ? t("wrongMove") : feedback === "correct" ? t("inline_295297f9e2") : lesson.solution[copy]}</p></div></section><section className="border border-[#cbbd99] bg-[#ece0c1] p-5"><p className="eyebrow">{t("moveSheet")}</p><div className="mt-3 font-mono text-sm leading-7 text-[#28483f]">{history.length ? history.map((move) => <div key={move}>{move}</div>) : <span className="text-[#867c64]">{t("waitingMove")}</span>}</div></section></aside></section> : <section className="grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_390px] xl:gap-12"><div className="border border-[#bdae83] bg-[#173e37] p-3 shadow-[15px_18px_0_rgba(42,50,41,.12)] sm:p-5"><div className="mb-4 flex items-center justify-between text-[#fffaf0]"><div><p className="text-[.6rem] font-extrabold uppercase tracking-[.16em] text-[#e7ba61]">{t("drawTypes")}</p><p className="display-font mt-1 text-2xl">{currentDraw.title[copy]}</p></div><span className="font-mono text-sm text-[#e7ba61]">{drawResult === "draw" || drawResult === "stalemate" ? "=" : "…"}</span></div><div className="mx-auto w-full max-w-[680px] bg-[#153d36] p-2 sm:p-3"><Chessboard options={{ id: "level-zero-draw", position: drawGame.fen(), boardOrientation: "white", showNotation: true, allowDragging: true, darkSquareStyle: { backgroundColor: "#3a6658" }, lightSquareStyle: { backgroundColor: "#f0dfb9" }, onPieceDrop: ({ sourceSquare, targetSquare }) => handleDrawDrop(sourceSquare, targetSquare) }} /></div><div className="mt-4 border-t border-[#66857c] pt-4 text-sm leading-6 text-[#d9e0d6]">{currentDraw.explanation[copy]}</div><div className="mt-5 space-y-5 border-t border-[#66857c] pt-5 text-[#d9e0d6]"><div><p className="text-[.62rem] font-extrabold uppercase tracking-[.13em] text-[#e7ba61]">{t("drawDefinition")}</p><p className="mt-2 text-sm leading-6">{currentDraw.definition[copy]}</p></div><div><p className="text-[.62rem] font-extrabold uppercase tracking-[.13em] text-[#e7ba61]">{t("drawCondition")}</p><p className="mt-2 text-sm leading-6">{currentDraw.condition[copy]}</p></div><div><p className="text-[.62rem] font-extrabold uppercase tracking-[.13em] text-[#e7ba61]">{t("drawExample")}</p><p className="mt-2 text-sm leading-6">{currentDraw.example[copy]}</p></div></div></div><aside className="space-y-4"><section className="border border-[#cbbd99] bg-[#fffaf0] p-5 sm:p-7"><p className="eyebrow">{t("drawTypes")}</p><div className="mt-4 space-y-2">{lesson.drawPositions.map((position) => <button key={position.id} type="button" onClick={() => selectDraw(position.id)} className={`flex min-h-11 w-full items-center justify-between border px-4 py-3 text-left text-sm font-bold ${position.id === selectedDraw ? "border-[#d69024] bg-[#f0dfb9] text-[#173e37]" : "border-[#e1d7bd] text-[#5f5b4e] hover:border-[#d69024]"}`}><span>{position.title[copy]}</span>{visitedDraws.has(position.id) && <Check size={16} className="text-[#467a5d]" />}</button>)}</div></section><section className={`border p-5 ${drawResult === "draw" || drawResult === "stalemate" ? "border-[#6f977c] bg-[#e9f0e6]" : "border-[#cbbd99] bg-[#f5ecd8]"}`} aria-live="polite"><p className="text-[.68rem] font-extrabold uppercase tracking-[.12em] text-[#756c58]">{t("positionResult")}</p><p className="mt-2 text-sm leading-6 text-[#4e5146]">{drawResult === "stalemate" ? lesson.drawPositions[0].explanation[copy] : drawResult === "draw" ? t("drawDetected") : t("drawNotDetected")}</p></section><section className="border border-[#cbbd99] bg-[#ece0c1] p-5"><p className="text-sm leading-6 text-[#4e5146]">{lesson.solution[copy]}</p>{!completed && specialComplete && visitedDraws.size === lesson.drawPositions.length && <button type="button" onClick={saveCompletion} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 bg-[#d69024] px-4 text-[.67rem] font-extrabold uppercase tracking-[.1em] text-[#173e37] hover:bg-[#e7ba61]"><Trophy size={15} /> {t("theoryContinue")}</button>}{completed && <Link href={`/lesson/${PUBLIC_LESSON_ID_BY_KEY["6"]}`} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 bg-[#d69024] px-4 text-[.67rem] font-extrabold uppercase tracking-[.1em] text-[#173e37] hover:bg-[#e7ba61]"><Check size={15} /> {t("theoryComplete")}</Link>}</section></aside></section>}

<div className="mt-10 flex items-center justify-between border-t border-[#cbbd99] pt-6"><Link href="/path" className="inline-flex min-h-11 items-center gap-2 text-[.67rem] font-extrabold uppercase tracking-[.1em] text-[#173e37] hover:text-[#a87416]"><ArrowLeft size={15} /> {t("back")}</Link><button type="button" onClick={reset} className="inline-flex min-h-11 items-center gap-2 border border-[#bcae88] px-4 text-[.67rem] font-extrabold uppercase tracking-[.1em] text-[#173e37] hover:bg-[#efe4cb]"><RotateCcw size={15} /> {t("reset")}</button></div>
</main></div>;
}
