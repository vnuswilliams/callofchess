import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowUpRight, BookOpen, CheckCircle2, ChevronRight, LockKeyhole, Target, Trophy } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
import { isLevelUnlocked, learningPath, type PathLevel } from "@/lib/learningPath";

type ProgressRow = { lesson_id: string; completed: boolean; completed_step: number };

const lessonIdsByLevel: Record<number, string[]> = {
  0: ["1", "2", "3"],
};

function levelCompletion(level: PathLevel, completedLessons: Set<string>) {
  const lessonIds = lessonIdsByLevel[level.id] ?? [];
  return Math.min(level.exercises.length, lessonIds.filter((id) => completedLessons.has(id)).length);
}

const playableLessonForExercise: Record<string, string> = {
  "0-center": "/lesson/1",
  "0-development": "/lesson/2",
  "0-safety": "/lesson/3",
};

function LevelCard({ level, language, completedLessons, completedLevels, t }: { level: PathLevel; language: "fr" | "en"; completedLessons: Set<string>; completedLevels: Set<string>; t: (key: string) => string }) {
  const copy = level[language];
  const unlocked = isLevelUnlocked(level, completedLevels);
  const completed = levelCompletion(level, completedLessons);
  const progress = Math.round((completed / level.exercises.length) * 100);
  const lessonLink = level.id === 0 ? "/lesson/1" : null;

  return (
    <Card className={`relative overflow-hidden rounded-xl p-0 transition-all ${unlocked ? "border-[#cbbd99] bg-[#fffaf0] hover:-translate-y-1 hover:border-[#d69024]" : "border-[#d7ccb0] bg-[#eee8d8]/70"}`}>
      <CardHeader className="flex items-start justify-between gap-4 p-6 sm:p-8">
        <div>
          <span className={`font-mono text-xs font-bold ${unlocked ? "text-[#d69024]" : "text-[#8d846f]"}`}>{String(level.id).padStart(2, "0")} / 17</span>
          <h2 className={`display-font mt-5 text-3xl leading-none sm:text-4xl ${unlocked ? "text-[#173e37]" : "text-[#756c58]"}`}>{copy.title}</h2>
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
        {level.exercises.map((item) => { const itemCopy = item[language]; const playableHref = playableLessonForExercise[item.id]; return <div key={item.id} className="flex items-start justify-between gap-3 border-t border-[#e2d8be] pt-3"><div className="flex min-w-0 items-start gap-3"><span className="mt-0.5 shrink-0 text-[#a87416]"><ChevronRight size={15} /></span><div><p className="text-sm font-bold text-[#173e37]">{itemCopy.title}</p><p className="mt-1 text-xs leading-5 text-[#756c58]">{itemCopy.goal}</p></div></div>{playableHref && unlocked ? <Link href={playableHref} className="shrink-0 text-[.62rem] font-extrabold uppercase tracking-[.1em] text-[#987019] underline decoration-[#d69024] underline-offset-4">{t("inline_b6adb83e63")}</Link> : null}</div>; })}
      </div>
      {lessonLink && unlocked ? <Link href={lessonLink} className="button-ink mt-7 inline-flex !min-h-10 !px-4">{t("inline_2f76b760cc")}<ArrowUpRight size={15} /></Link> : !unlocked ? <p className="mt-7 flex items-center gap-2 text-xs font-bold text-[#8d846f]"><LockKeyhole size={14} />{language === "fr" ? `Terminez le niveau ${level.prerequisite} pour continuer.` : `Complete level ${level.prerequisite} to continue.`}</p> : null}
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

  useEffect(() => {
    let active = true;
    async function load() {
      const { data: auth } = await supabase.auth.getUser();
      if (!active) return;
      setSignedIn(Boolean(auth.user));
      if (!auth.user) { setLoading(false); return; }
      const { data } = await supabase.from("lesson_progress").select("lesson_id, completed, completed_step").eq("user_id", auth.user.id).limit(100);
      if (active) { setRows((data ?? []) as ProgressRow[]); setLoading(false); }
    }
    load().catch(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const completedLessons = useMemo(() => new Set(rows.filter((row) => row.completed).map((row) => row.lesson_id)), [rows]);
  const completedLevels = useMemo(() => new Set(learningPath.filter((level) => levelCompletion(level, completedLessons) === level.exercises.length).map((level) => `level-${level.id}`)), [completedLessons]);
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

  return <main className="min-h-screen bg-[#f7f0df] px-5 py-10 text-[#173e37] sm:px-8 lg:px-12"><div className="mx-auto max-w-6xl"><div className="flex items-center justify-between"><Link href="/" className="inline-flex items-center gap-2 text-[.7rem] font-extrabold uppercase tracking-[.14em] text-[#987019]"><ArrowLeft size={15} />{t("inline_fa503a5668")}</Link><button type="button" onClick={toggleLanguage} className="border border-[#cbbd99] px-3 py-2 text-[.68rem] font-extrabold uppercase tracking-[.12em] hover:border-[#a87416]" aria-label={t("inline_e0aa42db72")}>{t("inline_43d5c6585d")}</button></div><header className="mt-14 max-w-4xl"><p className="eyebrow">{t("inline_0209d32c54")}</p><h1 className="display-font mt-4 text-6xl leading-[.88] sm:text-8xl">{t("inline_c466d21aa6")}</h1><p className="mt-6 max-w-2xl text-base leading-8 text-[#625d50]">{t("inline_5990220220")}</p></header><section className="mt-10 grid gap-px border border-[#cbbd99] bg-[#cbbd99] sm:grid-cols-3"><div className="bg-[#fffaf0] p-5"><Trophy className="text-[#a87416]" size={18} /><p className="mt-4 font-mono text-3xl font-bold">18</p><p className="mt-2 text-[.65rem] font-extrabold uppercase tracking-[.12em] text-[#756c58]">{t("inline_3f50f56a9d")}</p></div><div className="bg-[#fffaf0] p-5"><BookOpen className="text-[#a87416]" size={18} /><p className="mt-4 font-mono text-3xl font-bold">{learningPath.reduce((total, level) => total + level.exercises.length, 0)}</p><p className="mt-2 text-[.65rem] font-extrabold uppercase tracking-[.12em] text-[#756c58]">{t("inline_5df6582ce4")}</p></div><div className="bg-[#fffaf0] p-5"><CheckCircle2 className="text-[#a87416]" size={18} /><p className="mt-4 font-mono text-3xl font-bold">{loading ? "—" : `${unlockedCount}/18`}</p><p className="mt-2 text-[.65rem] font-extrabold uppercase tracking-[.12em] text-[#756c58]">{t("inline_b00728a93d")}</p></div></section>{!signedIn && !loading && <p className="mt-5 text-sm text-[#756c58]">{t("inline_96ad6ff41d")} <Link href="/account" className="font-bold text-[#987019] underline">{t("inline_b1b675116c")}</Link></p>}<section className="mt-12 space-y-5" aria-label={t("inline_ba27f65ddd")}>{learningPath.map((level) => <LevelCard key={level.id} level={level} language={language} completedLessons={completedLessons} completedLevels={completedLevels} t={t} />)}</section></div></main>;
}
