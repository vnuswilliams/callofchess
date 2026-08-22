import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Check, CircleHelp, Lightbulb, RotateCcw, Trophy } from "lucide-react";
import { Chessboard } from "react-chessboard";
import { Link } from "wouter";
import { Chess, type Square } from "chess.js";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
import { PUBLIC_LESSON_ID_BY_KEY } from "@/lib/lessonIds";
import { shouldAnnounceFirstCompletion, storeFirstCompletionNotice } from "@/lib/learningPathProgress";
import { BEGINNER_COMPUTER_ELO, chooseBeginnerMove, createHumanMove, describeGameResult, type GameResult } from "@/lib/beginnerComputer";
import type { LessonDefinition } from "@/lib/levelZeroLessons";

const startingFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
type GameStatus = "playing" | "thinking" | "win" | "draw" | "loss";

export default function ComputerLesson({ lesson }: { lesson: LessonDefinition }) {
  const { language, toggleLanguage, t } = useLanguage();
  const copy = language === "fr" ? "fr" : "en";
  const [fen, setFen] = useState(startingFen);
  const [history, setHistory] = useState<string[]>([]);
  const [status, setStatus] = useState<GameStatus>("playing");
  const [showHint, setShowHint] = useState(false);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const timer = useRef<number | null>(null);
  const game = useMemo(() => new Chess(fen), [fen]);
  const completed = status === "win";
  const result: GameResult = describeGameResult(game);

  useEffect(() => {
    document.title = `${lesson.title[copy]} — Call of Chess`;
    return () => { document.title = "Call of Chess — Apprendre les échecs simplement"; };
  }, [copy, lesson.title]);

  useEffect(() => () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
  }, []);

  useEffect(() => {
    if (!completed) return;
    let active = true;
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user || !active) return;
      const { data: previous } = await supabase.from("lesson_progress").select("completed").eq("user_id", user.id).eq("lesson_id", PUBLIC_LESSON_ID_BY_KEY["6"]).maybeSingle();
      if (shouldAnnounceFirstCompletion(Boolean(previous?.completed), true)) storeFirstCompletionNotice(localStorage, user.id, PUBLIC_LESSON_ID_BY_KEY["6"]);
      await supabase.from("lesson_progress").upsert({
        user_id: user.id,
        lesson_id: PUBLIC_LESSON_ID_BY_KEY["6"],
        completed_steps: 1,
        current_fen: fen,
        move_history: history,
        completed: true,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id,lesson_id" });
    }).catch(() => undefined);
    return () => { active = false; };
  }, [completed, fen, history]);

  const reset = () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = null;
    setFen(startingFen);
    setHistory([]);
    setStatus("playing");
    setShowHint(false);
    setSelectedSquare(null);
  };

  const finishAfterMove = (nextGame: Chess, nextHistory: string[], side: "white" | "black") => {
    const nextResult = describeGameResult(nextGame);
    setFen(nextGame.fen());
    setHistory(nextHistory);
    if (nextResult === "checkmate") setStatus(side === "white" ? "win" : "loss");
    else if (nextResult !== "playing") setStatus("draw");
  };

  const playComputerReply = (afterWhite: Chess, nextHistory: string[]) => {
    setStatus("thinking");
    timer.current = window.setTimeout(() => {
      const replyGame = new Chess(afterWhite.fen());
      const reply = chooseBeginnerMove(replyGame);
      if (!reply) {
        finishAfterMove(replyGame, nextHistory, "white");
        timer.current = null;
        return;
      }
      replyGame.move({ from: reply.from, to: reply.to, promotion: reply.promotion });
      finishAfterMove(replyGame, [...nextHistory, reply.san], "black");
      if (describeGameResult(replyGame) === "playing") setStatus("playing");
      timer.current = null;
    }, 420);
  };

  const handlePieceDrop = (sourceSquare: string, targetSquare: string | null) => {
    if (!targetSquare || status !== "playing" || game.turn() !== "w") return false;
    const humanMove = createHumanMove(fen, sourceSquare, targetSquare);
    if (!humanMove) return false;
    try {
      const nextGame = humanMove.game;
      const nextHistory = [...history, humanMove.san];
      setSelectedSquare(null);
      const nextResult = describeGameResult(nextGame);
      if (nextResult === "checkmate") {
        finishAfterMove(nextGame, nextHistory, "white");
      } else if (nextResult !== "playing") {
        finishAfterMove(nextGame, nextHistory, "white");
      } else {
        setFen(nextGame.fen());
        setHistory(nextHistory);
        playComputerReply(nextGame, nextHistory);
      }
      return true;
    } catch {
      return false;
    }
  };

  const handleSquareClick = (square: string) => {
    if (status !== "playing" || game.turn() !== "w") return;
    const piece = game.get(square as Square);
    if (!selectedSquare) {
      if (piece?.color === "w") setSelectedSquare(square);
      return;
    }
    if (piece?.color === "w") {
      setSelectedSquare(square);
      return;
    }
    handlePieceDrop(selectedSquare, square);
  };

  const squareStyles = selectedSquare ? { [selectedSquare]: { boxShadow: "inset 0 0 0 4px #d69024" } } : {};
  const statusTitle = status === "win" ? t("computerWin") : status === "draw" ? t("computerDraw") : status === "loss" ? t("computerLoss") : status === "thinking" ? t("computerThinking") : t("yourTurn");
  const statusText = status === "win" ? t("computerWinText") : status === "draw" ? t("computerDrawText") : status === "loss" ? t("computerLossText") : showHint ? t("computerHintText") : status === "thinking" ? t("computerThinking") : t("dragHint");

  return <div className="min-h-screen bg-[#f7f0df] text-[#203830]"><header className="paper-texture border-b border-[#c9bb96]"><div className="mx-auto flex min-h-[76px] max-w-[1440px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-12"><Link href="/path" className="inline-flex items-center gap-3 text-[#173e37]" aria-label={t("back")}><span className="grid h-10 w-10 place-items-center rounded-full border border-[#d69024] bg-[#173e37] text-xl text-[#e7ba61]" aria-hidden="true">♞</span><span className="display-font text-[1.35rem]">Call of Chess</span></Link><div className="flex items-center gap-3"><span className="hidden text-[.65rem] font-extrabold uppercase tracking-[.12em] text-[#756c58] sm:inline">{t("computerOpponent")} · ≈ {BEGINNER_COMPUTER_ELO} Elo · 06 / 06</span><button type="button" onClick={toggleLanguage} className="min-h-11 border border-[#b8aa86] px-3 py-2 text-[.6rem] font-extrabold uppercase tracking-[.12em] text-[#173e37]" aria-label={t("language")}>{language === "fr" ? "EN" : "FR"}</button></div></div></header><main className="mx-auto max-w-[1440px] px-5 pb-20 pt-10 sm:px-8 lg:px-12 lg:pt-14"><div className="mb-9 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end"><div><p className="eyebrow">{lesson.kicker[copy]}</p><h1 className="display-font mt-4 max-w-[16ch] text-5xl leading-[.9] tracking-[-.05em] text-[#173e37] sm:text-7xl">{lesson.headline[copy]}</h1><p className="mt-5 max-w-2xl text-sm leading-7 text-[#625d50]">{lesson.objective[copy]}</p></div><div className="border-l border-[#c7b88f] pl-5"><div className="flex items-center gap-2 text-[.62rem] font-extrabold uppercase tracking-[.14em] text-[#776e58]"><Trophy size={15} className="text-[#d69024]" /> {t("levelOneLocked")}</div><div className="mt-3 h-1.5 w-52 bg-[#ddd1b2]"><div className={`h-full bg-[#d69024] transition-all ${completed ? "w-full" : "w-1/2"}`} /></div></div></div>
