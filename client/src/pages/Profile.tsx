import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { BarChart3, BookOpen, CalendarDays, CheckCircle2, Clock3, LogIn, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
import { computeProfileStats } from "@/lib/profileStats";

type ProgressRow = {
  lesson_id: string;
  completed_step: number;
  completed: boolean;
  updated_at: string;
};

type SessionUser = { id: string; email?: string | null };

const lessonNames: Record<string, { fr: string; en: string }> = {
  "1": { fr: "Le centre", en: "The center" },
  "2": { fr: "Le développement", en: "Development" },
  "3": { fr: "La sécurité du roi", en: "King safety" },
};

function lessonName(id: string, language: "fr" | "en") {
  return lessonNames[id]?.[language] ?? `${language === "fr" ? "Leçon" : "Lesson"} ${id}`;
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return <article className="border border-[#cbbd99] bg-[#fffaf0] p-5"><div className="flex items-center justify-between text-[#a87416]"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#f0dfb9]">{icon}</span><span className="font-mono text-3xl font-bold text-[#173e37]">{value}</span></div><p className="mt-4 text-[.65rem] font-extrabold uppercase tracking-[.12em] text-[#756c58]">{label}</p></article>;
}

export default function Profile() {
  const { language, toggleLanguage } = useLanguage();
  const fr = language === "fr";
  const [user, setUser] = useState<SessionUser | null>(null);
  const [rows, setRows] = useState<ProgressRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError(false);
      const { data: auth } = await supabase.auth.getUser();
      if (!active) return;
      if (!auth.user) { setLoading(false); return; }
      setUser({ id: auth.user.id, email: auth.user.email });
      const { data, error: progressError } = await supabase.from("lesson_progress").select("lesson_id, completed_step, completed, updated_at").eq("user_id", auth.user.id).order("updated_at", { ascending: false }).limit(30);
      if (!active) return;
      if (progressError) setError(true); else setRows((data ?? []) as ProgressRow[]);
      setLoading(false);
    }
    load().catch(() => { if (active) { setError(true); setLoading(false); } });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => { if (active && session?.user) setUser({ id: session.user.id, email: session.user.email }); });
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, []);

  const stats = useMemo(() => computeProfileStats(rows), [rows]);

  return <main className="min-h-screen bg-[#f7f0df] px-5 py-10 text-[#173e37] sm:px-8 lg:px-12"><div className="mx-auto flex max-w-6xl items-center justify-between"><Link href="/compte" className="text-[.7rem] font-extrabold uppercase tracking-[.14em] text-[#987019]">← {fr ? "Retour au compte" : "Back to account"}</Link><button type="button" onClick={toggleLanguage} className="border border-[#cbbd99] px-3 py-2 text-[.68rem] font-extrabold uppercase tracking-[.12em] hover:border-[#a87416]" aria-label={fr ? "Passer en anglais" : "Switch to French"}>{fr ? "EN" : "FR"}</button></div><div className="mx-auto mt-14 max-w-6xl"><p className="eyebrow">{fr ? "Votre espace" : "Your space"}</p><div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><h1 className="display-font text-6xl leading-[.9] sm:text-7xl">{fr ? "Votre profil." : "Your profile."}</h1><p className="mt-5 max-w-xl text-[#625d50]">{user?.email ?? (fr ? "Retrouvez votre parcours et vos repères de jeu." : "Review your journey and your playing markers.")}</p></div>{user && <Link href="/compte"><Button className="rounded-none bg-[#173e37] text-[#fffaf0] hover:bg-[#285448]">{fr ? "Gérer le compte" : "Manage account"}</Button></Link>}</div>{loading ? <section className="mt-12 border border-[#cbbd99] bg-[#fffaf0] p-8" aria-live="polite"><div className="h-3 w-40 animate-pulse bg-[#e5d7b5]" /><div className="mt-5 h-3 w-64 animate-pulse bg-[#e5d7b5]" /><p className="mt-6 text-sm text-[#756c58]">{fr ? "Chargement de votre parcours…" : "Loading your journey…"}</p></section> : !user ? <section className="mt-12 border border-[#cbbd99] bg-[#fffaf0] p-8 sm:p-12"><LogIn className="text-[#a87416]" /><h2 className="display-font mt-5 text-4xl">{fr ? "Ouvrez votre espace personnel." : "Open your personal space."}</h2><p className="mt-4 max-w-lg leading-7 text-[#625d50]">{fr ? "Connectez-vous pour retrouver vos sessions d’entraînement et vos statistiques. Votre historique reste privé." : "Sign in to review your practice sessions and statistics. Your history stays private."}</p><Link href="/compte"><Button className="mt-7 rounded-none bg-[#d69024] text-[#173e37] hover:bg-[#e7ba61]"><LogIn size={16} />{fr ? "Se connecter" : "Sign in"}</Button></Link></section> : <><section className="mt-12 grid gap-px border border-[#cbbd99] bg-[#cbbd99] sm:grid-cols-3"><StatCard icon={<Trophy size={17} />} label={fr ? "Leçons terminées" : "Lessons completed"} value={stats.completed} /><StatCard icon={<BookOpen size={17} />} label={fr ? "Leçons commencées" : "Lessons started"} value={stats.activeLessons} /><StatCard icon={<BarChart3 size={17} />} label={fr ? "Étapes validées" : "Steps completed"} value={stats.totalSteps} /></section><section className="mt-12"><div className="flex items-end justify-between gap-4"><div><p className="eyebrow">{fr ? "Vos sessions" : "Your sessions"}</p><h2 className="display-font mt-3 text-4xl">{fr ? "Historique d’entraînement" : "Practice history"}</h2></div><span className="hidden text-xs text-[#756c58] sm:block">{fr ? "Données privées" : "Private data"}</span></div>{error ? <div className="mt-6 border border-[#d6a16b] bg-[#fff1dc] p-6 text-sm text-[#6a4c25]" role="alert">{fr ? "Votre historique ne peut pas être chargé pour le moment. Réessayez plus tard." : "Your history cannot be loaded right now. Please try again later."}</div> : rows.length === 0 ? <div className="mt-6 border border-dashed border-[#bcae88] bg-[#fffaf0] p-8"><Clock3 className="text-[#a87416]" /><h3 className="display-font mt-4 text-3xl">{fr ? "Votre première session vous attend." : "Your first session is waiting."}</h3><p className="mt-3 text-sm leading-6 text-[#625d50]">{fr ? "Commencez une leçon pour voir apparaître votre progression ici." : "Start a lesson to see your progress appear here."}</p><Link href="/lecon/1"><Button className="mt-6 rounded-none bg-[#173e37] text-[#fffaf0] hover:bg-[#285448]"><BookOpen size={16} />{fr ? "Commencer une leçon" : "Start a lesson"}</Button></Link></div> : <div className="mt-6 space-y-2">{rows.map((row) => <article key={`${row.lesson_id}-${row.updated_at}`} className="flex flex-col gap-3 border border-[#cbbd99] bg-[#fffaf0] p-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-4"><span className={`mt-1 grid h-8 w-8 place-items-center rounded-full ${row.completed ? "bg-[#d69024] text-[#173e37]" : "bg-[#e7e0c9] text-[#756c58]"}`}>{row.completed ? <CheckCircle2 size={16} /> : <Clock3 size={16} />}</span><div><h3 className="font-bold text-[#173e37]">{lessonName(row.lesson_id, language)}</h3><p className="mt-1 text-sm text-[#756c58]">{row.completed ? (fr ? "Leçon terminée" : "Lesson completed") : (fr ? `${row.completed_step} étape${row.completed_step > 1 ? "s" : ""} validée${row.completed_step > 1 ? "s" : ""}` : `${row.completed_step} step${row.completed_step > 1 ? "s" : ""} completed`)}</p></div></div><time className="text-xs text-[#756c58]" dateTime={row.updated_at}>{new Date(row.updated_at).toLocaleDateString(fr ? "fr-FR" : "en-US", { day: "numeric", month: "short", year: "numeric" })}</time></article>)}</div>}</section></>}</div></main>;
}
