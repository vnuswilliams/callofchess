import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowUpRight, BarChart3, BookOpen, CheckCircle2, ChevronRight, LockKeyhole, Target, Trophy } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
import { isLevelUnlocked, learningPath, type PathLevel } from "@/lib/learningPath";
import { computeProfileStats } from "@/lib/profileStats";
import { consumeFirstCompletionNotice, getLessonListState, LEARNING_PATH_PROGRESS_UPDATED_EVENT, normalizeProgressLessonIds } from "@/lib/learningPathProgress";
import { getCompletedLevelIds, getLevelCompletion, playableLessonIdForExercise } from "@/lib/learningPathCompletion";
import { getLevelLessonDestination } from "@/lib/learningPathNavigation";

type ProgressRow = { lesson_id: string; completed: boolean; completed_steps: number };

function pathLessonTitle(lessonId: string, language: "fr" | "en", fallback: string) {
  const href = `/lesson/${lessonId}`;
  for (const level of learningPath) {
    const exercise = level.exercises.find((item) => playableLessonIdForExercise[item.id] && `/lesson/${playableLessonIdForExercise[item.id]}` === href);
    if (exercise) return exercise[language].title;
  }
  return fallback;
}

function ProgressStatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return <div className="bg-[#fffaf0] p-5"><div className="flex items-center justify-between text-[#a87416]"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#f0dfb9]">{icon}</span><span className="font-mono text-3xl font-bold text-[#173e37]">{value}</span></div><p className="mt-4 text-[.65rem] font-extrabold uppercase tracking-[.12em] text-[#756c58]">{label}</p></div>;
}