<section className="grid gap-8 xl:grid-cols-[minmax(0,1.2fr)_390px] xl:gap-12"><div className="border border-[#bdae83] bg-[#173e37] p-3 shadow-[15px_18px_0_rgba(42,50,41,.12)] sm:p-5"><div className="mb-4 flex items-center justify-between text-[#fffaf0]"><div><p className="text-[.6rem] font-extrabold uppercase tracking-[.16em] text-[#e7ba61]">{t("computerOpponent")}</p><p className="display-font mt-1 text-2xl">{statusTitle}</p></div><span className={`grid h-10 w-10 place-items-center border ${completed ? "border-[#d69024] text-[#e7ba61]" : "border-[#759287] text-[#d9e0d6]"}`} aria-hidden="true">{completed ? <Trophy size={18} /> : <CircleHelp size={18} />}</span></div><div className="mx-auto w-full max-w-[680px] bg-[#153d36] p-2 sm:p-3"><Chessboard options={{ id: "level-zero-computer", position: fen, boardOrientation: "white", showNotation: true, allowDragging: status === "playing", squareStyles, darkSquareStyle: { backgroundColor: "#3a6658" }, lightSquareStyle: { backgroundColor: "#f0dfb9" }, onPieceDrop: ({ sourceSquare, targetSquare }) => handlePieceDrop(sourceSquare, targetSquare), onPieceClick: ({ square, piece }) => { if (piece?.pieceType.startsWith("w") && square && status === "playing" && game.turn() === "w") setSelectedSquare(square); }, onSquareClick: ({ square }) => handleSquareClick(square), canDragPiece: ({ piece }) => piece.pieceType.startsWith("w") && status === "playing" }} /></div><div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#66857c] pt-4 text-xs text-[#d9e0d6]"><span>{status === "thinking" ? t("computerThinking") : status === "playing" ? t("yourTurn") : statusTitle}</span><button type="button" onClick={reset} className="inline-flex min-h-11 items-center gap-2 border border-[#66857c] px-3 text-[.66rem] font-extrabold uppercase tracking-[.1em] text-[#fffaf0] hover:bg-[#284d43]"><RotateCcw size={14} /> {t("playAgain")}</button></div></div><aside className="space-y-4"><section className={`border p-5 sm:p-7 ${status === "win" ? "border-[#6f977c] bg-[#e9f0e6]" : status === "loss" ? "border-[#c96442] bg-[#fff0e7]" : status === "draw" ? "border-[#cbbd99] bg-[#f5ecd8]" : "border-[#cbbd99] bg-[#fffaf0]"}`} aria-live="polite"><div className="flex gap-3"><div className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full ${status === "win" ? "bg-[#d69024] text-[#173e37]" : status === "loss" ? "bg-[#c96442] text-white" : "bg-[#d69024] text-[#173e37]"}`}>{status === "win" ? <Check size={16} strokeWidth={3} /> : status === "loss" ? <CircleHelp size={15} /> : <Lightbulb size={15} />}</div><div><p className="text-[.68rem] font-extrabold uppercase tracking-[.12em] text-[#756c58]">{status === "playing" ? t("computerHint") : statusTitle}</p><p className="mt-2 text-sm leading-6 text-[#4e5146]">{statusText}</p></div></div>{status === "playing" && <button type="button" onClick={() => setShowHint((value) => !value)} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 border border-[#bcae88] px-4 text-[.67rem] font-extrabold uppercase tracking-[.1em] text-[#173e37] hover:bg-[#efe4cb]"><Lightbulb size={15} /> {showHint ? t("hideHint") : t("hint")}</button>}</section>{status === "win" ? <section className="border border-[#6f977c] bg-[#e9f0e6] p-5"><p className="text-[.68rem] font-extrabold uppercase tracking-[.12em] text-[#467a5d]">{t("levelOneUnlocked")}</p><p className="mt-3 text-sm leading-6 text-[#4e5146]">{t("computerWinText")}</p><Link href="/path" className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 bg-[#d69024] px-4 text-[.67rem] font-extrabold uppercase tracking-[.1em] text-[#173e37] hover:bg-[#e7ba61]"><Trophy size={15} /> {t("path")}</Link></section> : <section className="border border-[#cbbd99] bg-[#ece0c1] p-5"><p className="eyebrow">{t("moveSheet")}</p><div className="mt-3 max-h-64 overflow-auto font-mono text-sm leading-7 text-[#28483f]">{history.length ? history.map((move, index) => <span key={`${move}-${index}`} className="mr-3 inline-block">{move}</span>) : <span className="text-[#867c64]">{t("waitingMove")}</span>}</div></section>}</aside></section><div className="mt-10 flex items-center justify-between border-t border-[#cbbd99] pt-6"><Link href="/path" className="inline-flex min-h-11 items-center gap-2 text-[.67rem] font-extrabold uppercase tracking-[.1em] text-[#173e37] hover:text-[#a87416]"><ArrowLeft size={15} /> {t("back")}</Link><button type="button" onClick={reset} className="inline-flex min-h-11 items-center gap-2 border border-[#bcae88] px-4 text-[.67rem] font-extrabold uppercase tracking-[.1em] text-[#173e37] hover:bg-[#efe4cb]"><RotateCcw size={15} /> {t("playAgain")}</button></div></main></div>;
}
