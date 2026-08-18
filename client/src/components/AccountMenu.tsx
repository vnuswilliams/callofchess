import { useEffect, useState } from "react";
import { Loader2, LogIn, LogOut, Settings2, UserCircle, UserRound } from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";

type AccountMenuProps = {
  className?: string;
};

/** One compact account entry point for authenticated and anonymous users. */
export default function AccountMenu({ className = "" }: AccountMenuProps) {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [hasUser, setHasUser] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (active) setHasUser(Boolean(data.user));
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setHasUser(Boolean(session?.user));
    });
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function signOut() {
    setBusy(true);
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      setBusy(false);
      return;
    }
    setBusy(false);
    setLocation("/");
  }

  if (!hasUser) {
    return <Link href="/account" className={`inline-flex items-center gap-2 text-[.66rem] font-extrabold uppercase tracking-[.11em] text-[#173e37] transition-colors hover:text-[#a87416] ${className}`}><LogIn size={15} aria-hidden="true" />{t("account")}</Link>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" aria-label={t("settings.accountMenu")} className={`inline-flex h-10 items-center gap-2 border border-[#b8aa86] px-3 text-[.66rem] font-extrabold uppercase tracking-[.11em] text-[#173e37] transition-colors hover:border-[#d69024] hover:bg-[#f5ecd7] ${className}`}>
          <UserCircle size={17} aria-hidden="true" />
          <span>{t("settings.accountMenu")}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 border-[#cbbd99] bg-[#fffaf0] p-1 text-[#173e37]">
        <DropdownMenuLabel className="px-3 py-2 text-[.62rem] uppercase tracking-[.14em] text-[#756c58]">{t("settings.accountMenu")}</DropdownMenuLabel>
        <DropdownMenuItem asChild className="gap-3 px-3 py-2.5 focus:bg-[#f5ecd7]">
          <Link href="/profile"><UserRound size={16} aria-hidden="true" />{t("profile")}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="gap-3 px-3 py-2.5 focus:bg-[#f5ecd7]">
          <Link href="/account"><Settings2 size={16} aria-hidden="true" />{t("common.profileNav.account")}</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-[#e0d4b7]" />
        <DropdownMenuItem disabled={busy} onSelect={() => void signOut()} className="gap-3 px-3 py-2.5 focus:bg-[#f5ecd7]">
          {busy ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <LogOut size={16} aria-hidden="true" />}
          {busy ? t("settings.signOutLoading") : t("settings.signOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