function LevelCard({ level, language, completedLessons, completedLevels, t }: { level: PathLevel; language: "fr" | "en"; completedLessons: Set<string>; completedLevels: Set<string>; t: (key: string) => string }) {
  const copy = level[language];
  const unlocked = isLevelUnlocked(level, completedLevels);
  const completed = getLevelCompletion(level, completedLessons);
  const progress = Math.round((completed / level.exercises.length) * 100);
  const lessonLink = getLevelLessonDestination(
    level.exercises.map((item) => playableLessonIdForExercise[item.id]),
    completedLessons,
  );

  return (
    <Card className={`relative overflow-hidden rounded-xl p-0 transition-all ${unlocked ? "border-[#cbbd99] bg-[#fffaf0] hover:-translate-y-1 hover:border-[#d69024]" : "border-[#d7ccb0] bg-[#eee8d8]/70"}`}>
      <CardHeader className="flex items-start justify-between gap-4 p-6 sm:p-8">
        <div>
          <span className={`font-mono text-xs font-bold ${unlocked ? "text-[#d69024]" : "text-[#8d846f]"}`}>{String(level.id).padStart(2, "0")} / 17</span>
          <h2 className={`display-font mt-5 text-3xl leading-none sm:text-4xl ${unlocked ? "text-[#173e37]" : "text-[#756c58]"}`}>{copy.title}</h2>
          {completed === level.exercises.length && <span className="mt-4 inline-flex items-center gap-1.5 text-[.62rem] font-extrabold uppercase tracking-[.11em] text-[#467a5d]" role="status"><CheckCircle2 size={14} aria-hidden="true" />{t("completed")}</span>}
        </div>
        <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${unlocked ? "bg-[#f0dfb9] text-[#a87416]" : "bg-[#ddd4bc] text-[#8d846f]"}`} aria-hidden="true">
          {unlocked ? <Target size={19} /> : <LockKeyhole size={18} />}
        </span>
      </CardHeader>
      <CardContent className="px-6 pb-6 sm:px-8 sm:pb-8"><p className="min-h-14 max-w-xl text-sm leading-6 text-[#625d50]">{copy.summary}</p>
      <div className="mt-6 flex flex-wrap gap-3 text-[.62rem] font-extrabold uppercase tracking-[.11em] text-[#756d58]"><span>{level.estimatedLessons} {t("inline_0267eca77d")}</span><span>·</span><span>{level.exercises.length} {t("inline_98db2654a4")}</span></div>
      <div className="mt-5"><div className="flex justify-between text-xs font-semibold text-[#756d58]"><span>{unlocked ? (t("inline_6bf5cf2ca7")) : (t("inline_bc79ae712e"))}</span><span>{completed}/{level.exercises.length}</span></div><Progress value={unlocked ? progress : 0} className="mt-2 h-2 bg-[#e5ddc8] [&>div]:bg-[#d69024]" /></div>
      <div className="mt-6 border-l-2 border-[#d69024] pl-4"><p className="text-[.62rem] font-extrabold uppercase tracking-[.12em] text-[#9a6b18]">{t("inline_da93e527c1")}</p><p className="mt-1 text-sm font-semibold leading-5 text-[#3c4c43]">{copy.milestone}</p></div>
      <div className="mt-7 space-y-2">
        {level.exercises.map((item) => { const itemCopy = item[language]; const playableLessonId = playableLessonIdForExercise[item.id]; const playableHref = playableLessonId ? `/lesson/${playableLessonId}` : null; const lessonState = playableLessonId ? getLessonListState(completedLessons, playableLessonId) : "available"; return <div key={item.id} className="flex items-start justify-between gap-3 border-t border-[#e2d8be] pt-3"><div className="flex min-w-0 items-start gap-3"><span className={`mt-0.5 shrink-0 ${lessonState === "completed" ? "text-[#467a5d]" : "text-[#a87416]"}`} aria-hidden="true">{lessonState === "completed" ? <CheckCircle2 size={15} /> : <ChevronRight size={15} />}</span><div><p className="text-sm font-bold text-[#173e37]">{itemCopy.title}</p><p className="mt-1 text-xs leading-5 text-[#756c58]">{itemCopy.goal}</p></div></div>{playableHref && unlocked ? <div className="flex shrink-0 flex-col items-end gap-1.5"><span className={`text-[.6rem] font-extrabold uppercase tracking-[.1em] ${lessonState === "completed" ? "text-[#467a5d]" : "text-[#987019]"}`} role={lessonState === "completed" ? "status" : undefined}>{lessonState === "completed" ? t("inline_81f35c251c") : t("inline_b6adb83e63")}</span><Link href={playableHref} className="text-[.62rem] font-extrabold uppercase tracking-[.1em] text-[#987019] underline decoration-[#d69024] underline-offset-4">{lessonState === "completed" ? t("inline_3943304b7d") : t("inline_b6adb83e63")}</Link></div> : null}</div>; })}
      </div>
      {lessonLink && unlocked ? <Link href={lessonLink} className="button-ink mt-7 inline-flex !min-h-10 !px-4">{t("inline_2f76b760cc")}<ArrowUpRight size={15} /></Link> : !unlocked ? <p className="mt-7 flex items-center gap-2 text-xs font-bold text-[#8d846f]"><LockKeyhole size={14} />{language === "fr" ? `Terminez le niveau ${level.prerequisite} pour continuer.` : `Complete level ${level.prerequisite} to continue.`}</p> : <p className="mt-7 flex items-center gap-2 text-xs font-bold text-[#756c58]"><BookOpen size={14} />{t("pathLevelComingSoon")}</p>}
      </CardContent>
    </Card>
  );
}

export default function Path() {
  const { language, toggleLanguage, t } = useLanguage();
  const fr = language === "fr";
  const [rows, setRows] = useState<ProgressRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [completionNotice, setCompletionNotice] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let requestId = 0;
    async function load() {
      const currentRequestId = ++requestId;
      if (currentRequestId > 1) setLoading(true);
      const { data: auth } = await supabase.auth.getUser();
      if (!active || currentRequestId !== requestId) return;
      setSignedIn(Boolean(auth.user));
      if (!auth.user) { setRows([]); setLoading(false); return; }
      const { data } = await supabase.from("lesson_progress").select("lesson_id, completed, completed_steps").eq("user_id", auth.user.id).limit(100);
      if (!active || currentRequestId !== requestId) return;
      setRows(normalizeProgressLessonIds((data ?? []) as ProgressRow[]));
      const notice = consumeFirstCompletionNotice(localStorage, auth.user.id);
      if (notice) setCompletionNotice(notice);
      setLoading(false);
    }
    const refreshProgress = () => { void load().catch(() => { if (active) setLoading(false); }); };
    void load().catch(() => { if (active) setLoading(false); });
    window.addEventListener(LEARNING_PATH_PROGRESS_UPDATED_EVENT, refreshProgress);
    return () => {
      active = false;
      window.removeEventListener(LEARNING_PATH_PROGRESS_UPDATED_EVENT, refreshProgress);
    };
  }, []);

  const stats = useMemo(() => computeProfileStats(rows), [rows]);
  const completedLessons = useMemo(() => new Set(rows.filter((row) => row.completed).map((row) => row.lesson_id)), [rows]);
  const completedLevels = useMemo(() => getCompletedLevelIds(learningPath, completedLessons), [completedLessons]);
  const unlockedCount = useMemo(() => learningPath.filter((level) => isLevelUnlocked(level, completedLevels)).length, [completedLevels]);

  useEffect(() => {
    const title = t("inline_5026e76f67");
    const description = t("inline_e6416b873e");
    document.title = `${title} — Call of Chess`;
    const tags = [{ name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }];
    const previous = tags.map((tag) => { const selector = tag.name ? `meta[name="${tag.name}"]` : `meta[property="${tag.property}"]`; const element = document.querySelector(selector) as HTMLMetaElement | null; return { element, content: element?.content }; });
    tags.forEach((tag) => { const selector = tag.name ? `meta[name="${tag.name}"]` : `meta[property="${tag.property}"]`; const element = document.querySelector(selector) as HTMLMetaElement | null; if (element) element.content = tag.content; });
    return () => { document.title = "Call of Chess — Apprendre les échecs simplement"; previous.forEach(({ element, content }) => { if (element && content !== undefined) element.content = content; }); };
  }, [fr]);

  return <main className="page-shell path-shell min-h-screen bg-[#f7f0df] px-5 py-10 text-[#173e37] sm:px-8 lg:px-12"><div className="mx-auto max-w-6xl"><div className="flex items-center justify-between"><Link href="/" className="inline-flex items-center gap-2 text-[.7rem] font-extrabold uppercase tracking-[.14em] text-[#987019]"><ArrowLeft size={15} />{t("inline_fa503a5668")}</Link><button type="button" onClick={toggleLanguage} className="border border-[#cbbd99] px-3 py-2 text-[.68rem] font-extrabold uppercase tracking-[.12em] hover:border-[#a87416]" aria-label={t("inline_e0aa42db72")}>{t("inline_43d5c6585d")}</button></div><header className="mt-14 max-w-4xl"><p className="eyebrow">{t("inline_0209d32c54")}</p><h1 className="display-font mt-4 text-6xl leading-[.88] sm:text-8xl">{t("inline_c466d21aa6")}</h1><p className="mt-6 max-w-2xl text-base leading-8 text-[#625d50]">{t("inline_5990220220")}</p></header><section className="mt-10 grid gap-px border border-[#cbbd99] bg-[#cbbd99] sm:grid-cols-3"><div className="bg-[#fffaf0] p-5"><Trophy className="text-[#a87416]" size={18} /><p className="mt-4 font-mono text-3xl font-bold">18</p><p className="mt-2 text-[.65rem] font-extrabold uppercase tracking-[.12em] text-[#756c58]">{t("inline_3f50f56a9d")}</p></div><div className="bg-[#fffaf0] p-5"><BookOpen className="text-[#a87416]" size={18} /><p className="mt-4 font-mono text-3xl font-bold">{learningPath.reduce((total, level) => total + level.exercises.length, 0)}</p><p className="mt-2 text-[.65rem] font-extrabold uppercase tracking-[.12em] text-[#756c58]">{t("inline_5df6582ce4")}</p></div><div className="bg-[#fffaf0] p-5"><CheckCircle2 className="text-[#a87416]" size={18} /><p className="mt-4 font-mono text-3xl font-bold">{loading ? "—" : `${unlockedCount}/18`}</p><p className="mt-2 text-[.65rem] font-extrabold uppercase tracking-[.12em] text-[#756c58]">{t("inline_b00728a93d")}</p></div></section>{completionNotice && <div className="badge-pop-in fixed inset-x-4 top-5 z-50 mx-auto flex max-w-xl items-center gap-4 border border-[#d69024] bg-[#173e37] p-4 text-[#fffaf0] shadow-2xl" role="status" aria-live="polite"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#d69024] text-[#173e37]" aria-hidden="true"><Trophy size={24} /></span><div className="min-w-0 flex-1"><p className="text-[.62rem] font-extrabold uppercase tracking-[.16em] text-[#e6b95e]">{t("inline_fa980b8520")}</p><p className="display-font mt-1 truncate text-2xl">{pathLessonTitle(completionNotice, language, t("inline_81f35c251c"))}</p><p className="mt-1 text-sm text-[#d9e0d6]">{t("inline_81f35c251c")}</p></div><button type="button" onClick={() => setCompletionNotice(null)} className="grid h-9 w-9 shrink-0 place-items-center border border-[#66857c] text-xl hover:bg-[#285448]" aria-label={t("inline_394171e9c7")}>×</button></div>}{signedIn && !loading && <section className="rise-in mt-8" aria-labelledby="path-progress-summary"><div className="flex items-end justify-between gap-4"><div><p className="eyebrow">{t("inline_34fcc3d690")}</p><h2 id="path-progress-summary" className="display-font mt-3 text-4xl">{t("inline_1655158e41")}</h2></div><BarChart3 className="mb-1 text-[#a87416]" size={22} aria-hidden="true" /></div><div className="mt-5 grid gap-px border border-[#cbbd99] bg-[#cbbd99] sm:grid-cols-2 lg:grid-cols-4"><ProgressStatCard icon={<Trophy size={17} />} label={t("inline_f1f9dcdf85")} value={stats.completed} /><ProgressStatCard icon={<BookOpen size={17} />} label={t("inline_6eb0fd671a")} value={stats.activeLessons} /><ProgressStatCard icon={<CheckCircle2 size={17} />} label={t("inline_cc03e7fb11")} value={stats.totalSteps} /><ProgressStatCard icon={<Target size={17} />} label={t("inline_056354528c")} value={`${stats.completionRate}%`} /></div></section>}{!signedIn && !loading && <p className="mt-5 text-sm text-[#756c58]">{t("inline_96ad6ff41d")} <Link href="/account" className="font-bold text-[#987019] underline">{t("inline_b1b675116c")}</Link></p>}<section className="mt-12 space-y-5" aria-label={t("inline_ba27f65ddd")}>{learningPath.map((level) => <LevelCard key={level.id} level={level} language={language} completedLessons={completedLessons} completedLevels={completedLevels} t={t} />)}</section></div></main>;
}
