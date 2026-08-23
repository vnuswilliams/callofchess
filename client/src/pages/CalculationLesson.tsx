import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, CircleHelp, Crown, Eye, Lightbulb, RotateCcw, Target, Trophy } from "lucide-react";
import { Chessboard } from "react-chessboard";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
import { PUBLIC_LESSON_ID_BY_KEY, toLessonKey } from "@/lib/lessonIds";
import { calculationLessonCatalog, getCalculationProgress, getCalculationStepState, type CalculationAnswer, type CalculationLesson } from "@/lib/calculationLessons";
import { announceLearningPathProgressUpdated, mergeLessonProgress, type LearningPathProgressRow } from "@/lib/learningPathProgress";

function BrandMark() {
  return <div className="grid h-10 w-10 place-items-center rounded-full border border-[#d69024] bg-[#173e37] text-[#e7ba61]" aria-hidden="true"><Crown size={18} strokeWidth={1.8} /></div>;
}

function languageCopy<T extends { fr: string; en: string }>(value: T, language: "fr" | "en") {
  return value[language];
}

function answerLabel(answer: CalculationAnswer, language: "fr" | "en") {
  return languageCopy(answer.label, language);
}

function CalculationContent({ lesson }: { lesson: CalculationLesson }) {
  const { id } = useParams<{ id: string }>();
  const { language, toggleLanguage, t } = useLanguage();
  const lessonKey = toLessonKey(id) ?? "13";
  const lessonId = PUBLIC_LESSON_ID_BY_KEY[lessonKey];
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [showHint, setShowHint] = useState(false);
  const [restoring, setRestoring] = useState(true);
  const [savedProgress, setSavedProgress] = useState<LearningPathProgressRow | null>(null);
  const [saveError, setSaveError] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const exercise = lesson.exercises[exerciseIndex];
  const state = getCalculationStepState(exercise.answers, selectedAnswer);
  const completed = completedIds.size === lesson.exercises.length;
  const progress = getCalculationProgress(completedIds.size, lesson.exercises.length, completed);
  const copy = language === "fr" ? "fr" : "en";

  useEffect(() => {
    let active = true;
    setRestoring(true);
    setSelectedAnswer(null);
    setShowHint(false);
    setExerciseIndex(0);
    setCompletedIds(new Set());
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!active) return;
      setSignedIn(Boolean(user));
      if (!user || !lessonId) {
        setRestoring(false);
        return;
      }
      const { data } = await supabase.from("lesson_progress").select("lesson_id, completed_steps, completed, current_fen, move_history, updated_at").eq("user_id", user.id).eq("lesson_id", lessonId).limit(1);
      if (!active) return;
      const row = (data?.[0] as LearningPathProgressRow | undefined) ?? null;
      setSavedProgress(row);
      const completedCount = Math.min(lesson.exercises.length, Math.max(0, row?.completed_steps ?? 0));
      setCompletedIds(new Set(lesson.exercises.slice(0, completedCount).map((item) => item.id)));
      setExerciseIndex(Math.min(Math.max(completedCount, 0), Math.max(lesson.exercises.length - 1, 0)));
      setRestoring(false);
    }).catch(() => { if (active) { setRestoring(false); setSaveError(true); } });
    return () => { active = false; };
  }, [lesson.exercises, lessonId]);

  useEffect(() => {
    document.title = `${languageCopy(lesson.title, language)} — Call of Chess`;
    return () => { document.title = "Call of Chess — Apprendre les échecs simplement"; };
  }, [language, lesson.title]);

  const activeCompleted = completedIds.has(exercise.id);
  const history = useMemo(() => Array.from(completedIds).map((exerciseId, index) => {
    const item = lesson.exercises.find((candidate) => candidate.id === exerciseId);
    return item ? `${index + 1}. ${languageCopy(item.title, copy)}` : null;
  }).filter((item): item is string => Boolean(item)), [completedIds, copy, lesson.exercises]);

  const persist = async (nextIds: Set<string>) => {
    if (!signedIn || !lessonId) return;
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return;
    const isComplete = nextIds.size === lesson.exercises.length;
    const nextHistory = lesson.exercises.filter((item) => nextIds.has(item.id)).map((item, index) => `${index + 1}. ${languageCopy(item.title, copy)}`);
    const progressRow = mergeLessonProgress(savedProgress, {
      lesson_id: lessonId,
      completed_steps: nextIds.size,
      completed: isComplete,
    });
    setSavedProgress(progressRow);
    const { error } = await supabase.from("lesson_progress").upsert({
      user_id: auth.user.id,
      lesson_id: lessonId,
      completed_steps: progressRow.completed_steps,
      current_fen: exercise.fen,
      move_history: nextHistory,
      completed: progressRow.completed,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id,lesson_id" });
    if (error) setSaveError(true);
    else announceLearningPathProgressUpdated();
  };

  const selectAnswer = (answerId: string) => {
    if (restoring || activeCompleted) return;
    setSelectedAnswer(answerId);
    setShowHint(false);
    const selected = exercise.answers.find((item) => item.id === answerId);
    if (!selected?.correct) return;
    const nextIds = new Set(completedIds).add(exercise.id);
    setCompletedIds(nextIds);
    void persist(nextIds);
  };

  const nextExercise = () => {
    setSelectedAnswer(null);
    setShowHint(false);
    setExerciseIndex((current) => Math.min(current + 1, lesson.exercises.length - 1));
  };

  const resetLesson = () => {
    setSelectedAnswer(null);
    setShowHint(false);
    setExerciseIndex(0);
    setCompletedIds(new Set());
    setSaveError(false);
  };

  const feedbackTitle = state === "correct" || activeCompleted ? t("common.calculation.correct") : state === "wrong" ? t("common.calculation.wrong") : t("common.calculation.exercise");
  const feedbackText = state === "correct" || activeCompleted ? t("common.calculation.correctText") : state === "wrong" ? t("common.calculation.wrongText") : languageCopy(exercise.opponentQuestion, copy);

  return <div className="min-h-screen bg-[#f7f0df] text-[#203830]">
    <header className="paper-texture border-b border-[#c9bb96]">
      <div className="mx-auto flex min-h-[76px] max-w-[1440px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
        <a href="/path" className="flex items-center gap-3" aria-label={t("back")}><BrandMark /><div className="leading-none"><span className="display-font block text-[1.45rem] tracking-[-.04em]">Call of Chess</span><span className="block pt-1 text-[.58rem] font-extrabold uppercase tracking-[.16em] text-[#766d57]">{t("common.calculation.method")}</span></div></a>
        <div className="hidden items-center gap-3 sm:flex"><span className="font-mono text-[.64rem] font-bold tracking-[.1em] text-[#9a6b18]">{t("lesson").toUpperCase()} {lesson.number} / 07</span><span className="h-px w-10 bg-[#c5b58f]" /><span className="text-xs font-bold uppercase tracking-[.12em] text-[#59655e]">{languageCopy(lesson.title, language)}</span></div>
        <button type="button" onClick={toggleLanguage} className="min-h-11 border border-[#b8aa86] px-3 py-2 text-[.6rem] font-extrabold uppercase tracking-[.12em] text-[#173e37] transition-colors hover:border-[#d69024] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d69024]" aria-label={`${t("language")}: ${language === "fr" ? t("english") : t("french")}`}><span aria-hidden="true">{language === "fr" ? "EN" : "FR"}</span><span className="sr-only">{language === "fr" ? t("english") : t("french")}</span></button>
      </div>
    </header>
    <main className="mx-auto max-w-[1440px] px-5 pb-20 pt-10 sm:px-8 lg:px-12 lg:pt-14">
      <div className="mb-9 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end"><div><a href="/path" className="inline-flex min-h-11 items-center gap-2 text-[.68rem] font-extrabold uppercase tracking-[.12em] text-[#987019]"><ArrowLeft size={15} aria-hidden="true" />{t("back")}</a><div className="mt-6 flex items-center gap-3"><span className="h-px w-9 bg-[#d69024]" /><p className="eyebrow">{languageCopy(lesson.kicker, language)}</p></div><h1 className="display-font mt-4 max-w-[18ch] text-5xl leading-[.9] tracking-[-.05em] text-[#173e37] sm:text-6xl">{languageCopy(lesson.headline, language)}</h1><p className="mt-5 max-w-2xl text-base leading-7 text-[#625d50]">{languageCopy(lesson.objective, language)}</p></div><div className="min-w-[245px] border-l border-[#c7b88f] pl-5"><div className="flex items-center justify-between text-[.62rem] font-extrabold uppercase tracking-[.14em] text-[#776e58]"><span>{t("progress")}</span><span>{completed ? t("completed") : `${completedIds.size} / ${lesson.exercises.length}`}</span></div><div className="mt-3 h-1.5 bg-[#ddd1b2]"><div className="h-full bg-[#d69024] transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${progress}%` }} /></div></div></div>
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.23fr)_390px] xl:gap-12">
        <section className="relative overflow-hidden border border-[#bdae83] bg-[#173e37] p-3 shadow-[15px_18px_0_rgba(42,50,41,.12)] sm:p-5" aria-labelledby="calculation-board-title"><div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 checker-line opacity-90" /><div className="mb-4 flex items-center justify-between px-1 text-[#fffaf0]"><div><p className="text-[.6rem] font-extrabold uppercase tracking-[.16em] text-[#e7ba61]">{t("common.calculation.position")}</p><h2 id="calculation-board-title" className="display-font mt-1 text-2xl">{t("common.calculation.visualPosition")}</h2></div><div className="grid h-10 w-10 place-items-center border border-[#759287] text-[#e7ba61]" aria-hidden="true"><Eye size={17} /></div></div><div className="mx-auto w-full max-w-[680px] bg-[#153d36] p-2 sm:p-3"><Chessboard options={{ id: `calculation-${lesson.key}`, position: exercise.fen, boardOrientation: "white", showNotation: true, allowDragging: false, allowDrawingArrows: false, darkSquareStyle: { backgroundColor: "#3a6658" }, lightSquareStyle: { backgroundColor: "#f0dfb9" } }} /></div><div className="mt-4 grid grid-cols-2 gap-2 border-t border-[#66857c] pt-4 text-[#d9e0d6] sm:grid-cols-4"><div><span className="block text-[.58rem] font-extrabold uppercase tracking-[.12em] text-[#9cb4a9]">{t("common.calculation.exercise")}</span><strong className="mt-1 block font-mono text-sm text-[#fffaf0]">{String(exerciseIndex + 1).padStart(2, "0")} / {String(lesson.exercises.length).padStart(2, "0")}</strong></div><div><span className="block text-[.58rem] font-extrabold uppercase tracking-[.12em] text-[#9cb4a9]">{t("common.calculation.sideToMove")}</span><strong className="mt-1 block font-mono text-sm text-[#fffaf0]">{languageCopy(exercise.fen.split(" ")[1] === "w" ? { fr: "Blancs", en: "White" } : { fr: "Noirs", en: "Black" }, language)}</strong></div><div><span className="block text-[.58rem] font-extrabold uppercase tracking-[.12em] text-[#9cb4a9]">{t("depth")}</span><strong className="mt-1 block font-mono text-sm text-[#fffaf0]">{exercise.depth} ply</strong></div><div><span className="block text-[.58rem] font-extrabold uppercase tracking-[.12em] text-[#9cb4a9]">{t("common.calculation.line")}</span><strong className="mt-1 block truncate font-mono text-sm text-[#fffaf0]">{exercise.solutionLine.map((item) => item.san).join(" ")}</strong></div></div><div className="mt-5 flex items-center gap-2 px-1 text-xs text-[#d9e0d6]"><span className="h-2 w-2 rounded-full bg-[#d69024]" aria-hidden="true" />{languageCopy(exercise.action === "visualize" ? { fr: "Le plateau reste fixe : calculez mentalement.", en: "The board stays still: calculate mentally." } : { fr: "Lisez la position avant de choisir.", en: "Read the position before choosing." }, language)}</div></section>
        <aside className="contents"><section className="lesson-paper border border-[#cbbd99] bg-[#fffaf0] p-4 sm:p-7"><div className="flex items-center justify-between"><span className="eyebrow">{t("common.calculation.exercise")}</span><span className="font-mono text-xs font-bold text-[#a87416]">{activeCompleted ? "✓" : `0${exerciseIndex + 1}`}</span></div><h2 className="display-font mt-4 text-3xl leading-none tracking-[-.04em] text-[#173e37] sm:mt-6 sm:text-4xl">{languageCopy(exercise.title, language)}</h2><p className="mt-4 text-sm leading-7 text-[#5f5b4e]">{languageCopy(exercise.prompt, language)}</p><div className="mt-5 space-y-2" role="group" aria-label={languageCopy(exercise.prompt, language)}>{exercise.answers.map((answer) => { const selected = selectedAnswer === answer.id; const correct = selected && answer.correct; return <button type="button" key={answer.id} onClick={() => selectAnswer(answer.id)} aria-pressed={selected} disabled={restoring || activeCompleted} className={`flex min-h-12 w-full items-start gap-3 border px-4 py-3 text-left text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d69024] ${correct ? "border-[#6f977c] bg-[#e9f0e6] text-[#28483f]" : selected ? "border-[#c96442] bg-[#fff0e7] text-[#7e3929]" : "border-[#d4c7a5] bg-[#fffaf0] text-[#28483f] hover:border-[#d69024] hover:bg-[#f7efd9]"}`}><span className="grid h-6 w-6 shrink-0 place-items-center border border-current font-mono text-xs" aria-hidden="true">{correct ? "✓" : String.fromCharCode(65 + exercise.answers.indexOf(answer))}</span><span>{answerLabel(answer, language)}</span></button>; })}</div><div className="mt-5 flex flex-wrap gap-2"><Button type="button" variant="outline" onClick={() => setShowHint((value) => !value)} disabled={restoring || activeCompleted} className="min-h-11 flex-1 rounded-[.65rem] border-[#bcae88] bg-transparent text-[.67rem] font-extrabold uppercase tracking-[.1em] text-[#173e37]"><Lightbulb size={15} aria-hidden="true" />{showHint ? t("common.calculation.hideHint") : t("common.calculation.showHint")}</Button><Button type="button" variant="outline" onClick={resetLesson} className="min-h-11 rounded-[.65rem] border-[#bcae88] bg-transparent px-3 text-[.67rem] font-extrabold uppercase tracking-[.1em] text-[#173e37]" aria-label={t("common.calculation.reset")}><RotateCcw size={15} aria-hidden="true" /></Button></div>{showHint && <div className="mt-4 border-l-2 border-[#d69024] bg-[#f5ecd8] p-4 text-sm leading-6 text-[#4e5146]" role="note"><p className="text-[.62rem] font-extrabold uppercase tracking-[.12em] text-[#9a6b18]">{t("common.calculation.principle")}</p><p className="mt-1">{languageCopy(exercise.hint, language)}</p></div>}</section><section className={`border p-5 ${state === "wrong" ? "border-[#c96442] bg-[#fff0e7]" : state === "correct" || activeCompleted ? "border-[#6f977c] bg-[#e9f0e6]" : "border-[#cbbd99] bg-[#f5ecd8]"}`} aria-live="polite"><div className="flex gap-3"><div className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full ${state === "wrong" ? "bg-[#c96442] text-white" : "bg-[#d69024] text-[#173e37]"}`} aria-hidden="true">{state === "wrong" ? <CircleHelp size={15} /> : <Check size={16} strokeWidth={3} />}</div><div><p className="text-[.65rem] font-extrabold uppercase tracking-[.13em] text-[#736954]">{feedbackTitle}</p><p className="mt-2 text-sm leading-6 text-[#4e5146]">{feedbackText}</p>{(state === "correct" || activeCompleted) && <p className="mt-3 border-t border-[#bfd0bd] pt-3 text-sm leading-6 text-[#3e614b]">{languageCopy(exercise.explanation, language)}</p>}</div></div></section>{(state === "correct" || activeCompleted) && !completed && <Button type="button" onClick={nextExercise} className="min-h-12 rounded-[.65rem] bg-[#d69024] px-5 text-[.67rem] font-extrabold uppercase tracking-[.1em] text-[#173e37] hover:bg-[#e7ba61]"><Target size={16} aria-hidden="true" />{t("common.calculation.next")}</Button>}{completed && <section className="border border-[#6f977c] bg-[#e9f0e6] p-5" role="status"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#d69024] text-[#173e37]" aria-hidden="true"><Trophy size={19} /></span><div><p className="text-[.65rem] font-extrabold uppercase tracking-[.13em] text-[#467a5d]">{t("common.calculation.complete")}</p><p className="mt-1 text-sm leading-6 text-[#3e614b]">{t("common.calculation.completeText")}</p></div></div><a href="/path" className="mt-4 inline-flex min-h-11 w-full items-center justify-center border border-[#6f977c] px-4 text-[.67rem] font-extrabold uppercase tracking-[.1em] text-[#28483f]">{t("lessons.viewPath")}</a></section>}</aside>
      </div>
      <section className="mt-10 grid gap-px border border-[#cbbd99] bg-[#cbbd99] md:grid-cols-3" aria-label={t("common.calculation.method")}><div className="bg-[#f5ecd8] p-6 md:col-span-2"><p className="eyebrow">{t("common.calculation.principle")}</p><p className="display-font mt-3 max-w-3xl text-3xl leading-tight text-[#173e37]">{languageCopy(lesson.principle, language)}</p></div><div className="bg-[#fffaf0] p-6"><p className="eyebrow">{t("common.calculation.line")}</p><div className="mt-4 min-h-20 border-l border-[#bfae83] pl-4 font-mono text-sm font-bold leading-7 text-[#28483f]">{history.length ? history.map((item) => <div key={item}>{item}</div>) : <span className="text-[#867c64]">{t("waitingMove")}</span>}</div></div></section>
      <section className="mt-10 grid gap-px border border-[#cbbd99] bg-[#cbbd99] md:grid-cols-3">{lesson.keyPoints.map((point, index) => <article key={point.title.fr} className="bg-[#fffaf0] p-6"><span className="font-mono text-xs font-bold text-[#d69024]">{String(index + 1).padStart(2, "0")} /</span><h2 className="display-font mt-5 text-3xl text-[#173e37]">{languageCopy(point.title, language)}</h2><p className="mt-3 text-sm leading-6 text-[#615d50]">{languageCopy(point.text, language)}</p></article>)}</section>
      {saveError && <p className="mt-5 text-sm font-semibold text-[#8c402e]" role="alert">{language === "fr" ? "La sauvegarde est momentanément indisponible. Votre entraînement local continue." : "Saving is temporarily unavailable. Your local practice continues."}</p>}
      {!signedIn && !restoring && <p className="mt-5 text-sm text-[#756c58]">{language === "fr" ? "Connectez-vous pour sauvegarder cette progression." : "Sign in to save this progress."} <a href="/account" className="font-bold text-[#987019] underline">{t("account")}</a></p>}
    </main>
  </div>;
}

export default function CalculationLesson() {
  const { id } = useParams<{ id: string }>();
  const lessonKey = toLessonKey(id);
  const lesson = lessonKey && calculationLessonCatalog[lessonKey] ? calculationLessonCatalog[lessonKey] : calculationLessonCatalog["35"];
  return <CalculationContent lesson={lesson} />;
}
