import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, BarChart3, Crown, Loader2, ShieldCheck, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";

type LeaderboardRow = {
  display_name: string;
  completed_lessons: number;
  total_steps: number;
  score: number;
  rank: number;
};

export default function Leaderboard() {
  const { language, toggleLanguage, t } = useLanguage();
  const fr = language === "fr";
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      const { data, error } = await supabase.rpc("get_public_leaderboard", { p_limit: 50 });
      if (!active) return;
      if (error || !Array.isArray(data)) {
        setAvailable(false);
        setRows([]);
      } else {
        setRows(data as LeaderboardRow[]);
      }
      setLoading(false);
    }
    void load();
    return () => { active = false; };
  }, []);

  return <main className="min-h-screen bg-[#f7f0df] px-5 py-10 text-[#173e37] sm:px-8 lg:px-12">
    <div className="mx-auto flex max-w-6xl items-center justify-between">
      <Link href="/profile" className="inline-flex items-center gap-2 text-[.7rem] font-extrabold uppercase tracking-[.14em] text-[#987019]"><ArrowLeft size={14} /> {t("inline_15df63a1c9")}</Link>
      <button type="button" onClick={toggleLanguage} className="border border-[#cbbd99] px-3 py-2 text-[.68rem] font-extrabold uppercase tracking-[.12em]" aria-label={t("inline_e0aa42db72")}>{t("inline_43d5c6585d")}</button>
    </div>
    <div className="mx-auto mt-14 max-w-6xl">
      <p className="eyebrow">{t("inline_dbb50f2603")}</p>
      <h1 className="display-font mt-3 text-6xl leading-[.9] sm:text-7xl">{t("inline_c81cb69b4c")}</h1>
      <p className="mt-5 max-w-2xl leading-7 text-[#625d50]">{t("inline_a18871129e")}</p>
      <div className="mt-10 flex items-center gap-3 border border-[#cbbd99] bg-[#fffaf0] p-4 text-sm text-[#625d50]"><ShieldCheck size={18} className="shrink-0 text-[#a87416]" />{t("inline_22829755d7")}</div>
      {loading ? <div className="mt-12 flex items-center gap-3 border border-[#cbbd99] bg-[#fffaf0] p-8" role="status" aria-live="polite"><Loader2 className="animate-spin text-[#a87416]" size={20} />{t("inline_2f84b02e11")}</div> : !available || rows.length === 0 ? <section className="mt-12 border border-dashed border-[#bcae88] bg-[#fffaf0] p-8 sm:p-12"><Trophy className="text-[#a87416]" size={28} /><h2 className="display-font mt-5 text-4xl">{t("inline_d4747b9189")}</h2><p className="mt-4 max-w-xl leading-7 text-[#625d50]">{t("inline_c6c7ba97a1")}</p><Link href="/profile"><Button className="mt-7 rounded-[.65rem] bg-[#173e37] text-[#fffaf0] hover:bg-[#285448]"><BarChart3 size={16} />{t("inline_2b8c72bb14")}</Button></Link></section> : <section className="mt-12 overflow-hidden border border-[#cbbd99] bg-[#fffaf0]"><div className="grid grid-cols-[3rem_1fr_auto] gap-4 border-b border-[#cbbd99] bg-[#173e37] px-5 py-4 text-[.66rem] font-extrabold uppercase tracking-[.12em] text-[#fffaf0]"><span>#</span><span>{t("inline_eb5697f57a")}</span><span>{t("inline_a3b593a53d")}</span></div><div>{rows.map((row) => <div key={`${row.rank}-${row.display_name}`} className="grid grid-cols-[3rem_1fr_auto] items-center gap-4 border-b border-[#e7ddc4] px-5 py-5 last:border-0"><span className={`font-mono text-sm ${row.rank <= 3 ? "text-[#a87416]" : "text-[#756c58]"}`}>{row.rank <= 3 ? <Crown size={17} aria-label={`Top ${row.rank}`} /> : row.rank}</span><div><p className="font-bold">{row.display_name}</p><p className="mt-1 text-xs text-[#756c58]">{row.completed_lessons} {t("inline_d3f7f446fe")} {row.total_steps} {t("inline_9afbb5add9")}</p></div><strong className="font-mono text-lg text-[#a87416]">{row.score}</strong></div>)}</div></section>}
    </div>
  </main>;
}
