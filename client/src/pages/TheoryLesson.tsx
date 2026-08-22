import { useEffect, useRef, useState } from "react";
import { ArrowLeft, BookOpenCheck, Check, ChevronRight, CircleDot, Trophy } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
import { PUBLIC_LESSON_ID_BY_KEY } from "@/lib/lessonIds";
import { getFirstIncompleteLessonDestination, LESSON_SUCCESS_ANIMATION_MS } from "@/lib/lessonTransition";
import { announceLearningPathProgressUpdated, shouldAnnounceFirstCompletion, storeFirstCompletionNotice } from "@/lib/learningPathProgress";
import type { LessonDefinition } from "@/lib/levelZeroLessons";

function BrandMark() {
  return <div className="grid h-10 w-10 place-items-center rounded-full border border-[#d69024] bg-[#173e37] text-xl text-[#e7ba61]" aria-hidden="true">♞</div>;
}

export default function TheoryLesson({ lesson }: { lesson: LessonDefinition }) {
  const [, setLocation] = useLocation();
  const { language, toggleLanguage, t } = useLanguage();
  const [completed, setCompleted] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const completedLessonIdsRef = useRef<Set<string>>(new Set());
  const copy = language === "fr" ? "fr" : "en";

  useEffect(() => {
    document.title = `${lesson.title[copy]} — Call of Chess`;
    let active = true;
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user || !active) return;
      const { data } = await supabase.from("lesson_progress").select("completed").eq("user_id", user.id).eq("lesson_id", PUBLIC_LESSON_ID_BY_KEY["1"]).maybeSingle();
      if (active && data?.completed) setCompleted(true);
    }).catch(() => undefined);
    return () => { active = false; document.title = "Call of Chess — Apprendre les échecs simplement"; };
  }, [copy, lesson.title]);

  useEffect(() => {
    if (!celebrating) return;
    const timer = window.setTimeout(() => {
      const redirectToFirstIncompleteLesson = async () => {
        let completedIds = new Set(completedLessonIdsRef.current);
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data } = await supabase.from("lesson_progress").select("lesson_id, completed").eq("user_id", user.id).limit(6);
            if (data) completedIds = new Set(data.filter((row) => row.completed && typeof row.lesson_id === "string").map((row) => row.lesson_id));
          }
        } catch {
          // Keep the locally known completion set when the optional refresh is unavailable.
        }
        completedIds.add(PUBLIC_LESSON_ID_BY_KEY["1"]);
        completedLessonIdsRef.current = completedIds;
        setLocation(getFirstIncompleteLessonDestination(completedIds));
      };
      void redirectToFirstIncompleteLesson();
    }, LESSON_SUCCESS_ANIMATION_MS);
    return () => window.clearTimeout(timer);
  }, [celebrating, setLocation]);

  const completeTheory = async () => {
    setCompleted(true);
    completedLessonIdsRef.current = new Set(completedLessonIdsRef.current).add(PUBLIC_LESSON_ID_BY_KEY["1"]);
    setCelebrating(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    if (shouldAnnounceFirstCompletion(completed, true)) storeFirstCompletionNotice(localStorage, user.id, PUBLIC_LESSON_ID_BY_KEY["1"]);
    const { error } = await supabase.from("lesson_progress").upsert({
      user_id: user.id,
      lesson_id: PUBLIC_LESSON_ID_BY_KEY["1"],
      completed_steps: 1,
      current_fen: null,
      move_history: [],
      completed: true,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id,lesson_id" });
    if (!error) announceLearningPathProgressUpdated();
  };

  return (
    <div className="lesson-shell min-h-screen bg-[#f7f0df] text-[#203830]">
      {celebrating && <div className="lesson-success-overlay pointer-events-none fixed inset-0 z-50 grid place-items-center bg-[#173e37]/25 px-5" role="status" aria-live="assertive"><div className="lesson-success-card w-full max-w-sm border border-[#6f977c] bg-[#e9f0e6] p-6 text-center shadow-[12px_14px_0_rgba(42,50,41,.16)] sm:p-8"><div className="lesson-success-medallion mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#d69024] text-[#173e37]" aria-hidden="true"><Trophy size={28} /></div><p className="display-font mt-5 text-3xl leading-none tracking-[-.04em] text-[#173e37]">{t("lessonSuccessTitle")}</p><p className="mt-3 text-sm leading-6 text-[#4e5146]">{lesson.solution[copy]}</p><p className="mt-4 text-[.65rem] font-extrabold uppercase tracking-[.13em] text-[#467a5d]">{t("lessonSuccessNext")}</p></div></div>}
      <header className="paper-texture border-b border-[#c9bb96]"><div className="mx-auto flex min-h-[76px] max-w-[1440px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-12"><Link href="/" className="flex items-center gap-3" aria-label={t("back")}><BrandMark /><div className="leading-none"><span className="display-font block text-[1.45rem] tracking-[-.04em]">Call of Chess</span><span className="block pt-1 text-[.58rem] font-extrabold uppercase tracking-[.16em] text-[#766d57]">{t("theoryOnly")}</span></div></Link><div className="hidden items-center gap-3 sm:flex"><span className="font-mono text-[.64rem] font-bold tracking-[.1em] text-[#9a6b18]">{t("lesson").toUpperCase()} 01 / 06</span><span className="h-px w-10 bg-[#c5b58f]" /><span className="text-xs font-bold uppercase tracking-[.12em] text-[#59655e]">{lesson.title[copy]}</span></div><div className="flex items-center gap-3"><button type="button" onClick={toggleLanguage} className="min-h-11 border border-[#b8aa86] px-3 py-2 text-[.6rem] font-extrabold uppercase tracking-[.12em] text-[#173e37] hover:border-[#d69024]" aria-label={t("language")}>{language === "fr" ? "EN" : "FR"}</button><Link href="/path" className="hidden items-center gap-2 text-[.68rem] font-extrabold uppercase tracking-[.11em] text-[#173e37] hover:text-[#a87416] sm:inline-flex"><ArrowLeft size={16} /> {t("back")}</Link></div></div></header>

      <main className="mx-auto max-w-[1180px] px-5 pb-20 pt-10 sm:px-8 lg:px-12 lg:pt-14">
        <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end"><div><div className="flex items-center gap-3"><span className="h-px w-9 bg-[#d69024]" /><p className="eyebrow">{lesson.kicker[copy]}</p></div><h1 className="display-font mt-4 max-w-[18ch] text-5xl leading-[.9] tracking-[-.05em] text-[#173e37] sm:text-7xl">{lesson.headline[copy]}</h1><p className="mt-5 max-w-2xl text-sm leading-7 text-[#625d50]">{lesson.objective[copy]}</p></div><div className="border-l border-[#c7b88f] pl-5"><div className="flex items-center gap-2 text-[.62rem] font-extrabold uppercase tracking-[.14em] text-[#776e58]"><BookOpenCheck size={15} className="text-[#d69024]" /> {t("theoryComplete")}</div><div className="mt-3 h-1.5 w-48 bg-[#ddd1b2]"><div className={`h-full bg-[#d69024] transition-all ${completed ? "w-full" : "w-1/6"}`} /></div></div></div>

        <section className="grid gap-px border border-[#cbbd99] bg-[#cbbd99] md:grid-cols-2" aria-label={t("theoryCard")}>
          {lesson.theorySections.map((section, index) => <article key={section.title.fr} className="bg-[#fffaf0] p-6 sm:p-8"><div className="flex items-start justify-between gap-4"><span className="font-mono text-xs font-bold text-[#d69024]">{String(index + 1).padStart(2, "0")} /</span><CircleDot size={16} className="text-[#b9a87f]" aria-hidden="true" /></div><h2 className="display-font mt-6 text-3xl leading-none tracking-[-.03em] text-[#173e37] sm:text-4xl">{section.title[copy]}</h2><p className="mt-4 text-sm leading-7 text-[#5f5b4e]">{section.text[copy]}</p>{section.items && <div className="mt-6 divide-y divide-[#e2d8be] border-t border-[#e2d8be]">{section.items.map((item) => <div key={item.label.fr} className="py-4"><p className="text-[.68rem] font-extrabold uppercase tracking-[.11em] text-[#9a6b18]">{item.label[copy]}</p><p className="mt-1 text-sm leading-6 text-[#4e5146]">{item.text[copy]}</p></div>)}</div>}</article>)}
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3" aria-label={t("theoryCard")}>{lesson.keyPoints.map((point) => <div key={point.title.fr} className="border border-[#cbbd99] bg-[#ece0c1] p-5"><p className="font-mono text-xs font-bold text-[#d69024]">{point.title[copy]}</p><p className="mt-3 text-sm leading-6 text-[#4e5146]">{point.text[copy]}</p></div>)}</section>

        <div className="mt-10 flex flex-col gap-3 border-t border-[#cbbd99] pt-6 sm:flex-row sm:items-center sm:justify-between"><Link href="/path" className="inline-flex min-h-11 items-center gap-2 text-[.67rem] font-extrabold uppercase tracking-[.1em] text-[#173e37] hover:text-[#a87416]"><ArrowLeft size={15} /> {t("back")}</Link>{completed ? <Link href={`/lesson/${PUBLIC_LESSON_ID_BY_KEY["2"]}`} className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#d69024] px-5 text-[.67rem] font-extrabold uppercase tracking-[.1em] text-[#173e37] hover:bg-[#e7ba61]">{t("theoryComplete")} <ChevronRight size={15} /></Link> : <button type="button" onClick={completeTheory} className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#173e37] px-5 text-[.67rem] font-extrabold uppercase tracking-[.1em] text-[#fffaf0] hover:bg-[#285449]"><Check size={15} /> {t("theoryContinue")}</button>}</div>
      </main>
    </div>
  );
}
