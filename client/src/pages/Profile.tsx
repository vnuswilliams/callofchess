import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { Award, BarChart3, BookOpen, Check, CheckCircle2, Clock3, Copy, LockKeyhole, LogIn, Share2, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
import { computeProfileStats } from "@/lib/profileStats";
import { computeProfileBadges, type ProfileBadge } from "@/lib/profileBadges";

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
  const [shareState, setShareState] = useState<"idle" | "copied" | "shared" | "error">("idle");
  const [newBadge, setNewBadge] = useState<ProfileBadge | null>(null);

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
  const badges = useMemo(() => computeProfileBadges(rows), [rows]);
  const featuredBadge = badges.find((badge) => badge.unlocked) ?? badges[0];

  // Compare only badge ids saved on this device; the server remains the source of truth.
  useEffect(() => {
    if (!user || loading) return;
    const key = `echequier:seen-badges:${user.id}`;
    const unlocked = badges.filter((badge) => badge.unlocked).map((badge) => badge.id);
    const previous = localStorage.getItem(key);
    if (previous) {
      try {
        const seen = new Set(JSON.parse(previous) as string[]);
        const justUnlocked = badges.find((badge) => badge.unlocked && !seen.has(badge.id));
        if (justUnlocked) setNewBadge(justUnlocked);
      } catch {
        localStorage.removeItem(key);
      }
    }
    localStorage.setItem(key, JSON.stringify(unlocked));
  }, [badges, loading, user]);

  useEffect(() => {
    const title = fr ? "Mon parcours Échiquier" : "My Échiquier journey";
    const description = fr ? "Suivez votre progression aux échecs, une leçon à la fois." : "Track your chess progress, one lesson at a time.";
    document.title = `${title} — Échiquier`;
    const tags = [{ name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "twitter:title", content: title }, { property: "twitter:description", content: description }];
    const previous = tags.map((tag) => { const selector = tag.name ? `meta[name="${tag.name}"]` : `meta[property="${tag.property}"]`; const element = document.querySelector(selector) as HTMLMetaElement | null; return { element, content: element?.content }; });
    tags.forEach((tag) => { const selector = tag.name ? `meta[name="${tag.name}"]` : `meta[property="${tag.property}"]`; const element = document.querySelector(selector) as HTMLMetaElement | null; if (element) element.content = tag.content; });
    return () => { document.title = "Échiquier — Apprendre les échecs simplement"; previous.forEach(({ element, content }) => { if (element && content !== undefined) element.content = content; }); };
  }, [fr]);

  async function shareProfile() {
    const shareUrl = `${window.location.origin}/profil`;
    const shareData = { title: fr ? "Mon parcours Échiquier" : "My Échiquier journey", text: fr ? "Je progresse aux échecs avec Échiquier." : "I’m improving my chess with Échiquier.", url: shareUrl };
    try {
      if (navigator.share) { await navigator.share(shareData); setShareState("shared"); }
      else { await navigator.clipboard.writeText(shareUrl); setShareState("copied"); }
    } catch (shareError) {
      if (shareError instanceof DOMException && shareError.name === "AbortError") return;
      setShareState("error");
    }
  }

  async function copyProfileLink() {
    try { await navigator.clipboard.writeText(`${window.location.origin}/profil`); setShareState("copied"); } catch { setShareState("error"); }
  }

  async function shareBadge() {
    if (!featuredBadge) return;
    const copy = fr ? featuredBadge.fr : featuredBadge.en;
    const url = `${window.location.origin}/profil?badge=${featuredBadge.id}`;
    try {
      const shareApi = (navigator as Navigator & { share?: (data: ShareData) => Promise<void> }).share;
      const canShare = typeof shareApi === "function";
      if (canShare) await shareApi({ title: copy.title, text: copy.description, url });
      else await navigator.clipboard.writeText(url);
      setShareState(canShare ? "shared" : "copied");
    } catch { setShareState("error"); }
  }

  return <main className="min-h-screen bg-[#f7f0df] px-5 py-10 text-[#173e37] sm:px-8 lg:px-12"><div className="mx-auto flex max-w-6xl items-center justify-between"><Link href="/compte" className="text-[.7rem] font-extrabold uppercase tracking-[.14em] text-[#987019]">← {fr ? "Retour au compte" : "Back to account"}</Link><button type="button" onClick={toggleLanguage} className="border border-[#cbbd99] px-3 py-2 text-[.68rem] font-extrabold uppercase tracking-[.12em] hover:border-[#a87416]" aria-label={fr ? "Passer en anglais" : "Switch to French"}>{fr ? "EN" : "FR"}</button></div><div className="mx-auto mt-14 max-w-6xl"><p className="eyebrow">{fr ? "Votre espace" : "Your space"}</p><div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><h1 className="display-font text-6xl leading-[.9] sm:text-7xl">{fr ? "Votre profil." : "Your profile."}</h1><p className="mt-5 max-w-xl text-[#625d50]">{user?.email ?? (fr ? "Retrouvez votre parcours et vos repères de jeu." : "Review your journey and your playing markers.")}</p></div>{user && <div className="flex flex-wrap gap-3"><Link href="/classement"><Button variant="outline" className="rounded-none border-[#173e37] text-[#173e37] hover:bg-[#e9dfc4]"><Trophy size={16} />{fr ? "Classement" : "Leaderboard"}</Button></Link><Link href="/compte"><Button className="rounded-none bg-[#173e37] text-[#fffaf0] hover:bg-[#285448]">{fr ? "Gérer le compte" : "Manage account"}</Button></Link></div>}</div>{loading ? <section className="mt-12 border border-[#cbbd99] bg-[#fffaf0] p-8" aria-live="polite"><div className="h-3 w-40 animate-pulse bg-[#e5d7b5]" /><div className="mt-5 h-3 w-64 animate-pulse bg-[#e5d7b5]" /><p className="mt-6 text-sm text-[#756c58]">{fr ? "Chargement de votre parcours…" : "Loading your journey…"}</p></section> : !user ? <section className="mt-12 border border-[#cbbd99] bg-[#fffaf0] p-8 sm:p-12"><LogIn className="text-[#a87416]" /><h2 className="display-font mt-5 text-4xl">{fr ? "Ouvrez votre espace personnel." : "Open your personal space."}</h2><p className="mt-4 max-w-lg leading-7 text-[#625d50]">{fr ? "Connectez-vous pour retrouver vos sessions d’entraînement et vos statistiques. Votre historique reste privé." : "Sign in to review your practice sessions and statistics. Your history stays private."}</p><Link href="/compte"><Button className="mt-7 rounded-none bg-[#d69024] text-[#173e37] hover:bg-[#e7ba61]"><LogIn size={16} />{fr ? "Se connecter" : "Sign in"}</Button></Link></section> : <><>{newBadge && <div className="badge-pop-in fixed inset-x-4 top-5 z-50 mx-auto flex max-w-lg items-center gap-4 border border-[#d69024] bg-[#173e37] p-4 text-[#fffaf0] shadow-2xl" role="status" aria-live="polite"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#d69024] text-2xl text-[#173e37]" aria-hidden="true">{newBadge.icon}</span><div className="min-w-0 flex-1"><p className="text-[.62rem] font-extrabold uppercase tracking-[.16em] text-[#e6b95e]">{fr ? "Nouveau succès" : "New achievement"}</p><p className="display-font mt-1 truncate text-2xl">{(fr ? newBadge.fr : newBadge.en).title}</p></div><button type="button" onClick={() => setNewBadge(null)} className="grid h-9 w-9 shrink-0 place-items-center border border-[#66857c] text-xl hover:bg-[#285448]" aria-label={fr ? "Fermer la notification" : "Close notification"}>×</button></div>}</><section className="mt-12 grid gap-px border border-[#cbbd99] bg-[#cbbd99] sm:grid-cols-2 lg:grid-cols-5"><StatCard icon={<Trophy size={17} />} label={fr ? "Leçons terminées" : "Lessons completed"} value={stats.completed} /><StatCard icon={<BookOpen size={17} />} label={fr ? "Leçons commencées" : "Lessons started"} value={stats.activeLessons} /><StatCard icon={<BarChart3 size={17} />} label={fr ? "Étapes validées" : "Steps completed"} value={stats.totalSteps} /><StatCard icon={<CheckCircle2 size={17} />} label={fr ? "Taux de complétion" : "Completion rate"} value={`${stats.completionRate}%`} /><StatCard icon={<Clock3 size={17} />} label={fr ? "Étapes moyennes" : "Average steps"} value={stats.averageSteps} /></section><section className="mt-12"><div className="flex items-end justify-between gap-4"><div><p className="eyebrow">{fr ? "Vos réussites" : "Your achievements"}</p><h2 className="display-font mt-3 text-4xl">{fr ? "Badges débloqués" : "Badges unlocked"}</h2></div><span className="text-xs text-[#756c58]">{badges.filter((badge) => badge.unlocked).length}/{badges.length}</span></div><div className="mt-6 grid gap-3 md:grid-cols-3">{badges.map((badge) => { const copy = fr ? badge.fr : badge.en; const width = Math.min(100, Math.round((badge.completed / badge.target) * 100)); return <article key={badge.id} className={`relative overflow-hidden border p-5 transition-colors ${badge.unlocked ? "border-[#d69024] bg-[#fffaf0]" : "border-[#d7ccb0] bg-[#eee8d8]/70"}`} aria-label={`${copy.title}: ${badge.unlocked ? (fr ? "débloqué" : "unlocked") : (fr ? "verrouillé" : "locked")}`}><div className="flex items-start justify-between gap-3"><span className={`grid h-12 w-12 place-items-center rounded-full text-2xl ${badge.unlocked ? "bg-[#d69024] text-[#173e37]" : "bg-[#ddd4bc] text-[#8d846f] grayscale"}`}>{badge.icon}</span>{badge.unlocked ? <Award size={18} className="text-[#a87416]" aria-hidden="true" /> : <LockKeyhole size={17} className="text-[#8d846f]" aria-hidden="true" />}</div><h3 className={`mt-5 font-bold ${badge.unlocked ? "text-[#173e37]" : "text-[#756c58]"}`}>{copy.title}</h3><p className="mt-2 min-h-10 text-sm leading-5 text-[#756c58]">{copy.description}</p><div className="mt-4" aria-label={`${badge.completed} of ${badge.target}`}><div className="flex justify-between text-[.65rem] font-bold uppercase tracking-[.1em] text-[#8d846f]"><span>{badge.unlocked ? (fr ? "Obtenu" : "Earned") : (fr ? "En progression" : "In progress")}</span><span>{Math.min(badge.completed, badge.target)}/{badge.target}</span></div><div className="mt-2 h-1.5 bg-[#e2dac5]"><div className={`h-full transition-all duration-500 ${badge.unlocked ? "bg-[#d69024]" : "bg-[#a89d83]"}`} style={{ width: `${width}%` }} /></div></div></article>; })}</div></section><section className="mt-12 border border-[#cbbd99] bg-[#fffaf0] p-6 sm:p-8"><div className="flex items-end justify-between gap-4"><div><p className="eyebrow">{fr ? "Votre rythme" : "Your rhythm"}</p><h2 className="display-font mt-3 text-4xl">{fr ? "Progression par leçon" : "Progress by lesson"}</h2></div><span className="text-xs text-[#756c58]">{stats.completionRate}%</span></div><div className="mt-8 space-y-5">{stats.recentActivity.map((activity) => { const maxSteps = Math.max(1, activity.lessonId === "1" ? 2 : activity.lessonId === "2" ? 3 : 4); const width = Math.min(100, Math.round((activity.steps / maxSteps) * 100)); return <div key={activity.lessonId}><div className="flex items-center justify-between text-sm font-semibold"><span>{lessonName(activity.lessonId, language)}</span><span className="font-mono text-xs text-[#756c58]">{activity.steps}/{maxSteps}</span></div><div className="mt-2 h-2 bg-[#e7e0c9]"><div className="h-full bg-[#d69024] transition-all duration-500" style={{ width: `${width}%` }} /></div></div>; })}</div></section><section className="mt-12 overflow-hidden border border-[#173e37] bg-[#173e37] text-[#fffaf0]"><div className="grid gap-0 lg:grid-cols-[1.2fr_.8fr]"><div className="p-6 sm:p-8"><div className="flex items-center gap-2 text-[#e6b95e]"><Share2 size={17} /><span className="eyebrow !text-[#e6b95e]">{fr ? "Partager votre élan" : "Share your momentum"}</span></div><h2 className="display-font mt-4 max-w-xl text-4xl leading-none sm:text-5xl">{fr ? "Votre prochain coup mérite d’être partagé." : "Your next move is worth sharing."}</h2><p className="mt-4 max-w-lg text-sm leading-6 text-[#d2d8ca]">{fr ? "Partagez votre parcours Échiquier avec un lien public qui ne révèle aucune information personnelle." : "Share your Échiquier journey with a public link that reveals no personal information."}</p><div className="mt-7 flex flex-wrap gap-3"><Button onClick={shareProfile} className="rounded-none bg-[#d69024] text-[#173e37] hover:bg-[#e7ba61]"><Share2 size={16} />{fr ? "Partager" : "Share"}</Button><Button onClick={shareBadge} variant="outline" className="rounded-none border-[#66857c] bg-transparent text-[#fffaf0] hover:bg-[#285448]"><Award size={16} />{fr ? "Partager un badge" : "Share a badge"}</Button><Button variant="outline" onClick={copyProfileLink} className="rounded-none border-[#66857c] bg-transparent text-[#fffaf0] hover:bg-[#285448]">{shareState === "copied" ? <Check size={16} /> : <Copy size={16} />}{shareState === "copied" ? (fr ? "Lien copié" : "Link copied") : (fr ? "Copier le lien" : "Copy link")}</Button></div>{shareState === "shared" && <p className="mt-4 text-sm text-[#e6b95e]" role="status">{fr ? "Partage prêt." : "Ready to share."}</p>}{shareState === "error" && <p className="mt-4 text-sm text-[#f3c7a1]" role="alert">{fr ? "Le partage n’est pas disponible sur cet appareil." : "Sharing is not available on this device."}</p>}</div><div className="relative min-h-48 overflow-hidden bg-[#245449] p-6"><div className="absolute -right-12 -top-12 h-48 w-48 rounded-full border-[18px] border-[#d69024]/30" /><div className="absolute bottom-5 right-6 text-right"><p className="font-mono text-xs uppercase tracking-[.16em] text-[#a8bbb0]">ÉCHIQUIER</p><p className="font-mono text-xs uppercase tracking-[.16em] text-[#e6b95e]">{featuredBadge ? (fr ? featuredBadge.fr.title : featuredBadge.en.title) : "Échiquier"}</p><p className="display-font mt-2 text-3xl text-[#fffaf0]">{fr ? "Un coup à la fois." : "One move at a time."}</p></div><div className="absolute left-6 top-6 grid grid-cols-4 gap-0 border border-[#d69024]/50">{Array.from({ length: 16 }, (_, index) => <span key={index} className={`h-7 w-7 sm:h-9 sm:w-9 ${index % 2 === Math.floor(index / 4) % 2 ? "bg-[#f0dfb9]" : "bg-[#173e37]"}`} />)}</div></div></div></section><section className="mt-12"><div className="flex items-end justify-between gap-4"><div><p className="eyebrow">{fr ? "Vos sessions" : "Your sessions"}</p><h2 className="display-font mt-3 text-4xl">{fr ? "Historique d’entraînement" : "Practice history"}</h2></div><span className="hidden text-xs text-[#756c58] sm:block">{fr ? "Données privées" : "Private data"}</span></div>{error ? <div className="mt-6 border border-[#d6a16b] bg-[#fff1dc] p-6 text-sm text-[#6a4c25]" role="alert">{fr ? "Votre historique ne peut pas être chargé pour le moment. Réessayez plus tard." : "Your history cannot be loaded right now. Please try again later."}</div> : rows.length === 0 ? <div className="mt-6 border border-dashed border-[#bcae88] bg-[#fffaf0] p-8"><Clock3 className="text-[#a87416]" /><h3 className="display-font mt-4 text-3xl">{fr ? "Votre première session vous attend." : "Your first session is waiting."}</h3><p className="mt-3 text-sm leading-6 text-[#625d50]">{fr ? "Commencez une leçon pour voir apparaître votre progression ici." : "Start a lesson to see your progress appear here."}</p><Link href="/lecon/1"><Button className="mt-6 rounded-none bg-[#173e37] text-[#fffaf0] hover:bg-[#285448]"><BookOpen size={16} />{fr ? "Commencer une leçon" : "Start a lesson"}</Button></Link></div> : <div className="mt-6 space-y-2">{rows.map((row) => <article key={`${row.lesson_id}-${row.updated_at}`} className="flex flex-col gap-3 border border-[#cbbd99] bg-[#fffaf0] p-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-4"><span className={`mt-1 grid h-8 w-8 place-items-center rounded-full ${row.completed ? "bg-[#d69024] text-[#173e37]" : "bg-[#e7e0c9] text-[#756c58]"}`}>{row.completed ? <CheckCircle2 size={16} /> : <Clock3 size={16} />}</span><div><h3 className="font-bold text-[#173e37]">{lessonName(row.lesson_id, language)}</h3><p className="mt-1 text-sm text-[#756c58]">{row.completed ? (fr ? "Leçon terminée" : "Lesson completed") : (fr ? `${row.completed_step} étape${row.completed_step > 1 ? "s" : ""} validée${row.completed_step > 1 ? "s" : ""}` : `${row.completed_step} step${row.completed_step > 1 ? "s" : ""} completed`)}</p></div></div><time className="text-xs text-[#756c58]" dateTime={row.updated_at}>{new Date(row.updated_at).toLocaleDateString(fr ? "fr-FR" : "en-US", { day: "numeric", month: "short", year: "numeric" })}</time></article>)}</div>}</section></>}</div></main>;
}
